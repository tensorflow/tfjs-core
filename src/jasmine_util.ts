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

import {ENGINE} from './engine';
import {ENV, Flags} from './environment';
import {KernelBackend} from './kernels/backend';
import {MathBackendCPU} from './kernels/cpu/backend_cpu';
import {MathBackendWebGL} from './kernels/webgl/backend_webgl';

Error.stackTraceLimit = Infinity;

export const WEBGL_ENVS: Flags = {
  'HAS_WEBGL': true
};
export const PACKED_ENVS: Flags = {
  'WEBGL_PACK': true
};
export const NODE_ENVS: Flags = {
  'IS_NODE': true
};
export const CHROME_ENVS: Flags = {
  'IS_CHROME': true
};
export const BROWSER_ENVS: Flags = {
  'IS_BROWSER': true
};
export const CPU_ENVS: Flags = {
  'HAS_WEBGL': false
};

export const ALL_ENVS: Flags = {};

// Tests whether the current environment satisfies the set of constraints.
export function envSatisfiesConstraints(constraints: Flags): boolean {
  for (const key in constraints) {
    const value = constraints[key];
    if (ENV.get(key) !== value) {
      return false;
    }
  }
  return true;
}

// tslint:disable-next-line:no-any
declare let __karma__: any;

export function parseKarmaFlags(args: string[]): TestEnv {
  let flags: Flags;
  let backend: () => KernelBackend;
  let name = '';

  args.forEach((arg, i) => {
    if (arg === '--flags') {
      flags = JSON.parse(args[i + 1]);
    } else if (arg === '--backend') {
      const type = args[i + 1];
      name = type;
      if (type.toLowerCase() === 'cpu') {
        backend = () => new MathBackendCPU();
        flags = flags || {};
        flags['HAS_WEBGL'] = false;
      } else if (type.toLowerCase() === 'webgl') {
        backend = () => new MathBackendWebGL();
      } else {
        throw new Error(
            `Unknown value ${type} for flag --backend. ` +
            `Allowed values are 'cpu' or 'webgl'.`);
      }
    }
  });

  if (flags == null && backend == null) {
    return null;
  }
  if (flags != null && backend == null) {
    throw new Error(
        '--backend flag is required when --flags is present. ' +
        'Available values are "webgl" or "cpu".');
  }
  return {flags: flags || {}, factory: backend, name};
}

export function describeWithFlags(
    name: string, constraints: Flags, tests: (env: TestEnv) => void) {
  TEST_ENVS.forEach(testEnv => {
    ENV.setFlags(testEnv.flags);
    if (envSatisfiesConstraints(constraints)) {
      const testName =
          name + ' ' + testEnv.name + ' ' + JSON.stringify(testEnv.flags);
      executeTests(testName, tests, testEnv);
    }
  });
}

export interface TestEnv {
  name: string;
  factory: () => KernelBackend;
  flags: Flags;
}

export let TEST_ENVS: TestEnv[] = [
  {
    name: 'webgl1',
    factory: () => new MathBackendWebGL(),
    flags: {
      'WEBGL_VERSION': 1,
      'WEBGL_CPU_FORWARD': false,
      'WEBGL_SIZE_UPLOAD_UNIFORM': 0
    }
  },
  {
    name: 'webgl2',
    factory: () => new MathBackendWebGL(),
    flags: {
      'WEBGL_VERSION': 2,
      'WEBGL_CPU_FORWARD': false,
      'WEBGL_SIZE_UPLOAD_UNIFORM': 0
    }
  },
  {
    name: 'cpu',
    factory: () => new MathBackendCPU(),
    flags: {'HAS_WEBGL': false}
  }
];

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
      ENV.setFlags(testEnv.flags);
      ENV.set('IS_TEST', true);
      ENGINE.registerBackend(backendName, testEnv.factory, 1000);
      ENGINE.setBackend(backendName);
    });

    beforeEach(() => {
      ENGINE.startScope();
    });

    afterEach(() => {
      ENGINE.endScope();
      ENGINE.disposeVariables();
    });

    afterAll(() => {
      ENGINE.removeBackend(backendName);
      ENV.reset();
    });

    tests(testEnv);
  });
}
