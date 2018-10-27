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

import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {Scalar, Tensor, Tensor1D, Tensor2D} from '../tensor';
import {broadcastMatrices} from './linalg_util';
import {CPU_ENVS, ALL_ENVS, expectArraysClose, expectArraysEqual, WEBGL_ENVS, numDiff} from '../test_util';
import {permuteRows_, permuteRowsInv_} from './linalg_ops';

import {scalar, tensor1d, tensor2d, tensor3d, tensor4d} from './ops';

const randInt = (from: number, until: number) => Math.floor(Math.random()*(until-from)) + from;

describeWithFlags('gramSchmidt-tiny', ALL_ENVS, () => {
  it('2x2, Array of Tensor1D', () => {
    const xs: Tensor1D[] = [
      tf.randomNormal([2], 0, 1, 'float32', 1),
      tf.randomNormal([2], 0, 1, 'float32', 2)
    ];
    const ys = tf.linalg.gramSchmidt(xs) as Tensor1D[];
    const y = tf.stack(ys) as Tensor2D;
    // Test that the results are orthogonalized and normalized.
    expectArraysClose(y.transpose().matMul(y), tf.eye(2));
    // Test angle between xs[0] and ys[0] is zero, i.e., the orientation of the
    // first vector is kept.
    expectArraysClose(
        tf.sum(xs[0].mul(ys[0])), tf.norm(xs[0]).mul(tf.norm(ys[0])));
  });

  it('3x3, Array of Tensor1D', () => {
    const xs: Tensor1D[] = [
      tf.randomNormal([3], 0, 1, 'float32', 1),
      tf.randomNormal([3], 0, 1, 'float32', 2),
      tf.randomNormal([3], 0, 1, 'float32', 3)
    ];
    const ys = tf.linalg.gramSchmidt(xs) as Tensor1D[];
    const y = tf.stack(ys) as Tensor2D;
    expectArraysClose(y.transpose().matMul(y), tf.eye(3));
    expectArraysClose(
        tf.sum(xs[0].mul(ys[0])), tf.norm(xs[0]).mul(tf.norm(ys[0])));
  });

  it('3x3, Matrix', () => {
    const xs = tf.randomNormal([3, 3], 0, 1, 'float32', 1) as Tensor2D;
    const y = tf.linalg.gramSchmidt(xs) as Tensor2D;
    expectArraysClose(y.transpose().matMul(y), tf.eye(3));
  });

  it('2x3, Matrix', () => {
    const xs = tf.randomNormal([2, 3], 0, 1, 'float32', 1) as Tensor2D;
    const y = tf.linalg.gramSchmidt(xs) as Tensor2D;
    expectArraysClose(y.matMul(y.transpose()), tf.eye(2));
  });

  it('3x2 Matrix throws Error', () => {
    const xs = tf.tensor2d([[1, 2], [3, -1], [5, 1]]);
    expect(() => tf.linalg.gramSchmidt(xs))
        .toThrowError(
            /Number of vectors \(3\) exceeds number of dimensions \(2\)/);
  });

  it('Mismatching dimensions input throws Error', () => {
    const xs: Tensor1D[] =
        [tf.tensor1d([1, 2, 3]), tf.tensor1d([-1, 5, 1]), tf.tensor1d([0, 0])];

    expect(() => tf.linalg.gramSchmidt(xs)).toThrowError(/Non-unique/);
  });

  it('Empty input throws Error', () => {
    expect(() => tf.linalg.gramSchmidt([])).toThrowError(/empty/);
  });
});

// For operations on non-trivial matrix sizes, we skip the CPU-only ENV and use
// only WebGL ENVs.
describeWithFlags('gramSchmidt-non-tiny', WEBGL_ENVS, () => {
  it('32x512', () => {
    // Part of this test's point is that operation on a matrix of this size
    // can complete in the timeout limit of the unit test.
    const xs = tf.randomUniform([32, 512]) as Tensor2D;
    const y = tf.linalg.gramSchmidt(xs) as Tensor2D;
    expectArraysClose(y.matMul(y.transpose()), tf.eye(32));
  });
});

