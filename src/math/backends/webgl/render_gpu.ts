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

import {Array3D} from '../../ndarray';

import {GPGPUProgram} from './gpgpu_math';

export class RenderProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;

  constructor(x: Array3D) {
    // this.outputShape = [numIndices, depth];

    this.userCode = `
      void main() {
        // TODO: Add a new method which gets "(x, y)" pair directly instead of getOutputCoords
        ivec3 coords = getOutputCoords();

        gl_FragColor = vec4(
          getX(coords[0], coords[1], 0),
          getX(coords[0], coords[1], 1),
          getX(coords[0], coords[1], 2),
          getX(coords[0], coords[1], 3));
      }
    `;
  }
}
