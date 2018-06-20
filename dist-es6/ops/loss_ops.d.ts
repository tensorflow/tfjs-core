import { Tensor } from '../tensor';
import { TensorLike } from '../types';
export declare enum Reduction {
    NONE = 0,
    MEAN = 1,
    SUM = 2,
    SUM_BY_NONZERO_WEIGHTS = 3,
}
export declare class LossOps {
    static computeWeightedLoss<T extends Tensor, O extends Tensor>(losses: T | TensorLike, weights?: Tensor | TensorLike, reduction?: Reduction): O;
    static absoluteDifference<T extends Tensor, O extends Tensor>(labels: T | TensorLike, predictions: T | TensorLike, weights?: Tensor | TensorLike, reduction?: Reduction): O;
    static meanSquaredError<T extends Tensor, O extends Tensor>(labels: T | TensorLike, predictions: T | TensorLike, weights?: Tensor | TensorLike, reduction?: Reduction): O;
    static cosineDistance<T extends Tensor, O extends Tensor>(labels: T | TensorLike, predictions: T | TensorLike, axis: number, weights?: Tensor | TensorLike, reduction?: Reduction): O;
    static hingeLoss<T extends Tensor, O extends Tensor>(labels: T | TensorLike, predictions: T | TensorLike, weights?: Tensor | TensorLike, reduction?: Reduction): O;
    static logLoss<T extends Tensor, O extends Tensor>(labels: T | TensorLike, predictions: T | TensorLike, weights?: Tensor | TensorLike, epsilon?: number, reduction?: Reduction): O;
    static huberLoss<T extends Tensor, O extends Tensor>(labels: T | TensorLike, predictions: T | TensorLike, weights?: Tensor | TensorLike, delta?: number, reduction?: Reduction): O;
}
