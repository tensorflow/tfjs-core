import {DataType, KernelBackend, registerBackend} from '@tensorflow/tfjs-core';
import {DataId} from '@tensorflow/tfjs-core/dist/tensor';
import {BackendValues} from '@tensorflow/tfjs-core/dist/types';
import {sizeFromShape} from '@tensorflow/tfjs-core/dist/util';

import WasmBackendModule from '../wasm-out/tfjs-backend-wasm';

const wasmBackendModule = WasmBackendModule();
export async function init(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    wasmBackendModule.onRuntimeInitialized = () => {
      resolve();
    };
  });
}

let dataIdNextNumber = 0;
export class BackendWasm extends KernelBackend {
  private dataIdMap: WeakMap<
      DataId, {dataIdNumber: number, memoryOffset: number, shape: number[]}> =
      new WeakMap();

  register(dataId: object, shape: number[], dtype: DataType) {
    const memoryOffset = -1;
    this.dataIdMap.set(
        dataId, {dataIdNumber: dataIdNextNumber, memoryOffset, shape});
    dataIdNextNumber++;
  }

  write(dataId: object, values: Float32Array) {
    const data = this.dataIdMap.get(dataId);

    // // TODO: generalize this.
    const bytesPerElement = 4;
    const memoryOffset =
        wasmBackendModule._malloc(values.length * bytesPerElement);
    wasmBackendModule.HEAPU8.set(new Uint8Array(values.buffer), memoryOffset);
    data.memoryOffset = memoryOffset;

    // TODO: cache this
    const writeData = wasmBackendModule.cwrap('writeData', null, [
      'number',  // dataId
      'array',   // shape[]
      'number',  // shapeLength
      'number',  // memoryOffset
      'number'   // bytes
    ]);

    writeData(
        data.dataIdNumber, data.shape, memoryOffset,
        values.length * bytesPerElement);
  }

  async read(dataId: object): Promise<BackendValues> {
    const data = this.dataIdMap.get(dataId);

    const bytesPerElement = 4;
    const bytes = wasmBackendModule.HEAPU8.slice(
        data.memoryOffset,
        data.memoryOffset + sizeFromShape(data.shape) * bytesPerElement);
    return new Float32Array(bytes.buffer);
  }

  disposeData() {}

  floatPrecision(): 32 {
    return 32;
  }
}

registerBackend('wasm', async () => {
  await init();
  return new BackendWasm();
}, 10);
