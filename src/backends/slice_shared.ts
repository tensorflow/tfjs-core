import {buffer} from '../ops/array_ops';
import {computeFlatOffset, isSliceContinous} from '../ops/slice_util';
import {tensor} from '../ops/tensor_ops';
import {Tensor, TensorBuffer} from '../tensor';
import {BackendValues, DataType, DataValues, Rank, TypedArray} from '../types';
import {computeStrides, decodeString, sizeFromShape} from '../util';

function bufferSync(
    data: BackendValues, shape: number[], dtype: DataType): TensorBuffer<Rank> {
  let decodedData = data as DataValues;
  if (dtype === 'string') {
    try {
      // Decode the bytes into string.
      decodedData = (data as Uint8Array[]).map(d => decodeString(d));
    } catch {
      throw new Error('Failed to decode encoded string bytes into utf-8');
    }
  }
  return buffer(shape, dtype, decodedData) as TensorBuffer<Rank>;
}

export function slice<T extends Tensor>(
    vals: BackendValues, shape: number[], dtype: DataType, begin: number[],
    size: number[]): T {
  const isContinous = isSliceContinous(shape, begin, size);
  if (isContinous) {
    const flatOffset = computeFlatOffset(begin, computeStrides(shape));
    const length = sizeFromShape(size);
    const subData = dtype === 'string' ?
        vals.slice(flatOffset, flatOffset + length) :
        (vals as TypedArray).subarray(flatOffset, flatOffset + length);
    return tensor(subData, size, dtype) as T;
  }

  const b = buffer(size, dtype);
  const xBuf = bufferSync(vals, shape, dtype);
  for (let i = 0; i < b.size; ++i) {
    const loc = b.indexToLoc(i);
    const xLoc = loc.map((idx, j) => idx + begin[j]);
    b.values[i] = xBuf.get(...xLoc);
  }
  return b.toTensor() as T;
}
