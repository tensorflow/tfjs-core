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
import {Array1D, Array2D, Array3D, Array4D, MatrixOrientation, Scalar} from 'deeplearn';
import {NDArray, NDArrayMath} from 'deeplearn';

import {tensorflow} from './index';
import * as types from './types';

export function getStringParam(
    attrs: {[key: string]: tensorflow.IAttrValue}, name: string,
    def: string): string {
  const param = attrs[name];
  return param ? String.fromCharCode.apply(null, param.s) || def : def;
}

export function getBoolParam(
    attrs: {[key: string]: tensorflow.IAttrValue}, name: string,
    def: boolean): boolean {
  const param = attrs[name];
  return param ? param.b : def;
}

export function getTensorParam(
    attrs: {[key: string]: tensorflow.IAttrValue}, name: string,
    def?: tensorflow.ITensor): tensorflow.ITensor|undefined {
  const param = attrs[name];
  return param ? param.tensor || def : def;
}

/**
 * Retrieve the bounded numeric array from the param
 * @param param
 * @param def
 * @param startIndex
 * @param endIndex not included
 */
export function getNumericArrayParam(
    attrs: {[key: string]: tensorflow.IAttrValue}, name: string, def: number[],
    startIndex?: number, endIndex?: number): number[] {
  const param = attrs[name];
  if (param) {
    const value =
        (param.list.f.length ? param.list.f : param.list.i) as number[];
    return value.length ? value.slice(startIndex, endIndex) : def;
  }
  return def;
}

