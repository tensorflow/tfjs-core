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
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';
import {Rank, ShapeMap, TensorLike} from '../types';
import * as util from '../util';
import {op} from './operation';
import {whereImpl} from '../backends/where_impl';

/**
 * Apply boolean mask to tensor.
 *
 * ```js
 * const tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2], 'float32');
 * const mask = tf.tensor1d([1, 0, 1], 'bool');
 * const result = tf.booleanMask(tensor, mask);
 * result.print();
 * ```
 *
 * @param N-D tensor.
 * @param mask K-D boolean tensor, K <= N and K must be known statically.
 * @param axis A 0-D int Tensor representing the axis in tensor to mask from.
 *     By default, axis is 0 which will mask from the first dimension.
 *     Otherwise K + axis <= N.
 */
/** @doc {heading: 'Tensors', subheading: 'Slicing and Joining'} */
function booleanMask_<T extends Tensor, U extends Tensor>(
    tensor: T|TensorLike, mask: U|TensorLike, axis?: number): Tensor {
  const $tensor = convertToTensor(tensor, 'tensor', 'boolMask');
  const $mask = convertToTensor(mask, 'mask', 'boolMask');

  const axisFrom = axis === undefined ? 0 : axis;
  const maskDim = $mask.rank;
  const tensorShape = $tensor.shape;

  util.assert(
      maskDim > 0,
      () => 'mask cannot be scalar'
  );
  util.assertShapesMatch(
      tensorShape.slice(axisFrom, axisFrom + maskDim), $mask.shape,
      'mask\'s shape must match the first K dimensions of tensor\'s shape,'
  );

  let leadingSize = 1;
  for (let i = axisFrom; i < axisFrom + maskDim; i++) {
    leadingSize *= tensorShape[i];
  }
  const targetTensorShape = tensorShape.slice(0, axisFrom)
      .concat([leadingSize], tensorShape.slice(axisFrom + maskDim));
  const reshapedTensor = $tensor.reshape(targetTensorShape);
  const reshapedMask = $mask.reshape([-1]);
  const truePositions = whereImpl(
      [leadingSize], reshapedMask.dataSync());
  const gatherIndicesShape = util.squeezeShape(
      truePositions.shape, [1]).newShape as ShapeMap['R1'];
  const gatherIndices =
      truePositions.reshape(gatherIndicesShape) as Tensor<Rank.R1>;

  const res =
      ENGINE.runKernel(b =>
              b.gather(reshapedTensor as Tensor, gatherIndices, axisFrom),
          {reshapedTensor, gatherIndices});
  return res as Tensor;
}

export const booleanMask = op({booleanMask_});