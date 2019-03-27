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

import * as device_util from './device_util';
import {Features, getFeaturesFromURL, getMaxTexturesInShader, getWebGLDisjointQueryTimerVersion, getWebGLMaxTextureSize, isChrome, isDownloadFloatTextureEnabled, isRenderToFloatTextureEnabled, isWebGLFenceEnabled, isWebGLVersionEnabled} from './environment_util';
import {KernelBackend} from './kernels/backend';
import {setDeprecationWarningFn} from './tensor';

export const EPSILON_FLOAT16 = 1e-4;
const TEST_EPSILON_FLOAT16 = 1e-1;

export const EPSILON_FLOAT32 = 1e-7;
const TEST_EPSILON_FLOAT32 = 1e-3;

export class Environment {
  constructor(private features?: Features) {
    if (features == null) {
      features = getFeaturesFromURL();
    }

    if (this.get('DEBUG')) {
      console.warn(
          'Debugging mode is ON. The output of every math call will ' +
          'be downloaded to CPU and checked for NaNs. ' +
          'This significantly impacts performance.');
    }
  }

  get<K extends keyof Features>(feature: K): Features[K] {
    if (feature in this.features) {
      return this.features[feature];
    }

    this.features[feature] = this.evaluateFeature(feature);

    return this.features[feature];
  }

  getFeatures(): Features {
    return this.features;
  }

  set<K extends keyof Features>(feature: K, value: Features[K]): void {
    this.features[feature] = value;
  }

  private getBestBackendName(): string {
    if (Object.keys(this.registry).length === 0) {
      throw new Error('No backend found in registry.');
    }
    const sortedBackends = Object.keys(this.registry)
                               .map(name => {
                                 return {name, entry: this.registry[name]};
                               })
                               .sort((a, b) => {
                                 // Highest priority comes first.
                                 return b.entry.priority - a.entry.priority;
                               });
    return sortedBackends[0].name;
  }

  private evaluateFeature<K extends keyof Features>(feature: K): Features[K] {
    if (feature === 'DEBUG') {
      return false;
    } else if (feature === 'IS_BROWSER') {
      return typeof window !== 'undefined';
    } else if (feature === 'IS_NODE') {
      return (typeof process !== 'undefined') &&
          (typeof process.versions !== 'undefined') &&
          (typeof process.versions.node !== 'undefined');
    } else if (feature === 'IS_CHROME') {
      return isChrome();
    } else if (feature === 'WEBGL_CPU_FORWARD') {
      return true;
    } else if (feature === 'WEBGL_PACK') {
      return this.get('WEBGL_VERSION') === 0 ? false : true;
    } else if (feature === 'WEBGL_PACK_BATCHNORMALIZATION') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_PACK_CLIP') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_PACK_DEPTHWISECONV') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_PACK_BINARY_OPERATIONS') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_PACK_ARRAY_OPERATIONS') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_PACK_IMAGE_OPERATIONS') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_PACK_REDUCE') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_LAZILY_UNPACK') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_CONV_IM2COL') {
      return this.get('WEBGL_PACK');
    } else if (feature === 'WEBGL_MAX_TEXTURE_SIZE') {
      return getWebGLMaxTextureSize(this.get('WEBGL_VERSION'));
    } else if (feature === 'WEBGL_MAX_TEXTURES_IN_SHADER') {
      return getMaxTexturesInShader(this.get('WEBGL_VERSION'));
    } else if (feature === 'IS_TEST') {
      return false;
    } else if (feature === 'BACKEND') {
      return this.getBestBackendName();
    } else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') {
      const webGLVersion = this.get('WEBGL_VERSION');

      if (webGLVersion === 0) {
        return 0;
      }
      return getWebGLDisjointQueryTimerVersion(webGLVersion);
    } else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE') {
      return this.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
          !device_util.isMobile();
    } else if (feature === 'HAS_WEBGL') {
      return this.get('WEBGL_VERSION') > 0;
    } else if (feature === 'WEBGL_VERSION') {
      if (isWebGLVersionEnabled(2)) {
        return 2;
      } else if (isWebGLVersionEnabled(1)) {
        return 1;
      }
      return 0;
    } else if (feature === 'WEBGL_RENDER_FLOAT32_ENABLED') {
      return isRenderToFloatTextureEnabled(this.get('WEBGL_VERSION'));
    } else if (feature === 'WEBGL_DOWNLOAD_FLOAT_ENABLED') {
      return isDownloadFloatTextureEnabled(this.get('WEBGL_VERSION'));
    } else if (feature === 'WEBGL_FENCE_API_ENABLED') {
      return isWebGLFenceEnabled(this.get('WEBGL_VERSION'));
    } else if (feature === 'WEBGL_SIZE_UPLOAD_UNIFORM') {
      // Use uniform uploads only when 32bit floats are supported. In 16bit
      // environments there are problems with comparing a 16bit texture value
      // with a 32bit uniform value.
      const useUniforms = this.get('WEBGL_RENDER_FLOAT32_ENABLED');
      return useUniforms ? 4 : 0;
    } else if (feature === 'TEST_EPSILON') {
      return this.backend.floatPrecision() === 32 ? TEST_EPSILON_FLOAT32 :
                                                    TEST_EPSILON_FLOAT16;
    } else if (feature === 'EPSILON') {
      return this.backend.floatPrecision() === 32 ? EPSILON_FLOAT32 :
                                                    EPSILON_FLOAT16;
    } else if (feature === 'PROD') {
      return false;
    } else if (feature === 'TENSORLIKE_CHECK_SHAPE_CONSISTENCY') {
      return !this.get('PROD');
    } else if (feature === 'DEPRECATION_WARNINGS_ENABLED') {
      return true;
    }
    throw new Error(`Unknown feature ${feature}.`);
  }

  setFeatures(features: Features) {
    this.features = Object.assign({}, features);
  }

  reset() {
    this.features = getFeaturesFromURL();
  }
}

/**
 * Enables production mode which disables correctness checks in favor of
 * performance.
 */
/** @doc {heading: 'Environment'} */
export function enableProdMode(): void {
  ENV.set('PROD', true);
}

/**
 * Enables debug mode which will log information about all executed kernels:
 * the ellapsed time of the kernel execution, as well as the rank, shape, and
 * size of the output tensor.
 *
 * Debug mode will significantly slow down your application as it will
 * download the result of every operation to the CPU. This should not be used in
 * production. Debug mode does not affect the timing information of the kernel
 * execution as we do not measure download time in the kernel execution time.
 *
 * See also: `tf.profile`, `tf.memory`.
 */
/** @doc {heading: 'Environment'} */
export function enableDebugMode(): void {
  ENV.set('DEBUG', true);
}

/** Globally disables deprecation warnings */
export function disableDeprecationWarnings(): void {
  ENV.set('DEPRECATION_WARNINGS_ENABLED', false);
  console.warn(`TensorFlow.js deprecation warnings have been disabled.`);
}

/** Warn users about deprecated functionality. */
export function deprecationWarn(msg: string) {
  if (ENV.get('DEPRECATION_WARNINGS_ENABLED')) {
    console.warn(
        msg + ' You can disable deprecation warnings with ' +
        'tf.disableDeprecationWarnings().');
  }
}
setDeprecationWarningFn(deprecationWarn);

export let ENV: Environment;
export function setEnvironmentGlobal(environment: Environment) {
  ENV = environment;
}
