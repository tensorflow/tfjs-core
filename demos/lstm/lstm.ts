/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import {Array1D, Array2D, Array3D, CheckpointLoader, Graph, NDArray, NDArrayInitializer, NDArrayMath, NDArrayMathGPU, Scalar, Session, Tensor} from '../deeplearnjs';

// manifest.json lives in the same directory.
const reader = new CheckpointLoader('.');
reader.getAllVariables().then(vars => {
  const input_data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8];
  const expected = [1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4];
  const math = new NDArrayMathGPU();

  const lstmKernel1 = vars[
      'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/kernel'] as Array2D;
  const lstmBias1 = vars[
      'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/bias'] as Array1D;

  const lstmKernel2 = vars[
      'rnn/multi_rnn_cell/cell_1/basic_lstm_cell/kernel'] as Array2D;
  const lstmBias2 = vars[
      'rnn/multi_rnn_cell/cell_1/basic_lstm_cell/bias'] as Array1D;

  const fullyConnectedBiases = vars['fully_connected/biases'] as Array1D;
  const fullyConnectedWeights = vars['fully_connected/weights'] as Array2D;

  const output_data:number[] = [];

  math.scope((keep, track) => {
    const forgetBias = track(Scalar.new(1.0));
    const lstm1 = math.basicLSTMCell.bind(forgetBias, lstmKernel1, lstmBias1);
    const lstm2 = math.basicLSTMCell.bind(forgetBias, lstmKernel2, lstmBias2);

    let c = [track(Array2D.zeros([1, lstmBias1.shape[0] / 4])),
        track(Array2D.zeros([1, lstmBias2.shape[0] / 4]))];
    let h = [track(Array2D.zeros([1, lstmBias1.shape[0] / 4])),
        track(Array2D.zeros([1, lstmBias2.shape[0] / 4]))];
    for (var input of input_data) {
      const onehot = track(Array1D.zeros([10]));
      onehot.set(1.0, input);

      const output = math.multiRNNCell([lstm1, lstm2], onehot, c, h);

      c = output[0];
      h = output[1];

      const output_h = h[1];
      const weightedResult = math.matMul(output_h, fullyConnectedWeights);
      const weightedResult1D = math.reshape(
          weightedResult, [fullyConnectedBiases.shape[0]]) as Array1D;
      const logits = math.add(
        weightedResult1D,
        fullyConnectedBiases);

      output_data.push(math.argMax(logits).get());
    }
  });
  document.getElementById('expected').innerHTML = '' + expected;
  document.getElementById('results').innerHTML = '' + output_data;
});
