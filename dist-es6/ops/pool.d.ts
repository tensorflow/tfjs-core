import { Tensor3D, Tensor4D } from '../tensor';
export declare class PoolOps {
    static maxPool<T extends Tensor3D | Tensor4D>(x: T, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    static maxPoolBackprop(dy: Tensor4D, input: Tensor4D, output: Tensor4D, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): Tensor4D;
    static avgPool<T extends Tensor3D | Tensor4D>(x: T, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    static avgPoolBackprop<T extends Tensor3D | Tensor4D>(dy: T, input: T, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number): T;
}
