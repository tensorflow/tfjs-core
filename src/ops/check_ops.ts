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

import {Tensor} from '../tensor';
import {assertTypesMatch} from '../tensor_util';
import {convertToTensor} from '../tensor_util_env';
import {TensorLike} from '../types';
import {assertAndGetBroadcastShape} from './broadcast_util';
import {op} from './operation';

/**
 * Asserts the condition x == y holds element-wise. Supports broadcasting.
 *
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([1, 2, 2]);
 *
 * a.assertEqual(b);
 * ```
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Checks'} */
function assertEqual_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): void {
  const $a = convertToTensor(a, 'a', 'assertEqual');
  const $b = convertToTensor(b, 'b', 'assertEqual');

  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);

  const condition = $a.equal($b).all().get();

  if (!condition) {
    throw Error('Conditon a == b did not hold');
  }

  return;
}

export const assertEqual = op({assertEqual_});
