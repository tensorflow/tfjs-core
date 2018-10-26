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

const contexts:
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
  if (!(webGLVersion in contexts)) {
    const canvas = document.createElement('canvas');
    canvas.addEventListener('webglcontextlost', ev => {
      ev.preventDefault();
      delete contexts[webGLVersion];
    }, false);
    const gl = getWebGLRenderingContext(webGLVersion);
    contexts[webGLVersion] = {canvas, gl};
  }
  const gl = contexts[webGLVersion].gl;
  if (gl.isContextLost()) {
    delete contexts[webGLVersion];
    return getWebGLCanvas(webGLVersion);
  }

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.STENCIL_TEST);
  gl.disable(gl.BLEND);
  gl.disable(gl.DITHER);
  gl.disable(gl.POLYGON_OFFSET_FILL);
  gl.disable(gl.SAMPLE_COVERAGE);
  gl.enable(gl.SCISSOR_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  return contexts[webGLVersion].canvas;
}

export function getWebGLContext(webGLVersion: number): WebGLRenderingContext {
  getWebGLCanvas(webGLVersion);
  return contexts[webGLVersion].gl;
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
