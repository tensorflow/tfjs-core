/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ConvInfo2D, ConvInfoND} from '../conv_util';

import {GPGPUProgram} from './gpgpu_math';

export class PoolNDProgram implements GPGPUProgram {
  variableNames = ['x'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;
  rank: number;
  ivecN: string;  // the type of an index; ivec2, ivec3 for rank 2, 3; int
                  // for rank 1.

  zerozeroNSnippet(N: number) {
    // Code snippet to return vector (0, 0, N) of appropriate rank.
    // Used to get adjacent elements to grab batches of 4 for GPU optmization.
    const contents = Array(this.rank - 1).fill(0);
    contents.push(N);
    const contentsStr = contents.join(', ');
    return `${this.ivecN}(${contentsStr})`
  }

  outsideRangeSnippet(index: string, range: string) {
    // Code snippet to see if the index is less than range and greater than zero
    // for the appropriate rank.
    if (this.rank === 1) {
      return `(${index} >= ${range}) || (${index} < 0)`;
    } else {
      return `any(greaterThanEqual(${index}, ${range})) ||
              any(lessThan(${index}, zero))`;
    }
  }

  constructor(
      convInfo: ConvInfoND, poolType: 'max'|'min'|'avg',
      computePositions: boolean) {
    if (poolType === 'avg' && computePositions) {
      throw new Error('Cannot compute positions for average pool.');
    }
    // convInfo has the full rank of the tensor; in practice the last dimension
    // is a depth dimension. For example an image tensor has rank 3 (x, y, chan)
    // But an image convolution we call a 2D conv (rank = 2).
    this.rank = convInfo.rank - 1;

    this.ivecN = this.rank === 1 ? 'int' : `ivec${this.rank}`;
    const startPads = convInfo.padInfo.map((pad) => pad.start);
    // TODO(dfarhi) Why isn't the filter in the params?
    this.params = [convInfo.stride, startPads, poolType, computePositions];
    this.outputShape = convInfo.outShape;

    if (computePositions) {
      this.userCode = this.computePositionsCode(poolType, convInfo, startPads);
    } else {
      this.userCode = this.mainCode(poolType, convInfo, startPads);
    }
  }

  computePositionsCode(
      poolType: string, convInfo: ConvInfoND, startPads: number[]): string {
    if (this.rank != 2) {
      throw Error('computePositions Not Implemented for PoolND yet.');
      // TODO(dfarhi) Make work for 1D, 3D.
    }
    const ivecN = this.ivecN;
    const compareOp = poolType === 'min' ? '<=' : '>=';

    return `
      // TODO merge this code with the main code.
      const ${ivecN} strides = ${ivecN}(${arrayCodeString(convInfo.stride)});
      const ${ivecN} pads = ${ivecN}(${arrayCodeString(startPads)});


      void main() {
        ivec${this.rank + 1} coords = getOutputCoords();
        int d = coords[${this.rank}];

        ivec2 xCorner = coords.xy * strides - pads;
        int xRCorner = xCorner.x;
        int xCCorner = xCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        float minMaxValue = 0.0;
        float minMaxValueFound = 0.0;
        int minMaxPosition = 0;

        for (int wR = 0; wR < ${convInfo.filter[0]}; wR++) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${convInfo.inShape[0]}) {
            continue;
          }

          for (int wC = 0; wC < ${convInfo.filter[1]}; wC++) {
            int xC = xCCorner + wC;

            if (xC < 0 || xC >= ${convInfo.inShape[1]}) {
              continue;
            }

            float value = getX(xR, xC, d);

            if (isNaN(value)) {
              setOutput(value);
              return;
            }

            // If a min / max value has already been found, use it. If not,
            // use the current value.
            float currMinMaxValue = mix(
                value, minMaxValue, minMaxValueFound);
            if (value ${compareOp} currMinMaxValue) {
              minMaxValue = value;
              minMaxValueFound = 1.0;
              minMaxPosition = wR * ${convInfo.filter[1]} + wC;
            }
          }
        }
        setOutput(float(minMaxPosition));
      }
      `;
  }



  mainCode(poolType: string, convInfo: ConvInfoND, startPads: number[]):
      string {
    const ivecN = this.ivecN;  // For legibility.
    const isAvgPool = poolType === 'avg';
    const compareOp = poolType === 'min' ? 'min' : 'max';
    let initializationValue: string;

    if (poolType === 'min') {
      initializationValue = '1.0 / 0.0';
    } else if (poolType === 'max') {
      initializationValue = '-1.0 / 0.0';
    } else if (poolType === 'avg') {
      initializationValue = '-0.0';
    }

    let returnValue: string;
    if (isAvgPool) {
      returnValue = `avgValue / ${product(convInfo.filter)}.0`;
    } else {
      returnValue = `${compareOp}(${compareOp}(${compareOp}(` +
          'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    }

    // This string is like:
    //   for (int w0 = 0; w0 < {filter0}; w0++) {
    //     for (int w1 = 0; w1 < {filter1}; w1++) {
    //       ...
    // Except the last index jumps by 4 at a time for batching.
    const filterNoDepth = convInfo.filter.slice(0, convInfo.filter.length - 1)
    // "w0, w1, w2"
    const w0w1w2 = arrayCodeString(
        filterNoDepth.map((_: number, index: number) => 'w' + index), false);
    const forAllOffsetVectors =
        filterNoDepth
            .map((value: number, index: number) => {
              const incrementer = index === (filterNoDepth.length - 1) ?
                  `w${index} += 4` :
                  `w${index}++`;
              return `for (int w${index} = 0; w${index} < ${
                  convInfo.filter[index]}; ${incrementer}) {`
            })
            .join('') +
        `
            ${ivecN} offset = ${ivecN}(${w0w1w2});
            `;
    const endForAllOffsetVectors = filterNoDepth.map(() => '}').join('');

    const initParams = `
      const vec4 ones = vec4(1.0);
      const ${ivecN} zero = ${ivecN}(0.0);
      const ${ivecN} xShape = ${ivecN}(${arrayCodeString(convInfo.inShape)});
      const ${ivecN} filter = ${ivecN}(${arrayCodeString(convInfo.filter)});
      const ${ivecN} strides = ${ivecN}(${arrayCodeString(convInfo.stride)});
      const ${ivecN} pads = ${ivecN}(${arrayCodeString(startPads)});
      const float initializationValue = ${initializationValue};
    `;

    const getBatch = `
      float getValue(${ivecN} xCorner, ${ivecN} offset, int d) {
        // Return the value from x at position offset from xCorner by a certain amount.
        // If the offsets are outside the filter range (because we grab batches of
        // 4 values at a time), ignore it.
        if (${this.outsideRangeSnippet('offset', 'filter')}) {
          return initializationValue;
        }
        ${ivecN} xPos = xCorner + offset;
        // If the offsets put us outside the original image, ignore it.
        if (${this.outsideRangeSnippet('xPos', 'xShape')}) {
          return initializationValue;
        }
        return getX(ivec${this.rank + 1}(xPos, d));
      }

      vec4 getBatch(${ivecN} xCorner, ${ivecN} offset, int d) {
        return vec4(
          getValue(xCorner, offset, d),
          getValue(xCorner, offset + ${this.zerozeroNSnippet(1)}, d),
          getValue(xCorner, offset + ${this.zerozeroNSnippet(2)}, d),
          getValue(xCorner, offset + ${this.zerozeroNSnippet(3)}, d)
        );
      }
    `;

    const main = `
      void main() {
        ivec${this.rank + 1} coords = getOutputCoords();
        int d = coords[${this.rank}];

        // coords has length (rank + 1) because it includes the depth.
        // We can slice it by casting; casting a high-dim vector to a lower
        // dim just reads the first few coordinates.
        ${ivecN} xCorner = ${ivecN}(coords) * strides - pads;

        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;
        ${forAllOffsetVectors}
          vec4 values = getBatch(xCorner, offset, d);

          if (hasNaN(values)) {
            setOutput(getNaN(values));
            return;
          }
          if (${isAvgPool}) {
            avgValue += dot(values, ones);
          } else {
            minMaxValue = ${compareOp}(values, minMaxValue);
          }
        ${endForAllOffsetVectors}
        setOutput(${returnValue});
      }
    `;

    return initParams + getBatch + main;
  }
}

export class Pool2DProgram extends PoolNDProgram {
  constructor(
      convInfo2D: ConvInfo2D, poolType: 'max'|'min'|'avg',
      computePositions: boolean) {
    const convInfoND: ConvInfoND = {
      rank: 3,
      inShape: convInfo2D.inShape,
      outShape: convInfo2D.outShape,
      padInfo: [
        {start: convInfo2D.padInfo.top, end: convInfo2D.padInfo.bottom},
        {start: convInfo2D.padInfo.left, end: convInfo2D.padInfo.right},
        {start: 0, end: 0}
      ],
      stride: [convInfo2D.strideHeight, convInfo2D.strideWidth, 1],
      filter: [convInfo2D.filterHeight, convInfo2D.filterWidth, 1],
    };
    super(convInfoND, poolType, computePositions);
  }
}

function product(lst: number[]): number {
  if (lst.length === 0) {
    return 1
  }
  return lst[0] * product(lst.slice(1));
}

function arrayCodeString(lst: any[], ignoreLastDim = true) {
  if (ignoreLastDim) {
    lst = lst.slice(0, lst.length - 1)
  }
  return lst.join(', ');
}
