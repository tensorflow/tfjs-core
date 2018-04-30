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

// tslint:disable:max-line-length
import {stringByteLength} from './io_utils';
import {IOHandler, ModelArtifacts, SaveResult, WeightsManifestConfig} from './types';
// tslint:enable:max-line-length

const JSON_EXTENSION_NAME = '.json';
const WEIHGT_DATA_EXTENSION_NAME = '.weights.bin';

export interface DownloadTriggerConfig {
  /**
   * The HTML anchor ('<a>') element to bind the downloading of the model
   * architecture + weights manifest JSON file to.
   *
   * Optional. If not specified, a temporary, orphan anchor element will be
   * create to bind the download to.
   */
  jsonAnchor?: HTMLAnchorElement;

  /**
   * The HTML anchor ('<a>') element to bind the downloading of the binary
   * weights file to.
   *
   * Optional. If not specified, a temporary, orphan anchor element will be
   * create to bind the download to.
   */
  weightDataAnchor?: HTMLAnchorElement;

  /**
   * Whether the download(s) should be triggered immediately (default: `true`).
   */
  trigger?: boolean;
}

export class DownloadTrigger implements IOHandler {
  private readonly modelTopologyFileName: string;
  private readonly weightDataFileName: string;
  private readonly jsonAnchor: HTMLAnchorElement;
  private readonly weightDataAnchor: HTMLAnchorElement;
  private readonly trigger: boolean;

  constructor(fileNames?: string|string[], config?: DownloadTriggerConfig) {
    if (!window) {
      // TODO(cais): Provide info on what IOHandlers are available under the
      //   current environment.
      throw new Error(
          'triggerDownloads() cannot proceed because the current environment ' +
          'is not a browser.');
    }

    // TODO(cais): In case fileNames is null or undefined, use default prefixes.

    if (!Array.isArray(fileNames)) {
      fileNames = [fileNames];
    }

    if (fileNames.length === 1) {
      this.modelTopologyFileName = fileNames[0] + JSON_EXTENSION_NAME;
      this.weightDataFileName = fileNames[0] + WEIHGT_DATA_EXTENSION_NAME;
    } else if (fileNames.length === 2) {
      this.modelTopologyFileName = fileNames[0];
      this.weightDataFileName = fileNames[1];
    } else {
      // TODO(cais): Support length === 3, for the case of GraphDef models, in
      //   which case there will be three files: GraphDef (binary), weight
      //   manifest (text), weight data (binary).
      throw new Error(
          `File names supplied to tf.io.triggerDownload() must be a single ` +
          `string, an Array of a single string or an Array of two strings, ` +
          `but received an Array of ${fileNames.length} strings.`);
    }

    if (config != null) {
      this.jsonAnchor = config.jsonAnchor;
      this.weightDataAnchor = config.weightDataAnchor;
      this.trigger = config.trigger == null ? true : config.trigger;
    } else {
      this.trigger = true;
    }
  }

  async save(modelArtifacts: ModelArtifacts): Promise<SaveResult> {
    const weightsURL = window.URL.createObjectURL(new Blob(
        [modelArtifacts.weightData], {type: 'application/octet-stream'}));

    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
          'DownloadTrigger.save() does not support saving model topology ' +
          'in binary formats yet.');
    } else {
      const weightsManifest: WeightsManifestConfig = [{
        paths: ['./' + this.weightDataFileName],
        weights: modelArtifacts.weightSpecs
      }];
      const modelTopologyAndWeightManifest = {
        modelTopology: modelArtifacts.modelTopology,
        weightsManifest
      };
      const modelTopologyAndWeightManifestURL =
          window.URL.createObjectURL(new Blob(
              [JSON.stringify(modelTopologyAndWeightManifest)],
              {type: 'application/json'}));

      // Create new anchor elements, without attaching them to parents, so that
      // the downloaded file names can be controlled.
      const jsonAnchor = this.jsonAnchor == null ?
          document.createElement('a') as HTMLAnchorElement :
          this.jsonAnchor;
      jsonAnchor.download = this.modelTopologyFileName;
      jsonAnchor.href = modelTopologyAndWeightManifestURL;
      const weightDataAnchor = this.weightDataAnchor == null ?
          document.createElement('a') as HTMLAnchorElement :
          this.weightDataAnchor;
      weightDataAnchor.download = this.weightDataFileName;
      weightDataAnchor.href = weightsURL;

      // Trigger downloads by calling the `click` methods on the download
      // anchors.
      if (this.trigger) {
        jsonAnchor.click();
        weightDataAnchor.click();
      }

      return {
        modelArtifactsInfo: {
          dateSaved: new Date(),
          modelTopologyType: 'KerasJSON',
          modelTopologyBytes:
              stringByteLength(JSON.stringify(modelArtifacts.modelTopology)),
          weightSpecsBytes:
              stringByteLength(JSON.stringify(modelArtifacts.weightSpecs)),
          weightDataBytes: modelArtifacts.weightData.byteLength,
        }
      };
    }
  }
}

