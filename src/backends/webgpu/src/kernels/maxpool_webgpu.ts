/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {Conv2DInfo} from '@tensorflow/tfjs-core/dist/ops/conv_util';

import {WebGPUProgram} from './webgpu_program';

export class MaxPoolProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['x'];
  uniforms = 'uvec4 inpShape, outShape; uvec2 pad, stride;';
  tileSize: [number, number, number] = [4, 8, 1];

  constructor(convInfo: Conv2DInfo) {
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const padTop = convInfo.padInfo.top;
    const padLeft = convInfo.padInfo.left;
    const effectiveFilterHeight = convInfo.effectiveFilterHeight;
    const effectiveFilterWidth = convInfo.effectiveFilterWidth;

    this.outputShape = convInfo.outShape;
    this.dispatch = [
      Math.ceil(this.outputShape[2] / this.tileSize[0]),
      Math.ceil(this.outputShape[1] / this.tileSize[1]),
      Math.ceil(this.outputShape[0] * this.outputShape[3] / this.tileSize[2]),
    ];

    // const returnValue = `max(max(max(` +
    //     'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
    const xShape = `ivec4(${convInfo.inShape.join(',')})`;

    this.userCode = `
      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});
      float initializationValue = 0.0;
      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${convInfo.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        // return getX(batch, xR, xC, d);
        return x[getFlatIndex(ivec4(batch, xR, xC, d), ${xShape})];
      }

      void main() {
        uint index = 0;
        ivec4 coords = getOutputCoords(index);
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        float minMaxValue = 0.0;
        float avgValue = 0.0;
        count = 0.0;

        for(int wR=0; wR<${effectiveFilterHeight}; wR += ${dilationHeight}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${convInfo.inHeight}) {
            continue;
          }

          for(int wC=0; wC<${effectiveFilterWidth}; wC += ${dilationWidth}) {
            int xC = xCCorner + wC * ${dilationWidth};

            float value = getValue(batch, xR, xC, d);

            minMaxValue = max(value, minMaxValue);
          }
        }

        setOutput(index, minMaxValue);
      }
    `;
  }
}