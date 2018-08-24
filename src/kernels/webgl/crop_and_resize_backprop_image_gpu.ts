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

import { GPGPUProgram } from './gpgpu_math';

export class CropAndResizeBackpropImageProgram implements GPGPUProgram {
  variableNames = ['dy', 'boxes', 'boxInd'];
  outputShape: number[] = [];
  userCode: string;

  constructor(gradShape: [number, number, number, number],
    imageShape: [number, number, number, number],
    method: 'bilinear' | 'nearest') {
    const [batch, imageHeight, imageWidth, depth] = imageShape;
    const [numBoxes, cropHeight, cropWidth,] = gradShape;
    this.outputShape = [batch, imageHeight, imageWidth, depth];
    const methodId = method === 'bilinear' ? 1 : 0;

    // This defines the size of the window of values around a particular
    // index in dy that we want to search for contributions to dx.
    const heightScale = (cropHeight > 1)
    ? (imageHeight - 1) / (cropHeight - 1)
    : 0;
    const invHeightScale = (cropHeight > 1)
    ? (cropHeight - 1) / (imageHeight - 1)
    : 0;
    const widthScale = (cropWidth > 1)
    ? (imageWidth - 1) / (cropWidth - 1)
    : 0;
    const invWidthScale = (cropWidth > 1)
    ? (cropWidth - 1) / (imageWidth - 1)
    : 0;
    const winHeight = (Math.ceil(invHeightScale) * 2) + 2;
    const winWidth = (Math.ceil(invWidthScale) * 2) + 2;

    this.userCode = `
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int y = coords[1];
      int x = coords[2];
      int d = coords[3];

      float accumulator = 0.0;
      float height_scale = (${cropHeight} > 1)
      ? (y2-y1) * ${imageHeight - 1}/${cropHeight - 1}
      : 0;
      float width_scale = (${cropWidth} > 1)
      ? (y2-y1) * ${imageWidth - 1}/${cropWidth - 1}
      : 0;
      float invHeightScale = float(${invHeightScale});
      float invWidthScale = float(${invWidthScale});
      int winHeight = int(${winHeight});
      int winWidth = int(${winWidth});

      for(int b = 0; b < ${numBoxes}; b++) {
        int bInd = getBoxInd(b);
        if(bInd != batch) {
          continue;
        }

        int y1 = getBoxes(b,0);
        int x1 = getBoxes(b,1);
        int y2 = getBoxes(b,2);
        int x2 = getBoxes(b,3);

        // per box, the input element can contribute to any pixel in crop
        // that floored/ceiled to its value, therefore get inverse mappings
        // and compute possible range based on crop box size

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        float cropHeight = (y2-y1)*${imageHeight};
        float cropWidth = (x2-x1)*${imageWidth};
        float winScale = cropHeight/${cropHeight};
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${cropHeight}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${cropWidth}) {
              continue;
            }

            float in_y = float(dyR) * ${heightScale};
            float in_x = float(dyC) * ${widthScale};
            if( in_y < 0 || in_y > ${imageHeight - 1} ||
                in_x < 0 || in_x > ${imageWidth - 1} ) {
              continue;
            }
            vec2 sourceFracIndexRC =
              vec2(float(dyR) * ${heightScale},float(dyC) * ${widthScale})
            if(${methodId} == 1) {
              // Fractional source index.
              ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
              ivec2 sourceCeilRC = ivec2(ceil(sourceFracIndexRC));
              vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);
              vec2 invFracRC = vec2(1.0,1.0) - fracRC;

              if (y == sourceFloorRC[0] && x == sourceFloorRC[1]) {
                // topLeft
                accumulator +=
                  getDy(b, dyR, dyC, d) * invFracRC[0] * invFracRC[1];
              }

              if (y == sourceFloorRC[0] && x == sourceCeilRC[1]) {
                // topRight
                accumulator += getDy(b, dyR, dyC, d) * invFracRC[0] * fracRC[1];
              }

              if (y == sourceCeilRC[0] && x == sourceFloorRC[1]) {
                // bottomLeft
                accumulator += getDy(b, dyR, dyC, d) * fracRC[0] * invFracRC[1];
              }

              if (y == sourceCeilRC[0] && x == sourceCeilRC[1]) {
                // bottomRight
                accumulator += getDy(b, dyR, dyC, d) * fracRC[0] * fracRC[1];
              }
            } else {
              int sourceNearestRow = int(min(
                float(int(${imageHeight}) - 1),
                float(round(sourceFracIndexRC[0]))
              ));
              int sourceNearestCol = int(min(
                float(int(${imageWidth}) - 1),
                float(round(sourceFracIndexRC[1]))
              ));
              if (x == sourceNearestRow && y == sourceNearestCol) {
                accumulator += getDy(b, dyR, dyC, d);
              }
            }
          }
        }
        // End loop over region of box in dy
      }
      // End loop over box in dy
      setOutput(accumulator);
    }
  `;
  }
}
