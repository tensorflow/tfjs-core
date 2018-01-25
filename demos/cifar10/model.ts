// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array4D, CheckpointLoader, ENV, NDArray} from 'deeplearn';

/**
 * Loads model variables from the paths provided in the manifest.
 *
 * Returns a promise to an key-value pair of named vars to NDArrays.
 */
export function loadModelVariables(manifestPath = 'weights/'):
    Promise<{[varName: string]: NDArray}> {
  const loader = new CheckpointLoader(manifestPath);
  return loader.getAllVariables();
}

/**
 * Perform inference on an Array3d represending an image.
 *
 * @param modelVars key-value map of model variables
 * @param input array3D representing image.
 */
export function inference(
    modelVars: {[varName: string]: NDArray}, input: Array4D) {
  const math = ENV.math;

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

  const batchSize = input.shape[0];

  // Load the weights and biases from the serialized model
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

  // Build the model architecture

  const finalRes = math.scope(() => {
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
        math.localResponseNormalization4D(pool, 4, 1.0, 0.001 / 9.0, 0.75);

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
        math.localResponseNormalization4D(conv2Res, 4, 1.0, 0.001 / 9.0, 0.75);
    const pool2 = math.maxPool(norm2, [3, 3], [2, 2], 'same');

    // Local3
    const local3Res = math.scope((keep) => {
      // Note: -1 in the reshape tells deeplearn to determine the second
      // dimension automatically.
      const reshaped = math.reshape(pool2, [batchSize, -1]) as Array2D;
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
      const biased = math.add(mul, softmaxBiases) as Array2D;
      const softmax = biased;

      return softmax;
    });

    return softmaxRes;
  });

  const logits = finalRes.reshape([-1, 10]) as Array2D;
  const prediction = math.argMax(finalRes, 1) as Array1D<'int32'>;
  const predictionLabel =
      Array.from(prediction.getValues()).map(i => labelStrings[i]);

  return {
    logits,
    prediction,
    predictionLabel,
  };
}
