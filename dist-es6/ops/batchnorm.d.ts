import { Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../tensor';
import { Rank } from '../types';
export declare class BatchNormOps {
    static batchNormalization2d(x: Tensor2D, mean: Tensor2D | Tensor1D, variance: Tensor2D | Tensor1D, varianceEpsilon?: number, scale?: Tensor2D | Tensor1D, offset?: Tensor2D | Tensor1D): Tensor2D;
    static batchNormalization3d(x: Tensor3D, mean: Tensor3D | Tensor1D, variance: Tensor3D | Tensor1D, varianceEpsilon?: number, scale?: Tensor3D | Tensor1D, offset?: Tensor3D | Tensor1D): Tensor3D;
    static batchNormalization4d(x: Tensor4D, mean: Tensor4D | Tensor1D, variance: Tensor4D | Tensor1D, varianceEpsilon?: number, scale?: Tensor4D | Tensor1D, offset?: Tensor4D | Tensor1D): Tensor4D;
    static batchNormalization<R extends Rank>(x: Tensor<R>, mean: Tensor<R> | Tensor1D, variance: Tensor<R> | Tensor1D, varianceEpsilon?: number, scale?: Tensor<R> | Tensor1D, offset?: Tensor<R> | Tensor1D): Tensor<R>;
}
