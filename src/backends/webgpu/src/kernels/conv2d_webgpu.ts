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

import {Conv2DInfo} from '@tensorflow/tfjs-core/dist/ops/conv_util';
import {assert} from '@tensorflow/tfjs-core/dist/util';

import {WebGPUProgram} from './webgpu_program';

export class Conv2DProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['inp', 'flt'];
  uniforms = 'uvec4 inpShape, outShape; uvec2 fltShape, pad, stride;';
  tileSize: [number, number, number] = [2, 2, 1];

  constructor(convInfo: Conv2DInfo) {
    this.outputShape = convInfo.outShape;
    this.dispatch = [
      Math.ceil(this.outputShape[2] / this.tileSize[0]),
      Math.ceil(this.outputShape[1] / this.tileSize[1]),
      Math.ceil(this.outputShape[0] * this.outputShape[3] / this.tileSize[2]),
    ];

    assert(
        convInfo.dataFormat == 'channelsLast',
        () => 'TODO: NCHW is unimplemented');
    assert(
        convInfo.dilationHeight === 1 && convInfo.dilationWidth === 1,
        () => 'TODO: Dilation is unimplemented');

    this.userCode = `
      bool coordIsValid(uvec4 shape, uvec4 coord) {
        return all(lessThan(coord, shape));
      }

      uint toIndex(uvec4 shape, uvec4 coord) {
          uint i0 =                 coord[0];
          uint i1 = i0 * shape[1] + coord[1];
          uint i2 = i1 * shape[2] + coord[2];
          uint i3 = i2 * shape[3] + coord[3];
          return i3;
      }

      float readInp(uint b, uint y, uint x, uint c) {
        uvec4 coord = uvec4(b, y, x, c);
        uvec4 shape = inpShape;
        return coordIsValid(shape, coord) ? inp[toIndex(shape, coord)] : 0;
      }

      float readFilt(uint y, uint x, uint inpChannel, uint outChannel) {
        uvec4 coord = uvec4(y, x, inpChannel, outChannel);
        uvec4 shape = uvec4(fltShape, inpShape[3], outShape[3]);
        return coordIsValid(shape, coord) ? flt[toIndex(shape, coord)] : 0;
      }

      void writeResult(uint b, uint y, uint x, uint c, float value) {
        uvec4 coord = uvec4(b, y, x, c);
        if (coordIsValid(outShape, coord)) {
          result[toIndex(outShape, coord)] = value;
        }
      }

      void main() {
        uvec3 localXYZ = gl_LocalInvocationID;
        uvec3 globalXYZ = TileSize * gl_WorkGroupID + localXYZ;
        uvec2 globalXY = globalXYZ.xy;
        // Z = Batch * outShape[3] + Channel
        uint batch = globalXYZ.z / outShape[3];
        uint outChannel = globalXYZ.z % outShape[3];

        float acc = 0.0;

        for (uint y = 0; y < fltShape[0]; ++y) {
          for (uint x = 0; x < fltShape[1]; ++x) {
            for (uint inpChannel = 0; inpChannel < inpShape[3]; ++inpChannel) {
              float v = readInp(batch,
                  pad[0] + globalXY.y * stride[0] + y,
                  pad[1] + globalXY.x * stride[1] + x, inpChannel);
              float f = readFilt(y, x, inpChannel, outChannel);
              acc += v * f;
            }
          }
        }

        writeResult(batch, globalXY.y, globalXY.x, outChannel, acc);
      }
    `;
  }
}
