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
import {Features} from './environment_util';
import {KernelBackend} from './kernels/backend';
import {MathBackendCPU} from './kernels/backend_cpu';
import {MathBackendWebGL} from './kernels/backend_webgl';

Error.stackTraceLimit = Infinity;

// Tests whether the current environment satisfies the set of constraints.
export function envSatisfiesConstraints(constraints: Features): boolean {
  for (const key in constraints) {
    const value = constraints[key as keyof Features];
    if (ENV.get(key as keyof Features) !== value) {
      return false;
    }
  }
  return true;
}

// tslint:disable-next-line:no-any
declare let __karma__: any;

export function parseKarmaFlags(args: string[]): TestEnv {
  let features: Features;
  let backend: () => KernelBackend;
  let name = '';

  args.forEach((arg, i) => {
    if (arg === '--features') {
      features = JSON.parse(args[i + 1]);
    } else if (arg === '--backend') {
      const type = args[i + 1];
      name = type;
      if (type.toLowerCase() === 'cpu') {
        backend = () => new MathBackendCPU();
        features = features || {};
        features['HAS_WEBGL'] = false;
      } else if (type.toLowerCase() === 'webgl') {
        backend = () => new MathBackendWebGL();
      } else {
        throw new Error(
            `Unknown value ${type} for flag --backend. ` +
            `Allowed values are 'cpu' or 'webgl'.`);
      }
    }
  });

  if (features == null && backend == null) {
    return null;
  }
  if (features != null && backend == null) {
    throw new Error(
        '--backend flag is required when --features is present. ' +
        'Available values are "webgl" or "cpu".');
  }
  return {features: features || {}, factory: backend, name};
}

export function describeWithFlags(
    name: string, constraints: Features, tests: (env: TestEnv) => void) {
  TEST_ENVS.forEach(testEnv => {
    ENV.setFeatures(testEnv.features);
    if (envSatisfiesConstraints(constraints)) {
      const testName =
          name + ' ' + testEnv.name + ' ' + JSON.stringify(testEnv.features);
      executeTests(testName, tests, testEnv);
    }
  });
}

export interface TestEnv {
  name: string;
  factory: () => KernelBackend;
  features: Features;
}

export let TEST_ENVS: TestEnv[] = [
  {
    name: 'webgl1',
    factory: () => new MathBackendWebGL(),
    features: {
      'WEBGL_VERSION': 1,
      'WEBGL_CPU_FORWARD': false,
      'WEBGL_SIZE_UPLOAD_UNIFORM': 0,
      'WEBGL_PACK': false
    }
  },
  {
    name: 'webgl2',
    factory: () => new MathBackendWebGL(),
    features: {
      'WEBGL_VERSION': 2,
      'WEBGL_CPU_FORWARD': false,
      'WEBGL_SIZE_UPLOAD_UNIFORM': 0,
      'WEBGL_PACK': false
    }
  },
  {
    name: 'webgl2',
    factory: () => new MathBackendWebGL(),
    features: {
      'WEBGL_VERSION': 2,
      'WEBGL_CPU_FORWARD': false,
      'WEBGL_SIZE_UPLOAD_UNIFORM': 0,
      'WEBGL_PACK': true
    }
  },
  {
    name: 'cpu',
    factory: () => new MathBackendCPU(),
    features: {'HAS_WEBGL': false}
  }
];

// When not running in node (headless environment), append additional WebGL
// testing environment in order to test packed operations. This way, we specify
// a subset of tests to run, both with packed and non-packed operations. Calling
// this method needs to be coupled with deactivateWebGLPackedTestEnv to remove
// packed testing environment. Only the tests specified between
// activateWebGLPackedTestEnv and deactivateWebGLPackedTestEnv are run in
// additional packed operations mode.
export function activateWebGLPackedTestEnv() {
  if (!ENV.get('IS_NODE')) {
    TEST_ENVS.push(
      {
        name: 'webgl-packed',
        factory: () => new MathBackendWebGL(),
        features: {'WEBGL_VERSION': ENV.get('WEBGL_VERSION'),
                   'WEBGL_CPU_FORWARD': false, 'WEBGL_LAZILY_UNPACK': true,
                   'WEBGL_PACK': true, 'WEBGL_SIZE_UPLOAD_UNIFORM': 0}
      }
    );
  }
}

// With activateWebGLPackedTestEnv, delimits set of tests to be run in both
// packed and non-packed environment mode.
export function deactivateWebGLPackedTestEnv() {
  if (!ENV.get('IS_NODE')) {
    // Additional packed operation testing environent is appended: remove it
    // to affect only the tests specified between activateWebGLPackedTestEnv and
    // deactivateWebGLPackedTestEnv.
    if (TEST_ENVS.pop().features['WEBGL_PACK'] !== true) {
      throw new Error('Error with WEBGL_PACK setup in tests.'); 
    }
  }
}

export const CPU_FACTORY = () => new MathBackendCPU();

if (typeof __karma__ !== 'undefined') {
  const testEnv = parseKarmaFlags(__karma__.config.args);
  if (testEnv) {
    setTestEnvs([testEnv]);
  }
}

export function setTestEnvs(testEnvs: TestEnv[]) {
  TEST_ENVS = testEnvs;
}

function executeTests(
    testName: string, tests: (env: TestEnv) => void, testEnv: TestEnv) {
  describe(testName, () => {
    const backendName = 'test-' + testEnv.name;

    beforeAll(() => {
      ENV.reset();
      ENV.setFeatures(testEnv.features);
      ENV.set('IS_TEST', true);
      ENV.registerBackend(backendName, testEnv.factory, 1000);
      Environment.setBackend(backendName);
    });

    beforeEach(() => {
      ENV.engine.startScope();
    });

    afterEach(() => {
      ENV.engine.endScope();
      Environment.disposeVariables();
    });

    afterAll(() => {
      ENV.removeBackend(backendName);
      ENV.reset();
    });

    tests(testEnv);
  });
}
