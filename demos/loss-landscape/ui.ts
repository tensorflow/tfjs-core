import * as controller from './controller';
import {WeightInit} from './model';

let statusElement: HTMLElement;
let messageElement: HTMLElement;
// tslint:disable-next-line:no-any
declare const Plotly: any;

export function init() {
  statusElement = document.getElementById('status');
  messageElement = document.getElementById('message');
  const trainButton = document.getElementById('train') as HTMLButtonElement;
  trainButton.onclick = async () => {
    trainButton.disabled = true;
    trainButton.textContent = 'Training...';
    await controller.trainClicked();
    trainButton.disabled = false;
    trainButton.textContent = 'Train';
  };
  const weightInitSelect =
      document.getElementById('weight-init') as HTMLSelectElement;
  weightInitSelect.onchange = () => {
    const selection = weightInitSelect.value as WeightInit;
    controller.changeWeightsInit(selection);
  };
}

export function isTraining() {
  statusElement.innerText = 'Training...';
}
export function trainingLog(message: string) {
  messageElement.innerText = `${message}\n`;
  console.log(message);
}

export function dataLoaded() {
  statusElement.textContent = '';
}

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
