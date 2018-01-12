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
import {getCoordsDataType} from './shader_compiler';

export class WhereProgram implements GPGPUProgram {
  variableNames = ['c', 'a', 'b'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor(shape: number[], rank: number) {
    this.outputShape = shape;
    this.rank = rank;

    const dtype = getCoordsDataType(this.rank);
    const sourceCoords = getSourceCoords(shape);

    this.userCode = `
      void main() {
        ${dtype} resRC = getOutputCoords();
        float cVal = getC(${sourceCoords});
        if (cVal >= 1.0) {
          setOutput(getA(${sourceCoords}));
        } else {
          setOutput(getB(${sourceCoords}));
        }
      }
    `;
  }
}

// TODO - move into constructor?
function getSourceCoords(shape: number[]): string {
  const rank = shape.length;
  if (rank > 4) {
    throw Error(`Where for rank ${rank} is not yet supported`);
  }
  if (rank === 1) {
    return `resRC`;
  }

  const currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];

  const sourceCoords = [];
  for (let i = 0; i < shape.length; i++) {
    sourceCoords.push(`${currentCoords[i]}`);
  }
  return sourceCoords.join();
}
