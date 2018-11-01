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

import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';

export class BandPartProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor( aShape: number[], numLower: number, numUpper: number ) {
    const rank = aShape.length;
    this.outputShape = Array.from(aShape);
    this.rank = rank;;

    if( numLower%1 !== 0 ) throw new Error(`bandPart(): numLower=${numLower} is no integer.`);
    if( numUpper%1 !== 0 ) throw new Error(`bandPart(): numUpper=${numUpper} is no integer.`);
    if( numLower < 0 ) throw new Error(`bandPart(): numLower=${numLower} is negative.`);
    if( numUpper < 0 ) throw new Error(`bandPart(): numUpper=${numUpper} is negative.`);

    if( rank < 2 ) throw new Error(`bandPart(): a.rank=${rank} must not be less than 2.`);
    if( rank > 6 ) throw new Error(`bandPart(): a.rank=${rank} not yet supported.`);

    const dtype = getCoordsDataType(rank),
          idx = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u', 'resRC.v'].slice(0,rank),
          [i,j] = idx.slice(-2);

    this.userCode = `
    void main() {
      ${dtype} resRC = getOutputCoords();
           if( ${j}-${i} > ${numUpper} ) setOutput(0.0);
      else if( ${i}-${j} > ${numLower} ) setOutput(0.0);
      else                               setOutput( getA(${idx.join()}) );
    }
    `;
  }
}
