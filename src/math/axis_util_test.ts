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

import * as axis_util from './axis_util';

describe('axis_util computeLocation', () => {
  it('rank 4, reduce last 2 dims', () => {
    const loc = axis_util.computeLocation([4, 1], [3, 7], [2, 3]);
    expect(loc).toEqual([4, 1, 3, 7]);
  });

  it('rank 4, reduce first two dims', () => {
    const loc = axis_util.computeLocation([4, 1], [3, 7], [0, 1]);
    expect(loc).toEqual([3, 7, 4, 1]);
  });
});
