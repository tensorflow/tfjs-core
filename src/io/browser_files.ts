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

/**
 * IOHandlers related to files.
 *
 * such as browser-triggered file downloads, user-selected files in browser and
 * native files (node.js).
 */

// tslint:disable:max-line-length
import {concatenateArrayBuffers, stringByteLength} from './io_utils';
import {IOHandler, ModelArtifacts, SaveResult, WeightsManifestConfig, WeightsManifestEntry} from './types';
// tslint:enable:max-line-length

const DEFAULT_FILE_NAME_PREFIX = 'model';
const DEFAULT_JSON_EXTENSION_NAME = '.json';
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';

export class BrowserDownloads implements IOHandler {
  private readonly modelTopologyFileName: string;
  private readonly weightDataFileName: string;
  private readonly jsonAnchor: HTMLAnchorElement;
  private readonly weightDataAnchor: HTMLAnchorElement;

  constructor(fileNamePrefix?: string) {
    if (window == null) {
      // TODO(cais): Provide info on what IOHandlers are available under the
      //   current environment.
      throw new Error(
          'triggerDownloads() cannot proceed because the current environment ' +
          'is not a browser.');
    }

    if (fileNamePrefix == null) {
      fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
    }

    this.modelTopologyFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.weightDataFileName =
        fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
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

      // If anchor elements are not provided, create them without attaching them
      // to parents, so that the downloaded file names can be controlled.
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
      jsonAnchor.click();
      weightDataAnchor.click();

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

export class BrowserFiles implements IOHandler {
  private readonly files: File[];

  constructor(files: File[]) {
    if (files == null || files.length < 2) {
      throw new Error(
          `When calling browserFiles, at least 2 files are required, ` +
          `but received ${files}`);
    }
    this.files = files;
  }

  async load(): Promise<ModelArtifacts> {
    const jsonFile = this.files[0];
    const weightFiles = this.files.slice(1);

    return new Promise<ModelArtifacts>((resolve, reject) => {
      const jsonReader = new FileReader();
      jsonReader.onload = (event: Event) => {
        console.log('jsonReader.onload');  // DEBUG
        // tslint:disable-next-line:no-any
        const modelJSON = JSON.parse((event.target as any).result);
        const modelTopology = modelJSON.modelTopology as {};
        if (modelTopology == null) {
          reject(new Error(
              `modelTopology field is missing from file ${jsonFile.name}`));
        }
        const weightsManifest =
            modelJSON.weightsManifest as WeightsManifestConfig;
        // DEBUG
        console.log(`weightsManifest = ${JSON.stringify(weightsManifest)}`);
        if (weightsManifest == null) {
          reject(new Error(
              `weightManifest field is missing from file ${jsonFile.name}`));
        }

        let pathToFile: {[path: string]: File};
        try {
          pathToFile =
              this.checkManifestAndWeightFiles(weightsManifest, weightFiles);
        } catch (err) {
          console.log('Caught error:', err.message);  // DEBUG
          reject(err);
        }
        console.log(`pathToFile = ${JSON.stringify(pathToFile)}`);  // DEBUG

        const weightSpecs: WeightsManifestEntry[] = [];
        const paths: string[] = [];
        const perFileBuffers: ArrayBuffer[] = [];
        // TODO(cais): Use forEach.
        for (let i = 0; i < weightsManifest.length; ++i) {
          const weightsGroup = weightsManifest[i];
          for (let j = 0; j < weightsGroup.paths.length; ++j) {
            paths.push(weightsGroup.paths[j]);
            perFileBuffers.push(null);
          }
          weightSpecs.push(...weightsManifest[i].weights);
        }

        for (let i = 0; i < weightsManifest.length; ++i) {
          const weightsGroup = weightsManifest[i];
          // DEBUG
          console.log(`weightsGroup = ${JSON.stringify(weightsGroup)}`);
          for (let j = 0; j < weightsGroup.paths.length; ++j) {
            const path = weightsGroup.paths[j];
            const weightFileReader = new FileReader();
            weightFileReader.onload = (event: Event) => {
              // tslint:disable-next-line:no-any
              const weightData = (event.target as any).result as ArrayBuffer;
              const index = paths.indexOf(path);
              console.log(`Filling in perFileBuffers: ${index}`);  // DEBUG
              perFileBuffers[index] = weightData;
              console.log(perFileBuffers);  // DEBUG
              if (perFileBuffers.indexOf(null) === -1) {
                resolve({
                  modelTopology,
                  weightSpecs,
                  weightData: concatenateArrayBuffers(perFileBuffers),
                });
              }
            };
            weightFileReader.onerror = (error: ErrorEvent) => {
              console.log('weightFileReader.onerror');  // DEBUG
              reject(`Failed to weights data from file of path '${path}'.`);
            };
            weightFileReader.readAsArrayBuffer(pathToFile[path]);
          }
        }
      };
      jsonReader.onerror = (error: ErrorEvent) => {
        console.log('jsonReader.onerror');  // DEBUG
        reject(
            `Failed to read model topology and weights manifest JSON ` +
            `from file '${jsonFile.name}'. BrowserFiles supports loading ` +
            `Keras-style tf.Model artifacts only.`);
      };
      jsonReader.readAsText(this.files[0]);
    });
  }

  /**
   * Check the compatibility between weights manifest and weight files.
   */
  private checkManifestAndWeightFiles(
      manifest: WeightsManifestConfig, files: File[]): {[path: string]: File} {
    const basenames: string[] = [];
    const fileNames = files.map(file => file.name);
    console.log(`fileNames = ${JSON.stringify(fileNames)}`);  // DEBUG
    const pathToFile: {[path: string]: File} = {};
    for (const group of manifest) {
      group.paths.forEach(path => {
        const pathItems = path.split('/');
        const basename = pathItems[pathItems.length - 1];
        if (basenames.indexOf(basename) !== -1) {
          throw new Error(
              `Duplicate file basename found in weights manifest: ${basename}`);
        }
        basenames.push(basename);
        console.log('basename =', basename);  // DEBUG
        if (fileNames.indexOf(basename) === -1) {
          throw new Error(
              `Weight file with basename '${basename}' is not provided.`);
        } else {
          pathToFile[path] = files[fileNames.indexOf(basename)];
        }
      });
    }

    if (basenames.length !== files.length) {
      throw new Error(
          `Mismatch in the number of files in weights manifest ` +
          `(${basenames.length}) and the number of weight files provided ` +
          `(${files.length}).`);
    }
    console.log(`Returning ${JSON.stringify(pathToFile)}`);
    return pathToFile;
  }
}

/**
 * Factory method for IOHandler that triggers file downloads.
 *
 * The returned `IOHandler` instance can be used as model exporting methods such
 * as `tf.Model.save` and supports only saving.
 *
 * ```js
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * const artifactsInfo = await model.save(tf.io.triggerDownloads('mymodel'));
 * // This will trigger downloading of two files:
 * //   'mymodel.json' and 'mymodel.weights.bin'.
 * console.log(artifactsInfo);
 * ```
 *
 * @param fileNamePrefix Prefix name of the files to be downloaded. For use with
 *   `tf.Model`, `fileNamePrefix` should follow either of the following two
 *   formats:
 *   1. `null` or `undefined`, in which case the default file
 *      names will be used:
 *      - 'model.json' for the JSON file containing the model topology and
 *        weights manifest.
 *      - 'model.weights.bin' for the binary file containing the binary weight
 *        values.
 *   2. A single string or an Array of a single string, as the file name prefix.
 *      For example, if `'foo'` is provided, the downloaded JSON
 *      file and binary weights file will be named 'foo.json' and
 *      'foo.weights.bin', respectively.
 * @param config Additional configuration for triggering downloads.
 * @returns An instance of `DownloadTrigger` `IOHandler`.
 */
export function browserDownoads(fileNamePrefix = 'model'): BrowserDownloads {
  return new BrowserDownloads(fileNamePrefix);
}

/**
 * Factory method for IOHandler that loads model artifacts from files.
 *
 * This method can be used for loading from files such as user-selected files
 * in the browser.
 * When used in conjunction with `tf.loadModel`, an instance of `tf.Model`
 * (Keras-style) can be constructed from the loaded artifacts.
 *
 * ```js
 * // Note: This code snippet won't run properly without the actual file input
 * //   elements in the HTML DOM.
 *
 * // Suppose there are two HTML file input (`<input type="file" ...>`)
 * // elements.
 * const uploadJSONInput = document.getElementById('upload-json');
 * const uploadWeightsInput = document.getElementById('upload-weights');
 * const model = await tfl.loadModel(
 *     tfc.io.files([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
 * ```
 *
 * @param files `File`s to load from. Currently, this function supports only
 *   loading from files that contain Keras-style models (i.e., `tf.Model`s), for
 *   which an `Array` of `File`s is expected (in that order):
 *   - A JSON file containing the model topology and weight manifest.
 *   - One or more binary files containing the binary weights.
 * @returns An instance of `Files` `IOHandler`.
 */
export function browserFiles(files: File[]): BrowserFiles {
  return new BrowserFiles(files);
}
