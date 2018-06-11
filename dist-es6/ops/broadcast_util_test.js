import * as broadcast_util from './broadcast_util';
describe('broadcast_util.getBroadcastShape', function () {
    it('two scalars', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([], []);
        expect(res).toEqual([]);
    });
    it('scalar and 1d', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([6], []);
        expect(res).toEqual([6]);
    });
    it('scalar and 2d', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([2, 6], []);
        expect(res).toEqual([2, 6]);
    });
    it('1d and 2d', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([6], [2, 6]);
        expect(res).toEqual([2, 6]);
    });
    it('2d and 3d', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([2, 6], [7, 2, 6]);
        expect(res).toEqual([7, 2, 6]);
    });
    it('3d and 3d', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([1, 1, 6], [7, 2, 6]);
        expect(res).toEqual([7, 2, 6]);
    });
    it('incompatible inner shape', function () {
        var f = function () {
            return broadcast_util.assertAndGetBroadcastShape([7, 2, 5], [7, 2, 6]);
        };
        expect(f).toThrowError();
    });
    it('incompatible middle shape', function () {
        var f = function () {
            return broadcast_util.assertAndGetBroadcastShape([7, 3, 6], [7, 2, 6]);
        };
        expect(f).toThrowError();
    });
    it('compatible with broadcasting support', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([7, 1, 1], [7, 1, 1]);
        expect(res).toEqual([7, 1, 1]);
    });
    it('3d and 3d, each gets broadcasted', function () {
        var res = broadcast_util.assertAndGetBroadcastShape([4, 1, 7], [1, 3, 1]);
        expect(res).toEqual([4, 3, 7]);
    });
});
describe('broadcast_util.getBroadcastDims', function () {
    it('[] => []', function () {
        var dims = broadcast_util.getBroadcastDims([], []);
        expect(dims.length).toBe(0);
    });
    it('[] => [5, 4]', function () {
        var dims = broadcast_util.getBroadcastDims([], [5, 4]);
        expect(dims.length).toBe(0);
    });
    it('[1] => [5]', function () {
        var dims = broadcast_util.getBroadcastDims([1], [5]);
        expect(dims).toEqual([0]);
    });
    it('[5, 1] => [5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([5, 1], [5, 3]);
        expect(dims).toEqual([1]);
    });
    it('[1, 3] => [5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([1, 3], [5, 3]);
        expect(dims).toEqual([0]);
    });
    it('[1, 1] => [5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([1, 1], [5, 3]);
        expect(dims).toEqual([0, 1]);
    });
    it('[4, 1, 3] => [4, 5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([4, 1, 3], [4, 5, 3]);
        expect(dims).toEqual([1]);
    });
});
describe('broadcast_util.getReductionAxes', function () {
    it('[] => []', function () {
        var axes = broadcast_util.getReductionAxes([], []);
        expect(axes).toEqual([]);
    });
    it('[] => [5, 4]', function () {
        var axes = broadcast_util.getReductionAxes([], [5, 4]);
        expect(axes).toEqual([0, 1]);
    });
    it('[1] => [5]', function () {
        var axes = broadcast_util.getReductionAxes([1], [5]);
        expect(axes).toEqual([0]);
    });
    it('[5, 1] => [5, 3]', function () {
        var axes = broadcast_util.getReductionAxes([5, 1], [5, 3]);
        expect(axes).toEqual([1]);
    });
    it('[1, 3] => [5, 3]', function () {
        var axes = broadcast_util.getReductionAxes([1, 3], [5, 3]);
        expect(axes).toEqual([0]);
    });
    it('[1, 1] => [5, 3]', function () {
        var axes = broadcast_util.getReductionAxes([1, 1], [5, 3]);
        expect(axes).toEqual([0, 1]);
    });
    it('[4, 1, 3] => [4, 5, 3]', function () {
        var axes = broadcast_util.getReductionAxes([4, 1, 3], [4, 5, 3]);
        expect(axes).toEqual([1]);
    });
});
describe('broadcast_util.broadcastDimsAreOuter', function () {
    it('[] => []', function () {
        var dims = broadcast_util.getBroadcastDims([], []);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(true);
    });
    it('[] => [5, 4]', function () {
        var dims = broadcast_util.getBroadcastDims([], [5, 4]);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(true);
    });
    it('[1] => [5]', function () {
        var dims = broadcast_util.getBroadcastDims([1], [5]);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(true);
    });
    it('[5, 1] => [5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([5, 1], [5, 3]);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(false);
    });
    it('[1, 1] => [5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([1, 1], [5, 3]);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(true);
    });
    it('[4, 1, 3] => [4, 5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([4, 1, 3], [4, 5, 3]);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(false);
    });
    it('[1, 1, 3] => [4, 5, 3]', function () {
        var dims = broadcast_util.getBroadcastDims([1, 1, 3], [4, 5, 3]);
        var areOuter = broadcast_util.broadcastDimsAreOuter(dims);
        expect(areOuter).toBe(true);
    });
});
//# sourceMappingURL=broadcast_util_test.js.map