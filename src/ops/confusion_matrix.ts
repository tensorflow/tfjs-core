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

import {tidy} from '../globals';
import {Tensor1D, Tensor2D} from '../tensor';
import * as util from '../util';
import { oneHot } from './array_ops';

/**
 * Calcualte the confusion matrix.
 *
 * @param {tf.Tensor} labels The target labels, assumed to be 0-based integers
 *   for the categories. The shape is `[numExamples]`, where
 *   `numExamples` is the number of examples included.
 * @param {tf.Tensor} predictions The predicted probabilities, assumed to be
 *   0-based integers for the categories. Must have the same shape as `labels`.
 * @param {number} numClasses Number of all classes, as an integer.
 *   Its value must be larger than the largest element in `labels` and
 *   `predictions`.
 * @return {tf.Tensor} The confusion matrix as a 2D tf.Tensor. The value at row
 *   `r` and column `c` istf. the number of times examples of actual class `r`
 *   were predicted as class `c`.
 */
export function confusionMatrix(
    labels: Tensor1D, predictions: Tensor1D, numClasses: number): Tensor2D {
  util.assert(
      numClasses == null || numClasses > 0 && Number.isInteger(numClasses),
      `If provided, numClasses must be a positive integer, ` +
          `but got ${numClasses}`);
  util.assert(
      labels.rank === 1,
      `Expected the rank of labels to be 1, but got ${labels.rank}`);
  util.assert(
      predictions.rank === 1,
      `Expected the rank of predictions to be 1, ` +
          `but got ${predictions.rank}`);
  util.assert(
      labels.shape[0] === predictions.shape[0],
      `Mismatch in the number of examples: ` +
          `${labels.shape[0]} vs. ${predictions.shape[0]}`);
  util.assert(
    numClasses > 0 && Number.isInteger(numClasses),
    `numClasses is required to be a positive integer, but got ${numClasses}`);
  // TODO(cais): In the future, if oneHot supports tensors inputs for
  //   `numClasses`, `confusionMatrix` can make `numClasses` optional.

  return tidy(() => {
    const oneHotLabels = oneHot(labels, numClasses);
    const oneHotPredictions = oneHot(predictions, numClasses);
    return oneHotLabels.transpose().matMul(oneHotPredictions);
  });
}