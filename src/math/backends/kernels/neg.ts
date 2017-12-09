import {NDArray} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface NegNode<T extends NDArray> extends KernelNode {
  inputAndArgs: NegInputConfig<T>;
  output: T;
}

export interface NegInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: NegInputArrays<T>;
}

export interface NegInputArrays<T extends NDArray> extends KernelInputArrays {
  x: T;
}
