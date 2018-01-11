import * as controller from './controller';
import * as model from './model';
import {WeightInit} from './model';

export function isTraining() {
  statusElement.innerText = 'Training...';
}
export function trainingLog(message: string) {
  messageElement.innerText = `${message}\n`;
  console.log(message);
}

let statusElement: HTMLElement;
let messageElement: HTMLElement;

export function setup() {
  statusElement = document.getElementById('status');
  messageElement = document.getElementById('message');
  const trainButton = document.getElementById('train');
  trainButton.onclick = () => {
    controller.trainClicked();
  };
  const weightInitSelect =
      document.getElementById('weight-init') as HTMLSelectElement;
  weightInitSelect.onchange = () => {
    const selection = weightInitSelect.value as WeightInit;
    model.changeWeights(selection);
  };
}

// tslint:disable-next-line:no-any
declare const Plotly: any;

export async function plot(zData: number[][]) {
  const data = [{z: zData, type: 'contour', showscale: false}];
  const layout = {
    title: 'Loss surface',
    autosize: false,
    showlegend: false,
    width: 300,
    height: 300,
    ncontours: 15,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    }
  };
  // tslint:disable-next-line:no-any
  return Plotly.newPlot('chart', data as any, layout, {displayModeBar: false});
}
