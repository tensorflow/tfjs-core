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

// import {ENV} from './environment';
// import * as jasmine_util from './jasmine_util';
// import {MathBackendCPU} from './kernels/backend_cpu';

// describe('canEmulateEnvironment', () => {
//   beforeEach(() => {
//     ENV.reset();
//   });
//   afterEach(() => {
//     ENV.reset();
//   });

//   it('no registered backends', () => {
//     const fakeFeatures = {'BACKEND': 'fake-webgl'};

//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(false);
//   });

//   it('webgl backend, webgl emulation', () => {
//     ENV.registerBackend('fake-webgl', () => new MathBackendCPU());

//     const fakeFeatures = {'BACKEND': 'fake-webgl'};
//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(true);

//     ENV.removeBackend('fake-webgl');
//   });

//   it('webgl backend, tensorflow emulation', () => {
//     ENV.registerBackend('fake-webgl', () => new MathBackendCPU());

//     const fakeFeatures = {'BACKEND': 'fake-tensorflow'};
//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(false);

//     ENV.removeBackend('fake-webgl');
//   });

//   it('webgl backend, webgl 2.0 emulation on webgl 2.0', () => {
//     ENV.registerBackend('fake-webgl', () => new MathBackendCPU());
//     ENV.set('WEBGL_VERSION', 2);

//     const fakeFeatures = {'BACKEND': 'fake-webgl', 'WEBGL_VERSION': 2};
//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(true);

//     ENV.removeBackend('fake-webgl');
//   });

//   it('webgl backend, webgl 1.0 emulation on webgl 2.0', () => {
//     ENV.registerBackend('fake-webgl', () => new MathBackendCPU());
//     ENV.set('WEBGL_VERSION', 2);

//     const fakeFeatures = {'BACKEND': 'fake-webgl', 'WEBGL_VERSION': 1};
//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(true);
//     ENV.removeBackend('fake-webgl');
//   });

//   it('webgl backend, webgl 2.0 emulation on webgl 1.0 fails', () => {
//     ENV.registerBackend('fake-webgl', () => new MathBackendCPU());
//     ENV.set('WEBGL_VERSION', 1);

//     const fakeFeatures = {'BACKEND': 'fake-webgl', 'WEBGL_VERSION': 2};
//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(false);

//     ENV.removeBackend('fake-webgl');
//   });

//   it('webgl backend, webgl 1.0 no float emulation on webgl 2.0', () => {
//     ENV.registerBackend('fake-webgl', () => new MathBackendCPU());
//     ENV.set('WEBGL_VERSION', 2);
//     ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', true);

//     // Emulates iOS.
//     const fakeFeatures = {
//       'BACKEND': 'fake-webgl',
//       'WEBGL_VERSION': 1,
//       'WEBGL_RENDER_FLOAT32_ENABLED': false
//     };
//     expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(true);

//     ENV.removeBackend('fake-webgl');
//   });

//   it('webgl backend, webgl 1.0 no float emulation on webgl 1.0 no float',
//      () => {
//        ENV.registerBackend('fake-webgl', () => new MathBackendCPU());
//        ENV.set('WEBGL_VERSION', 1);
//        ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', false);
//        ENV.set('WEBGL_DOWNLOAD_FLOAT_ENABLED', false);

//        // Emulates iOS.
//        const fakeFeatures = {
//          'BACKEND': 'fake-webgl',
//          'WEBGL_VERSION': 1,
//          'WEBGL_RENDER_FLOAT32_ENABLED': false,
//          'WEBGL_DOWNLOAD_FLOAT_ENABLED': false
//        };
//        expect(jasmine_util.envSatisfiesConstraints(fakeFeatures)).toBe(true);

//        ENV.removeBackend('fake-webgl');
//      });
// });
