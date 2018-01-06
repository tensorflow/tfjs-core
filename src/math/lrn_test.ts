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
  const sqArr = (arr: number[]) => arr.map((d) => Math.pow(d, 2));
  const sumArr = (arr: number[]) => arr.reduce((prev, curr) => prev + curr, 0);

  const tests: MathTests = it => {

    it('simple localResponseNormalization3D acrossChannels', math => {
      const x = Array3D.new([1, 1, 4], new Float32Array([1, 20, 300, 4]));
      const n = 3;
      const alpha = 1;
      const beta = 0.75;
      const k = 1;
      
      const result = math.localResponseNormalization3D(x, n, alpha, beta, null,
        k);
      
      const f = (...vals: number[]) =>
        Math.pow(k + (alpha / n) * sumArr(sqArr(vals)), -beta);
      
      test_util.expectArraysClose(
        result,
        [
          x.get(0, 0, 0) * f(x.get(0, 0, 0), x.get(0, 0, 1)),
          x.get(0, 0, 1) * f(x.get(0, 0, 0), x.get(0, 0, 1), x.get(0, 0, 2)),
          x.get(0, 0, 2) * f(x.get(0, 0, 1), x.get(0, 0, 2), x.get(0, 0, 3)),
          x.get(0, 0, 3) * f(x.get(0, 0, 2), x.get(0, 0, 3)),
        ]);
    });

    it('complex localResponseNormalization3D acrossChannels', math => {
      const x = Array3D.new([2, 2, 4], new Float32Array([
        1, 20, 300, 4, 5, 15, 24, 200, 1, 20, 300, 4, 5, 15, 24, 200
      ]));
      const n = 3;
      const alpha = 1;
      const beta = 0.75;
      const normRegion = "acrossChannels";
      const k = 1;

      const result = math.localResponseNormalization3D(x, n, alpha, beta,
        normRegion, k);

      const f = (...vals: number[]) =>
        Math.pow(k + (alpha / n) * sumArr(sqArr(vals)), -beta);

      // 1       | 2       | 3       | 4
      // ------- | ------- | ------- | -------
      // o x . . | x o x . | . x o x | . . x o

      test_util.expectArraysClose(
          result,
          [ 
            // 1 - 4
            x.get(0, 0, 0) * f(x.get(0, 0, 0), x.get(0, 0, 1)),
            x.get(0, 0, 1) * f(x.get(0, 0, 0), x.get(0, 0, 1), x.get(0, 0, 2)),
            x.get(0, 0, 2) * f(x.get(0, 0, 1), x.get(0, 0, 2), x.get(0, 0, 3)),
            x.get(0, 0, 3) * f(x.get(0, 0, 2), x.get(0, 0, 3)),

            // 1 - 4
            x.get(0, 1, 0) * f(x.get(0, 1, 0), x.get(0, 1, 1)),
            x.get(0, 1, 1) * f(x.get(0, 1, 0), x.get(0, 1, 1), x.get(0, 1, 2)),
            x.get(0, 1, 2) * f(x.get(0, 1, 1), x.get(0, 1, 2), x.get(0, 1, 3)),
            x.get(0, 1, 3) * f(x.get(0, 1, 2), x.get(0, 1, 3)),

            // 1 - 4
            x.get(1, 0, 0) * f(x.get(1, 0, 0), x.get(1, 0, 1)),
            x.get(1, 0, 1) * f(x.get(1, 0, 0), x.get(1, 0, 1), x.get(1, 0, 2)),
            x.get(1, 0, 2) * f(x.get(1, 0, 1), x.get(1, 0, 2), x.get(1, 0, 3)),
            x.get(1, 0, 3) * f(x.get(1, 0, 2), x.get(1, 0, 3)),

            // 1 - 4
            x.get(1, 1, 0) * f(x.get(1, 1, 0), x.get(1, 1, 1)),
            x.get(1, 1, 1) * f(x.get(1, 1, 0), x.get(1, 1, 1), x.get(1, 1, 2)),
            x.get(1, 1, 2) * f(x.get(1, 1, 1), x.get(1, 1, 2), x.get(1, 1, 3)),
            x.get(1, 1, 3) * f(x.get(1, 1, 2), x.get(1, 1, 3)),
          ]);
    });

    it('simple localResponseNormalization3D withinChannel', math => {
      const x = Array3D.new([2, 2, 1], new Float32Array([1, 20, 300, 4]));
      const n = 3;
      const alpha = 1;
      const beta = 0.75;
      const normRegion = "withinChannel";
      const k = 1;
      
      const result = math.localResponseNormalization3D(x, n, alpha, beta,
        normRegion);
      
      const f = (...vals: number[]) =>
        Math.pow(k + (alpha / n) * sumArr(sqArr(vals)), -beta);
      
      const multip = f(
            x.get(0, 0, 0), x.get(1, 0, 0),
            x.get(0, 1, 0), x.get(1, 1, 0));

      test_util.expectArraysClose(
        result,
        [
          x.get(0, 0, 0) * multip,
          x.get(0, 0, 1) * multip,
          x.get(0, 0, 2) * multip,
          x.get(0, 0, 3) * multip,
        ]);
    });

    it('complex localResponseNormalization3D withinChannel', math => {
      const x = Array3D.new([3, 3, 2], new Float32Array([
        1, 20, 300, 4, 23, 25, 13, 156, 123, 5, 15, 24, 200, 12, 12, 13, 21, 3
      ]));
      const n = 3;
      const alpha = 1;
      const beta = 0.75;
      const normRegion = "withinChannel";
      const k = 1;

      const result = math.localResponseNormalization3D(x, n, alpha, beta,
        normRegion, k);

      const f = (...vals: number[]) =>
        Math.pow(k + (alpha / n) * sumArr(sqArr(vals)), -beta);

      // Easier to read using these vars
      const d0 = 0;
      const d1 = 1;

      // 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9
      // ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | -----
      // o x . | x o x | . x o | x x . | x x x | . x x | . . . | . . . | . . .
      // x x . | x x x | . x x | o x . | x o x | . x o | x x . | x x x | . x x
      // . . . | . . . | . . . | x x . | x x x | . x x | o x . | x o x | . x o

      test_util.expectArraysClose(
          result,
          [
            // 1
            x.get(0, 0, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0)),
            
            x.get(0, 0, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1)),

            // 4
            x.get(0, 1, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0)),
            x.get(0, 1, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1)),

            // 7
            x.get(0, 2, d0) * f(
              x.get(0, 1, d0), x.get(1, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0)),
            x.get(0, 2, d1) * f(
              x.get(0, 1, d1), x.get(1, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1)),

            // 2
            x.get(1, 0, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0), x.get(2, 1, d0)),
            x.get(1, 0, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1), x.get(2, 1, d1)),

            // 5
            x.get(1, 1, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0), x.get(2, 2, d0)),
            x.get(1, 1, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1), x.get(2, 2, d1)),

            // 8
            x.get(1, 2, d0) * f(
              x.get(0, 1, d0), x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0), x.get(2, 2, d0)),
             x.get(1, 2, d1) * f(
              x.get(0, 1, d1), x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1), x.get(2, 2, d1)),

            // 3
            x.get(2, 0, d0) * f(
              x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(1, 1, d0), x.get(2, 1, d0)),
            x.get(2, 0, d1) * f(
              x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(1, 1, d1), x.get(2, 1, d1)),
            
            // 6
            x.get(2, 1, d0) * f(
              x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(1, 2, d0), x.get(2, 2, d0)),
            x.get(2, 1, d1) * f(
              x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(1, 2, d1), x.get(2, 2, d1)),
            
            // 9
            x.get(2, 2, d0) * f(
              x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(1, 2, d0), x.get(2, 2, d0)),
            x.get(2, 2, d1) * f(
              x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(1, 2, d1), x.get(2, 2, d1)),
          ]);
    });
  };

  test_util.describeMathCPU('localResponseNormalization3D', [tests]);
  test_util.describeMathGPU('localResponseNormalization3D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}