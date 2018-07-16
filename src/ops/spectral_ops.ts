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
import {op} from '../ops/operation';
import {Tensor2D} from '../tensor';
import {assert} from '../util';

/**
 * Compute the 1-dimentional discrete fourier transform
 * The input is expected to be the 2D tensor with the shape [n, 2].
 * Inner-most value represents a complex value.
 *
 * ```js
 * const x = tf.tensor2d([1, 0], [2, 0]);
 *
 * x.fft().print();
 * ```
 * @param {Tensor2D} input
 * @private
 */
function fft_(input: Tensor2D): Tensor2D {
  assert(input.shape[1] === 2,
    'Inner dimension must be 2 to represents complex number');
  const ret = ENV.engine.runKernel(backend => backend.fft(input), {input});
  return ret;
}

export const fft = op({fft_});
