import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('movingAverage', ALL_ENVS, function () {
    it('zeroDebias=true, decay and step are numbers', function () {
        var v0 = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        var x = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var decay = 0.6;
        var v1 = tf.movingAverage(v0, x, decay, 1);
        expectArraysClose(v1, tf.tensor2d([[1, 2], [3, 4]], [2, 2]));
        var y = tf.tensor2d([[11, 12], [13, 14]], [2, 2]);
        var v2 = tf.movingAverage(v1, y, decay, 2);
        expectArraysClose(v2, tf.tensor2d([[7.25, 8.25], [9.25, 10.25]], [2, 2]));
    });
    it('zeroDebias=true, decay and step are scalars', function () {
        var v0 = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        var x = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var decay = tf.scalar(0.6);
        var v1 = tf.movingAverage(v0, x, decay, tf.scalar(1));
        expectArraysClose(v1, tf.tensor2d([[1, 2], [3, 4]], [2, 2]));
        var y = tf.tensor2d([[11, 12], [13, 14]], [2, 2]);
        var v2 = tf.movingAverage(v1, y, decay, tf.scalar(2));
        expectArraysClose(v2, tf.tensor2d([[7.25, 8.25], [9.25, 10.25]], [2, 2]));
    });
    it('zeroDebias=false, decay and step are numbers', function () {
        var v0 = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        var x = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var decay = 0.6;
        var v1 = tf.movingAverage(v0, x, decay, null, false);
        expectArraysClose(v1, tf.tensor2d([[0.4, 0.8], [1.2, 1.6]], [2, 2]));
        var y = tf.tensor2d([[11, 12], [13, 14]], [2, 2]);
        var v2 = tf.movingAverage(v1, y, decay, null, false);
        expectArraysClose(v2, tf.tensor2d([[4.64, 5.28], [5.92, 6.56]], [2, 2]));
    });
    it('zeroDebias=false, decay is scalar', function () {
        var v0 = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        var x = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var decay = tf.scalar(0.6);
        var v1 = tf.movingAverage(v0, x, decay, null, false);
        expectArraysClose(v1, tf.tensor2d([[0.4, 0.8], [1.2, 1.6]], [2, 2]));
        var y = tf.tensor2d([[11, 12], [13, 14]], [2, 2]);
        var v2 = tf.movingAverage(v1, y, decay, null, false);
        expectArraysClose(v2, tf.tensor2d([[4.64, 5.28], [5.92, 6.56]], [2, 2]));
    });
    it('zeroDebias=true, no step throws error', function () {
        var v0 = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        var x = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var decay = tf.scalar(0.6);
        expect(function () { return tf.movingAverage(v0, x, decay, null); }).toThrowError();
    });
    it('shape mismatch in v and x throws error', function () {
        var v0 = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        var x = tf.tensor2d([[1, 2]], [1, 2]);
        var decay = tf.scalar(0.6);
        expect(function () { return tf.movingAverage(v0, x, decay, null); }).toThrowError();
    });
    it('throws when passed v as a non-tensor', function () {
        var x = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        expect(function () { return tf.movingAverage({}, x, 1); })
            .toThrowError(/Argument 'v' passed to 'movingAverage' must be a Tensor/);
    });
    it('throws when passed v as a non-tensor', function () {
        var v = tf.tensor2d([[0, 0], [0, 0]], [2, 2]);
        expect(function () { return tf.movingAverage(v, {}, 1); })
            .toThrowError(/Argument 'x' passed to 'movingAverage' must be a Tensor/);
    });
});
//# sourceMappingURL=moving_average_test.js.map