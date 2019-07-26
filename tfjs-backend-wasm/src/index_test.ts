
import './index';

import * as tf from '@tensorflow/tfjs-core';
import {expectArraysClose} from '@tensorflow/tfjs-core/dist/test_util';
import {BackendWasm} from './index';

describe('wasm', () => {
  beforeAll(async () => {
    await tf.setBackend('wasm');
    console.log(tf.getBackend());
  });

  it('write and read values', async () => {
    const x = tf.tensor1d([1, 2, 3]);
    expectArraysClose([1, 2, 3], await x.data());
  });

  it('allocate repetitively and confirm reuse of heap space', () => {
    const backend = tf.backend() as BackendWasm;
    const size = 100;
    // Allocate for the first time, record the memory offset and dispose.
    const t1 = tf.zeros([size]);
    const memOffset1 = backend.getMemoryOffset(t1.dataId);
    t1.dispose();

    // Allocate again and make sure the offset is the same (memory was reused).
    const t2 = tf.zeros([size]);
    const memOffset2 = backend.getMemoryOffset(t2.dataId);
    expect(memOffset1).toBe(memOffset2);
  });
});
