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
import {ENV} from '../environment';
import {describeWithFlags} from '../jasmine_util';
import {Scalar, Tensor, Tensor1D, Tensor2D} from '../tensor';
import {ALL_ENVS, CPU_ENVS, expectArraysClose, expectArraysEqual, WEBGL_ENVS} from '../test_util';

import {scalar, tensor1d, tensor2d, tensor3d, tensor4d} from './ops';

/** Returns a random integer in the range of [from,until).
 */
const randInt = (from: number, until: number) => {
  return Math.floor(Math.random()*(until-from)) + from;
};

/**
 * Computes the gradients using finite differences. Current
 * implmentation uses an O(h⁴) central difference.
 *
 * SEE: https://en.wikipedia.org/wiki/Finite_difference
 *
 * FIXME this is terribly imprecise... wish there was
 *       double precision support *hint hint*.
 */
const numDiff = (f: (x: Tensor) => Scalar) => (a: Tensor) => {
  if( a.dtype !== 'float32' ) {
    throw new Error(`numDiff(): dtype=${a.dtype} not supported.`);
  }

  const aData = Float32Array.from( a.dataSync() );

  const eps = Math.sqrt( ENV.get('EPSILON') );

  return ENV.engine.tidy(() => {

    const dA = new Float32Array( aData.length );

    for( let i=0; i < aData.length; i++ )
    { // use central difference
      const x = aData[i],
            h = Math.max( Math.abs(x)*eps, eps );

      const g = ( x: number ) => ENV.engine.tidy( () => {
        aData[i] = x;

        const b = Tensor.make(a.shape, {values: aData});
        const scalar = f(b);

        if( scalar.rank !== 0 ) {
          throw new Error('f() returned a non-scalar value.');  
        }

        return scalar.dataSync()[0];
      });

      // https://www.geometrictools.com/Documentation/FiniteDifferences.pdf
      dA[i] = (-g(x+2*h) + 8*g(x+h) - 8*g(x-h) + g(x-2*h) ) / (12*h);
      aData[i] = x; // <- undo modifications
    }

    return Tensor.make(a.shape,{values: dA});
  });
};

/**
 *  An tensor equivalency assertion that uses a comparison operator
 *  that is very similar to NumPy's `is_close()` function.
 */
function expectTensorsRelativelyClose(
  actual: Tensor, expected: Tensor, rtol?: number, atol?: number
): void
{
  if( expected.shape.some( (s,i) => s !== actual.shape[i] ) ) {
    throw new Error(
      `Shapes [${actual.shape}] and [${expected.shape}] do not match.`
    );
  }

  if( null == atol ) { atol = ENV.get('TEST_EPSILON'); }
  if( null == rtol ) { rtol = ENV.get('TEST_EPSILON'); }

  const act =   actual.dataSync(),
        exp = expected.dataSync();

  const isClose = (x: number, y: number) => {
    x = Math.abs(x);
    y = Math.abs(y);
    return Math.abs(x-y) <= atol + rtol/2*(x+y);
  };

  for( let i=act.length; i-- > 0; ) {
    if( ! isClose(act[i],exp[i]) )
    {
      console.log(  'actual:');   actual.print();
      console.log('expected:'); expected.print();
      const idx = [],
          shape = actual.shape;
      for( let j=i, d=shape.length; d-- > 0; )
      {
        const size = shape[d];
        idx.unshift(j % size);
        j = Math.trunc(j / size);
      }
      throw new Error(
        `actual[${idx}] = ${act[i]} != ${exp[i]} = expected[${idx}]`
      );
    }
  }
}

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

