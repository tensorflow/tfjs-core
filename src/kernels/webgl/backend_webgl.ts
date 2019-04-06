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

// Import webgl flags.
import './flags_webgl';

import * as device_util from '../../device_util';
import {ENGINE, MemoryInfo, TimingInfo} from '../../engine';
import {ENV} from '../../environment';
import {tidy} from '../../globals';
import * as axis_util from '../../ops/axis_util';
import {Conv2DInfo} from '../../ops/conv_util';
import * as reduce_util from '../../ops/reduce_util';
import {computeFlatOffset, isSliceContinous} from '../../ops/slice_util';
import {scalar} from '../../ops/tensor_ops';
import {DataId, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D} from '../../tensor';
import {DataType, DataTypeMap, DataValues, NumericDataType, Rank, RecursiveArray, ShapeMap, sumOutType, TypedArray, upcastType} from '../../types';
import * as util from '../../util';
import {getTypedArrayFromDType, sizeFromShape} from '../../util';
import {DataStorage, EPSILON_FLOAT16, EPSILON_FLOAT32, KernelBackend} from '../backend';
import * as backend_util from '../backend_util';
import {mergeRealAndImagArrays} from '../complex_util';

import {BatchNormPackedProgram} from './batchnorm_packed_gpu';
import * as binaryop_complex_gpu from './binaryop_complex_gpu';
import {BinaryOpComplexProgram} from './binaryop_complex_gpu';
import * as binaryop_gpu from './binaryop_gpu';
import {BinaryOpProgram} from './binaryop_gpu';
import * as binaryop_packed_gpu from './binaryop_packed_gpu';
import {BinaryOpPackedProgram} from './binaryop_packed_gpu';
import {getWebGLContext} from './canvas_util';
import {Conv2DProgram} from './conv_gpu';
import {DepthwiseConv2DProgram} from './conv_gpu_depthwise';
import {DepthwiseConvPacked2DProgram} from './conv_packed_gpu_depthwise';
import {EncodeFloatProgram} from './encode_float_gpu';
import {FromPixelsProgram} from './from_pixels_gpu';
import {GPGPUContext} from './gpgpu_context';
import * as gpgpu_math from './gpgpu_math';
import {GPGPUBinary, GPGPUProgram, TensorData} from './gpgpu_math';
import {Im2ColPackedProgram} from './im2col_packed_gpu';
import {MatMulPackedProgram} from './mulmat_packed_gpu';
import {PackProgram} from './pack_gpu';
import {ReduceProgram} from './reduce_gpu';
import {ReshapePackedProgram} from './reshape_packed_gpu';
import {SlicePackedProgram} from './slice_packed_gpu';
import * as tex_util from './tex_util';
import {TextureData, TextureUsage} from './tex_util';
import {TextureManager} from './texture_manager';
import {TransposePackedProgram} from './transpose_packed_gpu';
import * as unary_op from './unaryop_gpu';
import {UnaryOpProgram} from './unaryop_gpu';
import * as unary_packed_op from './unaryop_packed_gpu';
import {UnaryOpPackedProgram} from './unaryop_packed_gpu';
import {UnpackProgram} from './unpack_gpu';
import * as webgl_util from './webgl_util';

type KernelInfo = {
  name: string; query: Promise<number>;
};

export type TimerNode = RecursiveArray<KernelInfo>|KernelInfo;
export interface CPUTimerQuery {
  startMs: number;
  endMs?: number;
}

export interface WebGLMemoryInfo extends MemoryInfo {
  numBytesInGPU: number;
  unreliable: boolean;
}

export interface WebGLTimingInfo extends TimingInfo {
  uploadWaitMs: number;
  downloadWaitMs: number;
}

const binaryCaches: {[webGLVersion: string]: {[key: string]: GPGPUBinary}} = {};

function getBinaryCache(webGLVersion: number) {
  if (webGLVersion in binaryCaches) {
    return binaryCaches[webGLVersion];
  }
  binaryCaches[webGLVersion] = {};
  return binaryCaches[webGLVersion];
}

// Combines a dataId, a shape, and a dtype without a Tensor object so that
// programs can be executed without a full Tensor object.
export interface TensorHandle {
  dataId: DataId;
  shape: number[];
  dtype: DataType;
}

// Empirically determined constant used to determine size threshold for handing
// off execution to the CPU.
const CPU_HANDOFF_SIZE_THRESHOLD = 128;

// Empirically determined constant used to decide the number of MB on GPU
// before we warn about high memory use. The MB are this constant * screen area
// * dpi / 1024 / 1024.
const BEFORE_PAGING_CONSTANT = 600;
function numMBBeforeWarning(): number {
  if (ENV.global.screen == null) {
    return 1024;  // 1 GB.
  }
  return (ENV.global.screen.height * ENV.global.screen.width *
          window.devicePixelRatio) *
      BEFORE_PAGING_CONSTANT / 1024 / 1024;
}

// Empirically determined minimal shared dimension in matmul before we forward
// to a.mul(b).sum() in order to take advantage of GPU parallelism. See
// https://github.com/tensorflow/tfjs-core/pull/1379 for benchmarks.
export const MATMUL_SHARED_DIM_THRESHOLD = 1000;

export class MathBackendWebGL extends KernelBackend {
  private texData: DataStorage<TextureData>;
  // Maps data ids that have a pending read operation, to list of subscribers.
  private pendingRead = new WeakMap<DataId, Array<(arr: TypedArray) => void>>();
  // List of data ids that are scheduled for disposal, but are waiting on a
  // pending read operation.
  private pendingDisposal = new WeakSet<DataId>();
  // Used to count the number of 'shallow' sliced tensors that point to the
  // same data id.
  private dataRefCount = new WeakMap<DataId, number>();
  private numBytesInGPU = 0;

  private canvas: HTMLCanvasElement;
  private fromPixels2DContext: CanvasRenderingContext2D;

  // private programTimersStack: TimerNode[];
  private activeTimers: TimerNode[];
  // Accumulated time spent (including blocking) in uploading data to webgl.
  // private uploadWaitMs = 0;
  // Accumulated time spent (including blocking in downloading data from webgl.
  // private downloadWaitMs = 0;
  private cpuBackend: KernelBackend;

