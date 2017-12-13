import {Array1D, DataTypes, NDArray} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

// Values
export interface TopKValuesNode<D extends keyof DataTypes, T extends NDArray<D>>
    extends KernelNode {
  inputAndArgs: TopKValuesInputConfig<T>;
  output: Array1D<D>;
  gradient: (dy: Array1D<D>, y: Array1D<D>) => TopKValuesInputArrays<T>;
}

export interface TopKValuesInputConfig<T extends NDArray> extends
    KernelInputConfig {
  inputs: TopKValuesInputArrays<T>;
  args: {k: number};
}

export interface TopKValuesInputArrays<T extends NDArray> extends
    TapeNodeInputArrays {
  x: T;
}

// Indices
export interface TopKIndicesNode extends KernelNode {
  inputAndArgs: TopKIndicesInputConfig;
  output: Array1D<'int32'>;
  gradient:
      (dy: Array1D<'int32'>, y: Array1D<'int32'>) => TopKIndicesInputArrays;
}

export interface TopKIndicesInputConfig extends KernelInputConfig {
  inputs: TopKIndicesInputArrays;
  args: {k: number};
}

export interface TopKIndicesInputArrays extends TapeNodeInputArrays {
  x: NDArray;
}
