// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array4D, CheckpointLoader, ENV, NDArray} from 'deeplearn';
import {XhrDataset, XhrDatasetConfig} from 'deeplearn/dist/data/xhr-dataset';
import {Array3D} from 'deeplearn/dist/math/ndarray';

// function loadImage(path: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.addEventListener('load', () => {
//       resolve(img);
//     });
//     img.src = path;
//   });
// }

// function showImage(image: HTMLImageElement) {
//   document.body.appendChild(image);
// }

function loadModelVariables(): Promise<{[varName: string]: NDArray}> {
  console.log('loadCheckpoint');
  const loader = new CheckpointLoader('weights/');
  return loader.getAllVariables();
}

function inference(modelVars: {[varName: string]: NDArray}, input: Array3D) {
  const FLAGS = {batchSize: 1};
  const labelStrings = [
    'airplane',
    'automobile',
    'bird',
    'cat',
    'deer',
    'dog',
    'frog',
    'horse',
    'ship',
    'truck',
  ];

  const math = ENV.math;

  // const input = math.cast(NDArray.fromPixels(image), 'float32');

  const conv1Weights = modelVars['conv1/weights'] as Array4D;
  const conv1Biases = modelVars['conv1/biases'] as Array1D;

  const conv2Weights = modelVars['conv2/weights'] as Array4D;
  const conv2Biases = modelVars['conv2/biases'] as Array1D;

  const local3Weights = modelVars['local3/weights'] as Array2D;
  const local3Biases = modelVars['local3/biases'] as Array1D;

  const local4Weights = modelVars['local4/weights'] as Array2D;
  const local4Biases = modelVars['local4/biases'] as Array1D;

  const softmaxWeights = modelVars['softmax_linear/weights'] as Array2D;
  const softmaxBiases = modelVars['softmax_linear/biases'] as Array1D;

  const softmaxRes = math.scope(() => {
    // Conv1
    const conv1Res = math.scope(() => {
      const conv = math.conv2d(
          input, conv1Weights, conv1Biases, [1, 1],
          'same'  // Could be nice as a constant.
      );
      const relu = math.relu(conv);
      return relu;
    });

    // Pool and Norm
    const pool = math.maxPool(conv1Res, [3, 3], [2, 2], 'same');
    const norm =
        math.localResponseNormalization3D(pool, 4, 1.0, 0.001 / 9.0, 0.75);

    // Conv2
    const conv2Res = math.scope((keep) => {
      const conv = math.conv2d(
          norm,
          conv2Weights,
          conv2Biases,
          [1, 1],
          'same',
      );

      const relu = math.relu(conv);
      return relu;
    });

    // Norm then pool.
    const norm2 =
        math.localResponseNormalization3D(conv2Res, 4, 1.0, 0.001 / 9.0, 0.75);
    const pool2 = math.maxPool(norm2, [3, 3], [2, 2], 'same');

    // Local3
    const local3Res = math.scope((keep) => {
      // Note: -1 in the reshape tells deeplearn to determine the second
      // dimension automatically.
      const reshaped = math.reshape(pool2, [FLAGS.batchSize, -1]) as Array2D;
      const mul = math.matMul(reshaped, local3Weights) as Array2D;

      const biased = math.add(mul, local3Biases) as Array2D;
      const local3 = math.relu(biased);

      return local3;
    });

    // Local4
    const local4Res = math.scope((keep) => {
      const mul = math.matMul(local3Res, local4Weights);
      const biased = math.add(mul, local4Biases) as Array2D;
      const local4 = math.relu(biased);

      return local4;
    });

    // Note this doesn't actually apply softmax and the tensorflow
    // implementation has a comment to that effect even though it is called
    // softmax_linear.
    const softmaxRes = math.scope((keep) => {
      const mul = math.matMul(local4Res, softmaxWeights);
      const biased = math.add(mul, softmaxBiases);
      const softmax = biased;

      return softmax;
    });

    return softmaxRes;
  });

  const logits = softmaxRes.getValues();
  const prediction = math.argMax(softmaxRes).get(0);
  const predictionLabel = labelStrings[prediction];

  return {
    logits,
    prediction,
    predictionLabel,
  };
}

interface label {
  label: number;
  labelString: string;
}

function loadCifar10SampleData():
    Promise<{images: NDArray[], labelled: label[]}> {
  const datasetConfig: XhrDatasetConfig = {
    'data': [
      {
        'name': 'images',
        'path':
            // tslint:disable-next-line:max-line-length
            'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_images.png',
        'dataType': 'png',
        'shape': [32, 32, 3]
      },
      {
        'name': 'labels',
        'path':
            // tslint:disable-next-line:max-line-length
            'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_labels_uint8',
        'dataType': 'uint8',
        'shape': [10]
      }
    ],
    'labelClassNames': [
      'airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse',
      'ship', 'truck'
    ],
    modelConfigs: undefined,
  };

  const dataset = new XhrDataset(datasetConfig);

  return dataset.fetchData().then(() => {
    console.log('loaded data');
    console.log(dataset);
    eval('window[\'__dataset\'] = dataset');

    const NUM_IMAGES = 10000;
    let [images, labels] = dataset.getData();

    images = images.slice(0, NUM_IMAGES);
    labels = labels.slice(0, NUM_IMAGES);

    // Resize the images
    images = images.map((i) => {
      return ENV.math.resizeBilinear3D(i as Array3D, [24, 24]);
    });

    const labelled = labels.map((l) => {
      const label = ENV.math.argMax(l).get(0);
      const labelString = datasetConfig.labelClassNames[label];
      return {
        label,
        labelString,
      };
    });

    return {
      images,
      labelled,
    };
  });
}

function runDemo() {
  console.log('run demo');

  Promise.all([loadModelVariables(), loadCifar10SampleData()])
      .then(([modelVars, testData]) => {
        console.log('Loaded model vars');

        let correct = 0;
        const total = testData.images.length;
        testData.images.forEach((image, index) => {
          const res = inference(modelVars, image as Array3D);
          if (res.predictionLabel === testData.labelled[index].labelString) {
            correct += 1;
          }
          // console.log(
          //     res.predictionLabel === testData.labelled[index].labelString,
          //     ' : ', 'Prediction: ', res.predictionLabel,
          //     '  Truth:', testData.labelled[index].labelString);
        });

        console.log('DONE', correct / total, total);
      })
      .catch((err) => {
        console.log('err loading data', err);
      });
}

runDemo();