  // Number of bits of precision of this backend.
  private floatPrecisionValue: 32|16;

  private textureManager: TextureManager;
  private binaryCache: {[key: string]: GPGPUBinary};
  private gpgpuCreatedLocally: boolean;
  private numMBBeforeWarning: number;
  private warnedAboutMemory = false;

  constructor(private gpgpu?: GPGPUContext) {
    super();
    if (!ENV.getBool('HAS_WEBGL')) {
      throw new Error('WebGL is not supported on this device');
    }

    if (gpgpu == null) {
      const gl = getWebGLContext(ENV.getNumber('WEBGL_VERSION'));
      this.binaryCache = getBinaryCache(ENV.getNumber('WEBGL_VERSION'));
      this.gpgpu = new GPGPUContext(gl);
      this.canvas = gl.canvas;
      this.gpgpuCreatedLocally = true;
    } else {
      this.binaryCache = {};
      this.gpgpuCreatedLocally = false;
      this.canvas = gpgpu.gl.canvas;
    }
    this.textureManager = new TextureManager(this.gpgpu);
    this.numMBBeforeWarning = numMBBeforeWarning();

    this.texData = new DataStorage(ENGINE);
  }

  register(dataId: DataId, shape: number[], dtype: DataType): void {
    if (this.texData.has(dataId)) {
      throw new Error('Data buffer is already registered');
    }
    this.texData.set(dataId, {shape, dtype});
  }

  fromPixels(
      pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement,
      numChannels: number): Tensor3D {
    if (pixels == null) {
      throw new Error(
          'pixels passed to tf.browser.fromPixels() can not be null');
    }
    const texShape: [number, number] = [pixels.height, pixels.width];
    const outShape = [pixels.height, pixels.width, numChannels];

    if (ENV.getBool('IS_BROWSER')) {
      if (!(pixels instanceof HTMLVideoElement) &&
          !(pixels instanceof HTMLImageElement) &&
          !(pixels instanceof HTMLCanvasElement) &&
          !(pixels instanceof ImageData)) {
        throw new Error(
            'pixels passed to tf.browser.fromPixels() must be either an ' +
            `HTMLVideoElement, HTMLImageElement, HTMLCanvasElement or ` +
            `ImageData, but was ${(pixels as {}).constructor.name}`);
      }
      if (pixels instanceof HTMLVideoElement) {
        if (this.fromPixels2DContext == null) {
          if (document.readyState !== 'complete') {
            throw new Error(
                'The DOM is not ready yet. Please call ' +
                'tf.browser.fromPixels() once the DOM is ready. One way to ' +
                'do that is to add an event listener for `DOMContentLoaded` ' +
                'on the document object');
          }
          this.fromPixels2DContext =
              document.createElement('canvas').getContext('2d');
        }
        this.fromPixels2DContext.canvas.width = pixels.width;
        this.fromPixels2DContext.canvas.height = pixels.height;
        this.fromPixels2DContext.drawImage(
            pixels, 0, 0, pixels.width, pixels.height);
        pixels = this.fromPixels2DContext.canvas;
      }
    }
    const tempPixelHandle = this.makeTensorHandle(texShape, 'int32');
    // This is a byte texture with pixels.
    this.texData.get(tempPixelHandle.dataId).usage = TextureUsage.PIXELS;
    this.gpgpu.uploadPixelDataToTexture(
        this.getTexture(tempPixelHandle.dataId), pixels as ImageData);
    const program = new FromPixelsProgram(outShape);
    const res = this.compileAndRun(program, [tempPixelHandle]);

    this.disposeData(tempPixelHandle.dataId);

    return res as Tensor3D;
  }

  private makeTensorHandle(shape: number[], dtype: DataType): TensorHandle {
    const dataId = {};
    this.register(dataId, shape, dtype);
    return {dataId, shape, dtype};
  }

  write(dataId: DataId, values: DataValues): void {
    if (values == null) {
      throw new Error('MathBackendWebGL.write(): values can not be null');
    }

    if (ENV.getBool('DEBUG')) {
      for (let i = 0; i < values.length; i++) {
        const num = values[i] as number;
        if (!webgl_util.canBeRepresented(num)) {
          throw Error(`The value ${num} cannot be represented on this device.`);
        }
      }
    }

    const texData = this.texData.get(dataId);
    const {dtype} = texData;
    if (dtype === 'complex64') {
      throw new Error(
          `Cannot write to a complex64 dtype. ` +
          `Please use tf.complex(real, imag).`);
    }

    this.releaseGPUData(dataId);
    texData.usage = TextureUsage.UPLOAD;
    texData.values = values;
  }
  readSync(dataId: DataId): DataValues {
    const texData = this.texData.get(dataId);
    const {values, dtype, complexTensors, slice, shape} = texData;
    if (slice != null) {
      const program = new UnaryOpProgram(shape, unary_op.CLONE);
      const res = this.compileAndRun(program, [{dataId, shape, dtype}]);
      const data = this.readSync(res.dataId);
      (res as Tensor).dispose();
      return data;
    }
    if (values != null) {
      return this.convertAndCacheOnCPU(dataId);
    }
    if (dtype === 'string') {
      return values;
    }

    let result: Float32Array;
    if (dtype === 'complex64') {
      const realValues = complexTensors.real.dataSync() as Float32Array;
      const imagValues = complexTensors.imag.dataSync() as Float32Array;
      result = mergeRealAndImagArrays(realValues, imagValues);
    } else {
      result = this.getValuesFromTexture(dataId);
    }

    return this.convertAndCacheOnCPU(dataId, result);
  }

