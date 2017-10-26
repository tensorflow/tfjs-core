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

    util.assert(
        convInfo.rank === 2,
        'Shape should be 2-dimensonal for Pool1D; was ' + convInfo.rank)
    const xLength = convInfo.inShape[0];
    const filterSize = convInfo.filter[0];
    const stride = convInfo.stride[0];
    const pad = convInfo.padInfo[0].start;
    // TODO Why isn't the filter size in here?
    this.params = [stride, pad, poolType, computePositions];
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

    // TODO remove
    initializationValue = '-5.0';

    if (computePositions) {
      throw Error('computePositions Not Implemented for MaxPool1D yet.')
    }

    const compareOp = poolType === 'min' ? 'min' : 'max';

    let returnValue: string;
    if (poolType === 'avg') {
      returnValue = `avgValue / ${filterSize}.0`;
    } else {
      returnValue = `${poolType}(${poolType}(${poolType}(` +
          'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    }

    const filterWidthNearestVec4 = Math.floor(filterSize / 4) * 4;

    this.userCode = `
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);
      const int xShape = ${xLength};
      const int filter = ${filterSize};
      const int strides = ${stride};
      const int pads = ${pad};
      const float initializationValue = ${initializationValue};

      float getValue(int xCorner, int offset, int d) {
        // Return the value from x at position offset from xCorner by a certain amount.
        // If the offsets are outside the filter range (because we grab batches of
        // 4 values at a time), ignore it.
        if ((offset >= filter) || (offset < 0)) {
          return initializationValue;
        }
        int xPos = xCorner + offset;
        // If the offsets put us outside the original image, ignore it.
        if ((xPos >= xShape) || (xPos < 0)) {
          return initializationValue;
        }
        return getX(xPos, d);
      }

       void main() {
        ivec2 coords = getOutputCoords();
        int d = coords.y;

        int xCorner = coords.x * strides - pads;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;

        for (int w = 0; w < ${filterWidthNearestVec4}; w += 4) {
          vec4 values = vec4(
            getValue(xCorner, w, d),
            getValue(xCorner, w, d),
            getValue(xCorner, w, d),
            getValue(xCorner, w, d)
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

    let returnValue: string;
    if (poolType === 'avg') {
      returnValue = `avgValue / ${filterHeight * filterWidth}.0`;
    } else {
      returnValue = `${poolType}(${poolType}(${poolType}(` +
          'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    }

    // We read the entries in batches of 4, since WebGL can do min/max on vec4s.
    // It's not clear this is actually gaining us anything since we have to read
    // each cell one by one into the vec4 anyway.
    const filterWidthNearestVec4 = Math.ceil(filterWidth / 4) * 4;

    this.userCode = `
      const ivec2 xShape = ivec2(${xNumRows}, ${xNumCols});
      const ivec2 filter = ivec2(${filterHeight}, ${filterWidth});
      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});
      const float initializationValue = ${initializationValue};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);
      const ivec2 zero = ivec2(0.0, 0.0);

      float getValue(ivec2 xCorner, ivec2 offset, int d) {
        // Return the value from x at position offset from xCorner by a certain amount.
        // If the offsets are outside the filter range (because we grab batches of
        // 4 values at a time), ignore it.
        if (any(greaterThanEqual(offset, filter)) ||
            any(lessThan(offset, zero))) {
          return initializationValue;
        }
        ivec2 xPos = xCorner + offset;
        // If the offsets put us outside the original image, ignore it.
        if (any(greaterThanEqual(xPos, xShape)) ||
            any(lessThan(xPos, zero))) {
          return initializationValue;
        }
        return getX(xPos.x, xPos.y, d);
      }

      void main() {
        ivec3 coords = getOutputCoords();
        int d = coords.z;

        ivec2 xRCCorner = coords.xy * strides - pads;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;

        for (int wR = 0; wR < ${filterHeight}; wR++) {
          for (int wC = 0; wC < ${filterWidthNearestVec4}; wC += 4) {
            // Note that the last bunch might overshoot the actual filterWidth
            // in which case getValue returns initializationValue to ignore that
            // entry.
            vec4 values = vec4(
              getValue(xRCCorner, ivec2(wR, wC), d),
              getValue(xRCCorner, ivec2(wR, wC + 1), d),
              getValue(xRCCorner, ivec2(wR, wC + 2), d),
              getValue(xRCCorner, ivec2(wR, wC + 3), d)
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
