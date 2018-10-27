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

export class SetDiagProgram implements GPGPUProgram {
  variableNames = ['A','D'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor( aShape: number[], dShape: number[] ) {
    if( aShape.length < 2 ) throw new Error(`setDiag(): a.rank=${aShape.length} < 2`);
    if( dShape.length < 1 ) throw new Error(`setDiag(): d.rank=${dShape.length} < 1`);
    if( aShape.some( d => d < 0 || d%1 !== 0 ) ) throw new Error(`setDiag(): Invalid input a.shape [${aShape}].`);
    if( dShape.some( d => d < 0 || d%1 !== 0 ) ) throw new Error(`setDiag(): Invalid input d.shape [${dShape}].`);
    if( aShape.length != dShape.length+1 )
      throw new Error(`setDiag(): Incompatible shapes for a and d [${aShape}] [${dShape}]`)

    for( let i=aShape.length-2; i-- > 0; )
      if( aShape[i] != dShape[i] )
        throw new Error(`setDiag(): Incompatible shapes for a and d [${aShape}] [${dShape}]`)

    if( dShape[dShape.length-1] != Math.min( ...aShape.slice(-2) ) )
      throw new Error(`setDiag(): Incompatible shapes for a and d [${aShape}] [${dShape}]`)

    this.rank = aShape.length;
    this.outputShape = aShape;

    const dtype = getCoordsDataType(this.rank),
          idx = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u', 'resRC.v'].slice(0,this.rank),
          [i,j] = idx.slice(-2);

    this.userCode = `
    void main() {
      ${dtype} resRC = getOutputCoords();
      if( ${i} == ${j} ) setOutput( getD(${idx.slice(0,-1).join()}) );
      else               setOutput( getA(${idx            .join()}) ); 
    }
    `;
  }
}

