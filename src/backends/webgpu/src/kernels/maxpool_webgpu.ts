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

import {util} from '@tensorflow/tfjs-core';
import {Conv2DInfo} from '@tensorflow/tfjs-core/dist/ops/conv_util';
import {getCoordsDataType} from '../shader_preprocessor';
import {WebGPUProgram} from './webgpu_program';

export class MaxPoolProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['x'];
  uniforms = 'ivec4 xShape, outShape; ' +
      'ivec2 pad, dilation, filterDims, convDims, stride;';
  // tileSize: [number, number, number] = [4, 4, 1];
  tileSize: [number, number, number] = [2, 2, 1];

  constructor(convInfo: Conv2DInfo) {
    this.outputShape = convInfo.outShape;

    const dispatchArrangement = [[1], [2], [0, 3]];

    const arrayProduct = (arr: number[]) => {
      if (!arr.length) {
        throw new Error('Cannot find product of empty array.');
      }
      let product = 1;
      for (let i = 0; i < arr.length; i++) {
        product *= arr[i];
      }
      return product;
    };

    this.dispatch = [
      Math.ceil(
          arrayProduct(dispatchArrangement[0].map(d => this.outputShape[d])) /
          this.tileSize[0]),
      Math.ceil(
          arrayProduct(dispatchArrangement[1].map(d => this.outputShape[d])) /
          this.tileSize[1]),
      Math.ceil(
          arrayProduct(dispatchArrangement[2].map(d => this.outputShape[d])) /
          this.tileSize[2])
    ];

    const generateGetOutputCoords = (shape: number[]) => {
      const dtype = getCoordsDataType(shape.length);
      const globalInvocationPositions = ['x', 'y', 'z'];
      let gatherDimensionsStr = '';
      for (let i = 0; i < dispatchArrangement.length; i++) {
        const arr = dispatchArrangement[i];

        if (arr.length === 1) {
          gatherDimensionsStr += `uint d${arr[0]} = gl_GlobalInvocationID.${
              globalInvocationPositions[i]};`;
        } else {
          const strides =
              util.computeStrides(arr.map(d => this.outputShape[d]));
          gatherDimensionsStr += `uint index${i} = 
            gl_GlobalInvocationID.${globalInvocationPositions[i]};`;
          for (let j = 0; j < strides.length; j++) {
            gatherDimensionsStr += `
              uint d${arr[j]} = index${i} / ${strides[j]};
            `;

            if (j === strides.length - 1) {
              gatherDimensionsStr += `
                uint d${arr[j + 1]} = index${i} - d${arr[j]} * ${strides[j]};
              `;
            } else {
              gatherDimensionsStr += `index${i} -= d${arr[j]} * ${strides[j]};`;
            }
          }
        }
      }

      const dimensions = [];
      for (let i = 0; i < shape.length; i++) {
        dimensions.push(`d${i}`);
      }

      return `
        ${dtype} getOutputCoords() {
          ${gatherDimensionsStr}

          return ${dtype}(${dimensions.join(',')});
        }
      `;
    };

    this.userCode = `
      float initializationValue = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= convDims.x) {
          return initializationValue;
        }
        return x[getFlatIndex(ivec4(batch, xR, xC, d), xShape)];
      }

      ${generateGetOutputCoords(this.outputShape)}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];
        uint index = getFlatIndex(coords, outShape);

        ivec2 xRCCorner = coords.yz * stride - pad;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        float minMaxValue = 0.0;

        for(int wR=0; wR<filterDims.y; wR += dilation.y) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= convDims.y) {
            continue;
          }

          for(int wC=0; wC<filterDims.x; wC += dilation.x) {
            int xC = xCCorner + wC * dilation.x;

            float value = getValue(batch, xR, xC, d);

            minMaxValue = max(value, minMaxValue);
          }
        }

        setOutput(index, minMaxValue);
      }
    `;
  }
}