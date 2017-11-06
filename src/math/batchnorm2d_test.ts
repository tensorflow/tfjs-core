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

// math.batchNormalization2D
{
  // TODO(nsthorat): Fix the precision for byte-packed batchnorm.
  const epsilon = 1e-1;
  const tests: MathTests = it => {
    it('simple batchnorm2D, no offset or scale, 2x2', math => {
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
    it('simple batchnorm2D, no offset, 2x2', math => {
      const x = Array2D.new([2, 2], new Float32Array([2, 100, 4, 400]));
      const mean = Array1D.new([1, 2]);
      const variance = Array1D.new([2, 3]);
      const scale = Array1D.new([4, 5]);
      const varianceEpsilon = .001;

      const result = math.batchNormalization2D(
          x, mean, variance, varianceEpsilon, scale, undefined);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([
            (x.get(0, 0) - mean.get(0)) * scale.get(0) /
                Math.sqrt(variance.get(0) + varianceEpsilon),
            (x.get(0, 1) - mean.get(1)) * scale.get(1) /
                Math.sqrt(variance.get(1) + varianceEpsilon),
            (x.get(1, 0) - mean.get(0)) * scale.get(0) /
                Math.sqrt(variance.get(0) + varianceEpsilon),
            (x.get(1, 1) - mean.get(1)) * scale.get(1) /
                Math.sqrt(variance.get(1) + varianceEpsilon)
          ]),
          epsilon);

      x.dispose();
      mean.dispose();
      variance.dispose();
      scale.dispose();
    });

    it('simple batchnorm2D, no scale, 2x2', math => {
      const x = Array2D.new([2, 2], new Float32Array([2, 100, 4, 400]));
      const mean = Array1D.new([1, 2]);
      const variance = Array1D.new([2, 3]);
      const offset = Array1D.new([4, 5]);

      const varianceEpsilon = .001;

      const result = math.batchNormalization2D(
          x, mean, variance, varianceEpsilon, undefined, offset);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([
            offset.get(0) +
                (x.get(0, 0) - mean.get(0)) * 1 /
                    Math.sqrt(variance.get(0) + varianceEpsilon),
            offset.get(1) +
                (x.get(0, 1) - mean.get(1)) * 1 /
                    Math.sqrt(variance.get(1) + varianceEpsilon),
            offset.get(0) +
                (x.get(1, 0) - mean.get(0)) * 1 /
                    Math.sqrt(variance.get(0) + varianceEpsilon),
            offset.get(1) +
                (x.get(1, 1) - mean.get(1)) * 1 /
                    Math.sqrt(variance.get(1) + varianceEpsilon)
          ]),
          epsilon);
      x.dispose();
      mean.dispose();
      variance.dispose();
      offset.dispose();
    });

    it('simple batchnorm2D, 2x2', math => {
      const x = Array2D.new([2, 2], new Float32Array([2, 100, 4, 400]));
      const mean = Array1D.new([1, 2]);
      const variance = Array1D.new([2, 3]);
      const offset = Array1D.new([3, 4]);
      const scale = Array1D.new([4, 5]);

      const varianceEpsilon = .001;

      const result = math.batchNormalization2D(
          x, mean, variance, varianceEpsilon, scale, offset);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([
            offset.get(0) +
                (x.get(0, 0) - mean.get(0)) * scale.get(0) /
                    Math.sqrt(variance.get(0) + varianceEpsilon),
            offset.get(1) +
                (x.get(0, 1) - mean.get(1)) * scale.get(1) /
                    Math.sqrt(variance.get(1) + varianceEpsilon),
            offset.get(0) +
                (x.get(1, 0) - mean.get(0)) * scale.get(0) /
                    Math.sqrt(variance.get(0) + varianceEpsilon),
            offset.get(1) +
                (x.get(1, 1) - mean.get(1)) * scale.get(1) /
                    Math.sqrt(variance.get(1) + varianceEpsilon)
          ]),
          epsilon);
      x.dispose();
      mean.dispose();
      variance.dispose();
      scale.dispose();
      offset.dispose();
    });

    it('batchnorm2D matches tensorflow, 3x3', math => {
      const x = Array2D.new(
          [3, 3], new Float32Array([
            0.49955603, 0.04158615, -1.09440524,
            2.03854165, -0.61578344, 2.87533573,
            1.18105987, 0.807462, 1.87888837
          ]));
      const mean = Array1D.new([0.39745062, -0.48062894, 0.4847822]);
      const variance = Array1D.new([0.32375343, 0.67117643, 1.08334653]);
      const offset = Array1D.new([0.69398749, -1.29056387, 0.9429723]);
      const scale = Array1D.new([-0.5607271, 0.9878457, 0.25181573]);
      const varianceEpsilon = .001;

      const result = math.batchNormalization2D(
          x, mean, variance, varianceEpsilon, scale, offset);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([
            0.59352049, -0.66135202, 0.5610874,
            -0.92077015, -1.45341019, 1.52106473,
            -0.07704776, 0.26144429, 1.28010017
          ]));

      x.dispose();
      mean.dispose();
      variance.dispose();
      scale.dispose();
      offset.dispose();
    });
  };
  test_util.describeMathCPU('batchNormalization2D', [tests]);
  test_util.describeMathGPU('batchNormalization2D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}