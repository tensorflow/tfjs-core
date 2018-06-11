export declare const PARALLELIZE_THRESHOLD = 30;
export interface ReduceInfo {
    windowSize: number;
    batchSize: number;
    inSize: number;
}
export declare function computeOptimalWindowSize(inSize: number): number;
