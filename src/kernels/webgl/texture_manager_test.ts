/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import {describeWithFlags} from '../../jasmine_util';

import * as tf from './../../index';
import {GPGPUContext} from './gpgpu_context';
import {TextureUsage} from './tex_util';
import {TextureManager} from './texture_manager';

const DOWNLOAD_FLOAT_ENVS = {
  'WEBGL_DOWNLOAD_FLOAT_ENABLED': true
};

describeWithFlags('acquireTexture', DOWNLOAD_FLOAT_ENVS, () => {
  let textureManager: TextureManager;
  let gpgpuContext: GPGPUContext;

  beforeEach(() => {
    gpgpuContext = new GPGPUContext();
    spyOn(gpgpuContext, 'createFloat16MatrixTexture');
    spyOn(gpgpuContext, 'createFloat16PackedMatrixTexture');
    spyOn(gpgpuContext, 'createFloat32MatrixTexture');
    spyOn(gpgpuContext, 'createPackedMatrixTexture');
    textureManager = new TextureManager(gpgpuContext);
  });

  it('uploads f16', () => {
    tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', false);

    textureManager.acquireTexture(
        [1, 1], TextureUsage.UPLOAD, false /* packed */);

    expect(gpgpuContext.createFloat16MatrixTexture).toHaveBeenCalled();

    expect(gpgpuContext.createFloat16PackedMatrixTexture)
        .not.toHaveBeenCalled();
    expect(gpgpuContext.createFloat32MatrixTexture).not.toHaveBeenCalled();
    expect(gpgpuContext.createPackedMatrixTexture).not.toHaveBeenCalled();
  });

  it('uploads f32', () => {
    tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', true);

    textureManager.acquireTexture(
        [1, 1], TextureUsage.UPLOAD, false /* packed */);

    expect(gpgpuContext.createFloat32MatrixTexture).toHaveBeenCalled();

    expect(gpgpuContext.createFloat16MatrixTexture).not.toHaveBeenCalled();
    expect(gpgpuContext.createFloat16PackedMatrixTexture)
        .not.toHaveBeenCalled();
    expect(gpgpuContext.createPackedMatrixTexture).not.toHaveBeenCalled();
  });

  it('uploads packed f16', () => {
    tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', false);

    textureManager.acquireTexture(
        [1, 1], TextureUsage.UPLOAD, true /* packed */);

    expect(gpgpuContext.createFloat16PackedMatrixTexture).toHaveBeenCalled();

    expect(gpgpuContext.createFloat16MatrixTexture).not.toHaveBeenCalled();
    expect(gpgpuContext.createFloat32MatrixTexture).not.toHaveBeenCalled();
    expect(gpgpuContext.createPackedMatrixTexture).not.toHaveBeenCalled();
  });

  it('uploads packed f32', () => {
    tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', true);

    textureManager.acquireTexture(
        [1, 1], TextureUsage.UPLOAD, true /* packed */);

    expect(gpgpuContext.createPackedMatrixTexture).toHaveBeenCalled();

    expect(gpgpuContext.createFloat16MatrixTexture).not.toHaveBeenCalled();
    expect(gpgpuContext.createFloat16PackedMatrixTexture)
        .not.toHaveBeenCalled();
    expect(gpgpuContext.createFloat32MatrixTexture).not.toHaveBeenCalled();
  });
});
