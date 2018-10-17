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

export class ClipProgram implements GPGPUProgram {
  variableNames = ['A'];
  packedInputs = true;
  userCode: string;
  outputShape: number[];

  constructor(aShape: number[], min: number, max: number) {
    this.outputShape = aShape;
    const rank = aShape.length;

    const dtype = getCoordsDataType(rank);
    const sourceCoords = getSourceCoords(rank);

    this.userCode = `
      void main() {
        ${dtype} rc = getOutputCoords();
        vec4 value = getA(${sourceCoords});

        // float value = getAAtOutCoords();
        // if (isNaN(value)) {
        //   setOutput(value);
        //   return;
        // }

        gl_FragColor = clamp(value, vec4(${min}), vec4(${max}));
      }
    `;
  }
}

const dims = ['rc.x', 'rc.y', 'rc.z', 'rc.w'];

function getSourceCoords(rank: number): string {
  if(rank === 1) {
    return 'rc';
  }

  let coords = '';
  for (let i = 0; i < rank; i++) {
    coords += dims[i];
    if (i < rank - 1) {
      coords += ',';
    }
  }
  return coords;
}
