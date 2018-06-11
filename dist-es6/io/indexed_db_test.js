import * as tf from '../index';
import { describeWithFlags } from '../jasmine_util';
import { CPU_ENVS } from '../test_util';
import { browserIndexedDB, BrowserIndexedDB, BrowserIndexedDBManager, deleteDatabase, indexedDBRouter } from './indexed_db';
describeWithFlags('IndexedDB', CPU_ENVS, function () {
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
    var weightSpecs2 = [
        {
            name: 'dense/new_kernel',
            shape: [5, 1],
            dtype: 'float32',
        },
        {
            name: 'dense/new_bias',
            shape: [1],
            dtype: 'float32',
        }
    ];
    beforeEach(function (done) {
        deleteDatabase().then(function () {
            done();
        });
    });
    afterEach(function (done) {
        deleteDatabase().then(function () {
            done();
        });
    });
    it('Save-load round trip', function (done) {
        var testStartDate = new Date();
        var handler = tf.io.getSaveHandlers('indexeddb://FooModel')[0];
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
            handler.load()
                .then(function (loadedArtifacts) {
                expect(loadedArtifacts.modelTopology).toEqual(modelTopology1);
                expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
                expect(loadedArtifacts.weightData).toEqual(weightData1);
                done();
            })
                .catch(function (err) {
                console.error(err.stack);
            });
        })
            .catch(function (err) {
            console.error(err.stack);
        });
    });
    it('Save two models and load one', function (done) {
        var weightData2 = new ArrayBuffer(24);
        var artifacts2 = {
            modelTopology: modelTopology1,
            weightSpecs: weightSpecs2,
            weightData: weightData2,
        };
        var handler1 = tf.io.getSaveHandlers('indexeddb://Model/1')[0];
        handler1.save(artifacts1)
            .then(function (saveResult1) {
            expect(saveResult1.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult1.modelArtifactsInfo.weightSpecsBytes)
                .toEqual(JSON.stringify(weightSpecs1).length);
            expect(saveResult1.modelArtifactsInfo.weightDataBytes)
                .toEqual(weightData1.byteLength);
            var handler2 = tf.io.getSaveHandlers('indexeddb://Model/2')[0];
            handler2.save(artifacts2)
                .then(function (saveResult2) {
                expect(saveResult2.modelArtifactsInfo.dateSaved.getTime())
                    .toBeGreaterThanOrEqual(saveResult1.modelArtifactsInfo.dateSaved.getTime());
                expect(saveResult2.modelArtifactsInfo.modelTopologyBytes)
                    .toEqual(JSON.stringify(modelTopology1).length);
                expect(saveResult2.modelArtifactsInfo.weightSpecsBytes)
                    .toEqual(JSON.stringify(weightSpecs2).length);
                expect(saveResult2.modelArtifactsInfo.weightDataBytes)
                    .toEqual(weightData2.byteLength);
                handler1.load()
                    .then(function (loadedArtifacts) {
                    expect(loadedArtifacts.modelTopology)
                        .toEqual(modelTopology1);
                    expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
                    expect(loadedArtifacts.weightData).toEqual(weightData1);
                    done();
                })
                    .catch(function (err) {
                    console.error(err.stack);
                });
            })
                .catch(function (err) {
                console.error(err.stack);
            });
        })
            .catch(function (err) {
            console.error(err.stack);
        });
    });
    it('Loading nonexistent model fails', function (done) {
        var handler = tf.io.getSaveHandlers('indexeddb://NonexistentModel')[0];
        handler.load()
            .then(function (modelArtifacts) {
            done.fail('Loading nonexistent model from IndexedDB succeeded unexpectly');
        })
            .catch(function (err) {
            expect(err.message)
                .toEqual('Cannot find model with path \'NonexistentModel\' in ' +
                'IndexedDB.');
            done();
        });
    });
    it('Null, undefined or empty modelPath throws Error', function () {
        expect(function () { return browserIndexedDB(null); })
            .toThrowError(/IndexedDB, modelPath must not be null, undefined or empty/);
        expect(function () { return browserIndexedDB(undefined); })
            .toThrowError(/IndexedDB, modelPath must not be null, undefined or empty/);
        expect(function () { return browserIndexedDB(''); })
            .toThrowError(/IndexedDB, modelPath must not be null, undefined or empty./);
    });
    it('router', function () {
        expect(indexedDBRouter('indexeddb://bar') instanceof BrowserIndexedDB)
            .toEqual(true);
        expect(indexedDBRouter('localstorage://bar')).toBeNull();
        expect(indexedDBRouter('qux')).toBeNull();
    });
    it('Manager: List models: 0 result', function (done) {
        new BrowserIndexedDBManager()
            .listModels()
            .then(function (out) {
            expect(out).toEqual({});
            done();
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Manager: List models: 1 result', function (done) {
        var handler = tf.io.getSaveHandlers('indexeddb://baz/QuxModel')[0];
        handler.save(artifacts1)
            .then(function (saveResult) {
            new BrowserIndexedDBManager()
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
        var handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult1) {
            var handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
            handler2.save(artifacts1)
                .then(function (saveResult2) {
                new BrowserIndexedDBManager()
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
        var handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult1) {
            var handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
            handler2.save(artifacts1)
                .then(function (saveResult2) {
                var manager = new BrowserIndexedDBManager();
                manager.removeModel('QuxModel')
                    .then(function (deletedInfo) {
                    manager.listModels()
                        .then(function (out) {
                        expect(Object.keys(out)).toEqual([
                            'repeat/QuxModel'
                        ]);
                        done();
                    })
                        .catch(function (err) { return done.fail(err.stack); });
                })
                    .catch(function (err) { return done.fail(err.stack); });
            })
                .catch(function (err) { return done.fail(err.stack); });
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Manager: Successful deleteModel with URL scheme', function (done) {
        var handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
        handler1.save(artifacts1)
            .then(function (saveResult1) {
            var handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
            handler2.save(artifacts1)
                .then(function (saveResult2) {
                var manager = new BrowserIndexedDBManager();
                manager.removeModel('indexeddb://QuxModel')
                    .then(function (deletedInfo) {
                    manager.listModels()
                        .then(function (out) {
                        expect(Object.keys(out)).toEqual([
                            'repeat/QuxModel'
                        ]);
                        done();
                    })
                        .catch(function (err) { return done.fail(err); });
                })
                    .catch(function (err) { return done.fail(err.stack); });
            })
                .catch(function (err) { return done.fail(err.stack); });
        })
            .catch(function (err) { return done.fail(err.stack); });
    });
    it('Manager: Failed deletedModel', function (done) {
        new BrowserIndexedDBManager()
            .removeModel('nonexistent')
            .then(function (out) {
            done.fail('Deleting nonexistent model succeeded unexpectedly.');
        })
            .catch(function (err) {
            expect(err.message)
                .toEqual('Cannot find model with path \'nonexistent\' in IndexedDB.');
            done();
        });
    });
});
//# sourceMappingURL=indexed_db_test.js.map