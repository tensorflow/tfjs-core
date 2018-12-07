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

describeWithFlags('diagpart', ALL_ENVS, () => {
  it('diag1d', () => {
    const m = tf.tensor1d([1]);
    expect(() => tf.diagPart(m)).toThrowError();
  });
  it('diag2d 2x2', () => {
    const m = tf.tensor2d([[5, 4], [5, 6]]);
    const d = tf.diagPart(m);
    expectArraysEqual(d.shape, [2]);
    expectArraysEqual(d, tf.tensor1d([5, 6]));
  });
  it('diag2d 2*1', () => {
    const m = tf.tensor2d([[5], [6]]);
    expect(() => tf.diagPart(m)).toThrowError();
  });
  it('diag2d 3x3', () => {
    const m = tf.tensor2d([[5, 4, 5], [5, 6, 3], [5, 4, 3]]);
    const d = tf.diagPart(m);
    expectArraysEqual(d.shape, [3]);
    expectArraysEqual(d, tf.tensor1d([5, 6, 3]));
  });
  it('diag3d 3*3*4', () => {
    const m = tf.tensor(Array.from(Array(36).keys()), [3, 3, 4]);
    expect(() => tf.diagPart(m)).toThrowError();
  });
  it('diag4d 3*2*3*2 int32', () => {
    const m = tf.tensor(Array.from(Array(36).keys()), [3, 2, 3, 2], 'int32');
    const d = tf.diagPart(m);
    expectArraysEqual(d.shape, [3, 2]);
    expect(d.dtype).toBe('int32');
    expectArraysEqual(d, tf.tensor([0, 7, 14, 21, 28, 35], [3, 2], 'int32'));
  });
  it('diag4d 3*2*3*2 bool', () => {
    const m = tf.tensor(Array.from(Array(36).keys()), [3, 2, 3, 2], 'bool');
    const d = tf.diagPart(m);
    expectArraysEqual(d.shape, [3, 2]);
    expect(d.dtype).toBe('bool');
    expectArraysEqual(d, tf.tensor([0, 1, 1, 1, 1, 1], [3, 2], 'bool'));
  });
});
