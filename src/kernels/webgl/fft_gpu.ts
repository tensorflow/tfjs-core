/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

export class FFTProgram implements GPGPUProgram {
  variableNames = ['matrixA'];
  outputShape: number[];
  userCode: string;

  constructor(inputShape: [number, number]) {
    const size = inputShape[0];
    this.outputShape = [size, 2];

    this.userCode = ` float mulMatDFT(int row, int col) {
      // TODO: Gather constants in one place?
      const float PI = 3.1415926535897932384626433832795;
      float result = 0.0;

      for (int i = 0; i < ${size}; i++) {
        float x = -2.0 * PI * float(row * i) / float(${size});
        float expR = cos(x);
        float expI = sin(x);
        float real = getMatrixA(i, 0);
        float imag = getMatrixA(i, 1);

        if (col == 0) {
          // In case of real number
          result += real * expR - imag * expI;
        } else if (col == 1) {
          // In case of imaginary number
          result += real * expI + imag * expR;
        }
      }

      return result;
    }

    void main() {
      ivec2 resRC = getOutputCoords();
      setOutput(mulMatDFT(resRC.x, resRC.y));
    }
    `;
  }
}
