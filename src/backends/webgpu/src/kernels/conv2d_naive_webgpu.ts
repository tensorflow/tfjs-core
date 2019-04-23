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

import * as tf from '@tensorflow/tfjs-core';
import {Conv2DInfo} from '@tensorflow/tfjs-core/dist/ops/conv_util';

import {computeDispatch} from '../webgpu_util';

import {WebGPUProgram} from './webgpu_program';

export class Conv2DNaiveProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['x', 'W'];
  uniforms = 'uvec4 xShape, outShape; uvec2 WShape, pad, stride;';
  workGroupSize: [number, number, number] = [4, 8, 1];

  constructor(convInfo: Conv2DInfo) {
    this.outputShape = convInfo.outShape;
    const dispatchLayout = {x: [2], y: [1], z: [0, 3]};
    this.dispatch =
        computeDispatch(dispatchLayout, this.outputShape, this.workGroupSize);

    tf.util.assert(
        convInfo.dataFormat === 'channelsLast',
        () => 'TODO: NCHW is unimplemented');
    tf.util.assert(
        convInfo.dilationHeight === 1 && convInfo.dilationWidth === 1,
        () => 'TODO: Dilation is unimplemented');

    this.userCode = `
      bool coordIsValid(uvec4 shape, uvec4 coord) {
        return all(lessThan(coord, shape));
      }

      float readInp(uint batch, uint row, uint col, uint chan) {
        ivec4 coord = ivec4(batch, row, col, chan);
        ivec4 shape = ivec4(xShape);
        return coordIsValid(shape, coord) ? x[getFlatIndex(coord, shape)] : 0;
      }

      float readFilt(uint row, uint col, uint xChannel, uint outChannel) {
        ivec4 coord = ivec4(row, col, xChannel, outChannel);
        ivec4 shape = ivec4(WShape, xShape[3], outShape[3]);
        return coordIsValid(shape, coord) ? W[getFlatIndex(coord, shape)] : 0;
      }

      void writeResult(uint batch, uint row, uint col, uint chan, float value) {
        ivec4 coord = ivec4(batch, row, col, chan);
        if (coordIsValid(outShape, coord)) {
          result[getFlatIndex(coord, ivec4(outShape))] = value;
        }
      }

      void main() {
        uvec2 globalXY = gl_GlobalInvocationID.xy;
        // Z = Batch * outShape[3] + Channel
        uint batch = gl_GlobalInvocationID.z / outShape[3];
        uint outChannel = gl_GlobalInvocationID.z % outShape[3];

        float acc = 0.0;

        for (uint y = 0; y < WShape[0]; ++y) {
          for (uint x = 0; x < WShape[1]; ++x) {
            for (uint xChannel = 0; xChannel < xShape[3]; ++xChannel) {
              float v = readInp(batch,
                  pad[0] + globalXY.y * stride[0] + y,
                  pad[1] + globalXY.x * stride[1] + x, xChannel);
              float f = readFilt(y, x, xChannel, outChannel);
              acc += v * f;
            }
          }
        }

        writeResult(batch, globalXY.y, globalXY.x, outChannel, acc);
      }
    `;
  }
}
