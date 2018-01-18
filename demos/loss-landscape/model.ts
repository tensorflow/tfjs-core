import * as dl from 'deeplearn';
import {MnistData} from './data';

export enum ModelType {
  FC = 'fc',
  CONV = 'conv'
}

export enum WeightInit {
  FAN_IN = 'fan-in',
  FAN_OUT = 'fan-out',
  UNIT = 'unit'
}

export class Model {
  // Hyperparameters.
  LEARNING_RATE = .05;
  BATCH_SIZE = 64;

  // Data constants.
  IMAGE_SIZE = 784;
  LABELS_SIZE = 10;
  LANDSCAPE_STEPS_PER_DIR = 5;
  // dl.js state.
  math = dl.ENV.math;
  optimizer: dl.SGDOptimizer;
  alphas: Array<dl.Scalar<'float32'>> = [];
  iter = 0;
  modelType: ModelType = ModelType.FC;
  weightInit: WeightInit = WeightInit.UNIT;

  init() {
    if (this.optimizer) {
      this.optimizer.dispose();
    }
    this.optimizer = new dl.SGDOptimizer(this.LEARNING_RATE);
    this.alphas.forEach(alpha => alpha.dispose());
    this.alphas = [];
    for (let i = 0; i <= this.LANDSCAPE_STEPS_PER_DIR; i++) {
      this.alphas.push(
          dl.Scalar.new(2 * (i / this.LANDSCAPE_STEPS_PER_DIR) - 1));
    }
    this.setModel(this.modelType);
  }

  setModel(newModelType: ModelType) {
    this.disposeAllVars();
    if (newModelType === ModelType.FC) {
      this.setFCModel();
    } else if (newModelType === ModelType.CONV) {
      this.setConvModel();
    }
    this.modelType = newModelType;
  }

  async train(data: MnistData, steps?: number): Promise<[number, number]> {
    const start = performance.now();
    let cost: dl.Scalar;
    steps = steps || 50;
    for (let i = 0; i < steps; i++) {
      cost = this.optimizer.minimize(() => {
        const batch = data.nextTrainBatch(this.BATCH_SIZE);
        const lossVal = this.loss(batch.labels, this.model(batch.xs));
        return lossVal;
      }, i === steps - 1 /* returnCost */);
      this.iter++;
      await dl.util.nextFrame();
    }
    const result = await cost.val();
    cost.dispose();
    console.log('Training took', performance.now() - start, 'ms');
    return [result, this.iter];
  }

  dispose() {
    this.optimizer.dispose();
    this.alphas.forEach(alpha => alpha.dispose());
    this.disposeAllVars();
  }

  private model: (xs: dl.Array2D<'float32'>) => dl.Array2D<'float32'>;

  loss(labels: dl.Array2D<'float32'>, ys: dl.Array2D<'float32'>): dl.Scalar {
    return this.math.mean(this.math.softmaxCrossEntropyWithLogits(
               labels, ys)) as dl.Scalar;
  }

  /** Predict the digit number from a batch of input images. */
  predict(x: dl.Array2D<'float32'>): number[] {
    const pred = this.math.scope(() => {
      const axis = 1;
      return this.math.argMax(this.model(x), axis);
    });
    return Array.from(pred.dataSync());
  }

  /** Given a logits or label vector, return the class indices. */
  classesFromLabel(y: dl.Array2D<'float32'>): number[] {
    const axis = 1;
    const pred = this.math.argMax(y, axis);

    return Array.from(pred.dataSync());
  }

