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

describeWithFlags('solve_linear', ALL_ENVS, () => {
  it('solve equation with a the matrix eye', () => {
    const a = tf.eye(3);
    const b = tf.tensor2d([1, 2, 3], [3, 1]);
    const x = tf.solve(a, b);
    expect(() => expectArraysClose(x, [1, 2, 3]));
  });

  it('solve equation with a the matrix eye times 2', () => {
    const a = tf.eye(3).mul(tf.scalar(2));
    const b = tf.tensor2d([1, 2, 3], [3, 1]);
    const x = tf.solve(a, b);
    expect(() => expectArraysClose(x, [1, 2, 3]));
  });

  it('should throw error if a is not inversible', () => {
    const a = tf.ones([3, 3]);
    const b = tf.tensor2d([1, 2, 3], [3, 1]);
    expect(() => tf.solve(a, b)).toThrowError('Input matrix is not inversible');
  });
});
