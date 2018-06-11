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
import {ENV, Environment, Features} from './environment';
import * as jasmine_util from './jasmine_util';
import {DEFAULT_FEATURES} from './test_util';
import {MathBackendWebGL} from './webgl';

describe('canEmulateEnvironment', () => {
  beforeEach(() => {
    ENV.reset();
  });
  afterEach(() => {
    ENV.reset();
  });

  it('no registered backends', () => {
    const testBackends: jasmine_util.TestBackendFactory[] = [];
    const fakeFeatures = {'BACKEND': 'webgl'};

    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(false);
  });

  it('webgl backend, webgl emulation', () => {
    const testBackends: jasmine_util.TestBackendFactory[] =
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}];

    const fakeFeatures = {'BACKEND': 'webgl'};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(true);
  });

  it('webgl backend, tensorflow emulation', () => {
    const testBackends: jasmine_util.TestBackendFactory[] =
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}];

    const fakeFeatures = {'BACKEND': 'tensorflow'};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(false);
  });

  it('webgl backend, webgl 2.0 emulation on webgl 2.0', () => {
    const testBackends: jasmine_util.TestBackendFactory[] =
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}];

    ENV.set('WEBGL_VERSION', 2);

    const fakeFeatures = {'BACKEND': 'webgl', 'WEBGL_VERSION': 2};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(true);
  });

  it('webgl backend, webgl 1.0 emulation on webgl 2.0', () => {
    const testBackends: jasmine_util.TestBackendFactory[] =
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}];

    ENV.set('WEBGL_VERSION', 2);

    const fakeFeatures = {'BACKEND': 'webgl', 'WEBGL_VERSION': 1};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(true);
  });

  it('webgl backend, webgl 2.0 emulation on webgl 1.0 fails', () => {
    const testBackends: jasmine_util.TestBackendFactory[] =
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}];

    ENV.set('WEBGL_VERSION', 1);

    const fakeFeatures = {'BACKEND': 'webgl', 'WEBGL_VERSION': 2};
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(false);
  });

  it('webgl backend, webgl 1.0 no float emulation on webgl 2.0', () => {
    const testBackends: jasmine_util.TestBackendFactory[] =
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}];

    ENV.set('WEBGL_VERSION', 2);
    ENV.set('WEBGL_FLOAT_TEXTURE_ENABLED', true);

    // Emulates iOS.
    const fakeFeatures = {
      'BACKEND': 'webgl',
      'WEBGL_VERSION': 1,
      'WEBGL_FLOAT_TEXTURE_ENABLED': false
    };
    expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
        .toBe(true);
  });

  it('webgl backend, webgl 1.0 no float emulation on webgl 1.0 no float',
     () => {
       const testBackends: jasmine_util.TestBackendFactory[] = [
         {name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}
       ];

       ENV.set('WEBGL_VERSION', 1);
       ENV.set('WEBGL_FLOAT_TEXTURE_ENABLED', false);

       // Emulates iOS.
       const fakeFeatures = {
         'BACKEND': 'webgl',
         'WEBGL_VERSION': 1,
         'WEBGL_FLOAT_TEXTURE_ENABLED': false
       };
       expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
           .toBe(true);
     });
});

describe('anyFeaturesEquivalentToDefault', () => {
  let oldTestBackends: jasmine_util.TestBackendFactory[];
  beforeEach(() => {
    oldTestBackends = jasmine_util.TEST_BACKENDS;
  });
  afterEach(() => {
    jasmine_util.setTestBackends(oldTestBackends);
  });

  it('ignores default', () => {
    const env = new Environment();
    const features = [DEFAULT_FEATURES];
    expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
        .toBe(false);
  });

  it('equivalent features', () => {
    jasmine_util.setTestBackends([
      {name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1000}
    ]);

    const env = new Environment();
    env.set('WEBGL_VERSION', 1);
    env.set('BACKEND', 'webgl');

    const features: Features[] =
        [DEFAULT_FEATURES, {'WEBGL_VERSION': 1, 'BACKEND': 'webgl'}];
    expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
        .toBe(true);
  });

  it('different features', () => {
    jasmine_util.setTestBackends(
        [{name: 'webgl', factory: () => new MathBackendWebGL(), priority: 1}]);

    const env = new Environment();
    env.set('WEBGL_VERSION', 0);
    env.set('BACKEND', 'cpu');

    const features: Features[] =
        [DEFAULT_FEATURES].concat([{'WEBGL_VERSION': 1, 'BACKEND': 'webgl'}]);
    expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
        .toBe(false);
  });
});
