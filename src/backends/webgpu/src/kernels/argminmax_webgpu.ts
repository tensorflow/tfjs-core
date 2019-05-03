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

import {util} from '@tensorflow/tfjs-core';
import * as axis_util from '@tensorflow/tfjs-core/dist/ops/axis_util';

import {WebGPUProgram} from './webgpu_program';

export class ArgMinMaxProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  workGroupSize: [number, number, number];
  variableNames = ['x'];
  uniforms: string;

  constructor(inputShape: number[], axis: number, reduceType: 'min'|'max') {
    const axes = [axis];
    axis_util.assertAxesAreInnerMostDims('argMax', axes, inputShape.length);

    // axis, rank, dim0, dim1, ..., (allocate at least 10 so most programs can
    // use the same shader)
    // These uniforms are declare as uvec4's because arrays in GLSL uniform
    // blocks are padded according to layout std140
    const numUniforms = Math.max(2 + inputShape.length, 10);
    this.uniforms = `uvec4 uniforms[${Math.ceil(numUniforms / 4)}];`;

    const op = reduceType === 'min' ? '<' : '>';

    // |outShape| is the shape with the removed axis
    // |reduceShape| is the shape we are reducing. i.e. [ inputShape[axis] ]
    const [outputShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(inputShape, axes);

    this.outputShape = outputShape;

    // Length of the axis we're reducing on.
    const reduceSize = util.sizeFromShape(reduceShape);

    const outputSize = util.sizeFromShape(outputShape);

    // The number of comparisons each thread will do
    const reductionFactor = 16;
    const xMaxThreads = 1024;  // gl_MaxComputeWorkGroupSize
    const xThreads =
        Math.min(Math.ceil(reduceSize / reductionFactor), xMaxThreads);

    this.workGroupSize = [xThreads, 1, 1];
    this.dispatch = [1, outputSize, 1];

    // When xThreads > 1, each thread reduces Length / xThreads values.
    // Thes results are stored in shared memory and iteratively reduced.
    const reduceInSharedMemory = xThreads > 1;
    const sharedMemorySnippet = `
      shared uint xBestIndices[WorkGroupSize];
      shared float xBestValues[WorkGroupSize];
    `;

    const sharedMemoryReduceSnippet = `
      xBestIndices[gl_LocalInvocationID.x] = bestIndex;
      xBestValues[gl_LocalInvocationID.x] = bestValue;

      uint currentSize = WorkGroupSize;
      while (currentSize > 1) {
        memoryBarrier();

        for (uint w = 0; w < ${reductionFactor}; ++w) {
          uint i = gl_LocalInvocationID.x * ${reductionFactor} + w;
          if (i < currentSize) {
            uint candidateIndex = xBestIndices[i];
            float candidate = xBestValues[i];
            if (candidate ${op} bestValue && !isnan(candidate)) {
              bestValue = candidate;
              bestIndex = candidateIndex;
            }
          }
        }

        xBestIndices[gl_LocalInvocationID.x] = bestIndex;
        xBestValues[gl_LocalInvocationID.x] = bestValue;

        currentSize = DIV_CEIL(currentSize, ${reductionFactor});
      }

      if (gl_LocalInvocationID.x == 0) {
        setOutput(gl_GlobalInvocationID.y, float(bestIndex));
      }
    `;

    this.userCode = `
      #define UNIFORM(x) uniforms[(x) / 4][(x) % 4]
      #define AXIS UNIFORM(0)
      #define X_RANK UNIFORM(1)
      #define X_SHAPE_DIM(axis) UNIFORM(2 + axis)

      #define DIV_CEIL(x, y) (((x) - 1) / (y) + 1)

      const uint WorkGroupSize = gl_WorkGroupSize.x;

      ${reduceInSharedMemory ? sharedMemorySnippet : ''}

      // gl_GlobalInvocationID.y is the flattened index into the output Tensor.
      // In order to get a flattened index into the input tensor, we need to
      // unpack gl_GlobalInvocationID.y into it's dimensional components i.e.
      // an n-dimensional index, and we need to assemble the components together
      // with the desired index along the reduced dimension.
      // This function outputs the offset to the first value along dimension
      // AXIS and the stride to get the next value of the input along AXIS.
      uvec2 getInputCoordInfo() {
        uint flatIndex = gl_GlobalInvocationID.y;

        uint stride = 1;
        uint inputStride = 1;
        uint offset = 0;

        for (uint r = 1; r <= X_RANK; ++r) {
          uint length = X_SHAPE_DIM(X_RANK - r);
          if (X_RANK - r == AXIS) {
            inputStride = stride;
          } else {
            uint dimIndex = flatIndex % length;
            flatIndex = flatIndex / length;
            offset += dimIndex * stride;
          }
          stride *= length;
        }
        return uvec2(offset, inputStride);
      }

      uint getInputIndex(uvec2 coordInfo, uint index) {
        return coordInfo[0] + coordInfo[1] * index;
      }

      void main() {
        const uvec2 coordInfo = getInputCoordInfo();

        uint bestIndex = 0;
        float bestValue = x[getInputIndex(coordInfo, bestIndex)];

        const uint Length = X_SHAPE_DIM(AXIS);
        const uint WorkPerThread = DIV_CEIL(Length, WorkGroupSize);

        for (uint w = 0; w < WorkPerThread; ++w) {
          uint i = gl_GlobalInvocationID.x * WorkPerThread + w;
          if (i < Length) {
            float candidate = x[getInputIndex(coordInfo, i)];
            if (candidate ${op} bestValue && !isnan(candidate)) {
              bestValue = candidate;
              bestIndex = i;
            }
          }
        }

        ${
        reduceInSharedMemory ?
            sharedMemoryReduceSnippet :
            'setOutput(gl_GlobalInvocationID.y, float(bestIndex));'}
      }
    `;
  }
}
