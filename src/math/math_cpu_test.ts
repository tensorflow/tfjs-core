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
import * as util from '../util';

import {NDArrayMathCPU} from './math_cpu';
import {Array1D, Array2D, Array3D, Scalar} from './ndarray';


describe('NDArrayMathCPU argmin/max, argmaxequals, min/max', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('Arg max', () => {
    expect(math.argMax(Array1D.new([5, 0, 3, 7, 3])).get()).toBe(3);
    expect(math.argMax(Array1D.new([-100.3, .3, 11.1, 9.9, 7.33])).get())
        .toBe(2);
    expect(math.argMax(Array1D.new([-100.3, -20.0, -10.0, -5])).get()).toBe(3);
  });

  it('Arg max propagates NaNs', () => {
    expect(math.argMax(Array1D.new([5, 0, 3, NaN, 3])).get()).toEqual(NaN);
  });

  it('Argmaxequals equals', () => {
    const a = Array1D.new([5, 0, 3, 7]);
    const b = Array1D.new([-100.3, -20.0, -10.0, -5]);
    const result = math.argMaxEquals(a, b);
    expect(result.get()).toBe(1);
  });

  it('Argmaxequals not equals', () => {
    const a = Array1D.new([5, 0, 3, 1]);
    const b = Array1D.new([-100.3, -20.0, -10.0, -5]);
    const result = math.argMaxEquals(a, b);
    expect(result.get()).toBe(0);
  });

  it('Argmaxequals propagates NaNs', () => {
    const a = Array1D.new([5, 3, 1, 3]);
    const b = Array1D.new([NaN, -20.0, -10.0, -5]);
    const result = math.argMaxEquals(a, b);
    expect(result.get()).toEqual(NaN);
  });

  it('throws when given arrays of different shape', () => {
    const a = Array1D.new([5, 0, 3, 7, 3, 10]);
    const b = Array1D.new([-100.3, -20.0, -10.0, -5, -100]);
    expect(() => math.argMaxEquals(a, b)).toThrowError();
  });

  it('topk', () => {
    const topk = math.topK(Array1D.new([1, -1, 100, -5, -10.6, 3.3, 5]), 3);
    test_util.expectArraysClose(
        topk.values.getValues(), new Float32Array([100, 5, 3.3]));
    test_util.expectArraysClose(
        topk.indices.getValues(), new Float32Array([2, 6, 5]));
  });

  it('Arg min', () => {
    expect(math.argMin(Array1D.new([5, 0, 3, 7, 3])).get()).toBe(1);
    expect(math.argMin(Array1D.new([-100.3, .3, 11.1, 9.9, 7.33])).get())
        .toBe(0);
  });

  it('Arg min propagates NaNs', () => {
    expect(math.argMin(Array1D.new([5, 0, NaN, 7, 3])).get()).toEqual(NaN);
  });

  it('min', () => {
    expect(math.min(Array1D.new([3, -1, 0, 100, -7, 2])).get()).toBe(-7);
  });

  it('min propagates NaNs', () => {
    expect(math.min(Array1D.new([3, NaN, 2])).get()).toEqual(NaN);
  });

  it('max', () => {
    expect(math.max(Array1D.new([3, -1, 0, 100, -7, 2])).get()).toBe(100);
  });

  it('max propagates NaNs', () => {
    expect(math.max(Array1D.new([3, NaN, 2])).get()).toEqual(NaN);
  });
});

describe('NDArrayMathCPU log/exp', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('logSumExp', () => {
    const a = Array1D.new([1, 2, -3]);
    const result = math.logSumExp(a);
    expect(result.get())
        .toBeCloseTo(Math.log(Math.exp(1) + Math.exp(2) + Math.exp(-3)));
  });

  it('logSumExp propagates NaNs', () => {
    const a = Array1D.new([1, 2, NaN]);
    const result = math.logSumExp(a);
    expect(result.get()).toEqual(NaN);
  });
});

