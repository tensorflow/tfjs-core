import * as util from '../util';
export function assertParamsValid(input, begin, size) {
    util.assert(input.rank === begin.length, "Error in slice" + input.rank + "D: Length of begin " + begin + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    util.assert(input.rank === size.length, "Error in slice" + input.rank + "D: Length of size " + size + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    for (var i = 0; i < input.rank; ++i) {
        util.assert(begin[i] + size[i] <= input.shape[i], "Error in slice" + input.rank + "D: begin[" + i + "] + size[" + i + "] " +
            ("(" + (begin[i] + size[i]) + ") would overflow input.shape[" + i + "] (" + input.shape[i] + ")"));
    }
}
export function getStridedSlicedInfo(shape, begin, end, strides, beginMask, endMask) {
    if (beginMask === void 0) { beginMask = 0; }
    if (endMask === void 0) { endMask = 0; }
    var startIndex = [];
    var endIndex = [];
    for (var i = 0; i < shape.length; i++) {
        startIndex[i] = startForAxis(beginMask, begin, strides, shape, i);
        endIndex[i] = stopForAxis(endMask, end, strides, shape, i);
    }
    var size = new Array(shape.length).fill(0);
    size = size.map(function (d, i) {
        var count = 0;
        for (var start = startIndex[i]; !(strides[i] > 0 ? start >= endIndex[i] : start <= endIndex[i]); start += strides[i]) {
            count += 1;
        }
        return count;
    });
    return [startIndex, size];
}
export function startForAxis(beginMask, startIndices, strides, inputShape, axis) {
    var start = startIndices[axis];
    if (beginMask & 1 << axis) {
        if (strides[axis] > 0) {
            start = Number.MIN_SAFE_INTEGER;
        }
        else {
            start = Number.MAX_SAFE_INTEGER;
        }
    }
    var axisSize = inputShape[axis];
    if (start < 0) {
        start += axisSize;
    }
    start = util.clamp(0, start, axisSize - 1);
    return start;
}
export function stopForAxis(endMask, stopIndices, strides, inputShape, axis) {
    var stop = stopIndices[axis];
    if (endMask & (1 << axis)) {
        if (strides[axis] > 0) {
            stop = Number.MAX_SAFE_INTEGER;
        }
        else {
            stop = Number.MIN_SAFE_INTEGER;
        }
    }
    var axisSize = inputShape[axis];
    if (stop < 0) {
        stop += axisSize;
    }
    if (strides[axis] > 0) {
        stop = util.clamp(0, stop, axisSize);
    }
    else {
        stop = util.clamp(-1, stop, axisSize - 1);
    }
    return stop;
}
//# sourceMappingURL=slice_util.js.map