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

describe('pad', () => {
  beforeAll(async () => await tf.ready);

  it('Should pad 1D arrays', async () => {
    const a = tf.tensor1d([1, 2, 3, 4, 5, 6], 'int32');
    const b = tf.pad1d(a, [2, 3]);
    const bData = await b.data();

    expectArraysClose(
        bData, new Float32Array([0, 0, 1, 2, 3, 4, 5, 6, 0, 0, 0]));
  });

  fit('Should pad 2D arrays', async () => {
    const a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
    const b = tf.pad2d(a, [[1, 1], [1, 1]]);
    // 0, 0, 0
    // 0, 1, 0
    // 0, 2, 0
    // 0, 0, 0
    const bData = await b.data();
    console.log('B DATA');
    console.log(bData);
    expectArraysClose(
        bData, new Float32Array([0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0]));
  });

  it('should pad 2D arrays', async () => {
    const a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
    const b = tf.pad2d(a, [[2, 2], [1, 1]]);
    const bData = await b.data();
    console.log('SECOND B DATA');
    console.log(bData);
    // 0, 0, 0, 0, 0
    // 0, 0, 0, 0, 0
    // 0, 1, 2, 3, 0
    // 0, 4, 5, 6, 0
    // 0, 0, 0, 0, 0
    // 0, 0, 0, 0, 0
    // expectArraysClose(bData, new Float32Array([
    //                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0,
    //                     0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //                   ]));
  });
});