  async read(dataId: DataId): Promise<DataValues> {
    if (this.pendingRead.has(dataId)) {
      const subscribers = this.pendingRead.get(dataId);
      return new Promise<TypedArray>(resolve => subscribers.push(resolve));
    }
    const texData = this.texData.get(dataId);
    const {texture, values, texShape, isPacked, shape, slice, dtype} = texData;

    if (slice != null) {
      const program = new UnaryOpProgram(shape, unary_op.CLONE);
      const res = this.compileAndRun(program, [{dataId, shape, dtype}]);
      const data = this.read(res.dataId);
      (res as Tensor).dispose();
      return data;
    }

    if (values != null) {
      return this.convertAndCacheOnCPU(dataId);
    }

    this.pendingRead.set(dataId, []);

    if (!ENV.getBool('WEBGL_DOWNLOAD_FLOAT_ENABLED') &&
        ENV.getNumber('WEBGL_VERSION') === 2) {
      throw new Error(
          `tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and ` +
          `WEBGL_VERSION=2 not yet supported.`);
    }

    // Possibly copy the texture into a buffer before inserting a fence.
    let width = texShape[1];
    let height = texShape[0];
    if (isPacked) {
      [width, height] = tex_util.getPackedMatrixTextureShapeWidthHeight(
          texShape[0], texShape[1]);
    }
    const bufferOrTexture =
        this.gpgpu.maybeCreateBufferFromTexture(texture, height, width);

    // Create a fence and wait for it to resolve.
    await this.gpgpu.createAndWaitForFence();

    // Download the values from the GPU.
    let vals: Float32Array;
    if (bufferOrTexture instanceof WebGLTexture) {
      vals = this.getValuesFromTexture(dataId);
    } else {
      const size = util.sizeFromShape(shape);
      if (isPacked) {
        const batch = webgl_util.getBatchDim(shape);
        let rows = 1, cols = 1;
        if (shape.length) {
          [rows, cols] = webgl_util.getRowsCols(shape);
        }
        vals = this.gpgpu
                   .downloadPackedMatrixFromBuffer(
                       bufferOrTexture, batch, rows, cols, texShape[0],
                       texShape[1])
                   .subarray(0, size);
      } else {
        vals = this.gpgpu
                   .downloadFloat32MatrixFromBuffer(
                       bufferOrTexture, texShape[0], texShape[1])
                   .subarray(0, size);
      }
    }
    const dTypeVals = this.convertAndCacheOnCPU(dataId, vals);

    const subscribers = this.pendingRead.get(dataId);
    this.pendingRead.delete(dataId);

    // Notify all pending reads.
    subscribers.forEach(resolve => resolve(dTypeVals));
    if (this.pendingDisposal.has(dataId)) {
      this.pendingDisposal.delete(dataId);
      this.disposeData(dataId);
    }
    return dTypeVals;
  }

  private getValuesFromTexture(dataId: DataId): Float32Array {
    const {shape, dtype, texture, texShape} = this.texData.get(dataId);
    const size = util.sizeFromShape(shape);
    if (ENV.getBool('WEBGL_DOWNLOAD_FLOAT_ENABLED')) {
      if (this.texData.get(dataId).isPacked) {
        const batch = webgl_util.getBatchDim(shape);
        let rows = 1, cols = 1;
        if (shape.length) {
          [rows, cols] = webgl_util.getRowsCols(shape);
        }
        return this.gpgpu
            .downloadMatrixFromPackedTexture(
                texture, batch, rows, cols, texShape[0], texShape[1])
            .subarray(0, size);
      } else {
        return this.gpgpu
            .downloadFloat32MatrixFromOutputTexture(
                texture, texShape[0], texShape[1])
            .subarray(0, size);
      }
    }

    const tmpTarget = this.makeTensorHandle(shape, 'float32') as TensorHandle &
        {size: number};
    tmpTarget.size = sizeFromShape(shape);
    this.texData.get(tmpTarget.dataId).usage = TextureUsage.DOWNLOAD;
    const output = tidy(() => {
      const program = new EncodeFloatProgram(shape);
      return this.compileAndRun(
          program, [{shape, dtype, dataId}], tmpTarget, null);
    });
    const tmpData = this.texData.get(output.dataId);
    const vals =
        this.gpgpu
            .downloadByteEncodedFloatMatrixFromOutputTexture(
                tmpData.texture, tmpData.texShape[0], tmpData.texShape[1])
            .subarray(0, size);
    this.disposeData(tmpTarget.dataId);

    return vals;
  }

  memory(): WebGLMemoryInfo {
    return {unreliable: false, numBytesInGPU: this.numBytesInGPU} as
        WebGLMemoryInfo;
  }