describe('softmax', () => {
  let math: NDArrayMathCPU;

  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('regular test', () => {
    const y = math.softmax(Array1D.new([2, 1, 3]));
    expect(y.get(0)).toBeCloseTo(0.24472847, 6);
    expect(y.get(1)).toBeCloseTo(0.09003057, 6);
    expect(y.get(2)).toBeCloseTo(0.66524095, 6);
    expect(y.get(0) + y.get(1) + y.get(2)).toBeCloseTo(1, 6);
  });

  it('Overflow', () => {
    const y = math.softmax(Array1D.new([10000, 10000]));
    expect(y.get(0)).toBeCloseTo(0.5, 3);
    expect(y.get(1)).toBeCloseTo(0.5, 3);
  });

  it('Underflow', () => {
    const y = math.softmax(Array1D.new([-10000, -10000]));
    expect(y.get(0)).toBeCloseTo(0.5, 3);
    expect(y.get(1)).toBeCloseTo(0.5, 3);
  });

  it('Huge difference between probabilities', () => {
    const y = math.softmax(Array1D.new([-10000, +10000]));
    expect(y.get(0)).toBeCloseTo(0.0, 6);
    expect(y.get(1)).toBeCloseTo(1, 6);
  });

  it('Propagates NaNs', () => {
    const y = math.softmax(Array1D.new([2, 1, NaN]));
    expect(y.getValues()).toEqual(new Float32Array([NaN, NaN, NaN]));
  });
});

describe('NDArrayMathCPU sum', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('sums values in ndarray', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    expect(math.sum(a).get()).toBe(7);
  });

  it('propagates NaNs', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, NaN, 0, 1]);
    expect(math.sum(a).get()).toEqual(NaN);
  });
});

describe('NDArrayMathCPU scalar OP ndarray', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('c + A', () => {
    const c = Scalar.new(5);
    const a = Array1D.new([1, 2, 3]);
    expect(math.scalarPlusArray(c, a).getValues()).toEqual(new Float32Array([
      6, 7, 8
    ]));
  });

  it('c + A propagates NaNs', () => {
    const c = Scalar.new(NaN);
    const a = Array1D.new([1, 2, 3]);
    const res = math.scalarPlusArray(c, a).getValues();
    expect(res).toEqual(new Float32Array([NaN, NaN, NaN]));
  });

  it('c + A throws when passed non scalar', () => {
    // tslint:disable-next-line:no-any
    const c: any = Array1D.new([1, 2, 3]);
    const a = Array1D.new([1, 2, 3]);
    expect(() => math.scalarPlusArray(c, a)).toThrowError();
  });

  it('c - A', () => {
    const c = Scalar.new(5);
    const a = Array1D.new([1, 2, 3]);
    expect(math.scalarMinusArray(c, a).getValues()).toEqual(new Float32Array([
      4, 3, 2
    ]));
  });

  it('c - A throws when passed non scalar', () => {
    // tslint:disable-next-line:no-any
    const c: any = Array1D.new([1, 2, 3]);
    const a = Array1D.new([1, 2, 3]);
    expect(() => math.scalarMinusArray(c, a)).toThrowError();
  });

  it('A - c', () => {
    const a = Array1D.new([1, 2, 3]);
    const c = Scalar.new(5);
    expect(math.arrayMinusScalar(a, c).getValues()).toEqual(new Float32Array([
      -4, -3, -2
    ]));
  });

  it('A - c propagates NaNs', () => {
    const a = Array1D.new([1, NaN, 3]);
    const c = Scalar.new(5);
    const res = math.arrayMinusScalar(a, c).getValues();
    expect(res).toEqual(new Float32Array([-4, NaN, -2]));
  });

  it('A - c throws when passed non scalar', () => {
    // tslint:disable-next-line:no-any
    const c: any = Array1D.new([1, 2, 3]);
    const a = Array1D.new([1, 2, 3]);
    expect(() => math.arrayMinusScalar(a, c)).toThrowError();
  });
});

