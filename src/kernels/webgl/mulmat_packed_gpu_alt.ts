import {GPGPUProgram} from './gpgpu_math';

export class MatMulProgram implements GPGPUProgram {
  variableNames = ['matrixA', 'matrixB'];
  outputShape: number[];
  userCode: string;
  packed = true;

  constructor(aShape: [number, number], bShape: [number, number], transposeA = false, transposeB = false) {
    const outerShapeA = transposeA ? aShape[1] : aShape[0];
    const outerShapeB = transposeB ? bShape[0] : bShape[1];
    const sharedDim = transposeA ? aShape[0] : aShape[1];
    this.outputShape = [outerShapeA, outerShapeB];

    const sharedDimensionPacked = Math.ceil(sharedDim / 2);
  }
}