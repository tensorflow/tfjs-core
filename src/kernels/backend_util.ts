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

import {ArrayOps} from '../ops/array_ops';
import {Tensor} from '../tensor';
import {DataType, Rank, ShapeMap} from '../types';
import {hasEncodingLoss} from '../util';
import {KernelBackend} from './backend';

export function castTensor<T extends Tensor<Rank>>(
    x: T, dtype: DataType, backend: KernelBackend): T {
  if (!hasEncodingLoss(x.dtype, dtype)) {
    // We don't change the underlying data, since we cast to higher
    // precision.
    return Tensor.make(x.shape, {dataId: x.dataId}, dtype) as T;
  }
  if (dtype === 'int32') {
    return backend.int(x);
  } else if (dtype === 'bool') {
    return backend.notEqual(x, ArrayOps.scalar(0, x.dtype)) as T;
  } else {
    throw new Error(`Error in Cast: unknown dtype argument (${dtype})`);
  }
}

export function reshapeTensor<T extends Tensor<Rank>, R extends Rank>(
    x: T, shape: ShapeMap[R]): Tensor<R> {
  return Tensor.make(shape, {dataId: x.dataId}, x.dtype);
}
