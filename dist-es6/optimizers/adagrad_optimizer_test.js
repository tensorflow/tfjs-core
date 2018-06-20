import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('AdagradOptimizer', ALL_ENVS, function () {
    it('basic', function () {
        var learningRate = .1;
        var initialAccumulatorValue = .1;
        var optimizer = tf.train.adagrad(learningRate, initialAccumulatorValue);
        var x = tf.tensor1d([1, 2]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 2);
        expectArraysClose(x, [0.9012270405, 1.9003110428]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        expectArraysClose(x, [0.8347372764, 1.83015597828], 1e-2);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('serialization round-trip', function () {
        var originalOpt = tf.train.adagrad(0.1, 0.2);
        var reserialized = tf.AdagradOptimizer.fromConfig(tf.AdagradOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=adagrad_optimizer_test.js.map