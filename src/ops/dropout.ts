import {keep, tidy} from '../globals';
import {Scalar, Tensor} from '../tensor';
import {DataType} from '../types';
import {arraysEqual} from '../util';

import {randomUniform} from './array_ops';
import {add, div, mul, sub} from './binary_ops';
import {op} from './operation';
import {scalar} from './tensor_ops';
import {neg, step} from './unary_ops';

const scalarCache: {[typeKey: string]: {[key: number]: Scalar}} = {
  float32: {},
  int32: {}
};
const DEFAULT_DTYPE: DataType = 'float32';
/**
 * Get scalar, with caching.
 */
function getScalar_(value: number, dtype?: DataType): Scalar {
  if (dtype === undefined) {
    dtype = DEFAULT_DTYPE;
  }
  if (scalarCache[dtype][value] == null) {
    scalarCache[dtype][value] = scalar(value, dtype);
    keep(scalarCache[dtype][value]);
  }
  return scalarCache[dtype][value];
}

/**
 * Sets entries in `x` to zero at random, while scaling the entire tensor.
 *
 * @param x input tensor.
 * @param level fraction of the entries in the tensor that will be set to 0.
 * @param noiseShape shape of randomly generated keep/drop flags, must be
 *   broadcastable to the shape of `x`.
 * @param seed random seed to ensure determinism.
 * @returns Result of the dropout operation.
 */

function dropout_(
    x: Tensor, level: Scalar, noiseShape?: number[], seed?: number): Tensor {
  return tidy(() => {
    // TODO(cais): Switch to deeplearn.js implementation of dropout when it
    //   becomes avaialable.
    if (noiseShape != null && !arraysEqual(x.shape, noiseShape)) {
      throw new Error(
          'Non-default noise shape is not implemented yet: ' +
          JSON.stringify(noiseShape));
    }
    if (seed != null) {
      throw new Error('seed is not implemented for dropout yet.');
    }
    let multiplier = step(
        add(neg(level) as Scalar, randomUniform(x.shape, 0, 1, 'float32')));
    // Scale the kept elements, so the expected sum is unchanged.
    multiplier =
        mul(div(getScalar(1), sub(getScalar(1), level)) as Scalar, multiplier);
    return mul(x, multiplier);
  });
}

export const dropout = op({dropout_});
export const getScalar = op({getScalar_});
