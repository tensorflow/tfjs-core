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

import * as device_util from './device_util';
import {doc} from './doc';
import {BackendTimingInfo, KernelBackend} from './kernels/backend';
import {TensorOps} from './ops/tensor_ops';
import {Profiler} from './profiler';
// tslint:disable-next-line:max-line-length
import {backpropagateGradients, getFilteredNodesXToY, NamedGradientMap, TapeNode} from './tape';
// tslint:disable-next-line:max-line-length
import {DataId, setTensorTracker, Tensor, Tensor3D, Variable} from './tensor';
// tslint:disable-next-line:max-line-length
import {NamedTensorMap, NamedVariableMap, TensorContainer, TypedArray} from './types';
import * as util from './util';
import {getTensorsInContainer} from './util';

interface ScopeState {
  track: Tensor[];
  name?: string;
}

/**
 * A function that computes an output. The save function is for saving tensors
 * computed in the forward pass, that we need in the backwards pass.
 */
export type ForwardFunc<T extends Tensor> =
    (backend: KernelBackend, save?: <S extends Tensor>(tensor: S) => S) => T;

/**
 * @docalias (a: Tensor, b: Tensor,...) => {
 *   value: Tensor,
 *   gradFunc: (dy: Tensor) => Tensor|Tensor[]
 * }
 */
export type CustomGradientFunc<T extends Tensor> = (...args: Tensor[]) => {
  value: T, gradFunc: (dy: T) => Tensor | Tensor[];
};

export interface TensorManager {
  registerTensor(a: Tensor): void;
  registerVariable(v: Variable): void;
  disposeTensor(a: Tensor): void;
  memory(): {numDataBuffers: number; numBytes: number;};
}

export type MemoryInfo = {
  numTensors: number; numDataBuffers: number; numBytes: number;
  unreliable?: boolean;
};

export interface TimingInfo extends BackendTimingInfo {
  wallMs: number;
}

export class Engine implements TensorManager {
  // Public since optimizers will use it.
  registeredVariables: NamedVariableMap = {};

  private refCounter = new WeakMap<DataId, number>();
  private nextTapeNodeId = 0;
  private numBytes = 0;
  private numTensors = 0;
  private numDataBuffers = 0;

  private activeTape: TapeNode[];
  private gradientScopeCount = 0;
  private customGradientDepth = 0;

  // Keep Tensors that parallel the tapes.
  private activeScope: ScopeState;
  private scopeStack: ScopeState[];
  private keepTensors: Set<number> = new Set();
  private profiler: Profiler;

  constructor(private backend: KernelBackend, public safeMode: boolean) {
    // Create a default outer scope.
    this.activeScope = {track: []};
    this.scopeStack = [this.activeScope];
    this.profiler = new Profiler(backend);
    setTensorTracker(this);
  }

  /**
   * Executes the provided function `fn` and after it is executed, cleans up all
   * intermediate tensors allocated by `fn` except those returned by `fn`.
   * `f` must not return a Promise (async functions not allowed).
   * The returned result can be a complex object, however tidy only walks the
   * top-level properties (depth 1) of that object to search for tensors, or
   * lists of tensors that need to be tracked in the parent scope.
   *
   * Using this method helps avoid memory leaks. In general, wrap calls to
   * operations in `tidy` for automatic memory cleanup.
   *
   * When in safe mode, you must enclose all `Tensor` creation and ops
   * inside a `tidy` to prevent memory leaks.
   *
   * ```js
   * // y = 2 ^ 2 + 1
   * const y = tf.tidy(() => {
   *   // a, b, and one will be cleaned up when the tidy ends.
   *   const one = tf.scalar(1);
   *   const a = tf.scalar(2);
   *   const b = a.square();
   *
   *   console.log('numTensors (in tidy): ' + tf.memory().numTensors);
   *
   *   // The value returned inside the tidy function will return
   *   // through the tidy, in this case to the variable y.
   *   return b.add(one);
   * });
   *
   * console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
   * y.print();
   * ```
   *
   * @param nameOrFn The name of the closure, or the function to execute.
   *     If a name is provided, the 2nd argument should be the function.
   *     If debug mode is on, the timing and the memory usage of the function
   *     will be tracked and displayed on the console using the provided name.
   * @param fn The function to execute.
   */
  @doc({heading: 'Performance', subheading: 'Memory'})
  static tidy<T extends TensorContainer>(
      nameOrFn: string|ScopeFn<T>, fn?: ScopeFn<T>, gradMode = false): T {
    return ENV.engine.tidy(nameOrFn, fn, gradMode);
  }

