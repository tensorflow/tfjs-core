import { Environment } from '../environment';
import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('pad1d', ALL_ENVS, function () {
    it('Should pad 1D arrays', function () {
        var a = tf.tensor1d([1, 2, 3, 4, 5, 6], 'int32');
        var b = tf.pad1d(a, [2, 3]);
        expectArraysClose(b, [0, 0, 1, 2, 3, 4, 5, 6, 0, 0, 0]);
    });
    it('Should not pad 1D arrays with 0s', function () {
        var a = tf.tensor1d([1, 2, 3, 4], 'int32');
        var b = tf.pad1d(a, [0, 0]);
        expectArraysClose(b, [1, 2, 3, 4]);
    });
    it('Should handle padding with custom value', function () {
        var a = tf.tensor1d([1, 2, 3, 4], 'int32');
        var b = tf.pad1d(a, [2, 3], 9);
        expectArraysClose(b, [9, 9, 1, 2, 3, 4, 9, 9, 9]);
        a = tf.tensor1d([1, 2, 3, 4]);
        b = tf.pad1d(a, [2, 1], 1.1);
        expectArraysClose(b, [1.1, 1.1, 1, 2, 3, 4, 1.1]);
        a = tf.tensor1d([1, 2, 3, 4]);
        b = tf.pad1d(a, [2, 1], 1);
        expectArraysClose(b, [1, 1, 1, 2, 3, 4, 1]);
    });
    it('Should handle NaNs with 1D arrays', function () {
        var a = tf.tensor1d([1, NaN, 2, NaN]);
        var b = tf.pad1d(a, [1, 1]);
        expectArraysClose(b, [0, 1, NaN, 2, NaN, 0]);
    });
    it('Should handle invalid paddings', function () {
        var a = tf.tensor1d([1, 2, 3, 4], 'int32');
        var f = function () {
            tf.pad1d(a, [2, 2, 2]);
        };
        expect(f).toThrowError();
    });
    it('grad', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var dy = tf.tensor1d([10, 20, 30, 40, 50, 60]);
        var da = tf.grad(function (a) { return tf.pad1d(a, [2, 1]); })(a, dy);
        expect(da.shape).toEqual([3]);
        expectArraysClose(da, [30, 40, 50]);
    });
});
describeWithFlags('pad2d', ALL_ENVS, function () {
    it('Should pad 2D arrays', function () {
        var a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
        var b = tf.pad2d(a, [[1, 1], [1, 1]]);
        expectArraysClose(b, [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0]);
        a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
        b = tf.pad2d(a, [[2, 2], [1, 1]]);
        expectArraysClose(b, [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0,
            0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]);
    });
    it('Should not pad 2D arrays with 0s', function () {
        var a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
        var b = tf.pad2d(a, [[0, 0], [0, 0]]);
        expectArraysClose(b, [1, 2, 3, 4, 5, 6]);
    });
    it('Should handle padding with custom value', function () {
        var a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
        var b = tf.pad2d(a, [[1, 1], [1, 1]], 10);
        expectArraysClose(b, [
            10, 10, 10, 10, 10, 10, 1, 2, 3, 10,
            10, 4, 5, 6, 10, 10, 10, 10, 10, 10
        ]);
        a = tf.tensor2d([[1], [1]], [2, 1]);
        b = tf.pad2d(a, [[1, 1], [1, 1]], -2.1);
        expectArraysClose(b, [-2.1, -2.1, -2.1, -2.1, 1, -2.1, -2.1, 1, -2.1, -2.1, -2.1, -2.1]);
        a = tf.tensor2d([[1], [1]], [2, 1]);
        b = tf.pad2d(a, [[1, 1], [1, 1]], -2);
        expectArraysClose(b, [-2, -2, -2, -2, 1, -2, -2, 1, -2, -2, -2, -2]);
    });
    it('Should handle NaNs with 2D arrays', function () {
        var a = tf.tensor2d([[1, NaN], [1, NaN]], [2, 2]);
        var b = tf.pad2d(a, [[1, 1], [1, 1]]);
        expectArraysClose(b, [0, 0, 0, 0, 0, 1, NaN, 0, 0, 1, NaN, 0, 0, 0, 0, 0]);
    });
    it('Should handle invalid paddings', function () {
        var a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
        var f = function () {
            tf.pad2d(a, [[2, 2, 2], [1, 1, 1]]);
        };
        expect(f).toThrowError();
    });
    it('grad', function () {
        var a = tf.tensor2d([[1, 2], [3, 4]]);
        var dy = tf.tensor2d([[0, 0, 0], [10, 20, 0], [30, 40, 0]], [3, 3]);
        var da = tf.grad(function (a) { return tf.pad2d(a, [[1, 0], [0, 1]]); })(a, dy);
        expect(da.shape).toEqual([2, 2]);
        expectArraysClose(da, [10, 20, 30, 40]);
    });
});
describeWithFlags('pad4d', ALL_ENVS, function () {
    it('Should pad 4D arrays', function () {
        var a = tf.tensor4d([[[[9]]]], [1, 1, 1, 1], 'int32');
        var b = tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
        var expected = tf.tensor4d([[[[0], [0], [0]], [[0], [9], [0]], [[0], [0], [0]]]], [1, 3, 3, 1], 'int32');
        expectArraysClose(b, expected);
    });
    it('does not leak memory', function () {
        var a = tf.tensor4d([[[[9]]]], [1, 1, 1, 1], 'int32');
        tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
        var numTensors = Environment.memory().numTensors;
        tf.pad4d(a, [[0, 0], [1, 1], [1, 1], [0, 0]]);
        expect(Environment.memory().numTensors).toEqual(numTensors + 1);
    });
});
describeWithFlags('pad', ALL_ENVS, function () {
    it('Pad tensor2d', function () {
        var a = tf.tensor2d([[1], [2]], [2, 1], 'int32');
        var b = tf.pad(a, [[1, 1], [1, 1]]);
        expectArraysClose(b, [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0]);
        a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
        b = tf.pad(a, [[2, 2], [1, 1]]);
        expectArraysClose(b, [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0,
            0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.pad({}, [[0, 0]]); })
            .toThrowError(/Argument 'x' passed to 'pad' must be a Tensor/);
    });
});
//# sourceMappingURL=pad_test.js.map