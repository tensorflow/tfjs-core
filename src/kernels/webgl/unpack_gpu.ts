import {GPGPUProgram} from './gpgpu_math';

export class UnpackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[]) {
		this.outputShape = outputShape;
		
		this.userCode = `
			void main() {
				vec4 packedInput = texture2D(A, resultUV);
				vec2 coord = gl_FragCoord.xy - halfCR;
				vec2 modCoord = mod(coord, vec2(2.0));

				gl_FragColor = vec4(
					modCoord.x == 0.0 ? 
						(modCoord.y == 0.0 ? packedInput.r : packedInput.b) : 
						(modCoord.y == 0.0 ? packedInput.g : packedInput.a),
					0, 0, 0
				);
			}
		`;
	}
}