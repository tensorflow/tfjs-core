
import * as fetchMock from 'fetch-mock';

import {URLStream} from './url_stream';

const testString = 'abcdefghijklmnopqrstuvwxyz';

const url = 'mock_url';
fetchMock.get('*', testString);

describe('URLReaderStream', () => {
  it('Reads the entire file and then closes the stream', (done) => {
    const readStream = new URLStream(url, {chunkSize: 10});
    readStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(3);
          const totalBytes = result.map(x => x.length).reduce((a, b) => a + b);
          expect(totalBytes).toEqual(26);
        })
        .then(done)
        .catch(done.fail);
  });

  it('Reads chunks in order', (done) => {
    const readStream = new URLStream(url, {chunkSize: 10});
    readStream.collectRemaining()
        .then(result => {
          expect(result[0][0]).toEqual('a'.charCodeAt(0));
          expect(result[1][0]).toEqual('k'.charCodeAt(0));
          expect(result[2][0]).toEqual('u'.charCodeAt(0));
        })
        .then(done)
        .catch(done.fail);
  });

  it('Reads chunks of expected sizes', (done) => {
    const readStream = new URLStream(url, {chunkSize: 10});
    readStream.collectRemaining()
        .then(result => {
          expect(result[0].length).toEqual(10);
          expect(result[1].length).toEqual(10);
          expect(result[2].length).toEqual(6);
        })
        .then(done)
        .catch(done.fail);
  });
});

fetchMock.reset();
