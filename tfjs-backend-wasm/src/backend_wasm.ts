/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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

import {DataType, KernelBackend, Rank, registerBackend, ShapeMap, Tensor, util} from '@tensorflow/tfjs-core';
import {BackendValues, TypedArray} from '@tensorflow/tfjs-core/dist/types';

import wasmFactory from '../wasm-out/tfjs-backend-wasm';
import {BackendWasmModule} from '../wasm-out/tfjs-backend-wasm';

const WASM_PRIORITY = 2;

interface TensorInfo {
  id: number;
  memoryOffset: number;
  shape: number[];
  dtype: DataType;
}

export class BackendWasm extends KernelBackend {
  private dataIdNextNumber = 0;
  private dataIdMap: WeakMap<{}, TensorInfo> = new WeakMap();

  constructor(private wasm: BackendWasmModule) {
    super();
  }

  register(dataId: {}, shape: number[], dtype: DataType) {
    const memoryOffset = this.wasm._malloc(
        util.sizeFromShape(shape) * util.bytesPerElement(dtype));
    const id = this.dataIdNextNumber++;
    this.dataIdMap.set(dataId, {id, memoryOffset, shape, dtype});

    const shapeBytes = new Uint8Array(new Int32Array(shape).buffer);
    this.wasm.tfjs.registerTensor(
        id, shapeBytes, shape.length, dtypeToEnumValue(dtype), memoryOffset);
  }

  write(dataId: {}, values: Float32Array) {
    const {memoryOffset} = this.dataIdMap.get(dataId);
    this.wasm.HEAPU8.set(new Uint8Array(values.buffer), memoryOffset);
  }

  async read(dataId: {}): Promise<BackendValues> {
    return this.readSync(dataId);
  }

  readSync(dataId: {}): BackendValues {
    const {memoryOffset, dtype, shape} = this.dataIdMap.get(dataId);
    const bytes = this.wasm.HEAPU8.slice(
        memoryOffset,
        memoryOffset + util.sizeFromShape(shape) * util.bytesPerElement(dtype));
    return typedArrayFromBuffer(bytes.buffer, dtype);
  }

  disposeData(dataId: {}) {
    const data = this.dataIdMap.get(dataId);
    this.wasm.tfjs.disposeData(data.id);
    this.dataIdMap.delete(dataId);
  }

  floatPrecision(): 32 {
    return 32;
  }

  // Returns the memory offset of a tensor. Useful for debugging and unit
  // testing.
  getMemoryOffset(dataId: {}): number {
    return this.dataIdMap.get(dataId).memoryOffset;
  }

  dispose() {
    this.wasm.tfjs.dispose();
    this.wasm = null;
  }

  // Kernels.

  add(a: Tensor, b: Tensor): Tensor {
    const aId = this.dataIdMap.get(a.dataId).id;
    const bId = this.dataIdMap.get(b.dataId).id;
    const out = this.makeOutput(a.shape, a.dtype);
    const outId = this.dataIdMap.get(out.dataId).id;
    this.wasm.tfjs.add(aId, bId, outId);
    return out;
  }

  reshape<T extends Tensor, R extends Rank>(x: T, newShape: ShapeMap[R]):
      Tensor<R> {
    return Tensor.make(newShape, {dataId: x.dataId}, x.dtype);
  }

  private makeOutput(shape: number[], dtype: DataType): Tensor {
    return Tensor.make(shape, {}, dtype, this);
  }
}

registerBackend('wasm', async () => {
  const {wasm} = await init();
  return new BackendWasm(wasm);
}, WASM_PRIORITY);

/** Initializes the wasm module and creates the js <--> wasm bridge. */
async function init(): Promise<{wasm: BackendWasmModule}> {
  return new Promise(resolve => {
    const wasm = wasmFactory();
    // Using the tfjs namespace to avoid conflict with emscripten's API.
    wasm.tfjs = {
      registerTensor: wasm.cwrap(
          'register_tensor', null,
          [
            'number',  // dataId
            'array',   // shape[]
            'number',  // shapeLength
            'number',  // dtype
            'number',  // memoryOffset
          ]),
      disposeData: wasm.cwrap('dispose_data', null, ['number']),
      dispose: wasm.cwrap('dispose', null, []),
      add: wasm.cwrap('add', null, ['number, number, number']),
    };
    wasm.onRuntimeInitialized = () => resolve({wasm});
  });
}

function dtypeToEnumValue(dtype: DataType): number {
  switch (dtype) {
    case 'float32':
      return 0;
    case 'int32':
      return 1;
    case 'bool':
      return 2;
    default:
      throw new Error(`Uknown dtype ${dtype}`);
  }
}

function typedArrayFromBuffer(
    buffer: ArrayBuffer, dtype: DataType): TypedArray {
  switch (dtype) {
    case 'float32':
      return new Float32Array(buffer);
    case 'int32':
      return new Int32Array(buffer);
    case 'bool':
      return new Uint8Array(buffer);
    default:
      throw new Error(`Uknown dtype ${dtype}`);
  }
}
