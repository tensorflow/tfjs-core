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

import {assert} from '../util';
import {TypedArray} from '../types';

/**
 * Internal representation for complex number
 */
export class Complex {
  private _real: number;
  private _imag: number;

  constructor(real: number, imag: number) {
    this._real = real;
    this._imag = imag;
  }

  add(other: Complex) {
    return new Complex(this._real + other._real, this._imag + other._imag);
  }

  sub(other: Complex) {
    return new Complex(this._real - other._real, this._imag - other._imag);
  }

  mul(other: Complex) {
    return new Complex(
      this._real * other._real - this._imag * other._imag,
      this._real * other._imag + this._imag * other._real
    );
  }

  get real(): number {
    return this._real;
  }

  get imag(): number {
    return this._imag;
  }

  static fromTypedArray(data: TypedArray) {
    assert(data.length === 2,
      'Source data must contain real and imaginary values');
    return new Complex(data[0], data[1]);
  }

  // Create a complex value from the part of given TypedArray
  static fromTypedArrayWithIndex(data: TypedArray, index: number) {
    return new Complex(data[index*2], data[index*2+1]);
  }

  static exponent(k: number, N:number): Complex {
    const x = -2 * Math.PI * (k / N);
    return new Complex(Math.cos(x), Math.sin(x));
  }

  // Put complex value to given TypedArray in the specified position.
  static assign(data: TypedArray, complex: Complex, i: number) {
    data[i*2] = complex.real;
    data[i*2+1] = complex.imag;
  }
}
