import { Tensor } from '../tensor';
export declare class SoftmaxOps {
    static softmax<T extends Tensor>(logits: T, dim?: number): T;
    static softmaxCrossEntropy<T extends Tensor, O extends Tensor>(labels: T, logits: T, dim?: number): O;
}
