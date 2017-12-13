import {NDArray} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface BinaryNode extends KernelNode {
  inputAndArgs: BinaryInputConfig;
  output: NDArray;
  gradient: (dy: NDArray, y: NDArray) => BinaryInputArrays;
}

export interface BinaryInputConfig extends KernelInputConfig {
  inputs: BinaryInputArrays;
}

export interface BinaryInputArrays extends TapeNodeInputArrays {
  a: NDArray;
  b: NDArray;
}
