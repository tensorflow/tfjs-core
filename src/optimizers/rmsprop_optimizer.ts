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
import {Variable} from '../tensor';
import {NamedTensor, NamedTensorMap} from '../tensor_types';

import {Optimizer} from './optimizer';

/** @doclink Optimizer */
export class RMSPropOptimizer extends Optimizer {
  /** @nocollapse */
  static className = 'RMSPropOptimizer';
  private centered: boolean;

  private accumulatedMeanSquares: Variable[] = [];
  private accumulatedMeanGrads: Variable[] = [];
  private accumulatedMoments: Variable[] = [];

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
        this.accumulatedMeanSquares[i] =
            tidy(() => zerosLike(value).variable(trainable));
      }
      if (this.accumulatedMeanGrads[i] == null && this.centered) {
        this.accumulatedMeanGrads[i] =
            tidy(() => zerosLike(value).variable(trainable));
      }
      if (this.accumulatedMoments[i] == null) {
        this.accumulatedMoments[i] =
            tidy(() => zerosLike(value).variable(trainable));
      }

      const accumulatedMeanSquare = this.accumulatedMeanSquares[i];
      const accumulatedMeanGrad = this.accumulatedMeanGrads[i];
      const accumulatedMoments = this.accumulatedMoments[i];
      const gradient = Array.isArray(variableGradients) ?
          variableGradients[i].tensor : variableGradients[name];

      tidy(() => {
        const newAccumulatedMeanSquare =
            accumulatedMeanSquare.mul(this.decay)
                .add(gradient.square().mul(1 - this.decay));

        if (this.centered) {
          // Centered gradient
          const newAccumulatedMeanGrad = accumulatedMeanGrad.mul(this.decay)
                                             .add(gradient.mul(1 - this.decay));

          const newAccumulatedMoments =
              accumulatedMoments.mul(this.momentum)
                  .add(gradient.mul(this.learningRate)
                           .div(newAccumulatedMeanSquare
                                    .sub(newAccumulatedMeanGrad.square().add(
                                        this.epsilon))
                                    .sqrt()));

          this.accumulatedMeanSquares[i].assign(newAccumulatedMeanSquare);
          this.accumulatedMeanGrads[i].assign(newAccumulatedMeanGrad);
          this.accumulatedMoments[i].assign(newAccumulatedMoments);

          const newValue = value.sub(newAccumulatedMoments);
          value.assign(newValue);
        } else {
          // Plain gradient
          const newAccumulatedMeanSquare =
              accumulatedMeanSquare.mul(this.decay)
                  .add(gradient.square().mul(1 - this.decay));

          const newAccumulatedMoments =
              accumulatedMoments.mul(this.momentum)
                  .add(gradient.mul(this.learningRate)
                           .div(newAccumulatedMeanSquare.add(this.epsilon)
                                    .sqrt()));

          this.accumulatedMeanSquares[i].assign(newAccumulatedMeanSquare);
          this.accumulatedMoments[i].assign(newAccumulatedMoments);

          const newValue = value.sub(newAccumulatedMoments);
          value.assign(newValue);
        }
      });
    }
  }

  dispose(): void {
    if (this.accumulatedMeanSquares != null) {
      dispose(this.accumulatedMeanSquares);
    }
    if (this.accumulatedMeanGrads != null && this.centered) {
      dispose(this.accumulatedMeanGrads);
    }
    if (this.accumulatedMoments != null) {
      dispose(this.accumulatedMoments);
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
