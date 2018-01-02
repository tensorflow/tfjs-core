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

import {Graph, TensorflowModel} from './index';

let model: TensorflowModel;
const SIMPLE_MODEL: Graph = {
  node: [
    {
      name: 'image_placeholder',
      op: 'Placeholder',
      attr: [
        {
          key: 'dtype',
          value: {
            type: 'DT_FLOAT',
          }
        },
        {
          key: 'shape',
          value: {
            shape: {dim: [{size: 1}, {size: 227}, {size: 227}, {size: 3}]}
          }
        }
      ]
    },
    {
      name: 'Const',
      op: 'Const',
      attr: [
        {key: 'dtype', value: {type: 'DT_INT32'}}, {
          key: 'value',
          value: {tensor: {dtype: 'DT_INT32', tensor_shape: {}, int_val: 3}}
        }
      ]
    },
    {
      name: 'Shape',
      op: 'Const',
      attr: [
        {key: 'dtype', value: {type: 'DT_INT32'}}, {
          key: 'value',
          value: {
            tensor: {
              dtype: 'DT_INT32',
              tensor_shape: {dim: {size: 4}},
              tensor_content: '\\001\\000\\000\\000\\001\\000\\000\\000' +
                  '\\001\\000\\000\\000\\350\\003\\000\\000'
            }
          }
        }
      ]
    },
    {
      name: 'Conv2D',
      op: 'Conv2D',
      input: ['image_placeholder', 'Const'],
      attr: [
        {key: 'T', value: {type: 'DT_FLOAT'}},
        {key: 'data_format', value: {s: 'NHWC'}},
        {key: 'padding', value: {s: 'VALID'}},
        {key: 'strides', value: {list: {i: [1, 2, 2, 1]}}},
        {key: 'use_cudnn_on_gpu', value: {b: true}}
      ]
    },
    {
      name: 'BiasAdd',
      op: 'BiasAdd',
      input: ['Conv2D', 'Shape'],
      attr: [
        {key: 'T', value: {type: 'DT_FLOAT'}},
        {key: 'data_format', value: {s: 'NHWC'}}
      ]
    }
  ],
  version: {major: 1.0}
};

describe('TensorflowModel', () => {
  beforeEach(() => {
    const promise = new Promise<Graph>(resolve => resolve(SIMPLE_MODEL));
    model = new TensorflowModel(promise);
  });

  afterEach(() => {});

  it('should parse pbtxt file correctly', (done) => {
    model.load().then(() => {
      expect(model.nodes).not.toBeUndefined();
      done();
    });
  });

  it('should restruct the layers of the graph correctly', (done) => {
    model.load().then(() => {
      console.log('model loaded');
      expect(model.layers()).toEqual([
        {
          nodes: [
            {node: 'image_placeholder', parents: []},
            {node: 'Const', parents: []}, {node: 'Shape', parents: []}
          ]
        },
        {
          nodes: [
            {node: 'Conv2D', parents: ['image_placeholder', 'Const']},
          ],
        },
        {nodes: [{node: 'BiasAdd', parents: ['Conv2D', 'Shape']}]}
      ]);
      done();
    });
  });
});
