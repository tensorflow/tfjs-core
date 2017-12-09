import {NDArray} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

// Add
export interface AddNode extends KernelNode {
  inputAndArgs: AddInputConfig;
  output: NDArray;
}

export interface AddInputConfig extends KernelInputConfig {
  inputs: AddInputArrays;
}

export interface AddInputArrays extends KernelInputArrays {
  a: NDArray;
  b: NDArray;
}

// Subtract
export interface SubtractNode extends KernelNode {
  inputAndArgs: SubtractInputConfig;
  output: NDArray;
}

export interface SubtractInputConfig extends KernelInputConfig {
  inputs: SubtractInputArrays;
}

export interface SubtractInputArrays extends KernelInputArrays {
  a: NDArray;
  b: NDArray;
}

// Multiply
export interface MultiplyNode extends KernelNode {
  inputAndArgs: MultiplyInputConfig;
  output: NDArray;
}

export interface MultiplyInputConfig extends KernelInputConfig {
  inputs: MultiplyInputArrays;
}

export interface MultiplyInputArrays extends KernelInputArrays {
  a: NDArray;
  b: NDArray;
}

// Divide
export interface DivideNode extends KernelNode {
  inputAndArgs: DivideInputConfig;
  output: NDArray;
}

export interface DivideInputConfig extends KernelInputConfig {
  inputs: DivideInputArrays;
}

export interface DivideInputArrays extends KernelInputArrays {
  a: NDArray;
  b: NDArray;
}
