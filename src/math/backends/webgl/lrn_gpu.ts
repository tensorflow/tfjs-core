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

export class LRN3DProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[] = [];
  userCode: string;

  constructor(
      xShape: number[], k: number, n: number, alpha: number, beta: number) {
    
    const n2 = Math.floor(n / 2);
    const max_depth = xShape[2] - 1;
    const f0 = k;
    const f1 = alpha / n;

    this.outputShape = xShape;
 
    this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        
        float sum = 0.0;

        for (int j = max(0, d - ${n2}); j <= min(d + ${n2}, ${max_depth}); j++) {
          sum += pow(getX(batch, r, c, j), 2);
        }

        float value = getX(batch, r, c, d) * pow(${f0} + ${f1} * sum, -${beta});
        setOutput(value);
      }
    `;
    return;
  }
}
