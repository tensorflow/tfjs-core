import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose, WEBGL_ENVS } from '../test_util';
describeWithFlags('gramSchmidt-tiny', ALL_ENVS, function () {
    it('2x2, Array of Tensor1D', function () {
        var xs = [tf.randomNormal([2]), tf.randomNormal([2])];
        var ys = tf.linalg.gramSchmidt(xs);
        var y = tf.stack(ys);
        expectArraysClose(y.transpose().matMul(y), tf.eye(2));
        expectArraysClose(tf.sum(xs[0].mul(ys[0])), tf.norm(xs[0]).mul(tf.norm(ys[0])));
    });
    it('3x3, Array of Tensor1D', function () {
        var xs = [tf.randomNormal([3]), tf.randomNormal([3]), tf.randomNormal([3])];
        var ys = tf.linalg.gramSchmidt(xs);
        var y = tf.stack(ys);
        expectArraysClose(y.transpose().matMul(y), tf.eye(3));
        expectArraysClose(tf.sum(xs[0].mul(ys[0])), tf.norm(xs[0]).mul(tf.norm(ys[0])));
    });
    it('3x3, Matrix', function () {
        var xs = tf.randomNormal([3, 3]);
        var y = tf.linalg.gramSchmidt(xs);
        expectArraysClose(y.transpose().matMul(y), tf.eye(3));
    });
    it('2x3, Matrix', function () {
        var xs = tf.randomNormal([2, 3]);
        var y = tf.linalg.gramSchmidt(xs);
        expectArraysClose(y.matMul(y.transpose()), tf.eye(2));
    });
    it('3x2 Matrix throws Error', function () {
        var xs = tf.tensor2d([[1, 2], [3, -1], [5, 1]]);
        expect(function () { return tf.linalg.gramSchmidt(xs); })
            .toThrowError(/Number of vectors \(3\) exceeds number of dimensions \(2\)/);
    });
    it('Mismatching dimensions input throws Error', function () {
        var xs = [tf.tensor1d([1, 2, 3]), tf.tensor1d([-1, 5, 1]), tf.tensor1d([0, 0])];
        expect(function () { return tf.linalg.gramSchmidt(xs); }).toThrowError(/Non-unique/);
    });
    it('Empty input throws Error', function () {
        expect(function () { return tf.linalg.gramSchmidt([]); }).toThrowError(/empty/);
    });
});
describeWithFlags('gramSchmidt-non-tiny', WEBGL_ENVS, function () {
    it('32x512', function () {
        var xs = tf.randomUniform([32, 512]);
        var y = tf.linalg.gramSchmidt(xs);
        expectArraysClose(y.matMul(y.transpose()), tf.eye(32));
    });
});
//# sourceMappingURL=linalg_ops_test.js.map