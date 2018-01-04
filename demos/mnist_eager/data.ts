import * as dl from 'deeplearn';

const math = dl.ENV.math;

const TRAIN_TEST_RATIO = 5 / 6;

const mnistConfig: dl.XhrDatasetConfig = {
  'data': [
    {
      'name': 'images',
      'path':
          'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png',
      'dataType': 'png',
      'shape': [28, 28, 1]
    },
    {
      'name': 'labels',
      'path':
          'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8',
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
  private indices: Uint32Array;

  private shuffledIndex = 0;

  public getNextBatch(batchSize: number):
      {xs: dl.Array2D<'float32'>, labels: dl.Array2D<'float32'>} {
    let xs: dl.Array2D<'float32'> = null;
    let labels: dl.Array2D<'float32'> = null;

    for (let i = 0; i < batchSize; i++) {
      this.shuffledIndex = (this.shuffledIndex + 1) % this.indices.length;

      const x = this.trainingData[0][this.shuffledIndex].reshape([1, 784]) as
          dl.Array2D<'float32'>;
      xs = concatWithNulls(xs, x);

      const label = this.trainingData[1][this.shuffledIndex].reshape([1, 10]) as
          dl.Array2D<'float32'>;
      labels = concatWithNulls(labels, label);
    }
    return {xs, labels};
  }

  public async load() {
    this.dataset = new dl.XhrDataset(mnistConfig);
    await this.dataset.fetchData();

    this.dataset.normalizeWithinBounds(0, -1, 1);
    this.trainingData = this.getTrainingData();
    this.testData = this.getTestData();
    console.log(this.testData.length);

    this.indices = dl.util.createShuffledIndices(this.trainingData.length);
  }

  public getTrainingData(): dl.NDArray[][] {
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

function concatWithNulls(
    ndarray1: dl.Array2D<'float32'>,
    ndarray2: dl.Array2D<'float32'>): dl.Array2D<'float32'> {
  if (ndarray1 == null && ndarray2 == null) {
    return null;
  }
  if (ndarray1 == null) {
    return ndarray2;
  } else if (ndarray2 === null) {
    return ndarray1;
  }
  return math.concat2D(ndarray1, ndarray2, 0) as dl.Array2D<'float32'>;
}
