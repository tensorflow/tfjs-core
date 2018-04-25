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

import {ArrayOps} from '../ops/array_ops';
import {Tensor} from '../tensor';
import {NamedTensorMap, TypedArray} from '../types';
import {sizeFromShape} from '../util';

import {WeightsManifestEntry} from './types';

/**
 * Encode a map from names to weight values as an ArrayBuffer, along with an
 * `Array` of `WeightsManifestEntry` as specification of the encoded weights.
 *
 * This function does not perform sharding.
 *
 * This function is the reverse of `decodeWeights`.
 *
 * @param tensors A map ("dict") from names to tensors.
 * @returns A `Promise` of
 *   - A flat `ArrayBuffer` with all the binary values of the `Tensor`s
 *     concatenated.
 *   - An `Array` of `WeightManifestEntry`s, carrying information including
 *     tensor names, `dtype`s and shapes.
 * @throws Error: on unsupported tensor `dtype`.
 */
export async function encodeWeights(tensors: NamedTensorMap):
    Promise<{data: ArrayBuffer, specs: WeightsManifestEntry[]}> {
  // TODO(adarob, cais): Support quantization.
  const specs: WeightsManifestEntry[] = [];
  const dataPromises: Array<Promise<TypedArray>> = [];
  for (const name in tensors) {
    const t = tensors[name];

    if (t.dtype !== 'float32' && t.dtype !== 'int32' && t.dtype !== 'bool') {
      throw new Error(`Unsupported dtype in weight '${name}': ${t.dtype}`);
    }
    specs.push({name, shape: t.shape, dtype: t.dtype});
    dataPromises.push(t.data());
  }
  const tensorValues = await Promise.all(dataPromises);
  return {data: concatenateTypedArrays(tensorValues), specs};
}

/**
 * Decode flat ArrayBuffer as weights.
 *
 * This function does not handle sharding.
 *
 * This function is the reverse of `encodeWeights`.
 *
 * @param buffer A flat ArrayBuffer carrying the binary values of the tensors
 *   concatenated in the order specified in `specs`.
 * @param specs Specifications of the names, dtypes and shapes of the tensors
 *   whose value are encoded by `buffer`.
 * @return A map from tensor name to tensor value, with the names corresponding
 *   to names in `specs`.
 * @throws Error, if any of the tensors has unsupported dtype.
 */
export function decodeWeights(
    buffer: ArrayBuffer, specs: WeightsManifestEntry[]): NamedTensorMap {
  // TODO(adarob, cais): Support quantization.
  const out: NamedTensorMap = {};
  let offset = 0;
  for (const spec of specs) {
    const name = spec.name;
    const dtype = spec.dtype;
    const shape = spec.shape;

    const size = sizeFromShape(shape);
    let bytes: number;
    let value: Tensor;
    if (dtype === 'float32') {
      bytes = size * 4;
      value = ArrayOps.tensor(
          new Float32Array(buffer, offset, size), shape, 'float32');
    } else if (dtype === 'int32') {
      bytes = size * 4;
      value =
          ArrayOps.tensor(new Int32Array(buffer, offset, size), shape, 'int32');
    } else if (dtype === 'bool') {
      bytes = size;
      value =
          ArrayOps.tensor(new Uint8Array(buffer, offset, size), shape, 'bool');
    } else {
      throw new Error(`Unsupported dtype in weight '${name}': ${dtype}`);
    }
    out[name] = value;
    offset += bytes;
  }
  return out;
}

/**
 * Concatenate TypedArrays into an ArrayBuffer.
 */
export function concatenateTypedArrays(xs: TypedArray[]): ArrayBuffer {
  // TODO(adarob, cais): Support quantization.
  if (xs === null) {
    throw new Error(`Invalid input value: ${JSON.stringify(xs)}`);
  }

  let totalByteLength = 0;
  xs.forEach(x => {
    // tslint:disable-next-line:no-any
    if (x as any instanceof Float32Array || x as any instanceof Int32Array) {
      totalByteLength += x.length * 4;
      // tslint:disable-next-line:no-any
    } else if (x as any instanceof Uint8Array) {
      totalByteLength += x.length;
    } else {
      throw new Error(`Unsupported TypedArray subtype: ${x.constructor.name}`);
    }
  });

  const y = new Uint8Array(totalByteLength);
  let offset = 0;
  xs.forEach(x => {
    y.set(new Uint8Array(x.buffer), offset);
    if (x instanceof Float32Array || x instanceof Int32Array) {
      offset += x.length * 4;
    } else {
      offset += x.length;
    }
  });

  return y.buffer;
}
