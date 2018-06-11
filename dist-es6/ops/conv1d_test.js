import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('conv1d', ALL_ENVS, function () {
    it('conv1d input=2x2x1,d2=1,f=1,s=1,d=1,p=same', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 1;
        var pad = 'same';
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor3d([3], [fSize, inputDepth, outputDepth]);
        var result = tf.conv1d(x, w, stride, pad, dataFormat, dilation);
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(result, [3, 6, 9, 12]);
    });
    it('conv1d input=4x1,d2=1,f=2x1x1,s=1,d=1,p=valid', function () {
        var inputDepth = 1;
        var inputShape = [4, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 1;
        var x = tf.tensor2d([1, 2, 3, 4], inputShape);
        var w = tf.tensor3d([2, 1], [fSize, inputDepth, outputDepth]);
        var result = tf.conv1d(x, w, stride, pad, dataFormat, dilation);
        expect(result.shape).toEqual([3, 1]);
        expectArraysClose(result, [4, 7, 10]);
    });
    it('conv1d input=4x1,d2=1,f=2x1x1,s=1,d=2,p=valid', function () {
        var inputDepth = 1;
        var inputShape = [4, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var fSizeDilated = 3;
        var pad = 'valid';
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 2;
        var dilationWEffective = 1;
        var x = tf.tensor2d([1, 2, 3, 4], inputShape);
        var w = tf.tensor3d([2, 1], [fSize, inputDepth, outputDepth]);
        var wDilated = tf.tensor3d([2, 0, 1], [fSizeDilated, inputDepth, outputDepth]);
        var result = tf.conv1d(x, w, stride, pad, dataFormat, dilation);
        var expectedResult = tf.conv1d(x, wDilated, stride, pad, dataFormat, dilationWEffective);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(result, expectedResult);
    });
    it('conv1d input=14x1,d2=1,f=3x1x1,s=1,d=3,p=valid', function () {
        var inputDepth = 1;
        var inputShape = [14, inputDepth];
        var outputDepth = 1;
        var fSize = 3;
        var fSizeDilated = 7;
        var pad = 'valid';
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 3;
        var dilationWEffective = 1;
        var x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], inputShape);
        var w = tf.tensor3d([3, 2, 1], [fSize, inputDepth, outputDepth]);
        var wDilated = tf.tensor3d([3, 0, 0, 2, 0, 0, 1], [fSizeDilated, inputDepth, outputDepth]);
        var result = tf.conv1d(x, w, stride, pad, dataFormat, dilation);
        var expectedResult = tf.conv1d(x, wDilated, stride, pad, dataFormat, dilationWEffective);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(result, expectedResult);
    });
    it('throws when x is not rank 3', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var fSize = 2;
        var pad = 0;
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 1;
        var x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var w = tf.tensor3d([3, 1], [fSize, inputDepth, outputDepth]);
        expect(function () { return tf.conv1d(x, w, stride, pad, dataFormat, dilation); })
            .toThrowError();
    });
    it('throws when weights is not rank 3', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var pad = 0;
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor4d([3, 1, 5, 0], [2, 2, 1, 1]);
        expect(function () { return tf.conv1d(x, w, stride, pad, dataFormat, dilation); })
            .toThrowError();
    });
    it('throws when x depth does not match weight depth', function () {
        var inputDepth = 1;
        var wrongInputDepth = 5;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 2;
        var pad = 0;
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.randomNormal([fSize, wrongInputDepth, outputDepth]);
        expect(function () { return tf.conv1d(x, w, stride, pad, dataFormat, dilation); })
            .toThrowError();
    });
    it('throws when both stride and dilation are greater than 1', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 1;
        var pad = 'same';
        var stride = 2;
        var dataFormat = 'NWC';
        var dilation = 2;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor3d([3], [fSize, inputDepth, outputDepth]);
        expect(function () { return tf.conv1d(x, w, stride, pad, dataFormat, dilation); })
            .toThrowError();
    });
    it('throws when passed x as a non-tensor', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var fSize = 1;
        var pad = 'same';
        var stride = 2;
        var dataFormat = 'NWC';
        var dilation = 2;
        var w = tf.tensor3d([3], [fSize, inputDepth, outputDepth]);
        expect(function () {
            return tf.conv1d({}, w, stride, pad, dataFormat, dilation);
        })
            .toThrowError(/Argument 'x' passed to 'conv1d' must be a Tensor/);
    });
    it('throws when passed filter as a non-tensor', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var pad = 'same';
        var stride = 2;
        var dataFormat = 'NWC';
        var dilation = 2;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        expect(function () {
            return tf.conv1d(x, {}, stride, pad, dataFormat, dilation);
        })
            .toThrowError(/Argument 'filter' passed to 'conv1d' must be a Tensor/);
    });
    it('conv1d gradients, input=2x2x1,d2=1,f=1,s=1,d=1,p=same', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var outputDepth = 1;
        var fSize = 1;
        var filterShape = [fSize, inputDepth, outputDepth];
        var pad = 'same';
        var stride = 1;
        var dataFormat = 'NWC';
        var dilation = 1;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var w = tf.tensor3d([3], filterShape);
        var dy = tf.tensor3d([3, 2, 1, 0], inputShape);
        var grads = tf.grads(function (x, w) { return tf.conv1d(x, w, stride, pad, dataFormat, dilation); });
        var _a = grads([x, w], dy), dx = _a[0], dw = _a[1];
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [9, 6, 3, 0]);
        expect(dw.shape).toEqual(w.shape);
        expectArraysClose(dw, [10]);
    });
    it('conv1d gradients input=14x1,d2=1,f=3x1x1,s=1,p=valid', function () {
        var inputDepth = 1;
        var inputShape = [14, inputDepth];
        var outputDepth = 1;
        var fSize = 3;
        var pad = 'valid';
        var stride = 1;
        var dataFormat = 'NWC';
        var x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], inputShape);
        var w = tf.tensor3d([3, 2, 1], [fSize, inputDepth, outputDepth]);
        var dy = tf.tensor2d([3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0], [12, inputDepth]);
        var grads = tf.grads(function (x, w) { return tf.conv1d(x, w, stride, pad, dataFormat); });
        var _a = grads([x, w], dy), dx = _a[0], dw = _a[1];
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [9, 12, 10, 4, 10, 12, 10, 4, 10, 12, 10, 4, 1, 0]);
        expect(dw.shape).toEqual(w.shape);
        expectArraysClose(dw, [102, 120, 138]);
    });
});
//# sourceMappingURL=conv1d_test.js.map