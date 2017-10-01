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

import {NDArray} from './ndarray';

/**
 * Returns true if the axis specifies the inner most dimensions of the array.
 */
export function axisHasInnerMostDims(axis: number[], rank: number): boolean {
  for (let i = 0; i < axis.length; ++i) {
    if (axis[axis.length - i - 1] !== rank - 1 - i) {
      return false;
    }
  }
  return true;
}

export function computeLocation(
    outLoc: number[], reduceLoc: number[], axis: number[]): number[] {
  const rank = outLoc.length + reduceLoc.length;
  const loc = [];
  let outIdx = 0;
  let reduceIdx = 0;

  for (let dim = 0; dim < rank; dim++) {
    if (axis.indexOf(dim) === -1) {
      loc.push(outLoc[outIdx++]);
    } else {
      loc.push(reduceLoc[reduceIdx++]);
    }
  }
  return loc;
}

export function computeOutAndReduceShapes(
    a: NDArray, axis: number[]): [number[], number[]] {
  const outShape = [];
  for (let dim = 0; dim < a.rank; dim++) {
    if (axis.indexOf(dim) === -1) {
      outShape.push(a.shape[dim]);
    }
  }
  const reduceShape = axis.map(dim => a.shape[dim]);
  return [outShape, reduceShape];
}
