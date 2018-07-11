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

import {ENV} from '../environment';

/**
 * Used for wrapping functions that perform math operations on
 * Tensors. The function will be wrapped in a named scope that cleans all
 * memory usage after the function is done.
 */
export function op<T extends Function>(f: T|{[name: string]: T}): T {
  if (f instanceof Function) {
    // tslint:disable-next-line:no-any
    const f2 = (...args: any[]) => {
      ENV.engine.startScope(f.name);
      try {
        const result = f(...args);
        if (result instanceof Promise) {
          console.error('Cannot return a Promise inside of tidy.');
        }
        ENV.engine.endScope(result);
        return result;
      } catch (ex) {
        ENV.engine.endScope(null);
        throw ex;
      }
    };
    // tslint:disable-next-line:no-any
    return f2 as any as T;
  }
  const opName = Object.keys(f)[0];
  const fn = f[opName];
  Object.defineProperty(fn, 'name', {value: opName, configurable: true});

  // tslint:disable-next-line:no-any
  const f2 = (...args: any[]) => {
    ENV.engine.startScope(opName);
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        console.error('Cannot return a Promise inside of tidy.');
      }
      ENV.engine.endScope(result);
      return result;
    } catch (ex) {
      ENV.engine.endScope(null);
      throw ex;
    }
  };
  // tslint:disable-next-line:no-any
  return f2 as any as T;
}
