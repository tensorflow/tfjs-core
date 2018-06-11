var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import { ArrayOps } from './array_ops';
import * as axis_util from './axis_util';
import { BinaryOps } from './binary_ops';
import { CompareOps } from './compare';
import { LogicalOps } from './logical_ops';
import { operation } from './operation';
var SegmentOps = (function () {
    function SegmentOps() {
    }
    SegmentOps.unsortedSegmentSum = function (x, segmentIds, numSegments) {
        util.assertArgumentsAreTensors({ x: x, segmentIds: segmentIds }, 'unsortedSegmentSum');
        util.assert(segmentIds.dtype === 'int32', 'segmentIds must be of dtype `int32`');
        util.assert(util.isInt(numSegments), 'numSegments must be of dtype int');
        var axis = 0;
        var permutation = axis_util.getAxesPermutation([axis], x.rank);
        var permutedX = x;
        if (permutation != null) {
            permutedX = x.transpose(permutation);
            axis = axis_util.getInnerMostAxes(1, x.rank)[0];
        }
        var gradFunc = function (dy) {
            var derX = function () {
                return gatherDropNegatives(dy, segmentIds, axis);
            };
            return { permutedX: derX };
        };
        var result = ENV.engine.runKernel(function (backend) {
            return backend.unsortedSegmentSum(permutedX, segmentIds, numSegments);
        }, { permutedX: permutedX }, gradFunc);
        if (permutation != null) {
            result = result.transpose(axis_util.getUndoAxesPermutation(permutation));
        }
        return result;
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Segment' }),
        operation
    ], SegmentOps, "unsortedSegmentSum", null);
    return SegmentOps;
}());
export { SegmentOps };
function gatherDropNegatives(x, indices, axis) {
    var zeroClippedIndices = BinaryOps.maximum(indices, ArrayOps.zerosLike(indices));
    var gathered = ArrayOps.gather(x, zeroClippedIndices, axis);
    var isPositive = CompareOps.greaterEqual(indices, ArrayOps.scalar(0, 'int32'));
    for (var i = 0; i < gathered.rank - isPositive.rank; ++i) {
        isPositive = ArrayOps.expandDims(isPositive, -1);
    }
    var bools = ArrayOps.onesLike(gathered).equal(ArrayOps.scalar(1));
    isPositive = LogicalOps.logicalAnd(isPositive, bools);
    var zeroSlice = ArrayOps.zerosLike(gathered);
    return LogicalOps.where(isPositive, gathered, zeroSlice);
}
//# sourceMappingURL=segment_ops.js.map