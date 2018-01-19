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

export type RandDir = {
  [name: string]: dl.Array2D<'float32'>
};

export class Model {
  // Hyperparameters.
  private LEARNING_RATE = .1;
  private BATCH_SIZE = 64;
  private TEST_BATCH_SIZE = 64 * 10;

  // Data constants.
  private IMAGE_SIZE = 784;
  private LABELS_SIZE = 10;
  private LANDSCAPE_STEPS_PER_DIR = 10;
  private TRAIN_STEPS = 30;

  // dl.js state.
  private math = dl.ENV.math;
  private optimizer: dl.SGDOptimizer;
  private alphas: Array<dl.Scalar<'float32'>> = [];
  private iter = 0;
  private modelType = ModelType.FC;
  private data: MnistData;
  private testBatch: {xs: dl.Array2D<'float32'>, labels: dl.Array2D<'float32'>};
  private randDirs: [RandDir, RandDir] = [] as [RandDir, RandDir];
  private weightInit = WeightInit.UNIT;

  init(data: MnistData) {
    this.data = data;
    this.testBatch = data.nextTestBatch(this.TEST_BATCH_SIZE);
    if (this.optimizer) {
      this.optimizer.dispose();
    }
    this.optimizer = new dl.SGDOptimizer(this.LEARNING_RATE);
    this.alphas.forEach(alpha => alpha.dispose());
    this.alphas = [];
    for (let i = 0; i <= this.LANDSCAPE_STEPS_PER_DIR; i++) {
      this.alphas.push(
          dl.Scalar.new(0.5 * (i / this.LANDSCAPE_STEPS_PER_DIR) - 0.25));
    }
    this.setModel(this.modelType);
  }

  setModel(newModelType: ModelType) {
    this.disposeAllVars();
    this.math.scope(() => {
      if (newModelType === ModelType.FC) {
        this.setFCModel();
      } else if (newModelType === ModelType.CONV) {
        this.setConvModel();
      }
    });
    this.reinitWeights(this.weightInit);
    this.modelType = newModelType;
    this.disposeRandDirs(0);
    this.disposeRandDirs(1);
    this.randDirs[0] = this.genRandDirs();
    this.randDirs[1] = this.genRandDirs();
  }

  async train(): Promise<number> {
    const start = performance.now();
    let cost: dl.Scalar;
    for (let i = 0; i < this.TRAIN_STEPS; i++) {
      cost = this.optimizer.minimize(() => {
        const batch = this.data.nextTrainBatch(this.BATCH_SIZE);
        const lossVal = this.loss(batch.labels, this.model(batch.xs));
        return lossVal;
      }, i === this.TRAIN_STEPS - 1 /* returnCost */);
      this.iter++;
    }
    await cost.val();
    console.log('Training took', performance.now() - start, 'ms');
    cost.dispose();
    return this.iter;
  }

  reinitWeights(selection: WeightInit) {
    this.weightInit = selection;
    this.math.scope(() => {
      for (const varName in this.math.registeredVariables) {
        const v = this.math.registeredVariables[varName];
        const lastDim = v.shape[v.shape.length - 1];
        const w = v.as2D(-1, lastDim);
        let std = 1;
        switch (selection) {
          case WeightInit.FAN_IN:
            std = Math.sqrt(2 / w.shape[0]);
            break;
          case WeightInit.FAN_OUT:
            std = Math.sqrt(2 / w.shape[1]);
            break;
          case WeightInit.UNIT:
            std = 1;
            break;
          default:
            throw new Error(`Unknown weight init ${selection}`);
        }
        v.assign(dl.NDArray.randTruncatedNormal(v.shape, 0, std));
      }
    });
    this.data.reset();
    this.iter = 0;
  }