  tidy<T extends TensorContainer>(
      nameOrFn: string|ScopeFn<T>, fn?: ScopeFn<T>, gradMode = false): T {
    // gradMode Primarily for internal use during backprop
    //          If true, will start a tape if it is the outermost tidy.

    let name = null;
    if (fn == null) {
      // Called with only 1 argument.
      if (typeof nameOrFn !== 'function') {
        throw new Error('Please provide a function to tidy()');
      }
      fn = nameOrFn;
    } else {
      // Called with 2 arguments.
      if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
        throw new Error(
            'When calling with two arguments, the first argument ' +
            'to tidy() must be a string');
      }
      if (typeof fn !== 'function') {
        throw new Error(
            'When calling with two arguments, the 2nd argument ' +
            'to tidy() must be a function');
      }
      name = nameOrFn as string;
      // TODO(nsthorat,smilkov): Do operation logging and performance
      // profiling.
    }
    ENV.engine.startScope(name, gradMode);
    const result = fn();
    if (result instanceof Promise) {
      console.error('Cannot return a Promise inside of tidy.');
    }
    ENV.engine.endScope(result, gradMode);
    return result;
  }

  /**
   * Disposes any `Tensor`s found within the provided object.
   *
   * @param container an object that may be a `Tensor` or may directly contain
   *     `Tensor`s, such as a `Tensor[]` or `{key: Tensor, ...}`.  If the
   *     object is not a `Tensor` or does not contain `Tensors`, nothing
   *     happens. In general it is safe to pass any object here, except that
   *     `Promise`s are not supported.
   */
  @doc({heading: 'Performance', subheading: 'Memory'})
  static dispose(container: TensorContainer) {
    const tensors = getTensorsInContainer(container);
    tensors.forEach(tensor => tensor.dispose());
  }

  /**
   * Keeps a `Tensor` generated inside a `tidy` from being disposed
   * automatically.
   *
   * ```js
   * let b;
   * const y = tf.tidy(() => {
   *   const one = tf.scalar(1);
   *   const a = tf.scalar(2);
   *
   *   // b will not be cleaned up by the tidy. a and one will be cleaned up
   *   // when the tidy ends.
   *   b = tf.keep(a.square());
   *
   *   console.log('numTensors (in tidy): ' + tf.memory().numTensors);
   *
   *   // The value returned inside the tidy function will return
   *   // through the tidy, in this case to the variable y.
   *   return b.add(one);
   * });
   *
   * console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
   * console.log('y:');
   * y.print();
   * console.log('b:');
   * b.print();
   * ```
   *
   * @param result The tensor to keep from being disposed.
   */
  @doc({heading: 'Performance', subheading: 'Memory'})
  static keep<T extends Tensor>(result: T): T {
    return ENV.engine.keep(result);
  }

  /**
   * Executes `f()` and returns a promise that resolves with timing
   * information.
   *
   * The result is an object with the following properties:
   *
   * - `wallMs`: Wall execution time.
   * - `kernelMs`: Kernel execution time, ignoring data transfer.
   * - On `WebGL` The following additional properties exist:
   *   - `uploadWaitMs`: CPU blocking time on texture uploads.
   *   - `downloadWaitMs`: CPU blocking time on texture downloads (readPixels).
   *
   * ```js
   * const x = tf.randomNormal([20, 20]);
   * const time = await tf.time(() => x.matMul(x));
   *
   * console.log(`kernelMs: ${time.kernelMs}, wallTimeMs: ${time.wallMs}`);
   * ```
   *
   * @param f The function to execute and time.
   */
  @doc({heading: 'Performance', subheading: 'Timing'})
  static time(f: () => void): Promise<TimingInfo> {
    return ENV.engine.time(f);
  }

  runKernel<T extends Tensor, I extends NamedTensorMap>(
      forwardFunc: ForwardFunc<T>,
      inputs: I,
      backwardsFunc?: (dy: T, saved: Tensor[]) => {[P in keyof I]: () => I[P]},
      ): T {
    let result: T;
    const saved: Tensor[] = [];
    const saveFunc = <T extends Tensor>(x: T): T => {
      saved.push(x);
      return x;
    };
    const scopeName = this.activeScope.name;

    // Stop recording to a tape when running a kernel.
    this.customGradientDepth++;
    if (!ENV.get('DEBUG')) {
      result = forwardFunc(this.backend, saveFunc);
    } else {
      result = this.profiler.profileKernel(
          scopeName, () => forwardFunc(this.backend, saveFunc));
    }
    // Continue recording after the kernel is done.
    this.customGradientDepth--;

    if (this.shouldRecord()) {
      const tapeNode: TapeNode = {
        id: this.nextTapeNodeId++,
        name: scopeName,
        inputs,
        output: result,

      };
      if (backwardsFunc != null) {
        tapeNode.gradient = (dy: T) => backwardsFunc(dy, saved);
      }
      this.activeTape.push(tapeNode);
    }
    return result;
  }

  // TensorManager implementation.

  registerTensor(a: Tensor|Variable): void {
    const refCount =
        this.refCounter.has(a.dataId) ? this.refCounter.get(a.dataId) : 0;
    this.numTensors++;
    if (refCount === 0) {
      this.numDataBuffers++;
      this.numBytes +=
          util.sizeFromShape(a.shape) * util.bytesPerElement(a.dtype);
      this.backend.register(a.dataId, a.shape, a.dtype);
    }
    this.refCounter.set(a.dataId, refCount + 1);
    if (!(a instanceof Variable)) {
      this.track(a);
    }
  }

  registerVariable(v: Variable) {
    if (this.registeredVariables[v.name] != null) {
      throw new Error(`Variable with name ${v.name} was already registered`);
    }
    this.registeredVariables[v.name] = v;
  }

  disposeTensor(a: Tensor): void {
    if (!this.refCounter.has(a.dataId)) {
      return;
    }
    if (this.keepTensors.has(a.id)) {
      this.keepTensors.delete(a.id);
    }
    this.numTensors--;
    const refCount = this.refCounter.get(a.dataId);
    if (refCount <= 1) {
      this.refCounter.delete(a.dataId);
      this.backend.disposeData(a.dataId);
      this.numDataBuffers--;
      this.numBytes -=
          util.sizeFromShape(a.shape) * util.bytesPerElement(a.dtype);
    } else {
      this.refCounter.set(a.dataId, refCount - 1);
    }
    // TODO(nsthorat): Construct an error and save the stack trace for
    // debugging when in debug mode. Creating a stack trace is too expensive
    // to do unconditionally.
  }

  disposeVariables(): void {
    for (const varName in this.registeredVariables) {
      const v = this.registeredVariables[varName];
      this.disposeTensor(v);
      delete this.registeredVariables[varName];
    }
  }

  memory(): MemoryInfo {
    const info = this.backend.memory() as MemoryInfo;
    info.numTensors = this.numTensors;
    info.numDataBuffers = this.numDataBuffers;
    info.numBytes = this.numBytes;
    return info;
  }

  private shouldRecord(): boolean {
    return this.activeTape != null && this.customGradientDepth === 0;
  }

  private addTapeNode(
      inputs: Tensor[], result: Tensor,
      gradientsFunc: (dy: Tensor) => Tensor[]): void {
    const inputsMap: NamedTensorMap = {};
    inputs.forEach((input, idx) => {
      inputsMap[idx] = input;
    });

    const gradient = (dy: Tensor) => {
      const res = gradientsFunc(dy);
      const resMap: NamedGradientMap = {};
      res.forEach((r, idx) => {
        resMap[idx] = () => r;
      });
      return resMap;
    };

    const tapeNode: TapeNode = {
      id: this.nextTapeNodeId++,
      name: this.activeScope.name,
      inputs: inputsMap,
      output: result,
      gradient
    };
    this.activeTape.push(tapeNode);
  }

  keep<T extends Tensor>(result: T): T {
    if (this.scopeStack.length === 1 && ENV.engine.safeMode) {
      throw new Error(
          'Safe mode is ON. Enclose all tensor operations inside tf.tidy(): ' +
          'tf.tidy(() => {...}) to avoid memory leaks.');
    }
    this.keepTensors.add(result.id);
    return result;
  }

  /**
   * Start a scope. Use this with endScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  startScope(name?: string, gradientsMode = false) {
    if (gradientsMode && this.gradientScopeCount === 0) {
      this.activeTape = [];
    }
    if (gradientsMode) {
      this.gradientScopeCount++;
    }

    const scopeInfo: ScopeState = {track: []};
    if (name) {
      scopeInfo.name = name;
    }
    this.scopeStack.push(scopeInfo);
    this.activeScope = scopeInfo;
  }

  /**
   * End a scope. Use this with startScope() to achieve the same functionality
   * as scope() without the need for a function closure.
   */
  endScope(result: TensorContainer, gradientsMode = false) {
    if (gradientsMode) {
      this.gradientScopeCount--;
      if (this.gradientScopeCount === 0) {
        this.activeTape = null;
      }
    }

    const tensorsToKeep = new Set(this.keepTensors);

    const tensorsToTrackInParent = util.getTensorsInContainer(result);
    tensorsToTrackInParent.forEach(tensor => tensorsToKeep.add(tensor.id));

    // Dispose the arrays tracked in this scope.
    for (let i = 0; i < this.activeScope.track.length; i++) {
      const tensor = this.activeScope.track[i];
      if (tensorsToKeep.has(tensor.id)) {
        continue;
      }

      if (this.activeTape != null) {
        tensorsToTrackInParent.push(tensor);
      } else {
        tensor.dispose();
      }
    }

    const oldScope = this.scopeStack.pop();
    this.activeScope = this.scopeStack.length === 0 ?
        {track: []} :
        this.scopeStack[this.scopeStack.length - 1];

    // Track the current result in the parent scope.
    tensorsToTrackInParent.forEach(tensor => {
      // Only track the tensor if was allocated in the inner scope and is not
      // globally kept.
      if (!this.keepTensors.has(tensor.id) &&
          util.isTensorInList(tensor, oldScope.track)) {
        this.track(tensor);
      }
    });
  }

  /**
   * Returns gradients of `f` with respect to each of the `xs`. The gradients
   * returned are of the same length as `xs`, but some might be null if `f` was
   * not a function of that `x`. It also takes optional dy to multiply the
   * gradient, which defaults to `1`.
   */
  gradients<T extends Tensor>(
      f: () => T, xs: Tensor[], dy?: T,
      allowNoGradients = false): {value: T, grads: Tensor[]} {
    util.assert(xs.length > 0, 'gradients() received an empty list of xs.');

    return ENV.engine.tidy('gradients', () => {
      const y = f();
      util.assert(
          y instanceof Tensor,
          'The result y returned by f() must be a tensor.');
      // Filter out the nodes that don't connect x => y.
      const filteredTape = getFilteredNodesXToY(this.activeTape, xs, y);
      if (!allowNoGradients && filteredTape.length === 0 && xs.length > 0) {
        throw new Error(
            'Cannot compute gradient of y=f(x) with respect to x. Make sure ' +
            'that the f you passed encloses all operations that lead from x ' +
            'to y.');
      }

      const accumulatedGradientMap: {[tensorId: number]: Tensor} = {};
      accumulatedGradientMap[y.id] =
          (dy == null) ? TensorOps.ones(y.shape) : dy;

      // Backprop gradients through the filtered nodes.
      backpropagateGradients(accumulatedGradientMap, filteredTape);

      const grads = xs.map(x => accumulatedGradientMap[x.id]);
      return {value: y, grads};
    }, true /* gradientsMode */);
  }

  customGrad<T extends Tensor>(f: CustomGradientFunc<T>):
      (...args: Tensor[]) => T {
    util.assert(
        util.isFunction(f),
        'The f passed in customGrad(f) must be a function.');
    return (...inputs: Tensor[]): T => {
      util.assert(
          inputs.every(t => t instanceof Tensor),
          'The args passed in customGrad(f)(x1, x2,...) must all be tensors');
      this.customGradientDepth++;

      let gradientsFunc: (dy: T) => Tensor | Tensor[];
      const gradientsMode = true;
      const result = ENV.engine.tidy(f.name, () => {
        const {value, gradFunc} = f(...inputs);
        util.assert(
            value instanceof Tensor,
            'The function f passed in customGrad(f) must return an object ' +
                'where `obj.value` is a tensor');
        util.assert(
            util.isFunction(gradFunc),
            'The function f passed in customGrad(f) must return an object ' +
                'where `obj.gradFunc` is a function.');
        gradientsFunc = gradFunc;
        return value;
      }, gradientsMode);

      this.customGradientDepth--;

      if (this.shouldRecord()) {
        const gradFunc = (dy: T): Tensor[] => {
          const res = gradientsFunc(dy);
          const grads: Tensor[] = Array.isArray(res) ? res : [res];
          util.assert(
              grads.length === inputs.length,
              'The function f passed in customGrad(f) must return an object ' +
                  'where `obj.gradFunc` is a function that returns the same ' +
                  'number of tensors as inputs passed to f(...).');
          util.assert(
              grads.every(t => t instanceof Tensor),
              'The function f passed in customGrad(f) must return an object ' +
                  'where `obj.gradFunc` is a function that returns a list of ' +
                  'only tensors.');
          return grads;
        };
        this.addTapeNode(inputs, result, gradFunc);
      }
      return result;
    };
  }

  // Forwarding to backend.
  write(dataId: DataId, values: TypedArray): void {
    this.backend.write(dataId, values);
  }
  readSync(dataId: DataId): TypedArray {
    return this.backend.readSync(dataId);
  }
  read(dataId: DataId): Promise<TypedArray> {
    return this.backend.read(dataId);
  }
  fromPixels(
      pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement,
      numChannels: number): Tensor3D {
    return this.backend.fromPixels(pixels, numChannels);
  }
  async time(query: () => void): Promise<TimingInfo> {
    const start = performance.now();
    const timingInfo = await this.backend.time(query) as TimingInfo;
    timingInfo.wallMs = performance.now() - start;
    return timingInfo;
  }

  /**
   * Tracks a Tensor in the current scope to be automatically cleaned up
   * when the current scope ends, and returns the value.
   *
   * @param result The Tensor to track in the current scope.
   */
  private track<T extends Tensor>(result: T): T {
    if (this.scopeStack.length === 1 && this.safeMode) {
      throw new Error(
          'Safe mode is ON. Enclose all tensor operations inside tf.tidy(): ' +
          'tf.tidy(() => {op();...}); to avoid memory leaks.');
    }
    this.activeScope.track.push(result);
    return result;
  }
}

