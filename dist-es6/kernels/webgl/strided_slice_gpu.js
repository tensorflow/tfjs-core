import { getCoordsDataType } from './shader_compiler';
var StridedSliceProgram = (function () {
    function StridedSliceProgram(begin, strides, shape) {
        this.variableNames = ['x'];
        this.outputShape = shape;
        this.rank = shape.length;
        var dtype = getCoordsDataType(this.rank);
        var newCoords = '';
        if (this.rank === 1) {
            newCoords = 'coords * strides + begin';
        }
        else {
            newCoords =
                shape.map(function (_, i) { return "coords[" + i + "] * strides[" + i + "] + begin[" + i + "]"; })
                    .join(',');
        }
        this.userCode = "\n      " + dtype + " begin = " + dtype + "(" + begin + ");\n      " + dtype + " strides = " + dtype + "(" + strides + ");\n\n      void main() {\n        " + dtype + " coords = getOutputCoords();\n        setOutput(getX(" + newCoords + "));\n      }\n    ";
    }
    return StridedSliceProgram;
}());
export { StridedSliceProgram };
//# sourceMappingURL=strided_slice_gpu.js.map