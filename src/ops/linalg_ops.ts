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

import {ENV} from '../environment';
import {range, scalar} from './tensor_ops';
import {Tensor, Tensor1D, Tensor2D} from '../tensor';
import {TensorLike, TypedArray} from '../types';
import {add, mul, sub} from './binary_ops';
import {logicalAnd} from './logical_ops';
import {complex, real, imag} from './complex_ops';
import {assert} from '../util';
import {convertToTensor} from '../tensor_util_env';
import {squeeze, stack} from './array_ops';
import {split} from './concat_split';
import {matMul} from './matmul';
import {norm} from './norm';
import {op} from './operation';
import {sum} from './reduction_ops';
import {upcastType} from '../types';

/**
 * Gram-Schmidt orthogonalization.
 *
 * ```js
 * const x = tf.tensor2d([[1, 2], [3, 4]]);
 * let y = tf.linalg.gramSchmidt(x);
 * y.print();
 * console.log('Othogonalized:');
 * y.dot(y.transpose()).print();  // should be nearly the identity matrix.
 * console.log('First row direction maintained:');
 * console.log(y.get(0, 1) / y.get(0, 0));  // should be nearly 2.
 * ```
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
/**
 * @doc {heading:'Operations',
 *       subheading:'Linear Algebra',
 *       namespace:'linalg'}
 */
function gramSchmidt_(xs: Tensor1D[]|Tensor2D): Tensor1D[]|Tensor2D {
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
    xs = split(xs, xs.shape[0], 0).map(x => squeeze(x, [0]));
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
          const proj = sum(ys[j].mulStrict(x)).mul(ys[j]);
          x = x.sub(proj);
        }
      }
      return x.div(norm(x, 'euclidean'));
    }));
  }

  if (inputIsTensor2D) {
    return stack(ys, 0) as Tensor2D;
  } else {
    return ys;
  }
}

/** 
 * Conjugates a tensor of matrices and then transposes the last two dimensions.
 * The adjoint is also commonly known as the Hermitian Transpose. Does not yet
 * work for complex data types.
 *
 * @param a Tensor of shape [...,M,N]. The tensor of matrices that is to be
 *          tranposed.
 *
 * @returns Tensor of shape [...,N,M]. The transpose of `a`.
 */
/** 
 * @doc {heading:'Operations',
 *       subheading:'Linear Algebra',
 *       namespace:'linalg'}
 */
function adjoint_<T extends Tensor>( a: T|TensorLike ): T
{
  let $a = convertToTensor(a,'a','bandPart');

  const axes = Array.from( $a.shape, (_,i) => i );
  axes[axes.length-2] = axes.length-1;
  axes[axes.length-1] = axes.length-2;

  if( $a.dtype.startsWith('complex') ) {
    $a = complex( real($a), imag($a).neg() ); // <- TODO: implement tf.conj
  }

  return $a.transpose(axes);
}

/** 
 * Copies a tensor of matrices, setting everything outside a central band
 * in each matrix to zero.
 */
/** 
 * @doc {heading:'Operations',
 *       subheading:'Linear Algebra',
 *       namespace:'linalg'}
 */
function bandPart_<T extends Tensor>(
  a: T|TensorLike, numLower: number, numUpper: number
): T
{
  if( numLower%1 !== 0 ){
    throw new Error(`bandPart(): numLower=${numLower} not an integer.`);
  }
  if( numUpper%1 !== 0 ){
    throw new Error(`bandPart(): numUpper=${numUpper} not an integer.`);
  }

  return ENV.engine.tidy( () => {
    const $a = convertToTensor(a,'a','bandPart');

    const [M,N] = $a.shape.slice(-2);

    if( !(numLower <= M) ) {
      throw new Error(`bandPart() check failed: numLower <= #rows.`   );
    }
    if( !(numUpper <= N) ) {
      throw new Error(`bandPart() check failed: numUpper <= #columns.`);
    }

    if( numLower < 0 ) { numLower = M; }
    if( numUpper < 0 ) { numUpper = N; }

    const i = range(0,M, 1, 'int32').reshape([-1,1]),
          j = range(0,N, 1, 'int32');

    const inBand = logicalAnd(
      sub(i,j).lessEqual( scalar(numLower,'int32') ),
      sub(j,i).lessEqual( scalar(numUpper,'int32') )
    ).cast($a.dtype);

    return mul($a,inBand);
  });
}

