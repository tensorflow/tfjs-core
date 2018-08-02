/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

import {BenchmarkLog} from './benchmark_log';
import {ConvGPUBenchmark, RegularConvParams} from './conv_benchmarks';
import * as firebase from './firebase';
import {MatmulGPUBenchmark} from './matmul_benchmarks';

const BENCHMARK_RUNS = 100;

function nextTick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve));
}

describe('benchmarks', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
  });

  it('matmul', async done => {
    const logs: BenchmarkLog[] = [];
    const matmulBenchmark = new MatmulGPUBenchmark();

    const sizes = [1, 100, 400, 1000];
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];

      let total = 0;
      for (let j = 0; j < BENCHMARK_RUNS; j++) {
        const result = await matmulBenchmark.run(size);
        total += result / BENCHMARK_RUNS;
        await nextTick();
      }

      const benchmarkLog:
          BenchmarkLog = {params: `N=${size}`, averageTimeMs: total};

      logs.push(benchmarkLog);
    }
    await firebase.logBenchmarkRun('matmul', logs);

    done();
  });

  it('conv2d', async done => {
    const logs: BenchmarkLog[] = [];
    const convBenchmark = new ConvGPUBenchmark();

    const sizes = [10, 100, 227];
    const convParams: RegularConvParams =
        {inDepth: 16, outDepth: 32, filterSize: 5, stride: 1, pad: 'same'};
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];

      let total = 0;
      for (let j = 0; j < BENCHMARK_RUNS; j++) {
        const result = await convBenchmark.run(size, 'regular', convParams);
        total += result / BENCHMARK_RUNS;
        await nextTick();
      }

      const benchmarkLog: BenchmarkLog = {
        params: `N=${size},${JSON.stringify(convParams)}`,
        averageTimeMs: total
      };

      logs.push(benchmarkLog);
    }
    await firebase.logBenchmarkRun('conv2d', logs);

    done();
  });
});
