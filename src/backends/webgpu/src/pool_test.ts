/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import * as tf from '@tensorflow/tfjs-core';

import * as tfwebgpu from './index';

describe('pool', () => {
  beforeAll(async () => await tfwebgpu.ready);

  it('x=[1,1,1] f=[1,1] s=1 [0] => [0]', async () => {
    const x = tf.tensor3d([0], [1, 1, 1]);

    const result = tf.maxPool(x, 1, 1, 0);
    console.log(result);
    const resultData = await result.data();

    tf.test_util.expectArraysClose(resultData, new Float32Array([0]));
  });

  fit('x=[2,3,3,1] f=[2,2] s=1', async () => {
    // Feed forward.
    const x = tf.tensor4d(
        [1, 2, 3, 4, 5, 6, 7, 9, 8, 1, 2, 3, 4, 5, 6, 7, 8, 9], [2, 3, 3, 1]);

    const result = tf.maxPool(x, 2, 1, 0);
    const resultData = await result.data();

    tf.test_util.expectArraysClose(
        resultData, new Float32Array([5, 6, 9, 9, 5, 6, 8, 9]));
  });
});