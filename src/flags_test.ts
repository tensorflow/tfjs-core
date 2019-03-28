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

import {ENV} from './environment';
import * as tf from './index';
import {ALL_ENVS, describeWithFlags} from './jasmine_util';

describeWithFlags('TENSORLIKE_CHECK_SHAPE_CONSISTENCY', ALL_ENVS, () => {
  it('disabled when prod is enabled', () => {
    ENV.set('PROD', true);
    expect(ENV.get('TENSORLIKE_CHECK_SHAPE_CONSISTENCY')).toBe(false);
  });

  it('enabled when prod is disabled', () => {
    ENV.set('PROD', false);
    expect(ENV.get('TENSORLIKE_CHECK_SHAPE_CONSISTENCY')).toBe(true);
  });
});

describe('public api tf.*', () => {
  beforeEach(() => {
    ENV.reset();
  });

  afterEach(() => {
    ENV.reset();
  });

  it('tf.enableProdMode', () => {
    tf.enableProdMode();
    expect(ENV.get('PROD')).toBe(true);
  });

  it('tf.enableDebugMode', () => {
    tf.enableDebugMode();
    expect(ENV.get('DEBUG')).toBe(true);
  });
});
