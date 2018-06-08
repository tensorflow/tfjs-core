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

import {doc} from '../doc';
import {Tensor} from '../tensor';
import * as util from '../util';

import {operation} from './operation';

export class SigmoidCrossEntropyOps {
  /**
   * Computes sigmoid cross entropy given logits.
   *
   * Implementation:
   *
   * @param labels A Tensor of the same type and shape as logits.
   * @param logits A Tensor of type float32 or float64.
   */
  @doc({heading: 'Operations', subheading: 'Cross Entropy'})
  @operation
  static sigmoidCrossEntropyWithLogits<T extends Tensor, O extends Tensor>(
      labels: T, logits: T): O {
    util.assertArgumentsAreTensors(
        {labels, logits}, 'sigmoidCrossEntropyWithLogits');
    util.assertShapesMatch(
        labels.shape, logits.shape, 'Error in sigmoidCrossEntropyWithLogits: ');

    const maxOutput = logits.relu();
    const outputXTarget = logits.mul(labels);
    const sigmoidOutput = logits.abs().neg().exp().log1p();

    return maxOutput.sub(outputXTarget).add(sigmoidOutput);
  }
}
