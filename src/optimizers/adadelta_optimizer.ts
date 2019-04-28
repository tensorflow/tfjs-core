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
import {NamedVariable, NamedVariableMap, NamedTensor} from '../tensor_types';
import {Optimizer} from './optimizer';

/** @doclink Optimizer */
export class AdadeltaOptimizer extends Optimizer {
  /** @nocollapse */
  static className = 'AdadeltaOptimizer';
  private accumulatedGrads: NamedVariable[] = [];
  private accumulatedUpdates: NamedVariable[] = [];

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

    for (let i = 0; i < variableNames.length; ++i) {
      const name = variableNames[i];
      const value = ENGINE.registeredVariables[name];
      const trainable = false;
      if (this.accumulatedGrads[i] == null) {
        this.accumulatedGrads[i] = {
          name: `${name}/accum_grad`,  // Name matters for Python compatibility.
          variable: tidy(() => zerosLike(value).variable(trainable))
        };
      }
      if (this.accumulatedUpdates[i] == null) {
        this.accumulatedUpdates[i] = {
          name: `${name}/accum_var`,  // Name matters for Python compatibility.
          variable: tidy(() => zerosLike(value).variable(trainable))
        };
      }

      const gradient = Array.isArray(variableGradients) ?
          variableGradients[i].tensor : variableGradients[name];
      const accumulatedGrad = this.accumulatedGrads[i];
      const accumulatedUpdate = this.accumulatedUpdates[i];

      tidy(() => {
        const newAccumulatedGrad = accumulatedGrad.variable.mul(this.rho).add(
            gradient.square().mul(1 - this.rho));

        const updates =
            accumulatedUpdate.variable.add(this.epsilon)
                .sqrt()
                .div(accumulatedGrad.variable.add(this.epsilon).sqrt())
                .mul(gradient);

        const newAccumulatedUpdate =
            accumulatedUpdate.variable.mul(this.rho).add(
                updates.square().mul(1 - this.rho));

        this.accumulatedGrads[i].variable.assign(newAccumulatedGrad);
        this.accumulatedUpdates[i].variable.assign(newAccumulatedUpdate);

        const newValue = updates.mul(-this.learningRate).add(value);
        value.assign(newValue);
      });
    }
  }

  dispose(): void {
    if (this.accumulatedUpdates != null) {
      dispose([
          this.accumulatedGrads.map(v => v.variable),
          this.accumulatedUpdates.map(v => v.variable)]);
    }
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
