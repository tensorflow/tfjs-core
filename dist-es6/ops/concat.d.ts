import { Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../tensor';
export declare class ConcatOps {
    static concat1d(tensors: Tensor1D[]): Tensor1D;
    static concat2d(tensors: Tensor2D[], axis: number): Tensor2D;
    static concat3d(tensors: Tensor3D[], axis: number): Tensor3D;
    static concat4d(tensors: Tensor4D[], axis: number): Tensor4D;
    static concat<T extends Tensor>(tensors: T[], axis?: number): T;
}
