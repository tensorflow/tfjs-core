
import {Array3D} from '../../ndarray';
// tslint:disable-next-line:max-line-length
import {KernelInputConfig, KernelNode, TapeNodeInputArrays} from '../kernel_config';

export interface ResizeBilinear3DNode extends KernelNode {
  inputAndArgs: ResizeBilinear3DInputConfig;
  output: Array3D;
  gradient: (dy: Array3D, y: Array3D) => ResizeBilinear3DInputArrays;
}

export interface ResizeBilinear3DInputConfig extends KernelInputConfig {
  inputs: ResizeBilinear3DInputArrays;
  args: {newShape2D: [number, number]; alignCorners: boolean};
}

export interface ResizeBilinear3DInputArrays extends TapeNodeInputArrays {
  x: Array3D;
}