function triangularSolveKernel(
  l: Tensor, y: Tensor, lower: boolean, adjoint: boolean
): Tensor
{
  if( ! l.dtype.startsWith('float') ) {
    throw new Error(`triangularSolve(): l.dtype=${l.dtype} not supported.`);
  }
  if( ! y.dtype.startsWith('float') ) {
    throw new Error(`triangularSolve(): y.dtype=${y.dtype} not supported.`);
  }
  if( l.rank < 2 ) {
    throw new Error('triangularSolve(): l must be at least 2D.');
  }
  if( y.rank < 2 ) {
    throw new Error('triangularSolve(): y must be at least 2D.');
  }
  if( l.rank !== y.rank ) {
    throw new Error('triangularSolve(): l and y must have same rank.');
  }
  for( let i=l.rank-2; i-- > 0; ) {
    if( l.shape[i] !== y.shape[i] ) {
      throw new Error('triangularSolve(): leading dimensions do not match.');
    }
  }

  const [N,M] = l.shape.slice(-2),
        [I,J] = y.shape.slice(-2);
  if( N !== M ) {
    throw new Error('triangularSolve(): Last two axes of L not square.');
  }
  if( I !== M ) {
    throw new Error('triangularSolve(): L and y do not match.');
  }

  const
    rank = Math.max(l.rank, y.rank),
    xShape = Array.from(l.shape);
  xShape[rank-2] = I;
  xShape[rank-1] = J;

  // GENERATE RESULT DATA
  const
    dtype = 'float32',
//    dtype =  ( l.dtype === 'float64' ||
//               y.dtype === 'float64' ) ? 'float64' : 'float32',
    // tslint:disable
    DTypeArray = Float32Array,
    // tslint:enable
//    DTypeArray = dtype === 'float32' ? Float32Array
//                                     : Float64Array,
    L = l.dataSync(),
    X = DTypeArray.from( y.dataSync() ) as TypedArray;
  l = undefined;
  y = undefined;

  for( let lOff = 0,
           xOff = 0; xOff < X.length; xOff += N*J,
                                      lOff += N*N )
  {
    if( ! adjoint )
    {
      if(lower)
      { // FORWARD SUBSTITUTION
        for( let i=0; i < I; i++ ) {
          for( let k=0; k < i; k++ ) {
          for( let j=0; j < J; j++ ) {
            X[xOff + J*i+j] -= L[lOff + N*i+k] * X[xOff + J*k+j];
          }}

          for( let j=0; j < J; j++ ) {
            X[xOff + J*i+j] /= L[lOff + N*i+i];
          }
        }
      }
      else
      { // BACKWARD SUBSTITUTION
        for( let i=I; i-- > 0; ) {
          for( let j=J; j-- > 0; ) {
            X[xOff + J*i+j] /= L[lOff + N*i+i];
          }

          for( let k=i; k-- > 0; ) {
          for( let j=J; j-- > 0; ) {
            X[xOff + J*k+j] -= L[lOff + N*k+i] * X[xOff + J*i+j];
          }}
        }
      }
    }
    else
    {
      if(lower)
      { // BACKWARD SUBSTITUTION (TRANSPOSED)
        for( let i=I; i-- > 0; ) {
          for( let j=J; j-- > 0; ) {
            X[xOff + J*i+j] /= L[lOff + N*i+i];
          }

          for( let k=i; k-- > 0; ) {
          for( let j=J; j-- > 0; ) {
            X[xOff + J*k+j] -= L[lOff + N*i+k] * X[xOff + J*i+j];
          }}
        }
      }
      else
      { // FORWARD SUBSTITUTION (TRANSPOSED)
        for( let i=0; i < I; i++ ) {
          for( let k=0; k < i; k++ ) {
          for( let j=0; j < J; j++ ) {
            X[xOff + J*i+j] -= L[lOff + N*k+i] * X[xOff + J*k+j];
          }}

          for( let j=0; j < J; j++ ) {
            X[xOff + J*i+j] /= L[lOff + N*i+i];
          }
        }
      }
    }
  }

  return Tensor.make(xShape,{values: X},dtype);
}