describe('NDArrayMathCPU switchDim', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('Switch dim 2D (no change)', () => {
    const t = Array2D.new([2, 4], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [0, 1]);
    expect(t2.shape).toEqual(t.shape);
    expect(t2.getValues()).toEqual(t.getValues());
  });

  it('Switch dim 2D (transpose)', () => {
    const t = Array2D.new([2, 4], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [1, 0]);
    expect(t2.shape).toEqual([4, 2]);
    const expected = new Float32Array([1, 3, 11, 33, 2, 4, 22, 44]);
    expect(t2.getValues()).toEqual(expected);
  });

  it('Switch dim 3D [r, c, d] => [d, r, c]', () => {
    const t = Array3D.new([2, 2, 2], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [2, 0, 1]);
    expect(t2.shape).toEqual([2, 2, 2]);
    const expected = new Float32Array([1, 2, 3, 4, 11, 22, 33, 44]);
    expect(t2.getValues()).toEqual(expected);
  });

  it('Switch dim 3D [r, c, d] => [d, c, r]', () => {
    const t = Array3D.new([2, 2, 2], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [2, 1, 0]);
    expect(t2.shape).toEqual([2, 2, 2]);
    const expected = new Float32Array([1, 3, 2, 4, 11, 33, 22, 44]);
    expect(t2.getValues()).toEqual(expected);
  });
});

describe('NDArrayMathCPU maxPool', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('1x1x1 in, 1x1 filter, 1 stride: [0] => [0]', () => {
    const a = Array3D.new([1, 1, 1], [0]);
    const result = math.maxPool(a, 1, 1, 0);
    expect(result.getValues()).toBeCloseTo(0);
  });

  it('3x3x1 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 9, 8]);
    const result = math.maxPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([5, 6, 9, 9]));
  });

  it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', () => {
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 9]);
    const result = math.maxPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([5, 6, NaN, NaN]));
  });

  it('3x3x2 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [3, 3, 2],
        [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);
    const result = math.maxPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 2]);
    expect(result.getValues()).toEqual(new Float32Array([
      5, 99, 6, 88, 9, 66, 9, 55
    ]));
  });

  it('4x4x1 in, 2x2 filter, 2 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const result = math.maxPool(a, 2, 2, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([5, 7, 13, 15]));
  });

  it('2x2x1 in, 2x2 filter, 2 stride, pad=1', () => {
    // Feed forward.
    const a = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const result = math.maxPool(a, 2, 2, 1);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([1, 2, 3, 4]));
  });
});

describe('NDArrayMathCPU minPool', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('1x1x1 in, 1x1 filter, 1 stride: [0] => [0]', () => {
    const a = Array3D.new([1, 1, 1], [0]);
    const result = math.minPool(a, 1, 1, 0);
    expect(result.getValues()).toBeCloseTo(0);
  });

  it('3x3x1 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 9, 8]);
    const result = math.minPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([1, 2, 4, 5]));
  });

  it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', () => {
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 8]);
    const result = math.minPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([1, 2, NaN, NaN]));
  });

  it('3x3x2 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [3, 3, 2],
        [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);
    const result = math.minPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 2]);
    expect(result.getValues()).toEqual(new Float32Array([
      1, 55, 2, 44, 4, 22, 5, 11
    ]));
  });

  it('4x4x1 in, 2x2 filter, 2 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const result = math.minPool(a, 2, 2, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([0, 2, 8, 10]));
  });

  it('2x2x1 in, 2x2 filter, 2 stride, pad=1', () => {
    // Feed forward.
    const a = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const result = math.minPool(a, 2, 2, 1);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([1, 2, 3, 4]));
  });
});

