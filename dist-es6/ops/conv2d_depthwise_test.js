import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('depthwiseConv2D', ALL_ENVS, function () {
    it('input=1x3x3x1,f=2,s=1,d=1,p=valid,chMul=1', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var x = tf.tensor4d([
            0.230664, 0.987388, 0.0685208, 0.419224, 0.887861, 0.731641,
            0.0741907, 0.409265, 0.351377
        ], [1, 3, 3, inDepth]);
        var w = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad);
        expect(result.shape).toEqual([1, 2, 2, 1]);
        var expected = [1.07022, 1.03167, 0.67041, 0.778863];
        expectArraysClose(result, expected);
    });
    it('input=1x3x3x1,f=2,s=1,d=2,p=valid,chMul=1', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var dilation = 2;
        var chMul = 1;
        var inDepth = 1;
        var x = tf.tensor4d([
            0.230664, 0.987388, 0.0685208, 0.419224, 0.887861, 0.731641,
            0.0741907, 0.409265, 0.351377
        ], [1, 3, 3, inDepth]);
        var w = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var fSizeDilated = fSize + (fSize - 1) * (dilation - 1);
        var wDilated = tf.tensor4d([0.303873, 0, 0.229223, 0, 0, 0, 0.144333, 0, 0.803373], [fSizeDilated, fSizeDilated, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad, 'NHWC', dilation);
        var expectedResult = tf.depthwiseConv2d(x, wDilated, stride, pad);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(result, expectedResult);
    });
    it('input=1x3x3x2,f=2,s=1,d=1,p=same,chMul=1', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var chMul = 1;
        var inDepth = 2;
        var x = tf.tensor4d([
            0.111057, 0.661818, 0.701979, 0.424362, 0.992854, 0.417599, 0.423036,
            0.500499, 0.368484, 0.714135, 0.456693, 0.531058, 0.636636, 0.345024,
            0.0506303, 0.789682, 0.177473, 0.793569
        ], [1, 3, 3, inDepth]);
        var w = tf.tensor4d([
            0.614293, 0.0648011, 0.101113, 0.452887, 0.0582746, 0.426481,
            0.872743, 0.765767
        ], [fSize, fSize, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad);
        expect(result.shape).toEqual([1, 3, 3, 2]);
        var expected = [
            0.485445, 0.995389, 0.95166, 0.927856, 0.636516, 0.253547, 0.378414,
            1.10771, 0.430373, 1.23126, 0.290885, 0.372855, 0.3962, 0.379995,
            0.0490466, 0.410569, 0.10902, 0.0514242
        ];
        expectArraysClose(result, expected);
    });
    it('input=1x3x3x2,f=2,s=1,d=2,p=same,chMul=1', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var dilation = 2;
        var inDepth = 2;
        var x = tf.tensor4d([
            0.111057, 0.661818, 0.701979, 0.424362, 0.992854, 0.417599, 0.423036,
            0.500499, 0.368484, 0.714135, 0.456693, 0.531058, 0.636636, 0.345024,
            0.0506303, 0.789682, 0.177473, 0.793569
        ], [1, 3, 3, inDepth]);
        var w = tf.stack([
            tf.tensor2d([0.614293, 0.0648011, 0.101113, 0.452887], [fSize, fSize]),
            tf.tensor2d([0.0582746, 0.426481, 0.872743, 0.765767], [fSize, fSize])
        ], 2)
            .expandDims(3);
        var fSizeDilated = fSize + (fSize - 1) * (dilation - 1);
        var wDilated = tf.stack([
            tf.tensor2d([0.614293, 0, 0.0648011, 0, 0, 0, 0.101113, 0, 0.452887], [fSizeDilated, fSizeDilated]),
            tf.tensor2d([0.0582746, 0, 0.426481, 0, 0, 0, 0.872743, 0, 0.765767], [fSizeDilated, fSizeDilated])
        ], 2)
            .expandDims(3);
        expect(wDilated.shape).toEqual([fSizeDilated, fSizeDilated, inDepth, 1]);
        var result = tf.depthwiseConv2d(x, w, stride, pad, 'NHWC', dilation);
        var expectedResult = tf.depthwiseConv2d(x, wDilated, stride, pad);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(result, expectedResult);
    });
    it('input=1x3x3x2,f=2,s=1,p=same,chMul=2', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var chMul = 2;
        var inDepth = 2;
        var x = tf.tensor4d([
            0.675707, 0.758567, 0.413529, 0.963967, 0.217291, 0.101335, 0.804231,
            0.329673, 0.924503, 0.728742, 0.180217, 0.210459, 0.133869, 0.650827,
            0.047613, 0.554795, 0.653365, 0.442196
        ], [1, 3, 3, inDepth]);
        var w = tf.tensor4d([
            0.347154, 0.386692, 0.327191, 0.483784, 0.591807, 0.24263, 0.95182,
            0.174353, 0.592136, 0.623469, 0.988244, 0.660731, 0.946534, 0.0801365,
            0.864889, 0.874602
        ], [fSize, fSize, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad);
        expect(result.shape).toEqual([1, 3, 3, 4]);
        var expected = [
            1.83059, 0.937125, 2.1218, 1.39024, 0.990167, 0.803472,
            1.31405, 1.14959, 0.182147, 0.196385, 0.241141, 0.188081,
            0.950656, 0.622581, 1.92451, 1.20179, 1.07422, 0.483268,
            1.36948, 1.14256, 0.449444, 0.477042, 0.505857, 0.393989,
            0.0746509, 0.0633184, 0.74101, 0.41159, 0.403195, 0.176938,
            0.602415, 0.345499, 0.226819, 0.252651, 0.144682, 0.213927
        ];
        expectArraysClose(result, expected);
    });
    it('input=2x3x3x2,f=2,s=1,p=same,chMul=2', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var chMul = 2;
        var inDepth = 2;
        var x = tf.tensor4d([
            0.261945, 0.0528113, 0.656698, 0.127345, 0.610039, 0.169131,
            0.458647, 0.0988288, 0.966109, 0.0421747, 0.82035, 0.274711,
            0.359377, 0.512113, 0.689682, 0.941571, 0.31961, 0.743826,
            0.858147, 0.984766, 0.926973, 0.579597, 0.444104, 0.505969,
            0.241437, 0.937999, 0.0957074, 0.773611, 0.46023, 0.469379,
            0.363789, 0.269745, 0.486136, 0.894215, 0.794299, 0.724615
        ], [2, 3, 3, inDepth]);
        var w = tf.tensor4d([
            0.240347, 0.906352, 0.478657, 0.825918, 0.380769, 0.184705, 0.238241,
            0.201907, 0.294087, 0.181165, 0.191303, 0.7225, 0.430064, 0.900622,
            0.670338, 0.33478
        ], [fSize, fSize, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad);
        expect(result.shape).toEqual([2, 3, 3, 4]);
        var expected = [
            0.863379, 1.3119, 0.102795, 0.154853, 1.02704, 1.62173, 0.293466,
            0.261764, 0.387876, 0.701529, 0.133508, 0.338167, 0.880395, 1.28039,
            0.786492, 0.775361, 0.884845, 1.43995, 0.764374, 1.0196, 0.291162,
            0.801428, 0.273788, 0.764303, 0.348985, 0.45311, 0.469447, 0.613073,
            0.287461, 0.684128, 0.627899, 0.927844, 0.0768174, 0.28968, 0.356037,
            0.614339, 0.67138, 1.07894, 1.30747, 1.86705, 0.617971, 1.35402,
            0.860607, 1.29693, 0.242087, 0.485892, 0.331979, 0.757015, 0.410527,
            0.740235, 1.28431, 1.42516, 0.68281, 0.975185, 1.13892, 1.62237,
            0.344208, 0.561029, 0.363292, 0.911203, 0.272541, 0.419513, 0.342154,
            0.403335, 0.419286, 0.587321, 0.600655, 0.884853, 0.190907, 0.719914,
            0.346842, 0.598472
        ];
        expectArraysClose(result, expected);
    });
    it('input=2x3x3x2,f=2,s=1,d=2,p=same,chMul=2', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var inDepth = 2;
        var dilation = 2;
        var noDilation = 1;
        var x = tf.tensor4d([
            0.261945, 0.0528113, 0.656698, 0.127345, 0.610039, 0.169131,
            0.458647, 0.0988288, 0.966109, 0.0421747, 0.82035, 0.274711,
            0.359377, 0.512113, 0.689682, 0.941571, 0.31961, 0.743826,
            0.858147, 0.984766, 0.926973, 0.579597, 0.444104, 0.505969,
            0.241437, 0.937999, 0.0957074, 0.773611, 0.46023, 0.469379,
            0.363789, 0.269745, 0.486136, 0.894215, 0.794299, 0.724615
        ], [2, 3, 3, inDepth]);
        var w = tf.stack([
            tf.stack([
                tf.tensor2d([0.240347, 0.906352, 0.478657, 0.825918], [fSize, fSize]),
                tf.tensor2d([0.380769, 0.184705, 0.238241, 0.201907], [fSize, fSize])
            ], 2),
            tf.stack([
                tf.tensor2d([0.294087, 0.181165, 0.191303, 0.7225], [fSize, fSize]),
                tf.tensor2d([0.430064, 0.900622, 0.670338, 0.33478], [fSize, fSize])
            ], 2)
        ], 3);
        var fSizeDilated = fSize + (fSize - 1) * (dilation - 1);
        var wDilated = tf.stack([
            tf.stack([
                tf.tensor2d([0.240347, 0, 0.906352, 0, 0, 0, 0.478657, 0, 0.825918], [fSizeDilated, fSizeDilated]),
                tf.tensor2d([0.380769, 0, 0.184705, 0, 0, 0, 0.238241, 0, 0.201907], [fSizeDilated, fSizeDilated])
            ], 2),
            tf.stack([
                tf.tensor2d([0.294087, 0, 0.181165, 0, 0, 0, 0.191303, 0, 0.7225], [fSizeDilated, fSizeDilated]),
                tf.tensor2d([0.430064, 0, 0.900622, 0, 0, 0, 0.670338, 0, 0.33478], [fSizeDilated, fSizeDilated])
            ], 2)
        ], 3);
        var result = tf.depthwiseConv2d(x, w, stride, pad, 'NHWC', dilation);
        var expectedResult = tf.depthwiseConv2d(x, wDilated, stride, pad, 'NHWC', noDilation);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(result, expectedResult);
    });
    it('Tensor3D is allowed', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var chMul = 3;
        var inDepth = 2;
        var x = tf.zeros([3, 3, inDepth]);
        var w = tf.zeros([fSize, fSize, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad);
        expect(result.shape).toEqual([3, 3, inDepth * chMul]);
    });
    it('Pass null for dilations, which defaults to [1, 1]', function () {
        var fSize = 2;
        var pad = 'same';
        var stride = 1;
        var chMul = 3;
        var inDepth = 2;
        var dilations = null;
        var x = tf.zeros([3, 3, inDepth]);
        var w = tf.zeros([fSize, fSize, inDepth, chMul]);
        var result = tf.depthwiseConv2d(x, w, stride, pad, 'NHWC', dilations);
        expect(result.shape).toEqual([3, 3, inDepth * chMul]);
    });
    it('throws when passed x as a non-tensor', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var fSize = 1;
        var pad = 'same';
        var stride = 2;
        var dataFormat = 'NHWC';
        var dilation = 2;
        var w = tf.tensor4d([3], [fSize, fSize, inputDepth, outputDepth]);
        var e = /Argument 'x' passed to 'depthwiseConv2d' must be a Tensor/;
        expect(function () { return tf.depthwiseConv2d({}, w, stride, pad, dataFormat, dilation); })
            .toThrowError(e);
    });
    it('throws when passed filter as a non-tensor', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, inputDepth];
        var pad = 'same';
        var stride = 2;
        var dataFormat = 'NHWC';
        var dilation = 2;
        var x = tf.tensor3d([1, 2, 3, 4], inputShape);
        var e = /Argument 'filter' passed to 'depthwiseConv2d' must be a Tensor/;
        expect(function () { return tf.depthwiseConv2d(x, {}, stride, pad, dataFormat, dilation); })
            .toThrowError(e);
    });
});
describeWithFlags('depthwiseConv2d gradients', ALL_ENVS, function () {
    var images;
    var filter;
    var result;
    var stride = 1;
    var pad = 'same';
    beforeEach(function () {
        images = tf.tensor4d([[
                [[2, 3, 1], [3, 0, 2]],
                [[0, 4, 1], [3, 1, 3]]
            ], [
                [[2, 1, 0], [0, 3, 3]],
                [[4, 0, 1], [1, 4, 1]]
            ]]);
        filter = tf.tensor4d([[
                [[1, 1], [1, 1], [0, 0]],
                [[0, 1], [1, 1], [1, 1]]
            ], [
                [[1, 0], [1, 1], [0, 0]],
                [[0, 1], [1, 0], [0, 0]]
            ]]);
        result = tf.tensor4d([[
                [[2, 8, 8, 7, 2, 2], [6, 3, 1, 1, 0, 0]],
                [[0, 3, 5, 5, 3, 3], [3, 3, 1, 1, 0, 0]]
            ], [
                [[6, 3, 8, 4, 3, 3], [1, 0, 7, 7, 0, 0]],
                [[4, 5, 4, 4, 1, 1], [1, 1, 4, 4, 0, 0]]
            ]]);
    });
    it('wrt input', function () {
        var _a = tf.valueAndGrad(function (x) { return tf.depthwiseConv2d(x, filter, stride, pad); })(images), value = _a.value, grad = _a.grad;
        expectArraysClose(value, result);
        var expectedGrad = tf.tensor4d([[
                [[2., 2., 0.], [3., 4., 2.]],
                [[3., 4., 0.], [5., 7., 2.]]
            ], [
                [[2., 2., 0.], [3., 4., 2.]],
                [[3., 4., 0.], [5., 7., 2.]]
            ]]);
        expectArraysClose(grad, expectedGrad);
    });
    it('wrt input, squared output', function () {
        var grad = tf.grad(function (x) { return tf.square(tf.depthwiseConv2d(x, filter, stride, pad)); })(images);
        var expectedGrad = tf.tensor4d([[
                [[20., 30., 0.], [34., 34., 8.]],
                [[10., 50., 0.], [46., 44., 12.]]
            ], [
                [[18., 24., 0.], [8., 52., 12.]],
                [[30., 40., 0.], [22., 76., 4.]]
            ]]);
        expectArraysClose(grad, expectedGrad);
    });
    it('wrt filter', function () {
        var _a = tf.valueAndGrad(function (f) { return tf.depthwiseConv2d(images, f, stride, pad); })(filter), value = _a.value, grad = _a.grad;
        expectArraysClose(value, result);
        var expectedGrad = tf.tensor4d([[
                [[15., 15.], [16., 16.], [12., 12.]],
                [[7., 7.], [8., 8.], [9., 9.]]
            ], [
                [[8., 8.], [9., 9.], [6., 6.]],
                [[4., 4.], [5., 5.], [4., 4.]]
            ]]);
        expectArraysClose(grad, expectedGrad);
    });
    it('wrt filter, squared output', function () {
        var grad = tf.grad(function (f) { return tf.square(tf.depthwiseConv2d(images, f, stride, pad)); })(filter);
        var expectedGrad = tf.tensor4d([[
                [[120., 122.], [180., 166.], [12., 12.]],
                [[20., 76.], [90., 66.], [46., 46.]]
            ], [
                [[86., 42.], [122., 114.], [10., 10.]],
                [[24., 54.], [80., 46.], [18., 18.]]
            ]]);
        expectArraysClose(grad, expectedGrad);
    });
    it('throws error on dilations > 1', function () {
        var grad = tf.grad(function (x) { return tf.depthwiseConv2d(x, filter, stride, pad, 'NHWC', 2); });
        expect(function () { return grad(images); })
            .toThrowError(/dilation rates greater than 1 are not yet supported/);
    });
    it('wrt input, stride=2, pad=valid', function () {
        var dx = tf.grad(function (x) { return tf.depthwiseConv2d(x, filter, 2, 'valid'); })(images);
        expectArraysClose(dx, tf.tensor4d([[
                [[2., 2., 0.], [1., 2., 2.]],
                [[1., 2., 0.], [1., 1., 0.]]
            ], [
                [[2., 2., 0.], [1., 2., 2.]],
                [[1., 2., 0.], [1., 1., 0.]]
            ]]));
    });
    it('wrt filter, stride=2, pad=valid', function () {
        var df = tf.grad(function (f) { return tf.depthwiseConv2d(images, f, 2, 'valid'); })(filter);
        expectArraysClose(df, tf.tensor4d([[
                [[4., 4.], [4., 4.], [1., 1.]],
                [[3., 3.], [3., 3.], [5., 5.]]
            ], [
                [[4., 4.], [4., 4.], [2., 2.]],
                [[4., 4.], [5., 5.], [4., 4.]]
            ]]));
    });
    it('wrt input and filter, 1x3x3x1 and 2x2x1x1', function () {
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var chMul = 1;
        var inDepth = 1;
        var x = tf.tensor4d([
            0.230664, 0.987388, 0.0685208, 0.419224, 0.887861, 0.731641,
            0.0741907, 0.409265, 0.351377
        ], [1, 3, 3, inDepth]);
        var f = tf.tensor4d([0.303873, 0.229223, 0.144333, 0.803373], [fSize, fSize, inDepth, chMul]);
        var _a = tf.grads(function (x, f) { return tf.depthwiseConv2d(x, f, stride, pad); })([x, f]), dx = _a[0], df = _a[1];
        expectArraysClose(dx, tf.tensor4d([[
                [[0.303873], [0.533096], [0.229223]],
                [[0.448206], [1.480802], [1.032596]],
                [[0.144333], [0.947706], [0.803373]]
            ]]));
        expectArraysClose(df, tf.tensor4d([
            [[[2.525137]], [[2.6754108]]
            ], [
                [[1.7905407]], [[2.380144]]
            ]
        ]));
    });
});
//# sourceMappingURL=conv2d_depthwise_test.js.map