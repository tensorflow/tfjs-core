import * as dl from 'deeplearn';

import {MnistData} from './data';

const math = dl.ENV.math;

const optimizer = new dl.SGDOptimizerEager(.001);

const W = dl.variable(
    dl.Array2D.randNormal([784, 10], 0, 1 / Math.sqrt(784), 'float32'));

const model = (xs: dl.Array2D<'float32'>): dl.Array2D<'float32'> => {
  return math.matMul(xs, W) as dl.Array2D<'float32'>;
};

const loss = (labels: dl.Array2D<'float32'>,
              ys: dl.Array2D<'float32'>): dl.Scalar => {
  return math.mean(math.softmaxCrossEntropyWithLogits(labels, ys)) as dl.Scalar;
};

async function train() {
  const data = new MnistData();
  await data.load();

  const numBatches = 50;
  const batchSize = 64;
  for (let i = 0; i < numBatches; i++) {
    const lossValue = optimizer.minimize(() => {
      const batch = data.getNextBatch(batchSize);

      return loss(batch.labels, model(batch.xs));
    });

    console.log('loss:', lossValue.dataSync());

    await dl.util.nextFrame();
  }
}

train();
