// tslint:disable-next-line:max-line-length
import {Array3D} from 'deeplearn/dist/math/ndarray';

import {loadCifarData} from './data';
import {inference, loadModelVariables} from './model';

function start() {
  console.log('Start');

  Promise.all([loadModelVariables('weights/'), loadCifarData()])
      .then(([modelVars, testData]) => {
        console.log('Loaded model, loaded data');

        let correct = 0;
        const total = testData.images.length;
        testData.images.forEach((image, index) => {
          const res = inference(modelVars, image as Array3D);
          if (res.predictionLabel === testData.labelled[index].labelString) {
            correct += 1;
          }
        });

        console.log(
            'Correct', correct, ' Total: ', total, ' Accuracy',
            correct / total);
      })
      .catch((err) => {
        console.log('err loading data', err);
      });
}

start();
