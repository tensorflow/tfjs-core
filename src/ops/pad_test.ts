/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {Environment} from '../environment';
import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
// tslint:disable-next-line:max-line-length
import {ALL_ENVS, expectArraysClose} from '../test_util';

describeWithFlags('pad1d', ALL_ENVS, () => {
  it('Should pad 1D arrays', () => {
    const a = tf.tensor1d([1, 2, 3, 4, 5, 6], 'int32');
    const b = tf.pad1d(a, [2, 3]);
    expectArraysClose(b, [0, 0, 1, 2, 3, 4, 5, 6, 0, 0, 0]);
  });

  it('Should not pad 1D arrays with 0s', () => {
    const a = tf.tensor1d([1, 2, 3, 4], 'int32');
    const b = tf.pad1d(a, [0, 0]);
    expectArraysClose(b, [1, 2, 3, 4]);
  });

  it('Should handle padding with custom value', () => {
    let a = tf.tensor1d([1, 2, 3, 4], 'int32');
    let b = tf.pad1d(a, [2, 3], 9);
    expectArraysClose(b, [9, 9, 1, 2, 3, 4, 9, 9, 9]);

    a = tf.tensor1d([1, 2, 3, 4]);
    b = tf.pad1d(a, [2, 1], 1.1);
    expectArraysClose(b, [1.1, 1.1, 1, 2, 3, 4, 1.1]);

    a = tf.tensor1d([1, 2, 3, 4]);
    b = tf.pad1d(a, [2, 1], 1);
    expectArraysClose(b, [1, 1, 1, 2, 3, 4, 1]);
  });

  it('Should handle NaNs with 1D arrays', () => {
    const a = tf.tensor1d([1, NaN, 2, NaN]);
    const b = tf.pad1d(a, [1, 1]);
    expectArraysClose(b, [0, 1, NaN, 2, NaN, 0]);
  });

  it('Should handle invalid paddings', () => {
    const a = tf.tensor1d([1, 2, 3, 4], 'int32');
    const f = () => {
      // tslint:disable-next-line:no-any
      tf.pad1d(a, [2, 2, 2] as any);
    };
    expect(f).toThrowError();
  });

  it('grad', () => {
    const a = tf.tensor1d([1, 2, 3]);
    const dy = tf.tensor1d([10, 20, 30, 40, 50, 60]);
    const da = tf.grad((a: tf.Tensor1D) => tf.pad1d(a, [2, 1]))(a, dy);
    expect(da.shape).toEqual([3]);
    expectArraysClose(da, [30, 40, 50]);
  });

  it('accepts a tensor-like object', () => {
    const a = [1, 2, 3, 4, 5, 6];
    const b = tf.pad1d(a, [2, 3]);
    expectArraysClose(b, [0, 0, 1, 2, 3, 4, 5, 6, 0, 0, 0]);
  });
});

