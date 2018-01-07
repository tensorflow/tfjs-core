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

export class LRNProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[] = [];
  userCode: string;

  constructor(
      xShape: number[], radius: number, bias: number, alpha: number,
      beta: number, normRegion: 'acrossChannels'|'withinChannel') {
    const rad = radius;
    const is3D = xShape.length === 3;
    const shiftIdx = is3D ? 0 : 1;
    const maxW = xShape[0 + shiftIdx] - 1;
    const maxH = xShape[1 + shiftIdx] - 1;
    const maxD = xShape[2 + shiftIdx] - 1;
    this.outputShape = xShape;
    const initialCoords = is3D ? `ivec3 coords = getOutputCoords();
                                  int r = coords[0];
                                  int c = coords[1];
                                  int d = coords[2];` :
                                 `ivec4 coords = getOutputCoords();
                                  int b = coords[0];
                                  int r = coords[1];
                                  int c = coords[2];
                                  int d = coords[3];`;

    const getX = (r: string, c: string, d: string) => {
      return is3D ? `getX(${r}, ${c}, ${d})` : `getX(b, ${r}, ${c}, ${d})`;
    };

    // optimize pow(bias + alpha * sum, -beta)
    // src: https://github.com/tensorflow/tensorflow/..
    // blob/26033a1644a9c4a5fbe3170ab2e864b6a4ccd4ca/..
    // tensorflow/core/kernels/mkl_lrn_op.cc#L320
    const getPowOperator = (beta: number) => {
      const basis = `float(${bias}) + float(${alpha}) * sum`;
      if (beta === 0.5) {
        return `inversesqrt(${basis})`;
      } else if (beta === 1.0) {
        return `1.0/(${basis})`;
      } else {
        return `exp(log(${basis}) * float(-${beta}));`;
      }
    };
    const powOperator = getPowOperator(beta);

    if (normRegion === 'withinChannel') {
      this.userCode = `
        void main() {
          ${initialCoords}
          float x = ${getX('r', 'c', 'd')};
          float sum = 0.0;
          for (int u = -${rad}; u <= ${rad}; u++) {
            for (int v = -${rad}; v <= ${rad}; v++) {
              int idx = r + u;
              int idy = c + v;
              if (idx >= 0 && idx <= ${maxW} && idy >= 0 && idy <= ${maxH}) {
                float z = ${getX('idx', 'idy', 'd')};
                sum += z * z;
              }
            }
          }
          float val = x * ${powOperator};
          setOutput(val);
        }
      `;
    } else {
      this.userCode = `
        void main() {
          ${initialCoords}
          float x = ${getX('r', 'c', 'd')};
          float sum = 0.0;
          for (int j = -${rad}; j <= ${rad}; j++) {
            int idx = d + j;
            if (idx >= 0 && idx <=  ${maxD}) {
              float z = ${getX('r', 'c', 'idx')};
              sum += z * z;
            }
          }
          float val = x * ${powOperator};
          setOutput(val);
        }
      `;
    }
  }
}
