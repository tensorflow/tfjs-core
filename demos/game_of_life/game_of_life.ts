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
import {Array2D, Graph, InCPUMemoryShuffledInputProviderBuilder, NDArray, NDArrayMathGPU, Session, SGDOptimizer} from 'deeplearn';
import {Tensor} from 'deeplearn/dist/graph/graph';
import {CostReduction, FeedEntry} from 'deeplearn/dist/graph/session';
import {NDArrayMath} from 'deeplearn/dist/math/math';

/** TODO(kreeger): Doc me. */
class GameOfLife {
  math: NDArrayMath;
  size: number;

  constructor(size: number, math: NDArrayMath) {
    this.math = math;
    this.size = size;
  }

  setSize(size: number) {
    this.size = size;
  }

  generateGolExample(): [NDArray, NDArray] {
    const world =
        Array2D.randUniform([this.size - 2, this.size - 2], 0, 2, 'int32');
    const worldPadded = GameOfLife.padArray(world);
    const numNeighbors =
        this.countNeighbors(this.size, worldPadded).getValues();
    const worldValues = world.getValues();
    const nextWorldValues = [];
    for (let i = 0; i < numNeighbors.length; i++) {
      const value = numNeighbors[i];
      let nextVal = 0;
      if (value === 3) {
        // Cell rebirths
        nextVal = 1;
      } else if (value === 2) {
        // Cell survives
        nextVal = worldValues[i];
      } else {
        // Cell dies
        nextVal = 0;
      }
      nextWorldValues.push(nextVal);
    }
    const worldNext = Array2D.new(world.shape, nextWorldValues, 'int32');
    return [worldPadded, GameOfLife.padArray(worldNext)];
  }

  /** Counts total sum of neighbors for a given world. */
  private countNeighbors(size: number, worldPadded: Array2D): Array2D {
    let neighborCount = this.math.add(
        this.math.slice2D(worldPadded, [0, 0], [size - 2, size - 2]),
        this.math.slice2D(worldPadded, [0, 1], [size - 2, size - 2]));
    neighborCount = this.math.add(
        neighborCount,
        this.math.slice2D(worldPadded, [0, 2], [size - 2, size - 2]));
    neighborCount = this.math.add(
        neighborCount,
        this.math.slice2D(worldPadded, [1, 0], [size - 2, size - 2]));
    neighborCount = this.math.add(
        neighborCount,
        this.math.slice2D(worldPadded, [1, 2], [size - 2, size - 2]));
    neighborCount = this.math.add(
        neighborCount,
        this.math.slice2D(worldPadded, [2, 0], [size - 2, size - 2]));
    neighborCount = this.math.add(
        neighborCount,
        this.math.slice2D(worldPadded, [2, 1], [size - 2, size - 2]));
    neighborCount = this.math.add(
        neighborCount,
        this.math.slice2D(worldPadded, [2, 2], [size - 2, size - 2]));
    return neighborCount as Array2D;
  }

  /* Helper method to pad an array until the op is ready. */
  private static padArray(array: NDArray): Array2D<'int32'> {
    const x1 = array.shape[0];
    const x2 = array.shape[1];
    const pad = 1;

    const oldValues = array.getValues();
    const shape = [x1 + pad * 2, x2 + pad * 2];
    const values = [];

    let z = 0;
    for (let i = 0; i < shape[0]; i++) {
      let rangeStart = -1;
      let rangeEnd = -1;
      if (i > 0 && i < shape[0] - 1) {
        rangeStart = i * shape[1] + 1;
        rangeEnd = i * shape[1] + x2;
      }
      for (let j = 0; j < shape[1]; j++) {
        const v = i * shape[0] + j;
        if (v >= rangeStart && v <= rangeEnd) {
          values[v] = oldValues[z++];
        } else {
          values[v] = 0;
        }
      }
    }
    return Array2D.new(shape as [number, number], values, 'int32');
  }
}

/**
 * Main class for running a deep-neural network of training for Game-of-life
 * next sequence.
 */
class GameOfLifeModel {
  session: Session;
  math: NDArrayMath;
  batchSize = 1;

  // An optimizer with a certain initial learning rate. Used for training.
  initialLearningRate = 0.042;
  optimizer: SGDOptimizer;
  // optimizer: AdagradOptimizer;

  inputTensor: Tensor;
  targetTensor: Tensor;
  costTensor: Tensor;
  predictionTensor: Tensor;

  size: number;
  step = 0;

  // Maps tensors to InputProviders
  feedEntries: FeedEntry[];

  game: GameOfLife;

  constructor(game: GameOfLife, math: NDArrayMath) {
    this.math = math;
    this.game = game;
  }

