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

import {ENGINE} from './engine';
import {Tensor} from './tensor';
import {inferShape} from './tensor_util_env';
import {RecursiveArray, TensorLike, TypedArray} from './types';
import {arraysEqual, flatten, isString, isTypedArray} from './util';

const TEST_EPSILON_FLOAT32 = 1e-3;
export const TEST_EPSILON_FLOAT16 = 1e-1;

export function expectArraysClose(
    actual: Tensor|TypedArray|number|RecursiveArray<number>,
    expected: Tensor|TypedArray|number|RecursiveArray<number>,
    epsilon?: number) {
  if (epsilon == null) {
    epsilon = testEpsilon();
  }
  return expectArraysPredicate(
      actual, expected, (a, b) => areClose(a as number, b as number, epsilon));
}

export function testEpsilon() {
  return ENGINE.backend.floatPrecision() === 32 ? TEST_EPSILON_FLOAT32 :
                                                  TEST_EPSILON_FLOAT16;
}

function expectArraysPredicate(
    actual: Tensor|TensorLike, expected: Tensor|TensorLike,
    predicate: (a: {}, b: {}) => boolean) {
  let checkClassType = true;
  if (actual instanceof Tensor || expected instanceof Tensor) {
    checkClassType = false;
  }
  if (isTypedArray(actual) || isTypedArray(expected)) {
    checkClassType = false;
  }
  if (isTypedArray(actual) && isTypedArray(expected)) {
    checkClassType = true;
  }
  if (checkClassType) {
    const aType = actual.constructor.name;
    const bType = expected.constructor.name;

    if (aType !== bType) {
      throw new Error(
          `Arrays are of different type actual: ${aType} ` +
          `vs expected: ${bType}`);
    }
  }
  if (actual instanceof Tensor && expected instanceof Tensor) {
    if (actual.dtype !== expected.dtype) {
      throw new Error(
          `Arrays are of different type actual: ${actual.dtype} ` +
          `vs expected: ${expected.dtype}.`);
    }
    if (!arraysEqual(actual.shape, expected.shape)) {
      throw new Error(
          `Arrays are of different shape actual: ${actual.shape} ` +
          `vs expected: ${expected.shape}.`);
    }
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    const actualShape = inferShape(actual);
    const expectedShape = inferShape(expected);
    if (!arraysEqual(actualShape, expectedShape)) {
      throw new Error(
          `Arrays have different shapes. ` +
          `Actual: ${actualShape}. Expected: ${expectedShape}`);
    }
  }
  let actualFlat: TypedArray|number[]|boolean[]|string[];
  if (actual instanceof Tensor) {
    actualFlat = actual.dataSync();
  } else if (Array.isArray(actual) || typeof actual === 'number') {
    actualFlat = flatten(actual) as number[];
  } else {
    actualFlat = actual as TypedArray;
  }
  let expectedFlat: typeof actualFlat;
  if (expected instanceof Tensor) {
    expectedFlat = expected.dataSync();
  } else if (Array.isArray(expected) || typeof expected === 'number') {
    expectedFlat = flatten(expected) as number[];
  } else {
    expectedFlat = expected as TypedArray;
  }

  if (actualFlat.length !== expectedFlat.length) {
    throw new Error(
        `Arrays have different lengths actual: ${actualFlat.length} vs ` +
        `expected: ${expectedFlat.length}.\n` +
        `Actual:   ${actualFlat}.\n` +
        `Expected: ${expectedFlat}.`);
  }
  for (let i = 0; i < expectedFlat.length; ++i) {
    const a = actualFlat[i];
    const e = expectedFlat[i];

    if (!predicate(a, e)) {
      throw new Error(
          `Arrays differ: actual[${i}] = ${a}, expected[${i}] = ${e}.\n` +
          `Actual:   ${actualFlat}.\n` +
          `Expected: ${expectedFlat}.`);
    }
  }
}

export interface DoneFn {
  (): void;
  fail: (message?: Error|string) => void;
}

export function expectPromiseToFail(fn: () => Promise<{}>, done: DoneFn): void {
  fn().then(() => done.fail(), () => done());
}

export function expectArraysEqual(
    actual: Tensor|TensorLike, expected: Tensor|TensorLike) {
  const exp = typeof expected === 'string' || typeof expected === 'number' ||
          typeof expected === 'boolean' ?
      [expected] as number[] :
      expected as number[];
  if (actual instanceof Tensor && actual.dtype === 'string' ||
      expected instanceof Tensor && expected.dtype === 'string' ||
      Array.isArray(actual) && isString(actual[0]) ||
      Array.isArray(expected) && isString(expected[0])) {
    // tslint:disable-next-line:triple-equals
    return expectArraysPredicate(actual, exp, (a, b) => a == b);
  }
  return expectArraysClose(actual as TypedArray, expected as TypedArray, 0);
}

export function expectNumbersClose(a: number, e: number, epsilon?: number) {
  if (epsilon == null) {
    epsilon = testEpsilon();
  }
  if (!areClose(a, e, epsilon)) {
    throw new Error(`Numbers differ: actual === ${a}, expected === ${e}`);
  }
}

function areClose(a: number, e: number, epsilon: number): boolean {
  if (!isFinite(a) && !isFinite(e)) {
    return true;
  }
  if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
    return false;
  }
  return true;
}

export function expectValuesInRange(
    actual: TypedArray|number[], low: number, high: number) {
  let actualVals: TypedArray|number[];
  if (actual instanceof Tensor) {
    actualVals = actual.dataSync();
  } else {
    actualVals = actual;
  }
  for (let i = 0; i < actualVals.length; i++) {
    if (actualVals[i] < low || actualVals[i] > high) {
      throw new Error(
          `Value out of range:${actualVals[i]} low: ${low}, high: ${high}`);
    }
  }
}

export function expectArrayBuffersEqual(
    actual: ArrayBuffer, expected: ArrayBuffer) {
  // Safari & Jasmine don't like comparing ArrayBuffers directly. Wrapping in
  // a Float32Array solves this issue.
  expect(new Float32Array(actual)).toEqual(new Float32Array(expected));
}
