import {DataStream, QueueStream} from './stream';

/**
 * Splits a string stream on a given separator.
 *
 * It is assumed that the incoming chunk boundaries have no semantic meaning, so
 * conceptually the incoming stream is treated simply as the concatenation of
 * its elements.
 *
 * The outgoing stream provides chunks corresponding to the results of the
 * standard string split() operation (even if such a chunk spanned incoming
 * chunks).  The separators are not included.
 *
 * A typical usage is to split a text file (represented as a stream with
 * arbitrary chunk boundaries) into lines.
 *
 * @param upstream A readable stream of strings that can be treated as
 *   concatenated.
 * @param separator A character to split on.
 */
export function split(
    upstream: DataStream<string>, separator: string): QueueStream<string> {
  return new SplitStream(upstream, separator);
}

class SplitStream extends QueueStream<string> {
  // A partial string at the end of an upstream chunk
  carryover = '';

  constructor(
      protected upstream: DataStream<string>, protected separator: string) {
    super();
  }

  async pump(): Promise<boolean> {
    const chunk = await this.upstream.next();
    if (chunk === undefined) {
      if (this.carryover === '') {
        return false;
      }

      // Pretend that the pump succeeded in order to emit the small last batch.
      // The next pump() call will actually fail.
      this.outputQueue.push(this.carryover);
      this.carryover = '';
      return true;
    }
    const lines = chunk.split(this.separator);
    // Note the behavior: " ab ".split(' ') === ['', 'ab', '']
    // Thus the carryover may be '' if the separator falls on a chunk
    // boundary; this produces the correct result.

    lines[0] = this.carryover + lines[0];
    for (const line of lines.slice(0, -1)) {
      this.outputQueue.push(line);
    }
    this.carryover = lines[lines.length - 1];

    return true;
  }
}
