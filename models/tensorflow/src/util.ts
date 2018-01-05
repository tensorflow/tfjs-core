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
import {Array1D, Array2D, Array3D, Array4D, NDArray, Scalar} from 'deeplearn/dist/math/ndarray';
import * as prototxtParser from 'prototxt-parser';

import {TensorflowModel} from './model';
import {DataType, Dim, Graph, Tensor} from './types';

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

export function loadLocalProtoTxtFile(file: string): Graph {
  const fs = require('fs');
  return prototxtParser.parse(fs.readFileSync(file, {encoding: 'utf8'})) as
      Graph;
}

// export function runNodeSqueezenet() {
//   const path = require('path');
//   const promise = new Promise<Graph>(
//       (resolve, reject) => resolve(loadLocalProtoTxtFile(
//           path.join(path.resolve(), 'squeezenet.pbtxt'))));
//   const model = new TensorflowModel(promise);
//   model.load().then(() => {
//     const image = require('get-image-data');
//     image('./cat.jpg', (error: any, info: any) => {
//       setTimeout(function() {
//         (global as any).ImageData = require('canvas').ImageData;
//         const input = Array3D.fromPixels(info);
//         const reshapedInput = input.reshape([1, ...input.shape]);
//         console.log(reshapedInput.shape);
//         const output = model.predict(undefined, {
//           'image_placeholder': reshapedInput,
//           'Placeholder': Scalar.new(1.0)
//         });

//         const data = Array.prototype.slice.call(output.dataSync());

//         console.log(data.indexOf(Math.max(...data)));
//       }, 1000);
//     });
//   });
// }

export function loadRemoteProtoTxtFile(url: string): Promise<Graph> {
  return fetch(new Request(url))
      .then(res => res.text())
      .then(text => prototxtParser.parse(text) as Graph);
}

export function tensorToNDArray(tensor: Tensor): NDArray {
  let dims = (tensor.tensor_shape.dim || []);
  if (!(dims instanceof Array)) {
    dims = [dims];
  }
  const dimSizes = (dims as Dim[]).map(dim => dim.size);
  console.log(dimSizes);
  switch (DataType[tensor.dtype as keyof typeof DataType]) {
    case DataType.DT_INT32: {
      const values = tensor.int_val !== undefined ?
          tensor.int_val :
          getTensorContentValue(tensor);
      return toNDArray(dimSizes, values, 'int32');
    }
    case DataType.DT_FLOAT: {
      const values = tensor.float_val !== undefined ?
          tensor.float_val :
          getTensorContentValue(tensor);
      return toNDArray(dimSizes, values, 'float32');
    }
    case DataType.DT_BOOL: {
      const values = tensor.bool_val !== undefined ?
          tensor.bool_val :
          getTensorContentValue(tensor);
      return toNDArray(dimSizes, values, 'bool');
    }
  }
  throw new Error(`tensor data type: ${tensor.dtype} is not supported`);
}

function getTensorContentValue(tensor: Tensor): Int32Array|Float32Array|
    Uint8Array {
  if (!tensor.tensor_content) {
    console.log(tensor);
  }
  const str = unescape(tensor.tensor_content);
  const uint = new Uint8Array(str.length);
  for (let i = 0, j = str.length; i < j; ++i) {
    uint[i] = str.charCodeAt(i);
  }
  switch (DataType[tensor.dtype as keyof typeof DataType]) {
    case DataType.DT_INT32: {
      console.log(new Int32Array(uint.buffer));
      return new Int32Array(uint.buffer);
    }
    case DataType.DT_FLOAT: {
      return new Float32Array(uint.buffer);
    }
    case DataType.DT_BOOL: {
      return uint;
    }
  }
  return uint;
}

function toNDArray(
    shape: number[], values: any, dtype: 'float32'|'int32'|'bool'): NDArray {
  if (values instanceof Int32Array || values instanceof Float32Array ||
      values instanceof Uint8Array) {
    values = Array.prototype.slice.call(values);
  }

  switch (shape.length) {
    case 0:
      return Scalar.new(values, dtype);
    case 1: {
      if (!(values instanceof Array)) {
        values = [values];
      }
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
