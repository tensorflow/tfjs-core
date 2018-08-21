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

import {scalar, split, tensor1d} from '..';
import {ENV} from '../environment';
import {Scalar, Tensor, Tensor2D} from '../tensor';
import {assert} from '../util';

import {eye, stack, unstack} from './array_ops';
import {op} from './operation';

function gaussJordanTriangular(
    a: Tensor2D, b: Tensor2D): {upperM: Tensor2D, det: Scalar} {
  console.log('gauss');
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
  console.log('coef', coef.dataSync()[0]);
  const determinant =
      diagonalMul(split(inv, [c, c2], 1)[0] as Tensor2D).div(coef).asScalar();
  console.log('determinant', determinant.dataSync()[0]);
  return {upperM: inv as Tensor2D, det: determinant};
}

function diagonalMul(x: Tensor2D): Scalar {
  const [r, c] = x.shape;
  console.log('diag');
  x.print();
  assert(r === c, 'Input is not a square matrix');
  let mul = x.slice([0, 0], [1, 1]).as1D().asScalar();
  for (let i = 0; i < r; i++) {
    mul = x.slice([i, i], [1, 1]).as1D().asScalar();
  }
  return mul;
}

function solve_(a: Tensor2D, b: Tensor2D): Tensor2D {
  const [r, c] = a.shape;
  const [r2, c2] = b.shape;
  assert(r === r2, 'Second dimension size does not match');
  return ENV.engine.tidy(() => {
    const {upperM, det} = gaussJordanTriangular(a, b);
    console.log('determinant', det);
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

function invertMatrix_(x: Tensor2D): Tensor2D {
  const [r, c] = x.shape;
  assert(r === c, 'Input is not a square matrix');
  return solve(x, eye(r));
}

function det_(m: Tensor2D): Scalar {
  return gaussJordanTriangular(m, eye(m.shape[0]) as Tensor2D).det;
}

function adjointM_(m: Tensor2D): Tensor2D {
  /* const [r, c] = m.shape;
  assert(r === c, 'Input is not a square matrix');
  const rows = Array.from({length: r}, (v, i) => i);
  const dets: Tensor1D[] = [];
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < r; j++) {
      const mSub = m.gather(tensor1d(rows.filter(e => e !== i), 'int32'));
      mSub.print();
      let sli;
      if (j === 0) {
        sli = mSub.slice([0, 1], [r - 1, r - 1]);
      } else if (j === r - 1) {
        sli = mSub.slice([0, 0], [r - 1, r - 1]);
      } else {
        const [a, b, c] = split(mSub, [j, 1, r - (j + 1)], 1);
        a.print();
        c.print();
        b.dispose();
        sli = concat([a, c], 1);
        sli.print();
      }
      dets.push(
          scalar(Math.pow(-1, (i + j)))
              .mul(gaussJordanTriangular(sli, eye(sli.shape[0]) as Tensor2D)
                       .det.as1D()));
    }
  }
  const adjM = transpose(concat(dets).reshape([r, r]));
  return adjM as Tensor2D; */
  return invertMatrix(m).mul(det(m));
}

export const solve = op({solve_});
export const invertMatrix = op({invertMatrix_});
export const adjM = op({adjointM_});
export const det = op({det_});
