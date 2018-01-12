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

import {Array4D, test_util} from 'deeplearn';

import {tensorflow, TensorflowModel} from './index';

let model: TensorflowModel;
const SIMPLE_MODEL: tensorflow.IGraphDef = {
  node: [
    {
      name: 'image_placeholder',
      op: 'Placeholder',
      attr: {
        dtype: {
          type: tensorflow.DataType.DT_FLOAT,
        },
        shape: {shape: {dim: [{size: 3}, {size: 3}, {size: 3}, {size: 1}]}}
      }
    },
    {
      name: 'Const',
      op: 'Const',
      attr: {
        dtype: {type: tensorflow.DataType.DT_INT32},
        value: {
          tensor: {
            dtype: tensorflow.DataType.DT_INT32,
            tensorShape: {dim: [{size: 3}, {size: 3}, {size: 1}, {size: 1}]},
            intVal: [0, 0, 0, 0, 1, 0, 0, 0, 0]
          }
        }
      }
    },
    {
      name: 'Shape',
      op: 'Const',
      attr: {
        dtype: {type: tensorflow.DataType.DT_INT32},
        value: {
          tensor: {
            dtype: tensorflow.DataType.DT_INT32,
            tensorShape: {dim: [{size: 3}, {size: 1}, {size: 1}, {size: 1}]},
            intVal: [1, 1, 1]
          }
        }
      }
    },
    {
      name: 'Conv2D',
      op: 'Conv2D',
      input: ['image_placeholder', 'Const'],
      attr: {
        T: {type: tensorflow.DataType.DT_FLOAT},
        dataFormat: {s: Uint8Array.from([, 12, 2])},
        padding: {s: Uint8Array.from([118, 97, 108, 105, 100])},
        strides: {list: {f: [], i: [1, 2, 2, 1]}},
        useCudnnOnGpu: {b: true}
      }
    },
    {
      name: 'BiasAdd',
      op: 'BiasAdd',
      input: ['Conv2D', 'Shape'],
      attr: {
        T: {type: tensorflow.DataType.DT_FLOAT},
        dataFormat: {s: Uint8Array.from([1, 2, 34])}
      }
    }
  ],
  versions: {producer: 1.0}
};

describe('TensorflowModel', () => {
  beforeEach(() => {
    const promise =
        new Promise<tensorflow.IGraphDef>(resolve => resolve(SIMPLE_MODEL));
    model = new TensorflowModel(promise);
  });

  afterEach(() => {});

  it('should parse pbtxt file correctly', (done) => {
    model.load().then(() => {
      expect(model.nodes).not.toBeUndefined();
      done();
    });
  });

  it('should predict correctly', (done) => {
    model.load().then(() => {
      const value = model.predict(undefined, {
        'image_placeholder': Array4D.new(
            [3, 3, 3, 1],
            [
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            'int32')
      });
      expect(value.rank).toEqual(4);
      expect(value.shape).toEqual([3, 1, 1, 1]);
      test_util.expectArraysClose(value.dataSync(), Int32Array.from([2, 2, 2]));
      done();
    });
  });

  it('should restruct the layers of the graph correctly', (done) => {
    model.load().then(() => {
      expect(model.layers()).toEqual([
        {
          nodes: [
            {node: 'Shape', parents: []},
            {node: 'Const', parents: []},
            {node: 'image_placeholder', parents: []},
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

[Object({nodes: [Object({node: 'Shape', parents: []})]}),
 Object({nodes: [Object({node: 'Const', parents: []})]}),
 Object({nodes: [Object({node: 'image_placeholder', parents: []})]}), Object({
   nodes: [Object({node: 'Conv2D', parents: ['image_placeholder', 'Const']})]
 }),
 Object({nodes: [Object({node: 'BiasAdd', parents: ['Conv2D', 'Shape']})]})]
