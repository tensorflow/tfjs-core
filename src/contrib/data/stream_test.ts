// tslint:disable:max-line-length
import {ChainedStream, DataStream} from './stream';
// tslint:enable

export class TestIntegerStream extends DataStream<number> {
  public static data = Array.from({length: 100}, (v, k) => k);
  currentIndex = 0;

  async next() {
    if (this.currentIndex >= 100) {
      return undefined;
    }
    const result = TestIntegerStream.data[this.currentIndex];
    this.currentIndex++;
    // Sleep for a random number of milliseconds, up to 3.
    // This purposely scrambles the order in which these promises are resolved,
    // to demonstrate that the various methods still process the stream
    // in the correct order.
    const randomMS = Math.floor(Math.random() * 3);
    await new Promise(res => setTimeout(res, randomMS));
    return result;
  }
}

describe('DataStream', () => {
  it('collects all stream elements into an array', (done) => {
    const readStream = new TestIntegerStream();
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(100);
        })
        .then(done)
        .catch(done.fail);
  });

  it('reads chunks in order', (done) => {
    const readStream = new TestIntegerStream();
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(100);
          for (let i = 0; i < 100; i++) {
            expect(result[i]).toEqual(i);
          }
        })
        .then(done)
        .catch(done.fail);
  });

  it('filters elements', (done) => {
    const readStream = new TestIntegerStream().filter(x => x % 2 === 0);
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(50);
          for (let i = 0; i < 50; i++) {
            expect(result[i]).toEqual(2 * i);
          }
        })
        .then(done)
        .catch(done.fail);
  });

  it('maps elements', (done) => {
    const readStream = new TestIntegerStream().map(x => `item ${x}`);
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(100);
          for (let i = 0; i < 100; i++) {
            expect(result[i]).toEqual(`item ${i}`);
          }
        })
        .then(done)
        .catch(done.fail);
  });

  it('batches elements', (done) => {
    const readStream = new TestIntegerStream().batch(8);
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(13);
          for (let i = 0; i < 12; i++) {
            expect(result[i]).toEqual(
                Array.from({length: 8}, (v, k) => (i * 8) + k));
          }
          expect(result[12]).toEqual([96, 97, 98, 99]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be limited to a certain number of elements', (done) => {
    const readStream = new TestIntegerStream().take(8);
    readStream.collectRemaining()
        .then(result => {
          expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('is unaltered by a negative or undefined take() count.', (done) => {
    const readStream = new TestIntegerStream().take(-1);
    readStream.collectRemaining()
        .then(result => {
          expect(result).toEqual(TestIntegerStream.data);
        })
        .then(done)
        .catch(done.fail);
    const readStream2 = new TestIntegerStream().take(undefined);
    readStream2.collectRemaining()
        .then(result => {
          expect(result).toEqual(TestIntegerStream.data);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can skip a certain number of elements', (done) => {
    const readStream = new TestIntegerStream().skip(88).take(8);
    readStream.collectRemaining()
        .then(result => {
          expect(result).toEqual([88, 89, 90, 91, 92, 93, 94, 95]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('is unaltered by a negative or undefined skip() count.', (done) => {
    const readStream = new TestIntegerStream().skip(-1);
    readStream.collectRemaining()
        .then(result => {
          expect(result).toEqual(TestIntegerStream.data);
        })
        .then(done)
        .catch(done.fail);
    const readStream2 = new TestIntegerStream().skip(undefined);
    readStream2.collectRemaining()
        .then(result => {
          expect(result).toEqual(TestIntegerStream.data);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be created from an array', (done) => {
    const readStream = DataStream.ofItems([1, 2, 3, 4, 5, 6]);
    readStream.collectRemaining()
        .then(result => {
          expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be created from a function', (done) => {
    let i = -1;
    const func = () => ++i < 7 ? i : undefined;

    const readStream = DataStream.ofFunction(func);
    readStream.collectRemaining()
        .then(result => {
          expect(result).toEqual([0, 1, 2, 3, 4, 5, 6]);
        })
        .then(done)
        .catch(done.fail);
  });

  it('can be concatenated', (done) => {
    const a = DataStream.ofItems([1, 2, 3]);
    const b = DataStream.ofItems([4, 5, 6]);
    const readStreamPromise = a.concatenate(b);
    readStreamPromise
        .then(readStream => readStream.collectRemaining().then(result => {
          expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        }))
        .then(done)
        .catch(done.fail);
  });

  it('can be created by concatenating streams', (done) => {
    const a = new TestIntegerStream();
    const b = new TestIntegerStream();
    const readStreamPromise =
        DataStream.ofConcatenated(DataStream.ofItems([a, b]));
    readStreamPromise
        .then(readStream => readStream.collectRemaining().then(result => {
          expect(result.length).toEqual(200);
        }))
        .then(done)
        .catch(done.fail);
  });

  it('can be created by concatenating streams from a function', (done) => {
    const readStreamPromise =
        DataStream.ofConcatenatedFunction(() => new TestIntegerStream(), 7);
    const expectedResult: number[] = [];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 100; j++) {
        expectedResult[i * 100 + j] = j;
      }
    }

    readStreamPromise
        .then(readStream => readStream.collectRemaining().then(result => {
          expect(result).toEqual(expectedResult);
        }))
        .then(done)
        .catch(done.fail);
  });
});

describe('ChainedStream', () => {
  it('produces a single underlying stream as expected', (done) => {
    const chainedStreamPromise =
        ChainedStream.create(DataStream.ofItems([new TestIntegerStream()]));

    const expectedResult: number[] = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 100; j++) {
        expectedResult[i * 100 + j] = j;
      }
    }

    chainedStreamPromise
        .then(chainedStream => chainedStream.collectRemaining().then(result => {
          expect(result).toEqual(expectedResult);
        }))
        .then(done)
        .catch(done.fail);
  });
  it('produces multiple underlying streams as expected', (done) => {
    const chainedStreamPromise = ChainedStream.create(DataStream.ofItems([
      new TestIntegerStream(), new TestIntegerStream(), new TestIntegerStream(),
      new TestIntegerStream()
    ]));

    const expectedResult: number[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 100; j++) {
        expectedResult[i * 100 + j] = j;
      }
    }

    chainedStreamPromise
        .then(chainedStream => chainedStream.collectRemaining().then(result => {
          expect(result).toEqual(expectedResult);
        }))
        .then(done)
        .catch(done.fail);
  });
});
