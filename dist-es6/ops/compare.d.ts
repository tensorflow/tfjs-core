import { Tensor } from '../tensor';
export declare class CompareOps {
    static notEqual<T extends Tensor>(a: Tensor, b: Tensor): T;
    static notEqualStrict<T extends Tensor>(a: T, b: T): T;
    static less<T extends Tensor>(a: Tensor, b: Tensor): T;
    static lessStrict<T extends Tensor>(a: T, b: T): T;
    static equal<T extends Tensor>(a: Tensor, b: Tensor): T;
    static equalStrict<T extends Tensor>(a: T, b: T): T;
    static lessEqual<T extends Tensor>(a: Tensor, b: Tensor): T;
    static lessEqualStrict<T extends Tensor>(a: T, b: T): T;
    static greater<T extends Tensor>(a: Tensor, b: Tensor): T;
    static greaterStrict<T extends Tensor>(a: T, b: T): T;
    static greaterEqual<T extends Tensor>(a: Tensor, b: Tensor): T;
    static greaterEqualStrict<T extends Tensor>(a: T, b: T): T;
}
