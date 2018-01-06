
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

import {NamedArrayMap} from '../../../util';
import {Array3D} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputGradientArrays} from '../tape_types';

// 3D
export interface LRN3DNode extends KernelNode {
  inputAndArgs: LRN3DInputConfig;
  output: Array3D;
  gradient: (dy: Array3D, y: Array3D) => LRN3DGradientInputArrays;
}

export interface LRN3DInputConfig extends KernelInputConfig {
  inputs: LRN3DInputArrays;
  args: {n: number, alpha: number, beta: number, k: number};
}

export interface LRN3DInputArrays extends NamedArrayMap {
  x: Array3D;
}

export interface LRN3DGradientInputArrays extends
    TapeNodeInputGradientArrays {
  x: () => Array3D;
}
