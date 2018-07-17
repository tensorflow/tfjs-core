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

import {ENV} from '../environment';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util';
import {TensorLike} from '../types';
import {op} from './operation';

function topk_<T extends Tensor>(x: T|TensorLike, k: number, sorted = true): T {
  const $x = convertToTensor(x, 'x', 'topk');

  if ($x.rank === 0) {
    throw new Error('Topk expects the input to be of rank-1 or higher');
  }
  return ENV.engine.runKernel(b => b.topk(x, k, sorted), {x});
}

export const topk = op({topk_});