describeWithFlags('pad2d', ALL_ENVS, () => {
  it('Should pad 2D arrays', () => {
    let a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
    let b = tf.pad2d(a, [[1, 1], [1, 1]]);
    // 0, 0, 0
    // 0, 1, 0
    // 0, 2, 0
    // 0, 0, 0
    expectArraysClose(b, [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0]);

    a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
    b = tf.pad2d(a, [[2, 2], [1, 1]]);
    // 0, 0, 0, 0, 0
    // 0, 0, 0, 0, 0
    // 0, 1, 2, 3, 0
    // 0, 4, 5, 6, 0
    // 0, 0, 0, 0, 0
    // 0, 0, 0, 0, 0
    expectArraysClose(b, [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0,
      0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
  });

  it('Should not pad 2D arrays with 0s', () => {
    const a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
    const b = tf.pad2d(a, [[0, 0], [0, 0]]);
    expectArraysClose(b, [1, 2, 3, 4, 5, 6]);
  });

  it('Should handle padding with custom value', () => {
    let a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
    let b = tf.pad2d(a, [[1, 1], [1, 1]], 10);
    expectArraysClose(b, [
      10, 10, 10, 10, 10, 10, 1,  2,  3,  10,
      10, 4,  5,  6,  10, 10, 10, 10, 10, 10
    ]);

    a = tf.tensor2d([[1], [1]], [2, 1]);
    b = tf.pad2d(a, [[1, 1], [1, 1]], -2.1);
    expectArraysClose(
        b, [-2.1, -2.1, -2.1, -2.1, 1, -2.1, -2.1, 1, -2.1, -2.1, -2.1, -2.1]);

    a = tf.tensor2d([[1], [1]], [2, 1]);
    b = tf.pad2d(a, [[1, 1], [1, 1]], -2);
    expectArraysClose(b, [-2, -2, -2, -2, 1, -2, -2, 1, -2, -2, -2, -2]);
  });

  it('Should handle NaNs with 2D arrays', () => {
    const a = tf.tensor2d([[1, NaN], [1, NaN]], [2, 2]);
    const b = tf.pad2d(a, [[1, 1], [1, 1]]);
    // 0, 0, 0,   0
    // 0, 1, NaN, 0
    // 0, 1, NaN, 0
    // 0, 0, 0,   0
    expectArraysClose(b, [0, 0, 0, 0, 0, 1, NaN, 0, 0, 1, NaN, 0, 0, 0, 0, 0]);
  });

  it('Should handle invalid paddings', () => {
    const a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
    const f = () => {
      // tslint:disable-next-line:no-any
      tf.pad2d(a, [[2, 2, 2], [1, 1, 1]] as any);
    };
    expect(f).toThrowError();
  });

  it('grad', () => {
    const a = tf.tensor2d([[1, 2], [3, 4]]);
    const dy = tf.tensor2d([[0, 0, 0], [10, 20, 0], [30, 40, 0]], [3, 3]);
    const da =
        tf.grad((a: tf.Tensor2D) => tf.pad2d(a, [[1, 0], [0, 1]]))(a, dy);
    expect(da.shape).toEqual([2, 2]);
    expectArraysClose(da, [10, 20, 30, 40]);
  });

  it('accepts a tensor-like object', () => {
    const a = [[1, 2, 3], [4, 5, 6]];  // 2x3
    const b = tf.pad2d(a, [[0, 0], [0, 0]]);
    expectArraysClose(b, [1, 2, 3, 4, 5, 6]);
  });
});

describeWithFlags('pad4d', ALL_ENVS, () => {
  it('Should pad 4D arrays', () => {
    const a = tf.tensor4d([[[[9]]]], [1, 1, 1, 1], 'int32');
    const b = tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
    const expected = tf.tensor4d(
        [[[[0], [0], [0]], [[0], [9], [0]], [[0], [0], [0]]]], [1, 3, 3, 1],
        'int32');
    expectArraysClose(b, expected);
  });

  it('does not leak memory', () => {
    const a = tf.tensor4d([[[[9]]]], [1, 1, 1, 1], 'int32');
    // The first call to pad may create and keeps internal singleton tensors.
    // Subsequent calls should always create exactly one new tensor.
    tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
    // Count before real call.
    const numTensors = Environment.memory().numTensors;
    tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
    expect(Environment.memory().numTensors).toEqual(numTensors + 1);
  });

  it('accepts a tensor-like object', () => {
    const a = [[[[9]]]];  // 1x1x1x1
    const b = tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
    const expected = tf.tensor4d(
        [[[[0], [0], [0]], [[0], [9], [0]], [[0], [0], [0]]]], [1, 3, 3, 1],
        'float32');
    expectArraysClose(b, expected);
  });
});

describeWithFlags('pad', ALL_ENVS, () => {
  it('Pad tensor2d', () => {
    let a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
    let b = tf.pad(a, [[1, 1], [1, 1]]);
    // 0, 0, 0
    // 0, 1, 0
    // 0, 2, 0
    // 0, 0, 0
    expectArraysClose(b, [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0]);

    a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
    b = tf.pad(a, [[2, 2], [1, 1]]);
    // 0, 0, 0, 0, 0
    // 0, 0, 0, 0, 0
    // 0, 1, 2, 3, 0
    // 0, 4, 5, 6, 0
    // 0, 0, 0, 0, 0
    // 0, 0, 0, 0, 0
    expectArraysClose(b, [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0,
      0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
  });

  it('throws when passed a non-tensor', () => {
    expect(() => tf.pad({} as tf.Tensor, [[0, 0]]))
        .toThrowError(/Argument 'x' passed to 'pad' must be a Tensor/);
  });

  it('accepts a tensor-like object', () => {
    const x = [[1], [2]];
    const res = tf.pad(x, [[1, 1], [1, 1]]);
    // 0, 0, 0
    // 0, 1, 0
    // 0, 2, 0
    // 0, 0, 0
    expectArraysClose(res, [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0]);
  });
});

describeWithFlags('reflection pad', ALL_ENVS, () => {
  it('pads tensor1d', () => {
    const a = tf.tensor1d([1, 2, 3, 4, 5, 6]);
    const res = tf.pad1d(a, [1, 2], 0, 'reflect');
    // 2, 1, 2, 3, 4, 5, 6, 5, 4
    expectArraysClose(res, [2, 1, 2, 3, 4, 5, 6, 5, 4]);
  });

  it('pads tensor1d with single padding', () => {
    const a = tf.tensor1d([1, 2, 3, 4, 5, 6]);
    const res = tf.pad1d(a, [1, 1], 0, 'reflect');
    // 2, 1, 2, 3, 4, 5, 6, 5
    expectArraysClose(res, [2, 1, 2, 3, 4, 5, 6, 5]);
  });

  it('pads tensor2d', () => {
    const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
    const res = tf.pad2d(a, [[1, 1], [2, 2]], 0, 'reflect');
    /*
      [[6, 5, 4, 5, 6, 5, 4],
       [3, 2, 1, 2, 3, 2, 1],
       [6, 5, 4, 5, 6, 5, 4],
       [3, 2, 1, 2, 3, 2, 1]]
      */
    expectArraysClose(res, [
      6, 5, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 2, 1,
      6, 5, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 2, 1
    ]);
  });

  it('pads tensor2d with single padding', () => {
    const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
    const res = tf.pad2d(a, [[1, 1], [1, 1]], 0, 'reflect');
    /*
      [[5, 4, 5, 6, 5],
       [2, 1, 2, 3, 2],
       [5, 4, 5, 6, 5],
       [2, 1, 2, 3, 2]]
      */
    expectArraysClose(
        res, [5, 4, 5, 6, 5, 2, 1, 2, 3, 2, 5, 4, 5, 6, 5, 2, 1, 2, 3, 2]);
  });

  it('pads tensor3d', () => {
    const a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 2, 3]);
    const res = tf.pad3d(a, [[1, 1], [1, 1], [1, 2]], 0, 'reflect');
    /*
    [[[11, 10, 11, 12, 11, 10],
      [ 8,  7,  8,  9,  8,  7],
      [11, 10, 11, 12, 11, 10],
      [ 8,  7,  8,  9,  8,  7]],

     [[ 5,  4,  5,  6,  5,  4],
      [ 2,  1,  2,  3,  2,  1],
      [ 5,  4,  5,  6,  5,  4],
      [ 2,  1,  2,  3,  2,  1]],

     [[11, 10, 11, 12, 11, 10],
      [ 8,  7,  8,  9,  8,  7],
      [11, 10, 11, 12, 11, 10],
      [ 8,  7,  8,  9,  8,  7]],

     [[ 5,  4,  5,  6,  5,  4],
      [ 2,  1,  2,  3,  2,  1],
      [ 5,  4,  5,  6,  5,  4],
      [ 2,  1,  2,  3,  2,  1]]]
    ]
    */
    expectArraysClose(res, [
      11, 10, 11, 12, 11, 10, 8, 7, 8, 9, 8, 7, 11, 10, 11, 12,
      11, 10, 8,  7,  8,  9,  8, 7, 5, 4, 5, 6, 5,  4,  2,  1,
      2,  3,  2,  1,  5,  4,  5, 6, 5, 4, 2, 1, 2,  3,  2,  1,
      11, 10, 11, 12, 11, 10, 8, 7, 8, 9, 8, 7, 11, 10, 11, 12,
      11, 10, 8,  7,  8,  9,  8, 7, 5, 4, 5, 6, 5,  4,  2,  1,
      2,  3,  2,  1,  5,  4,  5, 6, 5, 4, 2, 1, 2,  3,  2,  1
    ]);
  });

  it('pads tensor4d', () => {
    const a = tf.tensor4d(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [2, 2, 2, 2]);
    const res = tf.pad4d(a, [[1, 1], [1, 1], [1, 1], [1, 1]], 0, 'reflect');
    /*
    [[[[16, 15, 16, 15],
         [14, 13, 14, 13],
         [16, 15, 16, 15],
         [14, 13, 14, 13]],

        [[12, 11, 12, 11],
         [10,  9, 10,  9],
         [12, 11, 12, 11],
         [10,  9, 10,  9]],

        [[16, 15, 16, 15],
         [14, 13, 14, 13],
         [16, 15, 16, 15],
         [14, 13, 14, 13]],

        [[12, 11, 12, 11],
         [10,  9, 10,  9],
         [12, 11, 12, 11],
         [10,  9, 10,  9]]],

       [[[ 8,  7,  8,  7],
         [ 6,  5,  6,  5],
         [ 8,  7,  8,  7],
         [ 6,  5,  6,  5]],

        [[ 4,  3,  4,  3],
         [ 2,  1,  2,  1],
         [ 4,  3,  4,  3],
         [ 2,  1,  2,  1]],

        [[ 8,  7,  8,  7],
         [ 6,  5,  6,  5],
         [ 8,  7,  8,  7],
         [ 6,  5,  6,  5]],

        [[ 4,  3,  4,  3],
         [ 2,  1,  2,  1],
         [ 4,  3,  4,  3],
         [ 2,  1,  2,  1]]],

       [[[16, 15, 16, 15],
         [14, 13, 14, 13],
         [16, 15, 16, 15],
         [14, 13, 14, 13]],

        [[12, 11, 12, 11],
         [10,  9, 10,  9],
         [12, 11, 12, 11],
         [10,  9, 10,  9]],

        [[16, 15, 16, 15],
         [14, 13, 14, 13],
         [16, 15, 16, 15],
         [14, 13, 14, 13]],

        [[12, 11, 12, 11],
         [10,  9, 10,  9],
         [12, 11, 12, 11],
         [10,  9, 10,  9]]],

       [[[ 8,  7,  8,  7],
         [ 6,  5,  6,  5],
         [ 8,  7,  8,  7],
         [ 6,  5,  6,  5]],

        [[ 4,  3,  4,  3],
         [ 2,  1,  2,  1],
         [ 4,  3,  4,  3],
         [ 2,  1,  2,  1]],

        [[ 8,  7,  8,  7],
         [ 6,  5,  6,  5],
         [ 8,  7,  8,  7],
         [ 6,  5,  6,  5]],

        [[ 4,  3,  4,  3],
         [ 2,  1,  2,  1],
         [ 4,  3,  4,  3],
         [ 2,  1,  2,  1]]]]
         */
    expectArraysClose(res, [
      16, 15, 16, 15, 14, 13, 14, 13, 16, 15, 16, 15, 14, 13, 14, 13, 12, 11,
      12, 11, 10, 9,  10, 9,  12, 11, 12, 11, 10, 9,  10, 9,  16, 15, 16, 15,
      14, 13, 14, 13, 16, 15, 16, 15, 14, 13, 14, 13, 12, 11, 12, 11, 10, 9,
      10, 9,  12, 11, 12, 11, 10, 9,  10, 9,  8,  7,  8,  7,  6,  5,  6,  5,
      8,  7,  8,  7,  6,  5,  6,  5,  4,  3,  4,  3,  2,  1,  2,  1,  4,  3,
      4,  3,  2,  1,  2,  1,  8,  7,  8,  7,  6,  5,  6,  5,  8,  7,  8,  7,
      6,  5,  6,  5,  4,  3,  4,  3,  2,  1,  2,  1,  4,  3,  4,  3,  2,  1,
      2,  1,  16, 15, 16, 15, 14, 13, 14, 13, 16, 15, 16, 15, 14, 13, 14, 13,
      12, 11, 12, 11, 10, 9,  10, 9,  12, 11, 12, 11, 10, 9,  10, 9,  16, 15,
      16, 15, 14, 13, 14, 13, 16, 15, 16, 15, 14, 13, 14, 13, 12, 11, 12, 11,
      10, 9,  10, 9,  12, 11, 12, 11, 10, 9,  10, 9,  8,  7,  8,  7,  6,  5,
      6,  5,  8,  7,  8,  7,  6,  5,  6,  5,  4,  3,  4,  3,  2,  1,  2,  1,
      4,  3,  4,  3,  2,  1,  2,  1,  8,  7,  8,  7,  6,  5,  6,  5,  8,  7,
      8,  7,  6,  5,  6,  5,  4,  3,  4,  3,  2,  1,  2,  1,  4,  3,  4,  3,
      2,  1,  2,  1
    ]);
  });
});
