import * as tf from '../index';
import { ALL_ENVS, expectArraysClose, expectNumbersClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('softmax', ALL_ENVS, function () {
    it('regular test', function () {
        var y = tf.softmax(tf.tensor1d([2, 1, 3]));
        expectArraysClose(y, [0.24472847, 0.09003057, 0.66524095]);
        expectNumbersClose(y.get(0) + y.get(1) + y.get(2), 1);
    });
    it('overflow', function () {
        var y = tf.softmax(tf.tensor1d([1000, 1000]));
        expectArraysClose(y, [0.5, 0.5]);
    });
    it('underflow', function () {
        var y = tf.softmax(tf.tensor1d([-1000, -1000]));
        expectArraysClose(y, [0.5, 0.5]);
    });
    it('Huge difference between probabilities', function () {
        var y = tf.softmax(tf.tensor1d([-1000, +1000]));
        expectArraysClose(y, [0, 1]);
    });
    it('Propagates NaNs', function () {
        var a = tf.tensor1d([2, 1, NaN]);
        var y = tf.softmax(a);
        expectArraysClose(y, [NaN, NaN, NaN]);
    });
    it('2D, dim=1', function () {
        var y = tf.softmax(tf.tensor2d([[2, 1, 3], [1, 3, 2]], [2, 3]), 1);
        var expected = [
            0.24472847, 0.09003057, 0.66524095, 0.09003057, 0.66524095, 0.24472847
        ];
        expect(y.rank).toBe(2);
        expectArraysClose(y, expected);
    });
    it('2D, implicit dim=1', function () {
        var y = tf.softmax(tf.tensor2d([[2, 1, 3], [1, 3, 2]], [2, 3]));
        var expected = [
            0.24472847, 0.09003057, 0.66524095, 0.09003057, 0.66524095, 0.24472847
        ];
        expect(y.rank).toBe(2);
        expectArraysClose(y, expected);
    });
    it('2D, dim=0 throws error', function () {
        var f = function () {
            tf.softmax(tf.tensor2d([[2, 1, 3], [1, 3, 2]], [2, 3]), 0);
        };
        expect(f).toThrowError();
    });
    it('1D gradient', function () {
        var x = tf.tensor1d([10, 0, -1]);
        var y = tf.softmax(x);
        var dy = tf.tensor1d([1, 2, 3]);
        var dx = tf.grad(function (x) { return x.softmax(); })(x, dy);
        var totalSum = tf.sum(tf.mul(dy, y));
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [
            (dy.get(0) - totalSum.get()) * y.get(0),
            (dy.get(1) - totalSum.get()) * y.get(1),
            (dy.get(2) - totalSum.get()) * y.get(2)
        ]);
    });
    it('2D gradient', function () {
        var x = tf.tensor2d([10, 0, -1, 5, 4, 3], [2, 3]);
        var y = tf.softmax(x);
        var dy = tf.tensor2d([3, 2, 1, 1, 2, 3], [2, 3]);
        var dx = tf.grad(function (x) { return x.softmax(); })(x, dy);
        var axis = -1;
        var totalSum = tf.sum(tf.mulStrict(dy, y), axis);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(dx, [
            (dy.get(0, 0) - totalSum.get(0)) * y.get(0, 0),
            (dy.get(0, 1) - totalSum.get(0)) * y.get(0, 1),
            (dy.get(0, 2) - totalSum.get(0)) * y.get(0, 2),
            (dy.get(1, 0) - totalSum.get(1)) * y.get(1, 0),
            (dy.get(1, 1) - totalSum.get(1)) * y.get(1, 1),
            (dy.get(1, 2) - totalSum.get(1)) * y.get(1, 2)
        ]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.softmax({}); })
            .toThrowError(/Argument 'logits' passed to 'softmax' must be a Tensor/);
    });
});
describeWithFlags('softmaxCrossEntropy', ALL_ENVS, function () {
    it('1D', function () {
        var logits = tf.tensor1d([1, 2, 3]);
        var label = tf.tensor1d([0.3, 0.6, 0.1]);
        var softmaxLogits = tf.softmax(logits);
        var y = tf.losses.softmaxCrossEntropy(label, logits);
        expect(y.shape).toEqual([]);
        expectNumbersClose(y.get(), -Math.log(softmaxLogits.get(0)) * label.get(0) +
            -Math.log(softmaxLogits.get(1)) * label.get(1) +
            -Math.log(softmaxLogits.get(2)) * label.get(2));
    });
    it('2D implicit dim', function () {
        var logits = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var label = tf.tensor2d([0.3, 0.6, 0.1, 0.2, 0.3, 0.5], [2, 3]);
        var softmaxLogits = tf.softmax(logits);
        var y = tf.losses.softmaxCrossEntropy(label, logits);
        expect(y.shape).toEqual([2]);
        expectArraysClose(y, [
            -Math.log(softmaxLogits.get(0, 0)) * label.get(0, 0) +
                -Math.log(softmaxLogits.get(0, 1)) * label.get(0, 1) +
                -Math.log(softmaxLogits.get(0, 2)) * label.get(0, 2),
            -Math.log(softmaxLogits.get(1, 0)) * label.get(1, 0) +
                -Math.log(softmaxLogits.get(1, 1)) * label.get(1, 1) +
                -Math.log(softmaxLogits.get(1, 2)) * label.get(1, 2)
        ]);
    });
    it('2D, dim=1', function () {
        var logits = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var label = tf.tensor2d([0.3, 0.6, 0.1, 0.2, 0.3, 0.5], [2, 3]);
        var dim = 1;
        var softmaxLogits = tf.softmax(logits, dim);
        var y = tf.losses.softmaxCrossEntropy(label, logits, dim);
        expect(y.shape).toEqual([2]);
        expectArraysClose(y, [
            -Math.log(softmaxLogits.get(0, 0)) * label.get(0, 0) +
                -Math.log(softmaxLogits.get(0, 1)) * label.get(0, 1) +
                -Math.log(softmaxLogits.get(0, 2)) * label.get(0, 2),
            -Math.log(softmaxLogits.get(1, 0)) * label.get(1, 0) +
                -Math.log(softmaxLogits.get(1, 1)) * label.get(1, 1) +
                -Math.log(softmaxLogits.get(1, 2)) * label.get(1, 2)
        ]);
    });
    it('2D, dim=0 throws error', function () {
        var logits = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var label = tf.tensor2d([0.3, 0.6, 0.1, 0.2, 0.3, 0.5], [2, 3]);
        var dim = 0;
        expect(function () { return tf.losses.softmaxCrossEntropy(label, logits, dim); })
            .toThrowError();
    });
    it('Propagates NaNs', function () {
        var logits = tf.tensor1d([1, 2, NaN]);
        var label = tf.tensor1d([0.3, 0.6, 0.1]);
        var y = tf.losses.softmaxCrossEntropy(label, logits);
        expect(y.shape).toEqual([]);
        expectArraysClose(y, [NaN]);
    });
    it('1D gradient', function () {
        var logits = tf.tensor1d([1, 2, 3]);
        var labels = tf.tensor1d([0.3, 0.6, 0.1]);
        var softmaxLogits = tf.softmax(logits);
        var dy = tf.scalar(2);
        var grads = tf.grads(function (labels, logits) { return tf.losses.softmaxCrossEntropy(labels, logits); });
        var _a = grads([labels, logits], dy), dlabels = _a[0], dlogits = _a[1];
        expect(dlogits.shape).toEqual(logits.shape);
        expectArraysClose(dlogits, [
            dy.get() * (softmaxLogits.get(0) - labels.get(0)),
            dy.get() * (softmaxLogits.get(1) - labels.get(1)),
            dy.get() * (softmaxLogits.get(2) - labels.get(2))
        ]);
        expect(dlabels.shape).toEqual(labels.shape);
        expectArraysClose(dlabels, [
            dy.get() * (labels.get(0) - softmaxLogits.get(0)),
            dy.get() * (labels.get(1) - softmaxLogits.get(1)),
            dy.get() * (labels.get(2) - softmaxLogits.get(2))
        ]);
    });
    it('2D gradient', function () {
        var logits = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var labels = tf.tensor2d([0.3, 0.6, 0.1, .2, .3, .5], [2, 3]);
        var softmaxLogits = tf.softmax(logits);
        var dy = tf.tensor1d([2, 4]);
        var dlogits = tf.grad(function (logits) { return tf.losses.softmaxCrossEntropy(labels, logits); })(logits, dy);
        expect(dlogits.shape).toEqual(logits.shape);
        expectArraysClose(dlogits, [
            dy.get(0) * (softmaxLogits.get(0, 0) - labels.get(0, 0)),
            dy.get(0) * (softmaxLogits.get(0, 1) - labels.get(0, 1)),
            dy.get(0) * (softmaxLogits.get(0, 2) - labels.get(0, 2)),
            dy.get(1) * (softmaxLogits.get(1, 0) - labels.get(1, 0)),
            dy.get(1) * (softmaxLogits.get(1, 1) - labels.get(1, 1)),
            dy.get(1) * (softmaxLogits.get(1, 2) - labels.get(1, 2))
        ]);
    });
    it('throws when passed labels as a non-tensor', function () {
        var e = /Argument 'labels' passed to 'softmaxCrossEntropy' must be a Tensor/;
        expect(function () { return tf.losses.softmaxCrossEntropy({}, tf.tensor1d([
            1
        ])); }).toThrowError(e);
    });
    it('throws when passed logits as a non-tensor', function () {
        var e = /Argument 'logits' passed to 'softmaxCrossEntropy' must be a Tensor/;
        expect(function () { return tf.losses.softmaxCrossEntropy(tf.tensor1d([1]), {}); })
            .toThrowError(e);
    });
});
//# sourceMappingURL=softmax_test.js.map