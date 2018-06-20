import * as conv_util from './conv_util';
describe('conv_util computeConvInfo', function () {
    it('1x1 conv over 1x1 array with same pad', function () {
        var inShape = [1, 1, 1, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [1, 1, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2 conv over 3x3 array with same pad', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2 conv over 3x3 array with same pad', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2 conv over 3x3 array with valid pad', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('3x3 conv over 5x5 array with same pad with stride 2', function () {
        var inShape = [1, 5, 5, 1];
        var stride = 2;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [3, 3, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.left).toBe(1);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2 conv over 3x3 array with valid pad with stride 2', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 2;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x1 conv over 3x3 array with valid pad with stride 1', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x1 conv over 3x3 array with valid pad with strides h=2, w=1', function () {
        var inShape = [1, 3, 3, 1];
        var strides = [2, 1];
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], strides, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('1x2 conv over 3x3 array with valid pad with stride 1', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [1, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('1x2 conv over 3x3 array with valid pad with stride 1, batch=5', function () {
        var inShape = [5, 3, 3, 1];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [1, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(5);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2 conv over 3x3 array with same pad with dilations 2', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilations = 2;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.left).toBe(1);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x1 conv over 3x3 array with same pad with dilations 2', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilations = 2;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(0);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('3x4 conv over 8x8 array with same pad with dilations h=4 w=3', function () {
        var inShape = [1, 8, 8, 1];
        var stride = 1;
        var dilations = [4, 3];
        var convInfo = conv_util.computeConv2DInfo(inShape, [3, 4, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(8);
        expect(convInfo.outWidth).toEqual(8);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.left).toBe(4);
        expect(convInfo.padInfo.right).toBe(5);
        expect(convInfo.padInfo.top).toBe(4);
        expect(convInfo.padInfo.bottom).toBe(4);
    });
    it('2x1 conv over 3x3 array with valid pad with dilations 2', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilations = 2;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2 conv over 3x3 array with valid pad with dilations 2', function () {
        var inShape = [1, 3, 3, 1];
        var stride = 1;
        var dilations = 2;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2 conv over 4x4 array with valid pad with dilations 2', function () {
        var inShape = [1, 4, 4, 1];
        var stride = 1;
        var dilations = 2;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
});
describe('conv_util computeConv2DInfo with depthwise=true', function () {
    it('1x1 filter over 1x1 array with same pad', function () {
        var inChannels = 1;
        var inShape = [1, 1, 1, inChannels];
        var fSize = 1;
        var chMul = 1;
        var stride = 1;
        var dilation = 1;
        var pad = 'same';
        var convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, null, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2 filter over 3x3 array with same pad, chMul=3, depth=2', function () {
        var inChannels = 2;
        var batchSize = 1;
        var inSize = 3;
        var inShape = [batchSize, inSize, inSize, inChannels];
        var fSize = 2;
        var chMul = 3;
        var stride = 1;
        var dilation = 1;
        var pad = 'same';
        var convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, null, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(6);
    });
    it('2x2 filter over 3x3 array with valid pad, chMul=3, depth=2', function () {
        var inChannels = 2;
        var batchSize = 1;
        var inSize = 3;
        var inShape = [batchSize, inSize, inSize, inChannels];
        var fSize = 2;
        var chMul = 3;
        var stride = 1;
        var dilation = 1;
        var pad = 'valid';
        var convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, null, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(6);
    });
});
describe('conv_util computeConvInfo channelsFirst', function () {
    it('2x2 conv over 3x3 array with same pad', function () {
        var inDepth = 2;
        var outDepth = 4;
        var inShape = [1, inDepth, 3, 3];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, inDepth, outDepth], stride, dilation, 'same', null, false, 'channelsFirst');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(4);
        expect(convInfo.outShape).toEqual([1, 4, 3, 3]);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2 conv over 3x3 array with valid pad', function () {
        var inDepth = 6;
        var outDepth = 16;
        var inShape = [1, inDepth, 3, 3];
        var stride = 1;
        var dilation = 1;
        var convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, inDepth, outDepth], stride, dilation, 'valid', null, false, 'channelsFirst');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(16);
        expect(convInfo.outShape).toEqual([1, 16, 2, 2]);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(0);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(0);
    });
});
describe('conv_util computeConvInfo roundingMode', function () {
    var inChannels = 6;
    var batchSize = 1;
    var inSize = 5;
    var inShape = [batchSize, inSize, inSize, inChannels];
    var fSize = 2;
    var chMul = 12;
    var stride = 2;
    var dilation = 1;
    var pad = 1;
    it('should fail computing the output dimension of Conv Layer', function () {
        expect(function () { return conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad); })
            .toThrowError();
    });
    it('Floor the output dimension of Conv Layer', function () {
        var convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, 'floor');
        expect(convInfo.outShape).toEqual([batchSize, 3, 3, chMul]);
    });
    it('Round the output dimension of Conv Layer', function () {
        var convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, 'round');
        expect(convInfo.outShape).toEqual([batchSize, 4, 4, chMul]);
    });
    it('Ceil the output dimension of Conv Layer', function () {
        var convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, 'ceil');
        expect(convInfo.outShape).toEqual([batchSize, 4, 4, chMul]);
    });
});
describe('conv_util computePoolInfo roundingMode', function () {
    var inChannels = 6;
    var batchSize = 1;
    var inSize = 5;
    var inShape = [batchSize, inSize, inSize, inChannels];
    var fSize = 2;
    var stride = 2;
    var pad = 1;
    it('should fail computing the output dimension of Pool Layer', function () {
        expect(function () { return conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad); })
            .toThrowError();
    });
    it('Floor the output dimension of Pool Layer', function () {
        var poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, 'floor');
        expect(poolInfo.outShape).toEqual([batchSize, 3, 3, inChannels]);
    });
    it('Round the output dimension of Pool Layer', function () {
        var poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, 'round');
        expect(poolInfo.outShape).toEqual([batchSize, 4, 4, inChannels]);
    });
    it('Ceil the output dimension of Pool Layer', function () {
        var poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, 'ceil');
        expect(poolInfo.outShape).toEqual([batchSize, 4, 4, inChannels]);
    });
});
//# sourceMappingURL=conv_util_test.js.map