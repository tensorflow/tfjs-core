export class AsmModule {
  constructor(stdlib: {}, foreign: {}, heap: ArrayBuffer);
  matmul(
      leftDim: number, sharedDim: number, rightDim: number, transposeA: boolean,
      transposeB: boolean): void;

  conv2d(
      xStride0: number, xStride1: number, yStride0: number, yStride1: number,
      filterStride0: number, filterStride1: number, batchSize: number,
      inHeight: number, inWidth: number, inChannels: number, outHeight: number,
      outWidth: number, outChannels: number, strideHeight: number,
      strideWidth: number, dilationHeight: number, dilationWidth: number,
      filterHeight: number, filterWidth: number, padLeft: number,
      padTop: number): void;
}
