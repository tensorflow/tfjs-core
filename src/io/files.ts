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

export class DownloadTrigger implements IOHandler {
  private readonly modelTopologyFileName: string;
  private readonly weightDataFileName: string;

  constructor(fileNames?: string|string[]) {
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
      const jsonAnchor = document.createElement('a');
      jsonAnchor.download = this.modelTopologyFileName;
      jsonAnchor.href = modelTopologyAndWeightManifestURL;
      const weightDataAnchor = document.createElement('a');
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

export class Files implements IOHandler {
  constructor(files?: Files[]) {}
}

export function triggerDownloads(fileNames?: string|string[]): DownloadTrigger {
  return new DownloadTrigger(fileNames);
}
