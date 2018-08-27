import {GPGPUProgram} from './gpgpu_math';

export class PackProgram implements GPGPUProgram {
	variableNames = ['A'];
  outputShape: number[];
	userCode: string;

	constructor(outputShape: number[], inputShape: number[]) {
		this.outputShape = outputShape;

		this.userCode = `
			void main() {
				vec2 onePixel = vec2(1.) / vec2(${inputShape[1]}, ${inputShape[0]});
				vec2 coord = ((gl_FragCoord.xy - halfCR) * 2.) / vec2(${inputShape[1]}, ${inputShape[0]});

				gl_FragColor = vec4(
					sampleTexture(A, coord), 
					sampleTexture(A, vec2(coord.x + onePixel.x, coord.y)), 
					sampleTexture(A, vec2(coord.x, coord.y + onePixel.y)), 
					sampleTexture(A, coord + onePixel));
			}
		`;
	}
}