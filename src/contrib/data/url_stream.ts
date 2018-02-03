import {FileReaderStream} from './filereader_stream';
import {QueueStream} from './stream';

/**
 * Provide a stream of chunks from a URL.
 *
 * Note this class first downloads the entire file into memory before providing
 * the first element from the stream.  This is because the Fetch API does not
 * yet reliably provide a reader stream for the response body.
 */
export class URLStream extends QueueStream<Uint8Array> {
  private blobPromise: Promise<Blob>;
  private fileReaderStream: FileReaderStream;

  /**
   * Create a `URLStream`.
   *
   * @param url A source URL string, or a `Request` object.
   * @param options Options passed to the underlying `FileReaderStream`s,
   *   such as {chunksize: 1024}.
   * @returns a Stream of Uint8Arrays containing sequential chunks of the
   *   input file.
   */
  constructor(protected url: RequestInfo, protected options = {}) {
    super();

    this.blobPromise = fetch(url, options).then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  async pump(): Promise<boolean> {
    if (this.fileReaderStream === undefined) {
      const blob = await this.blobPromise;
      this.fileReaderStream = new FileReaderStream(blob, this.options);
    }
    const chunk = await this.fileReaderStream.next();
    if (chunk === undefined) return false;
    this.outputQueue.push(chunk);
    return true;
  }
}
