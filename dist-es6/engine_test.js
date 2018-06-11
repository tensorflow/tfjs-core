import * as tf from './index';
import { describeWithFlags } from './jasmine_util';
import { ALL_ENVS, expectArraysClose, expectArraysEqual, expectNumbersClose, WEBGL_ENVS } from './test_util';
describeWithFlags('fromPixels + regular math op', WEBGL_ENVS, function () {
    it('debug mode does not error when no nans', function () {
        var pixels = new ImageData(2, 2);
        for (var i = 0; i < 8; i++) {
            pixels.data[i] = 100;
        }
        for (var i = 8; i < 16; i++) {
            pixels.data[i] = 250;
        }
        var a = tf.fromPixels(pixels, 4);
        var b = tf.scalar(20, 'int32');
        var res = tf.add(a, b);
        expectArraysEqual(res, [
            120, 120, 120, 120, 120, 120, 120, 120, 270, 270, 270, 270, 270, 270, 270,
            270
        ]);
    });
});
describeWithFlags('gradients', ALL_ENVS, function () {
    it('matmul + relu', function () {
        var a = tf.tensor2d([-1, 2, -3, 10, -20, 30], [2, 3]);
        var b = tf.tensor2d([2, -3, 4, -1, 2, -3], [3, 2]);
        var _a = tf.grads(function (a, b) {
            var m = tf.matMul(a, b);
            var y = tf.relu(m);
            return tf.sum(y);
        })([a, b]), da = _a[0], db = _a[1];
        var dedm = tf.step(tf.matMul(a, b));
        expect(da.shape).toEqual(a.shape);
        var transposeA = false;
        var transposeB = true;
        expectArraysClose(da, tf.matMul(dedm, b, transposeA, transposeB));
        expect(db.shape).toEqual(b.shape);
        transposeA = true;
        transposeB = false;
        expectArraysClose(db, tf.matMul(a, dedm, transposeA, transposeB));
    });
    it('grad(f)', function () {
        var grad = tf.grad(function (x) { return x.square(); });
        var result = grad(tf.tensor1d([.1, .2]));
        expectArraysClose(result, [.2, .4]);
    });
    it('calling grad(f) twice works', function () {
        var grad = tf.grad(function (x) { return x.square(); });
        var result = grad(tf.tensor1d([.1, .2]));
        var result2 = grad(tf.tensor1d([.1, .4]));
        expectArraysClose(result, [.2, .4]);
        expectArraysClose(result2, [.2, .8]);
    });
    it('grads(f)', function () {
        var grads = tf.grads(function (x) { return x.square(); });
        var result = grads([tf.tensor1d([.1, .2])]);
        expectArraysClose(result[0], [.2, .4]);
    });
    it('calling grads(f) twice works', function () {
        var grads = tf.grads(function (x) { return x.square(); });
        var result = grads([tf.tensor1d([.1, .2])]);
        var result2 = grads([tf.tensor1d([.1, .4])]);
        expectArraysClose(result[0], [.2, .4]);
        expectArraysClose(result2[0], [.2, .8]);
    });
    it('works with reshape', function () {
        var a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var exponent = tf.tensor1d([2, 2, 2, 2], 'int32');
        var da = tf.grad(function (a) {
            var b = a.flatten();
            var m = tf.pow(b, exponent);
            return tf.sum(m);
        })(a);
        expect(da.shape).toEqual([2, 2]);
        expectArraysClose(da, [2, 4, 6, 8]);
    });
    it('reshape outside tf.grads() throws error', function () {
        var a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var b = a.flatten();
        var exponent = tf.tensor1d([2, 2, 2, 2], 'int32');
        var f = function () {
            tf.grads(function (a, b) {
                var m = tf.pow(b, exponent);
                return tf.sum(m);
            })([a, b]);
        };
        expect(f).toThrowError();
    });
    it('does not error if irrelevant (pruned) ops are missing grads', function () {
        var a = tf.tensor1d([true, true], 'bool');
        var b = tf.tensor1d([false, true], 'bool');
        var da = tf.grad(function (a) {
            a.logicalAnd(b);
            return a.sum();
        })(a);
        expectArraysClose(da, [1, 1]);
    });
    it('errors if relevant ops are missing grads', function () {
        var a = tf.tensor1d([true, true], 'bool');
        var b = tf.tensor1d([false, true], 'bool');
        var dfda = tf.grad(function (a) {
            return a.logicalAnd(b);
        });
        expect(function () { return dfda(a); }).toThrowError();
    });
    it('works with asType', function () {
        var a = tf.tensor2d([1, 2, 3, 4], [2, 2], 'int32');
        var exponent = tf.tensor2d([2, 2, 2, 2], [2, 2], 'int32');
        var da = tf.grad(function (a) {
            var b = a.toFloat();
            var m = tf.pow(b, exponent);
            return tf.sum(m);
        })(a);
        expect(da.shape).toEqual([2, 2]);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(da, [2, 4, 6, 8]);
    });
    it('asType outside of tf.grads() throws error', function () {
        var a = tf.tensor2d([1, 2, 3, 4], [2, 2], 'int32');
        var b = a.toFloat();
        var exponent = tf.tensor2d([2, 2, 2, 2], [2, 2], 'int32');
        var f = function () {
            tf.grad(function (a) {
                var m = tf.pow(b, exponent);
                return tf.sum(m);
            })(a);
        };
        expect(f).toThrowError();
    });
});
describeWithFlags('valueAndGradients', ALL_ENVS, function () {
    it('matmul + relu', function () {
        var a = tf.tensor2d([-1, 2, -3, 10, -20, 30], [2, 3]);
        var b = tf.tensor2d([2, -3, 4, -1, 2, -3], [3, 2]);
        var _a = tf.valueAndGrads(function (a, b) {
            var m = tf.matMul(a, b);
            var y = tf.relu(m);
            return tf.sum(y);
        })([a, b]), value = _a.value, grads = _a.grads;
        expectNumbersClose(value.get(), 10);
        var dedm = tf.step(tf.matMul(a, b));
        var da = grads[0], db = grads[1];
        var transposeA = false;
        var transposeB = true;
        expectArraysClose(da, tf.matMul(dedm, b, transposeA, transposeB));
        transposeA = true;
        transposeB = false;
        expectArraysClose(db, tf.matMul(a, dedm, transposeA, transposeB));
    });
    it('matmul + relu + inner tidy', function () {
        var a = tf.tensor2d([-1, 2, -3, 10, -20, 30], [2, 3]);
        var b = tf.tensor2d([2, -3, 4, -1, 2, -3], [3, 2]);
        var _a = tf.valueAndGrads(function (a, b) {
            var m = tf.matMul(a, b);
            return tf.tidy(function () {
                var y = tf.relu(m);
                return tf.sum(y);
            });
        })([a, b]), value = _a.value, grads = _a.grads;
        expectNumbersClose(value.get(), 10);
        var dedm = tf.step(tf.matMul(a, b));
        var da = grads[0], db = grads[1];
        var transposeA = false;
        var transposeB = true;
        expectArraysClose(da, tf.matMul(dedm, b, transposeA, transposeB));
        transposeA = true;
        transposeB = false;
        expectArraysClose(db, tf.matMul(a, dedm, transposeA, transposeB));
    });
});
describeWithFlags('higher-order gradients', ALL_ENVS, function () {
    it('grad(grad(f))', function () {
        var gradgrad = tf.grad(tf.grad(function (x) { return x.mul(x).mul(x); }));
        var result = gradgrad(tf.tensor1d([.1, .2]));
        expectArraysClose(result, [.6, 1.2]);
    });
    it('grads(grads(f))', function () {
        var grads = tf.grads(function (x) { return x.mul(x).mul(x); });
        var gradsgrads = tf.grads(function (x) { return grads([x])[0]; });
        var result = gradsgrads([tf.tensor1d([.1, .2])]);
        expectArraysClose(result[0], [.6, 1.2]);
    });
});
describeWithFlags('customGradient', ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.scalar(3);
        var b = tf.scalar(2, 'int32');
        var dy = tf.scalar(4);
        var customPow = tf.customGrad(function (a) {
            var value = tf.pow(a, b);
            var gradFunc = function (dy) { return dy.mul(tf.scalar(0.1)); };
            return { value: value, gradFunc: gradFunc };
        });
        var _a = tf.valueAndGrad(function (a) { return customPow(a); })(a, dy), value = _a.value, grad = _a.grad;
        expect(value.shape).toEqual(a.shape);
        expectArraysClose(value, [9]);
        expect(grad.shape).toEqual(a.shape);
        expectArraysClose(grad, [.4]);
    });
    it('second order derivative through customGradient', function () {
        var a = tf.scalar(3);
        var b = tf.scalar(2, 'int32');
        var dy = tf.scalar(5);
        var customPow = tf.customGrad(function (a) {
            var value = tf.pow(a, b);
            var gradFunc = function (dy) { return dy.mul(a); };
            return { value: value, gradFunc: gradFunc };
        });
        var dda = tf.grad(tf.grad(function (a) { return customPow(a); }))(a, dy);
        expect(dda.shape).toEqual(a.shape);
        expectArraysClose(dda, dy);
    });
    it('calling gradient of custom op twice works', function () {
        var customOp = tf.customGrad(function (x) {
            return { value: x.square(), gradFunc: function (dy) { return dy.mul(x.abs()); } };
        });
        var x = tf.tensor1d([-1, -2, 3]);
        var grad = tf.grad(function (x) { return customOp(x); });
        expectArraysClose(grad(x), [1, 2, 3]);
        expectArraysClose(grad(x), [1, 2, 3]);
    });
});
describeWithFlags('memory', ALL_ENVS, function () {
    it('Sum(float)', function () {
        expect(tf.memory().numTensors).toBe(0);
        expect(tf.memory().numBytes).toBe(0);
        var sum = tf.tidy(function () {
            var a = tf.tensor1d([1, 2, 3, 4]);
            expect(tf.memory().numTensors).toBe(1);
            expect(tf.memory().numBytes).toBe(4 * 4);
            return a.sum();
        });
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(4);
        expectArraysClose(sum, [1 + 2 + 3 + 4]);
    });
    it('Sum(bool)', function () {
        var sum = tf.tidy(function () {
            var a = tf.tensor1d([true, true, false, true], 'bool');
            expect(tf.memory().numTensors).toBe(1);
            expect(tf.memory().numBytes).toBe(4);
            return a.sum();
        });
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(4);
        expect(sum.dtype).toBe('int32');
        expectArraysClose(sum, [1 + 1 + 0 + 1]);
    });
    it('Sum(int32)', function () {
        var sum = tf.tidy(function () {
            var a = tf.tensor1d([1, 1, 0, 1], 'int32');
            expect(tf.memory().numTensors).toBe(1);
            expect(tf.memory().numBytes).toBe(4 * 4);
            return a.sum();
        });
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(4);
        expect(sum.dtype).toBe('int32');
        expectArraysClose(sum, [1 + 1 + 0 + 1]);
    });
});
describeWithFlags('disposeVariables', ALL_ENVS, function () {
    it('reuse same name variable', function () {
        tf.tensor1d([1, 2, 3]).variable(true, 'v1');
        tf.tensor1d([1, 2, 3]).variable(true, 'v2');
        expect(function () {
            tf.tensor1d([1, 2, 3]).variable(true, 'v1');
        }).toThrowError();
        tf.disposeVariables();
        tf.tensor1d([1, 2, 3]).variable(true, 'v1');
        tf.tensor1d([1, 2, 3]).variable(true, 'v2');
    });
});
//# sourceMappingURL=engine_test.js.map