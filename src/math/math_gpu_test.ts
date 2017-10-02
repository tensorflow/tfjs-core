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

import {NDArrayMathGPU} from './math_gpu';
import {Array1D, Array2D, Array3D, Array4D, Scalar} from './ndarray';
import * as webgl_util from './webgl/webgl_util';


describe('NDArrayMathGPU scope', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
  });

  it('scope returns NDArray', () => {
    const a = Array1D.new([1, 2, 3]);
    let b = Array1D.new([0, 0, 0]);

    const numUsedTexturesBefore = math.getTextureManager().getNumUsedTextures();

    math.scope(() => {
      const result = math.scope(() => {
        b = math.add(a, b) as Array1D;
        b = math.add(a, b) as Array1D;
        b = math.add(a, b) as Array1D;
        return math.add(a, b);
      });

      // a, b, and result are new textures. All intermediates should be
      // disposed.
      expect(math.getTextureManager().getNumUsedTextures())
          .toEqual(numUsedTexturesBefore + 3);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([4, 8, 12]));
    });

    // a, b are new textures, result should be disposed.
    expect(math.getTextureManager().getNumUsedTextures())
        .toEqual(numUsedTexturesBefore + 2);
    a.dispose();
    b.dispose();
  });

  it('scope returns NDArray[]', () => {
    const a = Array1D.new([1, 2, 3]);
    const b = Array1D.new([0, -1, 1]);

    const numUsedTexturesBefore = math.getTextureManager().getNumUsedTextures();

    math.scope(() => {
      const result = math.scope(() => {
        math.add(a, b);
        return [math.add(a, b), math.sub(a, b)];
      });

      // a, b, and 2 results are new textures. All intermediates should be
      // disposed.
      expect(math.getTextureManager().getNumUsedTextures())
          .toEqual(numUsedTexturesBefore + 4);
      test_util.expectArraysClose(
          result[0].getValues(), new Float32Array([1, 1, 4]));
      test_util.expectArraysClose(
          result[1].getValues(), new Float32Array([1, 3, 2]));
    });

    // a, b are new textures, result should be disposed.
    expect(math.getTextureManager().getNumUsedTextures())
        .toEqual(numUsedTexturesBefore + 2);
    a.dispose();
    b.dispose();
  });

  it('basic scope usage without return', () => {
    const a = Array1D.new([1, 2, 3]);
    let b = Array1D.new([0, 0, 0]);

    const numUsedTexturesBefore = math.getTextureManager().getNumUsedTextures();

    math.scope(() => {
      b = math.add(a, b) as Array1D;
      b = math.add(a, b) as Array1D;
      b = math.add(a, b) as Array1D;
      math.add(a, b);
    });

    const numUsedTexturesAfter = math.getTextureManager().getNumUsedTextures();

    // original a and b, all intermediates should be disposed.
    expect(numUsedTexturesAfter).toEqual(numUsedTexturesBefore + 2);
  });

  it('nested scope usage', () => {
    const a = Array1D.new([1, 2, 3]);
    let b = Array1D.new([0, 0, 0]);

    const numUsedTexturesBefore = math.getTextureManager().getNumUsedTextures();

    math.scope(() => {
      const result = math.scope(() => {
        b = math.add(a, b) as Array1D;
        b = math.scope(() => {
          b = math.scope(() => {
            return math.add(a, b) as Array1D;
          });
          // a, original b, and two intermediate textures should be the only
          // textures.
          expect(math.getTextureManager().getNumUsedTextures())
              .toEqual(numUsedTexturesBefore + 4);

          math.scope(() => {
            math.add(a, b);
          });
          // All the intermediates should be cleaned up.
          expect(math.getTextureManager().getNumUsedTextures())
              .toEqual(numUsedTexturesBefore + 4);

          return math.add(a, b) as Array1D;
        });
        expect(math.getTextureManager().getNumUsedTextures())
            .toEqual(numUsedTexturesBefore + 4);

        return math.add(a, b) as Array1D;
      });

      // a, b, and result are new textures. All intermediates should be
      // disposed.
      expect(math.getTextureManager().getNumUsedTextures())
          .toEqual(numUsedTexturesBefore + 3);
      test_util.expectArraysClose(
          result.getValues(), new Float32Array([4, 8, 12]));
    });
    // a, b, are new textures, result should be disposed.
    expect(math.getTextureManager().getNumUsedTextures())
        .toEqual(numUsedTexturesBefore + 2);
  });
});

