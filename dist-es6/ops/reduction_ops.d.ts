import { Tensor, Tensor1D } from '../tensor';
import { TensorLike } from '../types';
export declare class ReductionOps {
    static logSumExp<T extends Tensor>(x: Tensor | TensorLike, axis?: number | number[], keepDims?: boolean): T;
    static sum<T extends Tensor>(x: Tensor | TensorLike, axis?: number | number[], keepDims?: boolean): T;
    static mean<T extends Tensor>(x: Tensor | TensorLike, axis?: number | number[], keepDims?: boolean): T;
    static min<T extends Tensor>(x: Tensor | TensorLike, axis?: number | number[], keepDims?: boolean): T;
    static max<T extends Tensor>(x: Tensor | TensorLike, axis?: number | number[], keepDims?: boolean): T;
    static argMin<T extends Tensor>(x: Tensor | TensorLike, axis?: number): T;
    static argMax<T extends Tensor>(x: Tensor | TensorLike, axis?: number): T;
    static moments(x: Tensor | TensorLike, axis?: number | number[], keepDims?: boolean): {
        mean: Tensor;
        variance: Tensor;
    };
    static unsortedSegmentSum<T extends Tensor>(x: T, segmentIds: Tensor1D, numSegments: number, axis?: number): T;
}
