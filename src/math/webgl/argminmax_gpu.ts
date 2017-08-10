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

export function getArgMinMaxSnippet(op: 'min'|'max', texName: string,
    size: number): string {
  const compOp = (op === 'min') ? '<' : '>';
  return `
    float getArgMinMax${texName}() {
      float bestIndex = 0.0;
      float bestValue = get${texName}Flat(0.0);

      for (int i = 0; i < ${size}; i++) {
        float i_float = float(i);
        float candidate = get${texName}Flat(i_float);
        if (isNaN(candidate)) {
          return candidate;
        }
        if (candidate ${compOp} bestValue) {
          bestValue = candidate;
          bestIndex = i_float;
        }
      }
      return bestIndex;
    }
  `;
}

export class ArgMinMaxProgram<T extends NDArray>
    implements GPGPUProgram<T, Scalar> {
  variableNames = ['A'];

  constructor(public inputs: T[], public output: Scalar,
    private opType: 'min'|'max') {}

  getParams() {
    return [this.opType];
  }

  getUserCode(): string {
    const size = this.inputs[0].size;
    const aSnippet = getArgMinMaxSnippet(this.opType, 'A', size);
    return `
      ${aSnippet}

      void main() {
        setOutput(getArgMinMaxA());
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
