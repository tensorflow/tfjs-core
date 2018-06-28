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
 * Linear algebra ops.
 */

import {doc} from '../doc';
import {ENV} from '../environment';
import {dispose} from '../globals';
import {Tensor, Tensor1D, Tensor2D} from '../tensor';
import {assert} from '../util';

import {ArrayOps} from './array_ops';
import {NormOps} from './norm';
import {operation} from './operation';
import {ReductionOps} from './reduction_ops';
import {TensorOps} from './tensor_ops';

export class LinalgOps {
  /**
   * Gram-Schmidt orthogonalization.
   *
   * @param xs The vectors to be orthogonalized, in one of the two following
   *   formats:
   *   - An Array of `Tensor1D`.
   *   - A `Tensor2D`, i.e., a matrix, in which case the vectors are the rows
   *     of `xs`.
   *   In each case, all the vectors must have the same length and the length
   *   must be greater than or equal to the number of vectors.
   * @returns The orthogonalized and normalized vectors or matrix.
   *   Orthogonalization means that the vectors or the rows of the matrix
   *   are orthogonal (zero inner products). Normalization means that each
   *   vector or each row of the matrix has an L2 norm that equals `1`.
   */
  @doc({heading: 'Operations', subheading: 'Linear Algebra'})
  @operation
  static gramSchmidt(xs: Tensor1D[]|Tensor2D): Tensor1D[]|Tensor2D {
    let inputIsTensor2D: boolean;
    if (Array.isArray(xs)) {
      inputIsTensor2D = false;
      assert(
          xs != null && xs.length > 0,
          'Gram-Schmidt process: input must not be null, undefined, or empty');
      const dim = xs[0].shape[0];
      for (let i = 1; i < xs.length; ++i) {
        assert(
            xs[i].shape[0] === dim,
            'Gram-Schmidt: Non-unique lengths found in the input vectors: ' +
                `(${xs[i].shape[0]} vs. ${dim})`);
      }
    } else {
      inputIsTensor2D = true;
      xs =
          ArrayOps.split(xs, xs.shape[0], 0).map(x => ArrayOps.squeeze(x, [0]));
    }

    assert(
        xs.length <= xs[0].shape[0],
        `Gram-Schmidt: Number of vectors (${xs.length}) exceeds ` +
            `number of dimensions (${xs[0].shape[0]}).`);

    const ys: Tensor1D[] = [];
    const xs1d = xs as Tensor1D[];
    for (let i = 0; i < xs.length; ++i) {
      ys.push(ENV.engine.tidy(() => {
        let x = xs1d[i];
        if (i > 0) {
          for (let j = 0; j < i; ++j) {
            const proj = ReductionOps.sum(ys[j].mulStrict(x)).mul(ys[j]);
            x = x.sub(proj);
          }
        }
        return x.div(NormOps.norm(x, 'euclidean'));
      }));
    }

    if (inputIsTensor2D) {
      return ArrayOps.stack(ys, 0) as Tensor2D;
    } else {
      return ys;
    }
  }

  /**
   * Compute QR decomposition of m-by-n matrix using Householder transformation.
   *
   * Requires `m >= n`.
   *
   * Implementation based on
   *   [http://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf]
   * (http://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf)
   *
   * @param x The `Tensor` to be QR-decomposed. Must have rank >= 2. Suppose
   *   it has the shape `[..., M, N]`. Currently it is required that `M >= N`.
   * @param fullMatrices An optional boolean parameter. Defaults to `false`.
   *   If `true`, compute full-sized `Q`. If `false` (the default),
   *   compute only the leading N columns of `Q` and `R`.
   * @return An `Array` of two `Tensor`s: `[Q, R]`. `Q` is a unitary matrix,
   *   i.e., its columns all have unit norm and are mutually orthogonal.
   *   If `M >= N`,
   *     If `fullMatrices` is `false` (default),
   *       - `Q` has a shape of `[..., M, N]`,
   *       - `R` has a shape of `[..., N, N]`.
   *     If `fullMatrices` is `true` (default),
   *       - `Q` has a shape of `[..., M, M]`,
   *       - `R` has a shape of `[...,  M, N]`.
   *   If `M < N`,
   *     - `Q` has a shape of `[..., M, M]`,
   *     - `R` has a shape of `[..., M, N]`.
   * @throws If the rank of `x` is less than 2.
   */
  @doc({heading: 'Operations', subheading: 'Linear Algebra'})
  @operation
  static qr(x: Tensor, fullMatrices = false): [Tensor, Tensor] {
    if (x.rank < 2) {
      throw new Error(
          `qr() requires input tensor to have a rank >= 2, but got rank ${
              x.rank}`);
    } else if (x.rank === 2) {
      return LinalgOps.qr2d(x as Tensor2D, fullMatrices);
    } else {
      // Rank > 2.
      const outerDimsProd = x.shape.slice(0, x.shape.length - 2)
                                .reduce((value, prev) => value * prev);
      const x2ds = ArrayOps.unstack(
          x.reshape([
            outerDimsProd, x.shape[x.shape.length - 2],
            x.shape[x.shape.length - 1]
          ]),
          0);
      const q2ds: Tensor2D[] = [];
      const r2ds: Tensor2D[] = [];
      x2ds.forEach(x2d => {
        const [q2d, r2d] = LinalgOps.qr2d(x2d as Tensor2D, fullMatrices);
        q2ds.push(q2d);
        r2ds.push(r2d);
      });
      const q = ArrayOps.stack(q2ds, 0).reshape(x.shape);
      const r = ArrayOps.stack(r2ds, 0).reshape(x.shape);
      return [q, r];
    }
  }

