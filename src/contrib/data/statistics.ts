import {Dataset, ElementArray} from '..';
import {Tensor, Scalar} from '../..';

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
 *
 * =============================================================================
 */

// TODO(soergel) This whole file is the barest stopgap.

export class NumericColumnStatistics {
  min = Number.POSITIVE_INFINITY;

  max = Number.NEGATIVE_INFINITY;
}

export type DatasetStatistics = {
  [key: string]: NumericColumnStatistics
};

export class NumericScaler {
  minT: Tensor;
  maxT: Tensor;

  constructor(protected readonly min: number, protected readonly max: number) {
    this.minT = Scalar.new(this.min);
    this.maxT = Scalar.new(this.max);
  }

  scaleTo01(value: ElementArray): ElementArray {
    if (typeof (value) === 'string') {
      throw new Error("Can't scale a string.");
    } else {
      if (value instanceof Tensor) {
        const result = value.sub(this.minT).div(this.maxT);
        return result;
      } else if (value instanceof Array) {
        return value.map(v => (v - this.min) / this.max);
      } else {
        return (value - this.min) / this.max;
      }
    }
  }
}

export async function makeDatasetStatistics(
    dataset: Dataset, shuffleSize?: number,
    sampleSize?: number): Promise<DatasetStatistics> {
  let stream = await dataset.getStream();
  if (shuffleSize != null) {
    stream = stream.shuffle(shuffleSize);
  }
  if (sampleSize != null) {
    stream = stream.take(sampleSize);
  }
  const result: DatasetStatistics = {};
  // TODO(soergel): prepare the column objects based on a schema.

  await stream.forEach(e => {
    for (const key in e) {
      const value = e[key];
      if (typeof (value) === 'string') {
        // TODO(soergel): collect string stats too
      } else {
        let recordMax: number;
        let recordMin: number;
        if (value instanceof Tensor) {
          recordMax = value.max().dataSync()[0];
          recordMin = value.min().dataSync()[0];
        } else if (value instanceof Array) {
          recordMax = value.reduce((a, b) => Math.max(a, b));
          recordMin = value.reduce((a, b) => Math.min(a, b));
        } else {
          recordMax = value;
          recordMin = value;
        }
        let columnStats: NumericColumnStatistics = result[key];
        if (columnStats == null) {
          columnStats = new NumericColumnStatistics();
          result[key] = columnStats;
        }
        columnStats.max = Math.max(columnStats.max, recordMax);
        columnStats.min = Math.min(columnStats.min, recordMin);
      }
    }
  });
  return result;
}
