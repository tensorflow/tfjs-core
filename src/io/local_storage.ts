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

import {IOHandler, ModelArtifacts, SaveResult} from './types';

const PATH_SEPARATOR = '/';
const PATH_PREFIX = 'tensorflowjs_models';
const TOPOLOGY_SUFFIX = 'topology';
const WEIGHT_SPECS_SUFFIX = 'json';
const WEIGHT_DATA_SUFFIX = 'weights';

export class BrowserLocalStorage implements IOHandler {
  protected readonly modelPath: string;

  constructor(modelPath: string) {
    if (modelPath == null) {
      throw new Error('modelPath cannot be null or undefined.');
    }
    if (!modelPath) {
      throw new Error('modelPath must not be empty.');
    }
    this.modelPath = modelPath;
  }

  async save(modelArtifact: ModelArtifacts): Promise<SaveResult> {
    if (!(window && window.localStorage)) {
      return {
        success: false,
        errors: ['The current environment does not support local storage.'],
      };
    }

    if (modelArtifact.modelTopology instanceof ArrayBuffer) {
      throw new Error(
          'BrowserLocalStorage.save() does not support saving protocol ' +
          'buffers as model topology yet.');
    } else {
      try {
        window.localStorage.localStorage.setItem(
            [PATH_PREFIX, this.modelPath, TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
            JSON.stringify(modelArtifact.modelTopology));
        window.localStorage.localStorage.setItem(
            [PATH_PREFIX, this.modelPath, WEIGHT_SPECS_SUFFIX].join(
                PATH_SEPARATOR),
            JSON.stringify(modelArtifact.weightSpecs));
        window.localStorage.localStorage.setItem(
            [PATH_PREFIX, this.modelPath, WEIGHT_DATA_SUFFIX].join(
                PATH_SEPARATOR),
            JSON.stringify(modelArtifact.weightSpecs));
      } catch (err) {
        return {
          success: false,
          errors: [err],
        };
      }
    }

    return {
      success: true,
    };
  }
}
