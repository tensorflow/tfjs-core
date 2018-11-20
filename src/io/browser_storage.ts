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

import {ENV} from '../environment';
import {assert} from '../util';

import {arrayBufferToBase64String, base64StringToArrayBuffer, getModelArtifactsInfoForJSON} from './io_utils';
import {ModelStoreManagerRegistry} from './model_management';
import {IORouter, IORouterRegistry} from './router_registry';
import {BrowserStorageType, IOHandler, ModelArtifacts, ModelArtifactsInfo, ModelStoreManager, SaveResult} from './types';

const PATH_SEPARATOR = '/';
const PATH_PREFIX = 'tensorflowjs_models';
const INFO_SUFFIX = 'info';
const MODEL_TOPOLOGY_SUFFIX = 'model_topology';
const WEIGHT_SPECS_SUFFIX = 'weight_specs';
const WEIGHT_DATA_SUFFIX = 'weight_data';

const LOCAL_STORAGE_URL_SCHEME = 'localstorage://';
const SESSION_STORAGE_URL_SCHEME = 'sessionstorage://';

/**
 * Purge all tensorflow.js-saved model artifacts from local storage.
 *
 * @returns Paths of the models purged.
 */
export function purgeLocalStorageArtifacts(): string[] {
  if (!ENV.get('IS_BROWSER') || typeof window.localStorage === 'undefined') {
    throw new Error(
        'purgeLocalStorageModels() cannot proceed because local storage is ' +
        'unavailable in the current environment.');
  }
  const LS = window.localStorage;
  const purgedModelPaths: string[] = [];
  for (let i = 0; i < LS.length; ++i) {
    const key = LS.key(i);
    const prefix = PATH_PREFIX + PATH_SEPARATOR;
    if (key.startsWith(prefix) && key.length > prefix.length) {
      LS.removeItem(key);
      const modelName = getModelPathFromKey(key);
      if (purgedModelPaths.indexOf(modelName) === -1) {
        purgedModelPaths.push(modelName);
      }
    }
  }
  return purgedModelPaths;
}

