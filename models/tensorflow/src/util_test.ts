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

import {tensorflow, tensorToNDArray, unescape} from './index';

describe('util', () => {
  describe('unescape', () => {
    it('should unescape octal correctly', () => {
      expect(unescape('\\001\\002\\343').length).toBe(3);
    });

    it('should unescape special chars', () => {
      expect(unescape('\\001\\377\\n\\"\\\\\\r\\\'').length).toBe(7);
      expect(unescape(
                 '\\001\\000\\000\\000\\r\\000\\000' +
                 '\\000\\r\\000\\000\\000\\000\\002\\000\\000')
                 .length)
          .toBe(16);
    });
  });

  describe('tensorToNDArray', () => {
    let tensor: tensorflow.Tensor;
    beforeEach(() => {
      tensor = new tensorflow.Tensor();
      tensor.dtype = tensorflow.DataType.DT_FLOAT;
      tensor.tensorContent = new Uint8Array(new Float32Array([1.0]).buffer);
      tensor.tensorShape = new tensorflow.TensorShape({dim: []});
    });

    it('should load scalar correctly', () => {
      const ndArray = tensorToNDArray(tensor);
      expect(ndArray.rank).toBe(0);
      expect(ndArray.dtype).toBe('float32');
      expect(ndArray.dataSync().length).toEqual(1);
      expect(ndArray.dataSync()[0]).toEqual(1.0);
    });

    it('should load 1D array correctly', () => {
      tensor.tensorShape = new tensorflow.TensorShape({dim: [{size: 1}]});

      const ndArray = tensorToNDArray(tensor);
      expect(ndArray.rank).toBe(1);
      expect(ndArray.dtype).toBe('float32');
      expect(ndArray.dataSync().length).toEqual(1);
      expect(ndArray.dataSync()[0]).toEqual(1.0);
    });

    it('should load 2D array correctly', () => {
      tensor.tensorShape =
          new tensorflow.TensorShape({dim: [{size: 1}, {size: 1}]});

      const ndArray = tensorToNDArray(tensor);
      expect(ndArray.rank).toBe(2);
      expect(ndArray.dtype).toBe('float32');
      expect(ndArray.dataSync().length).toEqual(1);
      expect(ndArray.dataSync()[0]).toEqual(1.0);
    });

    it('should load 3D array correctly', () => {
      tensor.tensorShape =
          new tensorflow.TensorShape({dim: [{size: 1}, {size: 1}, {size: 1}]});

      const ndArray = tensorToNDArray(tensor);
      expect(ndArray.rank).toBe(3);
      expect(ndArray.dtype).toBe('float32');
      expect(ndArray.dataSync().length).toEqual(1);
      expect(ndArray.dataSync()[0]).toEqual(1.0);
    });

    it('should load 4D array correctly', () => {
      tensor.tensorShape = new tensorflow.TensorShape(
          {dim: [{size: 1}, {size: 1}, {size: 1}, {size: 1}]});

      const ndArray = tensorToNDArray(tensor);
      expect(ndArray.rank).toBe(4);
      expect(ndArray.dtype).toBe('float32');
      expect(ndArray.dataSync().length).toEqual(1);
      expect(ndArray.dataSync()[0]).toEqual(1.0);
    });
  });
});
