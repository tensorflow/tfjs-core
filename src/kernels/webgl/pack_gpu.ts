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
        vec2 onePixel = vec2(1.) / vec2(${outputShape[1]}, ${outputShape[0]});

        vec2 upperLeft = ((gl_FragCoord.xy * 2.) - halfCR) / vec2(${
        outputShape[1]}, ${outputShape[0]});
        vec2 upperRight = vec2(upperLeft.x + onePixel.x, upperLeft.y);
        vec2 lowerLeft = vec2(upperLeft.x, upperLeft.y + onePixel.y);
        vec2 lowerRight = upperLeft + onePixel;

        // gl_FragColor = vec4(
        //   sampleTexture(A, upperLeft),
        //   upperRight.x > 1. ? 0. : sampleTexture(A, upperRight),
        //   lowerLeft.y > 1. ? 0. : sampleTexture(A, lowerLeft),
        //   lowerRight.x > 1. || lowerRight.y > 1. ? 0. : sampleTexture(A, lowerRight));
        gl_FragColor = vec4(gl_FragCoord.x, gl_FragCoord.y, 3, 4);
      }
    `;
  }
}