describeWithFlags('lu', CPU_ENVS, () => {
  const la = tf.linalg;

  const testWith = (a: Tensor) => {

    function test_decomp( a: Tensor )
    {
      let [lu,p] = la.lu(a);
      let l = la.setDiag( la.bandPart(lu, -1, 0), tf.ones(lu.shape.slice(0,-1) ) );
      let u =             la.bandPart(lu,  0,-1);
      let A = tf.matMul(l,u);

      expectArraysEqual( l.abs().max(), tf.scalar(1) );

      expectArraysEqual(lu.shape, a.shape             );
      expectArraysEqual( p.shape, a.shape.slice(0,-1) );

      expectArraysClose( A, permuteRows_(a,p) );
      expectArraysClose( permuteRowsInv_(A,p), a );
    };
    test_decomp(a);

    // TEST GRADIENTS
    const perm: Int32Array[] = [];
    const w = tf.randomUniform(a.shape,-1,+1),
          f = (a: Tensor) => {
            const [lu,p] = la.lu(a);
            perm.push( p.dataSync() as Int32Array );
            return lu.mul(w).mean() as Scalar;
          },
          g = numDiff(f),
          h = tf.grad(f);

    try {
      const g_a = g(a);
      const noChangeInPerm = perm.slice(1).every(
        p => perm[0].every( (q,i) => q == p[i] )
      );
      // if the permutation changes due to the finite difference this may drastically change the gradients
      if( noChangeInPerm )
        expectArraysClose( g_a, h(a) );
      else
        console.log(
            "lu(): p changed during finite difference calculation. Skipping test."
          + "\nIt's perfectly normal for this to happend once or twice."
        );
    }
    catch(err) {
      console.log('A' );       a .print();
      console.log('LU'); la.lu(a)[0].print();
      console.log('G' );     g(a).print();
      console.log('H' );     h(a).print();
      throw err;
    }
  };

  it('2x2', () => testWith( tf.tensor2d([[1,2],
                                         [3,4]], [2,2]) ) );

  for( let run=32; run-- > 0; )
  {
    let A_shape = Array.from({ length: randInt(2,5) }, () => randInt(1,5) );
    A_shape[A_shape.length-1] = A_shape[A_shape.length-2];

    it(`random#${run}_${A_shape.join('x')}`, () => {
      const ONE = tf.scalar(1),
            TWO = tf.scalar(2);
      // create a random matrix starting from a random singular value decomposition
      // (this way we control condition number)
      const [q1] = la.qr( tf.randomUniform(A_shape,-1,+1) ),
            [q2] = la.qr( tf.randomUniform(A_shape,-1,+1) );

      const magn = tf.randomNormal (A_shape.slice(0,-1),/*mean=*/1,/*stdDev=*/0.2),
            sign = tf.randomUniform(A_shape.slice(0,-1),0,2,'int32')
                     .cast('float32')
                     .mul(TWO)
                     .sub(ONE);

      const s = la.setDiag( tf.zeros(A_shape), tf.mul(sign,magn) );

      const a = [q1,s,q2].reduce( (a,b) => tf.matMul(a,b) );
      testWith(a);
    });
  }
});