describe('NDArrayMathGPU min/max', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('max with one element dominating', () => {
    const a = Array1D.new([3, -1, 0, 100, -7, 2]);
    const r = math.max(a);

    expect(r.get()).toBeCloseTo(100);

    a.dispose();
  });

  it('max with all elements being the same', () => {
    const a = Array1D.new([3, 3, 3]);
    const r = math.max(a);
    expect(r.get()).toBeCloseTo(3);

    a.dispose();
  });

  it('max propagates NaNs', () => {
    expect(math.max(Array1D.new([3, NaN, 2])).get()).toEqual(NaN);
  });

  it('min Array1D', () => {
    const a = Array1D.new([3, -1, 0, 100, -7, 2]);
    expect(math.min(a).get()).toBeCloseTo(-7);
    a.dispose();
  });

  it('min propagates NaNs', () => {
    const a = Array1D.new([3, NaN, 2]);
    expect(math.min(a).get()).toEqual(NaN);
    a.dispose();
  });
});

describe('NDArrayMathGPU log/exp', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('logSumExp', () => {
    const a = Array1D.new([1, 2, -3]);
    const result = math.logSumExp(a);
    expect(result.get())
        .toBeCloseTo(Math.log(Math.exp(1) + Math.exp(2) + Math.exp(-3)));

    a.dispose();
    result.dispose();
  });

  it('logSumExp propagates NaNs', () => {
    const a = Array1D.new([1, 2, NaN]);
    const result = math.logSumExp(a);
    expect(result.get()).toEqual(NaN);
    a.dispose();
  });
});


describe('softmax', () => {
  let math: NDArrayMathGPU;

  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('regular test', () => {
    const y = math.softmax(Array1D.new([2, 1, 3]));
    expect(y.get(0)).toBeCloseTo(0.24472847, test_util.TEST_LOW_PRECISION);
    expect(y.get(1)).toBeCloseTo(0.09003057, test_util.TEST_LOW_PRECISION);
    expect(y.get(2)).toBeCloseTo(0.66524095, test_util.TEST_LOW_PRECISION);
    expect(y.get(0) + y.get(1) + y.get(2))
        .toBeCloseTo(1, test_util.TEST_LOW_PRECISION);
  });

  it('overflow', () => {
    const y = math.softmax(Array1D.new([10000, 10000]));
    expect(y.get(0)).toBeCloseTo(0.5, test_util.TEST_LOW_PRECISION);
    expect(y.get(1)).toBeCloseTo(0.5, test_util.TEST_LOW_PRECISION);
  });

  it('underflow', () => {
    const y = math.softmax(Array1D.new([-10000, -10000]));
    expect(y.get(0)).toBeCloseTo(0.5, test_util.TEST_LOW_PRECISION);
    expect(y.get(1)).toBeCloseTo(0.5, test_util.TEST_LOW_PRECISION);
  });

  it('Huge difference between probabilities', () => {
    const y = math.softmax(Array1D.new([-10000, +10000]));
    expect(y.get(0)).toBeCloseTo(0.0, test_util.TEST_LOW_PRECISION);
    expect(y.get(1)).toBeCloseTo(1, test_util.TEST_LOW_PRECISION);
  });

  it('Propagates NaNs', () => {
    const a = Array1D.new([2, 1, NaN]);
    const y = math.softmax(a);
    test_util.expectArraysClose(
        y.getValues(), new Float32Array([NaN, NaN, NaN]));
    a.dispose();
  });
});

describe('NDArrayMathGPU sum', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('sum', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    const result = math.sum(a);
    expect(result.get()).toBeCloseTo(7);

    a.dispose();
  });

  it('propagates NaNs', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, NaN, 0, 1]);
    expect(math.sum(a).get()).toEqual(NaN);
    a.dispose();
  });
});

describe('NDArrayMathGPU argmax', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('Array1D', () => {
    const a = Array1D.new([1, 0, 3, 2]);
    const result = math.argMax(a);
    expect(result.get()).toBeCloseTo(2);

    a.dispose();
  });

  it('propagates NaNs', () => {
    const a = Array1D.new([5, 0, 3, NaN, 3]);
    expect(math.argMax(a).get()).toEqual(NaN);
    a.dispose();
  });
});

