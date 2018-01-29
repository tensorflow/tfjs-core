import * as dl from 'deeplearn';

import {CifarData, loadCifarData, toArray2d, toArray4d} from './data';
import {inference, loadModelVariables} from './model';
import {TrainableCifar10} from './model_trainable';

async function startPreTrained() {
  console.log('Start');

  const [modelVars, testData] =
      await Promise.all([loadModelVariables('weights/'), loadCifarData(1000)]);

  console.log('Loaded model, loaded data');

  let numCorrect = 0;
  const total = testData.images.length;

  // Make a batch
  const batchSize = 100;
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



function*
    inputBatcher(input: CifarData, batchSize: number):
        Iterator<{images: dl.Array4D, labels: dl.Array2D}> {
  let start = 0;
  const inputSize = input.images.length;

  while (true) {
    const inputBatch =
        toArray4d(input.images.slice(start, start + batchSize) as dl.Array3D[]);

    const oneHotLabels =
        toArray2d(input.labels.slice(start, start + batchSize) as dl.Array1D[]);

    yield {
      images: inputBatch,
      labels: oneHotLabels,
    };

    start += batchSize;
    if (start >= inputSize) {
      start = 0;
    }
  }
}

async function startTraining() {
  console.log('Start');

  const cifarData = await loadCifarData(1000);
  console.log('Data loaded');

  const batchSize = 50;
  const numTestExamples = 200;

  const testData = {
    images: cifarData.images.slice(0, numTestExamples),
    labels: cifarData.labels.slice(0, numTestExamples)
  };

  const trainData = {
    images: cifarData.images.slice(numTestExamples, cifarData.images.length),
    labels: cifarData.labels.slice(numTestExamples, cifarData.labels.length)
  };

  const trainBatches = inputBatcher(trainData, batchSize);
  const testBatches = inputBatcher(testData, batchSize);

  const trainer = new TrainableCifar10();

  const trainStep = 35;
  let step = 0;
  const trainHelper = () => {
    const nextBatch = trainBatches.next().value;
    const loss = trainer.trainStep(nextBatch.images, nextBatch.labels);


    if (step % 10 === 0) {
      loss.data().then(val => console.log('loss', val));
      // Do an accuracy test
      const nextTestBatch = testBatches.next().value;
      testModel(trainer, nextTestBatch.images, nextTestBatch.labels, batchSize);
    }

    step += 1;
    if (step < trainStep) {
      setTimeout(trainHelper, 1200);
    }
  };

  trainHelper();
}

function testModel(
    model: TrainableCifar10, images: dl.Array4D, labels: dl.Array2D,
    batchSize: number) {
  const {prediction} = model.inference(images);
  const truePredictions = dl.ENV.math.argMax(labels, 1);

  dl.ENV.math.sum(dl.ENV.math.equal(prediction, truePredictions))
      .data()
      .then(val => console.log('Accuracy: ', val[0], ' out of ', batchSize));
}


console.log('s', startPreTrained);

startTraining();
