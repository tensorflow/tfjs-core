import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('MomentumOptimizer', ALL_ENVS, function () {
    it('basic', function () {
        var learningRate = .1;
        var momentum = .5;
        var optimizer = tf.train.momentum(learningRate, momentum);
        var x = tf.tensor1d([1, 2]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 2);
        expectArraysClose(x, [.8, 1.6]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        expectArraysClose(x, [0.54, 1.08]);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('basic - with Nesterov', function () {
        var learningRate = .1;
        var momentum = .5;
        var useNesterov = true;
        var optimizer = tf.train.momentum(learningRate, momentum, useNesterov);
        var x = tf.tensor1d([1, 2]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 2);
        expectArraysClose(x, [.7, 1.4]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        expectArraysClose(x, [0.44, 0.88]);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('serialization round-trip', function () {
        var originalOpt = tf.train.momentum(0.1, 0.2, true);
        var reserialized = tf.MomentumOptimizer.fromConfig(tf.MomentumOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=momentum_optimizer_test.js.map