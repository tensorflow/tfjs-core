import { GPGPUContext } from './gpgpu_context';
import { GPGPUProgram } from './gpgpu_math';
export declare class MultinomialProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    seedLoc: WebGLUniformLocation;
    constructor(batchSize: number, numOutcomes: number, numSamples: number);
    getCustomSetupFunc(seed: number): (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void;
}
