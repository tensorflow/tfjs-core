import { Tensor } from '../tensor';
import { TypedArray } from '../types';
export declare function jarqueBeraNormalityTest(a: Tensor | TypedArray | number[]): void;
export declare function expectArrayInMeanStdRange(actual: Tensor | TypedArray | number[], expectedMean: number, expectedStdDev: number, epsilon?: number): void;
