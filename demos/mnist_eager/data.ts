import * as dl from 'deeplearn';

const TRAIN_TEST_RATIO = 5 / 6;

const mnistConfig: dl.XhrDatasetConfig = {
  'data': [
    {
      'name': 'images',
      'path': 'https://storage.googleapis.com/learnjs-data/model-builder/' +
          'mnist_images.png',
      'dataType': 'png',
      'shape': [28, 28, 1]
    },
    {
      'name': 'labels',
      'path': 'https://storage.googleapis.com/learnjs-data/model-builder/' +
          'mnist_labels_uint8',
      'dataType': 'uint8',
      'shape': [10]
    }
  ],
  modelConfigs: {}
};

export class MnistData {
  private dataset: dl.XhrDataset;
  private trainingData: dl.Tensor[][];
  private testData: dl.Tensor[][];
  private trainIndices: Uint32Array;
  private testIndices: Uint32Array;

  private shuffledTrainIndex = 0;
  private shuffledTestIndex = 0;

  public nextTrainBatch(batchSize: number):
      {xs: dl.Tensor2D, labels: dl.Tensor2D} {
    return this.nextBatch(batchSize, this.trainingData, () => {
      this.shuffledTrainIndex =
          (this.shuffledTrainIndex + 1) % this.trainIndices.length;
      return this.trainIndices[this.shuffledTrainIndex];
    });
  }

  public nextTestBatch(batchSize: number):
      {xs: dl.Tensor2D, labels: dl.Tensor2D} {
    return this.nextBatch(batchSize, this.testData, () => {
      this.shuffledTestIndex =
          (this.shuffledTestIndex + 1) % this.testIndices.length;
      return this.testIndices[this.shuffledTestIndex];
    });
  }

  private nextBatch(
      batchSize: number, data: dl.Tensor[][],
      index: () => number): {xs: dl.Tensor2D, labels: dl.Tensor2D} {
    const xSize = data[0][0].size;
    const xs = dl.zeros<dl.Rank.R2>([batchSize, xSize], 'float32');
    const xsVals = xs.dataSync();

    const labelSize = data[1][0].size;
    const labels = dl.zeros<dl.Rank.R2>([batchSize, labelSize], 'float32');
    const labelsVals = labels.dataSync();

    for (let i = 0; i < batchSize; i++) {
      const idx = index();

      const xVals = data[0][idx].dataSync();
      xsVals.set(xVals, i * xSize);

      const labelVals = data[1][idx].dataSync();
      labelsVals.set(labelVals, i * labelSize);
    }
    return {xs, labels};
  }

  public reset() {
    this.shuffledTrainIndex = 0;
    this.shuffledTestIndex = 0;
  }

  public async load() {
    this.dataset = new dl.XhrDataset(mnistConfig);
    await this.dataset.fetchData();
    this.dataset.normalizeWithinBounds(0, -1, 1);
    this.trainingData = this.getTrainingData();
    this.testData = this.getTestData();
    this.trainIndices =
        dl.util.createShuffledIndices(this.trainingData[0].length);
    this.testIndices = dl.util.createShuffledIndices(this.testData[0].length);
  }

  private getTrainingData(): dl.Tensor[][] {
    const [images, labels] =
        this.dataset.getData() as [dl.Tensor[], dl.Tensor[]];

    const end = Math.floor(TRAIN_TEST_RATIO * images.length);
    return [images.slice(0, end), labels.slice(0, end)];
  }

  private getTestData(): dl.Tensor[][] {
    const data = this.dataset.getData();
    if (data == null) {
      return null;
    }
    const [images, labels] =
        this.dataset.getData() as [dl.Tensor[], dl.Tensor[]];

    const start = Math.floor(TRAIN_TEST_RATIO * images.length);

    return [images.slice(start), labels.slice(start)];
  }
}
