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

import {ENV} from '../../environment';
import * as tex_util from './tex_util';
import * as webgl_util from './webgl_util';

export function getWebGLContextAttributes(): WebGLContextAttributes {
  return {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true
  };
}

export interface TextureConfig {
  internalFormatFloat: number;
  textureFormatFloat: number;
  internalFormatHalfFloat: number;
  internalFormatPackedFloat: number;

  // The format to use during a gl.readPixels call.
  downloadTextureFormat: number;
  // How many channels need to be unpacked after a gl.readPixels call.
  downloadUnpackNumChannels: number;

  defaultNumChannels: number;
  textureTypeHalfFloat: number;
}

export function createWebGLContext(canvas?: HTMLCanvasElement) {
  const attributes = getWebGLContextAttributes();
  let gl: WebGLRenderingContext;
  if (canvas != null) {
    gl = webgl_util.createWebGLRenderingContextFromCanvas(canvas, attributes);
  } else {
    gl = webgl_util.createWebGLRenderingContext(attributes);
  }
  webgl_util.callAndCheck(gl, () => gl.disable(gl.DEPTH_TEST));
  webgl_util.callAndCheck(gl, () => gl.disable(gl.STENCIL_TEST));
  webgl_util.callAndCheck(gl, () => gl.disable(gl.BLEND));
  webgl_util.callAndCheck(gl, () => gl.disable(gl.DITHER));
  webgl_util.callAndCheck(gl, () => gl.disable(gl.POLYGON_OFFSET_FILL));
  webgl_util.callAndCheck(gl, () => gl.disable(gl.SAMPLE_COVERAGE));
  webgl_util.callAndCheck(gl, () => gl.enable(gl.SCISSOR_TEST));
  webgl_util.callAndCheck(gl, () => gl.enable(gl.CULL_FACE));
  webgl_util.callAndCheck(gl, () => gl.cullFace(gl.BACK));
  return gl;
}

export function createVertexShader(gl: WebGLRenderingContext): WebGLShader {
  const vertexShaderSource = `
    precision highp float;
    attribute vec3 clipSpacePos;
    attribute vec2 uv;
    varying vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`;
  return webgl_util.createVertexShader(gl, vertexShaderSource);
}

export function createVertexBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  // [x y z u v] * [upper-left, lower-left, upper-right, lower-right]
  const vertexArray = new Float32Array(
      [-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]);
  return webgl_util.createStaticVertexBuffer(gl, vertexArray);
}

export function createIndexBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  // OpenGL (and WebGL) have "CCW == front" winding
  const triangleVertexIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
  return webgl_util.createStaticIndexBuffer(gl, triangleVertexIndices);
}

export function getTextureConfig(
    // tslint:disable-next-line:no-any
    gl: WebGLRenderingContext, textureHalfFloatExtension?: any): TextureConfig {
  // tslint:disable-next-line:no-any
  const glany = gl as any;

  let internalFormatFloat: number;
  let internalFormatHalfFloat: number;
  let internalFormatPackedFloat: number;
  let textureFormatFloat: number;

  let downloadTextureFormat: number;
  let downloadUnpackNumChannels: number;

  let defaultNumChannels: number;
  let textureTypeHalfFloat: number;

  if (ENV.get('WEBGL_VERSION') === 2) {
    internalFormatFloat = glany.R32F;
    internalFormatHalfFloat = glany.RGBA16F;
    internalFormatPackedFloat = glany.RGBA32F;
    textureFormatFloat = glany.RGBA;
    downloadUnpackNumChannels = 4;
    defaultNumChannels = 1;
    textureTypeHalfFloat = glany.HALF_FLOAT;
  } else {
    internalFormatFloat = gl.RGBA;
    internalFormatHalfFloat = gl.RGBA;
    internalFormatPackedFloat = glany.RGBA;
    textureFormatFloat = gl.RGBA;
    downloadUnpackNumChannels = 4;
    defaultNumChannels = 4;
    textureTypeHalfFloat = textureHalfFloatExtension != null ?
        textureHalfFloatExtension.HALF_FLOAT_OES :
        null;
  }
  downloadTextureFormat = gl.RGBA;

  return {
    internalFormatFloat,
    internalFormatHalfFloat,
    internalFormatPackedFloat,
    textureFormatFloat,
    downloadTextureFormat,
    downloadUnpackNumChannels,
    defaultNumChannels,
    textureTypeHalfFloat
  };
}

