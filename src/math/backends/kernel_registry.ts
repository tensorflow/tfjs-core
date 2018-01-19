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
import {DataType, NDArray, Rank, Scalar} from '../ndarray';

import {MathBackend} from './backend';
import {KernelInputConfig} from './tape_types';
import {ArgMaxNode, ArgMinNode} from './types/argminmax';
// tslint:disable-next-line:max-line-length
import {BatchNorm2DNode, BatchNorm3DNode, BatchNorm4DNode} from './types/batchnorm';
import {BinaryNode} from './types/binary';
import {CastNode} from './types/cast';
// tslint:disable-next-line:max-line-length
import {Concat1DNode, Concat2DNode, Concat3DNode, Concat4DNode} from './types/concat';
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
import {ResizeBilinear3DNode} from './types/resize_bilinear';
import {Reverse4DNode} from './types/reverse';
// tslint:disable-next-line:max-line-length
import {Slice1DNode, Slice2DNode, Slice3DNode, Slice4DNode} from './types/slice';
import {SumNode} from './types/sum';
import {TopKIndicesNode, TopKValuesNode} from './types/topk';
// tslint:disable-next-line:max-line-length
import {ClipNode, LeakyReluNode, StepNode, TileNode, TransposeNode, UnaryNode} from './types/unary';

