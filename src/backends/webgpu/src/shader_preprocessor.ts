/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {DataType} from '@tensorflow/tfjs-core';
import {generateGetOutputCoords} from './shader_util';

export function getCoordsDataType(rank: number): string {
  if (rank <= 1) {
    return 'uint';
  } else if (rank === 2) {
    return 'ivec2';
  } else if (rank === 3) {
    return 'ivec3';
  } else if (rank === 4) {
    return 'ivec4';
  } else {
    throw Error(`GPU for rank ${rank} is not yet supported`);
  }
}

type GLSLDataType = 'float'|'uint';
function mapToGlslTypes(type: DataType): GLSLDataType|DataType {
  if (type === 'float32') {
    return 'float';
  }
  if (type === 'int32') {
    return 'uint';
  }
  return type;
}

interface ProgramParams {
  dispatchLayout: {x: number[], y?: number[], z?: number[]};
  tileSize?: [number, number?, number?];
  variableNames: string[];
  uniforms?: string;
  userCode: string;
}

interface InputInfo {
  dtype: DataType;
  shape: number[];
  name: string;
}

export function makeShader(
    inputInfo: InputInfo[], outputData: {dtype: DataType, shape: number[]},
    program: ProgramParams): string {
  const prefixSnippets: string[] = [];

  if (program.tileSize != null) {
    const ts = program.tileSize;

    ts[1] = ts[1] || 1;
    ts[2] = ts[2] || 1;
    prefixSnippets.push(`
      const uvec3 TileSize = uvec3(${ts[0]}, ${ts[1]}, ${ts[2]});
      layout (local_size_x = TileSize.x,
              local_size_y = TileSize.y,
              local_size_z = TileSize.z) in;
    `);
  }

  // Output buffer.
  prefixSnippets.push(`
    layout(std430, set = 0, binding = 0) writeonly buffer ssbOut {
      float result[];
    };
  `);

  let uniformDeclaration = '';
  program.variableNames.forEach((x, i) => {
    uniformDeclaration += `${getCoordsDataType(inputInfo[i].shape.length)} ${
        x.substring(0, 1).toLowerCase()}Shape;`;
    prefixSnippets.push(`
      layout(std430, set = 0, binding = ${1 + i}) readonly buffer ssb${x} {
        ${mapToGlslTypes(inputInfo[i].dtype)} ${x}[];
      };
    `);
  });

  uniformDeclaration +=
      `${getCoordsDataType(outputData.shape.length)} outShape;`;

  if (program.uniforms) {
    uniformDeclaration += program.uniforms;
  }

  prefixSnippets.push(`
    layout(std140, set = 0, binding = ${
      1 + program.variableNames.length}) uniform Uniforms {
      ${uniformDeclaration}
    };
  `);

  const inputSamplingSnippet =
      inputInfo.map(x => getInputSamplingSnippet(x, outputData.shape))
          .join('\n');

  const outputSamplingSnippet =
      generateGetOutputCoords(program.dispatchLayout, outputData.shape.length);

  const source = [
    SHADER_PREFIX, prefixSnippets.join('\n'), SAMPLING_SNIPPETS,
    outputSamplingSnippet, inputSamplingSnippet, SET_OUTPUT_SNIPPET,
    program.userCode
  ].join('\n');
  console.log(source);
  return source;
}

const SHADER_PREFIX = `
  #version 450
`;

const SAMPLING_SNIPPETS = `
  uint getFlatIndex(uint coord, uint shape) {
    return coord;
  }

  uint getFlatIndex(ivec2 coords, ivec2 shape) {
    return uint(dot(coords, ivec2(shape.y, 1.)));
  }

  uint getFlatIndex(ivec3 coords, ivec3 shape) {
    return uint(dot(coords, ivec3(shape.y * shape.z, shape.z, 1.)));
  }

  uint getFlatIndex(ivec4 coords, ivec4 shape) {
    return uint(dot(coords, ivec4(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1.)));
  }
`;

const SET_OUTPUT_SNIPPET = `
  void setOutput(uint flatIndex, float value) {
    result[flatIndex] = value;
  }
`;

function getInputSamplingSnippet(
    inInfo: InputInfo, outShape: number[]): string {
  let res = '';

  const inShape = inInfo.shape;
  if (inShape.length <= outShape.length) {
    res += getSamplerAtOutputCoords(inInfo, outShape);
  }

  return res;
}

function getSamplerAtOutputCoords(inInfo: InputInfo, outShape: number[]) {
  const texName = inInfo.name;
  const texFuncSnippet = texName.charAt(0).toUpperCase() + texName.slice(1);
  const funcName = 'get' + texFuncSnippet + 'AtOutCoords';
  const type = getCoordsDataType(outShape.length);

  return `
    float ${funcName}() {
      ${type} coords = getOutputCoords();
      return ${texName}[getFlatIndex(coords, outShape)];
    }
  `;
}