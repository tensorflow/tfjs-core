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
// import {dispose} from '../globals';
import {convertToTensor} from '../tensor_util_env';
import {Tensor, Tensor1D, Tensor2D} from '../tensor';
import {TensorLike} from '../types';
import {assert} from '../util';
import {squeeze, stack, broadcastTo} from './array_ops';
import {matMul} from './matmul';
import {split} from './concat_split';
import {norm} from './norm';
import {op} from './operation';
import {sum} from './reduction_ops';
import {TypedArray} from '../types';
import {broadcastMatrices} from './linalg_util';
import {conj} from './complex_ops';
import {zeros, ones} from './tensor_ops';
import {upcastType} from '../types';
import {scalar, range} from './tensor_ops';
import {gather} from './segment_ops';
import {add} from './binary_ops';

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


function lu_p_decomp_( a: Tensor ): [Tensor,Tensor]
{
  assert( a.rank >= 2,                           `Error in linalg.lu: input must have rank >= 2, got rank ${a.rank}.`);
  assert( a.shape[a.rank-2] == a.shape[a.rank-1],`Error in linalg.lu: input must be square, got shape [${a.shape}].`)
  assert( ! a.dtype.startsWith('complex'), `lu(): complex dtypes not supported.`);
  assert( ! a.dtype.startsWith('int'    ), `lu(): integer dtypes not supported.`);

  const DType    = a.dtype,
        LU_shape = Array.from( a.shape ),
         P_shape =            LU_shape.slice(0,-1),
        [N] = LU_shape.slice(-1),
        LU = a.dataSync().slice(),
        P  = new Int32Array(LU.length/N);

  for( let LU_off=0,
            P_off=0; P_off < P.length; P_off += N,
                                      LU_off += N*N )
  {
    // INIT P
    for( let i=0; i < N; i++ ) P[P_off+i] = i;
    // LU DECOMPOSITION
    for( let i=0; i < N; i++ )
    {
      const row_i = LU_off + i*N;
      // ROW PIVOTING
      {
        let p=i;
        for( let j=i+1; j < N; j++ )
          if( Math.abs( LU[LU_off + N*j+i] )
            > Math.abs( LU[LU_off + N*p+i] ) )
            p=j;

        if( i != p ) {
          const P_p = P[P_off+i];
                      P[P_off+i] = P[P_off+p];
                                   P[P_off+p] = P_p; // KEEP TRACK OF ROW SWAPS
          const row_p = LU_off + p*N;
          // SWAP ROWS
          for( let j=0; j < N; j++ ) {
            const tmp = LU[row_i+j];
                        LU[row_i+j] = LU[row_p+j];
                                      LU[row_p+j] = tmp;
          }
        }
      }
      // ELIMINATE ELEMENTS BELOW PIVOT
      for( let j=i+1; j < N; j++ )
      {
        const row_j = LU_off + j*N,
              scale = LU[row_j+i] / LU[row_i+i];
        LU[row_j+i] = scale;
        for( let k=i+1; k < N; k++ )
          LU[row_j+k] -= scale * LU[row_i+k];
      }
    }
  }

  const lu = Tensor.make(LU_shape,{ values: LU }, DType );
  const p  = Tensor.make( P_shape,{ values: P  },'int32');

  return [lu,p];
}


/** Computes the economic QR Decomposition.
 */
function qr_eco_decomp_( a: Tensor ): [Tensor,Tensor]
{
  assert( a.rank >= 2,                            `Error in linalg.qr: input must have rank >= 2, got rank ${a.rank}.`);
  assert( ! a.dtype.startsWith('complex'),        `Error in linalg.qr: complex dtype not supported.`);
  assert( a.shape[a.rank-2] >= a.shape[a.rank-1], `Error in linalg.qr: a.shape[-2] = ${a.shape[a.rank-2]} < ${a.shape[a.rank-1]} = a.shape[-1].` );

  const DType = 'float32',
        DTypeArray = Float32Array, // <- ensure at least double precision
        Q_shape = Array.from( a.shape ),
        R_shape = Array.from( Q_shape ),
       [N,M] = Q_shape.slice(-2);
  R_shape[R_shape.length-2] = M;
  Object.freeze(Q_shape);
  Object.freeze(R_shape);

  const Q = DTypeArray.from( a.dataSync() ); a = undefined; // <- might encourage GC by setting `A = undefined` after this line
  const R = new DTypeArray(Q.length/N*M),
       cs = new DTypeArray(M*2),// <- CACHE cos AND sin VALUES TO APPLY M COLUMN ROTATIONS TO Q AT ONCE
        r = function(){
          try      { return    cs.subarray(M); }
          catch(e) { return new DTypeArray(M); }
        }();  // <- additional space to temp. store rows of R not contained in the result

  for(
    let R_off=0,
        Q_off=0; Q_off < Q.length; Q_off += N*M,
                                   R_off += M*M
  )
  {
    // HANDLE ENTRIES CONTAINED IN THE RESULT
    for( let i=0; i < M; i++ )
    {
      // COPY FROM Q TO R AND INIT Q
      for( let j=0; j < M; j++ ) {
        R[R_off+M*i+j] = Q[Q_off+M*i+j]; Q[Q_off+M*i+j] = i != j ? 0.0 : 1.0
      }

      for( let j=0; j < i; j++ )
      { // USE GIVENS ROTATION TO ELIMINATE ELEMENT R_ji
        const R_ij = R[R_off+M*i+j]; if( R_ij == 0.0 ) { cs[2*j+0]=1.0; cs[2*j+1]=0.0; continue };
        const R_jj = R[R_off+M*j+j],
                     norm = Math.hypot(R_jj,R_ij),
          c = R_jj / norm,
          s = R_ij / norm;
        cs[2*j+0] = c;
        cs[2*j+1] = s;
        R[R_off + M*i+j] = 0.0;
        R[R_off + M*j+j] = norm;
        // ROTATE ROW i AND j IN R
        for( let k=j; ++k < M; ) {
          const ik = R_off+M*i+k, R_ik = R[ik],
                jk = R_off+M*j+k, R_jk = R[jk];
          R[ik] = c*R_ik - s*R_jk;
          R[jk] = s*R_ik + c*R_jk;
        }
      }

      // ROTATE COLUMNS IN Q (BUNDLED FOR BETTER CACHE LOCALITY)
      for( let k=0; k <= i; k++ )
      for( let j=0; j <  i; j++ ) {
        const c = cs[2*j+0],
              s = cs[2*j+1],
             ki = Q_off+M*k+i, Q_ki = Q[ki],
             kj = Q_off+M*k+j, Q_kj = Q[kj];
        Q[ki] = c*Q_ki - s*Q_kj;
        Q[kj] = s*Q_ki + c*Q_kj;
      }
    }
    // HANDLE REMAINING ENTRIES NOT CONTAINED IN THE RESULT
    for( let i=M; i < N; i++ )
    {
      // INIT r
      for( let j=0; j < M; j++ ) {
        r[j] = Q[Q_off+M*i+j]; Q[Q_off+M*i+j] = 0.0;
      }

      // USE GIVENS ROTATIONS TO ELIMINATE ELEMENT r completely
      for( let j=0; j < M; j++ )
      {
        const r_j  = r[j]; if( r_j == 0.0 ) { cs[2*j+0]=1.0; cs[2*j+1]=0.0; continue };
        const R_jj = R[R_off+M*j+j],
                      norm = Math.hypot(R_jj,r_j),
          c = R_jj / norm,
          s = r_j  / norm;
        R[R_off+M*j+j] = norm;
        // ROTATE ROW i AND j IN R
        for( let k=j; ++k < M; ) {
          const jk = R_off + M*j+k, R_jk = R[jk];
          R[jk] = s*r[k] + c*R_jk;
          r[ k] = c*r[k] - s*R_jk;
        }
        cs[2*j+0] = c;
        cs[2*j+1] = s;
      }

      // ROTATE COLUMNS IN Q
      for( let k=0; k <= i; k++ ) { let Q_k = i != k ? 0.0 : 1.0;
      for( let j=0; j <  M; j++ ) {
        const c = cs[2*j+0],
              s = cs[2*j+1],     q_k  = Q_k,
              kj = Q_off + M*k+j, Q_kj = Q[kj];
        Q_k  = c*q_k - s*Q_kj;
        Q[kj]= s*q_k + c*Q_kj;
      }}
    }
  }

  {
    const q = Tensor.make(Q_shape, { values: Q }, DType);
    const r = Tensor.make(R_shape, { values: R }, DType);

    return [q,r];
  }
}


