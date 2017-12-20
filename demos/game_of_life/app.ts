/* Copyright 2017 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {NDArray, NDArrayMathGPU} from 'deeplearn';
import Vue from 'vue';

import DemoFooter from '../footer.vue';
import DemoHeader from '../header.vue';

import {GameOfLife, GameOfLifeModel} from './game_of_life';

// /** Shows model training information. */
class TrainDisplay {
  element: Element;
  trainingDataElement: Element;
  canvas: CanvasRenderingContext2D;
  chart: Chart;
  chartData: [ChartData[]];
  chartDataIndex = -1;

  datasets: ChartDataSets[] = [];

  setup(): void {
    this.element = document.querySelector('.train-display');
    this.trainingDataElement = document.querySelector('.data-display');
    // TODO(kreeger): switch to Vue-component for rendering charts?
    // this.canvas = (document.getElementById('myChart') as HTMLCanvasElement)
    //                   .getContext('2d');
    // this.chart = new Chart(this.canvas, {
    //   type: 'line',
    //   data: {
    //     datasets: this.datasets,
    //   },
    //   options: {
    //     animation: {duration: 0},
    //     responsive: false,
    //     scales: {
    //       xAxes: [{type: 'linear', position: 'bottom'}],
    //       // yAxes: [{ticks: {beginAtZero: true}}]
    //     }
    //   }
    // });
  }

  addDataSet(): void {
    if (!this.chartData) {
      this.chartData = [[]];
    } else {
      this.chartData.push([]);
    }
    this.datasets.push({
      data: this.chartData[++this.chartDataIndex],
      fill: false,
      label: 'Cost ' + (this.chartDataIndex + 1),
      pointRadius: 0,
      borderColor: this.randomRGBA(),
      borderWidth: 1,
      lineTension: 0,
      pointHitRadius: 8
    });
  }

  showStep(step: number, steps: number) {
    this.element.innerHTML = 'Trained ' + Math.trunc(step / steps * 100) + '%';
  }

  displayCost(cost: number, step: number) {
    this.chartData[this.chartDataIndex].push({x: step, y: cost});
    // this.chart.update();
  }

  displayTrainingData(length: number, size: number) {
    this.trainingDataElement.innerHTML =
        ' - (Building training data - ' + length + ' of ' + size + ')';
  }

  clearTrainingData(): void {
    this.trainingDataElement.innerHTML = '';
  }

