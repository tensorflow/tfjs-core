/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {AsyncStorageStatic} from '@react-native-community/async-storage';
import {IOHandler, ModelArtifacts, ModelArtifactsInfo, SaveResult} from '@tensorflow/tfjs-core';
import {fromByteArray, toByteArray} from 'base64-js';

type LocalStorageKeys = {
  info: string,
  topology: string,
  weightSpecs: string,
  weightData: string,
  modelMetadata: string
};

const PATH_SEPARATOR = '/';
const PATH_PREFIX = 'tensorflowjs_models';
const INFO_SUFFIX = 'info';
const MODEL_TOPOLOGY_SUFFIX = 'model_topology';
const WEIGHT_SPECS_SUFFIX = 'weight_specs';
const WEIGHT_DATA_SUFFIX = 'weight_data';
const MODEL_METADATA_SUFFIX = 'model_metadata';

function getModelKeys(path: string): {
  info: string,
  topology: string,
  weightSpecs: string,
  weightData: string,
  modelMetadata: string
} {
  return {
    info: [PATH_PREFIX, path, INFO_SUFFIX].join(PATH_SEPARATOR),
    topology: [PATH_PREFIX, path, MODEL_TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
    weightSpecs: [PATH_PREFIX, path, WEIGHT_SPECS_SUFFIX].join(PATH_SEPARATOR),
    weightData: [PATH_PREFIX, path, WEIGHT_DATA_SUFFIX].join(PATH_SEPARATOR),
    modelMetadata:
        [PATH_PREFIX, path, MODEL_METADATA_SUFFIX].join(PATH_SEPARATOR)
  };
}
/**
 * Populate ModelArtifactsInfo fields for a model with JSON topology.
 * @param modelArtifacts
 * @returns A ModelArtifactsInfo object.
 */
function getModelArtifactsInfoForJSON(modelArtifacts: ModelArtifacts):
    ModelArtifactsInfo {
  if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
    throw new Error('Expected JSON model topology, received ArrayBuffer.');
  }

  return {
    dateSaved: new Date(),
    modelTopologyType: 'JSON',
    weightDataBytes: modelArtifacts.weightData == null ?
        0 :
        modelArtifacts.weightData.byteLength,
  };
}

// tslint:disable-next-line:no-require-imports
/**
 *
 */
class AsyncStorageHandler implements IOHandler {
  protected readonly modelPath: string;
  protected readonly keys: LocalStorageKeys;
  protected asyncStorage: AsyncStorageStatic;

  constructor(modelPath: string) {
    if (modelPath == null || !modelPath) {
      throw new Error('modelPath must not be null, undefined or empty.');
    }
    this.modelPath = modelPath;
    this.keys = getModelKeys(this.modelPath);

    // We import this dynamically because it binds to a native library that
    // needs to be installed by the user if they use this handler. We don't
    // want users who are not using AsyncStorage to have to isntall this
    // library.
    this.asyncStorage =
        // tslint:disable-next-line:no-require-imports
        require('@react-native-community/async-storage').default;
  }

  /**
   * Save model artifacts to AsyncStorage
   *
   * @param modelArtifacts The model artifacts to be stored.
   * @returns An instance of SaveResult.
   */
  async save(modelArtifacts: ModelArtifacts): Promise<SaveResult> {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
          'AsyncStorageHandler.save() does not support saving model topology ' +
          'in binary format.');
    } else {
      const topology = JSON.stringify(modelArtifacts.modelTopology);
      const weightSpecs = JSON.stringify(modelArtifacts.weightSpecs);

      const modelArtifactsInfo: ModelArtifactsInfo =
          getModelArtifactsInfoForJSON(modelArtifacts);

      try {
        this.asyncStorage.setItem(
            this.keys.info, JSON.stringify(modelArtifactsInfo));
        this.asyncStorage.setItem(this.keys.topology, topology);
        this.asyncStorage.setItem(this.keys.weightSpecs, weightSpecs);
        this.asyncStorage.setItem(
            this.keys.weightData,
            fromByteArray(new Uint8Array(modelArtifacts.weightData)));
        this.asyncStorage.setItem(this.keys.modelMetadata, JSON.stringify({
          format: modelArtifacts.format,
          generatedBy: modelArtifacts.generatedBy,
          convertedBy: modelArtifacts.convertedBy
        }));

        return {modelArtifactsInfo};
      } catch (err) {
        // If saving failed, clean up all items saved so far.
        this.asyncStorage.removeItem(this.keys.info);
        this.asyncStorage.removeItem(this.keys.topology);
        this.asyncStorage.removeItem(this.keys.weightSpecs);
        this.asyncStorage.removeItem(this.keys.weightData);
        this.asyncStorage.removeItem(this.keys.modelMetadata);

        throw new Error(
            `Failed to save model '${this.modelPath}' to AsyncStorage.
            Error info ${err}`);
      }
    }
  }

  /**
   * Load a model from local storage.
   *
   * See the documentation to `browserLocalStorage` for details on the saved
   * artifacts.
   *
   * @returns The loaded model (if loading succeeds).
   */
  async load(): Promise<ModelArtifacts> {
    const info = JSON.parse(await this.asyncStorage.getItem(this.keys.info)) as
        ModelArtifactsInfo;
    if (info == null) {
      throw new Error(
          `In local storage, there is no model with name '${this.modelPath}'`);
    }

    if (info.modelTopologyType !== 'JSON') {
      throw new Error(
          'BrowserLocalStorage does not support loading non-JSON model ' +
          'topology yet.');
    }

    const out: ModelArtifacts = {};

    // Load topology.
    const topology =
        JSON.parse(await this.asyncStorage.getItem(this.keys.topology));
    if (topology == null) {
      throw new Error(
          `In local storage, the topology of model '${this.modelPath}' ` +
          `is missing.`);
    }
    out.modelTopology = topology;

    // Load weight specs.
    const weightSpecs =
        JSON.parse(await this.asyncStorage.getItem(this.keys.weightSpecs));
    if (weightSpecs == null) {
      throw new Error(
          `In local storage, the weight specs of model '${this.modelPath}' ` +
          `are missing.`);
    }
    out.weightSpecs = weightSpecs;

    // Load meta-data fields.
    const metadataString =
        await this.asyncStorage.getItem(this.keys.modelMetadata);
    if (metadataString != null) {
      const metadata = JSON.parse(metadataString) as
          {format: string, generatedBy: string, convertedBy: string};
      out.format = metadata['format'];
      out.generatedBy = metadata['generatedBy'];
      out.convertedBy = metadata['convertedBy'];
    }

    // Load weight data.
    const weightDataBase64 =
        await this.asyncStorage.getItem(this.keys.weightData);
    if (weightDataBase64 == null) {
      throw new Error(
          `In local storage, the binary weight values of model ` +
          `'${this.modelPath}' are missing.`);
    }
    out.weightData = toByteArray(weightDataBase64).buffer;

    return out;
  }
}

/**
 * Factory function for AsyncStorage IOHandler.
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
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `IOHandler`
 */
export function asyncStorageIO(modelPath: string): IOHandler {
  return new AsyncStorageHandler(modelPath);
}
