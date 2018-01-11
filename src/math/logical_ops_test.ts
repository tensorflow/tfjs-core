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

import * as test_util from '../test_util';
import {MathTests} from '../test_util';
import {Array1D, Array2D, NDArray} from './ndarray';

function printArray(array: NDArray) {
  const output = [];
  const values = array.dataSync();
  for (let i = 0; i < values.length; i++) {
    output.push(values[i]);
  }
  console.log(output);
}

{
  const tests: MathTests = it => {
    it('Should handle Array1D.', math => {
      const a = Array1D.new([1, 0, 0]);
      const b = Array1D.new([0, 1, 0]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 1, 0]);
    });

    it('Should handle mismatched Array1D shapes', math => {
      const a = Array1D.new([1, 0]);
      const b = Array1D.new([0, 1, 0]);
      const f = () => {
        math.logicalOr(a, b);
      };
      expect(f).toThrowError();
    });

    it('Should handle mismatched Array1D types', math => {
      const a = Array1D.new([1, 0, 0], 'int32');
      const b = Array1D.new([0, 1, 0], 'float32');
      const f = () => {
        math.logicalOr(a, b);
      };
      expect(f).toThrowError();
    });

    it('Should handle NaNs in Array1D', math => {
      const a = Array1D.new([1, NaN, 0]);
      const b = Array1D.new([0, 0, NaN]);
      printArray(math.logicalOr(a, b));
      // test_util.expectArraysClose(math.logicalOr(a, b), [1, 1, 0]);
    });

    it('Should handle Array2D', math => {
      const a = Array2D.new([2, 3], [[1, 0, 1], [0, 0, 0]]);
      const b = Array2D.new([2, 3], [[0, 0, 0], [0, 1, 0]]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 0, 1, 0, 1, 0]);
    });
  };

  test_util.describeMathCPU('logicalOr KREEGER', [tests]);
  test_util.describeMathGPU('logicalOr KREEGER', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}