describe('NDArrayMathGPU argmin', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('argmin', () => {
    const a = Array1D.new([1, 0, 3, 2]);
    const result = math.argMin(a);
    expect(result.get()).toBeCloseTo(1);

    a.dispose();
  });

  it('Arg min propagates NaNs', () => {
    const a = Array1D.new([5, 0, NaN, 7, 3]);
    expect(math.argMin(a).get()).toEqual(NaN);

    a.dispose();
  });
});

describe('NDArrayMathGPU argmax equals', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('equals', () => {
    const a = Array1D.new([5, 0, 3, 7, 3]);
    const b = Array1D.new([-100.3, -20.0, -10.0, -5, -100]);
    const result = math.argMaxEquals(a, b);
    expect(result.get()).toBeCloseTo(1);
  });

  it('not equals', () => {
    const a = Array1D.new([5, 0, 3, 1, 3]);
    const b = Array1D.new([-100.3, -20.0, -10.0, -5, 0]);
    const result = math.argMaxEquals(a, b);
    expect(result.get()).toBeCloseTo(0);
  });

  it('propagates NaNs', () => {
    const a = Array1D.new([0, 3, 1, 3]);
    const b = Array1D.new([NaN, -20.0, -10.0, -5]);
    const result = math.argMaxEquals(a, b);
    expect(result.get()).toEqual(NaN);
  });

  it('throws when given arrays of different shape', () => {
    const a = Array1D.new([5, 0, 3, 7, 3, 10]);
    const b = Array1D.new([-100.3, -20.0, -10.0, -5, -100]);
    expect(() => math.argMaxEquals(a, b)).toThrowError();
  });
});

describe('NDArrayMathGPU conv2d', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('input=2x2x1,d2=1,f=1,s=1,p=0', () => {
    const inputDepth = 1;
    const inputShape: [number, number, number] = [2, 2, inputDepth];
    const outputDepth = 1;
    const fSize = 1;
    const pad = 0;
    const stride = 1;

    const x = Array3D.new(inputShape, [1, 2, 3, 4]);
    const w = Array4D.new([fSize, fSize, inputDepth, outputDepth], [2]);
    const bias = Array1D.new([-1]);

    const result = math.conv2d(x, w, bias, stride, pad);
    const expected = new Float32Array([1, 3, 5, 7]);

    expect(result.inGPU()).toBe(true);
    test_util.expectArraysClose(result.getValues(), expected);
    x.dispose();
    w.dispose();
    bias.dispose();
  });

  it('input=2x2x1,d2=1,f=2,s=1,p=0', () => {
    const inputDepth = 1;
    const inputShape: [number, number, number] = [2, 2, inputDepth];
    const outputDepth = 1;
    const fSize = 2;
    const pad = 0;
    const stride = 1;

    const x = Array3D.new(inputShape, [1, 2, 3, 4]);
    const w =
        Array4D.new([fSize, fSize, inputDepth, outputDepth], [3, 1, 5, 0]);
    const bias = Array1D.new([-1]);

    const result = math.conv2d(x, w, bias, stride, pad);
    const expected = new Float32Array([19]);

    expect(result.inGPU()).toBe(true);
    test_util.expectArraysClose(result.getValues(), expected);

    x.dispose();
    w.dispose();
    bias.dispose();
  });

  it('throws when x is not rank 3', () => {
    const inputDepth = 1;
    const outputDepth = 1;
    const fSize = 2;
    const pad = 0;
    const stride = 1;

    // tslint:disable-next-line:no-any
    const x: any = Array2D.new([2, 2], [1, 2, 3, 4]);
    const w =
        Array4D.new([fSize, fSize, inputDepth, outputDepth], [3, 1, 5, 0]);
    const bias = Array1D.new([-1]);

    expect(() => math.conv2d(x, w, bias, stride, pad)).toThrowError();

    x.dispose();
    w.dispose();
    bias.dispose();
  });

  it('throws when weights is not rank 4', () => {
    const inputDepth = 1;
    const inputShape: [number, number, number] = [2, 2, inputDepth];
    const pad = 0;
    const stride = 1;

    const x = Array3D.new(inputShape, [1, 2, 3, 4]);
    // tslint:disable-next-line:no-any
    const w: any = Array3D.new([2, 2, 1], [3, 1, 5, 0]);
    const bias = Array1D.new([-1]);

    expect(() => math.conv2d(x, w, bias, stride, pad)).toThrowError();

    x.dispose();
    w.dispose();
    bias.dispose();
  });

  it('throws when biases is not rank 1', () => {
    const inputDepth = 1;
    const inputShape: [number, number, number] = [2, 2, inputDepth];
    const outputDepth = 1;
    const fSize = 2;
    const pad = 0;
    const stride = 1;

    const x = Array3D.new(inputShape, [1, 2, 3, 4]);
    const w =
        Array4D.new([fSize, fSize, inputDepth, outputDepth], [3, 1, 5, 0]);
    // tslint:disable-next-line:no-any
    const bias: any = Array2D.new([2, 2], [2, 2, 2, 2]);

    expect(() => math.conv2d(x, w, bias, stride, pad)).toThrowError();

    x.dispose();
    w.dispose();
    bias.dispose();
  });

  it('throws when x depth does not match weight depth', () => {
    const inputDepth = 1;
    const wrongInputDepth = 5;
    const inputShape: [number, number, number] = [2, 2, inputDepth];
    const outputDepth = 1;
    const fSize = 2;
    const pad = 0;
    const stride = 1;

    const x = Array3D.new(inputShape, [1, 2, 3, 4]);
    const w = Array4D.randNormal([fSize, fSize, wrongInputDepth, outputDepth]);
    const bias = Array1D.new([-1]);

    expect(() => math.conv2d(x, w, bias, stride, pad)).toThrowError();

    x.dispose();
    w.dispose();
    bias.dispose();
  });
});

