export interface RandGauss {
    nextValue(): number;
}
export interface RandNormalDataTypes {
    float32: Float32Array;
    int32: Int32Array;
}
export declare class MPRandGauss implements RandGauss {
    private mean;
    private stdDev;
    private nextVal;
    private dtype?;
    private truncated?;
    private upper?;
    private lower?;
    private random;
    constructor(mean: number, stdDeviation: number, dtype?: keyof RandNormalDataTypes, truncated?: boolean, seed?: number);
    nextValue(): number;
    private convertValue(value);
    private isValidTruncated(value);
}
