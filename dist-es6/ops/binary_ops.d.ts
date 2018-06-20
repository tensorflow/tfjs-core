import { Tensor } from '../tensor';
import { TensorLike } from '../types';
export declare class BinaryOps {
    static add<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static addStrict<T extends Tensor>(a: T, b: T): T;
    static sub<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static subStrict<T extends Tensor>(a: T, b: T): T;
    static pow<T extends Tensor>(base: T | TensorLike, exp: Tensor | TensorLike): T;
    static powStrict<T extends Tensor>(base: T, exp: Tensor): T;
    static mul<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static mulStrict<T extends Tensor>(a: T, b: T): T;
    static div<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static divStrict<T extends Tensor>(a: T, b: T): T;
    static mod<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static modStrict<T extends Tensor>(a: T, b: T): T;
    static minimum<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static minimumStrict<T extends Tensor>(a: T, b: T): T;
    static maximum<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static maximumStrict<T extends Tensor>(a: T, b: T): T;
    static squaredDifference<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
    static squaredDifferenceStrict<T extends Tensor>(a: T, b: T): T;
    static atan2<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
}
