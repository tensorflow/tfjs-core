/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import {convertToTensor} from '../tensor_util_env';
import {TensorLike} from '../types';
import * as util from '../util';

/**
 * Normalize noise shape based on provided tensor and noise shape.
 *
 * ```js
 * const x = tf.ones([2, 3]);
 * const noiseShape = [2, 3];
 * const shape = getNoiseShape(x, noiseShape);
 * console.log(shape);
 * ```
 *
 * @param x Tensor or TensorLike.
 * @param noiseShape A 1-D Tensor of type int32, representing the shape for
 *   randomly generated keep/drop flags. Optional.
 * @returns Normalized noise shape.
 */
export function getNoiseShape(
    x: Tensor|TensorLike, noiseShape?: number[]): number[] {
  const $x = convertToTensor(x, 'x', 'getNoiseShape');

  if (noiseShape == null) {
    return $x.shape.slice();
  }
  if (util.arraysEqual($x.shape, noiseShape)) {
    return noiseShape;
  }
  if ($x.shape.length === noiseShape.length) {
    const newDimension: number[] = [];
    for (let i = 0; i < $x.shape.length; i++) {
      if (noiseShape[i] == null && $x.shape[i] != null) {
        newDimension.push($x.shape[i]);
      } else {
        newDimension.push(noiseShape[i]);
      }
    }
    return newDimension;
  }

  return noiseShape;
}
