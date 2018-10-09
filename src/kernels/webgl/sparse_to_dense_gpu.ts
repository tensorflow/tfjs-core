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
export class SparseToDenseProgram implements GPGPUProgram {
  variableNames = ['values', 'indices'];
  outputShape: number[];
  userCode: string;
  constructor(
      private indiceSize: number, private indiceDim: number,
      private indiceRank: number, private valueRank: number,
      private strides: number[], shape: number[], defaultValue: number) {
    this.outputShape = shape;
    const stridesType = getCoordsDataType(strides.length);
    let indiceString = '';
    switch (this.indiceRank) {
      case 0:
        indiceString = 'getIndices()';
        break;
      case 1:
        indiceString = 'getIndices(i)';
        break;
      default:
        indiceString = 'getIndices(i,j)';
    }

    const valueString = this.valueRank === 0 ? 'getValues()' : 'getValues(i)';
    const dtype = getCoordsDataType(shape.length);
    const strideString = this.indiceRank > 1 ? 'strides[j]' : 'strides';
    this.userCode = `
        ${stridesType} strides = ${stridesType}(${this.strides});
         void main() {
          ${dtype} coords = getOutputCoords();
          setOutput(float(${defaultValue}));
          for (int i = 0; i < ${this.indiceSize}; i++) {
            int flattenIndex = 0;
            for (int j = 0; j < ${this.indiceDim}; j++) {
              int index = round(${indiceString});
              flattenIndex += index * ${strideString};
            }
            if (flattenIndex == coords) {
              setOutput(${valueString});
              break;
            }
          }
        }
      `;
  }
}
