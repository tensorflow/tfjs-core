import {Tensor} from '../tensor';
import {getTypedArrayFromDType} from '../util';

import {worker} from './worker';

function makeWorkers(n: number) {
  const workers = [];
  const blobURL = URL.createObjectURL(new Blob(
      ['(', worker.toString(), ')()'], {type: 'application/javascript'}));

  for (let i = 0; i < n; i++) {
    workers.push(new Worker(blobURL));
  }
  return workers;
}

function computeOffsets(n: number, numSplits: number) {
  const offsets = [];
  const modulo = n % numSplits;
  let offset = 0;
  for (let i = 0; i < numSplits; i++) {
    offsets.push(offset);
    offset += Math.floor(n / numSplits);
    if (i < modulo) {
      offset++;
    }
  }
  return offsets;
}

// Safari doesn't tell you, so we assume 4 cores.
const nWorkers = navigator.hardwareConcurrency || 4;
const workers = makeWorkers(nWorkers);
workers.forEach(worker => {
  worker.onmessage = msg => {
    const [msgId, data] = msg.data;
    workMap.get(msgId).resolve(data);
  };
});
let nextWorker = 0;
let nextMsgId = 0;
const workMap = new Map<MsgId, Work>();

export type MsgId = number;

interface Work {
  resolve: (data: {}) => void;
}

export function sendWork(data: {}): Promise<{}> {
  const worker = workers[nextWorker];
  nextWorker = (nextWorker + 1) % nWorkers;
  return new Promise(resolve => {
    const msgId = nextMsgId++;
    workMap.set(msgId, {resolve});
    worker.postMessage([msgId, data]);
  });
}

export async function matmul(
    a: Tensor, b: Tensor, transposeA: boolean,
    transposeB: boolean): Promise<Float32Array> {
  const innerDim = transposeA ? a.shape[1] : a.shape[2];
  const leftDim = transposeA ? a.shape[2] : a.shape[1];
  const rightDim = transposeB ? b.shape[1] : b.shape[2];
  const batchDim = a.shape[0];
  const aSize = leftDim * innerDim;
  const bSize = innerDim * rightDim;
  const cSize = leftDim * rightDim;

  const nSplits = Math.min(leftDim, nWorkers);
  const offsets = computeOffsets(leftDim, nSplits);
  const [aVals, bVals] = await Promise.all([a.data(), b.data()]);

  const resVals = getTypedArrayFromDType(
      a.dtype as 'float32', batchDim * leftDim * rightDim);

  const jobs: Array<Promise<{}>> = [];
  for (let b = 0; b < batchDim; b++) {
    for (let i = 0; i < nSplits; i++) {
      const aOffset = b * aSize + offsets[i] * innerDim;
      const nextOffset = i + 1 < offsets.length ?
          b * aSize + offsets[i + 1] * innerDim :
          aOffset + aSize;
      const aSubVals = aVals.subarray(aOffset, nextOffset);
      const bOffset = b * bSize;
      const bSubVals = bVals.subarray(bOffset, bOffset + bSize);
      jobs.push(sendWork([aSubVals, bSubVals, innerDim]));
    }
  }
  const results = await Promise.all(jobs);
  for (let b = 0; b < batchDim; b++) {
    for (let i = 0; i < nSplits; i++) {
      const resIdx = b * nSplits + i;
      const data = results[resIdx];
      const resOffset = b * cSize + offsets[i] * rightDim;
      resVals.set(data as Float32Array, resOffset);
    }
  }
  return resVals;
}
