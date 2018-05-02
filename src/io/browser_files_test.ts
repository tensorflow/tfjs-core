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
 * Unit tests for file-related IOHandlers.
 */

import * as tf from '../index';
import {WeightsManifestConfig} from './types';

const modelTopology1: {} = {
  'class_name': 'Sequential',
  'keras_version': '2.1.4',
  'config': [{
    'class_name': 'Dense',
    'config': {
      'kernel_initializer': {
        'class_name': 'VarianceScaling',
        'config': {
          'distribution': 'uniform',
          'scale': 1.0,
          'seed': null,
          'mode': 'fan_avg'
        }
      },
      'name': 'dense',
      'kernel_constraint': null,
      'bias_regularizer': null,
      'bias_constraint': null,
      'dtype': 'float32',
      'activation': 'linear',
      'trainable': true,
      'kernel_regularizer': null,
      'bias_initializer': {'class_name': 'Zeros', 'config': {}},
      'units': 1,
      'batch_input_shape': [null, 3],
      'use_bias': true,
      'activity_regularizer': null
    }
  }],
  'backend': 'tensorflow'
};
const weightSpecs1: tf.io.WeightsManifestEntry[] = [
  {
    name: 'dense/kernel',
    shape: [3, 1],
    dtype: 'float32',
  },
  {
    name: 'dense/bias',
    shape: [1],
    dtype: 'float32',
  }
];
const weightData1 = new ArrayBuffer(16);
const artifacts1: tf.io.ModelArtifacts = {
  modelTopology: modelTopology1,
  weightSpecs: weightSpecs1,
  weightData: weightData1,
};

