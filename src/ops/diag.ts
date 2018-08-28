import {tensor} from '../ops/tensor_ops';
import {Tensor} from '../tensor';

import {op} from './operation';

function diag_(t: Tensor): Tensor {
  const arr = Array.from(t.dataSync());
  const m = arr.reduce((a, b, i, d) => {
    a.push(...d.map((e, ind) => ind === i ? e : 0));
    return a;
  }, []);
  return tensor(m, [...t.shape, ...t.shape]);
}

export const diag = op({diag_});
