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
import {getCoordsDataType} from './shader_compiler';

export class ScatterProgram implements GPGPUProgram {
  variableNames = ['updates', 'indices'];
  outputShape: number[];
  userCode: string;

  constructor(
      private updateSize: number, private sliceDim: number, indiceRank: number,
      updateRank: number, private strides: number[], shape: number[],
      defaultValue: number, summingDupeIndex = true) {
    this.outputShape = shape;
    const stridesType = getCoordsDataType(strides.length);
    const dtype = getCoordsDataType(shape.length);
    console.log(defaultValue);
    let indiceString = '';
    switch (indiceRank) {
      case 0:
        indiceString = 'getIndices()';
        break;
      case 1:
        indiceString = 'getIndices(i)';
        break;
      default:
        indiceString = 'getIndices(i,j)';
    }

    let updateString = '';
    switch (updateRank) {
      case 0:
        updateString = 'getUpdates()';
        break;
      case 1:
        updateString = 'getUpdates(i)';
        break;
      default:
        updateString = 'getUpdates(i,coords[1])';
    }

    const strideString = this.sliceDim > 1 ? 'strides[j]' : 'strides';
    this.userCode = `
        ${stridesType} strides = ${stridesType}(${this.strides});

        void main() {
          ${dtype} coords = getOutputCoords();
          setOutput(float(${defaultValue}));
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${this.updateSize}; i++) {
            int flattenIndex = 0;
            for (int j = 0; j < ${this.sliceDim}; j++) {
              int index = round(${indiceString});
              flattenIndex += index * ${strideString};
            }
            if (flattenIndex == coords[0]) {
              sum += ${updateString};
              found = true;
            }
          }
          if (found) {
            setOutput(sum);
          }
        }
      `;
  }
}