/** @docalias Function */
export type ScopeFn<T extends TensorContainer> = () => T;

export enum Type {
  NUMBER,
  BOOLEAN,
  STRING
}

export interface Features {
  // Whether to enable debug mode.
  'DEBUG'?: boolean;
  // Whether we are in a browser (as versus, say, node.js) environment.
  'IS_BROWSER'?: boolean;
  // Whether we are in the Node.js environment.
  'IS_NODE'?: boolean;
  // The disjoint_query_timer extension version.
  // 0: disabled, 1: EXT_disjoint_timer_query, 2:
  // EXT_disjoint_timer_query_webgl2.
  // In Firefox with WebGL 2.0,
  // EXT_disjoint_timer_query_webgl2 is not available, so we must use the
  // WebGL 1.0 extension.
  'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION'?: number;
  // Whether the timer object from the disjoint_query_timer extension gives
  // timing information that is reliable.
  'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'?: boolean;
  // 0: No WebGL, 1: WebGL 1.0, 2: WebGL 2.0.
  'WEBGL_VERSION'?: number;
  // Whether rendering to float32 textures is enabled. If disabled, renders to
  // float16 textures.
  'WEBGL_RENDER_FLOAT32_ENABLED'?: boolean;
  // Whether downloading float textures is enabled. If disabled, uses IEEE 754
  // encoding of the float32 values to 4 uint8 when downloading.
  'WEBGL_DOWNLOAD_FLOAT_ENABLED'?: boolean;
  // Whether WEBGL_get_buffer_sub_data_async is enabled.
  'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'?: boolean;
  'BACKEND'?: string;
  // Test precision for unit tests. This is decreased when we can't render
  // float32 textures.
  'TEST_EPSILON'?: number;
  'IS_CHROME'?: boolean;
}

