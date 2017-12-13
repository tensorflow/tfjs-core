import {caffe} from 'caffe-proto';
import * as dag from 'dag-iterator';
import {getLayersFromModel} from './layer';
import {isNotNull} from './util';

interface ISimpleNode {
  input: string|string[];
  output: string|string[];
  name: string
};

export function hasExplicitInputLayer(model: caffe.NetParameter, layers: caffe.LayerParameter[]) { 
  return !isNotNull(model.input) || (layers[0] && layers[0].type.toLowerCase() == 'input');
}

export function layersToDagNodes(model: caffe.NetParameter): dag.INode<caffe.ILayerParameter>[] {
  const flatten = (arr: any) => [].concat(arr)[0];
  const layers = getLayersFromModel(model) as caffe.LayerParameter[];

  // Model has no explicit input data layer, but implicit input definition
  if (!hasExplicitInputLayer(model, layers)) {
    const blobShape: caffe.IBlobShape = isNotNull(model.inputShape)
      ? flatten(model.inputShape) as caffe.IBlobShape
      : caffe.BlobShape.create({dim: model.inputDim});
    const inp = caffe.InputParameter.create({shape: [].concat(blobShape)});
    const layer = caffe.LayerParameter.create({name: 'data', type: 'Input', inputParam: inp});
    layers.splice(0, 0, layer);
  }

  return layers.map((d) => {
    return { name: d.name, data: d } as dag.INode<caffe.ILayerParameter>;
  });
}

export function layersToDagEdges(model: caffe.NetParameter): dag.IEdge[] {
  const layers = getLayersFromModel(model) as caffe.LayerParameter[];
  const edges: dag.IEdge[] = [];
  const edgeSet: {[edgeId: string]: boolean} = {};
  const getEdgeId = (a: string|string[], b:string|string[]) => `${a}:#:${b}`;

  let lm = layers.map(function(d) {
    return {input: d.bottom, output: d.top, name: d.name} as ISimpleNode;
  });

  lm.filter((d) => d.input !== undefined && d.input !== d.output)
    .forEach((d) => {
      if (!Array.isArray(d.input)) {
        edges.push({ src: d.input, dst: d.output } as dag.IEdge);
      }
      else {
        d.input.forEach((layerName) => {
          if (!edgeSet.hasOwnProperty(getEdgeId(layerName, d.output))) {
            edges.push({ src: layerName, dst: d.output } as dag.IEdge);
            edgeSet[getEdgeId(layerName, d.output)] = true;
          }
        });
      }
    });

  lm.filter((d) => d.input !== undefined && d.input === d.output)
    .forEach((d) => {
      edges
        .filter((edge) => edge.src === d.input)
        .forEach((edge) => {
          edge.src = d.name;
          if (!edgeSet.hasOwnProperty(getEdgeId(d.input,  d.name))) {
            edges.push({ src: d.input, dst: d.name } as dag.IEdge);
            edgeSet[getEdgeId(d.input, d.name)] = true;
          }
        })
    });

  return edges;
}