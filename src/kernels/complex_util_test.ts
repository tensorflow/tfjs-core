/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import * as complex_util from './complex_util';
import {InternalComplex} from './complex_util';
import {expectArraysClose, ALL_ENVS} from '../test_util';
import {describeWithFlags} from '../jasmine_util';

describe('complex_util', () => {
  it('mergeRealAndImagArrays', () => {
    const real = new Float32Array([1, 2, 3]);
    const imag = new Float32Array([4, 5, 6]);
    const complex = complex_util.mergeRealAndImagArrays(real, imag);
    expect(complex).toEqual(new Float32Array([1, 4, 2, 5, 3, 6]));
  });

  it('splitRealAndImagArrays', () => {
    const complex = new Float32Array([1, 4, 2, 5, 3, 6]);
    const result = complex_util.splitRealAndImagArrays(complex);
    expect(result.real).toEqual(new Float32Array([1, 2, 3]));
    expect(result.imag).toEqual(new Float32Array([4, 5, 6]));
  });

  it('c1 + c2', () => {
    const c1 = new InternalComplex(1, 2);
    const c2 = new InternalComplex(2, 3);

    expect(c1.add(c2)).toEqual(new InternalComplex(3, 5));
  });

  it('c1 - c2', () => {
    const c1 = new InternalComplex(1, 2);
    const c2 = new InternalComplex(2, 3);

    expect(c1.sub(c2)).toEqual(new InternalComplex(-1, -1));
  });

  it('c1 * c2', () => {
    const c1 = new InternalComplex(1, 2);
    const c2 = new InternalComplex(2, 3);

    expect(c1.mul(c2)).toEqual(new InternalComplex(-4, 7));
  });

  it('get complex number from TypedArray', () => {
    const t = new Float32Array(4);
    t[0] = 1;
    t[1] = 2;
    t[2] = 3;
    t[3] = 4;

    expect(complex_util.getComplexWithIndex(t, 0))
      .toEqual(new InternalComplex(1, 2));
    expect(complex_util.getComplexWithIndex(t, 1))
      .toEqual(new InternalComplex(3, 4));
  });

});

describeWithFlags('complex_util assignment', ALL_ENVS, () => {
  it('assign complex value in TypedArray', () => {
    const t = new Float32Array(4);

    complex_util.assignToTypedArray(t, new InternalComplex(1, 2), 0);
    complex_util.assignToTypedArray(t, new InternalComplex(3, 4), 1);

    expectArraysClose(t, new Float32Array([1, 2, 3, 4]));
  });
});