const KERNEL_METHODS: {
  [kernel in keyof KernelConfigRegistry<DataType, Rank>]: (
      backend: MathBackend, config: KernelInputConfig) => NDArray
} = {
  // NOTE: Using {} and "return" makes VSCode run much faster.
  MatMul: (backend: MathBackend, config: MatMulNode['inputAndArgs']) => {
    return backend.matMul(
        config.inputs.a, config.inputs.b, config.args.aOrientation,
        config.args.bOrientation);
  },
  Clone:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.clone(config.inputs.x);
      },
  Slice1D:
      (backend: MathBackend, config: Slice1DNode<DataType>['inputAndArgs']) => {
        return backend.slice1D(
            config.inputs.x, config.args.begin, config.args.size);
      },
  Slice2D:
      (backend: MathBackend, config: Slice2DNode<DataType>['inputAndArgs']) => {
        return backend.slice2D(
            config.inputs.x, config.args.begin, config.args.size);
      },
  Slice3D:
      (backend: MathBackend, config: Slice3DNode<DataType>['inputAndArgs']) => {
        return backend.slice3D(
            config.inputs.x, config.args.begin, config.args.size);
      },
  Slice4D:
      (backend: MathBackend, config: Slice4DNode<DataType>['inputAndArgs']) => {
        return backend.slice4D(
            config.inputs.x, config.args.begin, config.args.size);
      },
  Reverse4D: (backend: MathBackend, config: Reverse4DNode['inputAndArgs']) => {
    return backend.reverse4D(config.inputs.x, config.args.axis);
  },
  Concat1D: (backend: MathBackend, config: Concat1DNode['inputAndArgs']) => {
    return backend.concat1D(config.inputs.a, config.inputs.b);
  },
  Concat2D: (backend: MathBackend, config: Concat2DNode['inputAndArgs']) => {
    return backend.concat2D(config.inputs.a, config.inputs.b, config.args.axis);
  },
  Concat3D: (backend: MathBackend, config: Concat3DNode['inputAndArgs']) => {
    return backend.concat3D(config.inputs.a, config.inputs.b, config.args.axis);
  },
  Concat4D: (backend: MathBackend, config: Concat4DNode['inputAndArgs']) => {
    return backend.concat4D(config.inputs.a, config.inputs.b, config.args.axis);
  },
  Neg:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.neg(config.inputs.x);
      },
  Add: (backend: MathBackend, config: BinaryNode['inputAndArgs']) => {
    return backend.add(config.inputs.a, config.inputs.b);
  },
  Sub: (backend: MathBackend, config: BinaryNode['inputAndArgs']) => {
    return backend.subtract(config.inputs.a, config.inputs.b);
  },
  Mul: (backend: MathBackend, config: BinaryNode['inputAndArgs']) => {
    return backend.multiply(config.inputs.a, config.inputs.b);
  },
  Div: (backend: MathBackend, config: BinaryNode['inputAndArgs']) => {
    return backend.divide(config.inputs.a, config.inputs.b);
  },
  Sum:
      (backend: MathBackend,
       config: SumNode<'float32'|'int32'>['inputAndArgs']) => {
        return backend.sum(config.inputs.x, config.args.axes);
      },
  ArgMax: (backend: MathBackend, config: ArgMaxNode['inputAndArgs']) => {
    return backend.argMax(config.inputs.x, config.args.axes);
  },
  ArgMin: (backend: MathBackend, config: ArgMinNode['inputAndArgs']) => {
    return backend.argMin(config.inputs.x, config.args.axes);
  },
  Equal: (backend: MathBackend, config: EqualNode['inputAndArgs']) => {
    return backend.equal(config.inputs.a, config.inputs.b);
  },
  NotEqual: (backend: MathBackend, config: EqualNode['inputAndArgs']) => {
    return backend.notEqual(config.inputs.a, config.inputs.b);
  },
  Less: (backend: MathBackend, config: EqualNode['inputAndArgs']) => {
    return backend.less(config.inputs.a, config.inputs.b);
  },
  LessEqual: (backend: MathBackend, config: EqualNode['inputAndArgs']) => {
    return backend.lessEqual(config.inputs.a, config.inputs.b);
  },
  Greater: (backend: MathBackend, config: EqualNode['inputAndArgs']) => {
    return backend.greater(config.inputs.a, config.inputs.b);
  },
  GreaterEqual: (backend: MathBackend, config: EqualNode['inputAndArgs']) => {
    return backend.greaterEqual(config.inputs.a, config.inputs.b);
  },
  LogicalAnd: (backend: MathBackend, config: LogicalNode['inputAndArgs']) => {
    return backend.logicalAnd(config.inputs.a, config.inputs.b);
  },
  LogicalOr: (backend: MathBackend, config: LogicalNode['inputAndArgs']) => {
    return backend.logicalOr(config.inputs.a, config.inputs.b);
  },
  Where: (backend: MathBackend, config: WhereNode['inputAndArgs']) => {
    return backend.where(
        config.inputs.condition, config.inputs.a, config.inputs.b,
        config.args.dtype);
  },
  TopKValues:
      (backend: MathBackend,
       config: TopKValuesNode<DataType, Rank>['inputAndArgs']) => {
        return backend.topKValues(config.inputs.x, config.args.k);
      },
  TopKIndices:
      (backend: MathBackend, config: TopKIndicesNode['inputAndArgs']) => {
        return backend.topKIndices(config.inputs.x, config.args.k);
      },
  Min: (backend: MathBackend, config: MinNode<DataType>['inputAndArgs']) => {
    return backend.min(config.inputs.x, config.args.axes);
  },
  Minimum:
      (backend: MathBackend, config: MinimumNode<DataType>['inputAndArgs']) => {
        return backend.minimum(config.inputs.a, config.inputs.b);
      },
  Max: (backend: MathBackend, config: MaxNode<DataType>['inputAndArgs']) => {
    return backend.max(config.inputs.x, config.args.axes);
  },
  Maximum:
      (backend: MathBackend, config: MaximumNode<DataType>['inputAndArgs']) => {
        return backend.maximum(config.inputs.a, config.inputs.b);
      },
  Ceil:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.ceil(config.inputs.x);
      },
  Floor:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.floor(config.inputs.x);
      },
  Pow:
      (backend: MathBackend,
       config: PowNode<DataType, Rank>['inputAndArgs']) => {
        return backend.pow(config.inputs.a, config.inputs.b);
      },
  Exp:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.exp(config.inputs.x);
      },
  Log:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.log(config.inputs.x);
      },
  Sqrt:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.sqrt(config.inputs.x);
      },
  Square:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.square(config.inputs.x);
      },
  Relu:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.relu(config.inputs.x);
      },
  Reshape: (backend: MathBackend, config: ReshapeNode['inputAndArgs']) => {
    const x = config.inputs.x;
    const newShape = config.args.newShape;
    return NDArray.make(newShape, {dataId: x.dataId}, x.dtype);
  },
  Cast: (backend: MathBackend, config: CastNode['inputAndArgs']) => {
    const x = config.inputs.x;
    const newDType = config.args.newDType;

    if (!util.hasEncodingLoss(x.dtype, newDType)) {
      // We don't change the underlying data, since we cast to higher precision.
      return NDArray.make(x.shape, {dataId: x.dataId}, newDType);
    }
    if (newDType === 'int32') {
      return backend.int(x);
    } else if (newDType === 'bool') {
      return backend.notEqual(x, Scalar.new(0, x.dtype));
    } else {
      throw new Error(`Error in Cast: unknown dtype argument (${newDType})`);
    }
  },
  LeakyRelu:
      (backend: MathBackend,
       config: LeakyReluNode<DataType, Rank>['inputAndArgs']) => {
        return backend.leakyRelu(config.inputs.x, config.args.alpha);
      },
  PReLU:
      (backend: MathBackend,
       config: PReLUNode<DataType, Rank>['inputAndArgs']) => {
        return backend.prelu(config.inputs.x, config.inputs.alpha);
      },
  PReLUDer:
      (backend: MathBackend,
       config: PReLUNode<DataType, Rank>['inputAndArgs']) => {
        return backend.preluDer(config.inputs.x, config.inputs.alpha);
      },
  Elu:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.elu(config.inputs.x);
      },
  EluDer:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.eluDer(config.inputs.x);
      },
  Selu:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.selu(config.inputs.x);
      },
  Abs:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.abs(config.inputs.x);
      },
  Sigmoid:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.sigmoid(config.inputs.x);
      },
  Step:
      (backend: MathBackend,
       config: StepNode<DataType, Rank>['inputAndArgs']) => {
        return backend.step(config.inputs.x, config.args.alpha);
      },
  Sin:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.sin(config.inputs.x);
      },
  Cos:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.cos(config.inputs.x);
      },
  Tan:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.tan(config.inputs.x);
      },
  Asin:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.asin(config.inputs.x);
      },
  Acos:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.acos(config.inputs.x);
      },
  Atan:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.atan(config.inputs.x);
      },
  Sinh:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.sinh(config.inputs.x);
      },
  Cosh:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.cosh(config.inputs.x);
      },
  Tanh:
      (backend: MathBackend,
       config: UnaryNode<DataType, Rank>['inputAndArgs']) => {
        return backend.tanh(config.inputs.x);
      },
  Clip:
      (backend: MathBackend,
       config: ClipNode<DataType, Rank>['inputAndArgs']) => {
        return backend.clip(config.inputs.x, config.args.min, config.args.max);
      },
  Tile:
      (backend: MathBackend,
       config: TileNode<DataType, Rank>['inputAndArgs']) => {
        return backend.tile(config.inputs.x, config.args.reps);
      },
  Gather:
      (backend: MathBackend,
       config: GatherNode<DataType, Rank>['inputAndArgs']) => {
        return backend.gather(
            config.inputs.x, config.inputs.indices, config.args.axis);
      },
  Pad1D: (backend: MathBackend, config: Pad1DNode['inputAndArgs']) => {
    return backend.pad1D(
        config.inputs.x, config.args.paddings, config.args.constantValue);
  },
  Pad2D: (backend: MathBackend, config: Pad2DNode['inputAndArgs']) => {
    return backend.pad2D(
        config.inputs.x, config.args.paddings, config.args.constantValue);
  },
  Transpose:
      (backend: MathBackend,
       config: TransposeNode<DataType, Rank>['inputAndArgs']) => {
        return backend.transpose(config.inputs.x, config.args.perm);
      },
  Conv2D: (backend: MathBackend, config: Conv2DNode['inputAndArgs']) => {
    return backend.conv2d(
        config.inputs.x, config.inputs.filter, config.inputs.bias,
        config.args.convInfo);
  },
  Conv2DDerInput:
      (backend: MathBackend, config: Conv2DDerInputNode['inputAndArgs']) => {
        return backend.conv2dDerInput(
            config.inputs.dy, config.inputs.filter, config.args.convInfo);
      },
  Conv2DDerFilter:
      (backend: MathBackend, config: Conv2DDerFilterNode['inputAndArgs']) => {
        return backend.conv2dDerFilter(
            config.inputs.x, config.inputs.dy, config.args.convInfo);
      },
  Conv2DDerBias:
      (backend: MathBackend, config: Conv2DDerBiasNode['inputAndArgs']) => {
        return backend.conv2dDerBias(config.inputs.dy);
      },
  DepthwiseConv2D:
      (backend: MathBackend, config: DepthwiseConv2DNode['inputAndArgs']) => {
        return backend.depthwiseConv2D(
            config.inputs.x, config.inputs.filter, config.args.convInfo);
      },
  MaxPool: (backend: MathBackend, config: PoolNode['inputAndArgs']) => {
    return backend.maxPool(config.inputs.x, config.args.convInfo);
  },
  MaxPoolBackprop:
      (backend: MathBackend, config: PoolBackpropNode['inputAndArgs']) => {
        return backend.maxPoolBackprop(
            config.inputs.dy, config.inputs.x, config.args.convInfo);
      },
  AvgPool: (backend: MathBackend, config: PoolNode['inputAndArgs']) => {
    return backend.avgPool(config.inputs.x, config.args.convInfo);
  },
  AvgPoolBackprop:
      (backend: MathBackend, config: PoolBackpropNode['inputAndArgs']) => {
        return backend.avgPoolBackprop(
            config.inputs.dy, config.inputs.x, config.args.convInfo);
      },
  MinPool: (backend: MathBackend, config: PoolNode['inputAndArgs']) => {
    return backend.minPool(config.inputs.x, config.args.convInfo);
  },
  ResizeBilinear3D:
      (backend: MathBackend, config: ResizeBilinear3DNode['inputAndArgs']) => {
        return backend.resizeBilinear3D(
            config.inputs.x, config.args.newShape2D, config.args.alignCorners);
      },
  BatchNorm4D: (
      backend: MathBackend, config: BatchNorm4DNode['inputAndArgs']) => {
    return backend.batchNormalization4D(
        config.inputs.x, config.inputs.mean, config.inputs.variance,
        config.args.varianceEpsilon, config.inputs.scale, config.inputs.offset);
  },
  BatchNorm3D: (
      backend: MathBackend, config: BatchNorm3DNode['inputAndArgs']) => {
    return backend.batchNormalization3D(
        config.inputs.x, config.inputs.mean, config.inputs.variance,
        config.args.varianceEpsilon, config.inputs.scale, config.inputs.offset);
  },
  BatchNorm2D: (
      backend: MathBackend, config: BatchNorm2DNode['inputAndArgs']) => {
    return backend.batchNormalization2D(
        config.inputs.x, config.inputs.mean, config.inputs.variance,
        config.args.varianceEpsilon, config.inputs.scale, config.inputs.offset);
  },
  LRN4D: (backend: MathBackend, config: LRN4DNode['inputAndArgs']) => {
    return backend.localResponseNormalization4D(
        config.inputs.x, config.args.radius, config.args.bias,
        config.args.alpha, config.args.beta, config.args.normRegion);
  },
  Multinomial:
      (backend: MathBackend, config: MultinomialNode['inputAndArgs']) => {
        return backend.multinomial(
            config.inputs.probs, config.args.numSamples, config.args.seed);
      },
  OneHot: (backend: MathBackend, config: OneHotNode['inputAndArgs']) => {
    return backend.oneHot(
        config.inputs.indices, config.args.depth, config.args.onValue,
        config.args.offValue);
  }
};
export function executeKernel<D extends DataType, R extends Rank, K extends
                                  keyof KernelConfigRegistry<D, R>, O extends
                                      KernelConfigRegistry<D, R>[K]['output']>(
    backend: MathBackend, kernelName: K,
    config: KernelConfigRegistry<D, R>[K]['inputAndArgs']): O {
  return KERNEL_METHODS[kernelName](backend, config) as O;
}

