/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import {ENV} from './environment';
import {describeWithFlags, envSatisfiesConstraints, parseKarmaFlags, TestKernelBackend, WEBGL_ENVS} from './jasmine_util';
import {MathBackendCPU} from './kernels/cpu/backend_cpu';
import {MathBackendWebGL} from './kernels/webgl/backend_webgl';

describeWithFlags('jasmine_util.envSatisfiesConstraints', {}, () => {
  it('ENV satisfies empty constraints', () => {
    expect(envSatisfiesConstraints({})).toBe(true);
  });

  it('ENV satisfies matching constraints', () => {
    const c = {DEBUG: ENV.get('DEBUG')};
    expect(envSatisfiesConstraints(c)).toBe(true);
  });

  it('ENV does not satisfy mismatching constraints', () => {
    const c = {DEBUG: !ENV.get('DEBUG')};
    expect(envSatisfiesConstraints(c)).toBe(false);
  });
});

describe('jasmine_util.parseKarmaFlags', () => {
  it('parse empty args', () => {
    const res = parseKarmaFlags([]);
    expect(res).toBeNull();
  });

  it('--backend cpu', () => {
    const res = parseKarmaFlags(['--backend', 'cpu']);
    expect(res.name).toBe('cpu');
    expect(res.flags).toEqual({'HAS_WEBGL': false});
    expect(res.factory() instanceof MathBackendCPU).toBe(true);
  });

  // tslint:disable-next-line:ban
  fit('--backend cpu --flags {"IS_NODE": true}', () => {
    const backend = new TestKernelBackend();
    ENGINE.registerBackend('cpu', () => backend);

    const res =
        parseKarmaFlags(['--backend', 'cpu', '--flags', '{"IS_NODE": true}']);
    expect(res.name).toBe('cpu');
    expect(res.flags).toEqual({IS_NODE: true});
    expect(res.factory() === backend).toBe(true);
  });

  it('"--backend unknown" throws error', () => {
    expect(() => parseKarmaFlags(['--backend', 'unknown'])).toThrowError();
  });

  it('"--flags {}" throws error since --backend is missing', () => {
    expect(() => parseKarmaFlags(['--flags', '{}'])).toThrowError();
  });

  it('"--backend cpu --flags" throws error since features value is missing',
     () => {
       expect(() => parseKarmaFlags(['--backend', 'cpu', '--flags']))
           .toThrowError();
     });

  it('"--backend cpu --flags notJson" throws error', () => {
    expect(() => parseKarmaFlags(['--backend', 'cpu', '--flags', 'notJson']))
        .toThrowError();
  });
});

describeWithFlags('jasmine_util.envSatisfiesConstraints', WEBGL_ENVS, () => {
  it('--backend webgl', () => {
    const res = parseKarmaFlags(['--backend', 'webgl']);
    expect(res.name).toBe('webgl');
    expect(res.flags).toEqual({});
    expect(res.factory() instanceof MathBackendWebGL).toBe(true);
  });
});
