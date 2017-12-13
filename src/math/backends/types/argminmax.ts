import {NDArray} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface ArgMaxNode extends KernelNode {
  inputAndArgs: ArgMaxInputConfig;
  output: NDArray<'int32'>;
  gradient: (dy: NDArray<'int32'>, y: NDArray<'int32'>) => ArgMaxInputArrays;
}

export interface ArgMaxInputConfig extends KernelInputConfig {
  inputs: ArgMaxInputArrays;
  args: {axes: number[];};
}

export interface ArgMaxInputArrays extends TapeNodeInputArrays { x: NDArray; }

export interface ArgMinNode extends KernelNode {
  inputAndArgs: ArgMinInputConfig;
  output: NDArray<'int32'>;
  gradient: (dy: NDArray<'int32'>, y: NDArray<'int32'>) => ArgMinInputArrays;
}

export interface ArgMinInputConfig extends KernelInputConfig {
  inputs: ArgMinInputArrays;
  args: {axes: number[];};
}

export interface ArgMinInputArrays extends TapeNodeInputArrays { x: NDArray; }
