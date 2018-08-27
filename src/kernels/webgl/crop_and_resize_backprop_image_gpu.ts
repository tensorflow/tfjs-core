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
    const [batch, xHeight, xWidth, depth] = imageShape;
    const [numBoxes, yHeight, yWidth, ] = gradShape;
    this.outputShape = [batch, xHeight, xWidth, depth];
    const methodId = method === 'bilinear' ? 1 : 0;

    const [xHeightFloat, xWidthFloat] =
    [`${xHeight - 1}.0`, `${xWidth - 1}.0`];
    const [yHeightFloat, yWidthFloat] =
    [`${yHeight - 1}.0`, `${yWidth - 1}.0`];
    const [heightRatio, heightScale, inY] = yHeight > 1 ?
      [
        `${xHeightFloat}/${yHeightFloat}`,
        '(y2-y1) * height_ratio',
        `y1*${xHeightFloat} + float(dyR)*(height_scale)`,
      ] :
      [
        '0.0',
        '0.0',
        `0.5 * (y1+y2) * ${xHeightFloat}`,
      ];
    const [widthRatio, widthScale, inX] = yWidth > 1 ?
      [
        `${xWidthFloat}/${yWidthFloat}`,
        '(x2-x1) * width_ratio',
        `x1*${xWidthFloat} + float(dyC)*(width_scale)`,
      ] :
      [
        '0.0',
        '0.0',
        `0.5 * (x1+x2) * ${xWidthFloat}`,
      ];

    // Reference implementation
    // tslint:disable-next-line:max-line-length
    // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/core/kernels/crop_and_resize_op_gpu.cu.cc
    this.userCode = `
    const float height_ratio = ${heightRatio};
    const float width_ratio = ${widthRatio};
    void main() {
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