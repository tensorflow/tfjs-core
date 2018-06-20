import { Tensor } from '../tensor';
export declare class StridedSliceOps {
    static stridedSlice<T extends Tensor>(x: T, begin: number[], end: number[], strides: number[], beginMask?: number, endMask?: number): T;
}
