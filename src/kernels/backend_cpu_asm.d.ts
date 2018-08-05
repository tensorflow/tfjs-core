export class AsmModule {
  constructor(stdlib: {}, foreign: {}, heap: ArrayBuffer);
  matmul(
      leftDim: number, sharedDim: number, rightDim: number, transposeA: boolean,
      transposeB: boolean): void;
}
