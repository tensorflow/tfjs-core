/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {InputProvider} from '../../data/input_provider';
import {ENV} from '../../environment';
import {Graph} from '../../graph/graph';
import {Session} from '../../graph/session';
import * as dl from '../../index';
import {Tensor1D} from '../../math/tensor';
import * as test_util from '../../test_util';
import {MathTests} from '../../test_util';
import {RMSPropOptimizer} from './rmsprop_optimizer';

const tests: MathTests = it => {
  it('basic', math => {
    const learningRate = .1;
    const rho = .95;
    const optimizer = dl.train.rmsprop(learningRate, rho);

    const x = dl.variable(dl.tensor1d([1, 2]));

    const f = () => x.square().sum() as dl.Scalar;

    let numTensors = dl.memory().numTensors;

    let cost = optimizer.minimize(f, /* returnCost */ true);

    // Cost & 2 accumulators should be the only additional arrays.
    expect(dl.memory().numTensors).toBe(numTensors + 3);

    test_util.expectArraysClose(x, [0.8, 1.6]);

    cost.dispose();
    numTensors = dl.memory().numTensors;

    cost = optimizer.minimize(f, /* returnCost */ false);
    test_util.expectArraysClose(x, [0.64, 1.28]);

    // There should be no new additional Tensors.
    expect(dl.memory().numTensors).toBe(numTensors);

    expect(cost).toBe(null);

    x.dispose();
    optimizer.dispose();
    expect(dl.memory().numTensors).toBe(0);
  });

  it('graph', () => {
    const math = ENV.math;

    const inputProvider: InputProvider = {
      getNextCopy() {
        return Tensor1D.new([2, 4]);
      },
      disposeCopy(math) {}
    };

    dl.tidy(() => {
      const g = new Graph();
      const x = g.placeholder('x', [2]);
      const w = g.variable('w', dl.zeros([1, 2]));
      const b = g.variable('b', dl.zeros([1]));
      const y = g.reduceSum(g.add(g.matmul(w, x), b));
      const session = new Session(g, math);
      const optimizer = new RMSPropOptimizer(0.1, 0.8);
      session.train(y, [{tensor: x, data: inputProvider}], 1, optimizer);
      const dydw = session.activationArrayMap.get(w).dataSync();
      test_util.expectArraysClose(dydw, new Float32Array([-0.2, -0.4]), 1e-2);
      session.train(y, [{tensor: x, data: inputProvider}], 1, optimizer);
      const dydw2 = session.activationArrayMap.get(w).dataSync();
      test_util.expectArraysClose(dydw2, new Float32Array([-.4, -.8]), 1e-2);
    });
  });
};

test_util.describeMathCPU('RMSPropOptimizer', [tests]);
test_util.describeMathGPU('RMSPropOptimizer', [tests], [
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
  {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
]);
