import { Tensor } from '../../tensor';
import { GPGPUContext } from './gpgpu_context';
import { ShapeInfo } from './shader_compiler';
import { TextureData } from './tex_util';
export interface GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    supportsBroadcasting?: boolean;
}
export interface GPGPUBinary {
    webGLProgram: WebGLProgram;
    program: GPGPUProgram;
    uniformLocations: {
        [name: string]: WebGLUniformLocation;
    };
    gpgpu: GPGPUContext;
    source: string;
    inShapeInfos: ShapeInfo[];
    outShapeInfo: ShapeInfo;
}
export interface TensorData<T extends Tensor> {
    tensor: T;
    texData: TextureData;
}
export declare function compileProgram<T extends Tensor, K extends Tensor>(gpgpu: GPGPUContext, program: GPGPUProgram, inputs: Array<TensorData<T>>, output: TensorData<K>): GPGPUBinary;
export declare function runProgram<T extends Tensor, K extends Tensor>(binary: GPGPUBinary, inputs: Array<TensorData<T>>, output: TensorData<K>, customSetup?: (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void): void;
export declare function makeShaderKey(program: GPGPUProgram, inputs: Array<TensorData<Tensor>>, output: TensorData<Tensor>): string;
