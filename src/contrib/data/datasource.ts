import {FileReaderStream, FileReaderStreamOptions} from './filereader_stream';
import {DataStream} from './stream';
import {URLStream} from './url_stream';

/**
 * Represents a data source readable as a stream of binary data chunks.
 *
 * Because `Dataset`s can be read repeatedly (via `Dataset.getStream()`), this
 * provides a means to repeatedly create streams from the underlying data
 * sources.
 */
export abstract class DataSource {
  /**
   * Obtain a new stream of binary data chunks.
   *
   * Starts the new stream from the beginning of the data source, even if other
   * streams have been obtained previously.
   */
  abstract getStream(): DataStream<Uint8Array>;
}

/**
 * Represents a file or blob readable as a stream of binary data chunks.
 */
export class FileDataSource extends DataSource {
  /**
   * Create a `FileDataSource`.
   *
   * @param input A `File` or `Blob` object to read.
   * @param options Options passed to the underlying `FileReaderStream`s,
   *   such as {chunksize: 1024}.
   */
  constructor(
      protected readonly input: File|Blob,
      protected readonly options: FileReaderStreamOptions = {}) {
    super();
  }

  getStream(): DataStream<Uint8Array> {
    return new FileReaderStream(this.input, this.options);
  }
}

/*
 * Represents a URL readable as a stream of binary data chunks.
 */
export class URLDataSource extends DataSource {
  /**
   * Create a `URLDataSource`.
   *
   * @param url A source URL string, or a `Request` object.
   * @param options Options passed to the underlying `FileReaderStream`s,
   *   such as {chunksize: 1024}.
   */
  constructor(
      protected readonly url: RequestInfo,
      protected readonly options: RequestInit = {}) {
    super();
  }

  // TODO(soergel): provide appropriate caching options.  Currently this
  // will download the URL anew for each call to getStream().  Since we have
  // to treat the downloaded file as a blob anyway, we may as well retain it--
  // but that raises GC issues.  Also we may want a persistent disk cache.
  getStream(): DataStream<Uint8Array> {
    return new URLStream(this.url, this.options);
  }
}