function createAndConfigureTexture(
    gl: WebGLRenderingContext, width: number, height: number,
    internalFormat: number, textureFormat: number,
    textureType: number): WebGLTexture {
  webgl_util.validateTextureSize(gl, width, height);
  const texture = webgl_util.createTexture(gl);

  const tex2d = gl.TEXTURE_2D;
  webgl_util.callAndCheck(gl, () => gl.bindTexture(tex2d, texture));
  webgl_util.callAndCheck(
      gl, () => gl.texParameteri(tex2d, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE));
  webgl_util.callAndCheck(
      gl, () => gl.texParameteri(tex2d, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE));
  webgl_util.callAndCheck(
      gl, () => gl.texParameteri(tex2d, gl.TEXTURE_MIN_FILTER, gl.NEAREST));
  webgl_util.callAndCheck(
      gl, () => gl.texParameteri(tex2d, gl.TEXTURE_MAG_FILTER, gl.NEAREST));
  webgl_util.callAndCheck(
      gl,
      () => gl.texImage2D(
          tex2d, 0, internalFormat, width, height, 0, textureFormat,
          textureType, null));
  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, null));
  return texture;
}

export function createFloat32MatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  return createFloat16MatrixTexture(gl, rows, columns, textureConfig);
  // const [width, height] =
  //     tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);
  // return createAndConfigureTexture(
  //     gl, width, height, textureConfig.internalFormatFloat,
  //     textureConfig.textureFormatFloat, gl.FLOAT);
}

export function createFloat16MatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  const [width, height] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);
  return createAndConfigureTexture(
      gl, width, height, textureConfig.internalFormatHalfFloat,
      textureConfig.textureFormatFloat, textureConfig.textureTypeHalfFloat);
}

export function createUnsignedBytesMatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  const [width, height] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);
  return createAndConfigureTexture(
      gl, width, height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
}

export function createPackedMatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  const [width, height] =
      tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns);
  return createAndConfigureTexture(
      gl, width, height, textureConfig.internalFormatPackedFloat, gl.RGBA,
      gl.FLOAT);
}

export function bindVertexProgramAttributeStreams(
    gl: WebGLRenderingContext, program: WebGLProgram,
    vertexBuffer: WebGLBuffer): boolean {
  const posOffset = 0;               // x is the first buffer element
  const uvOffset = 3 * 4;            // uv comes after [x y z]
  const stride = (3 * 4) + (2 * 4);  // xyz + uv, each entry is 4-byte float.
  webgl_util.callAndCheck(
      gl, () => gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer));
  const success = webgl_util.bindVertexBufferToProgramAttribute(
      gl, program, 'clipSpacePos', vertexBuffer, 3, stride, posOffset);
  return success &&
      webgl_util.bindVertexBufferToProgramAttribute(
          gl, program, 'uv', vertexBuffer, 2, stride, uvOffset);
}

export function uploadPixelDataToTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture,
    pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) {
  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, texture));
  webgl_util.callAndCheck(
      gl,
      () => gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels));
  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, null));
}

const toHalf = (() => {
  const floatView = new Float32Array(1);
  const int32View = new Int32Array(floatView.buffer);

  /* This method is faster than the OpenEXR implementation (very often
   * used, eg. in Ogre), with the additional benefit of rounding, inspired
   * by James Tursa?s half-precision code. */
  return function toHalf(val: number) {
    floatView[0] = val;
    const x = int32View[0];

    let bits = (x >> 16) & 0x8000; /* Get the sign */
    let m = (x >> 12) & 0x07ff;    /* Keep one extra bit for rounding */
    const e = (x >> 23) & 0xff;    /* Using int is faster here */

    /* If zero, or denormal, or exponent underflows too much for a denormal
     * half, return signed zero. */
    if (e < 103) {
      return bits;
    }

    /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
    if (e > 142) {
      bits |= 0x7c00;
      /* If exponent was 0xff and one mantissa bit was set, it means NaN,
       * not Inf, so make sure we set one mantissa bit too. */
      bits |= ((e === 255) ? 0 : 1) && (x & 0x007fffff);
      return bits;
    }

    /* If exponent underflows but not too much, return a denormal */
    if (e < 113) {
      m |= 0x0800;
      /* Extra rounding may overflow and set mantissa to 0 and exponent
       * to 1, which is OK. */
      bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
      return bits;
    }

    bits |= ((e - 112) << 10) | (m >> 1);
    /* Extra rounding. An overflow will set mantissa to 0 and increment
     * the exponent, which is OK. */
    bits += m & 1;
    return bits;
  };
})();

function arrayToHalf(data: Float32Array): Uint16Array {
  const res = new Uint16Array(data.length * 4);
  for (let i = 0; i < data.length; i++) {
    res[i * 4] = toHalf(data[i]);
  }
  return res;
}

function uploadDataToTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture, width: number,
    height: number, data: Float32Array, textureFormat: number,
    textureConfig: TextureConfig) {
  webgl_util.validateTextureSize(gl, width, height);
  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, texture));
  webgl_util.callAndCheck(
      gl,
      () => gl.texSubImage2D(
          gl.TEXTURE_2D, 0, 0, 0, width, height, textureFormat,
          textureConfig.textureTypeHalfFloat, arrayToHalf(data)));

  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, null));
}

