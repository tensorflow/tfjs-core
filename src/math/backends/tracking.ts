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
import {NDArray} from '../ndarray';
import {ScopeFn, ScopeResult, ScopeResultImmediate} from './tape_util';

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
  ENV.engine.startScope(gradientsMode);

  const keepFn = <T extends NDArray>(ndarray: T): T => keep(ndarray);
  // TODO(smilkov): trackFn is a no-op since we have global tracking.
  // Remove when we break backward compatibility.
  const trackFn = <T extends NDArray>(ndarray: T): T => ndarray;
  const result = scopeFn(keepFn, trackFn);

  if (result instanceof Promise) {
    result.then(r => ENV.engine.endScope(r, gradientsMode));
    return result;
  } else {
    ENV.engine.endScope(result as ScopeResultImmediate, gradientsMode);
    return result;
  }
}

/**
 * Keeps an NDArray in the current scope from being disposed automatically.
 * @param result The NDArray to keep from being disposed.
 */
export function keep<T extends NDArray>(result: T): T {
  if (ENV.engine.noUserScopes()) {
    if (ENV.engine.safeMode) {
      throw new Error(
          'You are using math in safe mode. Enclose all ' +
          'math.method() calls inside a scope: ' +
          'math.scope(() => {math.method();...}) to avoid memory ' +
          'leaks.');
    }
  }
  ENV.engine.keep(result);
  return result;
}

export function time(f: () => void): Promise<number> {
  return ENV.backend.time(f);
}