/**
 * Solves a triangular linear equation system (LES).
 *
 * @param l The triangular matrix of the .
 * @param y The right-hand-side of the LES.
 * @param lower If set to `true`, `l` is interpreted as lower triangular
 *              matrix. The strict upper triangular entries are ignore.
 *              If set to `false`, `l` is interpreted as upper triangular
 *              matrix and the strict lower triangular entries are ignored.
 * @param adjoint If set to `true`, the hermitian transpose of `l` is used in
 *                the LES.
 *
 * @returns The solution of one of the following LES:
 *   <dl>
 *     <dt>lower=false, adjoint=false <dd>tril(l) ∙x == y
 *     <dt>lower=true,  adjoint=false <dd>triu(l) ∙x == y
 *     <dt>lower=false, adjoint=true  <dd>tril(l)ᴴ∙x == y
 *     <dt>lower=true,  adjoint=true  <dd>triu(l)ᴴ∙x == y
 *   </dl>
 */ 
/** 
 * @doc {heading:'Operations',
 *       subheading:'Linear Algebra',
 *       namespace:'linalg'}
 */
function triangularSolve_(
  l: Tensor|TensorLike, y: Tensor|TensorLike, lower=true, adjoint=false
): Tensor
{
  // FIXME: if `l` is singular the right hand side could be
  // checked for 0 and then some/any solution could be used

//  let [$l,$y] = broadcastMatrices(
//    convertToTensor(l,'l','triangularSolve'),
//    convertToTensor(y,'y','triangularSolve')
//  );
  let $l = convertToTensor(l,'l','triangularSolve'),
      $y = convertToTensor(y,'y','triangularSolve');
  l=undefined;
  y=undefined;
  if( $l.rank < 2 ){
    throw new Error(`triangularSolve(): l.rank must be at least 2.`);
  }
  if( $y.rank < 2 ){
    throw new Error(`triangularSolve(): y.rank must be at least 2.`);
  }

  const dtype = upcastType($l.dtype, $y.dtype);
  if( $l.dtype !== dtype ) { $l = $l.cast(dtype); }
  if( $y.dtype !== dtype ) { $y = $y.cast(dtype); }

  // WHERE THE BACKPROP COMES FROM:
  //     x = L⁻¹∙y
  // => dx = d(L⁻¹)∙y + L⁻¹∙dy = L⁻¹∙dy  -  L⁻¹∙dL∙L⁻¹∙y = L⁻¹∙dy  -  L⁻¹∙dL∙x
  // => df = tr( (∂f/∂x)∙dxᵀ )
  //       = tr( (∂f/∂x)∙dyᵀ∙L⁻ᵀ )  -  tr( (∂f/∂x)∙yᵀ∙L⁻ᵀ∙dLᵀ∙L⁻ᵀ )
  //       = tr( (∂f/∂x)ᵀ∙L⁻¹∙dy )  -  tr( (∂f/∂x)∙yᵀ∙L⁻ᵀ∙(L⁻¹∙dL)ᵀ )
  //       = tr( L⁻ᵀ∙(∂f/∂x) ∙dyᵀ)  -  tr( L⁻¹∙y∙(∂f/∂x)ᵀ∙ L⁻¹∙dL   )
  //       = tr( L⁻ᵀ∙(∂f/∂x) ∙dyᵀ)  -  tr(     x∙(∂f/∂x)ᵀ∙ L⁻¹∙dL   )
  //       = tr( L⁻ᵀ∙(∂f/∂x) ∙dyᵀ)  -  tr( L⁻ᵀ  ∙(∂f/∂x) ∙ xᵀ ∙dLᵀ   )
  // =>                           ∂f/∂y =  L⁻ᵀ∙(∂f/∂x)
  //    ∂f/∂L = -L⁻ᵀ∙(∂f/∂x)∙xᵀ = ∂f/∂L =     -(∂f/∂y)∙xᵀ

  // tslint:disable
  // SEE: https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/ops/linalg_grad.py#L218
  // tslint:enable
  return ENV.engine.runKernel(
    (backend,saveFn) => {
      const x = triangularSolveKernel($l,$y,lower,adjoint);
      saveFn(x);
      return x;
    },
    {$l,$y},
    (dx,[x]) => {
      const dy = triangularSolve($l, dx, lower, !adjoint);
      return {
        $l: () => {
          let dl = adjoint ? matMul( x, dy, false, true)
                           : matMul(dy,  x, false, true);
          dl = dl.neg();
          dl = lower ? bandPart(dl,-1, 0)
                     : bandPart(dl, 0,-1);
          return dl;
        },
        $y: () => dy
      };
    }
  );
}

