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
import * as util from '../util';

import {Array1D, Array2D, Array3D, Array4D} from './ndarray';

// LogicalOr:
{
  const boolNaN = util.getNaN('bool');

  const tests: MathTests = it => {
    // Array1D:
    it('Should handle Array1D.', math => {
      let a = Array1D.new([1, 0, 0]);
      let b = Array1D.new([0, 1, 0]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 1, 0]);

      a = Array1D.new([0, 0, 0]);
      b = Array1D.new([0, 0, 0]);
      test_util.expectArraysClose(math.logicalOr(a, b), [0, 0, 0]);

      a = Array1D.new([1, 1]);
      b = Array1D.new([1, 1]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 1]);
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
      test_util.expectArraysClose(math.logicalOr(a, b), [1, boolNaN, boolNaN]);
    });

    // Array2D:
    it('Should handle Array2D', math => {
      let a = Array2D.new([2, 3], [[1, 0, 1], [0, 0, 0]]);
      let b = Array2D.new([2, 3], [[0, 0, 0], [0, 1, 0]]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 0, 1, 0, 1, 0]);

      a = Array2D.new([2, 3], [[0, 0, 0], [1, 1, 1]]);
      b = Array2D.new([2, 3], [[0, 0, 0], [1, 1, 1]]);
      test_util.expectArraysClose(math.logicalOr(a, b), [0, 0, 0, 1, 1, 1]);
    });
    it('Should handle broadcasting Array2D shapes', math => {
      const a = Array2D.new([2, 1], [[1], [0]]);
      const b = Array2D.new([2, 3], [[0, 0, 0], [0, 1, 0]]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 1, 1, 0, 1, 0]);
    });
    it('Should handle mismatched Array2D types', math => {
      const a = Array2D.new([2, 1], [[1], [0]], 'int32');
      const b = Array2D.new([2, 1], [[1], [0]], 'float32');
      const f = () => {
        math.logicalOr(a, b);
      };
      expect(f).toThrowError();
    });
    it('Should handle NaNs in Array2D', math => {
      const a = Array2D.new([2, 2], [[1, NaN], [0, NaN]]);
      const b = Array2D.new([2, 2], [[0, NaN], [1, NaN]]);
      test_util.expectArraysClose(
          math.logicalOr(a, b), [1, boolNaN, 1, boolNaN]);
    });

    // Array3D:
    it('Should handle Array3D', math => {
      let a = Array3D.new([2, 3, 1], [[[1], [0], [1]], [[0], [0], [0]]]);
      let b = Array3D.new([2, 3, 1], [[[0], [0], [1]], [[1], [0], [0]]]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 0, 1, 1, 0, 0]);

      a = Array3D.new([2, 3, 1], [[[0], [0], [0]], [[1], [1], [1]]]);
      b = Array3D.new([2, 3, 1], [[[0], [0], [0]], [[1], [1], [1]]]);
      test_util.expectArraysClose(math.logicalOr(a, b), [0, 0, 0, 1, 1, 1]);
    });
    it('Should handle broadcasting Array3D shapes', math => {
      const a = Array3D.new(
          [2, 3, 2], [[[1, 0], [0, 0], [1, 1]], [[0, 0], [0, 1], [0, 0]]]);
      const b = Array3D.new([2, 3, 1], [[[0], [0], [1]], [[1], [0], [0]]]);
      test_util.expectArraysClose(
          math.logicalOr(a, b), [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0]);
    });
    it('Should handle mismatched Array3D types', math => {
      const a =
          Array3D.new([2, 3, 1], [[[1], [0], [1]], [[0], [0], [0]]], 'int32');
      const b =
          Array3D.new([2, 3, 1], [[[0], [0], [1]], [[1], [0], [0]]], 'float32');
      const f = () => {
        math.logicalOr(a, b);
      };
      expect(f).toThrowError();
    });
    it('Should handle NaNs in Array3D', math => {
      const a = Array3D.new([2, 3, 1], [[[1], [NaN], [1]], [[0], [0], [0]]]);
      const b = Array3D.new([2, 3, 1], [[[0], [0], [1]], [[1], [0], [NaN]]]);
      test_util.expectArraysClose(
          math.logicalOr(a, b), [1, boolNaN, 1, 1, 0, boolNaN]);
    });

    // Array4D:
    it('Should handle Array4D', math => {
      let a = Array4D.new([2, 2, 1, 1], [1, 0, 1, 0]);
      let b = Array4D.new([2, 2, 1, 1], [0, 1, 0, 0]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 1, 1, 0]);

      a = Array4D.new([2, 2, 1, 1], [0, 0, 0, 0]);
      b = Array4D.new([2, 2, 1, 1], [0, 0, 0, 0]);
      test_util.expectArraysClose(math.logicalOr(a, b), [0, 0, 0, 0]);

      a = Array4D.new([2, 2, 1, 1], [1, 1, 1, 1]);
      b = Array4D.new([2, 2, 1, 1], [1, 1, 1, 1]);
      test_util.expectArraysClose(math.logicalOr(a, b), [1, 1, 1, 1]);
    });
    it('Should handle broadcasting Array4D shapes', math => {
      const a = Array4D.new([2, 2, 1, 1], [1, 0, 1, 0]);
      const b = Array4D.new(
          [2, 2, 1, 2], [[[[1, 0]], [[0, 0]]], [[[0, 0]], [[1, 1]]]]);
      test_util.expectArraysClose(
          math.logicalOr(a, b), [1, 1, 0, 0, 1, 1, 1, 1]);
    });
    it('Should handle mismatched Array4D types', math => {
      const a = Array4D.new([2, 2, 1, 1], [1, 0, 1, 0], 'int32');
      const b = Array4D.new([2, 2, 1, 1], [0, 1, 0, 0], 'float32');
      const f = () => {
        math.logicalOr(a, b);
      };
      expect(f).toThrowError();
    });
    it('Should handle NaNs in Array4D', math => {
      const a = Array4D.new([2, 2, 1, 1], [1, NaN, 1, 0]);
      const b = Array4D.new([2, 2, 1, 1], [0, 1, 0, NaN]);
      test_util.expectArraysClose(
          math.logicalOr(a, b), [1, boolNaN, 1, boolNaN]);
    });
  };

  test_util.describeMathCPU('logicalOr KREEGER', [tests]);
  test_util.describeMathGPU('logicalOr KREEGER', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}
