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

import {ENV} from '../../environment';
import * as util from '../../util';
import * as ops from '../ops';
import {Tensor, Variable} from '../tensor';
import {NamedArrayMap, NamedVariableMap, TypedArray} from '../types';
import {Rank} from '../types';

import {MathBackend} from './backend';
import * as kernel_registry from './kernel_registry';
import {KernelConfigRegistry} from './kernel_registry';
import {Profiler} from './profiler';
// tslint:disable-next-line:max-line-length
import {KernelNode, Tape, TapeNode, TapeNodeInputGradientArrays} from './tape_types';
import * as tape_util from './tape_util';
import {ScopeResultImmediate} from './tape_util';
import {tidy} from './tracking';

interface ScopeState {
  keep: Tensor[];
  track: Tensor[];
}

export type CustomGradientFunc<T extends Tensor> = () => {
  value: T, gradients: (dy: T, y: T) => TapeNodeInputGradientArrays
};

export interface NDArrayManager {
  getNumArrays(): number;
  register(a: Tensor): void;
  registerVariable(v: Variable): void;
  disposeData(dataId: number): void;
}

export class BackendEngine implements NDArrayManager {
  // Public since optimizers will use it.
  registeredVariables: NamedVariableMap = {};

  private registeredArrays = new Map<number, number>();
  private nextTapeNodeId = 0;

  private activeTape: Tape;
  private gradientScopeCount = 0;
  private customGradientDepth = 0;

  // Keep Tensors that parallel the tapes.
  private activeScope: ScopeState;
  private scopeStack: ScopeState[];
  private profiler: Profiler;

  constructor(
      private backend: MathBackend, private customBackend: boolean,
      public safeMode: boolean) {
    // Create a default outer scope.
    this.activeScope = {keep: [], track: []};
    this.scopeStack = [this.activeScope];
    this.profiler = new Profiler(backend);
  }

  executeKernel<R extends Rank, K extends keyof KernelConfigRegistry<R>, C
                    extends KernelConfigRegistry<R>[K]['inputAndArgs']>(
      kernelName: K, config: C, grad?: KernelConfigRegistry<R>[K]['gradient']):
      KernelConfigRegistry<R>[K]['output'] {
    let result: KernelConfigRegistry<R>[K]['output'];
    if (!ENV.get('DEBUG')) {
      // NOTE: This isn't pulled out into a separate function to so that we
      // keep a shallow stack trace.
      result = kernel_registry.executeKernel(this.backend, kernelName, config);
    } else {
      result = this.profiler.profileKernel(
          kernelName,
          () =>
              kernel_registry.executeKernel(this.backend, kernelName, config));
    }

    const recordKernel =
        this.activeTape != null && this.customGradientDepth === 0;
    if (recordKernel) {
      config = tape_util.stripUndefinedInputsFromInputConfig(config) as C;

      const evaluatedNode: KernelNode = {
        id: this.nextTapeNodeId++,
        type: 'kernel',
        name: `kernel: ${kernelName}`,
        kernel: kernelName,
        inputAndArgs: config,
        output: result,
        gradient: grad
      };
      this.activeTape.push(evaluatedNode);
    }

    return result;
  }

  getBackend(): MathBackend {
    return this.backend;
  }

  getNumArrays() {
    return this.registeredArrays.size;
  }

  register(a: Tensor|Variable): void {
    const refCount = this.registeredArrays.has(a.dataId) ?
        this.registeredArrays.get(a.dataId) :
        0;
    if (refCount === 0) {
      this.backend.register(a.dataId, a.shape, a.dtype);
    }
    this.registeredArrays.set(a.dataId, refCount + 1);
    if (!(a instanceof Variable)) {
      this.track(a);
    }
  }

  private shouldRecord(): boolean {
    return this.activeTape != null && this.customGradientDepth === 0;
  }

  private addTapeNode(
      inputs: NamedArrayMap, result: Tensor,
      gradientsFunc: (dy: Tensor, y: Tensor) => TapeNodeInputGradientArrays):
      void {
    const evaluatedNode: TapeNode<Tensor> = {
      id: this.nextTapeNodeId++,
      type: 'customGradient',
      name,
      inputAndArgs: {inputs},
      output: result,
      gradient: gradientsFunc
    };
    this.activeTape.push(evaluatedNode);
  }

  keep<T extends Tensor>(result: T): T {
    if (this.scopeStack.length === 1 && ENV.engine.safeMode) {
      throw new Error(
          'Safe mode is ON. Enclose all tensor operations inside dl.tidy(): ' +
          'dl.tidy(() => {...}) to avoid memory leaks.');
    }
    this.activeScope.keep.push(result);
    return result;
  }