describeWithFlags('luSolve', CPU_ENVS, () => {
  const la = tf.linalg;

  const testWith = (a: Tensor, y: Tensor) => {
    let [lu,p] = la.lu(a);

    let x = la.luSolve(lu,p,y);

    const Y = tf.matMul(a,x);

    expectArraysClose(Y, tf.broadcastTo(y,Y.shape) );
  };

  it('2x2', () => testWith( tf.tensor2d([[1,2],
                                         [3,4]]), tf.tensor2d([[5, 6, 7],
                                                               [8, 9,10]]) ) );

  for( let run=32; run-- > 0; )
  {
    let A_shape = Array.from({ length: randInt(2,5) }, () => randInt(1,5) ),
        y_shape = A_shape.slice( randInt(0,A_shape.length-2) );
    if( Math.random() < 0.5 )
      [A_shape,y_shape] = [y_shape,A_shape];
    A_shape[A_shape.length-1] = A_shape[A_shape.length-2];

    for( let L=A_shape.length-2, y=y_shape.length-2; L-- > 0 && y-- > 0; )
      switch( randInt(0,3) )
      {
        case 0: break;
        case 1: A_shape[L] = 1; break;
        case 2: y_shape[y] = 1; break;
      }

    it(`random#${run}_${A_shape.join('x')}`, () => {
      const ONE = tf.scalar(1);
      const TWO = tf.scalar(2);
      // create a random matrix starting from a random singular value decomposition
      // (this way we control condition number)
      const [q1] = la.qr( tf.randomUniform(A_shape,-1,+1) );
      const [q2] = la.qr( tf.randomUniform(A_shape,-1,+1) );
      const sign = tf.randomUniform(A_shape.slice(0,-1),0,2,'int32').cast('float32').mul(TWO).sub(ONE);
      const magn = tf.randomNormal (A_shape.slice(0,-1),/*mean=*/1,/*stdDev=*/0.1);

      const s = la.setDiag( tf.zeros(A_shape), tf.mul(sign,magn) );

      const a = [q1,s,q2].reduce( (a,b) => tf.matMul(a,b) );
      const y = tf.randomUniform(y_shape, -1, +1);
      testWith(a,y);
    });
  }
});

describeWithFlags('adjoint', ALL_ENVS, () => {
  it('2x3', () => {
    const a   = tf.tensor2d([[1,2,3],
                             [4,5,6]], [2,3]),
          a_T = tf.tensor2d([[1,4],
                             [2,5],
                             [3,6]],[3,2]);
    expectArraysEqual( tf.linalg.adjoint(a), a_T );
  });
  it('3x2x1', () => {
    const a   = tf.tensor3d([[[1],[2]],
                             [[3],[4]],
                             [[5],[6]]], [3,2,1]),
          a_T = tf.tensor3d([[[1,2]],
                             [[3,4]],
                             [[5,6]]], [3,1,2]);
    expectArraysEqual( tf.linalg.adjoint(a), a_T );
  });
});


describeWithFlags('diagPart', ALL_ENVS, () => {
  const la = tf.linalg;

  function testWith( a: Tensor, d: Tensor ): void
  {
    for( a of [la.adjoint(a),a] )
    {
      expectArraysEqual(la.diagPart(a), d);

      const w = tf.randomUniform(d.shape,-1,+1),
            f = (a: Tensor) => la.diagPart(a).mul(w).mean() as Scalar,
            g = numDiff(f),
            h = tf.grad(f);
      expectArraysClose( g(a), h(a) );
    }
  }

  it('3x4', () => {
    let a = tf.tensor2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9,10,11,12]
    ]);
    const d =  tf.tensor1d([1,6,11]);
    testWith(a,d);
  });
  it('3x3', () => {
    let a = tf.tensor2d([
      [1, 2, 3],
      [5, 6, 7],
      [9,10,11]
    ]);
    const d =  tf.tensor1d([1,6,11]);
    testWith(a,d);
  });
  it('2x2x3', () => {
    let a = tf.tensor3d(
      [[[ 1, 2, 3],
        [ 4, 5, 6]],
       [[ 7, 8, 9],
        [10,11,12]]]
    );
    const d =  tf.tensor2d([[1,5],[7,11]]);
    testWith(a,d);
  });
})


