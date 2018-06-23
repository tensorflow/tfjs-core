/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

export function getReshapedBatchDim(
    inputShape: number[], blockShape: number[], prod: number): number[] {
  let reshaped = blockShape.slice(0);
  reshaped.push(inputShape[0] / prod);
  reshaped = reshaped.concat(inputShape.slice(1));
  return reshaped;
}

export function getInputAndBlockPermutation(
    reshaped: number[], blockShapeRank: number): number[] {
  const perm = [blockShapeRank];
  for (let i = blockShapeRank + 1; i < reshaped.length; ++i) {
    if (i <= 2 * blockShapeRank) {
      perm.push(i);
      perm.push(i - (blockShapeRank + 1));
    } else {
      perm.push(i);
    }
  }
  return perm;
}

export function getOutputShapeBeforeCrop(
    inputShape: number[], blockShape: number[], prod: number): number[] {
  const reshapedPermuted = [inputShape[0] / prod];
  for (let i = 1; i < inputShape.length; ++i) {
    if (i <= blockShape.length) {
      reshapedPermuted.push(blockShape[i - 1] * inputShape[i]);
    } else {
      reshapedPermuted.push(inputShape[i]);
    }
  }
  return reshapedPermuted;
}

export function getSliceBeginCoords(
    uncroppedRank: number, crops: number[][], blockShape: number): number[] {
  const cropIndices = [0];
  for (let i = 0; i < blockShape; ++i) {
    cropIndices.push(crops[i][0]);
  }

  for (let i = blockShape; uncroppedRank - 2 > i; ++i) {
    cropIndices.push(0);
  }
  return cropIndices;
}

export function getSliceSize(
    uncroppedShape: number[], crops: number[][], blockShape: number): number[] {
  const resultShape = uncroppedShape.slice(0, 1);
  for (let i = 0; i < blockShape; ++i) {
    resultShape.push(uncroppedShape[i + 1] - crops[i][0] - crops[i][1]);
  }

  return resultShape;
}
