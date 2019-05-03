/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ENV} from '../../environment';
import {Tensor} from '../../tensor';
import {TypedArray} from '../../types';
import * as util from '../../util';

import {GPGPUContext} from './gpgpu_context';
import {assembleProgramSource, InputInfo, ShapeInfo} from './shader_compiler';
import {TextureData} from './tex_util';

export interface GPGPUProgram {
  variableNames: string[];
  outputShape: number[];
  userCode: string;
  usesPackedTextures?: boolean;
  isPackShader?: boolean;  // This property is used to single out the packing
                           // shader so its output does not get eagerly unpacked
                           // by backend_webgl.compileAndRun.
}

export interface GPGPUBinary {
  webGLProgram: WebGLProgram;
  program: GPGPUProgram;
  uniformLocations: {[name: string]: WebGLUniformLocation};
  source: string;
  inShapeInfos: ShapeInfo[];
  outShapeInfo: ShapeInfo;
  infLoc: WebGLUniformLocation;
  nanLoc: WebGLUniformLocation;
}

export interface TensorData {
  shape: number[];
  texData: TextureData;
  isUniform: boolean;
  // Available when we decide to upload as uniform instead of texture.
  uniformValues?: TypedArray;
}

export function compileProgram<T extends Tensor, K extends Tensor>(
    gpgpu: GPGPUContext, program: GPGPUProgram, inputs: TensorData[],
    output: TensorData): GPGPUBinary {
  const engineState = window._tfengine.state;
  const scopeName =
      engineState.activeScope != null ? engineState.activeScope.name : '';
  console.group(`compileProgram: ${scopeName}`);



  const {source, inputInfos, outShapeInfo} =
      assembleProgramSource(program, inputs, output);

  console.log('compileProgram*****', inputInfos);
  const webGLProgram = gpgpu.createProgram(source);

  // TKTK uniforms

  // Add special uniforms (NAN, INFINITY)
  let infLoc: WebGLUniformLocation = null;
  const nanLoc = gpgpu.getUniformLocation(webGLProgram, 'NAN', false);
  if (ENV.getNumber('WEBGL_VERSION') === 1) {
    infLoc = gpgpu.getUniformLocation(webGLProgram, 'INFINITY', false);
  }

  // Add user-defined uniforms
  const uniformLocations: {[name: string]: WebGLUniformLocation} = {};
  for (let i = 0; i < program.variableNames.length; i++) {
    const varName = program.variableNames[i];
    const shouldThrow = false;
    uniformLocations[varName] =
        gpgpu.getUniformLocation(webGLProgram, varName, shouldThrow);
    uniformLocations[`offset${varName}`] =
        gpgpu.getUniformLocation(webGLProgram, `offset${varName}`, shouldThrow);
  }

  // Add uniforms for input shapes;

  for (let i = 0; i < inputInfos.length; i++) {
    const inputInfo = inputInfos[i];
    console.log('Add uniformsinputInfo', inputInfo);
    const inShapeInfo = inputInfo.shapeInfo;
    if (inShapeInfo.logicalShape.length > 0) {
      const varShapeName = `shape${inputInfo.name}`;
      const varTexShapeName = `texShape${inputInfo.name}`;
      const shouldThrow = false;
      uniformLocations[varShapeName] =
          gpgpu.getUniformLocation(webGLProgram, varShapeName, shouldThrow);
      console.log('set varTexShapeName', varTexShapeName, inputInfo);
      uniformLocations[varTexShapeName] =
          gpgpu.getUniformLocation(webGLProgram, varTexShapeName, shouldThrow);
    }
  }

  console.groupEnd();

  return {
    program,
    source,
    webGLProgram,
    uniformLocations,
    inShapeInfos: inputInfos.map(x => x.shapeInfo),
    outShapeInfo,
    infLoc,
    nanLoc,
  };
}

function validateBinaryAndProgram(
    shapeInfos: ShapeInfo[], inputs: TensorData[]) {
  if (shapeInfos.length !== inputs.length) {
    throw Error(
        `Binary was compiled with ${shapeInfos.length} inputs, but ` +
        `was executed with ${inputs.length} inputs`);
  }

  shapeInfos.forEach((s, i) => {
    const shapeA = s.logicalShape;
    const input = inputs[i];
    const shapeB = input.shape;

    if (!util.arraysEqual(shapeA, shapeB)) {
      throw Error(
          `Binary was compiled with different shapes than ` +
          `the current args. Shapes ${shapeA} and ${shapeB} must match`);
    }
    // The input is uploaded as uniform.
    if (s.isUniform && input.isUniform) {
      return;
    }

    const texShapeA = s.texShape;
    const texShapeB = input.isUniform ? null : input.texData.texShape;
    if (!util.arraysEqual(texShapeA, texShapeB)) {
      throw Error(
          `Binary was compiled with different texture shapes than the` +
          ` current args. Shape ${texShapeA} and ${texShapeB} must match`);
    }
  });
}