  async computeLandscape(): Promise<number[][]> {
    const matrix: number[][] = [];
    await this.math.scope(async () => {
      const losses: Array<Promise<number>> = [];
      const dirs1 = this.genDirs(0);
      const dirs2 = this.genDirs(1);
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
            return this.loss(
                this.testBatch.labels, this.model(this.testBatch.xs));
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

  dispose() {
    this.optimizer.dispose();
    this.alphas.forEach(alpha => alpha.dispose());
    this.disposeAllVars();
  }

  private model: (xs: dl.Array2D<'float32'>) => dl.Array2D<'float32'>;

  private loss(labels: dl.Array2D<'float32'>, ys: dl.Array2D<'float32'>):
      dl.Scalar {
    return this.math.mean(this.math.softmaxCrossEntropyWithLogits(
               labels, ys)) as dl.Scalar;
  }

  private setFCModel() {
    const m = this.math;
    const w1 = dl.variable(dl.Array2D.zeros([this.IMAGE_SIZE, 30]));
    const w2 = dl.variable(dl.Array2D.zeros([30, 60]));
    const w3 = dl.variable(dl.Array2D.zeros([60, this.LABELS_SIZE]));
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
      return dl.variable(dl.Array4D.zeros(shape));
    }

    function biasVar(size: number) {
      return dl.variable(dl.Array1D.zeros([size]));
    }

    function fcVar(shape: [number, number]) {
      return dl.variable(dl.Array2D.zeros(shape));
    }

    function conv2d(image: dl.Array4D, filter: dl.Array4D, bias: dl.Array1D):
        dl.Array4D<'float32'> {
      return m.conv2d(image, filter, bias, [1, 1, 1, 1], 'same') as
          dl.Array4D<'float32'>;
    }

    function maxPool2x2(image: dl.Array4D): dl.Array4D<'float32'> {
      return m.maxPool(image, 2, 2, 'same') as dl.Array4D<'float32'>;
    }

    const filter1 = filterVar([3, 3, 1, 4]);
    const filter1Bias = biasVar(4);

    const filter2 = filterVar([3, 3, 4, 8]);
    const filter2Bias = biasVar(8);

    const fc1W = fcVar([7 * 7 * 8, 10]);
    const fc1Bias = biasVar(10);

    this.model = xs => {
      const image = xs.as4D(-1, 28, 28, 1);
      const conv1 = m.relu(conv2d(image, filter1, filter1Bias));
      const pool1 = maxPool2x2(conv1);

      const conv2 = m.relu(conv2d(pool1, filter2, filter2Bias));
      const pool2 = maxPool2x2(conv2);

      const fc1 = m.add(m.matMul(pool2.as2D(-1, 7 * 7 * 8), fc1W), fc1Bias) as
          dl.Array2D<'float32'>;
      return fc1;
    };
  }

  private genRandDirs(): {[name: string]: dl.Array2D<'float32'>} {
    const randDirs: {[name: string]: dl.Array2D<'float32'>} = {};
    for (const varName in this.math.registeredVariables) {
      randDirs[varName] = this.math.scope(() => {
        const v = this.math.registeredVariables[varName];
        const lastDim = v.shape[v.shape.length - 1];
        const w = v.as2D(-1, lastDim);
        const dir = dl.Array2D.randNormal(w.shape, 0, 1, 'float32');
        const dirNorm = this.math.norm(dir, 'euclidean', 0);
        return this.math.divide(dir, dirNorm);
      });
    }
    return randDirs;
  }

  private genDirs(index: number): {[name: string]: dl.Array1D<'float32'>} {
    const dirs: {[name: string]: dl.Array1D<'float32'>} = {};
    for (const varName in this.math.registeredVariables) {
      dirs[varName] = this.math.scope(() => {
        const v =
            this.math.registeredVariables[varName] as dl.NDArray<'float32'>;
        const lastDim = v.shape[v.shape.length - 1];
        const w = v.as2D(-1, lastDim);
        const wNorm = this.math.norm(w, 'euclidean', 0);
        const randDir = this.randDirs[index][varName];
        return this.math.multiply(randDir, wNorm).flatten();
      });
    }
    return dirs;
  }

  private disposeRandDirs(index: number) {
    const randDir = this.randDirs[index];
    for (const name in randDir) {
      randDir[name].dispose();
    }
  }

  private disposeAllVars() {
    for (const varName in this.math.registeredVariables) {
      this.math.registeredVariables[varName].dispose();
      delete this.math.registeredVariables[varName];
    }
  }
}
