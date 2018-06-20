import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { ALL_ENVS, expectArraysClose } from '../test_util';
describeWithFlags('transpose', ALL_ENVS, function () {
    it('of scalar is no-op', function () {
        var a = tf.scalar(3);
        expectArraysClose(tf.transpose(a), [3]);
    });
    it('of 1D is no-op', function () {
        var a = tf.tensor1d([1, 2, 3]);
        expectArraysClose(tf.transpose(a), [1, 2, 3]);
    });
    it('of scalar with perm of incorrect rank throws error', function () {
        var a = tf.scalar(3);
        var perm = [0];
        expect(function () { return tf.transpose(a, perm); }).toThrowError();
    });
    it('of 1d with perm out of bounds throws error', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var perm = [1];
        expect(function () { return tf.transpose(a, perm); }).toThrowError();
    });
    it('of 1d with perm incorrect rank throws error', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var perm = [0, 0];
        expect(function () { return tf.transpose(a, perm); }).toThrowError();
    });
    it('2D (no change)', function () {
        var t = tf.tensor2d([1, 11, 2, 22, 3, 33, 4, 44], [2, 4]);
        var t2 = tf.transpose(t, [0, 1]);
        expect(t2.shape).toEqual(t.shape);
        expectArraysClose(t2, t);
    });
    it('2D (transpose)', function () {
        var t = tf.tensor2d([1, 11, 2, 22, 3, 33, 4, 44], [2, 4]);
        var t2 = tf.transpose(t, [1, 0]);
        expect(t2.shape).toEqual([4, 2]);
        expectArraysClose(t2, [1, 3, 11, 33, 2, 4, 22, 44]);
    });
    it('3D [r, c, d] => [d, r, c]', function () {
        var t = tf.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
        var t2 = tf.transpose(t, [2, 0, 1]);
        expect(t2.shape).toEqual([2, 2, 2]);
        expectArraysClose(t2, [1, 2, 3, 4, 11, 22, 33, 44]);
    });
    it('3D [r, c, d] => [d, c, r]', function () {
        var t = tf.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
        var t2 = tf.transpose(t, [2, 1, 0]);
        expect(t2.shape).toEqual([2, 2, 2]);
        expectArraysClose(t2, [1, 3, 2, 4, 11, 33, 22, 44]);
    });
    it('gradient 3D [r, c, d] => [d, c, r]', function () {
        var t = tf.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
        var perm = [2, 1, 0];
        var dy = tf.tensor3d([111, 211, 121, 221, 112, 212, 122, 222], [2, 2, 2]);
        var dt = tf.grad(function (t) { return t.transpose(perm); })(t, dy);
        expect(dt.shape).toEqual(t.shape);
        expect(dt.dtype).toEqual('float32');
        expectArraysClose(dt, [111, 112, 121, 122, 211, 212, 221, 222]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.transpose({}); })
            .toThrowError(/Argument 'x' passed to 'transpose' must be a Tensor/);
    });
});
//# sourceMappingURL=transpose_test.js.map