  @operation
  private static qr2d(x: Tensor2D, fullMatrices = false): [Tensor2D, Tensor2D] {
    if (x.shape.length !== 2) {
      throw new Error(
          `qr2d() requires a 2D Tensor, but got a ${x.shape.length}D Tensor.`);
    }

    const m = x.shape[0];
    const n = x.shape[1];

    // const qSize = m >= n ? n : m;
    const qSize = m;
    let q = ArrayOps.eye(qSize) as Tensor2D;  // Orthogonal transform so far.
    let r = x.clone();                        // Transformed matrix so far.

    const one2D = TensorOps.tensor2d([[1]], [1, 1]);
    let w: Tensor2D = one2D.clone();

    const iters = m >= n ? n : m;
    for (let j = 0; j < iters; ++j) {
      // This tidy within the for-loop ensures we clean up temporary
      // tensors as soon as they are no longer needed.
      const rTemp = r;
      const wTemp = w;
      const qTemp = q;
      [w, r, q] = ENV.engine.tidy((): [Tensor2D, Tensor2D, Tensor2D] => {
        // Find H = I - tau * w * w', to put zeros below R(j, j).
        const rjEnd1 = r.slice([j, j], [m - j, 1]);
        const normX = rjEnd1.norm();
        const rjj = r.slice([j, j], [1, 1]);
        const s = rjj.sign().neg() as Tensor2D;
        const u1 = rjj.sub(s.mul(normX)) as Tensor2D;
        const wPre = rjEnd1.div(u1);
        if (wPre.shape[0] === 1) {
          w = one2D.clone();
        } else {
          w = one2D.concat(
                  wPre.slice([1, 0], [wPre.shape[0] - 1, wPre.shape[1]]), 0) as
              Tensor2D;
        }
        const tau = s.matMul(u1).div(normX).neg() as Tensor2D;

        // -- R := HR, Q := QH.
        const rjEndAll = r.slice([j, 0], [m - j, n]);
        const tauTimesW = tau.mul(w) as Tensor2D;
        if (j === 0) {
          r = rjEndAll.sub(tauTimesW.matMul(w.transpose().matMul(rjEndAll)));
        } else {
          r = r.slice([0, 0], [j, n])
                  .concat(
                      rjEndAll.sub(
                          tauTimesW.matMul(w.transpose().matMul(rjEndAll))),
                      0) as Tensor2D;
        }
        const qAllJEnd = q.slice([0, j], [m, q.shape[1] - j]);
        if (j === 0) {
          q = qAllJEnd.sub(qAllJEnd.matMul(w).matMul(tauTimesW.transpose()));
        } else {
          q = q.slice([0, 0], [m, j])
                  .concat(
                      qAllJEnd.sub(
                          qAllJEnd.matMul(w).matMul(tauTimesW.transpose())),
                      1) as Tensor2D;
        }
        return [w, r, q];
      });
      dispose([rTemp, wTemp, qTemp]);
    }

    if (!fullMatrices && m > n) {
      q = q.slice([0, 0], [m, n]);
      r = r.slice([0, 0], [n, n]);
    }

    return [q, r];
  }
}
