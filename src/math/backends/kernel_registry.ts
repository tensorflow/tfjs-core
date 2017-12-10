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
import {OneHotInputConfig, OneHotNode} from './kernels/onehot';
import {PoolBackpropInputConfig, PoolBackpropNode, PoolInputConfig, PoolNode} from './kernels/pool';
import {ResizeBilinear3DInputConfig, ResizeBilinear3DNode} from './kernels/resize_bilinear';
import {Slice1DInputConfig, Slice1DNode, Slice2DInputConfig, Slice2DNode, Slice3DInputConfig, Slice3DNode, Slice4DInputConfig, Slice4DNode} from './kernels/slice';
import {SumInputConfig, SumNode} from './kernels/sum';
import {TopKIndicesInputConfig, TopKIndicesNode, TopKValuesInputConfig, TopKValuesNode} from './kernels/topk';
import {ClipInputConfig, ClipNode, LeakyReluInputConfig, LeakyReluNode, StepInputConfig, StepNode, TileInputConfig, TileNode, TransposeInputConfig, TransposeNode, UnaryInputConfig, UnaryNode} from './kernels/unary';

export interface KernelConfigRegistry {
  'MatMul': MatMulNode;
  'Clone': UnaryNode<NDArray>;
  'Slice1D': Slice1DNode;
  'Slice2D': Slice2DNode;
  'Slice3D': Slice3DNode;
  'Slice4D': Slice4DNode;
  'Concat1D': Concat1DNode;
  'Concat2D': Concat2DNode;
  'Concat3D': Concat3DNode;
  'Concat4D': Concat4DNode;
  'Neg': UnaryNode<NDArray>;
  'Add': BinaryNode;
  'Sub': BinaryNode;
  'Mul': BinaryNode;
  'Div': BinaryNode;
  'Sum': SumNode<'float32'|'int32'|'bool'>;
  'ArgMax': ArgMaxNode;
  'ArgMin': ArgMinNode;
  'Equal': EqualNode;
  'TopKValues': TopKValuesNode<'float32'|'int32'|'bool', NDArray>;
  'TopKIndices': TopKIndicesNode;
  'Min': MinNode<'float32'|'int32'|'bool'>;
  'Max': MaxNode<'float32'|'int32'|'bool'>;
  'Ceil': UnaryNode<NDArray>;
  'Floor': UnaryNode<NDArray>;
  'Exp': UnaryNode<NDArray>;
  'Log': UnaryNode<NDArray>;
  'Sqrt': UnaryNode<NDArray>;
  'Square': UnaryNode<NDArray>;
  'Relu': UnaryNode<NDArray>;
  'LeakyRelu': LeakyReluNode<NDArray>;
  'Elu': UnaryNode<NDArray>;
  'EluDer': UnaryNode<NDArray>;
  'Selu': UnaryNode<NDArray>;
  'Abs': UnaryNode<NDArray>;
  'Sigmoid': UnaryNode<NDArray>;
  'Step': StepNode<NDArray>;
  'Sin': UnaryNode<NDArray>;
  'Cos': UnaryNode<NDArray>;
  'Tan': UnaryNode<NDArray>;
  'Asin': UnaryNode<NDArray>;
  'Acos': UnaryNode<NDArray>;
  'Atan': UnaryNode<NDArray>;
  'Sinh': UnaryNode<NDArray>;
  'Cosh': UnaryNode<NDArray>;
  'Tanh': UnaryNode<NDArray>;
  'Clip': ClipNode<NDArray>;
  'Transpose': TransposeNode<NDArray>;
  'Tile': TileNode<NDArray>;
  'Conv2D': Conv2DNode;
  'Conv2DDerInput': Conv2DDerInputNode;
  'Conv2DDerFilter': Conv2DDerFilterNode;
  'Conv2DDerBias': Conv2DDerBiasNode;
  'DepthwiseConv2D': Conv2DNode;
  'MaxPool': PoolNode;
  'MaxPoolBackprop': PoolBackpropNode;
  'AvgPool': PoolNode;
  'MinPool': PoolNode;
  'ResizeBilinear3D': ResizeBilinear3DNode;
  'BatchNorm3D': BatchNorm3DNode;
  'BatchNorm2D': BatchNorm2DNode;
  'Multinomial': MultinomialNode;
  'OneHot': OneHotNode;
}

