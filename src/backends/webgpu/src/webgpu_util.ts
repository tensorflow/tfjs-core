/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

const arrayProduct = (arr: number[]) => {
  if (!arr.length) {
    throw new Error('Cannot compute product of empty array.');
  }
  let product = 1;
  for (let i = 0; i < arr.length; i++) {
    product *= arr[i];
  }
  return product;
};

export function computeDispatch(
    layout: [number[], number[], number[]], outputShape: number[],
    tileSize: [number, number, number]): [number, number, number] {
  return [
    Math.ceil(arrayProduct(layout[0].map(d => outputShape[d])) / tileSize[0]),
    Math.ceil(arrayProduct(layout[1].map(d => outputShape[d])) / tileSize[1]),
    Math.ceil(arrayProduct(layout[2].map(d => outputShape[d])) / tileSize[2])
  ];
}