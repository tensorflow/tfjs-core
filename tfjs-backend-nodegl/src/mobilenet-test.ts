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

// TODO(kreeger): Do not ship this file.
import nodegl = require('./index');

import { readFileSync } from 'fs';

import * as tf from '@tensorflow/tfjs';
import * as jpeg from 'jpeg-js';
import { Timer } from 'node-simple-timer';

const NUMBER_OF_CHANNELS = 3
const GOOGLE_CLOUD_STORAGE_DIR =
  'https://storage.googleapis.com/tfjs-models/savedmodel/';
const MODEL_FILE_URL = 'mobilenet_v1_1.0_224/model.json';
const PREPROCESS_DIVISOR = tf.scalar(255 / 2);

function readImageAsJpeg(path: string): jpeg.RawImageData<Uint8Array> {
  return jpeg.decode(readFileSync(path), true);
}

function imageByteArray(image: jpeg.RawImageData<Uint8Array>, numChannels: number): Int32Array {
  const pixels = image.data;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);
  for (let i = 0; i < numPixels; i++) {
    for (let j = 0; j < numChannels; j++) {
      values[i * numChannels + j] = pixels[i * 4 + j];
    }
  }
  return values;
}

function imageToInput(image: jpeg.RawImageData<Uint8Array>, numChannels: number): tf.Tensor {
  const values = imageByteArray(image, numChannels);
  const outShape = [1, image.height, image.width, numChannels] as [number, number, number, number];
  const input = tf.tensor4d(values, outShape, 'float32');
  return tf.div(tf.sub(input, PREPROCESS_DIVISOR), PREPROCESS_DIVISOR);
}

async function loadModel() {
  return await tf.loadGraphModel(GOOGLE_CLOUD_STORAGE_DIR + MODEL_FILE_URL);
}

async function result(model: tf.GraphModel, input: tf.Tensor) {
  const r = tf.tidy(() => {
    return model.predict(input) as tf.Tensor;
  });
  return r.dataSync();
}

async function benchmark(path: string) {
  console.log(`  - gl.VERSION: ${nodegl.context.gl.getParameter(nodegl.context.gl.VERSION)}`);
  console.log(`  - gl.RENDERER: ${nodegl.context.gl.getParameter(nodegl.context.gl.RENDERER)}`);

  console.log(`  - Loading image: ${path}`)
  const image = readImageAsJpeg(path);
  const input = imageToInput(image, NUMBER_OF_CHANNELS);
  const timer = new Timer();

  console.log('  - Loading model...')
  const model = await loadModel();

  timer.start();
  console.log('  - Coldstarting model...')
  await result(model, input);
  timer.end();

  console.log(`  - Mobilenet cold start: ${timer.milliseconds()}ms`);

  const times = 100;
  let totalMs = 0;
  console.log(`  - Running inference (${times}x) ...`);
  for (let i = 0; i < times; i++) {
    timer.start();
    await result(model, input);
    timer.end();

    totalMs += timer.milliseconds();
  }

  console.log(`  - Mobilenet inference: (${times}x) : ${(totalMs / times)}ms`);
}

if (process.argv.length !== 3) throw new Error(
  'incorrect arguments: node mobilenet_node.js <IMAGE_FILE>');

benchmark(process.argv[2]);
