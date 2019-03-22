/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {Tensor1D, Tensor2D, Tensor3D, Tensor4D} from '../tensor';
import {range, scalar, zeros, tensor1d} from '../ops/tensor_ops';
import {gatherND} from '../ops/gather_nd';
import {convertToTensor} from '../tensor_util_env';
import {TensorLike} from '../types';
import * as util from '../util';
import {op} from './operation';

/**
 * Applies the given transform(s) to the image(s).
 *
 * @param image 4d tensor of shape `[batch,imageHeight,imageWidth,depth]`,
 *     where imageHeight and imageWidth must be positive, specifying the
 *     batch of images to transform
 * @param transforms 2d float32 tensor of shape `[batch, 8]` or `[1, 8]`.
 *     Each entry is a projective transform matrix/matrices 
 *     If one row of transforms is `[a0, a1, a2, b0, b1, b2, c0, c1]`, 
 *     then it maps the output point (x, y) to a transformed input point 
 *     `(x', y') = ((a0 x + a1 y + a2) / k, (b0 x + b1 y + b2) / k)`, 
 *     where `k = c0 x + c1 y + 1`
 * @param method Optional, string from `'bilinear' | 'nearest'`,
 *     defaults to bilinear, the sampling method
 * @param size Optional, The new size `[newHeight, newWidth]`
 *     defaults to `[imageHeight,imageWidth]`
 * @param fillValue Optional, the value to fill outside the input
 *     Can be a 1d tensor of size [channels], default to 0
 * @return A 4D tensor of the shape `[numBoxes,imageHeight,imageWidth,depth]`
 */
