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

export function splitRealAndImagArrays(complex: Float32Array):
    {real: Float32Array, imag: Float32Array} {
  const real = new Float32Array(complex.length / 2);
  const imag = new Float32Array(complex.length / 2);
  for (let i = 0; i < complex.length; i += 2) {
    real[i / 2] = complex[i];
    imag[i / 2] = complex[i + 1];
  }
  console.log('r', real);
  console.log('imag', imag);
  return {real, imag};
}
