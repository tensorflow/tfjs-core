/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {scalar, tensor1d, tensor2d, test_util} from '../index';
import {NamedTensorMap} from '../types';

import {concatenateTypedArrays, encodeTensors} from './io_utils';

// import {WeightsManifestEntry} from './types';

describe('concatenateTypedArrays', () => {
  it('Single float arrays', () => {
    const x = new Float32Array([1.1, 2.2, 3.3]);
    const buffer = concatenateTypedArrays([x]);

    expect(buffer.byteLength).toEqual(12);
    const z = Array.from(new Float32Array(buffer, 0, 3));
    test_util.expectArraysClose(z, [1.1, 2.2, 3.3]);
  });

  it('Float arrays', () => {
    const x = new Float32Array([1.1, 2.2, 3.3]);
    const y = new Float32Array([-1.1, -2.2, -3.3]);
    const buffer = concatenateTypedArrays([x, y]);

    expect(buffer.byteLength).toEqual(24);
    const z = Array.from(new Float32Array(buffer, 0, 6));
    test_util.expectArraysClose(z, [1.1, 2.2, 3.3, -1.1, -2.2, -3.3]);
  });

  it('Single int32 arrays', () => {
    const x = new Int32Array([11, 22, 33]);
    const buffer = concatenateTypedArrays([x]);

    expect(buffer.byteLength).toEqual(12);
    const z = Array.from(new Int32Array(buffer, 0, 3));
    test_util.expectArraysClose(z, [11, 22, 33]);
  });

  it('Int32 arrays', () => {
    const x = new Int32Array([11, 22, 33]);
    const y = new Int32Array([-11, -22, -33]);
    const buffer = concatenateTypedArrays([x, y]);

    expect(buffer.byteLength).toEqual(24);
    const z = Array.from(new Int32Array(buffer, 0, 6));
    test_util.expectArraysClose(z, [11, 22, 33, -11, -22, -33]);
  });

  it('Single uint8 arrays', () => {
    const x = new Uint8Array([11, 22, 33]);
    const buffer = concatenateTypedArrays([x]);

    expect(buffer.byteLength).toEqual(3);
    const z = Array.from(new Uint8Array(buffer, 0, 3));
    test_util.expectArraysClose(z, [11, 22, 33]);
  });

  it('Uint8 arrays', () => {
    const x = new Uint8Array([11, 22, 33]);
    const y = new Uint8Array([111, 122, 133]);
    const buffer = concatenateTypedArrays([x, y]);

    expect(buffer.byteLength).toEqual(6);
    const z = Array.from(new Uint8Array(buffer, 0, 6));
    test_util.expectArraysClose(z, [11, 22, 33, 111, 122, 133]);
  });
});

describe('encodeTensors', () => {
  it('Float32 tensors', async done => {
    // const entries: WeightsManifestEntry[] = [{
    //   name: 'x1',
    //   dtype: 'float32',
    //   shape: [2, 2],
    // }, {
    //   name: 'x2',
    //   dtype: 'float32',
    //   shape: [],
    // }, {
    //   name: 'x3',
    //   dtype: 'float32',
    //   shape: [3],
    // }];
    const tensors: NamedTensorMap = {
      x1: tensor2d([[10, 20], [30, 40]]),
      x2: scalar(42),
      x3: tensor1d([-1, -3, -3, -7]),
    };
    encodeTensors(tensors).then(dataAndManifest => {
      const data = dataAndManifest[0];
      expect(data.byteLength).toEqual(4 * (4 + 1 + 4));
      done();
    });
  });
});
