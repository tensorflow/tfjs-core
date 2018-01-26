/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import * as test_util from '../test_util';
import {MathTests} from '../test_util';
import {Array2D} from './ndarray';

const tests: MathTests = it => {
  it('A x B', math => {
    const a = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);
    const b = Array2D.new([3, 2], [0, 1, -3, 2, 2, 1]);

    const c = math.matMul(a, b);

    expect(c.shape).toEqual([2, 2]);
    test_util.expectArraysClose(c, [0, 8, -3, 20]);
  });
};

test_util.describeMathCPU('DEBUG:true', [tests], [{'DEBUG': true}]);
test_util.describeMathGPU('DEBUG:true', [tests], [
  {'DEBUG': true, 'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
  {'DEBUG': true, 'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
  {'DEBUG': true, 'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
]);
