/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
 * =============================================================================
 */

type BufferInfo = {
  byteSize: number,
  usage: GPUBufferUsage,
  buffer: GPUBuffer
};

export class BufferManager {
  private numUsedBuffers = 0;
  private numFreeBuffers = 0;
  private freeBuffers: {[size: string]: GPUBuffer[]} = {};
  private usedBuffers: {[size: string]: GPUBuffer[]} = {};
  private disposalQueue: BufferInfo[] = [];

  public numBytesUsed = 0;
  public numBytesUsedIncludingCache = 0;

  constructor(private device: GPUDevice) {}

  acquireBuffer(byteSize: number, usage: GPUBufferUsage) {
    const key = getBufferKey(byteSize, usage);
    if (!(key in this.freeBuffers)) {
      this.freeBuffers[key] = [];
    }

    if (!(key in this.usedBuffers)) {
      this.usedBuffers[key] = [];
    }

    if (this.freeBuffers[key].length > 0) {
      this.numFreeBuffers--;
      this.numUsedBuffers++;

      const newBuffer = this.freeBuffers[key].shift();
      this.usedBuffers[key].push(newBuffer);
      return newBuffer;
    }

    this.numUsedBuffers++;

    this.numBytesUsed += byteSize;
    const newBuffer = this.device.createBuffer({size: byteSize, usage});
    this.usedBuffers[key].push(newBuffer);

    return newBuffer;
  }

  releaseBuffer(buffer: GPUBuffer, byteSize: number, usage: GPUBufferUsage) {
    if (this.freeBuffers == null) {
      return;
    }

    const key = getBufferKey(byteSize, usage);
    if (!(key in this.freeBuffers)) {
      this.freeBuffers[key] = [];
    }

    this.freeBuffers[key].push(buffer);
    this.numFreeBuffers++;
    this.numUsedBuffers--;

    const bufferList = this.usedBuffers[key];
    const bufferIndex = bufferList.indexOf(buffer);
    if (bufferIndex < 0) {
      throw new Error(
          'Cannot release a buffer that was never provided by this ' +
          'buffer manager');
    }
    bufferList.splice(bufferIndex, 1);
    this.numBytesUsed -= byteSize;
    this.disposalQueue.push({byteSize, usage, buffer});
  }

  getNumUsedBuffers(): number {
    return this.numUsedBuffers;
  }

  getNumFreeBuffers(): number {
    return this.numFreeBuffers;
  }

  flushDisposalQueue() {
    this.disposalQueue.forEach(d => {
      this.releaseBuffer(d.buffer, d.byteSize, d.usage);
    });

    this.disposalQueue = [];
  }

  dispose() {
    if (this.freeBuffers == null) {
      return;
    }

    for (const key in this.freeBuffers) {
      this.freeBuffers[key].forEach(buff => {
        buff.destroy();
      });
    }

    for (const key in this.usedBuffers) {
      this.usedBuffers[key].forEach(buff => {
        buff.destroy();
      });
    }

    this.freeBuffers = null;
    this.usedBuffers = null;
    this.numUsedBuffers = 0;
    this.numFreeBuffers = 0;
  }
}

function getBufferKey(
    byteSize: number,
    usage: GPUBufferUsage = GPUBufferUsage.STORAGE |
        GPUBufferUsage.TRANSFER_SRC | GPUBufferUsage.TRANSFER_DST) {
  return `${byteSize}_${usage}`;
}