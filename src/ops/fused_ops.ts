/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

export type Activation = {
  layersKey: string; webglBackendUnaryopKey: string; kernelKey: string;
};

export enum FusableActivation {
  RELU,
  LINEAR
}

function createActivation(
    layersKey: string, webglBackendUnaryopKey?: string,
    kernelKey?: string): Activation {
  return {
    layersKey,
    webglBackendUnaryopKey: webglBackendUnaryopKey || layersKey.toUpperCase(),
    kernelKey: kernelKey || layersKey.toLowerCase()
  };
}

export const activationMap = new Map<FusableActivation, Activation>([
  [FusableActivation.RELU, createActivation('Relu', 'RELU', 'relu')],
  [FusableActivation.LINEAR, createActivation('linear')]
]);

import {ENV} from '../environment';
import * as util from '../util';
import {op} from '../ops/operation';
import {Tensor, Tensor3D} from '../tensor';
import {TensorLike} from '../types';
import {makeTypesMatch} from '../tensor_util';
import {convertToTensor} from '../tensor_util_env';

/**
 * Computes the dot product of two matrices with optional activation and bias.
 *
 * ```js
 * const a = tf.tensor2d([-1, -2], [1, 2]);
 * const b = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 * const c = tf.tensor2d([1, 2], [1, 2]);
 *
 * tf.fused.matMul(a, b, false, false, 'relu', c);
 * ```
 *
 * @param a First matrix in dot product operation.
 * @param b Second matrix in dot product operation.
 * @param transposeA If true, `a` is transposed before multiplication.
 * @param transposeB If true, `b` is transposed before multiplication.
 * @param activation Name of activation kernel (defaults to `linear`).
 * @param bias Matrix to be added to the result.
 */
/** @doc {heading: 'Operations', subheading: 'Matrices'} */
function matMul_<T extends Tensor>(
    a: T|TensorLike, b: T|TensorLike, transposeA = false, transposeB = false,
    activation = 'linear', bias?: T|TensorLike): T {
  let fusedMatch: FusableActivation;
  for (const [key, value] of activationMap) {
    if (activation === value.kernelKey) {
      fusedMatch = key;
      break;
    }
  }

  util.assert(
      fusedMatch != null,
      `Error in fused matMul: activation ${activation}` +
          ` has not been implemented.`);

  let $a = convertToTensor(a, 'a', 'fused matMul');
  let $b = convertToTensor(b, 'b', 'fused matMul');
  [$a, $b] = makeTypesMatch($a, $b);

  const innerShapeA =
      transposeA ? $a.shape[$a.rank - 2] : $a.shape[$a.rank - 1];
  const innerShapeB =
      transposeB ? $b.shape[$b.rank - 1] : $b.shape[$b.rank - 2];

  const outerShapeA =
      transposeA ? $a.shape[$a.rank - 1] : $a.shape[$a.rank - 2];
  const outerShapeB =
      transposeB ? $b.shape[$b.rank - 2] : $b.shape[$b.rank - 1];

  const outerDimsA = $a.shape.slice(0, -2);
  const outerDimsB = $b.shape.slice(0, -2);
  const batchDimA = util.sizeFromShape(outerDimsA);
  const batchDimB = util.sizeFromShape(outerDimsB);

  util.assert(
      $a.rank >= 2 && $b.rank >= 2 && $a.rank === $b.rank,
      `Error in fused matMul: inputs must have the same rank of at least 2, ` +
          `got ranks ${$a.rank} and ${$b.rank}.`);

  util.assert(
      util.arraysEqual(outerDimsA, outerDimsB),
      `Error in fused matMul: outer dimensions (${outerDimsA}) and (` +
          `${outerDimsB}) of Tensors with shapes ${$a.shape} and ` +
          `${$b.shape} must match.`);

  util.assert(
      innerShapeA === innerShapeB,
      `Error in fused matMul: inner shapes (${innerShapeA}) and (` +
          `${innerShapeB}) of Tensors with shapes ${$a.shape} and ` +
          `${$b.shape} and transposeA=${transposeA}` +
          ` and transposeB=${transposeB} must match.`);

  const outShape = $a.shape.slice(0, -2).concat([outerShapeA, outerShapeB]);

  const a3D = transposeA ? $a.as3D(batchDimA, innerShapeA, outerShapeA) :
                           $a.as3D(batchDimA, outerShapeA, innerShapeA);
  const b3D = transposeB ? $b.as3D(batchDimB, outerShapeB, innerShapeB) :
                           $b.as3D(batchDimB, innerShapeB, outerShapeB);
  let bias3D: Tensor3D;
  if (bias) {
    let $bias = convertToTensor(bias, 'bias', 'fused matMul');
    [$bias] = makeTypesMatch($bias, $a);

    const rowsBias = $bias.shape[$bias.rank - 2];
    const colsBias = $bias.shape[$bias.rank - 1];

    util.assert(
        outerShapeA === rowsBias && outerShapeB === colsBias,
        `Error in fused matMul: inner dimensions of bias shape ${
            $bias.shape} must match outer shapes (${outerShapeA}) and (${
            outerShapeB}) of Tensors with shapes ${$a.shape} and ${$b.shape}`);

    bias3D = $bias.as3D(batchDimA, rowsBias, colsBias);
  }

  const grad = (dy: Tensor3D, saved: Tensor[]) => {
    const [y] = saved;

    let dyActivation = dy;
    if (fusedMatch === FusableActivation.RELU) {
      dyActivation = dy.mul(y.step()) as Tensor3D;
    }

    if (!transposeA && !transposeB) {
      return {
        $a: () => dyActivation.matMul(b3D, false, true),
        $b: () => a3D.matMul(dyActivation, true, false)
      };
    } else if (!transposeA && transposeB) {
      return {
        $a: () => dyActivation.matMul(b3D, false, false),
        $b: () => dyActivation.matMul(a3D, true, false)
      };
    } else if (transposeA && !transposeB) {
      return {
        $a: () => b3D.matMul(dyActivation, false, true),
        $b: () => a3D.matMul(dyActivation, false, false)
      };
    } else {
      return {
        $a: () => b3D.matMul(dyActivation, true, true),
        $b: () => dyActivation.matMul(a3D, true, true)
      };
    }
  };

  const res = ENV.engine.runKernel(
      (backend, save) => save(backend.batchMatMulWithActivationBias(
          a3D, b3D, transposeA, transposeB, activationMap.get(fusedMatch),
          bias3D)),
      {$a: a3D, $b: b3D}, grad);
  return res.reshape(outShape) as T;
}

export const matMul = op({matMul_});