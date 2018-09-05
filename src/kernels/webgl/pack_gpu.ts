import {GPGPUProgram} from './gpgpu_math';

export class PackProgram implements GPGPUProgram {
  variableNames = ['A'];
  outputShape: number[];
  userCode: string;
  packed = true;

  constructor(outputShape: number[]) {
    this.outputShape = outputShape;

    this.userCode = `
      void main() {
        ivec2 rc = getOutputCoords();

        int r = rc.x * 2;
        int c = rc.y * 2;
        int rp1 = r + 1;
        int cp1 = c + 1;

        gl_FragColor = vec4(
            getA(r, c),
            cp1 >= ${outputShape[1]} ? 0. : getA(r, cp1),
            rp1 >= ${outputShape[0]} ? 0. : getA(rp1, c),
            rp1 >= ${outputShape[0]} || cp1 >= ${
        outputShape[1]} ? 0. : getA(rp1, cp1)
          );
      }
    `;
  }
}
