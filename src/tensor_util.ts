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

import {Tensor} from './tensor';
import {TypedArray} from './types';

const LIMIT_NUM_VALS = 20;

function subTensorToString(
    vals: TypedArray, shape: number[], strides: number[], depth = 0,
    isFirst = true): string {
  const size = shape[0];
  const rank = shape.length;
  let prefix = '';
  if (!isFirst) {
    for (let i = 0; i < depth; i++) {
      prefix += ' ';
    }
  }
  if (rank <= 1) {
    return prefix + '[' + vals.join(', ') + ']';
  }
  const subshape = shape.slice(1);
  const substrides = strides.slice(1);
  const stride = strides[0];
  const elems = [];
  for (let i = 0; i < size; i++) {
    const start = i * stride;
    const end = start + stride;
    elems.push(subTensorToString(
        vals.subarray(start, end), subshape, substrides, depth + 1, i === 0));
  }
  let newlineSep = '';
  for (let i = 1; i < rank; i++) {
    newlineSep += '\n';
  }
  return prefix + '[' + elems.join(',' + newlineSep) + ']';
}

export function tensorToString(t: Tensor) {
  const vals = t.dataSync();
  const lines = [
    'Tensor', `  dtype: ${t.dtype}`, `  rank: ${t.rank}`, `  shape: ${t.shape}`,
    `  values:`, subTensorToString(vals, t.shape, t.strides)
  ];
  return lines.join('\n');
}
