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
import {NDArray, Variable} from '../ndarray';
import {NamedVariableMap, TypedArray} from '../types';
import {Rank} from '../types';

import {MathBackend} from './backend';
import * as kernel_registry from './kernel_registry';
import {KernelConfigRegistry} from './kernel_registry';
import {Profiler} from './profiler';
import {KernelNode, Tape} from './tape_types';
import * as tape_util from './tape_util';

interface ScopeState {
  keep: NDArray[];
  track: NDArray[];
}

export interface NDArrayManager {
  getNumArrays(): number;
  register(a: NDArray): void;
  registerVariable(v: Variable): void;
  disposeData(dataId: number): void;
}

export class BackendEngine implements NDArrayManager {
  private registeredArrays = new Map<number, number>();
  private nextTapeNodeId = 0;

  private activeTape: Tape;
  gradientScopeCount = 0;

  private customGradientDepth = 0;

  // Keep NDArrays that parallel the tapes.
  private activeScope: ScopeState;
  private scopeStack: ScopeState[];

  // Public since optimizers will use it.
  registeredVariables: NamedVariableMap = {};
  private profiler: Profiler;

  constructor(
      private backend: MathBackend, private customBackend: boolean,
      private safeMode: boolean) {
    // Create a default outer scope.
    this.activeScope = {keep: [], track: []};
    this.scopeStack = [this.activeScope];
    this.profiler = new Profiler(backend);
  }

  /**
   * In debug mode, the output of every math call will be downloaded to the
   * CPU and checked for NaNs. This significantly impacts performance.
   */
  enableDebugMode() {
    ENV.set('DEBUG', true);
    console.warn(
        'Debugging mode is ON. The output of every math call will ' +
        'be downloaded to CPU and checked for NaNs. ' +
        'This significantly impacts performance.');
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

  /**
   * Tracks an NDArray in the current scope to be automatically cleaned up
   * when the current scope ends, and returns the value.
   *
   * @param result The NDArray to track in the current scope.
   */
  track<T extends NDArray>(result: T): T {
    if (this.scopeStack.length === 1) {
      if (this.safeMode) {
        throw new Error(
            'You are using math in safe mode. Enclose all ' +
            'math.method() calls inside a scope: ' +
            'math.scope(() => {math.method();...}) to avoid memory ' +
            'leaks.');
      }
    }
    this.activeScope.track.push(result);
    return result;
  }

  getBackend(): MathBackend {
    return this.backend;
  }

  getNumArrays() {
    return this.registeredArrays.size;
  }

  register(a: NDArray|Variable): void {
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

  write(dataId: number, values: TypedArray): void {
    this.backend.write(dataId, values);
  }
  readSync(dataId: number): TypedArray {
    return this.backend.readSync(dataId);
  }
  read(dataId: number): Promise<TypedArray> {
    return this.backend.read(dataId);
  }
}
