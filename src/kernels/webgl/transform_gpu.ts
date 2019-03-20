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

import { GPGPUProgram } from './gpgpu_math';

export class TransformProgram implements GPGPUProgram {
  variableNames = ['Image', 'Transform'];
  outputShape: number[] = [];
  userCode: string;

  constructor(
    imageShape: [number, number, number, number], 
    transformShape: [number, number],
    method: 'bilinear' | 'nearest',
    size: [number, number], 
    fillValue: number
  ) {
    const [, imageHeight, imageWidth, depth] = imageShape;
    const [numTransforms,] = transformShape;
    const [outHeight, outWidth] = size;
    this.outputShape = [numTransforms, outHeight, outWidth, depth];
    const methodId = method === 'bilinear' ? 1 : 0;
    
    let texGetTransformId;
    if(numTransforms === 1){
      texGetTransformId = '0';
    } else {
      texGetTransformId = 'b';
    }


    // Reference implementation
    // tslint:disable-next-line:max-line-length
    // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/contrib/image/kernels/image_ops_gpu.cu.cc
    
    this.userCode = `
      float readFillValue(int b, int y, int x, int d) {
        if( y < 0 || y >= ${imageHeight} || x < 0 || x >= ${imageWidth} ) {
          return float(${fillValue});
        }
        return getImage(b, y, x, d);
      }
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get transform vals
        float a0 = getTransform(${texGetTransformId},0);
        float a1 = getTransform(${texGetTransformId},1);
        float a2 = getTransform(${texGetTransformId},2);
        float b0 = getTransform(${texGetTransformId},3);
        float b1 = getTransform(${texGetTransformId},4);
        float b2 = getTransform(${texGetTransformId},5);
        float c0 = getTransform(${texGetTransformId},6);
        float c1 = getTransform(${texGetTransformId},7);
        
        float projection = c0 * float(x) + c1 * float(y) + 1.0;
        
        float in_y = (b0 * float(x) + b1 * float(y) + b2) / projection;
        
        float in_x = (a0 * float(x) + a1 * float(y) + a2) / projection;
        
        vec2 sourceFracIndexRC = vec2(in_x, in_y);
        vec2 sourceFracIndexRCCeil = vec2(in_x + 1.0, in_y + 1.0);
        if(${methodId} == 1) {
          // Compute the four integer indices.
          int xFloor = int(floor(in_x));
          int yFloor = int(floor(in_y));
          int xCeil = int(floor(in_x + 1.0));
          int yCeil = int(floor(in_y + 1.0));

          float topLeft = readFillValue(b, yFloor, xFloor, d);
          float bottomLeft = readFillValue(b, yCeil, xFloor, d);
          float topRight = readFillValue(b, yFloor, xCeil, d);
          float bottomRight = readFillValue(b, yCeil, xCeil, d);

          float valueYFloor = topLeft * (float(xCeil) - in_x) + topRight * (in_x - float(xFloor));
          float valueYCeil = bottomLeft * (float(xCeil) - in_x) + bottomRight * (in_x - float(xFloor));
          
          float newValue = (float(yCeil) - in_y)*valueYFloor + (in_y - float(yFloor))*valueYCeil;
          
          setOutput(float(newValue));
        } else {
          // Compute the coordinators of nearest neighbor point.
          int xRound = int(round(in_x));
          int yRound = int(round(in_y));            
          float newValue = readFillValue(b, yRound, xRound, d);
          setOutput(newValue);
        }
      }
    `;
  }
}
