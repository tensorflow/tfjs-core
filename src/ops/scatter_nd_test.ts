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
import {CPU_ENVS, expectArraysClose} from '../test_util';

describeWithFlags('ScatterNdTest', CPU_ENVS, () => {
  it('should work for 2d', () => {
    const indices = tf.tensor1d([0, 4, 2], 'int32');
    const updates = tf.tensor2d(
        [100, 101, 102, 777, 778, 779, 10000, 10001, 10002], [3, 3], 'int32');
    const shape = [5, 3];
    const result = tf.scatterND(updates, indices, shape);
    expect(result.shape).toEqual(shape);
    expectArraysClose(
        result,
        [100, 101, 102, 0, 0, 0, 10000, 10001, 10002, 0, 0, 0, 777, 778, 779]);
  });

  it('should work for single 1d', () => {
    const indices = tf.tensor1d([3], 'int32');
    const updates = tf.tensor1d([101], 'float32');
    const shape = [5];
    const result = tf.scatterND(updates, indices, shape);
    expect(result.shape).toEqual(shape);
    expectArraysClose(result, [0, 0, 0, 101, 0]);
  });

  it('should work for multiple 1d', () => {
    const indices = tf.tensor1d([0, 4, 2], 'int32');
    const updates = tf.tensor1d([100, 101, 102], 'float32');
    const shape = [5];
    const result = tf.scatterND(updates, indices, shape);
    expect(result.shape).toEqual(shape);
    expectArraysClose(result, [100, 0, 102, 0, 101]);
  });

  it('should work for high rank', () => {
    const indices = tf.tensor3d([0, 4, 2, 1, 3, 6], [2, 3, 1], 'int32');
    const updates = tf.tensor2d([10, 20, 30, 40, 50, 60], [2, 3], 'float32');
    const shape = [8];
    const result = tf.scatterND(updates, indices, shape);
    expect(result.shape).toEqual(shape);
    expectArraysClose(result, [10, 40, 30, 50, 20, 0, 60, 0]);
  });

  it('should throw error when index out of range', () => {
    const indices = tf.tensor2d([0, 4, 99], [3, 1], 'int32');
    const updates = tf.tensor2d(
        [100, 101, 102, 777, 778, 779, 10000, 10001, 10002], [3, 3], 'float32');
    const shape = [5, 3];
    expect(() => tf.scatterND(updates, indices, shape)).toThrow();
  });

  it('should throw error when indices has wrong dimension', () => {
    const indices = tf.tensor3d([0, 4, 99], [1, 3, 1], 'int32');
    const updates = tf.tensor2d(
        [100, 101, 102, 777, 778, 779, 10000, 10001, 10002], [3, 3], 'float32');
    const shape = [2, 3];
    expect(() => tf.scatterND(updates, indices, shape)).toThrow();
  });

  it('should throw error when indices and update mismatch', () => {
    const indices = tf.tensor2d([0, 4, 2], [3, 1], 'int32');
    const updates = tf.tensor2d(
        [100, 101, 102, 103, 777, 778, 779, 780, 10000, 10001, 10002, 10004],
        [3, 4], 'float32');
    const shape = [5, 3];
    expect(() => tf.scatterND(updates, indices, shape)).toThrow();
  });

  it('should throw error when indices and update count mismatch', () => {
    const indices = tf.tensor2d([0, 4, 2], [3, 1], 'int32');
    const updates =
        tf.tensor2d([100, 101, 102, 10000, 10001, 10002], [2, 3], 'float32');
    const shape = [5, 3];
    expect(() => tf.scatterND(updates, indices, shape)).toThrow();
  });
});
