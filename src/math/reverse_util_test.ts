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

import * as reverse_util from './reverse_util';

describe('reverse_util cleanAxisParam', () => {
  it('turns single argument into array', () => {
    const axis = 1;
    const cleanedAxis = reverse_util.cleanAxisParam(axis, 1);
    expect(cleanedAxis).toEqual([1]);
  });

  it('adds a constant to the axis', () => {
    const axis = 1;
    const cleanedAxis = reverse_util.cleanAxisParam(axis, 1, 2);
    expect(cleanedAxis).toEqual([3]);
  });

  it('converts negative numbers to positive dims', () => {
    const axis = [-2, -1];
    const cleanedAxis = reverse_util.cleanAxisParam(axis, 3);
    expect(cleanedAxis).toEqual([1, 2]);
  });
});
