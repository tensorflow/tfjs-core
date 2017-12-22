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

import * as util from '../../util';
import {NamedArrayMap} from '../../util';
import {DataTypes, NDArray, Scalar} from '../ndarray';

import {MathBackend} from './backend';
import * as kernel_registry from './kernel_registry';
import {KernelConfigRegistry} from './kernel_registry';
// tslint:disable-next-line:max-line-length
import {KernelNode, Tape, TapeNode, TapeNodeOutput} from './tape_types';
import * as tape_util from './tape_util';
import {ScopeResult, ScopeResultImmediate} from './tape_util';

interface ScopeState {
  keep: NDArray[];
  track: NDArray[];
  gradientsMode: boolean;
}

export class BackendEngine {
  private nextTapeNodeId = 0;

  private activeTape: Tape;
  private tapeStack: Tape[];

  // Keep NDArrays that parallel the tapes.
  private activeScope: ScopeState;
  private scopeStack: ScopeState[];

  private debugMode = false;

  constructor(private backend: MathBackend, private safeMode: boolean) {
    // Create a default outer scope.
    this.activeTape = [];
    this.tapeStack = [this.activeTape];
    this.activeScope = {keep: [], track: [], gradientsMode: false};
    this.scopeStack = [this.activeScope];
  }

  enableDebugMode() {
    this.debugMode = true;
  }