/** Computes the economic QR Decomposition.
 */
function qrEcoDecompKernel( a: Tensor ): [Tensor,Tensor]
{
  assert(
    a.rank >= 2,
    `qr(): input must have rank >= 2, got rank ${a.rank}.`
  );
  assert(
    ! a.dtype.startsWith('complex'),
    `qr(): complex dtype not supported.`
  );
  assert(
    a.shape[a.rank-2] >= a.shape[a.rank-1],
    `qr(): a.shape[-2] = ${a.shape[a.rank-2]}`
    +                ` < ${a.shape[a.rank-1]} = a.shape[-1].`
  );

  const dtype = 'float32',
        // tslint:disable
        DTypeArray = Float32Array,
        // tslint:enable
        qShape = Array.from( a.shape ),
        rShape = Array.from(  qShape ),
       [M,N] = qShape.slice(-2);
  rShape[rShape.length-2] = N;
  Object.freeze(qShape);
  Object.freeze(rShape);

  const Q = DTypeArray.from( a.dataSync() ); a = undefined;
  const R = new DTypeArray( Q.length/M*N ),
       cs = new DTypeArray( 2*M*N - N*(N+1) );// <- MEMOIZE ROTATIONS

  for(
    let rOff=0,
        qOff=0; qOff < Q.length; qOff += M*N,
                                 rOff += N*N
  )
  {
    let csi = 0;

    for( let i=1; i < M; i++ ) { const J = Math.min(i,N);
    for( let j=0; j < J; j++ )
    { // DETERMINE GIVENS ROTATION cos AND sin
      const rIJ = Q[qOff + N*i+j]; if( 0.0 === rIJ ) {cs[csi++]=1.0;
                                                      cs[csi++]=0.0; continue;}
      const rJJ = Q[qOff + N*j+j],
                  norm = Math.hypot(rJJ,rIJ),
        c = rJJ / norm,
        s = rIJ / norm;
      cs[csi++] = c;
      cs[csi++] = s;
      Q[qOff + N*j+j] = norm;
      Q[qOff + N*i+j] = 0;
      // ROTATE ROWS IN R (WHICH IS CURRENTLY STORED IN Q)
      for( let k=j; ++k < N; )
      { const rJK = Q[qOff + N*j+k],
              rIK = Q[qOff + N*i+k];
        Q[qOff + N*j+k] = s*rIK + c*rJK;
        Q[qOff + N*i+k] = c*rIK - s*rJK;
      }
    }}

    assert( csi === cs.length, `WTF: ${csi} !== ${cs.length}` );

    // COPY R FROM Q -> R
    for( let i=0; i < N; i++ ) {
    for( let j=i; j < N; j++ ) {
      R[rOff + N*i+j] = Q[qOff + N*i+j];
                        Q[qOff + N*i+j] = i !== j ? 0.0 : 1.0;
    }}

    // COMPUTE Q
    for( let i=M; --i > 0; ) { const J = Math.min(i,N);
    for( let j=J; j-- > 0; )
    { const s = cs[--csi],
            c = cs[--csi];
      // ROTATE ROWS IN Q
      for( let k=N; k-- > 0; )
      { const qJK = Q[qOff + N*j+k],
              qIK = Q[qOff + N*i+k];
        Q[qOff + N*j+k] = c*qJK - s*qIK;
        Q[qOff + N*i+k] = s*qJK + c*qIK;
      }
    }}

    assert( csi === 0, `WTF: ${csi} !== 0` );
  }

  const q = Tensor.make(qShape, { values: Q }, dtype);
  const r = Tensor.make(rShape, { values: R }, dtype);

  return [q,r];
}

