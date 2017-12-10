import {NDArray} from '../ndarray';

import {MathBackend} from './backend';
import {ArgMaxInputConfig, ArgMaxNode, ArgMinInputConfig, ArgMinNode} from './kernels/argminmax';
import {BatchNorm2DInputConfig, BatchNorm2DNode, BatchNorm3DInputConfig, BatchNorm3DNode} from './kernels/batchnorm';
import {BinaryInputConfig, BinaryNode} from './kernels/binary';
import {Concat1DInputConfig, Concat1DNode, Concat2DInputConfig, Concat2DNode, Concat3DInputConfig, Concat3DNode, Concat4DInputConfig, Concat4DNode} from './kernels/concat';
import {Conv2DDerBiasInputConfig, Conv2DDerBiasNode, Conv2DDerFilterInputConfig, Conv2DDerFilterNode, Conv2DDerInputInputConfig, Conv2DDerInputNode, Conv2DInputConfig, Conv2DNode, DepthwiseConv2DInputConfig} from './kernels/conv';
import {EqualInputConfig, EqualNode} from './kernels/logical';
import {MatMulInputConfig, MatMulNode} from './kernels/matmul';
import {MaxInputConfig, MaxNode, MinInputConfig, MinNode} from './kernels/minmax';
import {MultinomialInputConfig, MultinomialNode} from './kernels/multinomial';
import {PoolBackpropInputConfig, PoolBackpropNode, PoolInputConfig, PoolNode} from './kernels/pool';
import {ResizeBilinear3DInputConfig, ResizeBilinear3DNode} from './kernels/resize_bilinear';
import {Slice1DInputConfig, Slice1DNode, Slice2DInputConfig, Slice2DNode, Slice3DInputConfig, Slice3DNode, Slice4DInputConfig, Slice4DNode} from './kernels/slice';
import {SumInputConfig, SumNode} from './kernels/sum';
import {TopKIndicesInputConfig, TopKIndicesNode, TopKValuesInputConfig, TopKValuesNode} from './kernels/topk';
import {ClipInputConfig, ClipNode, LeakyReluInputConfig, LeakyReluNode, StepInputConfig, StepNode, TileInputConfig, TileNode, TransposeInputConfig, TransposeNode, UnaryInputConfig, UnaryNode} from './kernels/unary';

export interface KernelConfigRegistry {
  'matmul': MatMulNode;
  'clone': UnaryNode<NDArray>;
  'slice1d': Slice1DNode;
  'slice2d': Slice2DNode;
  'slice3d': Slice3DNode;
  'slice4d': Slice4DNode;
  'concat1d': Concat1DNode;
  'concat2d': Concat2DNode;
  'concat3d': Concat3DNode;
  'concat4d': Concat4DNode;
  'neg': UnaryNode<NDArray>;
  'add': BinaryNode;
  'subtract': BinaryNode;
  'multiply': BinaryNode;
  'divide': BinaryNode;
  'sum': SumNode<'float32'|'int32'|'bool'>;
  'argmax': ArgMaxNode;
  'argmin': ArgMinNode;
  'equal': EqualNode;
  'topkvalues': TopKValuesNode<'float32'|'int32'|'bool', NDArray>;
  'topkindices': TopKIndicesNode;
  'min': MinNode<'float32'|'int32'|'bool'>;
  'max': MaxNode<'float32'|'int32'|'bool'>;
  'ceil': UnaryNode<NDArray>;
  'floor': UnaryNode<NDArray>;
  'exp': UnaryNode<NDArray>;
  'log': UnaryNode<NDArray>;
  'sqrt': UnaryNode<NDArray>;
  'square': UnaryNode<NDArray>;
  'relu': UnaryNode<NDArray>;
  'leakyrelu': LeakyReluNode<NDArray>;
  'elu': UnaryNode<NDArray>;
  'eluDer': UnaryNode<NDArray>;
  'selu': UnaryNode<NDArray>;
  'abs': UnaryNode<NDArray>;
  'sigmoid': UnaryNode<NDArray>;
  'step': StepNode<NDArray>;
  'sin': UnaryNode<NDArray>;
  'cos': UnaryNode<NDArray>;
  'tan': UnaryNode<NDArray>;
  'asin': UnaryNode<NDArray>;
  'acos': UnaryNode<NDArray>;
  'atan': UnaryNode<NDArray>;
  'sinh': UnaryNode<NDArray>;
  'cosh': UnaryNode<NDArray>;
  'tanh': UnaryNode<NDArray>;
  'clip': ClipNode<NDArray>;
  'transpose': TransposeNode<NDArray>;
  'tile': TileNode<NDArray>;
  'conv2d': Conv2DNode;
  'conv2dderinput': Conv2DDerInputNode;
  'conv2dderfilter': Conv2DDerFilterNode;
  'conv2dderbias': Conv2DDerBiasNode;
  'depthwiseconv2d': Conv2DNode;
  'maxpool': PoolNode;
  'maxpoolbackprop': PoolBackpropNode;
  'avgpool': PoolNode;
  'minpool': PoolNode;
  'resizebilinear3d': ResizeBilinear3DNode;
  'batchnorm3d': BatchNorm3DNode;
  'batchnorm2d': BatchNorm2DNode;
  'multinomial': MultinomialNode;
}

