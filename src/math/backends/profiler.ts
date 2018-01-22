import * as util from '../../util';
import {NDArray} from '../ndarray';

import {MathBackend} from './backend';
import {Kernel} from './kernel_registry';

export class Profiler {
  private pendingTimer: Promise<number>;

  constructor(private backend: MathBackend) {}

  timeKernel<T extends NDArray>(kernelName: Kernel, f: () => T): T {
    let result: NDArray;

    const wrappedFn = () => {
      result = f();
      console.log(result);
      return result;
    };

    const log = (timeMs: number) => {
      const vals = result.dataSync();
      const time = util.rightPad(`${timeMs}ms`, 9);
      const paddedName = util.rightPad(kernelName, 25);
      const rank = result.rank;
      const size = result.size;
      const shape = util.rightPad(result.shape.toString(), 14);
      console.log(
          `%c${paddedName}\t%c${time}\t%c${rank}D ${shape}\t%c${size}`,
          'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
      util.checkForNaN(vals, result.dtype, name);
    };

    if (this.pendingTimer == null) {
      console.log('NO panding timer', kernelName);
      this.pendingTimer = this.backend.time(wrappedFn);
      this.pendingTimer.then(timeMs => {
        log(timeMs);
        // this.pendingTimer = null;
      });
    } else {
      console.log('panding timer');

      //
      // TODO: We need to return "result" immediately, it's undefined because we
      // don't execute the kernel until the previous kernel is done.
      // We should execute immediately and hold onto the WebGLQuery so we can
      // query it at a later time. This means we also need to split up the last
      // part of the query.
      //

      this.pendingTimer.then(() => {
        console.log('pending timer done...', kernelName);
        this.backend.time(wrappedFn).then(timeMs => {
          console.log('in wrapped', kernelName, result);
          log(timeMs);
        });
      });
    }

    return result as T;
  }
}
