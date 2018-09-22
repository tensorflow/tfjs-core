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

import {Conv2DInfo} from '../../ops/conv_util';
import {GPGPUProgram} from './gpgpu_math';

export class Im2ColProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;

  constructor(outputShape: number[], inputShape: number[], convInfo: Conv2DInfo) {
    this.outputShape = outputShape;

    const {filterWidth, inChannels, strideWidth, strideHeight} = convInfo;
    const inputWidth = inputShape[1];
    const numBlocksAcross = 1 + (inputWidth - filterWidth) / strideWidth;
    const itemsPerFilterRow = inChannels * filterWidth;

    this.userCode = `
      void main() {
        ivec2 rc = getOutputCoords();

        vec4 result = vec4(0);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            int blockIndex = rc.y + col;
            float pos = float(rc.x + row);

            if(blockIndex >= ${outputShape[1]} || pos >= ${outputShape[0]}.) continue;

            int offsetY = int(blockIndex / (${numBlocksAcross})) * ${strideHeight};
            float offsetX = mod(float(blockIndex), ${numBlocksAcross}.) * ${strideWidth}.;

            int d2 = int(mod(pos, ${inChannels}.));
            int d0 = int(pos / ${itemsPerFilterRow}.);
            float d1 = mod(pos, ${itemsPerFilterRow}.) / ${inChannels}.;

            result[row * 2 + col] = getA(d0 + offsetY, int(d1 + offsetX), d2);
          }
        }

        gl_FragColor = result;
      }
    `;
  }
}
