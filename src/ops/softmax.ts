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

import {customGrad} from '../gradients';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util';
import {TensorLike} from '../types';
import {op} from './operation';

/**
 * Computes the softmax normalized vector given the logits.
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 *
 * a.softmax().print();  // or tf.softmax(a)
 * ```
 *
 * ```js
 * const a = tf.tensor2d([2, 4, 6, 1, 2, 3], [2, 3]);
 *
 * a.softmax().print();  // or tf.softmax(a)
 * ```
 *
 * @param logits The logits array.
 * @param dim The dimension softmax would be performed on. Defaults to `-1`
 *     which indicates the last dimension.
 */
/** @doc {heading: 'Operations', subheading: 'Normalization'} */
function softmax_<T extends Tensor>(logits: T|TensorLike, dim = -1): T {
  const $logits = convertToTensor(logits, 'logits', 'softmax');

  if (dim === -1) {
    dim = $logits.rank - 1;
  }
  if (dim !== $logits.rank - 1) {
    throw Error(
        'Softmax along a non-last dimension is not yet supported. ' +
        `Logits was rank ${$logits.rank} and dim was ${dim}`);
  }

  const customOp = customGrad(logits => {
    // Do it in log space for numerical stability.
    // exp(X - logSumExp(X))
    const keepDims = true;
    const lse = logits.logSumExp([dim], keepDims);
    const logResult = logits.toFloat().sub(lse);
    const y = logResult.exp() as T;

    const gradFunc = (dy: T) => {
      const dyTimesY = dy.mul(y);
      const keepDims = true;
      return dyTimesY.sub(dyTimesY.sum([dim], keepDims).mul(y));
    };

    return {value: y, gradFunc};
  });

  return customOp($logits);
}

export const softmax = op({softmax_});