export class Files implements IOHandler {
  private readonly files: File[];

  constructor(files?: File[]) {
    this.files = files;
  }

  async load(): Promise<ModelArtifacts> {
    if (this.files.length !== 2) {
      throw new Error(
          `Files.load() currently supports only loading from 2 files ` +
          `(a JSON file and a binary weights file), but ` +
          `received ${this.files.length} file(s).`);
    }

    return new Promise<ModelArtifacts>((resolve, reject) => {
      const jsonReader = new FileReader();
      // tslint:disable-next-line:no-any
      jsonReader.onload = (event: any) => {
        const modelJSON = JSON.parse(event.target.result);
        const modelTopology = modelJSON.modelTopology as {};
        if (modelTopology == null) {
          reject(new Error(
              `modelTopology field is missing from file ${this.files[0]}`));
        }
        const weightsManifest =
            modelJSON.weightsManifest as WeightsManifestConfig;
        if (weightsManifest == null) {
          reject(new Error(
              `weightManifest field is missing from file ${this.files[0]}`));
        }
        if (weightsManifest.length !== 1) {
          reject(new Error(
              `When uploading user-selected files, we current support only ` +
              `a single weight group, but the weights manifest indicates ` +
              `there are ${weightsManifest.length} weight groups`));
        }
        const weightGroup = weightsManifest[0];
        if (weightGroup.paths.length !== 1) {
          reject(new Error(
              `When uploading user-selected files, we current support only ` +
              `a single weight file, but the weights manifest indicates ` +
              `there are ${weightGroup.paths.length} weight groups`));
        }
        const weightSpecs = weightGroup.weights;

        const weightsReader = new FileReader();
        // tslint:disable-next-line:no-any
        weightsReader.onload = (event: any) => {
          const weightData = event.target.result;
          resolve({modelTopology, weightSpecs, weightData});
        };

        weightsReader.readAsArrayBuffer(this.files[1]);
      };
      jsonReader.readAsText(this.files[0]);
    });
  }
}

/**
 * Factory method for IOHandler for triggering file downloads.
 *
 * The returned `IOHandler` instance can be used as model exporting methods such
 * as `tf.Model.save` and supports only saving.
 *
 * ```
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * const artifactsInfo = await model.save(tf.io.triggerDownloads(
 *     ['mymodel.json', 'mymodel.weights.bin'])):
 * console.log(artifactsInfo);
 * ```
 *
 * @param fileNames Name(s) of the files to be downloaded. For use with
 *   `tf.Model`, `fileNames` should follow one of the following two formats:
 *   1. A single string or an Array of a single string, as the file name prefix.
 *      For example, if 'foo' is provided, the downloaded JSON file and binary
 * weights file will be named as 'foo.json' and 'foo.weights.bin', respectively.
 *   2. An Array of two file names, as full names of the JSON and binary weights
 *      files, in that order.
 * @param config Additional configuration for triggering downloads.
 * @returns An instance of `DownloadTrigger` `IOHandler`.
 */
export function triggerDownloads(
    fileNames?: string|string[],
    config?: DownloadTriggerConfig): DownloadTrigger {
  return new DownloadTrigger(fileNames, config);
}

/**
 * Factory method for IOHandler that loads model artifacts from files.
 *
 * This method can be used for files such as user-selected files in the browser.
 * When used in conjunction with `tf.loadModel`, an instance of `tf.Model`
 * (Keras-style)
 *
 * ```js
 * // Note: This code snippet won't run properly without the actual file input
 * //   elements in the HTML DOM.
 *
 * // Suppose there are two HTML file input ('<input type="file" ...>')
 * // elements.
 * const uploadJSONInput = document.getElementById('upload-json');
 * const uploadWeightsInput = document.getElementById('upload-weights');
 * const model = await tfl.loadModel(
 *     tfc.io.files([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
 * ```
 *
 * @param files `File`s to load from. Currently, this function supports only
 *   loading from files that contain Keras-style models (i.e., `tf.Model`s), for
 *   which an `Array` of two `File`s is expected (in that order):
 *   - A JSON file containing the model topology and weight manifest.
 *   - A binary file containing the binary weights.
 * @returns An instance of `Files` `IOHandler`.
 */
export function files(files?: File[]): Files {
  return new Files(files);
}
