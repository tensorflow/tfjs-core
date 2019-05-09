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
import {describeWebGPU} from './test_util';

describeWebGPU('matmul', () => {
  it('it works in graph mode.', async () => {
    const savedFlag = tf.ENV.get('WEBGPU_IMMEDIATE_EXECUTION_ENABLED');
    tf.ENV.set('WEBGPU_IMMEDIATE_EXECUTION_ENABLED', true);
    const a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
    const b = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);

    const c = tf.matMul(a, b);

    const f = tf.tensor2d([0, 1, 0.5, 0, 0.25, 2], [2, 3]);
    const d = tf.mul(c, f);

    const dData = await d.data();
    tf.test_util.expectArraysClose(
        dData, new Float32Array([0, 12, 7.5, 0, 6.5, 66]));
    tf.ENV.set('WEBGPU_IMMEDIATE_EXECUTION_ENABLED', savedFlag);
  });
});