  setupSession(
      boardSize: number, initialLearningRate: number, numLayers: number): void {
    this.optimizer = new SGDOptimizer(this.initialLearningRate);

    this.size = boardSize;
    const graph = new Graph();
    const shape = this.size * this.size;

    this.inputTensor = graph.placeholder('input', [shape]);
    this.targetTensor = graph.placeholder('target', [shape]);

    let hiddenLayer = GameOfLifeModel.createFullyConnectedLayer(
        graph, this.inputTensor, 0, shape);
    for (let i = 1; i < numLayers; i++) {
      hiddenLayer = GameOfLifeModel.createFullyConnectedLayer(
          graph, hiddenLayer, i, shape);
    }

    this.predictionTensor = hiddenLayer;

    this.costTensor =
        graph.meanSquaredCost(this.targetTensor, this.predictionTensor);
    this.session = new Session(graph, this.math);
  }

  trainBatch(shouldFetchCost: boolean): number {
    this.generateTrainingData();
    // Every 42 steps, lower the learning rate by 15%.
    const learningRate = this.initialLearningRate *
        Math.pow(0.85, Math.floor(this.step++ / 100));
    this.optimizer.setLearningRate(learningRate);
    let costValue = -1;
    this.math.scope(() => {
      const cost = this.session.train(
          this.costTensor, this.feedEntries, this.batchSize, this.optimizer,
          shouldFetchCost ? CostReduction.MEAN : CostReduction.NONE);

      if (!shouldFetchCost) {
        return;
      }
      costValue = cost.get();
    });
    return costValue;
  }

  predict(world: NDArray): Array2D {
    let values = null;
    this.math.scope((keep, track) => {
      const mapping = [{
        tensor: this.inputTensor,
        data: world.reshape([this.size * this.size])
      }];

      const evalOutput = this.session.eval(this.predictionTensor, mapping);
      values = evalOutput.getValues();
    });
    return Array2D.new([this.size, this.size], values);
  }

  private generateTrainingData(): void {
    this.math.scope(() => {
      const inputs = [];
      const outputs = [];
      for (let i = 0; i < this.batchSize; i++) {
        const example = this.game.generateGolExample();
        inputs.push(example[0].reshape([this.size * this.size]));
        outputs.push(example[1].reshape([this.size * this.size]));
      }

      // TODO(kreeger): Don't really need to shuffle these.
      const inputProviderBuilder =
          new InCPUMemoryShuffledInputProviderBuilder([inputs, outputs]);
      const [inputProvider, targetProvider] =
          inputProviderBuilder.getInputProviders();

      this.feedEntries = [
        {tensor: this.inputTensor, data: inputProvider},
        {tensor: this.targetTensor, data: targetProvider}
      ];
    });
  }

  /* Helper method for creating a fully connected layer. */
  private static createFullyConnectedLayer(
      graph: Graph, inputLayer: Tensor, layerIndex: number,
      sizeOfThisLayer: number, includeRelu = true, includeBias = true): Tensor {
    return graph.layers.dense(
        'fully_connected_' + layerIndex, inputLayer, sizeOfThisLayer,
        includeRelu ? (x) => graph.relu(x) : undefined, includeBias);
  }
}

/* Draws Game Of Life sequences */
class WorldDisplay {
  rootElement: Element;

  constructor() {
    this.rootElement = document.createElement('div');
    this.rootElement.setAttribute('class', 'world-display');

    document.querySelector('.worlds-display').appendChild(this.rootElement);
  }

  displayWorld(world: NDArray, title: string): Element {
    const worldElement = document.createElement('div');
    worldElement.setAttribute('class', 'world');

    const titleElement = document.createElement('div');
    titleElement.setAttribute('class', 'title');
    titleElement.innerText = title;
    worldElement.appendChild(titleElement);

    const boardElement = document.createElement('div');
    boardElement.setAttribute('class', 'board');

    for (let i = 0; i < world.shape[0]; i++) {
      const rowElement = document.createElement('div');
      rowElement.setAttribute('class', 'row');

      for (let j = 0; j < world.shape[1]; j++) {
        const columnElement = document.createElement('div');
        columnElement.setAttribute('class', 'column');
        if (world.get(i, j) === 1) {
          columnElement.classList.add('alive');
        } else {
          columnElement.classList.add('dead');
        }
        rowElement.appendChild(columnElement);
      }
      boardElement.appendChild(rowElement);
    }

    worldElement.appendChild(boardElement);
    this.rootElement.appendChild(worldElement);
    return worldElement;
  }
}

class WorldContext {
  worldDisplay: WorldDisplay;
  world: NDArray;
  worldNext: NDArray;
  predictionElement: Element = null;

