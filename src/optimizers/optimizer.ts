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

import {dispose, tidy} from '../globals';
import {variableGrads} from '../gradients';
import {Serializable} from '../serialization';
import {scalar} from '../ops/ops';
import {Scalar, Variable} from '../tensor';
import {NamedTensor, NamedTensorMap} from '../tensor_types';

/** @doc {heading: 'Training', subheading: 'Classes', namespace: 'train'} */
export abstract class Optimizer extends Serializable {

  protected iterations_: Variable;

  /**
   * Executes `f()` and minimizes the scalar output of `f()` by computing
   * gradients of y with respect to the list of trainable variables provided by
   * `varList`. If no list is provided, it defaults to all trainable variables.
   *
   * @param f The function to execute and whose output to minimize.
   * @param returnCost Whether to return the scalar cost value produced by
   * executing `f()`.
   * @param varList An optional list of variables to update. If specified, only
   * the trainable variables in varList will be updated by minimize. Defaults to
   * all trainable variables.
   */
  /** @doc {heading: 'Training', subheading: 'Optimizers'} */
  minimize(f: () => Scalar, returnCost = false, varList?: Variable[]): Scalar
      |null {
    const {value, grads} = this.computeGradients(f, varList);

    if (varList != null) {
      const gradArray: NamedTensor[] =
          varList.map(v => ({name: v.name, tensor: grads[v.name]}));
      this.applyGradients(gradArray);
    } else {
      this.applyGradients(grads);
    }

    // Keep track of list of variables for saving and loading.
    // if (this.varList != null) {  // TODO(cais): Clean up.
    //   this.varList = varList;
    // }

    // Dispose gradients.
    const varNames = Object.keys(grads);
    varNames.forEach(varName => grads[varName].dispose());

    if (returnCost) {
      return value as Scalar;
    } else {
      value.dispose();
      return null;
    }
  }

  get iterations(): Variable {
    if (this.iterations_ == null) {
      const trainable = false;
      // TODO(cais): Use 'int64' when available.
      this.iterations_ = scalar(0, 'int32').variable(trainable);
    }
    return this.iterations_;
  }

  protected incrementIterations() {
    tidy(() => this.iterations.assign(this.iterations.add(scalar(1, 'int32'))));
  }

  /**
   * Executes f() and computes the gradient of the scalar output of f() with
   * respect to the list of trainable variables provided by `varList`. If no
   * list is provided, it defaults to all trainable variables.
   *
   * @param f The function to execute and whose output to use for computing
   * gradients with respect to variables.
   * @param varList An optional list of variables to compute gradients with
   * respect to. If specified, only the trainable variables in varList will have
   * gradients computed with respect to. Defaults to all trainable variables.
   */
  computeGradients(f: () => Scalar, varList?: Variable[]):
      {value: Scalar, grads: NamedTensorMap} {
    return variableGrads(f, varList);
  }

  /**
   * Updates variables by using the computed gradients.
   *
   * @param variableGradients A mapping of variable name to its gradient value.
   */
  abstract applyGradients(variableGradients: NamedTensorMap|
                          NamedTensor[]): void;

  /**
   * Dispose the variables (if any) owned by this optimizer instance.
   */
  dispose(): void {
    if (this.iterations_ != null) {
      dispose(this.iterations_);
    }
  }

  getWeights(): NamedTensor[] {
    const weights: NamedTensor[] = [];
    if (this.iterations_ != null) {
      weights.push({
        name: 'iter',  // Named for Python compatibility.
        tensor: this.iterations_
      });
    }
    return weights;
  }

  setWeights(weightValues: NamedTensor[]): void {
    throw new Error(
        `setWeights() is not implemented for this optimizer class ` +
        `${this.getClassName()}`);
  }

  /**
   * Take the first element of the weight values and set it
   * as the iterations counter variable of this instance of optimizer.
   *
   * @param weightValues
   * @returns Weight values with the first element consumed and excluded.
   */
  protected setIterations(weightValues: NamedTensor[]): NamedTensor[] {
    const trainable = false;
    this.iterations_ = weightValues[0].tensor.variable(trainable);
    return weightValues.slice(1);
  }
}

Object.defineProperty(Optimizer, Symbol.hasInstance, {
  value: (instance: Optimizer) => {
    return instance.minimize != null && instance.computeGradients != null &&
        instance.applyGradients != null;
  }
});
