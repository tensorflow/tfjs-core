import Vue from 'vue';
import App from './App.vue';
import {MnistData} from './data';
import * as model from './model';
import * as ui from './ui';

// tslint:disable-next-line:no-unused-expression
new Vue({el: '#app', render: h => h(App)});

const data = new MnistData();
data.load();
ui.setup();

export async function trainClicked() {
  model.train(data, ui.trainingLog);
  const lossData = await model.evaluateLoss(data);
  ui.plot(lossData);
}
