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
import {dispose, tidy} from '../globals';
import {zerosLike} from '../ops/ops';
import {ConfigDict, registerClass, Serializable, SerializableConstructor} from '../serialization';
import {NamedTensor, NamedTensorMap, NamedVariable} from '../tensor_types';

import {Optimizer} from './optimizer';

/** @doclink Optimizer */
export class RMSPropOptimizer extends Optimizer {
  /** @nocollapse */
  static className = 'RMSPropOptimizer';
  private centered: boolean;

  private accumulatedMeanSquares: NamedVariable[] = [];
  private accumulatedMoments: NamedVariable[] = [];
  private accumulatedMeanGrads: NamedVariable[] = [];

  constructor(
      protected learningRate: number, protected decay = 0.9,
      protected momentum = 0.0, protected epsilon: number = null,
      centered = false) {
    super();

    this.centered = centered;

    if (epsilon == null) {
      this.epsilon = ENGINE.backend.epsilon();
    }
  }

  applyGradients(variableGradients: NamedTensorMap|NamedTensor[]) {
    const variableNames = Array.isArray(variableGradients) ?
        variableGradients.map(item => item.name) :
        Object.keys(variableGradients);

    for (let i = 0; i < variableNames.length; ++i) {
      const name = variableNames[i];
      const value = ENGINE.registeredVariables[name];

      const trainable = false;
      if (this.accumulatedMeanSquares[i] == null) {
        this.accumulatedMeanSquares[i] = {
          name: `${name}/rms`,  // Name matters for Python compatibility.
          variable: tidy(() => zerosLike(value).variable(trainable))
        };
      }
      if (this.accumulatedMoments[i] == null) {
        this.accumulatedMoments[i] = {
          name: `${name}/momentum`,  // Name matters for Python compatibility.
          variable: tidy(() => zerosLike(value).variable(trainable))
        };
      }
      if (this.accumulatedMeanGrads[i] == null && this.centered) {
        this.accumulatedMeanGrads[i] = {
          name: `${name}/mg`,  // Name matters for Python compatibility.
          variable: tidy(() => zerosLike(value).variable(trainable))
        };
      }

      const accumulatedMeanSquare = this.accumulatedMeanSquares[i];
      const accumulatedMeanGrad = this.accumulatedMeanGrads[i];
      const accumulatedMoments = this.accumulatedMoments[i];
      const gradient = Array.isArray(variableGradients) ?
          variableGradients[i].tensor : variableGradients[name];

      tidy(() => {
        const newAccumulatedMeanSquare =
            accumulatedMeanSquare.variable.mul(this.decay)
                .add(gradient.square().mul(1 - this.decay));

        if (this.centered) {
          // Centered gradient
          const newAccumulatedMeanGrad = accumulatedMeanGrad.variable
              .mul(this.decay).add(gradient.mul(1 - this.decay));

          const newAccumulatedMoments = accumulatedMoments.variable
              .mul(this.momentum)
                  .add(gradient.mul(this.learningRate)
                           .div(newAccumulatedMeanSquare
                                    .sub(newAccumulatedMeanGrad.square().add(
                                        this.epsilon))
                                    .sqrt()));

          this.accumulatedMeanSquares[i].variable.assign(
              newAccumulatedMeanSquare);
          this.accumulatedMeanGrads[i].variable.assign(newAccumulatedMeanGrad);
          this.accumulatedMoments[i].variable.assign(newAccumulatedMoments);

          const newValue = value.sub(newAccumulatedMoments);
          value.assign(newValue);
        } else {
          // Plain gradient
          const newAccumulatedMeanSquare =
              accumulatedMeanSquare.variable.mul(this.decay)
                  .add(gradient.square().mul(1 - this.decay));

          const newAccumulatedMoments =
              accumulatedMoments.variable.mul(this.momentum)
                  .add(gradient.mul(this.learningRate)
                           .div(newAccumulatedMeanSquare.add(this.epsilon)
                                    .sqrt()));

          this.accumulatedMeanSquares[i].variable.assign(
              newAccumulatedMeanSquare);
          this.accumulatedMoments[i].variable.assign(newAccumulatedMoments);

          const newValue = value.sub(newAccumulatedMoments);
          value.assign(newValue);
        }
      });
    }
  }

  dispose(): void {
    if (this.accumulatedMeanSquares != null) {
      dispose(this.accumulatedMeanSquares.map(v => v.variable));
    }
    if (this.accumulatedMeanGrads != null && this.centered) {
      dispose(this.accumulatedMeanGrads.map(v => v.variable));
    }
    if (this.accumulatedMoments != null) {
      dispose(this.accumulatedMoments.map(v => v.variable));
    }
  }

  getWeights(): NamedTensor[] {
    // Order matters for Python compatibility.
    const namedVariables: NamedVariable[] = [
        ...this.accumulatedMeanSquares,  ...this.accumulatedMoments];
    if (this.centered) {
      namedVariables.push(...this.accumulatedMeanGrads);
    }
    return namedVariables.map(v => ({name: v.name, tensor: v.variable}));
  }

  setWeights(weightValues: NamedTensor[]): void {
    const variableCount =
        this.centered ? weightValues.length / 3 : weightValues.length / 2;
    const trainable = false;
    this.accumulatedMeanSquares = weightValues.slice(0, variableCount).map(
        v => ({name: v.name, variable: v.tensor.variable(trainable)}));
    this.accumulatedMoments =
        weightValues.slice(variableCount, variableCount * 2).map(
            v => ({name: v.name, variable: v.tensor.variable(trainable)}));
    if (this.centered) {
      this.accumulatedMeanGrads =
          weightValues.slice(variableCount * 2, variableCount * 3).map(
              v => ({name: v.name, variable: v.tensor.variable(trainable)}));
    }
  }

  getConfig(): ConfigDict {
    return {
      'learningRate': this.learningRate,
      'decay': this.decay,
      'momentum': this.momentum,
      'epsilon': this.epsilon,
      'centered': this.centered
    };
  }

  /** @nocollapse */
  static fromConfig<T extends Serializable>(
      cls: SerializableConstructor<T>, config: ConfigDict): T {
    return new cls(
        config['learningRate'], config['decay'], config['momentum'],
        config['epsilon'], config['centered']);
  }
}
registerClass(RMSPropOptimizer);