/** Computes the full QR Decomposition an memoizes the Givens rotation angles in the process.
 */
function qr_full_decomp_( a: Tensor ): [Tensor,Tensor,Tensor]
{
  assert( a.rank >= 2, `Error in linalg.qr: input must have rank >= 2, got rank ${a.rank}.`);
  assert( ! a.dtype.startsWith('complex'), `Error in linalg.qr: complex dtype not supported.`);

  const DType      ='float32',
        DTypeArray = Float32Array,
        R_shape =      Array.from( a.shape ),
        Q_shape =      Array.from( a.shape ),
       [M,N]    =                  a.shape.slice(-2),
        R       = DTypeArray.from( a.dataSync() );
  a = undefined;
  const L = Math.min(M,N),
        Q = new DTypeArray(  R.length/N*M  ),
      SIN = new DTypeArray(  R.length/N/M * ( (L*(L-1) >>> 1) + Math.max(0,M-N)*N )  );
  Q_shape[Q_shape.length-1] = M;
  Object.freeze(Q_shape);
  Object.freeze(R_shape);

  let l = 0;
  for( let Q_off=0,
           R_off=0; Q_off < Q.length; Q_off += M*M,
                                      R_off += M*N )
  {
    // INIT Q TO IDENTITY
    for( let i=0; i < M; i++ ) Q[Q_off + M*i+i] = 1;

    // BEGIN QR DECOMPOSITION
    for( let i=1; i < M; i++ ) { const J = Math.min(i,N);
    for( let j=0; j < J; j++ )
    {
      // DETERMINE GIVENS ROTATION cos AND sin
      const R_ij = R[R_off + N*i+j]; if( 0.0 == R_ij ) { SIN[l++]=0.0; continue; }
      const R_jj = R[R_off + N*j+j];
      let          norm = Math.hypot(R_jj,R_ij),
        c = R_jj / norm,
        s = R_ij / norm;
      // MAKE c POSITIVE SO THAT IS CAN BE DEDUCED VIA c = sqrt(1-s²)
      if(  c < 0 ) {
           c *= -1;
           s *= -1;
        norm *= -1;
      }
      SIN[l++] = s;
      R[R_off + N*j+j] = norm;
      R[R_off + N*i+j] = 0;
      // ROTATE ROWS IN R
      for( let k=j; ++k < N; )
      { const R_jk = R[R_off + N*j+k],
              R_ik = R[R_off + N*i+k];
        R[R_off + N*j+k] = s*R_ik + c*R_jk;
        R[R_off + N*i+k] = c*R_ik - s*R_jk;
      }
      // ROTATE ROWS IN Qᵀ
      for( let k=0; k <= i; k++ )
      { const Q_jk = Q[Q_off + M*j+k],
              Q_ik = Q[Q_off + M*i+k];
        Q[Q_off + M*j+k] = s*Q_ik + c*Q_jk;
        Q[Q_off + M*i+k] = c*Q_ik - s*Q_jk;
      }
    }} // END QR DECOMPOSITION

    // TRANSPOSE Q (was transposed for cache locality)
    for( let i=0; i < M; i++ )
    for( let j=0; j < i; j++ ) {
      const Q_ij = Q[Q_off + M*i+j];
                   Q[Q_off + M*i+j] = Q[Q_off + M*j+i];
                                      Q[Q_off + M*j+i] = Q_ij;
    }
  }
  assert( l == SIN.length, `WTF: ${l} != ${SIN.length}` );

  const   q = Tensor.make(Q_shape,{values: Q},DType);
  const   r = Tensor.make(R_shape,{values: R},DType);
  const sin = Tensor.make([SIN.length],{values: SIN},DType);

  return [q,r,sin];
}


/** Computes the backpropagation full QR Decomposition using memoized Givens rotation
 *  angles in the process.
 */
