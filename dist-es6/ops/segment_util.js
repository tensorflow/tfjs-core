import { nearestDivisor } from '../util';
import { PARALLELIZE_THRESHOLD } from './reduce_util';
export function segOpComputeOptimalWindowSize(inSize, numSegments) {
    var done = false;
    var res;
    if (inSize <= PARALLELIZE_THRESHOLD) {
        res = inSize;
        done = true;
    }
    else {
        res = nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
    }
    while (!done) {
        if (res > numSegments || res === inSize) {
            done = true;
            break;
        }
        else {
            res = nearestDivisor(inSize, res + 1);
        }
    }
    return res;
}
export function computeOutShape(aShape, axis, numSegments) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (dim !== axis) {
            outShape.push(aShape[dim]);
        }
        else {
            outShape.push(numSegments);
        }
    }
    return outShape;
}
//# sourceMappingURL=segment_util.js.map