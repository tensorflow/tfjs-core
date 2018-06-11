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
import { browserDownloads, BrowserDownloads, browserDownloadsRouter } from './browser_files';
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
describeWithFlags('browserDownloads', CPU_ENVS, function () {
    var FakeHTMLAnchorElement = (function () {
        function FakeHTMLAnchorElement() {
            this.clicked = 0;
        }
        FakeHTMLAnchorElement.prototype.click = function () {
            this.clicked++;
        };
        return FakeHTMLAnchorElement;
    }());
    var fakeAnchors = [];
    var fakeAnchorCount = 0;
    beforeEach(function () {
        fakeAnchorCount = 0;
        fakeAnchors = [new FakeHTMLAnchorElement(), new FakeHTMLAnchorElement()];
        spyOn(document, 'createElement').and.callFake(function (tag) {
            return fakeAnchors[fakeAnchorCount++];
        });
    });
    it('Explicit file name prefix, with existing anchors', function (done) {
        var testStartDate = new Date();
        var downloadTrigger = tf.io.getSaveHandlers('downloads://test-model')[0];
        downloadTrigger.save(artifacts1)
            .then(function (saveResult) { return __awaiter(_this, void 0, void 0, function () {
            var artifactsInfo, jsonAnchor, weightDataAnchor, jsonContent, modelTopologyAndWeightsManifest, _a, _b, weightsManifest, weightsContent, fileReader, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        expect(saveResult.errors).toEqual(undefined);
                        artifactsInfo = saveResult.modelArtifactsInfo;
                        expect(artifactsInfo.dateSaved.getTime())
                            .toBeGreaterThanOrEqual(testStartDate.getTime());
                        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                            .toEqual(JSON.stringify(modelTopology1).length);
                        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                            .toEqual(JSON.stringify(weightSpecs1).length);
                        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
                        jsonAnchor = fakeAnchors[0];
                        weightDataAnchor = fakeAnchors[1];
                        expect(jsonAnchor.download).toEqual('test-model.json');
                        expect(weightDataAnchor.download).toEqual('test-model.weights.bin');
                        return [4, fetch(jsonAnchor.href)];
                    case 1:
                        jsonContent = _e.sent();
                        _b = (_a = JSON).parse;
                        return [4, jsonContent.text()];
                    case 2:
                        modelTopologyAndWeightsManifest = _b.apply(_a, [_e.sent()]);
                        expect(modelTopologyAndWeightsManifest.modelTopology)
                            .toEqual(modelTopology1);
                        weightsManifest = modelTopologyAndWeightsManifest.weightsManifest;
                        expect(weightsManifest.length).toEqual(1);
                        expect(weightsManifest[0].paths).toEqual([
                            './test-model.weights.bin'
                        ]);
                        expect(weightsManifest[0].weights).toEqual(weightSpecs1);
                        return [4, fetch(weightDataAnchor.href)];
                    case 3:
                        weightsContent = _e.sent();
                        fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            var buffer = event.target.result;
                            expect(buffer).toEqual(weightData1);
                            done();
                        };
                        _d = (_c = fileReader).readAsArrayBuffer;
                        return [4, weightsContent.blob()];
                    case 4:
                        _d.apply(_c, [_e.sent()]);
                        expect(jsonAnchor.clicked).toEqual(1);
                        expect(weightDataAnchor.clicked).toEqual(1);
                        return [2];
                }
            });
        }); })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('URL scheme in explicit name gets stripped', function (done) {
        var testStartDate = new Date();
        var downloadTrigger = browserDownloads('downloads://test-model');
        downloadTrigger.save(artifacts1)
            .then(function (saveResult) { return __awaiter(_this, void 0, void 0, function () {
            var artifactsInfo, jsonAnchor, weightDataAnchor, jsonContent, modelTopologyAndWeightsManifest, _a, _b, weightsManifest, weightsContent, fileReader, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        expect(saveResult.errors).toEqual(undefined);
                        artifactsInfo = saveResult.modelArtifactsInfo;
                        expect(artifactsInfo.dateSaved.getTime())
                            .toBeGreaterThanOrEqual(testStartDate.getTime());
                        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                            .toEqual(JSON.stringify(modelTopology1).length);
                        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                            .toEqual(JSON.stringify(weightSpecs1).length);
                        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
                        jsonAnchor = fakeAnchors[0];
                        weightDataAnchor = fakeAnchors[1];
                        expect(jsonAnchor.download).toEqual('test-model.json');
                        expect(weightDataAnchor.download).toEqual('test-model.weights.bin');
                        return [4, fetch(jsonAnchor.href)];
                    case 1:
                        jsonContent = _e.sent();
                        _b = (_a = JSON).parse;
                        return [4, jsonContent.text()];
                    case 2:
                        modelTopologyAndWeightsManifest = _b.apply(_a, [_e.sent()]);
                        expect(modelTopologyAndWeightsManifest.modelTopology)
                            .toEqual(modelTopology1);
                        weightsManifest = modelTopologyAndWeightsManifest.weightsManifest;
                        expect(weightsManifest.length).toEqual(1);
                        expect(weightsManifest[0].paths).toEqual([
                            './test-model.weights.bin'
                        ]);
                        expect(weightsManifest[0].weights).toEqual(weightSpecs1);
                        return [4, fetch(weightDataAnchor.href)];
                    case 3:
                        weightsContent = _e.sent();
                        fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            var buffer = event.target.result;
                            expect(buffer).toEqual(weightData1);
                            done();
                        };
                        _d = (_c = fileReader).readAsArrayBuffer;
                        return [4, weightsContent.blob()];
                    case 4:
                        _d.apply(_c, [_e.sent()]);
                        expect(jsonAnchor.clicked).toEqual(1);
                        expect(weightDataAnchor.clicked).toEqual(1);
                        return [2];
                }
            });
        }); })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('No file name provided, with existing anchors', function (done) {
        var testStartDate = new Date();
        var downloadTrigger = browserDownloads();
        downloadTrigger.save(artifacts1)
            .then(function (saveResult) { return __awaiter(_this, void 0, void 0, function () {
            var artifactsInfo, jsonAnchor, weightDataAnchor, jsonContent, modelTopologyAndWeightsManifest, _a, _b, weightsManifest, weightsContent, fileReader, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        expect(saveResult.errors).toEqual(undefined);
                        artifactsInfo = saveResult.modelArtifactsInfo;
                        expect(artifactsInfo.dateSaved.getTime())
                            .toBeGreaterThanOrEqual(testStartDate.getTime());
                        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                            .toEqual(JSON.stringify(modelTopology1).length);
                        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                            .toEqual(JSON.stringify(weightSpecs1).length);
                        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
                        jsonAnchor = fakeAnchors[0];
                        weightDataAnchor = fakeAnchors[1];
                        expect(jsonAnchor.download).toEqual('model.json');
                        expect(weightDataAnchor.download).toEqual('model.weights.bin');
                        return [4, fetch(jsonAnchor.href)];
                    case 1:
                        jsonContent = _e.sent();
                        _b = (_a = JSON).parse;
                        return [4, jsonContent.text()];
                    case 2:
                        modelTopologyAndWeightsManifest = _b.apply(_a, [_e.sent()]);
                        expect(modelTopologyAndWeightsManifest.modelTopology)
                            .toEqual(modelTopology1);
                        weightsManifest = modelTopologyAndWeightsManifest.weightsManifest;
                        expect(weightsManifest.length).toEqual(1);
                        expect(weightsManifest[0].paths).toEqual(['./model.weights.bin']);
                        expect(weightsManifest[0].weights).toEqual(weightSpecs1);
                        return [4, fetch(weightDataAnchor.href)];
                    case 3:
                        weightsContent = _e.sent();
                        fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            var buffer = event.target.result;
                            expect(buffer).toEqual(weightData1);
                            done();
                        };
                        _d = (_c = fileReader).readAsArrayBuffer;
                        return [4, weightsContent.blob()];
                    case 4:
                        _d.apply(_c, [_e.sent()]);
                        return [2];
                }
            });
        }); })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Download only model topology', function (done) {
        var testStartDate = new Date();
        var downloadTrigger = browserDownloads();
        var modelTopologyOnlyArtifacts = {
            modelTopology: modelTopology1,
        };
        downloadTrigger.save(modelTopologyOnlyArtifacts)
            .then(function (saveResult) { return __awaiter(_this, void 0, void 0, function () {
            var artifactsInfo, jsonAnchor, weightDataAnchor, jsonContent, modelTopologyAndWeightsManifest, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expect(saveResult.errors).toEqual(undefined);
                        artifactsInfo = saveResult.modelArtifactsInfo;
                        expect(artifactsInfo.dateSaved.getTime())
                            .toBeGreaterThanOrEqual(testStartDate.getTime());
                        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                            .toEqual(JSON.stringify(modelTopology1).length);
                        expect(saveResult.modelArtifactsInfo.weightSpecsBytes).toEqual(0);
                        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(0);
                        jsonAnchor = fakeAnchors[0];
                        weightDataAnchor = fakeAnchors[1];
                        expect(jsonAnchor.download).toEqual('model.json');
                        expect(jsonAnchor.clicked).toEqual(1);
                        expect(weightDataAnchor.download).toEqual(undefined);
                        expect(weightDataAnchor.clicked).toEqual(0);
                        return [4, fetch(jsonAnchor.href)];
                    case 1:
                        jsonContent = _c.sent();
                        _b = (_a = JSON).parse;
                        return [4, jsonContent.text()];
                    case 2:
                        modelTopologyAndWeightsManifest = _b.apply(_a, [_c.sent()]);
                        expect(modelTopologyAndWeightsManifest.modelTopology)
                            .toEqual(modelTopology1);
                        done();
                        return [2];
                }
            });
        }); })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('browserDownloadsRouter', function () {
        expect(browserDownloadsRouter('downloads://foo') instanceof BrowserDownloads)
            .toEqual(true);
        expect(browserDownloadsRouter('invaliddownloads://foo')).toBeNull();
        expect(browserDownloadsRouter('foo')).toBeNull();
    });
});
describeWithFlags('browserFiles', CPU_ENVS, function () {
    var weightsBlob = new Blob([weightData1], { type: 'application/octet-stream' });
    var weightsFile = new File([weightsBlob], 'model.weights.bin', { type: 'application/octet-stream' });
    it('One group, one path', function (done) {
        var weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: weightSpecs1,
            }];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(weightSpecs1);
            expect(new Uint8Array(modelArtifacts.weightData))
                .toEqual(new Uint8Array(weightData1));
            done();
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it("One group, two paths", function (done) {
        var weightSpecs = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightsManifest = [{
                paths: ['./dir1/model.weights.1.bin', './dir2/model.weights.2.bin'],
                weights: weightSpecs,
            }];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var weightsBlob1 = new Blob([new Uint8Array([1, 2, 3, 4]).buffer], { type: 'application/octet-stream' });
        var weightsFile1 = new File([weightsBlob1], 'model.weights.1.bin', { type: 'application/octet-stream' });
        var weightsBlob2 = new Blob([new Uint8Array([10, 20, 30, 40]).buffer], { type: 'application/octet-stream' });
        var weightsFile2 = new File([weightsBlob2], 'model.weights.2.bin', { type: 'application/octet-stream' });
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(weightSpecs);
            expect(new Uint8Array(modelArtifacts.weightData))
                .toEqual(new Uint8Array([1, 2, 3, 4, 10, 20, 30, 40]));
            done();
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it("Two groups, four paths, reverseOrder=false", function (done) {
        var weightSpecs1 = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightSpecs2 = [
            {
                name: 'baz',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'qux',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightsManifest = [
            {
                paths: ['./model.weights.1.bin', './model.weights.2.bin'],
                weights: weightSpecs1,
            },
            {
                paths: ['./model.weights.3.bin', './model.weights.4.bin'],
                weights: weightSpecs2,
            }
        ];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var weightsBlob1 = new Blob([new Uint8Array([1, 3, 5, 7]).buffer], { type: 'application/octet-stream' });
        var weightsFile1 = new File([weightsBlob1], 'model.weights.1.bin', { type: 'application/octet-stream' });
        var weightsBlob2 = new Blob([new Uint8Array([10, 30, 50, 70]).buffer], { type: 'application/octet-stream' });
        var weightsFile2 = new File([weightsBlob2], 'model.weights.2.bin', { type: 'application/octet-stream' });
        var weightsBlob3 = new Blob([new Uint8Array([2, 4, 6, 8]).buffer], { type: 'application/octet-stream' });
        var weightsFile3 = new File([weightsBlob3], 'model.weights.3.bin', { type: 'application/octet-stream' });
        var weightsBlob4 = new Blob([new Uint8Array([20, 40, 60, 80]).buffer], { type: 'application/octet-stream' });
        var weightsFile4 = new File([weightsBlob4], 'model.weights.4.bin', { type: 'application/octet-stream' });
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2, weightsFile3, weightsFile4]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightSpecs1.concat(weightSpecs2));
            expect(new Uint8Array(modelArtifacts.weightData))
                .toEqual(new Uint8Array([1, 3, 5, 7, 10, 30, 50, 70, 2, 4, 6, 8, 20, 40, 60, 80]));
            done();
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it("Two groups, four paths, reverseOrder=true", function (done) {
        var weightSpecs1 = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightSpecs2 = [
            {
                name: 'baz',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'qux',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightsManifest = [
            {
                paths: ['./model.weights.1.bin', './model.weights.2.bin'],
                weights: weightSpecs1,
            },
            {
                paths: ['./model.weights.3.bin', './model.weights.4.bin'],
                weights: weightSpecs2,
            }
        ];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var weightsBlob1 = new Blob([new Uint8Array([1, 3, 5, 7]).buffer], { type: 'application/octet-stream' });
        var weightsFile1 = new File([weightsBlob1], 'model.weights.1.bin', { type: 'application/octet-stream' });
        var weightsBlob2 = new Blob([new Uint8Array([10, 30, 50, 70]).buffer], { type: 'application/octet-stream' });
        var weightsFile2 = new File([weightsBlob2], 'model.weights.2.bin', { type: 'application/octet-stream' });
        var weightsBlob3 = new Blob([new Uint8Array([2, 4, 6, 8]).buffer], { type: 'application/octet-stream' });
        var weightsFile3 = new File([weightsBlob3], 'model.weights.3.bin', { type: 'application/octet-stream' });
        var weightsBlob4 = new Blob([new Uint8Array([20, 40, 60, 80]).buffer], { type: 'application/octet-stream' });
        var weightsFile4 = new File([weightsBlob4], 'model.weights.4.bin', { type: 'application/octet-stream' });
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile4, weightsFile3, weightsFile2, weightsFile1]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightSpecs1.concat(weightSpecs2));
            expect(new Uint8Array(modelArtifacts.weightData))
                .toEqual(new Uint8Array([1, 3, 5, 7, 10, 30, 50, 70, 2, 4, 6, 8, 20, 40, 60, 80]));
            done();
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Upload model topology only', function (done) {
        var weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: weightSpecs1,
            }];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(undefined);
            done();
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Mismatch in number of paths and number of files', function (done) {
        var weightsManifest = [{
                paths: ['./model.weights.1.bin'],
                weights: weightSpecs1,
            }];
        var weightsTopologyAndManifest = {
            modelTopology: weightSpecs1,
            weightsManifest: weightsManifest,
        };
        var weightsBlob1 = new Blob([new Uint8Array([1, 2, 3, 4]).buffer], { type: 'application/octet-stream' });
        var weightsFile1 = new File([weightsBlob1], 'model.weights.1.bin', { type: 'application/octet-stream' });
        var weightsBlob2 = new Blob([new Uint8Array([10, 20, 30, 40]).buffer], { type: 'application/octet-stream' });
        var weightsFile2 = new File([weightsBlob2], 'model.weights.2.bin', { type: 'application/octet-stream' });
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile2, weightsFile1]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            done.fail('Loading with mismatch in number of paths and number of files ' +
                'succeeded unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toEqual('Mismatch in the number of files in weights manifest (1) ' +
                'and the number of weight files provided (2).');
            done();
        });
    });
    it('Mismatch in manifest paths and file names', function (done) {
        var weightSpecs = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightsManifest = [{
                paths: ['./model.weights.1.bin', './model.weights.2.bin'],
                weights: weightSpecs,
            }];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var weightsBlob1 = new Blob([new Uint8Array([1, 2, 3, 4]).buffer], { type: 'application/octet-stream' });
        var weightsFile1 = new File([weightsBlob1], 'model.weights.1.bin', { type: 'application/octet-stream' });
        var weightsBlob2 = new Blob([new Uint8Array([10, 20, 30, 40]).buffer], { type: 'application/octet-stream' });
        var weightsFile2 = new File([weightsBlob2], 'model.weights.3.bin', { type: 'application/octet-stream' });
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            done.fail('Loading with mismatching paths and file names ' +
                'succeeded unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toEqual('Weight file with basename \'model.weights.2.bin\' is not ' +
                'provided.');
            done();
        });
    });
    it('Duplicate basenames in paths fails', function (done) {
        var weightSpecs = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        var weightsManifest = [{
                paths: ['./dir1/model.weights.1.bin', './dir2/model.weights.1.bin'],
                weights: weightSpecs,
            }];
        var weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest: weightsManifest,
        };
        var weightsBlob1 = new Blob([new Uint8Array([1, 2, 3, 4]).buffer], { type: 'application/octet-stream' });
        var weightsFile1 = new File([weightsBlob1], 'model.weights.1.bin', { type: 'application/octet-stream' });
        var weightsBlob2 = new Blob([new Uint8Array([10, 20, 30, 40]).buffer], { type: 'application/octet-stream' });
        var weightsFile2 = new File([weightsBlob2], 'model.weights.2.bin', { type: 'application/octet-stream' });
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            done.fail('Loading with duplicate basenames in paths ' +
                'succeeded unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toEqual('Duplicate file basename found in weights manifest: ' +
                '\'model.weights.1.bin\'');
            done();
        });
    });
    it('Missing modelTopology from JSON leads to Error', function (done) {
        var weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: weightSpecs1,
            }];
        var weightsTopologyAndManifest = {
            weightsManifest: weightsManifest,
        };
        var jsonBlob = new Blob([JSON.stringify(weightsTopologyAndManifest)], { type: 'application/json' });
        var jsonFile = new File([jsonBlob], 'model.json', { type: 'application/json' });
        var filesHandler = tf.io.browserFiles([jsonFile, weightsFile]);
        filesHandler.load()
            .then(function (modelArtifacts) {
            done.fail('Loading with Files IOHandler with missing modelTopology ' +
                'succeeded unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toMatch(/modelTopology field is missing from file model\.json/);
            done();
        });
    });
    it('Incorrect number of files leads to Error', function () {
        expect(function () { return tf.io.browserFiles(null); }).toThrowError(/at least 1 file/);
        expect(function () { return tf.io.browserFiles([]); }).toThrowError(/at least 1 file/);
    });
});
//# sourceMappingURL=browser_files_test.js.map