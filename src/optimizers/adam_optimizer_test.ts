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

import * as tf from '../index';
import {ALL_ENVS, describeWithFlags} from '../jasmine_util';
import {expectArraysClose} from '../test_util';

describeWithFlags('AdamOptimizer', ALL_ENVS, () => {
  it('basic', () => {
    const learningRate = .1;
    const beta1 = .8;
    const beta2 = .9;
    const optimizer = tf.train.adam(learningRate, beta1, beta2);

    const x = tf.tensor1d([2, 4]).variable();

    const f = () => x.square().sum() as tf.Scalar;

    let numTensors = tf.memory().numTensors;

    let cost = optimizer.minimize(f, /* returnCost */ true);

    // Cost, iterations & 2 accumulators should be the only additional arrays.
    expect(tf.memory().numTensors).toBe(numTensors + 4);
    // new_first_m = [
    //    beta1 * old_first_m_w1 + (1-beta1) * grad_w1,
    //    beta1 * old_first_m_w2 + (1-beta1) * grad_w2
    // ] = [.8, 1.6]
    // new_second_m = [
    //    beta2 * old_second_m_w1 + (1-beta2) * grad_w1**2,
    //    beta2 * old_second_m_w2 + (1-beta2) * grad_w2**2
    // ] = [1.6, 6.4]
    // m = [new_first_m/(1-acc_beta1)] = [4, 8]
    // v = [new_second_m/(1-acc_beta2)] = [16, 64]
    // x = [x - lr * m / sqrt(v)] = [1.9, 3.9]
    //
    expectArraysClose(x, [1.9, 3.9]);

    cost.dispose();
    numTensors = tf.memory().numTensors;

    cost = optimizer.minimize(f, /* returnCost */ false);

    // new_first_m = [
    //    beta1 * old_first_m_w1 + (1-beta1) * grad_w1,
    //    beta1 * old_first_m_w2 + (1-beta1) * grad_w2
    // ] = [1.4, 2.84]
    // new_second_m = [
    //    beta2 * old_second_m_w1 + (1-beta2) * grad_w1**2,
    //    beta2 * old_second_m_w2 + (1-beta2) * grad_w2**2
    // ] = [2.884, 11.884]
    // m = [new_first_m/(1-acc_beta1)] = [3.888888, 7.88889]
    // v = [new_second_m/(1-acc_beta2)] = [15.1789, 62.5473]
    // x = [x - lr * m / sqrt(v)] = [1.8000001, 3.8002]
    //
    expectArraysClose(x, [1.8000001, 3.8002]);
    // There should be no new additional Tensors.
    expect(tf.memory().numTensors).toBe(numTensors);

    expect(cost).toBe(null);

    x.dispose();
    optimizer.dispose();

    // The only tensor remaining should be the argument to variable().
    expect(tf.memory().numTensors).toBe(1);
  });

  it('Continue training after loading weights', () => {
    const learningRate = .1;
    const beta1 = .8;
    const beta2 = .9;
    const optimizer1 = tf.train.adam(learningRate, beta1, beta2);

    const x = tf.tensor1d([2, 4]).variable();
    const f = () => x.square().sum() as tf.Scalar;
    let cost = optimizer1.minimize(f, /* returnCost */ true);
    expectArraysClose(cost, tf.scalar(20));

    const weights = optimizer1.getWeights();
    expect(weights.length).toEqual(3);
    expect(weights[0].name).toEqual('iter');
    expect(weights[1].name).toEqual(`${x.name}/m`);
    expect(weights[2].name).toEqual(`${x.name}/v`);

    const optimizer2 = tf.train.adam(learningRate, beta1, beta2);
    optimizer2.setWeights(weights);

    cost = optimizer2.minimize(f, /* returnCost */ true);
    expectArraysClose(cost, tf.scalar(18.82));
    expectArraysClose(optimizer2.iterations, tf.scalar(2, 'int32'));
  });

  it('serialization round-trip', () => {
    const originalOpt = tf.train.adam(0.1, 0.2, 0.3, 2e-8);
    const reserialized =
        tf.AdamOptimizer.fromConfig(tf.AdamOptimizer, originalOpt.getConfig());
    expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
  });
});
