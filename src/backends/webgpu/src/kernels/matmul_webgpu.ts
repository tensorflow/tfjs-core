/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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

import {computeDispatch} from '../webgpu_util';

import {WebGPUProgram} from './webgpu_program';

export class MatMulProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['A', 'B'];
  uniforms = 'uint dimAOuter, dimInner, dimBOuter, batch;';
  tileSize: [number, number, number] = [16, 16, 1];  // Must be square.

  constructor(outputShape: [number, number, number]) {
    this.outputShape = outputShape;
    const dispatchLayout = [[1], [2], [0]] as [number[], number[], number[]];
    this.dispatch =
        computeDispatch(dispatchLayout, this.outputShape, this.tileSize);

    this.userCode = `
      shared float Asub[TileSize.x][TileSize.x];
      shared float Bsub[TileSize.x][TileSize.x];

      void main() {
        uint localRow = gl_LocalInvocationID.x; // < TileSize.x
        uint localCol = gl_LocalInvocationID.y; // < TileSize.x
        uint globalRow = TileSize.x*gl_WorkGroupID.x + localRow; // < dimAOuter
        uint globalCol = TileSize.x*gl_WorkGroupID.y + localCol; // < dimInner

        float acc = 0.0;

        uint numTiles = (dimInner - 1) / TileSize.x + 1;

        for (uint t=0; t<numTiles; t++) {
          // Load one tile of A and B into local memory
          uint tiledACol = TileSize.x*t + localCol;
          uint tiledBRow = TileSize.x*t + localRow;

          uint AFlatIndex = globalRow * dimInner + tiledACol;
          if(AFlatIndex < dimAOuter * dimInner) {
            Asub[localRow][localCol] = A[AFlatIndex];
          } else {
            Asub[localRow][localCol] = 0.0;
          }

          uint BFlatIndex = tiledBRow * dimBOuter + globalCol;
          if(BFlatIndex < dimInner * dimBOuter) {
            Bsub[localRow][localCol] = B[BFlatIndex];
          } else {
            Bsub[localRow][localCol] = 0.0;
          }

          // Synchronise to make sure the tile is loaded
          barrier();

          for (uint k=0; k<TileSize.x; k++) {
            acc += Asub[localRow][k] * Bsub[k][localCol];
          }

          // Synchronise before loading the next tile
          barrier();
        }

        if (globalCol < dimBOuter && globalRow < dimAOuter) {
          setOutput(globalRow * dimBOuter + globalCol, acc);
        }
      }
    `;
  }
}