// Here we implement a simple asynchronous iterator.
// This lets us avoid using either third-party stream libraries or
// recent TypeScript language support requiring polyfills.
// Note we return Promise<T>, not Promise<IteratorResult<T>>, so this might
// require slight retrofitting in the future if we want to use the ES6 features.

/**
 * An asynchronous iterator, providing lazy access to a potentially unbounded
 * stream of elements.
 */
export abstract class DataStream<T> {
  /**
   * Returns a `Promise` for the next element in the stream.
   *
   * Calling next() on a closed stream returns `undefined`.
   */
  abstract async next(): Promise<T|undefined>;

  /**
   * Collect all remaining elements of a bounded stream into an array.
   * Obviously this will succeed only for small streams that fit in memory.
   * Useful for testing.
   *
   * @returns A Promise for an array of stream elements, which will resolve
   *   when the stream is exhausted.
   */
  async collectRemaining(): Promise<T[]> {
    const result: T[] = [];
    let x = await this.next();
    while (x !== undefined) {
      result.push(x);
      x = await this.next();
    }
    return result;
  }

  /**
   * Create a `DataStream` from an array of items.
   */
  static ofItems<T>(items: T[]): DataStream<T> {
    return new ArrayStream(items);
  }

  /**
   * Create a `DataStream` from a function.
   */
  static ofFunction<T>(func: () => T | Promise<T>): DataStream<T> {
    return new FunctionCallStream(func);
  }

  /**
   * Create a `DataStream` by concatenating underlying streams, which are
   * themselves provided as a stream.
   *
   * This can also be thought of as a "stream flatten" operation.
   *
   * @param baseStreams A stream of streams to be concatenated.
   */
  static async ofConcatenated<T>(baseStreams: DataStream<DataStream<T>>):
      Promise<DataStream<T>> {
    return ChainedStream.create(baseStreams);
  }

  /**
   * Create a `DataStream` by concatenating streams produced by calling a
   * stream-generating function a given number of times.
   *
   * Since a `DataStream` is read-once, it cannot be repeated, but this
   * function can be used to achieve a similar effect:
   *
   *   DataStream.ofConcatenatedFunction(() => new MyStream(), 6);
   *
   * @param streamFunc: A function that produces a new stream on each call.
   * @param count: The number of times to call the function.
   */
  static async ofConcatenatedFunction<T>(
      streamFunc: () => DataStream<T>, count: number): Promise<DataStream<T>> {
    return DataStream.ofConcatenated(
        DataStream.ofFunction(streamFunc).take(count));
  }

  /**
   * Filters this stream according to `predicate`.
   *
   * @param predicate A function mapping a stream element to a boolean or a
   * `Promise` for one.
   *
   * @returns A `DataStream` of elements for which the predicate was true.
   */
  filter(predicate: (value: T) => boolean | Promise<boolean>): DataStream<T> {
    return new FilterStream(this, predicate);
  }

  /**
   * Maps this stream through a 1-to-1 transform.
   *
   * @param predicate A function mapping a stream element to a transformed
   *   element.
   *
   * @returns A `DataStream` of transformed elements.
   */
  map<S>(transform: (value: T) => S | Promise<S>): DataStream<S> {
    return new MapStream(this, transform);
  }

  /**
   * Groups elements into batches.
   *
   * @param batchSize The number of elements desired per batch.
   * @param smallLastBatch Whether to emit the final batch when it has fewer
   *   than batchSize elements. Default true.
   * @returns A `DataStream` of batches of elements, represented as arrays
   *   of the original element type.
   */
  batch(batchSize: number, smallLastBatch = true): DataStream<T[]> {
    return new BatchStream(this, batchSize, smallLastBatch);
  }

  /**
   * Concatenate this `DataStream` with another.
   *
   * @param stream A `DataStream` to be concatenated onto this one.
   * @returns A `DataStream`.
   */
  async concatenate(stream: DataStream<T>): Promise<DataStream<T>> {
    return ChainedStream.create(new ArrayStream([this, stream]));
  }

  /**
   * Limits this stream to return at most `count` items.
   *
   * @param count The maximum number of items to provide from the stream.  If a
   *   negative or undefined value is given, the entire stream is returned
   *   unaltered.
   */
  take(count: number): DataStream<T> {
    if (count < 0 || count === undefined) return this;
    return new TakeStream(this, count);
  }

  /**
   * Skips the first `count` items in this stream.
   *
   * @param count The number of items to skip.  If a negative or undefined value
   *   is given, the entire stream is returned unaltered.
   */
  skip(count: number): DataStream<T> {
    if (count < 0 || count === undefined) return this;
    return new SkipStream(this, count);
  }
}

/**
 * A base class for transforming streams that operate by maintaining an
 * output queue of elements that are ready to return via next().  This is
 * commonly required when the transformation is not 1-to-1, so a variable number
 * of calls to the underlying stream may be needed to provide each element of
 * this stream.
 */
export abstract class QueueStream<T> extends DataStream<T> {
  protected outputQueue: T[] = [];

  /**
   * Read one or more chunks from upstream and process them, possibly reading or
   * writing a carryover, and adding processed items to the output queue.  Note
   * it's possible that no items are added to the queue on a given
   * pump() call, even if the upstream stream is not closed (e.g., because items
   * are filtered).
   *
   * @return `true` if any action was taken, i.e. fetching items from the
   *   upstream source OR adding items to the output queue.  `false` if the
   *   upstream source is exhausted AND nothing was added to the queue (i.e.,
   *   any remaining carryover).
   */
  protected abstract async pump(): Promise<boolean>;

