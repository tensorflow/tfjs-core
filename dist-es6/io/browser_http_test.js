import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { CPU_ENVS } from '../test_util';
import { BrowserHTTPRequest, httpRequestRouter } from './browser_http';
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
describeWithFlags('browserHTTPRequest-save', CPU_ENVS, function () {
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
    var requestInits = [];
    beforeEach(function () {
        requestInits = [];
        spyOn(window, 'fetch').and.callFake(function (path, init) {
            if (path === 'model-upload-test' || path === 'http://model-upload-test') {
                requestInits.push(init);
                return new Response(null, { status: 200 });
            }
            else {
                return new Response(null, { status: 404 });
            }
        });
    });
    it('Save topology and weights, default POST method', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.getSaveHandlers('http://model-upload-test')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                .toEqual(JSON.stringify(weightSpecs1).length);
            expect(saveResult.modelArtifactsInfo.weightDataBytes)
                .toEqual(weightData1.byteLength);
            expect(requestInits.length).toEqual(1);
            var init = requestInits[0];
            expect(init.method).toEqual('POST');
            var body = init.body;
            var jsonFile = body.get('model.json');
            var jsonFileReader = new FileReader();
            jsonFileReader.onload = function (event) {
                var modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(modelJSON.weightsManifest.length).toEqual(1);
                expect(modelJSON.weightsManifest[0].weights).toEqual(weightSpecs1);
                var weightsFile = body.get('model.weights.bin');
                var weightsFileReader = new FileReader();
                weightsFileReader.onload = function (event) {
                    var weightData = event.target.result;
                    expect(new Uint8Array(weightData))
                        .toEqual(new Uint8Array(weightData1));
                    done();
                };
                weightsFileReader.onerror = function (error) {
                    done.fail(error.message);
                };
                weightsFileReader.readAsArrayBuffer(weightsFile);
            };
            jsonFileReader.onerror = function (error) {
                done.fail(error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Save topology only, default POST method', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.getSaveHandlers('http://model-upload-test')[0];
        var topologyOnlyArtifacts = { modelTopology: modelTopology1 };
        handler.save(topologyOnlyArtifacts)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes).toEqual(0);
            expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(0);
            expect(requestInits.length).toEqual(1);
            var init = requestInits[0];
            expect(init.method).toEqual('POST');
            var body = init.body;
            var jsonFile = body.get('model.json');
            var jsonFileReader = new FileReader();
            jsonFileReader.onload = function (event) {
                var modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(body.get('model.weights.bin')).toEqual(null);
                done();
            };
            jsonFileReader.onerror = function (error) {
                done.fail(error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('Save topology and weights, PUT method, extra headers', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.browserHTTPRequest('model-upload-test', {
            method: 'PUT',
            headers: {
                'header_key_1': 'header_value_1',
                'header_key_2': 'header_value_2'
            }
        });
        handler.save(artifacts1)
            .then(function (saveResult) {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
                .toEqual(JSON.stringify(weightSpecs1).length);
            expect(saveResult.modelArtifactsInfo.weightDataBytes)
                .toEqual(weightData1.byteLength);
            expect(requestInits.length).toEqual(1);
            var init = requestInits[0];
            expect(init.method).toEqual('PUT');
            expect(init.headers).toEqual({
                'header_key_1': 'header_value_1',
                'header_key_2': 'header_value_2'
            });
            var body = init.body;
            var jsonFile = body.get('model.json');
            var jsonFileReader = new FileReader();
            jsonFileReader.onload = function (event) {
                var modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(modelJSON.weightsManifest.length).toEqual(1);
                expect(modelJSON.weightsManifest[0].weights).toEqual(weightSpecs1);
                var weightsFile = body.get('model.weights.bin');
                var weightsFileReader = new FileReader();
                weightsFileReader.onload = function (event) {
                    var weightData = event.target.result;
                    expect(new Uint8Array(weightData))
                        .toEqual(new Uint8Array(weightData1));
                    done();
                };
                weightsFileReader.onerror = function (error) {
                    done.fail(error.message);
                };
                weightsFileReader.readAsArrayBuffer(weightsFile);
            };
            jsonFileReader.onerror = function (error) {
                done.fail(error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(function (err) {
            done.fail(err.stack);
        });
    });
    it('404 response causes Error', function (done) {
        var handler = tf.io.getSaveHandlers('http://invalid/path')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            done.fail('Calling browserHTTPRequest at invalid URL succeeded ' +
                'unexpectedly');
        })
            .catch(function (err) {
            done();
        });
    });
    it('Existing body leads to Error', function () {
        var key1Data = '1337';
        var key2Data = '42';
        var extraFormData = new FormData();
        extraFormData.set('key1', key1Data);
        extraFormData.set('key2', key2Data);
        expect(function () { return tf.io.browserHTTPRequest('model-upload-test', {
            body: extraFormData
        }); }).toThrowError(/requestInit is expected to have no pre-existing body/);
    });
    it('Empty, null or undefined URL paths lead to Error', function () {
        expect(function () { return tf.io.browserHTTPRequest(null); })
            .toThrowError(/must not be null, undefined or empty/);
        expect(function () { return tf.io.browserHTTPRequest(undefined); })
            .toThrowError(/must not be null, undefined or empty/);
        expect(function () { return tf.io.browserHTTPRequest(''); })
            .toThrowError(/must not be null, undefined or empty/);
    });
    it('router', function () {
        expect(httpRequestRouter('http://bar/foo') instanceof BrowserHTTPRequest)
            .toEqual(true);
        expect(httpRequestRouter('https://localhost:5000/upload') instanceof
            BrowserHTTPRequest)
            .toEqual(true);
        expect(httpRequestRouter('localhost://foo')).toBeNull();
        expect(httpRequestRouter('foo:5000/bar')).toBeNull();
    });
});
describeWithFlags('browserHTTPRequest-load', CPU_ENVS, function () {
    var requestInits;
    var setupFakeWeightFiles = function (fileBufferMap) {
        spyOn(window, 'fetch').and.callFake(function (path, init) {
            requestInits.push(init);
            return new Response(fileBufferMap[path]);
        });
    };
    beforeEach(function () {
        requestInits = [];
    });
    it('1 group, 2 weights, 1 path', function (done) {
        var weightManifest1 = [{
                paths: ['weightfile0'],
                weights: [
                    {
                        name: 'dense/kernel',
                        shape: [3, 1],
                        dtype: 'float32',
                    },
                    {
                        name: 'dense/bias',
                        shape: [2],
                        dtype: 'float32',
                    }
                ]
            }];
        var floatData = new Float32Array([1, 3, 3, 7, 4]);
        setupFakeWeightFiles({
            './model.json': JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightManifest1 }),
            './weightfile0': floatData,
        });
        var handler = tf.io.browserHTTPRequest('./model.json');
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightManifest1[0].weights);
            expect(new Float32Array(modelArtifacts.weightData))
                .toEqual(floatData);
            expect(requestInits).toEqual([{}, {}]);
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('1 group, 2 weights, 1 path, with requestInit', function (done) {
        var weightManifest1 = [{
                paths: ['weightfile0'],
                weights: [
                    {
                        name: 'dense/kernel',
                        shape: [3, 1],
                        dtype: 'float32',
                    },
                    {
                        name: 'dense/bias',
                        shape: [2],
                        dtype: 'float32',
                    }
                ]
            }];
        var floatData = new Float32Array([1, 3, 3, 7, 4]);
        setupFakeWeightFiles({
            './model.json': JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightManifest1 }),
            './weightfile0': floatData,
        });
        var handler = tf.io.browserHTTPRequest('./model.json', { headers: { 'header_key_1': 'header_value_1' } });
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightManifest1[0].weights);
            expect(new Float32Array(modelArtifacts.weightData))
                .toEqual(floatData);
            expect(requestInits).toEqual([
                { headers: { 'header_key_1': 'header_value_1' } },
                { headers: { 'header_key_1': 'header_value_1' } }
            ]);
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('1 group, 2 weight, 2 paths', function (done) {
        var weightManifest1 = [{
                paths: ['weightfile0', 'weightfile1'],
                weights: [
                    {
                        name: 'dense/kernel',
                        shape: [3, 1],
                        dtype: 'float32',
                    },
                    {
                        name: 'dense/bias',
                        shape: [2],
                        dtype: 'float32',
                    }
                ]
            }];
        var floatData1 = new Float32Array([1, 3, 3]);
        var floatData2 = new Float32Array([7, 4]);
        setupFakeWeightFiles({
            './model.json': JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightManifest1 }),
            './weightfile0': floatData1,
            './weightfile1': floatData2,
        });
        var handler = tf.io.browserHTTPRequest('./model.json');
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightManifest1[0].weights);
            expect(new Float32Array(modelArtifacts.weightData))
                .toEqual(new Float32Array([1, 3, 3, 7, 4]));
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('2 groups, 2 weight, 2 paths', function (done) {
        var weightsManifest = [
            {
                paths: ['weightfile0'],
                weights: [{
                        name: 'dense/kernel',
                        shape: [3, 1],
                        dtype: 'float32',
                    }]
            },
            {
                paths: ['weightfile1'],
                weights: [{
                        name: 'dense/bias',
                        shape: [2],
                        dtype: 'float32',
                    }],
            }
        ];
        var floatData1 = new Float32Array([1, 3, 3]);
        var floatData2 = new Float32Array([7, 4]);
        setupFakeWeightFiles({
            './model.json': JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightsManifest }),
            './weightfile0': floatData1,
            './weightfile1': floatData2,
        });
        var handler = tf.io.browserHTTPRequest('./model.json');
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
            expect(new Float32Array(modelArtifacts.weightData))
                .toEqual(new Float32Array([1, 3, 3, 7, 4]));
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('2 groups, 2 weight, 2 paths, Int32 and Uint8 Data', function (done) {
        var weightsManifest = [
            {
                paths: ['weightfile0'],
                weights: [{
                        name: 'fooWeight',
                        shape: [3, 1],
                        dtype: 'int32',
                    }]
            },
            {
                paths: ['weightfile1'],
                weights: [{
                        name: 'barWeight',
                        shape: [2],
                        dtype: 'bool',
                    }],
            }
        ];
        var floatData1 = new Int32Array([1, 3, 3]);
        var floatData2 = new Uint8Array([7, 4]);
        setupFakeWeightFiles({
            'path1/model.json': JSON.stringify({ modelTopology: modelTopology1, weightsManifest: weightsManifest }),
            'path1/weightfile0': floatData1,
            'path1/weightfile1': floatData2,
        });
        var handler = tf.io.browserHTTPRequest('path1/model.json');
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
            expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                .toEqual(new Int32Array([1, 3, 3]));
            expect(new Uint8Array(modelArtifacts.weightData.slice(12, 14)))
                .toEqual(new Uint8Array([7, 4]));
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('topology only', function (done) {
        setupFakeWeightFiles({
            './model.json': JSON.stringify({ modelTopology: modelTopology1 }),
        });
        var handler = tf.io.browserHTTPRequest('./model.json');
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toBeUndefined();
            expect(modelArtifacts.weightData).toBeUndefined();
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('weights only', function (done) {
        var weightsManifest = [
            {
                paths: ['weightfile0'],
                weights: [{
                        name: 'fooWeight',
                        shape: [3, 1],
                        dtype: 'int32',
                    }]
            },
            {
                paths: ['weightfile1'],
                weights: [{
                        name: 'barWeight',
                        shape: [2],
                        dtype: 'float32',
                    }],
            }
        ];
        var floatData1 = new Int32Array([1, 3, 3]);
        var floatData2 = new Float32Array([-7, -4]);
        setupFakeWeightFiles({
            'path1/model.json': JSON.stringify({ weightsManifest: weightsManifest }),
            'path1/weightfile0': floatData1,
            'path1/weightfile1': floatData2,
        });
        var handler = tf.io.browserHTTPRequest('path1/model.json');
        handler.load()
            .then(function (modelArtifacts) {
            expect(modelArtifacts.modelTopology).toBeUndefined();
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
            expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                .toEqual(new Int32Array([1, 3, 3]));
            expect(new Float32Array(modelArtifacts.weightData.slice(12, 20)))
                .toEqual(new Float32Array([-7, -4]));
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Missing modelTopology and weightsManifest leads to error', function (done) {
        setupFakeWeightFiles({ 'path1/model.json': JSON.stringify({}) });
        var handler = tf.io.browserHTTPRequest('path1/model.json');
        handler.load()
            .then(function (modelTopology1) {
            done.fail('Loading from missing modelTopology and weightsManifest ' +
                'succeeded expectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toMatch(/contains neither model topology or manifest/);
            done();
        });
    });
});
//# sourceMappingURL=browser_http_test.js.map