describe('NDArrayMathCPU avgPool', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('1x1x1 in, 1x1 filter, 1 stride: [0] => [0]', () => {
    const a = Array3D.new([1, 1, 1], [0]);
    const result = math.avgPool(a, 1, 1, 0);
    expect(result.getValues()).toBeCloseTo(0);
  });

  it('3x3x1 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 9, 8]);
    const result = math.avgPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([3, 4, 6.25, 7]));
  });

  it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', () => {
    // Feed forward.
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 8]);
    const result = math.avgPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([3, 4, NaN, NaN]));
  });

  it('3x3x2 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [3, 3, 2],
        [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);
    const result = math.avgPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 2]);
    expect(result.getValues()).toEqual(new Float32Array([
      3, 77, 4, 66, 6.25, 44, 7, 33
    ]));
  });

  it('4x4x1 in, 2x2 filter, 2 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const result = math.avgPool(a, 2, 2, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([
      2.5, 4.5, 10.5, 12.5
    ]));
  });

  it('2x2x1 in, 2x2 filter, 2 stride, pad=1', () => {
    // Feed forward.
    const a = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const result = math.avgPool(a, 2, 2, 1);

    expect(result.shape).toEqual([2, 2, 1]);
    expect(result.getValues()).toEqual(new Float32Array([0.25, 0.5, 0.75, 1]));
  });
});

describe('NDArrayMathCPU maxPoolBackprop', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('x=3x3x1, f=2, s=1, no duplicate max value, test #1', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const expected = new Float32Array([0, 0, 0, 0, 1, 2, 0, 3, 4]);
    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=3x3x1, f=2, s=1, no duplicate max value, test #2', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new([3, 3, 1], [9, 5, 6, 6, 8, 4, 9, 5, 10]);
    const expected = new Float32Array([1, 0, 0, 0, 2, 0, 3, 0, 4]);
    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=3x3x1, f=2, s=1 duplicate max value, test 1', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new([3, 3, 1], [0, 0, 0, 0, 5, 0, 0, 0, 0]);
    const expected = new Float32Array([0, 0, 0, 0, 10, 0, 0, 0, 0]);
    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=3x3x1, f=2, s=1 duplicate max value, test 2', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new([3, 3, 1], [1, 3, 2, 1, 2, 1, 1, 1, 5]);
    const expected = new Float32Array([0, 3, 0, 0, 3, 0, 0, 0, 4]);
    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=4x4x1, f=2, s=2, test #1', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new(
        [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const expected =
        new Float32Array([0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 3, 0, 4]);
    const dx = math.maxPoolBackprop(dy, x, 2, 2, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=4x4x1, f=2, s=2, test #2', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new(
        [4, 4, 1], [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1]);
    const expected =
        new Float32Array([0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 0]);
    const dx = math.maxPoolBackprop(dy, x, 2, 2, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=5x5x1, f=3, s=2 no duplicate max value', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new([5, 5, 1], [
      0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12,
      13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ]);
    const expected = new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 4
    ]);
    const dx = math.maxPoolBackprop(dy, x, 3, 2, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=5x5x1, f=3, s=2 duplicate max value', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const x = Array3D.new([5, 5, 1], [
      0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 24,
      13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 12
    ]);
    const expected = new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
    const dx = math.maxPoolBackprop(dy, x, 3, 2, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  // Max pool backprop depth > 1.
  it('x=3x3x2, f=2, s=1, no duplicate max value', () => {
    // This test combines the first two 3x3x1 tests with no duplicates to
    // make depth=2,
    // dy is slightly modified to show the difference.
    const dy = Array3D.new([2, 2, 2], [1, 44, 2, 33, 3, 22, 4, 11]);
    const x = Array3D.new(
        [3, 3, 2],
        [1, 99, 2, 55, 3, 66, 4, 66, 5, 88, 6, 44, 7, 99, 8, 55, 9, 100]);
    const expected = new Float32Array(
        [0, 44, 0, 0, 0, 0, 0, 0, 1, 33, 2, 0, 0, 22, 3, 0, 4, 11]);

    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=3x3x2, f=2, s=1, duplicate max value', () => {
    // This test combines the first two 3x3x1 tests with duplicates to
    // make depth=2,
    // dy is slightly modified to show the difference.
    const dy = Array3D.new([2, 2, 2], [1, 44, 2, 33, 3, 22, 4, 11]);
    const x = Array3D.new(
        [3, 3, 2], [0, 1, 0, 3, 0, 2, 0, 1, 5, 2, 0, 1, 0, 1, 0, 1, 0, 5]);
    const expected = new Float32Array(
        [0, 0, 0, 77, 0, 0, 0, 0, 10, 22, 0, 0, 0, 0, 0, 0, 0, 11]);

    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=4x4x2, f=2, s=1', () => {
    // This test combines the first two 4x4x1 tests with duplicates to make
    // depth=2,
    // dy is slightly modified to show the difference.
    const dy = Array3D.new([2, 2, 2], [1, 11, 2, 22, 3, 33, 4, 44]);
    const x = Array3D.new([4, 4, 2], [
      0, 1, 1, 2, 2,  2, 3,  1, 4,  1, 5,  1, 6,  1, 7,  1,
      8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 2, 14, 2, 15, 1
    ]);
    const expected = new Float32Array([
      0, 0, 0, 11, 0, 22, 0, 0, 0, 0, 1, 0,  0, 0,  2, 0,
      0, 0, 0, 0,  0, 0,  0, 0, 0, 0, 3, 33, 0, 44, 4, 0
    ]);
    const dx = math.maxPoolBackprop(dy, x, 2, 2, 0);
    expect(dx.getValues()).toEqual(expected);
  });

  it('x=5x5x2, f=3, s=2 no duplicate max value', () => {
    // This test combines the first two 5x5x1 tests with duplicates to make
    // depth=2,
    // dy is slightly modified to show the difference.
    const dy = Array3D.new([2, 2, 2], [1, 11, 2, 22, 3, 33, 4, 44]);
    const x = Array3D.new([5, 5, 2], [
      0,  0,  1,  1,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,
      8,  9,  9,  10, 10, 11, 11, 12, 24, 13, 13, 14, 14, 15, 15, 16, 16,
      17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 12
    ]);
    const expected = new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 110, 0, 0, 2, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,   0, 3, 0, 0, 0, 4, 0
    ]);
    const dx = math.maxPoolBackprop(dy, x, 3, 2, 0);
    expect(dx.getValues()).toEqual(expected);
  });
});

