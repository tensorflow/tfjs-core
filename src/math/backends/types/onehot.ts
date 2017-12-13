import {Array1D, Array2D} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface OneHotNode extends KernelNode {
  inputAndArgs: OneHotInputConfig;
  output: Array2D;
  gradient: (dy: Array2D, y: Array2D) => OneHotInputArrays;
}

export interface OneHotInputConfig extends KernelInputConfig {
  inputs: OneHotInputArrays;
  args: {depth: number; onValue: number; offValue: number};
}

export interface OneHotInputArrays extends TapeNodeInputArrays {
  indices: Array1D;
}
