import { GPGPUProgram } from './gpgpu_math';
export declare class StridedSliceProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    rank: number;
    constructor(begin: number[], strides: number[], shape: number[]);
}
