import { GPGPUProgram } from './gpgpu_math';
export declare class OneHotProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    seedLoc: WebGLUniformLocation;
    constructor(numIndices: number, depth: number, onValue: number, offValue: number);
}
