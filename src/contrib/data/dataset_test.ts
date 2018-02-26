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
 *
 * =============================================================================
 */

import {keep} from '../../globals';
import * as dl from '../../index';
import {Tensor1D, Tensor2D} from '../../tensor';
import {ALL_ENVS, describeWithFlags} from '../../test_util';

import {Dataset, datasetFromConcatenated, datasetFromElements} from './dataset';
import {DataStream, streamFromItems} from './streams/data_stream';
import {DatasetElement} from './types';

class TestDatasetElementStream extends DataStream<DatasetElement> {
  data = Array.from({length: 100}, (v, k) => k);
  currentIndex = 0;

  async next(): Promise<DatasetElement> {
    if (this.currentIndex >= 100) {
      return undefined;
    }
    const elementNumber = this.data[this.currentIndex];
    const result = {
      'number': elementNumber,
      'numberArray': [elementNumber, elementNumber ** 2, elementNumber ** 3],
      'Tensor':
          Tensor1D.new([elementNumber, elementNumber ** 2, elementNumber ** 3]),
      'Tensor2': Tensor2D.new(
          [2, 2],
          [
            elementNumber, elementNumber ** 2, elementNumber ** 3,
            elementNumber ** 4
          ]),
      'string': `Item ${elementNumber}`
    };
    keep(result['Tensor']);
    keep(result['Tensor2']);
    this.currentIndex++;
    return result;
  }
}

export class TestDataset extends Dataset {
  async getStream(): Promise<DataStream<DatasetElement>> {
    return new TestDatasetElementStream();
  }
}

describeWithFlags('Dataset', ALL_ENVS, () => {
  it('can be created by concatenating underlying datasets', done => {
    const a = datasetFromElements([{'item': 1}, {'item': 2}]);
    const b = datasetFromElements([{'item': 3}, {'item': 4}]);
    const c = datasetFromElements([{'item': 5}, {'item': 6}]);
    datasetFromConcatenated([a, b, c])
        .collectAll()
        .then(result => {
          expect(result).toEqual([
            {'item': 1}, {'item': 2}, {'item': 3}, {'item': 4}, {'item': 5},
            {'item': 6}
          ]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be concatenated', done => {
    const a = datasetFromElements([{'item': 1}, {'item': 2}, {'item': 3}]);
    const b = datasetFromElements([{'item': 4}, {'item': 5}, {'item': 6}]);
    a.concatenate(b)
        .collectAll()
        .then(result => {
          expect(result).toEqual([
            {'item': 1}, {'item': 2}, {'item': 3}, {'item': 4}, {'item': 5},
            {'item': 6}
          ]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be repeated a fixed number of times', done => {
    const a = datasetFromElements([{'item': 1}, {'item': 2}, {'item': 3}]);
    a.repeat(4)
        .collectAll()
        .then(result => {
          expect(result).toEqual([
            {'item': 1},
            {'item': 2},
            {'item': 3},
            {'item': 1},
            {'item': 2},
            {'item': 3},
            {'item': 1},
            {'item': 2},
            {'item': 3},
            {'item': 1},
            {'item': 2},
            {'item': 3},
          ]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be repeated indefinitely', done => {
    const a = datasetFromElements([{'item': 1}, {'item': 2}, {'item': 3}]);
    a.repeat().take(234).collectAll().then(done).catch(done.fail);
    done();
  });

  it('can be repeated with state in a closure', done => {
    // This tests a tricky bug having to do with 'this' being set properly.
    // See https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript

    class CustomDataset extends Dataset {
      state = {val: 1};
      async getStream() {
        const result = streamFromItems([
          {'item': this.state.val++}, {'item': this.state.val++},
          {'item': this.state.val++}
        ]);
        return result;
      }
    }
    const a = new CustomDataset();
    a.repeat().take(1234).collectAll().then(done).catch(done.fail);
    done();
  });

  it('can collect all items into memory', done => {
    const ds = new TestDataset();
    ds.collectAll()
        .then(result => {
          expect(result.length).toEqual(100);
        })
        .then(() => expect(dl.memory().numTensors).toEqual(200))
        .then(done)
        .catch(done.fail);
  });

  it('skip does not leak Tensors', done => {
    const ds = new TestDataset();
    expect(dl.memory().numTensors).toEqual(0);
    ds.skip(15)
        .collectAll()
        .then(() => expect(dl.memory().numTensors).toEqual(170))
        .then(done)
        .catch(done.fail);
  });

  it('filter does not leak Tensors', done => {
    const ds = new TestDataset();
    expect(dl.memory().numTensors).toEqual(0);
    ds.filter(x => ((x['number'] as number) % 2 === 0))
        .collectAll()
        .then(() => expect(dl.memory().numTensors).toEqual(100))
        .then(done)
        .catch(done.fail);
  });

  it('map does not leak Tensors when none are returned', done => {
    const ds = new TestDataset();
    expect(dl.memory().numTensors).toEqual(0);
    ds.map(x => ({'constant': 1}))
        .collectAll()
        .then(() => expect(dl.memory().numTensors).toEqual(0))
        .then(done)
        .catch(done.fail);
  });

  it('map does not lose or leak Tensors when some inputs are passed through',
     done => {
       const ds = new TestDataset();
       expect(dl.memory().numTensors).toEqual(0);
       ds.map(x => ({'Tensor2': x['Tensor2']}))
           .collectAll()
           .then(() => expect(dl.memory().numTensors).toEqual(100))
           .then(done)
           .catch(done.fail);
     });

  it('map does not leak Tensors when inputs are replaced', done => {
    const ds = new TestDataset();
    expect(dl.memory().numTensors).toEqual(0);
    ds.map(x => ({'a': Tensor1D.new([1, 2, 3])}))
        .collectAll()
        .then(() => expect(dl.memory().numTensors).toEqual(100))
        .then(done)
        .catch(done.fail);
  });

  it('forEach does not leak Tensors', done => {
    const ds = new TestDataset();
    let count = 0;
    ds.forEach(element => {
        count++;
        return {};
      })
        .then(() => expect(count).toEqual(100))
        .then(() => expect(dl.memory().numTensors).toEqual(0))
        .then(done)
        .catch(done.fail);
  });
});
