/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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
import * as axis_util from '../axis_util';
import {NDArrayMath} from '../math';
import * as ndarray from '../ndarray';
// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array3D, Array4D, DataTypes, NDArray} from '../ndarray';
import * as reduce_util from '../reduce_util';
import {SumTypes, SumTypesMap} from '../types';

import {MathBackend} from './backend';
import {ArgMaxInputConfig, ArgMinInputConfig} from './kernels/argminmax';
import {BatchNorm2DInputConfig, BatchNorm3DInputConfig} from './kernels/batchnorm';
import {BinaryInputConfig} from './kernels/binary';
import {Concat1DInputConfig, Concat2DInputConfig, Concat3DInputConfig, Concat4DInputConfig} from './kernels/concat';
import {Conv2DDerBiasInputConfig, Conv2DDerFilterInputConfig, Conv2DDerInputInputConfig, Conv2DInputConfig, DepthwiseConv2DInputConfig} from './kernels/conv';
import {EqualInputConfig} from './kernels/logical';
import {MatMulInputConfig} from './kernels/matmul';
import {MaxInputConfig, MinInputConfig} from './kernels/minmax';
import {PoolBackpropInputConfig, PoolInputConfig} from './kernels/pool';
import {ResizeBilinear3DInputConfig} from './kernels/resize_bilinear';
import {Slice1DInputConfig, Slice2DInputConfig, Slice3DInputConfig, Slice4DInputConfig} from './kernels/slice';
import {SumInputConfig} from './kernels/sum';
import {TopKIndicesInputConfig, TopKValuesInputConfig} from './kernels/topk';
import {ClipInputConfig, LeakyReluInputConfig, StepInputConfig, TileInputConfig, TransposeInputConfig, UnaryInputConfig} from './kernels/unary';
import {ArgMinMaxProgram} from './webgl/argminmax_gpu';
import {BatchNormProgram} from './webgl/batchnorm_gpu';
import * as binaryop_gpu from './webgl/binaryop_gpu';
import {BinaryOpProgram} from './webgl/binaryop_gpu';
import {ClipProgram} from './webgl/clip_gpu';
import {ConcatProgram} from './webgl/concat_gpu';
// tslint:disable-next-line:max-line-length
import {Conv2DDerBiasProgram, Conv2DDerFilterProgram, Conv2DDerInputProgram} from './webgl/conv_backprop_gpu';
import {Conv2DProgram} from './webgl/conv_gpu';
import {DepthwiseConv2DProgram} from './webgl/conv_gpu_depthwise';
import {Copy2DProgram} from './webgl/copy_gpu';
import {GPGPUContext} from './webgl/gpgpu_context';
import * as gpgpu_math from './webgl/gpgpu_math';
import {GPGPUBinary, GPGPUProgram} from './webgl/gpgpu_math';
import * as gpgpu_util from './webgl/gpgpu_util';
import {MaxPool2DBackpropProgram} from './webgl/max_pool_backprop_gpu';
import {MatMulProgram} from './webgl/mulmat_gpu';
import {MultinomialProgram} from './webgl/multinomial_gpu';
import {OneHotProgram} from './webgl/onehot_gpu';
import {Pool2DProgram} from './webgl/pool_gpu';
import {ReduceProgram} from './webgl/reduce_gpu';
import {ResizeBilinear3DProgram} from './webgl/resize_bilinear_gpu';
import {SliceProgram} from './webgl/slice_gpu';
import {TextureManager} from './webgl/texture_manager';
import {TileProgram} from './webgl/tile_gpu';
import {TransposeProgram} from './webgl/transpose_gpu';
import * as unary_op from './webgl/unaryop_gpu';
import {UnaryOpProgram} from './webgl/unaryop_gpu';
import * as webgl_util from './webgl/webgl_util';

export class MathBackendWebGL implements MathBackend {
  private gpgpu: GPGPUContext;
  private textureManager: TextureManager;
  private binaryCache: {[key: string]: GPGPUBinary} = {};
  private gpgpuCreatedLocally: boolean;