export const URL_PROPERTIES: URLProperty[] = [
  {name: 'DEBUG', type: Type.BOOLEAN}, {name: 'IS_BROWSER', type: Type.BOOLEAN},
  {name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', type: Type.NUMBER},
  {name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', type: Type.BOOLEAN},
  {name: 'WEBGL_VERSION', type: Type.NUMBER},
  {name: 'WEBGL_RENDER_FLOAT32_ENABLED', type: Type.BOOLEAN},
  {name: 'WEBGL_DOWNLOAD_FLOAT_ENABLED', type: Type.BOOLEAN}, {
    name: 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED',
    type: Type.BOOLEAN
  },
  {name: 'BACKEND', type: Type.STRING}
];

export interface URLProperty {
  name: keyof Features;
  type: Type;
}

const TEST_EPSILON_FLOAT32_ENABLED = 1e-3;
const TEST_EPSILON_FLOAT32_DISABLED = 1e-1;

function hasExtension(gl: WebGLRenderingContext, extensionName: string) {
  const ext = gl.getExtension(extensionName);
  return ext != null;
}

function getWebGLRenderingContext(webGLVersion: number): WebGLRenderingContext {
  if (webGLVersion === 0 || !ENV.get('IS_BROWSER')) {
    throw new Error('Cannot get WebGL rendering context, WebGL is disabled.');
  }

  const tempCanvas = document.createElement('canvas');

  if (webGLVersion === 1) {
    return (tempCanvas.getContext('webgl') ||
            tempCanvas.getContext('experimental-webgl')) as
        WebGLRenderingContext;
  }
  return tempCanvas.getContext('webgl2') as WebGLRenderingContext;
}

function loseContext(gl: WebGLRenderingContext) {
  if (gl != null) {
    const loseContextExtension = gl.getExtension('WEBGL_lose_context');
    if (loseContextExtension == null) {
      throw new Error(
          'Extension WEBGL_lose_context not supported on this browser.');
    }
    loseContextExtension.loseContext();
  }
}

function isWebGLVersionEnabled(webGLVersion: 1|2) {
  let gl;
  try {
    gl = getWebGLRenderingContext(webGLVersion);
  } catch (e) {
    return false;
  }

  if (gl != null) {
    loseContext(gl);
    return true;
  }
  return false;
}

function getWebGLDisjointQueryTimerVersion(webGLVersion: number): number {
  if (webGLVersion === 0) {
    return 0;
  }

  let queryTimerVersion: number;
  const gl = getWebGLRenderingContext(webGLVersion);

  if (hasExtension(gl, 'EXT_disjoint_timer_query_webgl2') &&
      webGLVersion === 2) {
    queryTimerVersion = 2;
  } else if (hasExtension(gl, 'EXT_disjoint_timer_query')) {
    queryTimerVersion = 1;
  } else {
    queryTimerVersion = 0;
  }

  if (gl != null) {
    loseContext(gl);
  }
  return queryTimerVersion;
}

function createFloatTextureAndBindToFramebuffer(
    gl: WebGLRenderingContext, webGLVersion: number) {
  const frameBuffer = gl.createFramebuffer();
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  // tslint:disable-next-line:no-any
  const internalFormat = webGLVersion === 2 ? (gl as any).RGBA32F : gl.RGBA;
  gl.texImage2D(
      gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
}

function isRenderToFloatTextureEnabled(webGLVersion: number): boolean {
  if (webGLVersion === 0) {
    return false;
  }

  const gl = getWebGLRenderingContext(webGLVersion);

  if (webGLVersion === 1) {
    if (!hasExtension(gl, 'OES_texture_float')) {
      return false;
    }
  } else {
    if (!hasExtension(gl, 'EXT_color_buffer_float')) {
      return false;
    }
  }

  createFloatTextureAndBindToFramebuffer(gl, webGLVersion);

  const isFrameBufferComplete =
      gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

  loseContext(gl);
  return isFrameBufferComplete;
}

function isDownloadFloatTextureEnabled(webGLVersion: number): boolean {
  if (webGLVersion === 0) {
    return false;
  }

  const gl = getWebGLRenderingContext(webGLVersion);

  if (webGLVersion === 1) {
    if (!hasExtension(gl, 'OES_texture_float')) {
      return false;
    }
  } else {
    if (!hasExtension(gl, 'EXT_color_buffer_float')) {
      return false;
    }
  }

  createFloatTextureAndBindToFramebuffer(gl, webGLVersion);
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));

  const readPixelsNoError = gl.getError() === gl.NO_ERROR;

  loseContext(gl);

  return readPixelsNoError;
}

function isWebGLGetBufferSubDataAsyncExtensionEnabled(webGLVersion: number) {
  // TODO(nsthorat): Remove this once we fix
  // https://github.com/tensorflow/tfjs/issues/137
  if (webGLVersion > 0) {
    return false;
  }

  if (webGLVersion !== 2) {
    return false;
  }
  const gl = getWebGLRenderingContext(webGLVersion);

  const isEnabled = hasExtension(gl, 'WEBGL_get_buffer_sub_data_async');
  loseContext(gl);
  return isEnabled;
}

function isChrome() {
  return navigator != null && navigator.userAgent != null &&
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

export class Environment {
  private features: Features = {};
  private globalEngine: Engine;
  private registry:
      {[id: string]: {backend: KernelBackend, priority: number}} = {};
  private currentBackend: string;

  constructor(features?: Features) {
    if (features != null) {
      this.features = features;
    }

    if (this.get('DEBUG')) {
      console.warn(
          'Debugging mode is ON. The output of every math call will ' +
          'be downloaded to CPU and checked for NaNs. ' +
          'This significantly impacts performance.');
    }
  }

  /**
   * Sets the backend (cpu, webgl, etc) responsible for creating tensors and
   * executing operations on those tensors.
   *
   * Note this disposes the current backend, if any, as well as any tensors
   * associated with it.  A new backend is initialized, even if it is of the
   * same type as the previous one.
   *
   * @param backendType The backend type. Currently supports `'webgl'|'cpu'` in
   *     the browser, and `'tensorflow'` under node.js (requires tfjs-node).
   * @param safeMode Defaults to false. In safe mode, you are forced to
   *     construct tensors and call math operations inside a `tidy()` which
   *     will automatically clean up intermediate tensors.
   */
  @doc({heading: 'Environment'})
  static setBackend(backendType: string, safeMode = false) {
    if (!(backendType in ENV.registry)) {
      throw new Error(`Backend type '${backendType}' not found in registry`);
    }
    ENV.initBackend(backendType, safeMode);
  }

  /**
   * Returns the current backend (cpu, webgl, etc). The backend is responsible
   * for creating tensors and executing operations on those tensors.
   */
  @doc({heading: 'Environment'})
  static getBackend(): string {
    ENV.initDefaultBackend();
    return ENV.currentBackend;
  }

  /**
   * Dispose all variables kept in backend engine.
   */
  @doc({heading: 'Environment'})
  static disposeVariables(): void {
    ENV.engine.disposeVariables();
  }

  /**
   * Returns memory info at the current time in the program. The result is an
   * object with the following properties:
   *
   * - `numBytes`: Number of bytes allocated (undisposed) at this time.
   * - `numTensors`: Number of unique tensors allocated.
   * - `numDataBuffers`: Number of unique data buffers allocated
   *   (undisposed) at this time, which is ≤ the number of tensors
   *   (e.g. `a.reshape(newShape)` makes a new Tensor that shares the same
   *   data buffer with `a`).
   * - `unreliable`: `Optional` `boolean`:
   *    - On WebGL, not present (always reliable).
   *    - On CPU, true. Due to automatic garbage collection, these numbers
   *     represent undisposed tensors, i.e. not wrapped in `tidy()`, or
   *     lacking a call to `tensor.dispose()`.
   */
  @doc({heading: 'Performance', subheading: 'Memory'})
  static memory(): MemoryInfo {
    return ENV.engine.memory();
  }

  get<K extends keyof Features>(feature: K): Features[K] {
    if (feature in this.features) {
      return this.features[feature];
    }

    this.features[feature] = this.evaluateFeature(feature);

    return this.features[feature];
  }

  getFeatures(): Features {
    return this.features;
  }

  set<K extends keyof Features>(feature: K, value: Features[K]): void {
    this.features[feature] = value;
  }

  getBestBackendType(): string {
    if (Object.keys(this.registry).length === 0) {
      throw new Error('No backend found in registry.');
    }
    const sortedBackends = Object.keys(this.registry)
                               .map(name => {
                                 return {name, entry: this.registry[name]};
                               })
                               .sort((a, b) => {
                                 // Highest priority comes first.
                                 return b.entry.priority - a.entry.priority;
                               });
    return sortedBackends[0].name;
  }

  private evaluateFeature<K extends keyof Features>(feature: K): Features[K] {
    if (feature === 'DEBUG') {
      return false;
    } else if (feature === 'IS_BROWSER') {
      return typeof window !== 'undefined';
    } else if (feature === 'IS_NODE') {
      return (typeof process !== 'undefined') &&
          (typeof process.versions.node !== 'undefined');
    } else if (feature === 'IS_CHROME') {
      return isChrome();
    } else if (feature === 'BACKEND') {
      return this.getBestBackendType();
    } else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') {
      const webGLVersion = this.get('WEBGL_VERSION');

      if (webGLVersion === 0) {
        return 0;
      }

      return getWebGLDisjointQueryTimerVersion(webGLVersion);
    } else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE') {
      return this.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
          !device_util.isMobile();
    } else if (feature === 'WEBGL_VERSION') {
      if (isWebGLVersionEnabled(2)) {
        return 2;
      } else if (isWebGLVersionEnabled(1)) {
        return 1;
      }
      return 0;
    } else if (feature === 'WEBGL_RENDER_FLOAT32_ENABLED') {
      return isRenderToFloatTextureEnabled(this.get('WEBGL_VERSION'));
    } else if (feature === 'WEBGL_DOWNLOAD_FLOAT_ENABLED') {
      return isDownloadFloatTextureEnabled(this.get('WEBGL_VERSION'));
    } else if (
        feature === 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED') {
      return isWebGLGetBufferSubDataAsyncExtensionEnabled(
          this.get('WEBGL_VERSION'));
    } else if (feature === 'TEST_EPSILON') {
      if (this.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
        return TEST_EPSILON_FLOAT32_ENABLED;
      }
      return TEST_EPSILON_FLOAT32_DISABLED;
    }
    throw new Error(`Unknown feature ${feature}.`);
  }

  setFeatures(features: Features) {
    this.features = features;
  }

  reset() {
    this.features = getFeaturesFromURL();
    if (this.globalEngine != null) {
      this.globalEngine = null;
    }
  }

  private initBackend(backendType?: string, safeMode = false) {
    this.currentBackend = backendType;
    const backend = ENV.findBackend(backendType);
    this.globalEngine = new Engine(backend, safeMode);
  }

  findBackend(name: string): KernelBackend {
    if (!(name in this.registry)) {
      return null;
    }
    return this.registry[name].backend;
  }

  /**
   * Registers a global backend. The registration should happen when importing
   * a module file (e.g. when importing `backend_webgl.ts`), and is used for
   * modular builds (e.g. custom tfjs bundle with only webgl support).
   *
   * @param factory: The backend factory function. When called, it should
   * return an instance of the backend.
   * @param priority The priority of the backend (higher = more important).
   *     In case multiple backends are registered, `getBestBackendType` uses
   *     priority to find the best backend. Defaults to 1.
   * @return False if the creation/registration failed. True otherwise.
   */
  registerBackend(name: string, factory: () => KernelBackend, priority = 1):
      boolean {
    if (name in this.registry) {
      console.warn(`${name} backend was already registered`);
    }
    try {
      const backend = factory();
      this.registry[name] = {backend, priority};
      return true;
    } catch (err) {
      console.warn(`Registration of backend ${name} failed`);
      console.warn(err.stack || err.message);
      return false;
    }
  }

  removeBackend(name: string): void {
    if (!(name in this.registry)) {
      throw new Error(`${name} backend not found in registry`);
    }
    this.registry[name].backend.dispose();
    delete this.registry[name];
  }

  get engine(): Engine {
    this.initDefaultBackend();
    return this.globalEngine;
  }

  private initDefaultBackend() {
    if (this.globalEngine == null) {
      this.initBackend(ENV.get('BACKEND'), false /* safeMode */);
    }
  }
}

