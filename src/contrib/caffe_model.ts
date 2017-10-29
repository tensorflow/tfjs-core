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

import * as caffe_util from './caffe_util';

// import {MatrixOrientation, NDArrayMath} from '../math/math';
// import {NDArrayMathCPU} from '../math/math_cpu';
// import {Array1D, Array2D, Array3D, Array4D, NDArray, Scalar} from '../math/ndarray';

import {Graph} from '../graph/graph';
import {NDArrayMathGPU} from '../math/math_gpu';
import {Array1D, Array3D, NDArray} from '../math/ndarray';

export class CaffeModel {

  private variables: {[varName: string]: NDArray};
  private preprocessOffset: NDArray;
  private graph: Graph;

  constructor(private math: NDArrayMathGPU, private uri: string){}

  loadVariables(uri: string) {
    return caffe_util.fetchArrayBuffer(this.uri)
      .then(caffe_util.parseCaffeModel)
      .then((model) => {
        this.variables = caffe_util.getAllVariables(model);
        this.graph = caffe_util.getModelDAG(model, this.math);
        this.preprocessOffset = caffe_util.getPreprocessOffset(model);
      });
  }

  infer(input: Array3D): 
    {namedActivations: {[activationName: string]: Array3D}, logits: Array1D} {

    // Apply ${input} to operations graph

    // // Track these activations automatically so they get cleaned up in a parent
    // // scope.
    // const layerNames = Object.keys(namedActivations);
    // layerNames.forEach(
    //     layerName => this.math.track(namedActivations[layerName]));

    // return {namedActivations, logits: avgpool10};
    return null;
  }
}