  executeKernel<K extends keyof KernelConfigRegistry,
                          C extends KernelConfigRegistry[K]['inputAndArgs']>(
      kernelName: K, config: C, grad?: KernelConfigRegistry[K]['gradient']):
      KernelConfigRegistry[K]['output'] {
    const kernelFn = () =>
        kernel_registry.executeKernel(this.backend, kernelName, config);

    let start: number;
    if (this.debugMode) {
      start = performance.now();
    }
    const result = kernelFn();
    if (this.debugMode) {
      const vals = result.getValues();
      const time = util.rightPad(`${performance.now() - start}ms`, 9);
      const paddedName = util.rightPad(kernelName, 25);
      const rank = result.rank;
      const size = result.size;
      const shape = util.rightPad(result.shape.toString(), 14);
      console.log(
          `%c${paddedName}\t%c${time}\t%c${rank}D ${shape}\t%c${size}`,
          'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
      util.checkForNaN(vals, result.dtype, name);
    }

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

    return result;
  }

  gradients(f: () => Scalar, xs: NDArray[], returnValue: boolean): NDArray[]|
      {value: Scalar, gradients: NDArray[]} {
    const gradientsMode = true;
    const result = this.scope('gradients', () => {
      const y = f();
      if (y.rank !== 0) {
        throw new Error(
            `Cannot compute gradient of non-scalar y output. ` +
            `Got y with rank ${y.rank}`);
      }
      const gradients = this.gradientWrt(y, xs);
      if (returnValue) {
        return [y, ...gradients];
      } else {
        return gradients;
      }
    }, gradientsMode);

    if (returnValue) {
      return {
        value: result[0], gradients: result.slice(1)
      }
    } else {
      return result;
    }
  }

  private gradientWrt(y: Scalar, xs: NDArray[]): NDArray[] {
    // Seed the gradient of dy to be 1.
    const arrayAccumulatedGradientMap: {[ndarrayId: number]: NDArray} = {};
    arrayAccumulatedGradientMap[y.id] = Scalar.new(1);

    return this.backpropagateGradients(
        [y], xs, arrayAccumulatedGradientMap, this.activeTape);
  }

  private backpropagateGradients(
      ys: NDArray[], xs: NDArray[],
      arrayAccumulatedGradientMap: {[ndarrayId: number]: NDArray}, tape: Tape) {
    // Filter out the nodes that don't connect x => y.
    const filteredTape = tape_util.getFilteredNodesXToY(tape, xs, ys);
    if (filteredTape.length === 0) {
      throw new Error(`Cannot compute gradient: y is not a function of xs.`);
    }

    // Backprop gradients through the filtered nodes.
    tape_util.backpropagateGradients(
        this.backend, arrayAccumulatedGradientMap, tape);

    const gradients: NDArray[] = [];
    for (let i = 0; i < xs.length; i++) {
      gradients.push(arrayAccumulatedGradientMap[xs[i].id]);
    }
    return gradients;
  }

  /**
   * Create a new math scope. Put chained math operations inside a scope
   * function closure so that the library automatically cleans up NDArrays
   * from intermediate math operations. You must create a scope in safe mode
   * to call math operations. If a result is returned from the scope, it will
   * also be tracked, which means there must be yet another wrapping scope.
   * @param name The name of the scope. Used for logging.
   * @param scopeFn The function to execute with chained math operations.
   */
  scope<T extends ScopeResult>(
      name: string,
      scopeFn:
          (keep: <D1 extends keyof DataTypes, T1 extends NDArray<D1>>(
               ndarray: T1) => T1,
           track: <D2 extends keyof DataTypes, T2 extends NDArray<D2>>(
               ndarray: T2) => T2) => T,
      gradientsMode = false): T {
    this.startScope(gradientsMode);

    const keepFn = <T extends NDArray>(ndarray: T): T => this.keep(ndarray);
    // TODO(smilkov): trackFn is a no-op since we have global tracking.
    // Remove when we break backward compatibility.
    const trackFn = <T extends NDArray>(ndarray: T): T => this.track(ndarray);
    const result = scopeFn(keepFn, trackFn);

    if (result instanceof Promise) {
      result.then(r => this.endScope(r));
      return result;
    } else {
      this.endScope(result as ScopeResultImmediate);
      return result;
    }
  }

  /**
   * Start a scope. Use this with endScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  startScope(gradientsMode = false) {
    gradientsMode = gradientsMode || this.activeScope.gradientsMode;

    if (gradientsMode) {
      const newTape: Tape = [];
      this.tapeStack.push(newTape);
      this.activeTape = newTape;
    }

    const newScopeArrays: ScopeState = {keep: [], track: [], gradientsMode};
    this.scopeStack.push(newScopeArrays);
    this.activeScope = newScopeArrays;
  }

  /**
   * End a scope. Use this with startScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  endScope(result: ScopeResultImmediate) {
    let arraysToKeep = this.activeScope.keep;
    const resultArrays = tape_util.extractNDArraysFromScopeResult(result);

    const gradientsMode = this.activeScope.gradientsMode;
    const isOuterMostGradientsMode = gradientsMode &&
        (this.scopeStack.length <= 1 ||
         !this.scopeStack[this.scopeStack.length - 2].gradientsMode);

    const ndarraysToTrackInParent: NDArray[] = [];
    for (let i = 0; i < this.activeScope.track.length; i++) {
      const ndarray = this.activeScope.track[i];
      if (util.isNDArrayInList(ndarray, arraysToKeep)) {
        continue;
      }

      if (!gradientsMode || isOuterMostGradientsMode) {
        if (util.isNDArrayInList(ndarray, resultArrays)) {
          ndarraysToTrackInParent.push(ndarray);
        } else {
          ndarray.dispose();
        }
      } else {
        ndarraysToTrackInParent.push(ndarray);
      }
    }

    this.scopeStack.pop();
    this.activeScope = this.scopeStack.length === 0 ?
        null :
        this.scopeStack[this.scopeStack.length - 1];

    // Track the current result in the parent scope.
    const resultArrayMap: {[idx: string]: NDArray} = {};
    let idx = 0;
    ndarraysToTrackInParent.forEach(ndarray => {
      if (!util.isNDArrayInList(ndarray, this.activeScope.keep)) {
        this.track(ndarray);
      }
      resultArrayMap[(idx++).toString()] = ndarray;
    });

    if (gradientsMode && !isOuterMostGradientsMode) {
      console.log('adding subtape..');

      console.log('active tape', this.activeTape);
      console.log(this.tapeStack);
      // Add a subtape element.
      const subtape = this.activeTape;
      const inputs = tape_util.computeInputs(subtape);
      const evaluatedNode: TapeNode<TapeNodeOutput> = {
        id: this.nextTapeNodeId++,
        type: 'subtape',
        // TODO(nsthorat): Name this something more descriptive.
        name: 'subtape',
        inputAndArgs: {inputs},
        output: resultArrayMap,
        gradient: (dy: NamedArrayMap, y: NamedArrayMap) => {
          const xs = util.flattenNameArrayMap(inputs);
          const ys = util.flattenNameArrayMap(y);

          console.log(dy);
          const ykeys = Object.keys(dy);
          const arrayAccumulatedGradientMap:
              {[ndarrayId: number]: NDArray} = {};
          ykeys.forEach(ykey => {
            if (dy[ykey] == null) {
              return;
            }
            arrayAccumulatedGradientMap[y[ykey].id] =
                Scalar.new(-2);  // dy[ykey];
            console.log(ykey, 'grad', dy[ykey].dataSync());
            console.log('y val', y[ykey].dataSync());
          });

          const gradients = this.backpropagateGradients(
              ys, xs, arrayAccumulatedGradientMap, subtape);

          const keys = Object.keys(inputs);
          const gradientMap = util.unflattenToNameArrayMap(keys, gradients);

          // Wrap the gradients in a function closure to fit the API of
          // gradient.
          const result: {[name: string]: () => NDArray} = {};
          for (const key of keys) {
            result[key] = () => gradientMap[key];
            console.log(key, gradientMap[key].dataSync());
          }
          return result;
        },
        subtape
      };

      // Pop the active tape.
      this.tapeStack.pop();
      this.activeTape = this.tapeStack.length === 0 ?
          null :
          this.tapeStack[this.tapeStack.length - 1];

      // Push the evaluated subtape node onto the tape stack.
      this.activeTape.push(evaluatedNode);
    }
  }

  /**
   * Keeps an NDArray in the current scope from being disposed automatically.
   * @param result The NDArray to keep from being disposed.
   */
  keep<T extends NDArray>(result: T): T {
    if (this.scopeStack.length === 1) {
      if (this.safeMode) {
        throw new Error(
            'You are using math in safe mode. Enclose all ' +
            'math.method() calls inside a scope: ' +
            'math.scope(() => {math.method();...}) to avoid memory ' +
            'leaks.');
      }
    }
    this.activeScope.keep.push(result);
    return result;
  }

  /**
   * Tracks an NDArray in the current scope to be automatically cleaned up
   * when the current scope ends, and returns the value.
   *
   * @param result The NDArray to track in the current scope.
   */
  track<G extends keyof DataTypes, T extends NDArray<G>>(result: T): T {
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
}
