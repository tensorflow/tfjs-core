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

import * as tf from './index';

describe('Ops benchmarks', () => {
  let device: GPUDevice;
  let queue: GPUQueue;
  let fence: GPUFence;
  let fenceValue: number;

  beforeEach(async () => {
    device = await tf.ready;
    queue = device.getQueue();
    fence = queue.createFence({});
    fenceValue = 0;
  });

  afterEach(() => {
  });

  function waitFence() {
    fenceValue++;
    queue.signal(fence, fenceValue);
    return fence.onCompletion(fenceValue);
  }

  async function time(trials: number, fn: () => Promise<void>) {
    const times = [];

    for (let i = 0; i < trials; ++i) {
      const start = performance.now();
      await fn();
      times.push(performance.now() - start);
    }

    console.log(
        `Average time ms: ${times.reduce((a, b) => a + b, 0) / times.length}`);
    console.log(`Min time ms: ${Math.min(...times)}`);
  }

  xit('matMul', async () => {
    let a = tf.randomNormal([500, 500]);
    const b = tf.randomNormal([500, 500]);

    for (let i = 0; i < 5; i++) {
      const c = tf.matMul(a, b);
      a.dispose();
      a = c;
    }
    await waitFence();

    await time(100, async () => {
      const c = tf.matMul(a, b);
      a.dispose();
      a = c;
      await waitFence();
    });
  }, 60000);
});