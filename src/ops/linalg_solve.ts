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

/**
 * Linear algebra resolution.
 */

import { scalar, tensor1d } from './tensor_ops';
import { split } from './array_ops';
import {ENV} from '../environment';
import {Scalar, Tensor, Tensor2D} from '../tensor';
import {assert} from '../util';

import {eye, stack, unstack} from './array_ops';
import {op} from './operation';

/**
 *
 * @param a is a square matrix M (Tensor2d with shape `[r, c]` such that `r ===
 * c`)
 * @param b is a Tensor2d with shape `[r2, c2]`
 * @desc `r === r2`
 * @returns a matrix of shape `[r, c+c2]` after a [jordan-gauss
 * elimination](https://en.wikipedia.org/wiki/Gaussian_elimination) on the
 * matrix given by the concatenation `[a, b]`. The first r or c columns is an
 * upper triangular matrix
 */
function gaussJordanTriangular(
    a: Tensor2D, b: Tensor2D): {upperM: Tensor2D, det: Scalar} {
  const [r, c] = a.shape;
  const [r2, c2] = b.shape;
  assert(r === r2, 'Second dimension size does not match');
  let inv: Tensor = a.concat(b, 1);
  const rows = Array.from({length: r}, (v, i) => i);
  let coef = scalar(1);
  for (let i = 0; i < r; i++) {
    ({inv, coef} = ENV.engine.tidy(() => {
      for (let j = i + 1; j < r; j++) {
        const elt = inv.slice([j, i], [1, 1]).as1D().asScalar();
        const pivot = inv.slice([i, i], [1, 1]).as1D().asScalar();
        if (elt.dataSync()[0] !== 0) {
          const factor = pivot.div(elt);
          coef = coef.mul(factor).mul(scalar(-1));
          const newrow =
              inv.gather(tensor1d([i], 'int32'))
                  .sub(inv.gather(tensor1d([j], 'int32')).mul(factor))
                  .as1D();
          const sli = inv.gather(tensor1d(rows.filter(e => e !== j), 'int32'));
          const arr: Tensor[] = [];
          if (j === 0) {
            arr.push(newrow);
          }
          unstack(sli).forEach((t, ind) => {
            if (ind !== j) {
              arr.push(t);
            } else {
              arr.push(newrow);
              arr.push(t);
            }
          });
          if (j === r - 1) {
            arr.push(newrow);
          }
          inv = stack(arr);
        }
      }
      //  the first c colomns of inv is an upper triangular matrix
      return {inv, coef};
    }));
  }
  const determinant =
      diagonalMul(split(inv, [c, c2], 1)[0] as Tensor2D).div(coef).asScalar();
  return {upperM: inv as Tensor2D, det: determinant};
}

/**
 *
 * @param m Tensor2d or matrix
 * @returns the product of the diagonal elements of @param m as a `tf.scalar`
 */
function diagonalMul(m: Tensor2D): Scalar {
  const [r, c] = m.shape;
  assert(r === c, 'Input is not a square matrix');
  let mul = m.slice([0, 0], [1, 1]).as1D().asScalar();
  for (let i = 0; i < r; i++) {
    mul = m.slice([i, i], [1, 1]).as1D().asScalar();
  }
  return mul;
}

/**
 *
 * @param a is a unique square matrix M or a tensor of shape `[..., M, M]` whose
 * inner-most 2 dimensions form square matrices
 * @param b is a unique matrix M or a tensor of shape `[..., M, M]`
 * @param adjoint is a boolean.
 * If adjoint is false then each output matrix satisfies `a * output = b`
 * (respectively `a[..., :, :] * output[..., :, :] = b[..., :, :]` if the inputs
 * are arrays of matrixes) . If adjoint is true then each output matrix
 * satisfies `adjoint(a) * output = b` (respectively `adjoint(a[..., :, :]) *
 * output[..., :, :] = b[..., :,
 * :]`).
 */
function solve_(
    a: Tensor2D[]|Tensor2D, b: Tensor2D[]|Tensor2D,
    adjoint = false): Tensor2D[]|Tensor2D {
  if (Array.isArray(a) || Array.isArray(b)) {
    assert(
        (a as Tensor2D[]).length === (b as Tensor2D[]).length,
        'Second dimension size does not match');
    const sol: Tensor2D[] = [];
    (a as Tensor2D[]).forEach((m, i) => {
      sol.push(solve_unique_equation(m, (b as Tensor2D[])[i], adjoint));
    });
    return sol;
  } else {
    return solve_unique_equation(a, b, adjoint);
  }
}

// helper to the solve equation
function solve_unique_equation(
    a: Tensor2D, b: Tensor2D, adjoint = false): Tensor2D {
  return ENV.engine.tidy(() => {
    const [r, c] = a.shape;
    const [r2, c2] = b.shape;
    assert(r === r2, 'Second dimension size does not match');
    if (adjoint) {
      a = adjM(a);
    }
    const {upperM, det} = gaussJordanTriangular(a, b);
    assert(det.dataSync()[0] !== 0, 'Input matrix is not inversible');
    const trian = unstack(upperM);
    const len = trian.length;
    trian[len - 1] =
        trian[len - 1].div(trian[len - 1].slice(r - 1, 1).asScalar());
    for (let i = r - 2; i > -1; i--) {
      for (let j = r - 1; j > i; j--) {
        trian[i] = trian[i].sub(trian[j].mul(trian[i].slice(j, 1).asScalar()));
      }
      trian[i] = trian[i].div(trian[i].slice(i, 1).asScalar());
    }
    return split(stack(trian), [c, c2], 1)[1] as Tensor2D;
  });
}

/**
 *
 * @param x square matrix to invert
 * @returns the invert matrix of @param m if inversible
 */
function invertMatrix_(m: Tensor2D): Tensor2D {
  const [r, c] = m.shape;
  assert(r === c, 'Input is not a square matrix');
  return solve(m, eye(r)) as Tensor2D;
}

/**
 *
 * @param m Tensor2d or matrix
 * @returns the determinant of @param m as a `tf.scalar`
 */
function det_(m: Tensor2D): Scalar {
  return gaussJordanTriangular(m, eye(m.shape[0]) as Tensor2D).det;
}

/**
 *
 * @param m Tensor2d or matrix
 * @returns the adjoint of @param m if inversible
 */
function adjointM_(m: Tensor2D): Tensor2D {
  return invertMatrix(m).mul(det(m));
}

export const solve = op({solve_});
export const invertMatrix = op({invertMatrix_});
export const adjM = op({adjointM_});
export const det = op({det_});
