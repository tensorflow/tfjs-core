import { BackendTimingInfo, KernelBackend } from './kernels/backend';
import { DataId, Tensor, Tensor3D, Variable } from './tensor';
import { NamedTensorMap, NamedVariableMap, TensorContainer, TypedArray } from './types';
export declare type ForwardFunc<T extends Tensor> = (backend: KernelBackend, save?: <S extends Tensor>(tensor: S) => S) => T;
export declare type CustomGradientFunc<T extends Tensor> = (...args: Tensor[]) => {
    value: T;
    gradFunc: (dy: T) => Tensor | Tensor[];
};
export interface TensorManager {
    registerTensor(a: Tensor): void;
    registerVariable(v: Variable): void;
    disposeTensor(a: Tensor): void;
    memory(): {
        numDataBuffers: number;
        numBytes: number;
    };
}
export declare type MemoryInfo = {
    numTensors: number;
    numDataBuffers: number;
    numBytes: number;
    unreliable?: boolean;
};
export interface TimingInfo extends BackendTimingInfo {
    wallMs: number;
}
export declare class Engine implements TensorManager {
    private backend;
    safeMode: boolean;
    registeredVariables: NamedVariableMap;
    private refCounter;
    private nextTapeNodeId;
    private numBytes;
    private numTensors;
    private numDataBuffers;
    private activeTape;
    private gradientScopeCount;
    private customGradientDepth;
    private activeScope;
    private scopeStack;
    private profiler;
    constructor(backend: KernelBackend, safeMode: boolean);
    runKernel<T extends Tensor, I extends NamedTensorMap>(forwardFunc: ForwardFunc<T>, inputs: I, backwardsFunc?: (dy: T, saved: Tensor[]) => {
        [P in keyof I]: () => I[P];
    }): T;
    registerTensor(a: Tensor | Variable): void;
    registerVariable(v: Variable): void;
    disposeTensor(a: Tensor): void;
    disposeVariables(): void;
    memory(): MemoryInfo;
    private shouldRecord();
    private addTapeNode(inputs, result, gradientsFunc);
    keep<T extends Tensor>(result: T): T;
    startScope(name?: string, gradientsMode?: boolean): void;
    endScope(result: TensorContainer, gradientsMode?: boolean): void;
    dispose(): void;
    gradients<T extends Tensor>(f: () => T, xs: Tensor[], dy?: T, allowNoGradients?: boolean): {
        value: T;
        grads: Tensor[];
    };
    customGrad<T extends Tensor>(f: CustomGradientFunc<T>): (...args: Tensor[]) => T;
    write(dataId: DataId, values: TypedArray): void;
    readSync(dataId: DataId): TypedArray;
    read(dataId: DataId): Promise<TypedArray>;
    fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels: number): Tensor3D;
    time(query: () => void): Promise<TimingInfo>;
    private track<T>(result);
}
export declare type ScopeFn<T extends TensorContainer> = () => T;
