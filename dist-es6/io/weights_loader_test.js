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
import { CPU_ENVS, expectArraysClose, expectArraysEqual } from '../test_util';
describeWithFlags('loadWeights', CPU_ENVS, function () {
    var setupFakeWeightFiles = function (fileBufferMap) {
        spyOn(window, 'fetch').and.callFake(function (path) {
            return new Response(fileBufferMap[path]);
        });
    };
    it('1 group, 1 weight, 1 requested weight', function (done) {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [3] }]
            }];
        var weightsNamesToFetch = ['weight0'];
        tf.io.loadWeights(manifest, './', weightsNamesToFetch)
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(weightsNamesToFetch.length);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2, 3]);
            expect(weight0.shape).toEqual([3]);
            expect(weight0.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('1 group, 2 weights, fetch 1st weight', function (done) {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3, 4, 5]) });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        tf.io.loadWeights(manifest, './', ['weight0'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(1);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2]);
            expect(weight0.shape).toEqual([2]);
            expect(weight0.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('1 group, 2 weights, fetch 2nd weight', function (done) {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3, 4, 5]) });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        tf.io.loadWeights(manifest, './', ['weight1'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(1);
            var weight1 = weights['weight1'];
            expectArraysClose(weight1, [3, 4, 5]);
            expect(weight1.shape).toEqual([3]);
            expect(weight1.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('1 group, 2 weights, fetch all weights', function (done) {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3, 4, 5]) });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        tf.io.loadWeights(manifest, './', ['weight0', 'weight1'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(2);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2]);
            expect(weight0.shape).toEqual([2]);
            expect(weight0.dtype).toEqual('float32');
            var weight1 = weights['weight1'];
            expectArraysClose(weight1, [3, 4, 5]);
            expect(weight1.shape).toEqual([3]);
            expect(weight1.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('1 group, multiple weights, different dtypes', function (done) {
        var buffer = new ArrayBuffer(5 * 4);
        var intBuffer = new Int32Array(buffer, 0, 2);
        intBuffer.set([1, 2]);
        var floatBuffer = new Float32Array(buffer, intBuffer.byteLength, 3);
        floatBuffer.set([3.0, 4.0, 5.0]);
        setupFakeWeightFiles({ './weightfile0': buffer });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'int32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        tf.io.loadWeights(manifest, './', ['weight0', 'weight1'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(2);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2]);
            expect(weight0.shape).toEqual([2]);
            expect(weight0.dtype).toEqual('int32');
            var weight1 = weights['weight1'];
            expectArraysClose(weight1, [3, 4, 5]);
            expect(weight1.shape).toEqual([3]);
            expect(weight1.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('1 group, sharded 1 weight across multiple files', function (done) {
        var shard0 = new Float32Array([1, 2, 3, 4, 5]);
        var shard1 = new Float32Array([1.1, 2.2]);
        var shard2 = new Float32Array([10, 20, 30]);
        setupFakeWeightFiles({
            './weightfile0': shard0,
            './weightsfile1': shard1,
            './weightsfile2': shard2
        });
        var manifest = [{
                'paths': ['weightfile0', 'weightsfile1', 'weightsfile2'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [5, 2] }]
            }];
        tf.io.loadWeights(manifest, './', ['weight0'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(3);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(1);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2, 3, 4, 5, 1.1, 2.2, 10, 20, 30]);
            expect(weight0.shape).toEqual([5, 2]);
            expect(weight0.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('1 group, sharded 2 weights across multiple files', function (done) {
        var shard0 = new Int32Array([1, 2, 3, 4, 5]);
        var shard1 = new ArrayBuffer(5 * 4);
        var intBuffer = new Int32Array(shard1, 0, 2);
        intBuffer.set([10, 20]);
        var floatBuffer = new Float32Array(shard1, intBuffer.byteLength, 3);
        floatBuffer.set([3.0, 4.0, 5.0]);
        var shard2 = new Float32Array([10, 20, 30]);
        setupFakeWeightFiles({
            './weightfile0': shard0,
            './weightsfile1': shard1,
            './weightsfile2': shard2
        });
        var manifest = [{
                'paths': ['weightfile0', 'weightsfile1', 'weightsfile2'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'int32', 'shape': [7, 1] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3, 2] }
                ]
            }];
        tf.io.loadWeights(manifest, './', ['weight0', 'weight1'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(3);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(2);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2, 3, 4, 5, 10, 20]);
            expect(weight0.shape).toEqual([7, 1]);
            expect(weight0.dtype).toEqual('int32');
            var weight1 = weights['weight1'];
            expectArraysClose(weight1, [3.0, 4.0, 5.0, 10, 20, 30]);
            expect(weight1.shape).toEqual([3, 2]);
            expect(weight1.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('2 group, 4 weights, fetches one group', function (done) {
        setupFakeWeightFiles({
            './weightfile0': new Float32Array([1, 2, 3, 4, 5]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        var manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        tf.io.loadWeights(manifest, './', ['weight0', 'weight1'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(2);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2]);
            expect(weight0.shape).toEqual([2]);
            expect(weight0.dtype).toEqual('float32');
            var weight1 = weights['weight1'];
            expectArraysClose(weight1, [3, 4, 5]);
            expect(weight1.shape).toEqual([3]);
            expect(weight1.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('2 group, 4 weights, one weight from each group', function (done) {
        setupFakeWeightFiles({
            './weightfile0': new Float32Array([1, 2, 3, 4, 5]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        var manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        tf.io.loadWeights(manifest, './', ['weight0', 'weight2'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(2);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(2);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2]);
            expect(weight0.shape).toEqual([2]);
            expect(weight0.dtype).toEqual('float32');
            var weight2 = weights['weight2'];
            expectArraysClose(weight2, [6, 7, 8]);
            expect(weight2.shape).toEqual([3, 1]);
            expect(weight2.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('2 group, 4 weights, dont specify weights fetchs all', function (done) {
        setupFakeWeightFiles({
            './weightfile0': new Float32Array([1, 2, 3, 4, 5]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        var manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        tf.io.loadWeights(manifest, './')
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(2);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(4);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [1, 2]);
            expect(weight0.shape).toEqual([2]);
            expect(weight0.dtype).toEqual('float32');
            var weight1 = weights['weight1'];
            expectArraysClose(weight1, [3, 4, 5]);
            expect(weight1.shape).toEqual([3]);
            expect(weight1.dtype).toEqual('float32');
            var weight2 = weights['weight2'];
            expectArraysClose(weight2, [6, 7, 8]);
            expect(weight2.shape).toEqual([3, 1]);
            expect(weight2.dtype).toEqual('float32');
            var weight3 = weights['weight3'];
            expectArraysClose(weight3, [9]);
            expect(weight3.shape).toEqual([]);
            expect(weight3.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
    it('throws if requested weight not found', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var manifest, weightsNamesToFetch, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
                    manifest = [{
                            'paths': ['weightfile0'],
                            'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [3] }]
                        }];
                    weightsNamesToFetch = ['doesntexist'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, tf.io.loadWeights(manifest, './', weightsNamesToFetch)];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    done();
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); });
    it('throws if requested weight has unknown dtype', function (done) { return __awaiter(_this, void 0, void 0, function () {
        var manifest, weightsNamesToFetch, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
                    manifest = [{
                            'paths': ['weightfile0'],
                            'weights': [{
                                    'name': 'weight0',
                                    'dtype': 'null',
                                    'shape': [3]
                                }]
                        }];
                    weightsNamesToFetch = ['weight0'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, tf.io.loadWeights(manifest, './', weightsNamesToFetch)];
                case 2:
                    _a.sent();
                    done.fail();
                    return [3, 4];
                case 3:
                    e_2 = _a.sent();
                    done();
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); });
    it('should use request option', function (done) {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [3] }]
            }];
        var weightsNamesToFetch = ['weight0'];
        tf.io
            .loadWeights(manifest, './', weightsNamesToFetch, { credentials: 'include' })
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            expect(window.fetch).toHaveBeenCalledWith('./weightfile0', {
                credentials: 'include'
            });
        })
            .then(done)
            .catch(done.fail);
    });
    var quantizationTest = function (quantizationDtype, done) {
        var arrayType = quantizationDtype === 'uint8' ? Uint8Array : Uint16Array;
        setupFakeWeightFiles({ './weightfile0': new arrayType([0, 48, 255, 0, 48, 255]) });
        var manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    {
                        'name': 'weight0',
                        'dtype': 'float32',
                        'shape': [3],
                        'quantization': { 'min': -1, 'scale': 0.1, 'dtype': quantizationDtype }
                    },
                    {
                        'name': 'weight1',
                        'dtype': 'int32',
                        'shape': [3],
                        'quantization': { 'min': -1, 'scale': 0.1, 'dtype': quantizationDtype }
                    }
                ]
            }];
        var weightsNamesToFetch = ['weight0', 'weight1'];
        tf.io.loadWeights(manifest, './', weightsNamesToFetch)
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(1);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(weightsNamesToFetch.length);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [-1, 3.8, 24.5]);
            expect(weight0.shape).toEqual([3]);
            expect(weight0.dtype).toEqual('float32');
            var weight1 = weights['weight1'];
            expectArraysEqual(weight1, [-1, 4, 25]);
            expect(weight1.shape).toEqual([3]);
            expect(weight1.dtype).toEqual('int32');
        })
            .then(done)
            .catch(done.fail);
    };
    it('quantized weights (uint8)', function (done) {
        quantizationTest('uint8', done);
    });
    it('quantized weights (uint16)', function (done) {
        quantizationTest('uint16', done);
    });
    it('2 groups, 1 quantized, 1 unquantized', function (done) {
        setupFakeWeightFiles({
            './weightfile0': new Uint8Array([0, 48, 255, 0, 48, 255]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        var manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    {
                        'name': 'weight0',
                        'dtype': 'float32',
                        'shape': [3],
                        'quantization': { 'min': -1, 'scale': 0.1, 'dtype': 'uint8' }
                    },
                    {
                        'name': 'weight1',
                        'dtype': 'int32',
                        'shape': [3],
                        'quantization': { 'min': -1, 'scale': 0.1, 'dtype': 'uint8' }
                    }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        tf.io.loadWeights(manifest, './', ['weight0', 'weight2'])
            .then(function (weights) {
            expect(window.fetch.calls.count()).toBe(2);
            var weightNames = Object.keys(weights);
            expect(weightNames.length).toEqual(2);
            var weight0 = weights['weight0'];
            expectArraysClose(weight0, [-1, 3.8, 24.5]);
            expect(weight0.shape).toEqual([3]);
            expect(weight0.dtype).toEqual('float32');
            var weight2 = weights['weight2'];
            expectArraysClose(weight2, [6, 7, 8]);
            expect(weight2.shape).toEqual([3, 1]);
            expect(weight2.dtype).toEqual('float32');
        })
            .then(done)
            .catch(done.fail);
    });
});
//# sourceMappingURL=weights_loader_test.js.map