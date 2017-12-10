import {NDArray} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface BinaryNode extends KernelNode {
  inputAndArgs: BinaryInputConfig;
  output: NDArray;
}

export interface BinaryInputConfig extends KernelInputConfig {
  inputs: BinaryInputArrays;
}

export interface BinaryInputArrays extends KernelInputArrays {
  a: NDArray;
  b: NDArray;
}