describeWithFlags('adjoint', ALL_ENVS, () => {
  it('2x3', () => {
    const a   = tf.tensor2d([[1,2,3],
                             [4,5,6]], [2,3]),
          aT = tf.tensor2d([[1,4],
                            [2,5],
                            [3,6]],[3,2]);
    // FIXME: shouldn't tf.transpose be lossless?
    // Yet this fails on Travis with `expectArraysEqual`...
    expectArraysClose( tf.linalg.adjoint(a), aT );
  });
  it('3x2x1', () => {
    const a   = tf.tensor3d([[[1],[2]],
                             [[3],[4]],
                             [[5],[6]]], [3,2,1]),
          aT = tf.tensor3d([[[1,2]],
                            [[3,4]],
                            [[5,6]]], [3,1,2]);
    expectArraysClose( tf.linalg.adjoint(a), aT );
  });
});

describeWithFlags('bandPart', ALL_ENVS, () => {
  const la = tf.linalg;

  // FIXME: shouldn't 1*x be lossless?
  // It's even in the IEEE spec somewhere...
  // Yet this fails on Travis with `expectArraysEqual`...
  const expectArraysEqual = expectArraysClose;

  it('3x4', () => {
    const a = tf.tensor2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9,10,11,12]
    ]);
    expectArraysEqual(
      la.bandPart(a,0,0),
      tf.tensor2d([[1, 0, 0, 0],
                   [0, 6, 0, 0],
                   [0, 0,11, 0]])
    );
    expectArraysEqual(
      la.bandPart(a,0,1),
      tf.tensor2d([[1, 2, 0, 0],
                   [0, 6, 7, 0],
                   [0, 0,11,12]])
    );
    expectArraysEqual(
      la.bandPart(a,0,2),
      tf.tensor2d([[1, 2, 3, 0],
                   [0, 6, 7, 8],
                   [0, 0,11,12]])
    );
    expectArraysEqual(
      la.bandPart(a,0,2),
      tf.tensor2d([[1, 2, 3, 0],
                   [0, 6, 7, 8],
                   [0, 0,11,12]])
    );
    for( const numUpper of [3,4,-1,-2] ) {
      expectArraysEqual(
        la.bandPart(a,0,numUpper),
        tf.tensor2d([[1, 2, 3, 4],
                     [0, 6, 7, 8],
                     [0, 0,11,12]])
      );
    }

    expectArraysEqual(
      la.bandPart(a,1,0),
      tf.tensor2d([[1, 0, 0, 0],
                   [5, 6, 0, 0],
                   [0,10,11, 0]])
    );
    expectArraysEqual(
      la.bandPart(a,1,1),
      tf.tensor2d([[1, 2, 0, 0],
                   [5, 6, 7, 0],
                   [0,10,11,12]])
    );
    expectArraysEqual(
      la.bandPart(a,1,2),
      tf.tensor2d([[1, 2, 3, 0],
                   [5, 6, 7, 8],
                   [0,10,11,12]])
    );
    expectArraysEqual(
      la.bandPart(a,1,2),
      tf.tensor2d([[1, 2, 3, 0],
                   [5, 6, 7, 8],
                   [0,10,11,12]])
    );
    for( const numUpper of [3,4,-1,-2] ) {
      expectArraysEqual(
        la.bandPart(a,1,numUpper),
        tf.tensor2d([[1, 2, 3, 4],
                     [5, 6, 7, 8],
                     [0,10,11,12]])
      );
    }

    for( const numLower of [2,3,-1,-2])
    {
      expectArraysEqual(
        la.bandPart(a,numLower,0),
        tf.tensor2d([[1, 0, 0, 0],
                     [5, 6, 0, 0],
                     [9,10,11, 0]])
      );
      expectArraysEqual(
        la.bandPart(a,numLower,1),
        tf.tensor2d([[1, 2, 0, 0],
                     [5, 6, 7, 0],
                     [9,10,11,12]])
      );
      expectArraysEqual(
        la.bandPart(a,numLower,2),
        tf.tensor2d([[1, 2, 3, 0],
                     [5, 6, 7, 8],
                     [9,10,11,12]])
      );
      expectArraysEqual(
        la.bandPart(a,numLower,2),
        tf.tensor2d([[1, 2, 3, 0],
                     [5, 6, 7, 8],
                     [9,10,11,12]])
      );
      for( const numUpper of [3,4,-1,-2] ) {
        expectArraysEqual(
          la.bandPart(a,numLower,numUpper),
          tf.tensor2d([[1, 2, 3, 4],
                       [5, 6, 7, 8],
                       [9,10,11,12]])
        );
      }
    }
// following test is only required for custom backend implementations
//
//  for( const numUpper of [0,1,2,3,4,-1,-2] ) {
//  for( const numLower of [0,1,2,3,  -1,-2] ) {
//    const w = tf.randomUniform(a.shape),
//          f = (x: Tensor) => {
//            return la.bandPart(x,numLower,numUpper).mul(w).mean() as Scalar;
//          },
//          g = numDiff(f),
//          h = tf.grad(f);
//    expectArraysClose( g(a), h(a) );
//  }}
  });
});

