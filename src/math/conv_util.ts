/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import * as util from '../util';

export function computeOutputShape3DV2(
    inputShape: [number, number, number], filterHeight: number,
    filterWidth: number, depth: number, strideHeight: number,
    strideWidth: number, padding: 'same'|'valid'): [number, number, number] {
  const inHeight = inputShape[0];
  const inWidth = inputShape[1];
  if (padding === 'same') {
    const outputHeight = Math.ceil(inHeight / strideHeight);
    const outputWidth = Math.ceil(inWidth / strideWidth);
    return [outputHeight, outputWidth, depth];
  } else if (padding === 'valid') {
    const outputHeight =
        Math.ceil((inHeight - filterHeight + 1) / strideHeight);
    const outputWidth = Math.ceil((inWidth - filterWidth + 1) / strideWidth);
    return [outputHeight, outputWidth, depth];
  } else {
    throw Error(`Unknown padding parameter: ${padding}`);
  }
}

export function computeOutputShape3D(
    inputShapeRowColDepth: [number, number, number], filterHeight: number,
    filterWidth: number, depth: number, stride: number,
    padding: 'same'|'valid'|number): [number, number, number] {
  if (typeof padding === 'string') {
    return computeOutputShape3DV2(
        inputShapeRowColDepth, fieldSize, depth, stride, padding);
  }
  if (padding == null) {
    padding = computeDefaultPad(inputShapeRowColDepth, fieldSize, stride);
  }
  const inputRows = inputShapeRowColDepth[0];
  const inputCols = inputShapeRowColDepth[1];
  const outputRows =
      (inputRows - fieldSize + beforePad + afterPad) / stride + 1;
  util.assert(
      util.isInt(outputRows),
      `The output # of rows (${outputRows}) must be an integer. Change the ` +
          `stride and/or zero pad parameters`);

  const outputCols = (inputCols - fieldSize + 2 * padding) / stride + 1;
  util.assert(
      util.isInt(outputCols),
      `The output # of columns (${outputCols}) must be an integer. Change ` +
          `the stride and/or zero pad parameters`);

  return [outputRows, outputCols, depth];
}

export function computeDefaultPad(
    inputShape: [number, number, number], fieldSize: number,
    stride: number): number {
  return Math.floor((inputShape[0] * (stride - 1) - stride + fieldSize) / 2);
}

export function computeTexShapeFrom3D(
    shapeRowColDepth: [number, number, number]): [number, number] {
  return [shapeRowColDepth[0], shapeRowColDepth[1] * shapeRowColDepth[2]];
}

export function computeWeightsShape4D(
    inputDepth: number, outputDepth: number,
    fSize: number): [number, number, number, number] {
  return [fSize, fSize, inputDepth, outputDepth];
}

export function computeDilatedRC(
    rc: [number, number], origStride: number): [number, number] {
  const rowsDilated = (rc[0] - 1) * origStride + 1;
  const colsDilated = (rc[1] - 1) * origStride + 1;
  return [rowsDilated, colsDilated];
}
