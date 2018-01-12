import * as dl from 'deeplearn';
import {MnistData} from './data';

// Hyperparameters.
const LEARNING_RATE = .05;
const BATCH_SIZE = 64;
const TRAIN_STEPS = 10;

// Data constants.
const IMAGE_SIZE = 784;
const LABELS_SIZE = 10;
const LANDSCAPE_STEPS_PER_DIR = 20;

// dl.js state.
const math = dl.ENV.math;
let optimizer: dl.SGDOptimizer;
let alphas: Array<dl.Scalar<'float32'>>;
let weights: Array<dl.Variable<'float32'>>;

export function init() {
  optimizer = new dl.SGDOptimizer(LEARNING_RATE);
  alphas = [];
  for (let i = 0; i <= LANDSCAPE_STEPS_PER_DIR; i++) {
    alphas.push(dl.Scalar.new(2 * (i / LANDSCAPE_STEPS_PER_DIR) - 1));
  }
  initModel();
}

export function initModel() {
  initFCModel();
}

export function initFCModel() {
  weights = [];
  weights.push(
      dl.variable(dl.Array2D.randNormal([IMAGE_SIZE, 30], 0, 1, 'float32')));
  weights.push(dl.variable(dl.Array2D.randNormal([30, 200], 0, 1, 'float32')));
  weights.push(
      dl.variable(dl.Array2D.randNormal([200, LABELS_SIZE], 0, 1, 'float32')));
}

export function model(xs: dl.Array2D<'float32'>): dl.Array2D<'float32'> {
  const layer1 = math.matMul(xs, weights[0] as dl.Array2D);
  const act1 = math.relu(layer1);
  const layer2 = math.matMul(act1, weights[1] as dl.Array2D);
  const act2 = math.relu(layer2);
  return math.matMul(act2, weights[2] as dl.Array2D) as dl.Array2D<'float32'>;
}

export function loss(
    labels: dl.Array2D<'float32'>, ys: dl.Array2D<'float32'>): dl.Scalar {
  return math.mean(math.softmaxCrossEntropyWithLogits(labels, ys)) as dl.Scalar;
}

// Train the model.
export async function train(data: MnistData): Promise<number> {
  let cost: dl.Scalar;
  for (let i = 0; i < TRAIN_STEPS; i++) {
    cost = optimizer.minimize(() => {
      const batch = data.nextTrainBatch(BATCH_SIZE);
      const lossVal = loss(batch.labels, model(batch.xs));
      return lossVal;
    }, i === TRAIN_STEPS - 1 /* returnCost */);
    await dl.util.nextFrame();
  }
  const result = await cost.val();
  cost.dispose();
  return result;
}

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

export function reinitWeights(selection: WeightInit) {
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
}

function genDirections() {
  const dirs: {[name: string]: dl.Array1D<'float32'>} = {};
  for (const varName in math.registeredVariables) {
    dirs[varName] = math.scope(() => {
      const v = math.registeredVariables[varName].flatten();
      const dir = dl.Array1D.randNormal([v.size], 0, 1, 'float32');
      return math.multiply(dir, math.divide(math.norm(v), math.norm(dir))) as
          dl.Array1D<'float32'>;
    });
  }
  return dirs;
}

export async function computeLandscape(data: MnistData): Promise<number[][]> {
  const matrix: number[][] = [];
  await math.scope(async () => {
    const losses: Array<Promise<number>> = [];
    const batch = data.nextTestBatch(BATCH_SIZE);
    const dirs1 = genDirections();
    const dirs2 = genDirections();
    const vs: {[name: string]: dl.Array1D} = {};

    for (const varName in math.registeredVariables) {
      vs[varName] = math.registeredVariables[varName].flatten();
    }
    for (let i = 0; i <= LANDSCAPE_STEPS_PER_DIR; i++) {
      for (let j = 0; j <= LANDSCAPE_STEPS_PER_DIR; j++) {
        const lossVal = math.scope(() => {
          for (const varName in math.registeredVariables) {
            const variable = math.registeredVariables[varName];
            const v = vs[varName];
            const tmp = math.add(v, math.multiply(alphas[i], dirs1[varName]));
            const newVals =
                math.add(tmp, math.multiply(alphas[j], dirs2[varName]))
                    .reshape(variable.shape) as dl.Array2D<'float32'>;
            variable.assign(newVals);
          }
          return loss(batch.labels, model(batch.xs));
        });
        losses.push(lossVal.val());
      }
    }
    const lossVals = await Promise.all(losses);
    for (let i = 0; i <= LANDSCAPE_STEPS_PER_DIR; i++) {
      const row: number[] = [];
      for (let j = 0; j <= LANDSCAPE_STEPS_PER_DIR; j++) {
        const index = i * (LANDSCAPE_STEPS_PER_DIR + 1) + j;
        row.push(lossVals[index]);
      }
      matrix.push(row);
    }
    // Reset the weights.
    for (const varName in math.registeredVariables) {
      const variable = math.registeredVariables[varName];
      variable.assign(vs[varName].reshape(variable.shape));
    }
  });
  return matrix;
}
