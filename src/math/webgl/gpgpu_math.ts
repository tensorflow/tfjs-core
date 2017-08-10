import {NDArray} from '../ndarray';

import {GPGPUContext} from './gpgpu_context';
import * as shader_compiler from './shader_compiler';
import * as util from '../../util';
import {TextureManager} from './texture_manager';
import * as webgl_util from './webgl_util';

export interface GPGPUProgram<T extends NDArray> {
  inputs: T[];
  variableNames: string[];
  outputShape: number[];
  params: Array<{}>;
  userCode: string;
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
  const userCode = program.userCode;
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

function validateBinaryAndProgram(aArrays: NDArray[], bArrays: NDArray[]) {
  aArrays.forEach((a, i) => {
    const shapeA = a.shape;
    const texShapeA = a.getTextureShapeRC();
    const shapeB = bArrays[i].shape;
    const texShapeB = bArrays[i].getTextureShapeRC();

    if (!util.arraysEqual(shapeA, shapeB)) {
      throw Error(`Binary was compiled with different shapes than ` +
          `the current args. Shapes ${shapeA} and ${shapeB} must match`);
    }
    if (!util.arraysEqual(texShapeA, texShapeB)) {
      throw Error(`Binary was compiled with different texture shapes than the` +
          ` current args. Shape ${texShapeA} and ${texShapeB} must match`);
    }
  });
}

export function runProgram<T extends NDArray, K extends NDArray>(
    binary: GPGPUBinary<T,K>, inputs?: T[], output?: K): void {
  if (inputs == null) {
    inputs = binary.program.inputs;
  } else {
    validateBinaryAndProgram(binary.program.inputs, inputs);
  }
  if (output == null) {
    output = binary.output;
  } else {
    validateBinaryAndProgram([binary.output], [output]);
  }
  const outTex = output.getTexture();
  const outTexShape = output.getTextureShapeRC();
  const gpgpu = binary.gpgpu;
  gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  gpgpu.setProgram(binary.webGLProgram);
  inputs.forEach((input, i) => {
    const tex = input.getTexture();
    gpgpu.setInputMatrixTexture(tex, binary.program.variableNames[i], i);
  });
  gpgpu.executeProgram();
}

export function makeShaderKey(
    program: GPGPUProgram<NDArray>, output: NDArray): string {
  const inputs = program.inputs;
  const params = program.params;
  const keyStart =
      inputs.concat(output).map(x => x.shape + '_' + x.getTextureShapeRC());
  const keyEnd = params.map(p => p.toString());
  const key = [program.constructor.name].concat(keyStart, keyEnd);
  return key.join('_');
}
