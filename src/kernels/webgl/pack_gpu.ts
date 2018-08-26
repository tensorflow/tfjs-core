import {GPGPUProgram} from './gpgpu_math';

export class PackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[], inputShape: number[]) {
		this.outputShape = outputShape;

		this.userCode = `
			void main() {
				vec2 onePixel = vec2(1.) / vec2(${inputShape[1]}, ${inputShape[0]});

				gl_FragColor = vec4(
					sampleTexture(A, resultUV), 
					sampleTexture(A, vec2(resultUV.x + onePixel.x, resultUV.y)), 
					sampleTexture(A, vec2(resultUV.x, resultUV.y + onePixel.y)), 
					sampleTexture(A, resultUV + onePixel));
			}
		`;
	}
}