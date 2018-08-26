import {GPGPUProgram} from './gpgpu_math';

export class PackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[]) {
		this.outputShape = outputShape;

		this.userCode = `
			void main() {
				vec2 inputShape = vec2(${outputShape[0] * 2}, ${outputShape[1] * 2});
				vec2 onePixel = vec2(1.) / inputShape;
				vec2 coord = resultUV - onePixel;

				gl_FragColor = vec4(
					sampleTexture(A, coord), 
					sampleTexture(A, vec2(coord.x + onePixel.x, coord.y)), 
					sampleTexture(A, vec2(coord.x, coord.y + onePixel.y)), 
					sampleTexture(A, coord + onePixel));
			}
		`;
	}
}