import { WEBGL_ENVS } from '../../test_util';
import { describeWithFlags } from '../../jasmine_util';
import { GPGPUContext } from './gpgpu_context';
import * as gpgpu_util from './gpgpu_util';
describeWithFlags('gpgpu_util createWebGLContext', WEBGL_ENVS, function () {
    var gpgpu;
    beforeEach(function () {
        gpgpu = new GPGPUContext();
    });
    afterEach(function () {
        gpgpu.dispose();
    });
    it('disables DEPTH_TEST and STENCIL_TEST', function () {
        expect(gpgpu.gl.getParameter(gpgpu.gl.DEPTH_TEST)).toEqual(false);
        expect(gpgpu.gl.getParameter(gpgpu.gl.STENCIL_TEST)).toEqual(false);
    });
    it('disables BLEND', function () {
        expect(gpgpu.gl.getParameter(gpgpu.gl.BLEND)).toEqual(false);
    });
    it('disables DITHER, POLYGON_OFFSET_FILL', function () {
        expect(gpgpu.gl.getParameter(gpgpu.gl.DITHER)).toEqual(false);
        expect(gpgpu.gl.getParameter(gpgpu.gl.POLYGON_OFFSET_FILL)).toEqual(false);
    });
    it('enables CULL_FACE with BACK', function () {
        expect(gpgpu.gl.getParameter(gpgpu.gl.CULL_FACE)).toEqual(true);
        expect(gpgpu.gl.getParameter(gpgpu.gl.CULL_FACE_MODE))
            .toEqual(gpgpu.gl.BACK);
    });
    it('enables SCISSOR_TEST', function () {
        expect(gpgpu.gl.getParameter(gpgpu.gl.SCISSOR_TEST)).toEqual(true);
    });
});
describeWithFlags('gpgpu_util createMatrixTexture', WEBGL_ENVS, function () {
    it('sets the TEXTURE_WRAP S+T parameters to CLAMP_TO_EDGE', function () {
        var gpgpu = new GPGPUContext();
        var tex = gpgpu_util.createMatrixTexture(gpgpu.gl, 32, 32);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, tex);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_WRAP_S))
            .toEqual(gpgpu.gl.CLAMP_TO_EDGE);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_WRAP_T))
            .toEqual(gpgpu.gl.CLAMP_TO_EDGE);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, null);
        gpgpu.deleteMatrixTexture(tex);
        gpgpu.dispose();
    });
    it('sets the TEXTURE_[MIN|MAG]_FILTER parameters to NEAREST', function () {
        var gpgpu = new GPGPUContext();
        var tex = gpgpu_util.createMatrixTexture(gpgpu.gl, 32, 32);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, tex);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_MIN_FILTER))
            .toEqual(gpgpu.gl.NEAREST);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_MAG_FILTER))
            .toEqual(gpgpu.gl.NEAREST);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, null);
        gpgpu.deleteMatrixTexture(tex);
        gpgpu.dispose();
    });
});
describeWithFlags('gpgpu_util createPackedMatrixTexture', WEBGL_ENVS, function () {
    it('sets the TEXTURE_WRAP S+T parameters to CLAMP_TO_EDGE', function () {
        var gpgpu = new GPGPUContext();
        var tex = gpgpu_util.createPackedMatrixTexture(gpgpu.gl, 32, 32);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, tex);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_WRAP_S))
            .toEqual(gpgpu.gl.CLAMP_TO_EDGE);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_WRAP_T))
            .toEqual(gpgpu.gl.CLAMP_TO_EDGE);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, null);
        gpgpu.deleteMatrixTexture(tex);
        gpgpu.dispose();
    });
    it('sets the TEXTURE_[MIN|MAG]_FILTER parameters to NEAREST', function () {
        var gpgpu = new GPGPUContext();
        var tex = gpgpu_util.createPackedMatrixTexture(gpgpu.gl, 32, 32);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, tex);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_MIN_FILTER))
            .toEqual(gpgpu.gl.NEAREST);
        expect(gpgpu.gl.getTexParameter(gpgpu.gl.TEXTURE_2D, gpgpu.gl.TEXTURE_MAG_FILTER))
            .toEqual(gpgpu.gl.NEAREST);
        gpgpu.gl.bindTexture(gpgpu.gl.TEXTURE_2D, null);
        gpgpu.deleteMatrixTexture(tex);
        gpgpu.dispose();
    });
});
//# sourceMappingURL=gpgpu_util_test.js.map