describeWithFlags('setDiag', ALL_ENVS, () => {
  const la = tf.linalg;

  function testWith( a: Tensor, d: Tensor, b: Tensor ): void
  {
    for( let i=2; i-- > 0; )
    {
      expectArraysEqual(la.setDiag(a,d), b);

      const w = tf.randomUniform(a.shape,-1,+1),
            f = (a: Tensor, d: Tensor) => la.setDiag(a,d).mul(w).mean() as Scalar,
            g1 = numDiff( a => f(a,d) )(a),
            g2 = numDiff( d => f(a,d) )(d),
           [h1,h2] = tf.grads(f)([a,d]);
      expectArraysClose(g1,h1);
      expectArraysClose(g2,h2);

      a = la.adjoint(a);
      b = la.adjoint(b);
    }
  }

  it('3x4', () => {
    const a = tf.tensor2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9,10,11,12]
    ]);
    const d =  tf.tensor1d([13,14,15]);
    const b = tf.tensor2d([
      [13, 2, 3, 4],
      [5, 14, 7, 8],
      [9, 10,15,12]
    ]);
    testWith(a,d,b);
  });
  it('3x3', () => {
    const a = tf.tensor2d([
      [1, 2, 3],
      [5, 6, 7],
      [9,10,11]
    ]);
    const d =  tf.tensor1d([12,13,14]);
    const b = tf.tensor2d([
      [12, 2, 3],
      [5, 13, 7],
      [9, 10,14]
    ]);
    testWith(a,d,b);
  });
  it('2x2x3', () => {
    const a = tf.tensor3d(
      [[[ 1, 2, 3],
        [ 4, 5, 6]],
       [[ 7, 8, 9],
        [10,11,12]]]
    );
    const d =  tf.tensor2d([[13,14],
                            [15,16]]);
    const b = tf.tensor3d(
      [[[13, 2, 3],
        [ 4,14, 6]],
       [[15, 8, 9],
        [10,16,12]]]
    );
    testWith(a,d,b);
  });
})


describeWithFlags('bandPart', ALL_ENVS, () => {
  it('3x4', () => {
    const a = tf.tensor2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9,10,11,12]
    ]);
    expectArraysEqual( tf.linalg.bandPart(a,0,0), tf.tensor2d([[1,0, 0, 0],
                                                               [0,6, 0, 0],
                                                               [0,0,11, 0]]) );
    expectArraysEqual( tf.linalg.bandPart(a,0,1), tf.tensor2d([[1,2, 0, 0],
                                                               [0,6, 7, 0],
                                                               [0,0,11,12]]) );
    expectArraysEqual( tf.linalg.bandPart(a,0,2), tf.tensor2d([[1,2, 3, 0],
                                                               [0,6, 7, 8],
                                                               [0,0,11,12]]) );
    expectArraysEqual( tf.linalg.bandPart(a,0,2), tf.tensor2d([[1,2, 3, 0],
                                                               [0,6, 7, 8],
                                                               [0,0,11,12]]) );
    for( const numUpper of [3,4,-1,-2] )
      expectArraysEqual( tf.linalg.bandPart(a,0,numUpper), tf.tensor2d([[1,2, 3, 4],
                                                                        [0,6, 7, 8],
                                                                        [0,0,11,12]]) );


    expectArraysEqual( tf.linalg.bandPart(a,1,0), tf.tensor2d([[1, 0, 0, 0],
                                                               [5, 6, 0, 0],
                                                               [0,10,11, 0]]) );
    expectArraysEqual( tf.linalg.bandPart(a,1,1), tf.tensor2d([[1, 2, 0, 0],
                                                               [5, 6, 7, 0],
                                                               [0,10,11,12]]) );
    expectArraysEqual( tf.linalg.bandPart(a,1,2), tf.tensor2d([[1, 2, 3, 0],
                                                               [5, 6, 7, 8],
                                                               [0,10,11,12]]) );
    expectArraysEqual( tf.linalg.bandPart(a,1,2), tf.tensor2d([[1, 2, 3, 0],
                                                               [5, 6, 7, 8],
                                                               [0,10,11,12]]) );
    for( const numUpper of [3,4,-1,-2] )
      expectArraysEqual( tf.linalg.bandPart(a,1,numUpper), tf.tensor2d([[1, 2, 3, 4],
                                                                        [5, 6, 7, 8],
                                                                        [0,10,11,12]]) );


    for( const numLower of [2,3,-1,-2])
    {
      expectArraysEqual( tf.linalg.bandPart(a,numLower,0), tf.tensor2d([[1, 0, 0, 0],
                                                                        [5, 6, 0, 0],
                                                                        [9,10,11, 0]]) );
      expectArraysEqual( tf.linalg.bandPart(a,numLower,1), tf.tensor2d([[1, 2, 0, 0],
                                                                        [5, 6, 7, 0],
                                                                        [9,10,11,12]]) );
      expectArraysEqual( tf.linalg.bandPart(a,numLower,2), tf.tensor2d([[1, 2, 3, 0],
                                                                        [5, 6, 7, 8],
                                                                        [9,10,11,12]]) );
      expectArraysEqual( tf.linalg.bandPart(a,numLower,2), tf.tensor2d([[1, 2, 3, 0],
                                                                        [5, 6, 7, 8],
                                                                        [9,10,11,12]]) );
      for( const numUpper of [3,4,-1,-2] )
        expectArraysEqual( tf.linalg.bandPart(a,numLower,numUpper), tf.tensor2d([[1, 2, 3, 4],
                                                                                 [5, 6, 7, 8],
                                                                                 [9,10,11,12]]) );
    }

    for( const numUpper of [0,1,2,3,4,-1,-2] )
    for( const numLower of [0,1,2,3,  -1,-2] ) {
      const w = tf.randomUniform(a.shape),
            f = (x: Tensor) => tf.linalg.bandPart(x,numLower,numUpper).mul(w).mean() as Scalar,
            g = numDiff(f),
            h = tf.grad(f);
      expectArraysClose( g(a), h(a) );
    };
  });
});


