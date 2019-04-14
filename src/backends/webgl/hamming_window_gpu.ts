/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import {GPGPUContext} from './gpgpu_context';

export class HammingWindowProgram implements GPGPUProgram {
  variableNames: string[];
  outputShape: number[] = [];
  userCode: string;

  nLoc: WebGLUniformLocation;

  constructor(shape: number[]) {
    this.variableNames = ['x'];
    this.outputShape = shape;

    this.userCode = `
      float PI = ${Math.PI};
      uniform int window_length;
      void main() {
        int pos = getOutputCoords();
        int even = 1 - imod(window_length, 2);
        float cos_arg = 2.0*PI*float(pos) / float(window_length+even-1);
        float value = 0.54 - 0.46 * cos(cos_arg);
        setOutput(value);
      }
    `;
  }

  getCustomSetupFunc(n: number) {
    return (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => {
      if (this.nLoc == null) {
        this.nLoc = gpgpu.getUniformLocationNoThrow(webGLProgram,
          'window_length');
      }
      gpgpu.gl.uniform1i(this.nLoc, n);
    };
  }
}
