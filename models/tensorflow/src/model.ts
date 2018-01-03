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
import {Array1D, Array3D, ENV, Model, NDArray} from 'deeplearn';

import {performMathOp} from './node';
import * as types from './types';
import * as util from './util';

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
  nodes: Array<dag.INode<types.Node>>;

  /**
   * Model DAG Edges
   */
  edges: dag.IEdge[];

  /**
   * Constructor
   * @param caffemodelUrl url to the caffemodel file
   * @param prototxtUrl url to the prototxt file
   */
  constructor(private modelFilePromise: Promise<types.Graph>) {}

  /**
   * Load the model
   */
  load() {
    return this.modelFilePromise.then(model => {
      this.nodes = this.nodesToDagNodes(model);
      this.edges = this.nodesToDagEdges(model);
      console.log(this.nodes.length);
    });
  }

  private nodesToDagNodes(graph: types.Graph): Array<dag.INode<types.Node>> {
    return graph.node.map(node => {
      return {name: node.name, data: node};
    });
  }

  private nodesToDagEdges(graph: types.Graph): dag.IEdge[] {
    const nodes = graph.node;
    const edges: dag.IEdge[] = [];
    const edgeSet: {[edgeId: string]: boolean} = {};
    const getEdgeId = (a: string|string[], b: string|string[]) => `${a}:#:${b}`;

    nodes.forEach((d) => {
      if (d.op === 'Const' && d.attr[1]['value']['tensor']['tensor_content']) {
        const str =
            util.unescape(d.attr[1]['value']['tensor']['tensor_content']);
        const uint = new Uint8Array(str.length);
        for (let i = 0, j = str.length; i < j; ++i) {
          uint[i] = str.charCodeAt(i);
        }
        console.log('length = ' + uint.length);
        const values = new Float32Array(uint.buffer);
        console.log('length = ' + values.length);
        values.forEach(v => console.log(v));
      }
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

  predict(input: NDArray, untilLayer?: string): NDArray {
    const math = ENV.math;

    // Keep a map of named activations for rendering purposes.
    const namedActivations: {[key: string]: NDArray} = {};
    let currAct: NDArray|NDArray[] = input;

    dag.iterate<types.Node>(
        this.nodes,
        this.edges, (node: types.Node, parents: types.Node[], i: number) => {
          if (i === 0 && this.preprocessOffset) {
            currAct = math.subtract(
                          currAct as Array3D, this.preprocessOffset) as Array3D;
          } else if (parents.length === 1) {
            currAct = namedActivations[parents[0].name];
          } else if (parents.length > 1) {
            currAct = parents.map((d) => namedActivations[d.name]);
          }

          currAct = performMathOp(math, currAct, node);

          namedActivations[node.name] = currAct as NDArray;
        }, untilLayer);

    return currAct;
  }

  layers(): types.Layer[] {
    const layers: types.Layer[] = [];
    dag.iterate<types.Node>(
        this.nodes, this.edges,
        (node: types.Node, parents: types.Node[], i: number) => {
          console.log(node, parents, i);
          if (!layers[i]) {
            layers[i] = {nodes: []};
          }
          layers[i].nodes.unshift(
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
