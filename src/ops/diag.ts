import {ENV} from '../environment';
// import {tensor} from '../ops/tensor_ops';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';

import {op} from './operation';

function diag_(x: Tensor): Tensor {
  const $x = convertToTensor(x, 'x', 'diag');
  return ENV.engine.runKernel(backend => backend.diag($x), {$x}).reshape([
    ...x.shape, ...x.shape
  ]);
}

export const diag = op({diag_});
