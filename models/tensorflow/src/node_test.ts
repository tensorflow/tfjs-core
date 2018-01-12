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
// tslint:disable-next-line:max-line-length
import {getBoolParam, getNumericArrayParam, getStringParam, getTensorParam, tensorflow} from './index';

describe('node', () => {
  let node: tensorflow.NodeDef;
  beforeEach(() => {
    node = new tensorflow.NodeDef();
    node.name = 'test';
    node.op = 'Const';
    node.input = ['input1'];
  });

  describe('getBoolParam', () => {
    it('should load correctly', () => {
      const boolAttr = new tensorflow.AttrValue();
      boolAttr.b = false;
      node.attr['bool'] = boolAttr;
      expect(getBoolParam(node.attr, 'bool', true)).toBe(false);
    });
  });

  describe('getStringParam', () => {
    it('should load correctly', () => {
      const testString = 'test';
      const array = new Uint8Array(new ArrayBuffer(testString.length));

      for (let i = 0; i < testString.length; i++) {
        array[i] = testString.charCodeAt(i);
      }
      const strAttr = new tensorflow.AttrValue();
      strAttr.s = array;
      node.attr['string'] = strAttr;
      expect(getStringParam(node.attr, 'string', 'default')).toBe(testString);
    });
  });

  describe('getTensorParam', () => {
    it('should load correctly', () => {
      const testTensor = new tensorflow.Tensor();
      const strAttr = new tensorflow.AttrValue();
      strAttr.tensor = testTensor;
      node.attr['tensor'] = strAttr;
      expect(getTensorParam(node.attr, 'tensor', new tensorflow.Tensor()))
          .toBe(testTensor);
    });
  });
  describe('getNumericArrayParam', () => {
    it('should load correctly', () => {
      const strAttr = new tensorflow.AttrValue({list: {f: [1.0]}});
      node.attr['array'] = strAttr;
      expect(getNumericArrayParam(node.attr, 'array', [])).toEqual([1.0]);
    });
    it('should allow range input correctly', () => {
      const strAttr =
          new tensorflow.AttrValue({list: {f: [1.0, 2.0, 2.0, 1.0]}});
      node.attr['array'] = strAttr;
      expect(getNumericArrayParam(node.attr, 'array', [], 1, 3)).toEqual([
        2.0, 2.0
      ]);
    });
  });
});
