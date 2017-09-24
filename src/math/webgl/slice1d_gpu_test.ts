/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {Array1D, initializeGPU} from '../ndarray';
import {GPGPUContext} from './gpgpu_context';
import * as gpgpu_math from './gpgpu_math';
import {Slice1DProgram} from './slice1d_gpu';
import {TextureManager} from './texture_manager';
import * as webgl_util from './webgl_util';

describe('slice1d_gpu', () => {
  let gpgpu: GPGPUContext;
  let texManager: TextureManager;

  beforeAll(() => {
    gpgpu = new GPGPUContext();
    texManager = new TextureManager(gpgpu);
    initializeGPU(gpgpu, texManager);
  });

  afterAll(() => {
    texManager.dispose();
    gpgpu.dispose();
  });

  it('slices [1] into [1] (effectively a copy)', () => {
    const a = Array1D.new([5]);
    const result = doSlice(a, 0, 1);
    expect(result.shape).toEqual([1]);
    expect(result.get(0)).toBe(5);
  });

  it('slices [5] into [2] starting at 3', () => {
    const a = Array1D.new([1, 2, 3, 4, 5]);
    const result = doSlice(a, 3, 2);
    expect(result.shape).toEqual([2]);
    expect(result.getValues()).toEqual(new Float32Array([4, 5]));
  });

  it('slices [5] into [3] starting at 1', () => {
    const a = Array1D.new([1, 2, 3, 4, 5]);
    const result = doSlice(a, 1, 3);
    expect(result.shape).toEqual([3]);
    expect(result.getValues()).toEqual(new Float32Array([2, 3, 4]));
  });

  it('slices array that is bigger than max tex size', () => {
    const maxTexSize = webgl_util.queryMaxTextureSize(gpgpu.gl);
    const a = Array1D.randUniform([maxTexSize + 10], -1, 1);
    const expected = a.get(a.size - 1);
    const result = doSlice(a, a.size - 1, 1);
    expect(result.shape).toEqual([1]);
    expect(result.get(0)).toEqual(expected);
  });


  function doSlice(a: Array1D, start: number, size: number): Array1D {
    const program = new Slice1DProgram(size);
    const result = Array1D.zeros([size]);

    const binary = gpgpu_math.compileProgram(gpgpu, program, [a], result);
    const customSetup = program.getCustomSetupFunc(start);
    gpgpu_math.runProgram(binary, [a], result, customSetup);

    a.dispose();
    gpgpu.deleteProgram(binary.webGLProgram);

    return result;
  }
});
