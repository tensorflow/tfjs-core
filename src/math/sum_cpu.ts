/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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
import * as util from '../util';
import * as axis_util from './axis_util';
import {DataTypes, NDArray} from './ndarray';

export function sum(
    input: NDArray, axis: number[], dtype: keyof DataTypes): NDArray {
  if (!axis_util.axesAreInnerMostDims(axis, input.rank)) {
    throw new Error('Sum is only supported across the inner-most dimensions');
  }
  const [outShape, reduceShape] =
      axis_util.computeOutAndReduceShapes(input.shape, axis);
  const result = NDArray.zeros(outShape, dtype);
  const reduceSize = util.sizeFromShape(reduceShape);
  const vals = result.getValues();

  const aVals = input.getValues();
  for (let i = 0; i < vals.length; ++i) {
    const offset = i * reduceSize;
    let sum = 0;
    for (let j = 0; j < reduceSize; ++j) {
      sum += aVals[offset + j];
    }
    vals[i] = sum;
  }
  return result;
}