describe('browserDownloads', () => {
  class FakeHTMLAnchorElement {
    download: string;
    href: string;
    clicked: number;

    constructor() {
      this.clicked = 0;
    }

    click() {
      this.clicked++;
    }
  }

  let fakeAnchors: FakeHTMLAnchorElement[] = [];
  let fakeAnchorCount = 0;

  beforeEach(() => {
    fakeAnchorCount = 0;
    fakeAnchors = [new FakeHTMLAnchorElement(), new FakeHTMLAnchorElement()];
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      return fakeAnchors[fakeAnchorCount++];
    });
  });

  it('Explicit file name prefix, with existing anchors', async done => {
    const testStartDate = new Date();
    const downloadTrigger = tf.io.browserDownoads('test-model');
    downloadTrigger.save(artifacts1)
        .then(async saveResult => {
          expect(saveResult.errors).toEqual(undefined);
          const artifactsInfo = saveResult.modelArtifactsInfo;
          expect(artifactsInfo.dateSaved.getTime())
              .toBeGreaterThanOrEqual(testStartDate.getTime());
          expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
              .toEqual(JSON.stringify(modelTopology1).length);
          expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
              .toEqual(JSON.stringify(weightSpecs1).length);
          expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);

          const jsonAnchor = fakeAnchors[0];
          const weightDataAnchor = fakeAnchors[1];
          expect(jsonAnchor.download).toEqual('test-model.json');
          expect(weightDataAnchor.download).toEqual('test-model.weights.bin');

          // Verify the content of the JSON file.
          const jsonContent = await fetch(jsonAnchor.href);
          const modelTopologyAndWeightsManifest =
              JSON.parse(await jsonContent.text());
          expect(modelTopologyAndWeightsManifest.modelTopology)
              .toEqual(modelTopology1);
          const weightsManifest =
              modelTopologyAndWeightsManifest.weightsManifest as
              WeightsManifestConfig;
          expect(weightsManifest.length).toEqual(1);
          expect(weightsManifest[0].paths).toEqual([
            './test-model.weights.bin'
          ]);
          expect(weightsManifest[0].weights).toEqual(weightSpecs1);

          // Verify the content of the binary weights file.
          const weightsContent = await fetch(weightDataAnchor.href);
          const fileReader = new FileReader();
          // tslint:disable-next-line:no-any
          fileReader.onload = (event: any) => {
            const buffer = event.target.result as ArrayBuffer;
            expect(buffer).toEqual(weightData1);
            done();
          };
          fileReader.readAsArrayBuffer(await weightsContent.blob());

          // Verify that the downloads are triggered through clicks.
          expect(jsonAnchor.clicked).toEqual(1);
          expect(weightDataAnchor.clicked).toEqual(1);
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('No file name provided, with existing anchors', async done => {
    const testStartDate = new Date();
    const downloadTrigger = tf.io.browserDownoads();
    downloadTrigger.save(artifacts1)
        .then(async saveResult => {
          expect(saveResult.errors).toEqual(undefined);
          const artifactsInfo = saveResult.modelArtifactsInfo;
          expect(artifactsInfo.dateSaved.getTime())
              .toBeGreaterThanOrEqual(testStartDate.getTime());
          expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
              .toEqual(JSON.stringify(modelTopology1).length);
          expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
              .toEqual(JSON.stringify(weightSpecs1).length);
          expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);

          const jsonAnchor = fakeAnchors[0];
          const weightDataAnchor = fakeAnchors[1];

          // Verify that the default file names are used.
          expect(jsonAnchor.download).toEqual('model.json');
          expect(weightDataAnchor.download).toEqual('model.weights.bin');

          // Verify the content of the JSON file.
          const jsonContent = await fetch(jsonAnchor.href);
          const modelTopologyAndWeightsManifest =
              JSON.parse(await jsonContent.text());
          expect(modelTopologyAndWeightsManifest.modelTopology)
              .toEqual(modelTopology1);
          const weightsManifest =
              modelTopologyAndWeightsManifest.weightsManifest as
              WeightsManifestConfig;
          expect(weightsManifest.length).toEqual(1);
          expect(weightsManifest[0].paths).toEqual(['./model.weights.bin']);
          expect(weightsManifest[0].weights).toEqual(weightSpecs1);

          // Verify the content of the binary weights file.
          const weightsContent = await fetch(weightDataAnchor.href);
          const fileReader = new FileReader();
          // tslint:disable-next-line:no-any
          fileReader.onload = (event: any) => {
            const buffer = event.target.result as ArrayBuffer;
            expect(buffer).toEqual(weightData1);
            done();
          };
          fileReader.readAsArrayBuffer(await weightsContent.blob());
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });
});

describe('browserFiles', () => {
  const weightsBlob =
      new Blob([weightData1], {type: 'application/octet-stream'});
  const weightsFile = new File(
      [weightsBlob], 'model.weights.bin', {type: 'application/octet-stream'});

  it('Load from uploaded JSON and weights files', async done => {
    const weightsManifest: WeightsManifestConfig = [{
      paths: ['./models.weights.bin'],
      weights: weightSpecs1,
    }];
    const weightsTopologyAndManifest = {
      modelTopology: modelTopology1,
      weightsManifest,
    };
    const jsonBlob = new Blob(
        [JSON.stringify(weightsTopologyAndManifest)],
        {type: 'application/json'});
    const jsonFile =
        new File([jsonBlob], 'model.json', {type: 'application/json'});

    const filesHandler = tf.io.browserFiles([jsonFile, weightsFile]);
    filesHandler.load()
        .then(modelArtifacts => {
          expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
          expect(modelArtifacts.weightSpecs).toEqual(weightSpecs1);
          expect(modelArtifacts.weightData).toEqual(weightData1);
          done();
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Missing modelTopology from JSON leads to Error', async done => {
    const weightsManifest: WeightsManifestConfig = [{
      paths: ['./models.weights.bin'],
      weights: weightSpecs1,
    }];
    const weightsTopologyAndManifest = {
      weightsManifest,
    };
    const jsonBlob = new Blob(
        [JSON.stringify(weightsTopologyAndManifest)],
        {type: 'application/json'});
    const jsonFile =
        new File([jsonBlob], 'model.json', {type: 'application/json'});

    const filesHandler = tf.io.browserFiles([jsonFile, weightsFile]);
    filesHandler.load()
        .then(modelArtifacts => {
          done.fail(
              'Loading with Files IOHandler with missing modelTopology ' +
              'succeeded unexpectedly.');
        })
        .catch(err => {
          expect(err.message)
              .toMatch(/modelTopology field is missing from file model\.json/);
          done();
        });
  });

  // TODO(cais): Test mismatch in file count and weight manifest.
  // TODO(cais): Test duplicate base file names.

  it('Incorrect number of files leads to Error', () => {
    const weightsBlob =
        new Blob([weightData1], {type: 'application/octet-stream'});
    const file = new File(
        [weightsBlob], 'model.weights.bin', {type: 'application/octet-stream'});

    expect(() => tf.io.browserFiles(null)).toThrowError(/at least 2 files/);
    expect(() => tf.io.browserFiles([])).toThrowError(/at least 2 files/);
    expect(() => tf.io.browserFiles([file])).toThrowError(/at least 2 files/);
  });
});
