/**
 * @license
 * Copyright 2017 Principal Academy Inc All Rights Reserved.
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

import {NDArrayMath} from '../../math/math';
import {NDArray, Scalar} from '../../math/ndarray';
import {Node} from '../graph';
import {SessionRuntime} from '../session';
import {SummedTensorArrayMap, TensorArrayMap} from '../tensor_array_map';

import {MomentumOptimizer} from './momentum_optimizer';

export class PowerSignOptimizer extends MomentumOptimizer {

  constructor(
      protected learningRate: number, protected momentum: number,
      specifiedVariableList?: Node[], signWeight?: number,
      internalDecay?: string) {
    super(learningRate, momentum, specifiedVariableList);
    this.alpha = Scalar.new(1|signWeight);
    this.decay = "none";
  }

  afterBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    math.scope((keep) => {
      this.variableNodes.forEach(node => {
        const oldVariable = activationArrayMap.get(node.output);
        const gradient = this.variableGradients.get(node.output);
        const oldVelocity = this.variableVelocities.get(node.output);
        const velocity =
            math.scaledArrayAdd(this.m, oldVelocity, this.one, gradient);
        const signProduct = math.multiply(math.sign(gradient),
                                          math.sign(velocity));
        let currentScale = NDArray.zeros(signProduct.shape);
        if( this.decay === "none" ) {
          currentScale = math.exp(math.multiply(signProduct, this.alpha));
        }
        const gradientRescaled = math.multiply(currentScale, gradient);
        const variable =
            math.scaledArrayAdd(this.c, gradientRescaled,
                                this.one, oldVariable);
        this.variableVelocities.set(node.output, keep(velocity));
        activationArrayMap.set(node.output, keep(variable));
        node.data = variable;

        oldVariable.dispose();
        oldVelocity.dispose();
        gradientRescaled.dispose();
        currentScale.dispose();
        signProduct.dispose();
      });
    });

    this.variableGradients.dispose();
    this.variableGradients = new TensorArrayMap();
  }

  dispose() {
    super.dispose();
    this.alpha.dispose();
  }

  private alpha: Scalar;
  private decay: string;

}
