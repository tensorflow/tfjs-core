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

import {describeWithFlags} from '../jasmine_util';
import {add, mul, sub, squaredDifference} from '../ops/binary_ops';
import {cos} from '../ops/unary_ops';
import {Scalar, Tensor1D, Tensor} from '../tensor';
import {zeros, ones, scalar, tensor1d} from '../ops/ops';
import {ALL_ENVS, expectArraysClose, expectArraysEqual} from '../test_util';
import {TensorLike} from '../types';
import {convertToTensor} from '../tensor_util_env';
import {valueAndGrad} from '../gradients';
import {ENV} from '../environment';
import {randomUniform} from '../ops/array_ops';
import {strongWolfeLineSearch,
        LBFGSFunctionOptimizer,
        LineSearchNoProgressError} from './lbfgs_function_optimizer';
import {dot} from '../ops/matmul';

function rosenbrock( x: Tensor|TensorLike ): Tensor
{
  return ENV.engine.tidy( () => {
    const $x = convertToTensor(x,'x','rosenbrock');

    if( $x.rank < 1 ) {
      throw new Error('rosenbrock(x): x.rank must be at least 1.');
    }
    if( $x.shape[$x.rank-1] < 2 ) {
      throw new Error('rosenbrock(x): x.shape[-1] must be at least 2.');
    }

    const ONE = scalar(  1),
          TWO = scalar(  2),
          B   = scalar(100);

    const size = $x.shape.slice(),
         start = $x.shape.map( () => 0 );
    -- size[$x.rank-1]; const xi = $x.slice(start.slice(),size);
    ++start[$x.rank-1]; const xj = $x.slice(start,        size);

    return add(
      squaredDifference( xj, xi .pow(TWO) ).mul(B),
      squaredDifference(ONE, xi)
    ).sum(/*axis=*/-1);
  });
}

function rastrigin( x: Tensor|TensorLike ): Tensor
{
  return ENV.engine.tidy( () => {
    const $x = convertToTensor(x,'x','rosenbrock');

    if( $x.rank < 1 ) {
      throw new Error('rosenbrock(x): x.rank must be at least 1.');
    }
    if( $x.shape[$x.rank-1] < 1 ) {
      throw new Error('rosenbrock(x): x.shape[-1] must be at least 1.');
    }

    const π2 = scalar(Math.PI*2),
          n  = $x.shape[$x.rank-1],
          nA = scalar(10*n),
           A = scalar(10);

    return nA.add(
      sub(
        mul($x,$x),
        A.mul( cos(mul(π2,$x)) )
      ).sum(/*axis=*/-1)
    );
  });
}

describeWithFlags('rosenbrock', ALL_ENVS, () => {

  for( const l of [2,3] )
  {
    const ones = Array.from({ length: l }, () => 1 );

    it(`should have a single minimum at [${ones}]`, () => {
      const x = Array.from({ length: l }, () => 1 );

      const fg = valueAndGrad(rosenbrock),
            { value: fMin, grad: gMin } = fg( tensor1d(x) );
      expectArraysClose( fMin, scalar(0) );
      expectArraysClose( gMin, zeros([l]) );

      // this should so not be necessary...
      const atol = scalar( Math.sqrt(ENV.get('EPSILON')) );

      for( let i=0; i < 1024; i++ )
      {
        const x = randomUniform([l],-2,+2),
              f = rosenbrock(x);
        expectArraysEqual( fMin.sub(atol).lessEqual(f), scalar(true,'bool') );
      }

      {
        const x = randomUniform([1024,1024,l],-2,+2),
              f = rosenbrock(x);
        expectArraysEqual(
          fMin.sub(atol).lessEqual(f).all(),
          scalar(true,'bool')
        );
      }
    });
  }
});