// Expects flags from URL in the format ?tfjsflags=FLAG1:1,FLAG2:true.
const TENSORFLOWJS_FLAGS_PREFIX = 'tfjsflags';
function getFeaturesFromURL(): Features {
  const features: Features = {};

  if (typeof window === 'undefined' || typeof window.location === 'undefined') {
    return features;
  }

  const urlParams = util.getQueryParams(window.location.search);
  if (TENSORFLOWJS_FLAGS_PREFIX in urlParams) {
    const urlFlags: {[key: string]: string} = {};

    const keyValues = urlParams[TENSORFLOWJS_FLAGS_PREFIX].split(',');
    keyValues.forEach(keyValue => {
      const [key, value] = keyValue.split(':') as [string, string];
      urlFlags[key] = value;
    });

    URL_PROPERTIES.forEach(urlProperty => {
      if (urlProperty.name in urlFlags) {
        console.log(
            `Setting feature override from URL ${urlProperty.name}: ` +
            `${urlFlags[urlProperty.name]}`);
        if (urlProperty.type === Type.NUMBER) {
          features[urlProperty.name] = +urlFlags[urlProperty.name];
        } else if (urlProperty.type === Type.BOOLEAN) {
          features[urlProperty.name] = urlFlags[urlProperty.name] === 'true';
        } else if (urlProperty.type === Type.STRING) {
          // tslint:disable-next-line:no-any
          features[urlProperty.name] = urlFlags[urlProperty.name] as any;
        } else {
          console.warn(`Unknown URL param: ${urlProperty.name}.`);
        }
      }
    });
  }

  return features;
}

function getGlobalNamespace(): {ENV: Environment} {
  // tslint:disable-next-line:no-any
  let ns: any;
  if (typeof (window) !== 'undefined') {
    ns = window;
  } else if (typeof (global) !== 'undefined') {
    ns = global;
  } else {
    throw new Error('Could not find a global object');
  }
  return ns;
}

function getOrMakeEnvironment(): Environment {
  const ns = getGlobalNamespace();
  ns.ENV = ns.ENV || new Environment(getFeaturesFromURL());
  return ns.ENV;
}

export let ENV = getOrMakeEnvironment();
