import * as dl from 'deeplearn';

import {MnistData} from './data';
import * as model from './model';
import * as ui from './ui';

const math = dl.ENV.math;

let data: MnistData;
async function load() {
  data = new MnistData();
  await data.load();
}

async function train() {
  ui.isTraining();
  await model.train(data, ui.trainingLog);
}

// function test() {
//   const testExamples = 50;
//   const batch = data.nextTestBatch(testExamples);
//   const predictions = model.predict(batch.xs);
//   const labels = model.classesFromLabel(batch.labels);

//   ui.showTestResults(batch, predictions, labels);
// }

function genDirection(w: dl.Array1D): dl.Array1D<'float32'> {
  const dir = dl.Array1D.randNormal([w.size], 0, 1, 'float32');
  const dirScaled =
      math.multiply(dir, math.divide(math.norm(w), math.norm(dir)));
  return dirScaled as dl.Array1D<'float32'>;
}

const stepsPerDir = 50;
const alphas: Array<dl.Scalar<'float32'>> = [];
for (let i = 0; i <= stepsPerDir; i++) {
  alphas.push(dl.Scalar.new(2 * (i / stepsPerDir) - 1));
}

async function evaluateLoss() {
  const start = performance.now();
  const w = model.weights.flatten();
  const losses: Array<Promise<number>> = [];
  const testExamples = 50;
  const batch = data.nextTestBatch(testExamples);
  const dir1 = genDirection(w);
  const dir2 = genDirection(w);
  for (let i = 0; i <= stepsPerDir; i++) {
    const tmp = math.add(w, math.multiply(alphas[i], dir1));
    for (let j = 0; j <= stepsPerDir; j++) {
      const loss = math.scope(() => {
        const newW = math.add(tmp, math.multiply(alphas[j], dir2))
                         .reshape(model.weights.shape) as dl.Array2D<'float32'>;
        model.weights.assign(newW);
        const loss = model.loss(batch.labels, model.model(batch.xs));
        return loss;
      });
      losses.push(loss.val());
    }
  }
  await Promise.all(losses);
  console.log(performance.now() - start, 'ms');
  model.weights.assign(w.reshape(model.weights.shape) as dl.Array2D<'float32'>);
  // console.log(lossVals);
}

async function mnist() {
  console.log('num arrays before load', math.getNumArrays());
  await load();
  console.log('num arrays before train', math.getNumArrays());
  await train();
  console.log('num arrays before evaluateLoss', math.getNumArrays());
  await math.scope(() => evaluateLoss());
  console.log('num arrays after', math.getNumArrays());
  await math.scope(() => evaluateLoss());
}
mnist();