/** Computes the full QR Decomposition an memoizes the
 *  Givens rotation angles in the process.
 */
function qrFullDecompKernel( a: Tensor ): [Tensor,Tensor,Tensor]
{
  assert(
    a.rank >= 2,
    `Error in linalg.qr: input must have rank >= 2, got rank ${a.rank}.`
  );
  assert(
    ! a.dtype.startsWith('complex'),
    `Error in linalg.qr: complex dtype not supported.`
  );

  const dtype      = 'float32',
        // tslint:disable
        DTypeArray = Float32Array,
        // tslint:enable
        rShape = Array.from( a.shape ),
        qShape = Array.from( a.shape ),
       [M,N] =               a.shape.slice(-2),
        R = DTypeArray.from( a.dataSync() );
  a = undefined;
  const L = Math.min(M,N),
        Q = new DTypeArray( R.length/N*M  ),
       CS = new DTypeArray( R.length/N/M * 2 * (
              (L*(L-1) >>> 1) + Math.max(0,M-N)*N
            ));
  qShape[qShape.length-1] = M;
  Object.freeze(qShape);
  Object.freeze(rShape);

  let l = 0;
  for( let qOff=0,
           rOff=0; qOff < Q.length; qOff += M*M,
                                    rOff += M*N )
  {
    // INIT Q TO IDENTITY
    for( let i=0; i < M; i++ ) { Q[qOff + M*i+i] = 1; }

    // BEGIN QR DECOMPOSITION
    for( let i=1; i < M; i++ ) { const J = Math.min(i,N);
    for( let j=0; j < J; j++ )
    {
      // DETERMINE GIVENS ROTATION cos AND sin
      const rIJ = R[rOff + N*i+j]; if( 0.0 === rIJ ) { CS[l++]=1.0;
                                                       CS[l++]=0.0; continue; }
      const rJJ = R[rOff + N*j+j],
                  norm = Math.hypot(rJJ,rIJ),
        c = rJJ / norm,
        s = rIJ / norm;
      CS[l++] = c;
      CS[l++] = s;
      R[rOff + N*j+j] = norm;
      R[rOff + N*i+j] = 0;
      // ROTATE ROWS IN R
      for( let k=j; ++k < N; )
      { const rJK = R[rOff + N*j+k],
              rIK = R[rOff + N*i+k];
        R[rOff + N*j+k] = s*rIK + c*rJK;
        R[rOff + N*i+k] = c*rIK - s*rJK;
      }
      // ROTATE ROWS IN Qᵀ
      for( let k=0; k <= i; k++ )
      { const qJK = Q[qOff + M*j+k],
              qIK = Q[qOff + M*i+k];
        Q[qOff + M*j+k] = s*qIK + c*qJK;
        Q[qOff + M*i+k] = c*qIK - s*qJK;
      }
    }} // END QR DECOMPOSITION

    // TRANSPOSE Q (was transposed for cache locality)
    for( let i=0; i < M; i++ ) {
    for( let j=0; j < i; j++ ) {
      const qIJ = Q[qOff + M*i+j];
                  Q[qOff + M*i+j] = Q[qOff + M*j+i];
                                    Q[qOff + M*j+i] = qIJ;
    }}
  }
  assert( l === CS.length, `WTF: ${l} != ${CS.length}` );

  const  q = Tensor.make(qShape, {values: Q}, dtype);
  const  r = Tensor.make(rShape, {values: R}, dtype);
  const cs = Tensor.make([CS.length], {values: CS}, dtype);

  return [q,r,cs];
}

/** Computes the backpropagation full QR Decomposition using
 *  memoized Givens rotation angles in the process.
 */
