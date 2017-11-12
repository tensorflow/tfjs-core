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

import {NDArrayMathGPU} from '../math/math_gpu';
import {NDArray} from '../math/ndarray';

export class CaffeModel {

  // TODO Map structure not compatible with object structure used in models.Squeezenet
  /**
   * Model weights per layer
   * @type {Map<string, NDArray>}
   */
  private variables: Map<string, NDArray>;

  // TODO Generalize preprocessing to support cropping
  /**
   * Preprocessing Offset
   * @type {NDArray}
   */
  private preprocessOffset: NDArray;

  // TODO Handle .prototxt and .caffemodel file properly
  /*
   * Prototxt:
   * The .prototxt file contains the model definition and parameters for a specific phase (train, test). Mostly the
   * train.prototxt file contains the train definitions whereas the deploy.prototxt file contains the test definition.
   *
   * Caffemodel:
   * The .caffemodel file contains the model definition, parameters and weights after a specific phase (train, test).
   * Most .caffemodel files contain all layers and parameters from the training phase. 
   *
   * Recommendation for inference:
   * We should first parse the prototxt file and create a DAG of operations. Then we should parse the caffemodel file
   * and keep only the weights for the layers defined in the prototxt file. The weights are of type Array<float> and
   * need to be transformed to Float32Array type.
   */
  
  /**
   * Parsed .caffemodel layers as Map
   * @type {Map<string, caffe.ILayerParameter>}
   */
  private layersTrain: Map<string, caffe.ILayerParameter>;

  /**
   * Parsed .prototxt layers as Map
   * @type {Map<string, caffe.ILayerParameter>}
   */
  private layersTest: Map<string, caffe.ILayerParameter>;

  // private static INPUT_LAYER: string = 'data';

  constructor(private caffemodelUrl: string, private prototxtUrl: string, public math: NDArrayMathGPU){}

  /**
   * Load the model definition and weights
   * @returns {Promise}
   */
  load() {
    return Promise.all([
      this.loadVariables(),
      this.loadModel()
    ]);
  }

  loadModel() {
    // Load .prototxt file, which contains model testing definition
    return caffe_util.fetchText(this.prototxtUrl)
      .then(caffe_util.parseProtoTxt)
      .then((modelDef) => {

        // Store layers as dict with layer name as key
        this.layersTest = caffe_util.toMap(modelDef.layer, 'name');
      });
  }

  loadVariables() {
    // Load .caffemodel file, which contains model weights and training definition
    return caffe_util.fetchArrayBuffer(this.caffemodelUrl)
      .then(caffe_util.parseCaffeModel)
      .then((model) => {

        // Store layers as dict with layer name as key
        this.layersTrain = caffe_util.toMap(model.layer, 'name');

        // Store the model weights
        this.variables = caffe_util.getAllVariables(model);

        // Store the preprocessing parameters
        this.preprocessOffset = caffe_util.getPreprocessOffset(model);
      });
  }
}