
import {decodeUTF8} from './decode_utf8';
import {FileReaderStream} from './filereader_stream';
import {split} from './split';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const testBlob = new Blob([lorem]);

describe('split', () => {
  it('Correctly splits lines', (done) => {
    const byteStream = new FileReaderStream(testBlob, {chunkSize: 50});
    const utf8Stream = decodeUTF8(byteStream);
    const lineStream = split(utf8Stream, '\n');
    const expected = lorem.split('\n');

    lineStream.collectRemaining()
        .then(result => {
          expect(result.length).toEqual(6);
          const totalCharacters =
              result.map(x => x.length).reduce((a, b) => a + b);
          expect(totalCharacters).toEqual(440);
          expect(result).toEqual(expected);
          expect(result.join('\n')).toEqual(lorem);
        })
        .then(done)
        .catch(done.fail);
  });
  it('Correctly splits strings even when separators fall on chunk boundaries',
     (done) => {
       const byteStream = new FileReaderStream(
           new Blob(['ab def hi      pq']), {chunkSize: 3});
       // Note the initial chunking will be
       //   ['ab ', 'def', ' hi', '   ', '   ', 'pq],
       // so here we are testing for correct behavior when
       //   * a separator is the last character in a chunk (the first chunk),
       //   * it is the first character (the third chunk), and
       //   * when the entire chunk consists of separators (fourth and fifth).
       const utf8Stream = decodeUTF8(byteStream);
       const lineStream = split(utf8Stream, ' ');
       const expected = ['ab', 'def', 'hi', '', '', '', '', '', 'pq'];

       lineStream.collectRemaining()
           .then(result => {
             expect(result.length).toEqual(9);
             const totalCharacters =
                 result.map(x => x.length).reduce((a, b) => a + b);
             expect(totalCharacters).toEqual(9);
             expect(result).toEqual(expected);
             expect(result.join(' ')).toEqual('ab def hi      pq');
           })
           .then(done)
           .catch(done.fail);
     });
});
