import { GPGPUProgram } from './gpgpu_math';
export declare class CumSumProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(shape: number[], exclusive: boolean, reverse: boolean);
}