function qr_full_backprop_( q: Tensor, dq: Tensor, r: Tensor, dr: Tensor, sin: Tensor ): Tensor
{
  assert( q.rank == dq.rank, `q.rank == ${q.rank} != ${dq.rank} == dq.rank` )
  assert( q.rank == dr.rank, `q.rank == ${q.rank} != ${dr.rank} == dr.rank` )
  assert( q.rank ==  r.rank, `q.rank == ${q.rank} != ${ r.rank} ==  r.rank` )

  assert( sin.rank == 1, `sin.rank == ${sin.rank} != 1` )

  for( let i=q.rank-2; i-- > 0; )
  {
    assert( q.shape[i] == dq.shape[i], `q.shape[${i}] == ${q.shape[i]} != ${dq.shape[i]} == dq.shape[${i}]` )
    assert( q.shape[i] == dr.shape[i], `q.shape[${i}] == ${q.shape[i]} != ${dr.shape[i]} == dr.shape[${i}]` )
    assert( q.shape[i] ==  r.shape[i], `q.shape[${i}] == ${q.shape[i]} != ${ r.shape[i]} ==  r.shape[${i}]` )
  }
  const rank = q.rank;
  assert( q.shape[rank-2] ==  q.shape[rank-1], `q.shape[-2] == ${q.shape[rank-2]} != ${ q.shape[rank-1]} ==  q.shape[-1]` )
  assert( q.shape[rank-2] == dq.shape[rank-1], `q.shape[-2] == ${q.shape[rank-2]} != ${dq.shape[rank-1]} == dq.shape[-1]` )
  assert( q.shape[rank-2] == dq.shape[rank-2], `q.shape[-2] == ${q.shape[rank-2]} != ${dq.shape[rank-2]} == dq.shape[-2]` )

  assert( r.shape[rank-2] ==  q.shape[rank-1], `r.shape[-2] == ${r.shape[rank-2]} != ${ q.shape[rank-1]} ==  q.shape[-1]` )
  assert( r.shape[rank-1] == dr.shape[rank-1], `r.shape[-1] == ${r.shape[rank-1]} != ${dr.shape[rank-1]} == dr.shape[-1]` )
  assert( r.shape[rank-2] == dr.shape[rank-2], `r.shape[-2] == ${r.shape[rank-2]} != ${dr.shape[rank-2]} == dr.shape[-2]` )

  assert( q.dtype ==  dq.dtype, `q.dtype == ${q.dtype} == ${ dq.dtype} ==  dq.dtype` )
  assert( q.dtype ==  dr.dtype, `q.dtype == ${q.dtype} == ${ dr.dtype} ==  dr.dtype` )
  assert( q.dtype ==   r.dtype, `q.dtype == ${q.dtype} == ${  r.dtype} ==   r.dtype` )
  assert( q.dtype == sin.dtype, `q.dtype == ${q.dtype} == ${sin.dtype} == sin.dtype` )

  assert( ! q.dtype.startsWith('complex'), `Complex dtype not supported.`);

  const DType      ='float32',
        DTypeArray = Float32Array,
       dA_shape = Array.from( r.shape ),
       [M,N]    =            dA_shape.slice(-2);
  const   Q = DTypeArray.from(  q.dataSync() );//  q = undefined;
  const  dQ = DTypeArray.from( dq.dataSync() ); dq = undefined;
  const   R = DTypeArray.from(  r.dataSync() );//  r = undefined;
  const  dR = DTypeArray.from( dr.dataSync() ); dr = undefined;
  const SIN =                 sin.dataSync();
  Object.freeze(dA_shape);

  let l = SIN.length;
  for( let R_off=R.length,
           Q_off=Q.length; Q_off > 0; )
  {
    Q_off -= M*M,
    R_off -= M*N

    // TRANSPOSE  Q (for cache locality)
    for( let i=0; i < M; i++ )
    for( let j=0; j < i; j++ ) {
      const Q_ij = Q[Q_off + M*i+j];
                   Q[Q_off + M*i+j] = Q[Q_off + M*j+i];
                                      Q[Q_off + M*j+i] = Q_ij;
    }

    // TRANSPOSE dQ (for cache locality)
    for( let i=0; i < M; i++ )
    for( let j=0; j < i; j++ ) {
      const dQ_ij = dQ[Q_off + M*i+j];
                    dQ[Q_off + M*i+j] = dQ[Q_off + M*j+i];
                                        dQ[Q_off + M*j+i] = dQ_ij;
    }

    // BEGIN QR DECOMPOSITION
    for( let i=M; --i > 0; ) { const J = Math.min(i,N);
    for( let j=J; j-- > 0; )
    {
      // DETERMINE GIVENS ROTATION cos AND sin
      const s = SIN[--l]; if( 0 == s ) continue;
      const c = Math.sqrt((1+s)*(1-s)),
         norm = R[R_off + N*j+j];

      // ROTATE ROWS IN R
      for( let k=j; k < N; k++ )
      { const R_jk = R[R_off + N*j+k],
              R_ik = R[R_off + N*i+k];
        R[R_off + N*j+k] = c*R_jk - s*R_ik;
        R[R_off + N*i+k] = s*R_jk + c*R_ik;
      }

      // ROTATE ROWS IN Qᵀ
      for( let k=0; k <= i; k++ )
      { const Q_jk = Q[Q_off + M*j+k],
              Q_ik = Q[Q_off + M*i+k];
        Q[Q_off + M*j+k] = c*Q_jk - s*Q_ik;
        Q[Q_off + M*i+k] = s*Q_jk + c*Q_ik;
      }

      const R_ij = R[R_off + N*i+j],
            R_jj = R[R_off + N*j+j],
           dc_dj = + R_ij / norm  *  R_ij / norm**2,
           dc_di = - R_ij / norm  *  R_jj / norm**2,
           ds_dj = - R_jj / norm  *  R_ij / norm**2,
           ds_di = + R_jj / norm  *  R_jj / norm**2;
      let dj = 0.0,
          di = 0.0;

      // ROTATE ROWS IN dR
      for( let k=j; k < N; k++ )
      { const dR_jk = dR[R_off + N*j+k],
              dR_ik = dR[R_off + N*i+k];
        dR[R_off + N*j+k] = c*dR_jk - s*dR_ik;
        dR[R_off + N*i+k] = s*dR_jk + c*dR_ik;

        const R_jk =  R[R_off + N*j+k],
              R_ik =  R[R_off + N*i+k];

        dj += dR_jk*(R_ik*ds_dj + R_jk*dc_dj)  +  dR_ik*(R_ik*dc_dj - R_jk*ds_dj);
        di += dR_jk*(R_ik*ds_di + R_jk*dc_di)  +  dR_ik*(R_ik*dc_di - R_jk*ds_di);
      }

      // ROTATE ROWS IN dQᵀ
      for( let k=0; k <= i; k++ )
      { const dQ_jk = dQ[Q_off + M*j+k],
              dQ_ik = dQ[Q_off + M*i+k];
        dQ[Q_off + M*j+k] = c*dQ_jk - s*dQ_ik;
        dQ[Q_off + M*i+k] = s*dQ_jk + c*dQ_ik;

        const Q_jk = Q[Q_off + M*j+k],
              Q_ik = Q[Q_off + M*i+k];

        dj += dQ_jk*(Q_ik*ds_dj + Q_jk*dc_dj)  +  dQ_ik*(Q_ik*dc_dj - Q_jk*ds_dj);
        di += dQ_jk*(Q_ik*ds_di + Q_jk*dc_di)  +  dQ_ik*(Q_ik*dc_di - Q_jk*ds_di);
      }

      dR[R_off + N*j+j] += dj;
      dR[R_off + N*i+j] += di;
    }} // END QR DECOMPOSITION
  }
  assert( l == 0, `WTF: ${l} != 0` );

  return Tensor.make(dA_shape,{values: dR},DType);
}



