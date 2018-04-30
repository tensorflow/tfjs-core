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

describeWithFlags('normal', ALL_ENVS, () => {
  it('Sample, mean=0, std=1 test', () => {
    const d = new tf.distributions.normal(0, 1);

    const s = d.sample([3]);
    const s2 = d.sample([3, 2]);

    expect(s.shape).toEqual([3]);
    expect(s2.shape).toEqual([3, 2]);
  });

  it('Sample with tensor test', () => {
    const mean = tf.tensor2d([[0, 1, 2], [3, 4, 5]]);
    const std = tf.tensor2d([[1, 5, 10], [15, 20, 25]]);

    const d = new tf.distributions.normal(mean, std);

    const s = d.sample([2, 2]);

    expect(s.shape).toEqual([2, 2, 2, 3]);
  });

  it('Prob test', () => {
    const mean = tf.tensor1d([1., 2., 3.]);
    const std = tf.tensor1d([1.0, 1.0, 1.0]);

    const d = new tf.distributions.normal(mean, std);

    const s = d.prob(tf.tensor2d([[1.], [2.]]));
    const sExpected = tf.tensor2d(
        [[0.3989423, 0.2419707, 0.053991], [0.2419707, 0.3989423, 0.2419707]]);

    expectArraysClose(s, sExpected);
  });

  it('Log prob test', () => {
    const mean = tf.tensor1d([1., 2., 3.]);
    const std = tf.tensor1d([1.0, 1.0, 1.0]);

    const d = new tf.distributions.normal(mean, std);

    const s = d.log_prob(tf.tensor2d([[1.], [2.]]));
    const sExpected = tf.tensor2d([
      [-0.9189384, -1.4189383, -2.9189384],
      [-1.4189383, -0.9189384, -1.4189383]
    ]);

    expectArraysClose(s, sExpected);
  });

  it('Entropy test', () => {
    const mean = tf.tensor1d([1., 2., 3.]);
    const std = tf.tensor1d([1.0, 0.1, 0.5]);

    const d = new tf.distributions.normal(mean, std);

    const s = d.entropy();
    const sExpected = tf.tensor1d([1.4189385, -0.8836465, 0.7257913]);

    expectArraysClose(s, sExpected);
  });
});
