import * as tf from '../index';
import { ALL_ENVS, CPU_ENVS, expectArraysClose, expectNumbersClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('slice1d', ALL_ENVS, function () {
    it('slices 1x1 into 1x1 (effectively a copy)', function () {
        var a = tf.tensor1d([5]);
        var result = tf.slice1d(a, 0, 1);
        expect(result.shape).toEqual([1]);
        expectNumbersClose(result.get(0), 5);
    });
    it('slices 5x1 into shape 2x1 starting at 3', function () {
        var a = tf.tensor1d([1, 2, 3, 4, 5]);
        var result = tf.slice1d(a, 3, 2);
        expect(result.shape).toEqual([2]);
        expectArraysClose(result, [4, 5]);
    });
    it('slices 5x1 into shape 3x1 starting at 1', function () {
        var a = tf.tensor1d([1, 2, 3, 4, 5]);
        var result = tf.slice1d(a, 1, 3);
        expect(result.shape).toEqual([3]);
        expectArraysClose(result, [2, 3, 4]);
    });
    it('grad', function () {
        var a = tf.tensor1d([1, 2, 3, 4, 5]);
        var dy = tf.tensor1d([10, 100]);
        var da = tf.grad(function (x) { return tf.slice1d(a, 1, 2); })(a, dy);
        expect(da.shape).toEqual([5]);
        expectArraysClose(da, [0, 10, 100, 0, 0]);
    });
});
describeWithFlags('slice2d', ALL_ENVS, function () {
    it('slicing a 1x1 from a 1x1 returns a 1x1', function () {
        var a = tf.tensor2d([0], [1, 1]);
        var b = tf.slice2d(a, [0, 0], [1, 1]);
        expect(b.shape).toEqual([1, 1]);
    });
    it('returns a tensor of slice size', function () {
        var a = tf.zeros([100, 100]);
        var b = tf.slice2d(a, [0, 0], [12, 34]);
        expect(b.shape).toEqual([12, 34]);
    });
    it('returns the upper-left submatrix when begin is [0, 0]', function () {
        var a = tf.randomUniform([10, 10], -1, 1);
        var b = tf.slice2d(a, [0, 0], [2, 2]);
        var aValues = a.dataSync();
        expectArraysClose(b, [aValues[0], aValues[1], aValues[10], aValues[11]]);
    });
    it('returns the rectangle specified', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [4, 3]);
        var b = tf.slice2d(a, [1, 1], [3, 2]);
        expectArraysClose(b, [5, 6, 8, 9, 11, 12]);
    });
    it('throws when requesting out of bounds slice', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [4, 3]);
        expect(function () { return tf.slice2d(a, [1, 1], [10, 10]); }).toThrowError();
    });
    it('grad', function () {
        var a = tf.tensor2d([[1, 2, 3], [4, 5, 6]]);
        var dy = tf.tensor2d([[20], [50]]);
        var da = tf.grad(function (x) { return tf.slice2d(a, [0, 1], [2, 1]); })(a, dy);
        expect(da.shape).toEqual([2, 3]);
        expectArraysClose(da, [0, 20, 0, 0, 50, 0]);
    });
});
describeWithFlags('slice3d', ALL_ENVS, function () {
    it('slices 1x1x1 into shape 1x1x1 (effectively a copy)', function () {
        var a = tf.tensor3d([[[5]]], [1, 1, 1]);
        var result = a.slice([0, 0, 0], [1, 1, 1]);
        expect(result.shape).toEqual([1, 1, 1]);
        expectArraysClose(result, [5]);
    });
    it('slices 2x2x2 array into 1x2x2 starting at [1, 0, 0]', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice([1, 0, 0], [1, 2, 2]);
        expect(result.shape).toEqual([1, 2, 2]);
        expectArraysClose(result, [5, 6, 7, 8]);
    });
    it('slices 2x2x2 array into 2x1x1 starting at [0, 1, 1]', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice([0, 1, 1], [2, 1, 1]);
        expect(result.shape).toEqual([2, 1, 1]);
        expectArraysClose(result, [4, 8]);
    });
});
describeWithFlags('slice4d', ALL_ENVS, function () {
    it('slices 1x1x1x1 into shape 1x1x1x1 (effectively a copy)', function () {
        var a = tf.tensor4d([[[[5]]]], [1, 1, 1, 1]);
        var result = a.slice([0, 0, 0, 0], [1, 1, 1, 1]);
        expect(result.shape).toEqual([1, 1, 1, 1]);
        expectArraysClose(result, [5]);
    });
    it('slices 2x2x2x2 array into 1x2x2x2 starting at [1, 0, 0, 0]', function () {
        var a = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 11, 22, 33, 44, 55, 66, 77, 88], [2, 2, 2, 2]);
        var result = a.slice([1, 0, 0, 0], [1, 2, 2, 2]);
        expect(result.shape).toEqual([1, 2, 2, 2]);
        expectArraysClose(result, [11, 22, 33, 44, 55, 66, 77, 88]);
    });
    it('slices 2x2x2x2 array into 2x1x1x1 starting at [0, 1, 1, 1]', function () {
        var a = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 11, 22, 33, 44, 55, 66, 77, 88], [2, 2, 2, 2]);
        var result = a.slice([0, 1, 1, 1], [2, 1, 1, 1]);
        expect(result.shape).toEqual([2, 1, 1, 1]);
        expectArraysClose(result, [8, 88]);
    });
});
describeWithFlags('slice ergonomics', CPU_ENVS, function () {
    it('slices 2x2x2 array into 2x1x1 no size', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice([0, 1, 1]);
        expect(result.shape).toEqual([2, 1, 1]);
        expectArraysClose(result, [4, 8]);
    });
    it('slices 2x2x2 array into 1x2x2 with scalar begin no size', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice(1);
        expect(result.shape).toEqual([1, 2, 2]);
        expectArraysClose(result, [5, 6, 7, 8]);
    });
    it('slices 2x2x2 array using 2d size and 2d size', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice([0, 1]);
        expect(result.shape).toEqual([2, 1, 2]);
        expectArraysClose(result, [3, 4, 7, 8]);
    });
    it('slices 2x2x2 array using negative size', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice([0, 1], [-1, 1]);
        expect(result.shape).toEqual([2, 1, 2]);
        expectArraysClose(result, [3, 4, 7, 8]);
    });
    it('slices 2x2x2 array using 1d size', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        var result = a.slice(0, 1);
        expect(result.shape).toEqual([1, 2, 2]);
        expectArraysClose(result, [1, 2, 3, 4]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.slice({}, 0, 0); })
            .toThrowError(/Argument 'x' passed to 'slice' must be a Tensor/);
    });
});
//# sourceMappingURL=slice_test.js.map