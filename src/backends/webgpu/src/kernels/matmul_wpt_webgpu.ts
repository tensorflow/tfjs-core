import {WebGPUProgram} from './webgpu_program';

export class MatMulPackedProgram implements WebGPUProgram {
  outputShape: number[];
  userCode: string;
  dispatch: [number, number, number];
  workPerThread: number;
  variableNames = ['A', 'B', 'Dimensions'];
  tileSize = 8;

  constructor(outputShape: [number, number, number], workPerThread: number) {
    this.outputShape = outputShape;
    this.workPerThread = workPerThread;
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

        uint numTiles = (N - 1)/TileSize + 1;

        float acc[WorkPerThread][WorkPerThread];

        // Without this initialization strange values show up in acc.
        for(uint innerRow=0; innerRow<WorkPerThread; innerRow++) {
          for(uint innerCol=0; innerCol<WorkPerThread; innerCol++) {
            acc[innerRow][innerCol] = 0.0;
          }
        }

        // Loop over shared dimension.
        for(uint t=0; t<numTiles; t++) { 
          // Load one tile of A and B into local memory.
          for(uint innerRow=0; innerRow<WorkPerThread; innerRow++) {
            for(uint innerCol=0; innerCol<WorkPerThread; innerCol++) {
              uint inputRow = tileRow + innerRow;
              uint inputCol = tileCol + innerCol;
              
              uint AColumnIndex = t * TileSize + tileCol + innerCol;
              uint AFlatIndex = (globalRow + innerRow) * N + AColumnIndex;

              if(AColumnIndex < N) {
                Asub[inputRow][inputCol] = A[AFlatIndex];
              } else {
                Asub[inputRow][inputCol] = 0.0;
              }

              uint BRowIndex = t * TileSize + tileRow + innerRow;
              uint BFlatIndex = BRowIndex * K + (globalCol + innerCol);

              if(BRowIndex < N) {
                Bsub[inputRow][inputCol] = B[BFlatIndex];
              } else {
                Bsub[inputRow][inputCol] = 0.0; 
              }
            }
          }

          barrier();

          // Compute acc values for a single thread.
          for(uint k=0; k<TileSize; k++) {
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
            
            if((globalCol + innerCol) < K && (globalRow + innerRow) < M) {
              setOutput(globalFlatIndex, acc[innerRow][innerCol]);
            }
          }
        }
      }
    `;
  }
}
