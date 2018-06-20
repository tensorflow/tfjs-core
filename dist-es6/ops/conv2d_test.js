import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('conv2d', ALL_ENVS, function () {
    it('x=[2,2,1] f=[1,1,1,2] s=1 d=1 p=0', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 1;
        var pad = 0;
        var stride = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        var result = tf.conv2d(x, w, stride, pad);
        expectArraysClose(result, [2, 4, 6, 8]);
    });
    it('x=[2,2,2,1] f=[1,1,1,1] s=1 d=1 p=0', function () {
        var inputDepth = 1;
        var inShape = [2, 2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 1;
        var pad = 0;
        var stride = 1;
        var x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        var w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        var result = tf.conv2d(x, w, stride, pad);
        expect(result.shape).toEqual([2, 2, 2, 1]);
        var expected = [2, 4, 6, 8, 10, 12, 14, 16];
        expectArraysClose(result, expected);
    });
    it('x=[2,2,1] f=[2,2,1,1] s=1 d=1 p=0', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var pad = 0;
        var stride = 1;
        var dataFormat = 'NHWC';
        var dilation = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        var result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        expectArraysClose(result, [20]);
    });
    it('x=[4,4,1] f=[2,2,1,1] s=1 d=2 p=0', function () {
        var inputDepth = 1;
        var inputShape = [4, 4, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var fSizeDilated = 3;
        var pad = 0;
        var stride = 1;
        var dataFormat = 'NHWC';
        var dilation = 2;
        var noDilation = 1;
        var x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        var w = tf.tensor4d([3, 1, 5, 2], [fSize, fSize, inputDepth, outputDepth]);
        var wDilated = tf.tensor4d([3, 0, 1, 0, 0, 0, 5, 0, 2], [fSizeDilated, fSizeDilated, inputDepth, outputDepth]);
        var result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        var expectedResult = tf.conv2d(x, wDilated, stride, pad, dataFormat, noDilation);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(result, expectedResult);
    });
    it('throws when x is not rank 3', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var fSize = 2;
        var pad = 0;
        var stride = 1;
        var x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        expect(function () { return tf.conv2d(x, w, stride, pad); }).toThrowError();
    });
    it('throws when weights is not rank 4', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var pad = 0;
        var stride = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor3d([3, 1, 5, 0], [2, 2, 1]);
        expect(function () { return tf.conv2d(x, w, stride, pad); }).toThrowError();
    });
    it('throws when x depth does not match weight depth', function () {
        var inputDepth = 1;
        var wrongInputDepth = 5;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var pad = 0;
        var stride = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.randomNormal([fSize, fSize, wrongInputDepth, outputDepth]);
        expect(function () { return tf.conv2d(x, w, stride, pad); }).toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is not a number', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var dataFormat = 'NHWC';
        var dilation = 1;
        var dimRoundingMode = 'round';
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.randomNormal([fSize, fSize, inputDepth, outputDepth]);
        expect(function () {
            return tf.conv2d(x, w, stride, pad, dataFormat, dilation, dimRoundingMode);
        })
            .toThrowError();
    });
    it('throws when both stride and dilation are greater than 1', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var pad = 0;
        var stride = [2, 1];
        var dataFormat = 'NHWC';
        var dilation = [1, 2];
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        expect(function () { return tf.conv2d(x, w, stride, pad, dataFormat, dilation); })
            .toThrowError();
    });
    it('gradient input=[3,3,1] f=[2,2,1,1] s=1 p=0', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var inputShape = [3, 3, inputDepth];
        var filterSize = 2;
        var stride = 1;
        var pad = 0;
        var filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        var filter = tf.ones(filterShape);
        var x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        var dy = tf.tensor3d([3, 1, 2, 0], [2, 2, 1]);
        var grads = tf.grads(function (x, filter) { return x.conv2d(filter, stride, pad); });
        var _a = grads([x, filter], dy), dx = _a[0], dfilter = _a[1];
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [3, 4, 1, 5, 6, 1, 2, 2, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(dfilter, [13, 19, 31, 37]);
    });
    it('gradient x=[2,3,3,1] f=[2,2,1,1] s=1 p=0', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var inputShape = [2, 3, 3, inputDepth];
        var filterSize = 2;
        var stride = 1;
        var pad = 0;
        var filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        var filter = tf.ones(filterShape);
        var x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        var dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        var grads = tf.grads(function (x, filter) { return x.conv2d(filter, stride, pad); });
        var _a = grads([x, filter], dy), dx = _a[0], dfilter = _a[1];
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [3, 4, 1, 5, 6, 1, 2, 2, 0, 3, 4, 1, 5, 6, 1, 2, 2, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(dfilter, [13 * 2, 19 * 2, 31 * 2, 37 * 2]);
    });
    it('throws when passed x as a non-tensor', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var fSize = 1;
        var pad = 0;
        var stride = 1;
        var w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        expect(function () { return tf.conv2d({}, w, stride, pad); })
            .toThrowError(/Argument 'x' passed to 'conv2d' must be a Tensor/);
    });
    it('throws when passed filter as a non-tensor', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var pad = 0;
        var stride = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        expect(function () { return tf.conv2d(x, {}, stride, pad); })
            .toThrowError(/Argument 'filter' passed to 'conv2d' must be a Tensor/);
    });
});
//# sourceMappingURL=conv2d_test.js.map