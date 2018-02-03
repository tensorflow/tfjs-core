import {Array1D, Array2D, NDArray} from '../../math/ndarray';

// tslint:disable-next-line:max-line-length
import {describeMathCPUAndGPU, expectArraysClose} from '../../test_util';

import {Dataset, DatasetElement} from './dataset';
import {DataStream} from './stream';


class TestDatasetElementStream extends DataStream<DatasetElement> {
  data = Array.from({length: 100}, (v, k) => k);
  currentIndex = 0;

  async next(): Promise<DatasetElement|undefined> {
    if (this.currentIndex >= 100) {
      return undefined;
    }
    const elementNumber = this.data[this.currentIndex];
    const result = {
      'number': elementNumber,
      'numberArray': [elementNumber, elementNumber ** 2, elementNumber ** 3],
      'NDArray':
          Array1D.new([elementNumber, elementNumber ** 2, elementNumber ** 3]),
      'string': `Item ${elementNumber}`
    };

    this.currentIndex++;
    return result;
  }
}

class TestDataset extends Dataset {
  async getStream(): Promise<DataStream<DatasetElement>> {
    return new TestDatasetElementStream();
  }
}

describe('Dataset', () => {
  it('can be created by concatenating underlying datasets', (done) => {
    const a = Dataset.ofElements([{'item': 1}, {'item': 2}]);
    const b = Dataset.ofElements([{'item': 3}, {'item': 4}]);
    const c = Dataset.ofElements([{'item': 5}, {'item': 6}]);
    const readStreamPromise = Dataset.ofConcatenated([a, b, c]).getStream();
    readStreamPromise
        .then(readStream => readStream.collectRemaining().then(result => {
          expect(result).toEqual([
            {'item': 1}, {'item': 2}, {'item': 3}, {'item': 4}, {'item': 5},
            {'item': 6}
          ]);
        }))
        .then(done)
        .catch(done.fail);
  });

  it('can be concatenated', (done) => {
    const a = Dataset.ofElements([{'item': 1}, {'item': 2}, {'item': 3}]);
    const b = Dataset.ofElements([{'item': 4}, {'item': 5}, {'item': 6}]);
    const readStreamPromise = a.concatenate(b).getStream();
    readStreamPromise
        .then(readStream => readStream.collectRemaining().then(result => {
          expect(result).toEqual([
            {'item': 1}, {'item': 2}, {'item': 3}, {'item': 4}, {'item': 5},
            {'item': 6}
          ]);
        }))
        .then(done)
        .catch(done.fail);
  });

  it('can be repeated a fixed number of times', (done) => {
    const a = Dataset.ofElements([{'item': 1}, {'item': 2}, {'item': 3}]);
    const readStreamPromise = a.repeat(4).getStream();
    readStreamPromise
        .then(readStream => readStream.collectRemaining().then(result => {
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
        }))
        .then(done)
        .catch(done.fail);
  });

  it('can be repeated indefinitely', (done) => {
    const a = Dataset.ofElements([{'item': 1}, {'item': 2}, {'item': 3}]);
    const readStreamPromise = a.repeat().getStream();
    readStreamPromise
        .then(readStream => readStream.take(1234).collectRemaining())
        .then(done)
        .catch(done.fail);
    done();
  });

  it('can be repeated with state in a closure', (done) => {
    // This tests a tricky bug having to do with 'this' being set properly.
    // See https://github.com/Microsoft/TypeScript/wiki/%27this%27-in-TypeScript

    class CustomDataset extends Dataset {
      state = {val: 1};
      async getStream() {
        const result = DataStream.ofItems([
          {'item': this.state.val++}, {'item': this.state.val++},
          {'item': this.state.val++}
        ]);
        return result;
      }
    }
    const a = new CustomDataset();
    const readStreamPromise = a.repeat().getStream();
    readStreamPromise
        .then(readStream => readStream.take(1234).collectRemaining())
        .then(done)
        .catch(done.fail);
    done();
  });
});

describeMathCPUAndGPU('Dataset.batch()', [
  () => {
    it('batches entries into column-oriented DatasetBatches', (done) => {
      const ds = new TestDataset();
      const bds = ds.batch(8);
      const batchStreamPromise = bds.getStream();
      batchStreamPromise
          .then(batchStream => batchStream.collectRemaining().then(result => {
            expect(result.length).toEqual(13);
            for (const batch of result.slice(0, 12)) {
              expect((batch['number'] as NDArray).shape).toEqual([8]);
              expect((batch['numberArray'] as NDArray).shape).toEqual([8, 3]);
              expect((batch['NDArray'] as NDArray).shape).toEqual([8, 3]);
              expect((batch['string'] as string[]).length).toEqual(8);
            }
          }))
          .then(done)
          .catch(done.fail);
    });
    it('creates a small last batch', (done) => {
      const ds = new TestDataset();
      const bds = ds.batch(8);
      const batchStreamPromise = bds.getStream();
      batchStreamPromise
          .then(batchStream => batchStream.collectRemaining().then(result => {
            const lastBatch = result[12];
            expect((lastBatch['number'] as NDArray).shape).toEqual([4]);
            expect((lastBatch['numberArray'] as NDArray).shape).toEqual([4, 3]);
            expect((lastBatch['NDArray'] as NDArray).shape).toEqual([4, 3]);
            expect((lastBatch['string'] as string[]).length).toEqual(4);

            expectArraysClose(
                lastBatch['number'] as NDArray, Array1D.new([96, 97, 98, 99]));
            expectArraysClose(
                lastBatch['numberArray'] as NDArray, Array2D.new([4, 3], [
                  [96, 96 ** 2, 96 ** 3], [97, 97 ** 2, 97 ** 3],
                  [98, 98 ** 2, 98 ** 3], [99, 99 ** 2, 99 ** 3]
                ]));
            expectArraysClose(
                lastBatch['NDArray'] as NDArray, Array2D.new([4, 3], [
                  [96, 96 ** 2, 96 ** 3], [97, 97 ** 2, 97 ** 3],
                  [98, 98 ** 2, 98 ** 3], [99, 99 ** 2, 99 ** 3]
                ]));
            expect(lastBatch['string'] as string[]).toEqual([
              'Item 96', 'Item 97', 'Item 98', 'Item 99'
            ]);

            expect(lastBatch['string'] as string[]).toEqual([
              'Item 96', 'Item 97', 'Item 98', 'Item 99'
            ]);
          }))

          .then(done)
          .catch(done.fail);
    });
  }
]);