function qrFullBackpropKernel(
  q: Tensor, dq: Tensor, r: Tensor, dr: Tensor, cs: Tensor
): Tensor
{
  assert( q.rank === dq.rank, `q.rank == ${q.rank} != ${dq.rank} == dq.rank` );
  assert( q.rank === dr.rank, `q.rank == ${q.rank} != ${dr.rank} == dr.rank` );
  assert( q.rank ===  r.rank, `q.rank == ${q.rank} != ${ r.rank} ==  r.rank` );

  assert( cs.rank === 1, `cs.rank == ${cs.rank} != 1` );

  for( let i=q.rank-2; i-- > 0; )
  {
    assert(
      q.shape[i] === dq.shape[i],
      `q.shape[${i}] == ${q.shape[i]} != ${dq.shape[i]} == dq.shape[${i}]`
    );
    assert(
      q.shape[i] === dr.shape[i],
      `q.shape[${i}] == ${q.shape[i]} != ${dr.shape[i]} == dr.shape[${i}]`
    );
    assert(
      q.shape[i] ===  r.shape[i],
      `q.shape[${i}] == ${q.shape[i]} != ${ r.shape[i]} ==  r.shape[${i}]`
    );
  }
  const rank = q.rank;
  assert(
    q.shape[rank-2] ===  q.shape[rank-1],
    `q.shape[-2] == ${q.shape[rank-2]} != ${ q.shape[rank-1]} ==  q.shape[-1]`
  );
  assert(
    q.shape[rank-2] === dq.shape[rank-1],
    `q.shape[-2] == ${q.shape[rank-2]} != ${dq.shape[rank-1]} == dq.shape[-1]`
  );
  assert(
    q.shape[rank-2] === dq.shape[rank-2],
    `q.shape[-2] == ${q.shape[rank-2]} != ${dq.shape[rank-2]} == dq.shape[-2]`
  );

  assert(
    r.shape[rank-2] ===  q.shape[rank-1],
    `r.shape[-2] == ${r.shape[rank-2]} != ${ q.shape[rank-1]} ==  q.shape[-1]`
  );
  assert(
    r.shape[rank-1] === dr.shape[rank-1],
    `r.shape[-1] == ${r.shape[rank-1]} != ${dr.shape[rank-1]} == dr.shape[-1]`
  );
  assert(
    r.shape[rank-2] === dr.shape[rank-2],
    `r.shape[-2] == ${r.shape[rank-2]} != ${dr.shape[rank-2]} == dr.shape[-2]`
  );

  assert(
    q.dtype ===  dq.dtype, `q.dtype == ${q.dtype} == ${ dq.dtype} ==  dq.dtype`
  );
  assert(
    q.dtype ===  dr.dtype, `q.dtype == ${q.dtype} == ${ dr.dtype} ==  dr.dtype`
  );
  assert(
    q.dtype ===   r.dtype, `q.dtype == ${q.dtype} == ${  r.dtype} ==   r.dtype`
  );
  assert(
    q.dtype === cs.dtype, `q.dtype == ${q.dtype} == ${cs.dtype} == cs.dtype`
  );

  assert( ! q.dtype.startsWith('complex'), `Complex dtype not supported.`);

  const dtype      ='float32',
        // tslint:disable
        DTypeArray = Float32Array,
        // tslint:enable
       dAShape = Array.from( r.shape ),
       [M,N] = dAShape.slice(-2);
  const  Q = DTypeArray.from(  q.dataSync() );  q = undefined;
  const dQ = DTypeArray.from( dq.dataSync() ); dq = undefined;
  const  R = DTypeArray.from(  r.dataSync() );  r = undefined;
  const dR = DTypeArray.from( dr.dataSync() ); dr = undefined;
  const CS =                  cs.dataSync();
  Object.freeze(dAShape);

  let l = CS.length;
  for( let rOff=R.length,
           qOff=Q.length; qOff > 0; )
  {
    qOff -= M*M;
    rOff -= M*N;

    // TRANSPOSE  Q (for cache locality)
    for( let i=0; i < M; i++ ) {
    for( let j=0; j < i; j++ ) {
      const qIJ = Q[qOff + M*i+j];
                  Q[qOff + M*i+j] = Q[qOff + M*j+i];
                                    Q[qOff + M*j+i] = qIJ;
    }}

    // TRANSPOSE dQ (for cache locality)
    for( let i=0; i < M; i++ ) {
    for( let j=0; j < i; j++ ) {
      const dQij = dQ[qOff + M*i+j];
                   dQ[qOff + M*i+j] = dQ[qOff + M*j+i];
                                      dQ[qOff + M*j+i] = dQij;
    }}

    // BEGIN QR DECOMPOSITION
    for( let i=M; --i > 0; ) { const J = Math.min(i,N);
    for( let j=J; j-- > 0; )
    {
      // DETERMINE GIVENS ROTATION cos AND sin
      const s = CS[--l]; if( 0 === s ) { continue; }
      const c = CS[--l],
         norm = R[rOff + N*j+j];

      // ROTATE ROWS IN R
      for( let k=j; k < N; k++ )
      { const rJK = R[rOff + N*j+k],
              rIK = R[rOff + N*i+k];
        R[rOff + N*j+k] = c*rJK - s*rIK;
        R[rOff + N*i+k] = s*rJK + c*rIK;
      }

      // ROTATE ROWS IN Qᵀ
      for( let k=0; k <= i; k++ )
      { const qJK = Q[qOff + M*j+k],
              qIK = Q[qOff + M*i+k];
        Q[qOff + M*j+k] = c*qJK - s*qIK;
        Q[qOff + M*i+k] = s*qJK + c*qIK;
      }

      const rIJ = R[rOff + N*i+j] / norm,
            rJJ = R[rOff + N*j+j] / norm,
           dCdJ = +rIJ*rIJ / norm,
           dCdI = -rIJ*rJJ / norm,
           dSdJ = -rJJ*rIJ / norm,
           dSdI = +rJJ*rJJ / norm;
      let dj = 0.0,
          di = 0.0;

      // ROTATE ROWS IN dR
      for( let k=j; k < N; k++ )
      { const dRjk = dR[rOff + N*j+k],
              dRik = dR[rOff + N*i+k];
        dR[rOff + N*j+k] = c*dRjk - s*dRik;
        dR[rOff + N*i+k] = s*dRjk + c*dRik;

        const rJK =  R[rOff + N*j+k],
              rIK =  R[rOff + N*i+k];

        dj += dRjk*(rIK*dSdJ + rJK*dCdJ)  +  dRik*(rIK*dCdJ - rJK*dSdJ);
        di += dRjk*(rIK*dSdI + rJK*dCdI)  +  dRik*(rIK*dCdI - rJK*dSdI);
      }

      // ROTATE ROWS IN dQᵀ
      for( let k=0; k <= i; k++ )
      { const dQjk = dQ[qOff + M*j+k],
              dQik = dQ[qOff + M*i+k];
        dQ[qOff + M*j+k] = c*dQjk - s*dQik;
        dQ[qOff + M*i+k] = s*dQjk + c*dQik;

        const qJK = Q[qOff + M*j+k],
              qIK = Q[qOff + M*i+k];

        dj += dQjk*(qIK*dSdJ + qJK*dCdJ)  +  dQik*(qIK*dCdJ - qJK*dSdJ);
        di += dQjk*(qIK*dSdI + qJK*dCdI)  +  dQik*(qIK*dCdI - qJK*dSdI);
      }

      dR[rOff + N*j+j] += dj;
      dR[rOff + N*i+j] += di;
    }} // END QR DECOMPOSITION
  }
  assert( 0 === l, `WTF: ${l} != 0` );

  return Tensor.make(dAShape,{values: dR},dtype);
}

