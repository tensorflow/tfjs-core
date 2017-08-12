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
  const INPUT_SIZE = 388;
  const GENERATE_STEPS = 50;

  const PRIMER_IDX = 355; // shift 1s.

  const math = new NDArrayMathGPU();

  const lstmKernel1 = vars[
      'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/kernel'] as Array2D;
  const lstmBias1 = vars[
      'rnn/multi_rnn_cell/cell_0/basic_lstm_cell/bias'] as Array1D;

  const lstmKernel2 = vars[
      'rnn/multi_rnn_cell/cell_1/basic_lstm_cell/kernel'] as Array2D;
  const lstmBias2 = vars[
      'rnn/multi_rnn_cell/cell_1/basic_lstm_cell/bias'] as Array1D;

  const lstmKernel3 = vars[
      'rnn/multi_rnn_cell/cell_2/basic_lstm_cell/kernel'] as Array2D;
  const lstmBias3 = vars[
      'rnn/multi_rnn_cell/cell_2/basic_lstm_cell/bias'] as Array1D;

  const fullyConnectedBiases = vars['fully_connected/biases'] as Array1D;
  const fullyConnectedWeights = vars['fully_connected/weights'] as Array2D;

  const output_data:number[] = [];

  math.scope((keep, track) => {
    const lstm1 = buildBasicLSTMCell(math, lstmKernel1, lstmBias1);
    const lstm2 = buildBasicLSTMCell(math, lstmKernel2, lstmBias2);
    const lstm3 = buildBasicLSTMCell(math, lstmKernel3, lstmBias3);
    const lstm = buildMultiRNNCell(math, [lstm1, lstm2, lstm3]);

    let c = [
        track(Array2D.zeros([1, lstmBias1.shape[0] / 4])),
        track(Array2D.zeros([1, lstmBias2.shape[0] / 4])),
        track(Array2D.zeros([1, lstmBias3.shape[0] / 4])),
        ];
    let h = [
        track(Array2D.zeros([1, lstmBias1.shape[0] / 4])),
        track(Array2D.zeros([1, lstmBias2.shape[0] / 4])),
        track(Array2D.zeros([1, lstmBias3.shape[0] / 4])),
        ];

    let input = track(Array1D.zeros([INPUT_SIZE]));
    input.set(1.0, PRIMER_IDX);

    while (output_data.length < GENERATE_STEPS) {
      const output = lstm(input, c, h);

      c = output[0];
      h = output[1];

      // TODO(fjord): need to do memory management with outputs?

      const output_h = h[2];
      const weightedResult = math.matMul(output_h, fullyConnectedWeights);
      const weightedResult1D = math.reshape(
          weightedResult, [fullyConnectedBiases.shape[0]]) as Array1D;
      const logits = math.add(
        weightedResult1D,
        fullyConnectedBiases);

      const softmax = math.softmax(logits).getValues();
      const rand = Scalar.randUniform([], 0, 1).get();
      let cdf = 0;
      let sampled_output = -1;
      for(var i = 0; i < softmax.length; i++) {
        cdf += softmax[i];
        if (cdf > rand) {
          sampled_output = i;
          break;
        }
      }
      if (sampled_output == -1) {
        // This happens when weightedResult is all NaN.
        debugger;
      }

      output_data.push(sampled_output);

      // use output as the next input.
      input = track(Array1D.zeros([INPUT_SIZE]));
      input.set(1.0, sampled_output);
    }
    console.log(output_data);
  });
});


/**
 * Builds a MultiRNNCell.
 * Derived from tf.contrib.rn.MultiRNNCell.
 */
function buildMultiRNNCell(math: NDArrayMath,
    basicLSTMCells: ((data: Array1D, c: Array2D, h: Array2D) => Array2D[])[]):
    (data: Array1D, c: Array2D[], h: Array2D[]) => Array2D[][] {

  return (data: Array1D, c: Array2D[], h: Array2D[]): Array2D[][] => {
    const res = math.scope((keep, track) => {
      let input = data;
      const new_states = []
      for (var i = 0; i < basicLSTMCells.length; i++) {
        const output = basicLSTMCells[i](input, c[i], h[i]);
        new_states.push(output[0]);
        new_states.push(output[1]);
        input = math.reshape(output[1], [output[1].shape[1]]) as Array1D;
      }

      return new_states;
    });
    const new_c:Array2D[] = [];
    const new_h:Array2D[] = [];
    for (var i = 0; i < res.length; i += 2) {
      new_c.push(res[i] as Array2D);
      new_h.push(res[i + 1] as Array2D);
    }
    return [new_c, new_h];
  };
}


/**
 * Builds a BasicLSTMCell.
 * Derived from tf.contrib.rnn.BasicLSTMCell.
 */
function buildBasicLSTMCell(
    math: NDArrayMath, lstmKernel: Array2D, lstmBias: Array1D):
    (data: Array1D, c: Array2D, h: Array2D) => Array2D[] {

  return (data: Array1D, c: Array2D, h: Array2D): Array2D[] => {
    return math.scope((keep, track) => {
      const forget_bias = track(Scalar.new(1.0));

      // concat(inputs, h, 1)
      // There is no concat1d, so reshape inputs and h to 3d, concat, then
      // reshape back to 1d.
      const data3D = math.reshape(
          data, [1, 1, data.shape[0]]) as Array3D;
      const h3D = math.reshape(h, [1, 1, h.shape[1]]) as Array3D;
      const combined3D = math.concat3D(data3D, h3D, 2);
      const combined2D = math.reshape(
          combined3D, [1, data.shape[0] + h.shape[1]]) as Array2D;

      const weighted = math.matMul(combined2D, lstmKernel);

      // tf.nn.bias_add(weighted, lstmBias)
      // There is no broadcast add, but we can assume a batch size of 1,
      // just reshape and do a normal add.
      const weighted1D = math.reshape(weighted, [lstmBias.shape[0]]) as Array1D;
      const res1D = math.add(weighted1D, lstmBias);
      // Convert back to 2D so we can do slice2D operations.
      const res = math.reshape(res1D, [1, res1D.shape[0]]) as Array2D;

      // i = input_gate, j = new_input, f = forget_gate, o = output_gate
      const i = math.slice2D(res, [0, 0], [res.shape[0], res.shape[1] / 4]);
      const j = math.slice2D(res, [0, res.shape[1] / 4 * 1],
          [res.shape[0], res.shape[1] / 4]);
      const f = math.slice2D(res, [0, res.shape[1] / 4 * 2],
          [res.shape[0], res.shape[1] / 4]);
      const o = math.slice2D(res, [0, res.shape[1] / 4 * 3],
          [res.shape[0], res.shape[1] / 4]);

      const new_c = math.add(
          math.elementWiseMul(c,
              math.sigmoid(math.scalarPlusArray(forget_bias, f))),
          math.elementWiseMul(math.sigmoid(i), math.tanh(j)));
      const new_h = math.elementWiseMul(math.tanh(new_c), math.sigmoid(o));

      return [keep(new_c), keep(new_h)];
    });
  };
}
