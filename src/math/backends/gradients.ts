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

/**
 * Computes and returns the vector jacobian product of f(x) with respect to x.
 * This method allows you to provide a non-scalar dy to backprop from.
 *
 * @param f The function to execute. f() should return an NDArray of the same
 * shape and dtype as dy.
 * @param x The input to compute dy/dx over. This can be a single value or
 * an object mapping a string to an NDArray. If using the object mode, this
 * method will return an object of the same shape.
 */

import * as util from '../../util';
import {Array3D, NDArray, Scalar, Variable} from '../ndarray';
import {NamedArrayMap, Rank} from '../types';
import {TapeNode, TapeNodeInputGradientArrays} from './tape_types';
import * as tape_util from './tape_util';
import {ScopeFn, ScopeResult, ScopeResultImmediate} from './tape_util';

/**
 * Create a new gradients scope. Similar to scope, but forces all inner scopes
 * to not clean up so that gradient operations can be used inside of this
 * scope.
 * @param nameOrScopeFn The name of the scope, or the function to execute.
 *     If a name is provided, the 2nd argument should be the function.
 *     If a name is provided, and debug mode is on, the timing and the memory
 *     usage of the function will be tracked and displayed on the console
 *     using the provided name.
 * @param scopeFn The function to execute.
 */
export function gradientsScope<T extends ScopeResult>(
    nameOrScopeFn: string|ScopeFn<T>, scopeFn?: ScopeFn<T>): T {
  const gradientsMode = true;
  return scope(nameOrScopeFn, scopeFn, gradientsMode);
}

export function time(f: () => void): Promise<number> {
  return this.backend.time(f);
}

export function fromPixels(
    pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement,
    numChannels: number): Array3D {
  return this.backend.fromPixels(pixels, numChannels);
}

export function vjp<T extends NDArray|NamedArrayMap, R extends Rank>(
    f: () => NDArray<R>, x: T, dy: NDArray<R>): T {
  const keys = x instanceof NDArray ? null : Object.keys(x);
  const xs = util.flattenNameArrayMap(x, keys);

  const gradientsMode = true;
  const vjp = scope('vjp', () => {
    const y = f();
    if (!util.arraysEqual(y.shape, dy.shape)) {
      throw new Error(
          `Cannot compute vector jacobian product, ` +
          `y shape (${y.shape}) does not match dy shape (${dy.shape}).`);
    }
    return this.gradientWrt(y, xs, dy);
  }, gradientsMode);

  if (x instanceof NDArray) {
    return vjp[0] as T;
  } else {
    return util.unflattenToNameArrayMap(keys, vjp) as T;
  }
}

/**
 * Computes and returns the gradient of f(x) with respect to x.
 *
 * @param f The function to execute. f() should return a scalar.
 *          TODO(nsthorat): Accept non-scalars.
 * @param x The input to compute de/dx over. This can be a single value or
 * an object mapping a string to an NDArray. If using the object mode, this
 * method will return an object of the same shape.
 */
export function gradients<T extends NDArray|NamedArrayMap>(
    f: () => Scalar, x: T): T {
  const keys = x instanceof NDArray ? null : Object.keys(x);
  const xs = util.flattenNameArrayMap(x, keys);

  const returnValue = false;
  const gradients = this.gradientsInternal(f, xs, returnValue) as NDArray[];

  if (x instanceof NDArray) {
    return gradients[0] as T;
  } else {
    return util.unflattenToNameArrayMap(keys, gradients) as T;
  }
}

/**
 * Computes and returns the gradient of f(x) with respect to the list of
 * trainable variables provided by `varList`. If no list is provided, it
 * defaults to all trainable variables.
 * @param f The function to execute. f() should return a scalar.
 * @param varList An optional list of variables to provide gradients with
 * respect to. Defaults to all trainable variables.
 */
