import * as tf from '../index';
import { ALL_ENVS, CPU_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('lstm', ALL_ENVS, function () {
    it('MultiRNNCell with 2 BasicLSTMCells', function () {
        var lstmKernel1 = tf.tensor2d([
            0.26242125034332275, -0.8787832260131836, 0.781475305557251,
            1.337337851524353, 0.6180247068405151, -0.2760246992111206,
            -0.11299663782119751, -0.46332040429115295, -0.1765323281288147,
            0.6807947158813477, -0.8326982855796814, 0.6732975244522095
        ], [3, 4]);
        var lstmBias1 = tf.tensor1d([1.090713620185852, -0.8282332420349121, 0, 1.0889357328414917]);
        var lstmKernel2 = tf.tensor2d([
            -1.893059492111206, -1.0185645818710327, -0.6270437240600586,
            -2.1829540729522705, -0.4583775997161865, -0.5454602241516113,
            -0.3114445209503174, 0.8450229167938232
        ], [2, 4]);
        var lstmBias2 = tf.tensor1d([0.9906240105628967, 0.6248329877853394, 0, 1.0224634408950806]);
        var forgetBias = tf.scalar(1.0);
        var lstm1 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel1, lstmBias1, data, c, h);
        };
        var lstm2 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel2, lstmBias2, data, c, h);
        };
        var c = [
            tf.zeros([1, lstmBias1.shape[0] / 4]),
            tf.zeros([1, lstmBias2.shape[0] / 4])
        ];
        var h = [
            tf.zeros([1, lstmBias1.shape[0] / 4]),
            tf.zeros([1, lstmBias2.shape[0] / 4])
        ];
        var onehot = tf.buffer([1, 2], 'float32');
        onehot.set(1.0, 0, 0);
        var output = tf.multiRNNCell([lstm1, lstm2], onehot.toTensor(), c, h);
        expectArraysClose(output[0][0], [-0.7440074682235718]);
        expectArraysClose(output[0][1], [0.7460772395133972]);
        expectArraysClose(output[1][0], [-0.5802832245826721]);
        expectArraysClose(output[1][1], [0.5745711922645569]);
    });
    it('basicLSTMCell with batch=2', function () {
        var lstmKernel = tf.randomNormal([3, 4]);
        var lstmBias = tf.randomNormal([4]);
        var forgetBias = tf.scalar(1.0);
        var data = tf.randomNormal([1, 2]);
        var batchedData = tf.concat2d([data, data], 0);
        var c = tf.randomNormal([1, 1]);
        var batchedC = tf.concat2d([c, c], 0);
        var h = tf.randomNormal([1, 1]);
        var batchedH = tf.concat2d([h, h], 0);
        var _a = tf.basicLSTMCell(forgetBias, lstmKernel, lstmBias, batchedData, batchedC, batchedH), newC = _a[0], newH = _a[1];
        expect(newC.get(0, 0)).toEqual(newC.get(1, 0));
        expect(newH.get(0, 0)).toEqual(newH.get(1, 0));
    });
});
describeWithFlags('multiRNN throws when passed non-tensor', CPU_ENVS, function () {
    it('input: data', function () {
        var lstmKernel1 = tf.zeros([3, 4]);
        var lstmBias1 = tf.zeros([4]);
        var lstmKernel2 = tf.zeros([2, 4]);
        var lstmBias2 = tf.zeros([4]);
        var forgetBias = tf.scalar(1.0);
        var lstm1 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel1, lstmBias1, data, c, h);
        };
        var lstm2 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel2, lstmBias2, data, c, h);
        };
        var c = [
            tf.zeros([1, lstmBias1.shape[0] / 4]),
            tf.zeros([1, lstmBias2.shape[0] / 4])
        ];
        var h = [
            tf.zeros([1, lstmBias1.shape[0] / 4]),
            tf.zeros([1, lstmBias2.shape[0] / 4])
        ];
        expect(function () { return tf.multiRNNCell([lstm1, lstm2], {}, c, h); })
            .toThrowError(/Argument 'data' passed to 'multiRNNCell' must be a Tensor/);
    });
    it('input: c', function () {
        var lstmKernel1 = tf.zeros([3, 4]);
        var lstmBias1 = tf.zeros([4]);
        var lstmKernel2 = tf.zeros([2, 4]);
        var lstmBias2 = tf.zeros([4]);
        var forgetBias = tf.scalar(1.0);
        var lstm1 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel1, lstmBias1, data, c, h);
        };
        var lstm2 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel2, lstmBias2, data, c, h);
        };
        var h = [
            tf.zeros([1, lstmBias1.shape[0] / 4]),
            tf.zeros([1, lstmBias2.shape[0] / 4])
        ];
        var data = tf.zeros([1, 2]);
        expect(function () { return tf.multiRNNCell([lstm1, lstm2], data, [{}], h); })
            .toThrowError(/Argument 'c\[0\]' passed to 'multiRNNCell' must be a Tensor/);
    });
    it('input: h', function () {
        var lstmKernel1 = tf.zeros([3, 4]);
        var lstmBias1 = tf.zeros([4]);
        var lstmKernel2 = tf.zeros([2, 4]);
        var lstmBias2 = tf.zeros([4]);
        var forgetBias = tf.scalar(1.0);
        var lstm1 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel1, lstmBias1, data, c, h);
        };
        var lstm2 = function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lstmKernel2, lstmBias2, data, c, h);
        };
        var c = [
            tf.zeros([1, lstmBias1.shape[0] / 4]),
            tf.zeros([1, lstmBias2.shape[0] / 4])
        ];
        var data = tf.zeros([1, 2]);
        expect(function () { return tf.multiRNNCell([lstm1, lstm2], data, c, [{}]); })
            .toThrowError(/Argument 'h\[0\]' passed to 'multiRNNCell' must be a Tensor/);
    });
});
describeWithFlags('basicLSTMCell throws with non-tensor', CPU_ENVS, function () {
    it('input: forgetBias', function () {
        var lstmKernel = tf.randomNormal([3, 4]);
        var lstmBias = tf.randomNormal([4]);
        var data = tf.randomNormal([1, 2]);
        var batchedData = tf.concat2d([data, data], 0);
        var c = tf.randomNormal([1, 1]);
        var batchedC = tf.concat2d([c, c], 0);
        var h = tf.randomNormal([1, 1]);
        var batchedH = tf.concat2d([h, h], 0);
        expect(function () { return tf.basicLSTMCell({}, lstmKernel, lstmBias, batchedData, batchedC, batchedH); })
            .toThrowError(/Argument 'forgetBias' passed to 'basicLSTMCell' must be a Tensor/);
    });
    it('input: lstmKernel', function () {
        var lstmBias = tf.randomNormal([4]);
        var forgetBias = tf.scalar(1.0);
        var data = tf.randomNormal([1, 2]);
        var batchedData = tf.concat2d([data, data], 0);
        var c = tf.randomNormal([1, 1]);
        var batchedC = tf.concat2d([c, c], 0);
        var h = tf.randomNormal([1, 1]);
        var batchedH = tf.concat2d([h, h], 0);
        expect(function () { return tf.basicLSTMCell(forgetBias, {}, lstmBias, batchedData, batchedC, batchedH); })
            .toThrowError(/Argument 'lstmKernel' passed to 'basicLSTMCell' must be a Tensor/);
    });
    it('input: lstmBias', function () {
        var lstmKernel = tf.randomNormal([3, 4]);
        var forgetBias = tf.scalar(1.0);
        var data = tf.randomNormal([1, 2]);
        var batchedData = tf.concat2d([data, data], 0);
        var c = tf.randomNormal([1, 1]);
        var batchedC = tf.concat2d([c, c], 0);
        var h = tf.randomNormal([1, 1]);
        var batchedH = tf.concat2d([h, h], 0);
        expect(function () { return tf.basicLSTMCell(forgetBias, lstmKernel, {}, batchedData, batchedC, batchedH); })
            .toThrowError(/Argument 'lstmBias' passed to 'basicLSTMCell' must be a Tensor/);
    });
    it('input: data', function () {
        var lstmKernel = tf.randomNormal([3, 4]);
        var lstmBias = tf.randomNormal([4]);
        var forgetBias = tf.scalar(1.0);
        var c = tf.randomNormal([1, 1]);
        var batchedC = tf.concat2d([c, c], 0);
        var h = tf.randomNormal([1, 1]);
        var batchedH = tf.concat2d([h, h], 0);
        expect(function () { return tf.basicLSTMCell(forgetBias, lstmKernel, lstmBias, {}, batchedC, batchedH); })
            .toThrowError(/Argument 'data' passed to 'basicLSTMCell' must be a Tensor/);
    });
    it('input: c', function () {
        var lstmKernel = tf.randomNormal([3, 4]);
        var lstmBias = tf.randomNormal([4]);
        var forgetBias = tf.scalar(1.0);
        var data = tf.randomNormal([1, 2]);
        var batchedData = tf.concat2d([data, data], 0);
        var h = tf.randomNormal([1, 1]);
        var batchedH = tf.concat2d([h, h], 0);
        expect(function () { return tf.basicLSTMCell(forgetBias, lstmKernel, lstmBias, batchedData, {}, batchedH); })
            .toThrowError(/Argument 'c' passed to 'basicLSTMCell' must be a Tensor/);
    });
    it('input: h', function () {
        var lstmKernel = tf.randomNormal([3, 4]);
        var lstmBias = tf.randomNormal([4]);
        var forgetBias = tf.scalar(1.0);
        var data = tf.randomNormal([1, 2]);
        var batchedData = tf.concat2d([data, data], 0);
        var c = tf.randomNormal([1, 1]);
        var batchedC = tf.concat2d([c, c], 0);
        expect(function () { return tf.basicLSTMCell(forgetBias, lstmKernel, lstmBias, batchedData, batchedC, {}); })
            .toThrowError(/Argument 'h' passed to 'basicLSTMCell' must be a Tensor/);
    });
});
//# sourceMappingURL=lstm_test.js.map