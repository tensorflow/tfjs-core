/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {util} from '@tensorflow/tfjs-core';

import {getCoordsDataType} from '../shader_preprocessor';

import {WebGPUProgram} from './webgpu_program';

export class PadProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['x'];

  constructor(
      xShape: number[], paddings: Array<[number, number]>,
      constantValue: number) {
    this.outputShape = paddings.map(
        (p, i) => p[0] /* beforePad */ + xShape[i] + p[1] /* afterPad */);
    const rank = xShape.length;
    const type = getCoordsDataType(rank);
    this.dispatch = [util.sizeFromShape(this.outputShape), 1, 1];

    const start = paddings.map(p => p[0]).join(',');
    const end = paddings.map((p, i) => p[0] + xShape[i]).join(',');

    this.userCode = `
      ${type} start = ${type}(${start});
      ${type} end = ${type}(${end});

      int getFlatIndex(ivec2 coords, ivec2 shape) {
        return coords.x * shape.y + coords.y;
      }

      int getFlatIndex(ivec3 coords, ivec3 shape) {
        return coords.x * (shape.y * shape.z) + coords.y * shape.z + coords.z;
      }

      void main() {
        uint index = gl_GlobalInvocationID.x;
        ${type} outC = getOutputCoords(index);

        if(any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          result[index] = ${constantValue}; // TODO: UPLOAD AS UNIFORM
        } else {
          ${type} coords = outC - start;
          ${type} xShape = ${type}(${xShape.join(',')});
          result[index] = x[getFlatIndex(coords, xShape)];
        }
      }
    `;
  }
}
