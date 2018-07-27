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

import {GPGPUProgram} from './gpgpu_math';

export class RotateProgram implements GPGPUProgram {
  variableNames = ['A' /* tensor */, 'theta' /* angles */];
  outputShape: number[] = [];
  userCode: string;

  constructor(inputShape: [number, number, number, number]) {
    this.outputShape = inputShape.slice();
    const [, height, width, ] = inputShape;
    // bilinear sampling copied from resize_bilinear_gpu.ts
    this.userCode = `
      const vec2 inputShapeRC = vec2(${height}.0, ${width}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        float s = sin(-getTheta(b));
        float c = cos(-getTheta(b));
        mat2 rot = mat2(c, -s, s, c);
        ivec2 yRC = coords.yz + ivec2(0.0, 1.0);
        // Fractional source index.
        vec2 centered = 2.0 * (vec2(yRC) / inputShapeRC) - 1.0;
        vec2 sourceFracIndexRC = ((rot * centered) * 0.5 + 0.5) * inputShapeRC;
        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `;
  }
}
