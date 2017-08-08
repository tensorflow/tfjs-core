/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import {NDArray} from '../ndarray';
import {GPGPUProgram} from './gpgpu_context';
import * as util from '../../util';

export class AddProgram implements GPGPUProgram {
  variableNames = ['A', 'B'];

  getUserCode(inputs: NDArray[], out: NDArray): string {
    return `
      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(a + b);
      }
    `;
  }

  validate(inputs: NDArray[], out: NDArray): boolean {
    if (inputs.length !== 2) {
      return false;
    }
    if (!util.arraysEqual(inputs[0].shape, inputs[1].shape)) {
      return false;
    }
    if (!util.arraysEqual(inputs[0].shape, out.shape)) {
      return false;
    }
    return true;
  }
}