describe('NDArrayMathGPU conv2dTranspose', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('input=2x2x1,d2=1,f=2,s=1,p=0', () => {
    const origInputDepth = 1;
    const origOutputDepth = 1;
    const inputShape: [number, number, number] = [1, 1, origOutputDepth];
    const fSize = 2;
    const origPad = 0;
    const origStride = 1;

    const x = Array3D.new(inputShape, [2]);
    const w = Array4D.new(
        [fSize, fSize, origInputDepth, origOutputDepth], [3, 1, 5, 0]);

    const result = math.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad);
    const expected = new Float32Array([6, 2, 10, 0]);

    expect(result.inGPU()).toBe(true);
    expect(result.shape).toEqual([2, 2, 1]);
    test_util.expectArraysClose(result.getValues(), expected);

    x.dispose();
    w.dispose();
  });

  it('throws when x is not rank 3', () => {
    const origInputDepth = 1;
    const origOutputDepth = 1;
    const fSize = 2;
    const origPad = 0;
    const origStride = 1;

    // tslint:disable-next-line:no-any
    const x: any = Array2D.new([2, 1], [2, 2]);
    const w = Array4D.new(
        [fSize, fSize, origInputDepth, origOutputDepth], [3, 1, 5, 0]);

    expect(() => math.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad))
        .toThrowError();

    x.dispose();
    w.dispose();
  });

  it('throws when weights is not rank 4', () => {
    const origInputDepth = 1;
    const origOutputDepth = 1;
    const inputShape: [number, number, number] = [1, 1, origOutputDepth];
    const fSize = 2;
    const origPad = 0;
    const origStride = 1;

    const x = Array3D.new(inputShape, [2]);
    // tslint:disable-next-line:no-any
    const w: any = Array3D.new([fSize, fSize, origInputDepth], [3, 1, 5, 0]);

    expect(() => math.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad))
        .toThrowError();

    x.dispose();
    w.dispose();
  });

  it('throws when x depth does not match weights original output depth', () => {
    const origInputDepth = 1;
    const origOutputDepth = 2;
    const wrongOrigOutputDepth = 3;
    const inputShape: [number, number, number] = [1, 1, origOutputDepth];
    const fSize = 2;
    const origPad = 0;
    const origStride = 1;

    const x = Array3D.new(inputShape, [2, 2]);
    const w = Array4D.randNormal(
        [fSize, fSize, origInputDepth, wrongOrigOutputDepth]);

    expect(() => math.conv2dTranspose(x, w, [2, 2, 2], origStride, origPad))
        .toThrowError();

    x.dispose();
    w.dispose();
  });
});

