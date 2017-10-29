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

import {caffe} from './caffe/caffe.js';
import {Graph} from '../graph/graph';
import {NDArrayMathGPU} from '../math/math_gpu';
import {Array1D, NDArray} from '../math/ndarray';

// Type definition for caffemodel files
export type NetParameter = caffe.NetParameter;

// Type definition for binaryproto files
export type BlobProto = caffe.BlobProto;

export function fetchArrayBuffer(uri: string) : Promise<ArrayBuffer> {
  return fetch(new Request(uri)).then((res) => res.arrayBuffer());
}

export function parseCaffeModel(data: ArrayBuffer) {
  return caffe.NetParameter.decode(new Uint8Array(data));
}

/**
 * Converts a BlobProto [b, d, y, x] into an NDArray [x, y, d, b]
 */
function convBlobToNDArray(blob: caffe.IBlobProto) : NDArray {
  // blob dimension
  let dim = <number[]> blob.shape.dim.reverse();

  // blob data
  let data = new Float32Array(blob.data.reverse());

  return NDArray.make(dim, {values: data});
}

export function getAllVariables(model: caffe.NetParameter) : {[varName: string]: NDArray} {

  var variables: {[varName: string]: NDArray} = {};
   
  model.layer
    // parametrized layers only
    .filter((layer) => layer.blobs.length > 0)
    .forEach((layer) => {
      layer.blobs.forEach((blob, i) => {
        let postfix = i == 0 ? '_W:0' : '_b:0';
        variables[layer.name + postfix] = convBlobToNDArray(blob);
      });
    });

  return variables;
}

export function getPreprocessOffset(model: caffe.NetParameter) : NDArray {
  let params =  model.layer[0].transformParam;
  return Array1D.new(params.meanValue);
}

export function getPreprocessDim(model: caffe.NetParameter) : number {
  let params =  model.layer[0].transformParam;
  return params.cropSize;
}

export function getModelDAG(model: caffe.NetParameter, math: NDArrayMathGPU) : Graph {

  // We need to construct the graph of operations here

  return null;
}