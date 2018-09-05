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

        gl_FragColor = vec4(
          getA(rc.x * 2, rc.y * 2),
          getA(rc.x * 2, rc.y * 2 + 1),
          getA(rc.x * 2 + 1, rc.y * 2),
          getA(rc.x * 2 + 1, rc.y * 2 + 1)
        );
      }
    `;
  }
}
