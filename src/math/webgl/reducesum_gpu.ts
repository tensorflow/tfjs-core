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

import {GPGPUContext} from './gpgpu_context';
import {GPGPUProgram} from './gpgpu_math';
import {NDArray, Scalar} from '../ndarray';

export class ReduceSumProgram implements GPGPUProgram {
  variableNames = ['A'];

  getUserCode(inputs: NDArray[], out: Scalar): string {
    const size = inputs[0].size;
    return `
      void main() {
        float sum = 0.0;
        for (int i = 0; i < ${size}; i++) {
          sum += getAFlat(float(i));
        }
        setOutput(sum);
      }
    `;
  }

  validate(inputs: NDArray[], out: Scalar): boolean {
    if (inputs.length !== 1 || out.rank !== 0) {
      return false;
    }
    return true;
  }
}
