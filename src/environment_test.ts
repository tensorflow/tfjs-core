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

import {ENV} from './environment';
import {getQueryParams} from './environment';
import * as tf from './index';
import {describeWithFlags, TestKernelBackend} from './jasmine_util';
import {EPSILON_FLOAT16, EPSILON_FLOAT32, KernelBackend} from './kernels/backend';

describe('Backend registration', () => {
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
      const newBackend = new TestKernelBackend();
      if (backend == null) {
        backend = newBackend;
      }
      return newBackend;
    });

    expect(tf.findBackend('custom-cpu')).toBe(backend);
    const factory = tf.findBackendFactory('custom-cpu');
    expect(factory).not.toBeNull();
    expect(factory() instanceof TestKernelBackend).toBe(true);
    tf.setBackend('custom-cpu');
    expect(tf.backend()).toBe(backend);

    tf.removeBackend('custom-cpu');
  });

  it('webgl not supported, falls back to cpu', () => {
    ENV.setFlags({'WEBGL_VERSION': 0});
    let cpuBackend: KernelBackend;
    tf.registerBackend('custom-cpu', () => {
      cpuBackend = new TestKernelBackend();
      return cpuBackend;
    }, 103);
    const success =
        tf.registerBackend('custom-webgl', () => new TestKernelBackend(), 104);
    expect(success).toBe(false);
    expect(tf.findBackend('custom-webgl') == null).toBe(true);
    expect(tf.findBackendFactory('custom-webgl') == null).toBe(true);
    expect(tf.getBackend()).toBe('custom-cpu');
    expect(tf.backend()).toBe(cpuBackend);

    tf.removeBackend('custom-cpu');
  });

  it('default custom background null', () => {
    expect(tf.findBackend('custom')).toBeNull();
  });

  it('allow custom backend', () => {
    const backend = new TestKernelBackend();
    const success = tf.registerBackend('custom', () => backend);
    expect(success).toBeTruthy();
    expect(tf.findBackend('custom')).toEqual(backend);
    tf.removeBackend('custom');
  });
});

describe('environment.getQueryParams', () => {
  it('basic', () => {
    expect(getQueryParams('?a=1&b=hi&f=animal'))
        .toEqual({'a': '1', 'b': 'hi', 'f': 'animal'});
  });
});

describeWithFlags('epsilon', {}, () => {
  it('Epsilon is a function of float precision', () => {
    const epsilonValue = tf.backend().floatPrecision() === 32 ?
        EPSILON_FLOAT32 :
        EPSILON_FLOAT16;
    expect(tf.backend().epsilon()).toBe(epsilonValue);
  });

  it('abs(epsilon) > 0', () => {
    expect(tf.abs(tf.backend().epsilon()).arraySync()).toBeGreaterThan(0);
  });
});
