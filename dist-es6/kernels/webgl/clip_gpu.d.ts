import { GPGPUProgram } from './gpgpu_math';
export declare class ClipProgram implements GPGPUProgram {
    variableNames: string[];
    userCode: string;
    outputShape: number[];
    constructor(aShape: number[], min: number, max: number);
}