/** Returns a copy of a tensor of matrices with a different main diagonal.
  * 
  * @param a Tensor of shape [...,    M,N ].
  * @param d Tensor of shape [...,min(M,N)].
  * 
  * @returns Tensor of shape [...,    M,N ]. A new tensor comprised of the off-diagonal
  *          entries of a and the main diagonal set to the entries of d.
  */
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function setDiag_( a: Tensor|TensorLike, d: Tensor|TensorLike ): Tensor
{
  let $a = convertToTensor(a,'a','setDiag'); if( $a.rank < 2 ) throw new Error(`setDiag(): a.rank=${$a.rank} < 2`);
  let $d = convertToTensor(d,'d','setDiag'); if( $d.rank < 1 ) throw new Error(`setDiag(): d.rank=${$d.rank} < 1`);

  const dtype = upcastType($a.dtype, $d.dtype);
  if( $a.dtype != dtype ) $a = $a.cast(dtype);
  if( $d.dtype != dtype ) $d = $d.cast(dtype);

  const rank: number   = Math.max($a.rank-1, $d.rank),
       shape: number[] = new Array(rank);

  if( $d.shape[$d.rank-1] != Math.min( ...$a.shape.slice(-2) ) )
    throw new Error(`setDiag(): Incompatible shapes for a and d [${$a.shape}] [${$d.shape}]`)

  // FIND COMMON (BROADCASTED) SHAPE
  for( let i=$a.rank-2,
           j=$d.rank-1,
           k=   rank-1; i > 0 || j > 0; )
  {
    i--; j--; k--;
    if( 1 === $a.shape[i] )
      shape[k] = $d.shape[j] || 1;
    else if( $a.shape[i] != $d.shape[j] && $d.shape[j] != 1 )
      throw new Error(`setDiag(): Incompatible shapes for a and d [${$a.shape}] [${$d.shape}]`);
    else
      shape[k] = $a.shape[i] || 1;
  }

  shape[shape.length-1] = $d.shape[$d.rank-1];  $d = broadcastTo($d,shape);
  shape[shape.length-1] = $a.shape[$a.rank-2];
  shape             .push($a.shape[$a.rank-1]); $a = broadcastTo($a,shape);
  Object.freeze(shape);
  const $d_shape = $d.shape;

  return ENV.engine.runKernel(
    backend => backend.matrixSetDiag($a,$d),
    {$a,$d},
    dy => ({
      $a: () =>  setDiag(dy, zeros($d_shape) ),
      $d: () => diagPart(dy)
    })
  );
}



/** Returns the main diagonals from a tensor of matrices.
  * The result is a tensor of a rank one less than the
  * input tensor.
  * 
  * @param a Tensor of shape [...,     M,N]. The tensor whose main diagonal is returned.
  * 
  * @returns Tensor of shape [...,min(M,N)]. The main diagonal of `a`.
  */
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function diagPart_( a: Tensor|TensorLike ): Tensor
{
  const $a = convertToTensor(a,'a','diagPart'),
        $a_shape = $a.shape;

  if( $a.rank < 2 )                     throw new Error('diagPart(): Input a.rank must be at least 2.');
  if( $a.shape.some( d => d < 0 ||
                          d%1 !== 0 ) ) throw new Error(`diagPart(): Invalid input shape [${$a.shape}].`);

  return ENV.engine.runKernel(
    backend => backend.matrixDiagPart($a),
    {$a},
    dy => ({
      $a: () => setDiag( zeros($a_shape), dy )
    })
  );
}



/** Copies a tensor of matrices, setting everything outside a central band
  * in each matrix to zero.
  */
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function bandPart_<T extends Tensor>( a: T|TensorLike, numLower: number, numUpper: number ): T
{
  const $a = convertToTensor(a,'a','bandPart');
  if( numLower%1 != 0 ) throw new Error(`bandPart(): numLower=${numLower} is no integer.`);
  if( numUpper%1 != 0 ) throw new Error(`bandPart(): numUpper=${numUpper} is no integer.`);
  if( !(numLower <= $a.shape[$a.rank-2]) ) throw new Error(`bandPart() assertion failed: numLower <= nRows.`);
  if( !(numUpper <= $a.shape[$a.rank-1]) ) throw new Error(`bandPart() assertion failed: numUpper <= nCols.`);
  if( numLower < 0 ) numLower = $a.shape[$a.rank-2];
  if( numUpper < 0 ) numUpper = $a.shape[$a.rank-1];

  return  ENV.engine.runKernel(
    backend => backend.matrixBandPart($a,numLower,numUpper),
    {$a},
    (dy: T) => ({
      $a: () => bandPart(dy, numLower, numUpper)
    })
  );
}


