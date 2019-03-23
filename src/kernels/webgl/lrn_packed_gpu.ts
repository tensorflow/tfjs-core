/**
 * @license
 * Copyright 2019 Google LLC All Rights Reserved.
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

export class LRNPackedProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[] = [];
  userCode: string;
  usesPackedTextures = true;

  constructor(
      xShape: number[], radius: number, bias: number, alpha: number,
      beta: number) {
    const rad = radius;
    const maxD = xShape[3] - 1;
    this.outputShape = xShape;

    // optimize pow(bias + alpha * sum, -beta)
    // src: https://github.com/tensorflow/tensorflow/..
    // blob/26033a1644a9c4a5fbe3170ab2e864b6a4ccd4ca/..
    // tensorflow/core/kernels/mkl_lrn_op.cc#L320
    let powOperator;
    const basis = `float(${bias}) + float(${alpha}) * sum`;
    if (beta === 0.5) {
      powOperator = `inversesqrt(${basis})`;
    } else if (beta === 1.0) {
      powOperator = `1.0/(${basis})`;
    } else {
      powOperator = `exp(log(${basis}) * float(-${beta}));`;
    }

    this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 xAtOutputCoords = vec4(0.);
        vec4 sum = vec4(0.);

        xAtOutputCoords.x = getChannel(getX(b, r, c, d), vec2(c, d));
        xAtOutputCoords.y = hasNextCol ?
          getChannel(getX(b, r, c, d + 1), vec2(c, d + 1)) : 0.0;
        xAtOutputCoords.z = hasNextRow ?
          getChannel(getX(b, r, c + 1, d), vec2(c + 1, d)) : 0.0;
        xAtOutputCoords.w = hasNextRow && hasNextCol ?
          getChannel(getX(b, r, c + 1, d + 1), vec2(c + 1, d + 1)) : 0.0;

        for (int j = -${rad}; j <= ${rad}; j++) {
          ivec2 idx = ivec2(d, d + 1) + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${maxD}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;
          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            z.x = depthInRange ?
              getChannel(getX(b, r, c, idx.x), vec2(c, idx.x)) : 0.0;
            z.y = depthPlusOneInRange && hasNextCol ?
              getChannel(getX(b, r, c, idx.y), vec2(c, idx.y)) : 0.0;
            z.z = depthInRange && hasNextRow ?
              getChannel(getX(b, r, c + 1, idx.x), vec2(c + 1, idx.x)) : 0.0;
            z.w = depthPlusOneInRange && hasNextRow && hasNextCol ?
              getChannel(getX(b, r, c + 1, idx.y), vec2(c + 1, idx.y)) : 0.0;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${powOperator};
        setOutput(result);
      }
    `;
  }
}