describe('NDArrayMathGPU conv2dDerWeights', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('conv2dDerWeights input=3x3x1,d2=1,f=2,s=1,p=0', () => {
    const inputDepth = 1;
    const outputDepth = 1;
    const inputShape: [number, number, number] = [3, 3, inputDepth];
    const fSize = 2;
    const stride = 1;
    const pad = 0;

    const weightsShape: [number, number, number, number] =
        [fSize, fSize, inputDepth, outputDepth];

    const x = Array3D.new(inputShape, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const dy = Array3D.new([2, 2, 1], [3, 1, 2, 0]);

    const result = math.conv2dDerFilter(x, dy, weightsShape, stride, pad);
    const expected = new Float32Array([13, 19, 31, 37]);

    expect(result.inGPU()).toBe(true);
    expect(result.shape).toEqual(weightsShape);
    test_util.expectArraysClose(
        result.getValues(), expected, test_util.TEST_LOW_PRECISION_EPSILON);

    x.dispose();
    dy.dispose();
  });
});

describe('NDArrayMathGPU conv2dDerWeights', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('conv2dDerBias dy=2x2x2', () => {
    const outputDepth = 2;
    const dyShape: [number, number, number] = [2, 2, outputDepth];
    const dy = Array3D.new(dyShape, [1, 2, 3, 4, 5, 6, 7, 8]);

    const result = math.conv2dDerBias(dy);
    const expected = new Float32Array([16, 20]);

    expect(result.inGPU()).toBe(true);
    expect(result.shape).toEqual([outputDepth]);
    test_util.expectArraysClose(result.getValues(), expected);

    dy.dispose();
  });
});

describe('NDArrayMathGPU maxPool', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('3x3x2 in, 2x2 filter, 1 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [3, 3, 2],
        [1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11]);
    const result = math.maxPool(a, 2, 1, 0);

    expect(result.inGPU()).toBe(true);
    expect(result.shape).toEqual([2, 2, 2]);
    test_util.expectArraysClose(
        result.getValues(), new Float32Array([5, 99, 6, 88, 9, 66, 9, 55]));
    a.dispose();
  });

  it('3x3x1 in, 2x2 filter, 1 stride, propagates NaNs', () => {
    const a = Array3D.new([3, 3, 1], [1, 2, 3, 4, 5, 6, 7, NaN, 9]);
    const result = math.maxPool(a, 2, 1, 0);

    expect(result.shape).toEqual([2, 2, 1]);
    test_util.expectArraysClose(
        result.getValues(), new Float32Array([5, 6, NaN, NaN]));
    a.dispose();
  });

  it('4x4x1 in, 2x2 filter, 2 stride', () => {
    // Feed forward.
    const a = Array3D.new(
        [4, 4, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const result = math.maxPool(a, 2, 2, 0);

    expect(result.inGPU()).toBe(true);
    expect(result.shape).toEqual([2, 2, 1]);
    test_util.expectArraysClose(
        result.getValues(), new Float32Array([5, 7, 13, 15]));

    a.dispose();
  });

  it('throws when x is not rank 3', () => {
    // tslint:disable-next-line:no-any
    const a: any = Array2D.new([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(() => math.maxPool(a, 2, 1, 0)).toThrowError();

    a.dispose();
  });
});

describe('NDArrayMathGPU maxPoolBackprop', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('x=2x2x1, f=2, s=2, pad=1', () => {
    const dy = Array3D.new([2, 2, 1], [1, 2, 3, 4]);
    const maxPositions = Array3D.new([2, 2, 1], [3, 2, 1, 0]);
    const expected = new Float32Array([1, 2, 3, 4]);
    const dx = math.maxPoolBackprop(dy, maxPositions, 2, 2, 1);

    expect(dx.inGPU()).toBe(true);
    test_util.expectArraysClose(dx.getValues(), expected);

    dy.dispose();
    maxPositions.dispose();
    dx.dispose();
  });

  // Max pool depth > 1.
  it('x=3x3x2, f=2, s=1, no duplicate max value', () => {
    const dy = Array3D.new([2, 2, 2], [1, 44, 2, 33, 3, 22, 4, 11]);
    const x = Array3D.new(
        [3, 3, 2],
        [1, 99, 2, 55, 3, 66, 4, 66, 5, 88, 6, 44, 7, 99, 8, 55, 9, 100]);
    const expected = new Float32Array(
        [0, 44, 0, 0, 0, 0, 0, 0, 1, 33, 2, 0, 0, 22, 3, 0, 4, 11]);
    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);

    expect(dx.inGPU()).toBe(true);
    test_util.expectArraysClose(dx.getValues(), expected);

    dy.dispose();
    x.dispose();
    dx.dispose();
  });

  it('x=3x3x2, f=2, s=1 duplicate max value', () => {
    const dy = Array3D.new([2, 2, 2], [1, 44, 2, 33, 3, 22, 4, 11]);
    const x = Array3D.new(
        [3, 3, 2], [0, 1, 0, 3, 0, 2, 0, 1, 5, 2, 0, 1, 0, 1, 0, 1, 0, 5]);
    const expected = new Float32Array(
        [0, 0, 0, 77, 0, 0, 0, 0, 10, 22, 0, 0, 0, 0, 0, 0, 0, 11]);
    const dx = math.maxPoolBackprop(dy, x, 2, 1, 0);

    expect(dx.inGPU()).toBe(true);
    test_util.expectArraysClose(dx.getValues(), expected);

    dy.dispose();
    x.dispose();
    dx.dispose();
  });
});

