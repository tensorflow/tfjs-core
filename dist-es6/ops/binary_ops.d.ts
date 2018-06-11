import { Tensor } from '../tensor';
export declare class BinaryOps {
    static add<T extends Tensor>(a: Tensor, b: Tensor): T;
    static addStrict<T extends Tensor>(a: T, b: T): T;
    static sub<T extends Tensor>(a: Tensor, b: Tensor): T;
    static subStrict<T extends Tensor>(a: T, b: T): T;
    static pow<T extends Tensor>(base: T, exp: Tensor): T;
    static powStrict<T extends Tensor>(base: T, exp: Tensor): T;
    static mul<T extends Tensor>(a: Tensor, b: Tensor): T;
    static mulStrict<T extends Tensor>(a: T, b: T): T;
    static div<T extends Tensor>(a: Tensor, b: Tensor): T;
    static floorDiv<T extends Tensor>(a: Tensor, b: Tensor): T;
    static divStrict<T extends Tensor>(a: T, b: T): T;
    static mod<T extends Tensor>(a: Tensor, b: Tensor): T;
    static modStrict<T extends Tensor>(a: T, b: T): T;
    static minimum<T extends Tensor>(a: Tensor, b: Tensor): T;
    static minimumStrict<T extends Tensor>(a: T, b: T): T;
    static maximum<T extends Tensor>(a: Tensor, b: Tensor): T;
    static maximumStrict<T extends Tensor>(a: T, b: T): T;
    static squaredDifference<T extends Tensor>(a: Tensor, b: Tensor): T;
    static squaredDifferenceStrict<T extends Tensor>(a: T, b: T): T;
    static atan2<T extends Tensor>(a: Tensor, b: Tensor): T;
}
