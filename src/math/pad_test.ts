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

// math.pad
{
  const tests: MathTests = it => {
    it('KREEGER', math => {
      const a = Array1D.new([1, 2, 3, 4, 5, 6], 'int32');
      const b = math.pad1D(a, [1, 1]);
      console.log('b', b.dataSync());
    });

    it('KREEGER 2', math => {
      const a = Array2D.new([2, 3], [[1, 2, 3], [4, 5, 6]], 'int32');
      const b = math.pad2D(a, [[0, 0], [0, 0]]);
      console.log('b', b.dataSync());
    });
  };

  test_util.describeMathCPU('pad', [tests]);
}
