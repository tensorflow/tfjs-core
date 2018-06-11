import * as util from '../util';
export function assertParams(aShape, bShape, axis) {
    var aRank = aShape.length;
    var bRank = bShape.length;
    util.assert(aShape.length === bShape.length, "Error in concat" + aRank + "D: rank of x1 (" + aRank + ") and x2 (" + bRank + ") " +
        "must be the same.");
    util.assert(axis >= 0 && axis < aRank, "Error in concat" + aRank + "D: axis must be " +
        ("between 0 and " + (aRank - 1) + "."));
    for (var i = 0; i < aRank; i++) {
        util.assert((i === axis) || (aShape[i] === bShape[i]), "Error in concat" + aRank + "D: Shape (" + aShape + ") does not match " +
            ("(" + bShape + ") along the non-concatenated axis " + i + "."));
    }
}
export function computeOutShape1D(x1Shape, x2Shape) {
    util.assert(x1Shape.length === 1 && x2Shape.length === 1, 'x1 and x2 should be 1d array.');
    var outputShape = x1Shape.slice();
    outputShape[0] += x2Shape[0];
    return outputShape;
}
export function computeOutShape(x1Shape, x2Shape, axis) {
    util.assert(x1Shape.length === x2Shape.length, 'x1 and x2 should have the same rank.');
    var outputShape = x1Shape.slice();
    outputShape[axis] += x2Shape[axis];
    return outputShape;
}
export function computeGradientSliceShapes(aShape, bShape) {
    return {
        aBegin: [0, 0],
        aSize: aShape,
        bBegin: [0, aShape[1]],
        bSize: bShape
    };
}
//# sourceMappingURL=concat_util.js.map