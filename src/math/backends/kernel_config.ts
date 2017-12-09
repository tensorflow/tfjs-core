import {NDArray} from '../ndarray';

export interface KernelNode {
  inputAndArgs: KernelInputConfig;
  output: NDArray;
}

export interface KernelInputConfig {
  inputs: KernelInputArrays;
  args?: {[argName: string]: any};
}

export type KernelInputArrays = {
  [inputName: string]: NDArray;
};