describe('NDArrayMathCPU resizeBilinear', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('simple alignCorners=false', () => {
    const input = Array3D.new([2, 2, 1], [2, 2, 4, 4]);
    const output = math.resizeBilinear3D(input, [3, 3], false);

    test_util.expectArraysClose(
        output.getValues(),
        new Float32Array([2, 2, 2, 10 / 3, 10 / 3, 10 / 3, 4, 4, 4]));
  });

  it('simple alignCorners=true', () => {
    const input = Array3D.new([2, 2, 1], [2, 2, 4, 4]);
    const output = math.resizeBilinear3D(input, [3, 3], true);

    test_util.expectArraysClose(
        output.getValues(), new Float32Array([2, 2, 2, 3, 3, 3, 4, 4, 4]));
  });

  it('matches tensorflow w/ random numbers alignCorners=false', () => {
    const input = Array3D.new([2, 3, 2], [
      1.19074044, 0.91373104, 2.01611669, -0.52270832, 0.38725395, 1.30809779,
      0.61835143, 3.49600659, 2.09230986, 0.56473997, 0.03823943, 1.19864896
    ]);
    const output = math.resizeBilinear3D(input, [4, 5], false);

    test_util.expectArraysClose(
        output.getValues(), new Float32Array([
          1.19074047,  0.91373104, 1.68596613, 0.05186744, 1.69034398,
          -0.15654698, 0.7130264,  0.94193673, 0.38725394, 1.30809784,
          0.9045459,   2.20486879, 1.59434628, 0.89455694, 1.68591988,
          0.26748738,  0.58103991, 1.00690198, 0.21274668, 1.25337338,
          0.6183514,   3.49600649, 1.50272655, 1.73724651, 1.68149579,
          0.69152176,  0.44905344, 1.07186723, 0.03823943, 1.19864893,
          0.6183514,   3.49600649, 1.50272655, 1.73724651, 1.68149579,
          0.69152176,  0.44905344, 1.07186723, 0.03823943, 1.19864893
        ]));
  });

  it('matches tensorflow w/ random numbers alignCorners=true', () => {
    const input = Array3D.new([2, 3, 2], [
      1.56324531, 2.13817752, 1.44398421, 1.07632684, 0.59306785, -0.36970865,
      1.62451879, 1.8367334, 1.13944798, 2.01993218, 2.01919952, 2.67524054
    ]);
    const output = math.resizeBilinear3D(input, [4, 5], true);

    test_util.expectArraysClose(
        output.getValues(), new Float32Array([
          1.5632453,  2.13817763, 1.50361478, 1.60725224, 1.44398427,
          1.07632685, 1.01852608, 0.35330909, 0.59306782, -0.36970866,
          1.58366978, 2.03769612, 1.46307099, 1.71427906, 1.3424722,
          1.39086199, 1.20545864, 1.01806819, 1.06844509, 0.6452744,
          1.60409427, 1.93721485, 1.42252707, 1.82130599, 1.24096,
          1.70539713, 1.3923912,  1.68282723, 1.54382229, 1.66025746,
          1.62451875, 1.83673346, 1.38198328, 1.92833281, 1.13944793,
          2.01993227, 1.57932377, 2.34758639, 2.01919961, 2.67524052
        ]));
  });
});

