import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('concat1d', ALL_ENVS, function () {
    it('3 + 5', function () {
        var a = tf.tensor1d([3]);
        var b = tf.tensor1d([5]);
        var result = tf.concat1d([a, b]);
        var expected = [3, 5];
        expectArraysClose(result, expected);
    });
    it('3 + [5,7]', function () {
        var a = tf.tensor1d([3]);
        var b = tf.tensor1d([5, 7]);
        var result = tf.concat1d([a, b]);
        var expected = [3, 5, 7];
        expectArraysClose(result, expected);
    });
    it('[3,5] + 7', function () {
        var a = tf.tensor1d([3, 5]);
        var b = tf.tensor1d([7]);
        var result = tf.concat1d([a, b]);
        var expected = [3, 5, 7];
        expectArraysClose(result, expected);
    });
    it('3 + 5 + 7 + 9', function () {
        var a = tf.tensor1d([3]);
        var b = tf.tensor1d([5]);
        var c = tf.tensor1d([7]);
        var d = tf.tensor1d([9]);
        var result = tf.concat1d([a, b, c, d]);
        expectArraysClose(result, [3, 5, 7, 9]);
    });
    it('single tensor', function () {
        var a = tf.tensor1d([3]);
        var result = tf.concat1d([a]);
        expectArraysClose(result, [3]);
    });
});
describeWithFlags('concat2d', ALL_ENVS, function () {
    it('[[3]] + [[5]], axis=0', function () {
        var axis = 0;
        var a = tf.tensor2d([3], [1, 1]);
        var b = tf.tensor2d([5], [1, 1]);
        var result = tf.concat2d([a, b], axis);
        var expected = [3, 5];
        expect(result.shape).toEqual([2, 1]);
        expectArraysClose(result, expected);
    });
    it('[[3]] + [[5]], axis=1', function () {
        var axis = 1;
        var a = tf.tensor2d([3], [1, 1]);
        var b = tf.tensor2d([5], [1, 1]);
        var result = tf.concat2d([a, b], axis);
        var expected = [3, 5];
        expect(result.shape).toEqual([1, 2]);
        expectArraysClose(result, expected);
    });
    it('[[1, 2], [3, 4]] + [[5, 6]], axis=0', function () {
        var axis = 0;
        var a = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var b = tf.tensor2d([[5, 6]], [1, 2]);
        var result = tf.concat2d([a, b], axis);
        var expected = [1, 2, 3, 4, 5, 6];
        expect(result.shape).toEqual([3, 2]);
        expectArraysClose(result, expected);
    });
    it('[[1, 2],[3, 4]] + [[5, 6]] + [[7, 8]], axis=0', function () {
        var axis = 0;
        var a = tf.tensor2d([[1, 2], [3, 4]]);
        var b = tf.tensor2d([[5, 6]]);
        var c = tf.tensor2d([[7, 8]]);
        var result = tf.concat2d([a, b, c], axis);
        var expected = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(result.shape).toEqual([4, 2]);
        expectArraysClose(result, expected);
    });
    it('[[1, 2], [3, 4]] + [[5, 6]], axis=1 throws error', function () {
        var axis = 1;
        var a = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var b = tf.tensor2d([[5, 6]], [1, 2]);
        expect(function () { return tf.concat2d([a, b], axis); }).toThrowError();
    });
    it('[[1, 2], [3, 4]] + [[5, 6], [7, 8]], axis=1', function () {
        var axis = 1;
        var a = tf.tensor2d([[1, 2], [3, 4]], [2, 2]);
        var b = tf.tensor2d([[5, 6], [7, 8]], [2, 2]);
        var result = tf.concat2d([a, b], axis);
        var expected = [1, 2, 5, 6, 3, 4, 7, 8];
        expect(result.shape).toEqual([2, 4]);
        expectArraysClose(result, expected);
    });
    it('[[1, 2],[3, 4]] + [[5, 6],[7, 8]] + [[9, 10],[11, 12]], axis=1', function () {
        var axis = 1;
        var a = tf.tensor2d([[1, 2], [3, 4]]);
        var b = tf.tensor2d([[5, 6], [7, 8]]);
        var c = tf.tensor2d([[9, 10], [11, 12]]);
        var result = tf.concat2d([a, b, c], axis);
        var expected = [1, 2, 5, 6, 9, 10, 3, 4, 7, 8, 11, 12];
        expect(result.shape).toEqual([2, 6]);
        expectArraysClose(result, expected);
    });
});
describeWithFlags('concat3d', ALL_ENVS, function () {
    it('shapes correct concat axis=0', function () {
        var tensor1 = tf.tensor3d([1, 2, 3], [1, 1, 3]);
        var tensor2 = tf.tensor3d([4, 5, 6], [1, 1, 3]);
        var values = tf.concat3d([tensor1, tensor2], 0);
        expect(values.shape).toEqual([2, 1, 3]);
        expectArraysClose(values, [1, 2, 3, 4, 5, 6]);
    });
    it('concat axis=0', function () {
        var tensor1 = tf.tensor3d([1, 11, 111, 2, 22, 222], [1, 2, 3]);
        var tensor2 = tf.tensor3d([5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888], [2, 2, 3]);
        var values = tf.concat3d([tensor1, tensor2], 0);
        expect(values.shape).toEqual([3, 2, 3]);
        expectArraysClose(values, [
            1, 11, 111, 2, 22, 222, 5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888
        ]);
    });
    it('shapes correct concat axis=1', function () {
        var tensor1 = tf.tensor3d([1, 2, 3], [1, 1, 3]);
        var tensor2 = tf.tensor3d([4, 5, 6], [1, 1, 3]);
        var values = tf.concat3d([tensor1, tensor2], 1);
        expect(values.shape).toEqual([1, 2, 3]);
        expectArraysClose(values, [1, 2, 3, 4, 5, 6]);
    });
    it('concat axis=1', function () {
        var tensor1 = tf.tensor3d([1, 11, 111, 3, 33, 333], [2, 1, 3]);
        var tensor2 = tf.tensor3d([5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888], [2, 2, 3]);
        var values = tf.concat3d([tensor1, tensor2], 1);
        expect(values.shape).toEqual([2, 3, 3]);
        expectArraysClose(values, [
            1, 11, 111, 5, 55, 555, 6, 66, 666, 3, 33, 333, 7, 77, 777, 8, 88, 888
        ]);
    });
    it('shapes correct concat axis=2', function () {
        var tensor1 = tf.tensor3d([1, 2, 3], [1, 1, 3]);
        var tensor2 = tf.tensor3d([4, 5, 6], [1, 1, 3]);
        var values = tf.concat3d([tensor1, tensor2], 2);
        expect(values.shape).toEqual([1, 1, 6]);
        expectArraysClose(values, [1, 2, 3, 4, 5, 6]);
    });
    it('concat axis=2', function () {
        var tensor1 = tf.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
        var tensor2 = tf.tensor3d([5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888], [2, 2, 3]);
        var values = tf.concat3d([tensor1, tensor2], 2);
        expect(values.shape).toEqual([2, 2, 5]);
        expectArraysClose(values, [
            1, 11, 5, 55, 555, 2, 22, 6, 66, 666,
            3, 33, 7, 77, 777, 4, 44, 8, 88, 888
        ]);
    });
    it('concat throws when invalid non-axis shapes, axis=0', function () {
        var axis = 0;
        var x1 = tf.tensor3d([1, 11, 111], [1, 1, 3]);
        var x2 = tf.tensor3d([5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888], [2, 2, 3]);
        expect(function () { return tf.concat3d([x1, x2], axis); }).toThrowError();
    });
    it('concat throws when invalid non-axis shapes, axis=1', function () {
        var axis = 1;
        var x1 = tf.tensor3d([1, 11, 111], [1, 1, 3]);
        var x2 = tf.tensor3d([5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888], [2, 2, 3]);
        expect(function () { return tf.concat3d([x1, x2], axis); }).toThrowError();
    });
    it('concat throws when invalid non-axis shapes, axis=2', function () {
        var axis = 2;
        var x1 = tf.tensor3d([1, 11, 2, 22], [1, 2, 2]);
        var x2 = tf.tensor3d([5, 55, 555, 6, 66, 666, 7, 77, 777, 8, 88, 888], [2, 2, 3]);
        expect(function () { return tf.concat3d([x1, x2], axis); }).toThrowError();
    });
    it('gradient concat axis=0', function () {
        var x1 = tf.tensor3d([1, 11, 2, 22], [1, 2, 2]);
        var x2 = tf.tensor3d([5, 55, 6, 66, 7, 77, 8, 88], [2, 2, 2]);
        var dy = tf.tensor3d([66, 6, 55, 5, 44, 4, 33, 3, 22, 2, 11, 1], [3, 2, 2]);
        var axis = 0;
        var grads = tf.grads(function (x1, x2) { return tf.concat3d([x1, x2], axis); });
        var _a = grads([x1, x2], dy), dx1 = _a[0], dx2 = _a[1];
        expect(dx1.shape).toEqual(x1.shape);
        expectArraysClose(dx1, [66, 6, 55, 5]);
        expect(dx2.shape).toEqual(x2.shape);
        expectArraysClose(dx2, [44, 4, 33, 3, 22, 2, 11, 1]);
    });
    it('gradient concat axis=1', function () {
        var x1 = tf.tensor3d([1, 11, 2, 22], [2, 1, 2]);
        var x2 = tf.tensor3d([3, 33, 4, 44, 5, 55, 6, 66], [2, 2, 2]);
        var dy = tf.tensor3d([66, 6, 55, 5, 44, 4, 33, 3, 22, 2, 11, 1], [2, 3, 2]);
        var axis = 1;
        var grads = tf.grads(function (x1, x2) { return tf.concat3d([x1, x2], axis); });
        var _a = grads([x1, x2], dy), dx1 = _a[0], dx2 = _a[1];
        expect(dx1.shape).toEqual(x1.shape);
        expectArraysClose(dx1, [66, 6, 33, 3]);
        expect(dx2.shape).toEqual(x2.shape);
        expectArraysClose(dx2, [55, 5, 44, 4, 22, 2, 11, 1]);
    });
    it('gradient concat axis=2', function () {
        var x1 = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        var x2 = tf.tensor3d([5, 55, 6, 66, 7, 77, 8, 88], [2, 2, 2]);
        var dy = tf.tensor3d([4, 40, 400, 3, 30, 300, 2, 20, 200, 1, 10, 100], [2, 2, 3]);
        var axis = 2;
        var grads = tf.grads(function (x1, x2) { return tf.concat3d([x1, x2], axis); });
        var _a = grads([x1, x2], dy), dx1 = _a[0], dx2 = _a[1];
        expect(dx1.shape).toEqual(x1.shape);
        expectArraysClose(dx1, [4, 3, 2, 1]);
        expect(dx2.shape).toEqual(x2.shape);
        expectArraysClose(dx2, [40, 400, 30, 300, 20, 200, 10, 100]);
    });
});
describeWithFlags('concat throws for non-tensors', ALL_ENVS, function () {
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.concat([{}]); })
            .toThrowError(/Argument 'tensors\[0\]' passed to 'concat' must be a Tensor/);
    });
});
//# sourceMappingURL=concat_test.js.map