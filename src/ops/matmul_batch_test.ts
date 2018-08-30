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

import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {ALL_ENVS, expectArraysClose} from '../test_util';

describeWithFlags('matmulBatch', ALL_ENVS, () => {
  it('A x B', () => {
    const a = tf.tensor3d([-5, -5, -6, 8, -2, -8, 4, -7, -6, -9, -1, 3, 7, -2, 5, -6, 3, 8, 7, -8, 1, 4, -4, 6, 4, -4, -9, -5, 2, -2], [5, 2, 3]);
    const b = tf.tensor3d([-8, -4, -1, 0, -7, 0, 3, 3, 6, 2, -1, 8, -4, 9, -6, 5, 8, 9, -9, 7, 0, -1, -1, -10, -7, 3, 4, 6, 3, -4], [5, 3, 2]);

    const c = tf.matMul(a, b);
    expect(c.shape).toEqual([5, 2, 2]);
    expectArraysClose(c, [87, 20, -6, -32, -24, -50, -36, -5, 24, 98, 70, 33, -64, 47, -42, -28, -71, 24, 37, 5]);
  });

  it('A x B^t', () => {
    const a = tf.tensor3d([-5, -5, -6, 8, -2, -8, 4, -7, -6, -9, -1, 3, 7, -2, 5, -6, 3, 8, 7, -8, 1, 4, -4, 6, 4, -4, -9, -5, 2, -2], [5, 2, 3]);
    const b = tf.tensor3d([-8, -4, -1, 0, -7, 0, 3, 3, 6, 2, -1, 8, -4, 9, -6, 5, 8, 9, -9, 7, 0, -1, -1, -10, -7, 3, 4, 6, 3, -4], [5, 2, 3]);

    const transposeA = false;
    const transposeB = true;
    const c = tf.matMul(a, b, transposeA, transposeB);
    expect(c.shape).toEqual([5, 2, 2]);
    expectArraysClose(c, [66, 35, -48, 14, -45, -33, -12, 7, -76, 64, 3, 66, -119, -9, -64, -60, -76, 48, 33, -16]);
  });

  it('A^t x B', () => {
    const a = tf.tensor3d([-5, -5, -6, 8, -2, -8, 4, -7, -6, -9, -1, 3, 7, -2, 5, -6, 3, 8, 7, -8, 1, 4, -4, 6, 4, -4, -9, -5, 2, -2], [5, 2, 3]);
    const b = tf.tensor3d([-8, -4, -1, 0, -7, 0, 3, 3, 6, 2, -1, 8, -4, 9, -6, 5, 8, 9, -9, 7, 0, -1, -1, -10, -7, 3, 4, 6, 3, -4], [5, 2, 3]);

    const transposeA = true;
    const transposeB = false;
    const c = tf.matMul(a, b, transposeA, transposeB);

    expectArraysClose(c, [40, -36, 5, 40, 34, 5, 48, 80, 6, -6, 21, -48, -23, -20, -50, -12, -21, -12, -58, 15, -96, 23, 6, 39, 20, 109, 42, -67, 45, -40, 76, -52, 40, -15, 1, -60, -58, -3, 36, 40, -6, -24, 51, -33, -28]);
  });

  it('annyuanA^t x B^t', () => {
    const a = tf.tensor3d([-5, -5, -6, 8, -2, -8, 4, -7, -6, -9, -1, 3, 7, -2, 5, -6, 3, 8, 7, -8, 1, 4, -4, 6, 4, -4, -9, -5, 2, -2], [5, 3, 2]);
    const b = tf.tensor3d([-8, -4, -1, 0, -7, 0, 3, 3, 6, 2, -1, 8, -4, 9, -6, 5, 8, 9, -9, 7, 0, -1, -1, -10, -7, 3, 4, 6, 3, -4], [5, 2, 3]);

    const transposeA = true;
    const transposeB = true;
    const c = tf.matMul(a, b, transposeA, transposeB);
    expectArraysClose(c, [66, 42, 16, -56, -12, 6, -30, 19, -1, 102, -94, 14, -56, 32, 100, -56, -47, -11, 5, -31]);
  });

  it('batch dimensions do not match', () => {
    const a = tf.tensor3d([-5, -5, -6, 8, -2, -8, 4, -7, -6, -9, -1, 3, 7, -2, 5, -6, 3, 8, 7, -8, 1, 4, -4, 6], [4, 3, 2]);
    const b = tf.tensor3d([-8, -4, -1, 0, -7, 0, 3, 3, 6, 2, -1, 8, -4, 9, -6, 5, 8, 9, -9, 7, 0, -1, -1, -10, -7, 3, 4, 6, 3, -4], [5, 2, 3]);

    const f = () => {
      tf.matMul(a, b, false, false);
    };
    expect(f).toThrowError();
  });

  it('annyuangradients: A x B', () => {
    const a = tf.tensor3d([-5, -5, -6, 8, -2, -8, 4, -7, -6, -9, -1, 3, 7, -2, 5, -6, 3, 8, 7, -8, 1, 4, -4, 6, 4, -4, -9, -5, 2, -2], [5, 2, 3]);
    const b = tf.tensor3d([-8, -4, -1, 0, -7, 0, 3, 3, 6, 2, -1, 8, -4, 9, -6, 5, 8, 9, -9, 7, 0, -1, -1, -10, -7, 3, 4, 6, 3, -4], [5, 3, 2]);
    const dy = tf.tensor3d([8, 2, -3, -2, -8, 4, 5, 7, 4, -4, -4, 5, 8, 10, 1, 0, 6, 6, -4, 7], [5, 2, 2]);

    const grads = tf.grads(
      (a: tf.Tensor3D, b: tf.Tensor3D) => tf.matMul(a, b, false, false));
    const [da, db] = grads([a, b], dy);

    // da = dy * bT
    expect(da.shape).toEqual(a.shape);
    expectArraysClose(da, [-72, -8, -56, 32, 3, 21, -12, -40, 40, 36, 44, 51, -52, -44, -4, 61, 49, 13, -2, -10, -108, -9, 0, -1, -24, 60, -6, 49, 26, -40]);

    // db = aT * dy
    expect(db.shape).toEqual(b.shape);
    expectArraysClose(db, [-64, -26, -34, -6, -24, 4, -77, -47, 51, -35, 63, -3, 52, -58, -20, 23, -12, 20, 60, 70, -68, -80, 14, 10, 44, -11, -32, -10, -46, -68]);
  });

  it('gradients: A x B^t', () => {

  });

  it('gradients: A^t x B', () => {

  });

  it('gradients: A^t x B^t', () => {

  });
});