describe('NDArrayMathCPU batchNorm', () => {
  let math: NDArrayMathCPU;
  beforeEach(() => {
    math = new NDArrayMathCPU();
  });

  it('simple batchnorm, no offset or scale, 2x1x2', () => {
    const x = Array3D.new([2, 1, 2], new Float32Array([2, 100, 4, 400]));
    const mean = Array1D.new([1, 2]);
    const variance = Array1D.new([2, 3]);
    const varianceEpsilon = .001;

    const result = math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, undefined, undefined);

    test_util.expectArraysClose(
        result.getValues(), new Float32Array([
          (x.get(0, 0, 0) - mean.get(0)) * 1 /
              Math.sqrt(variance.get(0) + varianceEpsilon),
          (x.get(0, 0, 1) - mean.get(1)) * 1 /
              Math.sqrt(variance.get(1) + varianceEpsilon),
          (x.get(1, 0, 0) - mean.get(0)) * 1 /
              Math.sqrt(variance.get(0) + varianceEpsilon),
          (x.get(1, 0, 1) - mean.get(1)) * 1 /
              Math.sqrt(variance.get(1) + varianceEpsilon)
        ]));
  });

  it('simple batchnorm, no offset, 2x1x2', () => {
    const x = Array3D.new([2, 1, 2], new Float32Array([2, 100, 4, 400]));
    const mean = Array1D.new([1, 2]);
    const variance = Array1D.new([2, 3]);
    const scale = Array1D.new([4, 5]);
    const varianceEpsilon = .001;

    const result = math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, scale, undefined);

    test_util.expectArraysClose(
        result.getValues(), new Float32Array([
          (x.get(0, 0, 0) - mean.get(0)) * scale.get(0) /
              Math.sqrt(variance.get(0) + varianceEpsilon),
          (x.get(0, 0, 1) - mean.get(1)) * scale.get(1) /
              Math.sqrt(variance.get(1) + varianceEpsilon),
          (x.get(1, 0, 0) - mean.get(0)) * scale.get(0) /
              Math.sqrt(variance.get(0) + varianceEpsilon),
          (x.get(1, 0, 1) - mean.get(1)) * scale.get(1) /
              Math.sqrt(variance.get(1) + varianceEpsilon)
        ]));
  });

  it('simple batchnorm, no scale, 2x1x2', () => {
    const x = Array3D.new([2, 1, 2], new Float32Array([2, 100, 4, 400]));
    const mean = Array1D.new([1, 2]);
    const variance = Array1D.new([2, 3]);
    const offset = Array1D.new([4, 5]);

    const varianceEpsilon = .001;

    const result = math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, undefined, offset);

    test_util.expectArraysClose(
        result.getValues(), new Float32Array([
          offset.get(0) +
              (x.get(0, 0, 0) - mean.get(0)) * 1 /
                  Math.sqrt(variance.get(0) + varianceEpsilon),
          offset.get(1) +
              (x.get(0, 0, 1) - mean.get(1)) * 1 /
                  Math.sqrt(variance.get(1) + varianceEpsilon),
          offset.get(0) +
              (x.get(1, 0, 0) - mean.get(0)) * 1 /
                  Math.sqrt(variance.get(0) + varianceEpsilon),
          offset.get(1) +
              (x.get(1, 0, 1) - mean.get(1)) * 1 /
                  Math.sqrt(variance.get(1) + varianceEpsilon)
        ]));
  });

  it('simple batchnorm, 2x1x2', () => {
    const x = Array3D.new([2, 1, 2], new Float32Array([2, 100, 4, 400]));
    const mean = Array1D.new([1, 2]);
    const variance = Array1D.new([2, 3]);
    const offset = Array1D.new([3, 4]);
    const scale = Array1D.new([4, 5]);

    const varianceEpsilon = .001;

    const result = math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, scale, offset);

    test_util.expectArraysClose(
        result.getValues(), new Float32Array([
          offset.get(0) +
              (x.get(0, 0, 0) - mean.get(0)) * scale.get(0) /
                  Math.sqrt(variance.get(0) + varianceEpsilon),
          offset.get(1) +
              (x.get(0, 0, 1) - mean.get(1)) * scale.get(1) /
                  Math.sqrt(variance.get(1) + varianceEpsilon),
          offset.get(0) +
              (x.get(1, 0, 0) - mean.get(0)) * scale.get(0) /
                  Math.sqrt(variance.get(0) + varianceEpsilon),
          offset.get(1) +
              (x.get(1, 0, 1) - mean.get(1)) * scale.get(1) /
                  Math.sqrt(variance.get(1) + varianceEpsilon)
        ]));
  });

  it('batchnorm matches tensorflow, 2x3x3', () => {
    const x =
        Array3D.new([2, 3, 3], new Float32Array([
                      0.49955603, 0.04158615, -1.09440524, 2.03854165,
                      -0.61578344, 2.87533573, 1.18105987, 0.807462, 1.87888837,
                      2.26563962, -0.37040935, 1.35848753, -0.75347094,
                      0.15683117, 0.91925946, 0.34121279, 0.92717143, 1.89683965
                    ]));
    const mean = Array1D.new([0.39745062, -0.48062894, 0.4847822]);
    const variance = Array1D.new([0.32375343, 0.67117643, 1.08334653]);
    const offset = Array1D.new([0.69398749, -1.29056387, 0.9429723]);
    const scale = Array1D.new([-0.5607271, 0.9878457, 0.25181573]);
    const varianceEpsilon = .001;

    const result = math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, scale, offset);

    test_util.expectArraysClose(
        result.getValues(), new Float32Array([
          0.59352049, -0.66135202, 0.5610874, -0.92077015, -1.45341019,
          1.52106473, -0.07704776, 0.26144429, 1.28010017, -1.14422404,
          -1.15776136, 1.15425493, 1.82644104, -0.52249442, 1.04803919,
          0.74932291, 0.40568101, 1.2844412
        ]));
  });
});
