import {nearestDivisor} from '../util';
import {PARALLELIZE_THRESHOLD} from './reduce_util';

export interface SegOpInfo {
  windowSize: number;
  batchSize: number;
  inSize: number;
  numSegments: number;
}

export function segOpComputeOptimalWindowSize(
    inSize: number, numSegments: number): number {
  let done = false;
  let res;

  if (inSize <= PARALLELIZE_THRESHOLD) {
    res = inSize;
    done = true;
  } else {
    res = nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
  }

  while (!done) {
    if (res > numSegments || res === inSize) {
      done = true;
      break;
    } else {
      res = nearestDivisor(inSize, res + 1);
    }
  }
  return res;
}

export function computeOutShape(
    aShape: number[], axis: number, numSegments: number): number[] {
  const outShape = [];
  const rank = aShape.length;
  for (let dim = 0; dim < rank; dim++) {
    if (dim !== axis) {
      outShape.push(aShape[dim]);
    } else {
      outShape.push(numSegments);
    }
  }
  return outShape;
}
