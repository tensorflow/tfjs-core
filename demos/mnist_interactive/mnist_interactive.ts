/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {Array1D, Array2D, CheckpointLoader, ENV, NDArray, Scalar}
  from 'deeplearn';
export class Main {
  private canvas:HTMLCanvasElement;
  private inputCanvas:HTMLCanvasElement;
  private ctx:CanvasRenderingContext2D;
  private prev:{[varName: string]: number};
  private drawing=false;
  private reader:CheckpointLoader;
  private allVaribales:{[varName: string]: NDArray};
  constructor() {
    this.canvas = document.getElementById('main') as HTMLCanvasElement;
    this.inputCanvas = document.getElementById('input') as HTMLCanvasElement;
    this.canvas.width  = 449; // 16 * 28 + 1
    this.canvas.height = 449; // 16 * 28 + 1
    this.ctx = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup',   this.onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.reader = new CheckpointLoader('.');
    this.reader.getAllVariables().then(vars => {
      this.allVaribales=vars;
      this.initialize();
    });
  }
  initialize() {
    document.getElementById('predictedLabel').innerHTML = ``;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, 449, 449);
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(0, 0, 449, 449);
    this.ctx.lineWidth = 0.05;
    for (let i = 0; i < 27; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo((i + 1) * 16,   0);
      this.ctx.lineTo((i + 1) * 16, 449);
      this.ctx.closePath();
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(  0, (i + 1) * 16);
      this.ctx.lineTo(449, (i + 1) * 16);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    this.drawInput();
  }
  onMouseDown(e:MouseEvent) {
    this.canvas.style.cursor = 'default';
    this.drawing = true;
    this.prev = this.getPosition(e.clientX, e.clientY);
  }
  onMouseUp() {
    this.drawing = false;
    this.drawInput();
  }
  onMouseMove(e:MouseEvent) {
    if (this.drawing) {
      const curr = this.getPosition(e.clientX, e.clientY);
      this.ctx.lineWidth = 16;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.prev.x, this.prev.y);
      this.ctx.lineTo(curr.x, curr.y);
      this.ctx.stroke();
      this.ctx.closePath();
      this.prev = curr;
    }
  }
  getPosition(clientX:number, clientY:number) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  drawInput() {
    const ctx = this.inputCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const inputs:number[] = [];
      const small = document.createElement('canvas').getContext('2d');
      small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28);
      const data = small.getImageData(0, 0, 28, 28).data;
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          const n = 4 * (i * 28 + j);
          inputs[i * 28 + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
          ctx.fillStyle =
            'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
          ctx.fillRect(j * 5, i * 5, 5, 5);
        }
      }
      if (Math.min(...inputs) === 255) {
        return;
      }
      for (let i = inputs.length - 1; i >= 0; i--) {
        inputs[i]=Number(((255-inputs[i])/255).toFixed(3));
      }
      const x = Array1D.new(inputs);
      // Infer through the model to get a prediction.
      infer(x, this.allVaribales).val().then(val=>{
        const predictedLabel = Math.round(val);
        document.getElementById('predictedLabel').innerHTML
        = `${predictedLabel}`;
      });
    };
    img.src = this.canvas.toDataURL();
  }
}
const main=new Main();
document.getElementById('clear')
  .addEventListener('click', () => {
    main.initialize();
  });
/**
 * Infers through a 3-layer fully connected MNIST model using the Math API. This
 * is the lowest level user-facing API in deeplearn.js giving the most control
 * to the user. Math commands execute immediately, like numpy.
 */
export function infer(
  x: Array1D, vars: {[varName: string]: NDArray}): Scalar<'int32'> {
  const hidden1W = vars['hidden1/weights'] as Array2D;
  const hidden1B = vars['hidden1/biases'] as Array1D;
  const hidden2W = vars['hidden2/weights'] as Array2D;
  const hidden2B = vars['hidden2/biases'] as Array1D;
  const softmaxW = vars['softmax_linear/weights'] as Array2D;
  const softmaxB = vars['softmax_linear/biases'] as Array1D;
  const math = ENV.math;
  const hidden1 =
      math.relu(math.add(math.vectorTimesMatrix(x, hidden1W), hidden1B)) as
      Array1D;
  const hidden2 =
      math.relu(math.add(
          math.vectorTimesMatrix(hidden1, hidden2W), hidden2B)) as Array1D;

  const logits = math.add(math.vectorTimesMatrix(hidden2, softmaxW), softmaxB);

  return math.argMax(logits);
}