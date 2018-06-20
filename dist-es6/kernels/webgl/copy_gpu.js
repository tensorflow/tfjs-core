var Copy2DProgram = (function () {
    function Copy2DProgram(srcNumCols, destNumCols) {
        this.variableNames = ['source'];
        this.outputShape = null;
        this.userCode = "\n      uniform ivec2 sourceStart;\n      uniform ivec2 destStart;\n\n      void main() {\n        ivec2 destCoords = getOutputCoords() - destStart;\n        int index = destCoords.x * " + destNumCols + " + destCoords.y;\n        int r = index / " + srcNumCols + ";\n        ivec2 sourceCoords = sourceStart + ivec2(r, index - r * " + srcNumCols + ");\n        setOutput(getSource(sourceCoords.x, sourceCoords.y));\n      }\n    ";
    }
    Copy2DProgram.prototype.getCustomSetupFunc = function (sourceStart, destStart, destSize) {
        return function (gpgpu, webGLProgram) {
            gpgpu.setOutputMatrixWriteRegion(destStart[0], destSize[0], destStart[1], destSize[1]);
            var sourceStartCRLoc = gpgpu.getUniformLocation(webGLProgram, 'sourceStart');
            gpgpu.gl.uniform2i(sourceStartCRLoc, sourceStart[0], sourceStart[1]);
            var destStartCRLoc = gpgpu.getUniformLocation(webGLProgram, 'destStart');
            gpgpu.gl.uniform2i(destStartCRLoc, destStart[0], destStart[1]);
        };
    };
    return Copy2DProgram;
}());
export { Copy2DProgram };
//# sourceMappingURL=copy_gpu.js.map