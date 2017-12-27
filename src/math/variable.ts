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

import {ENV} from '../environment';
import * as util from '../util';
// tslint:disable-next-line:max-line-length
import {DataTypes, NDArray, Rank} from './ndarray';

export class Variable<D extends keyof DataTypes, R extends keyof Rank> extends
    NDArray<D, R> {
  constructor(initialValue: NDArray<D, R>, public trainable = true, dtype?: D) {
    super(initialValue.shape, initialValue.dtype, null, initialValue.id);
    ENV.math.keep(initialValue);
  }

  assign(newValue: NDArray<D, R>): void {
    if (newValue.dtype !== this.dtype) {
      throw new Error(
          `dtype of the new value (${newValue.dtype}) and ` +
          `previous value (${this.dtype}) must match`);
    }
    if (!util.arraysEqual(newValue.shape, this.shape)) {
      throw new Error(
          `shape of the new value (${newValue.shape}) and ` +
          `previous value (${this.shape}) must match`);
    }
    this.math.disposeData(this.id);
    this.id = newValue.id;
    ENV.math.keep(this);
  }
}
