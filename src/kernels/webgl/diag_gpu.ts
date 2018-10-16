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

export class DiagProgram implements GPGPUProgram {
  variableNames = ['X'];
  outputShape: number[];
  userCode: string;

  constructor(xShape: number[], size: number) {
    const outputSize = size ** 2;
    this.outputShape = [outputSize];
    const rank = xShape.length;
    const helper = (a: number[]) =>
        a.map((_, b, c) => c.slice(b + 1).reduce((a, b) => a * b, 1));
    const coordstoIndex = (coords: string) => {
      const pseudoShape = helper([...xShape]);
      let index = `${pseudoShape[rank - 1]} * ${coords}[${rank - 1}]`;
      for (let i = 0; i < rank - 1; i++) {
        index = `${index} + ${pseudoShape[i]} * ${coords}[${i}]`;
      }
      return index;
    };
    const indextoCoords = (index: string): string => {
      const pseudoShape = helper([...xShape, ...xShape]);
      let coords = '';
      for (let i = 0; i < pseudoShape.length; i++) {
        coords = `${coords}
        coords[${i}] = ${index} / ${pseudoShape[i]};
        ${index} = ${index} - ${pseudoShape[i]} * coords[${i}];`;
      }
      return coords;
    };

    this.userCode = `
      void main() {
          int coords[${2 * xShape.length}];
          int index = getOutputCoords();
          ${indextoCoords('index')}
          bool setValueBool = true;
          for (int i = 0; i < ${rank}; i++) {
            if (coords[i] != coords[${rank} + i]) {
              setValueBool = false;
              break;
            }
          }
          if (setValueBool) {
            setOutput(getX(${coordstoIndex('coords')}));
          } else {
            setOutput(0.0);
          }
      }
    `;
  }
}