  /**
   * Start a scope. Use this with endScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  startScope(gradientsMode = false) {
    if (gradientsMode && this.gradientScopeCount === 0) {
      this.activeTape = [];
    }
    if (gradientsMode) {
      this.gradientScopeCount++;
    }

    const newScopeArrays: ScopeState = {keep: [], track: []};
    this.scopeStack.push(newScopeArrays);
    this.activeScope = newScopeArrays;
  }

  /**
   * End a scope. Use this with startScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  endScope(result: ScopeResultImmediate, gradientsMode = false) {
    if (gradientsMode) {
      this.gradientScopeCount--;
      if (this.gradientScopeCount === 0) {
        this.activeTape = null;
      }
    }

    let arraysToKeep = this.activeScope.keep;
    const arraysToTrackInParent =
        tape_util.extractTensorsFromScopeResult(result);
    arraysToKeep = arraysToKeep.concat(arraysToTrackInParent);

    // Dispose the arrays tracked in this scope.
    for (let i = 0; i < this.activeScope.track.length; i++) {
      const ndarray = this.activeScope.track[i];
      if (util.isTensorInList(ndarray, arraysToKeep)) {
        continue;
      }

      if (this.activeTape != null) {
        arraysToTrackInParent.push(ndarray);
      } else {
        ndarray.dispose();
      }
    }

    this.scopeStack.pop();
    this.activeScope = this.scopeStack.length === 0 ?
        {keep: [], track: []} :
        this.scopeStack[this.scopeStack.length - 1];

    // Track the current result in the parent scope.
    arraysToTrackInParent.forEach(ndarray => {
      if (!util.isTensorInList(ndarray, this.activeScope.keep)) {
        this.track(ndarray);
      }
    });
  }

  registerVariable(v: Variable) {
    if (this.registeredVariables[v.name] != null) {
      throw new Error(`Variable with name ${v.name} was already registered`);
    }
    this.registeredVariables[v.name] = v;
  }

  dispose() {
    if (this.customBackend) {
      this.backend.dispose();
    }
  }

  disposeData(dataId: number): void {
    if (!this.registeredArrays.has(dataId)) {
      return;
    }
    const refCount = this.registeredArrays.get(dataId);
    if (refCount <= 1) {
      this.registeredArrays.delete(dataId);
      this.backend.disposeData(dataId);
    } else {
      this.registeredArrays.set(dataId, refCount - 1);
    }
    // TODO(nsthorat): Construct an error and save the stack trace for
    // debugging when in debug mode. Creating a stack trace is too expensive
    // to do unconditionally.
  }

  /**
   * Returns gradients of `f` w.r.t. each of the `xs`. The gradients returned
   * are of the same length as `xs`, but some might be null if `f` was not
   * a function of that `x`. It also takes optional dy to multiply the gradient,
   * which defaults to `1`.
   */
  gradients<T extends Tensor>(f: () => T, xs: Tensor[], dy?: T):
      {value: T, gradients: Tensor[]} {
    return tidy('gradients', () => {
      const y = f();
      // Filter out the nodes that don't connect x => y.
      const filteredTape =
          tape_util.getFilteredNodesXToY(this.activeTape, xs, y);
      if (filteredTape.length === 0 && xs.length > 0) {
        throw new Error(
            `Cannot compute gradient: y is not a function of xs.` +
            `Make sure the xs you are computing gradients with respect ` +
            `to are used inside the gradient function.`);
      }

      const accumulatedGradientMap: {[ndarrayId: number]: Tensor} = {};
      accumulatedGradientMap[y.id] = (dy == null) ? ops.onesLike(y) : dy;

      // Backprop gradients through the filtered nodes.
      tape_util.backpropagateGradients(accumulatedGradientMap, filteredTape);

      const gradients = xs.map(x => accumulatedGradientMap[x.id]);
      return {value: y, gradients};
    }, true /* gradientsMode */);
  }

  customGradient<T extends Tensor>(
      name: string, f: CustomGradientFunc<T>, inputs: NamedArrayMap): T {
    this.customGradientDepth++;

    let gradientsFunc: (dy: T, y: T) => TapeNodeInputGradientArrays;
    const gradientsMode = true;
    const result = tidy('customGradient', () => {
      const {value, gradients} = f();
      gradientsFunc = gradients;
      return value;
    }, gradientsMode);

    this.customGradientDepth--;

    if (this.shouldRecord()) {
      this.addTapeNode(inputs, result, gradientsFunc);
    }

    return result;
  }

  write(dataId: number, values: TypedArray): void {
    this.backend.write(dataId, values);
  }
  readSync(dataId: number): TypedArray {
    return this.backend.readSync(dataId);
  }
  read(dataId: number): Promise<TypedArray> {
    return this.backend.read(dataId);
  }

  /**
   * Tracks an Tensor in the current scope to be automatically cleaned up
   * when the current scope ends, and returns the value.
   *
   * @param result The Tensor to track in the current scope.
   */
  private track<T extends Tensor>(result: T): T {
    if (this.scopeStack.length === 1 && this.safeMode) {
      throw new Error(
          'Safe mode is ON. Enclose all tensor operations inside dl.tidy(): ' +
          'dl.tidy(() => {op();...}); to avoid memory leaks.');
    }
    this.activeScope.track.push(result);
    return result;
  }
}
