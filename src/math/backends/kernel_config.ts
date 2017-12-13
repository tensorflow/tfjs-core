import {NDArray} from '../ndarray';
import {KernelConfigRegistry} from './kernel_registry';

// Generic nodes in the Tape
export interface TapeNode {
  name?: string;
  inputAndArgs: TapeNodeInputConfig;
  output: NDArray;
  gradient: (dy: NDArray, y: NDArray) => TapeNodeInputArrays;
}
export interface TapeNodeInputConfig {
  inputs: TapeNodeInputArrays;
}

export type TapeNodeInputArrays = {
  [inputName: string]: NDArray;
};

// Kernel nodes
export interface KernelNode extends TapeNode {
  kernel: keyof KernelConfigRegistry;
  inputAndArgs: KernelInputConfig;
}

export interface KernelInputConfig extends TapeNodeInputConfig {
  inputs: TapeNodeInputArrays;
  // tslint:disable-next-line:no-any
  args?: {[argName: string]: any};
}
