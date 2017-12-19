
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

import * as test_util from '../../test_util';
import {MathTests} from '../../test_util';
import {NDArray, Scalar} from '../ndarray';

import {MathBackendCPU} from './backend_cpu';
import {NameArrayMap, TapeNode, TapeNodeOutput} from './tape_types';
import * as tape_util from './tape_util';

// getFilteredNodesXToY
{
  const tests: MathTests = it => {
    it('getFilteredNodesXToY no paths from x to y', math => {
      const x = Scalar.new(1);
      const intermediate1 = Scalar.new(0);

      const intermediate2 = Scalar.new(0);
      const y = Scalar.new(2);

      const tapeNodes: Array<TapeNode<NDArray>> = [
        {
          id: 0,
          name: 'node0',
          inputAndArgs: {
            inputs: {x},
          },
          output: intermediate1,
          gradient: null
        },
        {
          id: 1,
          name: 'node1',
          inputAndArgs: {
            inputs: {intermediate2},
          },
          output: y,
          gradient: null
        }
      ];

      const filteredTapeNodes =
          tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

      expect(filteredTapeNodes.length).toBe(0);
      expect(filteredTapeNodes).toEqual([]);
    });

    it('getFilteredNodesXToY one operation x => y', math => {
      const x = Scalar.new(1);
      const y = Scalar.new(2);

      const tapeNodes: Array<TapeNode<NDArray>> = [{
        id: 0,
        name: 'node0',
        inputAndArgs: {
          inputs: {x},
        },
        output: y,
        gradient: null
      }];

      const filteredTapeNodes =
          tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

      expect(filteredTapeNodes.length).toBe(1);
      expect(filteredTapeNodes).toEqual(tapeNodes);
    });

    it('getFilteredNodesXToY 1 operation [x0, x1] => y, all input paths',
       math => {
         const x0 = Scalar.new(0);
         const x1 = Scalar.new(1);
         const y = Scalar.new(2);

         const tapeNodes: Array<TapeNode<NDArray>> = [{
           id: 0,
           name: 'node0',
           inputAndArgs: {
             inputs: {x0, x1},
           },
           output: y,
           gradient: null
         }];

         const filteredTapeNodes =
             tape_util.getFilteredNodesXToY(tapeNodes, [x0, x1], y);

         expect(filteredTapeNodes.length).toBe(1);
         expect(filteredTapeNodes).toEqual(tapeNodes);
       });

    it('getFilteredNodesXToY one operation [x0, x1] => y, one input paths',
       math => {
         const x0 = Scalar.new(0);
         const x1 = Scalar.new(1);
         const y = Scalar.new(2);

         const tapeNodes: Array<TapeNode<NDArray>> = [{
           id: 0,
           name: 'node0',
           inputAndArgs: {
             inputs: {x0, x1},
           },
           output: y,
           gradient: null
         }];

         const filteredTapeNodes =
             tape_util.getFilteredNodesXToY(tapeNodes, [x0], y);

         expect(filteredTapeNodes.length).toBe(1);
         // x1 input should be pruned, we don't ask for the gradient of x1.
         expect(filteredTapeNodes[0]).toEqual({
           id: 0,
           name: 'node0',
           inputAndArgs: {
             inputs: {x0},
           },
           output: y,
           gradient: null
         });
       });

    it('getFilteredNodesXToY two operations x => intermediate => y', math => {
      const x = Scalar.new(1);
      const intermediate = Scalar.new(0);
      const y = Scalar.new(2);

      const tapeNodes: Array<TapeNode<NDArray>> = [
        {
          id: 0,
          name: 'node0',
          inputAndArgs: {
            inputs: {x},
          },
          output: intermediate,
          gradient: null
        },
        {
          id: 1,
          name: 'node1',
          inputAndArgs: {
            inputs: {intermediate},
          },
          output: y,
          gradient: null
        }
      ];

      const filteredTapeNodes =
          tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

      expect(filteredTapeNodes.length).toBe(2);
      expect(filteredTapeNodes).toEqual(tapeNodes);
    });

    it('getFilteredNodesXToY two operations [x0, x1], [x2] => ' +
           'intermediate => y',
       math => {
         const x0 = Scalar.new(1);
         const x1 = Scalar.new(2);
         const x2 = Scalar.new(3);
         const intermediate = Scalar.new(4);
         const y = Scalar.new(2);

         const tapeNodes: Array<TapeNode<NDArray>> = [
           {
             id: 0,
             name: 'node0',
             inputAndArgs: {
               inputs: {x0, x1},
             },
             output: intermediate,
             gradient: null
           },
           {
             id: 1,
             name: 'node1',
             inputAndArgs: {
               inputs: {x2, intermediate},
             },
             output: y,
             gradient: null
           }
         ];

         const filteredTapeNodes =
             tape_util.getFilteredNodesXToY(tapeNodes, [x0, x1, x2], y);

         expect(filteredTapeNodes.length).toBe(2);
         expect(filteredTapeNodes).toEqual(tapeNodes);
       });

    it('getFilteredNodesXToY x => y and x => orphan', math => {
      const x = Scalar.new(1);
      const orphan = Scalar.new(0);
      const y = Scalar.new(2);

      const tapeNodes: Array<TapeNode<NDArray>> = [
        {
          id: 0,
          name: 'node0',
          inputAndArgs: {
            inputs: {x},
          },
          output: orphan,
          gradient: null
        },
        {
          id: 1,
          name: 'node1',
          inputAndArgs: {
            inputs: {x},
          },
          output: y,
          gradient: null
        }
      ];

      const filteredTapeNodes =
          tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

      expect(filteredTapeNodes.length).toBe(1);
      // The orphan should be removed.
      expect(filteredTapeNodes[0]).toEqual(tapeNodes[1]);
    });

    it('getFilteredNodesXToY x => y and orphan => y', math => {
      const x = Scalar.new(1);
      const orphan = Scalar.new(0);
      const y = Scalar.new(2);

      const tapeNodes: Array<TapeNode<NDArray>> = [{
        id: 0,
        name: 'node0',
        inputAndArgs: {
          inputs: {x, orphan},
        },
        output: y,
        gradient: null
      }];

      const filteredTapeNodes =
          tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

      expect(filteredTapeNodes.length).toBe(1);
      // The orphan should be pruned from the node's input.
      expect(filteredTapeNodes[0]).toEqual({
        id: 0,
        name: 'node0',
        inputAndArgs: {
          inputs: {x},
        },
        output: y,
        gradient: null
      });
    });

    it('getFilteredNodesXToY x => {intermediate, orphan1} and ' +
           '{orphan2, intermediate} => {y, orphan3}',
       math => {
         const x = Scalar.new(1);
         const intermediate = Scalar.new(5);
         const orphan1 = Scalar.new(1);
         const orphan2 = Scalar.new(2);
         const orphan3 = Scalar.new(3);
         const y = Scalar.new(2);

         const tapeNodes: Array<TapeNode<TapeNodeOutput>> = [
           {
             id: 0,
             name: 'node0',
             inputAndArgs: {
               inputs: {x},
             },
             output: {orphan1, intermediate},
             gradient: null
           },
           {
             id: 1,
             name: 'node1',
             inputAndArgs: {
               inputs: {intermediate, orphan2},
             },
             output: {y, orphan3},
             gradient: null
           }
         ];

         const filteredTapeNodes =
             tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

         expect(filteredTapeNodes.length).toBe(2);
         // The orphans should be pruned from inputs and outputs.
         expect(filteredTapeNodes[0]).toEqual({
           id: 0,
           name: 'node0',
           inputAndArgs: {
             inputs: {x},
           },
           output: {intermediate},
           gradient: null
         });
         expect(filteredTapeNodes[1]).toEqual({
           id: 1,
           name: 'node1',
           inputAndArgs: {
             inputs: {intermediate},
           },
           output: {y},
           gradient: null
         });
       });

    it('getFilteredNodesXToY x0 => orphan0, ' +
           'x0 => intermediate0, x0 => intermediate1, ' +
           '[intermediate0, intermediate1, x1, orphan1] => {y, orphan2}',
       math => {
         const x0 = Scalar.new(1);
         const orphan0 = Scalar.new(2);

         const intermediate0 = Scalar.new(3);
         const intermediate1 = Scalar.new(4);

         const x1 = Scalar.new(5);
         const orphan1 = Scalar.new(6);
         const y = Scalar.new(7);
         const orphan2 = Scalar.new(8);

         const tapeNodes: Array<TapeNode<TapeNodeOutput>> = [
           {
             id: 0,
             name: 'node0',
             inputAndArgs: {
               inputs: {x0},
             },
             output: intermediate0,
             gradient: null
           },
           {
             id: 1,
             name: 'node1',
             inputAndArgs: {
               inputs: {x0},
             },
             output: intermediate1,
             gradient: null
           },
           {
             id: 2,
             name: 'node2',
             inputAndArgs: {
               inputs: {x0},
             },
             output: orphan0,
             gradient: null
           },
           {
             id: 3,
             name: 'node3',
             inputAndArgs: {
               inputs: {intermediate0, intermediate1, x1, orphan1},
             },
             output: {y, orphan2},
             gradient: null
           }
         ];

         const filteredTapeNodes =
             tape_util.getFilteredNodesXToY(tapeNodes, [x0, x1], y);

         expect(filteredTapeNodes.length).toBe(3);
         expect(filteredTapeNodes[0]).toEqual(tapeNodes[0]);
         expect(filteredTapeNodes[1]).toEqual(tapeNodes[1]);
         // The orphans should be removed and the orphan1 should be pruned from
         // inputs.
         expect(filteredTapeNodes[2]).toEqual({
           id: 3,
           name: 'node3',
           inputAndArgs: {
             inputs: {intermediate0, intermediate1, x1},
           },
           output: {y},
           gradient: null
         });
       });
  };

  test_util.describeMathCPU('tape_util.getFilteredNodesXToY', [tests]);
}

