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
import { CPU_ENVS } from '../test_util';
import { arrayBufferToBase64String, base64StringToArrayBuffer } from './io_utils';
import { browserLocalStorage, BrowserLocalStorage, BrowserLocalStorageManager, localStorageRouter, purgeLocalStorageArtifacts } from './local_storage';
describeWithFlags('LocalStorage', CPU_ENVS, function () {
    var modelTopology1 = {
        'class_name': 'Sequential',
        'keras_version': '2.1.4',
        'config': [{
                'class_name': 'Dense',
                'config': {
                    'kernel_initializer': {
                        'class_name': 'VarianceScaling',
                        'config': {
                            'distribution': 'uniform',
                            'scale': 1.0,
                            'seed': null,
                            'mode': 'fan_avg'
                        }
                    },
                    'name': 'dense',
                    'kernel_constraint': null,
                    'bias_regularizer': null,
                    'bias_constraint': null,
                    'dtype': 'float32',
                    'activation': 'linear',
                    'trainable': true,
                    'kernel_regularizer': null,
                    'bias_initializer': { 'class_name': 'Zeros', 'config': {} },
                    'units': 1,
                    'batch_input_shape': [null, 3],
                    'use_bias': true,
                    'activity_regularizer': null
                }
            }],
        'backend': 'tensorflow'
    };
    var weightSpecs1 = [
        {
            name: 'dense/kernel',
            shape: [3, 1],
            dtype: 'float32',
        },
        {
            name: 'dense/bias',
            shape: [1],
            dtype: 'float32',
        }
    ];
    var weightData1 = new ArrayBuffer(16);
    var artifacts1 = {
        modelTopology: modelTopology1,
        weightSpecs: weightSpecs1,
        weightData: weightData1,
    };
    function findOverflowingByteSize() {
        var LS = window.localStorage;
        var probeKey = "tfjs_test_probe_values_" + new Date().getTime() + "_" + Math.random();
        var minKilobytes = 200;
        var stepKilobytes = 200;
        var maxKilobytes = 40000;
        for (var kilobytes = minKilobytes; kilobytes < maxKilobytes; kilobytes += stepKilobytes) {
            var bytes = kilobytes * 1024;
            var data = new ArrayBuffer(bytes);
            try {
                var encoded = arrayBufferToBase64String(data);
                LS.setItem(probeKey, encoded);
            }
            catch (err) {
                return bytes;
            }
            LS.removeItem(probeKey);
        }
        throw new Error("Unable to determined overflowing byte size up to " + maxKilobytes + " kB.");
    }
    beforeEach(function () {
        purgeLocalStorageArtifacts();
    });
    afterEach(function () {
        purgeLocalStorageArtifacts();
    });
    it('Save artifacts succeeds', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.getSaveHandlers('localstorage://foo/FooModel')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                .toEqual(JSON.stringify(weightSpecs1).length);
            expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
            var LS = window.localStorage;
            var info = JSON.parse(LS.getItem('tensorflowjs_models/foo/FooModel/info'));
            expect(Date.parse(info.dateSaved))
                .toEqual(saveResult.modelArtifactsInfo.dateSaved.getTime());
            expect(info.modelTopologyBytes)
                .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
            expect(info.weightSpecsBytes)
                .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
            expect(info.weightDataBytes)
                .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
            var topologyString = LS.getItem('tensorflowjs_models/foo/FooModel/model_topology');
            expect(JSON.stringify(modelTopology1)).toEqual(topologyString);
            var weightSpecsString = LS.getItem('tensorflowjs_models/foo/FooModel/weight_specs');
            expect(JSON.stringify(weightSpecs1)).toEqual(weightSpecsString);
            var weightDataBase64String = LS.getItem('tensorflowjs_models/foo/FooModel/weight_data');
            expect(base64StringToArrayBuffer(weightDataBase64String))
                .toEqual(weightData1);
            done();
        })
            .catch(function (err) {
            console.error(err.stack);
        });
    });
    it('Save-load round trip succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
        var handler1, handler2, loaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
                    return [4, handler1.save(artifacts1)];
                case 1:
                    _a.sent();
                    handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
                    return [4, handler2.load()];
                case 2:
                    loaded = _a.sent();
                    expect(loaded.modelTopology).toEqual(modelTopology1);
                    expect(loaded.weightSpecs).toEqual(weightSpecs1);
                    expect(loaded.weightData).toEqual(weightData1);
                    return [2];
            }
        });
    }); });
    it('Loading nonexistent model fails.', function (done) {
        var handler = tf.io.getSaveHandlers('localstorage://NonexistentModel')[0];
        handler.load()
            .then(function (aritfacts) {
            fail('Loading nonexistent model succeeded unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toEqual('In local storage, there is no model with name ' +
                '\'NonexistentModel\'');
            done();
        });
    });
    it('Loading model with missing topology fails.', function (done) {
        var handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult) {
            window.localStorage.removeItem('tensorflowjs_models/FooModel/model_topology');
            var handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
            handler2.load()
                .then(function (aritfacts) {
                fail('Loading of model with missing topology succeeded ' +
                    'unexpectedly.');
            })
                .catch(function (err) {
                expect(err.message)
                    .toEqual('In local storage, the topology of model ' +
                    '\'FooModel\' is missing.');
                done();
            });
        })
            .catch(function (err) {
            console.error(err.stack);
        });
    });
    it('Loading model with missing weight specs fails.', function (done) {
        var handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult) {
            window.localStorage.removeItem('tensorflowjs_models/FooModel/weight_specs');
            var handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
            handler2.load()
                .then(function (aritfacts) {
                fail('Loading of model with missing weight specs succeeded ' +
                    'unexpectedly.');
            })
                .catch(function (err) {
                expect(err.message)
                    .toEqual('In local storage, the weight specs of model ' +
                    '\'FooModel\' are missing.');
                done();
            });
        })
            .catch(function (err) {
            console.error(err.stack);
        });
    });
    it('Loading model with missing weight data fails.', function (done) {
        var handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult) {
            window.localStorage.removeItem('tensorflowjs_models/FooModel/weight_data');
            var handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
            handler2.load()
                .then(function (aritfacts) {
                fail('Loading of model with missing weight data succeeded ' +
                    'unexpectedly.');
            })
                .catch(function (err) {
                expect(err.message)
                    .toEqual('In local storage, the binary weight values of model ' +
                    '\'FooModel\' are missing.');
                done();
            });
        })
            .catch(function (err) {
            console.error(err.stack);
        });
    });
    it('Data size too large leads to error thrown', function (done) {
        var overflowByteSize = findOverflowingByteSize();
        var overflowArtifacts = {
            modelTopology: modelTopology1,
            weightSpecs: weightSpecs1,
            weightData: new ArrayBuffer(overflowByteSize),
        };
        var handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        handler1.save(overflowArtifacts)
            .then(function (saveResult) {
            fail('Saving of model of overflowing-size weight data succeeded ' +
                'unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message
                .indexOf('Failed to save model \'FooModel\' to local storage'))
                .toEqual(0);
            done();
        });
    });
    it('Null, undefined or empty modelPath throws Error', function () {
        expect(function () { return browserLocalStorage(null); })
            .toThrowError(/local storage, modelPath must not be null, undefined or empty/);
        expect(function () { return browserLocalStorage(undefined); })
            .toThrowError(/local storage, modelPath must not be null, undefined or empty/);
        expect(function () { return browserLocalStorage(''); })
            .toThrowError(/local storage, modelPath must not be null, undefined or empty./);
    });
    it('router', function () {
        expect(localStorageRouter('localstorage://bar') instanceof BrowserLocalStorage)
            .toEqual(true);
        expect(localStorageRouter('indexeddb://bar')).toBeNull();
        expect(localStorageRouter('qux')).toBeNull();
    });
    it('Manager: List models: 0 result', function (done) {
        new BrowserLocalStorageManager()
            .listModels()
            .then(function (out) {
            expect(out).toEqual({});
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Manager: List models: 1 result', function (done) {
        var handler = tf.io.getSaveHandlers('localstorage://baz/QuxModel')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            new BrowserLocalStorageManager()
                .listModels()
                .then(function (out) {
                expect(Object.keys(out).length).toEqual(1);
                expect(out['baz/QuxModel'].modelTopologyType)
                    .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                expect(out['baz/QuxModel'].modelTopologyBytes)
                    .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
                expect(out['baz/QuxModel'].weightSpecsBytes)
                    .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                expect(out['baz/QuxModel'].weightDataBytes)
                    .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                done();
            })
                .catch(function (err) { return done.fail(err.stack); });
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Manager: List models: 2 results', function (done) {
        var handler1 = tf.io.getSaveHandlers('localstorage://QuxModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult1) {
            var handler2 = tf.io.getSaveHandlers('localstorage://repeat/QuxModel')[0];
            handler2.save(artifacts1)
                .then(function (saveResult2) {
                new BrowserLocalStorageManager()
                    .listModels()
                    .then(function (out) {
                    expect(Object.keys(out).length).toEqual(2);
                    expect(out['QuxModel'].modelTopologyType)
                        .toEqual(saveResult1.modelArtifactsInfo.modelTopologyType);
                    expect(out['QuxModel'].modelTopologyBytes)
                        .toEqual(saveResult1.modelArtifactsInfo
                        .modelTopologyBytes);
                    expect(out['QuxModel'].weightSpecsBytes)
                        .toEqual(saveResult1.modelArtifactsInfo.weightSpecsBytes);
                    expect(out['QuxModel'].weightDataBytes)
                        .toEqual(saveResult1.modelArtifactsInfo.weightDataBytes);
                    expect(out['repeat/QuxModel'].modelTopologyType)
                        .toEqual(saveResult2.modelArtifactsInfo.modelTopologyType);
                    expect(out['repeat/QuxModel'].modelTopologyBytes)
                        .toEqual(saveResult2.modelArtifactsInfo
                        .modelTopologyBytes);
                    expect(out['repeat/QuxModel'].weightSpecsBytes)
                        .toEqual(saveResult2.modelArtifactsInfo.weightSpecsBytes);
                    expect(out['repeat/QuxModel'].weightDataBytes)
                        .toEqual(saveResult2.modelArtifactsInfo.weightDataBytes);
                    done();
                })
                    .catch(function (err) { return done.fail(err.stack); });
            })
                .catch(function (err) { return done.fail(err.stack); });
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Manager: Successful deleteModel', function (done) {
        var handler1 = tf.io.getSaveHandlers('localstorage://QuxModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult1) {
            var handler2 = tf.io.getSaveHandlers('localstorage://repeat/QuxModel')[0];
            handler2.save(artifacts1)
                .then(function (saveResult2) {
                var manager = new BrowserLocalStorageManager();
                manager.removeModel('QuxModel')
                    .then(function (deletedInfo) {
                    manager.listModels().then(function (out) {
                        expect(Object.keys(out)).toEqual(['repeat/QuxModel']);
                    });
                    done();
                })
                    .catch(function (err) { return done.fail(err.stack); });
            })
                .catch(function (err) { return done.fail(err.stack); });
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
});
//# sourceMappingURL=local_storage_test.js.map