import { nearestDivisor } from '../util';
export var PARALLELIZE_THRESHOLD = 30;
export function computeOptimalWindowSize(inSize) {
    if (inSize <= PARALLELIZE_THRESHOLD) {
        return inSize;
    }
    return nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
}
//# sourceMappingURL=reduce_util.js.map