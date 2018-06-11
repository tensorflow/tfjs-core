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
import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { expectArraysClose, expectArraysEqual, WEBGL_ENVS } from '../test_util';
import { MathBackendWebGL, SIZE_UPLOAD_UNIFORM } from './backend_webgl';
describeWithFlags('backendWebGL', WEBGL_ENVS, function () {
    it('delayed storage, reading', function () {
        var delayedStorage = true;
        var backend = new MathBackendWebGL(null, delayedStorage);
        var texManager = backend.getTextureManager();
        var dataId = {};
        backend.register(dataId, [3], 'float32');
        backend.write(dataId, new Float32Array([1, 2, 3]));
        expect(texManager.getNumUsedTextures()).toBe(0);
        backend.getTexture(dataId);
        expect(texManager.getNumUsedTextures()).toBe(1);
        expectArraysClose(backend.readSync(dataId), new Float32Array([1, 2, 3]));
        expect(texManager.getNumUsedTextures()).toBe(0);
        backend.getTexture(dataId);
        expect(texManager.getNumUsedTextures()).toBe(1);
        backend.disposeData(dataId);
        expect(texManager.getNumUsedTextures()).toBe(0);
    });
    it('delayed storage, overwriting', function () {
        var delayedStorage = true;
        var backend = new MathBackendWebGL(null, delayedStorage);
        var texManager = backend.getTextureManager();
        var dataId = {};
        backend.register(dataId, [3], 'float32');
        backend.write(dataId, new Float32Array([1, 2, 3]));
        backend.getTexture(dataId);
        expect(texManager.getNumUsedTextures()).toBe(1);
        backend.write(dataId, new Float32Array([4, 5, 6]));
        expect(texManager.getNumUsedTextures()).toBe(0);
        expectArraysClose(backend.readSync(dataId), new Float32Array([4, 5, 6]));
        backend.getTexture(dataId);
        expect(texManager.getNumUsedTextures()).toBe(1);
        expectArraysClose(backend.readSync(dataId), new Float32Array([4, 5, 6]));
        expect(texManager.getNumUsedTextures()).toBe(0);
    });
    it('immediate storage reading', function () {
        var delayedStorage = false;
        var backend = new MathBackendWebGL(null, delayedStorage);
        var texManager = backend.getTextureManager();
        var dataId = {};
        backend.register(dataId, [3], 'float32');
        backend.write(dataId, new Float32Array([1, 2, 3]));
        expect(texManager.getNumUsedTextures()).toBe(1);
        expectArraysClose(backend.readSync(dataId), new Float32Array([1, 2, 3]));
        expect(texManager.getNumUsedTextures()).toBe(1);
        backend.disposeData(dataId);
        expect(texManager.getNumUsedTextures()).toBe(0);
    });
    it('immediate storage overwriting', function () {
        var delayedStorage = false;
        var backend = new MathBackendWebGL(null, delayedStorage);
        var texManager = backend.getTextureManager();
        var dataId = {};
        backend.register(dataId, [3], 'float32');
        backend.write(dataId, new Float32Array([1, 2, 3]));
        expect(texManager.getNumUsedTextures()).toBe(1);
        backend.write(dataId, new Float32Array([4, 5, 6]));
        expect(texManager.getNumUsedTextures()).toBe(1);
        expectArraysClose(backend.readSync(dataId), new Float32Array([4, 5, 6]));
        expect(texManager.getNumUsedTextures()).toBe(1);
        backend.disposeData(dataId);
        expect(texManager.getNumUsedTextures()).toBe(0);
    });
    it('disposal of backend disposes all textures', function () {
        var delayedStorage = false;
        var backend = new MathBackendWebGL(null, delayedStorage);
        var texManager = backend.getTextureManager();
        var dataId = {};
        backend.register(dataId, [3], 'float32');
        backend.write(dataId, new Float32Array([1, 2, 3]));
        var dataId2 = {};
        backend.register(dataId2, [3], 'float32');
        backend.write(dataId2, new Float32Array([4, 5, 6]));
        expect(texManager.getNumUsedTextures()).toBe(2);
        backend.dispose();
        expect(texManager.getNumUsedTextures()).toBe(0);
    });
});
describeWithFlags('Custom window size', WEBGL_ENVS, function () {
    it('Set screen area to be 1x1', function () { return __awaiter(_this, void 0, void 0, function () {
        var oldBackend, a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spyOnProperty(window, 'screen', 'get')
                        .and.returnValue({ height: 1, width: 1 });
                    oldBackend = tf.getBackend();
                    tf.ENV.registerBackend('custom-webgl', function () { return new MathBackendWebGL(); });
                    tf.setBackend('custom-webgl');
                    a = tf.ones([100, 100]);
                    expect(tf.memory().numBytesInGPU).toBe(0);
                    return [4, a.square().data()];
                case 1:
                    _a.sent();
                    expect(tf.memory().numBytesInGPU).toBe(0);
                    expectArraysEqual(a, new Float32Array(100 * 100).fill(1));
                    tf.setBackend(oldBackend);
                    return [2];
            }
        });
    }); });
});
describeWithFlags('upload tensors as uniforms', WEBGL_ENVS, function () {
    it('small tensor gets uploaded as scalar', function () {
        var m = tf.memory();
        expect(m.numBytesInGPU).toBe(0);
        var a = tf.zeros([SIZE_UPLOAD_UNIFORM - 1]);
        a.square();
        m = tf.memory();
        expect(m.numBytesInGPU).toBe(a.size * 4);
    });
    it('large tensor gets uploaded to gpu', function () {
        var m = tf.memory();
        expect(m.numBytesInGPU).toBe(0);
        var a = tf.zeros([SIZE_UPLOAD_UNIFORM + 1]);
        a.square();
        m = tf.memory();
        expect(m.numBytesInGPU).toBe(a.size * 4 * 2);
    });
});
//# sourceMappingURL=backend_webgl_test.js.map