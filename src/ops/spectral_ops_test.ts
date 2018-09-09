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
import {expectArraysClose, ALL_ENVS} from '../test_util';

describeWithFlags('FFT', ALL_ENVS, () => {
  it('should return the same value with TensorFlow', () => {
    const t1Real = tf.tensor1d([1, 2, 3, 4]);
    const t1Imag = tf.tensor1d([0, 0, 0, 0]);
    const t1 = tf.complex(t1Real, t1Imag);
    expectArraysClose(tf.fft(t1), [10, 0, -2, 2, -2, 0, -2, -2]);

    const t2Real = tf.tensor1d([1, 2]);
    const t2Imag = tf.tensor1d([1, 1]);
    const t2 = tf.complex(t2Real, t2Imag);
    expectArraysClose(tf.fft(t2), [3, 2, -1, 0]);

    const t3Real = tf.tensor1d([1, 2, 3]);
    const t3Imag = tf.tensor1d([0, 0, 0]);
    const t3 = tf.complex(t3Real, t3Imag);
    expectArraysClose(tf.fft(t3), [6, 0, -1.5, 0.866025, -1.5, -0.866025]);

    const t4Real = tf.tensor1d([1, 2, 3, 4]);
    const t4Imag = tf.tensor1d([1, 2, 3, 4]);
    const t4 = tf.complex(t4Real, t4Imag);
    expectArraysClose(tf.fft(t4), [10, 10, -4, 0, -2, -2, 0, -4]);

    const t5Real = tf.tensor1d([1, 2, 3]);
    const t5Imag = tf.tensor1d([1, 2, 3]);
    const t5 = tf.complex(t5Real, t5Imag);
    expectArraysClose(
        tf.fft(t5), [6, 6, -2.3660252, -0.63397473, -0.6339747, -2.3660254]);

    const t6Real = tf.tensor1d([-1, -2, -3]);
    const t6Imag = tf.tensor1d([-1, -2, -3]);
    const t6 = tf.complex(t6Real, t6Imag);
    expectArraysClose(tf.fft(t6),
      [-5.9999995, -6, 2.3660252, 0.63397473, 0.6339747, 2.3660254]);
  });

  // it('should throw exception with invalid complex number', () => {
  //   const t = tf.tensor2d([[1], [2], [3]]);
  //   expect(() => tf.fft(t))
  //     .toThrowError('Inner dimension must be 2 to represents complex number');
  // });
});
