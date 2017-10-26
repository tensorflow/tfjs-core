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

/**
 * Information about the forward pass of a convolution/pooling operation.
 * It includes input and output shape, strides, filter size and padding
 * information.
 *
 * Each of these arrays will have the same length (rank).
 */
export type ConvInfoND = {
  rank: number,
  inShape: number[],
  outShape: number[],
  padInfo: {start: number, end: number}[],
  stride: number[],
  filter: number[],
};

export type ConvInfo2D = {
  inShape: [number, number, number],
  outShape: [number, number, number],
  strideHeight: number,
  strideWidth: number,
  filterHeight: number,
  filterWidth: number,
  padInfo: {top: number, left: number, right: number, bottom: number}
};

/**
 * A backward-compatibilty wrapper around computeConvInfoND for the 2D case.
 */
export function computeConvInfo2D(
    inShape: [number, number, number], filterHeight: number,
    filterWidth: number, outDepth: number, strideHeight: number,
    strideWidth: number, pad: 'same'|'valid'|number): ConvInfo2D {
  const new_info = computeConvInfoND(
      inShape, [filterHeight, filterWidth, 1], [strideHeight, strideWidth, 1],
      outDepth, pad)
  return {
    inShape: <[number, number, number]>new_info.inShape,
        outShape: <[number, number, number]>new_info.outShape,
        strideHeight: new_info.stride[0], strideWidth: new_info.stride[1],
        filterHeight: new_info.filter[0], filterWidth: new_info.filter[1],
        padInfo: {
          top: new_info.padInfo[0].start,
          left: new_info.padInfo[1].start,
          right: new_info.padInfo[1].end,
          bottom: new_info.padInfo[0].end
        }
  }
}

/**
 * Computes the information about a forward pass of a convolution/pooling
 * operation.
 *
 * @param inShape The shape of the input data.
 * @param filter The size of each patch. Must be same rank as inShape.
 * @param stride The spacing of the patches. Must be same rank as inShape.
 * @param outDepth Deprecated and unused.
 * @param pad 'same' will produce output tensor of the same shape as input
 *                by padding around the edges with zeros;
 *            'valid' will produce smaller output tensor by only fitting patches
 *                inside the input data.
 */
export function computeConvInfoND(
    inShape: number[], filter: number[], stride: number[], outDepth: number,
    pad: 'same'|'valid'|number): ConvInfoND {
  const rank: number = inShape.length
  util.assert(
      filter.length == rank,
      'Filter should be same rank as data (' + rank + ') but was ' +
          filter.length + '.')
  util.assert(
      stride.length == rank,
      'Filter should be same rank as data (' + rank + ') but was ' +
          filter.length + '.')
  if (typeof pad === 'number') {
    const outShape = computeOutputShape3D(
        <[number, number, number]>inShape, filter[0], outDepth, stride[0], pad);
    return {
      rank,
      inShape,
      outShape,
      padInfo: [{start: pad, end: pad}, {start: pad, end: pad}],
      stride,
      filter,
    };
  }

  let outShape: number[] = [];
  let padInfo: {start: number, end: number}[] = [];
  for (let i in inShape) {
    let outSize: number;
    let thisPadInfo: {start: number, end: number};
    if (pad === 'same') {
      outSize = Math.ceil(inShape[i] / stride[i]);
      const padSize = (outSize - 1) * stride[i] + filter[i] - inShape[i];
      const start = Math.floor(padSize / 2);
      const end = padSize - start;
      thisPadInfo = {start, end};
    } else if (pad === 'valid') {
      outSize = Math.ceil((inShape[i] - filter[i] + 1) / stride[i]);
      thisPadInfo = {start: 0, end: 0};
    } else {
      throw Error(`Unknown padding parameter: ${pad}`);
    }
    outShape.push(outSize);
    padInfo.push(thisPadInfo)
  }

  return {
    rank,
    inShape,
    outShape,
    padInfo,
    stride,
    filter,
  };
}

/**
 * @deprecated Use `conv_util.computeConvInfo2D` instead.
 */
export function computeOutputShape3D(
    inShape: [number, number, number], fieldSize: number, outDepth: number,
    stride: number, zeroPad?: number): [number, number, number] {
  if (zeroPad == null) {
    zeroPad = computeDefaultPad(inShape, fieldSize, stride);
  }
  const inputRows = inShape[0];
  const inputCols = inShape[1];
  const outputRows = (inputRows - fieldSize + 2 * zeroPad) / stride + 1;
  util.assert(
      util.isInt(outputRows),
      `The output # of rows (${outputRows}) must be an integer. Change the ` +
          `stride and/or zero pad parameters`);

  const outputCols = (inputCols - fieldSize + 2 * zeroPad) / stride + 1;
  util.assert(
      util.isInt(outputCols),
      `The output # of columns (${outputCols}) must be an integer. Change ` +
          `the stride and/or zero pad parameters`);

  return [outputRows, outputCols, outDepth];
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
    inputDepth: number, outputDepth: number, filterHeight: number,
    filterWidth: number): [number, number, number, number] {
  return [filterHeight, filterWidth, inputDepth, outputDepth];
}

export function computeDilatedRC(
    rc: [number, number], origStride: number): [number, number] {
  const rowsDilated = (rc[0] - 1) * origStride + 1;
  const colsDilated = (rc[1] - 1) * origStride + 1;
  return [rowsDilated, colsDilated];
}