export function performMathOp(
    math: NDArrayMath, input: NDArray|NDArray[]|number[],
    node: tensorflow.INodeDef, feedDict: types.InputMap,
    weights: {[key: string]: NDArray}): NDArray {
  switch (node.op) {
    case 'Add':
    case 'BiasAdd': {
      const inputs = input as NDArray[];
      if (inputs[0].dtype !== inputs[1].dtype) {
        inputs[0] = inputs[0].asType('float32');
        inputs[1] = inputs[1].asType('float32');
      }
      return math.add(inputs[0], inputs[1]);
    }
    case 'Const': {
      return weights[node.name];
    }
    case 'Placeholder':
      return feedDict[node.name];
    case 'PlaceholderWithDefault':
      return !!feedDict[node.name] ? feedDict[node.name] : input as NDArray;
    case 'Floor': {
      return math.floor(input as NDArray);
    }

    case 'Mul': {
      const inputs = input as NDArray[];
      if (inputs[0].dtype !== inputs[1].dtype) {
        inputs[0] = inputs[0].asType('float32');
        inputs[1] = inputs[1].asType('float32');
      }
      return math.multiply(inputs[0], inputs[1]);
    }

    case 'MatMul': {
      const inputs = input as NDArray[];
      const transposeA = getBoolParam(node.attr, 'transpose_a', false);
      const transposeB = getBoolParam(node.attr, 'transpose_b', false);
      return math.matMul(
          inputs[0] as Array2D, inputs[1] as Array2D,
          transposeA ? MatrixOrientation.TRANSPOSED : MatrixOrientation.REGULAR,
          transposeB ? MatrixOrientation.TRANSPOSED :
                       MatrixOrientation.REGULAR);
    }

    case 'Conv2D': {
      const convolutionParam = node.attr;
      const stride =
          getNumericArrayParam(convolutionParam, 'strides', [1, 1], 1, 3);
      const pad =
          getStringParam(convolutionParam, 'padding', 'valid').toLowerCase();
      const inputs = input as NDArray[];
      const weights = inputs[1] as Array4D;
      return math.conv2d(
          inputs[0] as NDArray, weights, null, [stride[0], stride[1]],
          pad as 'valid' | 'same');
    }

    case 'DepthwiseConv2dNative': {
      const convolutionParam = node.attr;
      const stride =
          getNumericArrayParam(convolutionParam, 'strides', [1, 1], 1, 3);
      const pad =
          getStringParam(convolutionParam, 'padding', 'valid').toLowerCase();
      const rate = getNumericArrayParam(convolutionParam, 'rate', [1, 1]);
      const inputs = input as NDArray[];
      const weights = inputs[1] as Array4D;
      return math.depthwiseConv2D(
          inputs[0] as NDArray, weights, [stride[0], stride[1]],
          pad as 'valid' | 'same', rate as [number, number]);
    }

    case 'AvgPool': {
      const poolingParam = node.attr;
      const stride =
          getNumericArrayParam(poolingParam, 'strides', [1, 1], 1, 3);
      const pad =
          getStringParam(poolingParam, 'padding', 'valid').toLowerCase();
      const kernelSize =
          getNumericArrayParam(poolingParam, 'ksize', [1, 1], 1, 3);

      return math.avgPool(
          input as Array3D, kernelSize as [number, number],
          stride as [number, number], pad as 'valid' | 'same');
    }

    case 'MaxPool': {
      const poolingParam = node.attr;
      const stride =
          getNumericArrayParam(poolingParam, 'strides', [1, 1], 1, 3);
      const pad =
          getStringParam(poolingParam, 'padding', 'valid').toLowerCase();
      const kernelSize =
          getNumericArrayParam(poolingParam, 'ksize', [1, 1], 1, 3);

      return math.maxPool(
          input as Array3D, kernelSize as [number, number],
          stride as [number, number], pad as 'valid' | 'same');
    }

    case 'RandomUniform': {
      return NDArray.randUniform(
          Array.prototype.slice.call((input as NDArray).dataSync()), 0, 1,
          'float32');
    }

    case 'RealDiv': {
      const inputs = input as NDArray[];
      return math.divide(inputs[0], inputs[1]);
    }

    case 'Squeeze': {
      const squeezeInput = input as NDArray;
      const squeezeParam = node.attr;
      const axis = getNumericArrayParam(squeezeParam, 'axis', undefined);
      // deprecated attr name but still exist in old model files.
      const dims =
          getNumericArrayParam(squeezeParam, 'squeeze_dims', undefined);
      const {newShape} = squeezeShape(squeezeInput.shape, axis || dims);
      return math.reshape(squeezeInput, newShape);
    }

    case 'Reshape': {
      const inputs = input as NDArray[];
      const shape = Array.prototype.slice.call(inputs[1].dataSync());
      return inputs[0].reshape(shape);
    }

    case 'Slice': {
      const inputs = input as NDArray[];
      const begin = inputs[1].dataSync();
      const size = inputs[2].dataSync();

      switch (inputs[0].rank) {
        case 1:
          return math.slice1D(inputs[0] as Array1D, begin[0], size[0]);
        case 2:
          return math.slice2D(
              inputs[0] as Array2D, [begin[0], begin[1]], [size[0], size[1]]);
        case 3:
          return math.slice3D(
              inputs[0] as Array3D, [begin[0], begin[1], begin[2]],
              [size[0], size[1], size[2]]);
        case 4:
          return math.slice4D(
              inputs[0] as Array4D, [begin[0], begin[1], begin[2], begin[3]],
              [size[0], size[1], size[2], size[3]]);
        default:
          throw new Error(`input rank = ${inputs[0].rank} is not supported.`);
      }
    }

    case 'Sub': {
      const inputs = input as NDArray[];
      return math.subtract(inputs[0], inputs[1]);
    }

    case 'Relu':
      return math.relu(input as NDArray);

    case 'Relu6':
      return math.clip(input as NDArray, 0, 6);

    case 'Rsqrt':
      return math.divide(
          Scalar.new(1.0, 'float32'), math.sqrt(input as NDArray));

    case 'Softmax':
      return math.softmax(input as NDArray);

    case 'Identity':
      return input as NDArray;

    case 'Pack':
    case 'ConcatV2': {
      if (!(input instanceof Array)) {
        return input;
      }
      const inp = input as NDArray[];
      const axis = inp[inp.length - 1].dataSync()[0];
      let out = inp[0];
      for (let i = 1; i < inp.length - 1; ++i) {
        switch (out.rank) {
          case 1:
            // inp[i] = inp[i].as1D();
            out = math.concat1D(out as Array1D, inp[i] as Array1D);
            break;
          case 2:
            out = math.concat2D(out as Array2D, inp[i] as Array2D, axis);
            break;
          case 3:
            out = math.concat3D(out as Array3D, inp[i] as Array3D, axis);
            break;
          case 4:
            out = math.concat4D(out as Array4D, inp[i] as Array4D, axis);
            break;
          default:
            throw new Error(`input rank = ${out.rank} is not supported.`);
        }
      }
      return out;
    }

    default:
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
}

/** Reduces the shape by removing all dimensions of shape 1. */
export function squeezeShape(shape: number[], axis?: number[]):
    {newShape: number[], keptDims: number[]} {
  const newShape: number[] = [];
  const keptDims: number[] = [];
  let j = 0;
  for (let i = 0; i < shape.length; ++i) {
    if (axis) {
      if (axis[j] === i && shape[i] > 1) {
        throw new Error(`axis ${i} is not 1`);
      }
      if (axis[j] > i && shape[i] === 1) {
        newShape.push(shape[i]);
        keptDims.push(i);
      }
      if (axis[j] < i) j++;
    }
    if (shape[i] > 1) {
      newShape.push(shape[i]);
      keptDims.push(i);
    }
  }
  return {newShape, keptDims};
}