describe('NDArrayMathGPU resizeBilinear', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('simple alignCorners=false', () => {
    const input = Array3D.new([2, 2, 1], [2, 2, 4, 4]);
    const output = math.resizeBilinear3D(input, [3, 3], false);

    test_util.expectArraysClose(
        output.getValues(),
        new Float32Array([2, 2, 2, 10 / 3, 10 / 3, 10 / 3, 4, 4, 4]));
    input.dispose();
  });

  it('simple alignCorners=true', () => {
    const input = Array3D.new([2, 2, 1], [2, 2, 4, 4]);
    const output = math.resizeBilinear3D(input, [3, 3], true);

    test_util.expectArraysClose(
        output.getValues(), new Float32Array([2, 2, 2, 3, 3, 3, 4, 4, 4]));
    input.dispose();
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
    input.dispose();
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

    input.dispose();
  });
});

describe('NDArrayMathGPU batchNorm', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.startScope();
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
        ]),
        test_util.TEST_LOW_PRECISION);
    x.dispose();
    mean.dispose();
    variance.dispose();
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
        ]),
        test_util.TEST_LOW_PRECISION_EPSILON);
    x.dispose();
    mean.dispose();
    variance.dispose();
    scale.dispose();
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
        ]),
        test_util.TEST_LOW_PRECISION_EPSILON);
    x.dispose();
    mean.dispose();
    variance.dispose();
    offset.dispose();
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
        ]),
        test_util.TEST_LOW_PRECISION_EPSILON);
    x.dispose();
    mean.dispose();
    variance.dispose();
    scale.dispose();
    offset.dispose();
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
        ]),
        test_util.TEST_LOW_PRECISION_EPSILON);
    x.dispose();
    mean.dispose();
    variance.dispose();
    scale.dispose();
    offset.dispose();
  });
});

describe('NDArrayMathGPU debug mode', () => {
  let math: NDArrayMathGPU;

  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
  });

  it('debug mode does not error when no nans', () => {
    math.enableDebugMode();
    const a = Array1D.new([2, -1, 0, 3]);
    const res = math.relu(a);
    test_util.expectArraysClose(
        res.getValues(), new Float32Array([2, 0, 0, 3]));
  });

  it('debug mode errors when there are nans', () => {
    math.enableDebugMode();
    const a = Array1D.new([2, NaN]);
    const f = () => math.relu(a);
    expect(f).toThrowError();
  });

  it('no errors where there are nans, and debug mode is disabled', () => {
    const a = Array1D.new([2, NaN]);
    const res = math.relu(a);
    test_util.expectArraysClose(res.getValues(), new Float32Array([2, NaN]));
  });
});

