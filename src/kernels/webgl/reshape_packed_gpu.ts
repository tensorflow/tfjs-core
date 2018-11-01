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

import * as util from '../../util';
import {getChannels, getVecChannels} from '../packing_util';

import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';
import * as shader_util from './shader_compiler_util';

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
    const inputRCDims = getChannels('inputRC', inputRank);

    let inputRCInnerDims: string, topLeftifyLogic: string;
    if (inputRank === 1) {
      inputRCInnerDims = `vec2(0, inputRC)`;
      topLeftifyLogic = `return int(inputRC / 2) * 2;`;
    } else {
      inputRCInnerDims = `vec2(${
          getChannels('inputRC', inputRank)
              .slice(-2)
              .map(d => `float(${d})`)
              .join(',')});
      `;

      if (inputRank === 2) {
        topLeftifyLogic = `
          vec2 rowCol = ${inputRCInnerDims};
          return ivec2(int(rowCol.x / 2.) * 2, int(rowCol.y / 2.) * 2);
        `;
      } else {
        const inputRCBatchDims = getVecChannels('inputRC', inputRank - 2);
        topLeftifyLogic = `
          vec2 rowCol = ${inputRCInnerDims};
          ivec2 topLeft = ivec2(int(rowCol.x / 2.) * 2, int(rowCol.y / 2.) * 2);
          return ${inputDtype}(${
            inputRCBatchDims.join(',')}, topLeft.x, topLeft.y);
        `;
      }
    }

    const mainLoop = getMainLoop(
        dtype, innerDims, outputShape.slice(-2), inputDtype, inputRCInnerDims);

    // initializing coords to -1 so they will not be matched unless
    // cached entry was created
    let coordsInitialValue: string = '-1';
    for (let i = 0; i < inputRank - 1; i++) {
      coordsInitialValue += ',-1';
    }

    this.userCode = `
      ${getReshapedInputCoords(inputShape)}
      ${getFlatIndex(outputShape)}

      vec4 aCached0;
      vec4 aCached1;
      vec4 aCached2;

      ${inputDtype} aCoords0 = ${inputDtype}(${coordsInitialValue});
      ${inputDtype} aCoords1 = ${inputDtype}(${coordsInitialValue});
      ${inputDtype} aCoords2 = ${inputDtype}(${coordsInitialValue});

      ${inputDtype} topLeftify(${inputDtype} inputRC) {
        ${topLeftifyLogic}
      }

      vec4 getACached0(${inputDtype} inputRC) {
        aCoords0 = topLeftify(inputRC);
        aCached0 = getA(${inputRCDims});
        return aCached0;
      }

      vec4 getACached1(${inputDtype} inputRC) {
        aCoords1 = topLeftify(inputRC);
        if(aCoords1 == aCoords0) {
          aCached1 = aCached0;
        } else {
          aCached1 = getA(${inputRCDims});
        }
        return aCached1;
      }

      vec4 getACached2(${inputDtype} inputRC) {
        aCoords2 = topLeftify(inputRC);
        if(aCoords2 == aCoords0) {
          aCached2 = aCached0;
        } else if(aCoords2 == aCoords1) {
          aCached2 = aCached1;
        } else {
          aCached2 = getA(${inputRCDims});
        }
        return aCached2;
      }

      vec4 getACached3(${inputDtype} inputRC) {
        ${inputDtype} aCoords3 = topLeftify(inputRC);

        if(aCoords3 == aCoords0) {
          return aCached0;
        } else if(aCoords3 == aCoords1) {
          return aCached1;
        } else if(aCoords3 == aCoords2) {
          return aCached2;
        }

        return getA(${inputRCDims});
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

function getMainLoop(
    dtype: string, innerDims: string[], shapeInnerDims: number[],
    inputDtype: string, inputRCInnerDims: string) {
  let channels: number, outputCoordRows: string, outputCoordCols: string,
      inBoundsCheck: string;
  if (dtype === 'int') {
    channels = 2;
    outputCoordCols = innerDims[0];
    inBoundsCheck = `${outputCoordCols} < ${shapeInnerDims[0]}`;
  } else {
    channels = 4;
    outputCoordRows = innerDims[0];
    outputCoordCols = innerDims[1];
    inBoundsCheck = `${outputCoordRows} < ${shapeInnerDims[0]} && ${
        outputCoordCols} < ${shapeInnerDims[1]}`;
  }

  let result = `
    int flatIndex;
    ${inputDtype} inputRC;
    ${dtype} thisRC;
  `;

  for (let i = 0; i < channels; i++) {
    let thisRC = `thisRC = rc;`;
    if (i % 2 === 1) {
      thisRC += `${outputCoordCols} += 1;`;
    }
    if (i > 1) {
      thisRC += `${outputCoordRows} += 1;`;
    }

    result += `
      ${thisRC}
      ${i > 0 ? `if(${inBoundsCheck}){` : ''}

        flatIndex = getFlatIndex(thisRC);

        inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
        vec2 inputRCInnerDims = ${inputRCInnerDims};

        result[${i}] = getChannel(getACached${i}(inputRC), inputRCInnerDims);

      ${i > 0 ? '}' : ''}
    `;
  }

  return result;
}

function getFlatIndex(shape: number[]): string {
  const rank = shape.length;
  util.assert(rank < 7, `Packed ${rank}-D flat indexing is not yet supported`);

  const funcName = 'getFlatIndex';

  if (rank === 1) {
    return `
      int ${funcName}(int coords) {
        return coords;
      }
    `;
  }

  const strides = shader_util.getStrides(shape);
  let coords =
      ['x', 'y', 'z', 'w', 'u', 'v'].slice(0, rank).map(d => `coords.${d}`);
  const dotCoordsWithStrides =
      shader_util.dotify(coords, strides.map(d => d.toString()).concat(['1.']));

  return `
    int ${funcName}(ivec${rank} coords) {
      return round(${dotCoordsWithStrides});
    }
  `;
}

function getReshapedInputCoords(shape: number[]): string {
  const rank = shape.length;
  util.assert(
      rank < 7,
      `Packed ${rank}-D reshaping` +
          ` is not yet supported`);

  const funcName = 'inputCoordsFromReshapedOutCoords';

  if (rank === 1) {
    return `
      int ${funcName}(int index) {
        return index;
      }
    `;
  }

  const dims = ['r', 'c', 'd', 'd2', 'd3', 'd4'].slice(0, rank);
  const coordsFromIndexSnippet =
      shader_util.getLogicalCoordinatesFromFlatIndex(dims, shape);

  return `
    ivec${rank} ${funcName}(int index) {
      ${coordsFromIndexSnippet}
      return ivec${rank}(${dims.join(',')});
    }
  `;
}