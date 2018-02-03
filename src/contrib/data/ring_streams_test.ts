// tslint:disable:max-line-length
import {PrefetchStream, ShuffleStream} from './ring_streams';
import {ChainedStream, DataStream} from './stream';
import {TestIntegerStream} from './stream_test';

// tslint:enable

describe('PrefetchStream', () => {
  it('fetches a stream completely (stream size < buffer size)', (done) => {
    const prefetchStream = new PrefetchStream(new TestIntegerStream(), 500);
    const expectedResult: number[] = [];
    for (let j = 0; j < 100; j++) {
      expectedResult[j] = j;
    }

    prefetchStream.collectRemaining()
        .then(result => {
          expect(result).toEqual(expectedResult);
        })
        .then(done)
        .catch(done.fail);
  });

  it('fetches a chained stream completely (stream size < buffer size)',
     (done) => {
       const baseStreamPromise = DataStream.ofConcatenatedFunction(() => {
         return new TestIntegerStream();
       }, 7);

       const prefetchStreamPromise = baseStreamPromise.then(
           baseStream => new PrefetchStream(baseStream, 1000));
       const expectedResult: number[] = [];
       for (let i = 0; i < 7; i++) {
         for (let j = 0; j < 100; j++) {
           expectedResult[i * 100 + j] = j;
         }
       }

       prefetchStreamPromise
           .then(
               prefetchStream =>
                   prefetchStream.collectRemaining().then(result => {
                     expect(result).toEqual(expectedResult);
                   }))
           .then(done)
           .catch(done.fail);
     });

  it('fetches a chained stream completely (stream size > buffer size)',
     (done) => {
       const baseStreamPromise = DataStream.ofConcatenatedFunction(() => {
         return new TestIntegerStream();
       }, 7);

       const prefetchStreamPromise = baseStreamPromise.then(
           baseStream => new PrefetchStream(baseStream, 500));
       const expectedResult: number[] = [];
       for (let i = 0; i < 7; i++) {
         for (let j = 0; j < 100; j++) {
           expectedResult[i * 100 + j] = j;
         }
       }

       prefetchStreamPromise
           .then(
               prefetchStream =>
                   prefetchStream.collectRemaining().then(result => {
                     expect(result).toEqual(expectedResult);
                   }))
           .then(done)
           .catch(done.fail);
     });
});


describe('ShuffleStream', () => {
  it('shuffles a stream without replacement', (done) => {
    const baseStream = new TestIntegerStream();
    const shuffleStream = new ShuffleStream(baseStream, 1000);
    const notExpectedResult: number[] = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 100; j++) {
        notExpectedResult[i * 100 + j] = j;
      }
    }
    shuffleStream.collectRemaining()
        .then(result => {
          expect(result).not.toEqual(notExpectedResult);
          expect(result.length).toEqual(100);
          const counts = new Array<number>(100);
          result.forEach((x) => {
            counts[x] = (counts[x] || 0) + 1;
          });
          for (let i = 0; i < 100; i++) {
            expect(counts[i]).toEqual(1);
          }
        })
        .then(done)
        .catch(done.fail);
  });

  it('shuffles a single chained stream without replacement', (done) => {
    const baseStreamPromise =
        ChainedStream.create(DataStream.ofItems([new TestIntegerStream()]));
    const shuffleStreamPromise = baseStreamPromise.then(
        baseStream => new ShuffleStream(baseStream, 1000));
    const notExpectedResult: number[] = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 100; j++) {
        notExpectedResult[i * 100 + j] = j;
      }
    }
    shuffleStreamPromise
        .then(shuffleStream => shuffleStream.collectRemaining().then(result => {
          expect(result).not.toEqual(notExpectedResult);
          expect(result.length).toEqual(100);
          const counts = new Array<number>(100);
          result.forEach((x) => {
            counts[x] = (counts[x] || 0) + 1;
          });
          for (let i = 0; i < 100; i++) {
            expect(counts[i]).toEqual(1);
          }
        }))
        .then(done)
        .catch(done.fail);
  });

  it('shuffles multiple chained streams without replacement', (done) => {
    const baseStreamPromise =
        DataStream.ofConcatenatedFunction(() => new TestIntegerStream(), 6);
    const shuffleStreamPromise = baseStreamPromise.then(
        baseStream => new ShuffleStream(baseStream, 1000));
    const notExpectedResult: number[] = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 100; j++) {
        notExpectedResult[i * 100 + j] = j;
      }
    }
    shuffleStreamPromise
        .then(shuffleStream => shuffleStream.collectRemaining().then(result => {
          expect(result).not.toEqual(notExpectedResult);
          expect(result.length).toEqual(600);
          const counts = new Array<number>(100);
          result.forEach((x) => {
            counts[x] = (counts[x] || 0) + 1;
          });
          for (let i = 0; i < 100; i++) {
            expect(counts[i]).toEqual(6);
          }
        }))
        .then(done)
        .catch(done.fail);
  });
});
