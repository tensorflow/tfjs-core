import * as util from '../../util';
import {TypedArray} from '../../util';
import {DataTypes, NDArray, Scalar} from '../ndarray';

import {MathBackend} from './backend';
import {KernelNode} from './kernel_config';
import * as kernel_registry from './kernel_registry';
import {KernelConfigRegistry} from './kernel_registry';
import {Tape} from './tape';

export class BackendEngine {
  private masterTape: Tape;

  private debugMode = false;

  constructor(private backend: MathBackend) {
    this.masterTape = new Tape();
  }

  enableDebugMode() {
    this.debugMode = true;
  }

  executeKernel<K extends keyof KernelConfigRegistry,
                          C extends KernelConfigRegistry[K]['inputAndArgs']>(
      kernelName: K, config: C, grad?: KernelConfigRegistry[K]['gradient']):
      KernelConfigRegistry[K]['output'] {
    const kernelFn = () =>
        kernel_registry.executeKernel(this.backend, kernelName, config);

    let start: number;
    if (this.debugMode) {
      start = performance.now();
    }
    const result = kernelFn();
    if (this.debugMode) {
      const vals = result.getValues();
      const time = util.rightPad(`${performance.now() - start}ms`, 9);
      const paddedName = util.rightPad(name, 25);
      const rank = result.rank;
      const size = result.size;
      const shape = util.rightPad(result.shape.toString(), 14);
      console.log(
          `%c${paddedName}\t%c${time}\t%c${rank}D ${shape}\t%c${size}`,
          'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
      this.checkForNaN(vals, result.dtype, name);
    }

    const evaluatedNode: KernelNode = {
      kernel: kernelName,
      inputAndArgs: config,
      output: result,
      gradient: grad
    };
    this.masterTape.addEvaluatedNode(evaluatedNode);

    return result;
  }

  gradientWrt<T extends NDArray>(y: Scalar, x: T): T {
    return this.masterTape.gradientWrt(y, x);
  }

  private checkForNaN(vals: TypedArray, dtype: keyof DataTypes, name: string):
      void {
    for (let i = 0; i < vals.length; i++) {
      if (util.isValNaN(vals[i], dtype)) {
        throw Error(`The result of the last math.${name} has NaNs.`);
      }
    }
  }

  getBackend(): MathBackend {
    return this.backend;
  }
}
