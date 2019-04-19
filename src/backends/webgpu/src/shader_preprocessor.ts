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

export function getCoordsDataType(rank: number): string {
  if (rank <= 1) {
    return 'int';
  } else if (rank === 2) {
    return 'ivec2';
  } else if (rank === 3) {
    return 'ivec3';
  } else if (rank === 4) {
    return 'ivec4';
  } else if (rank === 5) {
    return 'ivec5';
  } else if (rank === 6) {
    return 'ivec6';
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
};

export function makeShader(
    inputTypes: Array<{dtype: DataType, shape: number[]}>,
    variableNames: string[], outputData: {dtype: DataType, shape: number[]},
    userCode: string, tileSize: number): string {
  let tileSizeSnippet: string;
  if (tileSize != null) {
    tileSizeSnippet = `const uint TileSize = ${tileSize};
    layout (local_size_x = TileSize, local_size_y = TileSize, 
      local_size_z = 1) in;`;
  }
  const prefixSnippets: string[] = [];
  variableNames.forEach((x, i) => {
    prefixSnippets.push(`
      layout(std430, set = 0, binding = ${i}) readonly buffer ssb${x} {
        ${mapToGlslTypes(inputTypes[i].dtype)} ${x}[];
      };
    `);
  });

  // Output buffer.
  prefixSnippets.push(`
    layout(std430, set = 0, binding = ${
      variableNames.length}) writeonly buffer ssbOut {
      float result[];
    };
  `);

  const outputSamplingSnippet = getOutputSamplingSnippet(outputData.shape);

  const source = [
    SHADER_PREFIX, tileSizeSnippet, prefixSnippets.join('\n'),
    outputSamplingSnippet, userCode
  ].join('\n');

  return source;
}

const SHADER_PREFIX = `
  #version 450
`;

function getOutputSamplingSnippet(outShape: number[]): string {
  switch (outShape.length) {
    case 2:
      return getOutput2DCoords(outShape as [number, number]);
    case 3:
      return getOutput3DCoords(outShape as [number, number, number]);
    default:
      throw new Error(
          `${outShape.length}-D output sampling is not yet supported`);
  }
}

function getOutput2DCoords(shape: [number, number]) {
  return `
    ivec2 getOutputCoords(uint index) {
      uint r = index / ${shape[1]};
      uint c = index - r * ${shape[1]};
      return ivec2(r, c);
    }
  `;
}

function getOutput3DCoords(shape: [number, number, number]) {
  return `ivec3 getOutputCoords(uint index) {
    uint d = index / ${shape[1] * shape[2]};
    index -= d * ${shape[1] * shape[2]};
    uint r = index / ${shape[2]};
    uint c = index - r * ${shape[2]};

    return ivec3(d, r, c);
  }`;
}