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
    this.rank = outputShape.length;
    const rows = outputShape[outputShape.length - 2];
    const cols = outputShape[outputShape.length - 1];

    const dtype = getCoordsDataType(this.rank);

    if (this.rank === 2) {
      this.userCode = `
        void main() {
          ${dtype} rc = getOutputCoords();

          int r = rc.x;
          int c = rc.y;

          if(r >= ${rows} || c >= ${cols}) {
            gl_FragColor = vec4(0);
          } else {
            int rp1 = r + 1;
            int cp1 = c + 1;

            bool cEdge = cp1 >= ${cols};
            bool rEdge = rp1 >= ${rows};

            gl_FragColor = vec4(
                getA(r, c),
                cEdge ? 0. : getA(r, cp1),
                rEdge ? 0. : getA(rp1, c),
                rEdge || cEdge ? 0. : getA(rp1, cp1)
              );
          }
        }`;
    } else if (this.rank === 4) {
      this.userCode = `
          void main() {
            ${dtype} rc = getOutputCoords();

            int r = rc.z;
            int c = rc.w;

            if(r >= ${rows} || c >= ${cols}) {
              gl_FragColor = vec4(0);
            } else {
              int rp1 = r + 1;
              int cp1 = c + 1;

              bool cEdge = cp1 >= ${cols};
              bool rEdge = rp1 >= ${rows};

              gl_FragColor = vec4(
                  getA(rc.x, rc.y, r, c),
                  cEdge ? 0. : getA(rc.x, rc.y, r, cp1),
                  rEdge ? 0. : getA(rc.x, rc.y, rp1, c),
                  rEdge || cEdge ? 0. : getA(rc.x, rc.y, rp1, cp1)
                );
            }
          }`;
    }
  }
}
