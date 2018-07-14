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
// tslint:disable-next-line:max-line-length
import {ALL_ENVS, expectArraysClose} from '../test_util';

describeWithFlags('conv3d', ALL_ENVS, () => {
  it('x=[1, 2, 3, 1, 3] f=[1, 1, 1, 3, 3] s=1 d=1 p=0', () => {
    const batch = 1;
    const inputDepth = 2;
    const inChannels = 3;
    const outChannels = 3;
    const inputShape: [number, number, number, number, number] =
        [batch, inputDepth, 3, 1, inChannels];
    const fSize = 1;
    const pad = 0;
    const stride = 1;
    const inp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const filt = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const x = tf.tensor5d(inp, inputShape);
    const w = tf.tensor5d(filt, [fSize, fSize, fSize, inChannels, outChannels]);

    const result = tf.conv3d(x, w, stride, pad);
    const expectedOutput = [
      0.18518519, 0.22222222, 0.25925926, 0.40740741, 0.5, 0.59259259,
      0.62962963, 0.77777778, 0.92592593, 0.85185185, 1.05555556, 1.25925926,
      1.07407407, 1.33333333, 1.59259259, 1.2962963, 1.61111111, 1.92592593
    ];

    expectArraysClose(result, expectedOutput);
  });
});
