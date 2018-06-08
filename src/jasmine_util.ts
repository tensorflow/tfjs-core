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
import {MathBackendCPU} from './kernels/backend_cpu';
import {MathBackendWebGL} from './kernels/backend_webgl';

// Represents the non-override environment.
export const REAL_ENV = new Environment();

function canEmulateFeature<K extends keyof Features>(
    feature: K, emulatedFeatures: Features,
    realEnvironment?: Environment): boolean {
  // Since backends are registered on "ENV", we use that as the real environment
  // when the feature is "BACKEND".
  realEnvironment = realEnvironment || (feature === 'BACKEND' ? ENV : REAL_ENV);

  const emulatedFeature = emulatedFeatures[feature];

  if (feature === 'BACKEND') {
    const backend = realEnvironment.findBackend(emulatedFeature as string);
    return backend != null;
  } else if (feature === 'WEBGL_VERSION') {
    return realEnvironment.get(feature) >= emulatedFeature;
  } else if (feature === 'WEBGL_FLOAT_TEXTURE_ENABLED') {
    if (realEnvironment.get(feature) === false && emulatedFeature === true) {
      return false;
    }
    return true;
  }
  return true;
}

// Tests whether the set of features can be emulated within the current real
// environment.
export function canEmulateEnvironment(
    emulatedFeatures: Features, realEnvironment?: Environment): boolean {
  const featureNames = Object.keys(emulatedFeatures) as Array<keyof Features>;
  for (let i = 0; i < featureNames.length; i++) {
    const featureName = featureNames[i];
    if (!canEmulateFeature(featureName, emulatedFeatures, realEnvironment)) {
      return false;
    }
  }
  return true;
}

export const WEBGL_ENVS = [
  {
    'BACKEND': 'test-webgl',
    'WEBGL_FLOAT_TEXTURE_ENABLED': true,
    'WEBGL_VERSION': 1
  },
  {
    'BACKEND': 'test-webgl',
    'WEBGL_FLOAT_TEXTURE_ENABLED': true,
    'WEBGL_VERSION': 2
  }
];

export function describeWithFeatures(
    name: string, featuresToRun: Features[], tests: () => void) {
  // const flatFeatures = util.flatten(featuresToRun);
  featuresToRun.forEach(features => {
    const testName = name + ' ' + JSON.stringify(features);
    executeTests(testName, tests, features);
  });
}

export function describeWithFlags(
    name: string, constraints: Features, tests: () => void) {
  const envFeatures = TEST_ENV_FEATURES.filter(f => {
    return Object.keys(constraints).every(key => {
      // tslint:disable-next-line:no-any
      return (constraints as any)[key] === (f as any)[key];
    });
  });
  envFeatures.forEach(
      features => {
          // const testName = name + ' ' + JSON.stringify(features);
          // executeTests(testName, tests, features);
      });
}

let BEFORE_ALL = (features: Features) => {
  ENV.registerBackend('test-webgl', () => new MathBackendWebGL());
  ENV.registerBackend('test-cpu', () => new MathBackendCPU());
};
let AFTER_ALL = (features: Features) => {
  ENV.removeBackend('test-webgl');
  ENV.removeBackend('test-cpu');
};
let BEFORE_EACH = (features: Features) => {};
let AFTER_EACH = (features: Features) => {};

let TEST_ENV_FEATURES: Features[] = [
  {
    'BACKEND': 'test-webgl',
    'WEBGL_FLOAT_TEXTURE_ENABLED': true,
    'WEBGL_VERSION': 1
  },
  {
    'BACKEND': 'test-webgl',
    'WEBGL_FLOAT_TEXTURE_ENABLED': true,
    'WEBGL_VERSION': 2
  },
  {'BACKEND': 'test-cpu'}
  // TODO(nsthorat,smilkov): Enable when byte-backed textures are fixed.
  // {
  // 'BACKEND': 'webgl',
  // 'WEBGL_FLOAT_TEXTURE_ENABLED': false,
  // 'WEBGL_VERSION': 1
  // }
];

export function setBeforeAll(f: (features: Features) => void) {
  BEFORE_ALL = f;
}
export function setAfterAll(f: (features: Features) => void) {
  AFTER_ALL = f;
}
export function setBeforeEach(f: (features: Features) => void) {
  BEFORE_EACH = f;
}
export function setAfterEach(f: (features: Features) => void) {
  AFTER_EACH = f;
}

export function setTestEnvFeatures(features: Features[]) {
  TEST_ENV_FEATURES = features;
}

function executeTests(testName: string, tests: () => void, features: Features) {
  describe(testName, () => {
    beforeAll(() => {
      ENV.setFeatures(features);
      BEFORE_ALL(features);
    });

    beforeEach(() => {
      BEFORE_EACH(features);
      if (features && features.BACKEND != null) {
        Environment.setBackend(features.BACKEND);
      }
      ENV.engine.startScope();
    });

    afterEach(() => {
      ENV.engine.endScope(null);
      AFTER_EACH(features);
    });

    afterAll(() => {
      AFTER_ALL(features);
      ENV.reset();
    });

    tests();
  });
}
