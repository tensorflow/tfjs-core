
import {Array2D} from '../../ndarray';
import {KernelInputArrays, KernelInputConfig, KernelNode} from '../kernel_config';

export interface MultinomialNode extends KernelNode {
  inputAndArgs: MultinomialInputConfig;
  output: Array2D<'int32'>;
}

export interface MultinomialInputConfig extends KernelInputConfig {
  inputs: MultinomialInputArrays;
  args: {numSamples: number; seed: number};
}

export interface MultinomialInputArrays extends KernelInputArrays {
  probs: Array2D;
}