/**
 * Compute QR decomposition of m-by-n matrix using Givens rotations.
 *
 * See: http://www.math.usm.edu/lambers/mat610/sum10/lecture9.pdf
 *
 * ```js
 * const a = tf.tensor2d([[1, 2], [3, 4]]);
 * let [q, r] = tf.linalg.qr(a);
 * console.log('Q');
 * q.print();
 * console.log('R');
 * r.print();
 * console.log('Orthogonalized');
 * q.dot(q.transpose()).print()  // should be nearly the identity matrix.
 * console.log('Reconstructed');
 * q.dot(r).print(); // should be nearly [[1, 2], [3, 4]];
 * ```
 *
 * ```js
 * const a = tf.tensor2d([[1, 2], [3, 4]]);
 * let [q, r] = tf.linalg.qr(a);
 * console.log('Q');
 * q.print();
 * console.log('R');
 * r.print();
 * console.log('Orthogonalized');
 * q.dot(q.transpose()).print()  // should be nearly the identity matrix.
 * console.log('Reconstructed');
 * q.dot(r).print(); // should be nearly [[1, 2], [3, 4]];
 * ```
 *
 * @param x The `Tensor` to be QR-decomposed. Must have rank >= 2. Suppose
 *   it has the shape `[..., M, N]`.
 * @param fullMatrices An optional boolean parameter. Defaults to `false`.
 *   If `true`, compute full-sized `Q`. If `false` (the default),
 *   compute only the leading N columns of `Q` and `R`.
 * @returns An `Array` of two `Tensor`s: `[Q, R]`. `Q` is a unitary matrix,
 *   i.e., its columns all have unit norm and are mutually orthogonal.
 *   If `M >= N`,
 *     If `fullMatrices` is `false` (default),
 *       - `Q` has a shape of `[..., M, N]`,
 *       - `R` has a shape of `[..., N, N]`.
 *     If `fullMatrices` is `true` (default),
 *       - `Q` has a shape of `[..., M, M]`,
 *       - `R` has a shape of `[..., M, N]`.
 *   If `M < N`,
 *     - `Q` has a shape of `[..., M, M]`,
 *     - `R` has a shape of `[..., M, N]`.
 * @throws If the rank of `x` is less than 2.
 */
