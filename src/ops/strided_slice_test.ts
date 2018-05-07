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
// tslint:disable-next-line:max-line-length
import {CPU_ENVS, expectArraysClose} from '../test_util';

describeWithFlags('stridedSlice', CPU_ENVS, () => {
  it('stridedSlice should suport 1d tensor', () => {
    const tensor = tf.tensor1d([0, 1, 2, 3]);
    const output = tf.stridedSlice(tensor, [0], [3], [2]);
    expect(output.shape).toEqual([2]);
    expectArraysClose(output, [0, 2]);
  });

  it('stridedSlice should suport 1d tensor empty result', () => {
    const tensor = tf.tensor1d([0, 1, 2, 3]);
    const output = tf.stridedSlice(tensor, [10], [3], [2]);
    expect(output.shape).toEqual([0]);
    expectArraysClose(output, []);
  });

  it('stridedSlice should suport 1d tensor negative begin', () => {
    const tensor = tf.tensor1d([0, 1, 2, 3]);
    const output = tf.stridedSlice(tensor, [-3], [3], [1]);
    expect(output.shape).toEqual([2]);
    expectArraysClose(output, [1, 2]);
  });

  it('stridedSlice should throw when passed a non-tensor', () => {
    expect(() => tf.stridedSlice({} as tf.Tensor, [0], [0], [1]))
        .toThrowError(/Argument 'x' passed to 'stridedSlice' must be a Tensor/);
  });
});
