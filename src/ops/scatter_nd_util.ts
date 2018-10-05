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
import {computeStrides} from '../util';

/**
 * Check whether updates.shape = indices.shape[:batchDim] +
 * shape[sliceDim:]
 *
 * @param x The input tensor.
 */
export function validateUpdateShape(
    shape: number[], indices: Tensor, updates: Tensor) {
  const sliceDim =
      (indices.shape.length > 1) ? indices.shape[indices.shape.length - 1] : 1;
  const batchDim = (indices.shape.length > 1) ? indices.shape.length - 1 : 1;

  const shapeError = new Error(
      'Must have updates.shape = indices.shape[:batchDim] + ' +
      `shape[sliceDim:], got updates.shape: ${updates.shape}` +
      `, indices.shape: ${indices.shape}, shape: ${shape}` +
      `, sliceDim: ${sliceDim}, and batchDim: ${batchDim}`);

  if (updates.shape.length < batchDim) {
    throw shapeError;
  }
  if (shape.length < sliceDim + (updates.shape.length - batchDim)) {
    throw shapeError;
  }
  if (updates.shape.length !== batchDim + shape.length - sliceDim) {
    throw shapeError;
  }
  for (let d = 0; d < batchDim; ++d) {
    if (updates.shape[d] !== indices.shape[d]) {
      throw shapeError;
    }
  }
  for (let d = 0; d < updates.shape.length - batchDim; ++d) {
    if (updates.shape[d + batchDim] !== shape[d + sliceDim]) {
      throw shapeError;
    }
  }
}

/**
 * Validate scatter nd inputs.
 *
 * @param update The tensor contains the update values.
 * @param indices The tensor contains the indices for the update values.
 * @param shape The shape of the output tensor.
 *
 * @returns [sliceDim, numUpdates, sliceSize]
 */
export function prepareAndValidate(
    updates: Tensor, indices: Tensor,
    shape: number[]): [number, number, number, number[]] {
  const indicesShape = indices.shape;
  const updateShape = updates.shape;

  if (indices.dtype !== 'int32') {
    throw new Error(
        `Indices dtype is exected to be int32, got dtype = ${indices.dtype}`);
  }
  if (shape.length < 1) {
    throw new Error(
        `Output rank must be greater or equal 1, got shape: ${shape}`);
  }

  if (!(shape.length > 0 || (indices.size === 0 && updates.size === 0))) {
    throw new Error(
        `Indices and updates specified for empty output. indices shape: ${
            indices.shape}`);
  }

  if (updates.shape[0] !== indices.shape[0]) {
    throw new Error(
        'The outermost dimension of updates and indices ' +
        `must match. Got indices.shape ${indicesShape}, updates.shape ${
            updateShape}`);
  }
  validateUpdateShape(shape, indices, updates);

  // Calculate the number of dimensions in indices
  const sliceDim =
      (indicesShape.length > 1) ? indicesShape[indicesShape.length - 1] : 1;

  // Calculate the number of elements that make up each slice of our updated
  // tensor. This allows us to work with flattened tensors and copy over whole
  // slices at a time.
  const totalNd = shape.length;

  let sliceSize = 1;
  for (let i = sliceDim; i < totalNd; ++i) {
    sliceSize *= shape[i];
  }

  const safeSliceDim = (sliceDim < 1) ? 1 : sliceDim;
  const numUpdates = indices.size / safeSliceDim;

  const strides =
      [...computeStrides(shape).map(stride => stride / sliceSize), 1];
  return [sliceDim, numUpdates, sliceSize, strides];
}
