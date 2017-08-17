/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import * as conv_util from '../conv_util';
import {GPGPUProgram} from './gpgpu_math';

export class Conv2DProgram implements GPGPUProgram {
  variableNames = ['x', 'W', 'bias'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: [number, number, number], fieldSize: number, outputDepth: number,
      stride: number, pad: number, hasBias: boolean) {
    this.outputShape = conv_util.computeOutputShape3D(
        xShape, fieldSize, outputDepth, stride, pad);
    const inputDepth = xShape[2];
    this.params = [fieldSize, stride, pad, hasBias];

    this.userCode = `
      void main() {
        vec3 coords = getOutputCoords();
        float yR = coords.x;
        float yC = coords.y;
        float d2 = coords.z;

        vec2 xRCCorner = vec2(yR, yC) * vec2(${stride}.0, ${stride}.0) -
            vec2(${pad}.0, ${pad}.0);
        float xRCorner = xRCCorner.x;
        float xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${fieldSize}; wR++) {
          float wR_float = float(wR);
          float xR = xRCorner + wR_float;

          for (int wC = 0; wC < ${fieldSize}; wC++) {
            float wC_float = float(wC);
            float xC = xCCorner + wC_float;

            for (int d1 = 0; d1 < ${inputDepth}; d1++) {
              float d1_float = float(d1);
              float xValue = getXOrZeroPad(xR, xC, d1_float);
              float wValue = getW(wR_float, wC_float, d1_float, d2);
              dotProd += xValue * wValue;
            }
          }
        }
        ${hasBias ?
        'dotProd += getBias(d2);' :
        ''
        }

        setOutput(dotProd);
      }
    `;
  }
}
