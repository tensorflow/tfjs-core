import * as seedrandom from 'seedrandom';

import {RingBuffer} from './ring_buffer';
import {DataStream} from './stream';

/**
 * A stream that prefetches a given number of items from an upstream source,
 * returning them in FIFO order.
 */
export class PrefetchStream<T> extends DataStream<T> {
  protected buffer: RingBuffer<Promise<T>>;

  total = 0;

  constructor(protected upstream: DataStream<T>, protected bufferSize: number) {
    super();
    this.buffer = new RingBuffer<Promise<T>>(bufferSize);
  }

  /**
   * Refill the prefetch buffer.  Returns only after the buffer is full, or the
   * upstream source is exhausted.
   */
  protected refill() {
    while (!this.buffer.isFull()) {
      const v = this.upstream.next();
      if (v === undefined) {
        return;
      }
      this.buffer.push(v);
    }
  }

  async next(): Promise<T|undefined> {
    this.refill();
    if (this.buffer.isEmpty()) return undefined;
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
      protected upstream: DataStream<T>, protected bufferSize: number,
      seed?: string) {
    super(upstream, bufferSize);
    this.random = seedrandom(seed);
  }

  private randomInt(max: number) {
    return Math.floor(this.random() * max);
  }

  protected chooseIndex(): number {
    return this.randomInt(this.buffer.length());
  }

  async next(): Promise<T|undefined> {
    // TODO(soergel): consider performance
    if (!this.upstreamExhausted) {
      this.refill();
    }
    while (!this.buffer.isEmpty()) {
      const chosenIndex = this.chooseIndex();
      const result = await this.buffer.shuffleExcise(chosenIndex);
      if (result === undefined) {
        this.upstreamExhausted = true;
      } else {
        this.refill();
        return result;
      }
    }
    return undefined;
  }
}
