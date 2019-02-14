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

import {ReduceInfo} from '../../ops/reduce_util';
import {GPGPUProgram} from './gpgpu_math';

export class ArgMinMaxPackedProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;
  usesPackedTextures = true;

  constructor(reduceInfo: ReduceInfo, op: 'max'|'min', firstPass: boolean) {
    const windowSize = reduceInfo.windowSize;
    const batchSize = reduceInfo.batchSize;
    const inSize = reduceInfo.inSize;
    const outSize = Math.ceil(inSize / windowSize);
    if (!firstPass) {
      this.variableNames.push('bestIndicesA');
    }
    this.outputShape = [batchSize, outSize];
    const compOp = (op === 'max') ? 'greaterThan' : 'lessThan';
    const indexSnippet =
        firstPass ? `ivec4 inIdx = inOffset + i;` : `ivec4 inIdx = inOffset + i;
         inIdx = round(vec4(
           getBestIndicesAChannel(batch, inIdx.r),
           hasNextCol ? getBestIndicesAChannel(batch, inIdx.g) : 0.0,
           hasNextRow ? getBestIndicesAChannel(batchNextRow, inIdx.b) : 0.0,
           (hasNextRow && hasNextCol) ?
             getBestIndicesAChannel(batchNextRow, inIdx.a) : 0.0));`;

    const getBestIndicesAChannelSnippet = firstPass ? '' : `
      float getBestIndicesAChannel(int r, int c) {
        return getChannel(getBestIndicesA(r, c), vec2(r, c));
      }`;

    this.userCode = `
      float getAChannel(int r, int c) {
        return getChannel(getA(r, c), vec2(r, c));
      }      
      
      ${getBestIndicesAChannelSnippet}
      
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int batchNextRow = batch + 1;
        int outIdx = coords[1];
        int outIdxNextCol = outIdx + 1;
        ivec4 inOffset =
          ivec4(outIdx, outIdxNextCol, outIdx, outIdxNextCol) * ${windowSize};

        bool hasNextCol = outIdx < ${outSize - 1};
        bool hasNextRow = batch < ${batchSize - 1};

        vec4 bestValue = vec4(
          getAChannel(batch, inOffset.r),
          hasNextCol ? getAChannel(batch, inOffset.g) : 0.0,
          hasNextRow ? getAChannel(batchNextRow, inOffset.b) : 0.0,
          (hasNextRow && hasNextCol) ?
            getAChannel(batchNextRow, inOffset.a) : 0.0);
        vec4 bestIndex = vec4(inOffset);

        for (int i = 0; i < ${windowSize}; i++) {
          ${indexSnippet};
          vec4 candidate = vec4(
            getAChannel(batch, inIdx.r),
            hasNextCol ? getAChannel(batch, inIdx.g) : 0.0,
            hasNextRow ? getAChannel(batchNextRow, inIdx.b) : 0.0,
            (hasNextRow && hasNextCol) ?
              getAChannel(batchNextRow, inIdx.a) : 0.0);
          
          bvec4 nan = isNaN(candidate);
          bvec4 replace = bvec4(
            vec4(${compOp}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
        }
        setOutput(bestIndex);
      }
    `;
  }
}
