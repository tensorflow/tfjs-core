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

export class PackProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;

  constructor(outputShape: number[]) {
    this.outputShape = outputShape;
    const rank = outputShape.length;
    const rows = outputShape[outputShape.length - 2];
    const cols = outputShape[outputShape.length - 1];

    const dtype = getCoordsDataType(rank);
    const innerDims = getInnerDims(rank);
    const outOfBoundsCondition = getOutOfBoundsCondition(rank, outputShape);
    const sourceCoords = getSourceCoords(rank);

    this.userCode = `
      void main() {
        ${dtype} rc = getOutputCoords();

        int r = ${innerDims[0]};
        int c = ${innerDims[1]};

        if(${outOfBoundsCondition}) {
          gl_FragColor = vec4(0);
        } else {
          int rp1 = r + 1;
          int cp1 = c + 1;

          bool cEdge = cp1 >= ${cols};
          bool rEdge = rp1 >= ${rows};

          gl_FragColor = vec4(
            getA(${sourceCoords[0]}),
            cEdge ? 0. : getA(${sourceCoords[1]}),
            rEdge ? 0. : getA(${sourceCoords[2]}),
            rEdge || cEdge ? 0. : getA(${sourceCoords[3]})
          );
        }
      }
    `;
  }
}

const dims = ['rc.x', 'rc.y', 'rc.z', 'rc.w'];

function getInnerDims(rank: number): string[] {
  return dims.slice(0, rank).slice(-2);
}

function getSourceCoords(rank: number): string[] {
  const coords = [];

  for (let row = 0; row <= 1; row++) {
    for (let col = 0; col <= 1; col++) {
      let coord = `${row === 0 ? 'r' : 'rp1'}, ${col === 0 ? 'c' : 'cp1'}`;

      for (let d = 2; d < rank; d++) {
        coord = `${dims[dims.length - 1 - d]},` + coord;
      }

      coords.push(coord);
    }
  }
  return coords;
}

function getOutOfBoundsCondition(rank: number, shape: number[]): string {
  let cond = '';
  for (let i = 0; i < rank; i++) {
    cond += `${dims[i]} >= ${shape[i]}`;
    if (i < rank - 1) {
      cond += '||';
    }
  }

  return cond;
}
