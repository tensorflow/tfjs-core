import { GPGPUProgram } from './gpgpu_math';
export declare class ReverseProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(xShape: number[], axis: number[]);
}
