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

export class CropAndResizeBackpropBoxesProgram implements GPGPUProgram {
  variableNames = ['dy', 'image', 'boxes', 'boxInd'];
  outputShape: number[] = [];
  userCode: string;

  constructor(gradShape: [number, number, number, number], imageShape: [number, number, number, number]) {
    const [batch, xHeight, xWidth, depth] = imageShape;
    const [numBoxes, yHeight, yWidth, ,] = gradShape;
    this.outputShape = [numBoxes, 4];

    const heightRatio = yHeight > 1 ? (xHeight - 1) / (yHeight - 1) : 0;
    const widthRatio = yWidth > 1 ? (xWidth - 1) / (yWidth - 1) : 0;

    this.userCode = `
    void main() {
      ivec2 coords = getOutputCoords();
      int b = coords[0];
      int r = coords[1];

      // get box vals
      int y1 = getBoxes(b,0);
      int x1 = getBoxes(b,1);
      int y2 = getBoxes(b,2);
      int x2 = getBoxes(b,3);

      // get image in batch index
      int bInd = getBoxInd(b);
      if(bInd < 0 || bInd >= ${batch}) {
        return;
      }

      float accumulator = 0.0;

      float height_scale = (${yHeight} > 1)
      ? (y2-y1) * ${heightRatio}
      : 0;
      float width_scale = (${yWidth} > 1)
      ? (x2-x1) * ${widthRatio}
      : 0;

      // Loop over dy
      for (int dyR = 0; dyR < ${yHeight}; dyR++) {
        for (int dyC = 0; dyC < ${yWidth}; dyC++) {
          float in_y = (${yHeight} > 1)
          ? y1 * (${xHeight - 1} + dyR*(height_scale)
          : 0.5 * (y1+y2) * ${xHeight - 1};
          if( in_y < 0 || in_y > ${xHeight - 1} ) {
            continue;
          }

          float in_x = (${yWidth} > 1)
          ? x1 * (${xWidth - 1} + dyC*(width_scale)
          : 0.5 * (x1+x2) * ${xWidth - 1};
          if( in_x < 0 || in_x > ${xWidth - 1} ) {
            continue;
          }

          // Fractional source index.
          vec2 sourceFracIndexRC = vec2(in_y,in_x)
          ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
          ivec2 sourceCeilRC = ivec2(ceil(sourceFracIndexRC));
          vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

          for (int dyD = 0; dyD < ${depth}; dyC++) {
            float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, dyD);
            float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, dyD);
            float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, dyD);
            float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, dyD);

            // Compute the image gradient.
            float image_grad_y = (1 - fracRC[1]) * (bottomLeft - topLeft) +
                                 fracRC[1] * (bottomRight - topRight);
            float image_grad_x = (1 - fracRC[0]) * (topRight - topLeft) +
                                 fracRC[0] * (bottomRight - bottomLeft);

            // Modulate the image gradient with the incoming gradient.
            const float top_grad = getdy(bInd,dyR,dyC,dyD);
            image_grad_y *= top_grad;
            image_grad_x *= top_grad;

            if(r == 0) {
              float dy1 = (crop_width > 1)
              ? image_grad_y * (image_height - 1 - y * height_ratio)
              : image_grad_y * 0.5 * (image_height - 1);
              accumulator += dy1
            }
            else if(r == 1) {
              float dx1 = (crop_width > 1)
              ? image_grad_x * (image_width - 1 - x * width_ratio)
              : image_grad_x * 0.5 * (image_width - 1);
              accumulator += dx1
            }
            else if(r == 2) {
              float dy2 = (crop_width > 1)
              ? image_grad_y * (y * height_ratio)
              : image_grad_y * 0.5 * (image_height - 1);
              accumulator += dy2
            }
            else{
              float dx2 = (crop_width > 1)
              ? image_grad_x * (x * width_ratio)
              : image_grad_x * 0.5 * (image_width - 1);
              accumulator += dx2
            }
          }
        }
      }
      setOutput(accumulator);
    }
    `;
  }
}
