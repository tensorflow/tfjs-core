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

import {NDArray} from '../ndarray';

import {TapeNode} from './kernel_config';

/**
 * Computes a list of TapeNodes that connect x to y, filtering everything else
 * out and preserving the order of the original tape elements.
 * @param tapeNodes The tape elements to filter.
 * @param xx The input NDArrays.
 * @param y The output NDArray.
 */
export function getFilteredNodesXToY(
    tapeNodes: TapeNode[], xs: NDArray[], y: NDArray): TapeNode[] {
  // Forward pass to compute all the nodes that are transitively a function of
  // x. Note that because we assume that all Nodes have a single output NDArray,
  // we can use these interchangably.
  const arraysFromX: {[ndarrayId: number]: boolean} = {};
  for (let i = 0; i < tapeNodes.length; i++) {
    const node = tapeNodes[i];
    const nodeInputs = node.inputAndArgs.inputs;

    for (const inputName in nodeInputs) {
      const input = nodeInputs[inputName];

      for (let j = 0; j < xs.length; j++) {
        if (input.id === xs[j].id || arraysFromX[input.id] === true) {
          arraysFromX[node.output.id] = true;
          break;
        }
      }

      if (arraysFromX[node.output.id]) {
        break;
      }
    }
  }

  // Backwards pass to find all of the nodes that lead to y.
  const arraysLeadToY: {[ndarrayId: number]: boolean} = {};
  arraysLeadToY[y.id] = true;

  for (let i = tapeNodes.length - 1; i >= 0; i--) {
    const node = tapeNodes[i];
    const nodeInputs = node.inputAndArgs.inputs;

    if (arraysLeadToY[node.output.id]) {
      for (const inputName in nodeInputs) {
        arraysLeadToY[nodeInputs[inputName].id] = true;
      }
    }
  }

  // Return the paths that come from x and lead to y.
  const filteredTapeNodes: TapeNode[] = [];
  for (let i = 0; i < tapeNodes.length; i++) {
    const node = tapeNodes[i];
    if (arraysFromX[node.output.id] && arraysLeadToY[node.output.id]) {
      filteredTapeNodes.push(node);
    }
  }

  return filteredTapeNodes;
}
