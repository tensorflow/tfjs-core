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

// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array3D, Array4D, DataTypes, NDArray, NDArrayBase, Scalar} from './ndarray';

export function variable<T extends keyof DataTypes>(a: NDArray<T>):
    Variable<T> {
  return new Variable(a);
}

export class Variable<T extends keyof DataTypes> implements NDArrayBase<T> {
  constructor(private ndarray: NDArray<T>) {}

  get id() {
    return this.ndarray.id;
  }
  get shape() {
    return this.ndarray.shape;
  }
  get size() {
    return this.ndarray.size;
  }
  get dtype() {
    return this.ndarray.dtype;
  }
  get rank() {
    return this.ndarray.rank;
  }

  reshape(newShape: number[]): NDArray<T> {
    throw new Error('Method not implemented.');
  }
  flatten(): Array1D<T> {
    throw new Error('Method not implemented.');
  }
  asScalar(): Scalar<T> {
    throw new Error('Method not implemented.');
  }
  as1D(): Array1D<T> {
    throw new Error('Method not implemented.');
  }
  as2D(rows: number, columns: number): Array2D<T> {
    throw new Error('Method not implemented.');
  }
  as3D(rows: number, columns: number, depth: number): Array3D<T> {
    throw new Error('Method not implemented.');
  }
  as4D(rows: number, columns: number, depth: number, depth2: number):
      Array4D<T> {
    throw new Error('Method not implemented.');
  }
  asType<G extends T>(dtype: G): NDArray<G> {
    throw new Error('Method not implemented.');
  }
  get(...locs: number[]): number {
    throw new Error('Method not implemented.');
  }
  add(value: number, ...locs: number[]): void {
    this.ndarray.add(value, ...locs);
  }
  set(value: number, ...locs: number[]): void {
    this.ndarray.set(value, ...locs);
  }
  val(...locs: number[]): Promise<number> {
    return this.ndarray.val(...locs);
  }
  locToIndex(locs: number[]): number {
    return this.ndarray.locToIndex(locs);
  }
  indexToLoc(index: number): number[] {
    return this.ndarray.indexToLoc(index);
  }
  fill(value: number): void {
    this.ndarray.fill(value);
  }
  /** @deprecated Use dataSync() instead. */
  getValues(): DataTypes[T] {
    return this.dataSync();
  }
  /** @deprecated Use data() instead. */
  getValuesAsync(): Promise<DataTypes[T]> {
    return this.data();
  }
  data(): Promise<DataTypes[T]> {
    return this.ndarray.data();
  }
  dataSync(): DataTypes[T] {
    return this.ndarray.dataSync();
  }
  dispose(): void {
    this.ndarray.dispose();
  }
  equals(t: NDArray<T>): boolean {
    return this.ndarray.equals(t);
  }
}
