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

import * as test_util from '../../test_util';
import {NDArrayMath} from '../math';
import {NDArrayMathCPU} from '../math_cpu';
import {NDArrayMathGPU} from '../math_gpu';
import {Array2D, Array3D} from '../ndarray';

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

  it('2D no change', () => {
    const t = Array2D.new([2, 4], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [0, 1]);
    expect(t2.shape).toEqual(t.shape);
    test_util.expectArraysClose(t2.getValues(), t.getValues());
  });

  it('2D switchDim', () => {
    const t = Array2D.new([2, 4], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [1, 0]);
    expect(t2.shape).toEqual([4, 2]);
    const expected = new Float32Array([1, 3, 11, 33, 2, 4, 22, 44]);
    test_util.expectArraysClose(t2.getValues(), expected);
  });

  it('3D [r, c, d] => [d, r, c]', () => {
    const t = Array3D.new([2, 2, 2], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [2, 0, 1]);
    expect(t2.shape).toEqual([2, 2, 2]);
    const expected = new Float32Array([1, 2, 3, 4, 11, 22, 33, 44]);
    test_util.expectArraysClose(t2.getValues(), expected);
  });

  it('3D [r, c, d] => [d, c, r]', () => {
    const t = Array3D.new([2, 2, 2], [1, 11, 2, 22, 3, 33, 4, 44]);
    const t2 = math.switchDim(t, [2, 1, 0]);
    expect(t2.shape).toEqual([2, 2, 2]);
    const expected = new Float32Array([1, 3, 2, 4, 11, 33, 22, 44]);
    test_util.expectArraysClose(t2.getValues(), expected);
  });
}

describe('mathCPU switchDim', () => {
  executeTests(() => new NDArrayMathCPU());
});

describe('mathGPU switchDim', () => {
  executeTests(() => new NDArrayMathGPU());
});
