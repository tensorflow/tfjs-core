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
        vec2 onePixel = vec2(1.) / vec2(${outputShape[1]}, ${outputShape[0]});
        vec2 modCoord = mod(gl_FragCoord.xy - halfCR, vec2(2.0));

        vec4 packedInput = texture2D(A, vec2(
          resultUV.x - (step(1., modCoord.x) * onePixel.x),
          resultUV.y - (step(1., modCoord.y) * onePixel.y)
        ));

        gl_FragColor = vec4(
          modCoord.x == 0.0 ?
            (modCoord.y == 0.0 ? packedInput.r : packedInput.b) :
            (modCoord.y == 0.0 ? packedInput.g : packedInput.a),
          0, 0, 0
        );
      }
    `;
  }
}