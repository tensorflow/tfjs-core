import {NDArray, Scalar} from '../ndarray';

import {KernelNode} from './kernel_config';

type TapeElement = KernelNode|Tape;

export class Tape {
  private evaluatedKernelNodes: TapeElement[] = [];

  private outputNodeMap: {[id: number]: TapeElement};

  addEvaluatedNode(node: KernelNode) {
    this.outputNodeMap[node.output.id] = node;
    this.evaluatedKernelNodes.push(node);
  }

  gradientWrt<T extends NDArray>(y: Scalar, x: T): T {
    let outputNode = this.outputNodeMap[y.id];
    if (outputNode == null) {
      throw new Error(`Cannot compute gradient: y is not part of this tape.`);
    }
  }
}
