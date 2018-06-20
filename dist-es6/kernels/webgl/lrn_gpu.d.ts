import { GPGPUProgram } from './gpgpu_math';
export declare class LRNProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(xShape: number[], radius: number, bias: number, alpha: number, beta: number);
}