function getModelKeys(path: string):
    {info: string, topology: string, weightSpecs: string, weightData: string} {
  return {
    info: [PATH_PREFIX, path, INFO_SUFFIX].join(PATH_SEPARATOR),
    topology: [PATH_PREFIX, path, MODEL_TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
    weightSpecs: [PATH_PREFIX, path, WEIGHT_SPECS_SUFFIX].join(PATH_SEPARATOR),
    weightData: [PATH_PREFIX, path, WEIGHT_DATA_SUFFIX].join(PATH_SEPARATOR)
  };
}

/**
 * Get model path from a storage key.
 *
 * E.g., 'tensorflowjs_models/my/model/1/info' --> 'my/model/1'
 *
 * @param key
 */
function getModelPathFromKey(key: string) {
  const items = key.split(PATH_SEPARATOR);
  if (items.length < 3) {
    throw new Error(`Invalid key format: ${key}`);
  }
  return items.slice(1, items.length - 1).join(PATH_SEPARATOR);
}

function maybeStripScheme(storageType: BrowserStorageType, key: string) {
  let scheme;

  if (storageType === BrowserStorageType.local) {
    scheme = LOCAL_STORAGE_URL_SCHEME;
  } else if (storageType === BrowserStorageType.session) {
    scheme = SESSION_STORAGE_URL_SCHEME;
  } else {
    throw new Error('Unsupported storage type');
  }

  return key.startsWith(scheme) ? key.slice(scheme.length) : key;
}

/**
 * IOHandler subclass: Browser Storage.
 *
 * See the doc string to `browserLocalStorage` for more details.
 */
export class BrowserStorage implements IOHandler {
  protected readonly storage: Storage;
  protected readonly storageType: BrowserStorageType;
  protected readonly modelPath: string;
  protected readonly keys: {[key: string]: string};

  constructor(storageType: BrowserStorageType, modelPath: string) {
    if (!ENV.get('IS_BROWSER')) {
      throw new Error('Current environment is not a web browser');
    }

    this.storageType = storageType;

    if (storageType === BrowserStorageType.local) {
      if (typeof window.localStorage === 'undefined') {
        // TODO(cais): Add more info about what IOHandler subtypes are
        // available.
        //   Maybe point to a doc page on the web and/or automatically determine
        //   the available IOHandlers and print them in the error message.
        throw new Error(
            'The current environment does not support local storage.');
      }
      this.storage = window.localStorage;
    } else if (storageType === BrowserStorageType.session) {
      if (typeof window.sessionStorage === 'undefined') {
        throw new Error(
            'The current environment does not support session storage.');
      }
      this.storage = window.sessionStorage;
    } else {
      throw new Error('Unsupported storage type');
    }

    if (modelPath == null || !modelPath) {
      throw new Error(
          `For ${storageType} storage, modelPath must not be null, undefined ` +
          'or empty.');
    }
    this.modelPath = modelPath;
    this.keys = getModelKeys(this.modelPath);
  }

  /**
   * Save model artifacts to browser storage.
   *
   * See the documentation to `browserLocalStorage` for details on the saved
   * artifacts.
   *
   * @param modelArtifacts The model artifacts to be stored.
   * @returns An instance of SaveResult.
   */
  async save(modelArtifacts: ModelArtifacts): Promise<SaveResult> {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
          'BrowserStorage.save() does not support saving model topology ' +
          'in binary formats yet.');
    } else {
      const topology = JSON.stringify(modelArtifacts.modelTopology);
      const weightSpecs = JSON.stringify(modelArtifacts.weightSpecs);

      const modelArtifactsInfo: ModelArtifactsInfo =
          getModelArtifactsInfoForJSON(modelArtifacts);

      try {
        this.storage.setItem(
            this.keys.info, JSON.stringify(modelArtifactsInfo));
        this.storage.setItem(this.keys.topology, topology);
        this.storage.setItem(this.keys.weightSpecs, weightSpecs);
        this.storage.setItem(
            this.keys.weightData,
            arrayBufferToBase64String(modelArtifacts.weightData));

        return {modelArtifactsInfo};
      } catch (err) {
        // If saving failed, clean up all items saved so far.
        for (const key in this.keys) {
          this.storage.removeItem(this.keys[key]);
        }

        throw new Error(
            `Failed to save model '${this.modelPath}' to ${
                this.storageType} storage: ` +
            `size quota being exceeded is a possible cause of this failure: ` +
            `modelTopologyBytes=${modelArtifactsInfo.modelTopologyBytes}, ` +
            `weightSpecsBytes=${modelArtifactsInfo.weightSpecsBytes}, ` +
            `weightDataBytes=${modelArtifactsInfo.weightDataBytes}.`);
      }
    }
  }

  /**
   * Load a model from storage.
   *
   * See the documentation to `browserLocalStorage` for details on the saved
   * artifacts.
   *
   * @returns The loaded model (if loading succeeds).
   */
  async load(): Promise<ModelArtifacts> {
    const info =
        JSON.parse(this.storage.getItem(this.keys.info)) as ModelArtifactsInfo;
    if (info == null) {
      throw new Error(
          `In ${this.storageType} storage, there is no model with name ` +
          `'${this.modelPath}'`);
    }

    if (info.modelTopologyType !== 'JSON') {
      throw new Error(
          'BrowserStorage does not support loading non-JSON model ' +
          'topology yet.');
    }

    const out: ModelArtifacts = {};

    // Load topology.
    const topology = JSON.parse(this.storage.getItem(this.keys.topology));
    if (topology == null) {
      throw new Error(
          `In ${this.storageType} storage, the topology of model ` +
          `'${this.modelPath}' is missing.`);
    }
    out.modelTopology = topology;

    // Load weight specs.
    const weightSpecs = JSON.parse(this.storage.getItem(this.keys.weightSpecs));
    if (weightSpecs == null) {
      throw new Error(
          `In ${this.storageType} storage, the weight specs of model ` +
          `'${this.modelPath}' are missing.`);
    }
    out.weightSpecs = weightSpecs;

    // Load weight data.
    const weightDataBase64 = this.storage.getItem(this.keys.weightData);
    if (weightDataBase64 == null) {
      throw new Error(
          `In ${this.storageType} storage, the binary weight values of model ` +
          `'${this.modelPath}' are missing.`);
    }
    out.weightData = base64StringToArrayBuffer(weightDataBase64);

    return out;
  }
}

