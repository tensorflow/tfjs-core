import Vue from 'vue';
import App from './App.vue';
import {MnistData} from './data';
import * as model from './model';
import {WeightInit} from './model';
import * as ui from './ui';

let data: MnistData;

export async function init() {
  // tslint:disable-next-line:no-unused-expression
  new Vue({el: '#app', render: h => h(App)});
  ui.init();
  model.init();
  data = new MnistData();
  await data.load();
  ui.dataLoaded();
  const lossData = await model.computeLandscape(data);
  ui.plot(lossData);
}

export async function trainClicked() {
  let start = performance.now();
  const cost = await model.train(data);
  console.log('training took', performance.now() - start, 'ms');
  ui.trainingLog(cost.toString());
  start = performance.now();
  const lossData = await model.computeLandscape(data);
  console.log('landscape took', performance.now() - start, 'ms');
  ui.plot(lossData);
}

export async function changeWeightsInit(selection: WeightInit) {
  model.reinitWeights(selection);
  const lossData = await model.computeLandscape(data);
  ui.plot(lossData);
}