describeWithFlags('cholesky', ALL_ENVS, () => {
  const la = tf.linalg;

  function testWith( l: Tensor ) {
    const a = tf.matMul(l,l,false,true);
    const L = la.cholesky(a);
    expectArraysClose(L,l);

    const w = tf.randomUniform(a.shape,-1,+1),
          f = (a: Tensor) => la.cholesky(a).mul(w).mean() as Scalar,
          g = numDiff(f),
          h = tf.grad(f);

    expectArraysClose( h(a), g(a) );
  };

  for( let run=128; run-- > 0; )
  {
    let L_shape = Array.from({ length: randInt(2,5) }, () => randInt(1,5) ),
        d_shape = L_shape.slice(0,-1);
    L_shape[L_shape.length-1] = L_shape[L_shape.length-2];

    // RUN TEST
    it(`random#${run}_${L_shape.join('x')}`, () => {
      let l = tf.randomUniform(L_shape,-0.2,+0.2)
      l = la.bandPart(l,-1, 0);
      l = la.setDiag( l, tf.randomNormal(d_shape,/*mean=*/1,/*stdDev=*/0.2) );
      testWith(l);
    });
  }
})


describeWithFlags('triangularSolve', ALL_ENVS, () => {
  const testWith = (L: Tensor, y: Tensor) => {
    const test = (adjoint: boolean) =>
    {
      let tril = tf.linalg.bandPart(L,-1, 0),
          triu = tf.linalg.bandPart(L, 0,-1);
      if( adjoint ) {
        tril = tf.linalg.adjoint(tril);
        triu = tf.linalg.adjoint(triu);
      }
      for( const lower of [true,undefined] )
      {
        const x = tf.linalg.triangularSolve(L,y, lower, adjoint);
        const [a,b] = broadcastMatrices( y, tril.matMul(x) );
        expectArraysClose(a,b);
      }
      const x = tf.linalg.triangularSolve(L,y, /*lower=*/false, adjoint);
      const [a,b] = broadcastMatrices( y, triu.matMul(x) );
      expectArraysClose(a,b);

      for( const lower of [false,true,undefined] )
      {
        const w = tf.randomUniform(y.shape,-1,+1),
              f = (L: Tensor, y: Tensor) => {
                return tf.linalg.triangularSolve(L,y,lower).mul(w).mean() as Scalar
              },
              [g1,g2] = tf.grads(f)([L,y]),
              h1 = numDiff( (L: Tensor) => f(L,y) )(L),
              h2 = numDiff( (y: Tensor) => f(L,y) )(y);
        expectArraysClose(g1,h1);
        expectArraysClose(g2,h2);
      }
    }
    test(undefined);
    test(false);
    test(true);
  };

  it('3x3', () => testWith(
    tf.tensor2d(
      [[1,2,3],
       [4,5,6],
       [7,8,9]]
    ),
    tf.tensor2d(
      [[10,11],
       [12,13],
       [14,15]]
    )
  ));

  for( let run=0; run < 16; run++ )
  { // RANDOMLY GENERATE BROADCAST-COMPATIBLE SHAPES
    let L_shape = Array.from({ length: randInt(2,5) }, () => randInt(1,4) ),
        y_shape = L_shape.slice( randInt(0,L_shape.length-2) );

    if( Math.random() < 0.5 )
    {
      y_shape = Array.from({ length: randInt(2,5) }, () => randInt(1,4) );
      L_shape = y_shape.slice( randInt(0,y_shape.length-2) );
    }
    L_shape[L_shape.length-1] = L_shape[L_shape.length-2];

    for( let L=L_shape.length-2, y=y_shape.length-2; L-- > 0 && y-- > 0; )
      switch( randInt(0,3) )
      {
        case 0: break;
        case 1: L_shape[L] = 1; break;
        case 2: y_shape[y] = 1; break;
      }

    // RUN TEST
    it(`random#${run}_${L_shape.join('x')}_${y_shape.join('x')}`, () => {
      const ONE = tf.scalar(1),
            TWO = tf.scalar(2);
      const y         = tf.randomUniform(y_shape,-1,+1);
      let   L: Tensor = tf.randomUniform(L_shape,-1,+1);
      // SET THE DIAGONAL TO BE FAR FROM ZERO
      const i = tf.range(0,L_shape[L_shape.length-2]).reshape([-1,1]),
            j = tf.range(0,L_shape[L_shape.length-1]),
            diag = tf.equal(i,j).cast('float32'),
            sign = tf.randomUniform(L_shape,0,2,'int32').cast('float32').mul(TWO).sub(ONE),
            magn = tf.randomNormal (L_shape, /*mean=*/1,/*stdDev=*/0.1);
      L = tf.add(
        diag.sub(ONE).mul(L),    // <- off-diagonal
        diag.mul(sign).mul(magn) // <-     diagonal
      );
      L = tf.clone(L);
      testWith(L,y);
    });
  }
});


