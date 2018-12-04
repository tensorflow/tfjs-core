import {util} from '..';
import {ENV} from '../environment';
// import {tensor} from '../ops/tensor_ops';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';

import {op} from './operation';

function diagPart_(x: Tensor): Tensor {
  util.assert(
      x.rank % 2 === 0,
      `diagpart expects a tensor of even dimension, but got a rank-${
          x.rank} tensor`);
  const mid = x.rank / 2;
  const dim1 = x.shape.slice(0, mid);
  const dim2 = x.shape.slice(mid, x.shape.length);
  util.assert(
      util.arraysEqual(dim1, dim2),
      `diagPart expects ${dim1.toString()} to be equal to ${
          dim2.toString()}`);
  const $x = convertToTensor(x, 'x', 'diag_part').flatten();
  const outShape = dim1;
  return ENV.engine.runKernel(backend => backend.diagPart($x), {$x})
      .reshape(outShape);
}

export const diagPart = op({diagPart_});
