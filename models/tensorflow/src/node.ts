import {Array3D, Array4D, NDArray, NDArrayMath} from 'deeplearn';
import {Array1D, Array2D, Scalar} from 'deeplearn/dist/math/ndarray';

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
    math: NDArrayMath, input: NDArray|NDArray[]|number[], node: Node,
    feedDict: {[key: string]: NDArray}): NDArray {
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
      return feedDict[node.name];
    case 'Floor': {
      return math.floor(input as NDArray);
    }
    case 'Mul': {
      const inputs = input as NDArray[];
      return math.multiply(inputs[0], inputs[1]);
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
          pad as any);
    }

    case 'AvgPool': {
      const poolingParam = node.attr;
      const stride =
          getNumericArrayParam(poolingParam, 'strides', [1, 1], 1, 3);
      const pad =
          getStringParam(poolingParam, 'padding', 'valid').toLowerCase();
      let kernelSize =
          getNumericArrayParam(poolingParam, 'ksize', [1, 1], 1, 3);

      return math.avgPool(
          input as Array3D, kernelSize as [number, number],
          stride as [number, number], pad as any);
    }

    case 'MaxPool': {
      const poolingParam = node.attr;
      const stride =
          getNumericArrayParam(poolingParam, 'strides', [1, 1], 1, 3);
      const pad =
          getStringParam(poolingParam, 'padding', 'valid').toLowerCase();
      let kernelSize =
          getNumericArrayParam(poolingParam, 'ksize', [1, 1], 1, 3);

      return math.maxPool(
          input as Array3D, [kernelSize[0], kernelSize[1]],
          [stride[0], stride[1]], pad as any);
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

    case 'Reshape': {
      const inputs = input as NDArray[];
      const shape = Array.prototype.slice.call(inputs[1].dataSync());
      return inputs[0].reshape(shape);
    }

    case 'Slice': {
      const inputs = input as NDArray[];

      const begin = inputs[1].dataSync()[0];
      const size = inputs[2].dataSync()[0];
      return math.slice1D(inputs[0] as Array1D, begin, size);
    }

    case 'Sub': {
      const inputs = input as NDArray[];
      return math.subtract(inputs[0], inputs[1]);
    }

    case 'Relu':
      return math.relu(input as NDArray);

    case 'Softmax':
      return math.softmax(input as NDArray);

    case 'Pack':
    case 'ConcatV2': {
      if (!(input instanceof Array)) {
        return input;
      }
      const inp = input as NDArray[];
      const axis = inp[inp.length - 1].dataSync()[0];
      let out = inp[0];
      for (let i = 1; i < inp.length - 1; ++i) {
        if (out.rank === 1) {
          inp[i] = inp[i].as1D();
          out = math.concat1D(out as Array1D, inp[i] as Array1D);
        }
        if (out.rank === 2) {
          out = math.concat2D(out as Array2D, inp[i] as Array2D, axis);
        }
        if (out.rank === 3) {
          out = math.concat3D(out as Array3D, inp[i] as Array3D, axis);
        }
        if (out.rank === 4) {
          out = math.concat4D(out as Array4D, inp[i] as Array4D, axis);
        }
      }
      return out;
    }

    default:
      console.debug(node);
      throw TypeError(`Node type ${node.op} is not implemented`);
  }
}