/**
 * @doc {heading:'Operations',
 *       subheading:'Linear Algebra',
 *       namespace:'linalg'}
 */
function qr_( a: Tensor, fullMatrices = false ): [Tensor, Tensor] {
  if( a.rank < 2 ) {
    throw new Error(
      `qr() requires input tensor to have a rank >= 2, but got rank ${a.rank}`
    );
  }
  if( a.dtype.startsWith('complex') ) {
    throw new Error(`qr() not yet supported for complex tensors.`);
  }

  const [m,n] = a.shape.slice(-2);

  if( m === n || m > n && !fullMatrices )
  {
    // FIXME: What if R is (nearly) singular?
    return ENV.engine.runKernel(
      (backend,saveFunc) => {
        const [q,r] = qrEcoDecompKernel(a);
        saveFunc(q);
        saveFunc(r);
        return [q,r];
      },
      {a},
      ([dq,dr], [q,r]) => ({
        a: () => {
          // TODO: is tidy required here?
          // tslint:disable
          // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/ops/linalg_grad.py#L160
          // tslint:enable
          const qdq  = matMul(q,dq, true, false),
                rdr  = matMul(r,dr, false, true),
                qdq_ = qdq.sub( adjoint(qdq) ),
                rdr_ = rdr.sub( adjoint(rdr) ),
                tril = bandPart( add(qdq_,rdr_), -1, 0 );

          const triSolv = (x: Tensor,r: Tensor) => adjoint(
            triangularSolve(r, adjoint(x), /*lower=*/false, /*adjoint_r*/false)
          );

          const gradA = matMul( q, dr.add( triSolv(tril,r) ) ),
                gradB = triSolv( dq.sub( matMul(q,qdq) ), r );

          return add(gradA,gradB);
        }
      })
    ) as [Tensor, Tensor];
  }

  let [q,r] = ENV.engine.runKernel(
    (backend,saveFunc) => {
      const [q,r,cs] = qrFullDecompKernel(a);
      saveFunc(q);
      saveFunc(r);
      saveFunc(cs);
      return [q,r];
    },
    {a},
    ([dq,dr], [q,r,cs]) => ({
      a: () => ENV.engine.runKernel(
        (backend,saveFunc) => qrFullBackpropKernel(q,dq, r,dr, cs),
        { $dq: dq, $dr: dr }
      )
    })
  );

  if( ! fullMatrices  &&  m > n ) {
    const end = a.shape.slice(); 
    q = q.slice([0, 0], end); end[end.length-2] = n;
    r = r.slice([0, 0], end);
  }

  return [q,r];
}

export const adjoint = op({adjoint_});
export const bandPart = op({bandPart_});
export const gramSchmidt = op({gramSchmidt_});
export const qr = op({qr_});
export const triangularSolve = op({triangularSolve_});
