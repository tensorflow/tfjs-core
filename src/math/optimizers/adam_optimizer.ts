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

import {keep, tidy} from '../../globals';
import {Node} from '../../graph/graph';
import {SessionRuntime} from '../../graph/session';
// tslint:disable-next-line:max-line-length
import {SummedTensorArrayMap, TensorArrayMap} from '../../graph/tensor_array_map';
import {NDArrayMath} from '../../math/math';
import {scalar} from '../../math/ops';
import {Optimizer} from '../../math/optimizers/optimizer';
import {Scalar, Tensor} from '../../math/tensor';
import {NamedVariableMap} from '../../math/types';

export class AdamOptimizer extends Optimizer {
  constructor(
      protected learningRate: number, private beta1: number,
      private beta2: number, specifiedVariableList?: Node[]) {
    super(learningRate, specifiedVariableList);
    this.eps = scalar(1e-8);
    // b1, b2 keep initial value of beta* hyperparameters.
    this.b1 = scalar(this.beta1);
    this.b2 = scalar(this.beta2);
    // accB* will be updated by batch.
    this.accB1 = scalar(this.beta1);
    this.accB2 = scalar(this.beta2);
    this.one = scalar(1);
  }

  applyGradients(variableGradients: NamedVariableMap) {
    throw new Error(`Adam optimizer not yet implemented for eager mode.`);
  }

  beforeBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    super.beforeBatch(
        math, batchSize, runtime, activationArrayMap, gradientArrayMap);

    if (this.firstMoment.size() === 0) {
      this.variableNodes.forEach(node => {
        this.firstMoment.set(node.output, Tensor.zeros(node.output.shape));
      });
    }

    if (this.secondMoment.size() === 0) {
      this.variableNodes.forEach(node => {
        this.secondMoment.set(node.output, Tensor.zeros(node.output.shape));
      });
    }
  }

  afterBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    tidy(() => {
      this.variableNodes.forEach(node => {
        const oldVariable = activationArrayMap.get(node.output);
        const gradient = this.variableGradients.get(node.output);

        const oldFirstMoment = this.firstMoment.get(node.output);
        const oldSecondMoment = this.secondMoment.get(node.output);

        const newFirstMoment = math.scaledArrayAdd(
            this.b1, oldFirstMoment, this.one.sub(this.b1), gradient);
        const gradientSquare = gradient.square();
        const newSecondMoment = math.scaledArrayAdd(
            this.b2, oldSecondMoment, this.one.sub(this.b2), gradientSquare);

        const biasCorrectedFirstMoment =
            newFirstMoment.div(this.one.sub(this.accB1));
        const biasCorrectedSecondMoment =
            newSecondMoment.div(this.one.sub(this.accB2));
        const variable = math.scaledArrayAdd(
            this.cGraph,
            biasCorrectedFirstMoment.div(
                this.eps.add(biasCorrectedSecondMoment.sqrt())),
            this.one, oldVariable);
        activationArrayMap.set(node.output, keep(variable));
        node.data = variable;

        this.firstMoment.set(node.output, keep(newFirstMoment));
        this.secondMoment.set(node.output, keep(newSecondMoment));

        oldVariable.dispose();
        gradient.dispose();
        oldFirstMoment.dispose();
        oldSecondMoment.dispose();
      });

      // Make sure to dispose old value objects.
      const oldAccB1 = this.accB1;
      const oldAccB2 = this.accB2;
      // accB* represents beta1 and beta2 to
      // the power t (the number of iteration).
      this.accB1 = keep(math.multiply(this.accB1, this.b1));
      this.accB2 = keep(math.multiply(this.accB2, this.b2));
      oldAccB1.dispose();
      oldAccB2.dispose();
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  dispose() {
    super.dispose();
    this.firstMoment.dispose();
    this.secondMoment.dispose();
    this.eps.dispose();
    this.b1.dispose();
    this.b2.dispose();
    this.accB1.dispose();
    this.accB2.dispose();
  }

  // Average of gradient
  private firstMoment = new TensorArrayMap();
  // Average of squared gradient
  private secondMoment = new TensorArrayMap();
  private eps: Scalar;
  private b1: Scalar;
  private b2: Scalar;
  private accB1: Scalar;
  private accB2: Scalar;
  private one: Scalar;
}
