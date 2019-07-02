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

import * as tf from '@tensorflow/tfjs';
import { MathBackendWebGL, GPGPUContext } from '@tensorflow/tfjs-core/dist/webgl';
import { setWebGLContext} from '@tensorflow/tfjs-core/dist/backends/webgl/canvas_util';

const nodeGles = require('node-gles');

const gl = nodeGles.binding.createWebGLRenderingContext();

// TODO - actually set these from an interface.
tf.ENV.set('WEBGL_VERSION', 2); 
tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', true);
tf.ENV.set('WEBGL_DOWNLOAD_FLOAT_ENABLED', true);
tf.ENV.set('WEBGL_FENCE_API_ENABLED', true);  // OpenGL ES 3.0 and higher..
tf.ENV.set('WEBGL_MAX_TEXTURE_SIZE', 10000);

setWebGLContext(2, gl);

tf.registerBackend('headless-nodegl', () => {
  return new MathBackendWebGL(new GPGPUContext(gl))
}, 3 /* priority */);

tf.setBackend('headless-nodegl');

export const context = {
  gl
};

export * from '@tensorflow/tfjs';

// TODO - figure out nodeFileSystem router stuff?
