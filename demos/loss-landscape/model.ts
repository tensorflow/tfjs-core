import * as dl from 'deeplearn';
import {MnistData} from './data';

// Hyperparameters.
const LEARNING_RATE = .05;
const BATCH_SIZE = 64;
const TRAIN_STEPS = 100;

// Data constants.
const IMAGE_SIZE = 784;
const LABELS_SIZE = 10;

const math = dl.ENV.math;

const optimizer = new dl.SGDOptimizer(LEARNING_RATE);

// Set up the model and loss function.
const weights1 =
    dl.variable(dl.Array2D.randNormal([IMAGE_SIZE, 30], 0, 1, 'float32'));

const weights2 = dl.variable(dl.Array2D.randNormal([30, 200], 0, 1, 'float32'));

const weights3 =
    dl.variable(dl.Array2D.randNormal([200, LABELS_SIZE], 0, 1, 'float32'));

export function model(xs: dl.Array2D<'float32'>): dl.Array2D<'float32'> {
  const layer1 = math.matMul(xs, weights1);
  const act1 = math.relu(layer1);
  const layer2 = math.matMul(act1, weights2);
  const act2 = math.relu(layer2);
  return math.matMul(act2, weights3) as dl.Array2D<'float32'>;
}

export function loss(
    labels: dl.Array2D<'float32'>, ys: dl.Array2D<'float32'>): dl.Scalar {
  return math.mean(math.softmaxCrossEntropyWithLogits(labels, ys)) as dl.Scalar;
}

// Train the model.
export async function train(data: MnistData, log: (message: string) => void) {
  const returnCost = true;
  for (let i = 0; i < TRAIN_STEPS; i++) {
    const cost = optimizer.minimize(() => {
      const batch = data.nextTrainBatch(BATCH_SIZE);
      const lossVal = loss(batch.labels, model(batch.xs));
      return lossVal;
    }, returnCost);

    log(`loss[${i}]: ${cost.dataSync()}`);
    cost.dispose();
    await dl.util.nextFrame();
  }
}

// Tests the model on a set
export function test(data: MnistData) {}

// Predict the digit number from a batch of input images.
export function predict(x: dl.Array2D<'float32'>): number[] {
  const pred = math.scope(() => {
    const axis = 1;
    return math.argMax(model(x), axis);
  });
  return Array.from(pred.dataSync());
}

// Given a logits or label vector, return the class indices.
export function classesFromLabel(y: dl.Array2D<'float32'>): number[] {
  const axis = 1;
  const pred = math.argMax(y, axis);

  return Array.from(pred.dataSync());
}

export enum WeightInit {
  FAN_IN = 'fan-in',
  FAN_OUT = 'fan-out',
  UNIT = 'unit'
}

export function changeWeights(selection: WeightInit) {
  const mean = 0;
  for (const varName in math.registeredVariables) {
    const v = math.registeredVariables[varName];
    let std = 1;
    switch (selection) {
      case WeightInit.FAN_IN:
        std = Math.sqrt(2 / v.shape[0]);
        break;
      case WeightInit.FAN_OUT:
        std = Math.sqrt(2 / v.shape[1]);
        break;
      case WeightInit.UNIT:
        std = 1;
        break;
      default:
        throw new Error(`Unknown weight init ${selection}`);
    }
    v.assign(dl.NDArray.randNormal(v.shape, mean, std));
  }
  console.log(math.getNumArrays());
}
