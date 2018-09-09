import {TypedArray} from '../types';

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
 * Merges real and imaginary Float32Arrays into a single complex Float32Array.
 *
 * The memory layout is interleaved as follows:
 * real: [r0, r1, r2]
 * imag: [i0, i1, i2]
 * complex: [r0, i0, r1, i1, r2, i2]
 *
 * This is the inverse of splitRealAndImagArrays.
 *
 * @param real The real values of the complex tensor values.
 * @param imag The imag values of the complex tensor values.
 * @returns A complex tensor as a Float32Array with merged values.
 */
export function mergeRealAndImagArrays(
    real: Float32Array, imag: Float32Array): Float32Array {
  if (real.length !== imag.length) {
    throw new Error(
        `Cannot merge real and imag arrays of different lengths. real:` +
        `${real.length}, imag: ${imag.length}.`);
  }
  const result = new Float32Array(real.length * 2);
  for (let i = 0; i < result.length; i += 2) {
    result[i] = real[i / 2];
    result[i + 1] = imag[i / 2];
  }
  return result;
}

/**
 * Splits a complex Float32Array into real and imag parts.
 *
 * The memory layout is interleaved as follows:
 * complex: [r0, i0, r1, i1, r2, i2]
 * real: [r0, r1, r2]
 * imag: [i0, i1, i2]
 *
 * This is the inverse of mergeRealAndImagArrays.
 *
 * @param complex The complex tensor values.
 * @returns An object with real and imag Float32Array components of the complex
 *     tensor.
 */
export function splitRealAndImagArrays(complex: Float32Array):
    {real: Float32Array, imag: Float32Array} {
  const real = new Float32Array(complex.length / 2);
  const imag = new Float32Array(complex.length / 2);
  for (let i = 0; i < complex.length; i += 2) {
    real[i / 2] = complex[i];
    imag[i / 2] = complex[i + 1];
  }
  return {real, imag};
}

/**
 * Get the map representing a complex value in the given array.
 * @param complex The complex tensor values.
 * @param index An index of the target complex value.
 */
export function getComplexWithIndex(complex: TypedArray, index: number):
    InternalComplex {
  const real = complex[index*2];
  const imag = complex[index*2+1];
  return new InternalComplex(real, imag);
}

/**
 * Insert a given complex value into the TypedArray.
 * @param data The array in which the complex value is inserted.
 * @param c The complex value to be inserted.
 * @param index An index of the target complex value.
 */
export function assignToTypedArray(data: TypedArray,
    c: InternalComplex, index: number) {
  data[index*2] = c.real;
  data[index*2+1] = c.imag;
}

/**
 * Make the exponent term used by FFT.
 */
export function exponent(k: number, N: number):
    InternalComplex {
  const x = -2 * Math.PI * (k / N);
  const real = Math.cos(x);
  const imag = Math.sin(x);
  return new InternalComplex(real, imag);
}

/**
 * InternalComplex is mainly used to represents complex value internally.
 * This class is assumed to be used for the calculation of the complex value
 * on CPU implementation.
 */
export class InternalComplex {
  real: number;
  imag: number;

  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  add(other: InternalComplex) {
    return new InternalComplex(this.real + other.real, this.imag + other.imag);
  }

  sub(other: InternalComplex) {
    return new InternalComplex(this.real - other.real, this.imag - other.imag);
  }

  mul(other: InternalComplex) {
    return new InternalComplex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }
}
