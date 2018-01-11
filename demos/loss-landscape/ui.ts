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
  const weightInitSelect =
      document.getElementById('weight-init') as HTMLSelectElement;
  weightInitSelect.onchange = () => {
    const selection = weightInitSelect.value as WeightInit;
    model.changeWeights(selection);
  };
}