  private randomRGBA(): string {
    const s = 255;
    return 'rgba(' + Math.round(Math.random() * s) + ',' +
        Math.round(Math.random() * s) + ',' + Math.round(Math.random() * s) +
        ',1)';
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
  world: NDArray;
  worldNext: NDArray;
  worldDisplay: WorldDisplay;
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

const math = new NDArrayMathGPU();
const game = new GameOfLife(5, math);
const model = new GameOfLifeModel(math);

let trainingData: Array<[NDArray, NDArray]> = [];
const worldContexts: WorldContext[] = [];

const trainDisplay = new TrainDisplay();

let step = 0;
let trainingSteps = 100;
let trainingBatchSize = 5;

let isBuildingTrainingData = true;

async function trainAndRender() {
  if (step === trainingSteps) {
    // TODO - enable form.
    return;
  }

  requestAnimationFrame(() => trainAndRender());

  if (isBuildingTrainingData) {
    math.scope(async () => {
      // Do 2 examples each pass:
      trainingData.push(await game.generateGolExample());
      if (trainingData.length < trainingBatchSize) {
        trainingData.push(await game.generateGolExample());
      }
    });

    if (trainingBatchSize >= 20) {
      trainDisplay.displayTrainingData(
          trainingData.length + 1, trainingBatchSize);
    }
    if (trainingData.length === trainingBatchSize) {
      isBuildingTrainingData = false;
      trainDisplay.clearTrainingData();
    }
  }

  if (!isBuildingTrainingData) {
    step++;
    // const fetchCost =
    //     step % parseInt(updateIntervalInput.value, 10) === 0;
    const fetchCost = step % 20 === 0;
    const cost = model.trainBatch(fetchCost, trainingData);

    if (fetchCost) {
      trainDisplay.showStep(step, trainingSteps);
      trainDisplay.displayCost(cost, step);

      worldContexts.forEach((worldContext) => {
        worldContext.displayPrediction(model.predict(worldContext.world));
      });
    }

    trainingData = [];
    isBuildingTrainingData = true;
  }
}

// tslint:disable-next-line:no-default-export
export default Vue.extend({
  data() {
    return {};
  },
  components: {DemoHeader, DemoFooter},
  methods: {
    onAddSequenceClicked: async () => {
      console.log('clicked');
      console.log('train clicked', trainDisplay);
      worldContexts.push(new WorldContext(await game.generateGolExample()));
    },

    onTrainModelClicked: async () => {
      // TODO - init things.
      trainAndRender();
    }
  },
  mounted: async () => {
    for (let i = 0; i < 5; i++) {
      worldContexts.push(new WorldContext(await game.generateGolExample()));
    }
    trainDisplay.setup();
  }
});


// /** Main class for running the Game of Life training demo. */
// // tslint:disable-next-line:no-unused-expression
// class Demo {
//   math: NDArrayMathGPU;
//   game: GameOfLife;
//   model: GameOfLifeModel;

//   trainingData: Array<[NDArray, NDArray]>;
//   worldContexts: WorldContext[];

//   trainDisplay: TrainDisplay;
//   worldDisplay: WorldDisplay;

//   boardSizeInput: HTMLTextAreaElement;
//   trainingSizeInput: HTMLTextAreaElement;
//   trainingBatchSizeInput: HTMLTextAreaElement;
//   learningRateInput: HTMLTextAreaElement;
//   updateIntervalInput: HTMLTextAreaElement;
//   numLayersInput: HTMLTextAreaElement;
//   useLoggedCostInput: HTMLInputElement;

//   addSequenceButton: HTMLElement;
//   trainButton: HTMLElement;
//   resetButton: HTMLElement;

//   isBuildingTrainingData: boolean;

//   step: number;
//   trainingSteps: number;
//   trainingBatchSize: number;

//   constructor() {
//     this.math = new NDArrayMathGPU();
//     this.game = new GameOfLife(5, this.math);
//     this.model = new GameOfLifeModel(this.math);

//     this.trainDisplay = new TrainDisplay();
//     this.worldDisplay = new WorldDisplay();

//     this.boardSizeInput =
//         document.getElementById('board-size-input') as HTMLTextAreaElement;
//     this.trainingSizeInput =
//         document.getElementById('training-size-input') as
//         HTMLTextAreaElement;
//     this.trainingBatchSizeInput =
//         document.getElementById('training-batch-size-input') as
//         HTMLTextAreaElement;
//     this.learningRateInput =
//         document.getElementById('learning-rate-input') as
//         HTMLTextAreaElement;
//     this.updateIntervalInput =
//         document.getElementById('update-interval-input') as
//         HTMLTextAreaElement;
//     this.numLayersInput =
//         document.getElementById('num-layers-input') as HTMLTextAreaElement;
//     this.useLoggedCostInput =
//         document.getElementById('use-log-cost-input') as HTMLInputElement;

//     this.addSequenceButton = document.querySelector('.add-sequence-button');
//     this.addSequenceButton.addEventListener(
//         'click', () => this.onAddSequenceButtonClick());

//     this.trainButton = document.querySelector('.train-button');
//     this.trainButton.addEventListener('click', () =>
//     this.onTrainButtonClick());

//     this.resetButton = document.querySelector('.reset-button');
//     this.resetButton.addEventListener('click', () =>
//     this.onResetButtonClick());
//   }

//   async showSampleSequences(): Promise<void> {
//     // Always init with 5 sample world sequences:
//     this.worldContexts = [];
//     for (let i = 0; i < 5; i++) {
//       this.worldContexts.push(
//           new WorldContext(await this.game.generateGolExample()));
//     }
//   }

//   async trainAndRender() {
//     if (this.step === this.trainingSteps) {
//       this.enableForm();
//       return;
//     }

//     requestAnimationFrame(() => this.trainAndRender());

//     if (this.isBuildingTrainingData) {
//       this.math.scope(async () => {
//         // Do 2 examples each pass:
//         this.trainingData.push(await this.game.generateGolExample());
//         if (this.trainingData.length < this.trainingBatchSize) {
//           this.trainingData.push(await this.game.generateGolExample());
//         }
//       });

//       if (this.trainingBatchSize >= 20) {
//         this.trainDisplay.displayTrainingData(
//             this.trainingData.length + 1, this.trainingBatchSize);
//       }
//       if (this.trainingData.length === this.trainingBatchSize) {
//         this.isBuildingTrainingData = false;
//         this.trainDisplay.clearTrainingData();
//       }
//     }

//     if (!this.isBuildingTrainingData) {
//       this.step++;

//       const fetchCost =
//           this.step % parseInt(this.updateIntervalInput.value, 10) === 0;
//       const cost = this.model.trainBatch(fetchCost, this.trainingData);

//       if (fetchCost) {
//         this.trainDisplay.showStep(this.step, this.trainingSteps);
//         this.trainDisplay.displayCost(cost, this.step);

//         this.worldContexts.forEach((worldContext) => {
//           worldContext.displayPrediction(
//               this.model.predict(worldContext.world));
//         });
//       }

//       this.trainingData = [];
//       this.isBuildingTrainingData = true;
//     }
//   }

//   private async onAddSequenceButtonClick(): Promise<void> {
//     this.game.setSize(this.getBoardSize());
//     this.worldContexts.push(
//         new WorldContext(await this.game.generateGolExample()));
//   }

//   private onTrainButtonClick(): void {
//     this.disableForm();

//     const boardSize = this.getBoardSize();
//     const learningRate = parseFloat(this.learningRateInput.value);
//     const trainingSize = parseInt(this.trainingSizeInput.value, 10);
//     const trainingBatchSize = parseInt(this.trainingBatchSizeInput.value,
//     10); const numLayers = parseInt(this.numLayersInput.value, 10);

//     this.game.setSize(boardSize);
//     this.model.setupSession(
//         boardSize, trainingBatchSize, learningRate, numLayers,
//         this.useLoggedCostInput.checked);

//     this.step = 0;
//     this.trainingSteps = trainingSize;
//     this.isBuildingTrainingData = true;
//     this.trainingData = [];
//     this.trainingBatchSize = trainingBatchSize;
//     this.trainDisplay.addDataSet();
//     this.trainAndRender();
//   }

//   private onResetButtonClick(): void {
//     this.worldContexts = [];
//     Demo.clearChildNodes(document.querySelector('.worlds-display'));
//     Demo.clearChildNodes(document.querySelector('.train-display'));
//   }

//   private disableForm(): void {
//     this.trainButton.setAttribute('disabled', 'disabled');
//     this.resetButton.setAttribute('disabled', 'disabled');
//     this.boardSizeInput.setAttribute('disabled', 'disabled');
//     this.learningRateInput.setAttribute('disabled', 'disabled');
//     this.trainingSizeInput.setAttribute('disabled', 'disabled');
//     this.trainingBatchSizeInput.setAttribute('disabled', 'disabled');
//     this.numLayersInput.setAttribute('disabled', 'disabled');
//     this.useLoggedCostInput.setAttribute('disabled', 'disabled');
//   }

//   private enableForm(): void {
//     this.trainButton.removeAttribute('disabled');
//     this.resetButton.removeAttribute('disabled');
//     this.boardSizeInput.removeAttribute('disabled');
//     this.learningRateInput.removeAttribute('disabled');
//     this.trainingSizeInput.removeAttribute('disabled');
//     this.trainingBatchSizeInput.removeAttribute('disabled');
//     this.numLayersInput.removeAttribute('disabled');
//     this.useLoggedCostInput.removeAttribute('disabled');
//   }

//   private getBoardSize(): number {
//     return parseInt(this.boardSizeInput.value, 10);
//   }

//   private static clearChildNodes(node: Element) {
//     while (node.hasChildNodes()) {
//       node.removeChild(node.lastChild);
//     }
//   }
// }
