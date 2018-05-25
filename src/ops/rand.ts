/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {Tensor} from '..';
import {Rank, ShapeMap} from '../types';
import {ArrayOps} from './array_ops';

export interface RandNormalDataTypes {
  float32: Float32Array;
  int32: Int32Array;
}

export interface Marsaglia {
  value: number;
  m: number;
}

// https://en.wikipedia.org/wiki/Marsaglia_polar_method
export class MPRandGauss<R extends Rank> {
  private mean: Tensor;
  private stdDev: Tensor;
  private meanValues: Float32Array|Int32Array|Uint8Array;
  private stdDevValues: Float32Array|Int32Array|Uint8Array;
  private nextVal: Marsaglia;
  private dtype?: keyof RandNormalDataTypes;
  private shape: ShapeMap[R];
  private truncated?: boolean;
  private random: seedrandom.prng;

  constructor(
      mean: number|Tensor, stdDeviation: number|Tensor,
      dtype?: keyof RandNormalDataTypes, truncated?: boolean, seed?: number) {
    if (typeof mean === 'number') {
      mean = ArrayOps.scalar(mean as number);
    }
    if (typeof stdDeviation === 'number') {
      stdDeviation = ArrayOps.scalar(stdDeviation as number);
    }
    if (mean.shape.toString() !== stdDeviation.shape.toString()) {
      throw new Error(
          `Shape of loc (${mean.shape}) must be the same shape than scale ${
              stdDeviation.shape}`);
    }
    this.mean = mean;
    this.stdDev = stdDeviation;
    this.meanValues = mean.dataSync();
    this.stdDevValues = stdDeviation.dataSync();
    this.shape = mean.shape;
    this.dtype = dtype;
    this.nextVal = null;
    this.truncated = truncated;
    const seedValue = seed ? seed : Math.random();
    this.random = seedrandom.alea(seedValue.toString());
  }

  // choosing random points x, y in the square s
  private nextMarsaglia(index: number): Marsaglia {
    let v1: number, v2: number, s: number;
    if (this.nextVal) {
      const nextPt = {value: this.nextVal.value, m: this.nextVal.m};
      this.nextVal = null;
      return nextPt;
    }
    let isValid = false;
    let m: number;
    while (!isValid) {
      do {
        v1 = 2 * this.random() - 1;
        v2 = 2 * this.random() - 1;
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      m = Math.sqrt(-2.0 * Math.log(s) / s);
      const resultX =
          this.meanValues[index] + this.stdDevValues[index] * v1 * m;
      if (!this.truncated || this.isValidTruncated(resultX, index)) {
        isValid = true;
      }
    }
    index = (index + 1) % this.meanValues.length;
    const resultY = this.meanValues[index] + this.stdDevValues[index] * v2 * m;
    if (!this.truncated || this.isValidTruncated(resultY, index)) {
      this.nextVal = {value: v2, m};
    }
    return {value: v1, m};
  }

  /**
   * Returns a sample from a gaussian distribution.
   * @param shape An array of integers defining the output tensor shape.
   */
  public sample(shape: ShapeMap[R]): Tensor<R> {
    const nShape = shape.concat(this.shape);
    const mResults = ArrayOps.buffer(nShape);
    const xResults = ArrayOps.buffer(nShape);
    let index: number;
    for (let i = 0; i < xResults.values.length; i++) {
      index = i % this.meanValues.length;
      const {value, m} = this.nextMarsaglia(index);
      xResults.values[i] = value;
      mResults.values[i] = m;
    }
    const spare = mResults.toTensor().mul(xResults.toTensor());
    const nTensor = this.mean.add(this.stdDev.mul(spare));
    return this.convertValue(nTensor as Tensor<R>);
  }

  /** Handles proper rounding for non floating point numbers. */
  private convertValue(value: Tensor<R>): Tensor<R> {
    if (this.dtype == null || this.dtype === 'float32') {
      return value;
    }
    return value.round().toInt();
  }

  /** Returns true if less than 2-standard-deviations from the mean. */
  private isValidTruncated(value: number, index: number): boolean {
    const upper = this.meanValues[index] + this.stdDevValues[index] * 2;
    const lower = this.meanValues[index] - this.stdDevValues[index] * 2;
    return value <= upper && value >= lower;
  }
}
