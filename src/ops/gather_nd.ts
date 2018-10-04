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
 * Gather slices from input tensor into a Tensor with shape specified by
 * indices.
 *
 * indices is an K-dimensional integer tensor, best thought of as a
 * (K-1)-dimensional tensor of indices into params, where each element defines a
 * slice of params:
 * output[\\(i_0, ..., i_{K-2}\\)] = params[indices[\\(i_0, ..., i_{K-2}\\)]]
 *
 * Whereas in gather indices defines slices into the first dimension of
 * params, in gatherND, indices defines slices into the first N dimensions
 * of params, where N = indices.shape[-1].
 *
 * The last dimension of indices can be at most the rank of params:
 * indices.shape[-1] <= params.rank
 *
 * The last dimension of indices corresponds to elements
 * (if indices.shape[-1] == params.rank) or slices
 * (if indices.shape[-1] < params.rank) along dimension indices.shape[-1] of
 * params.
 * The output tensor has shape
 * indices.shape[:-1] + params.shape[indices.shape[-1]:]
 *
 * Note that on CPU, if an out of bound index is found, an error is returned. On
 * GPU, if an out of bound index is found, a 0 is stored in the corresponding
 * output value.
 *
 * ```js
 * indices = tf.tensor2d([0, 1, 1, 0], [2,2], 'int32');
 * input = tf.tensor2d([9, 10, 11, 12], [2, 2]);
 * tf.gatherND(indices, input]).print() //[10, 11]
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
