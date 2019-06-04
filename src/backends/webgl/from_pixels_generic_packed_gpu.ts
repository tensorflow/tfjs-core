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

import {getGlslDifferences} from './glsl_version';
import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';

export class FromPixelsGenericPackedProgram implements GPGPUProgram {
  variableNames = ['A'];
  userCode: string;
  outputShape: number[];

  constructor(outputShape: number[], texShape: [number, number]) {
    const glsl = getGlslDifferences();
    const [width, height] = texShape;
    this.outputShape = outputShape;
    const rank = outputShape.length;
    const dtype = getCoordsDataType(rank);

    this.userCode = `
      void main() {
        ${dtype} coords = getOutputCoords();

        int flatIndex = coords; // TODO: generalize beyond rank=1

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            int r = flatIndex / ${width};
            int c = imod(flatIndex, ${width});
            vec2 uv = (vec2(c, r) + halfCR) / vec2(${width}.0, ${height}.0);

            vec4 values = ${glsl.texture2D}(A, uv);

            int channelIndex = row * 2 + col;
            result[channelIndex] = values[channelIndex];
          }
        }

        ${glsl.output} = result;
      }
    `;
  }
}
