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

import {Tensor, Tensor2D} from '../tensor';
import {convertToTensor} from '../tensor_util';
import {TensorLike} from '../types';
import {assert} from '../util';
import {buffer} from './array_ops';

/** @doc {heading: 'Operations', subheading: 'Logical'} */
async function whereAsync(condition: Tensor|TensorLike): Promise<Tensor2D> {
  const $condition = convertToTensor(condition, 'condition', 'where', 'bool');
  assert($condition.dtype === 'bool', 'Error Condition must be of type bool.');

  const vals = await $condition.data();

  const indices = [];
  for (let i = 0; i < vals.length; i++) {
    if (vals[i]) {
      indices.push(i);
    }
  }

  const inBuffer = buffer($condition.shape, 'int32');

  const out = buffer([indices.length, $condition.rank], 'int32');
  for (let i = 0; i < indices.length; i++) {
    const loc = inBuffer.indexToLoc(i);
    const offset = i * $condition.rank;
    out.values.set(loc, offset);
  }
  return out.toTensor() as Tensor2D;
}
