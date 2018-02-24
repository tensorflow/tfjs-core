import * as dl from 'deeplearn';
import {MnistData} from './data';
import * as model from './model';

let data: MnistData;
async function load() {
  data = new MnistData();
  await data.load();
}

async function train() {
  await model.train(data);
}

// async function test() {
//   const testExamples = 50;
//   const batch = data.nextTestBatch(testExamples);
//   const predictions = model.predict(batch.xs);
//   const labels = model.classesFromLabel(batch.labels);

//   ui.showTestResults(batch, predictions, labels);
// }

async function mnist() {
  await load();
  await train();
  console.log(dl.memory());
  // test();
}
mnist();
