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

import {GPGPUProgram} from './gpgpu_math';

export interface ReduceInfo {
  windowSize: number;
  batchSize: number;
  inSize: number;
  outSize: number;
}

export class ReduceProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;

  constructor(reduceInfo: ReduceInfo, reduceType: 'max'|'min'|'sum') {
    const windowSize = reduceInfo.windowSize;
    const batchSize = reduceInfo.batchSize;
    const inSize = reduceInfo.inSize;
    this.outputShape = [batchSize, reduceInfo.outSize];

    const isSumPool = reduceType === 'sum';

    let initializationValue = '0.0';
    if (!isSumPool) {
      if (reduceType === 'min') {
        initializationValue = '1.0 / 0.0';
      } else {
        initializationValue = '-1.0 / 0.0';
      }
    }

    const compareOp = reduceType === 'min' ? 'min' : 'max';

    let returnValue = `${reduceType}(${reduceType}(${reduceType}(` +
        'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    if (reduceType === 'sum') {
      returnValue = `sumValue`;
    }

    const filterWidthNearestVec4 = Math.floor(filterWidth / 4) * 4;
    const filterWidthVec4Remainder = filterWidth % 4;

    const updateSnippet = `
      if (hasNaN(values)) {
        setOutput(getNaN(values));
        return;
      }
      if (${isSumPool}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${compareOp}(values, minMaxValue);
      }
    `;

    this.userCode = `
      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});
      const float initializationValue = ${initializationValue};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int xR, int xC, int d) {
        if (xC < 0 || xC >= ${xNumCols}) {
          return initializationValue;
        }
        return getX(xR, xC, d);
      }

      void main() {
        ivec3 coords = getOutputCoords();
        int d = coords.z;

        ivec2 xRCCorner = coords.xy * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;

        for (int wR = 0; wR < ${filterHeight}; wR++) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${xNumRows}) {
            continue;
          }

          for (int wC = 0; wC < ${filterWidthNearestVec4}; wC += 4) {
            int xC = xCCorner + wC;

            vec4 values = vec4(
              getValue(xR, xC, d),
              getValue(xR, xC + 1, d),
              getValue(xR, xC + 2, d),
              getValue(xR, xC + 3, d)
            );

            ${updateSnippet}
          }

          int xC = xCCorner + ${filterWidthNearestVec4};
          if (${filterWidthVec4Remainder === 1}) {
            vec4 values = vec4(
              getValue(xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );
            ${updateSnippet}
          } else if (${filterWidthVec4Remainder === 2}) {
            vec4 values = vec4(
              getValue(xR, xC, d),
              getValue(xR, xC + 1, d),
              initializationValue,
              initializationValue
            );

            ${updateSnippet}
          } else if (${filterWidthVec4Remainder === 3}) {
            vec4 values = vec4(
              getValue(xR, xC, d),
              getValue(xR, xC + 1, d),
              getValue(xR, xC + 2, d),
              initializationValue
            );

            ${updateSnippet}
          }
        }
        setOutput(${returnValue});
      }
    `;
  }
}
