/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

export class ClipPackedProgram implements GPGPUProgram {
  variableNames = ['A'];
  usesPackedTextures = true;
  userCode: string;
  outputShape: number[];

  constructor(aShape: number[], min: number, max: number) {
    this.outputShape = aShape;
    this.userCode = `
      void main() {
        vec4 value = getAAtOutCoords();

        if(hasNaN(value)) {
          setOutput(vec4(
            isNaN(value.x) ? value.x : clamp(value.x, float(${min}), float(${
        max})),
            isNaN(value.y) ? value.y : clamp(value.y, float(${min}), float(${
        max})),
            isNaN(value.z) ? value.z : clamp(value.z, float(${min}), float(${
        max})),
            isNaN(value.w) ? value.w : clamp(value.w, float(${min}), float(${
        max}))
          ));
          return;
        }

        setOutput(clamp(value, vec4(${min}), vec4(${max})));
      }
    `;
  }
}