describeWithFlags('rastrigin', ALL_ENVS, () => {

  for( const l of [1,2,3] )
  {
    const zeros = Array.from({ length: l }, () => 0 );

    it(`should have a global minimum at [${zeros}]`, () => {

      const fg = valueAndGrad(rastrigin),
            { value: fMin, grad: gMin } = fg( tensor1d(zeros) );
      expectArraysClose( fMin, scalar(0) );
      expectArraysClose( gMin, zeros );

      // this should so not be necessary...
      const atol = scalar( Math.sqrt(ENV.get('EPSILON')) );

      for( let i=0; i < 1024; i++ )
      {
        const x = randomUniform([l],-6,+6),
              f = rastrigin(x);
        expectArraysEqual( fMin.sub(atol).lessEqual(f), scalar(true,'bool') );
      }

      {
        const x = randomUniform([1024,1024,l],-6,+6),
              f = rastrigin(x);
        try {
          expectArraysEqual(
            fMin.sub(atol).lessEqual(f).all(),
            scalar(true,'bool')
          );
        }
        catch(err) {
          const i = f.flatten().argMin().dataSync()[0];
          console.log('x_min:'); x.reshape([-1,l]).slice([i,0], [1,l]).print();
          console.log('f.min:'); f.min().print();
          console.log('fMin'); fMin.print();
          throw err;
        }
      }
    });
  }

});

function val( t: Tensor ) {
  if( t.rank !== 0 ) { throw new Error('Assertion failed.'); }
  return t.dataSync()[0];
}

describeWithFlags('strongWolfeLineSearch', ALL_ENVS, () => {

  const testWith = ( name: string, func: (x: Tensor) => Tensor ) => {
    for( let test=0; test < 32; test++ ) {
    for( const l of [2,3,4] ) {
      it(`should work on ${l}d ${name} (test ${test})`, () => {

        const c1=0.4,
              c2=0.8,
              c3=1.6;

        const fg = ( () => {
                const fg = valueAndGrad(func);
                return (x: Tensor) => {
                  const { value, grad } = fg(x);
                  return [value, grad] as [Scalar,Tensor1D];
                };
              })(),
              linSearch = strongWolfeLineSearch(c1,c2,c3);

        for( let run=0; run < 8; run++ )
        {
          ENV.engine.tidy( () =>  {

            const X0 = randomUniform([l],-1,+1) as Tensor1D,
                [F0,G0] = fg(X0),
                  dirLen = Math.random()*1.9 + 0.1,
                  f0 = val(F0);

            let negDir = (
                  G0.div( scalar( Math.hypot( ...Array.from(G0.dataSync()) ) ) )
                    .mul( scalar(dirLen) )
                ) as Tensor1D,
                p0 = - val(dot(G0,negDir));

            if( Math.abs(p0) <= 1e-5 ) { return; }
            if( p0  >  0 ) {
                p0 *= -1;
              negDir = negDir.neg();
            }

            const [X,F,G] = linSearch(fg, X0,F0,G0, negDir),
                  f =   val(F),
                  p = - val(dot(G,negDir)),
                  α = Math.hypot(
                    ...Array.from( sub(X,X0).dataSync() )
                  ) / dirLen;

            expect( Math.abs(p) ).not.toBeGreaterThan( -c2*p0 );
            expect(   f - f0    ).not.toBeGreaterThan(  c1*p0*α );
          });
        }
      });
    }}
  };

  testWith('rosenbrock', rosenbrock);
  testWith('rastrigin' , rastrigin );
});

describeWithFlags('lbfgs', ALL_ENVS, () => {

  for( let test=0; test < 128; test++ ) {
  for( const n of [2,3] )
  {
    const x0 = Array.from({ length: n }, () => Math.random()*6 - 3 );

    it(`random_test#${test}`, () => {
      const DENOM = scalar(32);

      const fg = (() => {
              const fg = valueAndGrad(rosenbrock);
              return (x: Tensor) => {
                nCalls++;
                const { value, grad } = fg(x);
                return [value, grad] as [Scalar,Tensor1D];
              };
            })();

      let nSteps=0,
          nCalls=0;

      const opt = new LBFGSFunctionOptimizer(
        fg,
        tensor1d(x0),
        { initNegDir: g => g.div(DENOM) }
      );

      const atol = scalar( Math.sqrt(ENV.get('EPSILON')) );
      opt_loop:while( ! opt.g.abs().lessEqual(atol).all().dataSync()[0] )
      {
        ++nSteps;
        try {
          opt.step();
        }
        catch(err) {
          console.log('NAME: ', err.constructor.name);
          if( err instanceof LineSearchNoProgressError ) {
            break opt_loop;
          }
          throw err;
        }
      }

      expect(nCalls).toBeLessThan(512);
      expect(nSteps).toBeLessThan(256);
      expectArraysClose(opt.x,  ones([n]) );
      expectArraysClose(opt.f, zeros([ ]) );
      expectArraysClose(opt.g, zeros([n]) );
      opt.dispose();
    });
  }}

});
