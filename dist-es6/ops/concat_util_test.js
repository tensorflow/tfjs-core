import * as concat_util from './concat_util';
describe('concat_util.assertConcatShapesMatch rank=3D', function () {
    it('Non-3D tensor x1', function () {
        var assertFn = function () {
            concat_util.assertParams([1], [1, 2, 3], 1);
        };
        expect(assertFn).toThrow();
    });
    it('Non-3D tensor x2', function () {
        var assertFn = function () {
            concat_util.assertParams([1, 2, 3], [2, 3], 1);
        };
        expect(assertFn).toThrow();
    });
    it('axis out of bound', function () {
        var assertFn = function () {
            concat_util.assertParams([1, 2, 3], [1, 2, 3], 4);
        };
        expect(assertFn).toThrow();
    });
    it('non-axis shape mismatch', function () {
        var assertFn = function () {
            concat_util.assertParams([2, 3, 3], [2, 2, 4], 2);
        };
        expect(assertFn).toThrow();
    });
    it('shapes line up', function () {
        var assertFn = function () {
            concat_util.assertParams([2, 3, 3], [2, 3, 4], 2);
        };
        expect(assertFn).not.toThrow();
    });
});
describe('concat_util.computeConcatOutputShape', function () {
    it('compute output shape, axis=0', function () {
        expect(concat_util.computeOutShape([2, 2, 3], [1, 2, 3], 0)).toEqual([
            3, 2, 3
        ]);
    });
});
describe('concat_util.computeBackpropSizes', function () {
    it('compute backprop sizes of 2D tensors, original axis=0', function () {
        var a = [1, 6];
        var b = [1, 8];
        var _a = concat_util.computeGradientSliceShapes(a, b), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
        expect(aBegin).toEqual([0, 0]);
        expect(aSize).toEqual([1, 6]);
        expect(bBegin).toEqual([0, 6]);
        expect(bSize).toEqual([1, 8]);
    });
    it('compute backprop sizes of 2D tensors, original axis=1', function () {
        var a = [3, 2];
        var b = [3, 7];
        var _a = concat_util.computeGradientSliceShapes(a, b), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
        expect(aBegin).toEqual([0, 0]);
        expect(aSize).toEqual([3, 2]);
        expect(bBegin).toEqual([0, 2]);
        expect(bSize).toEqual([3, 7]);
    });
});
//# sourceMappingURL=concat_util_test.js.map