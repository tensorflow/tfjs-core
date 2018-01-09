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

// Lookup table for non - utf8, with necessary escapes at(o >= 127 or o < 32)
import {Array1D, Array2D, Array3D, Array4D, NDArray, Scalar} from 'deeplearn';

import {tensorflow} from './index';

export function unescape(text: string): string {
  const UNESCAPE_STR_TO_BYTE: {[key: string]: number} = {};
  UNESCAPE_STR_TO_BYTE['t'] = 9;
  UNESCAPE_STR_TO_BYTE['n'] = 10;
  UNESCAPE_STR_TO_BYTE['r'] = 13;
  UNESCAPE_STR_TO_BYTE['\''] = 39;
  UNESCAPE_STR_TO_BYTE['"'] = 34;
  UNESCAPE_STR_TO_BYTE['\\'] = 92;

  const CUNESCAPE = /(\\[0-7]{3})|(\\[tnr'"\\])/gi;
  return text.replace(CUNESCAPE, (match, g1, g2) => {
    if (!!g1) {
      return String.fromCharCode(parseInt(g1.substring(1), 8));
    }
    if (!!g2) {
      return String.fromCharCode(UNESCAPE_STR_TO_BYTE[g2.substring(1)]);
    }
    return match;
  });
}

export function loadRemoteProtoFile(url: string): Promise<tensorflow.GraphDef> {
  return fetch(new Request(url))
      .then(res => res.arrayBuffer())
      .then(buffer => tensorflow.GraphDef.decode(new Uint8Array(buffer)));
}

export function tensorToNDArray(tensor: tensorflow.ITensor): NDArray {
  const dims = tensor.tensorShape.dim;
  const dimSizes = dims.map(dim => dim.size) as number[];
  switch (tensor.dtype) {
    case tensorflow.DataType.DT_INT32: {
      const values = tensor.intVal.length ?
          tensor.intVal :
          new Int32Array(Uint8Array.from(tensor.tensorContent).buffer);
      return toNDArray(dimSizes, values, 'int32');
    }
    case tensorflow.DataType.DT_FLOAT: {
      const values = tensor.floatVal.length ?
          tensor.floatVal :
          new Float32Array(Uint8Array.from(tensor.tensorContent).buffer);
      return toNDArray(dimSizes, values, 'float32');
    }
    case tensorflow.DataType.DT_BOOL: {
      const values =
          tensor.boolVal.length ? tensor.boolVal : tensor.tensorContent;
      return toNDArray(dimSizes, values, 'bool');
    }
    default:
      throw new Error(`tensor data type: ${tensor.dtype} is not supported`);
  }
}

function toNDArray(
    shape: number[],
    values: boolean[]|number[]|Int32Array|Float32Array|Uint8Array,
    dtype: 'float32'|'int32'|'bool'): NDArray {
  if (values instanceof Int32Array || values instanceof Float32Array ||
      values instanceof Uint8Array) {
    values = Array.prototype.slice.call(values);
  }

  switch (shape.length) {
    case 0:
      return Scalar.new(values[0], dtype);
    case 1: {
      return Array1D.new(values, dtype);
    }
    case 2:
      return Array2D.new(shape as [number, number], values, dtype);
    case 3:
      return Array3D.new(shape as [number, number, number], values, dtype);
    case 4:
      return Array4D.new(
          shape as [number, number, number, number], values, dtype);
    default:
      throw new Error('dimension higher than 4 is not supported');
  }
}
