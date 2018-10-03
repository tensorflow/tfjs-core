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
import {ENV} from '../environment';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';
import {Rank, TensorLike} from '../types';
import {op} from './operation';

/**
 * Creates a new tensor by applying sparse updates to individual
 * values or slices within a zero tensor of the given shape tensor according to
 * indices. This operator is the inverse of the tf.gather_nd operator which
 * extracts values or slices from a given tensor.
 *
 * ```js
 * indices = tf.tensor2d([[4], [3], [1], [7]]);
 * updates = tf.tensor2d([9, 10, 11, 12]);
 * shape = [8];
 * tf.scatterND(updates, indices, shape]).print() //[0, 11, 0, 10, 9, 0, 0, 12]
 * ```
 *
 * @param indices The tensor contains the indices into the output tensor.
 * @param updates The tensor contains the value for the indices.
 * @param shape: The shape of the output tensor.
 */
/** @doc {heading: 'Operations', subheading: 'Slicing and Joining'} */
function gatherND_<T extends Tensor, K extends Tensor>(
    x: K|TensorLike, indices: T|TensorLike): Tensor<Rank> {
  const $indices = convertToTensor(indices, 'indices', 'gatherND');
  const $x = convertToTensor(x, 'x', 'gatherND');
  return ENV.engine.runKernel(
             backend => backend.gatherND($x, $indices), {$x, $indices}) as
      Tensor<Rank>;
}
export const gatherND = op({gatherND_});
