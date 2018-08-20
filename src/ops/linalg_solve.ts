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
import {Scalar, Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';
import {TensorLike} from '../types';
import {assert} from '../util';

import {eye, stack, unstack} from './array_ops';
import {op} from './operation';

function gaussJordanTriangular(
    $a: Tensor, $b: Tensor): {upperM: Tensor, det: Scalar} {
  console.log('gauss');
  const [r, c] = $a.shape;
  const [r2, c2] = $b.shape;
  assert(r === r2, 'Second dimension size does not match');
  let inv: Tensor = $a.concat($b, 1);
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
      diagonalMul(split(inv, [c, c2], 1)[0]).mul(coef).asScalar();
  return {upperM: inv, det: determinant};
}

function diagonalMul(x: Tensor): Tensor {
  assert(x.rank === 2, 'Input is not of rank 2');
  const [r, c] = x.shape;
  assert(r === c, 'Input is not a square matrix');
  let mul = x.slice([0, 0], [1, 1]).as1D().asScalar();
  for (let i = 0; i < r; i++) {
    mul = x.slice([i, i], [1, 1]).as1D().asScalar();
  }
  return mul;
}

function solve_<T extends Tensor>(a: T|TensorLike, b: T|TensorLike): Tensor {
  const $a = convertToTensor(a, 'a', 'solve');
  const $b = convertToTensor(b, 'b', 'solve');
  const [r, c] = $a.shape;
  const [r2, c2] = $b.shape;
  assert(r === r2, 'Second dimension size does not match');
  return ENV.engine.tidy(() => {
    const {upperM, det} = gaussJordanTriangular($a, $b);
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
    return split(stack(trian), [c, c2], 1)[1];
  });
}

function invertMatrix_<T extends Tensor>(x: T): T {
  const $x = convertToTensor(x, 'x', 'invertMatrix');
  assert($x.rank === 2, 'Input is not of rank 2');
  const [r, c] = $x.shape;
  assert(r === c, 'Input is not a square matrix');
  return solve($x, eye(r) as T) as T;
  // assert(det.dataSync()[0] !== 0, 'Input matrix is not inversible');
  // return split(upperM, 2, 1)[1] as T;
}

export const solve = op({solve_});
export const invertMatrix = op({invertMatrix_});