/** Conjugates a tensor of matrices and then transposes the last two dimensions.
  * The adjoint is also commonly known as the Hermitian Transpose.
  *
  * @param a Tensor of shape [...,M,N]. The tensor of matrices that is to be tranposed.
  *
  * @returns Tensor of shape [...,N,M]. The transpose of `a`.
  */
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function adjoint_<T extends Tensor>( a: T|TensorLike ): T
{
  const $a = convertToTensor(a,'a','bandPart');

  const axes = Array.from( $a.shape, (_,i) => i );
  axes[axes.length-2] = axes.length-1;
  axes[axes.length-1] = axes.length-2;

  const $a_T = $a.transpose(axes);
  if( $a_T.dtype.startsWith('complex') )
    return conj($a_T)
  return $a_T;
}


function choleskyKernel<T extends Tensor>( a: Tensor ): T
{
  if( ! a.dtype.startsWith('float') ) throw new Error(`cholesky(): a.dtype=${a.dtype} not supported.`);
  if( a.rank < 2 ) throw new Error(`cholesky(): a.rank={a.rank} < 2.`);
    
  const
    dtype = a.dtype,
    shape = a.shape,
    [N,M] =   shape.slice(-2),
    L = a.dataSync().slice();
  a = undefined;

  if( N != M ) throw new Error('cholesky(): Last two dimensions must be square.')

  for( let off=0; off < L.length; off += N*N )
    // https://de.wikipedia.org/wiki/Cholesky-Zerlegung
    for( let i=0; i<N; i++ )
    for( let j=0; j<N; j++ )
      if( i < j ) {
        L[off+N*i+j] = 0;
      } else {
        let
          sum = L[off + N*i+j],
          cor = 0.0;
        for( let k=0; k<j; k++ ) {
          // https://en.wikipedia.org/wiki/Kahan_summation_algorithm
          const
            r = cor + L[off + N*i+k] * L[off + N*j+k],
            s = sum - r;
          cor = (s - sum) + r;
          sum =  s;
        }
        if( i > j ) L[off + N*i+j] = sum / L[off + N*j+j];
        else {      L[off + N*i+i] = Math.sqrt(sum);
          if( isNaN(L[off + N*i+i]) )
            throw new Error('cholesky(): a contains NaNs or (near) negative semi-definite.');
        }
      }

  return Tensor.make(shape,{values: L},dtype);
}


/** Computes the cholesky decomposition of a tensor of symmetric matrices.
  * 
  * @param a Tensor of shape [...,N,N]. A tensor of symmetric matrices, for which the 
  *          cholesky decomposition is computed.
  * 
  * @returns Tensor of shape [...,N,N]. A tensor of lower triangular matrices `L` such that `L∙Lᵀ=A`.
  */
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function cholesky_<T extends Tensor>( a: T|TensorLike ): T
{
  const $a = convertToTensor(a,'a','cholesky');

  // WHERE THE BACKPROP COMES FROM (⊗ is the Hadamard Product, i.e. elementwise multiplication):
  // SEE: https://arxiv.org/pdf/1602.07527.pdf#page=3
  //
  // some preliminaries:
  // (1) tr(A∙◣) = tr( triu(A) ∙ ◣ ) => the strict upper triangle can be chosen at will
  // (2) tr(A∙◥) = tr( tril(A) ∙ ◥ ) => the strict lower triangle can be chosen at will
  //
  // now for the pertubation:
  //     A = L∙Lᵀ
  // => dA = dL∙Lᵀ + L∙dLᵀ
  // =>  L⁻¹∙dA∙L⁻ᵀ = L⁻¹∙dL + dLᵀ∙L⁻ᵀ (= ◣ + ◥)
  // =>  L⁻¹∙dL =   tril( L⁻¹∙dA∙L⁻ᵀ - ½diag(L⁻¹∙dA∙L⁻ᵀ) )
  // =>      dL = L∙tril( L⁻¹∙dA∙L⁻ᵀ - ½diag(L⁻¹∙dA∙L⁻ᵀ) )
  // =>      dL = L∙Φ(L⁻¹∙dA∙L⁻ᵀ)
  // where:
  //                  ⎧ i>j: X[i,j]
  //     Φ(X)[i,j] := ⎨ i=j: X[i,j]/2
  //                  ⎩ i<j: 0
  //
  //     ℒ := ∂f/∂L
  //
  // => df = tr(ℒᵀ∙dL)
  //       = 0.5*tr(ℒᵀ∙L∙L⁻¹∙dL) + 0.5*tr(Lᵀ∙ℒ∙dLᵀ∙L⁻ᵀ) ( = 0.5*tr(ℒᵀ∙L ∙ ◣) + 0.5*tr(Lᵀ∙ℒ ∙ ◥) )
  //
  // (1) & (2) => df = 0.5*tr(       { Φ(Lᵀ∙ℒ) + Φᵀ(Lᵀ∙ℒ) } ∙ { L⁻¹∙dL + dLᵀ∙L⁻ᵀ } )
  //                 = 0.5*tr(       { Φ(Lᵀ∙ℒ) + Φᵀ(Lᵀ∙ℒ) } ∙   L⁻¹ ∙ dA ∙ L⁻ᵀ )
  //                 = 0.5*tr( L⁻ᵀ ∙ { Φ(Lᵀ∙ℒ) + Φᵀ(Lᵀ∙ℒ) } ∙   L⁻¹ ∙ dA       )
  //                 = 0.5*tr( L⁻¹ ∙ { Φ(Lᵀ∙ℒ) + Φᵀ(Lᵀ∙ℒ) } ∙   L⁻ᵀ ∙ dAᵀ      )
  //                 = 0.5*tr( L⁻ᵀ ∙ { Φ(Lᵀ∙ℒ) + Φᵀ(Lᵀ∙ℒ) } ∙   L⁻¹ ∙ dAᵀ      )
  //
  // => ∂f/∂A = 0.5 * L⁻ᵀ∙{Φ (Lᵀ∙ℒ) + Φᵀ(Lᵀ∙ℒ)} ∙ L⁻¹
  //          = 0.5 * L⁻ᵀ∙ Φ (Lᵀ∙ℒ) ∙ L⁻¹
  //          + 0.5 *(L⁻ᵀ∙ Φᵀ(Lᵀ∙ℒ) ∙ L⁻¹)ᵀ
  //          = 0.5 * L⁻ᵀ∙ { (Lᵀ∙ℒ)ᵀ + tril(Lᵀ∙ℒ) } ∙ L⁻¹

  return ENV.engine.runKernel(
    (backend,saveFn) => saveFn(/*L=*/choleskyKernel($a)),
    {$a},
    (dL,[L]) => ({
      $a: () => {
        // TODO: is tidy required here?
//        dL = bandPart(dL,-1,0);
        let dA = matMul(L,dL,/*adjoint_L=*/true);
        dA = bandPart(dA,-1,0);
        const diag0 = zeros( dA.shape.slice(0,-1) );
        dA = setDiag(dA,diag0).add( adjoint(dA) );
        dA = triangularSolve(L,dA,/*lower=*/true,/*adjoint_L=*/true); dA = adjoint(dA);
        dA = triangularSolve(L,dA,/*lower=*/true,/*adjoint_L=*/true);
        const HALF = scalar(0.5);
        dA = setDiag( dA, diagPart(dA).mul(HALF) ); // <- FIXME: where is this HALF coming from ???
        dA = bandPart(dA,-1,0);
        return dA as T;
      }
    })
  );
}


