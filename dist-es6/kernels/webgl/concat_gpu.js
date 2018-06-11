import * as concat_util from '../../ops/concat_util';
var ConcatProgram = (function () {
    function ConcatProgram(aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.outputShape = [];
        this.outputShape =
            concat_util.computeOutShape(aShape, bShape, 1);
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        float value = 0.0;\n        if (yC < " + aShape[1] + ") {\n          value = getA(yR, yC);\n        } else {\n          yC -= " + aShape[1] + ";\n          value = getB(yR, yC);\n        }\n\n        setOutput(value);\n      }\n    ";
    }
    return ConcatProgram;
}());
export { ConcatProgram };
//# sourceMappingURL=concat_gpu.js.map