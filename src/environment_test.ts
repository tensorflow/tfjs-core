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

import {ENV, Environment} from './environment';
import {getQueryParams} from './environment';
import * as tf from './index';
import {ALL_ENVS, describeWithFlags, WEBGL_ENVS} from './jasmine_util';
import {EPSILON_FLOAT16, EPSILON_FLOAT32, KernelBackend} from './kernels/backend';
import {MathBackendCPU} from './kernels/cpu/backend_cpu';
import {MathBackendWebGL} from './kernels/webgl/backend_webgl';

describe('Backend', () => {
  beforeAll(() => {
    // Silences backend registration warnings.
    spyOn(console, 'warn');
  });

  afterEach(() => {
    ENV.reset();
  });

  it('custom cpu registration', () => {
    let backend: KernelBackend;
    tf.registerBackend('custom-cpu', () => {
      const newBackend = new MathBackendCPU();
      if (backend == null) {
        backend = newBackend;
      }
      return newBackend;
    });

    expect(tf.findBackend('custom-cpu')).toBe(backend);
    const factory = tf.findBackendFactory('custom-cpu');
    expect(factory).not.toBeNull();
    expect(factory() instanceof MathBackendCPU).toBe(true);
    tf.setBackend('custom-cpu');
    expect(tf.backend).toBe(backend);

    tf.removeBackend('custom-cpu');
  });

  it('webgl not supported, falls back to cpu', () => {
    ENV.setFlags({'WEBGL_VERSION': 0});
    let cpuBackend: KernelBackend;
    tf.registerBackend('custom-cpu', () => {
      cpuBackend = new MathBackendCPU();
      return cpuBackend;
    }, 103);
    const success =
        tf.registerBackend('custom-webgl', () => new MathBackendWebGL(), 104);
    expect(success).toBe(false);
    expect(tf.findBackend('custom-webgl') == null).toBe(true);
    expect(tf.findBackendFactory('custom-webgl') == null).toBe(true);
    expect(tf.getBackend()).toBe('custom-cpu');
    expect(tf.backend).toBe(cpuBackend);

    tf.removeBackend('custom-cpu');
  });

  it('default custom background null', () => {
    expect(tf.findBackend('custom')).toBeNull();
  });

  it('allow custom backend', () => {
    const backend = new MathBackendCPU();
    const success = tf.registerBackend('custom', () => backend);
    expect(success).toBeTruthy();
    expect(tf.findBackend('custom')).toEqual(backend);
    tf.removeBackend('custom');
  });
});

describe('environment_util.getQueryParams', () => {
  it('basic', () => {
    expect(getQueryParams('?a=1&b=hi&f=animal'))
        .toEqual({'a': '1', 'b': 'hi', 'f': 'animal'});
  });
});

describe('public api tf.*', () => {
  beforeEach(() => {
    ENV.reset();
  });

  afterEach(() => {
    ENV.reset();
  });

  it('tf.enableProdMode', () => {
    tf.enableProdMode();
    expect(ENV.get('PROD')).toBe(true);
  });

  it('tf.enableDebugMode', () => {
    tf.enableDebugMode();
    expect(ENV.get('DEBUG')).toBe(true);
  });
});
describeWithFlags('epsilon', {}, () => {
  it('Epsilon is a function of float precision', () => {
    const epsilonValue =
        tf.backend.floatPrecision() === 32 ? EPSILON_FLOAT32 : EPSILON_FLOAT16;
    expect(tf.backend.epsilon()).toBe(epsilonValue);
  });

  it('abs(epsilon) > 0', () => {
    expect(tf.abs(ENV.get('EPSILON') as number).arraySync()).toBeGreaterThan(0);
  });
});

describeWithFlags('TENSORLIKE_CHECK_SHAPE_CONSISTENCY', ALL_ENVS, () => {
  it('disabled when prod is enabled', () => {
    const env = new Environment();
    env.set('PROD', true);
    expect(env.get('TENSORLIKE_CHECK_SHAPE_CONSISTENCY')).toBe(false);
  });

  it('enabled when prod is disabled', () => {
    const env = new Environment();
    env.set('PROD', false);
    expect(env.get('TENSORLIKE_CHECK_SHAPE_CONSISTENCY')).toBe(true);
  });
});

describeWithFlags('WEBGL_SIZE_UPLOAD_UNIFORM', WEBGL_ENVS, () => {
  it('is 0 when there is no float32 bit support', () => {
    const env = new Environment();
    env.set('WEBGL_RENDER_FLOAT32_ENABLED', false);
    expect(env.get('WEBGL_SIZE_UPLOAD_UNIFORM')).toBe(0);
  });

  it('is > 0 when there is float32 bit support', () => {
    const env = new Environment();
    env.set('WEBGL_RENDER_FLOAT32_ENABLED', true);
    expect(env.get('WEBGL_SIZE_UPLOAD_UNIFORM')).toBeGreaterThan(0);
  });
});

describe('deprecation warnings', () => {
  let oldWarn: (msg: string) => void;
  beforeEach(() => {
    oldWarn = console.warn;
    spyOn(console, 'warn').and.callFake((msg: string): void => null);
  });
  afterEach(() => {
    console.warn = oldWarn;
  });

  it('deprecationWarn warns', () => {
    tf.deprecationWarn('xyz is deprecated.');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn)
        .toHaveBeenCalledWith(
            'xyz is deprecated. You can disable deprecation warnings with ' +
            'tf.disableDeprecationWarnings().');
  });

  it('disableDeprecationWarnings called, deprecationWarn doesnt warn', () => {
    tf.disableDeprecationWarnings();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn)
        .toHaveBeenCalledWith(
            'TensorFlow.js deprecation warnings have been disabled.');

    // deprecationWarn no longer warns.
    tf.deprecationWarn('xyz is deprecated.');
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
