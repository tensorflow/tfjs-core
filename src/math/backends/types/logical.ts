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

import {DataType, NDArray} from '../../ndarray';
import {KernelInputConfig, KernelNode} from '../tape_types';

// Equal/NotEqual/Less/LessEqual/Greater/GreaterEqual
export interface EqualNode extends KernelNode {
  inputAndArgs: EqualInputConfig;
  output: NDArray<'bool'>;
  gradient: (dy: NDArray<'float32'>, y: NDArray<'bool'>) => {
    a: () => NDArray<'float32'>;
    b: () => NDArray<'float32'>;
  };
}

export interface EqualInputConfig extends KernelInputConfig {
  inputs: {a: NDArray; b: NDArray;};
}

// LogicalAnd/LogicalOr
export interface LogicalNode extends KernelNode {
  inputAndArgs: LogicalInputConfig;
  output: NDArray<'bool'>;
  gradient: (dy: NDArray<'float32'>, y: NDArray<'bool'>) => {
    a: () => NDArray<'float32'>;
    b: () => NDArray<'float32'>;
  };
}

export interface LogicalInputConfig extends KernelInputConfig {
  inputs: {a: NDArray; b: NDArray;};
}

// Where
export interface WhereNode extends KernelNode {
  inputAndArgs: WhereInputConfig;
  output: NDArray;
  gradient: (dy: NDArray<'float32'>, y: NDArray) => {
    condition: () => NDArray<'float32'>;
    a: () => NDArray<'float32'>;
    b: () => NDArray<'float32'>;
  };
}

export interface WhereInputConfig extends KernelInputConfig {
  inputs: {condition: NDArray; a: NDArray; b: NDArray;};
  args: {dtype: DataType};
}
