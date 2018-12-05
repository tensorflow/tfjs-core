import {util} from '..';
import {ENV} from '../environment';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';

import {op} from './operation';

/**
 * Returns the diagonal part of the tensor.
 *
 * Given a tensor, this operation returns a tensor with the diagonal part of the
 * input.
 *
 * Assume the input has dimensions `[D1,..., Dk, D1,..., Dk]`, then the output
 * is a tensor of rank k with dimensions `[D1,..., Dk]`
 *
 * ```js
 * const x = tf.tensor2d([[1, 0, 0, 0], [0, 2, 0, 0], [0, 0, 3, 0], [0, 0, 0,
 * 4]]);
 *
 * tf.diagpart(x).print()
 * ```
 * ```js
 * const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 6, 8, 3, 4, 6, 8, 7, 7, 3, 3], [4,
 * 1, 2, 2])
 *
 * tf.diagpart(x).print()
 * ```
 * @param x The input tensor.
 */

function diagPart_(x: Tensor): Tensor {
  util.assert(
      x.rank !== 0 && x.rank % 2 === 0,
      `diagpart expects a tensor of even and non zero rank, but got a rank-${
          x.rank} tensor`);
  const mid = x.rank / 2;
  const dim1 = x.shape.slice(0, mid);
  const dim2 = x.shape.slice(mid, x.shape.length);
  util.assert(
      util.arraysEqual(dim1, dim2),
      `diagPart expects ${dim1.toString()} to be equal to ${dim2.toString()}`);
  const $x = convertToTensor(x, 'x', 'diagpart').flatten();
  const outShape = dim1;
  return ENV.engine.runKernel(backend => backend.diagPart($x), {$x})
      .reshape(outShape);
}

export const diagPart = op({diagPart_});
