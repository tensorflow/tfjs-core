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

import {ENGINE} from '../engine';
import {tidy, dispose} from '../globals';
import {zerosLike} from '../ops/ops';
import {ConfigDict, registerClass, Serializable, SerializableConstructor} from '../serialization';
import {NamedVariableMap, NamedTensor} from '../tensor_types';
import {Optimizer} from './optimizer';
import {Variable} from '../tensor';

/** @doclink Optimizer */
export class AdadeltaOptimizer extends Optimizer {
  /** @nocollapse */
  static className = 'AdadeltaOptimizer';
  private accumulatedGrads: Variable[] = [];
  private accumulatedUpdates: Variable[] = [];

  constructor(
      protected learningRate: number, protected rho: number,
      protected epsilon: number = null) {
    super();

    if (epsilon == null) {
      this.epsilon = ENGINE.backend.epsilon();
    }
  }

  applyGradients(variableGradients: NamedVariableMap|NamedTensor[]) {
    const variableNames = Array.isArray(variableGradients) ?
        variableGradients.map(item => item.name) :
        Object.keys(variableGradients);

    variableNames.forEach((name, i) => {
      const value = ENGINE.registeredVariables[name];
      const trainable = false;
      if (this.accumulatedGrads[i] == null) {
        this.accumulatedGrads[i] = tidy(
            () => zerosLike(value).variable(trainable, `${name}/accum_grad`));

      }
      if (this.accumulatedUpdates[i] == null) {
        this.accumulatedUpdates[i] = tidy(
            () => zerosLike(value).variable(trainable, `${name}/accum_var`));
      }

      const gradient = Array.isArray(variableGradients) ?
          variableGradients[i].tensor : variableGradients[name];
      const accumulatedGrad = this.accumulatedGrads[i];
      const accumulatedUpdate = this.accumulatedUpdates[i];

      tidy(() => {
        const newAccumulatedGrad = accumulatedGrad.mul(this.rho).add(
            gradient.square().mul(1 - this.rho));

        const updates =
            accumulatedUpdate.add(this.epsilon)
                .sqrt()
                .div(accumulatedGrad.add(this.epsilon).sqrt())
                .mul(gradient);

        const newAccumulatedUpdate =
            accumulatedUpdate.mul(this.rho).add(
                updates.square().mul(1 - this.rho));

        this.accumulatedGrads[i].assign(newAccumulatedGrad);
        this.accumulatedUpdates[i].assign(newAccumulatedUpdate);

        const newValue = updates.mul(-this.learningRate).add(value);
        value.assign(newValue);
      });
    });
    this.incrementIterations();
  }

  dispose(): void {
    super.dispose();
    if (this.accumulatedUpdates != null) {
      dispose([this.accumulatedGrads, this.accumulatedUpdates]);
    }
  }

  getWeights(): NamedTensor[] {
    // Order matters for Python compatibility.
    const variables: Variable[] = [
        ...this.accumulatedGrads,  ...this.accumulatedUpdates];
    return super.getWeights().concat(
        variables.map(v => ({name: v.name, tensor: v})));
  }

  setWeights(weightValues: NamedTensor[]): void {
    weightValues = super.setIterations(weightValues);
    const variableCount = weightValues.length / 2;
    const trainable = false;
    this.accumulatedGrads = weightValues.slice(0, variableCount).map(
        v => v.tensor.variable(trainable));
    this.accumulatedUpdates =
        weightValues.slice(variableCount, variableCount * 2).map(
            v =>v.tensor.variable(trainable));
  }

  getConfig(): ConfigDict {
    return {
      'learningRate': this.learningRate,
      'rho': this.rho,
      'epsilon': this.epsilon
    };
  }

  /** @nocollapse */
  static fromConfig<T extends Serializable>(
      cls: SerializableConstructor<T>, config: ConfigDict): T {
    return new cls(config['learningRate'], config['rho'], config['epsilon']);
  }
}
registerClass(AdadeltaOptimizer);
