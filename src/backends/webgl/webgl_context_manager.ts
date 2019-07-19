/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import {ENV} from '../../environment';

/**
 * Manages global state of all WebGLRenderingContexts.
 */
export class WebGLContextManager {
  private static instance: WebGLContextManager;

  contexts: {[key: string]: WebGLRenderingContext} = {};
  factory: (version: number) => WebGLRenderingContext;

  private constructor() {}

  static getInstance(): WebGLContextManager {
    if (!WebGLContextManager.instance) {
      WebGLContextManager.instance = new WebGLContextManager();
    }
    return WebGLContextManager.instance;
  }

  static getActiveContext(): WebGLRenderingContext {
    return WebGLContextManager.getInstance().getActiveContext();
  }

  /**
   * Sets callback for creating new WebGLRenderingContext instances.
   * @param factory The callback function that returns a WebGLRenderingContext
   *     instance.
   */
  setContextFactory(factory: (version: number) => WebGLRenderingContext) {
    this.factory = factory;
  }

  /**
   * Returns the current WebGLContext
   */
  getActiveContext(): WebGLRenderingContext {
    return this.getContextByVersion(ENV.getNumber('WEBGL_VERSION'));
  }

  /**
   *  TODO(kreeger): Doc me.
   * @param version The specific version of WebGL to request.
   */
  getContextByVersion(version: number): WebGLRenderingContext {
    if (!(version in this.contexts)) {
      this.contexts[version] = this.factory(version);
      this.bootstrapWebGLContext(this.contexts[version]);
    }
    const gl = this.contexts[version];
    if (gl.isContextLost()) {
      delete this.contexts[version];
      return this.getContextByVersion(version);
    }
    return this.contexts[version];
  }

  private bootstrapWebGLContext(gl: WebGLRenderingContext) {
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.DITHER);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.disable(gl.SAMPLE_COVERAGE);
    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }
}
