import { getCoordsDataType } from './shader_compiler';
var GatherProgram = (function () {
    function GatherProgram(aShape, indicesLength, axis) {
        this.variableNames = ['A', 'indices'];
        var outputShape = aShape.slice();
        outputShape[axis] = indicesLength;
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = getCoordsDataType(this.rank);
        var sourceCoords = getSourceCoords(aShape, axis);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
    }
    return GatherProgram;
}());
export { GatherProgram };
function getSourceCoords(aShape, axis) {
    var rank = aShape.length;
    if (rank > 4) {
        throw Error("Gather for rank " + rank + " is not yet supported");
    }
    if (rank === 1) {
        return "int(getIndices(resRC))";
    }
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var sourceCoords = [];
    for (var i = 0; i < aShape.length; i++) {
        if (i === axis) {
            sourceCoords.push("int(getIndices(" + currentCoords[i] + "))");
        }
        else {
            sourceCoords.push("" + currentCoords[i]);
        }
    }
    return sourceCoords.join();
}
//# sourceMappingURL=gather_gpu.js.map