/** Given a lower triangular matrix l and a right-hand-side y, this method solves
 *  the LES `L∙Lᵀ∙X = Y`.
 *
 *  @param l Tensor of shape [...,N,N]. A tensor of lower triangular matrices.
 *  @param y Tensor of shape [...,N,M]. A tensor of right-hand-side matrices.
 *
 *  @returns Tensor of shape [...,N,M]. The solution `X` of the LES `L∙Lᵀ∙X = Y`.
 */
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function choleskySolve_( l: Tensor, y: Tensor )
{
  let x = triangularSolve(l,y,/*lower=*/true,/*adjoint_L=*/false)
      x = triangularSolve(l,y,/*lower=*/true,/*adjoint_L=*/true )
  return x;
}


/** Solves a triangular linear equation system (LES).
  *
  * @param l The triangular matrix of the .
  * @param y The right-hand-side of the LES.
  * @param lower If set to `true`, `l` is interpreted as lower triangular matrix.
  *              The strict upper triangular entries are ignore. If set to `false`,
  *              `l` is interpreted as upper triangular matrix and the strict lower
  *              triangular entries are ignored.
  * @param adjoint If set to `true`, the hermitian transpose of `l` is used in the LES.
  *
  * @returns The solution of one of the following LES:
  *   <dl>
  *     <dt>lower=false, adjoint=false <dd>tril(l) ∙x == y
  *     <dt>lower=true,  adjoint=false <dd>triu(l) ∙x == y
  *     <dt>lower=false, adjoint=true  <dd>tril(l)ᴴ∙x == y
  *     <dt>lower=true,  adjoint=true  <dd>triu(l)ᴴ∙x == y
  *   </dl>
  */ 
