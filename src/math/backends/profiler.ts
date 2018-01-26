import * as util from '../../util';
import {NDArray} from '../ndarray';
import {TypedArray} from '../types';

import {BackendTimer} from './backend';
import {Kernel} from './kernel_registry';

export class Profiler {
  private pendingTimer: Promise<number>;
  private pendingKernel = false;

  constructor(private backendTimer: BackendTimer) {}

  profileKernel<T extends NDArray>(kernelName: Kernel, f: () => T): T {
    let result: NDArray;

    const shouldTimeKernel = this.pendingKernel === false;

    let query: {};
    if (shouldTimeKernel) {
      query = this.backendTimer.startTimer();
      this.pendingKernel = true;
    }

    result = f();

    if (shouldTimeKernel) {
      query = this.backendTimer.endTimer(query);
      this.pendingKernel = false;

      const vals = result.dataSync();
      util.checkForNaN(vals, result.dtype, name);

      const profile = (timeMs: number) => {
        this.logKernelProfile(kernelName, result, vals, timeMs);
      };

      if (this.pendingTimer == null) {
        this.pendingTimer = this.backendTimer.getQueryTime(query);
        this.pendingTimer.then(timeMs => {
          profile(timeMs);
          this.pendingTimer = null;
        });
      } else {
        this.pendingTimer.then(
            () => this.backendTimer.getQueryTime(query).then(profile));
      }
    }

    return result as T;
  }

  logKernelProfile(
      kernelName: Kernel, result: NDArray, vals: TypedArray, timeMs: number) {
    const time = util.rightPad(`${timeMs}ms`, 9);
    const paddedName = util.rightPad(kernelName, 25);
    const rank = result.rank;
    const size = result.size;
    const shape = util.rightPad(result.shape.toString(), 14);
    console.log(
        `%c${paddedName}\t%c${time}\t%c${rank}D ${shape}\t%c${size}`,
        'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
  }
}
