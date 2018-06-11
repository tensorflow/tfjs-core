import { Tensor, Tensor1D } from '../tensor';
export declare class SegmentOps {
    static unsortedSegmentSum<T extends Tensor>(x: T, segmentIds: Tensor1D, numSegments: number): T;
}
