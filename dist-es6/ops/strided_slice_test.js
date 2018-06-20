import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('stridedSlice', ALL_ENVS, function () {
    it('stridedSlice should suport 1d tensor', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [0], [3], [2]);
        expect(output.shape).toEqual([2]);
        expectArraysClose(output, [0, 2]);
    });
    it('stridedSlice should suport 1d tensor empty result', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [10], [3], [2]);
        expect(output.shape).toEqual([0]);
        expectArraysClose(output, []);
    });
    it('stridedSlice should suport 1d tensor negative begin', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [-3], [3], [1]);
        expect(output.shape).toEqual([2]);
        expectArraysClose(output, [1, 2]);
    });
    it('stridedSlice should suport 1d tensor out of range begin', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [-5], [3], [1]);
        expect(output.shape).toEqual([3]);
        expectArraysClose(output, [0, 1, 2]);
    });
    it('stridedSlice should suport 1d tensor negative end', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [1], [-2], [1]);
        expect(output.shape).toEqual([1]);
        expectArraysClose(output, [1]);
    });
    it('stridedSlice should suport 1d tensor out of range end', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [-3], [5], [1]);
        expect(output.shape).toEqual([3]);
        expectArraysClose(output, [1, 2, 3]);
    });
    it('stridedSlice should suport 1d tensor begin mask', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [1], [3], [1], 1);
        expect(output.shape).toEqual([3]);
        expectArraysClose(output, [0, 1, 2]);
    });
    it('stridedSlice should suport 1d tensor nagtive begin and stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [-2], [-3], [-1]);
        expect(output.shape).toEqual([1]);
        expectArraysClose(output, [2]);
    });
    it('stridedSlice should suport 1d tensor' +
        ' out of range begin and negative stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [5], [-2], [-1]);
        expect(output.shape).toEqual([1]);
        expectArraysClose(output, [3]);
    });
    it('stridedSlice should suport 1d tensor nagtive end and stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [2], [-4], [-1]);
        expect(output.shape).toEqual([2]);
        expectArraysClose(output, [2, 1]);
    });
    it('stridedSlice should suport 1d tensor' +
        ' out of range end and negative stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [-3], [-5], [-1]);
        expect(output.shape).toEqual([2]);
        expectArraysClose(output, [1, 0]);
    });
    it('stridedSlice should suport 1d tensor end mask', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [1], [3], [1], 0, 1);
        expect(output.shape).toEqual([3]);
        expectArraysClose(output, [1, 2, 3]);
    });
    it('stridedSlice should suport 1d tensor negative stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [-1], [-4], [-1]);
        expect(output.shape).toEqual([3]);
        expectArraysClose(output, [3, 2, 1]);
    });
    it('stridedSlice should suport 1d tensor even length stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [0], [2], [2]);
        expect(output.shape).toEqual([1]);
        expectArraysClose(output, [0]);
    });
    it('stridedSlice should suport 1d tensor odd length stride', function () {
        var tensor = tf.tensor1d([0, 1, 2, 3]);
        var output = tf.stridedSlice(tensor, [0], [3], [2]);
        expect(output.shape).toEqual([2]);
        expectArraysClose(output, [0, 2]);
    });
    it('stridedSlice should suport 2d tensor identity', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [0, 0], [2, 3], [1, 1]);
        expect(output.shape).toEqual([2, 3]);
        expectArraysClose(output, [1, 2, 3, 4, 5, 6]);
    });
    it('stridedSlice should suport 2d tensor', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [1, 0], [2, 2], [1, 1]);
        expect(output.shape).toEqual([1, 2]);
        expectArraysClose(output, [4, 5]);
    });
    it('stridedSlice should suport 2d tensor strides', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [0, 0], [2, 3], [2, 2]);
        expect(output.shape).toEqual([1, 2]);
        expectArraysClose(output, [1, 3]);
    });
    it('stridedSlice should suport 2d tensor negative strides', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [1, -1], [2, -4], [2, -1]);
        expect(output.shape).toEqual([1, 3]);
        expectArraysClose(output, [6, 5, 4]);
    });
    it('stridedSlice should suport 2d tensor begin mask', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [1, 0], [2, 2], [1, 1], 1);
        expect(output.shape).toEqual([2, 2]);
        expectArraysClose(output, [1, 2, 4, 5]);
    });
    it('stridedSlice should suport 2d tensor end mask', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [1, 0], [2, 2], [1, 1], 0, 2);
        expect(output.shape).toEqual([1, 3]);
        expectArraysClose(output, [4, 5, 6]);
    });
    it('stridedSlice should suport 2d tensor' +
        ' negative strides and begin mask', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [1, -2], [2, -4], [1, -1], 2);
        expect(output.shape).toEqual([1, 3]);
        expectArraysClose(output, [6, 5, 4]);
    });
    it('stridedSlice should suport 2d tensor' +
        ' negative strides and end mask', function () {
        var tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = tf.stridedSlice(tensor, [1, -2], [2, -3], [1, -1], 0, 2);
        expect(output.shape).toEqual([1, 2]);
        expectArraysClose(output, [5, 4]);
    });
    it('stridedSlice should suport 3d tensor identity', function () {
        var tensor = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
        var output = tf.stridedSlice(tensor, [0, 0, 0], [2, 3, 2], [1, 1, 1]);
        expect(output.shape).toEqual([2, 3, 2]);
        expectArraysClose(output, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
    it('stridedSlice should suport 3d tensor negative stride', function () {
        var tensor = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
        var output = tf.stridedSlice(tensor, [-1, -1, -1], [-3, -4, -3], [-1, -1, -1]);
        expect(output.shape).toEqual([2, 3, 2]);
        expectArraysClose(output, [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });
    it('stridedSlice should suport 3d tensor strided 2', function () {
        var tensor = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
        var output = tf.stridedSlice(tensor, [0, 0, 0], [2, 3, 2], [2, 2, 2]);
        expect(output.shape).toEqual([1, 2, 1]);
        expectArraysClose(output, [1, 5]);
    });
    it('stridedSlice should throw when passed a non-tensor', function () {
        expect(function () { return tf.stridedSlice({}, [0], [0], [1]); })
            .toThrowError(/Argument 'x' passed to 'stridedSlice' must be a Tensor/);
    });
});
//# sourceMappingURL=strided_slice_test.js.map