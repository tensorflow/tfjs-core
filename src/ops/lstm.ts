/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {doc} from '../doc';
import {Scalar, Tensor1D, Tensor2D} from '../tensor';
import {assertArgumentsAreTensors} from '../tensor_util';
import {assertArgIsTensorArr, convertToTensor} from '../tensor_util';
import {TensorLike} from '../types';

import {operation} from './operation';

/**
 * @docalias (data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D]
 */
export type LSTMCellFunc = {
  (data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D];
};

export class LSTMOps {
  /**
   * Computes the next states and outputs of a stack of LSTMCells.
   *
   * Each cell output is used as input to the next cell.
   *
   * Returns `[cellState, cellOutput]`.
   *
   * Derived from tf.contrib.rn.MultiRNNCell.
   *
   * @param lstmCells Array of LSTMCell functions.
   * @param data The input to the cell.
   * @param c Array of previous cell states.
   * @param h Array of previous cell outputs.
   */
  @doc({heading: 'Operations', subheading: 'RNN'})
  @operation
  static multiRNNCell(
      lstmCells: LSTMCellFunc[], data: Tensor2D|TensorLike,
      c: Tensor2D[]|TensorLike[],
      h: Tensor2D[]|TensorLike[]): [Tensor2D[], Tensor2D[]] {
    const $data = convertToTensor(data, 'data', 'multiRNNCell');
    const $c = assertArgIsTensorArr(c, 'c', 'multiRNNCell');
    const $h = assertArgIsTensorArr(h, 'h', 'multiRNNCell');

    let input = $data;
    const newStates = [];
    for (let i = 0; i < lstmCells.length; i++) {
      const output = lstmCells[i](input, $c[i], $h[i]);
      newStates.push(output[0]);
      newStates.push(output[1]);
      input = output[1];
    }
    const newC: Tensor2D[] = [];
    const newH: Tensor2D[] = [];
    for (let i = 0; i < newStates.length; i += 2) {
      newC.push(newStates[i]);
      newH.push(newStates[i + 1]);
    }
    return [newC, newH];
  }

  /**
   * Computes the next state and output of a BasicLSTMCell.
   *
   * Returns `[newC, newH]`.
   *
   * Derived from tf.contrib.rnn.BasicLSTMCell.
   *
   * @param forgetBias Forget bias for the cell.
   * @param lstmKernel The weights for the cell.
   * @param lstmBias The bias for the cell.
   * @param data The input to the cell.
   * @param c Previous cell state.
   * @param h Previous cell output.
   */
  @doc({heading: 'Operations', subheading: 'RNN'})
  @operation
  static basicLSTMCell(
      forgetBias: Scalar, lstmKernel: Tensor2D, lstmBias: Tensor1D,
      data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D] {
    assertArgumentsAreTensors(
        {forgetBias, lstmKernel, lstmBias, data, c, h}, 'basicLSTMCell');

    const combined = data.concat(h, 1);
    const weighted = combined.matMul(lstmKernel);
    const res = weighted.add(lstmBias) as Tensor2D;

    // i = input_gate, j = new_input, f = forget_gate, o = output_gate
    const batchSize = res.shape[0];
    const sliceCols = res.shape[1] / 4;
    const sliceSize: [number, number] = [batchSize, sliceCols];
    const i = res.slice([0, 0], sliceSize);
    const j = res.slice([0, sliceCols], sliceSize);
    const f = res.slice([0, sliceCols * 2], sliceSize);
    const o = res.slice([0, sliceCols * 3], sliceSize);

    const newC = i.sigmoid().mulStrict(j.tanh()).addStrict(
        c.mulStrict(forgetBias.add(f).sigmoid() as Tensor2D));
    const newH = newC.tanh().mulStrict(o.sigmoid());
    return [newC, newH];
  }
}
