import {NDArray} from '../ndarray';

import {GPGPUContext} from './gpgpu_context';
import * as shader_compiler from './shader_compiler';
import * as util from '../../util';
import {TextureManager} from './texture_manager';
import * as webgl_util from './webgl_util';

export interface GPGPUProgram<T extends NDArray> {
  inputs: T[];
  variableNames: string[];
  getUserCode(): string;
  validate(): boolean;
  getParams(): Array<{}>;
  getOutputShape(): number[];
}

export interface GPGPUBinary<T extends NDArray, K extends NDArray> {
  webGLProgram: WebGLProgram;
  program: GPGPUProgram<T>;
  gpgpu: GPGPUContext;
  source: string;
  output: K;
}

export function compileProgram<T extends NDArray, K extends NDArray>(
    gpgpu: GPGPUContext, program: GPGPUProgram<T>,
    output: K): GPGPUBinary<T,K> {
  if (!program.validate()) {
    throw Error('Validation failed');
  }
  const userCode = program.getUserCode();
  const programInputs = program.variableNames.map((x, i) => {
    const fullShape = {
      shape: program.inputs[i].shape,
      texShape: program.inputs[i].getTextureShapeRC()
    };
    return {name: x, fullShape};
  });

  const outFullShape = {
    shape: output.shape,
    texShape: output.getTextureShapeRC()
  };
  const source = shader_compiler.makeShader(programInputs, outFullShape,
      userCode);
  return {
    program,
    source,
    webGLProgram: gpgpu.createProgram(source),
    gpgpu,
    output
  };
}

function validateBinaryAndProgram<T extends NDArray, K extends NDArray>(
    binary: GPGPUBinary<T,K>, program: GPGPUProgram<T>, output: K) {
  const insOut = (program.inputs as NDArray[]).concat(output);
  const binInsOut =
      (binary.program.inputs as NDArray[]);
      // TODO: check output as well!!
      //.concat(binary.program.output);
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

export function runProgram<T extends NDArray, K extends NDArray>(
    binary: GPGPUBinary<T,K>, output?: K, program?: GPGPUProgram<T>): void {
  if (output == null) {
    output = binary.output;
  }
  if (program == null) {
    program = binary.program;
  }
  if (program !== binary.program) {
    validateBinaryAndProgram(binary, program, output);
  }
  if (!program.validate()) {
    throw Error('Validation failed');
  }
  const ins = program.inputs;
  const outTex = output.getTexture();
  const outTexShape = output.getTextureShapeRC();
  const gpgpu = binary.gpgpu;
  gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  gpgpu.setProgram(binary.webGLProgram);
  ins.forEach((input, i) => {
    const tex = input.getTexture();
    gpgpu.setInputMatrixTexture(tex, program.variableNames[i], i);
  });
  gpgpu.executeProgram();
}

export function makeShaderKey(
    program: GPGPUProgram<NDArray>, output: NDArray): string {
  const inputs = program.inputs;
  const params = program.getParams();
  const keyStart =
      inputs.concat(output).map(x => x.shape + '_' + x.getTextureShapeRC());
  const keyEnd = params.map(p => p.toString());
  const key = [program.constructor.name].concat(keyStart, keyEnd);
  return key.join('_');
}
