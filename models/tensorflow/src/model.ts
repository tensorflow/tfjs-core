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

import {tensorflow} from './index';
import {performMathOp} from './node';
import * as types from './types';

export class TensorflowModel implements Model {
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
  nodes: Array<dag.INode<tensorflow.INodeDef>>;

  /**
   * Model DAG Edges
   */
  edges: dag.IEdge[];

  /**
   * Constructor
   * @param caffemodelUrl url to the caffemodel file
   * @param prototxtUrl url to the prototxt file
   */
  constructor(
      private modelFilePromise: Promise<tensorflow.IGraphDef>,
      private math: NDArrayMath = ENV.math) {}
  private totalOpTime: {[key: string]: number} = {};
  private opCount: {[key: string]: number} = {};
  /**
   * Load the model
   */
  load() {
    return this.modelFilePromise.then(model => {
      this.nodes = this.nodesToDagNodes(model);
      this.edges = this.nodesToDagEdges(model);
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

  predict(
      input: NDArray, feedDict?: {[key: string]: NDArray},
      untilLayer?: string): NDArray {
    // Keep a map of named activations for rendering purposes.
    const namedActivations: {[key: string]: NDArray} = {};
    let currAct: NDArray|NDArray[] = input;

    dag.iterate<tensorflow.INodeDef>(
        this.nodes, this.edges,
        (node: tensorflow.INodeDef, parents: tensorflow.INodeDef[],
         i: number) => {
          if (parents.length === 1) {
            currAct = namedActivations[parents[0].name];
          } else if (parents.length > 1) {
            currAct = parents.map((d) => namedActivations[d.name]);
          }
          const startTime = new Date().getTime();
          console.time(node.name + ':' + node.op);
          currAct = performMathOp(this.math, currAct, node, feedDict);
          console.timeEnd(node.name + ':' + node.op);
          const endTime = new Date().getTime();

          this.totalOpTime[node.op] =
              (this.totalOpTime[node.op] || 0.) + endTime - startTime;

          this.opCount[node.op] = (this.opCount[node.op] || 0) + 1;

          namedActivations[node.name] = currAct as NDArray;
        },
        untilLayer);

    for (const key in this.totalOpTime) {
      console.log(`${key} : ${this.totalOpTime[key] / this.opCount[key]} : ${
          this.totalOpTime[key]} : ${this.opCount[key]}`);
    }
    return currAct;
  }

  layers(): types.Layer[] {
    const layers: types.Layer[] = [];
    dag.iterate<tensorflow.INodeDef>(
        this.nodes, this.edges,
        (node: tensorflow.INodeDef, parents: tensorflow.INodeDef[],
         i: number) => {
          if (!layers[i]) {
            layers[i] = {nodes: []};
          }
          layers[i].nodes.push(
              {node: node.name, parents: parents.map((p) => p.name)});
        });
    return layers;
  }

  dispose() {
    this.preprocessOffset.dispose();
    for (const varName in this.variables) {
      this.variables[varName].map((d) => d.dispose());
    }
  }
}
