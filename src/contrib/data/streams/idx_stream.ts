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

import {NDArray} from '../../..';

import {DataStream, QueueStream} from './data_stream';

// TODO(soergel): support dtypes beyond uint8, if there is any demand
export class IDXStream extends QueueStream<NDArray> {
  // A partial record at the end of an upstream chunk
  carryover: Uint8Array = new Uint8Array([]);

  // Strictly speaking the IDX format represents any N-dimensional tensor.
  // However the whole point of streaming it is that we assume that the 0'th
  // dimension is the batch dimension, i.e., it represents a list of examples.
  numRecords: number;
  recordShape: number[];
  recordBytes = 1;

  private constructor(protected upstream: DataStream<Uint8Array>) {
    super();
  }

  static async create(upstream: DataStream<Uint8Array>): Promise<IDXStream> {
    const stream = new IDXStream(upstream);
    await stream.readFirstChunk();
    return stream;
  }

  async readFirstChunk(): Promise<void> {
    // Assume that the first chunk is large enough to contain the entire header
    const chunk = await this.upstream.next();
    if (chunk[0] !== 0 || chunk[1] !== 0) {
      throw new Error('IDX magic number must start with 00.');
    }

    const dtypeCode = chunk[2];
    if (dtypeCode !== 0x08) {
      throw new Error(
          'IDX parser currently supports only ' +
          '8-bit unsigned integer datasets.');
    }

    const numDimensions = chunk[3];

    const view = new DataView(chunk.buffer);
    const shape = [];
    let index = 4;
    for (let i = 0; i < numDimensions; i++) {
      shape[i] = view.getInt32(index, false);  // big-endian
      index += 4;
    }
    const chunkRemainder = chunk.slice(index);
    this.numRecords = shape[0];
    this.recordShape = shape.slice(1);
    this.recordBytes = 1;
    for (const d of this.recordShape) {
      this.recordBytes *= d;
    }
    console.log(
        `Reading IDX file with ${this.numRecords} records of shape ` +
        `${this.recordShape} taking ${this.recordBytes} bytes each.`);
    this.pumpImpl(chunkRemainder);  // return value is always true; ignore
  }

  async pump(): Promise<boolean> {
    const chunk = await this.upstream.next();
    return this.pumpImpl(chunk);
  }

  private pumpImpl(chunk: Uint8Array): boolean {
    if (chunk == null) {
      if (this.carryover.length === 0) {
        return false;
      }

      // Pretend that the pump succeeded in order to emit the small last batch.
      // The next pump() call will actually fail.
      this.outputQueue.push(
          NDArray.make(this.recordShape, {values: this.carryover}));
      this.carryover = new Uint8Array([]);
      return true;
    }

    // TODO(soergel): consider factoring out a FixedLengthChunkStream

    // First make sure we have enough bytes, combining the carryover with the
    // current chunk, to create at least one record.
    const availableBytes = this.carryover.length + chunk.length;
    console.log(`Carryover: ${this.carryover.length} Chunk: ${
        chunk.length} Total: ${availableBytes}`);
    if (availableBytes < this.recordBytes) {
      const n = new Uint8Array(availableBytes);
      n.set(this.carryover);
      n.set(chunk, this.carryover.length);
      this.carryover = n;
      console.log(`Set carryover: ${this.carryover.length}`);
      return true;
    }

    // Assemble the first record from the carryover and the beginning of the
    // chunk.
    const firstRecord = new Uint8Array(this.recordBytes);

    console.log(`Using carryover: ${this.carryover.length} in record: ${
        firstRecord.length}`);
    firstRecord.set(this.carryover);
    let index = this.recordBytes - this.carryover.length;
    firstRecord.set(chunk.slice(0, index));
    this.outputQueue.push(
        NDArray.make(this.recordShape, {values: firstRecord}));

    // Slice further records out of the chunk
    while (index + this.recordBytes < chunk.length) {
      this.outputQueue.push(NDArray.make(
          this.recordShape,
          {values: chunk.slice(index, index + this.recordBytes)}));
      index += this.recordBytes;
    }

    this.carryover = chunk.slice(index);

    return true;
  }
}

/*
type TypedArray = Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|
    Uint32Array|Uint8ClampedArray|Float32Array|Float64Array;
const dtypes: {[code: number]: TypedArray;} = {
  0x08: Uint8Array,
  0x09: Int8Array,
  0x0B: Int16Array,
  0x0C: Int32Array,
  0x0D: Float32Array,
  0x0E: Float64Array
};
*/
