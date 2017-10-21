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
import {Array1D, Array2D, NDArray} from './ndarray';

const tests: MathTests = it => {

  it('Flip a fair coin and check bounds', math => {
    const probs = Array1D.new([0.5, 0.5]);
    const result = math.multinomial(probs, 100);
    expect(result.dtype).toBe('int32');
    expect(result.shape).toEqual([100]);
    const [min, max] = getBounds(result.getValues());
    expect(min >= 0);
    expect(max <= 1);
  });

  it('Flip a two-sided coin with 100% of heads', math => {
    const probs = Array1D.new([1, 0]);
    const result = math.multinomial(probs, 100);
    expect(result.dtype).toBe('int32');
    expect(result.shape).toEqual([100]);
    const [min, max] = getBounds(result.getValues());
    expect(min).toBe(0);
    expect(max).toBe(0);
  });

  it('Flip a two-sided coin with 100% of tails', math => {
    const probs = Array1D.new([0, 1]);
    const result = math.multinomial(probs, 100);
    expect(result.dtype).toBe('int32');
    expect(result.shape).toEqual([100]);
    const [min, max] = getBounds(result.getValues());
    expect(min).toBe(1);
    expect(max).toBe(1);
  });

  it('Flip a single-sided coin throws error', math => {
    const probs = Array1D.new([1]);
    expect(() => math.multinomial(probs, 100)).toThrowError();
  });

  it('Flip a ten-sided coin and check bounds', math => {
    const n = 10;
    const probs = Array1D.zeros([n]);
    for (let i = 0; i < n; ++i) {
      probs.set(1 / n, i);
    }
    const result = math.multinomial(probs, 100);
    expect(result.dtype).toBe('int32');
    expect(result.shape).toEqual([100]);
    const [min, max] = getBounds(result.getValues());
    expect(min >= 0);
    expect(max <= 9);
  });

  it('Flip 2 three-sided coins, each coin is 100% biases', math => {
    const probs = Array2D.new([3, 3], [[0, 0, 1], [0, 1, 0], [1, 0, 0]]);
    const numSamples = 20;
    const result = math.multinomial(probs, numSamples);
    expect(result.dtype).toBe('int32');
    expect(result.shape).toEqual([3, numSamples]);

    // First coin always gets last event.
    let [min, max] = getBounds(result.getValues().slice(0, numSamples));
    expect(min).toBe(2);
    expect(max).toBe(2);

    // Second coin always gets middle event.
    [min, max] =
        getBounds(result.getValues().slice(numSamples, numSamples * 2));
    expect(min).toBe(1);
    expect(max).toBe(1);

    // Third coin always gets first event
    [min, max] = getBounds(result.getValues().slice(numSamples * 2));
    expect(min).toBe(0);
    expect(max).toBe(0);
  });

  it('passing Array3D throws error', math => {
    const probs = NDArray.zeros([3, 2, 2]) as Array1D;
    expect(() => math.multinomial(probs, 3)).toThrowError();
  });

  function getBounds(a: Float32Array|Uint8Array|Int32Array) {
    let min = a[0];
    let max = a[0];

    for (let i = 1; i < a.length; ++i) {
      min = Math.min(min, a[i]);
      max = Math.max(max, a[i]);
    }
    return [min, max];
  }
};

test_util.describeMathCPU('multinomial', [tests]);
test_util.describeMathGPU('multinomial', [tests], [
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
]);
