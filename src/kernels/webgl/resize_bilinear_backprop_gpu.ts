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

import {Tensor4D} from '../../tensor';

import {GPGPUProgram} from './gpgpu_math';

export class ResizeBilinearBackpropProgram implements GPGPUProgram {
  variableNames = ['dy'];
  outputShape: number[] = [];
  userCode: string;

  constructor(dy: Tensor4D, x: Tensor4D, y: Tensor4D, alignCorners: boolean) {
    this.outputShape = x.shape;
    const [, xHeight, xWidth, ] = x.shape;
    const [, yHeight, yWidth] = y.shape;

    // In the backwards pass, we want to find the pixels that were generated for
    // each pixel in the input image the forward pass and add the corresponding
    // coefficient from dy to the gradient (with some interpolation).

    const effectiveXSize: [number, number] = [
      (alignCorners && yHeight > 1) ? xHeight - 1 : xHeight,
      (alignCorners && yWidth > 1) ? xWidth - 1 : xWidth
    ];

    const effectiveYSize: [number, number] = [
      (alignCorners && yHeight > 1) ? yHeight - 1 : yHeight,
      (alignCorners && yWidth > 1) ? yWidth - 1 : yWidth
    ];

    const heightScale = effectiveXSize[0] / effectiveYSize[0];
    const widthScale = effectiveXSize[1] / effectiveYSize[1];

    console.log('constructing gpu program obj');

    this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        // Loop over dy
        for (int ry = 0; ry < ${yHeight}; ry++) {
          for (int cy = 0; cy < ${yWidth}; cy++) {
            float inY = float(ry) * ${heightScale};
            int topYIndex = int(floor(inY));
            int bottomYIndex = int(min(ceil(inY), ${xHeight - 1}.0));
            float yLerp = inY - float(topYIndex);
            float inverseYLerp = 1.0 - yLerp;

            float inX = float(cy) * ${widthScale};
            int leftXIndex = int(floor(inX));
            int rightXIndex = int(min(ceil(inX), ${xWidth - 1}.0));
            float xLerp = inX - float(leftXIndex);
            float inverseXLerp = 1.0 - xLerp;

            if (r == topYIndex && c == leftXIndex) {
              // topLeft
              accumulator += getDy(b, ry, cy, d) * inverseYLerp * inverseXLerp;
            }

            if (r == topYIndex && c == rightXIndex) {
              // topRight
              accumulator += getDy(b, ry, cy, d) * inverseYLerp * xLerp;
            }

            if (r == bottomYIndex && c == leftXIndex) {
              // bottomLeft
              accumulator += getDy(b, ry, cy, d) * yLerp * inverseXLerp;
            }

            if (r == bottomYIndex && c == rightXIndex) {
              // bottomRight
              accumulator += getDy(b, ry, cy, d) * yLerp * xLerp;

            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `;
  }
}
