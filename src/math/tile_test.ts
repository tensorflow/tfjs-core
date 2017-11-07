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

import {Array1D, Array2D} from './ndarray';

// math.tile
{
  const tests: MathTests = it => {
    it('1D (tile)', math => {
      const t = Array1D.new([1, 2, 3]);

      const t2 = math.tile(t, [2]);

      expect(t2.shape).toEqual([6]);
      test_util.expectArraysClose(t2.getValues(), 
        new Float32Array([1, 2, 3, 1, 2, 3]));

      t.dispose();
    });

  it('2D (tile)', math => {
      const t = Array2D.new([2, 2], [1, 11, 2, 22]);
      let t2 = math.tile(t, [1, 2]);
      expect(t2.shape).toEqual([2, 4]);
      let expected = new Float32Array([1, 11, 1, 11, 2, 22, 2, 22]);
      test_util.expectArraysClose(t2.getValues(), expected);

      t2 = math.tile(t, [2, 1]);
      expect(t2.shape).toEqual([4, 2]);
      expected = new Float32Array([1, 11, 2, 22, 1, 11, 2, 22]);
      test_util.expectArraysClose(t2.getValues(), expected);

      t2 = math.tile(t, [2, 2]);
      expect(t2.shape).toEqual([4, 4]);
      expected = new Float32Array([1, 11, 1, 11, 2, 22, 2, 22, 
          1, 11, 1, 11, 2, 22, 2, 22]);
      test_util.expectArraysClose(t2.getValues(), expected);

      t.dispose();
    });
  };

  test_util.describeMathCPU('tile', [tests]);
  //test_util.describeMathGPU('tile', [tests], [
  //  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
  //  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
  //  {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  //]);
}
