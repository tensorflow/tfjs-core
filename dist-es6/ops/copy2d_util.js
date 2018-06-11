export function validateShapes(sourceSize, destSize) {
    var srcArea = sourceSize[0] * sourceSize[1];
    var dstArea = destSize[0] * destSize[1];
    if (srcArea !== dstArea) {
        var srcStr = "[" + sourceSize[0] + ", " + sourceSize[1] + "]";
        var dstStr = "[" + destSize[0] + ", " + destSize[1] + "]";
        throw new Error("copy2D shapes have different areas:\n  sourceSize " + srcStr +
            (", area " + srcArea + "\n  destSize " + dstStr + ", area " + dstArea));
    }
}
//# sourceMappingURL=copy2d_util.js.map