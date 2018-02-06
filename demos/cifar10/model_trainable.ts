import * as dl from 'deeplearn';

export class TrainableCifar10 {
  conv1Weights: dl.Array4D;
  conv1Biases: dl.Array1D;
  conv2Weights: dl.Array4D;
  conv2Biases: dl.Array1D;
  local3Weights: dl.Array2D;
  local3Biases: dl.Array1D;
  local4Weights: dl.Array2D;
  local4Biases: dl.Array1D;
  softmaxWeights: dl.Array2D;
  softmaxBiases: dl.Array1D;

  optimizer: dl.Optimizer;

  constructor() {
    this.initWeights();

    // Note the original method uses a decaying learning rage.
    const LEARNING_RATE = .1;
    this.optimizer = new dl.SGDOptimizer(LEARNING_RATE);
  }

  initWeights() {
    // Set up network vars. (note that this does not include weight decay or
    // loss summaries)
    let biasNDArr: dl.Array1D;

    this.conv1Weights = dl.variable(
        dl.Array4D.randTruncatedNormal([5, 5, 3, 64], undefined, 5e-2));
    this.conv1Biases = dl.variable(dl.Array1D.zeros([64], 'float32'));

    this.conv2Weights = dl.variable(
        dl.Array4D.randTruncatedNormal([5, 5, 64, 64], undefined, 5e-2));
    biasNDArr = dl.Array1D.zeros([64], 'float32');
    biasNDArr.fill(0.1);
    this.conv2Biases = dl.variable(biasNDArr);

    this.local3Weights = dl.variable(
        dl.Array2D.randTruncatedNormal([36864, 384], undefined, 0.004));
    biasNDArr = dl.Array1D.zeros([384], 'float32');
    biasNDArr.fill(0.1);
    this.local3Biases = dl.variable(biasNDArr);

    this.local4Weights = dl.variable(
        dl.Array2D.randTruncatedNormal([384, 192], undefined, 0.04));
    biasNDArr = dl.Array1D.zeros([192], 'float32');
    biasNDArr.fill(0.1);
    this.local4Biases = dl.variable(biasNDArr);

    this.softmaxWeights = dl.variable(
        dl.Array2D.randTruncatedNormal([192, 10], undefined, 1 / 192.0));
    const biasNDArr3 = dl.Array1D.zeros([10], 'float32');
    biasNDArr3.fill(0.1);
    this.softmaxBiases = dl.variable(biasNDArr3);
  }

  /**
   * Perform inference on an Array3d represending an image.
   *
   * @param modelVars key-value map of model variables
   * @param input
   */
  inference(input: dl.Array4D) {
    const math = dl.ENV.math;
    const batchSize = input.shape[0];

    const finalRes = math.scope(() => {
      // Conv1
      const conv1Res = math.scope(() => {
        // console.log('input', input);
        // console.log('conv1Weights', this.conv1Weights);
        const conv = math.conv2d(
            input, this.conv1Weights, this.conv1Biases, [1, 1],
            'same'  // Could be nice as a constant.
        );
        // console.log('conv1', conv);
        return math.relu(conv);
      });

      // Pool and Norm
      // const pool = math.maxPool(conv1Res, [3, 3], [2, 2], 'same');
      // const norm =
      //     math.localResponseNormalization4D(pool, 4, 1.0, 0.001 / 9.0, 0.75);

      const norm = conv1Res;

      // Conv2
      const conv2Res = math.scope(() => {
        const conv = math.conv2d(
            norm, this.conv2Weights, this.conv2Biases, [1, 1], 'same');
        return math.relu(conv);
      });

      // Norm then pool.
      // const norm2 =
      //     math.localResponseNormalization4D(conv2Res, 4, 1.0, 0.001 / 9.0,
      //     0.75);
      // const pool2 = math.maxPool(norm2, [3, 3], [2, 2], 'same');

      const pool2 = conv2Res;

      // Local3
      const local3Res = math.scope(() => {
        const reshaped = math.reshape(pool2, [batchSize, 36864]) as dl.Array2D;
        const mul = math.matMul(reshaped, this.local3Weights) as dl.Array2D;

        const biased = math.add(mul, this.local3Biases) as dl.Array2D;
        return math.relu(biased);
      });

      // Local4
      const local4Res = math.scope(() => {
        const mul = math.matMul(local3Res, this.local4Weights);
        const biased = math.add(mul, this.local4Biases) as dl.Array2D;
        return math.relu(biased);
      });

      // Note this doesn't actually apply softmax and the tensorflow
      // implementation has a comment to that effect even though it is called
      // softmax_linear.
      const softmaxRes = math.scope((keep) => {
        const mul = math.matMul(local4Res, this.softmaxWeights);
        const biased = math.add(mul, this.softmaxBiases) as dl.Array2D;
        const softmax = biased;

        return softmax;
      });

      return softmaxRes;
    });



    const logits = finalRes;
    const prediction = math.argMax(finalRes, 1) as dl.Array1D<'int32'>;

    return {logits, prediction};
  }

  loss(oneHotLabels: dl.Array2D, logits: dl.Array2D): dl.Scalar {
    return dl.ENV.math.mean(dl.ENV.math.softmaxCrossEntropyWithLogits(
               oneHotLabels, logits)) as dl.Scalar;
  }

  trainStep(data: dl.Array4D, oneHotLabels: dl.Array2D, returnCost = true) {
    const cost = this.optimizer.minimize(() => {
      const prediction = this.inference(data);

      // console.log('labels', oneHotLabels);
      // console.log('logits', prediction.logits);

      return this.loss(oneHotLabels, prediction.logits);
    }, returnCost);

    return cost;
  }
}
