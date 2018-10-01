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

export class W2RowDepthwiseProgram implements GPGPUProgram {
  variableNames = ['W'];
  outputShape: number[];
  userCode: string;

  constructor(
      outputShape: number[], inputShape: number[], convInfo: Conv2DInfo) {
    this.outputShape = outputShape;

    const filterWidth = convInfo.filterWidth;
    const inChannels = convInfo.inChannels;
    const itemsPerFilterRow = inChannels * filterWidth;
    const multiplier = convInfo.filterShape[3];

    this.userCode = `
      void main() {
        ivec2 rc = getOutputCoords();

        vec4 result = vec4(0);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            int r = rc.x + row;
            int c = rc.y + col;

            if(c >= ${outputShape[1]} || r >= ${outputShape[0]}) continue;

            int d2 = int(r / ${multiplier});
            if(int(mod(float(c), ${inChannels}.)) != d2) continue;

            int d0 = int(c / ${itemsPerFilterRow});
            float d0Remain = mod(float(c), ${itemsPerFilterRow}.);
            int d1 = int(d0Remain / ${inChannels}.);
            int d3 = int(mod(float(r), ${multiplier}.));

            result[row * 2 + col] = getW(d0, d1, d2, d3);
          }
        }

        gl_FragColor = result;
      }
    `;
  }
}
