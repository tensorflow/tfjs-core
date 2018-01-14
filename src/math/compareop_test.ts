import * as test_util from '../test_util';
import {MathTests} from '../test_util';
import * as util from '../util';

import {Array1D, Array2D, Array3D, Array4D} from './ndarray';

// GreaterEqual:
{
  const boolNaN = util.getNaN('bool');

  const tests: MathTests = it => {
    // Array1D:
    it('Array1D - int32', math => {
      let a = Array1D.new([1, 4, 5], 'int32');
      let b = Array1D.new([2, 3, 5], 'int32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 1]);

      a = Array1D.new([2, 2, 2], 'int32');
      b = Array1D.new([2, 2, 2], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1]);

      a = Array1D.new([0, 0], 'int32');
      b = Array1D.new([3, 3], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 0]);
    });
    it('Array1D - float32', math => {
      let a = Array1D.new([1.1, 4.1, 5.1], 'float32');
      let b = Array1D.new([2.2, 3.2, 5.1], 'float32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 1]);

      a = Array1D.new([2.31, 2.31, 2.31], 'float32');
      b = Array1D.new([2.31, 2.31, 2.31], 'float32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1]);

      a = Array1D.new([0.45, 0.123], 'float32');
      b = Array1D.new([3.123, 3.321], 'float32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 0]);
    });
    it('mismatched Array1D shapes - int32', math => {
      const a = Array1D.new([1, 2], 'int32');
      const b = Array1D.new([1, 2, 3], 'int32');
      const f = () => {
        math.greaterEqual(a, b);
      };
      expect(f).toThrowError();
    });
    it('mismatched Array1D shapes - float32', math => {
      const a = Array1D.new([1.1, 2.1], 'float32');
      const b = Array1D.new([1.1, 2.1, 3.1], 'float32');
      const f = () => {
        math.greaterEqual(a, b);
      };
      expect(f).toThrowError();
    });
    it('NaNs in Array1D - int32', math => {
      const a = Array1D.new([1, NaN, 0], 'int32');
      const b = Array1D.new([0, 0, NaN], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, boolNaN, boolNaN]);
    });
    it('NaNs in Array1D - float32', math => {
      const a = Array1D.new([1.1, NaN, 2.1], 'float32');
      const b = Array1D.new([2.1, 3.1, NaN], 'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, boolNaN, boolNaN]);
    });

    // Array2D:
    it('Array2D - int32', math => {
      let a = Array2D.new([2, 3], [[1, 4, 5], [8, 9, 12]], 'int32');
      let b = Array2D.new([2, 3], [[2, 3, 6], [7, 10, 11]], 'int32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

      a = Array2D.new([2, 2], [[0, 0], [1, 1]], 'int32');
      b = Array2D.new([2, 2], [[0, 0], [1, 1]], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1, 1]);
    });
    it('Array2D - float32', math => {
      let a = Array2D.new([2, 3], [[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], 'int32');
      let b =
          Array2D.new([2, 3], [[2.1, 3.1, 6.1], [7.1, 10.1, 11.1]], 'int32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

      a = Array2D.new([2, 2], [[0.2, 0.2], [1.2, 1.2]], 'int32');
      b = Array2D.new([2, 2], [[0.2, 0.2], [1.2, 1.2]], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1, 1]);
    });
    it('broadcasting Array2D shapes - int32', math => {
      const a = Array2D.new([2, 1], [[3], [7]], 'int32');
      const b = Array2D.new([2, 3], [[2, 3, 4], [7, 8, 9]], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 0, 1, 0, 0]);
    });
    it('broadcasting Array2D shapes - float32', math => {
      const a = Array2D.new([2, 1], [[1.1], [7.1]], 'float32');
      const b =
          Array2D.new([2, 3], [[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], 'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 0, 1, 0, 0]);
    });
    it('NaNs in Array2D - int32', math => {
      const a = Array2D.new([2, 3], [[1, NaN, 2], [0, NaN, NaN]], 'int32');
      const b = Array2D.new([2, 3], [[0, NaN, NaN], [1, NaN, 3]], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(
          res, [1, boolNaN, boolNaN, 0, boolNaN, boolNaN]);
    });
    it('NaNs in Array2D - float32', math => {
      const a = Array2D.new([2, 2], [[1.1, NaN], [0.1, NaN]], 'float32');
      const b = Array2D.new([2, 2], [[0.1, NaN], [1.1, NaN]], 'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, boolNaN, 0, boolNaN]);
    });

    // Array3D:
    it('Array3D - int32', math => {
      let a =
          Array3D.new([2, 3, 1], [[[1], [4], [5]], [[8], [9], [12]]], 'int32');
      let b =
          Array3D.new([2, 3, 1], [[[2], [3], [6]], [[7], [10], [11]]], 'int32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

      a = Array3D.new([2, 3, 1], [[[0], [0], [0]], [[1], [1], [1]]], 'int32');
      b = Array3D.new([2, 3, 1], [[[0], [0], [0]], [[1], [1], [1]]], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1, 1, 1, 1]);
    });
    it('Array3D - float32', math => {
      let a = Array3D.new(
          [2, 3, 1], [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]],
          'float32');
      let b = Array3D.new(
          [2, 3, 1], [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [11.1]]],
          'float32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

      a = Array3D.new(
          [2, 3, 1], [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.2]]], 'float32');
      b = Array3D.new(
          [2, 3, 1], [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], 'float32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1, 1, 1, 1]);
    });
    it('broadcasting Array3D shapes - int32', math => {
      const a = Array3D.new(
          [2, 3, 2], [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
          'int32');
      const b =
          Array3D.new([2, 3, 1], [[[1], [2], [3]], [[7], [10], [9]]], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1]);
    });
    it('broadcasting Array3D float32', math => {
      const a = Array3D.new(
          [2, 3, 2],
          [
            [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
            [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
          ],
          'float32');
      const b = Array3D.new(
          [2, 3, 1], [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
          'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1]);
    });
    it('NaNs in Array3D - int32', math => {
      const a =
          Array3D.new([2, 3, 1], [[[1], [NaN], [1]], [[0], [0], [0]]], 'int32');
      const b =
          Array3D.new([2, 3, 1], [[[0], [0], [1]], [[1], [0], [NaN]]], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, boolNaN, 1, 0, 1, boolNaN]);
    });
    it('NaNs in Array3D - float32', math => {
      const a = Array3D.new(
          [2, 3, 1], [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], 'float32');
      const b = Array3D.new(
          [2, 3, 1], [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], 'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, boolNaN, 1, 0, 1, boolNaN]);
    });

    // Array4D:
    it('Array4D - int32', math => {
      let a = Array4D.new([2, 2, 1, 1], [1, 4, 5, 8], 'int32');
      let b = Array4D.new([2, 2, 1, 1], [2, 3, 6, 7], 'int32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 0, 1]);

      a = Array4D.new([2, 2, 1, 1], [0, 1, 2, 3], 'int32');
      b = Array4D.new([2, 2, 1, 1], [0, 1, 2, 3], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1, 1]);

      a = Array4D.new([2, 2, 1, 1], [1, 1, 1, 1], 'int32');
      b = Array4D.new([2, 2, 1, 1], [2, 2, 2, 2], 'int32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 0, 0, 0]);
    });
    it('Array4D - float32', math => {
      let a = Array4D.new([2, 2, 1, 1], [1.1, 4.1, 5.1, 8.1], 'float32');
      let b = Array4D.new([2, 2, 1, 1], [2.1, 3.1, 6.1, 7.1], 'float32');
      let res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 1, 0, 1]);

      a = Array4D.new([2, 2, 1, 1], [0.1, 1.1, 2.2, 3.3], 'float32');
      b = Array4D.new([2, 2, 1, 1], [0.1, 1.1, 2.2, 3.3], 'float32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 1, 1, 1]);

      a = Array4D.new([2, 2, 1, 1], [0.1, 0.1, 0.1, 0.1], 'float32');
      b = Array4D.new([2, 2, 1, 1], [1.1, 1.1, 1.1, 1.1], 'float32');
      res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [0, 0, 0, 0]);
    });
    it('broadcasting Array4D shapes - int32', math => {
      const a = Array4D.new([2, 2, 1, 1], [1, 2, 5, 9], 'int32');
      const b = Array4D.new(
          [2, 2, 1, 2], [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 0, 0, 0, 1, 0, 1, 1]);
    });
    it('broadcasting Array4D shapes - float32', math => {
      const a = Array4D.new([2, 2, 1, 1], [1.1, 2.1, 5.1, 9.1], 'float32');
      const b = Array4D.new(
          [2, 2, 1, 2],
          [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
          'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, 0, 0, 0, 1, 0, 1, 1]);
    });
    it('NaNs in Array4D - int32', math => {
      const a = Array4D.new([2, 2, 1, 1], [1, NaN, 0, 0], 'int32');
      const b = Array4D.new([2, 2, 1, 1], [0, 1, 1, NaN], 'int32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, boolNaN, 0, boolNaN]);
    });
    it('NaNs in Array4D - float32', math => {
      const a = Array4D.new([2, 2, 1, 1], [1.1, NaN, 0.1, 0.1], 'float32');
      const b = Array4D.new([2, 2, 1, 1], [0.1, 1.1, 1.1, NaN], 'float32');
      const res = math.greaterEqual(a, b);

      expect(res.dtype).toBe('bool');
      test_util.expectArraysClose(res, [1, boolNaN, 0, boolNaN]);
    });
  };

  test_util.describeMathCPU('greaterEqual', [tests]);
  test_util.describeMathGPU('greaterEqual', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}
