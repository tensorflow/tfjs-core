import {caffe} from 'caffe-proto';
import {Array1D, NDArray} from 'deeplearn';
import {getLayersFromModel} from './layer';
import {isNotNull} from './util';

function getDimsByIndex<T>(arr: T[], keys: number[]) : T[] {
  return keys.map((i) => arr[i]);
}

function getDims(blob: caffe.IBlobProto) : number[] {
  if (isNotNull(blob.shape)) {
    return blob.shape.dim as number[];
  }
  else {
    return ['num', 'channels', 'width', 'height']
      .filter((p: string) => isNotNull((<any>blob)[p] as number) && (<any>blob)[p] > 0)
      .map((p: string) => (<any>blob)[p] as number);
  }
}

/**
 * Converts a BlobProto into an NDArray 
 * @param {number[]} blob data structure used by used by caffe
 * @returns {NDArray} data structure used by deeplearn.js
 */
export function convBlobToNDArray(blob: caffe.IBlobProto) : NDArray {
  
  const data = blob.data;
  const dims = getDims(blob);

  if (dims.length === 3) {
    // we need to swap the depth axis
    // caffe: [d, x, y] => deeplearnjs: [x, y, d]
    const dim = getDimsByIndex(dims, [1, 2, 0]);
    const width = dim[0];
    const height = dim[1];
    const depth = dim[2];
    const arr = NDArray.zeros(dim, "float32");

    for (let d = 0; d < depth; ++d) {
      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          const ix = (d * width + x) * height + y;
          arr.set(data[ix], x, y, d);
        }
      }
    }
    return arr;
  }
  else if (dims.length === 4) {
    // we need to swap the filter and depth axis
    // caffe: [f, d, x, y] => deeplearnjs: [x, y, d, f]
    const dim = getDimsByIndex(dims, [2, 3, 1, 0]);  
    const width = dim[0];
    const height = dim[1];
    const depth = dim[2];
    const filters = dim[3];
    const arr = NDArray.zeros(dim, "float32");

    for (let f = 0; f < filters; ++f) {
      for (let d = 0; d < depth; ++d) {
        for (let x = 0; x < width; ++x) {
          for (let y = 0; y < height; ++y) {
            const ix = ((f * depth + d) * width + x) * height + y;
            arr.set(data[ix], x, y, d, f);
          }
        }
      }
    }
    return arr;
  }
  else {
    // assign the blob data
    const dataTyped = new Float32Array(data);

    return NDArray.make(dims, {values: dataTyped}, "float32");
  }
}

/**
 * Get all variables from a caffemodel definition
 * @param {caffe.NetParameter} model caffe model
 * @returns {{[varName: string]: NDArray[]}} Map containing variables per layer
 */
export function getAllVariables(model: caffe.NetParameter)
    : {[varName: string]: NDArray[]} {

  const variables: {[varName: string]: NDArray[]} = {};
  const layers = getLayersFromModel(model) as caffe.LayerParameter[];

  layers
    // parametrized layers only
    .filter((layer) => layer.blobs.length > 0)
    
    // iterate layers
    .forEach((layer) => { 
      variables[`${layer.name}`] = layer.blobs.map(convBlobToNDArray);
    });

  return variables;
}

export function getPreprocessOffset(model: caffe.NetParameter) : NDArray {
  const layers = getLayersFromModel(model) as caffe.LayerParameter[];
  const params = caffe.TransformationParameter.create(layers[0].transformParam);
  if (isNotNull(params.meanValue)) {
    return Array1D.new(params.meanValue);
  }
  else if (isNotNull(params.meanFile)) {
    console.warn(`Mean value needs to be loaded manually from ${params.meanFile}`);
  }
  return undefined;
}

export function getPreprocessDim(model: caffe.NetParameter) : number {
  const layers = getLayersFromModel(model) as caffe.LayerParameter[];
  const params = caffe.TransformationParameter.create(layers[0].transformParam);
  if (isNotNull(params.cropSize)) {
    return params.cropSize;
  }
  return undefined;
}
