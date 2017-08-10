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
import {GPGPUProgram} from './gpgpu_math';

export class MatMulProgram implements GPGPUProgram<Array2D> {
  variableNames = ['matrixA', 'matrixB'];

  constructor(
      public inputs: Array2D[],
      public output: Array2D,
      private aOrientation = MatrixOrientation.REGULAR,
      private bOrientation = MatrixOrientation.REGULAR) {}

  getParams() {
    return [this.aOrientation, this.bOrientation];
  }

  getUserCode(): string {
    const a = this.inputs[0];
    const sharedDim =
      (this.aOrientation === MatrixOrientation.REGULAR ? a.shape[1] : a.shape[0]);
    const aSnippet = (this.aOrientation === MatrixOrientation.REGULAR) ?
        'aRow, i_float' : 'i_float, aRow';
    const bSnippet = (this.bOrientation === MatrixOrientation.REGULAR) ?
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

  validate(): boolean {
    if (this.inputs.length !== 2) {
      return false;
    }
    if (this.inputs[0].rank !== 2 ||
        this.inputs[1].rank !== 2 ||
        this.output.rank !== 2) {
      return false;
    }
    return true;
  }
}

