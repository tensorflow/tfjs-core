import {DataType, KernelBackend, registerBackend} from '@tensorflow/tfjs-core';
import {DataId} from '@tensorflow/tfjs-core/dist/tensor';
import {BackendValues} from '@tensorflow/tfjs-core/dist/types';
import {sizeFromShape} from '@tensorflow/tfjs-core/dist/util';
import wasmFactory from '../wasm-out/tfjs-backend-wasm';

const WASM_PRIORITY = 2;

const wasm = wasmFactory();
wasm.writeData = wasm.cwrap('write_data', null, [
  'number',  // dataId
  'array',   // shape[]
  'number',  // shapeLength
  'number',  // memoryOffset
  'number'   // bytes
]);
wasm.disposeData = wasm.cwrap('dispose_data', null, ['number']);

export async function init(): Promise<void> {
  return new Promise<void>(resolve => {
    wasm.onRuntimeInitialized = () => {
      resolve();
    };
  });
}

let dataIdNextNumber = 0;
export class BackendWasm extends KernelBackend {
  private dataIdMap:
      WeakMap<DataId, {id: number, memoryOffset: number, shape: number[]}> =
          new WeakMap();

  register(dataId: object, shape: number[], dtype: DataType) {
    const memoryOffset = -1;
    this.dataIdMap.set(dataId, {id: dataIdNextNumber, memoryOffset, shape});
    dataIdNextNumber++;
  }

  write(dataId: object, values: Float32Array) {
    const data = this.dataIdMap.get(dataId);

    // // TODO: generalize this.
    const bytesPerElement = 4;
    const memoryOffset = wasm._malloc(values.length * bytesPerElement);
    wasm.HEAPU8.set(new Uint8Array(values.buffer), memoryOffset);
    data.memoryOffset = memoryOffset;

    wasm.writeData(data.id, data.shape, data.shape.length, memoryOffset);
  }

  async read(dataId: object): Promise<BackendValues> {
    const data = this.dataIdMap.get(dataId);

    const bytesPerElement = 4;
    const bytes = wasm.HEAPU8.slice(
        data.memoryOffset,
        data.memoryOffset + sizeFromShape(data.shape) * bytesPerElement);
    return new Float32Array(bytes.buffer);
  }

  disposeData(dataId: DataId) {
    const data = this.dataIdMap.get(dataId);
    wasm.disposeData(data.id);
    this.dataIdMap.delete(dataId);
  }

  floatPrecision(): 32 {
    return 32;
  }

  getMemoryOffset(dataId: DataId): number {
    return this.dataIdMap.get(dataId).memoryOffset;
  }
}

registerBackend('wasm', async () => {
  await init();
  return new BackendWasm();
}, WASM_PRIORITY);
