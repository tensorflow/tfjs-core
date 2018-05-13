/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

import * as tf from '../index';

import {BrowserIndexedDB, browserIndexedDB} from './indexed_db';
import {BrowserLocalStorage, browserLocalStorage} from './local_storage';
import {IORouterRegistry} from './router_registry';

describe('IORouterRegistry', () => {
  const localStorageRouter = (url: string) => {
    const scheme = 'localstorage://';
    if (url.startsWith(scheme)) {
      return browserLocalStorage(url.slice(scheme.length));
    } else {
      return null;
    }
  };

  const indexedDBRouter = (url: string) => {
    const scheme = 'indexeddb://';
    if (url.startsWith(scheme)) {
      return browserIndexedDB(url.slice(scheme.length));
    } else {
      return null;
    }
  };

  let tempRegistryInstance: IORouterRegistry = null;
  beforeEach(() => {
    // Force reset registry for testing.
    // tslint:disable:no-any
    tempRegistryInstance = (IORouterRegistry as any).instance;
    (IORouterRegistry as any).instance = null;
    // tslint:enable:no-any
  });

  afterEach(() => {
    // tslint:disable-next-line:no-any
    (IORouterRegistry as any).instance = tempRegistryInstance;
  });

  it('getSaveHandler succeeds', () => {
    IORouterRegistry.registerSaveRouter(localStorageRouter);
    IORouterRegistry.registerSaveRouter(indexedDBRouter);

    const out1 = tf.io.getSaveHandler('localstorage://foo-model');
    expect(out1 instanceof BrowserLocalStorage).toEqual(true);
    const out2 = tf.io.getSaveHandler('indexeddb://foo-model');
    expect(out2 instanceof BrowserIndexedDB).toEqual(true);
  });

  it('getLoadHandler succeeds', () => {
    IORouterRegistry.registerLoadRouter(localStorageRouter);
    IORouterRegistry.registerLoadRouter(indexedDBRouter);

    const out1 = tf.io.getLoadHandler('localstorage://foo-model');
    expect(out1 instanceof BrowserLocalStorage).toEqual(true);
    const out2 = tf.io.getLoadHandler('indexeddb://foo-model');
    expect(out2 instanceof BrowserIndexedDB).toEqual(true);
  });

  it('getSaveHandler fails', () => {
    IORouterRegistry.registerSaveRouter(localStorageRouter);

    expect(tf.io.getSaveHandler('invalidscheme://foo-model')).toBeNull();
    // Check there is no crosstalk between save and load handlers.
    expect(tf.io.getLoadHandler('localstorage://foo-model')).toBeNull();
  });
});
