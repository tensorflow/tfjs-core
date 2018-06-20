export var PARALLELIZE_THRESHOLD = 30;
export function computeOptimalWindowSize(inSize) {
    if (inSize <= PARALLELIZE_THRESHOLD) {
        return inSize;
    }
    return nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
}
function nearestDivisor(size, start) {
    for (var i = start; i < size; ++i) {
        if (size % i === 0) {
            return i;
        }
    }
    return size;
}
//# sourceMappingURL=reduce_util.js.map