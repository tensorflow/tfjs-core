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

export class ClipProgram implements GPGPUProgram {
  variableNames = ['A'];
  params: Array<{}>;
  userCode: string;
  outputShape: number[];

  constructor(aShape: number[], min: number, max: number) {
    this.outputShape = aShape;
    const minFixed = min.toFixed(20);
    const maxFixed = max.toFixed(20);
    this.params = [minFixed, maxFixed];
    this.userCode = `
      void main() {
        setOutput(clamp(getAAtOutCoords(), ${minFixed}, ${maxFixed}));
      }
    `;
  }
}
