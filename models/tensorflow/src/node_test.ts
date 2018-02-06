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
import {Array1D, Array2D, Array3D, Array4D, MatrixOrientation, NDArray, Scalar} from 'deeplearn';

// tslint:disable-next-line:max-line-length
import {getBoolParam, getNumericArrayParam, getStringParam, getTensorParam, performMathOp, tensorflow} from './index';

describe('node', () => {
  let node: tensorflow.NodeDef;
  beforeEach(() => {
    node = new tensorflow.NodeDef();
    node.name = 'test';
    node.op = 'Const';
    node.input = ['input1'];
  });

  describe('performMathOp', () => {
    describe('Add', () => {
      it('should call math.add', () => {
        const math = jasmine.createSpyObj('dl.math', ['add']);
        node.op = 'Add';
        const input1 = Scalar.new(1);
        const input2 = Scalar.new(1);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.add).toHaveBeenCalledWith(input1, input2);
      });
    });
    describe('BiasAdd', () => {
      it('should call math.add', () => {
        const math = jasmine.createSpyObj('dl.math', ['add']);
        node.op = 'BiasAdd';
        const input1 = Scalar.new(1);
        const input2 = Scalar.new(1);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.add).toHaveBeenCalledWith(input1, input2);
      });
    });
    describe('Const', () => {
      it('should return from weight hash', () => {
        const weight = Scalar.new(1);
        node.op = 'Const';
        const math = jasmine.createSpyObj('dl.math', ['add']);

        expect(performMathOp(math, [], node, {}, {
          'test': weight
        })).toBe(weight);
      });
    });
    describe('Placeholder', () => {
      it('should return from feedDict hash', () => {
        const input = Scalar.new(1);
        node.op = 'Placeholder';
        const math = jasmine.createSpyObj('dl.math', ['add']);

        expect(performMathOp(math, [], node, {'test': input}, {})).toBe(input);
      });
    });
    describe('Floor', () => {
      it('should call math.floor', () => {
        const math = jasmine.createSpyObj('dl.math', ['floor']);
        node.op = 'Floor';
        const input1 = Scalar.new(1);

        performMathOp(math, input1, node, {}, {});

        expect(math.floor).toHaveBeenCalledWith(input1);
      });
    });
    describe('Mul', () => {
      it('should call math.multiply', () => {
        const math = jasmine.createSpyObj('dl.math', ['multiply']);
        node.op = 'Mul';

        const input1 = Scalar.new(1.0);
        const input2 = Scalar.new(1.0);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.multiply).toHaveBeenCalledWith(input1, input2);
      });
    });

    describe('MatMul', () => {
      it('should call math.matMul', () => {
        const math = jasmine.createSpyObj('dl.math', ['matMul']);
        node.op = 'MatMul';
        node.attr['transpose_a'] = createBoolAttr(false);
        node.attr['transpose_b'] = createBoolAttr(true);
        const input1 = Scalar.new(1.0);
        const input2 = Scalar.new(1.0);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.matMul)
            .toHaveBeenCalledWith(
                input1, input2, MatrixOrientation.REGULAR,
                MatrixOrientation.TRANSPOSED);
      });
    });

    describe('Conv2D', () => {
      it('should call math.conv2d', () => {
        const math = jasmine.createSpyObj('dl.math', ['conv2d']);
        node.op = 'Conv2D';
        node.attr['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.attr['padding'] = createStrAttr('SAME');
        const input1 = Scalar.new(1.0);
        const input2 = Scalar.new(1.0);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.conv2d)
            .toHaveBeenCalledWith(input1, input2, null, [2, 2], 'same');
      });
    });

    describe('DepthwiseConv2dNative', () => {
      it('should call math.depthwiseConv2D', () => {
        const math = jasmine.createSpyObj('dl.math', ['depthwiseConv2D']);
        node.op = 'DepthwiseConv2dNative';
        node.attr['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.attr['padding'] = createStrAttr('SAME');
        node.attr['rate'] = createNumericArrayAttr([2, 2]);
        const input1 = Scalar.new(1.0);
        const input2 = Scalar.new(1.0);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.depthwiseConv2D)
            .toHaveBeenCalledWith(input1, input2, [2, 2], 'same', [2, 2]);
      });
    });

    describe('AvgPool', () => {
      it('should call math.avgPool', () => {
        const math = jasmine.createSpyObj('dl.math', ['avgPool']);
        node.op = 'AvgPool';
        node.attr['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.attr['padding'] = createStrAttr('SAME');
        node.attr['ksize'] = createNumericArrayAttr([1, 2, 2, 1]);
        const input = Scalar.new(1.0);

        performMathOp(math, input, node, {}, {});

        expect(math.avgPool)
            .toHaveBeenCalledWith(input, [2, 2], [2, 2], 'same');
      });
    });

    describe('MaxPool', () => {
      it('should call math.maxPool', () => {
        const math = jasmine.createSpyObj('dl.math', ['maxPool']);
        node.op = 'MaxPool';
        node.attr['strides'] = createNumericArrayAttr([1, 2, 2, 1]);
        node.attr['padding'] = createStrAttr('SAME');
        node.attr['ksize'] = createNumericArrayAttr([1, 2, 2, 1]);
        const input = Scalar.new(1.0);

        performMathOp(math, input, node, {}, {});

        expect(math.maxPool)
            .toHaveBeenCalledWith(input, [2, 2], [2, 2], 'same');
      });
    });
    describe('RandomUniform', () => {
      it('should call math.floor', () => {
        spyOn(NDArray, 'randUniform');
        const math = jasmine.createSpyObj('dl.math', ['add']);
        node.op = 'RandomUniform';
        const input1 = Array1D.new([2, 2, 2]);

        performMathOp(math, input1, node, {}, {});

        expect(NDArray.randUniform)
            .toHaveBeenCalledWith([2, 2, 2], 0, 1, 'float32');
      });
    });

    describe('RealDiv', () => {
      it('should call math.divide', () => {
        const math = jasmine.createSpyObj('dl.math', ['divide']);
        node.op = 'RealDiv';
        const input1 = Scalar.new(1);
        const input2 = Scalar.new(1);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.divide).toHaveBeenCalledWith(input1, input2);
      });
    });

    describe('Reshape', () => {
      it('should call input reshape', () => {
        const math = jasmine.createSpyObj('dl.math', ['divide']);
        node.op = 'Reshape';
        const input1 = Array1D.new([1, 2, 3, 4]);
        const input2 = Array1D.new([2, 2]);
        spyOn(input1, 'reshape');

        performMathOp(math, [input1, input2], node, {}, {});

        expect(input1.reshape).toHaveBeenCalledWith([2, 2]);
      });
    });
    describe('Squeeze', () => {
      it('should call math.reshape', () => {
        const math = jasmine.createSpyObj('dl.math', ['reshape']);
        node.op = 'Squeeze';
        node.attr['axis'] = createNumericArrayAttr([1, 2]);
        const input = Array3D.new([2, 1, 1], [1.0, 1.0]);

        performMathOp(math, input, node, {}, {});

        expect(math.reshape).toHaveBeenCalledWith(input, [2]);
      });
    });
    describe('Sub', () => {
      it('should call math.sub', () => {
        const math = jasmine.createSpyObj('dl.math', ['subtract']);
        node.op = 'Sub';
        const input1 = Scalar.new(1);
        const input2 = Scalar.new(1);

        performMathOp(math, [input1, input2], node, {}, {});

        expect(math.subtract).toHaveBeenCalledWith(input1, input2);
      });
    });
    describe('Relu', () => {
      it('should call math.relu', () => {
        const math = jasmine.createSpyObj('dl.math', ['relu']);
        node.op = 'Relu';
        const input1 = Scalar.new(1);

        performMathOp(math, input1, node, {}, {});

        expect(math.relu).toHaveBeenCalledWith(input1);
      });
    });

    describe('Relu6', () => {
      it('should call math.clip', () => {
        const math = jasmine.createSpyObj('dl.math', ['clip']);
        node.op = 'Relu6';
        const input1 = Scalar.new(1);

        performMathOp(math, input1, node, {}, {});

        expect(math.clip).toHaveBeenCalledWith(input1, 0, 6);
      });
    });

    describe('Rsqrt', () => {
      it('should call math.divide', () => {
        const input1 = Scalar.new(1);
        const math = jasmine.createSpyObj('dl.math', ['divide', 'sqrt']);
        math.sqrt.and.returnValue(input1);
        node.op = 'Rsqrt';

        performMathOp(math, input1, node, {}, {});

        expect(math.sqrt).toHaveBeenCalledWith(input1);
        expect(math.divide).toHaveBeenCalledWith(jasmine.any(Scalar), input1);
      });
    });

    describe('Softmax', () => {
      it('should call math.softmax', () => {
        const math = jasmine.createSpyObj('dl.math', ['softmax']);
        node.op = 'Softmax';
        const input1 = Scalar.new(1);

        performMathOp(math, input1, node, {}, {});

        expect(math.softmax).toHaveBeenCalledWith(input1);
      });
    });
    describe('Identity', () => {
      it('should return the input', () => {
        const math = jasmine.createSpyObj('dl.math', ['softmax']);
        node.op = 'Identity';
        const input1 = Scalar.new(1);

        expect(performMathOp(math, input1, node, {}, {})).toBe(input1);
      });
    });
    describe('ConcatV2', () => {
      it('should call math.concat1D', () => {
        const math = jasmine.createSpyObj('dl.math', ['concat1D']);
        node.op = 'ConcatV2';
        const input1 = Array1D.new([1]);
        const input2 = Array1D.new([1]);
        const input3 = Scalar.new(0);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.concat1D).toHaveBeenCalledWith(input1, input2);
      });
      it('should call math.concat2D', () => {
        const math = jasmine.createSpyObj('dl.math', ['concat2D']);
        node.op = 'ConcatV2';
        const input1 = Array2D.new([2, 1], [1, 1]);
        const input2 = Array2D.new([2, 1], [1, 1]);
        const input3 = Scalar.new(0);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.concat2D).toHaveBeenCalledWith(input1, input2, 0);
      });
      it('should call math.concat3D', () => {
        const math = jasmine.createSpyObj('dl.math', ['concat3D']);
        node.op = 'ConcatV2';
        const input1 = Array3D.new([2, 1, 1], [1, 1]);
        const input2 = Array3D.new([2, 1, 1], [1, 1]);
        const input3 = Scalar.new(0);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.concat3D).toHaveBeenCalledWith(input1, input2, 0);
      });
      it('should call math.concat4D', () => {
        const math = jasmine.createSpyObj('dl.math', ['concat4D']);
        node.op = 'ConcatV2';
        const input1 = Array4D.new([2, 1, 1, 1], [1, 1]);
        const input2 = Array4D.new([2, 1, 1, 1], [1, 1]);
        const input3 = Scalar.new(0);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.concat4D).toHaveBeenCalledWith(input1, input2, 0);
      });
      it('should throw error with rank > 4', () => {
        const math = jasmine.createSpyObj('dl.math', ['concat4D']);
        node.op = 'ConcatV2';
        const input1 = NDArray.ones([2, 1, 1, 1, 1], 'int32');
        const input2 = NDArray.ones([2, 1, 1, 1, 1], 'int32');
        const input3 = Scalar.new(0);

        expect(
            () => performMathOp(math, [input1, input2, input3], node, {}, {}))
            .toThrowError();
      });
    });
    describe('Slice', () => {
      it('should call math.slice1D', () => {
        const math = jasmine.createSpyObj('dl.math', ['slice1D']);
        node.op = 'Slice';
        const input1 = Array1D.new([1, 2, 3]);
        const input2 = Scalar.new(1);
        const input3 = Scalar.new(1);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.slice1D).toHaveBeenCalledWith(input1, 1, 1);
      });
      it('should call math.slice2D', () => {
        const math = jasmine.createSpyObj('dl.math', ['slice2D']);
        node.op = 'Slice';
        const input1 = Array2D.new([2, 1], [1, 1]);
        const input2 = Array1D.new([1, 1]);
        const input3 = Array1D.new([1, 1]);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.slice2D).toHaveBeenCalledWith(input1, [1, 1], [1, 1]);
      });
      it('should call math.slice3D', () => {
        const math = jasmine.createSpyObj('dl.math', ['slice3D']);
        node.op = 'Slice';
        const input1 = Array3D.new([2, 1, 1], [1, 1]);
        const input2 = Array1D.new([1, 1, 1]);
        const input3 = Array1D.new([1, 1, 1]);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.slice3D).toHaveBeenCalledWith(input1, [1, 1, 1], [1, 1, 1]);
      });
      it('should call math.slice4D', () => {
        const math = jasmine.createSpyObj('dl.math', ['slice4D']);
        node.op = 'Slice';
        const input1 = Array4D.new([2, 1, 1, 1], [1, 1]);
        const input2 = Array1D.new([1, 1, 1, 1]);
        const input3 = Array1D.new([1, 1, 1, 1]);

        performMathOp(math, [input1, input2, input3], node, {}, {});

        expect(math.slice4D).toHaveBeenCalledWith(input1, [1, 1, 1, 1], [
          1, 1, 1, 1
        ]);
      });
      it('should throw error with rank > 4', () => {
        const math = jasmine.createSpyObj('dl.math', ['slice4D']);
        node.op = 'Slice';
        const input1 = NDArray.ones([2, 1, 1, 1, 1], 'int32');
        const input2 = Array1D.new([1, 1, 1, 1, 1]);
        const input3 = Array1D.new([1, 1, 1, 1, 1]);

        expect(
            () => performMathOp(math, [input1, input2, input3], node, {}, {}))
            .toThrowError();
      });
    });
  });

  describe('getBoolParam', () => {
    it('should load correctly', () => {
      node.attr['bool'] = createBoolAttr(false);
      expect(getBoolParam(node.attr, 'bool', true)).toBe(false);

      node.attr['bool2'] = createBoolAttr(true);
      expect(getBoolParam(node.attr, 'bool2', false)).toBe(true);
    });
  });

  describe('getStringParam', () => {
    it('should load correctly', () => {
      const testString = 'test';
      node.attr['string'] = createStrAttr(testString);

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
      node.attr['array'] = createNumericArrayAttr([1.0]);
      expect(getNumericArrayParam(node.attr, 'array', [])).toEqual([1.0]);
    });
    it('should allow range input correctly', () => {
      node.attr['array'] = createNumericArrayAttr([1.0, 2.0, 2.0, 1.0]);

      expect(getNumericArrayParam(node.attr, 'array', [], 1, 3)).toEqual([
        2.0, 2.0
      ]);
    });
  });

  function createStrAttr(str: string): tensorflow.AttrValue {
    const array = new Uint8Array(new ArrayBuffer(str.length));

    for (let i = 0; i < str.length; i++) {
      array[i] = str.charCodeAt(i);
    }
    const strAttr = new tensorflow.AttrValue();
    strAttr.s = array;
    return strAttr;
  }

  function createBoolAttr(value: boolean): tensorflow.AttrValue {
    const boolAttr = new tensorflow.AttrValue();
    boolAttr.b = value;
    return boolAttr;
  }

  function createNumericArrayAttr(value: number[]): tensorflow.AttrValue {
    return new tensorflow.AttrValue({list: {f: value}});
  }
});
