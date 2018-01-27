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

import {ENV} from '../environment';
import * as util from '../util';
import {operation} from './decorators';
import {Array1D, Array3D, NDArray, NDArrayData} from './ndarray';
import {MPRandGauss, RandNormalDataTypes} from './rand';
import {DataType, DataTypeMap, Rank, ShapeMap} from './types';

export class Ops {
  /** Creates a ndarray of ones with the specified shape. */
  @operation
  static ones<R extends Rank>(shape: ShapeMap[R], dtype?: DataType):
      NDArray<R> {
    const values = makeOnesTypedArray(util.sizeFromShape(shape), dtype);
    return NDArray.make(shape, {values}, dtype);
  }

  /** Creates a ndarray of zeros with the specified shape. */
  @operation
  static zeros<R extends Rank>(shape: ShapeMap[R], dtype?: DataType):
      NDArray<R> {
    const values = makeZerosTypedArray(util.sizeFromShape(shape), dtype);
    return NDArray.make(shape, {values}, dtype);
  }

  /**
   * Creates a ndarray of ones with the same shape as the specified ndarray.
   */
  @operation
  static onesLike<T extends NDArray>(x: T): T {
    return Ops.ones(x.shape, x.dtype) as T;
  }

  /**
   * Creates a ndarray of zeros with the same shape as the specified ndarray.
   */
  @operation
  static zerosLike<T extends NDArray>(x: T): T {
    return Ops.zeros(x.shape, x.dtype) as T;
  }

  /** Creates a ndarray with the same values/shape as the specified ndarray. */
  @operation
  static clone<T extends NDArray>(x: T): T {
    const newValues = util.copyTypedArray(x.dataSync(), x.dtype);
    return NDArray.make(x.shape, {values: newValues}, x.dtype) as T;
  }

  @operation
  static randNormal<R extends Rank>(
      shape: ShapeMap[R], mean = 0, stdDev = 1,
      dtype?: keyof RandNormalDataTypes, seed?: number): NDArray<R> {
    if (dtype != null && (dtype as DataType) === 'bool') {
      throw new Error(`Unsupported data type ${dtype}`);
    }
    const randGauss =
        new MPRandGauss(mean, stdDev, dtype, false /* truncated */, seed);
    return NDArray.rand(shape, () => randGauss.nextValue(), dtype);
  }

  @operation
  static randTruncatedNormal<R extends Rank>(
      shape: ShapeMap[R], mean = 0, stdDev = 1,
      dtype?: keyof RandNormalDataTypes, seed?: number): NDArray<R> {
    if (dtype != null && (dtype as DataType) === 'bool') {
      throw new Error(`Unsupported data type ${dtype}`);
    }
    const randGauss =
        new MPRandGauss(mean, stdDev, dtype, true /* truncated */, seed);
    return NDArray.rand(shape, () => randGauss.nextValue(), dtype);
  }

  @operation
  static randUniform<R extends Rank>(
      shape: ShapeMap[R], a: number, b: number, dtype?: DataType): NDArray<R> {
    return NDArray.rand(shape, () => util.randUniform(a, b), dtype);
  }

  @operation
  static rand<R extends Rank>(
      shape: ShapeMap[R], randFunction: () => number, dtype?: DataType):
      NDArray<R> {
    const size = util.sizeFromShape(shape);

    let values = null;
    if (dtype == null || dtype === 'float32') {
      values = new Float32Array(size);
    } else if (dtype === 'int32') {
      values = new Int32Array(size);
    } else if (dtype === 'bool') {
      values = new Uint8Array(size);
    } else {
      throw new Error(`Unknown data type ${dtype}`);
    }

    for (let i = 0; i < size; i++) {
      values[i] = randFunction();
    }
    return NDArray.make(shape, {values}, dtype);
  }

  @operation
  static fromPixels(
      pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement,
      numChannels = 3): Array3D {
    if (numChannels > 4) {
      throw new Error(
          'Cannot construct NDArray with more than 4 channels from pixels.');
    }
    const ndarrayData: NDArrayData = {};
    const shape: [number, number, number] =
        [pixels.height, pixels.width, numChannels];
    const res = NDArray.make(shape, ndarrayData, 'int32') as Array3D;
    ENV.math.writePixels(res.dataId, pixels, numChannels);
    return res;
  }

  /** Reshapes the array. */
  @operation
  static reshape<R2 extends Rank>(x: NDArray, newShape: ShapeMap[R2]):
      NDArray<R2> {
    newShape = util.inferFromImplicitShape(newShape, x.size);
    util.assert(
        x.size === util.sizeFromShape(newShape),
        'new shape and old shape must have the same number of elements.');

    const grad = (dy: NDArray<R2>, y: NDArray<R2>) => {
      return {x: () => dy.reshape(x.shape)};
    };
    return ENV.engine.executeKernel(
               'Reshape', {inputs: {x}, args: {newShape}}, grad) as NDArray<R2>;
  }

  /**
   * Casts a tensor to a new type. If the new type matches the old type,
   * this is a no-op.
   */
  @operation
  static cast<T extends NDArray>(x: T, newDType: DataType): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.reshape(dy.shape)};
    };
    return ENV.engine.executeKernel(
               'Cast', {inputs: {x}, args: {newDType}}, grad) as T;
  }

  /**
   * Construct an array by repeating it the number of times given by reps.
   *
   * This operation creates a new array by replicating `input` `reps`
   * times. The output tensor's i'th dimension has `input.shape[i] *
   * reps[i]` elements, and the values of `input` are replicated
   * `reps[i]` times along the i'th dimension. For example, tiling
   * `[a, b, c, d]` by `[2]` produces `[a, b, c, d, a, b, c, d]`.
   *
   * @param x The array to transpose.
   * @param reps Determines the number of replications per dimension.
   */
  @operation
  static tile<T extends NDArray>(x: T, reps: number[]): T {
    util.assert(
        x.rank === reps.length,
        `Error in transpose: rank of input ${x.rank} ` +
            `must match length of reps ${reps}.`);
    return ENV.engine.executeKernel('Tile', {inputs: {x}, args: {reps}}) as T;
  }

  /**
   * Gather slices from array `x`'s axis `axis` according to `indices`
   *
   * @param x The array to transpose.
   * @param indices The indices of the values to extract.
   * @param axis Optional. The axis over which to select values. Defaults to 0.
   */
  @operation
  static gather<T extends NDArray>(x: T, indices: Array1D, axis = 0): T {
    return ENV.engine.executeKernel(
               'Gather', {inputs: {x, indices}, args: {axis}}) as T;
  }
}

function makeZerosTypedArray<D extends DataType>(
    size: number, dtype: D): DataTypeMap[D] {
  if (dtype == null || dtype === 'float32') {
    return new Float32Array(size);
  } else if (dtype === 'int32') {
    return new Int32Array(size);
  } else if (dtype === 'bool') {
    return new Uint8Array(size);
  } else {
    throw new Error(`Unknown data type ${dtype}`);
  }
}

function makeOnesTypedArray<D extends DataType>(
    size: number, dtype: D): DataTypeMap[D] {
  const array = makeZerosTypedArray(size, dtype);
  for (let i = 0; i < array.length; i++) {
    array[i] = 1;
  }
  return array;
}