export function uploadMatrixToTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture, rows: number,
    columns: number, matrix: Float32Array, numChannels: number,
    textureConfig: TextureConfig) {
  const [w, h] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);

  let unpackedArray: Float32Array;
  if (textureConfig.defaultNumChannels === 1) {
    // No need to allocate a temporary array.
    unpackedArray = matrix;
  } else {
    unpackedArray =
        new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(
            matrix.length, numChannels));
    tex_util.encodeMatrixToUnpackedArray(matrix, unpackedArray, numChannels);
  }

  uploadDataToTexture(
      gl, texture, w, h, unpackedArray, textureConfig.textureFormatFloat,
      textureConfig);
}

export function uploadMatrixToPackedTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture, rows: number,
    columns: number, matrix: Float32Array, textureConfig: TextureConfig) {
  const [w, h] = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns);
  const packedRGBA = new Float32Array(
      tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
  tex_util.encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA);
  uploadDataToTexture(gl, texture, w, h, packedRGBA, gl.RGBA, textureConfig);
}

export async function downloadMatrixFromOutputTextureAsync(
    // tslint:disable-next-line:no-any
    gl: WebGLRenderingContext, getBufferSubDataAsyncExtension: any,
    rows: number, columns: number,
    textureConfig: TextureConfig): Promise<Float32Array> {
  // tslint:disable-next-line:no-any
  const gl2 = gl as any;

  const downloadTarget =
      new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(
          rows * columns, textureConfig.downloadUnpackNumChannels));

  // Allocate a pixel pack buffer so we can copy the texture to it.
  const bufferSizeBytes = downloadTarget instanceof Float32Array ?
      downloadTarget.length * 4 :
      downloadTarget;
  const buffer = gl.createBuffer();
  webgl_util.callAndCheck(
      gl, () => gl.bindBuffer(gl2.PIXEL_PACK_BUFFER, buffer));

  webgl_util.callAndCheck(
      gl,
      () => gl.bufferData(
          gl2.PIXEL_PACK_BUFFER, bufferSizeBytes, gl.STATIC_DRAW));

  webgl_util.callAndCheck(
      gl, () => gl2.readPixels(0, 0, columns, rows, gl.RGBA, gl.FLOAT, 0));

  await getBufferSubDataAsyncExtension.getBufferSubDataAsync(
      gl2.PIXEL_PACK_BUFFER, 0, downloadTarget);

  const matrix = new Float32Array(rows * columns);
  tex_util.decodeMatrixFromUnpackedArray(
      downloadTarget as Float32Array, matrix,
      textureConfig.downloadUnpackNumChannels);
  return matrix;
}

export function downloadFloat32MatrixFromOutputTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): Float32Array {
  const [w, h] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);

  const downloadTarget =
      new Uint16Array(tex_util.getUnpackedArraySizeFromMatrixSize(
          rows * columns, textureConfig.downloadUnpackNumChannels));
  console.log('download target', downloadTarget.length);
  webgl_util.callAndCheck(
      gl,
      () => gl.readPixels(
          0, 0, w, h, textureConfig.textureFormatFloat,
          textureConfig.textureTypeHalfFloat, downloadTarget));

  const matrix = new Float32Array(rows * columns);
  const downloadFloatTarget =
      new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(
          rows * columns, textureConfig.downloadUnpackNumChannels));
  console.log(downloadTarget);
  tex_util.decodeMatrixFromUnpackedArray(
      downloadFloatTarget, matrix, textureConfig.downloadUnpackNumChannels);
  return matrix;
}

export function downloadByteEncodedFloatMatrixFromOutputTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig) {
  const [w, h] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);

  const numChannels = 4;
  const downloadTarget = new Uint8Array(
      tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, numChannels));

  webgl_util.callAndCheck(
      gl,
      () => gl.readPixels(
          0, 0, w, h, textureConfig.downloadTextureFormat, gl.UNSIGNED_BYTE,
          downloadTarget));

  // By wrapping the buffer in a Float32Array, we use native browser IEEE 754
  // decoding of the 4 bytes that back each 32 bit float.
  return new Float32Array(downloadTarget.buffer);
}

export function downloadMatrixFromPackedOutputTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): Float32Array {
  const [w, h] = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns);
  const packedRGBA = new Float32Array(
      tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
  webgl_util.callAndCheck(
      gl, () => gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, packedRGBA));
  const matrix = new Float32Array(rows * columns);
  return tex_util.decodeMatrixFromPackedRGBA(packedRGBA, rows, columns, matrix);
}
