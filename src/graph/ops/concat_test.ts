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

import {NDArrayMathCPU} from '../../math/backends/backend_cpu';
import * as concat_util from '../../math/concat_util';
import {Array1D, Array2D, Array3D, Array4D} from '../../math/ndarray';
import {Tensor} from '../graph';
import {TensorArrayMap} from '../tensor_array_map';

import {Concat, Concat1D, Concat2D, Concat3D, Concat4D} from './concat';

describe('concat operation', () => {
  let math: NDArrayMathCPU;

  let x1Tensor: Tensor;
  let x2Tensor: Tensor;
  let yTensor: Tensor;
  let concatOperation: Concat;
  let tensorArrayMap: TensorArrayMap;

  beforeEach(() => {
    math = new NDArrayMathCPU();
    tensorArrayMap = new TensorArrayMap();
  });

  afterEach(() => {
    tensorArrayMap.disposeArray(x1Tensor);
    tensorArrayMap.disposeArray(x2Tensor);
    tensorArrayMap.disposeArray(yTensor);
  });

  it('concats 1d tensors', () => {
    const x1 = Array1D.new([1, 1, 3]);
    const x2 = Array1D.new([2, 2]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape1D(x1.shape, x2.shape));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat1D(x1Tensor, x2Tensor, yTensor);
    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([5]);
    expect(y.getValues()).toEqual(new Float32Array([1, 1, 3, 2, 2]));
  });

  it('concats 2d tensors, axis=0', () => {
    const x1 = Array2D.new([2, 3], [[1, 1, 3], [2, 2, 3]]);
    const x2 = Array2D.new([1, 3], [[3, 3, 4]]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, 0));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat2D(x1Tensor, x2Tensor, 0, yTensor);
    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([3, 3]);
    expect(y.getValues()).toEqual(
        new Float32Array([1, 1, 3, 2, 2, 3, 3, 3, 4]));
  });

  it('concats 2d tensors, axis=1', () => {
    const x1 = Array2D.new([2, 3], [[1, 1, 3], [2, 2, 3]]);
    const x2 = Array2D.new([2, 1], [[3], [4]]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, 1));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat2D(x1Tensor, x2Tensor, 1, yTensor);
    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([2, 4]);
    expect(y.getValues()).toEqual(new Float32Array([1, 1, 3, 3, 2, 2, 3, 4]));
  });  

  it('concats tensors, axis=0', () => {
    const axis = 0;

    const x1 = Array3D.new([1, 1, 3], [1, 2, 3]);
    const x2 = Array3D.new([1, 1, 3], [4, 5, 6]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, axis));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat3D(x1Tensor, x2Tensor, axis, yTensor);

    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([2, 1, 3]);
    expect(y.getValues()).toEqual(new Float32Array([1, 2, 3, 4, 5, 6]));
  });

  it('concats tensors, axis=1', () => {
    const axis = 1;

    const x1 = Array3D.new([1, 1, 3], [1, 2, 3]);
    const x2 = Array3D.new([1, 1, 3], [4, 5, 6]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, axis));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat3D(x1Tensor, x2Tensor, axis, yTensor);

    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([1, 2, 3]);
    expect(y.getValues()).toEqual(new Float32Array([1, 2, 3, 4, 5, 6]));
  });

  it('concats tensors, axis=2', () => {
    const axis = 2;

    const x1 = Array3D.new([1, 1, 3], [1, 2, 3]);
    const x2 = Array3D.new([1, 1, 3], [4, 5, 6]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, axis));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat3D(x1Tensor, x2Tensor, axis, yTensor);

    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([1, 1, 6]);
    expect(y.getValues()).toEqual(new Float32Array([1, 2, 3, 4, 5, 6]));
  });

  it('concats 4d tensors, axis=0', () => {
    const x1 = Array4D.new([1, 1, 1, 3], [1, 2, 3]);
    const x2 = Array4D.new([1, 1, 1, 3], [4, 5, 6]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, 0));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat4D(x1Tensor, x2Tensor, 0, yTensor);
    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([2, 1, 1, 3]);
    expect(y.getValues()).toEqual(new Float32Array([1, 2, 3, 4, 5, 6]));
  });

  it('concats 4d tensors, axis=1', () => {
    const x1 = Array4D.new([1, 1, 1, 3], [1, 2, 3]);
    const x2 = Array4D.new([1, 1, 1, 3], [4, 5, 6]);

    x1Tensor = new Tensor(x1.shape);
    x2Tensor = new Tensor(x2.shape);
    yTensor = new Tensor(concat_util.computeOutShape(x1.shape, x2.shape, 1));

    tensorArrayMap.set(x1Tensor, x1);
    tensorArrayMap.set(x2Tensor, x2);

    concatOperation = new Concat4D(x1Tensor, x2Tensor, 1, yTensor);
    concatOperation.feedForward(math, tensorArrayMap);

    const y = tensorArrayMap.get(yTensor);

    expect(y.shape).toEqual([1, 2, 1, 3]);
    expect(y.getValues()).toEqual(new Float32Array([1, 2, 3, 4, 5, 6]));
  });    
});
