import {NDArray} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface UnaryNode<T extends NDArray> extends KernelNode {
  inputAndArgs: UnaryInputConfig<T>;
  output: T;
  gradient: (dy: T, y: T) => UnaryInputArrays<T>;
}

export interface UnaryInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: UnaryInputArrays<T>;
}

export interface UnaryInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}

// Leaky RELU
export interface LeakyReluNode<T extends NDArray> extends KernelNode {
  inputAndArgs: LeakyReluInputConfig<T>;
  output: T;
  gradient: (dy: T, y: T) => LeakyReluInputArrays<T>;
}

export interface LeakyReluInputConfig<T extends NDArray> extends
    KernelInputConfig {
  inputs: LeakyReluInputArrays<T>;
  args: {alpha: number;};
}

export interface LeakyReluInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}

// Step
export interface StepNode<T extends NDArray> extends KernelNode {
  inputAndArgs: StepInputConfig<T>;
  output: T;
  gradient: (dy: T, y: T) => StepInputArrays<T>;
}

export interface StepInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: StepInputArrays<T>;
  args: {alpha: number;};
}

export interface StepInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}

// Clip
export interface ClipNode<T extends NDArray> extends KernelNode {
  inputAndArgs: ClipInputConfig<T>;
  output: T;
  gradient: (dy: T, y: T) => ClipInputArrays<T>;
}

export interface ClipInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: ClipInputArrays<T>;
  args: {min: number; max: number;};
}

export interface ClipInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}

// Transpose
export interface TransposeNode<T extends NDArray> extends KernelNode {
  inputAndArgs: TransposeInputConfig<T>;
  output: T;
  gradient: (dy: T, y: T) => TransposeInputArrays<T>;
}

export interface TransposeInputConfig<T extends NDArray> extends
    KernelInputConfig {
  inputs: TransposeInputArrays<T>;
  args: {perm: number[];};
}

export interface TransposeInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}

// Tile
export interface TileNode<T extends NDArray> extends KernelNode {
  inputAndArgs: TileInputConfig<T>;
  output: T;
  gradient: (dy: T, y: T) => TileInputArrays<T>;
}

export interface TileInputConfig<T extends NDArray> extends KernelInputConfig {
  inputs: TileInputArrays<T>;
  args: {reps: number[];};
}

export interface TileInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}
