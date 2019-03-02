import {Tensor} from '../tensor';
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

// Safari doesn't have one.
const nWorkers = navigator.hardwareConcurrency || 4;
const workers = makeWorkers(nWorkers);

export async function matmul(a: Tensor, b: Tensor): Promise<Float32Array> {
  const aSize = a.shape[0];
  const bSize = b.shape[1];
  const k = a.shape[1];

  const offsets = computeOffsets(aSize, nWorkers);
  const [aVals, bVals] = await Promise.all([a.data(), b.data()]);

  // const res = zeros([aSize, bSize]);
  const resVals = new Float32Array(aSize * bSize);
  let count = 0;
  return new Promise<Float32Array>(resolve => {
    workers.forEach((worker, i) => {
      worker.onmessage = e => {
        const offset = offsets[i] * bSize;
        resVals.set(e.data, offset);
        count++;
        if (count === nWorkers) {
          resolve(resVals);
        }
      };
      const offset = offsets[i] * k;
      const nextOffset =
          i + 1 < offsets.length ? offsets[i + 1] * k : undefined;
      const aSubVals = aVals.subarray(offset, nextOffset);
      worker.postMessage([aSubVals, bVals, k]);
    });
  });
}
