import {Array3D, Array4D, NDArray, NDArrayMath} from 'deeplearn';
import {Array2D} from 'deeplearn/dist/math/ndarray';

import {Attr, DataType, Node, Tensor} from './index';
import {tensorToNDArray} from './util';

function getParamForName(attr: Attr[], name: string): Attr {
  return attr.find((a) => a.key === name);
}

function getStringParam(attrs: Attr[], name: string, def: string): string {
  const param = getParamForName(attrs, name);
  return param ? param.value.s || def : def;
}

function getTensorParam(attrs: Attr[], name: string, def?: Tensor): Tensor|
    undefined {
  const param = getParamForName(attrs, name);
  return param ? param.value.tensor || def : def;
}
/**
 * Retrieve the bounded numeric array from the param
 * @param param
 * @param def
 * @param startIndex
 * @param endIndex not included
 */
function getNumericArrayParam(
    attrs: Attr[], name: string, def: number[], startIndex?: number,
    endIndex?: number): number[] {
  const param = getParamForName(attrs, name);
  if (param) {
    const value = param.value.list.f || param.value.list.i;
    return value ? value.slice(startIndex, endIndex) : def;
  }

  return def;
}

/**
 * supporting operations
 * op: "Add"
 * op: "AvgPool"
 * op: "BiasAdd"
 * op: "ConcatV2"
 * op: "Const"
 * op: "Conv2D"
 * op: "Floor"
 * op: "MaxPool"
 * op: "Mul"
 * op: "Pack"
 * op: "Placeholder"
 * op: "RandomUniform"
 * op: "RealDiv"
 * op: "Relu"
 * op: "Reshape"
 * op: "Slice"
 * op: "Softmax"
 * op: "Sub"
 *
 * @param math
 * @param input
 * @param node
 * @param blobs
 */
export function performMathOp(
    math: NDArrayMath, input: NDArray|NDArray[]|number[], node: Node): NDArray {
  switch (node.op) {
    case 'Add':
    case 'BiasAdd': {
      const inputs = input as NDArray[];
      return math.add(inputs[0], inputs[1]);
    }
    case 'Const': {
      const constParam = node.attr;
      const tensor = getTensorParam(
          constParam, 'value',
          {tensor_shape: {dim: []}, dtype: DataType.DT_INT32.toString()});
      return tensorToNDArray(tensor);
    }
    case 'Placeholder':
      return input as NDArray;
    case 'Floor': {
      return math.floor(input as NDArray);
    }
    case 'Mul': {
      const inputs = input as Array2D[];
      return math.matMul(inputs[0], inputs[1]);
    }
    case 'Conv2D': {
      const convolutionParam = node.attr;
      const stride =
          getNumericArrayParam(convolutionParam, 'stride', [1, 1], 1, 3);
      const pad =
          getStringParam(convolutionParam, 'pad', 'valid').toLowerCase();
      const inputs = input as NDArray[];
      const weights = inputs[1] as Array4D;
      return math.conv2d(
          input as NDArray, weights, null, [stride[0], stride[1]], pad as any);
    }

    case 'AvgPool': {
      const poolingParam = node.attr;
      const stride = getNumericArrayParam(poolingParam, 'stride', [1, 1], 1, 3);
      const pad = getStringParam(poolingParam, 'pad', 'valid').toLowerCase();
      let kernelSize =
          getNumericArrayParam(poolingParam, 'ksize', [1, 1], 1, 3);

      return math.avgPool(
          input as Array3D, kernelSize as [number, number],
          stride as [number, number], pad as any);
    }

    case 'MaxPool': {
      const poolingParam = node.attr;
      const stride = getNumericArrayParam(poolingParam, 'stride', [1, 1], 1, 3);
      const pad = getStringParam(poolingParam, 'pad', 'valid').toLowerCase();
      let kernelSize =
          getNumericArrayParam(poolingParam, 'ksize', [1, 1], 1, 3);

      return math.maxPool(
          input as Array3D, [kernelSize[0], kernelSize[1]],
          [stride[0], stride[1]], pad as any);
    }

    case 'RandomUniform': {
      return NDArray.randUniform(input as number[], 0, 1, 'float32');
    }

    case 'RealDiv': {
      const inputs = input as NDArray[];
      return math.divide(inputs[0], inputs[1]);
    }

    case 'Reshape': {
      const inputs = input as NDArray[];
      const shape = Array.prototype.slice.call(inputs[1].dataSync());
      return math.reshape(inputs[0], shape);
    }

    case 'Slice': {
      const inputs = input as NDArray[];
      const shape = Array.prototype.slice.call(
                        inputs[1].dataSync()) as [number, number, number];
      const size = Array.prototype.slice.call(
                       inputs[1].dataSync()) as [number, number, number];
      return math.slice3D(input as Array3D, shape, size);
    }

    case 'Sub': {
      const inputs = input as NDArray[];
      return math.subStrict(inputs[0], inputs[1]);
    }

    case 'relu':
      return math.relu(input as NDArray);

    case 'Softmax':
      return math.softmax(input as NDArray);

    case 'ConcatV2': {
      const inp = input as Array3D[];
      let out = inp[0];
      // Workaround until concat3D(NDArray[]) is supported
      for (let i = 1; i < inp.length; ++i) {
        out = math.concat3D(out, inp[i], 2);
      }
      return out;
    }

    default:
      console.debug(node);
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
}
