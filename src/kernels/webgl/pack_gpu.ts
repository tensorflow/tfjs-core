import {GPGPUProgram} from './gpgpu_math';

export class PackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[]) {
		this.outputShape = outputShape;
		this.userCode = `
			void main() {
				vec2 textureSize = vec2(4.); // input texture size
				vec2 onePixel = vec2(1.) / textureSize; // in uv space
				vec2 coord = resultUV - onePixel;

				// gl_FragColor = vec4(gl_FragCoord.x);

				gl_FragColor = vec4(
					texture2D(A, coord).x, 
					texture2D(A, vec2(coord.x + onePixel.x, coord.y)).x, 
					texture2D(A, vec2(coord.x, coord.y + onePixel.y)).x, 
					texture2D(A, coord + onePixel).x);

				// gl_FragColor = vec4(resultUV.x);
			}
		`;
	}
}

/*
so how do i get the coordinates of this particular pixel?
*/