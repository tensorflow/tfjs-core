import { GPGPUContext } from './gpgpu_context';
import { GPGPUProgram } from './gpgpu_math';
export declare class Copy2DProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(srcNumCols: number, destNumCols: number);
    getCustomSetupFunc(sourceStart: [number, number], destStart: [number, number], destSize: [number, number]): (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void;
}
