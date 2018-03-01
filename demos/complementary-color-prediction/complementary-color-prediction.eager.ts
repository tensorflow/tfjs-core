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

import * as dl from 'deeplearn';

interface DataInterface {
  input: number[][];
  target: number[][];
}

class ComplementaryColorModel {
  // An optimizer with a certain learning rate. Used for training.
  learningRate = 0.1;
  optimizer: dl.SGDOptimizer;

  // The entire data set contains this many samples
  sampleSize = 5e3;

  // Each training batch will be on this many examples.
  batchSize = 50;

  // The model will be trained for this many times.
  totalSteps = 500;

  // An array to store the data used for training
  data: DataInterface;

  // Arrays that contains the weight and bias variables for the fully connected layers
  weights: dl.Variable<dl.Rank.R2>[] = [];
  biases: dl.Variable<dl.Rank.R0>[] = [];

  constructor() {
    this.optimizer = dl.train.sgd(this.learningRate);
  }

  /**
   * Constructs the weights and generates data. Call this method before training.
   */
  setupSession(): void {
    // Generate and initialize the weight variables for the fully connected layers
    this.setupModel();
    // Generate the data that will be used to train the model.
    this.generateTrainingData(this.sampleSize);
  }

  /**
   * Constructs the weight variables of the model. Call this method before training with fully connected layers.
   */
  setupModel(): void {
    // Create 3 fully connected layers, each with half the number of nodes of
    // the previous layer. The first one has 64 nodes.
    this.createFullyConnectedLayerWeights(3, 64, 0);

    // Create fully connected layer 1, which has 32 nodes.
    this.createFullyConnectedLayerWeights(64, 32, 1);

    // Create fully connected layer 2, which has 16 nodes.
    this.createFullyConnectedLayerWeights(32, 16, 2);

    // Create fully connected output layer, which has 3 nodes.
    this.createFullyConnectedLayerWeights(16, 3, 3);
  }

  /**
   * Trains one batch for one iteration. Call this method multiple times to
   * progressively train. Calling this function transfers data from the GPU in
   * order to obtain the current loss on training data.
   *
   * If shouldFetchCost is true, returns the mean cost across examples in the
   * batch. Otherwise, returns -1. We should only retrieve the cost now and then
   * because doing so requires transferring data from the GPU.
   */
  train1Batch(step: number, shouldFetchCost: boolean): dl.Scalar {
    // Every 42 steps, lower the learning rate by 15%.
    const learningRate =
      this.learningRate * Math.pow(0.85, Math.floor(step / 42));
    this.optimizer.setLearningRate(learningRate);

    // Train 1 batch.
    let cost: dl.Scalar = null;
    dl.tidy(() => {
      for (let i = 0; i <= this.data.input.length - this.batchSize; i += this.batchSize) {
        const { input, target } = this.data;

        cost = this.optimizer.minimize(() => {
          const prediction = this.predict(input.slice(i, i + this.batchSize));
          return this.loss(prediction, dl.tensor2d(target.slice(i, i + this.batchSize), [this.batchSize, target[0].length]));
        }, shouldFetchCost);
      }
      return cost;
    });
    return cost;
  }

  normalizeColor(rgbColor: number[]): number[] {
    return rgbColor.map(v => v / 255);
  }

  denormalizeColor(normalizedRgbColor: number[]): number[] {
    return normalizedRgbColor.map(v => Math.round(v * 255));
  }
  denormalizeColorTensor(rgbColorTensor: dl.Tensor2D): dl.Tensor2D {
    return rgbColorTensor.mul(dl.scalar(255)).ceil() as dl.Tensor2D;
  };

  clampedColorTensor(normalizedRgbColorTensor: dl.Tensor2D): dl.Tensor2D {
    // Make sure the values are within range.
    return <dl.Tensor2D>normalizedRgbColorTensor
      .minimum(dl.scalar(1))
      .maximum(dl.scalar(0));
  }

  predict(normalizedRgbColor: number[][]) {
    return dl.tidy(() => {
      // This tensor contains the input. In this case, it is a 2D tensor.
      const inputTensor = dl.tensor2d(normalizedRgbColor, [normalizedRgbColor.length, normalizedRgbColor[0].length]);

      // Connect 3 fully connected layers, each with half the number of nodes of
      // the previous layer, and the output layer. The weights were initialized
      // during the model setup.
      let outputTensor = inputTensor;
      for (let layer = 0; layer < this.weights.length; layer++) {
        outputTensor = this.connectFullyConnectedLayer(outputTensor, layer);
      }

      return this.clampedColorTensor(outputTensor);
    });
  }

  denormalizedPredict(rgbcolor: number[]) {
    return dl.tidy(() => {
      return this.denormalizeColorTensor(this.predict([this.normalizeColor(rgbcolor)]));
    });
  }

  private initializeWeights(shape: number[], sizeOfPreviousLayer: number) {
    return dl.randomNormal(shape).mul(dl.scalar(Math.sqrt(2.0 / sizeOfPreviousLayer)));
  }

  private createFullyConnectedLayerWeights(
    sizeOfPreviousLayer: number, sizeOfThisLayer: number,
    layerIndex: number): void {

    const weights: dl.Variable<dl.Rank.R2> = dl.variable(
      this.initializeWeights([sizeOfPreviousLayer, sizeOfThisLayer], sizeOfPreviousLayer),
      true,
      `fully_connected_${layerIndex}_weights`,
    ) as dl.Variable<dl.Rank.R2>;
    this.weights[layerIndex] = weights;

    const bias: dl.Variable<dl.Rank.R0> = dl.variable(dl.scalar(0));
    this.biases[layerIndex] = bias;
  }

