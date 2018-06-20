import * as tf from '../index';
import { CPU_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
import * as axis_util from './axis_util';
describe('axis_util combineLocations', function () {
    it('rank 4, reduce last 2 dims', function () {
        var loc = axis_util.combineLocations([4, 1], [3, 7], [2, 3]);
        expect(loc).toEqual([4, 1, 3, 7]);
    });
    it('rank 4, reduce first two dims', function () {
        var loc = axis_util.combineLocations([4, 1], [3, 7], [0, 1]);
        expect(loc).toEqual([3, 7, 4, 1]);
    });
    it('rank 4, reduce 1st and 3rd dims', function () {
        var loc = axis_util.combineLocations([4, 1], [3, 7], [0, 2]);
        expect(loc).toEqual([3, 4, 7, 1]);
    });
    it('rank 4, reduce 1st and 4th dims', function () {
        var loc = axis_util.combineLocations([4, 1], [3, 7], [0, 3]);
        expect(loc).toEqual([3, 4, 1, 7]);
    });
    it('rank 3, reduce all dims', function () {
        var loc = axis_util.combineLocations([], [3, 7, 1], [0, 1, 2]);
        expect(loc).toEqual([3, 7, 1]);
    });
    it('rank 2, reduce last dim', function () {
        var loc = axis_util.combineLocations([3], [5], [1]);
        expect(loc).toEqual([3, 5]);
    });
    it('rank 2, reduce first dim', function () {
        var loc = axis_util.combineLocations([3], [5], [0]);
        expect(loc).toEqual([5, 3]);
    });
});
describe('axis_util computeOutAndReduceShapes', function () {
    it('rank 4, reduce all dims', function () {
        var _a = axis_util.computeOutAndReduceShapes([3, 7, 2, 4], [0, 1, 2, 3]), out = _a[0], red = _a[1];
        expect(out).toEqual([]);
        expect(red).toEqual([3, 7, 2, 4]);
    });
    it('rank 4, reduce last 2 dims', function () {
        var _a = axis_util.computeOutAndReduceShapes([3, 7, 2, 4], [2, 3]), out = _a[0], red = _a[1];
        expect(out).toEqual([3, 7]);
        expect(red).toEqual([2, 4]);
    });
    it('rank 4, reduce first 2 dims', function () {
        var _a = axis_util.computeOutAndReduceShapes([3, 7, 2, 4], [0, 1]), out = _a[0], red = _a[1];
        expect(out).toEqual([2, 4]);
        expect(red).toEqual([3, 7]);
    });
    it('rank 4, reduce last 3 dims', function () {
        var _a = axis_util.computeOutAndReduceShapes([3, 7, 2, 4], [1, 2, 3]), out = _a[0], red = _a[1];
        expect(out).toEqual([3]);
        expect(red).toEqual([7, 2, 4]);
    });
    it('rank 4, reduce 1st and 3rd dims', function () {
        var _a = axis_util.computeOutAndReduceShapes([3, 7, 2, 4], [0, 2]), out = _a[0], red = _a[1];
        expect(out).toEqual([7, 4]);
        expect(red).toEqual([3, 2]);
    });
    it('rank 3, reduce all dims', function () {
        var _a = axis_util.computeOutAndReduceShapes([3, 7, 2], [0, 1, 2]), out = _a[0], red = _a[1];
        expect(out).toEqual([]);
        expect(red).toEqual([3, 7, 2]);
    });
});
describe('axis_util axesAreInnerMostDims', function () {
    it('rank 4, reduce last dim', function () {
        var res = axis_util.axesAreInnerMostDims([3], 4);
        expect(res).toBe(true);
    });
    it('rank 4, reduce last 2 dims', function () {
        var res = axis_util.axesAreInnerMostDims([2, 3], 4);
        expect(res).toBe(true);
    });
    it('rank 4, reduce last 3 dims', function () {
        var res = axis_util.axesAreInnerMostDims([1, 2, 3], 4);
        expect(res).toBe(true);
    });
    it('rank 4, reduce all dims', function () {
        var res = axis_util.axesAreInnerMostDims([0, 1, 2, 3], 4);
        expect(res).toBe(true);
    });
    it('rank 4, reduce all but 2nd', function () {
        var res = axis_util.axesAreInnerMostDims([0, 2, 3], 4);
        expect(res).toBe(false);
    });
    it('rank 4, reduce all but 3rd', function () {
        var res = axis_util.axesAreInnerMostDims([0, 1, 3], 4);
        expect(res).toBe(false);
    });
    it('rank 4, reduce all but last', function () {
        var res = axis_util.axesAreInnerMostDims([0, 1, 2], 4);
        expect(res).toBe(false);
    });
});
describe('axis_util expandShapeToKeepDim', function () {
    it('2d -> 1d axis=0', function () {
        var shape = axis_util.expandShapeToKeepDim([2], [0]);
        expect(shape).toEqual([1, 2]);
    });
    it('2d -> 1d axis=1', function () {
        var shape = axis_util.expandShapeToKeepDim([4], [1]);
        expect(shape).toEqual([4, 1]);
    });
    it('3d -> 1d axis=1,2', function () {
        var shape = axis_util.expandShapeToKeepDim([7], [1, 2]);
        expect(shape).toEqual([7, 1, 1]);
    });
    it('3d -> 2d axis=1', function () {
        var shape = axis_util.expandShapeToKeepDim([7, 3], [1]);
        expect(shape).toEqual([7, 1, 3]);
    });
});
describe('axis_util getPermAxes', function () {
    it('all axes, no perm is needed', function () {
        var perm = axis_util.getAxesPermutation([0, 1, 2], 3);
        expect(perm).toBeNull();
    });
    it('no axes, no perm is needed', function () {
        var perm = axis_util.getAxesPermutation([], 3);
        expect(perm).toBeNull();
    });
    it('inner most 2 axes, no perm is needed', function () {
        var perm = axis_util.getAxesPermutation([2, 3], 4);
        expect(perm).toBeNull();
    });
    it('outer most axis, perm is needed', function () {
        var perm = axis_util.getAxesPermutation([0], 4);
        expect(perm).toEqual([1, 2, 3, 0]);
    });
    it('2 outer most axes, perm is needed', function () {
        var perm = axis_util.getAxesPermutation([0, 1], 4);
        expect(perm).toEqual([2, 3, 0, 1]);
    });
});
describe('axis_util parseAxisParam', function () {
    it('axis=null returns no axes for scalar', function () {
        var axis = null;
        var shape = [];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([]);
    });
    it('axis=null returns 0 axis for Tensor1D', function () {
        var axis = null;
        var shape = [4];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([0]);
    });
    it('axis=null returns all axes for Tensor3D', function () {
        var axis = null;
        var shape = [3, 1, 2];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([0, 1, 2]);
    });
    it('axis as a single number', function () {
        var axis = 1;
        var shape = [3, 1, 2];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([1]);
    });
    it('axis as single negative number', function () {
        var axis = -1;
        var shape = [3, 1, 2];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([2]);
        var axis2 = -2;
        expect(axis_util.parseAxisParam(axis2, shape)).toEqual([1]);
        var axis3 = -3;
        expect(axis_util.parseAxisParam(axis3, shape)).toEqual([0]);
    });
    it('axis as list of negative numbers', function () {
        var axis = [-1, -3];
        var shape = [3, 1, 2];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([2, 0]);
    });
    it('axis as list of positive numbers', function () {
        var axis = [0, 2];
        var shape = [3, 1, 2];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([0, 2]);
    });
    it('axis as combo of positive and negative numbers', function () {
        var axis = [0, -1];
        var shape = [3, 1, 2];
        expect(axis_util.parseAxisParam(axis, shape)).toEqual([0, 2]);
    });
    it('axis out of range throws error', function () {
        var axis = -4;
        var shape = [3, 1, 2];
        expect(function () { return axis_util.parseAxisParam(axis, shape); }).toThrowError();
        var axis2 = 4;
        expect(function () { return axis_util.parseAxisParam(axis2, shape); }).toThrowError();
    });
    it('axis a list with one number out of range throws error', function () {
        var axis = [0, 4];
        var shape = [3, 1, 2];
        expect(function () { return axis_util.parseAxisParam(axis, shape); }).toThrowError();
    });
    it('axis with decimal value throws error', function () {
        var axis = 0.5;
        var shape = [3, 1, 2];
        expect(function () { return axis_util.parseAxisParam(axis, shape); }).toThrowError();
    });
});
describeWithFlags('axis_util getUndoAxesPermutation', CPU_ENVS, function () {
    it('4d axes', function () {
        var axes = [2, 0, 1, 3];
        expect(axis_util.getUndoAxesPermutation(axes)).toEqual([1, 2, 0, 3]);
    });
    it('3d axes, no perm', function () {
        var axes = [0, 1, 2];
        expect(axis_util.getUndoAxesPermutation(axes)).toEqual([0, 1, 2]);
    });
    it('3d axes, complete flip', function () {
        var axes = [2, 1, 0];
        expect(axis_util.getUndoAxesPermutation(axes)).toEqual([2, 1, 0]);
    });
    it('4d array with values', function () {
        var axes = [2, 0, 1, 3];
        var undoPermutation = axis_util.getUndoAxesPermutation(axes);
        var a = tf.randomNormal([2, 3, 4, 5]);
        var aT = tf.transpose(a, axes);
        var aTT = tf.transpose(aT, undoPermutation);
        expectArraysClose(a, aTT);
    });
});
//# sourceMappingURL=axis_util_test.js.map