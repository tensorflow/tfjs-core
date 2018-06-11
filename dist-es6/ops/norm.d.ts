import { Tensor } from '../tensor';
export declare class NormOps {
    static norm(x: Tensor, ord?: number | 'euclidean' | 'fro', axis?: number | number[], keepDims?: boolean): Tensor;
}
