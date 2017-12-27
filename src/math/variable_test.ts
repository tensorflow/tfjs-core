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

// tslint:disable-next-line:max-line-length
import * as test_util from '../test_util';
import {MathTests} from '../test_util';
import {Array1D} from './ndarray';
import {Variable} from './variable';

const tests: MathTests = it => {
  it('math ops can take variables', math => {
    const value = Array1D.new([1, 2, 3]);
    const v = new Variable(value);
    const res = math.sum(v);
    test_util.expectArraysClose(res, [6]);
  });

  it('variables are not affected by scopes', math => {
    let v: Variable<'float32', '1'>;
    expect(math.getNumArrays()).toBe(0);

    math.scope(() => {
      const value = Array1D.new([1, 2, 3], 'float32');
      expect(math.getNumArrays()).toBe(1);

      v = new Variable(value);
      expect(math.getNumArrays()).toBe(1);
    });

    expect(math.getNumArrays()).toBe(1);
    test_util.expectArraysClose(v, [1, 2, 3]);

    v.dispose();
    expect(math.getNumArrays()).toBe(0);
  });

  it('update will dispose old data', math => {
    let v: Variable<'float32', '1'>;
    const firstValue = Array1D.new([1, 2, 3]);

    v = new Variable(firstValue);
    expect(math.getNumArrays()).toBe(1);

    const secondValue = Array1D.new([4, 5, 6]);
    expect(math.getNumArrays()).toBe(2);

    v.assign(secondValue);
    expect(math.getNumArrays()).toBe(1);
    // The first value was disposed.
    expect(() => firstValue.dataSync()).toThrowError();

    v.dispose();
    expect(math.getNumArrays()).toBe(0);
    // The second value was disposed.
    expect(() => secondValue.dataSync()).toThrowError();
  });
};

test_util.describeMathCPU('Variables', [tests]);
test_util.describeMathGPU('Variables', [tests], [
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
]);
