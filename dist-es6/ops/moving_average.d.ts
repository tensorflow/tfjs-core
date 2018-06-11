import { Scalar, Tensor } from '../tensor';
export declare class MovingAverageOps {
    static movingAverage<T extends Tensor>(v: T, x: T, decay: number | Scalar, step?: number | Scalar, zeroDebias?: boolean): T;
}
