import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('separableConv2d', ALL_ENVS, function () {
    it('input=1x3x3x1,f=2,s=1,d=1,p=valid,chMul=1,outDepth=2', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var x = tf.tensor4d([
            0.230664, 0.987388, 0.0685208, 0.419224, 0.887861, 0.731641,
            0.0741907, 0.409265, 0.351377
        ], [1, 3, 3, inDepth]);
        var depthwiseFilter = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor4d([
            0.10702161, -0.21404321, 0.10316753, -0.20633507, 0.06704096,
            -0.13408193, 0.07788632, -0.15577264
        ], [1, 2, 2, outDepth]));
    });
    it('input=1x3x3x1,f=2,s=1,d=1,p=valid,chMul=2,outDepth=2', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 2;
        var inDepth = 1;
        var outDepth = 3;
        var x = tf.tensor4d([
            0.230664, 0.987388, 0.0685208, 0.419224, 0.887861, 0.731641,
            0.0741907, 0.409265, 0.351377
        ], [1, 3, 3, inDepth]);
        var depthwiseFilter = tf.tensor4d([
            0.303873, 0.229223, 0.144333, 0.803373, -0.303873, -0.229223,
            -0.144333, -0.803373
        ], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2, -0.1, 0.2, 0.15, 0.15], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor4d([
            0.00305368, 0.0140969, 0.00980358, -0.10853045, -0.06339455,
            -0.0699412, 0.11010849, 0.0347524, 0.05214475, 0.10307151,
            0.02221644, 0.04224815
        ], [1, 2, 2, outDepth]));
    });
    it('input=1x3x3x1,f=2,s=1,d=1,p=valid,chMul=1,outDepth=2,3D input', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var x = tf.tensor3d([
            0.230664, 0.987388, 0.0685208, 0.419224, 0.887861, 0.731641,
            0.0741907, 0.409265, 0.351377
        ], [3, 3, inDepth]);
        var depthwiseFilter = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor3d([
            0.10702161, -0.21404321, 0.10316753, -0.20633507, 0.06704096,
            -0.13408193, 0.07788632, -0.15577264
        ], [2, 2, outDepth]));
    });
    it('input=1x4x4x1,f=2,s=2,d=1,p=valid,chMul=1,outDepth=2', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = [2, 2];
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var x = tf.tensor4d([
            0.675707, 0.758567, 0.413529, 0.963967, 0.217291, 0.101335, 0.804231,
            0.329673, 0.924503, 0.728742, 0.180217, 0.210459, 0.133869, 0.650827,
            0.047613, 0.554795
        ], [1, 4, 4, inDepth]);
        var depthwiseFilter = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor4d([
            0.04919822, -0.09839644, 0.07275512, -0.14551024, 0.09901544,
            -0.19803089, 0.05555845, -0.11111691
        ], [1, 2, 2, outDepth]));
    });
    it('input=2x4x4x1,f=2,s=2,d=1,p=valid,chMul=1,outDepth=2', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = [2, 2];
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var x = tf.tensor4d([
            0.675707, 0.758567, 0.413529, 0.963967, 0.217291, 0.101335,
            0.804231, 0.329673, 0.924503, 0.728742, 0.180217, 0.210459,
            0.133869, 0.650827, 0.047613, 0.554795, -0.675707, -0.758567,
            -0.413529, -0.963967, -0.217291, -0.101335, -0.804231, -0.329673,
            -0.924503, -0.728742, -0.180217, -0.210459, -0.133869, -0.650827,
            -0.047613, -0.554795
        ], [2, 4, 4, inDepth]);
        var depthwiseFilter = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor4d([
            0.04919822, -0.09839644, 0.07275512, -0.14551024, 0.09901544,
            -0.19803089, 0.05555845, -0.11111691, -0.04919822, 0.09839644,
            -0.07275512, 0.14551024, -0.09901544, 0.19803089, -0.05555845,
            0.11111691
        ], [2, 2, 2, outDepth]));
    });
    it('input=1x4x4x2,f=2,s=2,d=1,p=valid,chMul=1,outDepth=2', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = [2, 2];
        var chMul = 1;
        var inDepth = 2;
        var outDepth = 2;
        var x = tf.tensor4d([
            0.675707, 0.758567, 0.413529, 0.963967, 0.217291, 0.101335,
            0.804231, 0.329673, 0.924503, 0.728742, 0.180217, 0.210459,
            0.133869, 0.650827, 0.047613, 0.554795, -0.675707, -0.758567,
            -0.413529, -0.963967, -0.217291, -0.101335, -0.804231, -0.329673,
            -0.924503, -0.728742, -0.180217, -0.210459, -0.133869, -0.650827,
            -0.047613, -0.554795
        ], [1, 4, 4, inDepth]);
        var depthwiseFilter = tf.tensor4d([
            0.303873, 0.229223, 0.144333, 0.803373, 0.98976838, 0.56597068,
            0.42654137, 0.66445535
        ], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2, 0.05, -0.05], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor4d([
            0.20072255, -0.32641545, 0.08474462, -0.11823604, -0.20072255,
            0.32641545, -0.08474462, 0.11823604
        ], [1, 2, 2, outDepth]));
    });
    it('input=1x4x4x1,f=2,s=1,d=2,p=valid,chMul=1,outDepth=2', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var dilationRate = 2;
        var x = tf.tensor4d([
            0.675707, 0.758567, 0.413529, 0.963967, 0.217291, 0.101335, 0.804231,
            0.329673, 0.924503, 0.728742, 0.180217, 0.210459, 0.133869, 0.650827,
            0.047613, 0.554795
        ], [1, 4, 4, inDepth]);
        var depthwiseFilter = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad, dilationRate);
        expectArraysClose(result, tf.tensor4d([
            0.05783373, -0.11566745, 0.07257301, -0.14514601, 0.03079498,
            -0.06158997, 0.06460048, -0.12920095
        ], [1, 2, 2, outDepth]));
    });
    it('input=1x4x4x1,f=2,s=1,d=1,p=same,chMul=1,outDepth=2', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var x = tf.tensor4d([
            0.675707, 0.758567, 0.413529, 0.963967, 0.217291, 0.101335, 0.804231,
            0.329673, 0.924503, 0.728742, 0.180217, 0.210459, 0.133869, 0.650827,
            0.047613, 0.554795
        ], [1, 4, 4, inDepth]);
        var depthwiseFilter = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.tensor4d([0.1, -0.2], [1, 1, inDepth * chMul, outDepth]);
        var result = tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, stride, pad);
        expectArraysClose(result, tf.tensor4d([
            0.04919822, -0.09839644, 0.09860218, -0.19720435, 0.07275512,
            -0.14551024, 0.03405062, -0.06810125, 0.08081452, -0.16162904,
            0.04651042, -0.09302084, 0.05150411, -0.10300821, 0.01305549,
            -0.02611098, 0.09901544, -0.19803089, 0.03949417, -0.07898834,
            0.05555845, -0.11111691, 0.0144028, -0.02880561, 0.01898637,
            -0.03797274, 0.02086828, -0.04173655, 0.01416401, -0.02832802,
            0.01685872, -0.03371745
        ], [1, 4, 4, outDepth]));
    });
    it('Incorrect input rank raises error', function () {
        var x = tf.zeros([4, 4]);
        var depthwiseFilter = tf.zeros([2, 2, 1, 3]);
        var pointwiseFilter = tf.zeros([1, 1, 2, 4]);
        expect(function () {
            return tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, 1, 'valid');
        })
            .toThrowError(/rank 4/);
    });
    it('Incorrect depthwise filter rank raises error', function () {
        var x = tf.zeros([1, 4, 4, 1]);
        var depthwiseFilter = tf.zeros([2, 2, 1]);
        var pointwiseFilter = tf.zeros([1, 1, 2, 4]);
        expect(function () {
            return tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, 1, 'valid');
        })
            .toThrowError(/rank 4/);
    });
    it('Incorrect depthwise filter rank raises error', function () {
        var x = tf.zeros([1, 4, 4, 1]);
        var depthwiseFilter = tf.zeros([2, 2, 1, 3]);
        var pointwiseFilter = tf.zeros([1, 1, 2]);
        expect(function () {
            return tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, 1, 'valid');
        })
            .toThrowError(/rank 4/);
    });
    it('Incorrect point filter 1st dimension raises error', function () {
        var x = tf.zeros([1, 4, 4, 1]);
        var depthwiseFilter = tf.zeros([2, 2, 1, 3]);
        var pointwiseFilter = tf.zeros([2, 1, 3, 6]);
        expect(function () {
            return tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, 1, 'valid');
        })
            .toThrowError(/must be 1, but got 2/);
    });
    it('Incorrect point filter 2nd dimension raises error', function () {
        var x = tf.zeros([1, 4, 4, 1]);
        var depthwiseFilter = tf.zeros([2, 2, 1, 3]);
        var pointwiseFilter = tf.zeros([1, 5, 3, 6]);
        expect(function () {
            return tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, 1, 'valid');
        })
            .toThrowError(/must be 1, but got 5/);
    });
    it('Incorrect pointwise filter 3rd dimension raises error', function () {
        var x = tf.zeros([1, 4, 4, 1]);
        var depthwiseFilter = tf.zeros([2, 2, 1, 3]);
        var pointwiseFilter = tf.zeros([1, 1, 4, 6]);
        expect(function () {
            return tf.separableConv2d(x, depthwiseFilter, pointwiseFilter, 1, 'valid');
        })
            .toThrowError(/must be 3, but got 4/);
    });
    it('throws when passed x as a non-tensor', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var depthwiseFilter = tf.zeros([fSize, fSize, inDepth, chMul]);
        var pointwiseFilter = tf.zeros([1, 1, inDepth * chMul, outDepth]);
        var e = /Argument 'x' passed to 'separableConv2d' must be a Tensor/;
        expect(function () { return tf.separableConv2d({}, depthwiseFilter, pointwiseFilter, stride, pad); })
            .toThrowError(e);
    });
    it('throws when passed depthwiseFilter as a non-tensor', function () {
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var outDepth = 2;
        var x = tf.zeros([1, 3, 3, inDepth]);
        var pointwiseFilter = tf.zeros([1, 1, inDepth * chMul, outDepth]);
        var e = new RegExp('Argument \'depthwiseFilter\' passed to \'separableConv2d\'' +
            ' must be a Tensor');
        expect(function () { return tf.separableConv2d(x, {}, pointwiseFilter, stride, pad); })
            .toThrowError(e);
    });
    it('throws when passed pointwiseFilter as a non-tensor', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var x = tf.zeros([1, 3, 3, inDepth]);
        var depthwiseFilter = tf.zeros([fSize, fSize, inDepth, chMul]);
        var e = new RegExp('Argument \'pointwiseFilter\' passed to \'separableConv2d\'' +
            ' must be a Tensor');
        expect(function () { return tf.separableConv2d(x, depthwiseFilter, {}, stride, pad); })
            .toThrowError(e);
    });
});
//# sourceMappingURL=conv2d_separable_test.js.map