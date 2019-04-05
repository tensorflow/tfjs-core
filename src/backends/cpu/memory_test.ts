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

import * as tf from '../../index';
import {describeWithFlags} from '../../jasmine_util';
import {CPU_ENVS} from './backend_cpu_test_harness';

describeWithFlags('memory cpu', CPU_ENVS, () => {
  it('unreliable is true due to auto gc', () => {
    tf.tensor(1);
    const mem = tf.memory();
    expect(mem.numTensors).toBe(1);
    expect(mem.numDataBuffers).toBe(1);
    expect(mem.numBytes).toBe(4);
    expect(mem.unreliable).toBe(true);

    const expectedReason =
        'The reported memory is an upper bound. Due to automatic garbage ' +
        'collection, the true allocated memory may be less.';
    expect(mem.reasons.indexOf(expectedReason) >= 0).toBe(true);
  });

  it('unreliable is true due to both auto gc and string tensors', () => {
    tf.tensor(1);
    tf.tensor('a');

    const mem = tf.memory();
    expect(mem.numTensors).toBe(2);
    expect(mem.numDataBuffers).toBe(2);
    expect(mem.numBytes).toBe(6);
    expect(mem.unreliable).toBe(true);

    const expectedReasonGC =
        'The reported memory is an upper bound. Due to automatic garbage ' +
        'collection, the true allocated memory may be less.';
    expect(mem.reasons.indexOf(expectedReasonGC) >= 0).toBe(true);
    const expectedReasonString =
        'Memory usage by string tensors is approximate ' +
        '(2 bytes per character)';
    expect(mem.reasons.indexOf(expectedReasonString) >= 0).toBe(true);
  });
});
