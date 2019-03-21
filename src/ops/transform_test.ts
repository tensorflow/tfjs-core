/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {ALL_ENVS, expectArraysClose} from '../test_util';

describeWithFlags('transform', ALL_ENVS, () => {
  it('2x2-bilinear 90° rotate', () => {
  
    const image: tf.Tensor4D = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
    
    // inspired from https://math.stackexchange.com/questions/2093314
    // const a = Math.PI/2;
    // const center = [0.5, 0.5];
    // [
    //   cos(a), sin(a), center[0]*(1-cos(a)) - center[1]*sin(a),
    //   -1*sin(a), cos(a), center[1]*(1-cos(a)) + center[0]*sin(a),
    //   0, 0
    // ];
    const t = [0,1,0,-1,0,1,0,0];
  
    const transforms: tf.Tensor2D = tf.tensor2d(t, [1, 8]);
  
    const output = tf.image.transform(image, transforms, 'bilinear');
    expect(output.shape).toEqual([1, 2, 2, 1]); 
    expectArraysClose(output, [3, 1, 4, 2]);
  });
  it('2x2-nearest 90° rotate', () => {
    const image: tf.Tensor4D = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
    // inspired from https://math.stackexchange.com/questions/2093314
    // const a = Math.PI/2;
    // const center = [0.5, 0.5];
    // [
    //   cos(a), sin(a), center[0]*(1-cos(a)) - center[1]*sin(a),
    //   -1*sin(a), cos(a), center[1]*(1-cos(a)) + center[0]*sin(a),
    //   0, 0
    // ];
    const t = [0,1,0,-1,0,1,0,0];
  
    const transforms: tf.Tensor2D = tf.tensor2d(t, [1, 8]);
  
    const output = tf.image.transform(image, transforms, 'nearest');
    expect(output.shape).toEqual([1, 2, 2, 1]); 
    expectArraysClose(output, [3, 1, 4, 2]);
  });
  it('2x2-to-2x3-bilinear identity', () => {
    const image: tf.Tensor4D = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
    const transforms: tf.Tensor2D = tf.tensor2d(
      [
        1, 0, 0, 
        0, 1, 0, 
        0, 0
      ], [1, 8]);
    const output = tf.image.transform(image, transforms, 'bilinear', [2, 3]);
    expect(output.shape).toEqual([1, 2, 3, 1]);
    expectArraysClose(output, [1, 2, 0, 3, 4, 0]);
  });
  it('2x2-to-2x3-nearest identity', () => {
    const image: tf.Tensor4D = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
    const transforms: tf.Tensor2D = tf.tensor2d(
      [
        1, 0, 0, 
        0, 1, 0, 
        0, 0
      ], [1, 8]);
    const output = tf.image.transform(image, transforms, 'nearest', [2, 3]);
    expect(output.shape).toEqual([1, 2, 3, 1]);
    expectArraysClose(output, [1, 2, 0, 3, 4, 0]);
  });
  it('2x2-to-2x3-bilinear 10° shearing', () => {
    const image: tf.Tensor4D = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
    const transforms: tf.Tensor2D = tf.tensor2d(
      [
        1, -0.1, 0, 
        0, 1, 0, 
        0, 0
      ], [1, 8]);
    const output = tf.image.transform(image, transforms, 'bilinear', [2, 3]);
    expect(output.shape).toEqual([1, 2, 3, 1]);
    expectArraysClose(output, [1, 2, 0, 2.7, 3.9, 0.4]);
  });
  it('2x2-to-2x3-nearest 10° shearing', () => {
    const image: tf.Tensor4D = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
    const transforms: tf.Tensor2D = tf.tensor2d(
      [
        1, -0.1, 0, 
        0, 1, 0, 
        0, 0
      ], [1, 8]);
    const output = tf.image.transform(image, transforms, 'nearest', [2, 3]);
    expect(output.shape).toEqual([1, 2, 3, 1]);
    expectArraysClose(output, [1, 2, 0, 3, 4, 0]);
  });
  it('2x2x2x3-to-2x2x3x3-nearest 10° shearing and 90° rotating', () => {
    const image: tf.Tensor4D = tf.tensor4d([
      1, 1.1, 1.2, 
      2, 2.1, 2.2, 
      3, 3.1, 3.2, 
      4, 4.1, 4.2,
      1.3, 1.4, 1.5, 
      2.3, 2.4, 2.5,
      3.3, 3.4, 3.5,
      4.3, 4.4, 4.5
    ], [2, 2, 2, 3]);
    
    const transforms: tf.Tensor2D = tf.tensor2d(
      [
        // 10° shearing
        1, -0.1, 0, 
        0, 1, 0, 
        0, 0,
        // 90° rotate
        0, 1, 0,
        -1, 0, 1,
        0, 0
      ], [2, 8]);
    const output = tf.image.transform(
      image, 
      transforms, 
      'nearest', 
      [2, 3],
      [0, 0.1, 0.2]
    );
    expect(output.shape).toEqual([2, 2, 3, 3]);
    expectArraysClose(output, [
      1, 1.1, 1.2, 
      2, 2.1, 2.2, 
      0, 0.1, 0.2,
      3, 3.1, 3.2, 
      4, 4.1, 4.2,
      0, 0.1, 0.2,
      3.3, 3.4, 3.5,
      1.3, 1.4, 1.5, 
      0, 0.1, 0.2,
      4.3, 4.4, 4.5,
      2.3, 2.4, 2.5,
      0, 0.1, 0.2
    ]);
  });
  it('2x2x2x3-to-2x2x3x3-bilinear 10° shearing and 90° rotating', () => {
    const image: tf.Tensor4D = tf.tensor4d([
      1, 1.1, 1.2, 
      2, 2.1, 2.2, 
      3, 3.1, 3.2, 
      4, 4.1, 4.2,
      1.3, 1.4, 1.5, 
      2.3, 2.4, 2.5,
      3.3, 3.4, 3.5,
      4.3, 4.4, 4.5
    ], [2, 2, 2, 3]);
    
    const transforms: tf.Tensor2D = tf.tensor2d(
      [
        // 10° shearing
        1, -0.1, 0, 
        0, 1, 0, 
        0, 0,
        // 90° rotate
        0, 1, 0,
        -1, 0, 1,
        0, 0
      ], [2, 8]);
    const output = tf.image.transform(
      image, 
      transforms, 
      'bilinear', 
      [2, 3],
      [0, 0.1, 0.2]
    );
    expect(output.shape).toEqual([2, 2, 3, 3]);
    expectArraysClose(output, [
      1, 1.1, 1.2, 
      2, 2.1, 2.2, 
      0, 0.1, 0.2,
      2.7, 2.8, 2.9, 
      3.9, 4, 4.1,
      0.4, 0.5, 0.6,
      3.3, 3.4, 3.5,
      1.3, 1.4, 1.5, 
      0, 0.1, 0.2,
      4.3, 4.4, 4.5,
      2.3, 2.4, 2.5,
      0, 0.1, 0.2
    ]);
  });  
});
