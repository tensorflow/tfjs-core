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
import {ENV} from '../environment';
import {Tensor} from '../tensor';
import * as util from '../util';

import {operation} from './operation';

export class StridedSliceOps {
  /**
   * Extracts a strided slice of a tensor.
   *
   * Roughly speaking, this op extracts a slice of size (end-begin)/stride from
   * the given input_ tensor. Starting at the location specified by begin the
   * slice continues by adding stride to the index until all dimensions are not
   * less than end. Note that a stride can be negative, which causes a reverse
   * slice.
   *
   * ```js
   * t = [[[1, 1, 1], [2, 2, 2]],
   *      [[3, 3, 3], [4, 4, 4]],
   *      [[5, 5, 5], [6, 6, 6]]];
   * t.stridedSlice([1, 0, 0], [2, 1, 3], [1, 1, 1])  # [[[3, 3, 3]]]
   * t.stridedSlice([1, 0, 0], [2, 2, 3], [1, 1, 1])  # [[[3, 3, 3],
   *                                                     [4, 4, 4]]]
   * t.stridedSlice([1, -1, 0], [2, -3, 3], [1, -1, 1])  # [[[4, 4, 4],
   *                                                     # [3, 3, 3]]]
   * ```
   *
   * @param x The tensor to stride slice.
   * @param begin An int32 Tensor.
   * @param end: An int32 Tensor.
   * @param strides: An int32 Tensor.
   * @param beginMask: An int32 mask.
   * @param endMask: An int32 mask.
   */
  @doc({heading: 'Operations', subheading: 'Slicing and Joining'})
  @operation
  static stridedSlice<T extends Tensor>(
      x: T, begin: number[], end: number[], strides: number[], beginMask = 0,
      endMask = 0): T {
    // Note that the axis orders are reversed for runtime ops, so the indices,
    // strides and masks must be as well too.
    const rank = x.shape.length;
    const startIndex: number[] = [];
    const endIndex: number[] = [];
    for (let i = 0; i < rank; i++) {
      startIndex[i] =
          StridedSliceOps.startForAxis(beginMask, begin, strides, x.shape, i);
      endIndex[i] =
          StridedSliceOps.stopForAxis(endMask, end, strides, x.shape, i);
    }
    let size = new Array(x.rank);
    console.log(startIndex);
    console.log(endIndex);
    size = size.map((d, i) => {
      let count = 0;
      for (let start = startIndex[i];
           StridedSliceOps.loopCondition(start, endIndex[i], strides[i]);
           start += strides[i]) {
        count += 1;
      }
      return count;
    });

    console.log(size);
    const grad = (dy: T) => {
      return {x: () => dy};
    };
    return ENV.engine.runKernel(
               backend =>
                   backend.strideSlice(x, startIndex, endIndex, strides, size),
               {x}, grad) as T;
  }

  private static clamp(value: number, low: number, high: number) {
    util.assert(!(high < low), `${high} needs to be greater than ${low}`);
    return high < value ? high : (value < low ? low : value);
  }

  // Return the index for the first element along that axis. This index will be
  // a positive integer between [0, axis_size - 1] that can be used to index
  // directly into the data.
  private static startForAxis(
      beginMask: number, startIndices: number[], strides: number[],
      inputShape: number[], axis: number): number {
    // Begin with the specified index
    let start = startIndices[axis];

    // beginMask override
    if (beginMask & 1 << axis) {
      if (strides[axis] > 0) {
        // Forward iteration - use the first element. These values will get
        // clamped below (Note: We could have set them to 0 and axis_size-1, but
        // use lowest() and max() to maintain symmetry with StopForAxis())
        start = Number.MIN_SAFE_INTEGER;
      } else {
        // Backward iteration - use the last element.
        start = Number.MAX_SAFE_INTEGER;
      }
    }

    // Handle negative indices
    const axisSize = inputShape[axis];
    if (start < 0) {
      start += axisSize;
    }

    // Clamping
    start = StridedSliceOps.clamp(start, 0, axisSize - 1);

    return start;
  }

  // Return the "real" index for the end of iteration along that axis. This is
  // an "end" in the traditional C sense, in that it points to one past the last
  // element. ie. So if you were iterating through all elements of a 1D array of
  // size 4, this function would return 4 as the stop, because it is one past
  // the "real" indices of 0, 1, 2 & 3.
  private static stopForAxis(
      endMask: number, stopIndices: number[], strides: number[],
      inputShape: number[], axis: number): number {
    // Begin with the specified index
    let stop = stopIndices[axis];

    // endMask override
    if (endMask & (1 << axis)) {
      if (strides[axis] > 0) {
        // Forward iteration - use the last element. These values will get
        // clamped below
        stop = Number.MAX_SAFE_INTEGER;
      } else {
        // Backward iteration - use the first element.
        stop = Number.MIN_SAFE_INTEGER;
      }
    }

    // Handle negative indices
    const axisSize = inputShape[axis];
    if (stop < 0) {
      stop += axisSize;
    }

    // Clamping
    // Because the end index points one past the last element, we need slightly
    // different clamping ranges depending on the direction.
    if (strides[axis] > 0) {
      // Forward iteration
      stop = StridedSliceOps.clamp(stop, 0, axisSize);
    } else {
      // Backward iteration
      stop = StridedSliceOps.clamp(stop, -1, axisSize - 1);
    }

    return stop;
  }

  private static loopCondition(index: number, stop: number, stride: number):
      boolean {
    // True when we have reached the end of an axis and should loop.
    return stride > 0 ? index >= stop : index <= stop;
  }
}
