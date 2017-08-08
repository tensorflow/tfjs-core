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

import {MatrixOrientation} from '../math';
import {Array2D} from '../ndarray';
import {GPGPUProgram} from './gpgpu_context';

export class MatMulProgram implements GPGPUProgram {
  variableNames = ['matrixA', 'matrixB'];

  getUserCode(inputs: Array2D[], out: Array2D, aOrientation: MatrixOrientation,
      bOrientation: MatrixOrientation): string {
    const a = inputs[0];
    const sharedDim =
      (aOrientation === MatrixOrientation.REGULAR ? a.shape[1] : a.shape[0]);
    const aSnippet = (aOrientation === MatrixOrientation.REGULAR) ?
        'aRow, i_float' : 'i_float, aRow';
    const bSnippet = (bOrientation === MatrixOrientation.REGULAR) ?
        'i_float, bCol' : 'bCol, i_float';

    return `
      const int sharedDim = ${sharedDim};

      float dotARowBCol(float aRow, float bCol) {
        float result = 0.0;
        for (int i = 0; i < sharedDim; i++) {
          float i_float = float(i);
          float a = getMatrixA(${aSnippet});
          float b = getMatrixB(${bSnippet});
          result += (a * b);
        }
        return result;
      }

      void main() {
        vec2 resRC = getOutputCoords();
        setOutput(dotARowBCol(resRC.x, resRC.y));
      }
    `;
  }

  validate(inputs: Array2D[], out: Array2D): boolean {
    if (inputs.length !== 2) {
      return false;
    }
    if (inputs[0].rank !== 2 || inputs[1].rank !== 2 || out.rank !== 2) {
      return false;
    }
    return true;
  }
}

