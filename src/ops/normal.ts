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

import * as seedrandom from 'seedrandom';

import {Tensor} from '../tensor';
import {DataType, Rank, ShapeMap} from '../types';

import {ArrayOps} from './array_ops';
import {UnaryOps} from './unary_ops';

export class Normal {
  private scale: Tensor;
  private loc: Tensor;
  private shape: ShapeMap[Rank];
  private seed: number;
  private random: seedrandom.prng;

  /**
   * The Normal distribution with location loc and scale parameters.
   *
   * ```js
   * TODO: Add code exemple here
   * ```
   * @param loc  Floating point tensor|number; the means of the
   * distribution(s).
   * @param scale Floating point tensor|number; the stddevs of the
   * distribution(s).
   * @param dtype The data type of the output.
   * @param seed The seed for the random number generator.
   */
  constructor(
      loc: Tensor|number, scale: Tensor|number, dtype?: 'float32'|'int32',
      seed?: number) {
    if (typeof loc === 'number') {
      loc = ArrayOps.scalar(loc as number);
      scale = ArrayOps.scalar(scale as number);
    }
    if (dtype != null && (dtype as DataType) === 'bool') {
      throw new Error(`Unsupported data type ${dtype}`);
    }
    if (!((scale as Tensor).shape.toString() === loc.shape.toString())) {
      throw new Error(
          `Shape of loc (${loc.shape}) must be the same shape than scale ${
              (scale as Tensor).shape}`);
    }
    this.scale = scale as Tensor;
    this.loc = loc;
    this.shape = (scale as Tensor).shape;
    this.seed = seed ? seed : Math.random();
    this.random = seedrandom.alea(this.seed.toString());
  }

  /**
   * Compute the S part of the Marsaglia polar method
   * From https://en.wikipedia.org/wiki/Marsaglia_polar_method
   * @param shape An array of integers defining the output tensor shape.
   */
  private computePreMarsaglia<R extends Rank>(shape: ShapeMap[R]): Tensor {
    const mTensor = ArrayOps.buffer(shape);
    const v1Tensor = ArrayOps.buffer(shape);
    for (let i = 0; i < mTensor.values.length; i++) {
      let v1: number, v2: number, s: number;
      do {
        v1 = 2 * this.random() - 1;
        v2 = 2 * this.random() - 1;
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      mTensor.values[i] = Math.sqrt(-2.0 * Math.log(s) / s);
      v1Tensor.values[i] = v1;
    }
    const value = mTensor.toTensor().mul(v1Tensor.toTensor());
    return value;
  }

  /**
   * Generate samples of the specified shape.
   * @param shape An array of integers defining the output tensor shape.
   */
  public sample<R extends Rank>(shape: ShapeMap[R]|number) {
    if (typeof shape === 'number') {
      shape = [shape];
    }
    const nShape = shape.concat(this.shape);
    const marsaglia = this.computePreMarsaglia(nShape);
    const nTensor = this.loc.add(this.scale.mul(marsaglia));
    return nTensor;
  }

  /**
   * Evaluate the pdf on the given number/tensor
   * @param points The point/tensor to evaluate
   */
  public prob(points: number|Tensor): Tensor {
    if (typeof points === 'number') {
      points = ArrayOps.scalar(points as number);
    }
    const pi = ArrayOps.scalar(Math.PI);
    const two = ArrayOps.scalar(2);
    const den = (two.mul(pi).mul(this.scale.abs().square())).sqrt();
    const exp = ArrayOps.scalar(-1)
                    .mul((points.sub(this.loc)).square())
                    .div(two.mul(this.scale.abs().square()));
    return UnaryOps.exp(exp).div(den);
  }

  /***
   * Evaluate the log of the pdf on the given number/tensor
   * @param points The point/tensor to evaluate
   */
  public log_prob(points: number|Tensor): Tensor {
    return UnaryOps.log(this.prob(points));
  }

  /**
   * Shanon entropy in nats
   */
  public entropy(): Tensor {
    const pi = ArrayOps.scalar(Math.PI);
    const two = ArrayOps.scalar(2);
    const entropy = UnaryOps
                        .log(two.mul(pi)
                                 .mul(UnaryOps.exp(ArrayOps.scalar(1.)))
                                 .mul(this.scale.abs().square()))
                        .div(two);
    return entropy;
  }
}
