// tslint:disable-next-line:max-line-length
import {Array3D} from 'deeplearn/dist/math/ndarray';

import {loadCifarData, toArray4d} from './data';
import {inference, loadModelVariables} from './model';

function start() {
  console.log('Start');

  Promise.all([loadModelVariables('weights/'), loadCifarData()])
      .then(([modelVars, testData]) => {
        console.log('Loaded model, loaded data');

        let correct = 0;
        const total = testData.images.length;

        // Make a batch
        const batchSize = 50;
        for (let start = 0; start < testData.images.length;
             start += batchSize) {
          const batch =
              testData.images.slice(start, start + batchSize) as Array3D[];
          const batched = toArray4d(batch);
          const labelBatch = testData.labelled.slice(start, start + batchSize);

          const res = inference(modelVars, batched);

          for (let i = 0; i < res.predictionLabel.length; i++) {
            const predictionLabel = res.predictionLabel[i];
            const trueLabel = labelBatch[i].labelString;
            if (predictionLabel === trueLabel) {
              correct += 1;
            }
          }
        }
        console.log(
            'Correct', correct, ' Total: ', total, ' Accuracy',
            correct / total);
      })
      .catch((err) => {
        console.log('err loading data', err);
      });
}

start();
