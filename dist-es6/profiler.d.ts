import { BackendTimer } from './kernels/backend';
import { Tensor } from './tensor';
import { TypedArray } from './types';
export declare class Profiler {
    private backendTimer;
    private logger;
    constructor(backendTimer: BackendTimer, logger?: Logger);
    profileKernel<T extends Tensor>(name: string, f: () => T): T;
}
export declare class Logger {
    logKernelProfile(name: string, result: Tensor, vals: TypedArray, timeMs: number): void;
}
