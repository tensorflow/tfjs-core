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
import {Optimizer} from '../../math/optimizers/optimizer';
import {Scalar, Tensor} from '../../math/tensor';
import {NamedTensorMap, NamedVariableMap} from '../../math/types';
import {fill, scalar} from '../ops';

export class AdagradOptimizer extends Optimizer {
  private c: Scalar;
  private epsilon: Scalar;

  private accumulatedGrads: NamedTensorMap = {};

  constructor(
      protected learningRate: number, specifiedVariableList?: Node[],
      private initialAccumulatorValue = 0.1) {
    super(learningRate, specifiedVariableList);

    this.c = keep(scalar(-learningRate));
    this.epsilon = keep(scalar(1e-8));

    // Only used for graph.
    this.one = keep(scalar(1));
  }

  applyGradients(variableGradients: NamedVariableMap) {
    for (const variableName in variableGradients) {
      const variable = ENV.engine.registeredVariables[variableName];
      if (this.accumulatedGrads[variableName] == null) {
        this.accumulatedGrads[variableName] =
            keep(fill(variable.shape, this.initialAccumulatorValue));
      }

      const gradient = variableGradients[variableName];
      const accumulatedGrad = this.accumulatedGrads[variableName];

      const newVariable = tidy(() => {
        const newAccumulatedGrad = accumulatedGrad.add(gradient.square());

        accumulatedGrad.dispose();
        this.accumulatedGrads[variableName] = keep(newAccumulatedGrad);

        return this.c
            .mul(gradient.div(newAccumulatedGrad.add(this.epsilon).sqrt()))
            .add(variable);
      });

      variable.assign(keep(newVariable));
    }
  }

  /** @deprecated */
  beforeBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    super.beforeBatch(
        math, batchSize, runtime, activationArrayMap, gradientArrayMap);

    if (this.accumulatedSquaredGradients.size() === 0) {
      this.variableNodes.forEach(node => {
        this.accumulatedSquaredGradients.set(
            node.output, Tensor.zeros(node.output.shape));
      });
    }
  }

  /** @deprecated */
  afterBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    tidy(() => {
      this.variableNodes.forEach(node => {
        const oldVariable = activationArrayMap.get(node.output);
        const gradient = this.variableGradients.get(node.output);
        const oldCache = this.accumulatedSquaredGradients.get(node.output);

        const gradientSquare = math.multiply(gradient, gradient);
        const cache = math.add(oldCache, gradientSquare);
        const variable = math.scaledArrayAdd(
            this.cGraph,
            math.divide(gradient, math.add(math.sqrt(cache), this.epsilon)),
            this.one, oldVariable);
        this.accumulatedSquaredGradients.set(node.output, keep(cache));
        activationArrayMap.set(node.output, keep(variable));
        node.data = variable;
        oldVariable.dispose();
        oldCache.dispose();
      });
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  dispose() {
    super.dispose();
    this.epsilon.dispose();
    this.c.dispose();
    if (this.accumulatedSquaredGradients != null) {
      this.accumulatedSquaredGradients.dispose();
    }
    if (this.accumulatedGrads != null) {
      Object.keys(this.accumulatedGrads)
          .forEach(name => this.accumulatedGrads[name].dispose());
    }
  }

  private accumulatedSquaredGradients = new TensorArrayMap();
  private one: Scalar;
}
