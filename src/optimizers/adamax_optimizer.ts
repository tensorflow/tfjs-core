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

export class AdamaxOptimizer extends Optimizer {
  private c: Scalar;
  private eps: Scalar;
  private accB1: Scalar;
  private b1: Scalar;
  private b2: Scalar;
  private one: Scalar;

  private accumulatedFirstMoment: NamedVariableMap = {};
  private accumulatedWeightedInfNorm: NamedVariableMap = {};

  constructor(
      protected learningRate: number, private beta1: number,
      private beta2: number,
      /** @deprecated */ specifiedVariableList?: Node[], epsilon = 1e-8) {
    super(learningRate, specifiedVariableList);
    this.c = keep(scalar(-learningRate));
    this.eps = keep(scalar(epsilon));
    // b1, b2 keep initial value of beta* hyperparameters.
    this.b1 = keep(scalar(this.beta1));
    this.b2 = keep(scalar(this.beta2));

    this.accB1 = keep(scalar(this.beta1));
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
      if (this.accumulatedWeightedInfNorm[variableName] == null) {
        const trainable = false;
        this.accumulatedWeightedInfNorm[variableName] =
            variable(zerosLike(value), trainable);
      }

      const gradient = variableGradients[variableName];
      const firstMoment = this.accumulatedFirstMoment[variableName];
      const weightedInfNorm = this.accumulatedWeightedInfNorm[variableName];

      tidy(() => {
        const newFirstMoment =
            this.b1.mul(firstMoment).add(this.one.sub(this.b1).mul(gradient));

        const ut0 = this.b2.mul(weightedInfNorm);
        const ut1 = gradient.abs();

        const newWeightedInfNorm = ut0.maximum(ut1);

        this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
        this.accumulatedWeightedInfNorm[variableName].assign(
            newWeightedInfNorm);

        const newValue =
            this.c.divStrict(this.one.sub(this.accB1))
                .mul(newFirstMoment.div(this.eps.add(newWeightedInfNorm)))
                .add(value);
        value.assign(newValue);
      });
    }

    this._disposeAndUpdateBeta();
  }

  _disposeAndUpdateBeta() {
    // Make sure to dispose old values.
    const oldAccB1 = this.accB1;
    this.accB1 = keep(this.accB1.mul(this.b1));
    oldAccB1.dispose();
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

    if (this.weightedInfNormGraph.size() === 0) {
      this.variableNodes.forEach(node => {
        this.weightedInfNormGraph.set(
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
        const oldWeightedInfNorm = this.weightedInfNormGraph.get(node.output);

        const newFirstMoment = math.scaledArrayAdd(
            this.b1, oldFirstMoment, this.one.sub(this.b1), gradient);

        const ut0 = this.b2.mul(oldWeightedInfNorm);
        const ut1 = gradient.abs();

        const newWeightedInfNorm = ut0.maximum(ut1);

        const variable = math.scaledArrayAdd(
            this.one, oldVariable,
            this.cGraph.divStrict(this.one.sub(this.accB1)),
            newFirstMoment.div(this.eps.add(newWeightedInfNorm)));

        activationArrayMap.set(node.output, keep(variable));
        node.data = variable;

        this.firstMomentGraph.set(node.output, keep(newFirstMoment));
        this.weightedInfNormGraph.set(node.output, keep(newWeightedInfNorm));

        oldVariable.dispose();
        gradient.dispose();
        oldFirstMoment.dispose();
        oldWeightedInfNorm.dispose();
      });

      this._disposeAndUpdateBeta();
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  dispose() {
    super.dispose();
    this.c.dispose();
    this.eps.dispose();
    this.accB1.dispose();
    this.b1.dispose();
    this.b2.dispose();
    this.one.dispose();

    if (this.firstMomentGraph != null) {
      this.firstMomentGraph.dispose();
    }

    if (this.weightedInfNormGraph != null) {
      this.weightedInfNormGraph.dispose();
    }

    if (this.accumulatedFirstMoment != null) {
      Object.keys(this.accumulatedFirstMoment)
          .forEach(name => this.accumulatedFirstMoment[name].dispose());
    }

    if (this.accumulatedWeightedInfNorm != null) {
      Object.keys(this.accumulatedWeightedInfNorm)
          .forEach(name => this.accumulatedWeightedInfNorm[name].dispose());
    }
  }

  // Average of 1st gradient
  private firstMomentGraph = new TensorArrayMap();
  // Average of exponentially weighed infinity norm
  private weightedInfNormGraph = new TensorArrayMap();
}
