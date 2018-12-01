/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import {ALL_ENVS, expectArraysEqual} from '../test_util';

describeWithFlags('diag', ALL_ENVS, () => {
  it('1d', () => {
    const m = tf.tensor1d([5]);
    const diag = tf.diag(m);
    expectArraysEqual(diag.shape, [1, 1]);
    expectArraysEqual(diag, tf.tensor2d([5], [1, 1]));
  });
  it('2d', () => {
    const m = tf.tensor2d([8, 2, 3, 4, 5, 1], [3, 2]);
    const diag = tf.diag(m);
    expectArraysEqual(diag.shape, [3, 2, 3, 2]);
    expectArraysEqual(
        diag,
        tf.tensor4d(
            [
              8, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0,
              0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 1
            ],
            [3, 2, 3, 2]));
  });
  it('3d', () => {
    const m = tf.tensor3d([8, 5, 5, 7, 9, 10, 15, 1, 2, 14, 12, 3], [2, 2, 3]);
    const diag = tf.diag(m);
    expectArraysEqual(diag.shape, [2, 2, 3, 2, 2, 3]);
    expectArraysEqual(
        diag,
        tf.tensor6d(
            [
              8, 0, 0,  0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  5, 0, 0,  0, 0, 0, 0, 0,
              0, 0, 0,  0, 0,  5, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0,  0, 0, 7, 0, 0,
              0, 0, 0,  0, 0,  0, 0, 0, 0, 0, 9, 0, 0,  0, 0, 0,  0, 0, 0, 0, 0,
              0, 0, 10, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 15, 0, 0, 0, 0, 0,
              0, 0, 0,  0, 0,  0, 0, 1, 0, 0, 0, 0, 0,  0, 0, 0,  0, 0, 0, 0, 2,
              0, 0, 0,  0, 0,  0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0,  0, 0, 0, 0, 0,
              0, 0, 0,  0, 12, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0,  0, 3,
            ],
            [2, 2, 3, 2, 2, 3]));
  });
  it('4d', () => {
    const m = tf.tensor4d(
        [
          8, 5, 5, 7, 9,  10, 15, 1, 2, 14, 12, 3,
          9, 6, 6, 8, 10, 11, 16, 2, 3, 15, 13, 4
        ],
        [2, 2, 3, 2]);
    const diag = tf.diag(m);
    expectArraysEqual(diag.shape, [2, 2, 3, 2, 2, 2, 3, 2]);
    expectArraysEqual(
        diag,
        tf.tensor(
            [
              8,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 5,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 5,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 7, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              9,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 10, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 1, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              2,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 14, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 3, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              9,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 6,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 6,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 8, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              10, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 11, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 2, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              3,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 15, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 4
            ],
            [2, 2, 3, 2, 2, 2, 3, 2]));
  });
});
