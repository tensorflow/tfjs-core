import {NDArray} from '../ndarray';

import {GPGPUContext} from './gpgpu_context';
import * as shader_compiler from './shader_compiler';
import * as util from '../../util';

export interface GPGPUProgram<T extends NDArray> {
  inputs: NDArray[];
  output: T;
  variableNames: string[];
  getUserCode(): string;
  validate(): boolean;
  getParams(): Array<{}>;
}

export interface GPGPUBinary<T extends NDArray> {
  webGLProgram: WebGLProgram;
  program: GPGPUProgram<T>;
  gpgpu: GPGPUContext;
  source: string;
}

export function compileProgram<T extends NDArray>(
    gpgpu: GPGPUContext, program: GPGPUProgram<T>): GPGPUBinary<T> {
  if (!program.validate()) {
    throw Error('Validation failed');
  }
  const userCode = program.getUserCode();
  const programInputs = program.variableNames.map((x, i) => {
    return {name: x, array: program.inputs[i]};
  });
  const source = shader_compiler.makeShader(programInputs, program.output,
      userCode);
  return {
    program,
    source,
    webGLProgram: gpgpu.createProgram(source),
    gpgpu
  };
}

function validateBinaryAndProgram<T extends NDArray>(binary: GPGPUBinary<T>,
    program?: GPGPUProgram<T>) {
  const insOut = program.inputs.concat(program.output);
  const binInsOut = binary.program.inputs.concat(binary.program.output);
  insOut.forEach((arr, i) => {
    const shape = arr.shape;
    const texShape = arr.getTextureShapeRC();
    const binShape = binInsOut[i].shape;
    const binTexShape = binInsOut[i].getTextureShapeRC();

    if (!util.arraysEqual(shape, binShape)) {
      throw Error(`Binary was compiled with different shapes than ` +
          `the current program. Binary shape ${binShape}` +
          ` but current shape is ${shape}`);
    }
    if (!util.arraysEqual(texShape, binTexShape)) {
      throw Error(`Binary was compiled with different texture shapes ` +
          `than the current program. Binary texture shape ${binTexShape} ` +
          `but current texture shape is ${texShape}`);
    }
  });
}

export function runProgram<T extends NDArray>(binary: GPGPUBinary<T>,
    program?: GPGPUProgram<T>): void {
  if (program == null) {
    program = binary.program;
  } else if (program !== binary.program) {
    validateBinaryAndProgram(binary, program);
  }
  if (!program.validate()) {
    throw Error('Validation failed');
  }
  const ins = program.inputs;
  const out = program.output;
  const outTex = out.getTexture();
  const outTexShape = out.getTextureShapeRC();
  const gpgpu = binary.gpgpu;
  gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  gpgpu.setProgram(binary.webGLProgram);
  ins.forEach((input, i) => {
    const tex = input.getTexture();
    gpgpu.setInputMatrixTexture(tex, program.variableNames[i], i);
  });
  gpgpu.executeProgram();
}

export function makeShaderKey<T extends NDArray>(
    gpGpuProgram: GPGPUProgram<T>): string {
  const inputs = gpGpuProgram.inputs;
  const out = gpGpuProgram.output;
  const params = gpGpuProgram.getParams();
  const keyStart =
      inputs.concat([out]).map(x => x.shape + '_' + x.getTextureShapeRC());
  const keyEnd = params.map(p => p.toString());
  const key = [gpGpuProgram.constructor.name].concat(keyStart, keyEnd);
  return key.join('_');
}
