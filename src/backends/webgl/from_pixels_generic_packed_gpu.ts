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

import * as util from '../../util';

import {getGlslDifferences} from './glsl_version';
import {GPGPUProgram} from './gpgpu_math';
import * as shader_util from './shader_compiler_util';

export class FromPixelsGenericPackedProgram implements GPGPUProgram {
  variableNames = ['A'];
  userCode: string;
  outputShape: number[];

  constructor(outputShape: [number, number, number], texShape: [
    number, number
  ]) {
    const glsl = getGlslDifferences();
    const [width, height] = texShape;
    this.outputShape = outputShape;

    this.userCode = `
      ${getFlatIndex(outputShape)}

      void main() {
        ivec3 coords = getOutputCoords();

        vec4 result = vec4(0.);
        
        int flatIndex = getFlatIndex(coords);
        
        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            ivec3 localCoords = coords;
            
            if(localCoords[2] + col <= ${outputShape[2]}) {
              localCoords[2] += col;
            }
            
            if(localCoords[1] + row <= ${outputShape[1]}) {
              localCoords[1] += row;
            }
            
            flatIndex = getFlatIndex(localCoords);
            int offset = imod(flatIndex, 4);

            int r = (flatIndex / 4) / ${width};
            int c = imod((flatIndex / 4), ${width});
            vec2 uv = (vec2(c, r) + halfCR) / vec2(${width}.0, ${height}.0);

            vec4 values = ${glsl.texture2D}(A, uv);

            int channelIndex = row * 2 + col;
            result[channelIndex] = values[offset];
          }
        }

        ${glsl.output} = result;
      }
    `;
  }
}

function getFlatIndex(shape: [number, number, number]): string {
  const dotCoordsWithStrides = shader_util.dotify(
      ['coords.x', 'coords.y', 'coords.z'],
      util.computeStrides(shape).map(d => d.toString()).concat(['1.']));

  return `
    int getFlatIndex(ivec3 coords) {
      return round(${dotCoordsWithStrides});
    }
  `;
}