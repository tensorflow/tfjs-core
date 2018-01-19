/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

// tslint:disable-next-line:max-line-length
import {Array2D, Array3D, ENV, NDArray, NDArrayMath, Scalar} from 'deeplearn';

import * as nn_art_util from './nn_art_util';

const MAX_LAYERS = 10;

export type ActivationFunction = 'tanh'|'sin'|'relu'|'step';
const activationFunctionMap: {
  [activationFunction in ActivationFunction]: (
      math: NDArrayMath, ndarray: Array2D) => Array2D
} = {
  'tanh': (math: NDArrayMath, ndarray: Array2D) => math.tanh(ndarray),
  'sin': (math: NDArrayMath, ndarray: Array2D) => math.sin(ndarray),
  'relu': (math: NDArrayMath, ndarray: Array2D) => math.relu(ndarray),
  'step': (math: NDArrayMath, ndarray: Array2D) => math.step(ndarray)
};

const NUM_IMAGE_SPACE_VARIABLES = 3;  // x, y, r
const NUM_LATENT_VARIABLES = 2;

export class CPPN {
  private inputAtlas: Array2D;
  private ones: Array2D<'float32'>;

  private firstLayerWeights: Array2D;
  private intermediateWeights: Array2D[] = [];
  private lastLayerWeights: Array2D;

  private z1Counter = 0;
  private z2Counter = 0;
  private z1Scale: number;
  private z2Scale: number;
  private numLayers: number;

  private selectedActivationFunctionName: ActivationFunction;

  private isInferring = false;

  constructor(private inferenceCanvas: HTMLCanvasElement) {
    const canvasSize = 128;
    this.inferenceCanvas.width = canvasSize;
    this.inferenceCanvas.height = canvasSize;

    this.inputAtlas = nn_art_util.createInputAtlas(
        canvasSize, NUM_IMAGE_SPACE_VARIABLES, NUM_LATENT_VARIABLES);
    this.ones = Array2D.ones([this.inputAtlas.shape[0], 1]);
  }

  generateWeights(neuronsPerLayer: number, weightsStdev: number) {
    for (let i = 0; i < this.intermediateWeights.length; i++) {
      this.intermediateWeights[i].dispose();
    }
    this.intermediateWeights = [];
    if (this.firstLayerWeights != null) {
      this.firstLayerWeights.dispose();
    }
    if (this.lastLayerWeights != null) {
      this.lastLayerWeights.dispose();
    }

    this.firstLayerWeights = Array2D.randTruncatedNormal(
        [NUM_IMAGE_SPACE_VARIABLES + NUM_LATENT_VARIABLES, neuronsPerLayer], 0,
        weightsStdev);
    for (let i = 0; i < MAX_LAYERS; i++) {
      this.intermediateWeights.push(Array2D.randTruncatedNormal(
          [neuronsPerLayer, neuronsPerLayer], 0, weightsStdev));
    }
    this.lastLayerWeights = Array2D.randTruncatedNormal(
        [neuronsPerLayer, 3 /** max output channels */], 0, weightsStdev);
  }

  setActivationFunction(activationFunction: ActivationFunction) {
    this.selectedActivationFunctionName = activationFunction;
  }

  setNumLayers(numLayers: number) {
    this.numLayers = numLayers;
  }

  setZ1Scale(z1Scale: number) {
    this.z1Scale = z1Scale;
  }

  setZ2Scale(z2Scale: number) {
    this.z2Scale = z2Scale;
  }

  start() {
    this.isInferring = true;
    this.runInferenceLoop();
  }

  private async runInferenceLoop() {
    const math = ENV.math;

    if (!this.isInferring) {
      return;
    }

    this.z1Counter += 1 / this.z1Scale;
    this.z2Counter += 1 / this.z2Scale;

    await math.scope(async () => {
      const concatAxis = 1;
      const z1 = Scalar.new(Math.sin(this.z1Counter));
      const z2 = Scalar.new(Math.cos(this.z2Counter));
      const latentVars = math.concat2D(
          math.multiply(z1, this.ones) as Array2D,
          math.multiply(z2, this.ones) as Array2D, concatAxis);

      let lastOutput: NDArray =
          math.concat2D(this.inputAtlas, latentVars, concatAxis);
      lastOutput = activationFunctionMap[this.selectedActivationFunctionName](
          math, math.matMul(lastOutput as Array2D, this.firstLayerWeights));

      for (let i = 0; i < this.numLayers; i++) {
        const matmulResult =
            math.matMul(lastOutput as Array2D, this.intermediateWeights[i]);

        lastOutput = activationFunctionMap[this.selectedActivationFunctionName](
            math, matmulResult)
      }

      lastOutput =
          math.sigmoid(
                  math.matMul(lastOutput as Array2D, this.lastLayerWeights))
              .reshape(
                  [this.inferenceCanvas.height, this.inferenceCanvas.width, 3]);

      await renderToCanvas(lastOutput as Array3D, this.inferenceCanvas);
    });

    requestAnimationFrame(() => this.runInferenceLoop());
  }

  stopInferenceLoop() {
    this.isInferring = false;
  }
}

// TODO(nsthorat): Move this to a core library util.
async function renderToCanvas(a: Array3D, canvas: HTMLCanvasElement) {
  const [height, width, ] = a.shape;
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = await a.data();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;
    imageData.data[j + 0] = Math.round(255 * data[k + 0]);
    imageData.data[j + 1] = Math.round(255 * data[k + 1]);
    imageData.data[j + 2] = Math.round(255 * data[k + 2]);
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}
