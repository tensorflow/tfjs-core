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

import {NDArrayMath} from './math';
import {NDArrayMathCPU} from './math_cpu';
// import {NDArrayMathGPU} from './math_gpu';
import {Array1D, Array2D, Array3D} from './ndarray';

function executeTests(mathFactory: () => NDArrayMath) {
  let math: NDArrayMath;

  beforeEach(() => {
    math = mathFactory();
    math.startScope();
  });

  afterEach(() => {
    math.endScope(null);
    math.dispose();
  });

  it('sums all values in 2D array', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    expect(math.sum(a).get()).toBe(7);
  });

  it('sums all values in 2D array with keep dim', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    const res = math.sum(a, null, true);
    expect(res.shape).toEqual([1, 1]);
    expect(res.get(0, 0)).toBe(7);
  });

  it('sums across axis=0 in 2D array', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    const res = math.sum(a, [0]);
    expect(res.shape).toEqual([2]);
    test_util.expectArraysClose(res.getValues(), new Float32Array([4, 3]));
  });

  it('sums across axis=1 in 2D array', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    const res = math.sum(a, [1]);
    expect(res.shape).toEqual([3]);
    test_util.expectArraysClose(res.getValues(), new Float32Array([3, 3, 1]));
  });

  it('sums across axis=0,1 in 2D array', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, 0, 0, 1]);
    const res = math.sum(a, [0, 1]);
    expect(res.shape).toEqual([]);
    expect(res.get()).toBe(7);
  });

  it('sums all values in 1D array', () => {
    const a = Array1D.new([1, 2, 3, 0, 1, 1]);
    expect(math.sum(a).get()).toBe(8);
  });

  it('propagates NaNs', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, NaN, 0, 1]);
    expect(math.sum(a).get()).toEqual(NaN);
  });

  it('propagates NaNs, axis=0 in 2D array', () => {
    const a = Array2D.new([3, 2], [1, 2, 3, NaN, 0, 1]);
    const res = math.sum(a, [0]);
    expect(res.shape).toEqual([2]);
    test_util.expectArraysClose(res.getValues(), new Float32Array([4, NaN]));
  });

  it('sums across axis=0,2 in 3D array', () => {
    const a = Array3D.new([2, 2, 2], [1, 2, 3, 4, 5, 6, 7, 8]);
    const res = math.sum(a, [0, 2]);
    expect(res.shape).toEqual([2]);
    test_util.expectArraysClose(
        res.getValues(), new Float32Array([1 + 2 + 5 + 6, 7 + 8 + 3 + 4]));
  });

  it('sums across axis=0,2 in 3D array with keep dim', () => {
    const a = Array3D.new([2, 2, 2], [1, 2, 3, 4, 5, 6, 7, 8]);
    const res = math.sum(a, [0, 2], true);
    expect(res.shape).toEqual([1, 2, 1]);
    test_util.expectArraysClose(
        res.getValues(), new Float32Array([1 + 2 + 5 + 6, 7 + 8 + 3 + 4]));
  });
}

describe('mathCPU sum', () => {
  executeTests(() => new NDArrayMathCPU());
});

// describe('mathGPU sum', () => {
//   executeTests(() => new NDArrayMathGPU());
// });