  constructor(worlds: [NDArray, NDArray]) {
    this.worldDisplay = new WorldDisplay();

    this.world = worlds[0];
    this.worldNext = worlds[1];
    this.worldDisplay.displayWorld(this.world, 'Sequence');
    this.worldDisplay.displayWorld(this.worldNext, 'Next Sequence');
  }

  displayPrediction(prediction: NDArray) {
    if (this.predictionElement) {
      this.predictionElement.remove();
    }
    this.predictionElement =
        this.worldDisplay.displayWorld(prediction, 'Prediction');
  }
}

class TrainDisplay {
  element: Element;
  canvas: CanvasRenderingContext2D;
  chart: Chart;
  chartData: ChartData[] = [];

  constructor() {
    this.element = document.querySelector('.train-display');
    this.canvas = (document.getElementById('myChart') as HTMLCanvasElement)
                      .getContext('2d');
    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        datasets: [{
          data: this.chartData,
          fill: false,
          label: 'Model Training Cost',
          pointRadius: 0,
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          lineTension: 0,
          pointHitRadius: 8
        }]
      },
      options: {
        // animation: {duration: 0},
        responsive: false,
        scales: {xAxes: [{type: 'linear', position: 'bottom'}], yAxes: [{}]}
      }
    });
  }

  showStep(step: number, steps: number) {
    this.element.innerHTML = 'Trained ' + Math.trunc(step / steps * 100) + '%';
  }

  displayCost(cost: number, step: number) {
    this.chartData.push({x: step, y: cost * 100});
    this.chart.update();
  }
}

// Setup game
const math = new NDArrayMathGPU();
const game = new GameOfLife(5, math);
const model = new GameOfLifeModel(game, math);

// Helper classes for displaying worlds and training data:
const trainDisplay = new TrainDisplay();

// List of worlds + display contexts.
let worldContexts: WorldContext[] = [];

const boardSizeInput =
    document.getElementById('board-size-input') as HTMLTextAreaElement;
const trainingSizeInput =
    document.getElementById('training-size-input') as HTMLTextAreaElement;
const learningRateInput =
    document.getElementById('learning-rate-input') as HTMLTextAreaElement;
const numLayersInput =
    document.getElementById('num-layers-input') as HTMLTextAreaElement;
const addSequenceButton = document.querySelector('.add-sequence-button');
const trainButton = document.querySelector('.train-button');
const predictButton = document.querySelector('.predict-button');
const resetButton = document.querySelector('.reset-button');

function getBoardSize() {
  return parseInt(boardSizeInput.value, 10);
}

function clearChildNodes(node: Element) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

let step = 0;
let trainLength = 0;
function trainAndRender() {
  if (step === trainLength) {
    trainButton.removeAttribute('disabled');
    resetButton.removeAttribute('disabled');
    boardSizeInput.removeAttribute('disabled');
    learningRateInput.removeAttribute('disabled');
    trainingSizeInput.removeAttribute('disabled');
    numLayersInput.removeAttribute('disabled');
    return;
  }

  requestAnimationFrame(trainAndRender);
  step++;

  const fetchCost = step % 50 === 0;
  const cost = model.trainBatch(fetchCost);

  if (fetchCost) {
    trainDisplay.showStep(step, trainLength);
    trainDisplay.displayCost(cost, step);
  }
}

addSequenceButton.addEventListener('click', () => {
  game.setSize(getBoardSize());
  worldContexts.push(new WorldContext(game.generateGolExample()));
});

trainButton.addEventListener('click', () => {
  trainButton.setAttribute('disabled', 'disabled');
  resetButton.setAttribute('disabled', 'disabled');
  boardSizeInput.setAttribute('disabled', 'disabled');
  learningRateInput.setAttribute('disabled', 'disabled');
  trainingSizeInput.setAttribute('disabled', 'disabled');
  numLayersInput.setAttribute('disabled', 'disabled');

  const boardSize = getBoardSize();
  const learningRate = parseFloat(learningRateInput.value);
  const trainingSize = parseInt(trainingSizeInput.value, 10);
  const numLayers = parseInt(numLayersInput.value, 10);

  game.setSize(boardSize);
  model.setupSession(boardSize, learningRate, numLayers);

  step = 0;
  trainLength = trainingSize;
  trainAndRender();
});

predictButton.addEventListener('click', () => {
  worldContexts.forEach((worldContext) => {
    worldContext.displayPrediction(model.predict(worldContext.world));
  });
});

resetButton.addEventListener('click', () => {
  worldContexts = [];
  clearChildNodes(document.querySelector('.worlds-display'));
  clearChildNodes(document.querySelector('.train-display'));
});
