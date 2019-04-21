/**
 * WPT registers initialized to 0 for each thread
 * each thread loads WPT values of A / B into local memory
 * each thread performs WPT * tileSize accumulations per tile
 * each thread stores WPT values in C
 *
 * dispatch dimensions stay the same - it's the same number of tiles (work
groups), but each tile is smaller
 * but the actual tile size passed into the layout declaration gets divided by
 * WPT
 *
kai: the geometry of the dispatch is measured in tiles
so if you have a tilesize of 2,3,4 then a dispatch of 2,2,2 runs 4*6*8 threads
 */

import {WebGPUProgram} from './webgpu_program';

export class MatMulPackedProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  variableNames = ['A', 'B', 'Dimensions'];
  tileSize = 4;
  workPerThread = 2;

  constructor(outputShape: [number, number, number]) {
    this.outputShape = outputShape;
    this.dispatch = [
      Math.ceil(outputShape[1] / this.tileSize),
      Math.ceil(outputShape[2] / this.tileSize), 1
    ];

    this.userCode = `
      shared float Asub[TileSize][TileSize];
      shared float Bsub[TileSize][TileSize];

      void main() {
        // M is A outer, N is shared, K is B outer
        uint M = Dimensions[0], N = Dimensions[1], 
          K = Dimensions[2], batch = Dimensions[3];
        uint row = gl_LocalInvocationID.x; // 0..local_size_x
        uint col = gl_LocalInvocationID.y; // 0..local_size_y
        uint tileRow = row * WorkPerThread; // 0..TileSize, stride by local_size
        uint tileCol = col * WorkPerThread; // 0..TileSize
        uint globalRow = 
          TileSize*gl_WorkGroupID.x + tileRow; // 0..M, stride by tileSize
        uint globalCol = TileSize*gl_WorkGroupID.y + tileCol;

        float acc[WorkPerThread][WorkPerThread];

        uint numTiles = (N - 1)/TileSize + 1;

        for(uint t=0; t<numTiles; t++) { // looping over shared dimension
          // Load one tile of A and B into local memory.
          for(uint innerRow=0; innerRow<WorkPerThread; innerRow++) {
            for(uint innerCol=0; innerCol<WorkPerThread; innerCol++) {
              uint inputRow = tileRow + innerRow;
              uint inputCol = tileCol + innerCol;
              
              uint AColumnIndex = t * TileSize + tileCol + innerCol;
              uint AFlatIndex = (globalRow + innerRow) * N + AColumnIndex;

              if(AColumnIndex < N) {
                Asub[inputRow][inputCol] = A[AFlatIndex];
              }

              uint BRowIndex = t * TileSize + tileRow + innerRow;
              uint BFlatIndex = BRowIndex * K + (globalCol + innerCol);

              if(BRowIndex < N) {
                Bsub[inputRow][inputCol] = B[BFlatIndex];
              }
            }
          }

          barrier();

          // Compute acc values for a single tile.
          for(uint k=0; k<TileSize; k++) { // 0, 1, 2, 3
            for(uint innerRow=0; innerRow<WorkPerThread; innerRow++) {
              for(uint innerCol=0; innerCol<WorkPerThread; innerCol++) {
                float ALocal = Asub[tileRow + innerRow][k];
                float BLocal = Bsub[k][tileCol + innerCol];
                acc[innerRow][innerCol] += ALocal * BLocal;
              }
            }
          }

          barrier();
        }

        for (uint innerRow=0; innerRow<WorkPerThread; innerRow++) {
          for (uint innerCol=0; innerCol<WorkPerThread; innerCol++) {
            uint globalFlatIndex = 
              (globalRow + innerRow) * K + (globalCol + innerCol);
            setOutput(globalFlatIndex, acc[innerRow][innerCol]);
            // setOutput(globalFlatIndex, globalFlatIndex);
          }
        }
      }
    `;
  }
}
