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

describe('triggerDownload', () => {
  it('Two file names, with existing anchors', async done => {
    const testStartDate = new Date();
    const jsonAnchor = document.createElement('a') as HTMLAnchorElement;
    const weightDataAnchor = document.createElement('a') as HTMLAnchorElement;
    const downloadTrigger = tf.io.triggerDownloads(
        ['test-model.json', 'test-model-weights.bin'],
        {jsonAnchor, weightDataAnchor, trigger: false});
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

          expect(jsonAnchor.download).toEqual('test-model.json');
          expect(weightDataAnchor.download).toEqual('test-model-weights.bin');

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
            './test-model-weights.bin'
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
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  const singleFileNames: Array<string|string[]> =
      ['test-model-2', ['test-model-2']];
  for (const singleFileName of singleFileNames) {
    it(`One file name, with existing anchors`, async done => {
      const testStartDate = new Date();
      const jsonAnchor = document.createElement('a') as HTMLAnchorElement;
      const weightDataAnchor = document.createElement('a') as HTMLAnchorElement;
      const downloadTrigger = tf.io.triggerDownloads(
          singleFileName, {jsonAnchor, weightDataAnchor, trigger: false});
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

            expect(jsonAnchor.download).toEqual('test-model-2.json');
            expect(weightDataAnchor.download)
                .toEqual('test-model-2.weights.bin');

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
              './test-model-2.weights.bin'
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
          })
          .catch(err => {
            done.fail(err.stack);
          });
    });
  }

  it('No file name provided, with existing anchors', async done => {
    const testStartDate = new Date();
    const jsonAnchor = document.createElement('a') as HTMLAnchorElement;
    const weightDataAnchor = document.createElement('a') as HTMLAnchorElement;
    const downloadTrigger = tf.io.triggerDownloads(
        null, {jsonAnchor, weightDataAnchor, trigger: false});
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

  it('Missing file name throws error', () => {
    expect(() => tf.io.triggerDownloads([])).toThrowError(/File names/);
    expect(() => tf.io.triggerDownloads([
      'name1', 'name2', 'name3'
    ])).toThrowError(/File names/);
  });
});

describe('files', () => {
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

    const filesHandler = tf.io.files([jsonFile, weightsFile]);
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

    const filesHandler = tf.io.files([jsonFile, weightsFile]);
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

  it('Incorrect number of files leads to Error', async done => {
    const weightsBlob =
        new Blob([weightData1], {type: 'application/octet-stream'});
    const file = new File(
        [weightsBlob], 'model.weights.bin', {type: 'application/octet-stream'});

    const filesHandler = tf.io.files([file, file, file]);
    filesHandler.load()
        .then(modelArtifacts => {
          done.fail(
              'Loading with Files IOHandler with incorrect number of files ' +
              'succeeded unexpectedly.');
        })
        .catch(err => {
          expect(err.message)
              .toMatch(/currently supports only loading from 2 files/);
          expect(err.message).toMatch(/but received 3 file\(s\)/);
          done();
        });
  });
});
