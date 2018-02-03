import {decodeUTF8} from './decode_utf8';
import {FileReaderStream} from './filereader_stream';

const runes = `ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ
ᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾ
ᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ᛬`;

const testBlob = new Blob([runes]);

describe('decodeUTF8', () => {
  it('Correctly reassembles split characters', (done) => {
    const byteStream = new FileReaderStream(testBlob, {chunkSize: 50});
    const utf8Stream = decodeUTF8(byteStream);
    expect(testBlob.size).toEqual(323);

    utf8Stream.collectRemaining()
        .then((result: string[]) => {
          // The test string is 109 characters long; its UTF8 encoding is 323
          // bytes. We read it in chunks of 50 bytes, so there were 7 chunks of
          // bytes. The UTF decoder slightly adjusted the boundaries between the
          // chunks to allow decoding, but did not change the number of chunks,
          // so 7 chunks remain.
          expect(result.length).toEqual(7);
          const totalCharacters =
              result.map(x => x.length).reduce((a, b) => a + b);
          expect(totalCharacters).toEqual(109);
          expect(result.join('')).toEqual(runes);
        })
        .then(done)
        .catch(done.fail);
  });
});
