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
import * as util from './util';
import {layersToDagEdges, layersToDagNodes} from './dag';
import {getAllVariables, getPreprocessOffset, convBlobToNDArray} from './blob';
import {performMathOp} from './layer';

import {caffe} from 'caffe-proto';
import * as dag from 'dag-iterator';
import {Model, Array1D, Array3D, NDArray, NDArrayMathGPU, initializeGPU} from 'deeplearn';

export class CaffeModel implements Model {

  /**
   * Model weights per layer
   */
  protected variables: {[varName: string]: NDArray[]};

  /**
   * Preprocessing Offset
   */
  protected preprocessOffset: Array1D|Array3D;
  
  // protected preprocessDim: number;

  /**
   * Model DAG Nodes
   */
  private nodes: dag.INode<caffe.ILayerParameter>[];
  
  /**
   * Model DAG Edges
   */
  private edges: dag.IEdge[];

  /**
   * Constructor
   * @param caffemodelUrl url to the caffemodel file
   * @param prototxtUrl url to the prototxt file 
   */
  constructor(protected math: NDArrayMathGPU,
    private caffemodelUrl: string, private prototxtUrl: string, private meanBinaryprotoUrl?: string){
    // TODO(nsthorat): This awful hack is because we need to share the global
    // GPGPU between deeplearn loaded from standalone as well as the internal
    // deeplearn that gets compiled as part of this model. Remove this once we
    // decouple NDArray from storage mechanism.
    initializeGPU(
        (this.math as NDArrayMathGPU).getGPGPUContext(),
        (this.math as NDArrayMathGPU).getTextureManager());
  }

  /**
   * Load the model
   */
  load() {
    var tasks = [];

    if (this.caffemodelUrl) {
      tasks.push(this.load_caffemodel(this.caffemodelUrl));
    }

    if (this.prototxtUrl) {
      tasks.push(this.load_prototxt(this.prototxtUrl));
    }

    if (this.meanBinaryprotoUrl) {
      tasks.push(this.load_binaryproto(this.meanBinaryprotoUrl));
    }

    return Promise.all(tasks);
  }

  /**
   * Load the .caffemodel file and parse the weights it into variables
   */
  load_caffemodel(uri: string) {
    return util.fetchArrayBuffer(uri)
      .then(util.parseCaffemodel)
      .then((model) => {
        this.variables = getAllVariables(model);

        // read the training mean
        const offset = getPreprocessOffset(model);
        if (offset) {
          this.preprocessOffset = offset as Array1D;
        }
      });
  }

  /**
   * Load the .prototxt file and parse it into DAG nodes and edges
   */
  load_prototxt(uri: string) {
    return util.fetchText(uri)
      .then(util.parsePrototxt)
      .then((model) => {
        this.edges = layersToDagEdges(model);
        this.nodes = layersToDagNodes(model);
      });
  }

  /**
   * Overwrite in child class to load additional resources
   */
  load_binaryproto(uri: string) {
    return util.fetchArrayBuffer(uri)
      .then(util.parseBlob)
      .then((trainingMean) => {
        const offset: NDArray = convBlobToNDArray(trainingMean);
        const offset3D: Array3D = offset.as3D(offset.shape[0], offset.shape[1], offset.shape[2]);
        this.preprocessOffset = offset3D;
      });
  }

  predict(input: NDArray, untilLayer?: string): NDArray {

    // Keep a map of named activations for rendering purposes.
    const namedActivations: {[key: string]: NDArray} = {};
    let currAct: NDArray | NDArray[] = input;
 
    dag.iterate<caffe.ILayerParameter>(this.nodes, this.edges,
        (layer: caffe.ILayerParameter, parents: caffe.ILayerParameter[], i: number) => {

      if (i === 0 && this.preprocessOffset) {
        currAct = this.math.subtract(currAct as Array3D, this.preprocessOffset) as Array3D;
      }
      else if (parents.length === 1) {
        currAct = namedActivations[parents[0].name];
      }
      else if (parents.length > 1) {
        currAct = parents.map((d) => namedActivations[d.name]);
      }

      currAct = performMathOp(this.math, currAct, layer, this.variables[`${layer.name}`]);

      namedActivations[layer.name] = currAct as NDArray;

    }, untilLayer);

    return currAct;
  }

  dispose() {
    this.preprocessOffset.dispose();
    for (const varName in this.variables) {
      this.variables[varName].map((d) => d.dispose());
    }
  }
}