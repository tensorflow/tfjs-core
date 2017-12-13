import {NDArray} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface EqualNode extends KernelNode {
  inputAndArgs: EqualInputConfig;
  output: NDArray<'bool'>;
  gradient: (dy: NDArray<'bool'>, y: NDArray<'bool'>) => EqualInputArrays;
}

export interface EqualInputConfig extends KernelInputConfig {
  inputs: EqualInputArrays;
}

export interface EqualInputArrays extends TapeNodeInputArrays {
  a: NDArray;
  b: NDArray;
}
