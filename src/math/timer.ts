import {GPGPUContext} from './webgl/gpgpu_context';

export interface Timer {
  startTimer(): {};
  endTimer(query: {}): void;
  getTime(query: {}): Promise<number>;
}

export class WebGLTimer implements Timer {
  private gpgpu: GPGPUContext;

  setGPGPUContext(gpgpu: GPGPUContext) {
    this.gpgpu = gpgpu;
  }

  startTimer(): WebGLQuery {
    // Cancel any existing timers as the timing will get bubbled up.
    this.gpgpu.maybeCancelQuery();
    return this.gpgpu.beginQuery();
  }

  endTimer(query: WebGLQuery) {
    return this.gpgpu.maybeEndQuery();
  }

  getTime(query: WebGLQuery): Promise<number>|null {
    return this.gpgpu.getTime(query);
  }
}

export interface CPUQuery {
  startTimeMs: number;
  endTimeMs?: number;
}

export class CPUTimer implements Timer {
  startTimer(): CPUQuery {
    return {startTimeMs: performance.now()};
  }

  endTimer(query: CPUQuery) {
    query.endTimeMs = performance.now();
  }

  getTime(query: CPUQuery): Promise<number>|null {
    if (query.endTimeMs == null) {
      return null;
    }
    return new Promise<number>(
        resolve => resolve(query.endTimeMs - query.startTimeMs));
  }
}
