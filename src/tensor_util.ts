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

import {Tensor} from './tensor';
import {TypedArray} from './types';
import * as util from './util';

// Maximum number of values before we decide to show ellipsis.
const LIMIT_NUM_VALS = 20;
// Number of first and last values to show when displaying a, b,...,y, z.
const NUM_FIRST_LAST_VALS = 3;
// Number of significant digits to show.
const NUM_SIG_DIGITS = 7;

function valToString(val: number, pad: number) {
  return util.rightPad(parseFloat(val.toFixed(NUM_SIG_DIGITS)).toString(), pad);
}

function subTensorToString(
    vals: TypedArray, shape: number[], strides: number[], padPerCol: number[],
    isLast = true): string[] {
  const size = shape[0];
  const rank = shape.length;
  if (rank === 0) {
    return [vals[0] + ''];
  }

  if (rank === 1) {
    if (size > LIMIT_NUM_VALS) {
      const firstVals = Array.from(vals.subarray(0, NUM_FIRST_LAST_VALS));
      const lastVals =
          Array.from(vals.subarray(size - NUM_FIRST_LAST_VALS, size));
      return [
        '[' + firstVals.map((x, i) => valToString(x, padPerCol[i])).join(', ') +
        ', ..., ' +
        lastVals
            .map(
                (x, i) =>
                    valToString(x, padPerCol[size - NUM_FIRST_LAST_VALS + i]))
            .join(', ') +
        ']'
      ];
    }
    return [
      '[' +
      Array.from(vals).map((x, i) => valToString(x, padPerCol[i])).join(', ') +
      ']'
    ];
  }

  // The array is rank 2 or more.
  const subshape = shape.slice(1);
  const substrides = strides.slice(1);
  const stride = strides[0];
  const lines: string[] = [];
  if (size > LIMIT_NUM_VALS) {
    for (let i = 0; i < NUM_FIRST_LAST_VALS; i++) {
      const start = i * stride;
      const end = start + stride;
      lines.push(...subTensorToString(
          vals.subarray(start, end), subshape, substrides, padPerCol,
          false /* isLast */));
    }
    lines.push('...');
    for (let i = size - NUM_FIRST_LAST_VALS; i < size; i++) {
      const start = i * stride;
      const end = start + stride;
      lines.push(...subTensorToString(
          vals.subarray(start, end), subshape, substrides, padPerCol,
          i === size - 1 /* isLast */));
    }
  } else {
    for (let i = 0; i < size; i++) {
      const start = i * stride;
      const end = start + stride;
      lines.push(...subTensorToString(
          vals.subarray(start, end), subshape, substrides, padPerCol,
          i === size - 1 /* isLast */));
    }
  }
  const sep = rank === 2 ? ',' : '';
  lines[0] = '[' + lines[0] + sep;
  for (let i = 1; i < lines.length - 1; i++) {
    lines[i] = ' ' + lines[i] + sep;
  }
  let newLineSep = ',\n';
  for (let i = 2; i < rank; i++) {
    newLineSep += '\n';
  }
  lines[lines.length - 1] =
      ' ' + lines[lines.length - 1] + ']' + (isLast ? '' : newLineSep);
  return lines;
}

function computeMaxSizePerColumn(t: Tensor): number[] {
  const vals = t.dataSync();
  const n = t.size;

  const numCols = t.strides[t.strides.length - 1];
  const padPerCol = new Array(numCols).fill(0);
  if (t.rank > 1) {
    for (let row = 0; row < n / numCols; row++) {
      const offset = row * numCols;
      for (let j = 0; j < numCols; j++) {
        padPerCol[j] =
            Math.max(padPerCol[j], valToString(vals[offset + j], 0).length);
      }
    }
  }
  return padPerCol;
}

export function tensorToString(t: Tensor) {
  const vals = t.dataSync();
  const padPerCol = computeMaxSizePerColumn(t);
  const valsLines = subTensorToString(vals, t.shape, t.strides, padPerCol);
  const lines = [
    'Tensor', `  dtype: ${t.dtype}`, `  rank: ${t.rank}`,
    `  shape: [${t.shape}]`, `  values:`,
    valsLines.map(l => '    ' + l).join('\n')
  ];
  return lines.join('\n');
}
