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

import {Conv2DInfo} from '../../ops/conv_util';
import {GPGPUProgram} from './gpgpu_math';

export class DepthwiseConv2DPackedProgram implements GPGPUProgram {
  variableNames = ['x', 'W'];
  packedInputs = true;
  outputShape: number[];
  userCode: string;

  constructor(convInfo: Conv2DInfo) {
    this.outputShape = convInfo.outShape;

    const xNumRows = convInfo.inHeight;
    const xNumCols = convInfo.inWidth;
    const padTop = convInfo.padInfo.top;
    const padLeft = convInfo.padInfo.left;
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const channelMul = convInfo.outChannels / convInfo.inChannels;

    this.userCode = `
      const vec2 strides = vec2(${strideHeight}, ${strideWidth});
      const vec2 pads = vec2(${padTop}, ${padLeft});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;

        vec4 result = vec4(0);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            // one channel
            int d2 = coords.w + col;
            int d1 = d2 / ${channelMul};
            int q = d2 - d1 * ${channelMul};

            vec2 xRCCorner = dot(vec2(coords.y, coords.z + row), strides) - pads;
            int xRCorner = int(xRCCorner.x);
            int xCCorner = int(xRCCorner.y);

            float dotProd = 0.0;

            for(int wR = 0; wR < ${filterHeight}; wR += 2) {
              int xR = xRCorner + wR * ${dilationHeight};

              if(xR < 0 || xR >= ${xNumRows}) {
                continue;
              }

              for(int wC = 0; wC < ${filterWidth}; wC += 2) {
                int xC = xCCorner + wC * ${dilationWidth};

                if(xC < 0 || xC >= ${xNumCols}) {
                  continue;
                }

                vec4 xVal = getX(batch, xR, xC, d1);
                vec4 wVal = getW(wR, wC, d1, q);
                dotProd += dot(xVal, wVal);
              }

            }

            result[row * 2 + col] = dotProd;
          }
        }

        gl_FragColor = result;
      }
    `;
  }
}