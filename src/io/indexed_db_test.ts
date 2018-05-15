/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/**
 * Unit tests for indexed_db.ts.
 */

import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {CPU_ENVS} from '../test_util';

// tslint:disable-next-line:max-line-length
import {browserIndexedDB, BrowserIndexedDB, deleteDatabase, indexedDBRouter} from './indexed_db';

describeWithFlags('IndexedDB', CPU_ENVS, () => {
  // Test data.
  const modelTopology1: {} = {
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
        'bias_initializer': {'class_name': 'Zeros', 'config': {}},
        'units': 1,
        'batch_input_shape': [null, 3],
        'use_bias': true,
        'activity_regularizer': null
      }
    }],
    'backend': 'tensorflow'
  };
  const weightSpecs1: tf.io.WeightsManifestEntry[] = [
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
  const weightData1 = new ArrayBuffer(16);
  const artifacts1: tf.io.ModelArtifacts = {
    modelTopology: modelTopology1,
    weightSpecs: weightSpecs1,
    weightData: weightData1,
  };

  const weightSpecs2: tf.io.WeightsManifestEntry[] = [
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

  beforeEach(done => {
    deleteDatabase().then(() => {
      done();
    });
  });

  afterEach(done => {
    deleteDatabase().then(() => {
      done();
    });
  });

  it('Save-load round trip', done => {
    const testStartDate = new Date();
    const handler = tf.io.getSaveHandlers('indexeddb://FooModel')[0];
    handler.save(artifacts1)
        .then(saveResult => {
          expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
              .toBeGreaterThanOrEqual(testStartDate.getTime());
          // Note: The following two assertions work only because there is no
          //   non-ASCII characters in `modelTopology1` and `weightSpecs1`.
          expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
              .toEqual(JSON.stringify(modelTopology1).length);
          expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
              .toEqual(JSON.stringify(weightSpecs1).length);
          expect(saveResult.modelArtifactsInfo.weightDataBytes)
              .toEqual(weightData1.byteLength);

          handler.load()
              .then(loadedArtifacts => {
                expect(loadedArtifacts.modelTopology).toEqual(modelTopology1);
                expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
                expect(loadedArtifacts.weightData).toEqual(weightData1);
                done();
              })
              .catch(err => {
                console.error(err.stack);
              });
        })
        .catch(err => {
          console.error(err.stack);
        });
  });

  it('Save two models and load one', done => {
    const weightData2 = new ArrayBuffer(24);
    const artifacts2: tf.io.ModelArtifacts = {
      modelTopology: modelTopology1,
      weightSpecs: weightSpecs2,
      weightData: weightData2,
    };
    const handler1 = tf.io.getSaveHandlers('indexeddb://Model/1')[0];
    handler1.save(artifacts1)
        .then(saveResult1 => {
          // Note: The following two assertions work only because there is no
          // non-ASCII characters in `modelTopology1` and `weightSpecs1`.
          expect(saveResult1.modelArtifactsInfo.modelTopologyBytes)
              .toEqual(JSON.stringify(modelTopology1).length);
          expect(saveResult1.modelArtifactsInfo.weightSpecsBytes)
              .toEqual(JSON.stringify(weightSpecs1).length);
          expect(saveResult1.modelArtifactsInfo.weightDataBytes)
              .toEqual(weightData1.byteLength);

          const handler2 = tf.io.getSaveHandlers('indexeddb://Model/2')[0];
          handler2.save(artifacts2)
              .then(saveResult2 => {
                expect(saveResult2.modelArtifactsInfo.dateSaved.getTime())
                    .toBeGreaterThanOrEqual(
                        saveResult1.modelArtifactsInfo.dateSaved.getTime());
                // Note: The following two assertions work only because there is
                // no non-ASCII characters in `modelTopology1` and
                // `weightSpecs1`.
                expect(saveResult2.modelArtifactsInfo.modelTopologyBytes)
                    .toEqual(JSON.stringify(modelTopology1).length);
                expect(saveResult2.modelArtifactsInfo.weightSpecsBytes)
                    .toEqual(JSON.stringify(weightSpecs2).length);
                expect(saveResult2.modelArtifactsInfo.weightDataBytes)
                    .toEqual(weightData2.byteLength);

                handler1.load()
                    .then(loadedArtifacts => {
                      expect(loadedArtifacts.modelTopology)
                          .toEqual(modelTopology1);
                      expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
                      expect(loadedArtifacts.weightData).toEqual(weightData1);
                      done();
                    })
                    .catch(err => {
                      console.error(err.stack);
                    });
              })
              .catch(err => {
                console.error(err.stack);
              });
        })
        .catch(err => {
          console.error(err.stack);
        });
  });

  it('Loading nonexistent model fails', done => {
    const handler = tf.io.getSaveHandlers('indexeddb://NonexistentModel')[0];
    handler.load()
        .then(modelArtifacts => {
          done.fail(
              'Loading nonexistent model from IndexedDB succeeded unexpectly');
        })
        .catch(err => {
          expect(err.message)
              .toEqual(
                  'Cannot find model with path \'NonexistentModel\' in ' +
                  'IndexedDB.');
          done();
        });
  });

  it('Null, undefined or empty modelPath throws Error', () => {
    expect(() => browserIndexedDB(null))
        .toThrowError(
            /IndexedDB, modelPath must not be null, undefined or empty/);
    expect(() => browserIndexedDB(undefined))
        .toThrowError(
            /IndexedDB, modelPath must not be null, undefined or empty/);
    expect(() => browserIndexedDB(''))
        .toThrowError(
            /IndexedDB, modelPath must not be null, undefined or empty./);
  });

  it('router', () => {
    expect(indexedDBRouter('indexeddb://bar') instanceof BrowserIndexedDB)
        .toEqual(true);
    expect(indexedDBRouter('localstorage://bar')).toBeNull();
    expect(indexedDBRouter('qux')).toBeNull();
  });

  it('Manager: List models: 0 result', done => {
    // Before any model is saved, listModels should return empty result.
    tf.io.browserIndexedDBManager()
        .listModels()
        .then(out => {
          expect(out).toEqual({});
          done();
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: List models: 1 result', done => {
    const handler = tf.io.getSaveHandlers('indexeddb://baz/QuxModel')[0];
    handler.save(artifacts1)
        .then(saveResult => {
          // After successful saving, there should be one model.
          tf.io.browserIndexedDBManager()
              .listModels()
              .then(out => {
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
              .catch(err => {
                done.fail(err.stack);
              });
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: List models: 2 results', done => {
    // First, save a model.
    const handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
    handler1.save(artifacts1)
        .then(saveResult1 => {
          // Then, save the model under another path.
          const handler2 =
              tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
          handler2.save(artifacts1)
              .then(saveResult2 => {
                // After successful saving, there should be one model.
                tf.io.browserIndexedDBManager()
                    .listModels()
                    .then(out => {
                      expect(Object.keys(out).length).toEqual(2);
                      expect(out['QuxModel'].modelTopologyType)
                          .toEqual(
                              saveResult1.modelArtifactsInfo.modelTopologyType);
                      expect(out['QuxModel'].modelTopologyBytes)
                          .toEqual(saveResult1.modelArtifactsInfo
                                       .modelTopologyBytes);
                      expect(out['QuxModel'].weightSpecsBytes)
                          .toEqual(
                              saveResult1.modelArtifactsInfo.weightSpecsBytes);
                      expect(out['QuxModel'].weightDataBytes)
                          .toEqual(
                              saveResult1.modelArtifactsInfo.weightDataBytes);
                      expect(out['repeat/QuxModel'].modelTopologyType)
                          .toEqual(
                              saveResult2.modelArtifactsInfo.modelTopologyType);
                      expect(out['repeat/QuxModel'].modelTopologyBytes)
                          .toEqual(saveResult2.modelArtifactsInfo
                                       .modelTopologyBytes);
                      expect(out['repeat/QuxModel'].weightSpecsBytes)
                          .toEqual(
                              saveResult2.modelArtifactsInfo.weightSpecsBytes);
                      expect(out['repeat/QuxModel'].weightDataBytes)
                          .toEqual(
                              saveResult2.modelArtifactsInfo.weightDataBytes);
                      done();
                    })
                    .catch(err => {
                      done.fail(err.stack);
                    });
              })
              .catch(err => {
                done.fail(err.stack);
              });
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: Successful deleteModel', done => {
    // First, save a model.
    const handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
    handler1.save(artifacts1)
        .then(saveResult1 => {
          // Then, save the model under another path.
          const handler2 =
              tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
          handler2.save(artifacts1)
              .then(saveResult2 => {
                // After successful saving, delete the first save, and then
                // `listModel` should give only one result.
                const manager = tf.io.browserIndexedDBManager();

                manager.deleteModel('QuxModel')
                    .then(deletedInfo => {
                      manager.listModels().then(out => {
                        expect(Object.keys(out)).toEqual(['repeat/QuxModel']);
                      });
                      done();
                    })
                    .catch(err => {
                      done.fail(err.stack);
                    });
              })
              .catch(err => {
                done.fail(err.stack);
              });
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: Successful deleteModel with URL scheme', done => {
    // First, save a model.
    const handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
    handler1.save(artifacts1)
        .then(saveResult1 => {
          // Then, save the model under another path.
          const handler2 =
              tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
          handler2.save(artifacts1)
              .then(saveResult2 => {
                // After successful saving, delete the first save, and then
                // `listModel` should give only one result.
                const manager = tf.io.browserIndexedDBManager();

                // Delete a model specified with a path that includes the
                // indexeddb:// scheme prefix should work.
                manager.deleteModel('indexeddb://QuxModel')
                    .then(deletedInfo => {
                      manager.listModels().then(out => {
                        expect(Object.keys(out)).toEqual(['repeat/QuxModel']);
                      });
                      done();
                    })
                    .catch(err => {
                      done.fail(err.stack);
                    });
              })
              .catch(err => {
                done.fail(err.stack);
              });
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: Failed deletedModel', done => {
    // Attempt to delete a nonexistent model is expected to fail.
    tf.io.browserIndexedDBManager()
        .deleteModel('nonexistent')
        .then(out => {
          done.fail('Deleting nonexistent model succeeded unexpectedly.');
        })
        .catch(err => {
          expect(err.message)
              .toEqual(
                  'Cannot find model with path \'nonexistent\' in IndexedDB.');
          done();
        });
  });

  it('Manager: Successful copyModel', done => {
    // First, save a model.
    const handler1 = tf.io.getSaveHandlers('indexeddb://a1/QuxModel')[0];
    handler1.save(artifacts1)
        .then(saveResult => {
          // Once model is saved, copy the model to another path.
          const manager = tf.io.browserIndexedDBManager();
          manager.copyModel('a1/QuxModel', 'a1/clone/QuxModel')
              .then(modelInfo => {
                manager.listModels().then(out => {
                  expect(Object.keys(out).length).toEqual(2);
                  expect(out['a1/QuxModel'].modelTopologyType)
                      .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                  expect(out['a1/QuxModel'].modelTopologyBytes)
                      .toEqual(
                          saveResult.modelArtifactsInfo.modelTopologyBytes);
                  expect(out['a1/QuxModel'].weightSpecsBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                  expect(out['a1/QuxModel'].weightDataBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                  expect(out['a1/clone/QuxModel'].modelTopologyType)
                      .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                  expect(out['a1/clone/QuxModel'].modelTopologyBytes)
                      .toEqual(
                          saveResult.modelArtifactsInfo.modelTopologyBytes);
                  expect(out['a1/clone/QuxModel'].weightSpecsBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                  expect(out['a1/clone/QuxModel'].weightDataBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);

                  // Load the copy and verify the content.
                  const handler2 =
                      tf.io.getLoadHandlers('indexeddb://a1/clone/QuxModel')[0];
                  handler2.load()
                      .then(loaded => {
                        expect(loaded.modelTopology).toEqual(modelTopology1);
                        expect(loaded.weightSpecs).toEqual(weightSpecs1);
                        expect(new Uint8Array(loaded.weightData))
                            .toEqual(new Uint8Array(weightData1));
                        done();
                      })
                      .catch(err => {
                        done.fail(err.stack);
                      });
                });
              })
              .catch(err => {
                done.fail(err.stack);
              });
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: Successful copyModel with URL scheme', done => {
    // First, save a model.
    const handler1 = tf.io.getSaveHandlers('indexeddb://a1/QuxModel')[0];
    handler1.save(artifacts1)
        .then(saveResult => {
          // Once model is saved, copy the model to another path.
          const manager = tf.io.browserIndexedDBManager();
          // Copying model with paths prefixed by the URL scheme should work.
          manager
              .copyModel(
                  'indexeddb://a1/QuxModel', 'indexeddb://a1/clone/QuxModel')
              .then(modelInfo => {
                manager.listModels().then(out => {
                  expect(Object.keys(out).length).toEqual(2);
                  expect(out['a1/QuxModel'].modelTopologyType)
                      .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                  expect(out['a1/QuxModel'].modelTopologyBytes)
                      .toEqual(
                          saveResult.modelArtifactsInfo.modelTopologyBytes);
                  expect(out['a1/QuxModel'].weightSpecsBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                  expect(out['a1/QuxModel'].weightDataBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                  expect(out['a1/clone/QuxModel'].modelTopologyType)
                      .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                  expect(out['a1/clone/QuxModel'].modelTopologyBytes)
                      .toEqual(
                          saveResult.modelArtifactsInfo.modelTopologyBytes);
                  expect(out['a1/clone/QuxModel'].weightSpecsBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                  expect(out['a1/clone/QuxModel'].weightDataBytes)
                      .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);

                  // Load the copy and verify the content.
                  const handler2 =
                      tf.io.getLoadHandlers('indexeddb://a1/clone/QuxModel')[0];
                  handler2.load()
                      .then(loaded => {
                        expect(loaded.modelTopology).toEqual(modelTopology1);
                        expect(loaded.weightSpecs).toEqual(weightSpecs1);
                        expect(new Uint8Array(loaded.weightData))
                            .toEqual(new Uint8Array(weightData1));
                        done();
                      })
                      .catch(err => {
                        done.fail(err.stack);
                      });
                });
              })
              .catch(err => {
                done.fail(err.stack);
              });
        })
        .catch(err => {
          done.fail(err.stack);
        });
  });

  it('Manager: Failed copyModel', done => {
    // Attempt to copy a nonexistent model should fail.
    tf.io.browserIndexedDBManager()
        .copyModel('nonexistent', 'destination')
        .then(out => {
          done.fail('Copying nonexistent model succeeded unexpectedly.');
        })
        .catch(err => {
          expect(err.message)
              .toEqual(
                  'Cannot find model with path \'nonexistent\' in IndexedDB.');
          done();
        });
  });

  it('Manager: identical oldPath and newPath leads to Error', done => {
    tf.io.browserIndexedDBManager()
        .copyModel('a/1', 'a/1')
        .then(out => {
          done.fail(
              'Copying with identical old & new paths succeeded unexpectedly.');
        })
        .catch(err => {
          expect(err.message)
              .toEqual('Old path and new path are the same: \'a/1\'');
          done();
        });
  });
});
