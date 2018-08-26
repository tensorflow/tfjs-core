import {GPGPUProgram} from './gpgpu_math';

export class PackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[]) {
		this.outputShape = outputShape;
		this.userCode = `
			void main() {
				gl_FragColor = vec4(
					texture2D(A, vec2(0)).x, 
					texture2D(A, vec2(0.5, 0)).x, 
					texture2D(A, vec2(0, 0.5)).x, 
					texture2D(A, vec2(0.5)).x);
			}
		`;
	}
}