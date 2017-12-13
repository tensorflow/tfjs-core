import {Array2D} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface MatMulNode extends KernelNode {
  inputAndArgs: MatMulInputConfig;
  output: Array2D;
  gradient: (dy: Array2D, y: Array2D) => MatMulInputArrays;
}

export interface MatMulInputConfig extends KernelInputConfig {
  inputs: MatMulInputArrays;
  args: {aOrientation: MatrixOrientation; bOrientation: MatrixOrientation};
}

export interface MatMulInputArrays extends TapeNodeInputArrays {
  a: Array2D;
  b: Array2D;
}

export enum MatrixOrientation {
  REGULAR,
  TRANSPOSED
}
