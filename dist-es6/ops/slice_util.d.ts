import { Tensor } from '../tensor';
export declare function assertParamsValid(input: Tensor, begin: number[], size: number[]): void;
export declare function getStridedSlicedInfo(shape: number[], begin: number[], end: number[], strides: number[], beginMask?: number, endMask?: number): [number[], number[]];
export declare function startForAxis(beginMask: number, startIndices: number[], strides: number[], inputShape: number[], axis: number): number;
export declare function stopForAxis(endMask: number, stopIndices: number[], strides: number[], inputShape: number[], axis: number): number;
