import * as tf from './index';
import { ALL_ENVS, expectArraysClose } from './test_util';
import { describeWithFlags } from './jasmine_util';
describeWithFlags('debug on', ALL_ENVS, function () {
    beforeAll(function () {
        tf.ENV.set('DEBUG', true);
    });
    afterAll(function () {
        tf.ENV.set('DEBUG', false);
    });
    it('debug mode does not error when no nans', function () {
        var a = tf.tensor1d([2, -1, 0, 3]);
        var res = tf.relu(a);
        expectArraysClose(res, [2, 0, 0, 3]);
    });
    it('debug mode errors when there are nans, float32', function () {
        var a = tf.tensor1d([2, NaN]);
        var f = function () { return tf.relu(a); };
        expect(f).toThrowError();
    });
    it('A x B', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([0, 1, -3, 2, 2, 1], [3, 2]);
        var c = tf.matMul(a, b);
        expect(c.shape).toEqual([2, 2]);
        expectArraysClose(c, [0, 8, -3, 20]);
    });
});
describeWithFlags('debug off', ALL_ENVS, function () {
    beforeAll(function () {
        tf.ENV.set('DEBUG', false);
    });
    it('no errors where there are nans, and debug mode is disabled', function () {
        var a = tf.tensor1d([2, NaN]);
        var res = tf.relu(a);
        expectArraysClose(res, [2, NaN]);
    });
});
//# sourceMappingURL=debug_mode_test.js.map