  constructor(gpgpu?: GPGPUContext) {
    if (gpgpu == null) {
      const gl = gpgpu_util.createWebGLContext();
      this.gpgpu = new GPGPUContext(gl);
      this.gpgpuCreatedLocally = true;
    } else {
      this.gpgpu = gpgpu;
      this.gpgpuCreatedLocally = false;
    }

    this.textureManager = new TextureManager(this.gpgpu);

    ndarray.initializeGPU(this.gpgpu, this.textureManager);
  }

  getGPGPUContext(): GPGPUContext {
    return this.gpgpu;
  }

  clone<G extends keyof DataTypes, T extends NDArray<G>>(
      config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;

    const texShape = x.getTextureShapeRC();
    // Pretend the source was in logical shape that matches the texture shape.
    const source = x.as2D(texShape[0], texShape[1]);
    // Do the same for output.
    const output = this.makeOutputArray<G, Array2D<G>>(texShape, x.dtype as G);
    this.copy2D(source, [0, 0], texShape, output, [0, 0], texShape);
    // Get back to the original logical shape.
    return output.reshape(x.shape) as T;
  }

  slice1D(config: Slice1DInputConfig): Array1D {
    const program = new SliceProgram([config.args.size]);
    const customSetup = program.getCustomSetupFunc([config.args.begin]);
    return this.compileAndRun(program, [config.inputs.x], null, customSetup);
  }

  slice2D(config: Slice2DInputConfig): Array2D {
    const program = new SliceProgram(config.args.size);
    const customSetup = program.getCustomSetupFunc(config.args.begin);
    return this.compileAndRun(program, [config.inputs.x], null, customSetup);
  }

  slice3D(config: Slice3DInputConfig): Array3D {
    const program = new SliceProgram(config.args.size);
    const customSetup = program.getCustomSetupFunc(config.args.begin);
    return this.compileAndRun(program, [config.inputs.x], null, customSetup);
  }

  slice4D(config: Slice4DInputConfig): Array4D {
    const program = new SliceProgram(config.args.size);
    const customSetup = program.getCustomSetupFunc(config.args.begin);
    return this.compileAndRun(program, [config.inputs.x], null, customSetup);
  }

  private copy2D(
      source: Array2D, sourceBeginRowCol: [number, number],
      sourceSizeRowCol: [number, number], dest: Array2D,
      destBeginRowCol: [number, number],
      destSizeRowCol: [number, number]): void {
    const program = new Copy2DProgram(sourceSizeRowCol[1], destSizeRowCol[1]);
    const customSetup = program.getCustomSetupFunc(
        sourceBeginRowCol, destBeginRowCol, destSizeRowCol);
    this.compileAndRun(program, [source], dest, customSetup);
  }

  concat1D(config: Concat1DInputConfig): Array1D {
    const {a, b} = config.inputs;

    const program = new ConcatProgram(a.shape, b.shape, 0);
    return this.compileAndRun(program, [a, b]);
  }

  concat2D(config: Concat2DInputConfig): Array2D {
    const {a, b} = config.inputs;
    const {axis} = config.args;

    const program = new ConcatProgram(a.shape, b.shape, axis);
    return this.compileAndRun(program, [a, b]);
  }

  concat3D(config: Concat3DInputConfig): Array3D {
    const {a, b} = config.inputs;
    const {axis} = config.args;

    const program = new ConcatProgram(a.shape, b.shape, axis);
    return this.compileAndRun(program, [a, b]);
  }

  concat4D(config: Concat4DInputConfig): Array4D {
    const {a, b} = config.inputs;
    const {axis} = config.args;

    const program = new ConcatProgram(a.shape, b.shape, axis);
    return this.compileAndRun(program, [a, b]);
  }

