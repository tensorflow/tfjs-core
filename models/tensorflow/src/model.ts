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
import * as dag from 'dag-iterator';
import {Array1D, Array3D, ENV, Model, NDArray, NDArrayMath} from 'deeplearn';

import {getTensorParam, tensorflow, tensorToNDArray} from './index';
import {performMathOp} from './node';
import * as types from './types';

export class TensorflowModel implements Model {
  /**
   * Model weights per layer
   */
  protected variables: {[varName: string]: NDArray[]};

  /**
   * Model DAG Nodes
   */
  nodes: Array<dag.INode<tensorflow.INodeDef>>;

  /**
   * Model DAG Edges
   */
  edges: dag.IEdge[];

  /**
   * Model weight map
   */
  weights: {[key: string]: NDArray} = {};
  /**
   * Constructor
   * @param caffemodelUrl url to the caffemodel file
   * @param prototxtUrl url to the prototxt file
   */
  constructor(
      private modelFilePromise: Promise<tensorflow.IGraphDef>,
      private math: NDArrayMath = ENV.math) {}
  /**
   * Load the model
   */
  load() {
    return this.modelFilePromise.then(model => {
      this.nodes = this.nodesToDagNodes(model);
      this.edges = this.nodesToDagEdges(model);
      this.loadWeights();
      console.log(`node size = ${this.nodes.length}`);
    });
  }

  private nodesToDagNodes(graph: tensorflow.IGraphDef):
      Array<dag.INode<tensorflow.INodeDef>> {
    return graph.node.map(node => {
      return {name: node.name, data: node};
    });
  }

  private nodesToDagEdges(graph: tensorflow.IGraphDef): dag.IEdge[] {
    const nodes = graph.node;
    const edges: dag.IEdge[] = [];
    const edgeSet: {[edgeId: string]: boolean} = {};
    const getEdgeId = (a: string|string[], b: string|string[]) => `${a}:#:${b}`;

    nodes.forEach((d) => {
      if (!!d.input) {
        const inputs = d.input instanceof Array ? d.input : [d.input];
        inputs.forEach((nodeName) => {
          if (!edgeSet.hasOwnProperty(getEdgeId(nodeName, d.name))) {
            edges.push({src: nodeName, dst: d.name} as dag.IEdge);
            edgeSet[getEdgeId(nodeName, d.name)] = true;
          }
        });
      }
    });

    return edges;
  }

  private loadWeights() {
    this.nodes.forEach((node) => {
      if (node.data.op === 'Const') {
        const constParam = node.data.attr;
        const tensor = getTensorParam(
            constParam, 'value',
            {tensorShape: {dim: []}, dtype: tensorflow.DataType.DT_INT32});
        this.weights[node.data.name] = tensorToNDArray(tensor);
      }
    });
  }

  /**
   * Generate the prediction for the input using the loaded model.
   * For model with multiple inputs, feedDict map should be used to bind the
   * inputs to the placeholder nodes.
   * @param feedDict map of inputs or a single input
   * @param untilLayer run prediction until a particular node identified by the
   *    node name.
   */
  predict(feedDict: types.InputMap|NDArray, untilLayer?: string): NDArray
      |undefined {
    // default the single input to the name of 'input'
    if (feedDict instanceof NDArray) {
      feedDict = {'input': feedDict};
    }
    // Keep a map of named activations for rendering purposes.
    const namedActivations: {[key: string]: NDArray} = {};
    let currAct: NDArray|NDArray[] = undefined;

    this.math.scope(() => {
      dag.iterateDfs<tensorflow.INodeDef>(
          this.nodes, this.edges,
          (node: tensorflow.INodeDef, parents: tensorflow.INodeDef[],
           i: number) => {
            if (parents.length === 1) {
              currAct = namedActivations[parents[0].name];
            } else if (parents.length > 1) {
              currAct = parents.map((d) => namedActivations[d.name]);
            }
            currAct = performMathOp(
                this.math, currAct, node, feedDict as types.InputMap,
                this.weights);

            namedActivations[node.name] = currAct as NDArray;
          },
          untilLayer);
      return currAct;
    });

    return currAct as NDArray;
  }

  layers(): types.Layer[] {
    const layers: types.Layer[] = [];
    dag.iterate<tensorflow.INodeDef>(
        this.nodes, this.edges,
        (node: tensorflow.INodeDef, parents: tensorflow.INodeDef[], i: number,
         layer: number) => {
          if (!layers[layer]) {
            layers[layer] = {nodes: []};
          }
          layers[layer].nodes.push(
              {node: node.name, parents: parents.map((p) => p.name)});
        });
    return layers;
  }

  dispose() {
    for (const weightName in this.weights) {
      this.weights[weightName].dispose();
    }
  }
}
