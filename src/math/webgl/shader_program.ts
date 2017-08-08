import {NDArray} from '../ndarray';
import * as shader_compiler from './shader_compiler';
import {GPGPUContext} from './gpgpu_context';

export interface GPGPUProgram {
  variableNames: string[];
  // tslint:disable-next-line:no-any
  getUserCode(inputs: NDArray[], output: NDArray, ...params: any[]): string;
  // tslint:disable-next-line:no-any
  validate(inputs: NDArray[], output: NDArray, ...params: any[]): boolean;
}

export function createWebGLProgram(gpgpu: GPGPUContext, program: GPGPUProgram,
    // tslint:disable-next-line:no-any
    inputs: NDArray[], out: NDArray, ...params: any[]):
    {program: WebGLProgram, key: string} {
  if (!program.validate(inputs, out)) {
    throw Error('Validation failed');
  }
  const userCode = program.getUserCode(inputs, out, ...params);
  const programInputs = program.variableNames.map((x, i)  => {
    return {name: x, array: inputs[i]};
  });
  const fullSource = shader_compiler.makeShader(programInputs, out, userCode);
  return {
    program: gpgpu.createProgram(fullSource),
    key: key;
  };
}

export function runProgram(gpgpu: GPGPUContext, program: GPGPUProgram,
    webGLProgram: WebGLProgram, inputs: NDArray[], output: NDArray) {
  const outTex = output.getTexture();
  const outTexShape = output.getTextureShapeRC();
  gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  gpgpu.setProgram(webGLProgram);
  inputs.forEach((input, i) => {
    const tex = input.getTexture();
    gpgpu.setInputMatrixTexture(tex, program.variableNames[i], i);
  });
  gpgpu.executeProgram();
}
