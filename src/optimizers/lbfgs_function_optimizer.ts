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

import {mul, sub} from '../ops/binary_ops';
import {Scalar, Tensor1D, Tensor} from '../tensor';
import {scalar} from '../ops/ops';
import {dot} from '../ops/matmul';
import {ENV} from '../environment';

/*
function castScalar( t: Tensor ) {
  if( t.rank !== 0 ) { throw new Error('Assertion failed.'); }
  return t as Scalar;
}

function castTensor1D( t: Tensor ) {
  if( t.rank !== 1 ) { throw new Error('Assertion failed.'); }
  return t as Tensor1D;
}
*/

function val( t: Tensor ) {
  if( t.rank !== 0 ) { throw new Error('Assertion failed.'); }
  return t.dataSync()[0];
}

function dotProd( x: Tensor1D, y: Tensor1D ) {
  const Z = dot(x,y),
        z = val(Z);
  Z.dispose();
  return z;
}

/** The function type of a linesearch method.
 *
 *  @param fg A function that returns both the value and gradients of the
 *            optimized loss function.
 *  @param x  The starting point (function input) of the line search.
 *  @param f  The loss at the starting point of the line search.
 *  @param g  The loss gradients as the starting point of the line search.
 *  @param negDir The negative of the line search direction. The length of
 *                `negDir` determines the first point the line search is
 *                going to examine. In other wird the first point that is
 *                examined is `x-negDir`.
 *  @returns [x,f,g] The new approximation of the minimum, its loss value
 *                   and gradients.
 */
export type LineSearchMethod = (
  fg: (x: Tensor1D) => [Scalar,Tensor1D],
  x: Tensor1D,
  f: Scalar,
  g: Tensor1D,
  negDir: Tensor1D
) => [Tensor1D,Scalar,Tensor1D];

/** Creates a new strong Wolfe line search function for
 *  the given parameters.
 *
 *  Implementation based on:
 *  "Numerical Optimization" 2n Edition,
 *  Jorge Nocedal Stephen J. Wright,
 *  Chapter 3. Line Search Methods, page 60.
 *
 *  @param c1 [optional] 1st strong Wolfe condition parameter:
 *            Sufficient decrease of the objective.
 *  @param c2 [optional] 2nd strong Wolfe condition parameter:
 *            Sufficient decrease of the gradient projection.
 *  @param c3 [optional] Exponential growth constant for the
 *            first phase of the line search (bracketing phase).
 *  @returns A line search function that searches a point satisfying
 *           the strong Wolfe condition.
 */
export function strongWolfeLineSearch(
  c1=0.4, c2=0.8, c3=1.6
): LineSearchMethod
{
  // CHECK 0 < c1 < c2 < 1 < c3
  if( c1 <=  0 ) {
    throw new Error('StrongWolfeLineSearch(): c1 must be positive.');
  }
  if( c1 >= c2 ) {
    throw new Error('StrongWolfeLineSearch(): c1 must less than c2.');
  }
  if(  1 <= c2 ) {
    throw new Error('StrongWolfeLineSearch(): c2 must less than 1.');
  }
  if(  1 >= c3 ) {
    throw new Error('StrongWolfeLineSearch(): c3 must larger than 1.');
  }

  return (fg, X0,F0,G0, negDir) => {

    const projGrad = ( g: Tensor1D ) => -dotProd(g,negDir);

    const f0 = val(F0),
          p0 = projGrad(G0); // <- projected gradient

    if( p0 >= 0 ) {
      throw new Error(
        'strongWolfeLineSearch(): Projected gradient not negative.'
      );
    }

    let αMin =  0, α = 1, αMax = Infinity,
        fMin = f0;

    // STEP 1: BRACKETING PHASE
    //   Find a range guaranteed to contain an α satisfying strong Wolfe.
    bracketing: while(true)
    {
      const X = ENV.engine.tidy(
              () => X0.sub( scalar(α).mul(negDir) ) as Tensor1D
            ),
           [F,G] = fg(X),
            f = val(F),
            p = projGrad(G);

      if( f - f0 > c1*α*p0 || (0 < αMin && f >= fMin) )
      {
        αMax = α;
        break bracketing;
      }

      if( Math.abs(p) <= -c2*p0 ) {
        return [X,F,G];
      }
      X.dispose();
      F.dispose();
      G.dispose();

      if( p >= 0 )
      {
        αMax = αMin;
        αMin = α;
        fMin = f;
        break bracketing;
      }

      if( ! (α < αMax) ) {
        throw new Error(
            'strongWolfeLineSearch(): '
          + 'Strong Wolfe condition not satisfiable in range.'
        );
      }

      αMin = α; α = Math.fround(α*c3);
      fMin = f;
    }

    if( αMin === αMax ) {
      throw new Error('strongWolfeLineSearch: bracketing failed.');
    }

    // STEP 2: BISECTION PHASE
    //   Given a range that is guaranteed to contain a valid
    //   strong Wolfe α values, this method finds such a value.
    while(true)
    {
      α = Math.fround( (αMin + αMax) / 2 );

      const X = ENV.engine.tidy(
              () => X0.sub( scalar(α).mul(negDir) ) as Tensor1D
            ),
           [F,G] = fg(X),
            f = val(F),
            p = projGrad(G);

      if( f - f0 > c1*α*p0 || f >= fMin ) {
        if( αMax === α ) {
          throw new Error('strongWolfeLineSearch(): bisection failed.');
        }
        αMax = α;
      }
      else {
        if( Math.abs(p)  <= -c2*p0 ) {
          return [X,F,G];
        }
        X.dispose();
        F.dispose();
        G.dispose();

        if( p * (αMax - αMin)  >=  0 ) {
          αMax = αMin;
        }

        if( αMin === α ) {
          throw new Error('strongWolfeLineSearch(): bisection failed.');
        }
        αMin = α;
        fMin = f;
      }

      if( αMin === αMax ) {
        throw new Error('strongWolfeLineSearch(): bisection failed.');
      }
    }
  };
}

