import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { cholesky, cholesky_grad } from './cholesky';
import { expectArraysClose, ALL_ENVS } from '../test_util';

describeWithFlags('cholesky-small', ALL_ENVS, () => {
  it('Compute cholesky', () => {
    const a = tf.tensor2d([25, 15, -5, 15, 18, 0, -5, 0, 11],
      [3, 3], "float32");

    let L = cholesky(a);
    let res = tf.tensor2d([5, 0, 0, 3, 3, 0, -1, 1, 3], [3, 3], "float32");
    expectArraysClose(L, res);
    let rec = L.matMul(L.transpose());

    expectArraysClose(a, rec);
  })

  it('Compute gradients', () => {
    const a = tf.tensor2d([25, 15, -5, 15, 18, 0, -5, 0, 11],
      [3, 3], "float32");

    let L = cholesky(a);
    let dL = cholesky_grad(L, tf.ones([3, 3]));

    let expected = tf.tensor2d(
      [0.0867, 0.0000, 0.0000, 0.0889, 0.1296, 0.0000, 0.1333, 0.2222, 0.1667],
      [3, 3], 'float32')

    expectArraysClose(
      dL, expected
    );
  });


});