  private connectFullyConnectedLayer(
    inputLayer: dl.Tensor2D, layerIndex: number): dl.Tensor2D {
    return inputLayer.matMul(this.weights[layerIndex]).add(this.biases[layerIndex]).relu() as dl.Tensor2D;
  }

  private loss(prediction: dl.Tensor2D, actual: dl.Tensor2D) {
    return prediction.sub(actual).square().mean().mean() as dl.Scalar;
  }

  /**
   * Generates data used to train. Creates a feed entry that will later be used
   * to pass data into the model. Generates `exampleCount` data points.
   */
  private generateTrainingData(exampleCount: number) {
    const rawInputs = new Array(exampleCount);

    for (let i = 0; i < exampleCount; i++) {
      rawInputs[i] = [
        this.generateRandomChannelValue(), this.generateRandomChannelValue(),
        this.generateRandomChannelValue()
      ];
    }

    // Store the data within Tensor1Ds so that learnjs can use it.
    const inputArray: number[][] = rawInputs.map(c => this.normalizeColor(c));
    const targetArray: number[][] = rawInputs.map(c => this.normalizeColor(this.computeComplementaryColor(c)));

    this.data = {input: inputArray, target: targetArray};
  }

  private generateRandomChannelValue() {
    return Math.floor(Math.random() * 256);
  }

  /**
   * This implementation of computing the complementary color came from an
   * answer by Edd https://stackoverflow.com/a/37657940
   */
  computeComplementaryColor(rgbColor: number[]): number[] {
    let r = rgbColor[0];
    let g = rgbColor[1];
    let b = rgbColor[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2.0;
    let s = h;
    const l = h;

    if (max === min) {
      h = s = 0;  // achromatic
    } else {
      const d = max - min;
      s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

      if (max === r && g >= b) {
        h = 1.0472 * (g - b) / d;
      } else if (max === r && g < b) {
        h = 1.0472 * (g - b) / d + 6.2832;
      } else if (max === g) {
        h = 1.0472 * (b - r) / d + 2.0944;
      } else if (max === b) {
        h = 1.0472 * (r - g) / d + 4.1888;
      }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h += 180;
    if (h > 360) {
      h -= 360;
    }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if (s === 0) {
      r = g = b = l;  // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b].map(v => Math.round(v * 255));
  }
}

const complementaryColorModel = new ComplementaryColorModel();

// Create the graph of the model.
complementaryColorModel.setupSession();

// On every frame, we train and then maybe update the UI.
async function trainAndMaybeRender() {
  // We only fetch the cost every 5 steps because doing so requires a transfer
  // of data from the GPU.
  const localStepsToRun = 5;

  let promise;

  for (let step = 1; step <= this.totalSteps; step++) {
    let cost;
    const isMod = step % localStepsToRun === 0;
    cost = complementaryColorModel.train1Batch(step, isMod);

    // Only execute processes that require transfer of data from the GPU
    // if the step count is a multiple of 5
    if (isMod) {
      // Print data to console so the user can inspect.
      console.log('step', step, 'cost', cost.dataSync()[0]);

      // Repaint the predicted complement visualization
      visualizePredictedComplement()
    }

    promise = await dl.nextFrame();
  }
  return promise;
}

function visualizePredictedComplement() {
  // Visualize the predicted complement.
  const colorRows = document.querySelectorAll('tr[data-original-color]');
  for (let i = 0; i < colorRows.length; i++) {
    const rowElement = colorRows[i];
    const tds = rowElement.querySelectorAll('td');
    const originalColor =
      (rowElement.getAttribute('data-original-color') as string)
        .split(',')
        .map(v => parseInt(v, 10));

    // Visualize the predicted color.
    const predictedColor = Array.prototype.slice.call(complementaryColorModel.denormalizedPredict(originalColor).dataSync());
    populateContainerWithColor(
      tds[2], predictedColor[0], predictedColor[1], predictedColor[2]);
  }
}

function populateContainerWithColor(
  container: HTMLElement, r: number, g: number, b: number) {
  const originalColorString = 'rgb(' + [r, g, b].join(',') + ')';
  container.textContent = originalColorString;

  const colorBox = document.createElement('div');
  colorBox.classList.add('color-box');
  colorBox.style.background = originalColorString;
  container.appendChild(colorBox);
}

function initializeUi() {
  const colorRows = document.querySelectorAll('tr[data-original-color]');
  for (let i = 0; i < colorRows.length; i++) {
    const rowElement = colorRows[i];
    const tds = rowElement.querySelectorAll('td');
    const originalColor =
      (rowElement.getAttribute('data-original-color') as string)
        .split(',')
        .map(v => parseInt(v, 10));

    // Visualize the original color.
    populateContainerWithColor(
      tds[0], originalColor[0], originalColor[1], originalColor[2]);

    // Visualize the complementary color.
    const complement =
      complementaryColorModel.computeComplementaryColor(originalColor);
    populateContainerWithColor(
      tds[1], complement[0], complement[1], complement[2]);
  }
}

// Kick off training.
initializeUi();
trainAndMaybeRender().then(() => {
  console.log('Training is done.');
});