  neg<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.NEG);
    return this.compileAndRun(program, [x]) as T;
  }

  matMul(config: MatMulInputConfig): Array2D {
    const {a, b} = config.inputs;
    const {aOrientation, bOrientation} = config.args;

    const program =
        new MatMulProgram(a.shape, b.shape, aOrientation, bOrientation);
    return this.compileAndRun<Array2D, Array2D>(program, [a, b]);
  }

  add(config: BinaryInputConfig): NDArray {
    const {a, b} = config.inputs;
    const program = new BinaryOpProgram(binaryop_gpu.ADD, a.shape, b.shape);
    return this.compileAndRun(program, [a, b]);
  }

  subtract(config: BinaryInputConfig): NDArray {
    const {a, b} = config.inputs;
    const program = new BinaryOpProgram(binaryop_gpu.SUB, a.shape, b.shape);
    return this.compileAndRun(program, [a, b]);
  }

  multiply(config: BinaryInputConfig): NDArray {
    const {a, b} = config.inputs;
    const program = new BinaryOpProgram(binaryop_gpu.MUL, a.shape, b.shape);
    return this.compileAndRun(program, [a, b]);
  }

  divide(config: BinaryInputConfig): NDArray<'float32'> {
    const {a, b} = config.inputs;
    const program = new BinaryOpProgram(binaryop_gpu.DIV, a.shape, b.shape);
    const output = this.makeOutputArray(program.outputShape, 'float32');
    return this.compileAndRun<NDArray, NDArray<'float32'>>(
        program, [a, b], output);
  }

  batchNormalization2D(config: BatchNorm2DInputConfig): Array2D {
    const {x, mean, variance, scale, offset} = config.inputs;
    const {varianceEpsilon} = config.args;

    const inputs = [x, mean, variance];

    let offsetShape = null;
    if (offset != null) {
      offsetShape = offset.shape;
      inputs.push(offset);
    }

    let scaleShape = null;
    if (scale != null) {
      scaleShape = scale.shape;
      inputs.push(scale);
    }

    const program = new BatchNormProgram(
        x.shape, mean.shape, variance.shape, offsetShape, scaleShape,
        varianceEpsilon);
    return this.compileAndRun(program, inputs);
  }

  batchNormalization3D(config: BatchNorm3DInputConfig): Array3D {
    const {x, mean, variance, scale, offset} = config.inputs;
    const {varianceEpsilon} = config.args;

    const inputs = [x, mean, variance];

    let offsetShape = null;
    if (offset != null) {
      offsetShape = offset.shape;
      inputs.push(offset);
    }

    let scaleShape = null;
    if (scale != null) {
      scaleShape = scale.shape;
      inputs.push(scale);
    }

    const program = new BatchNormProgram(
        x.shape, mean.shape, variance.shape, offsetShape, scaleShape,
        varianceEpsilon);
    return this.compileAndRun(program, inputs);
  }

  tile<D extends keyof DataTypes, T extends NDArray<D>>(
      config: TileInputConfig<T>): T {
    const {x} = config.inputs;
    const {reps} = config.args;
    const program = new TileProgram(x.shape, reps);
    return this.compileAndRun(program, [x]);
  }

  transpose<D extends keyof DataTypes, T extends NDArray<D>>(
      config: TransposeInputConfig<T>): T {
    const {x} = config.inputs;
    const {perm} = config.args;
    const program = new TransposeProgram(x.shape, perm);
    return this.compileAndRun(program, [x]);
  }

  private reduce<D extends keyof DataTypes>(
      a: Array2D, reduceType: 'max'|'min'|'sum', dtype: D): Array2D<D> {
    const batchSize = a.shape[0];
    const inSize = a.shape[1];
    const windowSize = reduce_util.computeOptimalWindowSize(inSize);
    const reduceInfo = {windowSize, inSize, batchSize};
    const program = new ReduceProgram(reduceInfo, reduceType);
    const [rows, cols] = program.outputShape;
    const output =
        this.makeOutputArray(program.outputShape, dtype).as2D(rows, cols);
    this.compileAndRun(program, [a], output);
    // No need to run another GPGPU program.
    if (output.shape[1] === 1) {
      return output;
    }
    return this.reduce(output, reduceType, dtype);
  }

  private argReduce(
      a: Array2D, reduceType: 'max'|'min',
      bestIndicesA: Array2D = null): Array2D<'int32'> {
    let batchSize = a.shape[0];
    let inSize = a.shape[1];
    if (bestIndicesA != null) {
      batchSize = bestIndicesA.shape[0];
      inSize = bestIndicesA.shape[1];
    }
    const windowSize = reduce_util.computeOptimalWindowSize(inSize);
    const reduceInfo = {windowSize, inSize, batchSize};
    const program =
        new ArgMinMaxProgram(reduceInfo, reduceType, bestIndicesA == null);
    const [rows, cols] = program.outputShape;
    const output =
        this.makeOutputArray(program.outputShape, 'int32').as2D(rows, cols);
    const inputs = [a];
    if (bestIndicesA != null) {
      inputs.push(bestIndicesA);
    }
    this.compileAndRun(program, inputs, output);
    // No need to run another GPGPU program.
    if (output.shape[1] === 1) {
      return output;
    }
    return this.argReduce(a, reduceType, output);
  }

  sum<T extends keyof DataTypes>(config: SumInputConfig<SumTypes[T]>):
      NDArray<SumTypes[T]> {
    const {x} = config.inputs;
    const {axes} = config.args;

    axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    const outputDType = SumTypesMap[x.dtype];
    return this.reduce(a2D, 'sum', outputDType).reshape(outShape);
  }

  argMin(config: ArgMinInputConfig): NDArray<'int32'> {
    const {x} = config.inputs;
    const {axes} = config.args;

    axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    return this.argReduce(a2D, 'min').reshape(outShape);
  }

  argMax(config: ArgMaxInputConfig): NDArray<'int32'> {
    const {x} = config.inputs;
    const {axes} = config.args;

    axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    return this.argReduce(a2D, 'max').reshape(outShape);
  }

  equal(config: EqualInputConfig): NDArray<'bool'> {
    const {a, b} = config.inputs;

    const program = new BinaryOpProgram(binaryop_gpu.EQUAL, a.shape, b.shape);
    const output = this.makeOutputArray(program.outputShape, 'bool');
    return this.compileAndRun(program, [a, b], output);
  }

  topKValues<D extends keyof DataTypes, T extends NDArray<D>>(
      config: TopKValuesInputConfig<T>): Array1D<D> {
    throw new Error('topKValues GPU not yet implemented!');
  }

  topKIndices(config: TopKIndicesInputConfig): Array1D<'int32'> {
    throw new Error('topKIndices GPU not yet implemented!');
  }

  min<G extends keyof DataTypes>(config: MinInputConfig<G>): NDArray<G> {
    const {x} = config.inputs;
    const {axes} = config.args;

    axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    return this.reduce(a2D, 'min', a2D.dtype).reshape(outShape);
  }

  max<G extends keyof DataTypes>(config: MaxInputConfig<G>): NDArray<G> {
    const {x} = config.inputs;
    const {axes} = config.args;

    axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    return this.reduce(a2D, 'max', a2D.dtype).reshape(outShape);
  }

  ceil<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.CEIL);
    return this.compileAndRun(program, [x]) as T;
  }

  floor<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.FLOOR);
    return this.compileAndRun(program, [x]) as T;
  }

  exp<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.EXP);
    return this.compileAndRun(program, [x]) as T;
  }

  log<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.LOG);
    return this.compileAndRun(program, [x]) as T;
  }

  sqrt<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.SQRT);
    return this.compileAndRun(program, [x]) as T;
  }

  square<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.SQUARE);
    return this.compileAndRun(program, [x]) as T;
  }

  relu<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.RELU);
    return this.compileAndRun(program, [x]) as T;
  }

  elu<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.ELU);
    return this.compileAndRun(program, [x]) as T;
  }

  eluDer<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.ELU_DER);
    return this.compileAndRun(program, [x]) as T;
  }

  selu<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.SELU);
    return this.compileAndRun(program, [x]) as T;
  }

  leakyRelu<T extends NDArray>(config: LeakyReluInputConfig<T>): T {
    const {x} = config.inputs;
    const {alpha} = config.args;
    const program = new UnaryOpProgram(x.shape, unary_op.LEAKY_RELU(alpha));
    return this.compileAndRun(program, [x]) as T;
  }

  clip<T extends NDArray>(config: ClipInputConfig<T>): T {
    const {x} = config.inputs;
    const {min, max} = config.args;
    const program = new ClipProgram(x.shape, min, max);
    return this.compileAndRun(program, [x]) as T;
  }

  abs<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.ABS);
    return this.compileAndRun(program, [x]) as T;
  }

  sigmoid<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.SIGMOID);
    return this.compileAndRun(program, [x]) as T;
  }

  sin<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.SIN);
    return this.compileAndRun(program, [x]) as T;
  }

  cos<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.COS);
    return this.compileAndRun(program, [x]) as T;
  }

  tan<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.TAN);
    return this.compileAndRun(program, [x]) as T;
  }

  asin<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.ASIN);
    return this.compileAndRun(program, [x]) as T;
  }

  acos<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.ACOS);
    return this.compileAndRun(program, [x]) as T;
  }

  atan<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.ATAN);
    return this.compileAndRun(program, [x]) as T;
  }

  sinh<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.SINH);
    return this.compileAndRun(program, [x]) as T;
  }

  cosh<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.COSH);
    return this.compileAndRun(program, [x]) as T;
  }

  tanh<T extends NDArray>(config: UnaryInputConfig<T>): T {
    const {x} = config.inputs;
    const program = new UnaryOpProgram(x.shape, unary_op.TANH);
    return this.compileAndRun(program, [x]) as T;
  }

  step<T extends NDArray>(config: StepInputConfig<T>): T {
    const {x} = config.inputs;
    const {alpha} = config.args;
    const program = new UnaryOpProgram(x.shape, unary_op.STEP(alpha));
    return this.compileAndRun(program, [x]) as T;
  }

  conv2d(config: Conv2DInputConfig): Array4D {
    const {x, filter, bias} = config.inputs;
    const {convInfo} = config.args;

    const program = new Conv2DProgram(convInfo, bias != null);
    const inputs = bias != null ? [x, filter, bias] : [x, filter];
    return this.compileAndRun(program, inputs);
  }

  conv2dDerInput(config: Conv2DDerInputInputConfig): Array4D {
    const {dy, filter} = config.inputs;
    const {convInfo} = config.args;

    const program = new Conv2DDerInputProgram(convInfo);
    return this.compileAndRun(program, [dy, filter]);
  }

  conv2dDerFilter(config: Conv2DDerFilterInputConfig): Array4D {
    const {x, dy} = config.inputs;
    const {convInfo} = config.args;

    const program = new Conv2DDerFilterProgram(convInfo);
    return this.compileAndRun(program, [x, dy]);
  }

  conv2dDerBias(config: Conv2DDerBiasInputConfig): Array1D {
    const {dy} = config.inputs;

    const program = new Conv2DDerBiasProgram(dy.shape);
    return this.compileAndRun(program, [dy]);
  }

  depthwiseConv2D(config: DepthwiseConv2DInputConfig): Array4D {
    const {x, filter} = config.inputs;
    const {convInfo} = config.args;

    const program = new DepthwiseConv2DProgram(convInfo);
    return this.compileAndRun(program, [x, filter]);
  }

  maxPool(config: PoolInputConfig): Array4D {
    const {x} = config.inputs;
    const {convInfo} = config.args;

    const program = new Pool2DProgram(convInfo, 'max', false);
    return this.compileAndRun(program, [x]);
  }

  minPool(config: PoolInputConfig): Array4D {
    const {x} = config.inputs;
    const {convInfo} = config.args;

    const program = new Pool2DProgram(convInfo, 'min', false);
    return this.compileAndRun(program, [x]);
  }

  avgPool(config: PoolInputConfig): Array4D {
    const {x} = config.inputs;
    const {convInfo} = config.args;

    const program = new Pool2DProgram(convInfo, 'avg', false);
    return this.compileAndRun(program, [x]);
  }

  maxPoolBackprop(config: PoolBackpropInputConfig): Array4D {
    const {dy, x} = config.inputs;
    const {convInfo} = config.args;

    const getPositions = true;
    const maxPoolPositionsProgram =
        new Pool2DProgram(convInfo, 'max', getPositions);
    const maxPoolPositions: Array4D =
        this.compileAndRun(maxPoolPositionsProgram, [x]);

    const maxPoolBackPropProgram = new MaxPool2DBackpropProgram(convInfo);

    const result =
        this.compileAndRun(maxPoolBackPropProgram, [dy, maxPoolPositions]);
    maxPoolPositions.dispose();
    return result as Array4D;
  }

  resizeBilinear3D(config: ResizeBilinear3DInputConfig): Array3D {
    const {x} = config.inputs;
    const {newShape2D, alignCorners} = config.args;

    const program =
        new ResizeBilinear3DProgram(x.shape, newShape2D, alignCorners);
    return this.compileAndRun(program, [x]);
  }

  multinomial(probs: Array2D, numSamples: number, seed: number):
      Array2D<'int32'> {
    const batchSize = probs.shape[0];
    const numOutcomes = probs.shape[1];
    const program = new MultinomialProgram(batchSize, numOutcomes, numSamples);
    const output =
        this.makeOutputArray(program.outputShape, 'int32') as Array2D<'int32'>;
    const customSetup = program.getCustomSetupFunc(seed);
    return this.compileAndRun(program, [probs], output, customSetup);
  }

  oneHot(indices: Array1D, depth: number, onValue: number, offValue: number):
      Array2D {
    const program = new OneHotProgram(indices.size, depth, onValue, offValue);
    return this.compileAndRun(program, [indices]);
  }

  private makeOutputArray<G extends keyof DataTypes, T extends NDArray<G>>(
      shape: number[], dtype: G): T {
    const textureShapeRC =
        webgl_util.getTextureShapeFromLogicalShape(this.gpgpu.gl, shape);
    const texture = this.textureManager.acquireTexture(textureShapeRC);
    return NDArray.make(shape, {texture, textureShapeRC}, dtype) as T;
  }

  private compileAndRun<T extends NDArray, K extends NDArray>(
      program: GPGPUProgram, inputs: T[], output?: K,
      customSetup?: (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void):
      K {
    if (output == null) {
      output = this.makeOutputArray(program.outputShape, inputs[0].dtype);
    }
    const key = gpgpu_math.makeShaderKey(program, inputs, output);
    const binary = this.getAndSaveBinary(key, () => {
      return gpgpu_math.compileProgram(this.gpgpu, program, inputs, output);
    });
    gpgpu_math.runProgram(binary, inputs, output, customSetup);
    return output;
  }

  private getAndSaveBinary(key: string, getBinary: () => GPGPUBinary):
      GPGPUBinary {
    if (!(key in this.binaryCache)) {
      this.binaryCache[key] = getBinary();
    }
    return this.binaryCache[key];
  }

  getTextureManager(): TextureManager {
    return this.textureManager;
  }

  dispose() {
    for (const key in this.binaryCache) {
      this.gpgpu.deleteProgram(this.binaryCache[key].webGLProgram);
    }
    this.textureManager.dispose();

    if (this.gpgpuCreatedLocally) {
      this.gpgpu.dispose();
    }
  }
}

// TODO(nsthorat): Deprecate this once we export non-abstract NDArrayMath.
export class NDArrayMathGPU extends NDArrayMath {
  constructor(gpgpu?: GPGPUContext, safeMode = false) {
    super(new MathBackendWebGL(gpgpu), safeMode);
  }

  getGPGPUContext(): GPGPUContext {
    return (this.backend as MathBackendWebGL).getGPGPUContext();
  }

  getTextureManager(): TextureManager {
    return (this.backend as MathBackendWebGL).getTextureManager();
  }
}
