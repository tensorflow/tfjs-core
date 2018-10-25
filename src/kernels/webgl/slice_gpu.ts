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

import {GPGPUContext} from './gpgpu_context';
import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';

export class SliceProgram implements GPGPUProgram {
  variableNames = ['source'];
  outputShape: number[];
  userCode: string;
  rank: number;

  // Caching uniform location for speed.
  startLoc: WebGLUniformLocation;

  constructor(destSize: number[]) {
    this.outputShape = destSize;
    this.rank = destSize.length;

    const dtype = getCoordsDataType(this.rank);
    const sourceCoords = getCoords(this.rank);

    if (this.rank <= 4) {
      this.userCode = `
        uniform ${dtype} start;

        void main() {
          ${dtype} sourceLoc = start + getOutputCoords();
          setOutput(getSource(${sourceCoords}));
        }
      `;
    } else {
      const vecCombineMembers = ['x', 'y', 'z', 'w', 'u', 'v']
        .slice(0, this.rank)
        .map(a => `start.${a} + outC.${a}`)
        .join(',');

      this.userCode = `
        uniform ${dtype} start;

        void main() {
          ${dtype} outC = getOutputCoords();
          ${dtype} sourceLoc = ${dtype}(${vecCombineMembers});

          setOutput(getSource(${sourceCoords}));
        }
      `;
    }
  }

  getCustomSetupFunc(start: number[]) {
    if (start.length !== this.rank) {
      throw Error(
          `The rank (${this.rank}) of the program must match the ` +
          `length of start (${start.length})`);
    }
    return (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => {
      if (this.startLoc == null) {
        this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'start');
        if (this.startLoc == null) {
          // This means the compiler has optimized and realized it doesn't need
          // the uniform.
          return;
        }
      }
      if (this.rank === 1) {
        gpgpu.gl.uniform1i(this.startLoc, start[0]);
      } else if (this.rank === 2) {
        gpgpu.gl.uniform2i(this.startLoc, start[0], start[1]);
      } else if (this.rank === 3) {
        gpgpu.gl.uniform3i(this.startLoc, start[0], start[1], start[2]);
      } else if (this.rank === 4) {
        gpgpu.gl.uniform4i(
            this.startLoc, start[0], start[1], start[2], start[3]);
      } else if (this.rank === 5) {
        gpgpu.gl.uniform4i(
            this.startLoc, start[0], start[1], start[2], start[3]);
        gpgpu.gl.uniform1i(this.startLoc, start[4]);
      } else if (this.rank === 6) {
        gpgpu.gl.uniform4i(
            this.startLoc, start[0], start[1], start[2], start[3]);
        gpgpu.gl.uniform2i(this.startLoc, start[4], start[5]);
      } else {
        throw Error(`Slicing for rank ${this.rank} is not yet supported`);
      }
    };
  }
}

function getCoords(rank: number): string {
  if (rank === 1) {
    return 'sourceLoc';
  } else if (rank === 2) {
    return 'sourceLoc.x, sourceLoc.y';
  } else if (rank === 3) {
    return 'sourceLoc.x, sourceLoc.y, sourceLoc.z';
  } else if (rank === 4) {
    return 'sourceLoc.x, sourceLoc.y, sourceLoc.z, sourceLoc.w';
  } else if (rank === 5) {
    return 'sourceLoc.x, sourceLoc.y, sourceLoc.z, sourceLoc.w, sourceLoc.u';
  } else if (rank === 6) {
    return 'sourceLoc.x, sourceLoc.y, sourceLoc.z, sourceLoc.w, sourceLoc.u, sourceLoc.v';
  } else {
    throw Error(`Slicing for rank ${rank} is not yet supported`);
  }
}
