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
import {GPGPUProgram} from './gpgpu_math';

const CHECK_NAN_SNIPPET = `
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;
`;

// We do the same as in ./binaryop_gpu, with vec4 and ivec4.
// On Linux, the vectorized implementation produces NaNs when a and b are 0.
export const DIV = `
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  result.x = a.x == b.x ? 1. : result.x;
  result.y = a.y == b.y ? 1. : result.y;
  result.z = a.z == b.z ? 1. : result.z;
  result.w = a.w == b.w ? 1. : result.w;
  return result;
`;

export const INT_DIV = `
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

export const INT_DIV_300 = `
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`;

export const POW = `
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));
  ` +
    CHECK_NAN_SNIPPET + `
  return result;
`;

export const PRELU = `
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;

export const ELU_DER = `
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`;

export const ATAN2 = `
  vec4 result = atan(a, b);
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  ` +
    CHECK_NAN_SNIPPET + `
  return result;
`;

export const EQUAL = `
  return vec4(equal(a, b));
`;

export const NOT_EQUAL = `
  return vec4(notEqual(a, b));
`;

export const LESS = `
  return vec4(lessThan(a, b));
`;

export const LESS_EQUAL = `
  return vec4(lessThanEqual(a, b));
`;

export const GREATER = `
  return vec4(greaterThan(a, b));
`;

export const GREATER_EQUAL = `
  return vec4(greaterThanEqual(a, b));
`;

export const LOGICAL_AND = `
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`;

export const LOGICAL_OR = `
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`;

export const MAX = `
  vec4 result = vec4(max(a, b));
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  ` +
    CHECK_NAN_SNIPPET + `
  return result;
`;

export const MIN = `
  vec4 result = vec4(min(a, b));
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  ` +
    CHECK_NAN_SNIPPET + `
  return result;
`;

export const MOD = `
  vec4 result = mod(a, b);
  vec4 isNaN = vec4(equal(b, vec4(0.0)));
  ` +
    CHECK_NAN_SNIPPET + `
  return result;
`;

export class BinaryOpPackedProgram implements GPGPUProgram {
  variableNames = ['A', 'B'];
  outputShape: number[];
  userCode: string;
  supportsBroadcasting = true;
  usesPackedTextures = true;

  constructor(op: string, aShape: number[], bShape: number[]) {
    this.outputShape =
        broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
    this.userCode = `
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${op}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `;
  }
}
