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

import {ENV} from '../../environment';
import {keep, tidy} from '../../globals';
import {Node} from '../../graph/graph';
import {SessionRuntime} from '../../graph/session';
// tslint:disable-next-line:max-line-length
import {SummedTensorArrayMap, TensorArrayMap} from '../../graph/tensor_array_map';
import {NDArrayMath} from '../../math/math';
import {SGDOptimizer} from '../../math/optimizers/sgd_optimizer';
import {Scalar, Tensor} from '../../math/tensor';
import {NamedTensorMap, NamedVariableMap} from '../../math/types';
import {doc} from '../decorators';
import {scalar, zerosLike} from '../ops';

/**
 * Optimizer that implements momentum gradient descent.
 *
 * Use `dl.train.momentum` to create a momentum optimizer.
 */
@doc({heading: 'Training', subheading: 'Optimizers', namespace: 'train'})
export class MomentumOptimizer extends SGDOptimizer {
  private momentum: Scalar;
  private velocities: NamedTensorMap;

  constructor(
      protected learningRate: number, momentum: number,
      specifiedVariableList?: Node[]) {
    super(learningRate, specifiedVariableList);
    this.momentum = scalar(momentum);
    this.velocities = {};
  }

  applyGradients(variableGradients: NamedVariableMap) {
    for (const variableName in variableGradients) {
      const variable = ENV.engine.registeredVariables[variableName];
      // Initialize velocities to 0.
      if (this.velocities[variableName] == null) {
        this.velocities[variableName] = keep(zerosLike(variable));
      }

      const velocity = this.velocities[variableName];
      const gradient = variableGradients[variableName];

      const newVariable = tidy(() => {
        const newVelocity = this.momentum.mul(velocity).add(gradient);
        velocity.dispose();
        this.velocities[variableName] = keep(newVelocity);

        return this.c.mul(newVelocity).add(variable);
      });

      variable.assign(newVariable);
    }
  }

  dispose() {
    super.dispose();
    this.momentum.dispose();
    if (this.variableVelocitiesGraph != null) {
      this.variableVelocitiesGraph.dispose();
    }
    if (this.velocities != null) {
      for (const variableName in this.velocities) {
        this.velocities[variableName].dispose();
      }
    }
  }

  /**
   * Sets the momentum of the optimizer.
   *
   * @param momentum
   */
  setMomentum(momentum: number) {
    this.momentum.dispose();
    this.momentum = scalar(momentum);
  }

  // Graph
  /** @deprecated only for graph */
  beforeBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    if (this.variableVelocitiesGraph == null) {
      this.variableVelocitiesGraph = new TensorArrayMap();
    }

    super.beforeBatch(
        math, batchSize, runtime, activationArrayMap, gradientArrayMap);

    if (this.variableVelocitiesGraph.size() === 0) {
      this.variableNodes.forEach(node => {
        this.variableVelocitiesGraph.set(
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
        const oldVelocity = this.variableVelocitiesGraph.get(node.output);

        const velocity =
            math.scaledArrayAdd(this.momentum, oldVelocity, this.one, gradient);
        const variable =
            math.scaledArrayAdd(this.cGraph, velocity, this.one, oldVariable);

        this.variableVelocitiesGraph.set(node.output, keep(velocity));
        activationArrayMap.set(node.output, keep(variable));
        node.data = variable;

        oldVariable.dispose();
        oldVelocity.dispose();
      });
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  private variableVelocitiesGraph: TensorArrayMap;
}
