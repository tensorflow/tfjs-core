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
import {TypedArray} from '../../util';
import {DataTypes, NDArray, Scalar} from '../ndarray';

import {MathBackend} from './backend';
import * as kernel_registry from './kernel_registry';
import {KernelConfigRegistry} from './kernel_registry';
import {KernelNode, TapeNode, TapeNodeOutput} from './tape_types';
import * as tape_util from './tape_util';

export type ScopeResultImmediate =
    void|NDArray|NDArray[]|{[key: string]: NDArray};
export type ScopeResult = ScopeResultImmediate|Promise<ScopeResultImmediate>;

interface ScopeTrackAndKeepArrays {
  keep: NDArray[];
  track: NDArray[];
  gradientsMode: boolean;
}

export class BackendEngine {
  private tapeNodeId = 0;

  private activeTape: Array<TapeNode<TapeNodeOutput>>;
  private tapeStack: Array<Array<TapeNode<TapeNodeOutput>>>;

  // Keep NDArrays that parallel the tapes.
  private activeScopeArrays: ScopeTrackAndKeepArrays;
  private scopeArraysStack: ScopeTrackAndKeepArrays[];

  private debugMode = false;

  constructor(private backend: MathBackend, private safeMode: boolean) {
    // Create a default outer scope.
    this.activeTape = [];
    this.tapeStack = [this.activeTape];
    this.activeScopeArrays = {keep: [], track: [], gradientsMode: false};
    this.scopeArraysStack = [this.activeScopeArrays];
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
      this.checkForNaN(vals, result.dtype, name);
    }

    const evaluatedNode: KernelNode = {
      id: this.tapeNodeId++,
      name: `kernel: ${kernelName}`,
      kernel: kernelName,
      inputAndArgs: config,
      output: result,
      gradient: grad
    };
    this.activeTape.push(evaluatedNode);

    return result;
  }

  gradientWrt(y: Scalar, xs: NDArray[]): NDArray[] {
    // const gradientsMode = true;
    // return this.scope('grad', () => {
    // Filter out the nodes that don't connect x => y.
    const filteredNodes =
        tape_util.getFilteredNodesXToY(this.activeTape, xs, y);
    console.log(this.activeTape);
    // tslint:disable-next-line:no-debugger
    debugger;

    if (filteredNodes.length === 0) {
      throw new Error(`Cannot compute gradient: y is not a function of xs.`);
    }

    // Seed the gradient of dy to be 1.
    const arrayAccumulatedGradientMap: {[ndarrayId: number]: NDArray} = {};
    arrayAccumulatedGradientMap[y.id] = Scalar.new(1);

    // Backprop gradients through the filtered nodes.
    tape_util.backpropagateGradients(
        this.backend, arrayAccumulatedGradientMap, filteredNodes);

    const gradients: NDArray[] = [];
    for (let i = 0; i < xs.length; i++) {
      gradients.push(arrayAccumulatedGradientMap[xs[i].id]);
    }
    return gradients;
    // }, gradientsMode);
  }

  debug() {
    console.log(this.activeTape);
  }

  /**
   * Create a new math scope. Put chained math operations inside a scope
   * function closure so that the library automatically cleans up NDArrays
   * from intermediate math operations. You must create a scope in safe mode
   * to call math operations. If a result is returned from the scope, it will
   * also be tracked, which means there must be yet another wrapping scope.
   * @param name The name of the scope. Used for logging.
   * @param scopeFn The function to execute with chained math operations.
   * @param gradientsMode Whether this scope is started as a gradients mode
   * scope. This will propagate downwards and will force all children scopes not
   * to dispose their scopes until all training scopes are popped.
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
    const newTape: Array<TapeNode<TapeNodeOutput>> = [];
    this.tapeStack.push(newTape);
    this.activeTape = newTape;

    const newScopeArrays:
        ScopeTrackAndKeepArrays = {keep: [], track: [], gradientsMode};
    this.scopeArraysStack.push(newScopeArrays);
    this.activeScopeArrays = newScopeArrays;
  }

  private extractNDArraysFromScopeResult(result: ScopeResultImmediate):
      NDArray[] {
    if (result == null) {
      return [];
    }
    if (result instanceof NDArray) {
      return [result];
    }

    const list: NDArray[] = [];
    const resultObj = result as {[key: string]: NDArray};
    // Iteration over keys works also for arrays.
    for (const k in resultObj) {
      const val = resultObj[k];
      if (val instanceof NDArray) {
        list.push(val);
      }
    }
    return list;
  }

  /**
   * End a scope. Use this with startScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  endScope(result: ScopeResultImmediate) {
    let arraysToKeep = this.activeScopeArrays.keep;
    const resultArrays = this.extractNDArraysFromScopeResult(result);
    arraysToKeep = arraysToKeep.concat(resultArrays);

    // Dispose the arrays tracked in this scope.
    for (let i = 0; i < this.activeScopeArrays.track.length; i++) {
      const ndarray = this.activeScopeArrays.track[i];
      if (util.isNDArrayInList(ndarray, arraysToKeep)) {
        continue;
      }
      ndarray.dispose();
    }

    this.scopeArraysStack.pop();
    this.activeScopeArrays = this.scopeArraysStack.length === 0 ?
        null :
        this.scopeArraysStack[this.scopeArraysStack.length - 1];

    // Track the current result in the parent scope.
    resultArrays.forEach(val => {
      if (!util.isNDArrayInList(val, this.activeScopeArrays.keep)) {
        this.track(val);
      }
    });
  }

  /**
   * Keeps an NDArray in the current scope from being disposed automatically.
   * @param result The NDArray to keep from being disposed.
   */
  keep<T extends NDArray>(result: T): T {
    if (this.scopeArraysStack.length === 1) {
      if (this.safeMode) {
        throw new Error(
            'You are using math in safe mode. Enclose all ' +
            'math.method() calls inside a scope: ' +
            'math.scope(() => {math.method();...}) to avoid memory ' +
            'leaks.');
      }
    }
    this.activeScopeArrays.keep.push(result);
    return result;
  }

  /**
   * Tracks an NDArray in the current scope to be automatically cleaned up
   * when the current scope ends, and returns the value.
   *
   * @param result The NDArray to track in the current scope.
   */
  track<G extends keyof DataTypes, T extends NDArray<G>>(result: T): T {
    if (this.scopeArraysStack.length === 1) {
      if (this.safeMode) {
        throw new Error(
            'You are using math in safe mode. Enclose all ' +
            'math.method() calls inside a scope: ' +
            'math.scope(() => {math.method();...}) to avoid memory ' +
            'leaks.');
      }
    }
    this.activeScopeArrays.track.push(result);
    return result;
  }

  private checkForNaN(vals: TypedArray, dtype: keyof DataTypes, name: string):
      void {
    for (let i = 0; i < vals.length; i++) {
      if (util.isValNaN(vals[i], dtype)) {
        throw Error(`The result of the last math.${name} has NaNs.`);
      }
    }
  }

  getBackend(): MathBackend {
    return this.backend;
  }
}
