
/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import * as tf from './index';

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
