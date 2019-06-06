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

import * as tf from '@tensorflow/tfjs-core';
import {IOHandler, ModelArtifacts, ModelJSON, SaveResult} from '@tensorflow/tfjs-core';
import {Image, ImageSourcePropType} from 'react-native';

class BundleResourceHandler implements IOHandler {
  protected readonly modelJson: ModelJSON;
  protected readonly modelWeightsId: string|number;

  constructor(modelJson: ModelJSON, modelWeightsId: string|number) {
    if (modelJson == null || modelWeightsId == null) {
      throw new Error(
          'Must pass the model json object and the model weights path.');
    }
    if (Array.isArray(modelWeightsId)) {
      throw new Error(
          'Bundle resource IO handler does not currently support loading ' +
          'sharded weights');
    }

    this.modelJson = modelJson;
    this.modelWeightsId = modelWeightsId;
  }

  /**
   * Save model artifacts. This IO handler cannot support writing to the
   * packaged bundle at runtime and is exclusively for loading a model
   * that is already packages with the app.
   *
   */
  async save(): Promise<SaveResult> {
    throw new Error(
        'Bundle resource IO handler does not support saving. ' +
        'Consider using asyncStorageIO instead');
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
    const modelJson = this.modelJson;

    // Load the weights
    const weightsAssetPath =
        Image.resolveAssetSource(this.modelWeightsId as ImageSourcePropType);
    const response = await tf.util.fetch(weightsAssetPath.uri, {
      headers: {
        responseType: 'arraybuffer',
      }
    });
    const weightData = await response.arrayBuffer();

    return {
      modelTopology: modelJson.modelTopology,
      weightSpecs: modelJson.weightsManifest[0].weights,
      format: modelJson.format,
      generatedBy: modelJson.generatedBy,
      convertedBy: modelJson.convertedBy,
      weightData,
    };
  }
}

/**
 * Factory function for BundleResource IOHandler.
 *
 * This `IOHandler` only supports `load`. It is designed to support
 * loading models that have been statically bundled (at compile time)
 * with an app.
 *
 * @param modelJson The JSON object for the serialized model.
 * @param modelWeightsId An identifier for the model weights file. This is
 * generally a resourceId or a path to the resource in the app package.
 * This is typically obtained with a `require` statement.
 *
 * See
 * facebook.github.io/react-native/docs/images#static-non-image-resources
 * for more details on how to include static resources into your react-native
 * app including how to configure `metro` to bundle `.bin` files.
 *
 * @returns An instance of `IOHandler`
 */
export function bundleResourceIO(
    modelJson: ModelJSON, modelWeightsId: string|number): IOHandler {
  return new BundleResourceHandler(modelJson, modelWeightsId);
}
