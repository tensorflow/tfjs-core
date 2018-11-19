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

import * as broadcast_util from '../../ops/broadcast_util';
import {GPGPUContext} from './gpgpu_context';
import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';
import {getChannels} from '../packing_util';
import {arraysEqual} from '../../util';

// We do the same as in ./binaryop_gpu, with vec4 and ivec4. 
export const PACKED_DIV = `return a / b;`;

export const PACKED_INT_DIV = `
  vec4 resultSign = sign(a) * sign(b);
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  ivec4 result = ia / ib;
  ivec4 amodb = ia - ib * result;
  
  // Vectorize INT_DIV
  // if (resultSign < 0.0 && amodb != 0) result -= 1;
  // return float(result);
  return vec4(result -
     ivec4(lessThan(resultSign, vec4(0.0))) * ivec4(notEqual(amodb, ivec4(0))));
`;

export const PACKED_POW = `
const vec4 zero = vec4(0.0);
vec4 isNAN = vec4(lessThan(a, zero)) * vec4(lessThan(floor(b), b));
isNAN.r = isNAN.r == 1.0 ? NAN : 0.0;
isNAN.g = isNAN.g == 1.0 ? NAN : 0.0;
isNAN.b = isNAN.b == 1.0 ? NAN : 0.0;
isNAN.a = isNAN.a == 1.0 ? NAN : 0.0;
// isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
return multiplier * pow(abs(a), b) + isNAN;
`;

export class BinaryOpPackedProgram implements GPGPUProgram {
  variableNames = ['A', 'B'];
  outputShape: number[];
  userCode: string;
  supportsBroadcasting = true;
  usesPackedTextures = true;

  // Caching uniform location for speed.
  startLoc: WebGLUniformLocation;

  constructor(op: string, aShape: number[], bShape: number[]) {
    this.outputShape =
        broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
    // Broadcasting is implemented only for 1-D and scalar.
    if (!arraysEqual(aShape, bShape) && aShape.length > 1 &&
        bShape.length > 1) {
      throw new Error(`Broadcasting is supported only for 1-D tensors.`);
    }
    const dtype = getCoordsDataType(this.outputShape.length);
    this.userCode = `
      uniform float NAN;
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${op}
      }

      void main() {
        ${dtype} rc = getOutputCoords();
        ${broadcastSample('a', aShape.length, this.outputShape.length)};
        ${broadcastSample('b', bShape.length, this.outputShape.length)};
        setOutput(binaryOperation(a, b));
      }
    `;
  }

  getCustomSetupFunc() {
    return (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => {
      if (this.startLoc == null) {
        this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'NAN');
        if (this.startLoc == null) {
          // This means the compiler has optimized and realized it doesn't need
          // the uniform.
          return;
        }
      }
      gpgpu.gl.uniform1f(this.startLoc, NaN);
    };
  }
}

function broadcastSample(
    texName: string, rank: number, outputRank: number): string {
  const channels = getChannels('rc', outputRank);
  const texSampler = `get${texName.charAt(0).toUpperCase()}${texName.slice(1)}`;
  switch (rank) {
    case 0:
      return `
        vec4 ${texName} = vec4(${texSampler}());
      `;
    case 1:
      return `
        vec4 ${texName}Sample = ${texSampler}(${channels.slice(-1)[0]});
        vec4 ${texName} = vec4(${texName}Sample.xy, ${texName}Sample.xy);
      `;
    case 2:
    case 3:
    case 4:
      const coords = channels.join();    
      return `
        vec4 ${texName} = ${texSampler}(${coords});
      `;
    default:
      throw new Error(`${rank}-D packed input sampling is not yet supported.`);
  }
}