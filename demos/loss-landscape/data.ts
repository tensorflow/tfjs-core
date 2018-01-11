import * as dl from 'deeplearn';

const math = dl.ENV.math;

const TRAIN_TEST_RATIO = 5 / 6;

const mnistConfig: dl.XhrDatasetConfig = {
  'data': [
    {
      'name': 'images',
      'path': 'mnist_images.png',
      'dataType': 'png',
      'shape': [28, 28, 1]
    },
    {
      'name': 'labels',
      'path': 'mnist_labels_uint8',
      'dataType': 'uint8',
      'shape': [10]
    }
  ],
  modelConfigs: {}
};

export class MnistData {
  private dataset: dl.XhrDataset;
  private trainingData: dl.NDArray[][];
  private testData: dl.NDArray[][];
  private trainIndices: Uint32Array;
  private testIndices: Uint32Array;

  private shuffledTrainIndex = 0;
  private shuffledTestIndex = 0;

  public nextTrainBatch(batchSize: number):
      {xs: dl.Array2D<'float32'>, labels: dl.Array2D<'float32'>} {
    return this.nextBatch(batchSize, this.trainingData, () => {
      this.shuffledTrainIndex =
          (this.shuffledTrainIndex + 1) % this.trainIndices.length;
      return this.trainIndices[this.shuffledTrainIndex];
    });
  }

  public nextTestBatch(batchSize: number):
      {xs: dl.Array2D<'float32'>, labels: dl.Array2D<'float32'>} {
    return this.nextBatch(batchSize, this.testData, () => {
      this.shuffledTestIndex =
          (this.shuffledTestIndex + 1) % this.testIndices.length;
      return this.testIndices[this.shuffledTestIndex];
    });
  }

  private nextBatch(
      batchSize: number, data: dl.NDArray[][], index: () => number):
      {xs: dl.Array2D<'float32'>, labels: dl.Array2D<'float32'>} {
    const [xs, labels] = math.scope(() => {
      let xs: dl.Array2D<'float32'> = null;
      let labels: dl.Array2D<'float32'> = null;

      for (let i = 0; i < batchSize; i++) {
        const idx = index();

        const x = dl.Array2D.like(
            data[0][idx].reshape([1, 784]) as dl.Array2D<'float32'>);
        if (xs == null) {
          xs = x;
        } else {
          xs = math.concat2D(xs, x, 0) as dl.Array2D<'float32'>;
        }
        const label = dl.Array2D.like(
            data[1][idx].reshape([1, 10]) as dl.Array2D<'float32'>);
        if (labels == null) {
          labels = label;
        } else {
          labels = math.concat2D(labels, label, 0) as dl.Array2D<'float32'>;
        }
      }
      return [xs, labels];
    });
    return {xs, labels};
  }

  public async load() {
    this.dataset = new dl.XhrDataset(mnistConfig);
    console.log('num arrays before fetch data', math.getNumArrays());
    await this.dataset.fetchData();
    console.log('num arrays before normalize', math.getNumArrays());
    this.dataset.normalizeWithinBounds(0, -1, 1);
    console.log('num arrays before getTraining', math.getNumArrays());
    this.trainingData = this.getTrainingData();
    console.log('num arrays before getTest', math.getNumArrays());
    this.testData = this.getTestData();
    console.log('num arrays after getTest', math.getNumArrays());

    this.trainIndices =
        dl.util.createShuffledIndices(this.trainingData[0].length);
    this.testIndices = dl.util.createShuffledIndices(this.testData[0].length);
  }

  private getTrainingData(): dl.NDArray[][] {
    const [images, labels] =
        this.dataset.getData() as [dl.NDArray[], dl.NDArray[]];

    const end = Math.floor(TRAIN_TEST_RATIO * images.length);
    return [images.slice(0, end), labels.slice(0, end)];
  }

  private getTestData(): dl.NDArray[][] {
    const data = this.dataset.getData();
    if (data == null) {
      return null;
    }
    const [images, labels] =
        this.dataset.getData() as [dl.NDArray[], dl.NDArray[]];

    const start = Math.floor(TRAIN_TEST_RATIO * images.length);

    return [images.slice(start), labels.slice(start)];
  }
}
