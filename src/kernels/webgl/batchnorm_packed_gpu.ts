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

import * as broadcast_util from '../../ops/broadcast_util';
import {GPGPUProgram} from './gpgpu_math';

export class BatchNormPackedProgram implements GPGPUProgram {
  variableNames: string[];
  outputShape: number[] = [];
  userCode: string;
  supportsBroadcasting = true;

  constructor(
      xShape: number[], meanShape: number[], varianceShape: number[],
      offsetShape: number[]|null, scaleShape: number[]|null,
      varianceEpsilon: number) {
    this.variableNames = ['x', 'mean', 'variance'];
    broadcast_util.assertAndGetBroadcastShape(xShape, meanShape);
    broadcast_util.assertAndGetBroadcastShape(xShape, varianceShape);

    let offsetSnippet = 'vec4(0.0)';
    if (offsetShape != null) {
      broadcast_util.assertAndGetBroadcastShape(xShape, offsetShape);
      this.variableNames.push('offset');
      offsetSnippet = 'getOffset(resRC.w)';
    }

    let scaleSnippet = '1.0';
    if (scaleShape != null) {
      broadcast_util.assertAndGetBroadcastShape(xShape, scaleShape);
      this.variableNames.push('scale');
      scaleSnippet = 'getScaleAtOutCoords()';
    }

    this.outputShape = xShape;
    this.userCode = `
      void main() {
        ivec4 resRC = getOutputCoords();

        vec4 offset = ${offsetSnippet};
        float scale = ${scaleSnippet};

        vec4 x = getX(resRC.x, resRC.y, resRC.z, resRC.w);
        vec4 mean = getMean(resRC.w);
        vec4 variance = getVariance(resRC.w);
        vec4 inv = scale * inversesqrt(variance + vec4(${varianceEpsilon}));

        gl_FragColor = (x - mean) * inv + offset;
      }
    `;
  }
}
