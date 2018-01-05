import * as dl from 'deeplearn';

import {MnistData} from './data';

const math = dl.ENV.math;
const optimizer = new dl.SGDOptimizer(.05);

const W = dl.variable(
    dl.Array2D.randNormal([784, 10], 0, 1 / Math.sqrt(784), 'float32'));

const model = (xs: dl.Array2D<'float32'>): dl.Array2D<'float32'> => {
  return math.matMul(xs, W) as dl.Array2D<'float32'>;
};

const loss = (labels: dl.Array2D<'float32'>,
              ys: dl.Array2D<'float32'>): dl.Scalar => {
  return math.mean(math.softmaxCrossEntropyWithLogits(labels, ys)) as dl.Scalar;
};

let data: MnistData;
async function load() {
  data = new MnistData();
  await data.load();
}

async function train() {
  statusElement.innerText = 'Training...';

  const steps = 100;
  const batchSize = 64;
  for (let i = 0; i < steps; i++) {
    const lossValue = optimizer.minimize(() => {
      const batch = data.nextTrainBatch(batchSize);

      return loss(batch.labels, model(batch.xs));
    });

    const displayStr = `loss[${i}]: ${lossValue.dataSync()}`;
    messageElement.innerText = `${displayStr}\n`;
    console.log(displayStr);

    await dl.util.nextFrame();
  }
}

const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
const imagesElement = document.getElementById('images');

async function test() {
  statusElement.innerText = 'Testing...';

  const batchSize = 50;
  let totalCorrect = 0;
  const batch = data.nextTestBatch(batchSize);
  for (let i = 0; i < batchSize; i++) {
    const image = math.slice2D(batch.xs, [i, 0], [1, batch.xs.shape[1]]) as
        dl.Array2D<'float32'>;
    const label =
        math.slice2D(batch.labels, [i, 0], [1, batch.labels.shape[1]]) as
        dl.Array2D<'float32'>;

    const div = document.createElement('div');

    const canvas = document.createElement('canvas');
    draw(image.flatten(), canvas);

    const pred = document.createElement('span');
    const prediction = math.scope(() => {
      return math.argMax(model(image)).asScalar();
    });
    const labelValue = math.scope(() => {
      return math.argMax(label).asScalar();
    });
    const correct = math.equal(prediction, labelValue);

    if (correct.get() === 1) {
      totalCorrect++;
    }

    pred.innerText = 'pred: ' + prediction.dataSync();

    div.appendChild(canvas);
    div.appendChild(pred);
    imagesElement.appendChild(div);
  }

  const accuracy = 100 * totalCorrect / batchSize;
  const displayStr =
      `accuracy: ${accuracy.toFixed(2)}% (${totalCorrect} / ${batchSize})`;
  messageElement.innerText = `${displayStr}\n`;
  console.log(displayStr);
}

function draw(image: dl.Array1D, canvas: HTMLCanvasElement) {
  const [width, height] = [28, 28];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = data[i] * 255;
    imageData.data[j + 1] = data[i] * 255;
    imageData.data[j + 2] = data[i] * 255;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

async function mnist() {
  await load();
  await train();
  test();
}
mnist();
