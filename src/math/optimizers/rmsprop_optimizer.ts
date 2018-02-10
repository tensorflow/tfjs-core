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

import {ENV} from '../../environment';
import {keep, tidy} from '../../globals';
import {Node} from '../../graph/graph';
import {SessionRuntime} from '../../graph/session';
// tslint:disable-next-line:max-line-length
import {SummedTensorArrayMap, TensorArrayMap} from '../../graph/tensor_array_map';
import {NDArrayMath} from '../../math/math';
import {scalar, zerosLike} from '../../math/ops';
import {Optimizer} from '../../math/optimizers/optimizer';
import {Scalar, Tensor} from '../../math/tensor';
import {NamedVariableMap} from '../../math/types';
import {variable} from '../tensor';

export class RMSPropOptimizer extends Optimizer {
  private c: Scalar;
  private epsilon: Scalar;
  private rho: Scalar;
  private m: Scalar;
  private oneMinusRho: Scalar;

  private accumulatedMeanSquares: NamedVariableMap = {};
  private accumulatedMoments: NamedVariableMap = {};

  constructor(
      protected learningRate: number, rho = 0.9, momentum = 0.0,
      /** @deprecated only for graph */
      specifiedVariableList?: Node[], epsilon = 1e-8) {
    super(-learningRate, specifiedVariableList);

    this.c = keep(scalar(learningRate));
    this.epsilon = keep(scalar(epsilon));
    this.rho = keep(scalar(rho));
    this.m = keep(scalar(momentum));
    this.oneMinusRho = keep(scalar(1 - rho));
  }

  applyGradients(variableGradients: NamedVariableMap) {
    for (const variableName in variableGradients) {
      const value = ENV.engine.registeredVariables[variableName];
      if (this.accumulatedMeanSquares[variableName] == null) {
        const trainable = false;
        this.accumulatedMeanSquares[variableName] =
            variable(zerosLike(value), trainable);
      }
      if (this.accumulatedMoments[variableName] == null) {
        const trainable = false;
        this.accumulatedMoments[variableName] =
            variable(zerosLike(value), trainable);
      }

      const accumulatedMeanSquare = this.accumulatedMeanSquares[variableName];
      const accumulatedMoments = this.accumulatedMoments[variableName];
      const gradient = variableGradients[variableName];

      tidy(() => {
        const newAccumulatedMeanSquare =
            this.rho.mul(accumulatedMeanSquare)
                .add(this.oneMinusRho.mul(gradient.square()));

        const newAccumulatedMoments =
            this.m.mul(accumulatedMoments)
                .add(this.c.mul(gradient).div(
                    newAccumulatedMeanSquare.add(this.epsilon).sqrt()));

        this.accumulatedMeanSquares[variableName].assign(
            newAccumulatedMeanSquare);
        this.accumulatedMoments[variableName].assign(newAccumulatedMoments);

        const newValue = value.sub(newAccumulatedMoments);
        value.assign(newValue);
      });
    }
  }

  // Graph
  /** @deprecated only for graph */
  beforeBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    super.beforeBatch(
        math, batchSize, runtime, activationArrayMap, gradientArrayMap);
    if (this.accumulatedMeanSquaredGraph.size() === 0) {
      this.variableNodes.forEach(node => {
        this.accumulatedMeanSquaredGraph.set(
            node.output, Tensor.zeros(node.output.shape));
        this.accumulatedMomentGraph.set(
            node.output, Tensor.zeros(node.output.shape));
      });
    }
  }

  /** @deprecated only for graph */
  afterBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    tidy(() => {
      this.variableNodes.forEach(node => {
        const oldVariable = activationArrayMap.get(node.output);
        const gradient = this.variableGradients.get(node.output);
        const oldMeanSquare = this.accumulatedMeanSquaredGraph.get(node.output);
        const oldMom = this.accumulatedMomentGraph.get(node.output);

        // mean_square = rho * mean_square{t-1} +
        //                         (1-rho) * gradient.square()
        // mom = momentum * mom{t - 1} +
        //          learning_rate * gradient / sqrt(mean_square + epsilon)
        // variable = variable - mom
        const meanSquare = math.scaledArrayAdd(
            this.rho, oldMeanSquare, this.oneMinusRho, gradient.square());
        const mom = math.scaledArrayAdd(
            this.cGraph, gradient.div(meanSquare.add(this.epsilon).sqrt()),
            this.m, oldMom);
        const variable = oldVariable.sub(mom);
        this.accumulatedMeanSquaredGraph.set(node.output, keep(meanSquare));
        this.accumulatedMomentGraph.set(node.output, keep(mom));
        activationArrayMap.set(node.output, keep(variable));

        node.data = variable;

        oldVariable.dispose();
        oldMeanSquare.dispose();
      });
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  dispose() {
    super.dispose();
    this.c.dispose();
    this.epsilon.dispose();
    this.rho.dispose();
    this.m.dispose();
    this.oneMinusRho.dispose();
    if (this.accumulatedMeanSquaredGraph != null) {
      this.accumulatedMeanSquaredGraph.dispose();
    }
    if (this.accumulatedMomentGraph != null) {
      this.accumulatedMomentGraph.dispose();
    }
    if (this.accumulatedMeanSquares != null) {
      Object.keys(this.accumulatedMeanSquares)
          .forEach(name => this.accumulatedMeanSquares[name].dispose());
    }
    if (this.accumulatedMoments != null) {
      Object.keys(this.accumulatedMoments)
          .forEach(name => this.accumulatedMoments[name].dispose());
    }
  }

  private accumulatedMeanSquaredGraph = new TensorArrayMap();
  private accumulatedMomentGraph = new TensorArrayMap();
}
