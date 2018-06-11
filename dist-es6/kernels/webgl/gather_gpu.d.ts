import { GPGPUProgram } from './gpgpu_math';
export declare class GatherProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    rank: number;
    constructor(aShape: number[], indicesLength: number, axis: number);
}
