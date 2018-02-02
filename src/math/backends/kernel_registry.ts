/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as util from '../../util';
import {NDArray, Scalar} from '../ndarray';
import {Rank} from '../types';
import {MathBackend} from './backend';
import {ArgMaxNode, ArgMinNode} from './types/argminmax';
// tslint:disable-next-line:max-line-length
import {BatchNorm2DNode, BatchNorm3DNode, BatchNorm4DNode} from './types/batchnorm';
import {BinaryNode} from './types/binary';
import {CastNode} from './types/cast';
// tslint:disable-next-line:max-line-length
import {ConcatNode} from './types/concat';
// tslint:disable-next-line:max-line-length
import {Conv2DDerBiasNode, Conv2DDerFilterNode, Conv2DDerInputNode, Conv2DNode, DepthwiseConv2DNode} from './types/conv';
import {GatherNode} from './types/gather';
import {EqualNode, LogicalNode, WhereNode} from './types/logical';
import {LRN4DNode} from './types/lrn';
import {MatMulNode} from './types/matmul';
import {MaximumNode, MaxNode, MinimumNode, MinNode} from './types/minmax';
import {MultinomialNode} from './types/multinomial';
import {OneHotNode} from './types/onehot';
import {Pad1DNode, Pad2DNode} from './types/pad';
// tslint:disable-next-line:max-line-length
import {PoolBackpropNode, PoolNode} from './types/pool';
import {PowNode} from './types/pow';
import {PReLUNode} from './types/prelu';
import {ReshapeNode} from './types/reshape';
import {ResizeBilinearNode} from './types/resize_bilinear';
import {Reverse4DNode} from './types/reverse';
// tslint:disable-next-line:max-line-length
import {Slice1DNode, Slice2DNode, Slice3DNode, Slice4DNode} from './types/slice';
import {SumNode} from './types/sum';
import {TopKIndicesNode, TopKValuesNode} from './types/topk';
// tslint:disable-next-line:max-line-length
import {ClipNode, LeakyReluNode, StepNode, TileNode, TransposeNode, UnaryNode} from './types/unary';

