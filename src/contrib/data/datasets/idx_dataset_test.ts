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
 *
 * =============================================================================
 */

import * as dl from '../../../index';
import {expectArraysEqual} from '../../../test_util';

import {IDXDataset} from './idx_dataset';

const values = [
  [1, 2, 3, 4, 5, 6], [11, 12, 13, 14, 15, 16], [21, 22, 23, 24, 25, 26],
  [31, 32, 33, 34, 35, 36], [41, 42, 43, 44, 45, 46]
];

function createTestIdxBlob(): Blob {
  const buffer = new ArrayBuffer(16 + 5 * 6);
  const view = new DataView(buffer);
  let index = 0;

  // IDX header indicating 3-dimensional 8-bit unsigned integer data,
  // which we interpret as a sequence of 2-dimensional examples.
  view.setUint8(index++, 0);
  view.setUint8(index++, 0);
  view.setUint8(index++, 0x08);
  view.setUint8(index++, 3);

  // 5 elements, each of which is a 2x3 tensor.
  view.setInt32(index, 5, false);  // big-endian
  index += 4;
  view.setInt32(index, 2, false);
  index += 4;
  view.setInt32(index, 3, false);
  index += 4;

  // The data
  for (const v of values) {
    for (let i = 0; i < 6; i++) {
      view.setUint8(index++, v[i]);
    }
  }
  return new Blob([buffer]);
}

describe('IdxDataset', () => {
  it('Produces a stream of DatasetElements containing tensors', async () => {
    const source =
        new dl.contrib.FileDataSource(createTestIdxBlob(), {chunkSize: 22});
    const dataset = new IDXDataset(source);
    const stream = await dataset.getStream();
    const result = await stream.collectRemaining();

    expect(result.length).toEqual(5);
    for (let i = 0; i < 5; i++) {
      expectArraysEqual(
          result[i]['data'] as dl.Tensor, dl.tensor2d(values[i], [2, 3]));
    }
  });
});
