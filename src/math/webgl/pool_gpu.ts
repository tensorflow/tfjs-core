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

import * as util from '../../util';
import {ConvInfo2D, ConvInfoND} from '../conv_util';

import {GPGPUProgram} from './gpgpu_math';

// TODO(dfarhi): Abstract PoolNDProgram into a single class since the code
// is virtually identical. (Compare Pool1DProgram to Pool3DProgram.)
export class Pool1DProgram implements GPGPUProgram {
  variableNames = ['x'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      convInfo: ConvInfoND, poolType: 'max'|'min'|'avg',
      computePositions: boolean) {
    if (poolType === 'avg' && computePositions) {
      throw new Error('Cannot compute positions for average pool.');
    }
    const rank = 1;
    const ivecN = `int`;
    const compareOp = poolType === 'min' ? 'min' : 'max';

    util.assert(
        convInfo.rank === rank + 1,
        `Shape should be ${rank + 1}-dimensonal for Pool${rank}D; was ${
            convInfo.rank}`);
    const startPads = convInfo.padInfo.map((pad) => pad.start);
    this.params = [convInfo.stride, startPads, poolType, computePositions];
    this.outputShape = convInfo.outShape;

    const isAvgPool = poolType === 'avg';

    let initializationValue = '0.0';
    if (!isAvgPool) {
      if (poolType === 'min') {
        initializationValue = '1.0 / 0.0';
      } else {
        initializationValue = '-1.0 / 0.0';
      }
    }

    if (computePositions) {
      throw Error('computePositions Not Implemented for MaxPool1D yet.')
    }


    let returnValue: string;
    if (poolType === 'avg') {
      returnValue = `avgValue / ${product(convInfo.filter)}.0`;
    } else {
      returnValue = `${poolType}(${poolType}(${poolType}(` +
          'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    }

    this.userCode = `
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);
      const ${ivecN} xShape = ${ivecN}(${arrayCodeString(convInfo.inShape)});
      const ${ivecN} filter = ${ivecN}(${arrayCodeString(convInfo.filter)});
      const ${ivecN} strides = ${ivecN}(${arrayCodeString(convInfo.stride)});
      const ${ivecN} pads = ${ivecN}(${arrayCodeString(startPads)});
      const float initializationValue = ${initializationValue};

      float getValue(${ivecN} xCorner, ${ivecN} offset, int d) {
        // Return the value from x at position offset from xCorner by a certain amount.
        // If the offsets are outside the filter range (because we grab batches of
        // 4 values at a time), ignore it.
        if ((offset >= filter) || (offset < 0)) {
          return initializationValue;
        }
        ${ivecN} xPos = xCorner + offset;
        // If the offsets put us outside the original image, ignore it.
        if ((xPos >= xShape) || (xPos < 0)) {
          return initializationValue;
        }
        return getX(ivec${rank + 1}(xPos, d));
      }

      void main() {
        ivec${rank + 1} coords = getOutputCoords();
        int d = coords[${rank}];

        // coords has length (rank + 1) because it includes the depth.
        // We can slice it by casting; casting a high-dim vector to a lower
        // dim just reads the first few coordinates.
        ${ivecN} xCorner = ${ivecN}(coords) * strides - pads;

        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;

        for (int w = 0; w < ${convInfo.filter[0]}; w += 4) {
          vec4 values = vec4(
            getValue(xCorner, w, d),
            getValue(xCorner, w + 1, d),
            getValue(xCorner, w + 2, d),
            getValue(xCorner, w + 3, d)
          );

          if (hasNaN(values)) {
            setOutput(getNaN(values));
            return;
          }
          if (${isAvgPool}) {
            avgValue += dot(values, ones);
          } else {
            minMaxValue = ${compareOp}(values, minMaxValue);
          }
        }
        setOutput(${returnValue});
      }
    `;
  }
}

export class Pool2DProgram implements GPGPUProgram {
  variableNames = ['x'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      convInfo: ConvInfo2D, poolType: 'max'|'min'|'avg',
      computePositions: boolean) {
    if (poolType === 'avg' && computePositions) {
      throw new Error('Cannot compute positions for average pool.');
    }

    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;

    const xNumRows = convInfo.inShape[0];
    const xNumCols = convInfo.inShape[1];
    const padTop = convInfo.padInfo.top;
    const padLeft = convInfo.padInfo.left;
    this.params = [
      strideHeight, strideWidth, padLeft, padTop, poolType, computePositions
    ];
    this.outputShape = convInfo.outShape;

    const isAvgPool = poolType === 'avg';

    let initializationValue = '0.0';
    if (!isAvgPool) {
      if (poolType === 'min') {
        initializationValue = '1.0 / 0.0';
      } else {
        initializationValue = '-1.0 / 0.0';
      }
    }

    if (computePositions) {
      const compareOp = poolType === 'min' ? '<=' : '>=';

      this.userCode = `
        // TODO merge this code with the main code below.
        const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
        const ivec2 pads = ivec2(${padTop}, ${padLeft});
        const float initializationValue = ${initializationValue};

        void main() {
          ivec3 coords = getOutputCoords();
          int d = coords.z;

          ivec2 xCorner = coords.xy * strides - pads;
          int xRCorner = xCorner.x;
          int xCCorner = xCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${filterHeight}; wR++) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${xNumRows}) {
              continue;
            }

            for (int wC = 0; wC < ${filterWidth}; wC++) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${xNumCols}) {
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
                minMaxPosition = wR * ${filterWidth} + wC;
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;
      return;
    }

    const compareOp = poolType === 'min' ? 'min' : 'max';
    const rank = 2;
    const ivecN = `ivec${rank}`;

    let returnValue: string;
    if (poolType === 'avg') {
      returnValue = `avgValue / ${filterHeight * filterWidth}.0`;
    } else {
      returnValue = `${poolType}(${poolType}(${poolType}(` +
          'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    }

    this.userCode = `
    const vec4 ones = vec4(1.0);
    const ${ivecN} zero = ivec${rank}(0.0);
    const ${ivecN} xShape = ${ivecN}(${arrayCodeString(convInfo.inShape)});
    const ${ivecN} filter = ${ivecN}(${
        arrayCodeString([filterHeight, filterWidth], false)});
    const ${ivecN} strides = ${ivecN}(${
        arrayCodeString([strideHeight, strideWidth], false)});
    const ${ivecN} pads = ${ivecN}(${
        arrayCodeString([padTop, padLeft], false)});
    const float initializationValue = ${initializationValue};

    float getValue(${ivecN} xCorner, ${ivecN} offset, int d) {
      // Return the value from x at position offset from xCorner by a certain amount.
      // If the offsets are outside the filter range (because we grab batches of
      // 4 values at a time), ignore it.
      if (any(greaterThanEqual(offset, filter)) ||
          any(lessThan(offset, zero))) {
        return initializationValue;
      }
      ${ivecN} xPos = xCorner + offset;
      // If the offsets put us outside the original image, ignore it.
      if (any(greaterThanEqual(xPos, xShape)) ||
          any(lessThan(xPos, zero))) {
        return initializationValue;
      }
      return getX(ivec${rank + 1}(xPos, d));
    }

    void main() {
      ivec${rank + 1} coords = getOutputCoords();
      int d = coords[${rank}];

      // coords has length (rank + 1) because it includes the depth.
      // We can slice it by casting; casting a high-dim vector to a lower
      // dim just reads the first few coordinates.
      ${ivecN} xCorner = ${ivecN}(coords) * strides - pads;

      vec4 minMaxValue = vec4(${initializationValue});
      float avgValue = 0.0;
      for (int wx = 0; wx < ${filterHeight}; wx++) {
        for (int wy = 0; wy < ${filterWidth}; wy += 4) {
          vec4 values = vec4(
            getValue(xCorner, ${ivecN}(wx, wy), d),
            getValue(xCorner, ${ivecN}(wx, wy + 1), d),
            getValue(xCorner, ${ivecN}(wx, wy + 2), d),
            getValue(xCorner, ${ivecN}(wx, wy + 3), d)
          );

          if (hasNaN(values)) {
            setOutput(getNaN(values));
            return;
          }
          if (${isAvgPool}) {
            avgValue += dot(values, ones);
          } else {
            minMaxValue = ${compareOp}(values, minMaxValue);
          }
        }
      }
      setOutput(${returnValue});
    }
  `;
  }
}

export class Pool3DProgram implements GPGPUProgram {
  variableNames = ['x'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      convInfo: ConvInfoND, poolType: 'max'|'min'|'avg',
      computePositions: boolean) {
    if (poolType === 'avg' && computePositions) {
      throw new Error('Cannot compute positions for average pool.');
    }
    const rank = 3;
    const ivecN = `ivec${rank}`;
    const compareOp = poolType === 'min' ? 'min' : 'max';

    util.assert(
        convInfo.rank === rank + 1,
        `Shape should be ${rank + 1}-dimensonal for Pool${rank}D; was ${
            convInfo.rank}`);
    const startPads = convInfo.padInfo.map((pad) => pad.start);
    this.params = [convInfo.stride, startPads, poolType, computePositions];
    this.outputShape = convInfo.outShape;

    const isAvgPool = poolType === 'avg';

    let initializationValue = '0.0';
    if (!isAvgPool) {
      if (poolType === 'min') {
        initializationValue = '1.0 / 0.0';
      } else {
        initializationValue = '-1.0 / 0.0';
      }
    }

    if (computePositions) {
      throw Error('computePositions Not Implemented for MaxPool3D yet.')
    }

    let returnValue: string;
    if (poolType === 'avg') {
      returnValue = `avgValue / ${product(convInfo.filter)}.0`;
    } else {
      returnValue = `${poolType}(${poolType}(${poolType}(` +
          'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    }

    this.userCode = `
      const vec4 ones = vec4(1.0);
      const ${ivecN} zero = ivec${rank}(0.0);
      const ${ivecN} xShape = ${ivecN}(${arrayCodeString(convInfo.inShape)});
      const ${ivecN} filter = ${ivecN}(${arrayCodeString(convInfo.filter)});
      const ${ivecN} strides = ${ivecN}(${arrayCodeString(convInfo.stride)});
      const ${ivecN} pads = ${ivecN}(${arrayCodeString(startPads)});
      const float initializationValue = ${initializationValue};

      float getValue(${ivecN} xCorner, ${ivecN} offset, int d) {
        // Return the value from x at position offset from xCorner by a certain amount.
        // If the offsets are outside the filter range (because we grab batches of
        // 4 values at a time), ignore it.
        if (any(greaterThanEqual(offset, filter)) ||
            any(lessThan(offset, zero))) {
          return initializationValue;
        }
        ${ivecN} xPos = xCorner + offset;
        // If the offsets put us outside the original image, ignore it.
        if (any(greaterThanEqual(xPos, xShape)) ||
            any(lessThan(xPos, zero))) {
          return initializationValue;
        }
        return getX(ivec${rank + 1}(xPos, d));
      }

      void main() {
        ivec${rank + 1} coords = getOutputCoords();
        int d = coords[${rank}];

        // coords has length (rank + 1) because it includes the depth.
        // We can slice it by casting; casting a high-dim vector to a lower
        // dim just reads the first few coordinates.
        ${ivecN} xCorner = ${ivecN}(coords) * strides - pads;

        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;
        for (int wx = 0; wx < ${convInfo.filter[0]}; wx++) {
          for (int wy = 0; wy < ${convInfo.filter[1]}; wy++) {
            for (int wz = 0; wz < ${convInfo.filter[2]}; wz += 4) {
              vec4 values = vec4(
                getValue(xCorner, ${ivecN}(wx, wy, wz), d),
                getValue(xCorner, ${ivecN}(wx, wy, wz + 1), d),
                getValue(xCorner, ${ivecN}(wx, wy, wz + 2), d),
                getValue(xCorner, ${ivecN}(wx, wy, wz + 3), d)
              );

              if (hasNaN(values)) {
                setOutput(getNaN(values));
                return;
              }
              if (${isAvgPool}) {
                avgValue += dot(values, ones);
              } else {
                minMaxValue = ${compareOp}(values, minMaxValue);
              }
            }
          }
        }
        setOutput(${returnValue});
      }
    `;
  }
}

function product(lst: number[]): number {
  if (lst.length === 0) {
    return 1
  }
  return lst[0] * product(lst.slice(1));
}

function arrayCodeString(lst: number[], ignoreLastDim = true) {
  if (ignoreLastDim) {
    lst = lst.slice(0, lst.length - 1)
  }
  return lst.join(', ');
}