export function executeKernel<K extends keyof KernelConfigRegistry>(
    kernelName: K, backend: MathBackend,
    config: KernelConfigRegistry[K]['inputAndArgs']):
    KernelConfigRegistry[K]['output'] {
  const result = {
    'matmul': (backend: MathBackend, config: MatMulInputConfig) =>
        backend.matMul(config),
    'clone': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
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
    'neg': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.neg(config),
    'add': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.add(config),
    'subtract': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.subtract(config),
    'multiply': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.multiply(config),
    'divide': (backend: MathBackend, config: BinaryInputConfig) =>
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
    'max':
        (backend: MathBackend,
         config: MaxInputConfig<'float32'|'int32'|'bool'>) =>
            backend.max(config),
    'ceil': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.ceil(config),
    'floor': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.floor(config),
    'exp': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.exp(config),
    'log': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.log(config),
    'sqrt': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sqrt(config),
    'square': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.square(config),
    'relu': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.relu(config),
    'leakyrelu':
        (backend: MathBackend, config: LeakyReluInputConfig<NDArray>) =>
            backend.leakyRelu(config),
    'elu': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.elu(config),
    'eluDer': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.eluDer(config),
    'selu': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.selu(config),
    'abs': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.abs(config),
    'sigmoid': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sigmoid(config),
    'step': (backend: MathBackend, config: StepInputConfig<NDArray>) =>
        backend.step(config),
    'sin': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sin(config),
    'cos': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.cos(config),
    'tan': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.tan(config),
    'asin': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.asin(config),
    'acos': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.acos(config),
    'atan': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.atan(config),
    'sinh': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sinh(config),
    'cosh': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.cosh(config),
    'tanh': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.tanh(config),
    'clip': (backend: MathBackend, config: ClipInputConfig<NDArray>) =>
        backend.clip(config),
    'transpose':
        (backend: MathBackend, config: TransposeInputConfig<NDArray>) =>
            backend.transpose(config),
    'tile': (backend: MathBackend, config: TileInputConfig<NDArray>) =>
        backend.tile(config),
    'conv2d': (backend: MathBackend, config: Conv2DInputConfig) =>
        backend.conv2d(config),
    'conv2dderinput':
        (backend: MathBackend, config: Conv2DDerInputInputConfig) =>
            backend.conv2dDerInput(config),
    'conv2dderfilter':
        (backend: MathBackend, config: Conv2DDerFilterInputConfig) =>
            backend.conv2dDerFilter(config),
    'conv2dderbias': (backend: MathBackend, config: Conv2DDerBiasInputConfig) =>
        backend.conv2dDerBias(config),
    'depthwiseconv2d':
        (backend: MathBackend, config: DepthwiseConv2DInputConfig) =>
            backend.depthwiseConv2D(config),
    'maxpool': (backend: MathBackend, config: PoolInputConfig) =>
        backend.maxPool(config),
    'maxpoolbackprop':
        (backend: MathBackend, config: PoolBackpropInputConfig) =>
            backend.maxPoolBackprop(config),
    'avgpool': (backend: MathBackend, config: PoolInputConfig) =>
        backend.avgPool(config),
    'minpool': (backend: MathBackend, config: PoolInputConfig) =>
        backend.minPool(config),
    'resizebilinear3d':
        (backend: MathBackend, config: ResizeBilinear3DInputConfig) =>
            backend.resizeBilinear3D(config),
    'batchnorm3d': (backend: MathBackend, config: BatchNorm3DInputConfig) =>
        backend.batchNormalization3D(config),
    'batchnorm2d': (backend: MathBackend, config: BatchNorm2DInputConfig) =>
        backend.batchNormalization2D(config),
    'multinomial': (backend: MathBackend, config: MultinomialInputConfig) =>
        backend.multinomial(config)
  }[kernelName](backend, config);
  return result;
};
