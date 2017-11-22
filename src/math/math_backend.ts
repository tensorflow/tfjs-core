
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
import {ConvInfo, DepthwiseConvInfo} from './conv_util';
import {MatrixOrientation, SumTypes} from './math';
// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array3D, Array4D, DataTypes, NDArray, Scalar} from './ndarray';

/**
 * The interface that defines the kernels that should be implemented when adding
 * a new backend. New backends don't need to implement every one of the methods,
 * this can be done gradually (throw an error for unimplemented methods).
 */
export interface NDArrayMathBackend {
  clone<T extends NDArray>(ndarray: T);

  slice1D(input: Array1D, begin: number, size: number): Array1D;

  slice2D(input: Array2D, begin: [number, number], size: [number, number]):
      Array2D;

  slice3D(input: Array3D, begin: [number, number, number], size: [
    number, number, number
  ]): Array3D;

  slice4D(input: Array4D, begin: [number, number, number, number], size: [
    number, number, number, number
  ]): Array4D;

  copy2D(
      source: Array2D, sourceBeginRowCol: [number, number],
      sourceSizeRowCol: [number, number], dest: Array2D,
      destBeginRowCol: [number, number],
      destSizeRowCol: [number, number]): void;

  concat1D(a: Array1D, b: Array1D): Array1D;

  concat2D(a: Array2D, b: Array2D, axis: number): Array2D;

  concat3D(a: Array3D, b: Array3D, axis: number): Array3D;

  concat4D(a: Array4D, b: Array4D, axis: number): Array4D;

  scaledArrayAdd<T extends NDArray>(c1: Scalar, a: T, c2: Scalar, b: T): T;

  neg<T extends NDArray>(a: T): T;

  add<T extends NDArray>(a: T, b: T): T;

  subtract<T extends NDArray>(a: T, b: T): T;

  matMul(
      a: Array2D, b: Array2D, aOrientation: MatrixOrientation,
      bOrientation: MatrixOrientation): Array2D;

  multiply<T extends NDArray>(a: T, b: T): T;

  divide(a: NDArray, b: NDArray): NDArray<'float32'>;

  sum<T extends keyof DataTypes>(input: NDArray<T>, axes: number[]):
      NDArray<SumTypes[T]>;

  argMin(input: NDArray, axes: number[]): NDArray<'int32'>;

  argMax(input: NDArray, axes: number[]): NDArray<'int32'>;

  equal(a: NDArray, b: NDArray): NDArray<'bool'>;

  topK(ndarray: NDArray, k: number): {values: Array1D, indices: Array1D};

  min<G extends keyof DataTypes>(input: NDArray<G>, axes: number[]): NDArray<G>;

  max<G extends keyof DataTypes>(input: NDArray<G>, axes: number[]): NDArray<G>;

  ceil<T extends NDArray>(ndarray: T): T;

  floor<T extends NDArray>(ndarray: T): T;

  exp<T extends NDArray>(ndarray: T): T;

  log<T extends NDArray>(ndarray: T): T;

  sqrt<T extends NDArray>(ndarray: T): T;

  square<T extends NDArray>(x: T): T;

  relu<T extends NDArray>(input: T): T;

  elu<T extends NDArray>(ndarray: T): T;

  eluDer<T extends NDArray>(ndarray: T): T;

  leakyRelu<T extends NDArray>(ndarray: T, alpha: number): T;

  clip<T extends NDArray>(ndarray: T, min: number, max: number): T;

  abs<T extends NDArray>(ndarray: T): T;

  sigmoid<T extends NDArray>(ndarray: T): T;

  sin<T extends NDArray>(ndarray: T): T;

  cos<T extends NDArray>(ndarray: T): T;

  tan<T extends NDArray>(ndarray: T): T;

  asin<T extends NDArray>(ndarray: T): T;

  acos<T extends NDArray>(ndarray: T): T;

  atan<T extends NDArray>(ndarray: T): T;

  sinh<T extends NDArray>(ndarray: T): T;

  cosh<T extends NDArray>(ndarray: T): T;

  tanh<T extends NDArray>(ndarray: T): T;

  step<T extends NDArray>(ndarray: T, alpha: number): T;

  conv2d(x: Array3D, filter: Array4D, bias: Array1D|null, convInfo: ConvInfo):
      Array3D;

  conv2dDerInput(dy: Array3D, filter: Array4D, convInfo: ConvInfo): Array3D;

  conv2dDerFilter(x: Array3D, dY: Array3D, convInfo: ConvInfo): Array4D;

  conv2dDerBias(dY: Array3D): Array1D;

  depthwiseConv2D(input: Array4D, filter: Array4D, convInfo: DepthwiseConvInfo):
      Array4D;

  tile<D extends keyof DataTypes, T extends NDArray<D>>(a: T, reps: number[]):
      T;

  transpose<D extends keyof DataTypes, T extends NDArray<D>>(
      a: T, perm: number[]): T;

  maxPool(x: Array3D, convInfo: ConvInfo): Array3D;

  maxPoolBackprop(dy: Array3D, x: Array3D, convInfo: ConvInfo): Array3D;

  minPool(x: Array3D, convInfo: ConvInfo): Array3D;

  avgPool(x: Array3D, convInfo: ConvInfo): Array3D;

  resizeBilinear3D(
      x: Array3D, newShape2D: [number, number], alignCorners: boolean): Array3D;

  batchNormalization2D(
      x: Array2D, mean: Array2D|Array1D, variance: Array2D|Array1D,
      varianceEpsilon: number, scale?: Array2D|Array1D,
      offset?: Array2D|Array1D): Array2D;

  batchNormalization3D(
      x: Array3D, mean: Array3D|Array1D, variance: Array3D|Array1D,
      varianceEpsilon: number, scale?: Array3D|Array1D,
      offset?: Array3D|Array1D): Array3D;

  multinomial(probabilities: Array2D, numSamples: number, seed: number):
      Array2D<'int32'>;

  oneHot(indices: Array1D, depth: number, onValue: number, offValue: number):
      Array2D;
}
