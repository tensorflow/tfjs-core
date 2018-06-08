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
import {Environment} from './environment';
import * as jasmine_util from './jasmine_util';
import {MathBackendWebGL} from './webgl';

describe('canEmulateEnvironment', () => {
  it('no registered backends', () => {
    const realEnv = new Environment();

    const fakeFeatures = {'BACKEND': 'webgl'};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(false);
  });

  it('webgl backend, webgl emulation', () => {
    const realEnv = new Environment();
    realEnv.registerBackend('webgl', () => new MathBackendWebGL());

    const fakeFeatures = {'BACKEND': 'webgl'};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(true);
  });

  it('webgl backend, tensorflow emulation', () => {
    const realEnv = new Environment();
    realEnv.registerBackend('webgl', () => new MathBackendWebGL());

    const fakeFeatures = {'BACKEND': 'tensorflow'};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(false);
  });

  it('webgl backend, webgl 2.0 emulation on webgl 2.0', () => {
    const realEnv = new Environment();
    realEnv.registerBackend('webgl', () => new MathBackendWebGL());
    realEnv.set('WEBGL_VERSION', 2);

    const fakeFeatures = {'BACKEND': 'webgl', 'WEBGL_VERSION': 2};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(true);
  });

  it('webgl backend, webgl 1.0 emulation on webgl 2.0', () => {
    const realEnv = new Environment();
    realEnv.registerBackend('webgl', () => new MathBackendWebGL());
    realEnv.set('WEBGL_VERSION', 2);

    const fakeFeatures = {'BACKEND': 'webgl', 'WEBGL_VERSION': 1};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(true);
  });

  it('webgl backend, webgl 2.0 emulation on webgl 1.0 fails', () => {
    const realEnv = new Environment();
    realEnv.registerBackend('webgl', () => new MathBackendWebGL());
    realEnv.set('WEBGL_VERSION', 1);

    const fakeFeatures = {'BACKEND': 'webgl', 'WEBGL_VERSION': 2};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(false);
  });

  it('webgl backend, webgl 1.0 no float emulation on webgl 2.0', () => {
    const realEnv = new Environment();
    realEnv.registerBackend('webgl', () => new MathBackendWebGL());
    realEnv.set('WEBGL_VERSION', 2);
    realEnv.set('WEBGL_FLOAT_TEXTURE_ENABLED', true);

    // Emulates iOS.
    const fakeFeatures = {
      'BACKEND': 'webgl',
      'WEBGL_VERSION': 1,
      'WEBGL_FLOAT_TEXTURE_ENABLED': false
    };
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
        .toBe(true);
  });

  it('webgl backend, webgl 1.0 no float emulation on webgl 1.0 no float',
     () => {
       const realEnv = new Environment();
       realEnv.registerBackend('webgl', () => new MathBackendWebGL());
       realEnv.set('WEBGL_VERSION', 1);
       realEnv.set('WEBGL_FLOAT_TEXTURE_ENABLED', false);

       // Emulates iOS.
       const fakeFeatures = {
         'BACKEND': 'webgl',
         'WEBGL_VERSION': 1,
         'WEBGL_FLOAT_TEXTURE_ENABLED': false
       };
       expect(jasmine_util.canEmulateEnvironment(fakeFeatures, realEnv))
           .toBe(true);
     });
});
