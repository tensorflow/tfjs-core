/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import * as conv_util from '../conv_util';
import {OutputInfo} from '../conv_util';
import {GPGPUProgram} from './gpgpu_math';

export class Conv2DDerWeightsProgram implements GPGPUProgram {
  variableNames = ['x', 'dy'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: [number, number, number], filterHeight: number,
      filterWidth: number, strideHeight: number, strideWidth: number,
      outputInfo: OutputInfo) {
    const [yNumRows, yNumCols, outDepth] = outputInfo.shape;
    const [xNumRows, xNumCols, inDepth] = xShape;

    this.outputShape = conv_util.computeWeightsShape4D(
        inDepth, outDepth, filterHeight, filterWidth);
    const padTop = outputInfo.paddingInfo.top;
    const padLeft = outputInfo.paddingInfo.left;

    this.params = [strideHeight, strideWidth, padLeft, padTop];

    this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int yR = 0; yR < ${yNumRows}; yR++) {
          int xR = wR + yR * ${strideHeight} - ${padTop};

          if (xR < 0 || xR >= ${xNumRows}) {
            continue;
          }

          for (int yC = 0; yC < ${yNumCols}; yC++) {
            int xC = wC + yC * ${strideWidth} - ${padLeft};

            if (xC < 0 || xC >= ${xNumCols}) {
              continue;
            }

            float dyValue = getDy(yR, yC, d2);
            float xValue = getX(xR, xC, d1);
            dotProd += (xValue * dyValue);
          }
        }
        setOutput(dotProd);
      }
    `;
  }
}

export class Conv2DDerInputProgram implements GPGPUProgram {
  variableNames = ['dy', 'W'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      dyShape: [number, number, number], filterHeight: number,
      filterWidth: number, strideHeight: number, strideWidth: number,
      outputInfo: OutputInfo) {
    const [yRows, yCols, outDepth] = dyShape;

    this.outputShape = outputInfo.shape;
    const padTop = outputInfo.paddingInfo.top;
    const padLeft = outputInfo.paddingInfo.left;
    this.params = [strideHeight, strideWidth, padLeft, padTop];

    this.userCode = `
      const ivec2 pads = vec2(${padTop}, ${padLeft});

      void main() {
        ivec3 coords = getOutputCoords();
        int d1 = coords.z;

        ivec2 dyCorner = coords.xy - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${filterHeight}; wR++) {
          float dyR = float(dyRCorner + wR) / ${strideHeight}.0;

          if (dyR < 0.0 || dyR >= ${yRows}.0 || fract(dyR) > 0.0) {
            continue;
          }
          idyR = int(dyR);

          int wRPerm = ${filterHeight} - 1 - wR;

          for (int wC = 0; wC < ${filterWidth}; wC++) {
            float dyC = float(dyCCorner + wC) / ${strideWidth}.0;

            if (dyC < 0.0 || dyC >= ${yCols}.0 || fract(dyC) > 0.0) {
              continue;
            }
            idyC = int(dyC);

            int wCPerm = ${filterWidth} - 1 - wC;

            for (int d2 = 0; d2 < ${outDepth}; d2++) {
              float xValue = getDy(idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, d2);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `;
  }
}

export class Conv2DDerBiasProgram implements GPGPUProgram {
  variableNames = ['dy'];
  params: Array<{}> = [];
  outputShape: number[];
  userCode: string;

  constructor(yShape: [number, number, number]) {
    const [yNumRows, yNumCols, outputDepth] = yShape;
    this.outputShape = [outputDepth];
    this.userCode = `
      void main() {
        int d2 = getOutputCoords();

        float derBias = 0.0;
        for (int yR = 0; yR < ${yNumRows}; yR++) {
          for (int yC = 0; yC < ${yNumCols}; yC++) {
            derBias += getDy(yR, yC, d2);
          }
        }
        setOutput(derBias);
      }
    `;
  }
}
