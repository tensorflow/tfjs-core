import {DataTypes, NDArray} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

// Min
export interface MinNode<G extends keyof DataTypes> extends KernelNode {
  inputAndArgs: MinInputConfig<G>;
  output: NDArray<G>;
  gradient: (dy: NDArray<G>, y: NDArray<G>) => MinInputArrays<G>;
}

export interface MinInputConfig<G extends keyof DataTypes> extends
    KernelInputConfig {
  inputs: MinInputArrays<G>;
}

export interface MinInputArrays<G extends keyof DataTypes> extends
    TapeNodeInputArrays {
  x: NDArray<G>;
}

// Max
export interface MaxNode<G extends keyof DataTypes> extends KernelNode {
  inputAndArgs: MaxInputConfig<G>;
  output: NDArray<G>;
  gradient: (dy: NDArray<G>, y: NDArray<G>) => MinInputArrays<G>;
}

export interface MaxInputConfig<G extends keyof DataTypes> extends
    KernelInputConfig {
  inputs: MaxInputArrays<G>;
}

export interface MaxInputArrays<G extends keyof DataTypes> extends
    TapeNodeInputArrays {
  x: NDArray<G>;
}