export interface KernelConfigRegistry<D extends DataType, R extends Rank> {
  MatMul: MatMulNode;
  Clone: UnaryNode<D, R>;
  Slice1D: Slice1DNode<D>;
  Slice2D: Slice2DNode<D>;
  Slice3D: Slice3DNode<D>;
  Slice4D: Slice4DNode<D>;
  Reverse4D: Reverse4DNode;
  Concat1D: Concat1DNode;
  Concat2D: Concat2DNode;
  Concat3D: Concat3DNode;
  Concat4D: Concat4DNode;
  Neg: UnaryNode<D, R>;
  Add: BinaryNode;
  Sub: BinaryNode;
  Mul: BinaryNode;
  Div: BinaryNode;
  Sum: SumNode<D>;
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
  TopKValues: TopKValuesNode<D, R>;
  TopKIndices: TopKIndicesNode;
  Min: MinNode<D>;
  Minimum: MinimumNode<D>;
  Max: MaxNode<D>;
  Maximum: MaximumNode<D>;
  Ceil: UnaryNode<D, R>;
  Floor: UnaryNode<D, R>;
  Pow: PowNode<D, R>;
  Exp: UnaryNode<D, R>;
  Log: UnaryNode<D, R>;
  Sqrt: UnaryNode<D, R>;
  Square: UnaryNode<D, R>;
  Relu: UnaryNode<D, R>;
  LeakyRelu: LeakyReluNode<D, R>;
  PReLU: PReLUNode<D, R>;
  PReLUDer: PReLUNode<D, R>;
  Reshape: ReshapeNode;
  Cast: CastNode;
  Elu: UnaryNode<D, R>;
  EluDer: UnaryNode<D, R>;
  Selu: UnaryNode<D, R>;
  Abs: UnaryNode<D, R>;
  Sigmoid: UnaryNode<D, R>;
  Step: StepNode<D, R>;
  Sin: UnaryNode<D, R>;
  Cos: UnaryNode<D, R>;
  Tan: UnaryNode<D, R>;
  Asin: UnaryNode<D, R>;
  Acos: UnaryNode<D, R>;
  Atan: UnaryNode<D, R>;
  Sinh: UnaryNode<D, R>;
  Cosh: UnaryNode<D, R>;
  Tanh: UnaryNode<D, R>;
  Clip: ClipNode<D, R>;
  Transpose: TransposeNode<D, R>;
  Pad1D: Pad1DNode;
  Pad2D: Pad2DNode;
  Tile: TileNode<D, R>;
  Gather: GatherNode<D, R>;
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
  ResizeBilinear3D: ResizeBilinear3DNode;
  BatchNorm4D: BatchNorm4DNode;
  BatchNorm3D: BatchNorm3DNode;
  BatchNorm2D: BatchNorm2DNode;
  LRN4D: LRN4DNode;
  Multinomial: MultinomialNode;
  OneHot: OneHotNode;
}
