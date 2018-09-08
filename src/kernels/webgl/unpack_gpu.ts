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

export class UnpackProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;

  constructor(outputShape: number[]) {
    this.outputShape = outputShape;

    this.userCode = `
      void main() {
        vec2 modCoord = mod(gl_FragCoord.xy - halfCR, 2.);

        vec4 packedInput = texture2D(A,
          resultUV - step(1., modCoord) * onePixel);

        setOutput(
          modCoord.x == 0. ?
            (modCoord.y == 0. ? packedInput.r : packedInput.b) :
            (modCoord.y == 0. ? packedInput.g : packedInput.a)
        );
      }
    `;
  }
}