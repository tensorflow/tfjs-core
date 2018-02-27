/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */

import * as seedrandom from 'seedrandom';

import {GrowingRingBuffer} from '../util/growing_ring_buffer';
import {RingBuffer} from '../util/ring_buffer';

// Here we implement a simple asynchronous iterator.
// This lets us avoid using either third-party stream libraries or
// recent TypeScript language support requiring polyfills.
// Note we return Promise<T>, not Promise<IteratorResult<T>>, so this might
// require slight retrofitting in the future if we want to use the ES6 features.

/**
 * Create a `DataStream` from an array of items.
 */
export function streamFromItems<T>(items: T[]): DataStream<T> {
  return new ArrayStream(items);
}

/**
 * Create a `DataStream` of incrementing integers.
 */
export function streamFromIncrementing(start: number): DataStream<number> {
  let i = start;
  return streamFromFunction(() => i++);
}

/**
 * Create a `DataStream` from a function.
 */
export function streamFromFunction<T>(func: () => T | Promise<T>):
    DataStream<T> {
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
export async function streamFromConcatenated<T>(
    baseStreams: DataStream<DataStream<T>>): Promise<DataStream<T>> {
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
export async function streamFromConcatenatedFunction<T>(
    streamFunc: () => DataStream<T>, count: number): Promise<DataStream<T>> {
  return streamFromConcatenated(streamFromFunction(streamFunc).take(count));
}

/**
 * An asynchronous iterator, providing lazy access to a potentially unbounded
 * stream of elements.
 */
export abstract class DataStream<T> {
  // This class implements AsyncIterator<T>, but we have not yet set the
  // TypeScript --downlevelIteration flag to enable that.

  /**
   * Returns a `Promise` for the next element in the stream.
   *
   * When an item can be provided successfully, the return value is
   * `{value:T, done:true}`.
   *
   * Calling next() on a closed stream returns `{value:null, done:true}`.
   */
  abstract async next(): Promise<IteratorResult<T>>;

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
    while (!x.done) {
      result.push(x.value);
      x = await this.next();
    }
    return result;
  }

  /**
   * Draw items from the stream until it is exhausted.
   *
   * This can be useful when the stream has side effects but no output.  In
   * that case, calling this function guarantees that the stream will be fully
   * processed.
   */
  async resolveFully(): Promise<void> {
    let x = await this.next();
    while (!x.done) {
      x = await this.next();
    }
  }

  // TODO(soergel): Implement reduce() etc.

  /**
   * Filters this stream according to `predicate`.
   *
   * @param predicate A function mapping a stream element to a boolean or a
   * `Promise` for one.
   * @param consume A function that finalizes an item, e.g. by marking it for
   *   garbage collection.
   *
   * @returns A `DataStream` of elements for which the predicate was true.
   */
  filter(predicate: (value: T) => boolean, consume?: (item: T) => void):
      DataStream<T> {
    return new FilterStream(this, predicate, consume);
  }

  /**
   * Maps this stream through a 1-to-1 transform.
   *
   * @param predicate A function mapping a stream element to a transformed
   *   element.
   * @param consumePrep A function that tentatively schedules an item or its
   *   components for garbage collection.  The return value must be a second
   *   function that actually executes the cleanup procedure.  This second
   *   function accepts an argument that may modify the list of objects to be
   *   collected, e.g. by reversing the tentative decision made previously.
   * @param retain A function that marks an item to be retained (i.e.,
   *   protected from garbage collection), and returns it (or a marked copy).
   *
   * @returns A `DataStream` of transformed elements.
   */
  map<O>(
      transform: (value: T) => O,
      consumePrep?: (item: T) => ((output: O) => void),
      retain?: (item: O) => O): DataStream<O> {
    return new MapStream(this, transform, consumePrep, retain);
  }

  /**
   * Apply a function to every element of the stream.
   *
   * @param f A function to apply to each stream element.
   * @param consume A function that finalizes an item, e.g. by marking it for
   *   garbage collection.
   */
  async forEach(f: (value: T) => void, consume?: (item: T) => void):
      Promise<void> {
    const consumePrep =
        consume == null ? null : (item: T) => ((output: void) => consume(item));
    return this.map(f, consumePrep).resolveFully();
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
    if (count < 0 || count == null) {
      return this;
    }
    return new TakeStream(this, count);
  }

  /**
   * Skips the first `count` items in this stream.
   *
   * @param count The number of items to skip.  If a negative or undefined value
   *   is given, the entire stream is returned unaltered.
   * @param consume A function that finalizes an item, e.g. by marking it for
   *   garbage collection.
   */
  skip(count: number, consume?: (item: T) => void): DataStream<T> {
    if (count < 0 || count == null) {
      return this;
    }
    return new SkipStream(this, count, consume);
  }

  /**
   * Prefetch the first `bufferSize` items in this stream.
   *
   * Note this prefetches Promises, but makes no guarantees about when those
   * Promises resolve.
   *
   * @param bufferSize: An integer specifying the number of elements to be
   *   prefetched.
   */
  prefetch(bufferSize: number): DataStream<T> {
    return new PrefetchStream(this, bufferSize);
  }

  // TODO(soergel): deep sharded shuffle, where supported

  /**
   * Randomly shuffles the elements of this stream.
   *
   * @param bufferSize: An integer specifying the number of elements from this
   *   stream from which the new stream will sample.
   * @param seed: (Optional.) An integer specifying the random seed that will
   *   be used to create the distribution.
   */
  shuffle(windowSize: number, seed?: string): DataStream<T> {
    return new ShuffleStream(this, windowSize, seed);
  }
}

// ============================================================================
// The following private classes serve to implement the chainable methods
// on DataStream.  Unfortunately they can't be placed in separate files, due to
// resulting trouble with circular imports.
// ============================================================================

// Streams that just extend DataStream directly
// ============================================================================

class ArrayStream<T> extends DataStream<T> {
  private trav = 0;
  constructor(protected items: T[]) {
    super();
  }

  async next(): Promise<IteratorResult<T>> {
    if (this.trav >= this.items.length) {
      return {value: null, done: true};
    }
    const result = this.items[this.trav];
    this.trav++;
    return {value: result, done: false};
  }
}

class FunctionCallStream<T> extends DataStream<T> {
  constructor(protected nextFn: () => T | Promise<T>) {
    super();
  }

  async next(): Promise<IteratorResult<T>> {
    // a function call stream never ends.
    return {value: await this.nextFn(), done: false};
  }
}

class SkipStream<T> extends DataStream<T> {
  count = 0;
  constructor(
      protected upstream: DataStream<T>, protected maxCount: number,
      protected consume: (item: T) => void) {
    super();
  }

  async next(): Promise<IteratorResult<T>> {
    while (this.count++ < this.maxCount) {
      const skipped = await this.upstream.next();
      // short-circuit if upstream is already empty
      if (skipped.done) {
        return skipped;
      }
      if (this.consume != null) {
        this.consume(skipped.value);
      }
    }
    return this.upstream.next();
  }
}

class TakeStream<T> extends DataStream<T> {
  count = 0;
  constructor(protected upstream: DataStream<T>, protected maxCount: number) {
    super();
  }

  async next(): Promise<IteratorResult<T>> {
    if (this.count++ >= this.maxCount) {
      return {value: null, done: true};
    }
    return this.upstream.next();
  }
}

// Streams that maintain a queue of pending items
// ============================================================================

/**
 * A base class for transforming streams that operate by maintaining an
 * output queue of elements that are ready to return via next().  This is
 * commonly required when the transformation is not 1-to-1, so a variable number
 * of calls to the underlying stream may be needed to provide each element of
 * this stream.
 */
export abstract class QueueStream<T> extends DataStream<T> {
  protected outputQueue: RingBuffer<T>;

  constructor() {
    super();
    this.outputQueue = new GrowingRingBuffer<T>();
  }
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

  async next(): Promise<IteratorResult<T>> {
    // Fetch so that the queue contains at least one item if possible.
    // If the upstream source is exhausted, AND there are no items left in the
    // output queue, then this stream is also exhausted.
    while (this.outputQueue.length() === 0) {
      if (!await this.pump()) {
        return {value: null, done: true};
      }
    }
    return {value: this.outputQueue.shift(), done: false};
  }
}

// TODO(soergel): consider clean separation of synchronous pumpOne
/*abstract class TransformingQueueStream<I, O> extends QueueStream<O> {
  async pump() {
    return pumpOne(await this.upstream.next());
  }

  // not async!
  pump(input:I) : boolean {}
}*/

class BatchStream<T> extends QueueStream<T[]> {
  constructor(
      protected upstream: DataStream<T>, protected batchSize: number,
      protected enableSmallLastBatch = true) {
    super();
  }

  private currentBatch: T[] = [];

  async pump(): Promise<boolean> {
    const item = await this.upstream.next();
    if (item.done) {
      if (this.enableSmallLastBatch && this.currentBatch.length > 0) {
        this.outputQueue.push(this.currentBatch);
        this.currentBatch = [];

        // Pretend that the pump succeeded in order to emit the small last
        // batch. The next pump() call will actually fail.
        return true;
      }
      return false;
    }

    this.currentBatch.push(item.value);
    if (this.currentBatch.length === this.batchSize) {
      this.outputQueue.push(this.currentBatch);
      this.currentBatch = [];
    }
    return true;
  }
}

class FilterStream<T> extends QueueStream<T> {
  constructor(
      protected upstream: DataStream<T>,
      protected predicate: (value: T) => boolean,
      protected consume?: (item: T) => void) {
    super();
  }

  async pump(): Promise<boolean> {
    const item = await this.upstream.next();
    if (item.done) {
      return false;
    }
    if (this.predicate(item.value)) {
      this.outputQueue.push(item.value);
    } else if (this.consume != null) {
      this.consume(item.value);
    }
    return true;
  }
}

class MapStream<I, O> extends QueueStream<O> {
  constructor(
      protected upstream: DataStream<I>, protected transform: (value: I) => O,
      protected consumePrep: (item: I) => ((item: O) => void),
      protected retain: (item: O) => O) {
    super();
  }

  async pump() {
    const item = await this.upstream.next();
    if (item.done) {
      return false;
    }
    const consumeFn =
        this.consumePrep == null ? null : this.consumePrep(item.value);
    // Careful: the transform may mutate the item in place.
    // that's why we have to prepare the consumeFn above but execute it below.
    let mapped = this.transform(item.value);

    if (this.retain != null) {
      mapped = this.retain(mapped);
    }
    // Consume *after* retain, in case of overlap
    if (consumeFn != null) {
      consumeFn(mapped);
    }

    this.outputQueue.push(mapped);
    return true;
  }
}

/**
 * ChainStates have the following meanings:
 * {undefined, stream, moreStreams}: previous stream was done, try again
 * {{value:T,done:false}, stream, moreStreams): item was found, return it
 */
class ChainState<T> {
  constructor(
      public readonly item: IteratorResult<T>,
      public readonly currentStream: IteratorResult<DataStream<T>>,
      public readonly moreStreams: DataStream<DataStream<T>>) {}
}

async function nextChainState<T>(afterState: Promise<ChainState<T>>):
    Promise<ChainState<T>> {
  const state = await afterState;
  let stream = state.currentStream;
  if (stream.done) {
    // Once the concatenated stream is exhausted, it stays that way.
    return new ChainState(
        {value: null, done: true}, {value: null, done: true},
        state.moreStreams);
  }
  const item = await stream.value.next();
  if (item.done) {
    stream = await state.moreStreams.next();
    return nextChainState(
        Promise.resolve(new ChainState(undefined, stream, state.moreStreams)));
  }
  return new ChainState(item, stream, state.moreStreams);
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

  async next(): Promise<IteratorResult<T>> {
    this.currentPromise = nextChainState(this.currentPromise);
    return (await this.currentPromise).item;
  }
}

// Streams that maintain a ring buffer of pending promises
// ============================================================================

/**
 * A stream that prefetches a given number of items from an upstream source,
 * returning them in FIFO order.
 *
 * Note this prefetches Promises, but makes no guarantees about when those
 * Promises resolve.
 */
export class PrefetchStream<T> extends DataStream<T> {
  protected buffer: RingBuffer<Promise<IteratorResult<T>>>;

  total = 0;

  constructor(protected upstream: DataStream<T>, protected bufferSize: number) {
    super();
    this.buffer = new RingBuffer<Promise<IteratorResult<T>>>(bufferSize);
  }

  /**
   * Refill the prefetch buffer.  Returns only after the buffer is full, or the
   * upstream source is exhausted.
   */
  protected refill() {
    while (!this.buffer.isFull()) {
      const v = this.upstream.next();
      this.buffer.push(v);
    }
  }

  async next(): Promise<IteratorResult<T>> {
    this.refill();
    // Note this probably never happens; instead the buffer fills up with
    // "done" IteratorResults so we just return those.
    if (this.buffer.isEmpty()) {
      return {value: null, done: true};
    }
    const result = await this.buffer.shift();
    // TODO(soergel) benchmark performance with and without this.
    this.refill();
    return result;
  }
}

/**
 * A stream that performs a sliding-window random shuffle on an upstream source.
 * This is like a `PrefetchStream` except that the items are returned in
 * randomized order.  Mixing naturally improves as the buffer size increases.
 */
export class ShuffleStream<T> extends PrefetchStream<T> {
  private random: seedrandom.prng;
  private upstreamExhausted = false;

  constructor(
      protected upstream: DataStream<T>, protected windowSize: number,
      seed?: string) {
    super(upstream, windowSize);
    this.random = seedrandom(seed);
  }

  private randomInt(max: number) {
    return Math.floor(this.random() * max);
  }

  protected chooseIndex(): number {
    return this.randomInt(this.buffer.length());
  }

  async next(): Promise<IteratorResult<T>> {
    // TODO(soergel): consider performance
    if (!this.upstreamExhausted) {
      this.refill();
    }
    while (!this.buffer.isEmpty()) {
      const chosenIndex = this.chooseIndex();
      const result = await this.buffer.shuffleExcise(chosenIndex);
      if (result.done) {
        this.upstreamExhausted = true;
      } else {
        this.refill();
        return result;
      }
    }
    return {value: null, done: true};
  }
}
