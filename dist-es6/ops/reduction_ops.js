var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import { customGrad } from '../globals';
import * as util from '../util';
import * as axis_util from './axis_util';
import { operation } from './operation';
import * as ops from './ops';
var ReductionOps = (function () {
    function ReductionOps() {
    }
    ReductionOps.logSumExp = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = util.assertArgIsTensor(x, 'x', 'logSumExp');
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var xMax = $x.max(axes, true);
        var a = $x.sub(xMax);
        var b = a.exp();
        var c = b.sum(axes);
        var d = c.log();
        var res = xMax.reshape(d.shape).add(d);
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, axes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.sum = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = util.assertArgIsTensor(x, 'x', 'sum');
        if ($x.dtype === 'bool') {
            $x = $x.toInt();
        }
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var customOp = customGrad(function (x) {
            var permutation = axis_util.getAxesPermutation(axes, x.rank);
            var reductionAxes = axes;
            var permutedX = x;
            if (permutation != null) {
                permutedX = x.transpose(permutation);
                reductionAxes =
                    axis_util.getInnerMostAxes(reductionAxes.length, x.rank);
            }
            var value = ENV.engine.runKernel(function (backend) { return backend.sum(permutedX, reductionAxes); }, { permutedX: permutedX });
            if (keepDims) {
                var newShape = axis_util.expandShapeToKeepDim(value.shape, axes);
                value = value.reshape(newShape);
            }
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(ops.ones(x.shape, 'float32'));
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($x);
    };
    ReductionOps.mean = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = util.assertArgIsTensor(x, 'x', 'mean');
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var shapes = axis_util.computeOutAndReduceShapes($x.shape, axes);
        var reduceShape = shapes[1];
        var reduceSize = util.sizeFromShape(reduceShape);
        var customOp = customGrad(function (x) {
            var reduceSizeScalar = ops.scalar(reduceSize);
            var xReduce = reduceSizeScalar.dtype === x.dtype ?
                x :
                x.cast(reduceSizeScalar.dtype);
            var res = xReduce.div(reduceSizeScalar);
            var value = res.sum(axis, keepDims);
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(ops.ones(x.shape, 'float32')).div(reduceSizeScalar);
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($x);
    };
    ReductionOps.min = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = util.assertArgIsTensor(x, 'x', 'min');
        var origAxes = axis_util.parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        var res = ENV.engine.runKernel(function (backend) { return backend.min($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.max = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = util.assertArgIsTensor(x, 'x', 'max');
        var origAxes = axis_util.parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        var res = ENV.engine.runKernel(function (backend) { return backend.max($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.argMin = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = util.assertArgIsTensor(x, 'x', 'argMin');
        if (axis == null) {
            axis = 0;
        }
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        return ENV.engine.runKernel(function (backend) { return backend.argMin($x, axes[0]); }, { $x: $x });
    };
    ReductionOps.argMax = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = util.assertArgIsTensor(x, 'x', 'argMax');
        if (axis == null) {
            axis = 0;
        }
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        return ENV.engine.runKernel(function (backend) { return backend.argMax($x, axes[0]); }, { $x: $x });
    };
    ReductionOps.moments = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        x = util.assertArgIsTensor(x, 'x', 'moments');
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var mean = x.mean(axes, keepDims);
        var keepDimsShape = mean.shape;
        if (!keepDims) {
            keepDimsShape = axis_util.expandShapeToKeepDim(mean.shape, axes);
        }
        var devSquared = x.toFloat().sub(mean.reshape(keepDimsShape)).square();
        var variance = devSquared.mean(axes, keepDims);
        return { mean: mean, variance: variance };
    };
    ReductionOps.unsortedSegmentSum = function (x, segmentIds, numSegments, axis) {
        if (axis === void 0) { axis = 0; }
        util.assertArgumentsAreTensors({ x: x, segmentIds: segmentIds }, 'unsortedSegmentSum');
        util.assert(segmentIds.dtype === 'int32', 'Segment Ids must be of dtype `int32`');
        axis = axis_util.parseAxisParam(axis, x.shape)[0];
        var res = [];
        var dim = segmentIds.shape[0];
        var newShape = [];
        for (var i = 0; i < x.shape.length; i++) {
            if (i === axis) {
                newShape.push(dim);
            }
            else {
                newShape.push(1);
            }
        }
        var reshapedSegmentIds = ops.reshape(segmentIds, newShape);
        for (var i = 0; i < numSegments; i++) {
            var segmentId = ops.scalar(i, 'int32');
            var mask = ops.equal(segmentId, reshapedSegmentIds).asType('float32');
            var sum = mask.mul(x).sum(axis);
            res.push(sum);
        }
        return ops.stack(res, axis);
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "logSumExp", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "sum", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "mean", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "min", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "max", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "argMin", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "argMax", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation
    ], ReductionOps, "moments", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation
    ], ReductionOps, "unsortedSegmentSum", null);
    return ReductionOps;
}());
export { ReductionOps };
//# sourceMappingURL=reduction_ops.js.map