// backpropagateGradients
{
  const tests: MathTests = it => {
    it('Throws if gradient is not defined', math => {
      const backend = new MathBackendCPU();

      const x = Scalar.new(0);
      const y = Scalar.new(1);

      const dy = Scalar.new(1);

      const accumulatedGradientsMap: {[ndarrayId: number]: NDArray} = {};
      accumulatedGradientsMap[y.id] = dy;

      const tapeNodes: Array<TapeNode<NDArray>> = [{
        id: 0,
        name: 'node0',
        inputAndArgs: {
          inputs: {x},
        },
        output: y,
        gradient: null
      }];

      expect(
          () => tape_util.backpropagateGradients(
              backend, accumulatedGradientsMap, tapeNodes))
          .toThrowError();
    });

    it('basic backprop with 1 node', math => {
      const backend = new MathBackendCPU();

      const x = Scalar.new(0);
      const y = Scalar.new(1);

      const dy = Scalar.new(1);

      const accumulatedGradientsMap: {[ndarrayId: number]: NDArray} = {};
      accumulatedGradientsMap[y.id] = dy;

      const tapeNodes: Array<TapeNode<NDArray>> = [{
        id: 0,
        name: 'node0',
        inputAndArgs: {
          inputs: {x},
        },
        output: y,
        gradient: (dy: Scalar, y: Scalar) => {
          return {x: () => backend.add(dy, Scalar.new(1))};
        }
      }];

      tape_util.backpropagateGradients(
          backend, accumulatedGradientsMap, tapeNodes);

      test_util.expectArraysClose(
          accumulatedGradientsMap[x.id].dataSync(), new Float32Array([2]));
    });

    it('basic backprop with 2 nodes', math => {
      const backend = new MathBackendCPU();

      const x = Scalar.new(0);
      const intermediate = Scalar.new(1);
      const y = Scalar.new(2);

      const dy = Scalar.new(1);

      const accumulatedGradientsMap: {[ndarrayId: number]: NDArray} = {};
      accumulatedGradientsMap[y.id] = dy;

      const tapeNodes: Array<TapeNode<NDArray>> = [
        {
          id: 0,
          name: 'node0',
          inputAndArgs: {
            inputs: {x},
          },
          output: intermediate,
          gradient: (dy: Scalar, y: Scalar) => {
            return {x: () => backend.add(dy, Scalar.new(1))};
          }
        },
        {
          id: 1,
          name: 'node1',
          inputAndArgs: {
            inputs: {intermediate},
          },
          output: y,
          gradient: (dy: Scalar, y: Scalar) => {
            return {intermediate: () => backend.add(dy, Scalar.new(1))};
          }
        }
      ];

      tape_util.backpropagateGradients(
          backend, accumulatedGradientsMap, tapeNodes);

      // dx = dy + 1 + 1
      test_util.expectArraysClose(
          accumulatedGradientsMap[x.id].dataSync(), new Float32Array([3]));
    });

    it('basic backprop with a split node accumulates gradients', math => {
      const backend = new MathBackendCPU();

      const x = Scalar.new(0);
      const intermediate1 = Scalar.new(1);
      const intermediate2 = Scalar.new(2);
      const y = Scalar.new(3);

      const dy = Scalar.new(1);

      const accumulatedGradientsMap: {[ndarrayId: number]: NDArray} = {};
      accumulatedGradientsMap[y.id] = dy;

      const tapeNodes: Array<TapeNode<NDArray>> = [
        {
          id: 0,
          name: 'node0',
          inputAndArgs: {
            inputs: {x},
          },
          output: intermediate1,
          gradient: (dy: Scalar, y: Scalar) => {
            return {x: () => backend.add(dy, Scalar.new(1))};
          }
        },
        {
          id: 1,
          name: 'node1',
          inputAndArgs: {
            inputs: {x},
          },
          output: intermediate2,
          gradient: (dy: Scalar, y: Scalar) => {
            return {x: () => backend.add(dy, Scalar.new(1))};
          }
        },
        {
          id: 2,
          name: 'node2',
          inputAndArgs: {
            inputs: {intermediate1, intermediate2},
          },
          output: y,
          gradient: (dy: Scalar, y: Scalar) => {
            return {
              intermediate1: () => backend.add(dy, Scalar.new(1)),
              intermediate2: () => backend.add(dy, Scalar.new(1))
            };
          }
        }
      ];

      tape_util.backpropagateGradients(
          backend, accumulatedGradientsMap, tapeNodes);

      // dx = dy + 1 + 1 + 1 + 1 + 1
      test_util.expectArraysClose(
          accumulatedGradientsMap[x.id].dataSync(),
          new Float32Array([dy.dataSync()[0] + 5]));
    });

    it('basic backprop with a multi-output split node accumulates gradients',
       math => {
         const backend = new MathBackendCPU();

         const x = Scalar.new(0);
         const intermediate1 = Scalar.new(1);
         const intermediate2 = Scalar.new(2);
         const y = Scalar.new(3);

         const dy = Scalar.new(1);

         const accumulatedGradientsMap: {[ndarrayId: number]: NDArray} = {};
         accumulatedGradientsMap[y.id] = dy;

         const tapeNodes: Array<TapeNode<TapeNodeOutput>> = [
           {
             id: 0,
             name: 'node0',
             inputAndArgs: {
               inputs: {x},
             },
             output: {intermediate1, intermediate2},
             gradient: (dy: NameArrayMap, y: NameArrayMap) => {
               return {
                 x: () =>
                     backend.multiply(dy['intermediate1'], dy['intermediate2'])
               };
             }
           },
           {
             id: 1,
             name: 'node1',
             inputAndArgs: {
               inputs: {intermediate1, intermediate2},
             },
             output: y,
             gradient: (dy: Scalar, y: Scalar) => {
               return {
                 intermediate1: () => backend.add(dy, Scalar.new(2)),
                 intermediate2: () => backend.add(dy, Scalar.new(3))
               };
             }
           }
         ];

         tape_util.backpropagateGradients(
             backend, accumulatedGradientsMap, tapeNodes);

         test_util.expectArraysClose(
             accumulatedGradientsMap[x.id].dataSync(),
             new Float32Array([(dy.get() + 2) * (dy.get() + 3)]));
       });
  };

  test_util.describeMathCPU('tape_util.backpropagateGradients', [tests]);
}
