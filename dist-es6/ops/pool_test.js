import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('maxPool', ALL_ENVS, function () {
    it('x=[1,1,1] f=[1,1] s=1 [0] => [0]', function () {
        var x = tf.tensor3d([0], [1, 1, 1]);
        var result = tf.maxPool(x, 1, 1, 0);
        expectArraysClose(result, [0]);
    });
    it('x=[3,3,1] f=[2,2] s=1', function () {
        var x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 9, 8], [3, 3, 1]);
        var result = tf.maxPool(x, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [5, 6, 9, 9]);
    });
    it('x=[2,3,3,1] f=[2,2] s=1', function () {
        var x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 9, 8, 1, 2, 3, 4, 5, 6, 7, 8, 9], [2, 3, 3, 1]);
        var result = tf.maxPool(x, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 2, 1]);
        expectArraysClose(result, [5, 6, 9, 9, 5, 6, 8, 9]);
    });
    it('[x=[3,3,1] f=[2,2] s=1 ignores NaNs', function () {
        var x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, NaN, 9], [3, 3, 1]);
        var result = tf.maxPool(x, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [5, 6, 7, 9]);
    });
    it('x=[3,3,2] f=[2,2] s=1', function () {
        var x = tf.tensor3d([1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11], [3, 3, 2]);
        var result = tf.maxPool(x, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 2]);
        expectArraysClose(result, [5, 99, 6, 88, 9, 66, 9, 55]);
    });
    it('x=[4,4,1] f=[2,2] s=2', function () {
        var x = tf.tensor3d([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [4, 4, 1]);
        var result = tf.maxPool(x, 2, 2, 0);
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [5, 7, 13, 15]);
    });
    it('x=[2,2,1] f=[2,2] s=1 p=same', function () {
        var x = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var fSize = 2;
        var strides = 1;
        var result = tf.maxPool(x, fSize, strides, 'same');
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [4, 4, 4, 4]);
    });
    it('throws when x is not rank 3', function () {
        var x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 3]);
        expect(function () { return tf.maxPool(x, 2, 1, 0); }).toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is not a number', function () {
        var x = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var pad = 'valid';
        var dimRoundingMode = 'round';
        expect(function () { return tf.maxPool(x, 2, 1, pad, dimRoundingMode); }).toThrowError();
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.maxPool({}, 2, 1, 'valid'); })
            .toThrowError(/Argument 'x' passed to 'maxPool' must be a Tensor/);
    });
});
describeWithFlags('maxPoolBackprop', ALL_ENVS, function () {
    it('gradients x=[3,3,1] f=[2,2] s=1 no dup max value, test #1', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 3, 1]);
        var expected = [0, 0, 0, 0, 1, 2, 0, 3, 4];
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradients x=[3,3,1] f=[2,2] s=1 no dup max value, test #2', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([9, 5, 6, 6, 8, 4, 9, 5, 10], [3, 3, 1]);
        var expected = [1, 0, 0, 0, 2, 0, 3, 0, 4];
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradients x=[2,3,3,1] f=[2,2] s=1 no duplicate max value', function () {
        var dy = tf.tensor4d([1, 2, 3, 4, 1, 2, 3, 4], [2, 2, 2, 1]);
        var x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 5, 6, 6, 8, 4, 9, 5, 10], [2, 3, 3, 1]);
        var expected = [0, 0, 0, 0, 1, 2, 0, 3, 4, 1, 0, 0, 0, 2, 0, 3, 0, 4];
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[3,3,1] f=[2,2] s=1 dup max value, test 1', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([0, 0, 0, 0, 5, 0, 0, 0, 0], [3, 3, 1]);
        var expected = [0, 0, 0, 0, 10, 0, 0, 0, 0];
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[3,3,1] f=[2,2] s=1 dup max value, test 2', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([1, 3, 2, 1, 2, 1, 1, 1, 5], [3, 3, 1]);
        var expected = [0, 3, 0, 0, 3, 0, 0, 0, 4];
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[2,3,3,1] f=[2,2] s=1 dup max value in 2nd input', function () {
        var dy = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2, 1]);
        var x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 9, 8], [2, 3, 3, 1]);
        var expected = new Float32Array([0, 0, 0, 0, 1, 2, 0, 3, 4, 0, 0, 0, 0, 5, 6, 0, 15, 0]);
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[4,4,1] f=[2,2] s=2 test #1', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [4, 4, 1]);
        var expected = [0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 3, 0, 4];
        var dx = tf.grad(function (x) { return x.maxPool(2, 2, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[4,4,1] f=[2,2] s=2 test #2', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1], [4, 4, 1]);
        var expected = [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 0];
        var dx = tf.grad(function (x) { return x.maxPool(2, 2, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[5,5,1] f=[3,3] s=2 no duplicate max value', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
        ], [5, 5, 1]);
        var expected = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 4
        ];
        var dx = tf.grad(function (x) { return x.maxPool(3, 2, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[5,5,1] f=[3,3] s=2 duplicate max value', function () {
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x = tf.tensor3d([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 24,
            13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 12
        ], [5, 5, 1]);
        var expected = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        var dx = tf.grad(function (x) { return x.maxPool(3, 2, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[3,3,2] f=[2,2] s=1, no duplicate max value', function () {
        var dy = tf.tensor3d([1, 44, 2, 33, 3, 22, 4, 11], [2, 2, 2]);
        var x = tf.tensor3d([1, 99, 2, 55, 3, 66, 4, 66, 5, 88, 6, 44, 7, 99, 8, 55, 9, 100], [3, 3, 2]);
        var expected = [0, 44, 0, 0, 0, 0, 0, 0, 1, 33, 2, 0, 0, 22, 3, 0, 4, 11];
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[3,3,2] f=[2,2] s=1 duplicate max value', function () {
        var dy = tf.tensor3d([1, 44, 2, 33, 3, 22, 4, 11], [2, 2, 2]);
        var x = tf.tensor3d([0, 1, 0, 3, 0, 2, 0, 1, 5, 2, 0, 1, 0, 1, 0, 1, 0, 5], [3, 3, 2]);
        var expected = new Float32Array([0, 0, 0, 77, 0, 0, 0, 0, 10, 22, 0, 0, 0, 0, 0, 0, 0, 11]);
        var dx = tf.grad(function (x) { return x.maxPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=[4,4,2] f=[2,2] s=1', function () {
        var dy = tf.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
        var x = tf.tensor3d([
            0, 1, 1, 2, 2, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1,
            8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 2, 14, 2, 15, 1
        ], [4, 4, 2]);
        var expected = [
            0, 0, 0, 11, 0, 22, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 33, 0, 44, 4, 0
        ];
        var dx = tf.grad(function (x) { return x.maxPool(2, 2, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
    it('gradient x=5x5x2, f=3, s=2 no duplicate max value', function () {
        var dy = tf.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
        var x = tf.tensor3d([
            0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8,
            8, 9, 9, 10, 10, 11, 11, 12, 24, 13, 13, 14, 14, 15, 15, 16, 16,
            17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 12
        ], [5, 5, 2]);
        var expected = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 110, 0, 0, 2, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 4, 0
        ];
        var dx = tf.grad(function (x) { return x.maxPool(3, 2, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, expected);
    });
});
describeWithFlags('avgPool', ALL_ENVS, function () {
    it('x=[1,1,1] f=[1,1] s=1 [0] => [0]', function () {
        var a = tf.tensor3d([0], [1, 1, 1]);
        var result = tf.avgPool(a, 1, 1, 0);
        expectArraysClose(result, [0]);
    });
    it('x=[3,3,1] f=[2,2] s=1', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 9, 8], [3, 3, 1]);
        var result = tf.avgPool(a, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 1]);
        expect(result.dtype).toBe('float32');
        expectArraysClose(result, [3, 4, 6.25, 7]);
    });
    it('input int32 throws error', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 9, 8], [3, 3, 1], 'int32');
        expect(function () { return tf.avgPool(a, 2, 1, 0); }).toThrowError();
    });
    it('x=[2,3,3,1] f=[2,2], s=1', function () {
        var a = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 9, 8, 1, 2, 3, 4, 5, 6, 7, 8, 9], [2, 3, 3, 1]);
        var result = tf.avgPool(a, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 2, 1]);
        expectArraysClose(result, [3, 4, 6.25, 7, 3, 4, 6, 7]);
    });
    it('x=[3,3,1] f=[2,2] s=1 propagates NaNs', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, NaN, 8], [3, 3, 1]);
        var result = tf.avgPool(a, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [3, 4, NaN, NaN]);
    });
    it('x=[3,3,2] f=[2,2] s=1', function () {
        var a = tf.tensor3d([1, 99, 2, 88, 3, 77, 4, 66, 5, 55, 6, 44, 7, 33, 9, 22, 8, 11], [3, 3, 2]);
        var result = tf.avgPool(a, 2, 1, 0);
        expect(result.shape).toEqual([2, 2, 2]);
        expectArraysClose(result, [3, 77, 4, 66, 6.25, 44, 7, 33]);
    });
    it('x=[4,4,1] f=[2,2] s=2', function () {
        var a = tf.tensor3d([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [4, 4, 1]);
        var result = tf.avgPool(a, 2, 2, 0);
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [2.5, 4.5, 10.5, 12.5]);
    });
    it('x=[2,2,1] f=[2,2] s=1 p=same', function () {
        var a = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var fSize = 2;
        var strides = 1;
        var result = tf.avgPool(a, fSize, strides, 'same');
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [2.5, 3, 3.5, 4]);
    });
    it('gradient x=[1,1,1] f=[1,1] s=1 [0] => [0]', function () {
        var x = tf.tensor3d([0], [1, 1, 1]);
        var dy = tf.tensor3d([0], [1, 1, 1]);
        var dx = tf.grad(function (x) { return x.avgPool(1, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [0]);
    });
    it('gradient x=[3,3,1] f=[2,2] s=1', function () {
        var x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 9, 8], [3, 3, 1]);
        var dy = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var avgMultiplier = 1 / (2 * 2);
        var dx = tf.grad(function (x) { return x.avgPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [
            1 * avgMultiplier, 3 * avgMultiplier, 2 * avgMultiplier,
            4 * avgMultiplier, 10 * avgMultiplier, 6 * avgMultiplier,
            3 * avgMultiplier, 7 * avgMultiplier, 4 * avgMultiplier
        ]);
    });
    it('gradient x=[2,3,3,1] f=[2,2], s=1', function () {
        var x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 9, 8, 1, 2, 3, 4, 5, 6, 7, 8, 9], [2, 3, 3, 1]);
        var dy = tf.tensor4d([1, 2, 3, 4, 1, 2, 3, 4], [2, 2, 2, 1]);
        var avgMultiplier = 1 / (2 * 2);
        var dx = tf.grad(function (x) { return x.avgPool(2, 1, 0); })(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [
            1 * avgMultiplier, 3 * avgMultiplier, 2 * avgMultiplier,
            4 * avgMultiplier, 10 * avgMultiplier, 6 * avgMultiplier,
            3 * avgMultiplier, 7 * avgMultiplier, 4 * avgMultiplier,
            1 * avgMultiplier, 3 * avgMultiplier, 2 * avgMultiplier,
            4 * avgMultiplier, 10 * avgMultiplier, 6 * avgMultiplier,
            3 * avgMultiplier, 7 * avgMultiplier, 4 * avgMultiplier
        ]);
    });
    it('throws when dimRoundingMode is set and pad is not a number', function () {
        var x = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var pad = 'valid';
        var dimRoundingMode = 'round';
        expect(function () { return tf.avgPool(x, 2, 1, pad, dimRoundingMode); }).toThrowError();
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.avgPool({}, 2, 1, 'valid'); })
            .toThrowError(/Argument 'x' passed to 'avgPool' must be a Tensor/);
    });
});
//# sourceMappingURL=pool_test.js.map