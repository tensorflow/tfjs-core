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

import * as concat_util from '../../math/concat_util';
import {NDArrayMath} from '../../math/math';
import {Array4D, Array3D, Array2D, Array1D} from '../../math/ndarray';
import {Tensor} from '../graph';
import {SummedTensorArrayMap, TensorArrayMap} from '../tensor_array_map';

import {Operation} from './op';

export abstract class Concat extends Operation {
  protected opName: string;
  backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap,
    gradientArrays: SummedTensorArrayMap) {
    throw new Error(`${this.opName} backprop not implemented`);
  }
}

/**
 * @hidden
 */
export class Concat1D extends Concat {
  /**
   * A Concat 1D operation.
   *
   * Concats two 1D tensors along an axis.
   */
  constructor(
      private x1Tensor: Tensor, private x2Tensor: Tensor,
      private yTensor: Tensor) {
    super();
    this.opName = 'Concat1D';
  }

  feedForward(math: NDArrayMath, inferecenArrays: TensorArrayMap) {
    const x1 = inferecenArrays.get(this.x1Tensor) as Array1D;
    const x2 = inferecenArrays.get(this.x2Tensor) as Array1D;

    math.scope((keep) => {
      const concatResult = math.concat1D(x1, x2);
      inferecenArrays.set(this.yTensor, keep(concatResult));
    });
  }
}

/**
 * @hidden
 */
export class Concat2D extends Concat {
  /**
   * A Concat 2D operation.
   *
   * Concats two 2D tensors along an axis.
   */
  constructor(
      private x1Tensor: Tensor, private x2Tensor: Tensor, private axis: number,
      private yTensor: Tensor) {
    super();
    concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
    this.opName = 'Concat2D';
  }

  feedForward(math: NDArrayMath, inferecenArrays: TensorArrayMap) {
    const x1 = inferecenArrays.get(this.x1Tensor) as Array2D;
    const x2 = inferecenArrays.get(this.x2Tensor) as Array2D;

    math.scope((keep) => {
      const concatResult = math.concat2D(x1, x2, this.axis);
      inferecenArrays.set(this.yTensor, keep(concatResult));
    });
  }
}

/**
 * @hidden
 */
export class Concat3D extends Concat {
  /**
   * A Concat 3D operation.
   *
   * Concats two 3D tensors along an axis.
   */
  constructor(
      private x1Tensor: Tensor, private x2Tensor: Tensor, private axis: number,
      private yTensor: Tensor) {
    super();
    concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
    this.opName = 'Concat3D';
  }

  feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap) {
    const x1 = inferenceArrays.get(this.x1Tensor) as Array3D;
    const x2 = inferenceArrays.get(this.x2Tensor) as Array3D;

    math.scope((keep) => {
      const concatResult = math.concat3D(x1, x2, this.axis);
      inferenceArrays.set(this.yTensor, keep(concatResult));
    });
  }
}

/**
 * @hidden
 */
export class Concat4D extends Concat {
  /**
   * A Concat 4D operation.
   *
   * Concats two 4D tensors along an axis.
   */
  constructor(
      private x1Tensor: Tensor, private x2Tensor: Tensor, private axis: number,
      private yTensor: Tensor) {
    super();
    concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
    this.opName = 'Concat4D';
  }

  feedForward(math: NDArrayMath, inferecenArrays: TensorArrayMap) {
    const x1 = inferecenArrays.get(this.x1Tensor) as Array4D;
    const x2 = inferecenArrays.get(this.x2Tensor) as Array4D;

    math.scope((keep) => {
      const concatResult = math.concat4D(x1, x2, this.axis);
      inferecenArrays.set(this.yTensor, keep(concatResult));
    });
  }
}
