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

import {ConvGPUBenchmark, RegularConvParams} from './conv_benchmarks';
import {MatmulGPUBenchmark} from './matmul_benchmarks';
import {MobileNetV1GPUBenchmark} from './mobilenet_benchmarks';
import {BatchNormalization3DGPUBenchmark} from './batchnormalization3d_benchmark';
import {PoolGPUBenchmark} from './pool_benchmarks';
import {ReductionOpsGPUBenchmark} from './reduction_ops_benchmark';
import {UnaryOpsGPUBenchmark} from './unary_ops_benchmark';
import * as test_util from './test_util';

const BENCHMARK_RUNS = 100;

describe('benchmarks', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
  });

  it('[default] matmul', async done => {
    const sizes = [1, 100, 400, 1000];

    const benchmark = new MatmulGPUBenchmark();

    await test_util.benchmarkAndLog(
        'matmul', size => benchmark.run(size), sizes, size => `N=${size}`,
        BENCHMARK_RUNS);

    done();
  });

  it('[default] conv2d', async done => {
    const sizes = [10, 100, 227];
    const convParams: RegularConvParams =
        {inDepth: 16, outDepth: 32, filterSize: 5, stride: 1, pad: 'same'};
    const benchmark = new ConvGPUBenchmark();

    await test_util.benchmarkAndLog(
        'conv2d', size => benchmark.run(size, 'regular', convParams), sizes,
        size => `N=${size} ${JSON.stringify(convParams)}`, BENCHMARK_RUNS);

    done();
  });

  it('[default] mobilenet_v1', async done => {
    const sizes = [1];  // MobileNet version

    const benchmark = new MobileNetV1GPUBenchmark();

    await test_util.benchmarkAndLog(
        'mobilenet_v1', size => benchmark.run(size), sizes,
        size => `N=${size}_0_224`, BENCHMARK_RUNS);

    done();
  });

  it('batchnomalization', async done => {
    const sizes = [1, 100, 400, 1000];
    const benchmark = new BatchNormalization3DGPUBenchmark();

    await test_util.benchmarkAndLog(
      'batchnormalization3d', size => benchmark.run(size), sizes,
      size => `N=${size}`, BENCHMARK_RUNS);

    done();
  });

  const poolOps = ['max', 'avg'];
  poolOps.forEach(ops => {
    it(`pool(${ops})`, async done => {
      const sizes = [1, 100, 400, 1000];
      const benchmark = new PoolGPUBenchmark();

      const params = {
        depth: 1,
        fieldSize: 5,
        stride: 1
      };

      await test_util.benchmarkAndLog(
        `pool(${ops})`, size => benchmark.run(size, ops, params), sizes,
        size => `N=${size}`, BENCHMARK_RUNS);

      done();
    });
  });

  const reductionOps = ['max', 'min', 'argMax', 'argMin', 'sum', 'logSumExp'];
  reductionOps.forEach(ops => {
    it(`reduction(${ops})`, async done => {
      const sizes = [1, 100, 400, 1000];
      const benchmark = new ReductionOpsGPUBenchmark();

      await test_util.benchmarkAndLog(
        `reduction(${ops})`, size => benchmark.run(size, ops), sizes,
        size => `N=${size}`, BENCHMARK_RUNS);

      done();
    });
  });

  const unaryOps = [
    'abs',        'acos',  'acosh',   'asin',       'asinh', 'atan',
    'atanh',      'ceil',  'cos',     'cosh',       'elu',   'erf',
    'exp',        'expm1', 'floor',   'leakyRelu',  'log',   'log1p',
    'logSigmoid', 'neg',   'prelu',   'reciprocal', 'relu',  'round',
    'rsqrt',      'selu',  'sigmoid', 'sign',       'sin',   'sinh',
    'softplus',   'sqrt',  'square',  'step',       'tan',   'tanh'
  ];
  unaryOps.forEach(ops => {
    it(`unary(${ops})`, async done => {
      const sizes = [1, 100, 400, 1000];
      const benchmark = new UnaryOpsGPUBenchmark();

      await test_util.benchmarkAndLog(
        `unary(${ops})`, size => benchmark.run(size, ops), sizes,
        size => `N=${size}`, BENCHMARK_RUNS);

      done();
    });
  });
});
