import { Tensor } from '../tensor';
export declare enum Reduction {
    NONE = 0,
    MEAN = 1,
    SUM = 2,
    SUM_BY_NONZERO_WEIGHTS = 3,
}
export declare class LossOps {
    static computeWeightedLoss<T extends Tensor, O extends Tensor>(losses: T, weights?: Tensor, reduction?: Reduction): O;
    static absoluteDifference<T extends Tensor, O extends Tensor>(labels: T, predictions: T, weights?: Tensor, reduction?: Reduction): O;
    static meanSquaredError<T extends Tensor, O extends Tensor>(labels: T, predictions: T, weights?: Tensor, reduction?: Reduction): O;
    static cosineDistance<T extends Tensor, O extends Tensor>(labels: T, predictions: T, axis: number, weights?: Tensor, reduction?: Reduction): O;
    static hingeLoss<T extends Tensor, O extends Tensor>(labels: T, predictions: T, weights?: Tensor, reduction?: Reduction): O;
    static logLoss<T extends Tensor, O extends Tensor>(labels: T, predictions: T, weights?: Tensor, epsilon?: number, reduction?: Reduction): O;
    static huberLoss<T extends Tensor, O extends Tensor>(labels: T, predictions: T, weights?: Tensor, delta?: number, reduction?: Reduction): O;
}
