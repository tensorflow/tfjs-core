import * as tf from '@tensorflow/tfjs-webgpu';

describe('Ops benchmarks', () => {
  it('matMul', async () => {
    await tf.ready;

    const times = [];

    const a = tf.randomNormal([500, 500]);
    const b = tf.randomNormal([500, 500]);

    let c = tf.matMul(a, b);
    await c.data();

    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      c = tf.matMul(a, b);
      await c.data();
      times.push(performance.now() - start);
    }

    console.log(
        `Average time ms: ${times.reduce((a, b) => a + b, 0) / times.length}`);
    console.log(`Min time ms: ${Math.min(...times)}`);
  });
});