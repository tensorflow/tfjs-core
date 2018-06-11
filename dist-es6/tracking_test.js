var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import * as tf from './index';
import { describeWithFlags } from './jasmine_util';
import { ALL_ENVS, CPU_ENVS, expectArraysClose, expectArraysEqual, WEBGL_ENVS } from './test_util';
describeWithFlags('time webgl', WEBGL_ENVS, function () {
    it('upload + compute', function () { return __awaiter(_this, void 0, void 0, function () {
        var a, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = tf.zeros([10, 10]);
                    return [4, tf.time(function () { return a.square(); })];
                case 1:
                    time = _a.sent();
                    expect(time.uploadWaitMs > 0);
                    expect(time.downloadWaitMs === 0);
                    expect(time.kernelMs > 0);
                    expect(time.wallMs >= time.kernelMs);
                    return [2];
            }
        });
    }); });
    it('upload + compute + dataSync', function () { return __awaiter(_this, void 0, void 0, function () {
        var a, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = tf.zeros([10, 10]);
                    return [4, tf.time(function () { return a.square().dataSync(); })];
                case 1:
                    time = _a.sent();
                    expect(time.uploadWaitMs > 0);
                    expect(time.downloadWaitMs > 0);
                    expect(time.kernelMs > 0);
                    expect(time.wallMs >= time.kernelMs);
                    return [2];
            }
        });
    }); });
    it('upload + compute + data', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var a, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = tf.zeros([10, 10]);
                    return [4, tf.time(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, a.square().data()];
                                case 1: return [2, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    time = _a.sent();
                    expect(time.uploadWaitMs > 0);
                    expect(time.downloadWaitMs > 0);
                    expect(time.kernelMs > 0);
                    expect(time.wallMs >= time.kernelMs);
                    return [2];
            }
        });
    }); });
    it('preupload (not included) + compute + data', function () { return __awaiter(_this, void 0, void 0, function () {
        var a, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = tf.zeros([10, 10]);
                    a.square();
                    return [4, tf.time(function () { return a.sqrt(); })];
                case 1:
                    time = _a.sent();
                    expect(time.uploadWaitMs === 0);
                    expect(time.downloadWaitMs === 0);
                    expect(time.kernelMs > 0);
                    expect(time.wallMs >= time.kernelMs);
                    return [2];
            }
        });
    }); });
});
describeWithFlags('time cpu', CPU_ENVS, function () {
    it('simple upload', function () { return __awaiter(_this, void 0, void 0, function () {
        var a, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = tf.zeros([10, 10]);
                    return [4, tf.time(function () { return a.square(); })];
                case 1:
                    time = _a.sent();
                    expect(time.kernelMs > 0);
                    expect(time.wallMs >= time.kernelMs);
                    return [2];
            }
        });
    }); });
});
describeWithFlags('tidy', ALL_ENVS, function () {
    it('returns Tensor', function () {
        tf.tidy(function () {
            var a = tf.tensor1d([1, 2, 3]);
            var b = tf.tensor1d([0, 0, 0]);
            expect(tf.memory().numTensors).toBe(2);
            tf.tidy(function () {
                var result = tf.tidy(function () {
                    b = tf.addStrict(a, b);
                    b = tf.addStrict(a, b);
                    b = tf.addStrict(a, b);
                    return tf.add(a, b);
                });
                expect(tf.memory().numTensors).toBe(2 + 1);
                expectArraysClose(result, [4, 8, 12]);
            });
            expect(tf.memory().numTensors).toBe(2);
        });
        expect(tf.memory().numTensors).toBe(0);
    });
    it('multiple disposes does not affect num arrays', function () {
        expect(tf.memory().numTensors).toBe(0);
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([1, 2, 3]);
        expect(tf.memory().numTensors).toBe(2);
        a.dispose();
        a.dispose();
        expect(tf.memory().numTensors).toBe(1);
        b.dispose();
        expect(tf.memory().numTensors).toBe(0);
    });
    it('allows primitive types', function () {
        var a = tf.tidy(function () { return 5; });
        expect(a).toBe(5);
        var b = tf.tidy(function () { return 'hello'; });
        expect(b).toBe('hello');
    });
    it('allows complex types', function () {
        var res = tf.tidy(function () {
            return { a: tf.scalar(1), b: 'hello', c: [tf.scalar(2), 'world'] };
        });
        expectArraysClose(res.a, [1]);
        expectArraysClose(res.c[0], [2]);
    });
    it('returns Tensor[]', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([0, -1, 1]);
        expect(tf.memory().numTensors).toBe(2);
        tf.tidy(function () {
            var result = tf.tidy(function () {
                tf.add(a, b);
                return [tf.add(a, b), tf.sub(a, b)];
            });
            expect(tf.memory().numTensors).toBe(4);
            expectArraysClose(result[0], [1, 1, 4]);
            expectArraysClose(result[1], [1, 3, 2]);
            expect(tf.memory().numTensors).toBe(4);
        });
        expect(tf.memory().numTensors).toBe(2);
        a.dispose();
        b.dispose();
        expect(tf.memory().numTensors).toBe(0);
    });
    it('basic usage without return', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([0, 0, 0]);
        expect(tf.memory().numTensors).toBe(2);
        tf.tidy(function () {
            b = tf.addStrict(a, b);
            b = tf.addStrict(a, b);
            b = tf.addStrict(a, b);
            tf.add(a, b);
        });
        expect(tf.memory().numTensors).toBe(2);
    });
    it('nested usage', function () {
        var a = tf.tensor1d([1, 2, 3]);
        var b = tf.tensor1d([0, 0, 0]);
        expect(tf.memory().numTensors).toBe(2);
        tf.tidy(function () {
            var result = tf.tidy(function () {
                b = tf.addStrict(a, b);
                b = tf.tidy(function () {
                    b = tf.tidy(function () {
                        return tf.addStrict(a, b);
                    });
                    expect(tf.memory().numTensors).toBe(4);
                    tf.tidy(function () {
                        tf.addStrict(a, b);
                    });
                    expect(tf.memory().numTensors).toBe(4);
                    return tf.addStrict(a, b);
                });
                expect(tf.memory().numTensors).toBe(4);
                return tf.addStrict(a, b);
            });
            expect(tf.memory().numTensors).toBe(3);
            expectArraysClose(result, [4, 8, 12]);
        });
        expect(tf.memory().numTensors).toBe(2);
    });
    it('nested usage returns tensor created from outside scope', function () {
        var x = tf.scalar(1);
        tf.tidy(function () {
            tf.tidy(function () {
                return x;
            });
        });
        expect(x.isDisposed).toBe(false);
    });
    it('nested usage with keep works', function () {
        var b;
        tf.tidy(function () {
            var a = tf.scalar(1);
            tf.tidy(function () {
                b = tf.keep(a);
            });
        });
        expect(b.isDisposed).toBe(false);
    });
    it('single argument', function () {
        var hasRan = false;
        tf.tidy(function () {
            hasRan = true;
        });
        expect(hasRan).toBe(true);
    });
    it('single argument, but not a function throws error', function () {
        expect(function () {
            tf.tidy('asdf');
        }).toThrowError();
    });
    it('2 arguments, first is string', function () {
        var hasRan = false;
        tf.tidy('name', function () {
            hasRan = true;
        });
        expect(hasRan).toBe(true);
    });
    it('2 arguments, but first is not string throws error', function () {
        expect(function () {
            tf.tidy(4, function () { });
        }).toThrowError();
    });
    it('2 arguments, but second is not a function throws error', function () {
        expect(function () {
            tf.tidy('name', 'another name');
        }).toThrowError();
    });
    it('works with arbitrary depth of result', function () {
        tf.tidy(function () {
            var res = tf.tidy(function () {
                return [tf.scalar(1), [[tf.scalar(2)]], { list: [tf.scalar(3)] }];
            });
            expectArraysEqual(res[0], [1]);
            expectArraysEqual(res[1][0][0], [2]);
            expectArraysEqual(res[2].list[0], [3]);
            expect(tf.memory().numTensors).toBe(3);
            return res[0];
        });
        expect(tf.memory().numTensors).toBe(1);
    });
});
//# sourceMappingURL=tracking_test.js.map