/** Limited-memory BFGS optimizer.
 *
 *  At every point in time, the current approximation of the solution,
 *  its loss and gradient are stored as properties `x`, `f` and `g`.
 *  Those three tensors are disposed and replaced by the new approximation
 *  whenever `step()` is called.
 */
export class LBFGSFunctionOptimizer {
  /** A function that returns the loss and its gradients
   *  for a given input.
   * 
   *  @param x The function input.
   * 
   *  @returns [loss,grad] The loss at point `x` and its gradients.
   */
  fg: (x: Tensor1D) => [Scalar,Tensor1D];

  /** The current approximation of the minimum solution.
   */
  x: Tensor1D;
  /** The loss value at the current approximation of the minimum solution.
   */
  f: Scalar;
  /** The loss gradients at the current approximation of the minimum solution.
   */
  g: Tensor1D;

  /** The number of past approximations/iterations that is memoized in order
   *  to approximate the (inverse) Hessian.
   */
  historySize: number;

  /** A function that returns the negative "initial" search direction. In
   *  other words this function returns the result matrix-vector `H₀•g`,
   *  where `H₀` is the initial inverse Hessian and `g` is the current
   *  (gradient) vector. The length of the returned vector stronly
   *  influences how far the `LineSearchMethod` looks.
   * 
   *  @param g The gradient vector for which the (initial) search direction
   *           is to be determined.
   *  @returns `H₀•g`, where `H₀` is the inverse of the initial inverse
   *           Hessian and `g` is the current (gradient) vector.
   */
  initNegDir: (g: Tensor1D) =>  Tensor1D;

  /** The line search method used. Must statisfy the Wolfe conition.
   *
   *  @param fg A function that returns both the value and gradients of the
   *            optimized loss function.
   *  @param x  The starting point (function input) of the line search.
   *  @param f  The loss at the starting point of the line search.
   *  @param g  The loss gradients as the starting point of the line search.
   *  @param negDir The negative of the line search direction. The length of
   *                `negDir` determines the first point the line search is
   *                going to examine. In other wird the first point that is
   *                examined is `x-negDir`.
   *  @returns [x,f,g] The new approximation of the minimum, its loss value
   *                   and gradients.
   */
  lineSearch: LineSearchMethod;

  /** The change in the function input x during the past `historySize`
   *  iterations.
   */
    dX: Tensor1D[] = [];
  /** The dot product of `dX[i]` and `dG[i]`.
   */
  dGdX:   Scalar[] = [];
  /** The change in the loss gradient during the past `historySize`
   *  iterations.
   */
  dG  : Tensor1D[] = []; // <- change in f'(x)

