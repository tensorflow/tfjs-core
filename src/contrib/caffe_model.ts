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
import * as caffe_util from './caffe_util';

import {NDArray} from '../math/ndarray';

export class CaffeModel {

  // TODO Map structure not compatible with object structure used in models.Squeezenet
  /**
   * Model weights per layer
   * @type {Map<string, NDArray>}
   */
  protected variables: Map<string, NDArray>;

  // TODO Generalize preprocessing to support cropping
  /**
   * Preprocessing Offset
   * @type {NDArray}
   */
  protected preprocessOffset: NDArray;

  // TODO Handle .prototxt
  /*
   * Prototxt:
   * The .prototxt file contains the model definition and parameters for a specific phase (train, test). Mostly the
   * train.prototxt file contains the train definitions whereas the deploy.prototxt file contains the test definition.
   *
   * Recommendation for inference:
   * We should first parse the prototxt file and create a DAG of operations. Then we should parse the caffemodel file
   * and keep only the weights for the layers defined in the prototxt file. The weights are of type Array<float> and
   * need to be transformed to Float32Array type.
   */
  
  /**
   * Parsed .caffemodel
   * The .caffemodel file contains the model definition, parameters and weights after a specific phase (train, test).
   * Most .caffemodel files contain all layers and parameters from the training phase. 
   * @type {caffe.NetParameter}
   */
  private caffemodel: caffe.NetParameter;

  constructor(private caffemodelUrl: string){}

  /**
   * Load the .caffemodel file and parse it into variables
   */
  loadVariables() {
    return caffe_util.fetchArrayBuffer(this.caffemodelUrl)
      .then(caffe_util.parseCaffeModel)
      .then((model) => {

        // Store the caffemodel for debugging
        this.caffemodel = model;

        // Store the model weights
        this.variables = caffe_util.getAllVariables(model);

        // Store the preprocessing parameters
        this.preprocessOffset = caffe_util.getPreprocessOffset(model);
      });
  }
}