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
        ivec3 resBRC = getOutputCoords();

        gl_FragColor = vec4(
          getA(resBRC.x * 2, resBRC.y * 2, resBRC.z * 2),
          getA(resBRC.x * 2, resBRC.y * 2, resBRC.z * 2),
          getA(resBRC.x * 2, resBRC.y * 2, resBRC.z * 2),
          getA(resBRC.x * 2, resBRC.y * 2, resBRC.z * 2)
        );
      }
    `;
  }
}
