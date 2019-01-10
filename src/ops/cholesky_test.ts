import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { cholesky } from './cholesky';
import { expectArraysClose, CPU_ENVS } from '../test_util';

// import { scalar, tensor1d, tensor2d, tensor3d, tensor4d } from './ops';

describeWithFlags('cholesky-tiny', CPU_ENVS, () => {
  it('Compute cholesky decomposition', () => {
    const a = tf.tensor2d([25, 15, -5, 15, 18, 0, -5, 0, 11],
      [3, 3], "float32");

    a.print();
    let L = cholesky(a.clone());
    a.print();
    let res = tf.tensor2d([5, 0, 0, 3, 3, 0, -1, 1, 3], [3, 3], "float32");
    expectArraysClose(L, res);
    let rec = L.matMul(L.transpose());

    expectArraysClose(
      a, rec
    );
  })

  it('Compute gradients correctly', () => {
    // console.log('----grad----')
    // let dL = cholesky_unblocked_grad(L, tf.eye(3, 3));
  });


});
