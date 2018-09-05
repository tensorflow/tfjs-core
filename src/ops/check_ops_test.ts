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

import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {ALL_ENVS} from '../test_util';

describeWithFlags('assertEqual', ALL_ENVS, () => {
  it('throws when a != b', () => {
    const a = tf.tensor1d([1, 4, 5], 'int32');
    const b = tf.tensor1d([2, 3, 5], 'int32');

    expect(() => tf.assertEqual(a, b))
        .toThrowError(/Conditon a == b did not hold/);
  });

  it('a == b chainable', () => {
    const a = tf.tensor1d([1, 4, 5], 'int32');
    const b = tf.tensor1d([1, 4, 5], 'int32');

    expect(() => a.assertEqual(b)).not.toThrow();
  });

  it('a == b', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([1, 4, 5], 'int32');

    expect(() => tf.assertEqual(a, b)).not.toThrow();

    a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    b = tf.tensor1d([1.1, 4.1, 5.1], 'float32');

    expect(() => tf.assertEqual(a, b)).not.toThrow();

    a = tf.tensor1d([1, 0, 1], 'bool');
    b = tf.tensor1d([1, 0, 1], 'bool');

    expect(() => tf.assertEqual(a, b)).not.toThrow();
  });

  it('throws when having different dtypes', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([1, 4, 5], 'float32');

    let e = new RegExp(`The dtypes of the first\\(${a.dtype}\\) and second\\(${
        b.dtype}\\) input must match`);

    expect(() => tf.assertEqual(a, b)).toThrowError(e);

    a = tf.tensor1d([1, 0, 1], 'int32');
    b = tf.tensor1d([1, 0, 1], 'bool');

    e = new RegExp(`The dtypes of the first\\(${a.dtype}\\) and second\\(${
        b.dtype}\\) input must match`);

    expect(() => tf.assertEqual(a, b)).toThrowError(e);

    a = tf.tensor1d([1, 0, 1], 'float32');
    b = tf.tensor1d([1, 0, 1], 'bool');

    e = new RegExp(`The dtypes of the first\\(${a.dtype}\\) and second\\(${
        b.dtype}\\) input must match`);

    expect(() => tf.assertEqual(a, b)).toThrowError(e);
  });

  it('throws when mismatched Tensor1D shapes', () => {
    const a = tf.tensor1d([1, 4], 'int32');
    const b = tf.tensor1d([1, 4, 5], 'int32');

    const e = new RegExp(
        `Operands could not be broadcast together with shapes ` +
        `${a.shape} and ${b.shape}.`);

    expect(() => tf.assertEqual(a, b)).toThrowError(e);
  });

  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([1.1, NaN, 2.1], 'float32');

    expect(() => tf.assertEqual(a, b)).toThrow();
  });

  it('scalar and 1D broadcast', () => {
    const a = tf.scalar(2);
    let b = tf.tensor1d([1, 2, 3, 4, 5, 2]);

    expect(() => tf.assertEqual(a, b))
        .toThrowError(/Conditon a == b did not hold/);

    b = tf.tensor1d([2, 2, 2, 2, 2, 2]);

    expect(() => tf.assertEqual(a, b)).not.toThrow();
  });

  // Tensor2D:
  it('2D and 2D broadcast', () => {
    const a = tf.tensor2d([[5, 5, 5], [1, 1, 1]], [2, 3]);
    const b = tf.tensor2d([5, 1], [2, 1]);

    expect(() => tf.assertEqual(a, b)).not.toThrow();
  });
  it('2D and scalar broadcast', () => {
    const a = tf.tensor2d([1, 2, 3, 2, 5, 6], [2, 3]);
    const b = tf.scalar(2);

    expect(() => tf.assertEqual(a, b))
        .toThrowError(/Conditon a == b did not hold/);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.assertEqual({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'assertEqual' must be a Tensor/);
  });

  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.assertEqual(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'assertEqual' must be a Tensor/);
  });

  it('accepts a tensor-like object', () => {
    const a = [1, 4, 5];
    const b = [2, 3, 5];

    expect(() => tf.assertEqual(a, b))
        .toThrowError(/Conditon a == b did not hold/);
  });
});
