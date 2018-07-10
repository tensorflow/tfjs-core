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

import {doc} from '../doc';
import {ENV} from '../environment';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util';
import * as types from '../types';
import {TensorLike} from '../types';
import {assert, assertShapesMatch} from '../util';
import {assertAndGetBroadcastShape} from './broadcast_util';
import {op} from './operation';
import {zerosLike} from './tensor_ops';

class LogicalOps {
  /**
   * Returns the truth value of `NOT x` element-wise.
   *
   * ```js
   * const a = tf.tensor1d([false, true], 'bool');
   *
   * a.logicalNot().print();
   * ```
   *
   * @param x The input tensor. Must be of dtype 'bool'.
   */
  @doc({heading: 'Operations', subheading: 'Logical'})
  static logicalNot<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'logicalNot', 'bool');
    assert($x.dtype === 'bool', 'Error Array must be of type bool.');

    return ENV.engine.runKernel(backend => backend.logicalNot($x), {$x});
  }

  /**
   * Returns the truth value of a AND b element-wise. Supports broadcasting.
   *
   * ```js
   * const a = tf.tensor1d([false, false, true, true], 'bool');
   * const b = tf.tensor1d([false, true, false, true], 'bool');
   *
   * a.logicalAnd(b).print();
   * ```
   *
   * @param a The first input tensor. Must be of dtype bool.
   * @param b The second input tensor. Must be of dtype bool.
   */
  @doc({heading: 'Operations', subheading: 'Logical'})
  static logicalAnd<T extends Tensor>(
      a: Tensor|TensorLike, b: Tensor|TensorLike): T {
    const $a = convertToTensor(a, 'a', 'logicalAnd', 'bool');
    const $b = convertToTensor(b, 'b', 'logicalAnd', 'bool');
    assert(
        $a.dtype === 'bool' && $b.dtype === 'bool',
        'Error Array must be of type bool.');
    assertAndGetBroadcastShape($a.shape, $b.shape);

    return ENV.engine.runKernel(
               backend => backend.logicalAnd($a, $b), {$a, $b}) as T;
  }

  /**
   * Returns the truth value of `a OR b` element-wise. Supports broadcasting.
   *
   * ```js
   * const a = tf.tensor1d([false, false, true, true], 'bool');
   * const b = tf.tensor1d([false, true, false, true], 'bool');
   *
   * a.logicalOr(b).print();
   * ```
   * @param a The first input tensor. Must be of dtype bool.
   * @param b The second input tensor. Must be of dtype bool.
   */
  @doc({heading: 'Operations', subheading: 'Logical'})
  static logicalOr<T extends Tensor>(
      a: Tensor|TensorLike, b: Tensor|TensorLike): T {
    const $a = convertToTensor(a, 'a', 'logicalOr', 'bool');
    const $b = convertToTensor(b, 'b', 'logicalOr', 'bool');
    assert(
        $a.dtype === 'bool' && $b.dtype === 'bool',
        'Error Array must be of type bool.');
    assertAndGetBroadcastShape($a.shape, $b.shape);

    return ENV.engine.runKernel(
               backend => backend.logicalOr($a, $b), {$a, $b}) as T;
  }

  /**
   * Returns the truth value of `a XOR b` element-wise. Supports broadcasting.
   *
   * ```js
   * const a = tf.tensor1d([false, false, true, true], 'bool');
   * const b = tf.tensor1d([false, true, false, true], 'bool');
   *
   * a.logicalXor(b).print();
   * ```
   *
   * @param a The first input tensor. Must be of dtype bool.
   * @param b The second input tensor. Must be of dtype bool.
   */
  @doc({heading: 'Operations', subheading: 'Logical'})
  static logicalXor<T extends Tensor>(
      a: Tensor|TensorLike, b: Tensor|TensorLike): T {
    const $a = convertToTensor(a, 'a', 'logicalXor', 'bool');
    const $b = convertToTensor(b, 'b', 'logicalXor', 'bool');
    assert(
        $a.dtype === 'bool' && $b.dtype === 'bool',
        'Error Array must be of type bool.');
    assertAndGetBroadcastShape($a.shape, $b.shape);

    // x ^ y = (x | y) & ~(x & y)
    return LogicalOps.logicalOr(a, b).logicalAnd(
               LogicalOps.logicalAnd(a, b).logicalNot()) as T;
  }

  /**
   * Returns the elements, either `a` or `b` depending on the `condition`.
   *
   * If the condition is true, select from `a`, otherwise select from `b`.
   *
   * ```js
   * const cond = tf.tensor1d([false, false, true], 'bool');
   * const a = tf.tensor1d([1 , 2, 3]);
   * const b = tf.tensor1d([-1, -2, -3]);
   *
   * a.where(cond, b).print();
   * ```
   *
   * @param condition The input condition. Must be of dtype bool.
   * @param a If `condition` is rank 1, `a` may have a higher rank but
   *     its first dimension must match the size of `condition`.
   * @param b A tensor with the same shape and type as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Logical'})
  static where<T extends Tensor>(
      condition: Tensor|TensorLike, a: T|TensorLike, b: T|TensorLike): T {
    const $a = convertToTensor(a, 'a', 'where');
    const $b = convertToTensor(b, 'b', 'where');
    const $condition = convertToTensor(condition, 'condition', 'where', 'bool');

    assert(
        $condition.dtype === 'bool', 'Error Condition must be of type bool.');
    assertShapesMatch($a.shape, $b.shape, 'Error in where: ');

    if ($condition.rank === 1) {
      // If condition rank is 1, then the first dimension must match the size of
      // condition.
      assert(
          $condition.shape[0] === $a.shape[0],
          'The first dimension of `a` must match the size of `condition`.');
    } else {
      // A must have the same shape as condition.
      assertShapesMatch($condition.shape, $b.shape, 'Error in where: ');
    }

    // Default to highest precision:
    const dtype = types.upcastType($a.dtype, $b.dtype);

    // TODO(julianoks): Return null for condition gradient
    // when backprop supports it.
    const grad = (dy: T) => ({
      $condition: () => zerosLike($condition),
      $a: () => dy.mul($condition.cast($a.dtype)) as T,
      $b: () => dy.mul($condition.logicalNot().cast($b.dtype)) as T
    });

    return ENV.engine.runKernel(
               backend => backend.where($condition, $a, $b, dtype),
               {$condition, $a, $b}, grad) as T;
  }
}

export const logicalAnd = op(LogicalOps.logicalAnd);
export const logicalNot = op(LogicalOps.logicalNot);
export const logicalOr = op(LogicalOps.logicalOr);
export const logicalXor = op(LogicalOps.logicalXor);
export const where = op(LogicalOps.where);
