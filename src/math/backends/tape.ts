import {ENV} from '../../environment';
import {NDArray, Scalar} from '../ndarray';

import {KernelNode, TapeNode} from './kernel_config';

export class Tape {
  private evaluatedTapeNodes: TapeNode[] = [];

  private outputNodeMap: {[id: number]: TapeNode} = {};

  addEvaluatedNode(node: KernelNode) {
    this.outputNodeMap[node.output.id] = node;
    this.evaluatedTapeNodes.push(node);
  }

  gradientWrt<T extends NDArray>(y: Scalar, x: T): T {
    let outputNode = this.outputNodeMap[y.id];
    if (outputNode == null) {
      throw new Error(`Cannot compute gradient: y is not part of this tape.`);
    }

    // TODO
    // Filter out the nodes that don't connect x => y.
    // const filteredEntries = getFilteredNodesXToY(y, x);

    const arrayGradientMap: {[ndarrayId: number]: NDArray} = {};
    arrayGradientMap[y.id] = Scalar.new(1);

    const filteredNodes = this.evaluatedTapeNodes.slice();
    console.log(filteredNodes);

    // Walk the tape backwards and keep a map of NDArray to its gradient.
    for (let i = filteredNodes.length - 1; i >= 0; i--) {
      console.log('~~~~~~~NODE ID: ' + i);
      const node = filteredNodes[i];

      for (const ins in node.inputAndArgs.inputs) {
        console.log('....' + ins + ' = ' + node.inputAndArgs.inputs[ins].id);
      }
      const dy = arrayGradientMap[node.output.id];

      if (node.gradient == null) {
        throw new Error(`Gradient not found for ${node}.`);
      }

      const inputGradients = node.gradient(dy, node.output);
      for (const inputName in inputGradients) {
        console.log('grads', inputName, inputGradients);
        const grad = inputGradients[inputName];
        const activation = node.inputAndArgs.inputs[inputName];
        console.log('grad id: ' + grad.id);
        // if (arrayGradientMap[activation.id] == null) {
        arrayGradientMap[activation.id] = inputGradients[inputName];
        //} else {
        // const curGradient = arrayGradientMap[grad.id];
        // arrayGradientMap[grad.id] = ENV.math.add(
        //    arrayGradientMap[grad.id], inputGradients[inputName]);
        // curGradient.dispose();
        //}
      }
    }
    console.log(arrayGradientMap, x.id);
    return arrayGradientMap[x.id] as T;
  }
}

// function getFilteredNodesXToY<T extends NDArray>(
//     tapeEntries: TapeEntry[], y: Scalar, x: T): T {
//   for (let i = 0; i < tapeEntries.length; i++) {
//   }
// }
