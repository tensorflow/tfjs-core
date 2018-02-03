import {Dataset, DatasetElement, ElementArray} from './dataset';
import {DataSource} from './datasource';
import {decodeUTF8} from './decode_utf8';
import {split} from './split';
import {DataStream} from './stream';

/**
 * Represents a potentially large collection of text lines.
 *
 * The produced `DatasetElement`s each contain a single string value, with the
 * key given by the `columnName` argument (default 'line').
 *
 * The results are not batched.
 */
export class TextLineDataset extends Dataset {
  /**
   * Create a `TextLineDataset`.
   *
   * @param input A `DataSource` providing a chunked, UTF8-encoded byte stream.
   * @param columnName The key to use in the resulting `DatasetElement`s
   *   (default 'line').
   */
  constructor(
      protected readonly input: DataSource,
      protected readonly columnName = 'line') {
    super();
  }

  async getStream(): Promise<DataStream<DatasetElement>> {
    const readStream = this.input.getStream();
    const utf8Stream = decodeUTF8(readStream);
    const lineStream = split(utf8Stream, '\n');
    return lineStream.map(x => ({[this.columnName]: x}));
  }
}

/**
 * Represents a potentially large collection of delimited text records.
 *
 * The produced `DatasetElement`s each contain one key-value pair for every
 * column of the table.  When a field is empty in the incoming data, the
 * resulting value is `undefined`.  Values that can be parsed as numbers are
 * emitted as type `number`; otherwise they are left as `string`.
 *
 * The results are not batched.
 */
export class CSVDataset extends Dataset {
  base: TextLineDataset;
  static textColumnName = 'line';
  private hasHeaders = false;
  private _csvColumnNames: string[];

  /**
   * Create a `CSVDataset`.  Note this CSVDataset cannot be used until
   * setCsvColumnNames() is called; that is an async method and so cannot be
   * incorporated into the constructor.  The static async create() method
   * solves this issue.
   *
   * @param input A `DataSource` providing a chunked, UTF8-encoded byte stream.
   */
  private constructor(protected readonly input: DataSource) {
    super();
    this.base = new TextLineDataset(input, CSVDataset.textColumnName);
  }

  get csvColumnNames(): string[] {
    return this._csvColumnNames;
  }

  private async setCsvColumnNames(csvColumnNames?: string[]) {
    if (csvColumnNames != null) {
      this._csvColumnNames = csvColumnNames;
      this.hasHeaders = false;
    } else {
      const stream = await this.base.getStream();
      const firstElement = await stream.next();
      const firstLine: string =
          firstElement[CSVDataset.textColumnName] as string;
      this._csvColumnNames = firstLine.split(',');
      this.hasHeaders = true;
    }
  }

  /**
   * Create a `CSVDataset`.
   *
   * @param input A `DataSource` providing a chunked, UTF8-encoded byte stream.
   * @param csvColumnNames The keys to use for the columns, in order.  If this
   *   argument is provided, it is assumed that the input file does not have a
   *   header line providing the column names.  If this argument is not provided
   *   (or is null or undefined), then the column names are read from the first
   *   line of the input.
   */
  static async create(input: DataSource, csvColumnNames?: string[]) {
    const result = new CSVDataset(input);
    await result.setCsvColumnNames(csvColumnNames);
    return result;
  }

  async getStream(): Promise<DataStream<DatasetElement>> {
    let lines = await this.base.getStream();
    if (this.hasHeaders) {
      // We previously read the first line to get the headers.
      // Now that we're providing data, skip it.
      lines = lines.skip(1);
    }
    return lines.map((x: DatasetElement) => this.makeDatasetElement(x));
  }

  makeDatasetElement(element: DatasetElement): DatasetElement {
    const line = element[CSVDataset.textColumnName] as string;
    // TODO(soergel): proper CSV parsing with escaping, quotes, etc.
    // TODO(soergel): alternate separators, e.g. for TSV
    const values = line.split(',');
    const result: {[key: string]: ElementArray|undefined} = {};
    for (let i = 0; i < this._csvColumnNames.length; i++) {
      const value = values[i];
      // TODO(soergel): specify data type using a schema
      if (value === '') {
        result[this._csvColumnNames[i]] = undefined;
      } else {
        const valueAsNum = Number(value);
        if (isNaN(valueAsNum)) {
          result[this._csvColumnNames[i]] = value;
        } else {
          result[this._csvColumnNames[i]] = valueAsNum;
        }
      }
    }
    return result;
  }
}

// TODO(soergel): add more basic datasets for parity with tf.data
// tf.data.FixedLengthRecordDataset()
// tf.data.TFRecordDataset()
