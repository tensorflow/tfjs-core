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

import * as test_util from '../test_util';
import {MathTests} from '../test_util';

import {Array3D} from './ndarray';

// math.localResponseNormalization3D
{
  const epsilon = 1e-1;
  const sqArr = (arr: number[]) => arr.map((d) => Math.pow(d, 2));
  const sumArr = (arr: number[]) => arr.reduce((prev, curr) => prev + curr, 0);

  const tests: MathTests = it => {

    it('localResponseNormalization3D across_channels', math => {
      const x = Array3D.new([1, 1, 4], new Float32Array([1, 20, 300, 4]));
      const n = 3;
      const alpha = 1;
      const beta = 0.75;
      const k = 1;

      const result = math.localResponseNormalization3D(x, n, alpha, beta, k);

      const f = (...vals: number[]) =>
        Math.pow(k + (alpha / n) * sumArr(sqArr(vals)), -beta);

      test_util.expectArraysClose(
          result,
          [
           x.get(0, 0, 0) * f(x.get(0, 0, 0), x.get(0, 0, 1)),
           x.get(0, 0, 1) * f(x.get(0, 0, 0), x.get(0, 0, 1), x.get(0, 0, 2)),
           x.get(0, 0, 2) * f(x.get(0, 0, 1), x.get(0, 0, 2), x.get(0, 0, 3)),
           x.get(0, 0, 3) * f(x.get(0, 0, 2), x.get(0, 0, 3)),
          ],
          epsilon);
    });
  };

  test_util.describeMathCPU('localResponseNormalization3D', [tests]);
  test_util.describeMathGPU('localResponseNormalization3D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}