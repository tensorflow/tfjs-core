import {NDArray} from '../ndarray';
import {KernelConfigRegistry} from './kernel_registry';

export interface KernelNode {
  kernel: keyof KernelConfigRegistry;
  inputAndArgs: KernelInputConfig;
  output: NDArray;
  gradient: (dy: NDArray, y: NDArray) => KernelInputArrays;
}

export interface KernelInputConfig {
  inputs: KernelInputArrays;
  // tslint:disable-next-line:no-any
  args?: {[argName: string]: any};
}

export type KernelInputArrays = {
  [inputName: string]: NDArray;
};