export const browserStorageRouter: IORouter = (url: string|string[]) => {
  if (!ENV.get('IS_BROWSER')) {
    return null;
  } else {
    if (!Array.isArray(url)) {
      if (url.startsWith(LOCAL_STORAGE_URL_SCHEME)) {
        return browserLocalStorage(url.slice(LOCAL_STORAGE_URL_SCHEME.length));
      } else if (url.startsWith(SESSION_STORAGE_URL_SCHEME)) {
        return browserSessionStorage(
            url.slice(SESSION_STORAGE_URL_SCHEME.length));
      }
      return null;
    } else {
      return null;
    }
  }
};
IORouterRegistry.registerSaveRouter(browserStorageRouter);
IORouterRegistry.registerLoadRouter(browserStorageRouter);

/**
 * Factory function for local storage IOHandler.
 *
 * This `IOHandler` supports both `save` and `load`.
 *
 * For each model's saved artifacts, four items are saved to local storage.
 *   - `${PATH_SEPARATOR}/${modelPath}/info`: Contains meta-info about the
 *     model, such as date saved, type of the topology, size in bytes, etc.
 *   - `${PATH_SEPARATOR}/${modelPath}/topology`: Model topology. For Keras-
 *     style models, this is a stringized JSON.
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_specs`: Weight specs of the
 *     model, can be used to decode the saved binary weight values (see
 *     item below).
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_data`: Concatenated binary
 *     weight values, stored as a base64-encoded string.
 *
 * Saving may throw an `Error` if the total size of the artifacts exceed the
 * browser-specific quota.
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `IOHandler`, which can be used with, e.g.,
 *   `tf.Model.save`.
 */
export function browserLocalStorage(modelPath: string): IOHandler {
  return new BrowserStorage(BrowserStorageType.local, modelPath);
}

/**
 * Factory function for session storage IOHandler.
 *
 * See the doc string to `browserLocalStorage` for more details.
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `IOHandler`, which can be used with, e.g.,
 *   `tf.Model.save`.
 */
export function browserSessionStorage(modelPath: string): IOHandler {
  return new BrowserStorage(BrowserStorageType.session, modelPath);
}

export class BrowserStorageManager implements ModelStoreManager {
  private readonly storage: Storage;
  private readonly storageType: BrowserStorageType;

  constructor(storageType: BrowserStorageType) {
    assert(ENV.get('IS_BROWSER'), 'Current environment is not a web browser');
    this.storageType = storageType;

    if (storageType === BrowserStorageType.local) {
      assert(
          typeof window.localStorage !== 'undefined',
          'Current browser does not appear to support localStorage');
      this.storage = window.localStorage;
    } else if (storageType === BrowserStorageType.session) {
      assert(
          typeof window.sessionStorage !== 'undefined',
          'Current browser does not appear to support sessionStorage');
      this.storage = window.sessionStorage;
    } else {
      throw new Error('Unsupported storage type');
    }
  }

  async listModels(): Promise<{[path: string]: ModelArtifactsInfo}> {
    const out: {[path: string]: ModelArtifactsInfo} = {};
    const prefix = PATH_PREFIX + PATH_SEPARATOR;
    const suffix = PATH_SEPARATOR + INFO_SUFFIX;
    for (let i = 0; i < this.storage.length; ++i) {
      const key = this.storage.key(i);
      if (key.startsWith(prefix) && key.endsWith(suffix)) {
        const modelPath = getModelPathFromKey(key);
        out[modelPath] =
            JSON.parse(this.storage.getItem(key)) as ModelArtifactsInfo;
      }
    }
    return out;
  }

  async removeModel(path: string): Promise<ModelArtifactsInfo> {
    path = maybeStripScheme(this.storageType, path);
    const keys = getModelKeys(path);
    if (this.storage.getItem(keys.info) == null) {
      throw new Error(`Cannot find model at path '${path}'`);
    }
    const info =
        JSON.parse(this.storage.getItem(keys.info)) as ModelArtifactsInfo;

    this.storage.removeItem(keys.info);
    this.storage.removeItem(keys.topology);
    this.storage.removeItem(keys.weightSpecs);
    this.storage.removeItem(keys.weightData);
    return info;
  }
}

if (ENV.get('IS_BROWSER')) {
  // Wrap the construction and registration, to guard against browsers that
  // don't support Local Storage.
  try {
    ModelStoreManagerRegistry.registerManager(
        LOCAL_STORAGE_URL_SCHEME,
        new BrowserStorageManager(BrowserStorageType.local));
  } catch (err) {
  }
  try {
    ModelStoreManagerRegistry.registerManager(
        SESSION_STORAGE_URL_SCHEME,
        new BrowserStorageManager(BrowserStorageType.session));
  } catch (err) {
  }
}
