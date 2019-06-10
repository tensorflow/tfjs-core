/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs-core';
import {describeWebGPU} from './test_util';

describeWebGPU('Ops benchmarks', () => {
  // Performs `trials` trials, of `reps` repetitions each. At the end of each
  // trial, endTrial() is run (and included in the benchmark time). This
  // allows the cost of endTrial() to be amortized across the many iterations.
  // This is needed in particular because WebGPU readbacks are asynchronous
  // and therefore always incur latency. (Plus, in Chrome right now, readbacks
  // are very inefficient, making the problem way worse.) Readbacks could be
  // avoided by using fences, but we don't have a common abstraction over
  // WebGL and WebGPU fences at the moment.
  async function time(
      trials: number, reps: number, doRep: (r: number) => tf.Tensor[],
      endTrial: () => Promise<void>) {
    const times = [];

    let toDispose: tf.Tensor[] = [];
    const dispose = () => {
      for (const t of toDispose) {
        t.dispose();
      }
      toDispose = [];
    };

    const trial = () => {
      for (let r = 0; r < reps; ++r) {
        toDispose = toDispose.concat(doRep(r));
      }
      return endTrial();
    };

    // Warm-up. Specifically, this pre-allocates enough memory for an entire
    // trial, ensuring that no allocations happen when timing a trial (if the
    // backend reuses allocations).
    await trial();
    dispose();

    for (let t = 0; t < trials; ++t) {
      const start = performance.now();
      await trial();
      times.push(performance.now() - start);
      dispose();
    }

    const mean = times.reduce((a, b) => a + b, 0) / trials;
    const min = Math.min(...times);
    const fmt = (n: number) => n.toFixed(3);
    console.log(`Mean time: ${fmt(mean)} ms -> ${fmt(mean / reps)} / rep`);
    console.log(`Min time: ${fmt(min)} ms -> ${fmt(min / reps)} / rep`);
  }

  // tslint:disable-next-line:ban
  xit('argMax', async () => {
    const n = 50;
    const doTest = async (axis: number) => {
      const tensors = new Array(n);
      const maxes = new Array(n);
      for (let i = 0; i < n; ++i) {
        tensors[i] = tf.randomNormal([100, 100, 100]);
      }

      await time(
          5, n,
          (r) => {
            maxes[r] = tf.argMax(tensors[r], axis);
            return [];
          },
          async () => {
            await maxes[maxes.length - 1].data();
            for (const t of maxes) {
              t.dispose();
            }
          });
    };

    await doTest(0);
    await doTest(1);
    await doTest(2);
  }, 60000);

  // tslint:disable-next-line:ban
  xit('matMul', async () => {
    let a = tf.randomNormal([500, 500]);
    const b = tf.randomNormal([500, 500]);

    await time(
        5, 50,
        () => {
          const c = tf.matMul(a, b);
          const toDispose = a;
          a = c;
          return [toDispose];
        },
        async () => {
          await a.data();
        });
  }, 60000);

  // tslint:disable-next-line:ban
  xit('conv2d', async () => {
    let a = tf.randomNormal<tf.Rank.R4>([1, 128, 128, 4]);
    const b = tf.randomNormal<tf.Rank.R4>([25, 25, 4, 4]);

    await time(
        5, 50,
        () => {
          const c = tf.conv2d(a, b, 1, 'same');
          const toDispose = a;
          a = c;
          return [toDispose];
        },
        async () => {
          await a.data();
        });
  }, 60000);

  fit('frompixels', async () => {
    const pixels = new ImageData(2, 2);
    for (let i = 0; i < 8; i++) {
      pixels.data[i] = 100;
    }
    for (let i = 8; i < 16; i++) {
      pixels.data[i] = 250;
    }

    const a = tf.browser.fromPixels(pixels, 4);
    // const a = tf.tensor1d(
    //     [
    //       100, 100, 100, 100, 100, 100, 100, 100, 250, 250, 250, 250, 250,
    //       250, 250, 250
    //     ],
    //     'int32');
    const b = tf.scalar(20, 'int32');
    // const b = tf.scalar(0);
    const aData = await a.data();
    console.log(aData);

    const res = tf.add(a, b);
    const resData = await res.data();
    console.log(Array.from(resData));
  });

  fit('frompixels 1x1x4', async () => {
    const pixels = new ImageData(1, 1);
    pixels.data[0] = 0;
    pixels.data[1] = 80;
    pixels.data[2] = 160;
    pixels.data[3] = 240;

    const array = tf.browser.fromPixels(pixels, 4);
    const data = await array.data();
    console.log(Array.from(data));  // should be [0, 80, 160, 240]
  });

  fit('fromPixels, 3 channels', async () => {
    const pixels = new ImageData(1, 2);
    pixels.data[0] = 2;
    pixels.data[1] = 3;
    pixels.data[2] = 4;
    pixels.data[3] = 255;  // Not used.
    pixels.data[4] = 5;
    pixels.data[5] = 6;
    pixels.data[6] = 7;
    pixels.data[7] = 255;  // Not used.
    const res = tf.browser.fromPixels(pixels, 3);
    const resData = await res.data();
    console.log(Array.from(resData));
    // expect(res.shape).toEqual([2, 1, 3]);
    // expect(res.dtype).toBe('int32');
    // expectArraysClose(await res.data(), [2, 3, 4, 5, 6, 7]);
  });

  fit('fromPixels, reshape, then do tf.add()', async () => {
    const pixels = new ImageData(1, 1);
    pixels.data[0] = 2;
    pixels.data[1] = 3;
    pixels.data[2] = 4;
    pixels.data[3] = 255;  // Not used.
    const a = tf.browser.fromPixels(pixels, 3).reshape([1, 1, 1, 3]);
    const res = a.add(tf.scalar(2, 'int32'));
    const resData = await res.data();
    console.log(Array.from(resData));
    // expect(res.shape).toEqual([1, 1, 1, 3]);
    // expect(res.dtype).toBe('int32');
    // expectArraysClose(await res.data(), [4, 5, 6]);
  });

  fit('ImageData 2x2x4', async () => {
    const pixels = new ImageData(2, 2);
    for (let i = 0; i < 8; i++) {
      pixels.data[i] = i * 2;
    }
    for (let i = 8; i < 16; i++) {
      pixels.data[i] = i * 2;
    }

    const array = tf.browser.fromPixels(pixels, 4);
    const data = await array.data();
    console.log(Array.from(data));

    // expectArraysClose(
    //     await array.data(),
    //     new Int32Array(
    //         [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]));
  });
});