describeWithFlags('triangularSolve', CPU_ENVS, () => {
  const la = tf.linalg;

  const testWith = (L: Tensor, y: Tensor) => {
    const test = (adjoint: boolean) =>
    {
      let tril = la.bandPart(L,-1, 0),
          triu = la.bandPart(L, 0,-1);
      if( adjoint ) {
        tril = la.adjoint(tril);
        triu = la.adjoint(triu);
      }
      for( const lower of [true,undefined] )
      {
        const x = la.triangularSolve(L,y, lower, adjoint);
        const [a,b] = [y,tril.matMul(x)];
        expectArraysClose(a,b);
      }
      const x = la.triangularSolve(L,y, /*lower=*/false, adjoint);
      const [a,b] = [y,triu.matMul(x)];
//      const [a,b] = broadcastMatrices( y, triu.matMul(x) );
      expectArraysClose(a,b);

      for( const lower of [false,true,undefined] )
      {
        const w = tf.randomUniform(y.shape,-1,+1),
              f = (L: Tensor, y: Tensor) => {
                return la.triangularSolve(L,y,lower).mul(w).mean() as Scalar;
              },
              [g1,g2] = tf.grads(f)([L,y]),
              h1 = numDiff( (L: Tensor) => f(L,y) )(L),
              h2 = numDiff( (y: Tensor) => f(L,y) )(y);
        expectArraysClose(g1,h1);
        expectArraysClose(g2,h2);
      }
    };
    test(undefined);
    test(false);
    test(true);
  };

  it('3x3', () => testWith(
    tf.tensor2d([[1,2,3],
                 [4,5,6],
                 [7,8,9]]),
    tf.tensor2d([[10,11],
                 [12,13],
                 [14,15]])
  ));

  for( let run=0; run < 128; run++ )
  {
    const lShape = Array.from({ length: randInt(2,5) }, () => randInt(1,7) ),
          yShape = lShape.slice();
    lShape[lShape.length-1] = lShape[lShape.length-2];

    // RUN TEST
    it(`random#${run}_${lShape.join('x')}_${yShape.join('x')}`, () => {
      const ONE = tf.scalar(1),
            TWO = tf.scalar(2);
      const y         = tf.randomUniform(yShape,-1,+1);
      let   L: Tensor = tf.randomUniform(lShape,-1,+1);
      // SET THE DIAGONAL TO BE FAR FROM ZERO
      const i = tf.range(0,lShape[lShape.length-2]).reshape([-1,1]),
            j = tf.range(0,lShape[lShape.length-1]),
         diag = tf.equal(i,j).cast('float32'),
         magn = tf.randomNormal (lShape, /*mean=*/1,/*stdDev=*/0.1),
         sign = tf.randomUniform(lShape, 0,2, 'int32')
                  .cast('float32').mul(TWO).sub(ONE);
      L = tf.add(
        diag.sub(ONE).mul(L),    // <- off-diagonal
        diag.mul(sign).mul(magn) // <-     diagonal
      );
      L = tf.clone(L);
      testWith(L,y);
    });
  }
});

