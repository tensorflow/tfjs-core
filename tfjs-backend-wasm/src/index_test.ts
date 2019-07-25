
import './index';

import * as tf from '@tensorflow/tfjs-core';
import {expectArraysClose} from '@tensorflow/tfjs-core/dist/test_util';

describe('wasm', () => {
  // it('basic usage', async () => {
  //   await tfBackendWasm.init();
  //   expect(tfBackendWasm.intSqrt(25)).toBe(5);
  // });

  it('calling into the backend', async () => {
    await tf.ready();
    tf.backend();
    console.log(tf.getBackend());

    const x = tf.tensor1d([1, 2, 3]);
    console.log(await x.data());

    expectArraysClose([1, 2, 3], await x.data());
  });
});
