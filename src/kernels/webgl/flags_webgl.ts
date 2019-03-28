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

import * as device_util from '../../device_util';
import {ENV} from '../../environment';
import * as webgl_util from './webgl_util';

/**
 * This file contains WebGL-specific flag registrations.
 */

/**
 * True if WebGL is supported.
 */
ENV.registerFlag('HAS_WEBGL', () => ENV.get('WEBGL_VERSION') > 0);

/** 0: No WebGL, 1: WebGL 1.0, 2: WebGL 2.0. */
ENV.registerFlag('WEBGL_VERSION', () => {
  if (webgl_util.isWebGLVersionEnabled(2)) {
    return 2;
  } else if (webgl_util.isWebGLVersionEnabled(1)) {
    return 1;
  }
  return 0;
});

/** Whether the WebGL backend will sometimes forward ops to the CPU. */
ENV.registerFlag('WEBGL_CPU_FORWARD', () => false);

/** Whether to turn all packing related flags on. */
ENV.registerFlag(
    'WEBGL_PACK', () => ENV.get('WEBGL_VERSION') === 0 ? false : true);

/** Whether we will pack the batchnormalization op. */
ENV.registerFlag('WEBGL_PACK_BATCHNORMALIZATION', () => ENV.get('WEBGL_PACK'));

/** Whether we will pack the clip op. */
ENV.registerFlag('WEBGL_PACK_CLIP', () => ENV.get('WEBGL_PACK'));

/** Whether we will pack the depthwise conv op. */
ENV.registerFlag('WEBGL_PACK_DEPTHWISECONV', () => ENV.get('WEBGL_PACK'));

/** Whether we will pack binary ops. */
ENV.registerFlag('WEBGL_PACK_BINARY_OPERATIONS', () => ENV.get('WEBGL_PACK'));

/** Whether we will pack array ops. */
ENV.registerFlag('WEBGL_PACK_ARRAY_OPERATIONS', () => ENV.get('WEBGL_PACK'));

/** Whether we will pack image ops. */
ENV.registerFlag('WEBGL_PACK_IMAGE_OPERATIONS', () => ENV.get('WEBGL_PACK'));

/** Whether we will pack reduce ops. */
ENV.registerFlag('WEBGL_PACK_REDUCE', () => ENV.get('WEBGL_PACK'));

/** Whether packed WebGL kernels lazily unpack their outputs. */
ENV.registerFlag('WEBGL_LAZILY_UNPACK', () => ENV.get('WEBGL_PACK'));

/** Whether we will use the im2col algorithm to speed up convolutions. */
ENV.registerFlag('WEBGL_CONV_IM2COL', () => ENV.get('WEBGL_PACK'));

/** The maximum texture dimension. */
ENV.registerFlag(
    'WEBGL_MAX_TEXTURE_SIZE',
    () =>
        webgl_util.getWebGLMaxTextureSize(ENV.get('WEBGL_VERSION') as number));

/** The maximum texture dimension. */
ENV.registerFlag(
    'WEBGL_MAX_TEXTURES_IN_SHADER',
    () =>
        webgl_util.getMaxTexturesInShader(ENV.get('WEBGL_VERSION') as number));

/**
 * The disjoint_query_timer extension version.
 * 0: disabled, 1: EXT_disjoint_timer_query, 2:
 * EXT_disjoint_timer_query_webgl2.
 * In Firefox with WebGL 2.0,
 * EXT_disjoint_timer_query_webgl2 is not available, so we must use the
 * WebGL 1.0 extension.
 */
ENV.registerFlag('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', () => {
  const webGLVersion = ENV.get('WEBGL_VERSION') as number;

  if (webGLVersion === 0) {
    return 0;
  }
  return webgl_util.getWebGLDisjointQueryTimerVersion(webGLVersion);
});

/**
 * Whether the timer object from the disjoint_query_timer extension gives
 * timing information that is reliable.
 */
ENV.registerFlag('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', () => {
  return ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
      !device_util.isMobile();
});

/**
 * Whether rendering to float32 textures is enabled. If disabled, renders to
 * float16 textures.
 */
ENV.registerFlag(
    'WEBGL_RENDER_FLOAT32_ENABLED',
    () => webgl_util.isRenderToFloatTextureEnabled(
        ENV.get('WEBGL_VERSION') as number));

/**
 * Whether downloading float textures is enabled (16 or 32 bit). If disabled,
 * uses IEEE 754 encoding of the float32 values to 4 uint8 when downloading.
 */
ENV.registerFlag(
    'WEBGL_DOWNLOAD_FLOAT_ENABLED',
    () => webgl_util.isDownloadFloatTextureEnabled(
        ENV.get('WEBGL_VERSION') as number));

/** Whether the fence API is available. */
ENV.registerFlag(
    'WEBGL_FENCE_API_ENABLED',
    () => webgl_util.isWebGLFenceEnabled(ENV.get('WEBGL_VERSION') as number));

/**
 * Tensors with size <= than this will be uploaded as uniforms, not textures.
 */
ENV.registerFlag('WEBGL_SIZE_UPLOAD_UNIFORM', () => {
  // Use uniform uploads only when 32bit floats are supported. In
  // 16bit
  // environments there are problems with comparing a 16bit texture value
  // with a 32bit uniform value.
  const useUniforms = ENV.get('WEBGL_RENDER_FLOAT32_ENABLED');
  return useUniforms ? 4 : 0;
});
