import { GPGPUProgram } from './gpgpu_math';
export declare class TileProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    rank: number;
    constructor(aShape: number[], reps: number[]);
}