describeWithFlags('qr', CPU_ENVS, () => {
  const testWith = (a: Tensor) => {
    const [m,n] = a.shape.slice(-2),
           l = Math.min(m,n),
          // Indices of matrix transpose.
           T = Array.from({ length: a.rank }, (_,i) => i );
    T[T.length-2] = T.length-1;
    T[T.length-1] = T.length-2;

    for( const fullMatrices of [undefined,false,true] )
    {
      const tril = (() => {
        const [p,q] = fullMatrices ? [m,n] : [l,n],
          i = tf.range(0,p).reshape([p,1]),
          j = tf.range(0,q).reshape([1,q]);
        return i.greater(j).cast('float32');
      })();
      const EYE = (() => {
        const d = fullMatrices ? m : l;
        return tf.stack(
          Array.from(
            { length: a.shape.slice(0,-2).reduce( (x,y) => x*y, 1 ) },
            () => tf.eye(d)
          )
        ).reshape([...a.shape.slice(0,-2),d,d]);
      })();
      const [q,r] = tf.linalg.qr(a,fullMatrices);

      // TEST SHAPE OF Q
      expectArraysEqual( q.shape.slice(0,-1), a.shape.slice(0,-1) );
      expectArraysEqual( q.shape.slice(  -1), fullMatrices ? [m  ] : [l  ] );

      // TEST SHAPE OF R
      expectArraysEqual( r.shape.slice(0,-2), a.shape.slice(0,-2) );
      expectArraysEqual( r.shape.slice(  -2), fullMatrices ? [m,n] : [l,n] );
      
      // TEST DECOMPOSITION (Q @ R == A)
      try {
        expectArraysClose( q.matMul(r), a );
      } catch(err) {
        console.log('A'); a.print();
        console.log('Q'); q.print();
        console.log('R'); r.print();
        throw err;
      }

      const qT = q.transpose(T);

      // TEST ORTHOGONALITY OF Q
      if( fullMatrices || n >= m ) {
        expectArraysClose( tf.matMul(q,qT), EYE );
      }
      expectArraysClose( tf.matMul(qT,q), EYE );

      // TEST TRIANGULARITY OF R
      expectArraysEqual( tril.mul(r), tf.zeros(r.shape) );

      // TEST GRADIENTS
      const wQ = tf.randomUniform(q.shape,-1,+1),
            wR = tf.randomUniform(r.shape,-1,+1),
            f = (a: Tensor) => {
              const [q,r] = tf.linalg.qr(a,fullMatrices);
              return tf.add(
                q.mul(wQ).mean(),
                r.mul(wR).mean()
              ) as Scalar;
            };
      const g = numDiff(f);
      const h = tf.grad(f);
      try {
        expectTensorsRelativelyClose(g(a), h(a), /*rtol=*/1e-2, /*atol=*/1e-2);
      }
      catch(err) {
        console.log('fullMatrices:', fullMatrices);
        console.log('A:'); a   .print();
//        const [q,r] = tf.linalg.qr(a,fullMatrices);
//        console.log('Q:'); q   .print();
//        console.log('R:'); r   .print();
//        console.log('G:'); g(a).print();
//        console.log('H:'); h(a).print();
        throw err;
      }
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

  for( let run=0; run < 128; run++ )
  {
    const shape = Array.from({ length: randInt(2,5) }, () => randInt(1,7) );
    it(
      `random#${run}_${shape.join('x')}`,
      () => testWith( tf.randomUniform(shape,-1,+1) )
    );
  }

  it('Is reasonably fast', () => {
    // TODO is there a better way to test this with a timeout?
    const N = 128,
          A = tf.randomUniform([N,N],-1,+1),
         wQ = tf.randomUniform([N,N],-1,+1),
         wR = tf.randomUniform([N,N],-1,+1),
          f = (a: Tensor) => {
            const [q,r] = tf.linalg.qr(a);
            return q.mul(wQ).mean().add( r.mul(wR).mean() );
          };
    const g = tf.grad(f);
    // following hopefully prevents g(A) from being JITes/Optimized away...
    expectArraysClose( g(A), g(A) );
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