  reinitWeights(selection: WeightInit) {
    const mean = 0;
    for (const varName in this.math.registeredVariables) {
      const v = this.math.registeredVariables[varName];
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
    this.iter = 0;
  }

  genDirections() {
    const dirs: {[name: string]: dl.Array1D<'float32'>} = {};
    for (const varName in this.math.registeredVariables) {
      dirs[varName] = this.math.scope(() => {
        const v = this.math.registeredVariables[varName];
        const vNorm = this.math.norm(v, 'euclidean', 0);
        const dir =
            dl.Array2D.randNormal(v.shape as [number, number], 0, 1, 'float32');
        const dirNorm = this.math.norm(dir, 'euclidean', 0);
        return this.math.multiply(dir, this.math.divide(vNorm, dirNorm))
            .flatten();
      });
    }
    return dirs;
  }

  async computeLandscape(data: MnistData): Promise<number[][]> {
    const matrix: number[][] = [];
    await this.math.scope(async () => {
      const losses: Array<Promise<number>> = [];
      const batch = data.nextTestBatch(this.BATCH_SIZE);
      const start = performance.now();
      const dirs1 = this.genDirections();
      const dirs2 = this.genDirections();
      const promises = [];
      for (const name in dirs2) {
        promises.push(dirs2[name].data());
      }
      await Promise.all(promises);
      console.log('gen directions took', performance.now() - start, 'ms');
      const vs: {[name: string]: dl.Array1D} = {};

      for (const varName in this.math.registeredVariables) {
        vs[varName] = this.math.registeredVariables[varName].flatten();
      }
      for (let i = 0; i <= this.LANDSCAPE_STEPS_PER_DIR; i++) {
        for (let j = 0; j <= this.LANDSCAPE_STEPS_PER_DIR; j++) {
          const lossVal = this.math.scope(() => {
            for (const varName in this.math.registeredVariables) {
              const variable = this.math.registeredVariables[varName];
              const v = vs[varName];
              const tmp = this.math.add(
                  v, this.math.multiply(this.alphas[i], dirs1[varName]));
              const newVals =
                  this.math
                      .add(
                          tmp,
                          this.math.multiply(this.alphas[j], dirs2[varName]))
                      .reshape(variable.shape) as dl.Array2D<'float32'>;
              variable.assign(newVals);
            }
            return this.loss(batch.labels, this.model(batch.xs));
          });
          losses.push(lossVal.val());
        }
      }
      const lossVals = await Promise.all(losses);
      for (let i = 0; i <= this.LANDSCAPE_STEPS_PER_DIR; i++) {
        const row: number[] = [];
        for (let j = 0; j <= this.LANDSCAPE_STEPS_PER_DIR; j++) {
          const index = i * (this.LANDSCAPE_STEPS_PER_DIR + 1) + j;
          row.push(lossVals[index]);
        }
        matrix.push(row);
      }
      // Reset the weights.
      for (const varName in this.math.registeredVariables) {
        const variable = this.math.registeredVariables[varName];
        variable.assign(vs[varName].reshape(variable.shape));
      }
    });
    return matrix;
  }

  private setFCModel() {
    const m = this.math;
    const w1 = dl.variable(
        dl.Array2D.randNormal([this.IMAGE_SIZE, 30], 0, 1, 'float32'));
    const w2 = dl.variable(dl.Array2D.randNormal([30, 60], 0, 1, 'float32'));
    const w3 = dl.variable(
        dl.Array2D.randNormal([60, this.LABELS_SIZE], 0, 1, 'float32'));
    this.iter = 0;
    this.model = xs => {
      const layer1 = m.matMul(xs, w1 as dl.Array2D);
      const act1 = m.relu(layer1);
      const layer2 = m.matMul(act1, w2 as dl.Array2D);
      const act2 = m.relu(layer2);
      return m.matMul(act2, w3 as dl.Array2D) as dl.Array2D<'float32'>;
    };
  }

  private setConvModel() {
    const m = this.math;

    function filterVar(shape: [number, number, number, number]) {
      return dl.variable(
          dl.Array4D.randTruncatedNormal(shape, 0, 0.1, 'float32'));
    }

    function biasVar(size: number) {
      const a = dl.Array1D.zeros([size], 'float32');
      a.fill(0.1);
      return dl.variable(a);
    }

    function fcVar(shape: [number, number]) {
      return dl.variable(
          dl.Array2D.randTruncatedNormal(shape, 0, 0.1, 'float32'));
    }

    function conv2d(image: dl.Array4D, filter: dl.Array4D, bias: dl.Array1D):
        dl.Array4D<'float32'> {
      return m.conv2d(image, filter, bias, [1, 1, 1, 1], 'same') as
          dl.Array4D<'float32'>;
    }

    function maxPool2x2(image: dl.Array4D): dl.Array4D<'float32'> {
      return m.maxPool(image, 2, 2, 'same') as dl.Array4D<'float32'>;
    }

    const filter1 = filterVar([5, 5, 1, 32]);
    const filter1Bias = biasVar(32);

    const filter2 = filterVar([5, 5, 32, 64]);
    const filter2Bias = biasVar(64);

    const fc1W = fcVar([7 * 7 * 64, 1024]);
    const fc1Bias = biasVar(1024);

    const fc2W = fcVar([1024, 10]);
    const fc2Bias = biasVar(10);

    this.model = xs => {
      const image = xs.as4D(-1, 28, 28, 1);
      const conv1 = m.relu(conv2d(image, filter1, filter1Bias));
      const pool1 = maxPool2x2(conv1);

      const conv2 = m.relu(conv2d(pool1, filter2, filter2Bias));
      const pool2 = maxPool2x2(conv2);

      const fc1 =
          m.relu(m.add(m.matMul(pool2.as2D(-1, 7 * 7 * 64), fc1W), fc1Bias)) as
          dl.Array2D<'float32'>;
      const fc2 =
          m.relu(m.add(m.matMul(fc1, fc2W), fc2Bias)) as dl.Array2D<'float32'>;
      return fc2;
    };
  }

  private disposeAllVars() {
    for (const varName in this.math.registeredVariables) {
      this.math.registeredVariables[varName].dispose();
      delete this.math.registeredVariables[varName];
    }
  }
}
