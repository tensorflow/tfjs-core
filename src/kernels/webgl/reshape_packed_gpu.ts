/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';
import {getChannels} from '../packing_util';
import * as shader_util from './shader_compiler_util';
import * as util from '../../util';

export class ReshapePackedProgram implements GPGPUProgram {
  variableNames = ['A'];
  usesPackedTextures = true;
  outputShape: number[];
  userCode: string;

  constructor(outputShape: number[], inputShape: number[]) {
    this.outputShape = outputShape;
    const rank = outputShape.length;
    const dtype = getCoordsDataType(rank);
    const innerDims = getChannels('thisRC', rank).slice(-2);

    const inputRank = inputShape.length;
    const inputDtype = getCoordsDataType(inputRank);
    const inputChannels = getChannels('inputRC', inputRank);

    let inputInnerDimsString = '', offset = '', input = '', getChannel = '';
    if(inputRank === 1) {
      getChannel = `float getChannel(vec4 frag, int index) {
        int mod = int(mod(float(index), 2.));
        if(mod == 0) return frag.x;
        return frag.y;
      }`;

      offset = `
        float modInputRC = mod(float(inputRC), 2.);
        int offset = modInputRC == 0. ? 0 : 1`;

      input = `getChannel(getA(${inputChannels}), offset)`;
    } else {
      getChannel = `float getChannel(vec4 frag, int index) {
        int mod = int(mod(float(index), 4.));
        if(mod == 0) return frag.x;
        if(mod == 1) return frag.y;
        if(mod == 2) return frag.z;
        return frag.w;
      }`;

      const inputTopLeftInnerDims = getChannels('inputRC', inputRank).slice(-2);
      inputInnerDimsString = `vec2(float(${inputTopLeftInnerDims[0]}), float(${inputTopLeftInnerDims[1]}))`;
      offset = `
        vec2 inputRCInnerDims = ${inputInnerDimsString};
        vec2 modInputRC = mod(inputRCInnerDims, 2.);
        int offset = modInputRC.x == 0. ?
          (modInputRC.y == 0. ? 0 : 1) :
          (modInputRC.y == 0. ? 2 : 3)`;

      input = `getChannel(getA(${inputChannels}), offset)`;
    }

    const mainLoop = getMainLoop(dtype, innerDims, outputShape.slice(-2), inputDtype, input, offset);

    this.userCode = `
      ${getReshapedInputCoords(inputShape)}
      ${getFlatIndex(outputShape)}
      ${getChannel}

      void main() {
        ${dtype} rc = getOutputCoords();

        vec4 result = vec4(0.);

        ${mainLoop}

        setOutput(result);
      }
    `;
  }
}

function getMainLoop(dtype: string, innerDims: string[], shapeInnerDims: number[], inputDtype: string, input: string, offset: string) {
  let channels: number, outputCoordRows: string, outputCoordCols: string, inBoundsCheck: string;
  if(dtype === 'int') {
    channels = 2;
    outputCoordCols = innerDims[0];
    inBoundsCheck = `${outputCoordCols} < ${shapeInnerDims[0]}`;
  } else {
    channels = 4;
    outputCoordRows = innerDims[0];
    outputCoordCols = innerDims[1];
    inBoundsCheck = `${outputCoordRows} < ${shapeInnerDims[0]} && ${outputCoordCols} < ${shapeInnerDims[1]}`;
  }

  let result = `
    int flatIndex;
    ${inputDtype} inputRC;
    ${dtype} thisRC;
  `;

  for(let i=0; i<channels; i++) {
    let thisRC = `thisRC = rc;`;
    if(i % 2 === 1) {
      thisRC += `${outputCoordCols} += 1;`;
    }
    if(i > 1) {
      thisRC += `${outputCoordRows} += 1;`;
    }

    result += `
      ${thisRC}
      ${i > 0 ? `if(${inBoundsCheck}){` : ''}

        flatIndex = getFlatIndex(thisRC);

        inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
        ${offset};

        result[${i}] = ${input};

      ${i > 0 ? '}' : ''}
    `;
  }

  return result;
}

function getFlatIndex(shape: number[]): string {
  const rank = shape.length;
  util.assert(rank < 7, `Packed ${rank}-D flat indexing is not yet supported`);

  const funcName = 'getFlatIndex';

  if(rank === 1) {
    return `
      int ${funcName}(int coords) {
        return coords;
      }
    `;
  }

  const strides = shader_util.getStrides(shape);
  let coords = ['x', 'y', 'z', 'w', 'u', 'v'].slice(0, rank).map(d => `coords.${d}`);
  const dotCoordsWithStrides = shader_util.dotify(coords, strides.map(d => d.toString()).concat(['1.']));

  return `
    int ${funcName}(ivec${rank} coords) {
      return round(${dotCoordsWithStrides});
    }
  `;
}

function getReshapedInputCoords(shape: number[]): string {
  const rank = shape.length;
  util.assert(rank < 7, `Packed ${rank}-D reshaping` +
          ` is not yet supported`);

  const funcName = 'inputCoordsFromReshapedOutCoords';

  if(rank === 1) {
    return `
      int ${funcName}(int index) {
        return index;
      }
    `;
  }

  const dims = ['r', 'c', 'd', 'd2', 'd3', 'd4'].slice(0, rank);
  const coordsFromIndexSnippet = shader_util.getLogicalCoordinatesFromFlatIndex(dims, shape);

  return `
    ivec${rank} ${funcName}(int index) {
      ${coordsFromIndexSnippet}
      return ivec${rank}(${dims.join(',')});
    }
  `;
}