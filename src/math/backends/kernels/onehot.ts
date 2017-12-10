import {Array1D, Array2D} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface OneHotNode extends KernelNode {
  inputAndArgs: OneHotInputConfig;
  output: Array2D;
}

export interface OneHotInputConfig extends KernelInputConfig {
  inputs: OneHotInputArrays;
  args: {depth: number; onValue: number; offValue: number};
}

export interface OneHotInputArrays extends KernelInputArrays {
  indices: Array1D;
}