export function executeKernel<K extends keyof KernelConfigRegistry>(
    kernelName: K, backend: MathBackend,
    config: KernelConfigRegistry[K]['inputAndArgs']):
    KernelConfigRegistry[K]['output'] {
  const result = {
    'MatMul': (backend: MathBackend, config: MatMulInputConfig) =>
        backend.matMul(config),
    'Clone': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.clone(config),
    'Slice1D': (backend: MathBackend, config: Slice1DInputConfig) =>
        backend.slice1D(config),
    'Slice2D': (backend: MathBackend, config: Slice2DInputConfig) =>
        backend.slice2D(config),
    'Slice3D': (backend: MathBackend, config: Slice3DInputConfig) =>
        backend.slice3D(config),
    'Slice4D': (backend: MathBackend, config: Slice4DInputConfig) =>
        backend.slice4D(config),
    'Concat1D': (backend: MathBackend, config: Concat1DInputConfig) =>
        backend.concat1D(config),
    'Concat2D': (backend: MathBackend, config: Concat2DInputConfig) =>
        backend.concat2D(config),
    'Concat3D': (backend: MathBackend, config: Concat3DInputConfig) =>
        backend.concat3D(config),
    'Concat4D': (backend: MathBackend, config: Concat4DInputConfig) =>
        backend.concat4D(config),
    'Neg': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.neg(config),
    'Add': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.add(config),
    'Sub': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.subtract(config),
    'Mul': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.multiply(config),
    'Div': (backend: MathBackend, config: BinaryInputConfig) =>
        backend.divide(config),
    'Sum': (backend: MathBackend, config: SumInputConfig<'float32'|'int32'>) =>
        backend.sum(config),
    'ArgMax': (backend: MathBackend, config: ArgMaxInputConfig) =>
        backend.argMax(config),
    'ArgMin': (backend: MathBackend, config: ArgMinInputConfig) =>
        backend.argMin(config),
    'Equal': (backend: MathBackend, config: EqualInputConfig) =>
        backend.equal(config),
    'TopKValues':
        (backend: MathBackend, config: TopKValuesInputConfig<NDArray>) =>
            backend.topKValues(config),
    'TopKIndices': (backend: MathBackend, config: TopKIndicesInputConfig) =>
        backend.topKIndices(config),
    'Min':
        (backend: MathBackend,
         config: MinInputConfig<'float32'|'int32'|'bool'>) =>
            backend.min(config),
    'Max':
        (backend: MathBackend,
         config: MaxInputConfig<'float32'|'int32'|'bool'>) =>
            backend.max(config),
    'Ceil': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.ceil(config),
    'Floor': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.floor(config),
    'Exp': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.exp(config),
    'Log': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.log(config),
    'Sqrt': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sqrt(config),
    'Square': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.square(config),
    'Relu': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.relu(config),
    'LeakyRelu':
        (backend: MathBackend, config: LeakyReluInputConfig<NDArray>) =>
            backend.leakyRelu(config),
    'Elu': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.elu(config),
    'EluDer': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.eluDer(config),
    'Selu': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.selu(config),
    'Abs': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.abs(config),
    'Sigmoid': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sigmoid(config),
    'Step': (backend: MathBackend, config: StepInputConfig<NDArray>) =>
        backend.step(config),
    'Sin': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sin(config),
    'Cos': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.cos(config),
    'Tan': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.tan(config),
    'Asin': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.asin(config),
    'Acos': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.acos(config),
    'Atan': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.atan(config),
    'Sinh': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.sinh(config),
    'Cosh': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.cosh(config),
    'Tanh': (backend: MathBackend, config: UnaryInputConfig<NDArray>) =>
        backend.tanh(config),
    'Clip': (backend: MathBackend, config: ClipInputConfig<NDArray>) =>
        backend.clip(config),
    'Transpose':
        (backend: MathBackend, config: TransposeInputConfig<NDArray>) =>
            backend.transpose(config),
    'Tile': (backend: MathBackend, config: TileInputConfig<NDArray>) =>
        backend.tile(config),
    'Conv2D': (backend: MathBackend, config: Conv2DInputConfig) =>
        backend.conv2d(config),
    'Conv2DDerInput':
        (backend: MathBackend, config: Conv2DDerInputInputConfig) =>
            backend.conv2dDerInput(config),
    'Conv2DDerFilter':
        (backend: MathBackend, config: Conv2DDerFilterInputConfig) =>
            backend.conv2dDerFilter(config),
    'Conv2DDerBias': (backend: MathBackend, config: Conv2DDerBiasInputConfig) =>
        backend.conv2dDerBias(config),
    'DepthwiseConv2D':
        (backend: MathBackend, config: DepthwiseConv2DInputConfig) =>
            backend.depthwiseConv2D(config),
    'MaxPool': (backend: MathBackend, config: PoolInputConfig) =>
        backend.maxPool(config),
    'MaxPoolBackprop':
        (backend: MathBackend, config: PoolBackpropInputConfig) =>
            backend.maxPoolBackprop(config),
    'AvgPool': (backend: MathBackend, config: PoolInputConfig) =>
        backend.avgPool(config),
    'MinPool': (backend: MathBackend, config: PoolInputConfig) =>
        backend.minPool(config),
    'ResizeBilinear3D':
        (backend: MathBackend, config: ResizeBilinear3DInputConfig) =>
            backend.resizeBilinear3D(config),
    'BatchNorm3D': (backend: MathBackend, config: BatchNorm3DInputConfig) =>
        backend.batchNormalization3D(config),
    'BatchNorm2D': (backend: MathBackend, config: BatchNorm2DInputConfig) =>
        backend.batchNormalization2D(config),
    'Multinomial': (backend: MathBackend, config: MultinomialInputConfig) =>
        backend.multinomial(config),
    'OneHot': (backend: MathBackend, config: OneHotInputConfig) =>
        backend.oneHot(config)
  }[kernelName](backend, config);
  return result;
};
