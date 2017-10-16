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

/**
 * Returns true if the axis specifies the inner most dimensions of the
 * array.
 */
export function axesAreInnerMostDims(axis: number[], rank: number): boolean {
  for (let i = 0; i < axis.length; ++i) {
    if (axis[axis.length - i - 1] !== rank - 1 - i) {
      return false;
    }
  }
  return true;
}

export function combineLocations(
    outputLoc: number[], reduceLoc: number[], axis: number[]): number[] {
  const rank = outputLoc.length + reduceLoc.length;
  const loc = [];
  let outIdx = 0;
  let reduceIdx = 0;
    for (let dim = 0; dim < rank; dim++) {
    if (axis.indexOf(dim) === -1) {
      loc.push(outputLoc[outIdx++]);
    } else {
      loc.push(reduceLoc[reduceIdx++]);
    }
  }
  return loc;
}

export function computeOutAndReduceShapes(
    aShape: number[], axis: number[]): [number[], number[]] {
  const outShape = [];
  const rank = aShape.length;
  for (let dim = 0; dim < rank; dim++) {
    if (axis.indexOf(dim) === -1) {
      outShape.push(aShape[dim]);
    }
  }
  const reduceShape = axis.map(dim => aShape[dim]);
  return [outShape, reduceShape];
}

export function expandShapeToKeepDim(
    shape: number[], axes: number[]): number[] {
  const reduceSubShape = axes.map(x => 1);
  return combineLocations(shape, reduceSubShape, axes);
}
