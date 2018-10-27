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

export class DiagPartProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor( aShape: number[] ) {
    if( aShape.some( d => d < 0 || d%1 !== 0 ) ) throw new Error(`diagPart(): Invalid input shape [${aShape}].`);

    const rank = aShape.length-1;
    this.rank = rank;

    if( rank < 1 ) throw new Error('diagPart(): Input rank must be at least 2.');

    this.outputShape = aShape.slice(0,-1);
    this.outputShape[rank-1] = Math.min( ...aShape.slice(-2) );

    if( rank > 5 ) throw Error(`diagPart(): a.rank=${rank+1} is not yet supported.`);

    const dtype = getCoordsDataType(rank),
          idx = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u', 'resRC.v'].slice(0,rank);
    if( 1 === rank ) idx[0] = 'resRC';
    idx.push( idx[rank-1] );

    this.userCode = `
    void main() {
      ${dtype} resRC = getOutputCoords();
      setOutput( getA(${idx.join()}) );  
    }
    `;
  }
}
