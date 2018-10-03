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
import {Tensor} from '../tensor';

/**
 * Validate gather nd inputs.
 *
 * @param tensor The tensor contains the source values.
 * @param indices The tensor contains the indices to slice the source.
 *
 * @returns [resultShape, numUpdates, sliceSize]
 */
export function prepareAndValidateGatherNDInputs(
    tensor: Tensor, indices: Tensor): [number[], number, number] {
  if (tensor.shape.length < 1) {
    throw new Error('tensor can not be a scalar.');
  }
  if (indices.shape.length < 1) {
    throw new Error('indices can not be a scalar.');
  }
  if (indices.shape[indices.shape.length - 1] > tensor.shape.length) {
    throw new Error(
        'index innermost dimension length must be <= tensor rank; saw: ' +
        `${indices.shape[indices.shape.length - 1]} vs. ${
            tensor.shape.length}`);
  }

  const indicesShape = indices.shape;
  const indicesNd = indicesShape[indicesShape.length - 1];

  // The result shape is
  //   indices.shape[:-1] + params.shape[indices.shape[-1]:]
  let nResult = 1;
  for (let i = 0; i < indicesShape.length - 1; ++i) {
    nResult *= indicesShape[i];
  }

  const paramsShape = tensor.shape;
  const totalNd = paramsShape.length;

  const resultShape = indicesShape.slice();
  resultShape.pop();

  let sliceSize = 1;
  for (let i = indicesNd; i < totalNd; ++i) {
    sliceSize *= paramsShape[i];
    resultShape.push(paramsShape[i]);
  }

  return [resultShape, nResult, sliceSize];
}
