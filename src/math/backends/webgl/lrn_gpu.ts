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

export class LRNProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[] = [];
  userCode: string;

  constructor(
      xShape: number[], radius: number, bias: number, alpha: number,
      beta: number, normRegion: 'acrossChannels'|'withinChannel') {
    const n2 = Math.floor(radius / 2);
    const di = xShape.length === 3 ? 0 : 1;
    const maxW = xShape[0 + di] - 1;
    const maxH = xShape[1 + di] - 1;
    const maxD = xShape[2 + di] - 1;

    const f0 = bias;
    const f1 = alpha / radius;

    this.outputShape = xShape;

    const initialCoords = xShape.length === 3 ?
        `ivec3 coords = getOutputCoords();
         int r = coords[0];
         int c = coords[1];
         int d = coords[2];` :
        `ivec4 coords = getOutputCoords();
         int b = coords[0];
         int r = coords[1];
         int c = coords[2];
         int d = coords[3];`;

    const getX = (r: string, c: string, d: string) => {
      return xShape.length === 3 ? `getX(${r}, ${c}, ${d})` :
                                   `getX(b, ${r}, ${c}, ${d})`;
    };

    if (normRegion === 'withinChannel') {
      this.userCode = `
        void main() {
          ${initialCoords}

          const float f0 = float(${f0});
          const float f1 = float(${f1});

          float x = ${getX('r', 'c', 'd')};
          float sum = 0.0;

          for (int u = -${n2}; u <= ${n2}; u++) {
            for (int v = -${n2}; v <= ${n2}; v++) {
              int idx = r + u;
              int idy = c + v;
              if (idx >= 0 && idx <= ${maxW} && idy >= 0 && idy <= ${maxH}) {
                sum += pow(${getX('idx', 'idy', 'd')}, 2.0);
              }
            }
          }

          float val = x * pow(f0 + f1 * sum, -float(${beta}));
          setOutput(val);
        }
      `;
    } else {
      this.userCode = `
        void main() {
          ivec3 coords = getOutputCoords();
          int r = coords[0];
          int c = coords[1];
          int d = coords[2];

          const float f0 = float(${f0});
          const float f1 = float(${f1});

          float x = getX(r, c, d);
          float sum = 0.0;

          for (int j = -${n2}; j <= ${n2}; j++) {
            int idx = d + j;
            if (idx >= 0 && idx <= ${maxD}) {
              sum += pow(getX(r, c, idx), 2.0);
            }
          }

          float val = x * pow(f0 + f1 * sum, -float(${beta}));
          setOutput(val);
        }
      `;
    }
  }
}
