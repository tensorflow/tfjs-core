import * as dl from 'deeplearn';

import {loadCifarData, toArray2d, toArray4d} from './data';
import {inference, loadModelVariables} from './model';

async function start() {
  console.log('Start');

  const [modelVars, testData] =
      await Promise.all([loadModelVariables('weights/'), loadCifarData(10000)]);

  console.log('Loaded model, loaded data');

  let numCorrect = 0;
  const total = testData.images.length;

  // Make a batch
  const batchSize = 500;
  for (let start = 0; start < testData.images.length; start += batchSize) {
    const inputBatch = toArray4d(
        testData.images.slice(start, start + batchSize) as dl.Array3D[]);

    const truePredAsNDarray = toArray2d(
        testData.labels.slice(start, start + batchSize) as dl.Array1D[]);
    const truePredictions = dl.ENV.math.argMax(truePredAsNDarray, 1);

    console.time(`Inference Time:batchSize=${batchSize}`);
    const {prediction} = inference(modelVars, inputBatch);
    console.timeEnd(`Inference Time:batchSize=${batchSize}`);

    const batchCorrect =
        dl.ENV.math.sum(dl.ENV.math.equal(prediction, truePredictions)).get(0);

    numCorrect += batchCorrect;

    console.log('batchCorrect', batchCorrect);
  }

  console.log(
      'Correct', numCorrect, ' Total: ', total, ' Accuracy',
      numCorrect / total);
}

start();
