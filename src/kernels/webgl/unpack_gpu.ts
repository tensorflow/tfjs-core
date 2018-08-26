import {GPGPUProgram} from './gpgpu_math';

export class UnpackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[]) {
		this.outputShape = outputShape;
		this.userCode = `
			float eps = 0.0001;

			void main() {
				vec2 textureSize = vec2(4.);
				vec2 thisCoord = gl_FragCoord.xy / textureSize;

				vec4 packedInput = texture2D(A, thisCoord);

				vec2 coord = floor(gl_FragCoord.xy);

				if(mod(coord.x, 2.0) < eps) { // x is even
					if(mod(coord.y, 2.0) < eps) { // y is even
						gl_FragColor = vec4(packedInput.r, 0, 0, 0);
					} else {
						gl_FragColor = vec4(packedInput.b, 0, 0, 0);
					}
				} else { // x is odd
					if(mod(coord.y, 2.0) < eps) {
						gl_FragColor = vec4(packedInput.g, 0, 0, 0);
					} else {
						gl_FragColor = vec4(packedInput.a, 0, 0, 0);
					}
				}
			}
		`;
	}
}