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

  constructor(
      outputShape: number[], inputShape: number[], convInfo: Conv2DInfo) {
    this.outputShape = outputShape;

    const {
      filterWidth,
      inChannels,
      strideWidth,
      strideHeight,
      padInfo,
      outWidth,
      dilationWidth,
      dilationHeight
    } = convInfo;
    const {left, top} = padInfo;
    const itemsPerBlockRow = inChannels * filterWidth;

    console.log(convInfo);

    this.userCode = `
      void main() {
        ivec2 rc = getOutputCoords();

        vec4 result = vec4(0);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            int blockIndex = rc.y + col;
            float pos = float(rc.x + row);

            if(blockIndex >= ${outputShape[1]} || pos >= ${outputShape[0]}.) continue;

            int offsetY = ${top} + int(blockIndex / (${outWidth})) * ${strideHeight};
            int offsetX = int(${left}. + mod(float(blockIndex), ${outWidth}.) * ${strideWidth}.);

            int d2 = int(mod(pos, ${inChannels}.));
            int d0 = ${dilationHeight} * (offsetY + int(pos / ${itemsPerBlockRow}.));
            int d1 = ${dilationWidth} * (offsetX + int(mod(pos, ${itemsPerBlockRow}.) / ${inChannels}.));

            if(d0 >= ${inputShape[0]} || d1 >= ${inputShape[1]}) continue;

            result[row * 2 + col] = getA(d0, d1, d2);
          }
        }

        gl_FragColor = result;
      }
    `;
  }
}
