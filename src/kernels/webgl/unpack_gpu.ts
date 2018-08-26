import {GPGPUProgram} from './gpgpu_math';

export class UnpackProgram implements GPGPUProgram {
	variableNames = ['A'];
	userCode: string;
	outputShape: number[];

	constructor(outputShape: number[]) {
		this.outputShape = outputShape;

		this.userCode = `
			void main() {
				vec2 onePixel = vec2(1.) / vec2(${outputShape[1]}, ${outputShape[0]});
				vec2 modCoord = mod(gl_FragCoord.xy - halfCR, vec2(2.0));

				vec4 packedInput = texture2D(A, vec2(
					resultUV.x - (step(1., modCoord.x) * onePixel.x),
					resultUV.y - (step(1., modCoord.y) * onePixel.y)
				));

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