
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
import {Scalar} from '../ndarray';
import {TapeNode} from './kernel_config';
import * as tape_util from './tape_util';

const tests: MathTests = it => {
  it('getFilteredNodesXToY no paths from x to y', math => {
    const x = Scalar.new(1);
    const intermediate1 = Scalar.new(0);

    const intermediate2 = Scalar.new(0);
    const y = Scalar.new(2);

    const tapeNodes: TapeNode[] = [
      {
        inputAndArgs: {
          inputs: {x},
        },
        output: intermediate1,
        gradient: null
      },
      {
        inputAndArgs: {
          inputs: {intermediate2},
        },
        output: y,
        gradient: null
      }
    ];

    const filteredTapeNodes = tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

    expect(filteredTapeNodes.length).toBe(0);
    expect(filteredTapeNodes).toEqual([]);
  });

  it('getFilteredNodesXToY one operation x => y', math => {
    const x = Scalar.new(1);
    const y = Scalar.new(2);

    const tapeNodes: TapeNode[] = [{
      inputAndArgs: {
        inputs: {x},
      },
      output: y,
      gradient: null
    }];

    const filteredTapeNodes = tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

    expect(filteredTapeNodes.length).toBe(1);
    expect(filteredTapeNodes).toEqual(tapeNodes);
  });

  it('getFilteredNodesXToY 1 operation [x0, x1] => y, all input paths',
     math => {
       const x0 = Scalar.new(0);
       const x1 = Scalar.new(1);
       const y = Scalar.new(2);

       const tapeNodes: TapeNode[] = [{
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

       const tapeNodes: TapeNode[] = [{
         inputAndArgs: {
           inputs: {x0, x1},
         },
         output: y,
         gradient: null
       }];

       const filteredTapeNodes =
           tape_util.getFilteredNodesXToY(tapeNodes, [x0], y);

       expect(filteredTapeNodes.length).toBe(1);
       expect(filteredTapeNodes).toEqual(tapeNodes);
     });

  it('getFilteredNodesXToY two operations x => intermediate => y', math => {
    const x = Scalar.new(1);
    const intermediate = Scalar.new(0);
    const y = Scalar.new(2);

    const tapeNodes: TapeNode[] = [
      {
        inputAndArgs: {
          inputs: {x},
        },
        output: intermediate,
        gradient: null
      },
      {
        inputAndArgs: {
          inputs: {intermediate},
        },
        output: y,
        gradient: null
      }
    ];

    const filteredTapeNodes = tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

    expect(filteredTapeNodes.length).toBe(2);
    expect(filteredTapeNodes).toEqual(tapeNodes);
  });

  it('getFilteredNodesXToY two operations [x0, x1], [x2] => intermediate => y',
     math => {
       const x0 = Scalar.new(1);
       const x1 = Scalar.new(2);
       const x2 = Scalar.new(3);
       const intermediate = Scalar.new(4);
       const y = Scalar.new(2);

       const tapeNodes: TapeNode[] = [
         {
           inputAndArgs: {
             inputs: {x0, x1},
           },
           output: intermediate,
           gradient: null
         },
         {
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

    const tapeNodes: TapeNode[] = [
      {
        inputAndArgs: {
          inputs: {x},
        },
        output: orphan,
        gradient: null
      },
      {
        inputAndArgs: {
          inputs: {x},
        },
        output: y,
        gradient: null
      }
    ];

    const filteredTapeNodes = tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

    expect(filteredTapeNodes.length).toBe(1);
    // The orphan should be removed.
    expect(filteredTapeNodes[0]).toEqual(tapeNodes[1]);
  });

  it('getFilteredNodesXToY x => y and orphan => y', math => {
    const x = Scalar.new(1);
    const orphan = Scalar.new(0);
    const y = Scalar.new(2);

    const tapeNodes: TapeNode[] = [{
      inputAndArgs: {
        inputs: {x, orphan},
      },
      output: y,
      gradient: null
    }];

    const filteredTapeNodes = tape_util.getFilteredNodesXToY(tapeNodes, [x], y);

    expect(filteredTapeNodes.length).toBe(1);
    // The orphan should be removed.
    expect(filteredTapeNodes[0]).toEqual(tapeNodes[0]);
  });

  it('getFilteredNodesXToY x0 => orphan0, ' +
         'x0 => intermediate0, x0 => intermediate1, ' +
         '[intermediate0, intermediate1, x1, orphan1] => y',
     math => {
       const x0 = Scalar.new(1);
       const orphan0 = Scalar.new(2);

       const intermediate0 = Scalar.new(3);
       const intermediate1 = Scalar.new(4);

       const x1 = Scalar.new(5);
       const orphan1 = Scalar.new(6);
       const y = Scalar.new(7);

       const tapeNodes: TapeNode[] = [
         {
           inputAndArgs: {
             inputs: {x0},
           },
           output: intermediate0,
           gradient: null
         },
         {
           inputAndArgs: {
             inputs: {x0},
           },
           output: intermediate1,
           gradient: null
         },
         {
           inputAndArgs: {
             inputs: {x0},
           },
           output: orphan0,
           gradient: null
         },
         {
           inputAndArgs: {
             inputs: {intermediate0, intermediate1, x1, orphan1},
           },
           output: y,
           gradient: null
         }
       ];

       const filteredTapeNodes =
           tape_util.getFilteredNodesXToY(tapeNodes, [x0, x1], y);

       expect(filteredTapeNodes.length).toBe(3);
       expect(filteredTapeNodes[0]).toEqual(tapeNodes[0]);
       expect(filteredTapeNodes[1]).toEqual(tapeNodes[1]);
       // The orphans should be removed.
       expect(filteredTapeNodes[2]).toEqual(tapeNodes[3]);
     });
};

test_util.describeMathCPU('tape_util', [tests]);
