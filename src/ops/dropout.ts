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
import {convertToTensor} from '../tensor_util_env';
import {TensorLike} from '../types';
import * as util from '../util';

import {randomUniform} from './array_ops';
import {op} from './operation';

/**
 * Normalize noise shape based on provided tensor and noise shape.
 *
 * ```js
 * const x = tf.ones([2, 3]);
 * const noiseShape = [2, 3];
 * const shape = tf.getNoiseShape(x, noiseShape);
 * console.log(shape);
 * ```
 *
 * @param x Tensor or TensorLike.
 * @param noiseShape A 1-D Tensor of type int32, representing the shape for
 *   randomly generated keep/drop flags. Optional.
 * @returns Normalized noise shape.
 */
function getNoiseShape_<T extends Tensor>(
    x: T|TensorLike, noiseShape?: number[]): number[] {
  const $x = convertToTensor(x, 'x', 'getNoiseShape');

  if (noiseShape == null) {
    return $x.shape.slice();
  }
  if (util.arraysEqual($x.shape, noiseShape)) {
    return noiseShape;
  }
  if ($x.shape.length === noiseShape.length) {
    const newDimension: number[] = [];
    for (let i = 0; i < $x.shape.length; i++) {
      if (noiseShape[i] == null && $x.shape[i] != null) {
        newDimension.push($x.shape[i]);
      } else {
        newDimension.push(noiseShape[i]);
      }
    }
    return newDimension;
  }

  return noiseShape;
}

/**
 * Computes dropout.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 2, 1]);
 * const rate = 0.75;
 * const output = tf.dropout(x, rate);
 * output.print();
 * ```
 *
 * @param x A floating point Tensor or TensorLike.
 * @param rate A float in the range [0, 1). The probability that each element
 *   of x is discarded.
 * @param noiseShape A 1-D Tensor of type int32, representing the shape for
 *   randomly generated keep/drop flags. Optional.
 * @param seed Used to create random seeds. Optional.
 * @returns A Tensor of the same shape of x.
 */
/** @doc {heading: 'Operations', subheading: 'Dropout'} */
function dropout_<T extends Tensor>(
    x: T|TensorLike, rate: number, noiseShape?: number[],
    seed?: number|string): T {
  const $x = convertToTensor(x, 'x', 'dropout');

  util.assert(
      $x.dtype === 'float32',
      () => 'x has to be a floating point tensor since it\'s going to be ' +
          `scaled, but got a ${$x.dtype} tensor instead.`);
  util.assert(
      rate >= 0 && rate < 1,
      () => `rate must be a float in the range [0, 1), but got ${rate}.`);
  if (rate === 0) {
    return (x instanceof Tensor ? $x.clone() : $x) as T;
  }

  const $noiseShape = getNoiseShape($x, noiseShape);
  const keepProb = 1 - rate;
  const multiplier = randomUniform($noiseShape, 0, 1, 'float32', seed)
                         .add(keepProb)
                         .floor()
                         .div(keepProb);

  return $x.mul(multiplier) as T;
}

export const dropout = op({dropout_});
export const getNoiseShape = op({getNoiseShape_});
