import { GPGPUProgram } from './gpgpu_math';
export declare class PadProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(xShape: number[], paddings: Array<[number, number]>, constantValue: number);
}
