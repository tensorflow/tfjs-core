
import {Array2D} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface MultinomialNode extends KernelNode {
  inputAndArgs: MultinomialInputConfig;
  output: Array2D<'int32'>;
  gradient:
      (dy: Array2D<'int32'>, y: Array2D<'int32'>) => MultinomialInputArrays;
}

export interface MultinomialInputConfig extends KernelInputConfig {
  inputs: MultinomialInputArrays;
  args: {numSamples: number; seed: number};
}

export interface MultinomialInputArrays extends KernelInputArrays {
  probs: Array2D;
}
