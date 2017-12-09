import {NDArray} from '../ndarray';

import {MathBackend} from './backend';
import {ArgMaxInputConfig, ArgMaxNode, ArgMinInputConfig, ArgMinNode} from './kernels/argminmax';
import {CloneInputConfig, CloneNode} from './kernels/clone';
import {Concat1DInputConfig, Concat1DNode, Concat2DInputConfig, Concat2DNode, Concat3DInputConfig, Concat3DNode, Concat4DInputConfig, Concat4DNode} from './kernels/concat';
import {AddInputConfig, AddNode, DivideInputConfig, DivideNode, MultiplyInputConfig, MultiplyNode, SubtractInputConfig, SubtractNode} from './kernels/element_wise_arithmetic';
import {EqualInputConfig, EqualNode} from './kernels/logical';
import {MatMulInputConfig, MatMulNode} from './kernels/matmul';
import {MaxInputConfig, MaxNode, MinInputConfig, MinNode} from './kernels/minmax';
import {NegInputConfig, NegNode} from './kernels/neg';
import {Slice1DInputConfig, Slice1DNode, Slice2DInputConfig, Slice2DNode, Slice3DInputConfig, Slice3DNode, Slice4DInputConfig, Slice4DNode} from './kernels/slice';
import {SumInputConfig, SumNode} from './kernels/sum';
import {TopKIndicesInputConfig, TopKIndicesNode, TopKValuesInputConfig, TopKValuesNode} from './kernels/topk';

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
  'neg': NegNode<NDArray>;
  'add': AddNode;
  'subtract': SubtractNode;
  'multiply': MultiplyNode;
  'divide': DivideNode;
  'sum': SumNode<'float32'|'int32'|'bool'>;
  'argmax': ArgMaxNode;
  'argmin': ArgMinNode;
  'equal': EqualNode;
  'topkvalues': TopKValuesNode<'float32'|'int32'|'bool', NDArray>;
  'topkindices': TopKIndicesNode;
  'min': MinNode<'float32'|'int32'|'bool'>;
  'max': MaxNode<'float32'|'int32'|'bool'>;
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
        backend.concat4D(config),
    'neg': (backend: MathBackend, config: NegInputConfig<NDArray>) =>
        backend.neg(config),
    'add': (backend: MathBackend, config: AddInputConfig) =>
        backend.add(config),
    'subtract': (backend: MathBackend, config: SubtractInputConfig) =>
        backend.subtract(config),
    'multiply': (backend: MathBackend, config: MultiplyInputConfig) =>
        backend.multiply(config),
    'divide': (backend: MathBackend, config: DivideInputConfig) =>
        backend.divide(config),
    'sum': (backend: MathBackend, config: SumInputConfig<'float32'|'int32'>) =>
        backend.sum(config),
    'argmax': (backend: MathBackend, config: ArgMaxInputConfig) =>
        backend.argMax(config),
    'argmin': (backend: MathBackend, config: ArgMinInputConfig) =>
        backend.argMin(config),
    'equal': (backend: MathBackend, config: EqualInputConfig) =>
        backend.equal(config),
    'topkvalues':
        (backend: MathBackend, config: TopKValuesInputConfig<NDArray>) =>
            backend.topKValues(config),
    'topkindices': (backend: MathBackend, config: TopKIndicesInputConfig) =>
        backend.topKIndices(config),
    'min':
        (backend: MathBackend,
         config: MinInputConfig<'float32'|'int32'|'bool'>) =>
            backend.min(config),
    'max': (
        backend: MathBackend,
        config: MaxInputConfig<'float32'|'int32'|'bool'>) => backend.max(config)
  }[kernelName](backend, config);
  return result;
};
