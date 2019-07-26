
import './index';

import * as tf from '@tensorflow/tfjs-core';
import {expectArraysClose} from '@tensorflow/tfjs-core/dist/test_util';
import {BackendWasm} from './index';

describe('wasm', () => {
  beforeAll(async () => {
    tf.setBackend('wasm');
    await tf.ready();
    console.log(tf.getBackend());
  });
  // it('basic usage', async () => {
  //   await tfBackendWasm.init();
  //   expect(tfBackendWasm.intSqrt(25)).toBe(5);
  // });

  it('write and read values', async () => {
    const x = tf.tensor1d([1, 2, 3]);
    expectArraysClose([1, 2, 3], await x.data());
  });

  it('allocate repetitively and confirm reuse of heap space', () => {
    const backend = tf.backend() as BackendWasm;
    const n = 10;
    const size = 100;
    // Allocate for the first time and record the head of the heap.
    const x = tf.zeros([size]);
    x.dispose();
    const headOfHeap = backend.headOfHeap();

    // Allocate repetitively of the same size and confirm head of heap has not
    // moved.
    for (let i = 0; i < n; i++) {
      const x = tf.zeros([size]);
      x.dispose();
    }
    console.log(backend.headOfHeap() - headOfHeap);
    expect(backend.headOfHeap()).toBe(headOfHeap);
  });
});