  private startTimer(): WebGLQuery|CPUTimerQuery {
    if (ENV.getNumber('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
      return this.gpgpu.beginQuery();
    }
    return {startMs: performance.now(), endMs: null};
  }

  private endTimer(query: WebGLQuery|CPUTimerQuery): WebGLQuery|CPUTimerQuery {
    if (ENV.getNumber('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
      this.gpgpu.endQuery();
      return query;
    }
    (query as CPUTimerQuery).endMs = performance.now();
    return query;
  }

  private async getQueryTime(query: WebGLQuery|CPUTimerQuery): Promise<number> {
    if (ENV.getNumber('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
      return this.gpgpu.waitForQueryAndGetTime(query as WebGLQuery);
    }
    const timerQuery = query as CPUTimerQuery;
    return timerQuery.endMs - timerQuery.startMs;
  }

  disposeData(dataId: DataId): void {
    if (this.pendingDisposal.has(dataId)) {
      return;
    }
    if (this.pendingRead.has(dataId)) {
      this.pendingDisposal.add(dataId);
      return;
    }
    // No-op if already disposed.
    if (!this.texData.has(dataId)) {
      return;
    }
    this.releaseGPUData(dataId);
    const {complexTensors} = this.texData.get(dataId);
    if (complexTensors != null) {
      complexTensors.real.dispose();
      complexTensors.imag.dispose();
    }
    this.texData.delete(dataId);
  }

  private releaseGPUData(dataId: DataId): void {
    const {texture, dtype, texShape, usage, isPacked, slice} =
        this.texData.get(dataId);
    const key = slice && slice.origDataId || dataId;
    const refCount = this.dataRefCount.get(key);
    if (refCount > 1) {
      this.dataRefCount.set(key, refCount - 1);
    } else {
      this.dataRefCount.delete(key);
      if (texture != null) {
        this.numBytesInGPU -= this.computeBytes(texShape, dtype);
        this.textureManager.releaseTexture(texture, texShape, usage, isPacked);
      }
    }
    const texData = this.texData.get(dataId);
    texData.texture = null;
    texData.texShape = null;
    texData.isPacked = false;
    texData.slice = null;
  }

  getTexture(dataId: DataId): WebGLTexture {
    this.uploadToGPU(dataId);
    return this.texData.get(dataId).texture;
  }

  private getCPUBackend(): KernelBackend|null {
    if (!ENV.getBool('WEBGL_CPU_FORWARD')) {
      return null;
    }

    if (this.cpuBackend == null) {
      this.cpuBackend = ENGINE.findBackend('cpu');
    }

    return this.cpuBackend;
  }

  /*
  Tests whether all the inputs to an op are small and on the CPU. This heuristic
  determines when it would be faster to execute a kernel on the CPU. WebGL
  kernels opt into running this check and forwarding when appropriate.
  TODO(https://github.com/tensorflow/tfjs/issues/872): Develop a more
  sustainable strategy for optimizing backend execution of ops.
   */
  private shouldExecuteOnCPU(
      inputs: Tensor[], sizeThreshold = CPU_HANDOFF_SIZE_THRESHOLD): boolean {
    return this.getCPUBackend() != null &&
        inputs.every(
            input => this.texData.get(input.dataId).texture == null &&
                input.size < sizeThreshold);
  }

  getGPGPUContext(): GPGPUContext {
    return this.gpgpu;
  }
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  slice<T extends Tensor>(x: T, begin: number[], size: number[]): T {
    if (this.shouldExecuteOnCPU([x])) {
      return this.cpuBackend.slice(x, begin, size);
    }
    const {isPacked} = this.texData.get(x.dataId);
    const isContinous = isSliceContinous(x.shape, begin, size);
    if (isPacked || !isContinous) {
      const program = new SlicePackedProgram(size);
      const customSetup = program.getCustomSetupFunc(begin);
      return this.compileAndRun(program, [x], null, customSetup);
    }
    this.uploadToGPU(x.dataId);
    return this.shallowSlice(x, begin, size) as T;
  }

  private shallowSlice(x: Tensor, begin: number[], size: number[]): Tensor {
    const xTexData = this.texData.get(x.dataId);
    const t = Tensor.make(size, {}, x.dtype, this);
    const newTexData = this.texData.get(t.dataId);
    // Copy texture data from the original tensor.
    Object.assign(newTexData, xTexData);
    newTexData.shape = size;
    newTexData.dtype = x.dtype;
    let flatOffset = computeFlatOffset(begin, x.strides);
    if (xTexData.slice) {
      // We are slicing an already sliced tensor, so we have to accumulate
      // the offset.
      flatOffset += xTexData.slice.flatOffset;
    }
    newTexData.slice = {
      flatOffset,
      // Point to the original dataId, which is used to do ref counting.
      origDataId: xTexData.slice && xTexData.slice.origDataId || x.dataId
    };

    // Increase the ref count for that data bucket.
    const refCount = this.dataRefCount.get(newTexData.slice.origDataId) || 1;
    this.dataRefCount.set(newTexData.slice.origDataId, refCount + 1);

    return t;
  }

  batchMatMul(
      a: Tensor3D, b: Tensor3D, transposeA: boolean,
      transposeB: boolean): Tensor3D {
    const outerShapeA = transposeA ? a.shape[2] : a.shape[1];
    const outerShapeB = transposeB ? b.shape[1] : b.shape[2];
    const sharedDim = transposeA ? a.shape[1] : a.shape[2];
    const [batch, , ] = a.shape;

    // Since the matrices are vectors, it is faster to call mul().sum()
    // because sum() is O(sqrt(N)) due to divide-and-conquer.
    if ((outerShapeA === 1 || outerShapeB === 1) &&
        sharedDim > MATMUL_SHARED_DIM_THRESHOLD) {
      if (transposeA) {
        a = a.transpose([0, 2, 1]);
      }
      if (transposeB) {
        b = b.transpose([0, 2, 1]);
      }

      const a3D = outerShapeB === 1 ? a : a.as3D(batch, sharedDim, 1);
      const axis = outerShapeB === 1 ? 2 : 1;
      const b3D = outerShapeB === 1 ? b.as3D(batch, 1, sharedDim) : b;
      return this.multiply(a3D, b3D).sum(axis, true /* keepDims */);
    }

    const dtype = upcastType(a.dtype, b.dtype);

    const program = new MatMulPackedProgram(
        a.shape, [batch, outerShapeA, outerShapeB], transposeA, transposeB);
    const output =
        this.makePackedTensor(program.outputShape, dtype) as Tensor3D;
    return this.compileAndRun<Tensor3D>(program, [a, b], output);
  }

  multiply(a: Tensor, b: Tensor): Tensor {
    if (a.dtype === 'complex64') {
      const aData = this.texData.get(a.dataId);
      const bData = this.texData.get(b.dataId);

      const realProgram = new BinaryOpComplexProgram(
          binaryop_complex_gpu.COMPLEX_MULTIPLY.REAL, a.shape, b.shape);
      const imagProgram = new BinaryOpComplexProgram(
          binaryop_complex_gpu.COMPLEX_MULTIPLY.IMAG, a.shape, b.shape);

      const inputs = [
        this.makeComplexComponentTensorHandle(a, aData.complexTensors.real),
        this.makeComplexComponentTensorHandle(a, aData.complexTensors.imag),
        this.makeComplexComponentTensorHandle(b, bData.complexTensors.real),
        this.makeComplexComponentTensorHandle(b, bData.complexTensors.imag)
      ];
      const real = this.compileAndRun<Tensor>(realProgram, inputs);
      const imag = this.compileAndRun<Tensor>(imagProgram, inputs);

      const complex = this.complex(real, imag);
      real.dispose();
      imag.dispose();
      return complex;
    }

    if (this.shouldExecuteOnCPU([a, b])) {
      return this.cpuBackend.multiply(a, b);
    }
    return this.packedBinaryOp(a, b, binaryop_gpu.MUL, a.dtype);
  }

  batchNormalization(
      x: Tensor4D, mean: Tensor4D|Tensor1D, variance: Tensor4D|Tensor1D,
      varianceEpsilon: number, scale?: Tensor4D|Tensor1D,
      offset?: Tensor4D|Tensor1D): Tensor4D {
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

    const batchNormPackedProgram = new BatchNormPackedProgram(
        x.shape, mean.shape, variance.shape, offsetShape, scaleShape,
        varianceEpsilon);
    return this.compileAndRun<Tensor4D>(batchNormPackedProgram, inputs);
  }

  transpose<T extends Tensor>(x: T, perm: number[]): T {
    if (this.shouldExecuteOnCPU([x])) {
      return this.cpuBackend.transpose(x, perm);
    }
    const program = new TransposePackedProgram(x.shape, perm);
    return this.compileAndRun(program, [x]);
  }

  private reduce(
      x: Tensor2D, reduceType: 'all'|'any'|'max'|'min'|'sum'|'prod',
      dtype: DataType): Tensor2D {
    const batchSize = x.shape[0];
    const inSize = x.shape[1];
    const windowSize = reduce_util.computeOptimalWindowSize(inSize);
    const reduceInfo = {windowSize, inSize, batchSize};
    const program = new ReduceProgram(reduceInfo, reduceType);
    const [rows, cols] = program.outputShape;
    const output = this.makeOutputArray<Tensor2D>([rows, cols], dtype);

    this.compileAndRun(program, [x], output);
    // No need to run another GPGPU program.
    if (output.shape[1] === 1) {
      return output;
    }
    return this.reduce(output, reduceType, dtype);
  }

  sum(x: Tensor, axes: number[]): Tensor {
    axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    const outputDType = sumOutType(x.dtype);
    return this.reduce(a2D, 'sum', outputDType).reshape(outShape);
  }

  minimum(a: Tensor, b: Tensor): Tensor {
    if (this.shouldExecuteOnCPU([a, b])) {
      return this.cpuBackend.minimum(a, b);
    }

    const program =
        new BinaryOpPackedProgram(binaryop_packed_gpu.MIN, a.shape, b.shape);
    return this.compileAndRun(program, [a, b]);
  }

  max(x: Tensor, axes: number[]): Tensor {
    if (this.shouldExecuteOnCPU([x])) {
      return this.cpuBackend.max(x, axes);
    }

    axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
    const [outShape, reduceShape] =
        axis_util.computeOutAndReduceShapes(x.shape, axes);
    const inSize = util.sizeFromShape(reduceShape);
    const a2D = x.as2D(-1, inSize);
    return this.reduce(a2D, 'max', a2D.dtype).reshape(outShape);
  }

  realDivide(a: Tensor, b: Tensor): Tensor {
    const outputDtype = 'float32';
    const checkOutOfBounds = true;
    return this.packedBinaryOp(
        a, b, binaryop_packed_gpu.DIV, outputDtype, checkOutOfBounds);
  }
  add(a: Tensor, b: Tensor): Tensor {
    if (a.dtype === 'complex64' && b.dtype === 'complex64') {
      return this.complexSeparableBinaryOp(a, b, binaryop_gpu.ADD);
    }

    if (this.shouldExecuteOnCPU([a, b])) {
      return this.cpuBackend.add(a, b);
    }

    const dtype = upcastType(a.dtype, b.dtype);
    return this.packedBinaryOp(a, b, binaryop_gpu.ADD, dtype);
  }

  private packedBinaryOp(
      a: TensorHandle, b: TensorHandle, op: string, dtype: DataType,
      checkOutOfBounds = false) {
    const program =
        new BinaryOpPackedProgram(op, a.shape, b.shape, checkOutOfBounds);
    const output = this.makePackedTensor(program.outputShape, dtype) as Tensor;
    return this.compileAndRun<Tensor>(program, [a, b], output);
  }

  /**
   * Computes a complex binary operation that can be decomposed into a simple
   * binary operation on both the real and imagary parts.
   */
  private complexSeparableBinaryOp(a: Tensor, b: Tensor, op: string): Tensor {
    const aData = this.texData.get(a.dataId);
    const bData = this.texData.get(b.dataId);

    const [real, imag] = [
      [aData.complexTensors.real, bData.complexTensors.real],
      [aData.complexTensors.imag, bData.complexTensors.imag]
    ].map(complexParts => {
      const [aPart, bPart] = complexParts;

      const aHandle = this.makeComplexComponentTensorHandle(a, aPart);
      const bHandle = this.makeComplexComponentTensorHandle(b, bPart);

      const program = new BinaryOpProgram(op, a.shape, b.shape);
      const output = this.makeOutputArray(
                         program.outputShape,
                         upcastType(aPart.dtype, bPart.dtype)) as Tensor;

      return this.compileAndRun<Tensor>(program, [aHandle, bHandle], output);
    });

    const complex = this.complex(real, imag);
    real.dispose();
    imag.dispose();
    return complex;
  }

  // Returns a TensorHandle with the complex shape and the dataId of the
  // underlying part. We need to do this because a reshaped complex tensor is
  // not reflected in its parts.
  private makeComplexComponentTensorHandle(
      complexTensor: Tensor, complexPart: Tensor): TensorHandle {
    return {
      dataId: complexPart.dataId,
      dtype: complexPart.dtype,
      shape: complexTensor.shape
    };
  }

  subtract(a: Tensor, b: Tensor): Tensor {
    if (a.dtype === 'complex64' && b.dtype === 'complex64') {
      return this.complexSeparableBinaryOp(a, b, binaryop_gpu.SUB);
    }

    if (this.shouldExecuteOnCPU([a, b])) {
      return this.cpuBackend.subtract(a, b);
    }
    return this.packedBinaryOp(a, b, binaryop_gpu.SUB, a.dtype);
  }

  exp<T extends Tensor>(x: T): T {
    let program: UnaryOpProgram|UnaryOpPackedProgram;
    program = new UnaryOpPackedProgram(x.shape, unary_op.EXP);
    return this.compileAndRun(program, [x]) as T;
  }

  log<T extends Tensor>(x: T): T {
    let program: UnaryOpProgram|UnaryOpPackedProgram;
    program = new UnaryOpPackedProgram(x.shape, unary_packed_op.LOG);
    return this.compileAndRun(program, [x]) as T;
  }

  relu<T extends Tensor>(x: T): T {
    let program: UnaryOpProgram|UnaryOpPackedProgram;
    program = new UnaryOpPackedProgram(x.shape, unary_packed_op.RELU);
    return this.compileAndRun(program, [x]) as T;
  }

  conv2dByMatMul(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo):
      Tensor4D {
    // Reshapes conv2D input to 2D tensors, uses matMul and then reshape the
    // result from 2D to 4D.
    const xShape = x.shape;
    const xTexData = this.texData.get(x.dataId);
    const sharedMatMulDim = convInfo.inChannels;
    const outerShapeX = xShape[0] * xShape[1] * xShape[2];
    const outerShapeFilter = convInfo.outChannels;

    // TODO: Once reduction ops are packed, batchMatMul will always be packed
    // and we can remove this condition.
    const batchMatMulWillBeUnpacked =
        (outerShapeX === 1 || outerShapeFilter === 1) &&
        sharedMatMulDim > MATMUL_SHARED_DIM_THRESHOLD;
    const reshapeWillBeExpensive = xShape[2] % 2 !== 0 && !!xTexData.isPacked;

    if (batchMatMulWillBeUnpacked || !ENV.getBool('WEBGL_LAZILY_UNPACK') ||
        !ENV.getBool('WEBGL_PACK_BINARY_OPERATIONS') ||
        !reshapeWillBeExpensive) {
      const xReshaped =
          this.reshape(
              x, [1, xShape[0] * xShape[1] * xShape[2], convInfo.inChannels]) as
          Tensor3D;
      const filterReshaped =
          this.reshape(
              filter, [1, convInfo.inChannels, convInfo.outChannels]) as
          Tensor3D;
      return this.reshape<Rank.R4>(
          this.batchMatMul(xReshaped, filterReshaped, false, false),
          convInfo.outShape);
    }

    // Following optimization is specific to packed |x| with odd row count
    // ('row count' refers to x.shape[2]): we avoid expensive packed 2x2
    // reshape by padding row count to next, even number. When x.shape[2] is
    // odd, the result of packed batchMatMul is the same (has the same texture
    // layout and and values in the texture) as it is for even x.shape[2] + 1.
    // We make the odd-rows tensor to look like even-rows tensor before the
    // operation and, after the batchMatMul, fix the even-rows result to have
    // odd number of rows.
    const xReshaped =
        Tensor.make(
            [1, xShape[0] * xShape[1] * (xShape[2] + 1), convInfo.inChannels],
            {dataId: x.dataId}, x.dtype, this) as Tensor3D;

    // xTexData.shape gets referenced from GPGPUBinary.inShapeInfos.
    // Decrementing row count, after batchMatMul->...->compileProgram leads to
    // invalid row count within the reference in GPGPUBinary.inShapeInfos.
    // Alternative fix would be to provide a copy to GPGPUBinary.inShapeInfos
    // in compileProgram method, but that would affect compilation of all
    // programs - instead, provide a copy here, with even row count, before
    // calling batchMatMul->...->compileProgram and after that, the original
    // xTexData.shape is restored.
    const originalXTexDataShape = xTexData.shape;
    xTexData.shape = xTexData.shape.slice();
    xTexData.shape[xTexData.shape.length - 2]++;
    util.assert(
        webgl_util.isReshapeFree(xTexData.shape, xReshaped.shape),
        () => `packed reshape ${xTexData.shape} to ${
            xReshaped.shape} isn't free`);
    const filterReshaped =
        this.reshape(filter, [1, convInfo.inChannels, convInfo.outChannels]) as
        Tensor3D;

    const pointwiseConv =
        this.batchMatMul(xReshaped, filterReshaped, false, false);
    const pointwiseConvTexData = this.texData.get(pointwiseConv.dataId);
    util.assert(
        pointwiseConvTexData.isPacked,
        () => 'batchMatMul result is expected to be packed');
    // Restore the input shape to original.
    xTexData.shape = originalXTexDataShape;
    // Set the output shape - there is no need for expensive reshape as data
    // layout is already correct.
    pointwiseConvTexData.shape = convInfo.outShape;
    return Tensor.make(
               convInfo.outShape, {dataId: pointwiseConv.dataId},
               pointwiseConv.dtype, this) as Tensor4D;
  }

  conv2dWithIm2Row(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo):
      Tensor4D {
    // Rearranges conv2d input so each block to be convolved over forms the
    // column of a new matrix with shape [filterWidth * filterHeight *
    // inChannels, outHeight * outWidth]. The filter is also rearranged so each
    // output channel forms a row of a new matrix with shape [outChannels,
    // filterWidth * filterHeight * inChannels]. The convolution is then
    // computed by multiplying these matrices and reshaping the result.
    const {
      filterWidth,
      filterHeight,
      inChannels,
      outWidth,
      outHeight,
    } = convInfo;

    const sharedDim = filterWidth * filterHeight * inChannels;
    const numCols = outHeight * outWidth;
    const x2ColShape = [sharedDim, numCols];

    const xSqueezed = x.squeeze([0]);
    const w2Row = filter.reshape([1, sharedDim, -1]) as Tensor3D;

    const im2ColProgram =
        new Im2ColPackedProgram(x2ColShape, xSqueezed.shape, convInfo);
    const im2Col =
        this.compileAndRun<Tensor2D>(im2ColProgram, [xSqueezed]).reshape([
          1, x2ColShape[0], x2ColShape[1]
        ]) as Tensor3D;

    const matmulProgram = new MatMulPackedProgram(
        im2Col.shape, [1, numCols, convInfo.outChannels], true, false);
    const product =
        this.compileAndRun<Tensor4D>(matmulProgram, [im2Col, w2Row]);

    return product.reshape([1, outHeight, outWidth, convInfo.outChannels]);
  }

  conv2d(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D {
    if (convInfo.filterHeight === 1 && convInfo.filterWidth === 1 &&
        convInfo.dilationHeight === 1 && convInfo.dilationWidth === 1 &&
        convInfo.strideHeight === 1 && convInfo.strideWidth === 1 &&
        (convInfo.padInfo.type === 'SAME' ||
         convInfo.padInfo.type === 'VALID')) {
      return this.conv2dByMatMul(x, filter, convInfo);
    }
    if (ENV.getBool('WEBGL_CONV_IM2COL') && x.shape[0] === 1) {
      return this.conv2dWithIm2Row(x, filter, convInfo);
    }
    const program = new Conv2DProgram(convInfo);
    return this.compileAndRun(program, [x, filter]);
  }

  depthwiseConv2D(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo):
      Tensor4D {
    let program: DepthwiseConv2DProgram|DepthwiseConvPacked2DProgram;
    if (ENV.getBool('WEBGL_PACK_DEPTHWISECONV') && convInfo.strideWidth <= 2 &&
        convInfo.outChannels / convInfo.inChannels === 1) {
      program = new DepthwiseConvPacked2DProgram(convInfo);
      return this.compileAndRun(
          program, [x, filter],
          this.makePackedTensor(convInfo.outShape, x.dtype));
    }

    throw new Error('cant');
    // program = new DepthwiseConv2DProgram(convInfo);
    // return this.compileAndRun(program, [x, filter]);
  }

  cast<T extends Tensor>(x: T, dtype: DataType): T {
    return backend_util.castTensor(x, dtype, this);
  }

  reshape<R extends Rank>(x: Tensor, shape: ShapeMap[R]): Tensor<R> {
    const texData = this.texData.get(x.dataId);
    if (texData.isPacked && !webgl_util.isReshapeFree(x.shape, shape) &&
        !(texData.texture !== null &&
          webgl_util.isReshapeFree(texData.shape, shape))) {
      return this.packedReshape(x, shape);
    }
    return backend_util.reshapeTensor(x, shape);
  }

  private makeOutputArray<T extends Tensor>(shape: number[], dtype: DataType):
      T {
    return Tensor.make(shape, {}, dtype, this) as T;
  }

  private makePackedTensor<T extends Tensor, D extends DataType = 'float32'>(
      shape: number[], dtype?: D): T {
    const packedTensor = Tensor.make(shape, {}, dtype, this);
    this.texData.get(packedTensor.dataId).isPacked = true;
    return packedTensor as T;
  }

  private unpackTensor<T extends Tensor>(input: T|TensorHandle): T {
    const program = new UnpackProgram(input.shape);
    return this.compileAndRun(
        program, [input],
        Tensor.make(program.outputShape, {}, input.dtype, this));
  }

  private packTensor<T extends Tensor>(input: T|TensorHandle): T {
    const program = new PackProgram(input.shape);
    return this.compileAndRun(
        program, [input], this.makePackedTensor(input.shape, input.dtype));
  }

  private packedReshape<R extends Rank>(input: Tensor, afterShape: ShapeMap[R]):
      Tensor<R> {
    const inputAs3D = input.reshape([
      webgl_util.getBatchDim(input.shape),
      ...webgl_util.getRowsCols(input.shape)
    ]);
    const afterShapeAs3D = [
      webgl_util.getBatchDim(afterShape), ...webgl_util.getRowsCols(afterShape)
    ];
    const program = new ReshapePackedProgram(
        afterShapeAs3D as [number, number, number],
        inputAs3D.shape as [number, number, number]);
    return this.compileAndRun<Tensor<R>>(program, [inputAs3D])
        .reshape(afterShape);
  }

  public compileAndRun<
      K extends {dtype: DataType, size: number, dataId: {}, shape: number[]}>(
      program: GPGPUProgram, inputs: TensorHandle[], output?: K,
      customSetup?: (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void):
      K {
    if (output == null) {
      if (program.usesPackedTextures) {
        output = this.makePackedTensor(program.outputShape, inputs[0].dtype) as
            {} as K;
      } else {
        output = this.makeOutputArray(program.outputShape, inputs[0].dtype) as
            {} as K;
      }
    }
    if (output.size === 0) {
      // Short-circuit the computation since the result is empty (has 0 in its
      // shape).
      this.texData.get(output.dataId).values =
          getTypedArrayFromDType(output.dtype as 'float32', 0);
      return output;
    }

    const inputsData: TensorData[] = inputs.map(input => {
      if (input.dtype === 'complex64') {
        throw new Error(
            `GPGPUProgram does not support complex64 input. For complex64 ` +
            `dtypes, please separate the program into real and imaginary ` +
            `parts.`);
      }

      let texData = this.texData.get(input.dataId);

      if (texData.texture == null) {
        if (!program.usesPackedTextures &&
            util.sizeFromShape(input.shape) <=
                ENV.getNumber('WEBGL_SIZE_UPLOAD_UNIFORM')) {
          // Upload small tensors that live on the CPU as uniforms, not as
          // textures. Do this only when the environment supports 32bit floats
          // due to problems when comparing 16bit floats with 32bit floats.
          // TODO(https://github.com/tensorflow/tfjs/issues/821): Make it
          // possible for packed shaders to sample from uniforms.
          return {
            shape: input.shape,
            texData: null,
            isUniform: true,
            uniformValues: this.readSync(input.dataId) as TypedArray
          };
        }

        // This ensures that if a packed program's inputs have not yet been
        // uploaded to the GPU, they get uploaded as packed right off the bat.
        if (program.usesPackedTextures) {
          texData.isPacked = true;
          texData.shape = input.shape;
        }
      } else if (!!texData.isPacked !== !!program.usesPackedTextures) {
        input = texData.isPacked ? this.unpackTensor(input) :
                                   this.packTensor(input);
        texData = this.texData.get(input.dataId);
      } else if (
          texData.isPacked &&
          !webgl_util.isReshapeFree(texData.shape, input.shape)) {
        // This is a special case where a texture exists for a tensor
        // but the shapes are incompatible (due to packing constraints) because
        // the tensor did not have a chance to go through the packed reshape
        // shader. This only happens when we reshape the *same* tensor to form
        // *distinct* inputs to an op, e.g. dotting a vector with itself. This
        // case will disappear once packed uploading is the default.

        const savedInput = input;
        const targetShape = input.shape;

        input.shape = texData.shape;
        input = this.packedReshape(input as Tensor, targetShape);
        texData = this.texData.get(input.dataId);

        savedInput.shape = targetShape;
      }

      this.uploadToGPU(input.dataId);
      return {shape: input.shape, texData, isUniform: false};
    });

    this.uploadToGPU(output.dataId);
    const outputData: TensorData = {
      shape: output.shape,
      texData: this.texData.get(output.dataId),
      isUniform: false
    };
    const key = gpgpu_math.makeShaderKey(program, inputsData, outputData);
    const binary = this.getAndSaveBinary(key, () => {
      return gpgpu_math.compileProgram(
          this.gpgpu, program, inputsData, outputData);
    });
    const shouldTimeProgram = this.activeTimers != null;
    let query: WebGLQuery|CPUTimerQuery;
    if (shouldTimeProgram) {
      query = this.startTimer();
    }

    gpgpu_math.runProgram(
        this.gpgpu, binary, inputsData, outputData, customSetup);

    if (shouldTimeProgram) {
      query = this.endTimer(query);
      this.activeTimers.push(
          {name: program.constructor.name, query: this.getQueryTime(query)});
    }

    if (!ENV.getBool('WEBGL_LAZILY_UNPACK') &&
        this.texData.get(output.dataId).isPacked && !program.isPackShader) {
      return this.unpackTensor(output as {} as Tensor) as {} as K;
    }
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

  private disposed = false;

  dispose() {
    if (this.disposed) {
      return;
    }
    this.textureManager.dispose();
    this.canvas.remove();
    if (this.fromPixels2DContext != null) {
      this.fromPixels2DContext.canvas.remove();
    }
    if (this.gpgpuCreatedLocally) {
      this.gpgpu.program = null;
      this.gpgpu.dispose();
    }
    this.disposed = true;
  }

  floatPrecision(): 16|32 {
    if (this.floatPrecisionValue == null) {
      this.floatPrecisionValue = tidy(() => {
        // Momentarily switching DEBUG flag to false so we don't throw an error
        // trying to upload a small value.
        const debugFlag = ENV.getBool('DEBUG');
        ENV.set('DEBUG', false);
        const underflowCheckValue = this.abs(scalar(1e-8)).dataSync()[0];
        ENV.set('DEBUG', debugFlag);

        if (underflowCheckValue > 0) {
          return 32;
        }
        return 16;
      });
    }
    return this.floatPrecisionValue;
  }
  /** Returns the smallest representable number.  */
  epsilon(): number {
    return this.floatPrecision() === 32 ? EPSILON_FLOAT32 : EPSILON_FLOAT16;
  }

  private uploadToGPU(dataId: DataId): void {
    const texData = this.texData.get(dataId);
    const {shape, dtype, values, texture, usage, isPacked} = texData;
    if (texture != null) {
      // Array is already on GPU. No-op.
      return;
    }

    const texShape =
        webgl_util.getTextureShapeFromLogicalShape(shape, isPacked);
    texData.texShape = texShape;
    const newTexture = this.acquireTexture(texShape, usage, dtype, isPacked);
    texData.texture = newTexture;
    if (values != null) {
      // TODO(smilkov): Propagate the original typed array to gpgpu.
      if (isPacked) {
        const batch = webgl_util.getBatchDim(shape);
        let rows = 1, cols = 1;
        if (shape.length) {
          [rows, cols] = webgl_util.getRowsCols(shape);
        }
        this.gpgpu.uploadMatrixToPackedTexture(
            newTexture, batch, rows, cols, texShape[0], texShape[1],
            typedArrayToFloat32(values as Float32Array));
      } else {
        this.gpgpu.uploadMatrixToTexture(
            newTexture, texShape[0], texShape[1],
            typedArrayToFloat32(values as Float32Array));
      }
      // Once uploaded, don't store the values on cpu.
      texData.values = null;
    }
  }

  private convertAndCacheOnCPU(dataId: DataId, float32Values?: Float32Array):
      TypedArray {
    const texData = this.texData.get(dataId);
    const {dtype} = texData;

    this.releaseGPUData(dataId);

    texData.usage = TextureUsage.UPLOAD;
    if (float32Values != null) {
      texData.values = float32ToTypedArray(float32Values, dtype as 'float32');
    }
    return texData.values as TypedArray;
  }

  private acquireTexture(
      texShape: [number, number], texType: TextureUsage, dtype: DataType,
      isPacked: boolean): WebGLTexture {
    this.numBytesInGPU += this.computeBytes(texShape, dtype);
    if (!this.warnedAboutMemory &&
        this.numBytesInGPU > this.numMBBeforeWarning * 1024 * 1024) {
      const mb = (this.numBytesInGPU / 1024 / 1024).toFixed(2);
      this.warnedAboutMemory = true;
      console.warn(
          `High memory usage in GPU: ${mb} MB, ` +
          `most likely due to a memory leak`);
    }
    return this.textureManager.acquireTexture(texShape, texType, isPacked);
  }

  private computeBytes(shape: [number, number], dtype: DataType) {
    return shape[0] * shape[1] * util.bytesPerElement(dtype);
  }
}

if (device_util.isBrowser()) {
  ENGINE.registerBackend(
      'webgl', () => new MathBackendWebGL(), 2 /* priority */);
}

function float32ToTypedArray<D extends NumericDataType>(
    a: Float32Array, dtype: D): DataTypeMap[D] {
  if (dtype === 'float32' || dtype === 'complex64') {
    return a;
  } else if (dtype === 'int32' || dtype === 'bool') {
    const result = (dtype === 'int32') ? new Int32Array(a.length) :
                                         new Uint8Array(a.length);
    for (let i = 0; i < result.length; ++i) {
      result[i] = Math.round(a[i]);
    }
    return result;
  } else {
    throw new Error(`Unknown dtype ${dtype}`);
  }
}

function typedArrayToFloat32(a: TypedArray): Float32Array {
  return (a instanceof Float32Array) ? a : new Float32Array(a);
}
