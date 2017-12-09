import {NDArray} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface UnaryNode<T extends NDArray> extends KernelNode {
  inputAndArgs: UnaryInputConfig<T>;
  output: T;
}

export interface UnaryInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: UnaryInputArrays<T>;
}

export interface UnaryInputArrays<T extends NDArray> extends KernelInputArrays {
  x: T;
}
