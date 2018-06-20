import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('AdamOptimizer', ALL_ENVS, function () {
    it('basic', function () {
        var learningRate = .1;
        var beta1 = .8;
        var beta2 = .9;
        var optimizer = tf.train.adam(learningRate, beta1, beta2);
        var x = tf.tensor1d([2, 4]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 3);
        expectArraysClose(x, [1.9, 3.9]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        expectArraysClose(x, [1.8000001, 3.8002]);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('serialization round-trip', function () {
        var originalOpt = tf.train.adam(0.1, 0.2, 0.3, 2e-8);
        var reserialized = tf.AdamOptimizer.fromConfig(tf.AdamOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=adam_optimizer_test.js.map