export function
executeKernel<R extends Rank, K extends keyof KernelConfigRegistry<R>, O extends
                  KernelConfigRegistry<R>[K]['output']>(
    backend: MathBackend, kernelName: K,
    inputAndArgs: KernelConfigRegistry<R>[K]['inputAndArgs']): O {
  // tslint:disable-next-line:no-any
  let config:any=null;
  // tslint:disable-next-line:no-any
  let x:any=null;
  switch(kernelName){
  case 'MatMul':
    config = inputAndArgs as MatMulNode['inputAndArgs'];
    return backend.matMul(
               config.inputs.a, config.inputs.b, config.args.aOrientation,
               config.args.bOrientation) as O;
  case 'Slice1D':
    config = inputAndArgs as Slice1DNode['inputAndArgs'];
    return backend.slice1D(
               config.inputs.x, config.args.begin, config.args.size) as O;
  case 'Slice2D':
    config = inputAndArgs as Slice2DNode['inputAndArgs'];
    return backend.slice2D(
               config.inputs.x, config.args.begin, config.args.size) as O;
  case 'Slice3D':
    config = inputAndArgs as Slice3DNode['inputAndArgs'];
    return backend.slice3D(
               config.inputs.x, config.args.begin, config.args.size) as O;
  case 'Slice4D':
    config = inputAndArgs as Slice4DNode['inputAndArgs'];
    return backend.slice4D(
               config.inputs.x, config.args.begin, config.args.size) as O;
  case 'Reverse4D':
    config = inputAndArgs as Reverse4DNode['inputAndArgs'];
    return backend.reverse4D(config.inputs.x, config.args.axis) as O;
  case 'Concat':
    config = inputAndArgs as ConcatNode['inputAndArgs'];
    return backend.concat(config.inputs.a, config.inputs.b) as O;
  case 'Neg':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.neg(config.inputs.x) as O;
  case 'Add':
    config = inputAndArgs as BinaryNode['inputAndArgs'];
    return backend.add(config.inputs.a, config.inputs.b) as O;
  case 'Sub':
    config = inputAndArgs as BinaryNode['inputAndArgs'];
    return backend.subtract(config.inputs.a, config.inputs.b) as O;
  case 'Mul':
    config = inputAndArgs as BinaryNode['inputAndArgs'];
    return backend.multiply(config.inputs.a, config.inputs.b) as O;
  case 'Div':
    config = inputAndArgs as BinaryNode['inputAndArgs'];
    return backend.divide(config.inputs.a, config.inputs.b) as O;
  case 'Sum':
    config = inputAndArgs as SumNode['inputAndArgs'];
    return backend.sum(config.inputs.x, config.args.axes) as O;
  case 'ArgMax':
    config = inputAndArgs as ArgMaxNode['inputAndArgs'];
    return backend.argMax(config.inputs.x, config.args.axes) as O;
  case 'ArgMin':
    config = inputAndArgs as ArgMinNode['inputAndArgs'];
    return backend.argMin(config.inputs.x, config.args.axes) as O;
  case 'Equal':
    config = inputAndArgs as EqualNode['inputAndArgs'];
    return backend.equal(config.inputs.a, config.inputs.b) as O;
  case 'NotEqual':
    config = inputAndArgs as EqualNode['inputAndArgs'];
    return backend.notEqual(config.inputs.a, config.inputs.b) as O;
  case 'Less':
    config = inputAndArgs as EqualNode['inputAndArgs'];
    return backend.less(config.inputs.a, config.inputs.b) as O;
  case 'LessEqual':
    config = inputAndArgs as EqualNode['inputAndArgs'];
    return backend.lessEqual(config.inputs.a, config.inputs.b) as O;
  case 'Greater':
    config = inputAndArgs as EqualNode['inputAndArgs'];
    return backend.greater(config.inputs.a, config.inputs.b) as O;
  case 'GreaterEqual':
    config = inputAndArgs as EqualNode['inputAndArgs'];
    return backend.greaterEqual(config.inputs.a, config.inputs.b) as O;
  case 'LogicalAnd':
    config = inputAndArgs as LogicalNode['inputAndArgs'];
    return backend.logicalAnd(config.inputs.a, config.inputs.b) as O;
  case 'LogicalOr':
    config = inputAndArgs as LogicalNode['inputAndArgs'];
    return backend.logicalOr(config.inputs.a, config.inputs.b) as O;
  case 'Where':
    config = inputAndArgs as WhereNode['inputAndArgs'];
    return backend.where(
               config.inputs.condition, config.inputs.a, config.inputs.b,
               config.args.dtype) as O;
  case 'TopKValues':
    config = inputAndArgs as TopKValuesNode<R>['inputAndArgs'];
    return backend.topKValues(config.inputs.x, config.args.k) as O;
  case 'TopKIndices':
    config = inputAndArgs as TopKIndicesNode['inputAndArgs'];
    return backend.topKIndices(config.inputs.x, config.args.k) as O;
  case 'Min':
    config = inputAndArgs as MinNode['inputAndArgs'];
    return backend.min(config.inputs.x, config.args.axes) as O;
  case 'Minimum':
    config = inputAndArgs as MinimumNode['inputAndArgs'];
    return backend.minimum(config.inputs.a, config.inputs.b) as O;
  case 'Max':
    config = inputAndArgs as MaxNode['inputAndArgs'];
    return backend.max(config.inputs.x, config.args.axes) as O;
  case 'Maximum':
    config = inputAndArgs as MaximumNode['inputAndArgs'];
    return backend.maximum(config.inputs.a, config.inputs.b) as O;
  case 'Ceil':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.ceil(config.inputs.x) as O;
  case 'Floor':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.floor(config.inputs.x) as O;
  case 'Pow':
    config = inputAndArgs as PowNode<R>['inputAndArgs'];
    return backend.pow(config.inputs.base, config.inputs.exp) as O;
  case 'Exp':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.exp(config.inputs.x) as O;
  case 'Log':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.log(config.inputs.x) as O;
  case 'Sqrt':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.sqrt(config.inputs.x) as O;
  case 'Square':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.square(config.inputs.x) as O;
  case 'Relu':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.relu(config.inputs.x) as O;
  case 'Reshape':
    config = inputAndArgs as ReshapeNode['inputAndArgs'];
    x = config.inputs.x;
    const newShape = config.args.newShape;
    return NDArray.make(newShape, {dataId: x.dataId}, x.dtype) as O;
  case 'Cast':
    config = inputAndArgs as CastNode['inputAndArgs'];
    x = config.inputs.x;
    const newDType = config.args.newDType;

    if (!util.hasEncodingLoss(x.dtype, newDType)) {
      // We don't change the underlying data, since we cast to higher
      // precision.
      return NDArray.make(x.shape, {dataId: x.dataId}, newDType) as O;
    }
    if (newDType === 'int32') {
      return backend.int(x) as O;
    } else if (newDType === 'bool') {
      return backend.notEqual(x, Scalar.new(0, x.dtype)) as O;
    } else {
      throw new Error(`Error in Cast: unknown dtype argument (${newDType})`);
    }
  case 'LeakyRelu':
    config = inputAndArgs as LeakyReluNode<R>['inputAndArgs'];
    return backend.leakyRelu(config.inputs.x, config.args.alpha) as O;
  case 'PReLU':
    config = inputAndArgs as PReLUNode<R>['inputAndArgs'];
    return backend.prelu(config.inputs.x, config.inputs.alpha) as O;
  case 'PReLUDer':
    config = inputAndArgs as PReLUNode<R>['inputAndArgs'];
    return backend.preluDer(config.inputs.x, config.inputs.alpha) as O;
  case 'Elu':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.elu(config.inputs.x) as O;
  case 'EluDer':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.eluDer(config.inputs.x) as O;
  case 'Selu':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.selu(config.inputs.x) as O;
  case 'Abs':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.abs(config.inputs.x) as O;
  case 'Sigmoid':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.sigmoid(config.inputs.x) as O;
  case 'Step':
    config = inputAndArgs as StepNode<R>['inputAndArgs'];
    return backend.step(config.inputs.x, config.args.alpha) as O;
  case 'Sin':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.sin(config.inputs.x) as O;
  case 'Cos':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.cos(config.inputs.x) as O;
  case 'Tan':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.tan(config.inputs.x) as O;
  case 'Asin':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.asin(config.inputs.x) as O;
  case 'Acos':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.acos(config.inputs.x) as O;
  case 'Atan':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.atan(config.inputs.x) as O;
  case 'Sinh':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.sinh(config.inputs.x) as O;
  case 'Cosh':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.cosh(config.inputs.x) as O;
  case 'Tanh':
    config = inputAndArgs as UnaryNode<R>['inputAndArgs'];
    return backend.tanh(config.inputs.x) as O;
  case 'Clip':
    config = inputAndArgs as ClipNode<R>['inputAndArgs'];
    return backend.clip(config.inputs.x, config.args.min, config.args.max) as O;
  case 'Tile':
    config = inputAndArgs as TileNode<R>['inputAndArgs'];
    return backend.tile(config.inputs.x, config.args.reps) as O;
  case 'Gather':
    config = inputAndArgs as GatherNode<R>['inputAndArgs'];
    return backend.gather(
               config.inputs.x, config.inputs.indices, config.args.axis) as O;
  case 'Pad1D':
    config = inputAndArgs as Pad1DNode['inputAndArgs'];
    return backend.pad1D(
               config.inputs.x, config.args.paddings,
               config.args.constantValue) as O;
  case 'Pad2D':
    config = inputAndArgs as Pad2DNode['inputAndArgs'];
    return backend.pad2D(
               config.inputs.x, config.args.paddings,
               config.args.constantValue) as O;
  case 'Transpose':
    config = inputAndArgs as TransposeNode<R>['inputAndArgs'];
    return backend.transpose(config.inputs.x, config.args.perm) as O;
  case 'Conv2D':
    config = inputAndArgs as Conv2DNode['inputAndArgs'];
    return backend.conv2d(
               config.inputs.x, config.inputs.filter, config.inputs.bias,
               config.args.convInfo) as O;
  case 'Conv2DDerInput':
    config = inputAndArgs as Conv2DDerInputNode['inputAndArgs'];
    return backend.conv2dDerInput(
               config.inputs.dy, config.inputs.filter, config.args.convInfo) as
        O;
  case 'Conv2DDerFilter':
    config = inputAndArgs as Conv2DDerFilterNode['inputAndArgs'];
    return backend.conv2dDerFilter(
               config.inputs.x, config.inputs.dy, config.args.convInfo) as O;
  case 'Conv2DDerBias':
    config = inputAndArgs as Conv2DDerBiasNode['inputAndArgs'];
    return backend.conv2dDerBias(config.inputs.dy) as O;
  case 'DepthwiseConv2D':
    config = inputAndArgs as DepthwiseConv2DNode['inputAndArgs'];
    return backend.depthwiseConv2D(
               config.inputs.x, config.inputs.filter, config.args.convInfo) as
        O;
  case 'MaxPool':
    config = inputAndArgs as PoolNode['inputAndArgs'];
    return backend.maxPool(config.inputs.x, config.args.convInfo) as O;
  case 'MaxPoolBackprop':
    config = inputAndArgs as PoolBackpropNode['inputAndArgs'];
    return backend.maxPoolBackprop(
               config.inputs.dy, config.inputs.x, config.args.convInfo) as O;
  case 'AvgPool':
    config = inputAndArgs as PoolNode['inputAndArgs'];
    return backend.avgPool(config.inputs.x, config.args.convInfo) as O;
  case 'AvgPoolBackprop':
    config = inputAndArgs as PoolBackpropNode['inputAndArgs'];
    return backend.avgPoolBackprop(
               config.inputs.dy, config.inputs.x, config.args.convInfo) as O;
  case 'MinPool':
    config = inputAndArgs as PoolNode['inputAndArgs'];
    return backend.minPool(config.inputs.x, config.args.convInfo) as O;
  case 'ResizeBilinear':
    config = inputAndArgs as ResizeBilinearNode['inputAndArgs'];
    return backend.resizeBilinear(
               config.inputs.x, config.args.newHeight, config.args.newWidth,
               config.args.alignCorners) as O;
  case 'BatchNorm4D':
    config = inputAndArgs as BatchNorm4DNode['inputAndArgs'];
    return backend.batchNormalization4D(
               config.inputs.x, config.inputs.mean, config.inputs.variance,
               config.args.varianceEpsilon, config.inputs.scale,
               config.inputs.offset) as O;
  case 'BatchNorm3D':
    config = inputAndArgs as BatchNorm3DNode['inputAndArgs'];
    return backend.batchNormalization3D(
               config.inputs.x, config.inputs.mean, config.inputs.variance,
               config.args.varianceEpsilon, config.inputs.scale,
               config.inputs.offset) as O;
  case 'BatchNorm2D':
    config = inputAndArgs as BatchNorm2DNode['inputAndArgs'];
    return backend.batchNormalization2D(
               config.inputs.x, config.inputs.mean, config.inputs.variance,
               config.args.varianceEpsilon, config.inputs.scale,
               config.inputs.offset) as O;
  case 'LRN4D':
    config = inputAndArgs as LRN4DNode['inputAndArgs'];
    return backend.localResponseNormalization4D(
               config.inputs.x, config.args.radius, config.args.bias,
               config.args.alpha, config.args.beta, config.args.normRegion) as
        O;
  case 'Multinomial':
    config = inputAndArgs as MultinomialNode['inputAndArgs'];
    return backend.multinomial(
               config.inputs.probs, config.args.numSamples, config.args.seed) as
        O;
  case 'OneHot':
    config = inputAndArgs as OneHotNode['inputAndArgs'];
    return backend.oneHot(
               config.inputs.indices, config.args.depth, config.args.onValue,
               config.args.offValue) as O;
  default:break;
  }
  throw new Error(`No backend method found for kernel ${kernelName}`);
}

