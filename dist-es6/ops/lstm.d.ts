import { Scalar, Tensor1D, Tensor2D } from '../tensor';
import { TensorLike } from '../types';
export declare type LSTMCellFunc = {
    (data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D];
};
export declare class LSTMOps {
    static multiRNNCell(lstmCells: LSTMCellFunc[], data: Tensor2D | TensorLike, c: Tensor2D[] | TensorLike[], h: Tensor2D[] | TensorLike[]): [Tensor2D[], Tensor2D[]];
    static basicLSTMCell(forgetBias: Scalar, lstmKernel: Tensor2D, lstmBias: Tensor1D, data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D];
}
