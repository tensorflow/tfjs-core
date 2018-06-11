import { Rank, Tensor } from '..';
import { DataType, ShapeMap } from '../types';
import { KernelBackend } from './backend';
export declare function castTensor<T extends Tensor<Rank>>(x: T, dtype: DataType, backend: KernelBackend): T;
export declare function reshapeTensor<T extends Tensor<Rank>, R extends Rank>(x: T, shape: ShapeMap[R]): Tensor<R>;
