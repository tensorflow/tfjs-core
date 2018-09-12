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
import {getCoordsDataType} from './shader_compiler';

export class DiagProgram implements GPGPUProgram {
  variableNames = ['X'];
  outputShape: number[];
  userCode: string;

  // Caching uniform location for speed.
  seedLoc: WebGLUniformLocation;

  constructor(xShape: number[], size: number) {
    this.outputShape = [...xShape, ...xShape];
    const rank = xShape.length;
    if (rank > 2) {
      throw new Error(
          `WebGL backend: diag of rank-${rank} tensor is not yet supported`);
    }
    const typeOut = getCoordsDataType(rank * 2);
    const typeIn = getCoordsDataType(rank);
    const coordstoIndex = (coords: string) => {
      let index = `${coords}[${rank - 1}]`;
      for (let i = 0; i < rank - 2; i++) {
        index = `${index} + ${xShape[i]} * ${coords}[${i}]`;
      }
      return index;
    };

    this.userCode = `
      void setVal1D() {
        ${typeOut} coordsOut = getOutputCoords();
        if (coordsOut[0] == coordsOut[1]) {
          setOutput(getX(coordsOut[0]));
        } else {
          setOutput(0.0);
        }
      }

      void setValTensor() {
        ${typeOut} coordsOut = getOutputCoords();
        ${rank === 1 ? typeOut : typeIn} coordsIn;
        bool setValueBool = true;
        for (int i = 0; i < ${rank}; i++) {
          if (coordsOut[i] != coordsOut[${rank} + i]) {
            setValueBool = false;
            break;
          }
        }
        for (int i = 0; i < ${rank}; i++) {
          coordsIn[i] = coordsOut[i];
        }
        if (setValueBool) {
          setOutput(getX(${rank === 1 ? 0 : coordstoIndex('coordsIn')}));
        } else {
          setOutput(0.0);
        }
      }
      void main() {
        if (${rank === 1}) {
          setVal1D();
        } else {
          setValTensor();
        }
      }
    `;
  }
}