describeWithFlags('qr', ALL_ENVS, () => {
  const testWith = (a: Tensor) => {
    const [m,n] = a.shape.slice(-2),
           l = Math.min(m,n),
           T = Array.from({ length: a.rank }, (_,i) => i );
    T[T.length-2] = T.length-1;
    T[T.length-1] = T.length-2;

    for( const fullMatrices of [undefined,false,true] )
    {
      const tril = function(){
        const [p,q] = fullMatrices ? [m,n] : [l,n],
          i = tf.range(0,p).reshape([p,1]),
          j = tf.range(0,q).reshape([1,q]);
        return i.greater(j).cast('float32');
      }();
      const EYE = function(){
        const d = fullMatrices ? m : l;
        return tf.stack(
          Array.from(
            { length: a.shape.slice(0,-2).reduce( (x,y) => x*y, 1 ) },
            () => tf.eye(d)
          )
        ).reshape([...a.shape.slice(0,-2),d,d]);
      }();
      let [q,r] = tf.linalg.qr(a,fullMatrices);
      const q_T = q.transpose(T);

      // TEST SHAPE OF Q
      expectArraysEqual( q.shape.slice(0,-1), a.shape.slice(0,-1) );
      expectArraysClose( q.shape.slice(  -1), fullMatrices ? [m  ] : [l  ] );

      // TEST SHAPE OF R
      expectArraysEqual( r.shape.slice(0,-2), a.shape.slice(0,-2) );
      expectArraysClose( r.shape.slice(  -2), fullMatrices ? [m,n] : [l,n] );
      
      // TEST DECOMPOSITION (Q @ R == A)
      expectArraysClose( q.matMul(r), a );

      // TEST ORTHOGONALITY OF Q
                                   expectArraysClose( q_T.matMul(q  ), EYE );
      if( fullMatrices || n >= m ) expectArraysClose( q  .matMul(q_T), EYE );

      // TEST TRIANGULARITY OF R
      expectArraysEqual( tril.mul(r), tf.zeros(r.shape) );

      // TEST GRADIENTS
      const wQ = tf.randomUniform(q.shape,-1,+1),
            wR = tf.randomUniform(r.shape,-1,+1),
            f = (a: Tensor) => {
              const [q,r] = tf.linalg.qr(a,fullMatrices);
              return q.mul(wQ).mean().add( r.mul(wR).mean() ) as Scalar; // <= FIXME: use some weights
            };
      const g = numDiff(f);
      const h = tf.grad(f);
      expectArraysClose( g(a), h(a) );
    }
  };

  it('1x1', () => testWith( tensor2d([[10]], [1, 1]) ) );

  it('2x2', () => testWith( tensor2d([[ 1, 3],
                                      [-2,-4]], [2, 2]) ) );

  it('2x2x2', () => testWith( tensor3d([[[-1,-3],
                                         [ 2, 4]],
                                        [[ 1, 3],
                                         [-2,-4]]], [2, 2, 2]) ) );

  it('2x1x2x2', () => testWith( tensor4d([[[[-1,-3],
                                            [ 2, 4]]],
                                          [[[ 1, 3],
                                            [-2,-4]]]], [2, 1, 2, 2]) ) );

  it('3x3', () => testWith( tensor2d([[ 1, 3, 2],
                                      [-2, 0, 7],
                                      [ 8,-9, 4]], [3, 3]) ) );

  it('3x2', () => testWith( tensor2d([[ 1, 2],
                                      [ 3,-3],
                                      [-2, 1]], [3, 2]) ) );

  it('2x3', () => testWith( tensor2d([[ 1, 2, 3],
                                      [-3,-2, 1]], [2, 3]) ) );

  for( let run=0; run < 16; run++ )
  {
    const A_shape = Array.from({ length: randInt(2,5) }, () => randInt(1,4) );
    it(`random#${run}_${A_shape.join('x')}`, () => testWith( tf.randomUniform(A_shape,-1,+1) ));
  }

  it('Is reasonably fast', () => { // <- TODO is there a better way to test this with a timeout?
    const N = 128,
          A = tf.randomUniform([N,N],-1,+1),
         wQ = tf.randomUniform([N,N],-1,+1),
         wR = tf.randomUniform([N,N],-1,+1),
          f = (a: Tensor) => {
            const [q,r] = tf.linalg.qr(a);
            return q.mul(wQ).mean().add( r.mul(wR).mean() ); // <= FIXME: use some weights
          };
    const g = tf.grad(f);
    expectArraysClose( g(A), g(A) ); // <- this hopefully prevent g(A) from being JITes/Optimized away...
  });

  it('Does not leak memory', () => {
    const x = tensor2d([[ 1, 3],
                        [-2,-4]], [2, 2]);
    // The first call to qr creates and keeps internal singleton tensors.
    // Subsequent calls should always create exactly two tensors.
    tf.linalg.qr(x);
    // Count before real call.
    const numTensors = tf.memory().numTensors;
    tf.linalg.qr(x);
    expect(tf.memory().numTensors).toEqual(numTensors + 2);
  });

  it('Insuffient input tensor rank leads to error', () => {
    const x1 = scalar(12);
    expect(() => tf.linalg.qr(x1)).toThrowError(/rank >= 2.*got rank 0/);
    const x2 = tensor1d([12]);
    expect(() => tf.linalg.qr(x2)).toThrowError(/rank >= 2.*got rank 1/);
  });
});
