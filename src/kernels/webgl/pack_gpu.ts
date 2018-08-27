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
        vec2 coord = ((gl_FragCoord.xy * 2.) - halfCR) / vec2(${outputShape[1]}, ${outputShape[0]});

        float r = sampleTexture(A, coord);
        float g = sampleTexture(A, vec2(coord.x + onePixel.x, coord.y));
        float b = sampleTexture(A, vec2(coord.x, coord.y + onePixel.y));
        float a = sampleTexture(A, coord + onePixel);

        gl_FragColor = vec4(
          r, 
          coord.x + onePixel.x > 1. ? 0. : g, 
          coord.y + onePixel.y > 1. ? 0. : b, 
          coord.x + onePixel.x > 1. || coord.y + onePixel.y > 1. ? 0. : a);
      }
    `;
  }
}