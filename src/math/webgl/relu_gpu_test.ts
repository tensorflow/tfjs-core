/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import * as test_util from '../../test_util';
import {GPGPUContext} from './gpgpu_context';
import {UnaryOpProgram, UnaryOp} from './unaryop_gpu';
import * as unaryop_gpu from './unaryop_gpu';
import {Array2D} from '../ndarray';

describe('relu_gpu', () => {
  it('returns a matrix with the shape of the input matrix', () => {
    const a = new Float32Array(17 * 257);
    const result = uploadReluDownload(a, 17, 257);
    expect(result.length).toEqual(a.length);
  });

  it('does nothing to positive values', () => {
    const a = new Float32Array([1]);
    const result = uploadReluDownload(a, 1, 1);
    expect(result[0]).toBeCloseTo(a[0]);
  });

  it('sets negative values to 0', () => {
    const a = new Float32Array([-1]);
    const result = uploadReluDownload(a, 1, 1);
    expect(result[0]).toEqual(0);
  });

  it('preserves zero values', () => {
    const a = new Float32Array([0]);
    const result = uploadReluDownload(a, 1, 1);
    expect(result[0]).toEqual(0);
  });

  it('operates on multiple values', () => {
    const a = new Float32Array([-1, 2, -3, 4, -5, 6, -7, 8, -9]);
    const result = uploadReluDownload(a, 3, 3);
    test_util.expectArraysClose(
        result, new Float32Array([0, 2, 0, 4, 0, 6, 0, 8, 0]), 0.0001);
  });

  it('propagates NaNs', () => {
    const a = new Float32Array([-1, NaN, -3, 4, 6, 0, -3, 1]);
    const result = uploadReluDownload(a, 1, 8);
    test_util.expectArraysClose(
        result, new Float32Array([0, NaN, 0, 4, 6, 0, 0, 1]), 0.0001);
  });
});

function uploadReluDownload(
    a: Float32Array, rows: number, cols: number): Float32Array {
  return unaryop_gpu.uploadUnaryDownload(a, rows, cols, UnaryOp.RELU);
}
