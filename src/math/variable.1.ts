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

import {ENV} from '../environment';
import * as util from '../util';
// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array3D, Array4D, DataTypes, NDArray, Rank, RankMap, Scalar} from './ndarray';

export interface NDArrayBase<D extends keyof DataTypes, R extends keyof Rank> {
  id: number;
  shape: number[];
  size: number;
  dtype: D;
  rank: number;
  strides: number[];

  reshape<R2 extends keyof Rank>(newShape: number[]): RankMap<D>[R2];
  flatten(): Array1D<D>;
  asScalar(): Scalar<D>;
  as1D(): Array1D<D>;
  as2D(rows: number, columns: number): Array2D<D>;
  as3D(rows: number, columns: number, depth: number): Array3D<D>;
  as4D(rows: number, columns: number, depth: number, depth2: number):
      Array4D<D>;
  asType<D2 extends D>(dtype: D2): NDArray<D2, R>;
  get(...locs: number[]): number;
  add(value: number, ...locs: number[]): void;
  set(value: number, ...locs: number[]): void;
  val(...locs: number[]): Promise<number>;
  locToIndex(locs: number[]): number;
  indexToLoc(index: number): number[];
  fill(value: number): void;

  /** @deprecated Use dataSync() instead. */
  getValues(): DataTypes[D];
  /** @deprecated Use data() instead. */
  getValuesAsync(): Promise<DataTypes[D]>;
  data(): Promise<DataTypes[D]>;
  dataSync(): DataTypes[D];
  dispose(): void;
  equals(t: NDArray<D, R>): boolean;
}

export class Variable<D extends keyof DataTypes, R extends keyof Rank>
    implements NDArrayBase<D, R> {
  private value: NDArray<D, R>;

  constructor(initialValue: NDArray<D, R>, public trainable = true, dtype?: D) {
    this.value = dtype != null ? initialValue.asType(dtype) : initialValue;
    ENV.math.keep(this.value);
  }

  assign(newValue: NDArray<D, R>): void {
    if (newValue.dtype !== this.value.dtype) {
      throw new Error(
          `dtype of the new value (${newValue.dtype}) and ` +
          `previous value (${this.value.dtype}) must match`);
    }
    if (!util.arraysEqual(newValue.shape, this.value.shape)) {
      throw new Error(
          `shape of the new value (${newValue.shape}) and ` +
          `previous value (${this.value.shape}) must match`);
    }
    this.value.dispose();
    this.value = newValue;
  }

  get id() {
    return this.value.id;
  }
  get shape() {
    return this.value.shape;
  }
  get size() {
    return this.value.size;
  }
  get dtype() {
    return this.value.dtype;
  }
  get rank() {
    return this.value.rank;
  }
  get strides() {
    return this.value.strides;
  }

  reshape<R2 extends keyof Rank>(newShape: number[]): RankMap<D>[R2] {
    return this.value.reshape(newShape);
  }
  flatten(): Array1D<D> {
    return this.value.flatten();
  }
  asScalar(): Scalar<D> {
    return this.value.asScalar();
  }
  as1D(): Array1D<D> {
    return this.value.as1D();
  }
  as2D(rows: number, columns: number): Array2D<D> {
    return this.value.as2D(rows, columns);
  }
  as3D(rows: number, columns: number, depth: number): Array3D<D> {
    return this.value.as3D(rows, columns, depth);
  }
  as4D(rows: number, columns: number, depth: number, depth2: number):
      Array4D<D> {
    return this.value.as4D(rows, columns, depth, depth2);
  }
  asType<D2 extends D>(dtype: D2): NDArray<D2, R> {
    return this.value.asType(dtype);
  }
  get(...locs: number[]): number {
    return this.value.get(...locs);
  }
  add(value: number, ...locs: number[]): void {
    this.value.add(value, ...locs);
  }
  set(value: number, ...locs: number[]): void {
    this.value.set(value, ...locs);
  }
  val(...locs: number[]): Promise<number> {
    return this.value.val(...locs);
  }
  locToIndex(locs: number[]): number {
    return this.value.locToIndex(locs);
  }
  indexToLoc(index: number): number[] {
    return this.value.indexToLoc(index);
  }
  fill(value: number): void {
    this.value.fill(value);
  }
  /** @deprecated Use dataSync() instead. */
  getValues(): DataTypes[D] {
    return this.dataSync();
  }
  /** @deprecated Use data() instead. */
  getValuesAsync(): Promise<DataTypes[D]> {
    return this.data();
  }
  data(): Promise<DataTypes[D]> {
    return this.value.data();
  }
  dataSync(): DataTypes[D] {
    return this.value.dataSync();
  }
  dispose(): void {
    this.value.dispose();
  }
  equals(t: NDArray<D, R>): boolean {
    return this.value.equals(t);
  }
}
