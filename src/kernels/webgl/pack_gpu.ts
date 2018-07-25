/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

export class PackProgram implements GPGPUProgram {
  variableNames = ['A'];
  userCode: string;
  outputShape: number[];

  constructor(aShape: [number, number]) {
    this.outputShape = aShape;
    this.userCode = `
      void main() {

        ivec2 coords = getOutputCoords() * ivec2(2);
        // -------
        // | a b |
        // | c d |
        // -------
        float a = getA(coords.x, coords.y);
        float b = getA(coords.x, coords.y + 1);
        float c = getA(coords.x + 1, coords.y);
        float d = getA(coords.x + 1, coords.y + 1);
        gl_FragColor = vec4(a, b, c, d);
      }
    `;
  }
}
