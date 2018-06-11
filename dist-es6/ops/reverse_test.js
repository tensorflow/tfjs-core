import * as tf from '../index';
import { ALL_ENVS, CPU_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('reverse1d', ALL_ENVS, function () {
    it('reverse a 1D array', function () {
        var input = tf.tensor1d([1, 2, 3, 4, 5]);
        var result = tf.reverse1d(input);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [5, 4, 3, 2, 1]);
    });
    it('grad', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var dy = tf.tensor1d([10, 20, 30]);
        var da = tf.grad(function (a) { return tf.reverse1d(a); })(a, dy);
        expect(da.shape).toEqual([3]);
        expectArraysClose(da, [30, 20, 10]);
    });
});
describeWithFlags('reverse2d', ALL_ENVS, function () {
    it('reverse a 2D array at axis [0]', function () {
        var axis = [0];
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var result = tf.reverse2d(a, axis);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(result, [4, 5, 6, 1, 2, 3]);
    });
    it('reverse a 2D array at axis [1]', function () {
        var axis = [1];
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var result = tf.reverse2d(a, axis);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(result, [3, 2, 1, 6, 5, 4]);
    });
    it('throws error with invalid input', function () {
        var x = tf.tensor1d([1, 20, 300, 4]);
        expect(function () { return tf.reverse2d(x, [0]); }).toThrowError();
    });
    it('throws error with invalid axis param', function () {
        var x = tf.tensor2d([1, 20, 300, 4], [1, 4]);
        expect(function () { return tf.reverse2d(x, [2]); }).toThrowError();
        expect(function () { return tf.reverse2d(x, [-3]); }).toThrowError();
    });
    it('throws error with non integer axis param', function () {
        var x = tf.tensor2d([1, 20, 300, 4], [1, 4]);
        expect(function () { return tf.reverse2d(x, [0.5]); }).toThrowError();
    });
    it('grad', function () {
        var a = tf.tensor2d([[1, 2, 3], [4, 5, 6]]);
        var dy = tf.tensor2d([[10, 20, 30], [40, 50, 60]]);
        var da = tf.grad(function (a) { return tf.reverse2d(a); })(a, dy);
        expect(da.shape).toEqual([2, 3]);
        expectArraysClose(da, [60, 50, 40, 30, 20, 10]);
    });
    it('grad with reverse(axis=0)', function () {
        var a = tf.tensor2d([[1, 2, 3], [4, 5, 6]]);
        var dy = tf.tensor2d([[10, 20, 30], [40, 50, 60]]);
        var da = tf.grad(function (a) { return tf.reverse2d(a, 0); })(a, dy);
        expect(da.shape).toEqual([2, 3]);
        expectArraysClose(da, [40, 50, 60, 10, 20, 30]);
    });
    it('grad with reverse(axis=1)', function () {
        var a = tf.tensor2d([[1, 2, 3], [4, 5, 6]]);
        var dy = tf.tensor2d([[10, 20, 30], [40, 50, 60]]);
        var da = tf.grad(function (a) { return tf.reverse2d(a, 1); })(a, dy);
        expect(da.shape).toEqual([2, 3]);
        expectArraysClose(da, [30, 20, 10, 60, 50, 40]);
    });
});
describeWithFlags('reverse3d', ALL_ENVS, function () {
    var shape = [2, 3, 4];
    var data = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
    ];
    it('reverse a 3D array at axis [0]', function () {
        var input = tf.tensor3d(data, shape);
        var result = tf.reverse3d(input, [0]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
        ]);
    });
    it('reverse a 3D array at axis [1]', function () {
        var input = tf.tensor3d(data, shape);
        var result = tf.reverse3d(input, [1]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3,
            20, 21, 22, 23, 16, 17, 18, 19, 12, 13, 14, 15
        ]);
    });
    it('reverse a 3D array at axis [2]', function () {
        var input = tf.tensor3d(data, shape);
        var result = tf.reverse3d(input, [2]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8,
            15, 14, 13, 12, 19, 18, 17, 16, 23, 22, 21, 20
        ]);
    });
    it('reverse a 3D array at axis [0, 1]', function () {
        var input = tf.tensor3d(data, shape);
        var result = tf.reverse3d(input, [0, 1]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            20, 21, 22, 23, 16, 17, 18, 19, 12, 13, 14, 15,
            8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3
        ]);
    });
    it('reverse a 3D array at axis [0, 2]', function () {
        var input = tf.tensor3d(data, shape);
        var result = tf.reverse3d(input, [0, 2]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            15, 14, 13, 12, 19, 18, 17, 16, 23, 22, 21, 20,
            3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8
        ]);
    });
    it('reverse a 3D array at axis [1, 2]', function () {
        var input = tf.tensor3d(data, shape);
        var result = tf.reverse3d(input, [1, 2]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
            23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12
        ]);
    });
    it('throws error with invalid input', function () {
        var x = tf.tensor2d([1, 20, 300, 4], [1, 4]);
        expect(function () { return tf.reverse3d(x, [1]); }).toThrowError();
    });
    it('throws error with invalid axis param', function () {
        var x = tf.tensor3d([1, 20, 300, 4], [1, 1, 4]);
        expect(function () { return tf.reverse3d(x, [3]); }).toThrowError();
        expect(function () { return tf.reverse3d(x, [-4]); }).toThrowError();
    });
    it('throws error with non integer axis param', function () {
        var x = tf.tensor3d([1, 20, 300, 4], [1, 1, 4]);
        expect(function () { return tf.reverse3d(x, [0.5]); }).toThrowError();
    });
});
describeWithFlags('reverse4d', ALL_ENVS, function () {
    var shape = [3, 2, 3, 4];
    var data = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71
    ];
    it('reverse a 4D array at axis [0]', function () {
        var input = tf.tensor4d(data, shape);
        var result = tf.reverse4d(input, [0]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
            66, 67, 68, 69, 70, 71, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
        ]);
    });
    it('reverse a 4D array at axis [1]', function () {
        var input = tf.tensor4d(data, shape);
        var result = tf.reverse4d(input, [1]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
            24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 60, 61, 62, 63, 64, 65,
            66, 67, 68, 69, 70, 71, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59
        ]);
    });
    it('reverse a 4D array at axis [2]', function () {
        var input = tf.tensor4d(data, shape);
        var result = tf.reverse4d(input, [2]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3, 20, 21, 22, 23, 16, 17,
            18, 19, 12, 13, 14, 15, 32, 33, 34, 35, 28, 29, 30, 31, 24, 25, 26, 27,
            44, 45, 46, 47, 40, 41, 42, 43, 36, 37, 38, 39, 56, 57, 58, 59, 52, 53,
            54, 55, 48, 49, 50, 51, 68, 69, 70, 71, 64, 65, 66, 67, 60, 61, 62, 63
        ]);
    });
    it('reverse a 4D array at axis [3]', function () {
        var input = tf.tensor4d(data, shape);
        var result = tf.reverse4d(input, [3]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8, 15, 14, 13, 12, 19, 18,
            17, 16, 23, 22, 21, 20, 27, 26, 25, 24, 31, 30, 29, 28, 35, 34, 33, 32,
            39, 38, 37, 36, 43, 42, 41, 40, 47, 46, 45, 44, 51, 50, 49, 48, 55, 54,
            53, 52, 59, 58, 57, 56, 63, 62, 61, 60, 67, 66, 65, 64, 71, 70, 69, 68
        ]);
    });
    it('reverse a 4D array at axis [0, 2]', function () {
        var input = tf.tensor4d(data, shape);
        var result = tf.reverse4d(input, [0, 2]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            56, 57, 58, 59, 52, 53, 54, 55, 48, 49, 50, 51, 68, 69, 70, 71, 64, 65,
            66, 67, 60, 61, 62, 63, 32, 33, 34, 35, 28, 29, 30, 31, 24, 25, 26, 27,
            44, 45, 46, 47, 40, 41, 42, 43, 36, 37, 38, 39, 8, 9, 10, 11, 4, 5,
            6, 7, 0, 1, 2, 3, 20, 21, 22, 23, 16, 17, 18, 19, 12, 13, 14, 15
        ]);
    });
    it('reverse a 4D array at axis [1, 3]', function () {
        var input = tf.tensor4d(data, shape);
        var result = tf.reverse4d(input, [1, 3]);
        expect(result.shape).toEqual(input.shape);
        expectArraysClose(result, [
            15, 14, 13, 12, 19, 18, 17, 16, 23, 22, 21, 20, 3, 2, 1, 0, 7, 6,
            5, 4, 11, 10, 9, 8, 39, 38, 37, 36, 43, 42, 41, 40, 47, 46, 45, 44,
            27, 26, 25, 24, 31, 30, 29, 28, 35, 34, 33, 32, 63, 62, 61, 60, 67, 66,
            65, 64, 71, 70, 69, 68, 51, 50, 49, 48, 55, 54, 53, 52, 59, 58, 57, 56
        ]);
    });
    it('throws error with invalid input', function () {
        var x = tf.tensor3d([1, 20, 300, 4], [1, 1, 4]);
        expect(function () { return tf.reverse4d(x, [1]); }).toThrowError();
    });
    it('throws error with invalid axis param', function () {
        var x = tf.tensor4d([1, 20, 300, 4], [1, 1, 1, 4]);
        expect(function () { return tf.reverse4d(x, [4]); }).toThrowError();
        expect(function () { return tf.reverse4d(x, [-5]); }).toThrowError();
    });
    it('throws error with non integer axis param', function () {
        var x = tf.tensor4d([1, 20, 300, 4], [1, 1, 1, 4]);
        expect(function () { return tf.reverse4d(x, [0.5]); }).toThrowError();
    });
});
describeWithFlags('reverse', CPU_ENVS, function () {
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.reverse({}); })
            .toThrowError(/Argument 'x' passed to 'reverse' must be a Tensor/);
    });
});
//# sourceMappingURL=reverse_test.js.map