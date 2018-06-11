import { GPGPUProgram } from './gpgpu_math';
export declare class TransposeProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    rank: number;
    constructor(aShape: number[], newDim: number[]);
}
