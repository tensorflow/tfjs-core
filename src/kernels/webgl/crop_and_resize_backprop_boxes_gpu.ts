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

export class CropAndResizeBackpropBoxesProgram implements GPGPUProgram {
  variableNames = ['dy', 'image', 'boxes', 'boxInd'];
  outputShape: number[] = [];
  userCode: string;

  constructor(gradShape: [number, number, number, number], imageShape: [
    number, number, number, number
  ]) {
    const [batch, xHeight, xWidth, depth] = imageShape;
    const [numBoxes, yHeight, yWidth, , ] = gradShape;
    this.outputShape = [numBoxes, 4];

    const [xHeightFloat, yHeightFloat] =
      [`${xHeight - 1}.0`, `${yHeight - 1}.0`];
    const [xWidthFloat, yWidthFloat] = [`${xWidth - 1}.0`, `${yWidth - 1}.0`];
    const [heightRatio, heightScale, inY, dy1, dy2] = yHeight > 1 ?
      [
        `${xHeightFloat}/${yHeightFloat}`,
        '(y2-y1) * height_ratio',
        `y1*${xHeightFloat} + float(dyR)*(height_scale)`,
        `image_grad_y * (${xHeightFloat} - float(y)*height_ratio)`,
        'image_grad_y * float(y) * height_ratio',
      ] :
      [
        '0.0',
        '0.0',
        `0.5 * (y1+y2) * ${xHeightFloat}`,
        `image_grad_y * 0.5 * ${xHeightFloat}`,
        `image_grad_y * 0.5 * ${xHeightFloat}`,
      ];
    const [widthRatio, widthScale, inX, dx1, dx2] = yWidth > 1 ?
      [
        `${xWidthFloat}/${yWidthFloat}`,
        '(x2-x1) * width_ratio',
        `x1*${xWidthFloat} + float(dyC)*(width_scale)`,
        `image_grad_x * (${xWidthFloat} - float(x)*width_ratio)`,
        'image_grad_x * float(x) * width_ratio'
      ] :
      [
        '0.0',
        '0.0',
        `0.5 * (x1+x2) * ${xWidthFloat}`,
        `image_grad_x * 0.5 * ${xWidthFloat}`,
        `image_grad_x * 0.5 * ${xWidthFloat}`,
      ];

    // Reference implementation
    // tslint:disable-next-line:max-line-length
    // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/core/kernels/crop_and_resize_op_gpu.cu.cc
    this.userCode = `
    const float height_ratio = ${heightRatio};
    const float width_ratio = ${widthRatio};
    void main() {
      ivec2 coords = getOutputCoords();
      int b = coords[0];
      int r = coords[1];

      // get box vals
      float y1 = getBoxes(b,0);
      float x1 = getBoxes(b,1);
      float y2 = getBoxes(b,2);
      float x2 = getBoxes(b,3);

      // get image in batch index
      int bInd = int(floor(getBoxInd(b)));
      if(bInd < 0 || bInd >= ${batch}) {
        return;
      }

      float accumulator = 0.0;

      float height_scale = ${heightScale};
      float width_scale = ${widthScale};

      // Loop over dy
      for (int dyR = 0; dyR < ${yHeight}; dyR++) {
        float in_y = ${inY};
        if( in_y < 0.0 || in_y > ${xHeightFloat} ) {
          continue;
        }
        for (int dyC = 0; dyC < ${yWidth}; dyC++) {
          float in_x = ${inX};
          if( in_x < 0.0 || in_x > ${xWidthFloat} ) {
            continue;
          }

          // Fractional source index.
          vec2 sourceFracIndexRC = vec2(in_y,in_x);
          ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
          ivec2 sourceCeilRC = ivec2(ceil(sourceFracIndexRC));
          vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

          for (int dyD = 0; dyD < ${depth}; dyD++) {
            float topLeft = getImage(b, sourceFloorRC.x, sourceFloorRC.y, dyD);
            float bottomLeft =
              getImage(b, sourceCeilRC.x, sourceFloorRC.y, dyD);
            float topRight = getImage(b, sourceFloorRC.x, sourceCeilRC.y, dyD);
            float bottomRight =
              getImage(b, sourceCeilRC.x, sourceCeilRC.y, dyD);

            // Compute the image gradient.
            float image_grad_y = (1.0 - fracRC[1]) * (bottomLeft - topLeft) +
                                 fracRC[1] * (bottomRight - topRight);
            float image_grad_x = (1.0 - fracRC[0]) * (topRight - topLeft) +
                                 fracRC[0] * (bottomRight - bottomLeft);

            // Modulate the image gradient with the incoming gradient.
            float top_grad = getDy(bInd,dyR,dyC,dyD);
            image_grad_y *= top_grad;
            image_grad_x *= top_grad;

            if(r == 0) {
              accumulator += ${dy1};
            }
            else if(r == 1) {
              accumulator += ${dx1};
            }
            else if(r == 2) {
              accumulator += ${dy2};
            }
            else{
              accumulator += ${dx2};
            }
          }
        }
      }
      setOutput(accumulator);
    }
    `;
  }
}
