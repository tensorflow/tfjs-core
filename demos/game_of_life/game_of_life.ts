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
import {AdagradOptimizer, Array2D, CostReduction, FeedEntry, Graph, InCPUMemoryShuffledInputProviderBuilder, NDArray, NDArrayMath, NDArrayMathGPU, Session, Tensor} from 'deeplearn';

/** Generates GameOfLife sequence pairs (current sequence + next sequence) */
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

  async generateGolExample(): Promise<[NDArray, NDArray]> {
    const world =
        Array2D.randUniform([this.size - 2, this.size - 2], 0, 2, 'int32');
    const worldPadded = GameOfLife.padArray(world);
    // TODO(kreeger): This logic can be vectorized and kept on the GPU with a
    // logical_or() and where() implementations.
    const numNeighbors =
        this.countNeighbors(this.size, worldPadded).getValues();
    const worldValues = await world.data();
    // const worldValues = world.getValues();
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
  // TODO(kreeger): Drop this when math.pad() is ready.
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

  // An optimizer with a certain initial learning rate. Used for training.
  initialLearningRate = 0.042;
  optimizer: AdagradOptimizer;

  inputTensor: Tensor;
  targetTensor: Tensor;
  costTensor: Tensor;
  predictionTensor: Tensor;

  size: number;
  batchSize: number;
  step = 0;

  // Maps tensors to InputProviders
  feedEntries: FeedEntry[];

  constructor(math: NDArrayMath) {
    this.math = math;
  }

  setupSession(
      boardSize: number, batchSize: number, initialLearningRate: number,
      numLayers: number): void {
    this.optimizer = new AdagradOptimizer(1.0);

    this.size = boardSize;
    this.batchSize = batchSize;
    const graph = new Graph();
    const shape = this.size * this.size;

    this.inputTensor = graph.placeholder('input', [shape]);
    this.targetTensor = graph.placeholder('target', [shape]);

    let hiddenLayer = GameOfLifeModel.createFullyConnectedLayer(
        graph, this.inputTensor, 0, shape);
    for (let i = 1; i < numLayers; i++) {
      // Last layer will use a sigmoid:
      hiddenLayer = GameOfLifeModel.createFullyConnectedLayer(
          graph, hiddenLayer, i, shape, i < numLayers - 1);
    }

    this.predictionTensor = hiddenLayer;

    // Log-cost for more accuracy?
    this.costTensor =
        graph.meanSquaredCost(this.targetTensor, this.predictionTensor);
    this.session = new Session(graph, this.math);
  }

  trainBatch(fetchCost: boolean, worlds: Array<[NDArray, NDArray]>): number {
    this.setTrainingData(worlds);

    let costValue = -1;
    this.math.scope(() => {
      const cost = this.session.train(
          this.costTensor, this.feedEntries, this.batchSize, this.optimizer,
          fetchCost ? CostReduction.MEAN : CostReduction.NONE);
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

  private setTrainingData(worlds: Array<[NDArray, NDArray]>): void {
    this.math.scope(() => {
      const inputs = [];
      const outputs = [];
      for (let i = 0; i < worlds.length; i++) {
        // const example = this.game.generateGolExample();
        const example = worlds[i];
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
        includeRelu ? (x) => graph.relu(x) : (x) => graph.sigmoid(x),
        includeBias);
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

/** Manages displaying a list of world sequences (current, next, prediction) */
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

/** Shows model training information. */
class TrainDisplay {
  element: Element;
  trainingDataElement: Element;
  canvas: CanvasRenderingContext2D;
  chart: Chart;
  chartData: ChartData[] = [];

  constructor() {
    this.element = document.querySelector('.train-display');
    this.trainingDataElement = document.querySelector('.data-display');
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
          borderColor: 'rgba(256,0,0,1)',
          borderWidth: 1,
          lineTension: 0,
          pointHitRadius: 8
        }]
      },
      options: {
        animation: {duration: 0},
        responsive: false,
        scales: {
          xAxes: [{type: 'linear', position: 'bottom'}],
          // yAxes: [{ticks: {beginAtZero: true}}]
        }
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

  displayTrainingData(length: number, size: number) {
    this.trainingDataElement.innerHTML =
        'Building training data - ' + length + ' of ' + size;
  }
}

/** Main class for running the Game of Life training demo. */
class Demo {
  math: NDArrayMathGPU;
  game: GameOfLife;
  model: GameOfLifeModel;

  trainingData: Array<[NDArray, NDArray]>;
  worldContexts: WorldContext[];

  trainDisplay: TrainDisplay;
  worldDisplay: WorldDisplay;

  boardSizeInput: HTMLTextAreaElement;
  trainingSizeInput: HTMLTextAreaElement;
  trainingBatchSizeInput: HTMLTextAreaElement;
  learningRateInput: HTMLTextAreaElement;
  numLayersInput: HTMLTextAreaElement;

  addSequenceButton: HTMLElement;
  trainButton: HTMLElement;
  resetButton: HTMLElement;

  isBuildingTrainingData: boolean;

  step: number;
  trainingSteps: number;
  trainingBatchSize: number;

  constructor() {
    this.math = new NDArrayMathGPU();
    this.game = new GameOfLife(5, this.math);
    this.model = new GameOfLifeModel(this.math);

    this.trainDisplay = new TrainDisplay();
    this.worldDisplay = new WorldDisplay();

    this.boardSizeInput =
        document.getElementById('board-size-input') as HTMLTextAreaElement;
    this.trainingSizeInput =
        document.getElementById('training-size-input') as HTMLTextAreaElement;
    this.trainingBatchSizeInput =
        document.getElementById('training-batch-size-input') as
        HTMLTextAreaElement;
    this.learningRateInput =
        document.getElementById('learning-rate-input') as HTMLTextAreaElement;
    this.numLayersInput =
        document.getElementById('num-layers-input') as HTMLTextAreaElement;

    this.addSequenceButton = document.querySelector('.add-sequence-button');
    this.addSequenceButton.addEventListener(
        'click', () => this.onAddSequenceButtonClick());

    this.trainButton = document.querySelector('.train-button');
    this.trainButton.addEventListener('click', () => this.onTrainButtonClick());

    this.resetButton = document.querySelector('.reset-button');
    this.resetButton.addEventListener('click', () => this.onResetButtonClick());
  }

  async showSampleSequences(): Promise<void> {
    // Always init with 3 sample world sequences:
    this.worldContexts = [];
    for (let i = 0; i < 3; i++) {
      this.worldContexts.push(
          new WorldContext(await this.game.generateGolExample()));
    }
  }

  async trainAndRender() {
    if (this.step === this.trainingSteps) {
      this.enableForm();
      return;
    }

    requestAnimationFrame(() => this.trainAndRender());

    if (this.isBuildingTrainingData) {
      this.math.scope(async () => {
        this.trainingData.push(await this.game.generateGolExample());
      });
      this.trainDisplay.displayTrainingData(
          this.trainingData.length, this.trainingBatchSize);
      if (this.trainingData.length === this.trainingBatchSize) {
        this.isBuildingTrainingData = false;
      }
    }

    if (!this.isBuildingTrainingData) {
      this.step++;

      const fetchCost = this.step % 1 === 0;
      const cost = this.model.trainBatch(fetchCost, this.trainingData);

      if (fetchCost) {
        this.trainDisplay.showStep(this.step, this.trainingSteps);
        this.trainDisplay.displayCost(cost, this.step);

        this.worldContexts.forEach((worldContext) => {
          worldContext.displayPrediction(
              this.model.predict(worldContext.world));
        });
      }

      this.trainingData = [];
      this.isBuildingTrainingData = true;
    }
  }

  private async onAddSequenceButtonClick(): Promise<void> {
    this.game.setSize(this.getBoardSize());
    this.worldContexts.push(
        new WorldContext(await this.game.generateGolExample()));
  }

  private onTrainButtonClick(): void {
    this.disableForm();

    const boardSize = this.getBoardSize();
    const learningRate = parseFloat(this.learningRateInput.value);
    const trainingSize = parseInt(this.trainingSizeInput.value, 10);
    const trainingBatchSize = parseInt(this.trainingBatchSizeInput.value, 10);
    const numLayers = parseInt(this.numLayersInput.value, 10);

    this.game.setSize(boardSize);
    this.model.setupSession(
        boardSize, trainingBatchSize, learningRate, numLayers);

    this.step = 0;
    this.trainingSteps = trainingSize;
    this.isBuildingTrainingData = true;
    this.trainingData = [];
    this.trainingBatchSize = trainingBatchSize;
    this.trainAndRender();
  }

  private onResetButtonClick(): void {
    this.worldContexts = [];
    Demo.clearChildNodes(document.querySelector('.worlds-display'));
    Demo.clearChildNodes(document.querySelector('.train-display'));
  }

  private disableForm(): void {
    this.trainButton.setAttribute('disabled', 'disabled');
    this.resetButton.setAttribute('disabled', 'disabled');
    this.boardSizeInput.setAttribute('disabled', 'disabled');
    this.learningRateInput.setAttribute('disabled', 'disabled');
    this.trainingSizeInput.setAttribute('disabled', 'disabled');
    this.trainingBatchSizeInput.setAttribute('disabled', 'disabled');
    this.numLayersInput.setAttribute('disabled', 'disabled');
  }

  private enableForm(): void {
    this.trainButton.removeAttribute('disabled');
    this.resetButton.removeAttribute('disabled');
    this.boardSizeInput.removeAttribute('disabled');
    this.learningRateInput.removeAttribute('disabled');
    this.trainingSizeInput.removeAttribute('disabled');
    this.trainingBatchSizeInput.removeAttribute('disabled');
    this.numLayersInput.removeAttribute('disabled');
  }

  private getBoardSize(): number {
    return parseInt(this.boardSizeInput.value, 10);
  }

  private static clearChildNodes(node: Element) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }
}

new Demo().showSampleSequences();
