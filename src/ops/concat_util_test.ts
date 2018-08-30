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

import * as concat_util from './concat_util';

describe('concat_util.assertConcatShapesMatch rank=3D', () => {
  it('Non-3D tensor x1', () => {
    const assertFn = () => {
      concat_util.assertParams([[1], [1, 2, 3]], 1);
    };

    expect(assertFn).toThrow();
  });

  it('Non-3D tensor x2', () => {
    const assertFn = () => {
      concat_util.assertParams([[1, 2, 3], [2, 3]], 1);
    };

    expect(assertFn).toThrow();
  });

  it('axis out of bound', () => {
    const assertFn = () => {
      concat_util.assertParams([[1, 2, 3], [1, 2, 3]], 4);
    };

    expect(assertFn).toThrow();
  });

  it('non-axis shape mismatch', () => {
    const assertFn = () => {
      concat_util.assertParams([[2, 3, 3], [2, 2, 4]], 2);
    };

    expect(assertFn).toThrow();
  });

  it('shapes line up', () => {
    const assertFn = () => {
      concat_util.assertParams([[2, 3, 3], [2, 3, 4]], 2);
    };

    expect(assertFn).not.toThrow();
  });
});

describe('concat_util.computeConcatOutputShape', () => {
  it('compute output shape, axis=0', () => {
    expect(concat_util.computeOutShape([[2, 2, 3], [1, 2, 3]], 0)).toEqual([
      3, 2, 3
    ]);
  });
});

describe('concat_util.computeGradientSliceShapes', () => {
  it('axis = 0', () => {
    const a = [3, 7];
    const b = [5, 7];
    const axis = 0;
    const gradSlices = concat_util.computeGradientSliceShapes([a, b], axis);
    expect(gradSlices[0].begin).toEqual([0, 0]);
    expect(gradSlices[0].size).toEqual(a);
    expect(gradSlices[1].begin).toEqual([3, 0]);
    expect(gradSlices[1].size).toEqual(b);
  });

  it('axis = 1', () => {
    const a = [3, 7, 6];
    const b = [3, 4, 6];
    const axis = 1;
    const gradSlices = concat_util.computeGradientSliceShapes([a, b], axis);
    expect(gradSlices[0].begin).toEqual([0, 0, 0]);
    expect(gradSlices[0].size).toEqual(a);
    expect(gradSlices[1].begin).toEqual([0, 7, 0]);
    expect(gradSlices[1].size).toEqual(b);
  });

  it('axis = 2', () => {
    const a = [3, 1, 6];
    const b = [3, 1, 8];
    const axis = 2;
    const gradSlices = concat_util.computeGradientSliceShapes([a, b], axis);
    expect(gradSlices[0].begin).toEqual([0, 0, 0]);
    expect(gradSlices[0].size).toEqual(a);
    expect(gradSlices[1].begin).toEqual([0, 0, 6]);
    expect(gradSlices[1].size).toEqual(b);
  });
});
