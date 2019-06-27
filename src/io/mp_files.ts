/**
 * @license
 * Copyright 2019 mogoweb@gmail.com. All Rights Reserved.
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
 * IOHandlers related to files, such as save to WeChat mini-program local files,
 * load model from local files.
 */

import {ENV} from '../environment';
import {basename, concatenateArrayBuffers, getModelArtifactsInfoForJSON} from './io_utils';
import {IORouter, IORouterRegistry} from './router_registry';
import {IOHandler, ModelArtifacts, ModelJSON, SaveResult, WeightsManifestConfig, WeightsManifestEntry} from './types';
/// <reference path="../platforms/wx.d.ts">

const DEFAULT_FILE_NAME_PREFIX = 'model';
const DEFAULT_JSON_EXTENSION_NAME = '.json';
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';

export class MPSaver implements IOHandler {
  private readonly modelTopologyFileName: string;
  private readonly weightDataFileName: string;

  static readonly URL_SCHEME = 'mp://';

  constructor(fileNamePrefix?: string) {
    if (!ENV.getBool('IS_MP')) {
      // TODO(cais): Provide info on what IOHandlers are available under the
      //   current environment.
      throw new Error(
          'MPSaver() cannot proceed because the current environment ' +
          'is not a WeChat mini-program.');
    }

    if (fileNamePrefix.startsWith(MPSaver.URL_SCHEME)) {
      fileNamePrefix = fileNamePrefix.slice(MPSaver.URL_SCHEME.length);
    }
    if (fileNamePrefix == null || fileNamePrefix.length === 0) {
      fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
    }

    this.modelTopologyFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.weightDataFileName =
        fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
  }

  async save(modelArtifacts: ModelArtifacts): Promise<SaveResult> {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
          'MPSaver.save() does not support saving model topology ' +
          'in binary formats yet.');
    } else {
      const weightsManifest: WeightsManifestConfig = [{
        paths: ['./' + this.weightDataFileName],
        weights: modelArtifacts.weightSpecs
      }];
      const modelTopologyAndWeightManifest: ModelJSON = {
        modelTopology: modelArtifacts.modelTopology,
        format: modelArtifacts.format,
        generatedBy: modelArtifacts.generatedBy,
        convertedBy: modelArtifacts.convertedBy,
        weightsManifest
      };

      const fileSystemManager = wx.getFileSystemManager();
      console.log('write:' + this.modelTopologyFileName);
      fileSystemManager.writeFileSync(
        this.modelTopologyFileName,
        JSON.stringify(modelTopologyAndWeightManifest),
        'utf-8'
      );

      if (modelArtifacts.weightData != null) {
        console.log('write:' + this.weightDataFileName);
        fileSystemManager.writeFileSync(
          this.weightDataFileName,
          modelArtifacts.weightData,
          'binary'
        );
      }
      console.log('write success!');

      return {modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts)};
    }
  }
}

class MPFiles implements IOHandler {
  private readonly files: string[];

  constructor(files: string[]) {
    if (files == null || files.length < 1) {
      throw new Error(
          `When calling mpFiles, at least 1 file is required, ` +
          `but received ${files}`);
    }
    this.files = files;
  }

  async load(): Promise<ModelArtifacts> {
    console.log('MPFiles load()');
    const jsonFile = this.files[0];
    const weightFiles = this.files.slice(1);
    console.log(weightFiles);

    return new Promise<ModelArtifacts>((resolve, reject) => {
      const fileSystemManager = wx.getFileSystemManager();
      fileSystemManager.readFile({
        filePath: jsonFile,
        encoding: 'utf-8',
        // tslint:disable-next-line:no-any
        success: (res: any) => {
          const modelJSON = JSON.parse(res.data) as ModelJSON;
          const modelTopology = modelJSON.modelTopology;
          if (modelTopology == null) {
            reject(new Error(
                `modelTopology field is missing from file ${jsonFile}`));
            return;
          }

          if (weightFiles.length === 0) {
            resolve({modelTopology});
          }

          const weightsManifest = modelJSON.weightsManifest;
          if (weightsManifest == null) {
            reject(new Error(
                `weightManifest field is missing from file ${jsonFile}`));
            return;
          }

          let pathToFile: {[path: string]: string};
          try {
            pathToFile =
                this.checkManifestAndWeightFiles(weightsManifest, weightFiles);
          } catch (err) {
            reject(err);
            return;
          }

          const weightSpecs: WeightsManifestEntry[] = [];
          const paths: string[] = [];
          const perFileBuffers: ArrayBuffer[] = [];
          weightsManifest.forEach(weightsGroup => {
            weightsGroup.paths.forEach(path => {
              paths.push(path);
              perFileBuffers.push(null);
            });
            weightSpecs.push(...weightsGroup.weights);
          });

          weightsManifest.forEach(weightsGroup => {
            weightsGroup.paths.forEach(path => {
              console.log('readFile:' + pathToFile[path]);
              fileSystemManager.readFile({
                filePath: pathToFile[path],
                // tslint:disable-next-line:no-any
                success: (res: any) => {
                  const weightData = res.data;
                  console.log('read success!');
                  const index = paths.indexOf(path);
                  perFileBuffers[index] = weightData;
                  console.log(typeof weightData);
                  if (perFileBuffers.indexOf(null) === -1) {
                    console.log(perFileBuffers);
                    console.log(concatenateArrayBuffers(perFileBuffers).byteLength);
                    resolve({
                      modelTopology,
                      weightSpecs,
                      weightData: concatenateArrayBuffers(perFileBuffers),
                    });
                  }
                },
                fail: (errMsg: string) => {
                  reject(`Failed to weights data from file of path '${path}'. ${
                      errMsg}`);
                }
              });
            });
          });
        },
        fail: (errMsg: string) => {
          reject(
              `Failed to read model topology and weights manifest JSON ` +
              `from file '${jsonFile}'. MPFiles supports loading ` +
              `Keras-style tf.Model artifacts only.`);
        }
      });
    });
  }

