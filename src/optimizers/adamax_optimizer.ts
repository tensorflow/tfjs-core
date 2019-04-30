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
import {tidy} from '../globals';
import {div, scalar, sub, zerosLike} from '../ops/ops';
import {ConfigDict, registerClass, Serializable, SerializableConstructor} from '../serialization';
import {Variable} from '../tensor';
import {NamedTensor, NamedVariableMap} from '../tensor_types';
import {Optimizer} from './optimizer';

export class AdamaxOptimizer extends Optimizer {
  /** @nocollapse */
  static className = 'Adamax';  // Note: Name matters for Python compatbility.
  private accBeta1: Variable;
  private iteration: Variable;

  private accumulatedFirstMoment: Variable[] = [];
  private accumulatedWeightedInfNorm: Variable[] = [];

  constructor(
      protected learningRate: number, protected beta1: number,
      protected beta2: number, protected epsilon: number = null,
      protected decay = 0.0) {
    super();

    tidy(() => {
      this.iteration = scalar(0).variable();
      this.accBeta1 = scalar(beta1).variable();
    });

    if (epsilon == null) {
      this.epsilon = ENGINE.backend.epsilon();
    }
  }

  applyGradients(variableGradients: NamedVariableMap|NamedTensor[]) {
    const variableNames = Array.isArray(variableGradients) ?
        variableGradients.map(item => item.name) :
        Object.keys(variableGradients);

    tidy(() => {
      const oneMinusAccBeta1 = sub(1, this.accBeta1);
      const lr = div(-this.learningRate, this.iteration.mul(this.decay).add(1));

      variableNames.forEach((name, i) => {
        const value = ENGINE.registeredVariables[name];
        if (this.accumulatedFirstMoment[i] == null) {
          const trainable = false;
          this.accumulatedFirstMoment[i] =
              zerosLike(value).variable(trainable, `${name}/m`);
        }
        if (this.accumulatedWeightedInfNorm[name] == null) {
          const trainable = false;
          this.accumulatedWeightedInfNorm[i] =
              zerosLike(value).variable(trainable, `${name}/v`);
        }

        const gradient = Array.isArray(variableGradients) ?
            variableGradients[i].tensor : variableGradients[i];
        if (gradient == null) {
          return;
        }

        const firstMoment = this.accumulatedFirstMoment[i];
        const weightedInfNorm = this.accumulatedWeightedInfNorm[i];

        const newFirstMoment =
            firstMoment.mul(this.beta1).add(gradient.mul(1 - this.beta1));

        const ut0 = weightedInfNorm.mul(this.beta2);
        const ut1 = gradient.abs();

        const newWeightedInfNorm = ut0.maximum(ut1);

        this.accumulatedFirstMoment[i].assign(newFirstMoment);
        this.accumulatedWeightedInfNorm[i].assign(newWeightedInfNorm);

        const newValue =
            lr.div(oneMinusAccBeta1)
                .mul(newFirstMoment.div(newWeightedInfNorm.add(this.epsilon)))
                .add(value);

        value.assign(newValue);
      });

      this.iteration.assign(this.iteration.add(1));
      this.accBeta1.assign(this.accBeta1.mul(this.beta1));
    });
    this.incrementIterations();
  }

  dispose(): void {
    super.dispose();
    this.accBeta1.dispose();
    this.iteration.dispose();

    if (this.accumulatedFirstMoment != null) {
      Object.keys(this.accumulatedFirstMoment)
          .forEach(name => this.accumulatedFirstMoment[name].dispose());
    }

    if (this.accumulatedWeightedInfNorm != null) {
      Object.keys(this.accumulatedWeightedInfNorm)
          .forEach(name => this.accumulatedWeightedInfNorm[name].dispose());
    }
  }

  getWeights(): NamedTensor[] {
    // Order matters for Python compatibility.
    const variables: Variable[] = [
        ...this.accumulatedFirstMoment,  ...this.accumulatedWeightedInfNorm];
    return super.getWeights().concat(
        variables.map(v => ({name: v.name, tensor: v})));
  }

  setWeights(weightValues: NamedTensor[]): void {
    weightValues = super.setIterations(weightValues);
    const variableCount = weightValues.length / 2;
    const trainable = false;
    this.accumulatedFirstMoment = weightValues.slice(0, variableCount).map(
        v => v.tensor.variable(trainable));
    this.accumulatedWeightedInfNorm =
        weightValues.slice(variableCount, variableCount * 2).map(
            v =>v.tensor.variable(trainable));
  }

  getConfig(): ConfigDict {
    return {
      'learningRate': this.learningRate,
      'beta1': this.beta1,
      'beta2': this.beta2,
      'epsilon': this.epsilon,
      'decay': this.decay
    };
  }

  /** @nocollapse */
  static fromConfig<T extends Serializable>(
      cls: SerializableConstructor<T>, config: ConfigDict): T {
    return new cls(
        config['learningRate'], config['beta1'], config['beta2'],
        config['epsilon'], config['decay']);
  }
}
registerClass(AdamaxOptimizer);
