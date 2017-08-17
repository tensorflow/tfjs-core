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
import {GPGPUProgram} from './gpgpu_math';

export class Conv2DDerWeightsProgram implements GPGPUProgram {
  variableNames = ['x', 'dy'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: [number, number, number], fSize: number, outputDepth: number,
      stride: number, zeroPad: number) {
    const yShape = conv_util.computeOutputShape3D(
        xShape, fSize, outputDepth, stride, zeroPad);
    const yNumRows = yShape[0];
    const yNumCols = yShape[1];
    const xRowsLimit = xShape[0] - 0.5;
    const xColsLimit = xShape[1] - 0.5;
    this.outputShape =
        conv_util.computeWeightsShape4D(xShape[2], outputDepth, fSize);
    this.params = [stride, zeroPad];
    this.userCode = `
      void main() {
        vec4 coords = getOutputCoords();
        float wR = coords.x;
        float wC = coords.y;
        float d1 = coords.z;
        float d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int yR = 0; yR < ${yNumRows}; yR++) {
          float yR_float = float(yR);
          float xR = wR + yR_float * ${stride}.0 - ${zeroPad}.0;
          if (xR < 0.0 || xR > ${xRowsLimit}) {
            continue;
          }
          for (int yC = 0; yC < ${yNumCols}; yC++) {
            float yC_float = float(yC);
            float xC = wC + yC_float * ${stride}.0 - ${zeroPad}.0;
            if (xC < 0.0 || xC > ${xColsLimit}) {
              continue;
            }
            float dyValue = getDy(yR_float, yC_float, d2);
            float xValue = getX(xR, xC, d1);
            dotProd += (xValue * dyValue);
          }
        }
        setOutput(dotProd);
      }
    `;
  }
}

export class Conv2DTransposeProgram implements GPGPUProgram {
  variableNames = ['x', 'W', 'bias'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: [number, number, number], fSize: number, origInputDepth: number,
      origStride: number, origPad: number, hasBias: boolean) {
    const [xRows, xCols, origOutputDepth] = xShape;
    const biasSnippet = hasBias ? 'dotProd += getBias(d2);' : '';

    // Figure out the output shape by dilating the input.
    const xRowsDilated = (xRows - 1) * origStride + 1;
    const xColsDilated = (xCols - 1) * origStride + 1;
    const pad = fSize - 1 - origPad;
    this.outputShape = conv_util.computeOutputShape3D(
        [xRowsDilated, xColsDilated, origOutputDepth], fSize, origInputDepth, 1,
        pad);
    this.params = [pad, fSize, origStride, hasBias];

    this.userCode = `
      void main() {
        vec3 coords = getOutputCoords();
        float yR = coords.x;
        float yC = coords.y;
        float d2 = coords.z;

        vec2 xRCCorner = vec2(yR, yC) - vec2(${pad}.0, ${pad}.0);
        float xRCorner = xRCCorner.x;
        float xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d2, d1) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${fSize}; wR++) {
          float wR_float = float(wR);
          float xR = (xRCorner + wR_float) / ${origStride}.0;
          if (xR < 0.0 || xR >= ${xRows}.0 || fract(xR) > 0.0) {
            continue;
          }

          float wRPerm = ${fSize}.0 - 1.0 - wR_float;

          for (int wC = 0; wC < ${fSize}; wC++) {
            float wC_float = float(wC);
            float xC = (xCCorner + wC_float) / ${origStride}.0;
            if (xC < 0.0 || xC >= ${xCols}.0 || fract(xC) > 0.0) {
              continue;
            }

            float wCPerm = ${fSize}.0 - 1.0 - wC_float;

            for (int d1 = 0; d1 < ${origOutputDepth}; d1++) {
              float d1_float = float(d1);
              float xValue = getX(xR, xC, d1_float);
              float wValue = getW(wRPerm, wCPerm, d2, d1_float);
              dotProd += xValue * wValue;
            }
          }
        }
        ${biasSnippet}
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
        float d2 = getOutputCoords();

        float derBias = 0.0;
        for (int iyR = 0; iyR < ${yNumRows}; iyR++) {
          float yR = float(iyR);
          for (int iyC = 0; iyC < ${yNumCols}; iyC++) {
            float yC = float(iyC);
            derBias += getDy(yR, yC, d2);
          }
        }
        setOutput(derBias);
      }
    `;
  }
}
