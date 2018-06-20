import { WEBGL_ENVS } from '../../test_util';
import { describeWithFlags } from '../../jasmine_util';
import * as gpgpu_util from './gpgpu_util';
import * as webgl_util from './webgl_util';
describeWithFlags('webgl_util getTextureShapeFromLogicalShape', WEBGL_ENVS, function () {
    var gl;
    beforeEach(function () {
        gl = gpgpu_util.createWebGLContext();
    });
    it('scalar', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, []);
        expect(texShape).toEqual([1, 1]);
    });
    it('1d', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [4]);
        expect(texShape).toEqual([4, 1]);
    });
    it('2d stays same', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [5, 2]);
        expect(texShape).toEqual([5, 2]);
        texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [5, 1]);
        expect(texShape).toEqual([5, 1]);
        texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [1, 5]);
        expect(texShape).toEqual([1, 5]);
    });
    it('3d 2x3x4', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [2, 3, 4]);
        expect(texShape).toEqual([2, 12]);
    });
    it('3d 2x1x4 got squeezed', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [2, 1, 4]);
        expect(texShape).toEqual([2, 4]);
    });
    it('3d 1x8x2 got squeezed', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [1, 8, 2]);
        expect(texShape).toEqual([8, 2]);
    });
    it('4d 1x8x1x3 got squeezed', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [1, 8, 1, 3]);
        expect(texShape).toEqual([8, 3]);
    });
    it('4d 1x3x1x8 got squeezed', function () {
        var texShape = webgl_util.getTextureShapeFromLogicalShape(gl, [1, 3, 1, 8]);
        expect(texShape).toEqual([3, 8]);
    });
});
//# sourceMappingURL=webgl_util_test.js.map