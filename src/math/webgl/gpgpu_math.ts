import {NDArray} from '../ndarray';

import {GPGPUContext} from './gpgpu_context';
import * as shader_compiler from './shader_compiler';

export interface GPGPUProgram {
  variableNames: string[];
  getUserCode(inputs: NDArray[], output: NDArray): string;
  validate(inputs: NDArray[], output: NDArray): boolean;
}

export interface CompiledGPGPUProgram {
  webGLProgram: WebGLProgram;
  program: GPGPUProgram;
  gpgpu: GPGPUContext;
}

export function compileProgram(
    gpgpu: GPGPUContext, program: GPGPUProgram, inputs: NDArray[],
    out: NDArray): CompiledGPGPUProgram {
  if (!program.validate(inputs, out)) {
    throw Error('Validation failed');
  }
  const userCode = program.getUserCode(inputs, out);
  const programInputs = program.variableNames.map((x, i) => {
    return {name: x, array: inputs[i]};
  });
  const fullSource = shader_compiler.makeShader(programInputs, out, userCode);
  return {
    program,
    webGLProgram: gpgpu.createProgram(fullSource),
    gpgpu
  };
}

export function runProgram(compiledProgram: CompiledGPGPUProgram,
    inputs: NDArray[], output: NDArray): void {
  if (!compiledProgram.program.validate(inputs, output)) {
    throw Error('Validation failed');
  }
  const outTex = output.getTexture();
  const outTexShape = output.getTextureShapeRC();
  const gpgpu = compiledProgram.gpgpu;
  gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  gpgpu.setProgram(compiledProgram.webGLProgram);
  inputs.forEach((input, i) => {
    const tex = input.getTexture();
    gpgpu.setInputMatrixTexture(
        tex, compiledProgram.program.variableNames[i], i);
  });
  gpgpu.executeProgram();
}
