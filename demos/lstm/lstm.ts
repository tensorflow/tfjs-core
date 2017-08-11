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
  const input_data = [6, 0, 9, 0, 2, 5, 9, 6, 7, 0, 8, 1, 7, 9, 9, 1, 2, 4, 9];
  const math = new NDArrayMathGPU();
  const evalMethod = buildModelMathAPI(math, vars);
  math.scope((keep, track) => {
		let c = track(Array2D.zeros([1, 50]));
		let h = track(Array2D.zeros([1, 50]));
		for (var input of input_data) {
			const onehot = track(Array1D.zeros([10]));
			onehot.set(1.0, input);
			const output = evalMethod({
				data: onehot,
				c: c,
				h: h,
			});

			// TODO: memory management?
			console.log(output[0].get());
			output[0].dispose();
			c = output[1] as Array2D;
			h = output[2] as Array2D;
		}
	});
});

interface LSTMInput {
  data: Array1D;
  c: Array2D;
  h: Array2D;
}

/**
 * Builds an LSTM model.
 */
function buildModelMathAPI(
    math: NDArrayMath,
    vars: {[varName: string]: NDArray}): (input: LSTMInput) => NDArray[] {
  const fullyConnectedBiases = vars['fully_connected/biases'] as Array1D;
  const fullyConnectedWeights = vars['fully_connected/weights'] as Array2D;
  const lstmBias = vars['rnn/basic_lstm_cell/bias'] as Array1D;
  const lstmKernel = vars['rnn/basic_lstm_cell/kernel'] as Array2D;

  return (input: LSTMInput): NDArray[] => {
    return math.scope((keep, track) => {
			const forget_bias = track(Scalar.new(1.0));

			// inputs.shape = [10]
      // h.shape = [1, 50]

			// concat(inputs, h, 1)
			// There is no concat1d, so reshape inputs and h to 3d, concat, then reshape back to 1d.
		  const data3D = math.reshape(input.data, [1, 1, input.data.shape[0]]) as Array3D;
			const h3D = math.reshape(input.h, [1, 1, input.h.shape[1]]) as Array3D;
			const combined3D = math.concat3D(data3D, h3D, 2);
			const combined2D = math.reshape(combined3D, [1, input.data.shape[0] + input.h.shape[1]]) as Array2D;

			// combined2D.shape = [1, 60]
			// lstmKernel = [60, 200]

		  const weighted = math.matMul(combined2D, lstmKernel);

			// weighted.shape = [1, 200]
			// lstmBias.shape = [200]

      // tf.nn.bias_add(weighted, lstmBias)
			// There is no broadcast add, but we can assume a batch size of 1, just reshape and do a normal add.
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
				math.elementWiseMul(input.c, math.sigmoid(math.scalarPlusArray(forget_bias, f))),
				math.elementWiseMul(math.sigmoid(i), math.tanh(j)));
      const new_h = math.elementWiseMul(math.tanh(new_c), math.sigmoid(o));

			// new_h.shape = [1, 50]

			// fullyConnectedWeights.shape = [50, 10]
			// fullyConnectedBiases.shape = [10]
			const weightedResult = math.matMul(new_h, fullyConnectedWeights);
			const weightedResult1D = math.reshape(weightedResult, [fullyConnectedBiases.shape[0]]) as Array1D;
      const logits = math.add(
				weightedResult1D,
        fullyConnectedBiases);

      return [keep(math.argMax(logits)), keep(new_c), keep(new_h)];
    });
  };
}