  /**
   * Check the compatibility between weights manifest and weight files.
   */
  private checkManifestAndWeightFiles(
      manifest: WeightsManifestConfig,
      files: string[]): {[path: string]: string} {
    const basenames: string[] = [];
    const fileNames = files.map(file => basename(file));
    const pathToFile: {[path: string]: string} = {};
    for (const group of manifest) {
      group.paths.forEach(path => {
        const pathBasename = basename(path);
        if (basenames.indexOf(pathBasename) !== -1) {
          throw new Error(
              `Duplicate file basename found in weights manifest: ` +
              `'${pathBasename}'`);
        }
        basenames.push(pathBasename);
        if (fileNames.indexOf(pathBasename) === -1) {
          throw new Error(
              `Weight file with basename '${pathBasename}' is not provided.`);
        } else {
          pathToFile[path] = files[fileNames.indexOf(pathBasename)];
        }
      });
    }

    if (basenames.length !== files.length) {
      throw new Error(
          `Mismatch in the number of files in weights manifest ` +
          `(${basenames.length}) and the number of weight files provided ` +
          `(${files.length}).`);
    }
    return pathToFile;
  }
}

export const mpSaverRouter: IORouter = (url: string|string[]) => {
  if (!ENV.getBool('IS_MP')) {
    return null;
  } else {
    if (!Array.isArray(url) && url.startsWith(MPSaver.URL_SCHEME)) {
      return mpSaver(url.slice(MPSaver.URL_SCHEME.length));
    } else {
      return null;
    }
  }
};
IORouterRegistry.registerSaveRouter(mpSaverRouter);

/**
 * Creates an IOHandler that triggers model saves to local files.
 *
 * The returned `IOHandler` instance can be used as model exporting methods
 * such as `tf.Model.save` and supports only saving.
 *
 * ```js
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * const saveResult = await model.save('mp://mymodel');
 * // This will trigger saving of two files:
 * //   'mymodel.json' and 'mymodel.weights.bin'.
 * console.log(saveResult);
 * ```
 *
 * @param fileNamePrefix Prefix name of the files to be saved. For use with
 *   `tf.Model`, `fileNamePrefix` should follow either of the following two
 *   formats:
 *   1. `null` or `undefined`, in which case the default file
 *      names will be used:
 *      - 'model.json' for the JSON file containing the model topology and
 *        weights manifest.
 *      - 'model.weights.bin' for the binary file containing the binary weight
 *        values.
 *   2. A single string or an Array of a single string, as the file name
 * prefix. For example, if `'foo'` is provided, the downloaded JSON file and
 * binary weights file will be named 'foo.json' and 'foo.weights.bin',
 * respectively.
 * @param config Additional configuration for triggering saves.
 * @returns An instance of `MPSaver` `IOHandler`.
 */
/**
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Loading',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
export function mpSaver(fileNamePrefix = 'model'): IOHandler {
  return new MPSaver(fileNamePrefix);
}

/**
 * Creates an IOHandler that loads model artifacts from local files.
 *
 * This method can be used for loading from WeChat mini-program local files
 * When used in conjunction with `tf.loadLayersModel`, an instance of
 * `tf.LayersModel` (Keras-style) can be constructed from the loaded
 * artifacts.
 *
 * @param files `File`s to load from. Currently, this function supports only
 *   loading from files that contain Keras-style models (i.e., `tf.Model`s),
 * for which an `Array` of `File`s is expected (in that order):
 *   - A JSON file containing the model topology and weight manifest.
 *   - Optionally, One or more binary files containing the binary weights.
 *     These files must have names that match the paths in the
 * `weightsManifest` contained by the aforementioned JSON file, or errors will
 * be thrown during loading. These weights files have the same format as the
 * ones generated by `tensorflowjs_converter` that comes with the
 * `tensorflowjs` Python PIP package. If no weights files are provided, only
 * the model topology will be loaded from the JSON file above.
 * @returns An instance of `Files` `IOHandler`.
 */
/**
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Loading',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
export function mpFiles(files: string[]): IOHandler {
  return new MPFiles(files);
}
