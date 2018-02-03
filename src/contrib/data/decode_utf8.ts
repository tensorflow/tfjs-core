// TODO(michaelterry): Determine root cause of why this import is
// not translating to a require during testing.
// import * as utf8 from 'utf8';
// tslint:disable:no-require-imports
const utf8 = require('utf8');
import {QueueStream, DataStream} from './stream';

/**
 * Decode a stream of UTF8-encoded byte arrays to a stream of strings.
 *
 * This is tricky because the incoming byte array boundaries may disrupt a
 * multi-byte UTF8 character. Thus any incomplete character data at the end of
 * a chunk must be carried over and prepended to the next chunk before decoding.
 *
 * In the context of an input pipeline for machine learning, UTF8 decoding is
 * needed to parse text files containing training examples or prediction
 * requests (e.g., formatted as CSV or JSON).  We cannot use the built-in
 * decoding provided by FileReader.readAsText() because here we are in a
 * streaming context, which FileReader does not support.
 *
 * @param upstream A `DataStream` of `Uint8Arrays` containing UTF8-encoded
 *   text, which should be interpreted as concatenated.  No assumptions are made
 *   about the boundaries of the incoming chunks, so a multi-byte UTF8 encoding
 *   of a character may span the boundary between chunks.  This naturally
 *   happens, for instance, when reading fixed-size byte arrays from a file.
 */
export function decodeUTF8(upstream: DataStream<Uint8Array>):
    QueueStream<string> {
  return new Utf8Stream(upstream);
}

class Utf8Stream extends QueueStream<string> {
  // An array of the full required width of the split character, if any.
  partial: Uint8Array = new Uint8Array([]);
  // The number of bytes of that array that are populated so far.
  partialBytesValid = 0;

  constructor(protected readonly upstream: DataStream<Uint8Array>) {
    super();
  }

  async pump(): Promise<boolean> {
    let chunk = await this.upstream.next();
    if (chunk === undefined) {
      if (this.partial.length === 0) {
        return false;
      }
      // Pretend that the pump succeeded in order to emit the small last batch.
      // The next pump() call will actually fail.
      chunk = new Uint8Array([]);
    }
    const partialBytesRemaining = this.partial.length - this.partialBytesValid;
    let nextIndex = partialBytesRemaining;
    let okUpToIndex = nextIndex;
    let splitUtfWidth = 0;

    while (nextIndex < chunk.length) {
      okUpToIndex = nextIndex;
      splitUtfWidth = utfWidth(chunk[nextIndex]);
      nextIndex = okUpToIndex + splitUtfWidth;
    }
    if (nextIndex === chunk.length) {
      okUpToIndex = nextIndex;
    }

    // decode most of the chunk without copying it first
    const bulk: string = utf8.decode(String.fromCharCode.apply(
        null, chunk.slice(partialBytesRemaining, okUpToIndex)));

    if (partialBytesRemaining > 0) {
      // Reassemble the split character
      this.partial.set(
          chunk.slice(0, partialBytesRemaining), this.partialBytesValid);
      // Too bad about the string concat.
      const reassembled: string =
          utf8.decode(String.fromCharCode.apply(null, this.partial));
      this.outputQueue.push(reassembled + bulk);
    } else {
      this.outputQueue.push(bulk);
    }

    if (okUpToIndex === chunk.length) {
      this.partial = new Uint8Array([]);
      this.partialBytesValid = 0;
    } else {
      // prepare the next split character
      this.partial = new Uint8Array(new ArrayBuffer(splitUtfWidth));
      this.partial.set(chunk.slice(okUpToIndex), 0);
      this.partialBytesValid = chunk.length - okUpToIndex;
    }

    return true;
  }
}

function utfWidth(firstByte: number): number {
  if (firstByte >= 252)
    return 6;
  else if (firstByte >= 248)
    return 5;
  else if (firstByte >= 240)
    return 4;
  else if (firstByte >= 224)
    return 3;
  else if (firstByte >= 192)
    return 2;
  else
    return 1;
}
