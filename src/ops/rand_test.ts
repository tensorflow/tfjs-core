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

import {describeWithFlags} from '../jasmine_util';
import {ALL_ENVS} from '../test_util';
import {MPRandGauss} from './rand';
import {expectArrayInMeanStdRange, jarqueBeraNormalityTest} from './rand_util';

describeWithFlags('MPRandGauss', ALL_ENVS, () => {
  const EPSILON = 0.05;
  const SEED = 2002;

  it('should default to float32 numbers', () => {
    const rand = new MPRandGauss(0, 1.5);
    const rel = rand.sample([1]);
    expect(rel.dtype).toBe('float32');
  });

  it('should handle create a mean/stdv of float32 numbers', () => {
    const rand =
        new MPRandGauss(0, 0.5, 'float32', false /* truncated */, SEED);
    const size = 1000;
    const values = rand.sample([size]);
    expectArrayInMeanStdRange(values, 0, 0.5, EPSILON);
    jarqueBeraNormalityTest(values);
  });

  it('should handle int32 numbers', () => {
    const rand = new MPRandGauss(0, 1, 'int32');
    expect(rand.sample([1]).dtype).toBe('int32');
  });

  it('should handle create a mean/stdv of int32 numbers', () => {
    const rand = new MPRandGauss(0, 2, 'int32', false /* truncated */, SEED);
    const size = 10000;
    const values = rand.sample([size]);
    expectArrayInMeanStdRange(values, 0, 2, EPSILON);
    jarqueBeraNormalityTest(values);
  });

  it('Should not have a more than 2x std-d from mean for truncated values',
     () => {
       const stdv = 1.5;
       const rand = new MPRandGauss(0, stdv, 'float32', true /* truncated */);
       const values = rand.sample([1000]).dataSync();
       for (let i = 0; i < values.length; i++) {
         expect(Math.abs(values[i])).toBeLessThan(stdv * 2);
       }
     });
});
