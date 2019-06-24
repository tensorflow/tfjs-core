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

import {backend_util} from '@tensorflow/tfjs-core';

import {computeDispatch} from '../webgpu_util';

import {WebGPUProgram} from './webgpu_program';

export class ClipProgram implements WebGPUProgram {
  userCode: string;
  outputShape: number[];
  dispatchLayout: {x: number[]};
  dispatch: [number, number, number];
  variableNames = ['A'];
  uniforms?: 'float min; float max;';

  constructor(op: string, aShape: number[]) {
    this.outputShape = aShape;

    this.dispatchLayout = {x: this.outputShape.map((d, i) => i)};
    this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape);

    this.userCode = `
      void main() {
        uint index = gl_GlobalInvocationID.x;
        //float a = getAAtOutCoords();
        setOutput(index, binaryOperation(a, b));
      }
    `;
  }
}