/** @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'} */
function transform_(
    image: Tensor4D|TensorLike,
    transforms: Tensor2D|TensorLike,
    method?: 'bilinear'|'nearest',
    size?: [number, number],
    fillValue?: number | number[] | Tensor1D
    ): Tensor4D {
  
  const $image = convertToTensor(image, 'image', 'transform', 'float32');
  const $transforms = convertToTensor(
    transforms, 
    'transforms', 
    'transform', 
    'float32'
  );
  method = method || 'bilinear';
  
  const $fillValue =  convertToTensor(
    fillValue || [0], 
    'fillValue', 
    'transform', 
    $image.dtype
  );
  
  size = size || [$image.shape[1], $image.shape[2]];

  util.assert(
      $image.rank === 4,
      () => 'Error in transform: image must be rank 4,' +
          `but got rank ${$image.rank}.`);
  
  util.assert(
      $transforms.rank === 2 && 
      $transforms.shape[1] === 8 && 
      (
        $transforms.shape[0] === 1 || 
        $transforms.shape[0] === $image.shape[0]
      ),
      () => 'Error in transform: ' +
          `transforms must be have size [${$image.shape[0]},8] or [1,8]` +
          `but had shape ${$transforms.shape}.`);
          
  util.assert(
      size[0] >= 1 && size[1] >= 1,
      () => `size must be atleast [1,1], but was ${size}`);
      
  util.assert(
      method === 'bilinear' || method === 'nearest',
      () => `method must be bilinear or nearest, but was ${method}`);

  util.assert(
      $fillValue.rank === 1 && (
        $fillValue.shape[0] === 1 || 
        $fillValue.shape[0] === $image.shape[3]
      ),
      () => 'Error in transform: fillValue shape must be rank 1, ' +
       `and shape must be 1 or ${$image.shape[3]} ` +
       `but had shape ${$fillValue.shape}.`);
  
  // Remark : ImageProjectiveTransformV2 exists in tensorflow's code
  // But is not inside the C API
  // In order to provide a all-environment function
  // current implementation is using linear algebra only
  // in the future it might be a more optimized code to 
  // reimplement it when ImageProjectiveTransformV2 will be exposed in C API
  
  const inputShape = $image.shape;
  const nImages = inputShape[0];
  const nChannels = inputShape[3];
  const [outputHeight, outputWidth] = size;
  const outputShape = [nImages, outputHeight, outputWidth, nChannels];
  
  // NHW means  [ batch, height, width]
  const xOutputNHW = range(0, outputWidth)
    .transpose()
    .expandDims(0).expandDims(0)
    .tile([nImages, outputHeight, 1]);
    
  // NHW means  [ batch, height, width]
  const yOutputNHW = range(0, outputHeight)
    .expandDims(0).expandDims(2)
    .tile([nImages, 1, outputWidth]);
    
  const batchOutputNHW = range(0, nImages)
    .expandDims(1).expandDims(2)
    .tile([1, outputHeight, outputWidth]);
  
  const transformTensorsNHW = [];
  
  if($transforms.shape[0] === 1){
    for(let i = 0; i < 8; i++){
      const t = $transforms
        .stridedSlice([0,i], [1,i+1], [1,1])
        .expandDims(2)
        .tile([nImages, outputHeight, outputWidth]);
      
      transformTensorsNHW.push(t);
    }
  } else {
    for(let i = 0; i < 8; i++){
      const t = $transforms
        .stridedSlice([0,i], [nImages,i+1], [1,1])
        .expandDims(2)
        .tile([1, outputHeight, outputWidth]);
      
      transformTensorsNHW.push(t);
    }
  }
  
  // Formula is
  // `(x', y') = ((a0 x + a1 y + a2) / k, (b0 x + b1 y + b2) / k)`,
  // where `k = c0 x + c1 y + 1`
  
  const projectionNHW = xOutputNHW
    .mul(transformTensorsNHW[6])
    .add(
      yOutputNHW.mul(transformTensorsNHW[7])
    )
    .add(scalar(1));
  
  const xFloatInputNHW = 
      xOutputNHW
        .mul(transformTensorsNHW[0])
    .add(
      yOutputNHW
      .mul(transformTensorsNHW[1])
    )
    .add(
      transformTensorsNHW[2]
    )
    .div(projectionNHW) as Tensor3D;
  
  const yFloatInputNHW = 
      xOutputNHW
        .mul(transformTensorsNHW[3])
    .add(
      yOutputNHW
      .mul(transformTensorsNHW[4])
    )
    .add(
      transformTensorsNHW[5]
    )
    .div(projectionNHW) as Tensor3D;
  
  // This function is getting values from images when indices
  // are inside the input image
  // or from fillValue when indices are outside the input image
  const gatherNdOrDefault = (indicesNHWI: Tensor4D) : Tensor4D => {
    // NHWI means [ batch, height, width, indice]
    const maxTensorNHWI = tensor1d(inputShape.slice(0,-1))
      .expandDims(0).expandDims(0).expandDims(0)
      .tile(outputShape.slice(0,-1).concat([1]));
    
    const zeroTensorNHWI = zeros(outputShape.slice(0,-1).concat([3]));
    
    const defaultMaskNHWI = indicesNHWI
      .greaterEqual(maxTensorNHWI)
      .logicalOr(indicesNHWI.less(zeroTensorNHWI));

    // when indices are outside of input's shape, we replace them by 0
    // this is arbitrary choice but is not impacting final result
    // since we eventually replace the channel values by fill Values
    const indiceOrZeroNHWI = zeroTensorNHWI.where(defaultMaskNHWI, indicesNHWI);
    
    // if any indices is outside input, 
    // then the value is [fillValue, fillValue, ...] on nChannels
    const defaultMaskNHWC = defaultMaskNHWI
      .any(3)
      .expandDims(3)
      .tile([1,1,1,nChannels]);
    
    let fillTensorNHWC: Tensor4D;
    if($fillValue.shape[0] === 1){
      fillTensorNHWC = $fillValue
        .reshape([1,1,1,1])
        .tile(outputShape) as Tensor4D;
    } else { // $fillValue.shape[0] === outputShape[-1]
      fillTensorNHWC = $fillValue
        .reshape([1,1,1,outputShape[outputShape.length - 1]])
        .tile(outputShape.slice(0, -1).concat([1])) as Tensor4D;
    }
     
    const resBeforeFillNHWC = gatherND($image, indiceOrZeroNHWI.toInt());
    return fillTensorNHWC.where(defaultMaskNHWC, resBeforeFillNHWC) as Tensor4D;
  };

  const getValueFromIndices = (
    yIntInputNHW: Tensor3D, 
    xIntInputNHW: Tensor3D
  ) : Tensor4D => {
    // NHWI means [ batch, height, width, indice]
    const indicesNHWI = batchOutputNHW
      .expandDims(3)
      .concat([
        yIntInputNHW.expandDims(3), 
        xIntInputNHW.expandDims(3)
      ], 3) as Tensor4D;
      
    return gatherNdOrDefault(indicesNHWI.toInt());
  };

  if(method === 'bilinear'){
    const leftIndicesNHW = xFloatInputNHW.floor() as Tensor3D;
    const rightIndicesNHW = leftIndicesNHW.add(scalar(1)) as Tensor3D;
    const topIndicesNHW = yFloatInputNHW.floor() as Tensor3D;
    const bottomIndicesNHW = topIndicesNHW.add(scalar(1)) as Tensor3D;
    
    // NHWC is output shape and it means [ batch, height, width, channel]
    const topLeftNHWC = getValueFromIndices(
      topIndicesNHW, 
      leftIndicesNHW
    );
    
    const topRightNHWC = getValueFromIndices(
      topIndicesNHW, 
      rightIndicesNHW
    );
    
    const bottomLeftNHWC = getValueFromIndices(
      bottomIndicesNHW, 
      leftIndicesNHW
    );
    
    const bottomRightNHWC = getValueFromIndices(
      bottomIndicesNHW, 
      rightIndicesNHW
    );
    
    const leftDistNHWC = xFloatInputNHW.sub(leftIndicesNHW)
      .expandDims(3).tile([1,1,1,nChannels]);
    
    const topDistNHWC = yFloatInputNHW.sub(topIndicesNHW)
      .expandDims(3).tile([1,1,1,nChannels]);
    
    const rightDistNHWC = scalar(1).sub(leftDistNHWC);
    
    const valueYFloorNHWC = topLeftNHWC.mul(rightDistNHWC)
      .add(leftDistNHWC.mul(topRightNHWC));
    
    const valueYCeilNHWC = bottomLeftNHWC.mul(rightDistNHWC)
      .add(leftDistNHWC.mul(bottomRightNHWC));

    return valueYFloorNHWC.mul(scalar(1).sub(topDistNHWC))
      .add(valueYCeilNHWC.mul(topDistNHWC));
    
  } else { // method === 'nearest'
    return getValueFromIndices(
      yFloatInputNHW.round(), 
      xFloatInputNHW.round()
    ) as Tensor4D;
  }
}
export const transformOp = op({transform_});
