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

import {GPGPUProgram} from './gpgpu_math';

export class CropAndResizeBackpropImageProgram implements GPGPUProgram {
  variableNames = ['dy', 'boxes', 'boxInd'];
  outputShape: number[] = [];
  userCode: string;

  constructor(
      gradShape: [number, number, number, number],
      imageShape: [number, number, number, number],
      method: 'bilinear'|'nearest') {
    const [batch, imageHeight, imageWidth, depth] = imageShape;
    const [numBoxes, cropHeight, cropWidth, ] = gradShape;
    this.outputShape = [batch, imageHeight, imageWidth, depth];
    if (numBoxes === 0) {
      this.variableNames = [];
      this.userCode = 'void main() {setOutput(0);}';
      return;
    }
    const methodId = method === 'bilinear' ? 1 : 0;
    /*
    const heightScale = (cropHeight > 1) ?
    (imageHeight - 1) / (cropHeight - 1) : 0;
    const widthScale = (cropWidth > 1) ?
    (imageWidth - 1) / (cropWidth - 1) : 0;
    */

    const [xHeightFloat, xWidthFloat] =
    [`${imageHeight - 1}.0`, `${imageWidth - 1}.0`];
    const [yHeightFloat, yWidthFloat] =
    [`${cropHeight - 1}.0`, `${cropWidth - 1}.0`];
    /*
        const heightScale = (cropHeight > 1)
        ? (imageHeight - 1) / (cropHeight - 1) : 0;
        const invHeightScale =
            (cropHeight > 1) ? (cropHeight - 1) / (imageHeight - 1) : 0;
        const widthScale = (cropWidth > 1) ? (imageWidth - 1) / (cropWidth - 1)
        : 0; const invWidthScale = (cropWidth > 1) ? (cropWidth - 1) /
        (imageWidth - 1) : 0; const winHeight = (Math.ceil(invHeightScale) * 2)
        + 2; const winWidth = (Math.ceil(invWidthScale) * 2) + 2;
        */

    this.userCode = `void main() {
      ivec4 coords = getOutputCoords();
      int batch = coords[0];
      int y = coords[1];
      int x = coords[2];
      int d = coords[3];

      float accumulator = 0.0;

      for(int b = 0; b < ${numBoxes}; b++) {
        int bInd = int(floor(getBoxInd(b)));
        if(bInd != batch) {
          continue;
        }

        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        float height_scale = (${cropHeight} > 1)
        ? (y2-y1) * ${xHeightFloat}/${yHeightFloat}
        : 0.0;
        float width_scale = (${cropWidth} > 1)
        ? (y2-y1) * ${xWidthFloat}/${yWidthFloat}
        : 0.0;

        // Loop over dy
        for (int dyR = 0; dyR < ${cropHeight}; dyR++) {
          float in_y = ${cropHeight > 1}
          ? y1*${xHeightFloat} + float(dyR)*(height_scale)
          : 0.5 * (y1+y2) * ${xHeightFloat};

          if( in_y < 0.0 || in_y > ${xHeightFloat} ) {
            continue;
          }

          for (int dyC = 0; dyC < ${cropWidth}; dyC++) {
            float in_x = ${cropWidth > 1}
            ? x1*${xWidthFloat} + float(dyC)*(width_scale)
            : 0.5 * (x1+x2) * ${xWidthFloat};
            if( in_x < 0.0 || in_x > ${xWidthFloat} ) {
              continue;
            }

            vec2 sourceFracIndexRC = vec2(in_y,in_x);
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
              ivec2 sourceNearestRC = ivec2(floor(
              sourceFracIndexRC + vec2(0.5,0.5)));
              if (y == sourceNearestRC[0] && y == sourceNearestRC[1]) {
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