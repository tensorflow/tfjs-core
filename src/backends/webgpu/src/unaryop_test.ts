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

import {expectArraysClose} from '@tensorflow/tfjs-core/dist/test_util';

import * as tf from './index';

describe('Unary ops', () => {
  beforeAll(async () => await tf.ready);

  it('relu', async () => {
    const a = tf.tensor1d([1, -2, 0, 3, -0.1]);
    const result = tf.relu(a);

    const cData = await result.data();

    expectArraysClose(cData, new Float32Array([1, 0, 0, 3, 0]));
  });

  it('relu 3D', async () => {
    const a = tf.tensor3d([1, -2, 5, -3], [1, 2, 2]);
    const result = tf.relu(a);

    const cData = await result.data();

    expectArraysClose(cData, new Float32Array([1, 0, 5, 0]));
  });
});