/** @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function triangularSolve_( l: Tensor|TensorLike, y: Tensor|TensorLike, lower=true, adjoint=false ): Tensor
{
  // FIXME: if `l` is singular the right hand side could be checked for 0 and then some solution could be used
  let [$l,$y] = broadcastMatrices(
    convertToTensor(l,'l','triangularSolve'),
    convertToTensor(y,'y','triangularSolve')
  );
  l=undefined;
  y=undefined;
  if( $l.rank < 2 ) throw new Error(`triangularSolve(): l.rank must be at least 2.`);
  if( $y.rank < 2 ) throw new Error(`triangularSolve(): y.rank must be at least 2.`);

  const dtype = upcastType($l.dtype, $y.dtype);
  if( $l.dtype != dtype ) $l = $l.cast(dtype);
  if( $y.dtype != dtype ) $y = $y.cast(dtype);

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

  // SEE: https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/ops/linalg_grad.py#L218
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


function triangularSolveKernel( l: Tensor, y: Tensor, lower: boolean, adjoint: boolean ): Tensor
{
  if( ! l.dtype.startsWith('float') ) throw new Error(`triangularSolve(): l.dtype=${l.dtype} not supported.`);
  if( ! y.dtype.startsWith('float') ) throw new Error(`triangularSolve(): y.dtype=${y.dtype} not supported.`);
  if( l.rank < 2 ) throw new Error('triangularSolve(): l must be at least 2D.');
  if( y.rank < 2 ) throw new Error('triangularSolve(): y must be at least 2D.');
  if( l.rank != y.rank ) throw new Error('triangularSolve(): l and y must have same rank.');
  for( let i=l.rank-2; i-- > 0; )
    if( l.shape[i] != y.shape[i] ) throw new Error('triangularSolve(): leading dimensions do not match.');

  const [N,M] = l.shape.slice(-2),
        [I,J] = y.shape.slice(-2);
  if( N != M ) throw new Error('triangularSolve(): Last two axes of L not square.');
  if( I != M ) throw new Error('triangularSolve(): L and y do not match.');

  const
    rank = Math.max(l.rank, y.rank),
    X_shape = Array.from(l.shape);
  X_shape[rank-2] = I;
  X_shape[rank-1] = J;

  // GENERATE RESULT DATA
  const
    dtype = 'float32',
//    dtype =  ( l.dtype === 'float64' ||
//               y.dtype === 'float64' ) ? 'float64' : 'float32',
    DTypeArray = dtype === 'float32' ? Float32Array
                                     : Float64Array,
    L = l.dataSync(),
    X = DTypeArray.from( y.dataSync() ) as TypedArray;
  let L_off = 0,
      X_off = 0;
  l = undefined;
  y = undefined;

  function solv( d: number ): void {
    if( d === rank-2 ) {
      if( ! adjoint )
      {
        if(lower) // FORWARD SUBSTITUTION
          for( let i=0; i < I; i++ ) {
            for( let k=0; k < i; k++ )
            for( let j=0; j < J; j++ ) X[X_off + J*i+j] -= L[L_off + N*i+k] * X[X_off + J*k+j]

            for( let j=0; j < J; j++ ) X[X_off + J*i+j] /= L[L_off + N*i+i]
          }
        else // BACKWARD SUBSTITUTION
          for( let i=I; i-- > 0; ) {
            for( let j=J; j-- > 0; ) X[X_off + J*i+j] /= L[L_off + N*i+i]

            for( let k=i; k-- > 0; )
            for( let j=J; j-- > 0; ) X[X_off + J*k+j] -= L[L_off + N*k+i] * X[X_off + J*i+j]
          }
      }
      else
      {
        if(lower) // BACKWARD SUBSTITUTION (TRANSPOSED)
          for( let i=I; i-- > 0; ) {
            for( let j=J; j-- > 0; ) X[X_off + J*i+j] /= L[L_off + N*i+i]

            for( let k=i; k-- > 0; )
            for( let j=J; j-- > 0; ) X[X_off + J*k+j] -= L[L_off + N*i+k] * X[X_off + J*i+j]
          }
        else // FORWARD SUBSTITUTION (TRANSPOSED)
          for( let i=0; i < I; i++ ) {
            for( let k=0; k < i; k++ )
            for( let j=0; j < J; j++ ) X[X_off + J*i+j] -= L[L_off + N*k+i] * X[X_off + J*k+j]

            for( let j=0; j < J; j++ ) X[X_off + J*i+j] /= L[L_off + N*i+i]
          }
      }

      L_off += N*N;
      X_off += N*J;

      return;
    }
    for( let l=X_shape[d]; l-- > 0; )
      solv(d+1);
  }
  solv(0);

  return Tensor.make(X_shape,{values: X},dtype);
}


/** Compute QR decomposition of m-by-n matrix using Givens rotations.
  *
  * Implementation based on
  *   [http://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf]
  * (http://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf)
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
  if( a.rank < 2 )
    throw new Error(`qr() requires input tensor to have a rank >= 2, but got rank ${a.rank}`);
  if( a.dtype.startsWith('complex') )
    throw new Error(`qr() not yet supported for complex tensors.`);

  const [m,n] = a.shape.slice(-2)

  if( m == n || m > n && !fullMatrices  )
  {
    // FIXME: What if R is singular?
    return ENV.engine.runKernel(
      (backend,saveFunc) => {
        const [q,r] = qr_eco_decomp_(a);
        saveFunc(q);
        saveFunc(r);
        return [q,r];
      },
      { $a: a },
      ([dq,dr], [q,r]) => ({
        $a: () => {
          // TODO: is tidy required here?
          // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/ops/linalg_grad.py#L95
          const qdq  = matMul(q,dq, true, false), qdq_ = qdq.sub( adjoint_(qdq) ),
                rdr  = matMul(r,dr, false, true), rdr_ = rdr.sub( adjoint_(rdr) ),
                tril = bandPart( add(qdq_,rdr_), -1, 0 );

          const triSolv = (x: Tensor,r: Tensor) => adjoint_(
            triangularSolve(r, adjoint(x), /*lower=*/false, /*adjoint_r*/false)
          );

          const grad_a = matMul( q, dr.add( triSolv(tril,r) ) ),
                grad_b = triSolv( dq.sub( matMul(q,qdq) ), r );

          return add(grad_a,grad_b);
        }
      })
    ) as [Tensor, Tensor];
  }

  let [q,r] = ENV.engine.runKernel(
    (backend,saveFunc) => {
      const [q,r,sin] = qr_full_decomp_(a);
      saveFunc(q);
      saveFunc(r);
      saveFunc(sin);
      return [q,r];
    },
    { a: a },
    ([dq,dr], [q,r,sin]) => ({
      a: () => ENV.engine.runKernel(
        (backend,saveFunc) => qr_full_backprop_(q,dq, r,dr, sin),
        { $dq: dq, $dr: dr }
      )
    })
  );

  if( ! fullMatrices  &&  m > n ) {
    let end = a.shape.slice(); 
    q = q.slice([0, 0], end); end[end.length-2] = n;
    r = r.slice([0, 0], end);
  }

  return [q,r];
}

/** Applies the inverse of a row permutations, given by list of indices, to a Tensor.
  *
  * @param a Tensor of shape [...,M,N].
  * @param p Tensor of shape [...,M].
  * 
  * @returns b Tensor of shape [...,M,N], such that: `b[...,p[...,i],j] == a[...,i,j]`.
  */
export function permuteRowsInv_( a: Tensor, p: Tensor ): Tensor // <- TODO: export this?
{
  if( a.rank != p.rank+1 ) throw new Error(`permuteRows(): a.rank and p.rank do not match.`);
  for( let i=p.rank; i-- > 0; )
    if( a.shape[i] != p.shape[i] )
      throw new Error(`permuteRows(): a.shape and p.shape incompatible.`);

  const [N] = p.shape.slice(-1),
         P = p.dataSync().slice(),
         P_inv = new Int32Array(P.length);

  for( let off=0; off < P.length; off += N )
  for( let  i =0;  i  < N       ; i++ )
    P_inv[off + P[off+i]] = off+i;

  return gather(
    a.reshape( [-1].concat( a.shape.slice(-1) ) ),
    P_inv
  ).reshape( a.shape )
}

/** Applies a row permutations, given by list of indices, to a Tensor.
  *
  * @param a Tensor of shape [...,M,N].
  * @param p Tensor of shape [...,M].
  * 
  * @returns b Tensor of shape [...,M,N], such that: `b[...,i,j] == a[...,p[...,i],j]`.
  */
export function permuteRows_( a: Tensor, p: Tensor ): Tensor // <- TODO: export this?
{
  if( a.rank != p.rank+1 ) throw new Error(`permuteRows(): a.rank and p.rank do not match.`);
  for( let i=p.rank; i-- > 0; )
    if( a.shape[i] != p.shape[i] )
      throw new Error(`permuteRows(): a.shape and p.shape incompatible.`);

  const [N] = p.shape.slice(-1);

  p = p.reshape(  [-1].concat( p.shape.slice(-1) )  );
  p = p.add(
    range(0, p.shape[0]*N, N, 'int32').reshape([-1,1])
  );

  return a.reshape( [-1].concat(a.shape.slice(-1)) )
          .gather( p.flatten() )
          .reshape( a.shape );
}

/** Computes the LU decomposition.
  * 
  * @param a Tensor[...,N,N]. 
  * 
  * @returns [lu: Tensor[...,N,N], p: Tensor[...N]] Where `(L @ U)[i,j] = a[...,p[...,i],j]`
  */
