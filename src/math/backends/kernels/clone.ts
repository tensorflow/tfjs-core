import {NDArray} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface CloneNode<T extends NDArray> extends KernelNode {
  inputAndArgs: CloneInputConfig<T>;
  output: T;
}

export interface CloneInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: CloneInputArrays<T>;
}

export interface CloneInputArrays<T extends NDArray> extends KernelInputArrays {
  x: T;
}
