import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('RMSPropOptimizer', ALL_ENVS, function () {
    it('basic', function () {
        var learningRate = 0.1;
        var moment = 0.1;
        var rho = 0.95;
        var optimizer = tf.train.rmsprop(learningRate, rho, moment);
        var x = tf.tensor1d([1, 2]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 3);
        expectArraysClose(x, [0.55279, 1.55279]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        expectArraysClose(x, [0.28745, 1.222943], 1e-2);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('gradient with centered momentum', function () {
        var learningRate = 0.1;
        var moment = 0.1;
        var rho = 0.95;
        var eps = 1e-8;
        var optimizer = tf.train.rmsprop(learningRate, rho, moment, eps, true);
        var x = tf.tensor1d([1, 2]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 4);
        expectArraysClose(x, [0.54117, 1.541169]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        expectArraysClose(x, [0.267785, 1.2035924], 1e-2);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('serialization round-trip', function () {
        var originalOpt = tf.train.rmsprop(0.1, 0.5, 0.1, 1e-7, true);
        var reserialized = tf.RMSPropOptimizer.fromConfig(tf.RMSPropOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=rmsprop_optimizer_test.js.map