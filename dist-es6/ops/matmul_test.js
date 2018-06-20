import * as tf from '../index';
import { ALL_ENVS, expectArraysClose, expectNumbersClose, WEBGL_ENVS } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
import { MatmulOps } from './matmul';
describeWithFlags('matmul', ALL_ENVS, function () {
    it('A x B', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([0, 1, -3, 2, 2, 1], [3, 2]);
        var c = tf.matMul(a, b);
        expect(c.shape).toEqual([2, 2]);
        expectArraysClose(c, [0, 8, -3, 20]);
    });
    it('A x B^t', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([1, 0, 2, 4, 3, 0], [2, 3]);
        var transposeA = false;
        var transposeB = true;
        var c = tf.matMul(a, b, transposeA, transposeB);
        var expected = [7, 10, 16, 31];
        expectArraysClose(c, expected);
    });
    it('A^t x B', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([1, 0, 2, 4, 3, 0], [2, 3]);
        var transposeA = true;
        var transposeB = false;
        var c = tf.matMul(a, b, transposeA, transposeB);
        var expected = [17, 12, 2, 22, 15, 4, 27, 18, 6];
        expectArraysClose(c, expected);
    });
    it('A^t x B^t', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2]);
        var b = tf.tensor2d([1, 0, 2, 4, 3, 0], [2, 3]);
        var transposeA = true;
        var transposeB = true;
        var c = tf.matMul(a, b, transposeA, transposeB);
        var expected = [11, 13, 14, 20];
        expectArraysClose(c, expected);
    });
    it('A x B^t shapes do not match', function () {
        var a = tf.zeros([2, 3]);
        var b = tf.zeros([3, 2]);
        var f = function () {
            var transposeA = false;
            var transposeB = true;
            tf.matMul(a, b, transposeA, transposeB);
        };
        expect(f).toThrowError();
    });
    it('A^t x B shapes do not match', function () {
        var a = tf.zeros([2, 3]);
        var b = tf.zeros([3, 2]);
        var f = function () {
            var transposeA = true;
            var transposeB = false;
            tf.matMul(a, b, transposeA, transposeB);
        };
        expect(f).toThrowError();
    });
    it('A^t x B^t shapes do not match', function () {
        var a = tf.zeros([3, 2]);
        var b = tf.zeros([3, 2]);
        var f = function () {
            var transposeA = true;
            var transposeB = true;
            tf.matMul(a, b, transposeA, transposeB);
        };
        expect(f).toThrowError();
    });
    it('matmul throws when inner dimensions dont match', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([0, 1, -3, 2, 2, 1, 2, 2], [4, 2]);
        expect(function () { return tf.matMul(a, b); }).toThrowError();
    });
    it('matmul throws when passed non matrices', function () {
        var a = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
        var b = tf.tensor2d([0, 1, -3, 2, 2, 1, 2, 2], [4, 2]);
        expect(function () { return tf.matMul(a, b); }).toThrowError();
        expect(function () { return tf.matMul(b, a); }).toThrowError();
    });
    it('Vector times matrix', function () {
        var v = tf.tensor1d([2, 3]);
        var matrix = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var result = tf.vectorTimesMatrix(v, matrix);
        var expected = [11, 16];
        expectArraysClose(result, expected);
    });
    it('Vector times matrix with implicit reshape', function () {
        var v = tf.tensor1d([2, 3]);
        var matrix = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var result = tf.vectorTimesMatrix(v, matrix);
        var expected = [11, 16];
        expectArraysClose(result, expected);
    });
    it('Vector times matrix throws when not passed a vector', function () {
        var v = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var matrix = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        expect(function () { return tf.vectorTimesMatrix(v, matrix); }).toThrowError();
    });
    it('Vector times matrix throws when not passed a matrix', function () {
        var v = tf.tensor1d([2, 3]);
        var matrix = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        expect(function () { return tf.vectorTimesMatrix(v, matrix); }).toThrowError();
    });
    it('Matrix times vector', function () {
        var matrix = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var v = tf.tensor1d([2, 3]);
        var result = tf.matrixTimesVector(matrix, v);
        var expected = [8, 18];
        expectArraysClose(result, expected);
    });
    it('Matrix * vector propagates NaNs', function () {
        var matrix = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var v = tf.tensor1d([2, NaN]);
        var result = tf.matrixTimesVector(matrix, v);
        var expected = [NaN, NaN];
        expectArraysClose(result, expected);
    });
    it('matrix times vector throws when not passed a vector', function () {
        var v = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var matrix = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        expect(function () { return tf.matrixTimesVector(matrix, v); }).toThrowError();
    });
    it('matrix times vector throws when not passed a matrix', function () {
        var v = tf.tensor1d([2, 3]);
        var matrix = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        expect(function () { return tf.matrixTimesVector(matrix, v); }).toThrowError();
    });
    it('Dot product', function () {
        var v1 = tf.tensor1d([2, 3]);
        var v2 = tf.tensor1d([2, 1]);
        var result = MatmulOps.dotProduct(v1, v2);
        expectNumbersClose(result.get(), 7);
    });
    it('Dot product propagates NaNs', function () {
        var v1 = tf.tensor1d([2, NaN]);
        var v2 = tf.tensor1d([2, 1]);
        var result = MatmulOps.dotProduct(v1, v2);
        expect(result.get()).toEqual(NaN);
    });
    it('Dot product throws when vectors are different size', function () {
        var v1 = tf.tensor1d([2, 3, 3]);
        var v2 = tf.tensor1d([2, 1]);
        expect(function () { return MatmulOps.dotProduct(v1, v2); }).toThrowError();
        expect(function () { return MatmulOps.dotProduct(v2, v1); }).toThrowError();
    });
    it('Dot product throws when passed non vectors', function () {
        var v1 = tf.tensor2d([1, 2, 3, 3], [2, 2]);
        var v2 = tf.tensor1d([2, 1]);
        expect(function () { return MatmulOps.dotProduct(v1, v2); }).toThrowError();
        expect(function () { return MatmulOps.dotProduct(v2, v1); }).toThrowError();
    });
    it('Outer product', function () {
        var v1 = tf.tensor1d([2, 3]);
        var v2 = tf.tensor1d([2, 1]);
        var result = tf.outerProduct(v1, v2);
        var expected = [4, 2, 6, 3];
        expect(result.shape).toEqual([2, 2]);
        expectArraysClose(result, expected);
    });
    it('gradients: A * B', function () {
        var a = tf.tensor2d([1, 2, 3, 10, 20, 30], [2, 3]);
        var b = tf.tensor2d([2, 3, 4, 1, 2, 3], [3, 2]);
        var dy = tf.tensor2d([1, 10, 20, 30], [2, 2]);
        var transposeA = false;
        var transposeB = false;
        var grads = tf.grads(function (a, b) {
            return tf.matMul(a, b, transposeA, transposeB);
        });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expectArraysClose(da, [
            dy.get(0, 0) * b.get(0, 0) + dy.get(0, 1) * b.get(0, 1),
            dy.get(0, 0) * b.get(1, 0) + dy.get(0, 1) * b.get(1, 1),
            dy.get(0, 0) * b.get(2, 0) + dy.get(0, 1) * b.get(2, 1),
            dy.get(1, 0) * b.get(0, 0) + dy.get(1, 1) * b.get(0, 1),
            dy.get(1, 0) * b.get(1, 0) + dy.get(1, 1) * b.get(1, 1),
            dy.get(1, 0) * b.get(2, 0) + dy.get(1, 1) * b.get(2, 1)
        ], 1e-1);
        expect(db.shape).toEqual(b.shape);
        expectArraysClose(db, [
            a.get(0, 0) * dy.get(0, 0) + a.get(1, 0) * dy.get(1, 0),
            a.get(0, 0) * dy.get(0, 1) + a.get(1, 0) * dy.get(1, 1),
            a.get(0, 1) * dy.get(0, 0) + a.get(1, 1) * dy.get(1, 0),
            a.get(0, 1) * dy.get(0, 1) + a.get(1, 1) * dy.get(1, 1),
            a.get(0, 2) * dy.get(0, 0) + a.get(1, 2) * dy.get(1, 0),
            a.get(0, 2) * dy.get(0, 1) + a.get(1, 2) * dy.get(1, 1)
        ]);
    });
    it('gradients: a * bT', function () {
        var a = tf.tensor2d([1, 2, 3, 10, 20, 30], [3, 2]);
        var b = tf.tensor2d([2, 3, 4, 1, 2, 3], [3, 2]);
        var dy = tf.tensor2d([1, 10, 20, 30, 40, 50, 60, 70, 80], [3, 3]);
        var transposeA = false;
        var transposeB = true;
        var grads = tf.grads(function (a, b) {
            return tf.matMul(a, b, transposeA, transposeB);
        });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expectArraysClose(da, [
            dy.get(0, 0) * b.get(0, 0) + dy.get(0, 1) * b.get(1, 0) +
                dy.get(0, 2) * b.get(2, 0),
            dy.get(0, 0) * b.get(0, 1) + dy.get(0, 1) * b.get(1, 1) +
                dy.get(0, 2) * b.get(2, 1),
            dy.get(1, 0) * b.get(0, 0) + dy.get(1, 1) * b.get(1, 0) +
                dy.get(1, 2) * b.get(2, 0),
            dy.get(1, 0) * b.get(0, 1) + dy.get(1, 1) * b.get(1, 1) +
                dy.get(1, 2) * b.get(2, 1),
            dy.get(2, 0) * b.get(0, 0) + dy.get(2, 1) * b.get(1, 0) +
                dy.get(2, 2) * b.get(2, 0),
            dy.get(2, 0) * b.get(0, 1) + dy.get(2, 1) * b.get(1, 1) +
                dy.get(2, 2) * b.get(2, 1)
        ]);
        expect(db.shape).toEqual(b.shape);
        expectArraysClose(db, [
            dy.get(0, 0) * a.get(0, 0) + dy.get(1, 0) * a.get(1, 0) +
                dy.get(2, 0) * a.get(2, 0),
            dy.get(0, 0) * a.get(0, 1) + dy.get(1, 0) * a.get(1, 1) +
                dy.get(2, 0) * a.get(2, 1),
            dy.get(0, 1) * a.get(0, 0) + dy.get(1, 1) * a.get(1, 0) +
                dy.get(2, 1) * a.get(2, 0),
            dy.get(0, 1) * a.get(0, 1) + dy.get(1, 1) * a.get(1, 1) +
                dy.get(2, 1) * a.get(2, 1),
            dy.get(0, 2) * a.get(0, 0) + dy.get(1, 2) * a.get(1, 0) +
                dy.get(2, 2) * a.get(2, 0),
            dy.get(0, 2) * a.get(0, 1) + dy.get(1, 2) * a.get(1, 1) +
                dy.get(2, 2) * a.get(2, 1)
        ]);
    });
    it('gradients: aT * b', function () {
        var a = tf.tensor2d([1, 2, 3, 10, 20, 30], [3, 2]);
        var b = tf.tensor2d([2, 3, 4, 1, 2, 3], [3, 2]);
        var dy = tf.tensor2d([1, 10, 20, 30], [2, 2]);
        var transposeA = true;
        var transposeB = false;
        var grads = tf.grads(function (a, b) {
            return tf.matMul(a, b, transposeA, transposeB);
        });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expectArraysClose(da, [
            dy.get(0, 0) * b.get(0, 0) + dy.get(0, 1) * b.get(0, 1),
            dy.get(1, 0) * b.get(0, 0) + dy.get(1, 1) * b.get(0, 1),
            dy.get(0, 0) * b.get(1, 0) + dy.get(0, 1) * b.get(1, 1),
            dy.get(1, 0) * b.get(1, 0) + dy.get(1, 1) * b.get(1, 1),
            dy.get(0, 0) * b.get(2, 0) + dy.get(0, 1) * b.get(2, 1),
            dy.get(1, 0) * b.get(2, 0) + dy.get(1, 1) * b.get(2, 1)
        ]);
        expect(db.shape).toEqual(b.shape);
        expectArraysClose(db, [
            dy.get(0, 0) * a.get(0, 0) + dy.get(1, 0) * a.get(0, 1),
            dy.get(0, 1) * a.get(0, 0) + dy.get(1, 1) * a.get(0, 1),
            dy.get(0, 0) * a.get(1, 0) + dy.get(1, 0) * a.get(1, 1),
            dy.get(0, 1) * a.get(1, 0) + dy.get(1, 1) * a.get(1, 1),
            dy.get(0, 0) * a.get(2, 0) + dy.get(1, 0) * a.get(2, 1),
            dy.get(0, 1) * a.get(2, 0) + dy.get(1, 1) * a.get(2, 1)
        ]);
    });
    it('gradients: aT * bT', function () {
        var a = tf.tensor2d([1, 2, 3, 10, 20, 30], [3, 2]);
        var b = tf.tensor2d([2, 3, 4, 1, 2, 3], [2, 3]);
        var dy = tf.tensor2d([1, 10, 20, 30], [2, 2]);
        var transposeA = true;
        var transposeB = true;
        var grads = tf.grads(function (a, b) {
            return tf.matMul(a, b, transposeA, transposeB);
        });
        var _a = grads([a, b], dy), da = _a[0], db = _a[1];
        expect(da.shape).toEqual(a.shape);
        expectArraysClose(da, [
            dy.get(0, 0) * b.get(0, 0) + dy.get(0, 1) * b.get(1, 0),
            dy.get(1, 0) * b.get(0, 0) + dy.get(1, 1) * b.get(1, 0),
            dy.get(0, 0) * b.get(0, 1) + dy.get(0, 1) * b.get(1, 1),
            dy.get(1, 0) * b.get(0, 1) + dy.get(1, 1) * b.get(1, 1),
            dy.get(0, 0) * b.get(0, 2) + dy.get(0, 1) * b.get(1, 2),
            dy.get(1, 0) * b.get(0, 2) + dy.get(1, 1) * b.get(1, 2)
        ]);
        expect(db.shape).toEqual(b.shape);
        expectArraysClose(db, [
            dy.get(0, 0) * a.get(0, 0) + dy.get(1, 0) * a.get(0, 1),
            dy.get(0, 0) * a.get(1, 0) + dy.get(1, 0) * a.get(1, 1),
            dy.get(0, 0) * a.get(2, 0) + dy.get(1, 0) * a.get(2, 1),
            dy.get(0, 1) * a.get(0, 0) + dy.get(1, 1) * a.get(0, 1),
            dy.get(0, 1) * a.get(1, 0) + dy.get(1, 1) * a.get(1, 1),
            dy.get(0, 1) * a.get(2, 0) + dy.get(1, 1) * a.get(2, 1)
        ]);
    });
    it('throws when passed a as a non-tensor', function () {
        expect(function () { return tf.matMul({}, tf.tensor2d([2], [1, 1])); })
            .toThrowError(/Argument 'a' passed to 'matMul' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', function () {
        expect(function () { return tf.matMul(tf.tensor2d([2], [1, 1]), {}); })
            .toThrowError(/Argument 'b' passed to 'matMul' must be a Tensor/);
    });
});
describeWithFlags('matmul webgl-only', WEBGL_ENVS, function () {
    it('Matrix times vector, large matrix', function () {
        var maxTexSize = 16000;
        var sharedDim = maxTexSize + 4;
        var matrix = tf.buffer([2, sharedDim], 'float32');
        matrix.set(1, 0, sharedDim - 3);
        matrix.set(1, 0, sharedDim - 2);
        var v = tf.buffer([sharedDim], 'float32');
        v.set(1, sharedDim - 3);
        v.set(1, sharedDim - 2);
        var result = tf.matrixTimesVector(matrix.toTensor(), v.toTensor());
        var expected = [2, 0];
        expectArraysClose(result, expected);
    });
});
describeWithFlags('dot', ALL_ENVS, function () {
    var a;
    var b;
    var c;
    var d;
    var e;
    beforeEach(function () {
        a = tf.tensor1d([1, 2]);
        b = tf.tensor2d([[1, 2], [3, 4]]);
        c = tf.tensor2d([[1, 2, 3], [4, 5, 6]]);
        d = tf.tensor3d([1, 2], [1, 1, 2]);
        e = tf.scalar(1);
    });
    it('vector-vector', function () {
        var aa = tf.dot(a, a);
        expectArraysClose(aa, [5]);
        expect(aa.shape).toEqual([]);
    });
    it('vector-matrix', function () {
        var ab = tf.dot(a, b);
        var ac = tf.dot(a, c);
        expect(ab.shape).toEqual([2]);
        expect(ac.shape).toEqual([3]);
        expectArraysClose(ab, [7, 10]);
        expectArraysClose(ac, [9, 12, 15]);
    });
    it('matrix-vector', function () {
        var ba = b.dot(a);
        expect(ba.shape).toEqual([2]);
        expectArraysClose(ba, [5, 11]);
    });
    it('matrix-matrix', function () {
        var bb = tf.dot(b, b);
        var bc = tf.dot(b, c);
        expect(bb.shape).toEqual([2, 2]);
        expect(bc.shape).toEqual([2, 3]);
        expectArraysClose(bb, [7, 10, 15, 22]);
        expectArraysClose(bc, [9, 12, 15, 19, 26, 33]);
    });
    it('throws error on incompatible dimensions', function () {
        expect(function () { return tf.dot(c, a); }).toThrowError();
        expect(function () { return tf.dot(c, b); }).toThrowError();
    });
    it('throws error when inputs are not rank 1 or 2', function () {
        expect(function () { return tf.dot(a, d); }).toThrowError();
        expect(function () { return tf.dot(a, e); }).toThrowError();
    });
});
//# sourceMappingURL=matmul_test.js.map