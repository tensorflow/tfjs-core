import { Scalar, Tensor, Tensor1D, Tensor2D } from '../tensor';
export declare class MatmulOps {
    static matMul(a: Tensor2D, b: Tensor2D, transposeA?: boolean, transposeB?: boolean): Tensor2D;
    static vectorTimesMatrix(v: Tensor1D, matrix: Tensor2D): Tensor1D;
    static matrixTimesVector(matrix: Tensor2D, v: Tensor1D): Tensor1D;
    static dotProduct(v1: Tensor1D, v2: Tensor1D): Scalar;
    static outerProduct(v1: Tensor1D, v2: Tensor1D): Tensor2D;
    static dot(t1: Tensor, t2: Tensor): Tensor;
}
