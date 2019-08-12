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

import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import {asyncStorageIO, bundleResourceIO} from '@tensorflow/tfjs-react-native';

/**
 * Run a simple operations
 */
export async function simpleOpRunner() {
  return async () => {
    const res = tf.square(3);
    const data = (await res.data())[0];
    return JSON.stringify(data);
  };
}

/**
 * Run a simple precision test runner.
 */
export async function precisionTestRunner() {
  return async () => {
    const res = tf.tidy(() => tf.scalar(2.4).square());
    const data = (await res.data())[0];
    return JSON.stringify(data);
  };
}

/**
 * Runner for a mobilenet model loaded over the network
 */
export async function mobilenetRunner() {
  const model = await mobilenet.load();
  // warmup
  const input = tf.zeros([1, 224, 224, 3]);
  await model.classify(input);

  return async () => {
    const pred = await model.classify(input);
    return JSON.stringify(pred);
  };
}

/**
 * Runner for a model bundled into the app itself.
 */
const modelJson = require('../assets/model/bundleModelTest.json');
const modelWeights = require('../assets/model/bundleModelTest_weights.bin');
export async function localModelRunner() {
  const model =
      await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));

  return async () => {
    const res = model.predict(tf.randomNormal([1, 28, 28, 1])) as tf.Tensor;
    const data = await res.data();
    return JSON.stringify(data);
  };
}

/**
 * Run a simple train loop
 */
export async function trainModelRunner() {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 5, inputShape: [1]}));
  model.add(tf.layers.dense({units: 1}));
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  return async () => {
    // Train the model using the data.
    await model.fit(xs, ys, {epochs: 20});

    return 'done';
  };
}

/**
 * Save and load a model using AsyncStorage
 */
export async function saveModelRunner() {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 5, inputShape: [1]}));
  model.add(tf.layers.dense({units: 1}));
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  return async () => {
    await model.save(asyncStorageIO('custom-model-test'));
    await tf.loadLayersModel(asyncStorageIO('custom-model-test'));

    return 'done';
  };
}
