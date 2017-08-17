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

export class Copy2DProgram implements GPGPUProgram {
  variableNames = ['source'];
  params: Array<{}>;
  outputShape: number[];
  userCode: string;

  constructor(
      sourceShape: [number, number], sourceSize: [number, number],
      destSize: [number, number]) {
    this.userCode = `
      uniform vec2 sourceStartCR;
      uniform vec2 destStartCR;

      void main() {
        vec2 destOffsetCR = floor(gl_FragCoord.xy) - destStartCR;
        float destOffsetFlat = (destOffsetCR.y * destSizeCR.x) + destOffsetCR.x;
        vec2 sourceOffsetCR = vec2(mod(destOffsetFlat, sourceSizeCR.x),
          floor(destOffsetFlat / sourceSizeCR.x));
        vec2 sourceCR = sourceStartCR + sourceOffsetCR;
        setOutput(getSource(sourceCR.y, sourceCR.x));
      }
    `;
  }
}

export function getCustomSetupFunc(
    sourceStart: [number, number], destStart: [number, number],
    destSize: [number, number]) {
  return (gpgpu: GPGPUContext) => {
    gpgpu.setOutputMatrixWriteRegion(
        destStart[0], destSize[0], destStart[1], destSize[1]);
    const sourceStartCRLoc = gpgpu.getUniformLocation('sourceStartCR');
    gpgpu.gl.uniform2f(sourceStartCRLoc, sourceStart[1], sourceStart[0]);
    const destStartCRLoc = gpgpu.getUniformLocation('destStartCR');
    gpgpu.gl.uniform2f(destStartCRLoc, destStart[1], destStart[0]);
  };
}
