import { getCoordsDataType } from './shader_compiler';
var PadProgram = (function () {
    function PadProgram(xShape, paddings, constantValue) {
        this.variableNames = ['x'];
        this.outputShape = paddings.map(function (p, i) { return p[0] + xShape[i] + p[1]; });
        var rank = xShape.length;
        var type = getCoordsDataType(rank);
        var start = paddings.map(function (p) { return p[0]; }).join(',');
        var end = paddings.map(function (p, i) { return p[0] + xShape[i]; }).join(',');
        var unpackedCoords = ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank);
        if (rank === 1) {
            this.userCode = "\n        int start = " + start + ";\n        int end = " + end + ";\n\n        void main() {\n          int outC = getOutputCoords();\n          if (outC < start || outC >= end) {\n            setOutput(float(" + constantValue + "));\n          } else {\n            setOutput(getX(outC - start));\n          }\n        }\n      ";
            return;
        }
        this.userCode = "\n      " + type + " start = " + type + "(" + start + ");\n      " + type + " end = " + type + "(" + end + ");\n\n      void main() {\n        " + type + " outC = getOutputCoords();\n        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {\n          setOutput(float(" + constantValue + "));\n        } else {\n          " + type + " coords = outC - start;\n          setOutput(getX(" + unpackedCoords + "));\n        }\n      }\n    ";
    }
    return PadProgram;
}());
export { PadProgram };
//# sourceMappingURL=pad_gpu.js.map