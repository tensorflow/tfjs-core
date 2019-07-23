import WasmBackendModule from '../wasm-out/tfjs-backend-wasm';

const wasmBackendModule = WasmBackendModule();
export async function init(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    wasmBackendModule.onRuntimeInitialized = () => {
      console.log('after');
      resolve();
    };
  });
}

let intSqrtFn: typeof intSqrt;
export function intSqrt(x: number): number {
  if (intSqrtFn == null) {
    intSqrtFn = wasmBackendModule.cwrap('int_sqrt', 'number', ['number']);
  }
  return intSqrtFn(x);
}
