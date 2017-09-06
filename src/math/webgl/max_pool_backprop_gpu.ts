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

import {OutputInfo} from '../conv_util';

import {GPGPUProgram} from './gpgpu_math';

export class MaxPool2DBackpropProgram implements GPGPUProgram {
  variableNames = ['dy', 'maxPos'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: [number, number, number], filterHeight: number,
      filterWidth: number, strideHeight: number, strideWidth: number,
      outputInfo: OutputInfo) {
    this.outputShape = xShape;
    const dyRows = outputInfo.shape[0];
    const dyCols = outputInfo.shape[1];
    const padTop = filterHeight - 1 - outputInfo.paddingInfo.top;
    const padLeft = filterWidth - 1 - outputInfo.paddingInfo.left;
    this.params =
        [filterHeight, filterWidth, strideHeight, strideWidth, padTop, padLeft];

    const lastIndex = filterHeight * filterWidth - 1;
    this.userCode = `
      const ivec2 pads = ivec2(${padTop}, ${padLeft});

      void main() {
        ivec3 coords = getOutputCoords();
        int d = coords.z;

        ivec2 dyRCCorner = coords.xy - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${filterHeight}; wR++) {
          float dyR = float(dyRCorner + wR) / ${strideHeight}.0;

          if (dyR < 0.0 || dyR >= ${dyRows}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${filterWidth}; wC++) {
            float dyC = float(dyCCorner + wC) / ${strideWidth}.0;

            if (dyC < 0.0 || dyC >= ${dyCols}.0 || fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(idyR, idyC, d);
            int maxPosValue = ${lastIndex} - int(getMaxPos(idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${filterWidth} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `;
  }
}
