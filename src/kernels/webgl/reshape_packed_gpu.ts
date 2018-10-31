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
import {getChannels, getVecChannels} from '../packing_util';
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
    const inputChannels = getChannels('coords', inputRank);
    const inputCachedInnerDims = getChannels('coords', inputRank).slice(-2);

    let inputInnerDimsString = '', offset = '', getChannel = '', topLeftifyString = '';
    if(inputRank === 1) {
      getChannel = `float getChannel(vec4 frag, int index) {
        int mod = int(mod(float(index), 2.));
        if(mod == 0) return frag.x;
        return frag.y;
      }`;

      offset = `
        float modInputRC = mod(float(inputRC), 2.);
        int offset = modInputRC == 0. ? 0 : 1`;

      topLeftifyString = `return int(coords / 2) * 2;`;
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

      if(inputRank === 2) {
        topLeftifyString = `
          vec2 rowCol = vec2(${inputCachedInnerDims.join(',')});
          return ivec2(int(rowCol.x / 2.) * 2, int(rowCol.y / 2.) * 2);
        `;
      } else {
        const inputBatchChannelsJoined = getVecChannels('coords', inputRank - 2).join(',');

        topLeftifyString = `
          vec2 rowCol = vec2(${inputCachedInnerDims.join(',')});
          ivec2 topLeft = ivec2(int(rowCol.x / 2.) * 2, int(rowCol.y / 2.) * 2);
          return ${inputDtype}(${inputBatchChannelsJoined}, topLeft.x, topLeft.y);
        `;
      }
    }

    const mainLoop = getMainLoop(dtype, innerDims, outputShape.slice(-2), inputDtype, offset);

    this.userCode = `
      ${getReshapedInputCoords(inputShape)}
      ${getFlatIndex(outputShape)}
      ${getChannel}

      vec4 aCached0;
      vec4 aCached1;
      vec4 aCached2;

      ${inputDtype} aCoords0;
      ${inputDtype} aCoords1;
      ${inputDtype} aCoords2;

      ${inputDtype} topLeftify(${inputDtype} coords) {
        ${topLeftifyString}
      }

      vec4 getACached0(${inputDtype} coords) {
        aCoords0 = topLeftify(coords);
        aCached0 = getA(${inputChannels});
        return aCached0;
      }

      vec4 getACached1(${inputDtype} coords) {
        aCoords1 = topLeftify(coords);
        if(aCoords1 == aCoords0) {
          aCached1 = aCached0;
        } else {
          aCached1 = getA(${inputChannels});
        }
        return getA(${inputChannels});
      }

      vec4 getACached2(${inputDtype} coords) {
        aCoords2 = topLeftify(coords);
        if(aCoords2 == aCoords0) {
          aCached2 = aCached0;
        } else if(aCoords2 == aCoords1) {
          aCached2 = aCached1;
        } else {
          aCached2 = getA(${inputChannels});
        }
        return getA(${inputChannels});
      }

      vec4 getACached3(${inputDtype} coords) {
        ${inputDtype} aCoords3 = topLeftify(coords);

        if(aCoords3 == aCoords0) {
          return aCached0;
        } else if(aCoords3 == aCoords1) {
          return aCached1;
        } else if(aCoords3 == aCoords2) {
          return aCached2;
        }

        return getA(${inputChannels});
      }

      void main() {
        ${dtype} rc = getOutputCoords();

        vec4 result = vec4(0.);

        ${mainLoop}

        setOutput(result);
      }
    `;
  }
}

function getMainLoop(dtype: string, innerDims: string[], shapeInnerDims: number[], inputDtype: string, offset: string) {
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

        result[${i}] = getChannel(getACached${i}(inputRC), offset);

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