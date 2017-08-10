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
import * as util from '../../util';

export class MinMaxProgram<T extends NDArray> implements GPGPUProgram<Scalar> {
  variableNames = ['A'];

  constructor(public inputs: T[], public output: Scalar,
      private opType: 'min'|'max') {}

  getParams() { return [this.opType]; }

  getUserCode(): string {
    const size = util.sizeFromShape(this.inputs[0].shape);
    return `
      void main() {
        float value = getAFlat(0.0);
        for (int i = 0; i < ${size}; i++) {
          float candidate = getAFlat(float(i));
          if (isNaN(candidate)) {
            setOutput(candidate);
            return;
          }
          value = ${this.opType}(value, candidate);
        }
        setOutput(value);
      }
    `;
  }

  validate(): boolean {
    if (this.inputs.length !== 1 || this.output.rank !== 0) {
      return false;
    }
    return true;
  }
}
