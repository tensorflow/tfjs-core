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

import {Dataset, ElementArray} from '..';
import {Scalar, Tensor} from '../..';

// TODO(soergel) This whole file is the barest stopgap.

export class NumericColumnStatistics {
  min = Number.POSITIVE_INFINITY;

  max = Number.NEGATIVE_INFINITY;
}

export type DatasetStatistics = {
  [key: string]: NumericColumnStatistics
};

/**
 * Provides a function that scales numeric values into the [0, 1] interval.
 *
 * @param min the lower bound of the inputs, which should be mapped to 0.
 * @param min the upper bound of the inputs, which should be mapped to 1
 * @return A function that maps an input ElementArray to a scaled ElementArray.
 */
export function scaleTo01(min: number, max: number): (value: ElementArray) =>
    ElementArray {
  const minTensor: Tensor = Scalar.new(min);
  const maxTensor: Tensor = Scalar.new(max);
  return (value: ElementArray): ElementArray => {
    if (typeof (value) === 'string') {
      throw new Error('Can\'t scale a string.');
    } else {
      if (value instanceof Tensor) {
        const result = value.sub(minTensor).div(maxTensor);
        return result;
      } else if (value instanceof Array) {
        return value.map(v => (v - min) / max);
      } else {
        return (value - min) / max;
      }
    }
  };
}

/**
 * Gathers statistics from a Dataset (or optionally from a sample).
 *
 * Currently we gather only the minimum and maximum value from each numeric
 * column.
 *
 * This obtains a stream from the Dataset and, by default, does a full pass
 * to gather the statistics.
 *
 * Statistics may be computed over a sample.  However: simply taking the first n
 * items from the stream may produce a poor estimate if the stream is ordered in
 * some way.
 *
 * A truly random shuffle of the stream would of course solve this
 * problem, but many streams do not allow for this, instead providing only a
 * sliding-window shuffle.  A partially-randomized sample could be obtained by
 * shuffling over a window followed by taking the first n samples (where n is
 * smaller than the shuffle window size).  However there is little point in
 * using that approach here, because the cost is likely dominated by obtaining
 * the data.  Thus, once we have filled our shuffle buffer, we may as well use
 * all of that data instead of sampling from it.
 *
 * @param dataset A Dataset over which to measure statistics.
 * @param shuffleSize The size of the shuffle window to use, if any.  (Not
 *   recommended, as described above).
 * @param sampleSize The number of examples to take from the (possibly shuffled)
 *   stream.
 */
export async function makeDatasetStatistics(
    dataset: Dataset, sampleSize?: number,
    shuffleSize?: number): Promise<DatasetStatistics> {
  let stream = await dataset.getStream();
  // TODO(soergel): allow for deep shuffle where possible.
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
        // TODO(soergel): Also collect mean, stddev, histogram, etc.
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
