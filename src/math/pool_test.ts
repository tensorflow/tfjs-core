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

import {Array2D, Array3D, Array4D} from './ndarray';

// math.maxPool1D
{
  const tests: MathTests = it => {
    it('works in simplest case', math => {
      // 1x1 in, 1 filter, 1 stride: [0] => [0]
      const a = Array2D.new([1, 1], [0]);

      const result = math.maxPool1D(a, 1, 1, 'valid');

      test_util.expectArraysClose(result.getValues(), new Float32Array([0]));
    });

    it('works with valid padding', math => {
      // 3x2 in, 2 filter, 1 stride
      const a = Array2D.new([3, 2], [1, 2, 3, 4, 5, 6]);

      const result = math.maxPool1D(a, 2, 1, 'valid');

      expect(result.shape).toEqual([2, 2]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([3, 4, 5, 6]));
    });
    it('works with same padding', math => {
      // 3x2 in, 2 filter, 1 stride.
      const a = Array2D.new([3, 2], [1, 2, 3, 4, 5, 6]);

      const result = math.maxPool1D(a, [2], 1, 'same');

      expect(result.shape).toEqual([3, 2]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([3, 4, 5, 6, 5, 6]));
    });

    it('propagates NaNs', math => {
      // 3x2 in, 1 stride
      const a = Array2D.new([3, 2], [1, 2, NaN, 4, 5, 6]);

      const result = math.maxPool1D(a, 2, 1, 'valid');

      expect(result.shape).toEqual([2, 2]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([NaN, 4, NaN, 6]));
    });

    it('works with strides', math => {
      // 7x1 in, 2 filter, 2 stride
      const a = Array2D.new([7, 1], [1, 2, 3, 4, 5, 6, 7]);

      const result = math.maxPool1D(a, 2, 2, 'valid');

      expect(result.shape).toEqual([3, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([2, 4, 6]));
    });
    it('rounds non-divisible strides', math => {
      // 4x1 in, 1 filter, 2 strides
      const a = Array2D.new([4, 1], [1, 2, 3, 4]);

      const result = math.maxPool1D(a, 1, 2, 'valid');

      expect(result.shape).toEqual([2, 1]);
      test_util.expectArraysClose(result.getValues(), new Float32Array([1, 3]));
    });
    it('works with multiple of 4 filterwidth', math => {
      // This case is a bit special because of the GPU optimizations.
      // 5x1, 4 filtersize
      const a = Array2D.new([5, 1], [1, 2, 3, 4, 5]);

      const result = math.maxPool1D(a, 4, 1, 'valid');

      expect(result.shape).toEqual([2, 1]);
      test_util.expectArraysClose(result.getValues(), new Float32Array([4, 5]));
    });
    it('works with > 4 filterwidth', math => {
      // This case is a bit special because of the GPU optimizations.
      // 6x1, 5 filtersize
      const a = Array2D.new([6, 1], [1, 2, 3, 4, 5, 6]);

      const result = math.maxPool1D(a, 5, 1, 'valid');

      expect(result.shape).toEqual([2, 1]);
      test_util.expectArraysClose(result.getValues(), new Float32Array([5, 6]));
    });


    it('throws when x is not rank 2', math => {
      // tslint:disable-next-line:no-any
      const a: any = Array3D.new([1, 3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);

      expect(() => math.maxPool1D(a, 2, 1, 'valid')).toThrowError();

      a.dispose();
    });
  };

  test_util.describeMathCPU('maxPool1D', [tests]);
  test_util.describeMathGPU('maxPool1D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}


// math.maxPool2D
{
  const tests: MathTests = it => {
    it('1x1x1 in, 1x1 filter, 1 stride: [0] => [0]', math => {
      const a = Array3D.new([1, 1, 1], [0]);

      const result = math.maxPool(a, 1, 1, 0);

      test_util.expectArraysClose(result.getValues(), new Float32Array([0]));
    });

    it('3x3x1 in, 2x2 filter, 1 stride', math => {
      // Feed forward.
      const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 9, 8]);

      const result = math.maxPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([5, 6, 9, 9]));
    });

    it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', math => {
      const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 9]);

      const result = math.maxPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([5, 6, NaN, NaN]));
    });

    it('3x3x2 in, 2x2 filter, 1 stride', math => {
      // Feed forward.
      const a = Array3D.new(
          [3, 3, 2],
          [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);

      const result = math.maxPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 2]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([5, 99, 6, 88, 9, 66, 9, 55]));
    });

    it('4x4x1 in, 2x2 filter, 2 stride', math => {
      // Feed forward.
      const a = Array3D.new(
          [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

      const result = math.maxPool(a, 2, 2, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([5, 7, 13, 15]));
    });

    it('2x2x1 in, 2x2 filter, 2 stride, pad=1', math => {
      // Feed forward.
      const a = Array3D.new([2, 2, 1], [1, 2, 3, 4]);

      const result = math.maxPool(a, 2, 2, 1);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([1, 2, 3, 4]));
    });

    it('throws when x is not rank 3', math => {
      // tslint:disable-next-line:no-any
      const a: any = Array2D.new([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);

      expect(() => math.maxPool(a, 2, 1, 0)).toThrowError();

      a.dispose();
    });
  };

  test_util.describeMathCPU('maxPool2D', [tests]);
  test_util.describeMathGPU('maxPool2D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}

// math.maxPool3D
{
  const tests: MathTests = it => {
    it('works in simplest case', math => {
      // 1x1x1x1 in, 1x1 filter, 1 stride: [0] => [0]
      const a = Array4D.new([1, 1, 1, 1], [0]);

      const result = math.maxPool3D(a, 1, 1, 'valid');

      test_util.expectArraysClose(result.getValues(), new Float32Array([0]));
    });

    it('works with valid padding', math => {
      // 2x2x3x1 in, 1x2x2 filter, 1 stride.
      const a =
          Array4D.new([2, 2, 3, 1], [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

      const result = math.maxPool3D(a, [1, 2, 2], 1, 'valid');

      expect(result.shape).toEqual([2, 1, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([12, 11, 6, 5]));
    });

    it('propagates NaNs and works with same padding', math => {
      // 2x2x2x1 in, 2x2x2 filter, 1 stride, propagates NaNs.
      const a = Array4D.new([2, 2, 2, 1], [1, 2, 3, 4, 5, 6, NaN, 8]);

      const result = math.maxPool3D(a, 2, 1, 'same');

      expect(result.shape).toEqual([2, 2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(),
          new Float32Array([NaN, 8, NaN, 8, NaN, 8, NaN, 8]));
    });

    it('works with (trivial) multiple channels', math => {
      // 1x1x1x2 in, 1x1x1 filter, 1 stride.
      const a = Array4D.new([1, 1, 1, 2], [6, 8]);

      const result = math.maxPool3D(a, 1, 1, 'valid');

      expect(result.shape).toEqual([1, 1, 1, 2]);
      test_util.expectArraysClose(result.getValues(), new Float32Array([6, 8]));
    });

    it('works with multiple channels when shape is nontrivial', math => {
      // 1x1x3x2 in, 1x1x2 filter, 1 stride.
      const a = Array4D.new([1, 1, 3, 2], [1, 2, 3, 4, 5, 6]);

      const result = math.maxPool3D(a, [1, 1, 2], 1, 'valid');

      expect(result.shape).toEqual([1, 1, 2, 2]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([3, 4, 5, 6]));
    });

    it('works with simple strides', math => {
      // 3x1x1x1 in, 1x1x1 filter, 2 stride.
      const a = Array4D.new([3, 1, 1, 1], [5, 7, 9]);

      const result = math.maxPool3D(a, 1, 2, 'valid');

      expect(result.shape).toEqual([2, 1, 1, 1]);
      test_util.expectArraysClose(result.getValues(), new Float32Array([5, 9]));
    });

    it('works with non-divisible strides', math => {
      // 4x3x2x1 in, 2x2x2 filter, 2 stride.
      const a = Array4D.new([4, 3, 2, 1], [
        1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
      ]);

      const result = math.maxPool3D(a, 2, 2, 'valid');

      expect(result.shape).toEqual([2, 1, 1, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([10, 22]));
    });


    it('throws when x is not rank 4', math => {
      // tslint:disable-next-line:no-any
      const a: any = Array2D.new([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);

      expect(() => math.maxPool3D(a, 2, 1, 'valid')).toThrowError();

      a.dispose();
    });
  };

  test_util.describeMathCPU('maxPool3D', [tests]);
  test_util.describeMathGPU('maxPool3D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}

// math.minPool
{
  const tests: MathTests = it => {
    it('1x1x1 in, 1x1 filter, 1 stride: [0] => [0]', math => {
      const a = Array3D.new([1, 1, 1], [0]);
      const result = math.minPool(a, 1, 1, 0);
      test_util.expectArraysClose(result.getValues(), new Float32Array([0]));
    });

    it('3x3x1 in, 2x2 filter, 1 stride', math => {
      // Feed forward.
      const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 9, 8]);
      const result = math.minPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([1, 2, 4, 5]));
    });

    it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', math => {
      const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 8]);
      const result = math.minPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([1, 2, NaN, NaN]));
    });

    it('3x3x2 in, 2x2 filter, 1 stride', math => {
      // Feed forward.
      const a = Array3D.new(
          [3, 3, 2],
          [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);
      const result = math.minPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 2]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([1, 55, 2, 44, 4, 22, 5, 11]));
    });

    it('4x4x1 in, 2x2 filter, 2 stride', math => {
      // Feed forward.
      const a = Array3D.new(
          [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      const result = math.minPool(a, 2, 2, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([0, 2, 8, 10]));
    });

    it('2x2x1 in, 2x2 filter, 2 stride, pad=1', math => {
      // Feed forward.
      const a = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
      const result = math.minPool(a, 2, 2, 1);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([1, 2, 3, 4]));
    });
  };

  test_util.describeMathCPU('minPool', [tests]);
  test_util.describeMathGPU('minPool', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}

// math.avgPool
{
  const tests: MathTests = it => {
    it('1x1x1 in, 1x1 filter, 1 stride: [0] => [0]', math => {
      const a = Array3D.new([1, 1, 1], [0]);
      const result = math.avgPool(a, 1, 1, 0);
      test_util.expectArraysClose(result.getValues(), new Float32Array([0]));
    });

    it('3x3x1 in, 2x2 filter, 1 stride', math => {
      // Feed forward.
      const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 9, 8]);
      const result = math.avgPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([3, 4, 6.25, 7]));
    });

    it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', math => {
      // Feed forward.
      const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 8]);
      const result = math.avgPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([3, 4, NaN, NaN]));
    });

    it('3x3x2 in, 2x2 filter, 1 stride', math => {
      // Feed forward.
      const a = Array3D.new(
          [3, 3, 2],
          [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);
      const result = math.avgPool(a, 2, 1, 0);

      expect(result.shape).toEqual([2, 2, 2]);
      test_util.expectArraysClose(
          result.getValues(),
          new Float32Array([3, 77, 4, 66, 6.25, 44, 7, 33]));
    });

    it('4x4x1 in, 2x2 filter, 2 stride', math => {
      // Feed forward.
      const a = Array3D.new(
          [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      const result = math.avgPool(a, 2, 2, 0);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([2.5, 4.5, 10.5, 12.5]));
    });

    it('2x2x1 in, 2x2 filter, 2 stride, pad=1', math => {
      // Feed forward.
      const a = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
      const result = math.avgPool(a, 2, 2, 1);

      expect(result.shape).toEqual([2, 2, 1]);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([0.25, 0.5, 0.75, 1]));
    });
  };

  test_util.describeMathCPU('avgPool', [tests]);
  test_util.describeMathGPU('avgPool', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}