  /** Creates a new L-BFGS optimizer instance that minimized the given loss
   *  function.
   *
   *  @param fg A function that returns the loss and its gradient for a given
   *            input.
   *  @param x0 The starting point of the L-BFGS iteration.
   *  @param params And optional set of parameters for the optimizer.
   *                <dl>
   *                  <dt>historySize<dd>The number of past iterations that is
   *                                     memoized to approximate the (inverse)
   *                                     Hessian.
   *                  <dt>initNegDir <dd>A function that returns the negative
   *                                     "initial" search direction. In other
   *                                     words this function returns the result
   *                                     matrix-vector `H₀•g`, where `H₀` is
   *                                     the inverse of the initial inverse
   *                                     Hessian and `g` is the current
   *                                     (gradient) vector. The length of the
   *                                     returned vector stronly influences
   *                                     how far the `LineSearchMethod` looks.
   *                  <dt>lineSearch <dd>The line search method to be used.
   *                                     Must satisfy the Wolfe condition.
   *                </dl>
   */
  constructor(
    fg: (x: Tensor1D) => [Scalar,Tensor1D],
    x0: Tensor1D,
    params?: {
      historySize?: number, // <- max. no. of past gradients memoized
      initNegDir?: (g: Tensor1D) =>  Tensor1D,
      lineSearch?: LineSearchMethod
    }
  )
  {
    if( null == fg ) { throw new Error('new LBFGSOptimizer: fg undefined.'); }
    if( null == x0 ) { throw new Error('new LBFGSOptimizer: x0 undefined.'); }
    if( null == params ) { params = {}; }
    this.fg = fg;
    this.x = x0.clone();
    [this.f,this.g] = fg(x0);
    this.historySize = 'historySize' in params
                     ? params.historySize : 8;
    this.initNegDir  = 'initNegDir'  in params
                     ? params.initNegDir  : g => g;
    this.lineSearch  = 'lineSearch'  in params
                     ? params.lineSearch  : strongWolfeLineSearch();
    if( this.historySize < 1 ) {
      throw new Error('new LBFGSOptimizer: historySize must be positive.');
    }
  }

  /** Computes the product of the `H•g` where `H` is the current approximation
   *  of the (estimated) inverse hessian of the function and `g` is the
   *  given (gradient) vector.
   *
   *  @param g The gradient vector.
   *  @returns `H•g` where `H` is the current approximation of the (estimated)
   *  inverse Hessian of the function and `g` is the given (gradient) vector.
   */
  negDir( g: Tensor1D ): Tensor1D
  {
    const dX = this.  dX,
        dGdX = this.dGdX,
        dG   = this.dG;
    // SEE:
    // Jorge Nocedal "Updating Quasi-Newton Matrices with Limited Storage"
    // MATHEMATICS OF COMPUTATION, VOL. 35, NO. 151, JULY 1980, PAGES 773-78
    // https://courses.engr.illinois.edu/ece544na/fa2014/nocedal80.pdf
    const α: Scalar[] = [];
    g = g.clone();

    for( let i=dGdX.length; i-- > 0; )
    {
      const [αi,G] = ENV.engine.tidy( () => {
        const αi = dot(dX[i],g).div(dGdX[i]);
        return [ αi, g.sub( mul(αi,dG[i]) ) ];
      });
      g.dispose();
      g = G as Tensor1D;
      α.push( αi as Scalar );
    }

    const G = this.initNegDir(g);
    if( ! Object.is(G,g) ) { g.dispose(); }
    g = G;

    for( let i=0; i < dGdX.length; i++ )
    {
      const G = ENV.engine.tidy( () => {
        const αi = α.pop(),
              βi = dot(dG[i],g).div(dGdX[i]),
              G  = g.add( sub(αi,βi).mul(dX[i]) );
        αi.dispose();
        return G;
      });
      g.dispose();
      g = G as Tensor1D;
    }

    return g;
  }

  /** Performs a single optimization step. In the process, the current
   *  property values `x`, `y` and `g` of this optimizer are disposed
   *  and replaced by the new approximation of the minimum.
   */
  step(): void
  {
    const dX = this.  dX,
        dGdX = this.dGdX,
        dG   = this.dG;

    const [x,f,g] = ENV.engine.tidy(
      () => this.lineSearch(
        this.fg,
        this.x,
        this.f,
        this.g,
        this.negDir(this.g)
      )
    );

    const dXi = sub(x,this.x) as Tensor1D,
          dGi = sub(g,this.g) as Tensor1D;
    dG  .push(     dGi );
    dGdX.push( dot(dGi,dXi) as Scalar );
      dX.push(         dXi );

    this.x.dispose();
    this.f.dispose();
    this.g.dispose();

    [this.x,
     this.f,
     this.g] = [x,f,g];

    if( dX.length !== dG.length ) { throw new Error('Assertion failed!'); }

    // LIMIT THE NUMBER OF MEMOIZED GRADIENTS
    // (while loop in case historySize was changed)
    while( dX.length > this.historySize ) {
        dX.shift().dispose();
      dGdX.shift().dispose();
      dG  .shift().dispose();
    }
  }

  /** Disposes all resources held by this optimizer.
   */
  dispose(): void {
    this.x.dispose();
    this.f.dispose();
    this.g.dispose();
    this.  dX.forEach( t => t.dispose() );
    this.dGdX.forEach( t => t.dispose() );
    this.dG  .forEach( t => t.dispose() );
  }
}
