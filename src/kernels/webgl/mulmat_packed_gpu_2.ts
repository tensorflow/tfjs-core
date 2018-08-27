import {GPGPUProgram} from './gpgpu_math';

export class MatMulProgram implements GPGPUProgram {
	variableNames = ['matrixA', 'matrixB'];
	outputShape: number[];
	userCode: string;
  packed = true;

	constructor(aShape: [number, number], bShape: [number, number], transposeA = false,
      transposeB = false) {
	  const outerShapeA = transposeA ? aShape[1] : aShape[0];
    const outerShapeB = transposeB ? bShape[0] : bShape[1];
    const sharedDim = transposeA ? aShape[0] : aShape[1];
    this.outputShape = [outerShapeA, outerShapeB];

    const sharedDimensionPacked = Math.ceil(sharedDim / 2);

    const aSample = transposeA ? 'resultUV.t, center' : 'center, resultUV.t';
    const bSample = transposeB ? 'center, resultUV.s' : 'resultUV.s, center';
    const aSwizzle = transposeA ? ['a.xxyy', 'a.zzww'] : ['a.xxzz', 'a.yyww'];
    const bSwizzle = transposeB ? ['b.xzxz', 'b.ywyw'] : ['b.xyxy', 'b.zwzw'];

    this.userCode = `
	    const float sharedDimension = ${sharedDimensionPacked}.0;

	    vec4 dot2x2ARowBCol() {
	      vec4 result = vec4(0, 0, 0, 0);
	      for (int ii = 0; ii < ${sharedDimensionPacked}; ii++) {
	        float i = float(ii);
	        float center = (i + 0.5) / sharedDimension;
	        vec4 a = texture2D(matrixA, vec2(${aSample}));
	        vec4 b = texture2D(matrixB, vec2(${bSample}));
	        result +=
	          (${aSwizzle[0]} * ${bSwizzle[0]}) + (${aSwizzle[1]} * ${bSwizzle[1]});
	      }
	      return result;
	    }

    	void main() {
    		gl_FragColor = dot2x2ARowBCol();
    	}
    `;
	}
}
