import {NDArray} from '../ndarray';

import {MathBackend} from './backend';
import {CloneInputConfig, CloneNode} from './kernels/clone';
import {Concat1DInputConfig, Concat1DNode, Concat2DInputConfig, Concat2DNode, Concat3DInputConfig, Concat3DNode, Concat4DInputConfig, Concat4DNode} from './kernels/concat';
import {MatMulInputConfig, MatMulNode} from './kernels/matmul';
import {Slice1DInputConfig, Slice1DNode, Slice2DInputConfig, Slice2DNode, Slice3DInputConfig, Slice3DNode, Slice4DInputConfig, Slice4DNode} from './kernels/slice';

export interface KernelConfigRegistry {
  'matmul': MatMulNode;
  'clone': CloneNode<NDArray>;
  'slice1d': Slice1DNode;
  'slice2d': Slice2DNode;
  'slice3d': Slice3DNode;
  'slice4d': Slice4DNode;
  'concat1d': Concat1DNode;
  'concat2d': Concat2DNode;
  'concat3d': Concat3DNode;
  'concat4d': Concat4DNode;
}

export function executeKernel<K extends keyof KernelConfigRegistry>(
    kernelName: K, backend: MathBackend,
    config: KernelConfigRegistry[K]['inputAndArgs']):
    KernelConfigRegistry[K]['output'] {
  const result = {
    'matmul': (backend: MathBackend, config: MatMulInputConfig) =>
        backend.matMul(config),
    'clone': (backend: MathBackend, config: CloneInputConfig<NDArray>) =>
        backend.clone(config),
    'slice1d': (backend: MathBackend, config: Slice1DInputConfig) =>
        backend.slice1D(config),
    'slice2d': (backend: MathBackend, config: Slice2DInputConfig) =>
        backend.slice2D(config),
    'slice3d': (backend: MathBackend, config: Slice3DInputConfig) =>
        backend.slice3D(config),
    'slice4d': (backend: MathBackend, config: Slice4DInputConfig) =>
        backend.slice4D(config),
    'concat1d': (backend: MathBackend, config: Concat1DInputConfig) =>
        backend.concat1D(config),
    'concat2d': (backend: MathBackend, config: Concat2DInputConfig) =>
        backend.concat2D(config),
    'concat3d': (backend: MathBackend, config: Concat3DInputConfig) =>
        backend.concat3D(config),
    'concat4d': (backend: MathBackend, config: Concat4DInputConfig) =>
        backend.concat4D(config)
  }[kernelName](backend, config);
  return result;
};
