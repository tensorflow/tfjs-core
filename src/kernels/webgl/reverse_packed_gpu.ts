/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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

import {getChannels} from '../packing_util';
import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';

export class ReversePackedProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;
  usesPackedTextures = true;

  constructor(xShape: number[], axis: number[]) {
    const rank = xShape.length;
    if (rank > 4) {
      throw new Error(
          `WebGL backend: Reverse of rank-${rank} tensor is not yet supported`);
    }
    this.outputShape = xShape;
    const channels = getChannels('rc', rank);
    const nextColumn =
        `++${channels[rank - 1]} < ${this.outputShape[rank - 1]}`;
    const getInCoord = (i: number) => {
      if (rank === 1) {
        return `${xShape[0]} - rc - 1`;
      } else if (axis.indexOf(i) !== -1 && xShape[i] !== 1) {
        return `${xShape[i]} - rc[${i}] - 1`;
      } else {
        return `rc[${i}]`;
      }
    };
    const inCoords = xShape.map((_, i) => getInCoord(i)).join(',');
    const innerDims = rank === 1 ?
        'rc' :
        `vec2(${xShape.map((_, i) => getInCoord(i)).slice(-2).join(',')})`;
    const type = getCoordsDataType(rank);
    const getc = `getChannel(getX(${inCoords}), ${innerDims})`;

    const upperRow = `
      result.x = ${getc};
      if(${nextColumn}){
        result.y = ${getc};
      }
    `;
    const lowerRow = rank === 1 ? '' : `
      --${channels[rank - 1]};
      if (++${channels[rank - 2]} < ${this.outputShape[rank - 2]}) {
        result.z = ${getc};
        if(${nextColumn}) {
          result.w = ${getc};
        }
      }
    `;

    this.userCode = `
      void main() {
      ${type} rc = getOutputCoords();
      vec4 result = vec4(0.);
      ${upperRow};
      ${lowerRow};
      setOutput(result);
      }
    `;
  }
}