  async next(): Promise<T|undefined> {
    // Fetch so that the queue contains at least one item if possible.
    // If the upstream source is exhausted, AND there are no items left in the
    // output queue, then this stream is also exhausted.
    while (this.outputQueue.length === 0) {
      if (!await this.pump()) {
        return undefined;
      }
    }
    // TODO(soergel): efficient ring buffer implementation
    return this.outputQueue.shift();
  }
}

class FilterStream<T> extends QueueStream<T> {
  constructor(
      protected upstream: DataStream<T>,
      protected predicate: (value: T) => boolean | Promise<boolean>) {
    super();
  }

  async pump() {
    const item = await this.upstream.next();
    if (item === undefined) {
      return false;
    }
    let accept = this.predicate(item);
    if (accept instanceof Promise) {
      accept = await accept;
    }
    if (accept) {
      this.outputQueue.push(item);
    }
    return true;
  }
}

class MapStream<T, S> extends QueueStream<S> {
  constructor(
      protected upstream: DataStream<T>,
      protected transform: (value: T) => S | Promise<S>) {
    super();
  }

  async pump() {
    const item = await this.upstream.next();
    if (item === undefined) {
      return false;
    }
    let mapped = this.transform(item);
    if (mapped instanceof Promise) {
      mapped = await mapped;
    }
    this.outputQueue.push(mapped);
    return true;
  }
}

class BatchStream<T> extends QueueStream<T[]> {
  constructor(
      protected upstream: DataStream<T>, protected batchSize: number,
      protected enableSmallLastBatch = true) {
    super();
  }

  private currentBatch: T[] = [];

  async pump(): Promise<boolean> {
    const item = await this.upstream.next();
    if (item === undefined) {
      if (this.enableSmallLastBatch && this.currentBatch.length > 0) {
        this.outputQueue.push(this.currentBatch);
        this.currentBatch = [];

        // Pretend that the pump succeeded in order to emit the small last
        // batch. The next pump() call will actually fail.
        return true;
      }
      return false;
    }
    this.currentBatch.push(item);
    if (this.currentBatch.length === this.batchSize) {
      this.outputQueue.push(this.currentBatch);
      this.currentBatch = [];
    }
    return true;
  }
}

class ChainState<T> {
  constructor(
      public readonly item: T, public readonly currentStream: DataStream<T>,
      public readonly moreStreams: DataStream<DataStream<T>>) {}
}

/**
 * Provides a `DataStream` that concatenates a stream of underlying streams.
 *
 * Doing this in a concurrency-safe way requires some trickery.  In particular,
 * we want this stream to return the elements from the underlying streams in
 * the correct order according to when next() was called, even if the resulting
 * Promises resolve in a different order.
 */
export class ChainedStream<T> extends DataStream<T> {
  private currentPromise: Promise<ChainState<T>>;

  static async create<T>(baseStreams: DataStream<DataStream<T>>):
      Promise<ChainedStream<T>> {
    const c = new ChainedStream<T>();
    const currentStream = await baseStreams.next();
    c.currentPromise =
        Promise.resolve(new ChainState(undefined, currentStream, baseStreams));
    return c;
  }

  private static async nextState<T>(afterState: Promise<ChainState<T>>):
      Promise<ChainState<T>> {
    const state = await afterState;
    let stream = state.currentStream;
    if (stream === undefined) {
      return new ChainState(undefined, undefined, state.moreStreams);
    }
    const item = await stream.next();
    if (item === undefined) {
      stream = await state.moreStreams.next();
      return this.nextState(Promise.resolve(
          new ChainState(undefined, stream, state.moreStreams)));
    }
    return new ChainState(item, stream, state.moreStreams);
  }

  async next(): Promise<T|undefined> {
    this.currentPromise = ChainedStream.nextState(this.currentPromise);
    return (await this.currentPromise).item;
  }
}

class ArrayStream<T> extends DataStream<T> {
  private trav = 0;
  constructor(protected items: T[]) {
    super();
  }

  async next(): Promise<T|undefined> {
    if (this.trav >= this.items.length) {
      return undefined;
    }
    const result = this.items[this.trav];
    this.trav++;
    return result;
  }
}

class FunctionCallStream<T> extends DataStream<T> {
  constructor(protected nextFn: () => T | Promise<T>) {
    super();
  }

  async next(): Promise<T|undefined> {
    return this.nextFn();
  }
}

class TakeStream<T> extends DataStream<T> {
  count = 0;
  constructor(protected upstream: DataStream<T>, protected maxCount: number) {
    super();
  }

  async next(): Promise<T|undefined> {
    if (this.count++ >= this.maxCount) {
      return undefined;
    }
    return this.upstream.next();
  }
}

class SkipStream<T> extends DataStream<T> {
  count = 0;
  constructor(protected upstream: DataStream<T>, protected maxCount: number) {
    super();
  }

  async next(): Promise<T|undefined> {
    while (this.count++ < this.maxCount) {
      const skipped = await this.upstream.next();
      // short-circuit if upstream is already empty
      if (skipped === undefined) {
        return undefined;
      }
    }
    return this.upstream.next();
  }
}
