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

  constructor(gradShape: [number, number, number, number], imageShape: [number, number, number, number], method: 'bilinear' | 'nearest') {
    const [batch, imageHeight, imageWidth, depth] = imageShape;
    const [numBoxes, cropHeight, cropWidth,] = gradShape;
    this.outputShape = [batch, imageHeight, imageWidth, depth];
    const methodId = method == 'bilinear' ? 1 : 0;

    this.userCode = `
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int y = coords[1];
      int x = coords[2];
      int d = coords[3];

      float accumulator = 0.0;

      for(int b = 0; b < ${numBoxes}; b++) {
        int bInd = getBoxInd(b);
        if(bInd != batch) {
          continue;
        }

        int y1 = getBoxes(b,0);
        int x1 = getBoxes(b,1);
        int y2 = getBoxes(b,2);
        int x2 = getBoxes(b,3);

        float height_scale = (${cropHeight} > 1)
        ? (y2-y1) * ${imageHeight - 1}/${cropHeight - 1}
        : 0;
        float width_scale = (${cropWidth} > 1)
        ? (y2-y1) * ${imageWidth - 1}/${cropWidth - 1}
        : 0;

        float in_y = (${cropHeight} > 1)
        ? y1 * (${imageHeight - 1} + y*(height_scale)
        : 0.5 * (y1+y2) * ${imageHeight - 1};

        if( in_y < 0 || in_y > ${imageHeight - 1} ) {
          continue
        }

        float in_x = (${cropWidth} > 1)
        ? x1 * (${imageWidth - 1} + x*(width_scale)
        : 0.5 * (x1+x2) * ${imageWidth - 1};
        if( in_x < 0 || in_x > ${imageWidth - 1} ) {
          continue
        }

        // Fractional source index.
        vec2 sourceFracIndexRC = vec2(in_y,in_x)

        if(${methodId} == 1) {

          // Compute the four integer indices.
          ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
          ivec2 sourceCeilRC = ivec2(ceil(sourceFracIndexRC));
          vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

          float dtop = (1-fracRC[0]) * getGrad()

          float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
          float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
          float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
          float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);


          float top = topLeft + (topRight - topLeft) * fracRC.y;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
          float newValue = top + (bottom - top) * fracRC.x;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestRC = ivec2(floor(sourceFracIndexRC + 0.5));
          float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);
          setOutput(newValue);
        }
      }
    }
  `;
  }
}
