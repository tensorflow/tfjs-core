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

import * as dl from '../index';
// tslint:disable-next-line:max-line-length
import {ALL_ENVS, describeWithFlags, expectArraysClose, expectNumbersClose} from '../test_util';

describeWithFlags('absoluteDifference', ALL_ENVS, () => {
  it('1D', () => {
    const predictions = dl.tensor1d([1, 2, 3]);
    const label = dl.tensor1d([0.3, -0.6, -0.1]);

    const y = dl.losses.absoluteDifference(label, predictions);

    expect(y.shape).toEqual([3]);
    expectArraysClose(
        y, [Math.abs(1 - 0.3), Math.abs(2 - (-0.6)), Math.abs(3 - (-0.1))]);
  });

  it('1D - weighted', () => {
    const predictions = dl.tensor1d([1, 2, 3]);
    const label = dl.tensor1d([0.3, -0.6, -0.1]);
    const weights = dl.tensor1d([0.1, 0.2, 0.3]);

    const y = dl.losses.absoluteDifference(label, predictions, weights);

    expect(y.shape).toEqual([3]);
    expectArraysClose(y, [
      Math.abs(1 - 0.3) * 0.1, Math.abs(2 - (-0.6)) * 0.2,
      Math.abs(3 - (-0.1)) * 0.3
    ]);
  });

  it('1D - reduced', () => {
    const predictions = dl.tensor1d([1, 2, 3]);
    const label = dl.tensor1d([0.3, -0.6, -0.1]);

    const y = dl.losses.absoluteDifference(
        label, predictions, undefined, dl.Reduction.MEAN);

    expect(y.shape).toEqual([]);
    expectNumbersClose(
        y.get(),
        (Math.abs(1 - 0.3) + Math.abs(2 - (-0.6)) + Math.abs(3 - (-0.1))) / 3);
  });

  it('1D - weighted reduction', () => {
    const predictions = dl.tensor1d([1, 2, 3]);
    const label = dl.tensor1d([0.3, -0.6, -0.1]);
    const weights = dl.tensor1d([0.1, 0.2, 0.3]);

    const y = dl.losses.absoluteDifference(
        label, predictions, weights, dl.Reduction.MEAN);

    expect(y.shape).toEqual([]);
    expectNumbersClose(
        y.get(),
        ((Math.abs(1 - 0.3) * 0.1) + (Math.abs(2 - (-0.6)) * 0.2) +
         (Math.abs(3 - (-0.1)) * 0.3)) /
            0.6);
  });

  it('2D', () => {
    const predictions = dl.tensor2d([4, 8, 12, 8, 1, 3], [2, 3]);
    const label = dl.tensor2d([1, 9, 2, -5, -2, 6], [2, 3]);

    const y = dl.losses.absoluteDifference(label, predictions);

    expect(y.shape).toEqual([2, 3]);
    expectArraysClose(y, [
      Math.abs(4 - 1), Math.abs(8 - 9), Math.abs(12 - 2), Math.abs(8 - (-5)),
      Math.abs(1 - (-2)), Math.abs(3 - 6)
    ]);
  });

  it('2D - weighted', () => {
    const predictions = dl.tensor2d([4, 8, 12, 8, 1, 3], [2, 3]);
    const label = dl.tensor2d([1, 9, 2, -5, -2, 6], [2, 3]);
    const weights = dl.tensor2d([3, 6, 5, 0, 4, 2], [2, 3]);

    const y = dl.losses.absoluteDifference(label, predictions, weights);

    expect(y.shape).toEqual([2, 3]);
    expectArraysClose(y, [
      Math.abs(4 - 1) * 3, Math.abs(8 - 9) * 6, Math.abs(12 - 2) * 5,
      Math.abs(8 - (-5)) * 0, Math.abs(1 - (-2)) * 4, Math.abs(3 - 6) * 2
    ]);
  });

  it('2D - reduced', () => {
    const predictions = dl.tensor2d([4, 8, 12, 8, 1, 3], [2, 3]);
    const label = dl.tensor2d([1, 9, 2, -5, -2, 6], [2, 3]);

    const y = dl.losses.absoluteDifference(
        label, predictions, undefined, dl.Reduction.MEAN);

    expect(y.shape).toEqual([]);
    expectNumbersClose(
        y.get(),
        (Math.abs(4 - 1) + Math.abs(8 - 9) + Math.abs(12 - 2) +
         Math.abs(8 - (-5)) + Math.abs(1 - (-2)) + Math.abs(3 - 6)) /
            6);
  });

  it('2D - weighted reduction', () => {
    const predictions = dl.tensor2d([4, 8, 12, 8, 1, 3], [2, 3]);
    const label = dl.tensor2d([1, 9, 2, -5, -2, 6], [2, 3]);
    const weights = dl.tensor2d([3, 6, 5, 0, 4, 2], [2, 3]);

    const y = dl.losses.absoluteDifference(
        label, predictions, weights, dl.Reduction.MEAN);

    expect(y.shape).toEqual([]);
    expectNumbersClose(
        y.get(),
        (Math.abs(4 - 1) * 3 + Math.abs(8 - 9) * 6 + Math.abs(12 - 2) * 5 +
         Math.abs(8 - (-5)) * 0 + Math.abs(1 - (-2)) * 4 +
         Math.abs(3 - 6) * 2) /
            20);
  });
});