export function runProgram<T extends Tensor, K extends Tensor>(
    gpgpu: GPGPUContext, binary: GPGPUBinary, inputs: TensorData[],
    output: TensorData,
    customSetup?: (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) =>
        void): void {
  validateBinaryAndProgram(binary.inShapeInfos, inputs);
  validateBinaryAndProgram([binary.outShapeInfo], [output]);

  const outTex = output.texData.texture;
  const outTexShape = output.texData.texShape;
  if (output.texData.isPacked) {
    gpgpu.setOutputPackedMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  } else {
    gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
  }
  gpgpu.setProgram(binary.webGLProgram);

  // Set special uniforms (NAN, INFINITY)
  if (ENV.getNumber('WEBGL_VERSION') === 1) {
    if (binary.infLoc !== null) {
      gpgpu.gl.uniform1f(binary.infLoc, Infinity);
    }
  }
  if (binary.nanLoc !== null) {
    gpgpu.gl.uniform1f(binary.nanLoc, NaN);
  }

  // Set user-defined inputs
  inputs.forEach((input, i) => {
    const varName = binary.program.variableNames[i];
    const varLoc = binary.uniformLocations[varName];
    const varOffsetLoc = binary.uniformLocations[`offset${varName}`];

    if (varLoc == null) {
      // The compiler inferred that this variable is not used in this shader.
      return;
    }

    if (input.isUniform) {
      // Upload the values of the tensor as uniform.
      if (util.sizeFromShape(input.shape) < 2) {
        gpgpu.gl.uniform1f(varLoc, input.uniformValues[0]);
      } else {
        let vals = input.uniformValues;
        if (!(vals instanceof Float32Array)) {
          vals = new Float32Array(vals);
        }
        gpgpu.gl.uniform1fv(varLoc, vals);
      }
      return;
    } else {
      console.log('inputs.forEach: input', i, input);
      // Upload the shape information as a uniform as well.
      // Upload the shape information for this input to the corresponding
      // uniform;
      const varShapeName = `shape${varName}`;
      const varShapeLoc = binary.uniformLocations[varShapeName];
      console.log('varShapeLoc', varShapeLoc);
      let shape: number[]|Float32Array = input.shape;
      if (!(shape instanceof Float32Array)) {
        shape = new Float32Array(shape);
      }
      gpgpu.gl.uniform1fv(varShapeLoc, shape);

      // TK UPLOADUNIFORM

      const varTexShapeName = `texShape${varName}`;
      console.log('varTexShapeName', varTexShapeName);
      const varTexShapeLoc = binary.uniformLocations[varTexShapeName];
      console.log('varTexShapeLoc', varTexShapeLoc);
      let texShape: number[]|Float32Array = input.texData.shape;
      if (!(texShape instanceof Float32Array)) {
        texShape = new Float32Array(texShape);
      }
      console.log('runProgram: texShape', texShape);
      gpgpu.gl.uniform1fv(varTexShapeLoc, texShape);
    }

    // If the input was sliced, upload the flat offset index.
    if (input.texData.slice != null && varOffsetLoc != null) {
      gpgpu.gl.uniform1i(varOffsetLoc, input.texData.slice.flatOffset);
    }

    gpgpu.setInputMatrixTexture(input.texData.texture, varLoc, i);
  });

  if (customSetup != null) {
    customSetup(gpgpu, binary.webGLProgram);
  }
  gpgpu.executeProgram();
}

export function makeShaderKey(
    program: GPGPUProgram, inputs: TensorData[], output: TensorData): string {
  console.time('makeShaderKey:partial');
  let keyInputs = '';
  inputs.concat(output).forEach(x => {
    const hasOffset = x.texData != null && x.texData.slice != null &&
        x.texData.slice.flatOffset > 0;
    const texShape = x.isUniform ? 'uniform' : x.texData.texShape;
    keyInputs += `${x.shape}_${texShape}_${hasOffset}`;
  });
  const keyUserCode = program.userCode;
  let key = program.constructor.name;
  // Fast string concat. See https://jsperf.com/string-concatenation/14.
  key += '_' + keyInputs + '_' + keyUserCode;
  console.timeEnd('makeShaderKey:partial');
  return key;
}

export function makeShaderKeyWhole(
    program: GPGPUProgram, inputs: TensorData[], output: TensorData) {
  console.time('makeShaderKey:whole');
  const {source} = assembleProgramSource(program, inputs, output);
  console.timeEnd('makeShaderKey:whole');
  return source;
}