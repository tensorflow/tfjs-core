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

// math.batchNormalization3D
{
  // TODO(nsthorat): Fix the precision for byte-packed batchnorm.
  const epsilon = 1e-1;
  const tests: MathTests = it => {
    it('simple batchnorm2d, no offset or scale, 2x1x2', math => {
      const x = Array2D.new([2, 2], new Float32Array([2, 100, 4, 400]));
      const mean = Array1D.new([1, 2]);
      const variance = Array1D.new([2, 3]);
      const varianceEpsilon = .001;

      const result = math.batchNormalization2D(
          x, mean, variance, varianceEpsilon, undefined, undefined);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([
            (x.get(0, 0) - mean.get(0)) * 1 /
                Math.sqrt(variance.get(0) + varianceEpsilon),
            (x.get(0, 1) - mean.get(1)) * 1 /
                Math.sqrt(variance.get(1) + varianceEpsilon),
            (x.get(1, 0) - mean.get(0)) * 1 /
                Math.sqrt(variance.get(0) + varianceEpsilon),
            (x.get(1, 1) - mean.get(1)) * 1 /
                Math.sqrt(variance.get(1) + varianceEpsilon)
          ]),
          epsilon);

      x.dispose();
      mean.dispose();
      variance.dispose();
    });
  };
  test_util.describeMathCPU('batchNormalization3D', [tests]);
}