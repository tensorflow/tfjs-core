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
import * as Shaderc from '@webgpu/shaderc';

import {WebGPUBackend} from './backend_webgpu';

tf.registerBackend('webgpu', asyncc() => {
  const shaderc = await Shaderc.instantiate();
  // @ts-ignore navigator.gpu is required
  const adapter = await navigator.gpu.requestAdapter({});
  const device = await adapter.requestDevice({});
  return new WebGPUBackend(device, shaderc);
}, 3 /*priority*/);
