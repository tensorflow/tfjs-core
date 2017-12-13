import {caffe} from 'caffe-proto';
import {Array1D, Array3D, Array4D, NDArray, NDArrayMathGPU} from 'deeplearn';

// tslint:disable-next-line:max-line-length
export function getLayersFromModel(model: caffe.NetParameter): caffe.IV0LayerParameter[] | caffe.IV1LayerParameter[] {
  return model.layer.length > 0 ? model.layer as caffe.IV0LayerParameter[]
    : model.layers as caffe.IV1LayerParameter[];
}

function getNumericParam(param: number|number[], def: number) {
  var p = Array.isArray(param) ? param[0] : param;
  return p || def;
}

function getPoolType(poolType: string|number): number {
  let finalPoolType;
  if (typeof poolType == "number") {
    return finalPoolType;
  }
  else {
    switch (poolType.toLowerCase()) {
      case "max":
        return caffe.PoolingParameter.PoolMethod.MAX;
      case "ave":
        return caffe.PoolingParameter.PoolMethod.AVE;
      case "stochastic":
        return caffe.PoolingParameter.PoolMethod.STOCHASTIC;
      default:
        throw TypeError(`Pool type ${poolType} is not implemented`);
    }
  }
}

export function performMathOp(math: NDArrayMathGPU, input: NDArray|NDArray[],
    layer: caffe.ILayerParameter, blobs?: NDArray[]) : NDArray {
  
  switch (layer.type.toLowerCase()) {
    case 'input':
    case 'dropout':
      return input as NDArray;

    case 'fc':
    case 'innerproduct':
    case 'inner_product': {
      const innerProductParam = caffe.InnerProductParameter.create(layer.innerProductParam);
      const weights = blobs[0] as Array3D;

      const x = (<Array3D>input).as1D();
      const W = weights.as2D(x.shape[0], innerProductParam.numOutput);
      const y = math.vectorTimesMatrix(x, W);

      if (innerProductParam.biasTerm !== false) {
        const b = blobs[1].as1D() as Array1D;
        return math.add(y, b);
      }
      return y;
    }

    case 'conv':
    case 'convolution': {
      const convolutionParam = caffe.ConvolutionParameter.create(layer.convolutionParam);
      const stride = getNumericParam(convolutionParam.stride, 1)
      const pad = getNumericParam(convolutionParam.pad, 0);

      const weights = blobs[0] as Array4D;
      const bias = convolutionParam.biasTerm !== false ? blobs[1].as1D() as Array1D
        // Workaround until biasTerm = false is supported in math.conv2d
        : Array1D.zeros([weights.shape[weights.shape.length - 1]]);

       try {
          return math.conv2d(input as Array3D, weights, bias, stride, pad);
        }
        catch(err) {
          // https://github.com/BVLC/caffe/issues/1318
          // https://github.com/BVLC/caffe/issues/4252
          console.warn(err);
          return math.conv2d(input as Array3D, weights, bias, stride, 'valid');
        }
    }

    case 'pool':
    case 'pooling': {
      const poolingParam = caffe.PoolingParameter.create(layer.poolingParam);
      const stride = getNumericParam(poolingParam.stride, 1)
      const pad = getNumericParam(poolingParam.pad, 0);
      let kernelSize = getNumericParam(poolingParam.kernelSize, 1)

      if (poolingParam.globalPooling) {
        kernelSize = (<Array3D>input).shape[0];
      }

      switch (getPoolType(poolingParam.pool)) {
        case caffe.PoolingParameter.PoolMethod.MAX:
          try {
            return math.maxPool(input as Array3D, kernelSize, stride, pad);
          }
          catch(err) {
            // https://github.com/BVLC/caffe/issues/1318
            // https://github.com/BVLC/caffe/issues/4252
            console.warn(err);
            return math.maxPool(input as Array3D, kernelSize, stride, 'valid');
          }
        
        case caffe.PoolingParameter.PoolMethod.AVE:
          try {
            return math.avgPool(input as Array3D, kernelSize, stride, pad);
          }
          catch(err) {
            // https://github.com/BVLC/caffe/issues/1318
            // https://github.com/BVLC/caffe/issues/4252
            console.warn(err);
            return math.avgPool(input as Array3D, kernelSize, stride, 'valid');
          }
        
        default:
          throw TypeError(`Pooling type ${poolingParam.pool} is not implemented`);
      }
    }

    case 'batchnorm': {
      const mean = blobs[0] as Array3D;
      const variance = blobs[1] as Array3D;

      return math.batchNormalization3D(input as Array3D, mean, variance);
    }

    case 'lrn': {
      const lrnParam = caffe.LRNParameter.create(layer.lrnParam);
      const k = lrnParam.k || 1;
      const n = lrnParam.localSize || 5;
      const alpha = lrnParam.alpha || 1;
      const beta = lrnParam.beta || 0.75;

      return math.localResponseNormalization3D(input as Array3D, k, n, alpha, beta);
    }

    case 'scale': {
      const scaleParam = caffe.ScaleParameter.create(layer.scaleParam);
      const scale = blobs[0] as Array3D;

      let out = math.multiply(input as Array3D, scale);

      if (scaleParam.biasTerm) {
        const bias = blobs[1] as Array3D;
        out = math.add(out as Array3D, bias);
      }
        
      return out;
    }

    case 'relu':
      return math.relu(input as Array3D);

    case 'softmax':
      return math.softmax(input as NDArray);

    case 'concat': {
      const inp = input as Array3D[];
      let out = inp[0];
      // Workaround until concat3D(NDArray[]) is supported
      for (let i = 1; i < inp.length; ++i) {
        out = math.concat3D(out, inp[i], 2);
      }
      return out;
    }
    
    default:
      console.debug(layer);
      throw TypeError(`Layer type ${layer.type} is not implemented`);
  }
}