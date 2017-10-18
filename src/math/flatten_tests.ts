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

import * as test_util from '../test_util';
import {MathTests} from '../test_util';
import {Array1D, Array2D, Array3D, Array4D} from './ndarray';

const tests : MathTests = it => {
  it('flatten 1D', math => {
    const y = Array1D.new([1, 2]);
    expect(() => math.flatten(y)).toThrowError();
  });

  it('flatten 2D', math => {
    const y = math.flatten(Array2D.new([1, 1], [1, 1]));
    expect(y.shape).toEqual([2]);
  });

  it('flatten 3D', math => {
    const y = math.flatten(Array3D.new([1, 1, 1], [1, 1, 1]));
    expect(y.shape).toEqual([3]);
  });

  it('flatten 4D', math => {
    const y = math.flatten(Array4D.new([1, 1, 1, 1], [1, 1, 1, 1]));
    expect(y.shape).toEqual([4]);
  });

};

test_util.describeMathCPU('flatten', [tests]);
test_util.describeMathGPU('flatten', [tests], [
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
]);