export function variableGradients(f: () => Scalar, varList?: Variable[]):
    {value: Scalar, gradients: NamedArrayMap} {
  if (varList == null) {
    // Get all of the trainable variables.
    varList = [];
    const varNames = Object.keys(this.registeredVariables);
    for (let i = 0; i < varNames.length; i++) {
      const variable = this.registeredVariables[varNames[i]];
      if (variable.trainable) {
        varList.push(variable);
      }
    }
  } else {
    // Prune non-trainable variables.
    varList = varList.filter(variable => variable.trainable);
  }

  const gradientsMode = true;
  let variableNames: string[];
  const result = this.scope('gradients', () => {
    const y = f();
    if (y.rank !== 0) {
      throw new Error(
          `Cannot compute gradient of non-scalar y output of f(). ` +
          `Got y with rank ${y.rank} and shape ${y.shape}.`);
    }

    const inputVariables =
        tape_util.computeVariableInputs(this.activeTape, varList);
    variableNames = inputVariables.map(variable => variable.name);

    const gradients =
        inputVariables.length === 0 ? [] : this.gradientWrt(y, inputVariables);
    return [y, ...gradients];
  }, gradientsMode);

  const gradients: NamedArrayMap = {};
  for (let i = 0; i < variableNames.length; i++) {
    gradients[variableNames[i]] = result[i + 1];
  }

  return {value: result[0] as Scalar, gradients};
}

/**
 * Computes and returns the gradient of f(x) with respect to x. Returns
 * both f(x) and f'(x).
 *
 * @param f The function to execute. f() should return a scalar.
 *          TODO(nsthorat): Accept non-scalars.
 * @param x The input to compute de/dx over. This can be a single value or
 * an object mapping a string to an NDArray. If using the object mode,
 * this method will return an object of the same shape.
 */
export function valueAndGradients<T extends NDArray|NamedArrayMap>(
    f: () => Scalar, x: T): {value: Scalar, gradients: T} {
  const keys = x instanceof NDArray ? null : Object.keys(x);
  const xs = util.flattenNameArrayMap(x, keys);

  const returnValue = true;
  const valueAndGradients = this.gradientsInternal(f, xs, returnValue) as
      {value: Scalar, gradients: NDArray[]};

  let gradients: T;
  if (x instanceof NDArray) {
    gradients = valueAndGradients.gradients[0] as T;
  } else {
    gradients =
        util.unflattenToNameArrayMap(keys, valueAndGradients.gradients) as T;
  }
  return {value: valueAndGradients.value, gradients};
}

/**
 * Evaluates a function f() with a custom gradient function f'() to use during
 * backpropagation.
 *
 * @param f The function to evaluate in forward mode. Returns a value NDArray
 *    and a gradient function closure.
 * @param inputs The inputs to compute the gradient with respect to. These
 *    NDArrays should be used in f().
 * @param name An optional name for the customGradient method. Used for
 *    debugging.
 */
export function customGradient<R extends Rank, T extends NDArray<R>>(
    name: string, f: () => {
      value: T,
      gradients: (dy: T, y: T) => TapeNodeInputGradientArrays
    },
    inputs: NamedArrayMap): T {
  name = name || '';
  this.customGradientDepth++;

  let gradientsFunc: (dy: T, y: T) => TapeNodeInputGradientArrays;
  const gradientsMode = true;
  const result = this.scope('customGradient', () => {
    const {value, gradients} = f();
    gradientsFunc = gradients;
    return value;
  }, gradientsMode);

  this.customGradientDepth--;

  if (this.activeTape != null && this.customGradientDepth === 0) {
    const evaluatedNode: TapeNode<NDArray<R>> = {
      id: this.nextTapeNodeId++,
      type: 'customGradient',
      name,
      inputAndArgs: {inputs},
      output: result,
      gradient: gradientsFunc
    };

    this.activeTape.push(evaluatedNode);
  }

  return result;
}

function gradientsInternal(
    f: () => Scalar, xs: NDArray[], returnValue: boolean): NDArray[]|
    {value: Scalar, gradients: NDArray[]} {
  const gradientsMode = true;
  const result = this.scope('gradients', () => {
    const y = f();
    if (y.rank !== 0) {
      throw new Error(
          `Cannot compute gradient of non-scalar y output of f(). ` +
          `Got y with rank ${y.rank} and shape ${y.shape}.`);
    }
    const gradients = this.gradientWrt(y, xs);
    if (returnValue) {
      return [y, ...gradients];
    } else {
      return gradients;
    }
  }, gradientsMode);

  if (returnValue) {
    return {value: result[0] as Scalar, gradients: result.slice(1)};
  } else {
    return result;
  }
}

