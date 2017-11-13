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
import {Array1D, NDArray} from '../math/ndarray';

export function fetchText(uri: string) : Promise<string> {
  return fetch(new Request(uri)).then((res) => res.text());
}

export function fetchArrayBuffer(uri: string) : Promise<ArrayBuffer> {
  return fetch(new Request(uri)).then((res) => res.arrayBuffer());
}

export function parseCaffeModel(data: ArrayBuffer) {
  return caffe.NetParameter.decode(new Uint8Array(data));
}

export function getLayers(model: caffe.NetParameter, phase: number = caffe.Phase.TEST) {
  return model.layer.filter((layer) => layer.phase === phase);
}

function getByKeys<T>(arr: T[], keys: number[]) : T[] {
  return keys.map((i) => arr[i]);
}

/**
 * Converts a BlobProto into an NDArray 
 * @param {number[]} blob data structure used by used by caffe
 * @returns {NDArray} data structure used by deeplearn.js
 */
function convBlobToNDArray(blob: caffe.IBlobProto) : NDArray {
  
  if (blob.shape.dim.length === 3) {
    // we need to swap the depth axis
    // caffe: [d, x, y] => deeplearnjs: [x, y, d]
    const dim = getByKeys(<number[]> blob.shape.dim, [1, 2, 0]);  
    const data = blob.data;
    const width = dim[0];
    const height = dim[1];
    const depth = dim[2];
    const arr = NDArray.zeros(dim, "float32");

    for (let d = 0; d < depth; ++d) {
      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          var ix = (d * width + x) * height + y;
          arr.set(data[ix], x, y, d);
        }
      }
    }
    return arr;
  }
  else if (blob.shape.dim.length === 4) {
    // we need to swap the filter and depth axis
    // caffe: [f, d, x, y] => deeplearnjs: [x, y, d, f]
    const dim = getByKeys(<number[]> blob.shape.dim, [2, 3, 1, 0]);  
    const data = blob.data;
    const width = dim[0];
    const height = dim[1];
    const depth = dim[2];
    const filters = dim[3];
    const arr = NDArray.zeros(dim, "float32");

    for (let f = 0; f < filters; ++f) {
      for (let d = 0; d < depth; ++d) {
        for (let x = 0; x < width; ++x) {
          for (let y = 0; y < height; ++y) {
            var ix = ((f * depth + d) * width + x) * height + y;
            arr.set(data[ix], x, y, d, f);
          }
        }
      }
    }
    return arr;
  }
  else {
    // assign the dimension
    const dim = <number[]> blob.shape.dim;
    
    // assign the blob data
    const data = new Float32Array(blob.data);

    return NDArray.make(dim, {values: data}, "float32");
  }
}

// TODO Check naming conventions from Tensorflow used in manifest.json
/**
 * Generates the variable name for a blob[index] of a layer
 * @param {caffe.ILayerParameter} layer caffe layer definition
 * @param {number} index index of the blob
 * @returns {string} variable name
 */
export function getVariableName(layer: caffe.ILayerParameter, index: number) : string {

  let postfix = '';

  switch (layer.type.toLowerCase()) {
    case "convolution":
      postfix = index === 0 ? '_W:0' : '_b:0';
      break;

    case "batchnorm":
      postfix = index === 0 ? '_m:0' : index === 1 ? '_v:0' : '_b:0';
      break;

    default:
      postfix = `_v:${index}`;
      break;
  }

  return layer.name + postfix;
}

/**
 * Get all variables from a caffemodel definition
 * @param {caffe.NetParameter} model caffe model
 * @returns {Map<string, NDArray>} Map containing variables per layer
 */
export function getAllVariables(model: caffe.NetParameter) : Map<string, NDArray> {

  var variables: Map<string, NDArray> = new Map();
   
  model.layer

    // parametrized layers only
    .filter((layer) => layer.blobs.length > 0)
    
    // iterate layers
    .forEach((layer) => {
      
      // iterate blobs per layer
      layer.blobs.forEach((blob, i) => {
        variables.set(getVariableName(layer, i), convBlobToNDArray(blob));
      });
    });

  return variables;
}

export function getPreprocessOffset(model: caffe.NetParameter) : NDArray {
  // TODO - mean value could be of type Array3D as well
  let params =  model.layer[0].transformParam;
  return Array1D.new(params.meanValue);
}

export function getPreprocessDim(model: caffe.NetParameter) : number {
  let params =  model.layer[0].transformParam;
  return params.cropSize;
}

/**
 * Convert an array to a Map by key
 * @param {Array<T>} arr input array
 * @param {string} key a key of T that can cast to string
 * @returns {Map<string, T>}
 */
export function toMap<T>(arr: Array<T>, key: string) : Map<string, T> {
  return new Map(arr.map((obj) => <[string, T]>[new String((<any> obj)[key]), obj]));
}