/**
  * @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function lu_( a: Tensor, permute=true ): [Tensor, Tensor]
{
  //       dA     =     dL∙U + L∙dU
  // = L⁻¹∙dA∙U⁻¹ = L⁻¹∙dL   +   dU∙U⁻¹ = strict(◣) + ◥
  // => dL = L∙strict_tril(L⁻¹∙dA∙U⁻¹)
  // => dU =          triu(L⁻¹∙dA∙U⁻¹)∙U
  // => d(LU) = dL + dU
  // ℒ := ∂f/∂(LU) = strict(◣)
  // df = tr( ℒ∙d(LU)ᵀ )
  //    = tr( ℒ∙dLᵀ ) + tr( ℒ∙dUᵀ )
  //    = tr( Lᵀ∙ℒ∙{strict_tril(L⁻¹∙dA∙U⁻¹)}ᵀ ) + tr( ℒ∙Uᵀ∙{triu(L⁻¹∙dA∙U⁻¹)}ᵀ )
  //    = tr( { strict_tril(Lᵀ∙ℒ) + triu(ℒ∙Uᵀ) } ∙ (L⁻¹∙dA∙U⁻¹)ᵀ )
  //    = tr( L⁻ᵀ∙{ strict_tril(Lᵀ∙ℒ) + triu(ℒ∙Uᵀ) }∙U⁻ᵀ ∙ dAᵀ )
  // => ∂f/∂A = L⁻ᵀ∙{ strict_tril(Lᵀ∙ℒ) + triu(ℒ∙Uᵀ) }∙U⁻ᵀ
  
  const $a = convertToTensor(a,'a','lu');

  if( ! permute )
    throw new Error('lu(): permute=false not yet implemented.');

  return ENV.engine.runKernel(
    (backend,saveFunc) => {
      const [lu,p] = lu_p_decomp_($a);
      saveFunc(lu);
      saveFunc(p );
      return [lu,p];
    },
    { $a: $a },
    ([dLU,dP],[lu,p]) => ({
      $a: () => {
        const diag0 = zeros(p.shape),
              diag1 =  ones(p.shape);

        const l = setDiag( bandPart(lu,-1, 0), diag1 ),
              u =          bandPart(lu, 0,-1);

        let ℒL = matMul(  dLU,l, true, false); ℒL = bandPart(ℒL, 0,-1); ℒL = setDiag(ℒL, diag0);
        let Uℒ = matMul(u,dLU,  false, true ); Uℒ = bandPart(Uℒ,-1, 0);

        let dA = add(ℒL,Uℒ)
        dA = triangularSolve(u, dA, /*lower=*/false); dA = adjoint(dA);
        dA = triangularSolve(l, dA, /*lower=*/true, /*adjoint_l=*/true);
        return permuteRowsInv_(dA,p);
      }
    })
  ) as [Tensor, Tensor];
}

/** Solves a linear equation system (LES) using its LU decomposition.
  * 
  * @param lu Tensor of shape [...,N,N]. Thensor containing the data of L and U,
  *           the triangular matrices resulting from the LU Decomposition.
  * @param p  Tensor of shape [...,N]. The permutation indices from the LU Decomposition.
  * @param y  Tensor of shape [...,N,M]. The right-hand-side of the LES.
  */
/**
  * @doc {heading:'Operations',
  *       subheading:'Linear Algebra',
  *       namespace:'linalg'}
  */
function luSolve_( lu: Tensor|TensorLike, p: Tensor|TensorLike, y: Tensor|TensorLike = undefined ): Tensor
{
  let $lu = convertToTensor(lu,'lu','luSolve'); lu = undefined;

  const [n] = $lu.shape.slice(-1);

  let $p: Tensor,
      $y: Tensor;

  if( null == y ) {
    $y = convertToTensor(p, 'p', 'luSolve');
    $p = range(0,n,1,'int32');
  } else {
    $p  = convertToTensor(p, 'p', 'luSolve');
    $y  = convertToTensor(y, 'y', 'luSolve');
  }
  lu = p = y = null;

  if( $lu.rank < 2 ) throw new Error('lu(): lu.rank must be at least 2.');

  if( $lu.shape[$lu.rank-1] != $lu.shape[$lu.rank-2] ) throw new Error('lu(): lu must be square.');
  if( $lu.shape[$lu.rank-1] !=  $p.shape[$p .rank-1] ) throw new Error('lu(): lu and p of incompatible shape.');
  if( $lu.shape[$lu.rank-1] !=  $y.shape[$y .rank-2] ) throw new Error('lu(): lu and y of incompatible shape.');

  const rank = Math.max($lu.rank, $p.rank, $y.rank);
  const shape = $p.shape.slice(0,-1);
  while( shape.length < rank-2 )
    shape.unshift(1);

  // FIND COMMON (BROADCASTED) SHAPE
  for( const tensor of [$lu,$y] )
    for( let i=rank-2, j=tensor.rank-2; i-- > 0 && j-- > 0; )
      if( 1 === shape[i] )
        shape[i] = tensor.shape[j];
      else if( shape[i] != tensor.shape[j] && tensor.shape[j] != 1 )
        throw new Error(`lu(): Shapes not broadcast-compatible.`);

  $lu = broadcastTo( $lu, shape.concat($lu.shape.slice(-2)) )
  $p  = broadcastTo( $p , shape.concat($p .shape.slice(-1)) )
  $y  = broadcastTo( $y , shape.concat($y .shape.slice(-2)) )

  const l = setDiag( $lu, ones($p.shape) )

  let x = permuteRows_( $y, $p );
  x = triangularSolve( l ,x,/*lower=*/true );
  x = triangularSolve($lu,x,/*lower=*/false);
  return x;
}

export const gramSchmidt = op({gramSchmidt_});

export const adjoint = op({adjoint_});
export const setDiag = op({setDiag_});
export const diagPart = op({diagPart_})
export const bandPart = op({bandPart_});

export const qr = op({qr_});
export const lu = op({lu_});
export const luSolve = op({luSolve_});
export const   cholesky      = op({  cholesky_     })
export const   choleskySolve = op({  choleskySolve_})
export const triangularSolve = op({triangularSolve_})
