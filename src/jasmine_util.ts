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
import {KernelBackend} from '.';
import {ENV, Environment, Features} from './environment';
import {MathBackendCPU} from './kernels/backend_cpu';
import {MathBackendWebGL} from './kernels/backend_webgl';

function canEmulateFeature<K extends keyof Features>(
    feature: K, emulatedFeatures: Features,
    testBackendFactories?: TestBackendFactory[]): boolean {
  testBackendFactories = testBackendFactories || TEST_BACKENDS;

  const emulatedFeature = emulatedFeatures[feature];

  if (feature === 'BACKEND') {
    for (let i = 0; i < testBackendFactories.length; i++) {
      if (testBackendFactories[i].name === emulatedFeature) {
        return true;
      }
    }
    return false;
  } else if (feature === 'WEBGL_VERSION') {
    return ENV.get(feature) >= emulatedFeature;
  } else if (feature === 'WEBGL_FLOAT_TEXTURE_ENABLED') {
    if (ENV.get(feature) === false && emulatedFeature === true) {
      return false;
    }
    return true;
  }
  return true;
}

// Tests whether the set of features can be emulated within the current real
// environment.
export function canEmulateEnvironment(
    emulatedFeatures: Features,
    testBackendFactories?: TestBackendFactory[]): boolean {
  const featureNames = Object.keys(emulatedFeatures) as Array<keyof Features>;
  for (let i = 0; i < featureNames.length; i++) {
    const featureName = featureNames[i];
    if (!canEmulateFeature(
            featureName, emulatedFeatures, testBackendFactories)) {
      return false;
    }
  }
  return true;
}

export const WEBGL_FEATURES = [
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
export const CPU_FEATURES = [{'BACKEND': 'test-cpu'}];

// Emulates the current device.
export const DEFAULT_FEATURES = {};
export const ALL_FEATURES =
    [DEFAULT_FEATURES].concat(WEBGL_FEATURES).concat(CPU_FEATURES);

export function anyFeaturesEquivalentToDefault(
    emulatedFeatures: Features[], environent: Environment) {
  for (let j = 0; j < emulatedFeatures.length; j++) {
    const candidateDuplicateFeature = emulatedFeatures[j];
    if (candidateDuplicateFeature === DEFAULT_FEATURES) {
      continue;
    }

    const featureNames =
        Object.keys(candidateDuplicateFeature) as Array<(keyof Features)>;
    const featuresMatch = featureNames.every(featureName => {
      // Since no test backends are registered when this method is called,
      // we have to manually find the highest priority backend from the test
      // backend list.
      const featureValue = featureName === 'BACKEND' ? getBestTestBackend() :
                                                       ENV.get(featureName);
      return candidateDuplicateFeature[featureName] === featureValue;
    });

    if (featuresMatch) {
      return true;
    }
  }
  return false;
}

export function describeWithFeatures(
    name: string, featuresToRun: Features[], tests: () => void) {
  for (let i = 0; i < featuresToRun.length; i++) {
    const features = featuresToRun[i];
    // If using the default feature, check for duplicates and don't execute the
    // default if it's a duplicate.
    if (features === DEFAULT_FEATURES &&
        anyFeaturesEquivalentToDefault(featuresToRun, ENV)) {
      continue;
    }

    if (canEmulateEnvironment(features)) {
      const testName = name + ' ' + JSON.stringify(features);
      executeTests(testName, tests, features);
    }
  }
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

export interface TestBackendFactory {
  name: string;
  factory: () => KernelBackend;
  priority: number;
}

let TEST_BACKENDS: TestBackendFactory[];
setTestBackends([
  // High priority to override the real defaults.
  {name: 'test-webgl', factory: () => new MathBackendWebGL(), priority: 101},
  {name: 'test-cpu', factory: () => new MathBackendCPU(), priority: 100}
]);

let BEFORE_ALL = (features: Features) => {};
let AFTER_ALL = (features: Features) => {};
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
function getBestTestBackend(): string {
  return TEST_BACKENDS.slice()
      .sort((a: TestBackendFactory, b: TestBackendFactory) => {
        return a.priority < b.priority ? 1 : -1;
      })[0]
      .name;
}
export function setTestBackends(testBackends: TestBackendFactory[]) {
  TEST_BACKENDS = testBackends;
}
export function setTestEnvFeatures(features: Features[]) {
  TEST_ENV_FEATURES = features;
}

function executeTests(testName: string, tests: () => void, features: Features) {
  describe(testName, () => {
    beforeAll(() => {
      ENV.setFeatures(features);

      TEST_BACKENDS.forEach(backendFactory => {
        ENV.registerBackend(
            backendFactory.name, backendFactory.factory,
            backendFactory.priority);
      });

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

      TEST_BACKENDS.forEach(backendFactory => {
        ENV.removeBackend(backendFactory.name);
      });

      ENV.reset();
    });

    tests();
  });
}
