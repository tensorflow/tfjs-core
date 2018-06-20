import { Tensor } from '../tensor';
export declare class TransposeOps {
    static transpose<T extends Tensor>(x: T, perm?: number[]): T;
}
