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

export class Pad1DProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor(
      xShape: number[], paddings: [number, number], constantValue: number) {
    const leftPadding = paddings[0];
    const rightPadding = paddings[1];

    this.outputShape = [leftPadding + xShape[0] + rightPadding];
    this.rank = 1;

    this.userCode = `
      void main() {
        int resRC = getOutputCoords();
        if (resRC < ${leftPadding} || resRC >= ${leftPadding} + ${xShape[0]}) {
          setOutput(float(${constantValue}));
        } else {
          setOutput(getX(resRC - ${leftPadding}));
        }
      }
    `;
  }
}

export class Pad2DProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: number[], paddings: Array<[number, number]>,
      constantValue: number) {
    const leftPadding = paddings[1][0];
    const rightPadding = paddings[1][1];

    this.outputShape = [leftPadding + xShape[1] + rightPadding];
    const rank = xShape.length;

    const sourceCoords = `resRC.x - ${topPadding}, resRC.y - ${leftPadding}`;
    const type = getCoordsDataType(rank);

    this.userCode = `
      ${type} beforePad = ${type}(${paddings[0][0]}, ${paddings[1][0]});
      ${type} afterPad = ${type}(${paddings[0][1]}, ${paddings[1][1]});

      void main() {
        ${type} resRC = getOutputCoords();
        int leftShape = ${leftPadding} + ${xShape[1]};
        if (any(lessThan(resRC, beforePad)) ||
            any(greaterThanEqual(resRC, afterPad))) {
          setOutput(float(${constantValue}));
        } else {
          setOutput(getX(resRC - beforePad));
        }
      }
    `;
  }
}
