import { GPGPUContext } from './gpgpu_context';
import { GPGPUProgram } from './gpgpu_math';
export declare class SliceProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    rank: number;
    startLoc: WebGLUniformLocation;
    constructor(destSize: number[]);
    getCustomSetupFunc(start: number[]): (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void;
}
