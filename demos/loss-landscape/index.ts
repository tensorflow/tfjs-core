import * as dl from 'deeplearn';
import Vue from 'vue';
import App from './App.vue';
import {MnistData} from './data';
import * as model from './model';
import * as plot from './plot';
import * as ui from './ui';

// tslint:disable-next-line:no-unused-expression
new Vue({el: '#app', render: h => h(App)});

const math = dl.ENV.math;

let data: MnistData;
async function load() {
  data = new MnistData();
  await data.load();
}

async function train() {
  ui.isTraining();
  await model.train(data, ui.trainingLog);
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

const stepsPerDir = 20;
const alphas: Array<dl.Scalar<'float32'>> = [];
for (let i = 0; i <= stepsPerDir; i++) {
  alphas.push(dl.Scalar.new(2 * (i / stepsPerDir) - 1));
}

let lastChart: {remove(): void} = null;

async function evaluateLoss() {
  const start = performance.now();
  const losses: Array<Promise<number>> = [];
  const batchSize = 50;
  const batch = data.nextTestBatch(batchSize);
  const dirs1 = genDirections();
  const dirs2 = genDirections();
  const vs: {[name: string]: dl.Array1D} = {};
  for (const varName in math.registeredVariables) {
    vs[varName] = math.registeredVariables[varName].flatten();
  }
  for (let i = 0; i <= stepsPerDir; i++) {
    for (let j = 0; j <= stepsPerDir; j++) {
      const loss = math.scope(() => {
        for (const varName in math.registeredVariables) {
          const variable = math.registeredVariables[varName];
          const v = vs[varName];
          const tmp = math.add(v, math.multiply(alphas[i], dirs1[varName]));
          const newVals =
              math.add(tmp, math.multiply(alphas[j], dirs2[varName]))
                  .reshape(variable.shape) as dl.Array2D<'float32'>;
          variable.assign(newVals);
        }
        return model.loss(batch.labels, model.model(batch.xs));
      });
      losses.push(loss.val());
    }
  }
  const lossVals = await Promise.all(losses);
  const matrix: number[][] = [];
  for (let i = 0; i <= stepsPerDir; i++) {
    const row: number[] = [];
    for (let j = 0; j <= stepsPerDir; j++) {
      const index = i * (stepsPerDir + 1) + j;
      row.push(lossVals[index]);
    }
    matrix.push(row);
  }
  if (lastChart != null) {
    lastChart.remove();
  }
  lastChart = await plot.plot(matrix);
  console.log(performance.now() - start, 'ms');
}

async function mnist() {
  console.log('num arrays before load', math.getNumArrays());
  await load();
  console.log('num arrays before train', math.getNumArrays());
  await train();
  console.log('num arrays before evaluateLoss', math.getNumArrays());
  await math.scope(() => evaluateLoss());
  console.log('num arrays after', math.getNumArrays());
}
mnist();
