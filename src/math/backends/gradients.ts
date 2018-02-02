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
import {NDArray, Scalar, Variable} from '../ndarray';
import {NamedArrayMap, Rank} from '../types';
import {CustomGradientFunc} from './backend_engine';
import {ScopeFn, ScopeResult} from './tape_util';
import {tidy} from './tracking';

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
  return tidy(nameOrScopeFn, scopeFn, gradientsMode);
}

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
export function vjp<T extends NDArray|NamedArrayMap, R extends Rank>(
    f: () => NDArray<R>, x: T, dy: NDArray<R>): T {
  const keys = x instanceof NDArray ? null : Object.keys(x);
  const xs = util.flattenNameArrayMap(x, keys);

  const gradientsMode = true;
  const vjp = tidy('vjp', () => {
    const y = f();
    if (!util.arraysEqual(y.shape, dy.shape)) {
      throw new Error(
          `Cannot compute vector jacobian product, ` +
          `y shape (${y.shape}) does not match dy shape (${dy.shape}).`);
    }
    return ENV.engine.gradientWrt(y, xs, dy);
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
  const gradients = ENV.engine.gradients(f, xs, returnValue) as NDArray[];

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
    const varNames = Object.keys(ENV.engine.registeredVariables);
    for (let i = 0; i < varNames.length; i++) {
      const variable = ENV.engine.registeredVariables[varNames[i]];
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
  const result = tidy('gradients', () => {
    const y = f();
    if (y.rank !== 0) {
      throw new Error(
          `Cannot compute gradient of non-scalar y output of f(). ` +
          `Got y with rank ${y.rank} and shape ${y.shape}.`);
    }

    const inputVariables = ENV.engine.computeVariableInputs(varList);
    variableNames = inputVariables.map(variable => variable.name);

    const gradients = inputVariables.length === 0 ?
        [] :
        ENV.engine.gradientWrt(y, inputVariables);
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
  const valueAndGradients = ENV.engine.gradients(f, xs, returnValue) as
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
export function customGradient<T extends NDArray>(
    name: string, f: CustomGradientFunc<T>, inputs: NamedArrayMap): T {
  name = name || '';
  return ENV.engine.customGradient(name, f, inputs);
}
