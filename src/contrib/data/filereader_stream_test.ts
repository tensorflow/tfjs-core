
import {FileReaderStream} from './filereader_stream';

const range = (start: number, end: number) => {
  return Array.from({length: (end - start)}, (v, k) => k + start);
};

const testBlob = new Blob([new Uint8Array(range(0, 55))]);

describe('FileReaderStream', () => {
  it('Reads the entire file and then closes the stream', (done) => {
    const readStream = new FileReaderStream(testBlob, {chunkSize: 10});
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(6);
          const totalBytes = result.map(x => x.length).reduce((a, b) => a + b);
          expect(totalBytes).toEqual(55);
        })
        .then(done)
        .catch(done.fail);
  });

  it('Reads chunks in order', (done) => {
    const readStream = new FileReaderStream(testBlob, {chunkSize: 10});
    readStream.collectRemaining()
        .then(result => {
          expect(result[0][0]).toEqual(0);
          expect(result[1][0]).toEqual(10);
          expect(result[2][0]).toEqual(20);
          expect(result[3][0]).toEqual(30);
          expect(result[4][0]).toEqual(40);
          expect(result[5][0]).toEqual(50);
        })
        .then(done)
        .catch(done.fail);
  });

  it('Reads chunks of expected sizes', (done) => {
    const readStream = new FileReaderStream(testBlob, {chunkSize: 10});
    readStream.collectRemaining()
        .then(result => {
          expect(result[0].length).toEqual(10);
          expect(result[1].length).toEqual(10);
          expect(result[2].length).toEqual(10);
          expect(result[3].length).toEqual(10);
          expect(result[4].length).toEqual(10);
          expect(result[5].length).toEqual(5);
        })
        .then(done)
        .catch(done.fail);
  });
});
