/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {getChannels} from '../packing_util';

export class SlicePackedProgram implements GPGPUProgram {
  variableNames = ['source'];
  usesPackedTextures = true;
  outputShape: number[];
  userCode: string;
  rank: number;

  // Caching uniform location for speed.
  startLoc: WebGLUniformLocation;

  constructor(destSize: number[]) {
    this.outputShape = destSize;
    this.rank = destSize.length;

    const dtype = getCoordsDataType(this.rank);
    const coords = getChannels('loc', this.rank);
    const range = getChannels('range', this.rank);

    const cLimit = `${coords[this.rank - 1]} < ${range[this.rank - 1]}`;
    const innerDims =
        this.rank === 1 ? 'loc' : `vec2(${coords.slice(-2).join()})`;

    const componentSetup = [
      `${dtype} loc = sourceLoc;`,
      `${coords[this.rank - 1]} += 1;
       if(${cLimit}) {
      `,
      this.rank === 1 ? '' : 
      `}
       loc = sourceLoc;
       ${coords[this.rank - 2]} += 1;
       if(${coords[this.rank - 2]} < ${range[this.rank - 2]}) {`,
      this.rank === 1 ? '' :
      `  ${coords[this.rank - 1]} += 1;
         if(${cLimit}) {`
    ];

    let mainLoop = '';
    for (let i = 0, j = this.rank === 1 ? 2 : 4; i < j; i++) {
      mainLoop += `
        ${componentSetup[i]}
        result[${i}] = getChannel(getSource(${coords.join()}), ${innerDims});
      `;
    }
    mainLoop += (this.rank === 1 ? `} ` : `}}`);
 
    this.userCode = `
      uniform ${dtype} start;
      void main() {
        ${dtype} sourceLoc = start + getOutputCoords();
        ${dtype} range = start + ${dtype}(${destSize.join()}); 
        vec4 result = vec4(0.);
        ${mainLoop}
        setOutput(result);
      }
    `;
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
      } else {
        throw Error(`Slicing for rank ${this.rank} is not yet supported`);
      }
    };
  }
}