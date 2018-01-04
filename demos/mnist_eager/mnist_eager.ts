import * as dl from 'deeplearn';

const TRAIN_TEST_RATIO = 5 / 6;

const dataset = new dl.XhrDataset({
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
});

function getTestData(): dl.NDArray[][] {
  const data = dataset.getData();
  if (data == null) {
    return null;
  }
  const [images, labels] = dataset.getData() as [dl.NDArray[], dl.NDArray[]];

  const start = Math.floor(TRAIN_TEST_RATIO * images.length);

  return [images.slice(start), labels.slice(start)];
}

function getTrainingData(): dl.NDArray[][] {
  const [images, labels] = dataset.getData() as [dl.NDArray[], dl.NDArray[]];

  const end = Math.floor(TRAIN_TEST_RATIO * images.length);

  return [images.slice(0, end), labels.slice(0, end)];
}

const W = dl.variable(dl.Array2D.randNormal([784, 10]));
function model(x: dl.Array2D) {
  return dl.ENV.math.matMul(x, W);
}

function loss(labels: dl.Array2D<'float32'>, y: dl.Array2D) {
  return dl.ENV.math.mean(dl.ENV.math.softmaxCrossEntropyWithLogits(labels, y))
}

async function mnist() {
  await dataset.fetchData();

  const trainingData = getTrainingData();
  dl.util.createShuffledIndices(trainingData.length);

  console.log(trainingData);

  console.log(dl);

  //   const optimizer = new dl.SGDOptimizerEager(.1);

  console.log('data fetched...');
}

console.log(getTestData, getTrainingData);

mnist();