export interface KernelConfigRegistry<R extends Rank> {
  MatMul: MatMulNode;
  Slice1D: Slice1DNode;
  Slice2D: Slice2DNode;
  Slice3D: Slice3DNode;
  Slice4D: Slice4DNode;
  Reverse4D: Reverse4DNode;
  Concat: ConcatNode;
  Neg: UnaryNode<R>;
  Add: BinaryNode;
  Sub: BinaryNode;
  Mul: BinaryNode;
  Div: BinaryNode;
  Sum: SumNode;
  ArgMax: ArgMaxNode;
  ArgMin: ArgMinNode;
  Equal: EqualNode;
  NotEqual: EqualNode;
  Less: EqualNode;
  LessEqual: EqualNode;
  Greater: EqualNode;
  GreaterEqual: EqualNode;
  LogicalAnd: LogicalNode;
  LogicalOr: LogicalNode;
  Where: WhereNode;
  TopKValues: TopKValuesNode<R>;
  TopKIndices: TopKIndicesNode;
  Min: MinNode;
  Minimum: MinimumNode;
  Max: MaxNode;
  Maximum: MaximumNode;
  Ceil: UnaryNode<R>;
  Floor: UnaryNode<R>;
  Pow: PowNode<R>;
  Exp: UnaryNode<R>;
  Log: UnaryNode<R>;
  Sqrt: UnaryNode<R>;
  Square: UnaryNode<R>;
  Relu: UnaryNode<R>;
  LeakyRelu: LeakyReluNode<R>;
  PReLU: PReLUNode<R>;
  PReLUDer: PReLUNode<R>;
  Reshape: ReshapeNode;
  Cast: CastNode;
  Elu: UnaryNode<R>;
  EluDer: UnaryNode<R>;
  Selu: UnaryNode<R>;
  Abs: UnaryNode<R>;
  Sigmoid: UnaryNode<R>;
  Step: StepNode<R>;
  Sin: UnaryNode<R>;
  Cos: UnaryNode<R>;
  Tan: UnaryNode<R>;
  Asin: UnaryNode<R>;
  Acos: UnaryNode<R>;
  Atan: UnaryNode<R>;
  Sinh: UnaryNode<R>;
  Cosh: UnaryNode<R>;
  Tanh: UnaryNode<R>;
  Clip: ClipNode<R>;
  Transpose: TransposeNode<R>;
  Pad1D: Pad1DNode;
  Pad2D: Pad2DNode;
  Tile: TileNode<R>;
  Gather: GatherNode<R>;
  Conv2D: Conv2DNode;
  Conv2DDerInput: Conv2DDerInputNode;
  Conv2DDerFilter: Conv2DDerFilterNode;
  Conv2DDerBias: Conv2DDerBiasNode;
  DepthwiseConv2D: Conv2DNode;
  MaxPool: PoolNode;
  MaxPoolBackprop: PoolBackpropNode;
  AvgPool: PoolNode;
  AvgPoolBackprop: PoolBackpropNode;
  MinPool: PoolNode;
  ResizeBilinear: ResizeBilinearNode;
  BatchNorm4D: BatchNorm4DNode;
  BatchNorm3D: BatchNorm3DNode;
  BatchNorm2D: BatchNorm2DNode;
  LRN4D: LRN4DNode;
  Multinomial: MultinomialNode;
  OneHot: OneHotNode;
}
export type Kernel = keyof KernelConfigRegistry<Rank>;
