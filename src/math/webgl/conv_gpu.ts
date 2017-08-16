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

export class Conv2DProgram implements GPGPUProgram {
  variableNames = ['x', 'W', 'bias'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(xShape: [number, number, number], fieldSize: number,
      outputDepth: number, stride: number, pad: number, hasBias: boolean) {
    this.outputShape = conv_util.computeOutputShape3D(xShape,
      fieldSize, outputDepth, stride, pad);
    const inputDepth = xShape[2];
    this.params = [inputDepth, fieldSize, stride, pad, hasBias];

    this.userCode = `
      void main() {
        vec3 output = getOutputCoords();
        float yR = output.x;
        float yC = output.y;
        float d2 = output.z;

        vec2 xRCCorner = vec2(yR, yC) * vec2(${stride}, ${stride}) -
            vec2(${pad}.0, ${pad}.0);
        float xRCorner = xRCCorner.x;
        float xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${fieldSize}; wR++) {
          float wR_float = float(wR);
          float xR = xRCorner + wR_float;

          for (int wC = 0; wC < ${fieldSize}; wC++) {
            float wC_float = float(wC);
            float xC = xCCorner + wC_float;

            for (int d1 = 0; d1 < ${inputDepth}; d1++) {
              float d1_float = float(d1);
              float xValue = getXOrZeroPad(xR, xC, d1_float);
              float wValue = getW(wR_float, wC_float, d1_float, d2);
              dotProd += xValue * wValue;
            }
          }
        }
        if (${hasBias}) {
          dotProd += getBias(d2);
        }
        setOutput(dotProd);
      }
    `;
  }
}

export function getFragmentShaderPrologueSource(): string {
  return `
    precision highp float;
    uniform sampler2D x;
    uniform sampler2D weights;
    uniform sampler2D biases;
    varying vec2 resultUV;`;
}

export function getFragmentShaderGetMatrixValueOrZeroPadSource(): string {
  return `
    float getMatrixValueOrZeroPad(in sampler2D matrix, vec2 matrixShapeCR,
        vec2 requestedCR) {
      vec2 uv = (requestedCR + vec2(0.5, 0.5)) / matrixShapeCR;
      float value = texture2D(matrix, uv).r;
      bool lessThanZero = any(lessThan(uv, vec2(0, 0)));
      bool greaterThanOne = any(greaterThan(uv, vec2(1, 1)));
      bool outside = lessThanZero || greaterThanOne;
      return mix(value, 0.0, float(outside));
    }`;
}

export function getFragmentShaderGetBiasValueSource(outputDepth: number):
    string {
  return `
    float getBiasValue(in sampler2D bias, float biasC) {
      const vec2 biasShapeCR = vec2(${outputDepth}, 1);
      vec2 biasCR = vec2(mod(biasC, ${outputDepth}.0), 0);
      vec2 biasUV = (biasCR + vec2(0.5, 0.5)) / biasShapeCR;
      return texture2D(bias, biasUV).r;
    }`;
}