function gradientWrt<R extends Rank, T extends NDArray<R>>(
    y: T, xs: NDArray[], dy?: T): NDArray[] {
  // Filter out the nodes that don't connect x => y.
  const filteredTape = tape_util.getFilteredNodesXToY(this.activeTape, xs, y);
  if (filteredTape.length === 0) {
    throw new Error(
        `Cannot compute gradient: y is not a function of xs.` +
        `Make sure the xs you are computing gradients with respect ` +
        `to are used inside the gradient function.`);
  }

  const arrayAccumulatedGradientMap: {[ndarrayId: number]: NDArray} = {};
  arrayAccumulatedGradientMap[y.id] =
      dy == null ? Scalar.new(1, 'float32') : dy;

  // Backprop gradients through the filtered nodes.
  tape_util.backpropagateGradients(arrayAccumulatedGradientMap, filteredTape);

  const gradients = xs.map(x => arrayAccumulatedGradientMap[x.id]);
  gradients.forEach((grad, i) => {
    if (grad == null) {
      throw new Error(`Gradient error: y was not a function of xs[${i}]`);
    }
  });
  return gradients;
}
/**
 * Executes the provided function and after it is executed, cleans up all
 * intermediate NDArrays allocated by the function except those returned by
 * the function.
 *
 * When in safe mode, you must enclose all `NDArray` creation and math ops
 * inside a `math.scope()` to prevent memory leaks.
 *
 * @param nameOrScopeFn The name of the scope, or the function to execute.
 *     If a name is provided, the 2nd argument should be the function.
 *     If a name is provided, and debug mode is on, the timing and the memory
 *     usage of the function will be tracked and displayed on the console
 *     using the provided name.
 * @param scopeFn The function to execute.
 * @param gradientsMode If true, enables gradients mode.
 *     See math.gradientsScope for details.
 */
export function scope<T extends ScopeResult>(
    nameOrScopeFn: string|ScopeFn<T>, scopeFn?: ScopeFn<T>,
    gradientsMode = false): T {
  if (scopeFn == null) {
    // Called with only 1 argument.
    if (typeof nameOrScopeFn !== 'function') {
      throw new Error('Please provide a function to math.scope()');
    }
    scopeFn = nameOrScopeFn;
    nameOrScopeFn = 'scope';
  } else {
    // Called with 2 arguments.
    if (typeof nameOrScopeFn !== 'string' &&
        !(nameOrScopeFn instanceof String)) {
      throw new Error(
          'When calling with two arguments, the first argument ' +
          'to math.scope() must be a string');
    }
    if (typeof scopeFn !== 'function') {
      throw new Error(
          'When calling with two arguments, the 2nd argument ' +
          'to math.scope() must be a function');
    }
    // TODO(nsthorat,smilkov): Do operation logging and performance profiling.
  }
  this.startScope(gradientsMode);

  const keepFn = <T extends NDArray>(ndarray: T): T => this.keep(ndarray);
  // TODO(smilkov): trackFn is a no-op since we have global tracking.
  // Remove when we break backward compatibility.
  const trackFn = <T extends NDArray>(ndarray: T): T => ndarray;
  const result = scopeFn(keepFn, trackFn);

  if (result instanceof Promise) {
    result.then(r => this.endScope(r, gradientsMode));
    return result;
  } else {
    this.endScope(result as ScopeResultImmediate, gradientsMode);
    return result;
  }
}

/**
 * Start a scope. Use this with endScope() to achieve the same functionality
 * as scope() without the need for a function closure.
 */
export function startScope(gradientsMode = false) {
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
export function endScope(result: ScopeResultImmediate, gradientsMode = false) {
  if (gradientsMode) {
    this.gradientScopeCount--;
    if (this.gradientScopeCount === 0) {
      this.activeTape = null;
    }
  }

  let arraysToKeep = this.activeScope.keep;
  const arraysToTrackInParent =
      tape_util.extractNDArraysFromScopeResult(result);
  arraysToKeep = arraysToKeep.concat(arraysToTrackInParent);

  // Dispose the arrays tracked in this scope.
  for (let i = 0; i < this.activeScope.track.length; i++) {
    const ndarray = this.activeScope.track[i];
    if (util.isNDArrayInList(ndarray, arraysToKeep)) {
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
      null :
      this.scopeStack[this.scopeStack.length - 1];

  // Track the current result in the parent scope.
  arraysToTrackInParent.forEach(ndarray => {
    if (!util.isNDArrayInList(ndarray, this.activeScope.keep)) {
      this.track(ndarray);
    }
  });
}

/**
 * Keeps an NDArray in the current scope from being disposed automatically.
 * @param result The NDArray to keep from being disposed.
 */
export function keep<T extends NDArray>(result: T): T {
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
