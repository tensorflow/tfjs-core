import * as util from '../util';
export function axesAreInnerMostDims(axes, rank) {
    for (var i = 0; i < axes.length; ++i) {
        if (axes[axes.length - i - 1] !== rank - 1 - i) {
            return false;
        }
    }
    return true;
}
export function combineLocations(outputLoc, reduceLoc, axes) {
    var rank = outputLoc.length + reduceLoc.length;
    var loc = [];
    var outIdx = 0;
    var reduceIdx = 0;
    for (var dim = 0; dim < rank; dim++) {
        if (axes.indexOf(dim) === -1) {
            loc.push(outputLoc[outIdx++]);
        }
        else {
            loc.push(reduceLoc[reduceIdx++]);
        }
    }
    return loc;
}
export function computeOutAndReduceShapes(aShape, axes) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (axes.indexOf(dim) === -1) {
            outShape.push(aShape[dim]);
        }
    }
    var reduceShape = axes.map(function (dim) { return aShape[dim]; });
    return [outShape, reduceShape];
}
export function expandShapeToKeepDim(shape, axes) {
    var reduceSubShape = axes.map(function (x) { return 1; });
    return combineLocations(shape, reduceSubShape, axes);
}
export function parseAxisParam(axis, shape) {
    var rank = shape.length;
    axis = axis == null ? shape.map(function (s, i) { return i; }) : [].concat(axis);
    util.assert(axis.every(function (ax) { return ax >= -rank && ax < rank; }), "All values in axis param must be in range [-" + rank + ", " + rank + ") but " +
        ("got axis " + axis));
    util.assert(axis.every(function (ax) { return util.isInt(ax); }), "All values in axis param must be integers but " +
        ("got axis " + axis));
    return axis.map(function (a) { return a < 0 ? rank + a : a; });
}
export function assertAxesAreInnerMostDims(msg, axes, rank) {
    util.assert(axesAreInnerMostDims(axes, rank), msg + " supports only inner-most axes for now. " +
        ("Got axes " + axes + " and rank-" + rank + " input."));
}
export function getAxesPermutation(axes, rank) {
    if (axesAreInnerMostDims(axes, rank)) {
        return null;
    }
    var result = [];
    for (var i = 0; i < rank; ++i) {
        if (axes.indexOf(i) === -1) {
            result.push(i);
        }
    }
    axes.forEach(function (axis) { return result.push(axis); });
    return result;
}
export function getUndoAxesPermutation(axes) {
    return axes.map(function (axis, i) { return [i, axis]; })
        .sort(function (a, b) { return a[1] - b[1]; })
        .map(function (x) { return x[0]; });
}
export function getInnerMostAxes(numAxes, rank) {
    var res = [];
    for (var i = rank - numAxes; i < rank; ++i) {
        res.push(i);
    }
    return res;
}
//# sourceMappingURL=axis_util.js.map