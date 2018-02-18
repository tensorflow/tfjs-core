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

import {Rank} from '../types';
import {KernelBackend} from './backend';
import {ConcatNode} from './types/concat';
import {GatherNode} from './types/gather';
import {Reverse4DNode} from './types/reverse';
import {SumNode} from './types/sum';
import {TopKIndicesNode, TopKValuesNode} from './types/topk';

export function
executeKernel<R extends Rank, K extends keyof KernelConfigRegistry<R>, O extends
                  KernelConfigRegistry<R>[K]['output']>(
    backend: KernelBackend, kernelName: K,
    inputAndArgs: KernelConfigRegistry<R>[K]['inputAndArgs']): O {
  if (kernelName === 'Reverse4D') {
    const config = inputAndArgs as Reverse4DNode['inputAndArgs'];
    return backend.reverse4D(config.inputs.x, config.args.axis) as O;
  } else if (kernelName === 'Concat') {
    const config = inputAndArgs as ConcatNode['inputAndArgs'];
    return backend.concat(config.inputs.a, config.inputs.b) as O;
  } else if (kernelName === 'Sum') {
    const config = inputAndArgs as SumNode['inputAndArgs'];
    return backend.sum(config.inputs.x, config.args.axes) as O;
  } else if (kernelName === 'TopKValues') {
    const config = inputAndArgs as TopKValuesNode<R>['inputAndArgs'];
    return backend.topKValues(config.inputs.x, config.args.k) as O;
  } else if (kernelName === 'TopKIndices') {
    const config = inputAndArgs as TopKIndicesNode['inputAndArgs'];
    return backend.topKIndices(config.inputs.x, config.args.k) as O;
  } else if (kernelName === 'Gather') {
    const config = inputAndArgs as GatherNode<R>['inputAndArgs'];
    return backend.gather(
               config.inputs.x, config.inputs.indices, config.args.axis) as O;
  }
  throw new Error(`No backend method found for kernel ${kernelName}`);
}

export interface KernelConfigRegistry<R extends Rank> {
  Reverse4D: Reverse4DNode;
  Concat: ConcatNode;
  Sum: SumNode;
  TopKValues: TopKValuesNode<R>;
  TopKIndices: TopKIndicesNode;
  Gather: GatherNode<R>;
}
