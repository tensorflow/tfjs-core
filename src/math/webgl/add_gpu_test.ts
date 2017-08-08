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

import {Array1D, Array2D, Array3D, NDArray} from '../ndarray';
import * as add_gpu from './add_gpu';
import {NDArrayMathGPU} from '../math_gpu';
import * as util from '../../util';
import {TextureManager} from './texture_manager';
import {GPGPU} from '../ndarray';
import {AddProgram} from './add_gpu';
import * as gpgpu_program from './shader_program';

describe('add_gpu', () => {
  beforeEach(() => {
    const math = new NDArrayMathGPU();
  });

  it('returns a 1x1 matrix', () => {
    const a = Array1D.new([0]);
    const b = Array1D.new([0]);
    const result = uploadRunAndDownload(a, b);
    expect(result.size).toEqual(1);
  });

  it('returns [0] when adding [0] and [0]', () => {
    const a = Array1D.new([0]);
    const b = Array1D.new([0]);
    const result = uploadRunAndDownload(a, b);
    expect(result.get(0)).toEqual(0);
  });

  it('returns [3] when adding [2] and [1]', () => {
    const a = Array1D.new([2]);
    const b = Array1D.new([1]);
    const result = uploadRunAndDownload(a, b);
    expect(result.get(0)).toEqual(3);
  });

  it('adding 2 Array2Ds', () => {
    const a = Array2D.new([2, 3], [[1, 2, 3], [3, 9, -2]]);
    const b = Array2D.new([2, 3], [[5, 4, 2], [1, 10, -3]]);
    const result = uploadRunAndDownload(a, b);
    expect(result.getValues()).toEqual(new Float32Array([6, 6, 5, 4, 19, -5]));
  });

  it('adding 2 Array3Ds', () => {
    const a = Array3D.new([1, 1, 1], [[[5]]]);
    const b = Array3D.new([1, 1, 1], [[[6]]]);
    const result = uploadRunAndDownload(a, b);
    expect(result.get(0, 0, 0)).toBe(11);
  });
});

function uploadRunAndDownload<T extends NDArray>(a: T, b: T): T {
  util.assertShapesMatch(a.shape, b.shape);
  const outTexShape = a.getTextureShapeRC();
  const textureManager = new TextureManager(GPGPU);
  const outTexture = textureManager.acquireTexture(outTexShape);
  const out = new NDArray(a.shape, {texture: outTexture,
    textureShapeRC: outTexShape});
  const addProgram = new AddProgram();
  const webGLProgram = gpgpu_program.createWebGLProgram(GPGPU, addProgram,
      [a, b], out);
  gpgpu_program.runProgram(GPGPU, addProgram, webGLProgram, [a, b], out);
  GPGPU.deleteProgram(webGLProgram);
  return out as T;
}

