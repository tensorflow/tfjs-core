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
  beforeEach(async () => {
    await tf.ready;
  });

  async function time(trials: number, reps: number,
                      doRep: () => void, endTrial: () => Promise<void>) {
    const times = [];

    for (let t = 0; t < trials; ++t) {
      const start = performance.now();
      for (let r = 0; r < reps; ++r) {
        doRep();
      }
      await endTrial();
      times.push(performance.now() - start);
    }

    const mean = times.reduce((a, b) => a + b, 0) / trials;
    const min = Math.min(...times);
    const fmt = (n: number) => n.toFixed(3);
    console.log(`Mean time: ${fmt(mean)} ms -> ${fmt(mean / reps)} / rep`);
    console.log(`Min time: ${fmt(min)} ms -> ${fmt(min / reps)} / rep`);
  }

  xit('matMul', async () => {
    let a = tf.randomNormal([500, 500]);
    const b = tf.randomNormal([500, 500]);

    {
      const c = tf.matMul(a, b);
      await c.data();
      c.dispose();
    }

    await time(5, 50, () => {
      const c = tf.matMul(a, b);
      a.dispose();
      a = c;
    }, async () => {
      await a.data();
    });
  }, 60000);
});
