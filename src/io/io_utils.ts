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

import {tensor} from '../index';
import {Tensor} from '../tensor';
import {NamedTensorMap} from '../types';
import {WeightsManifestEntry} from './types';

/**
 * Encode a map from names to Tensors as an ArrayBuffer.
 *
 * @param tensors A map ("dict") from names to tensors.
 * @returns A `Promise` of
 *   - A flat `ArrayBuffer` with all the binary values of the `Tensor`s
 *     concatenated.
 *   - An `Array` of `WeightManifestEntry`s, carrying information including
 *     tensor names, `dtype`s and shapes.
 * @throws Error: on unsupported tensor `dtype`.
 */
export async function encodeTensors(tensors: NamedTensorMap):
    Promise<[ArrayBuffer, WeightsManifestEntry[]]> {
  const specs: WeightsManifestEntry[] = [];
  const dataPromises: Array<Promise<Float32Array|Int32Array|Uint8Array>> = [];
  for (const name in tensors) {
    const tensor = tensors[name];

    if (tensor.dtype !== 'float32' && tensor.dtype !== 'int32' &&
        tensor.dtype !== 'bool') {
      throw new Error(`Unsupported dtype: ${tensor.dtype}`);
    }
    specs.push({name, shape: tensor.shape, dtype: tensor.dtype});
    dataPromises.push(tensor.data());
  }
  const tensorValues = await Promise.all(dataPromises);
  return [concatenateTypedArrays(tensorValues), specs];
}

export function decodeTensors(
    buffer: ArrayBuffer, specs: WeightsManifestEntry[]): NamedTensorMap {
  const out: NamedTensorMap = {};
  let offset = 0;
  for (const spec of specs) {
    const name = spec.name;
    const dtype = spec.dtype;
    const shape = spec.shape;

    let numel = 1;
    for (const dim of shape) {
      numel *= dim;
    }
    let bytes: number;
    let value: Tensor;
    if (dtype === 'float32') {
      bytes = numel * 4;
      value = tensor(new Float32Array(buffer, offset, numel), shape, 'float32');
    } else if (dtype === 'int32') {
      bytes = numel * 4;
      value = tensor(new Int32Array(buffer, offset, numel), shape, 'int32');
    } else if (dtype === 'bool') {
      bytes = numel;
      value = tensor(new Uint8Array(buffer, offset, numel), shape, 'bool');
    } else {
      throw new Error(`Unsupported dtype: ${dtype}`);
    }
    out[name] = value;
    offset += bytes;
  }
  return out;
}

/**
 * Concatenate TypedArrays into an ArrayBuffer.
 */
export function concatenateTypedArrays(
    xs: Array<Float32Array|Int32Array|Uint8Array>): ArrayBuffer {
  if (xs === null) {
    return null;
  }
  if (xs === undefined) {
    return undefined;
  }
  if (xs.length === 0) {
    return new ArrayBuffer(0);
  }

  let totalByteLength = 0;
  for (const x of xs) {
    // tslint:disable-next-line:no-any
    if (x as any instanceof Float32Array || x instanceof Int32Array) {
      totalByteLength += x.length * 4;
      // tslint:disable-next-line:no-any
    } else if (x as any instanceof Uint8Array) {
      totalByteLength += x.length;
    } else {
      throw new Error(`Unsupported TypedArray subtype: ${x.constructor.name}`);
    }
  }

  const y = new Uint8Array(totalByteLength);
  let offset = 0;
  for (const x of xs) {
    y.set(new Uint8Array(x.buffer), offset);
    if (x instanceof Float32Array || x instanceof Int32Array) {
      offset += x.length * 4;
    } else {
      offset += x.length;
    }
  }

  return y.buffer;
}
