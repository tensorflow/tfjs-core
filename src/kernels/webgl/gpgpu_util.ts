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

  if (!ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED')) {
    // webgl_util.callAndCheck(gl, () => gl.pixelStorei(gl.PACK_ALIGNMENT, 1));
    // webgl_util.callAndCheck(gl, () => gl.pixelStorei(gl.UNPACK_ALIGNMENT,
    // 1));
  }

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

const LOOKUP: {[key: number]: string} = {};

export function getTextureConfig(
    // tslint:disable-next-line:no-any
    gl: WebGLRenderingContext, textureHalfFloatExtension: any): TextureConfig {
  // tslint:disable-next-line:no-any
  const glany = gl as any;

  LOOKUP[gl.RGBA] = 'RGBA';
  LOOKUP[gl.UNSIGNED_BYTE] = 'UNSIGNED_BYTE';
  if (glany.RED != null) {
    LOOKUP[glany.RED] = 'RED';
  }
  if (glany.R32F != null) {
    LOOKUP[glany.R32F] = 'RGBA';
  }
  if (glany.HALF_FLOAT != null) {
    LOOKUP[glany.HALF_FLOAT] = 'HALF_FLOAT';
  }
  if (glany.FLOAT != null) {
    LOOKUP[glany.FLOAT] = 'FLOAT';
  }
  if (textureHalfFloatExtension != null) {
    LOOKUP[textureHalfFloatExtension.HALF_FLOAT_OES] = 'HALF_FLOAT_OES';
  }

  let internalFormatFloat: number;
  let internalFormatHalfFloat: number;
  let textureFormatFloat: number;

  let downloadTextureFormat: number;
  let downloadUnpackNumChannels: number;

  let defaultNumChannels: number;
  let textureTypeHalfFloat: number;

  ENV.get('WEBGL_RENDER_FLOAT32_ENABLED');
  ENV.get('WEBGL_DOWNLOAD_FLOAT_ENABLED');

  if (ENV.get('WEBGL_VERSION') === 2) {
    internalFormatFloat = glany.R32F;
    internalFormatHalfFloat = glany.R16F;
    textureFormatFloat = glany.RED;
    // downloadTextureFormat = gl.RGBA;
    downloadUnpackNumChannels = 4;
    defaultNumChannels = 1;
    textureTypeHalfFloat = glany.HALF_FLOAT;
  } else {
    internalFormatFloat = gl.RGBA;
    internalFormatHalfFloat = gl.RGBA;
    textureFormatFloat = gl.RGBA;
    // downloadTextureFormat = gl.RGBA;
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
    textureFormatFloat,
    downloadTextureFormat,
    downloadUnpackNumChannels,
    defaultNumChannels,
    textureTypeHalfFloat
  };
}

function createAndConfigureTexture(
    gl: WebGLRenderingContext, width: number, height: number,
    numChannels: number, internalFormat: number, textureFormat: number,
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
  const [width, height] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);
  const numChannels = 1;
  return createAndConfigureTexture(
      gl, width, height, numChannels, textureConfig.internalFormatFloat,
      textureConfig.textureFormatFloat, gl.FLOAT);
}

export function createFloat16MatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  const [width, height] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);
  const numChannels = 1;
  return createAndConfigureTexture(
      gl, width, height, numChannels, textureConfig.internalFormatFloat,
      textureConfig.textureFormatFloat, textureConfig.textureTypeHalfFloat);
}

export function createUnsignedBytesMatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  const [width, height] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);
  const numChannels = 4;
  return createAndConfigureTexture(
      gl, width, height, numChannels, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
}

export function createPackedMatrixTexture(
    gl: WebGLRenderingContext, rows: number, columns: number,
    textureConfig: TextureConfig): WebGLTexture {
  const [width, height] =
      tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns);
  const numChannels = 4;
  return createAndConfigureTexture(
      gl, width, height, numChannels, gl.RGBA, gl.RGBA, gl.FLOAT);
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

function uploadDataToTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture, width: number,
    height: number, data: Float32Array|Uint16Array, numChannels: number,
    textureConfig: TextureConfig) {
  // console.log('uploading', data);
  // const textureFormat = getTextureFormat(gl, numChannels);

  webgl_util.validateTextureSize(gl, width, height);
  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, texture));
  webgl_util.callAndCheck(
      gl,
      () => gl.texSubImage2D(
          gl.TEXTURE_2D, 0, 0, 0, width, height,
          textureConfig.textureFormatFloat, gl.FLOAT, data));

  webgl_util.callAndCheck(gl, () => gl.bindTexture(gl.TEXTURE_2D, null));
}

export function uploadMatrixToTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture, rows: number,
    columns: number, matrix: Float32Array, numChannels: number,
    textureConfig: TextureConfig) {
  const [w, h] =
      tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns);

  let unpackedArray: Float32Array|Uint16Array;

  if (textureConfig.defaultNumChannels === 1) {
    // No need to allocate a temporary array.
    unpackedArray = matrix;
  } else {
    // console.log('PACKING!!!!!!');
    unpackedArray =
        new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(
            matrix.length, numChannels));
    tex_util.encodeMatrixToUnpackedArray(matrix, unpackedArray, numChannels);
  }

  uploadDataToTexture(
      gl, texture, w, h, unpackedArray, numChannels, textureConfig);
}

export function uploadMatrixToPackedTexture(
    gl: WebGLRenderingContext, texture: WebGLTexture, rows: number,
    columns: number, matrix: Float32Array, textureConfig: TextureConfig) {
  const [w, h] = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns);
  const packedRGBA = new Float32Array(
      tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
  tex_util.encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA);
  const numChannels = 4;
  uploadDataToTexture(
      gl, texture, w, h, packedRGBA, numChannels, textureConfig);
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
      new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(
          rows * columns, textureConfig.downloadUnpackNumChannels));

  webgl_util.callAndCheck(
      gl,
      () => gl.readPixels(
          0, 0, w, h, textureConfig.downloadTextureFormat, gl.FLOAT,
          downloadTarget));

  const matrix = new Float32Array(rows * columns);
  tex_util.decodeMatrixFromUnpackedArray(
      downloadTarget as Float32Array, matrix,
      textureConfig.downloadUnpackNumChannels);
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
