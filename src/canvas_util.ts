/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

import {callAndCheck} from './kernels/webgl/webgl_util';

const contexes:
    {[key: string]: {canvas: HTMLCanvasElement,
                     gl: WebGLRenderingContext}} = {};

const WEBGL_ATTRIBUTES: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  depth: false,
  stencil: false,
  failIfMajorPerformanceCaveat: true
};

export function getWebGLCanvas(webGLVersion: number): HTMLCanvasElement {
  if (!(webGLVersion in contexes)) {
    const canvas = document.createElement('canvas');
    canvas.addEventListener('webglcontextlost', ev => {
      ev.preventDefault();
      delete contexes[webGLVersion];
    }, false);
    const gl = getWebGLRenderingContext(webGLVersion);
    contexes[webGLVersion] = {canvas, gl};
  }
  const gl = contexes[webGLVersion].gl;

  callAndCheck(gl, () => gl.disable(gl.DEPTH_TEST));
  callAndCheck(gl, () => gl.disable(gl.STENCIL_TEST));
  callAndCheck(gl, () => gl.disable(gl.BLEND));
  callAndCheck(gl, () => gl.disable(gl.DITHER));
  callAndCheck(gl, () => gl.disable(gl.POLYGON_OFFSET_FILL));
  callAndCheck(gl, () => gl.disable(gl.SAMPLE_COVERAGE));
  callAndCheck(gl, () => gl.enable(gl.SCISSOR_TEST));
  callAndCheck(gl, () => gl.enable(gl.CULL_FACE));
  callAndCheck(gl, () => gl.cullFace(gl.BACK));

  if (gl.isContextLost()) {
    delete contexes[webGLVersion];
    return getWebGLCanvas(webGLVersion);
  }
  return contexes[webGLVersion].canvas;
}

export function getWebGLContext(webGLVersion: number): WebGLRenderingContext {
  getWebGLCanvas(webGLVersion);
  return contexes[webGLVersion].gl;
}

function getWebGLRenderingContext(webGLVersion: number): WebGLRenderingContext {
  if (webGLVersion !== 1 && webGLVersion !== 2) {
    throw new Error('Cannot get WebGL rendering context, WebGL is disabled.');
  }

  const canvas = document.createElement('canvas');
  if (webGLVersion === 1) {
    return (canvas.getContext('webgl', WEBGL_ATTRIBUTES) ||
            canvas.getContext('experimental-webgl', WEBGL_ATTRIBUTES)) as
        WebGLRenderingContext;
  }
  return canvas.getContext('webgl2', WEBGL_ATTRIBUTES) as WebGLRenderingContext;
}
