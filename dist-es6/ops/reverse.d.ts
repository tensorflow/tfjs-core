import { Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../tensor';
export declare class ReverseOps {
    static reverse1d(x: Tensor1D): Tensor1D;
    static reverse2d(x: Tensor2D, axis?: number | number[]): Tensor2D;
    static reverse3d(x: Tensor3D, axis?: number | number[]): Tensor3D;
    static reverse4d(x: Tensor4D, axis?: number | number[]): Tensor4D;
    static reverse<T extends Tensor>(x: T, axis?: number | number[]): T;
}