describe('LSTMCell', () => {
  let math: NDArrayMathGPU;
  beforeEach(() => {
    math = new NDArrayMathGPU();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.startScope();
  });

  it('Batch size must be 1 for MultiRNNCell', () => {
    const lstmKernel1 = Array2D.zeros([3, 4]);
    const lstmBias1 = Array1D.zeros([4]);
    const lstmKernel2 = Array2D.zeros([2, 4]);
    const lstmBias2 = Array1D.zeros([4]);

    const forgetBias = Scalar.new(1.0);
    const lstm1 =
        math.basicLSTMCell.bind(math, forgetBias, lstmKernel1, lstmBias1);
    const lstm2 =
        math.basicLSTMCell.bind(math, forgetBias, lstmKernel2, lstmBias2);

    const c = [
      Array2D.zeros([1, lstmBias1.shape[0] / 4]),
      Array2D.zeros([1, lstmBias2.shape[0] / 4])
    ];
    const h = [
      Array2D.zeros([1, lstmBias1.shape[0] / 4]),
      Array2D.zeros([1, lstmBias2.shape[0] / 4])
    ];

    const onehot = Array2D.zeros([2, 2]);
    onehot.set(1.0, 1, 0);
    const output = () => math.multiRNNCell([lstm1, lstm2], onehot, c, h);
    expect(output).toThrowError();
  });

  it('Batch size must be 1 for basicLSTMCell', () => {
    const lstmKernel = Array2D.zeros([3, 4]);
    const lstmBias = Array1D.zeros([4]);

    const forgetBias = Scalar.new(1.0);

    const c = Array2D.zeros([1, lstmBias.shape[0] / 4]);
    const h = Array2D.zeros([1, lstmBias.shape[0] / 4]);

    const onehot = Array2D.zeros([2, 2]);
    onehot.set(1.0, 1, 0);
    const output = () =>
        math.basicLSTMCell(forgetBias, lstmKernel, lstmBias, onehot, c, h);
    expect(output).toThrowError();
  });

  it('MultiRNNCell with 2 BasicLSTMCells', () => {
    const lstmKernel1 = Array2D.new(
        [3, 4], new Float32Array([
          0.26242125034332275, -0.8787832260131836, 0.781475305557251,
          1.337337851524353, 0.6180247068405151, -0.2760246992111206,
          -0.11299663782119751, -0.46332040429115295, -0.1765323281288147,
          0.6807947158813477, -0.8326982855796814, 0.6732975244522095
        ]));
    const lstmBias1 = Array1D.new(new Float32Array(
        [1.090713620185852, -0.8282332420349121, 0, 1.0889357328414917]));
    const lstmKernel2 = Array2D.new(
        [2, 4], new Float32Array([
          -1.893059492111206, -1.0185645818710327, -0.6270437240600586,
          -2.1829540729522705, -0.4583775997161865, -0.5454602241516113,
          -0.3114445209503174, 0.8450229167938232
        ]));
    const lstmBias2 = Array1D.new(new Float32Array(
        [0.9906240105628967, 0.6248329877853394, 0, 1.0224634408950806]));

    const forgetBias = Scalar.new(1.0);
    const lstm1 =
        math.basicLSTMCell.bind(math, forgetBias, lstmKernel1, lstmBias1);
    const lstm2 =
        math.basicLSTMCell.bind(math, forgetBias, lstmKernel2, lstmBias2);

    const c = [
      Array2D.zeros([1, lstmBias1.shape[0] / 4]),
      Array2D.zeros([1, lstmBias2.shape[0] / 4])
    ];
    const h = [
      Array2D.zeros([1, lstmBias1.shape[0] / 4]),
      Array2D.zeros([1, lstmBias2.shape[0] / 4])
    ];

    const onehot = Array2D.zeros([1, 2]);
    onehot.set(1.0, 0, 0);

    const output = math.multiRNNCell([lstm1, lstm2], onehot, c, h);

    test_util.expectArraysClose(
        output[0][0].getValues(), new Float32Array([-0.7440074682235718]));
    test_util.expectArraysClose(
        output[0][1].getValues(), new Float32Array([0.7460772395133972]));
    test_util.expectArraysClose(
        output[1][0].getValues(), new Float32Array([-0.5802832245826721]));
    test_util.expectArraysClose(
        output[1][1].getValues(), new Float32Array([0.5745711922645569]));
  });
});
