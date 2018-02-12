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

import {ENV} from '../environment';
import {keep, tidy} from '../globals';
import {Node} from '../graph/graph';
import {SessionRuntime} from '../graph/session';
// tslint:disable-next-line:max-line-length
import {SummedTensorArrayMap, TensorArrayMap} from '../graph/tensor_array_map';
import {NDArrayMath} from '../math';
import {scalar, zerosLike} from '../ops/ops';
import {Scalar, Tensor} from '../tensor';
import {variable} from '../tensor';
import {NamedVariableMap} from '../types';

import {Optimizer} from './optimizer';

export class AdamOptimizer extends Optimizer {
  private c: Scalar;
  private eps: Scalar;
  private b1: Scalar;
  private b2: Scalar;
  private accB1: Scalar;
  private accB2: Scalar;
  private one: Scalar;

  private accumulatedFirstMoment: NamedVariableMap = {};
  private accumulatedSecondMoment: NamedVariableMap = {};

  constructor(
      protected learningRate: number, private beta1: number,
      private beta2: number, specifiedVariableList?: Node[]) {
    super(learningRate, specifiedVariableList);
    this.c = keep(scalar(-learningRate));
    this.eps = keep(scalar(1e-8));
    // b1, b2 keep initial value of beta* hyperparameters.
    this.b1 = keep(scalar(this.beta1));
    this.b2 = keep(scalar(this.beta2));
    // accB* will be updated by batch.
    this.accB1 = keep(scalar(this.beta1));
    this.accB2 = keep(scalar(this.beta2));
    this.one = keep(scalar(1));
  }

  applyGradients(variableGradients: NamedVariableMap) {
    for (const variableName in variableGradients) {
      const value = ENV.engine.registeredVariables[variableName];
      if (this.accumulatedFirstMoment[variableName] == null) {
        const trainable = false;
        this.accumulatedFirstMoment[variableName] =
            variable(zerosLike(value), trainable);
      }
      if (this.accumulatedSecondMoment[variableName] == null) {
        const trainable = false;
        this.accumulatedSecondMoment[variableName] =
            variable(zerosLike(value), trainable);
      }

      const gradient = variableGradients[variableName];
      const firstMoment = this.accumulatedFirstMoment[variableName];
      const secondMoment = this.accumulatedSecondMoment[variableName];

      tidy(() => {
        const newFirstMoment =
            this.b1.mul(firstMoment).add(this.one.sub(this.b1).mul(gradient));
        const newSecondMoment =
            this.b2.mul(secondMoment)
                .add(this.one.sub(this.b2).mul(gradient.square()));

        const biasCorrectedFirstMoment =
            newFirstMoment.div(this.one.sub(this.accB1));
        const biasCorrectedSecondMoment =
            newSecondMoment.div(this.one.sub(this.accB2));

        this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
        this.accumulatedSecondMoment[variableName].assign(newSecondMoment);

        const newValue = this.c
                             .mul(biasCorrectedFirstMoment.div(this.eps.add(
                                 biasCorrectedSecondMoment.sqrt())))
                             .add(value);
        value.assign(newValue);
      });
    }

    this.disposeAndUpdateBetas();
  }

  disposeAndUpdateBetas() {
    // Make sure to dispose old value objects.
    const oldAccB1 = this.accB1;
    const oldAccB2 = this.accB2;
    // accB* represents beta1 and beta2 to
    // the power t (the number of iteration).
    this.accB1 = keep(this.accB1.mul(this.b1));
    this.accB2 = keep(this.accB2.mul(this.b2));
    oldAccB1.dispose();
    oldAccB2.dispose();
  }

  beforeBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    super.beforeBatch(
        math, batchSize, runtime, activationArrayMap, gradientArrayMap);

    if (this.firstMomentGraph.size() === 0) {
      this.variableNodes.forEach(node => {
        this.firstMomentGraph.set(node.output, Tensor.zeros(node.output.shape));
      });
    }

    if (this.secondMomentGraph.size() === 0) {
      this.variableNodes.forEach(node => {
        this.secondMomentGraph.set(
            node.output, Tensor.zeros(node.output.shape));
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

        const oldFirstMoment = this.firstMomentGraph.get(node.output);
        const oldSecondMoment = this.secondMomentGraph.get(node.output);

        const newFirstMoment = math.scaledArrayAdd(
            this.b1, oldFirstMoment, this.one.sub(this.b1), gradient);
        const newSecondMoment = math.scaledArrayAdd(
            this.b2, oldSecondMoment, this.one.sub(this.b2), gradient.square());

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

        this.firstMomentGraph.set(node.output, keep(newFirstMoment));
        this.secondMomentGraph.set(node.output, keep(newSecondMoment));

        oldVariable.dispose();
        gradient.dispose();
        oldFirstMoment.dispose();
        oldSecondMoment.dispose();
      });

      this.disposeAndUpdateBetas();
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  dispose() {
    super.dispose();
    this.c.dispose();
    this.eps.dispose();
    this.b1.dispose();
    this.b2.dispose();
    this.accB1.dispose();
    this.accB2.dispose();
    this.one.dispose();

    if (this.firstMomentGraph != null) {
      this.firstMomentGraph.dispose();
    }

    if (this.secondMomentGraph != null) {
      this.secondMomentGraph.dispose();
    }

    if (this.accumulatedFirstMoment != null) {
      Object.keys(this.accumulatedFirstMoment)
          .forEach(name => this.accumulatedFirstMoment[name].dispose());
    }

    if (this.accumulatedSecondMoment != null) {
      Object.keys(this.accumulatedSecondMoment)
          .forEach(name => this.accumulatedSecondMoment[name].dispose());
    }
  }

  // Average of gradient
  private firstMomentGraph = new TensorArrayMap();
  // Average of squared gradient
  private secondMomentGraph = new TensorArrayMap();
}
