import { expectArraysClose, expectNumbersClose, WEBGL_ENVS } from '../../test_util';
import { describeWithFlags } from '../../jasmine_util';
import { GPGPUContext } from './gpgpu_context';
import * as tex_util from './tex_util';
describeWithFlags('GPGPUContext downloadMatrixFromTexture', WEBGL_ENVS, function () {
    var gpgpu;
    var texture;
    beforeEach(function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
        texture = gpgpu.createMatrixTexture(1, 1);
    });
    afterEach(function () {
        gpgpu.deleteMatrixTexture(texture);
        gpgpu.dispose();
    });
    it('returns 1x1 matrix that was uploaded', function () {
        gpgpu.uploadMatrixToTexture(texture, 1, 1, new Float32Array([1.234]));
        var result = gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        expectNumbersClose(result[0], 1.234);
    });
    it('returns 2x2 matrix that was uploaded', function () {
        var texture2 = gpgpu.createMatrixTexture(2, 2);
        gpgpu.uploadMatrixToTexture(texture2, 2, 2, new Float32Array([1.234, 2, 3, 4]));
        var result = gpgpu.downloadMatrixFromTexture(texture2, 2, 2);
        expectArraysClose(result, new Float32Array([1.234, 2, 3, 4]));
        gpgpu.deleteMatrixTexture(texture2);
    });
    it('uses texture parameter', function () {
        var texture2 = gpgpu.createMatrixTexture(1, 1);
        gpgpu.uploadMatrixToTexture(texture, 1, 1, new Float32Array([1]));
        gpgpu.uploadMatrixToTexture(texture2, 1, 1, new Float32Array([2]));
        var read1 = gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        var read2 = gpgpu.downloadMatrixFromTexture(texture2, 1, 1);
        expectNumbersClose(read1[0], 1);
        expectNumbersClose(read2[0], 2);
        gpgpu.deleteMatrixTexture(texture2);
    });
});
describeWithFlags('GPGPUContext color texture with float', WEBGL_ENVS, function () {
    var gpgpu;
    var texture;
    afterEach(function () {
        gpgpu.deleteMatrixTexture(texture);
        gpgpu.dispose();
    });
    it('basic', function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
        texture = gpgpu.createMatrixTexture(1, 1);
        gpgpu.setOutputMatrixTexture(texture, 1, 1);
        gpgpu.gl.clearColor(0.123, 0, 0, 0);
        gpgpu.gl.clear(gpgpu.gl.COLOR_BUFFER_BIT);
        var result = gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        expectNumbersClose(result[0], 0.123);
    });
});
describeWithFlags('GPGPUContext color texture with byte', { 'WEBGL_FLOAT_TEXTURE_ENABLED': false }, function () {
    var gpgpu;
    var texture;
    afterEach(function () {
        gpgpu.deleteMatrixTexture(texture);
        gpgpu.dispose();
    });
    it('basic', function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
        texture = gpgpu.createMatrixTexture(1, 1);
        gpgpu.setOutputMatrixTexture(texture, 1, 1);
        var uintArray = tex_util.encodeFloatArray(new Float32Array([0.123]));
        gpgpu.gl.clearColor(uintArray[0] / 255, uintArray[1] / 255, uintArray[2] / 255, uintArray[3] / 255);
        gpgpu.gl.clear(gpgpu.gl.COLOR_BUFFER_BIT);
        var result = gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        expectNumbersClose(result[0], 0.123);
    });
});
describeWithFlags('GPGPUContext setOutputMatrixTexture', WEBGL_ENVS, function () {
    var gpgpu;
    var texture;
    beforeEach(function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
        texture = gpgpu.createMatrixTexture(1, 1);
    });
    afterEach(function () {
        gpgpu.deleteMatrixTexture(texture);
        gpgpu.dispose();
    });
    it('sets the output texture property to the output texture', function () {
        gpgpu.setOutputMatrixTexture(texture, 1, 1);
        expect(gpgpu.outputTexture).toBe(texture);
    });
    it('rebinds the output texture to the color buffer target', function () {
        var output = gpgpu.createMatrixTexture(1, 1);
        gpgpu.uploadMatrixToTexture(texture, 1, 1, new Float32Array([10]));
        gpgpu.setOutputMatrixTexture(output, 1, 1);
        var tBeforeClear = gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        expectNumbersClose(tBeforeClear[0], 10);
        gpgpu.gl.clearColor(1, 0, 0, 0);
        gpgpu.gl.clear(gpgpu.gl.COLOR_BUFFER_BIT);
        var tAfterClear = gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        expectNumbersClose(tAfterClear[0], 10);
        gpgpu.deleteMatrixTexture(output);
    });
    it('resets output texture to null if nothing was previously bound', function () {
        expect(gpgpu.outputTexture).toBeNull();
        gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        expect(gpgpu.outputTexture).toBeNull();
    });
    it('sets the gl viewport to the output texture dimensions', function () {
        var columns = 456;
        var rows = 123;
        var output = gpgpu.createMatrixTexture(rows, columns);
        gpgpu.setOutputMatrixTexture(output, rows, columns);
        var expected = new Int32Array([0, 0, columns, rows]);
        expect(gpgpu.gl.getParameter(gpgpu.gl.VIEWPORT)).toEqual(expected);
        gpgpu.deleteMatrixTexture(output);
    });
    it('doesn\'t change gl viewport when downloading a non-output tex', function () {
        var output = gpgpu.createMatrixTexture(128, 128);
        gpgpu.setOutputMatrixTexture(output, 128, 128);
        gpgpu.downloadMatrixFromTexture(texture, 1, 1);
        var expected = new Int32Array([0, 0, 128, 128]);
        expect(gpgpu.gl.getParameter(gpgpu.gl.VIEWPORT)).toEqual(expected);
        gpgpu.deleteMatrixTexture(output);
    });
});
describeWithFlags('GPGPUContext setOutputPackedMatrixTexture', WEBGL_ENVS, function () {
    var gpgpu;
    var texture;
    beforeEach(function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
    });
    afterEach(function () {
        if (texture != null) {
            gpgpu.deleteMatrixTexture(texture);
        }
        gpgpu.dispose();
    });
    it('sets the output texture property to the output texture', function () {
        texture = gpgpu.createPackedMatrixTexture(1, 1);
        gpgpu.setOutputPackedMatrixTexture(texture, 1, 1);
        expect(gpgpu.outputTexture).toBe(texture);
    });
    it('sets the gl viewport to the output packed texture dimensions', function () {
        var columns = 456;
        var rows = 123;
        texture = gpgpu.createPackedMatrixTexture(rows, columns);
        gpgpu.setOutputPackedMatrixTexture(texture, rows, columns);
        var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        var expected = new Int32Array([0, 0, width, height]);
        expect(gpgpu.gl.getParameter(gpgpu.gl.VIEWPORT)).toEqual(expected);
    });
});
describeWithFlags('GPGPUContext setOutputMatrixWriteRegion', WEBGL_ENVS, function () {
    var gpgpu;
    var program;
    var output;
    beforeEach(function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
        var src = 'precision highp float; void main() { gl_FragColor = vec4(2,0,0,0); }';
        program = gpgpu.createProgram(src);
        output = gpgpu.createMatrixTexture(4, 4);
        gpgpu.uploadMatrixToTexture(output, 4, 4, new Float32Array(16));
        gpgpu.setOutputMatrixTexture(output, 4, 4);
        gpgpu.setProgram(program);
    });
    afterEach(function () {
        gpgpu.deleteMatrixTexture(output);
        gpgpu.deleteProgram(program);
        gpgpu.dispose();
    });
    it('writes to all pixels by default', function () {
        gpgpu.executeProgram();
        var result = gpgpu.downloadMatrixFromTexture(output, 4, 4);
        var expected = new Float32Array(4 * 4);
        expected.fill(2);
        expectArraysClose(result, expected);
    });
    it('sets the scissor box to the requested parameters', function () {
        gpgpu.setOutputMatrixWriteRegion(0, 1, 2, 3);
        var scissorBox = gpgpu.gl.getParameter(gpgpu.gl.SCISSOR_BOX);
        expect(scissorBox[0]).toEqual(2);
        expect(scissorBox[1]).toEqual(0);
        expect(scissorBox[2]).toEqual(3);
        expect(scissorBox[3]).toEqual(1);
    });
    it('writes only to center 2x2 region of 4x4 texture', function () {
        gpgpu.setOutputMatrixWriteRegion(1, 2, 1, 2);
        gpgpu.executeProgram();
        var result = gpgpu.downloadMatrixFromTexture(output, 4, 4);
        var expected = new Float32Array([0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0]);
        expectArraysClose(result, expected);
    });
    it('preserves data from previous writes outside of write region', function () {
        gpgpu.setOutputMatrixWriteRegion(0, 1, 0, 4);
        gpgpu.executeProgram();
        gpgpu.setOutputMatrixWriteRegion(3, 1, 0, 4);
        gpgpu.executeProgram();
        var result = gpgpu.downloadMatrixFromTexture(output, 4, 4);
        var expected = new Float32Array([2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2]);
        expectArraysClose(result, expected);
    });
    it('writes adjacent cells across multiple calls', function () {
        for (var row = 0; row < 4; ++row) {
            for (var col = 0; col < 4; ++col) {
                gpgpu.setOutputMatrixWriteRegion(row, 1, col, 1);
                gpgpu.executeProgram();
            }
        }
        var result = gpgpu.downloadMatrixFromTexture(output, 4, 4);
        var expected = new Float32Array(4 * 4);
        expected.fill(2);
        expectArraysClose(result, expected);
    });
});
describeWithFlags('GPGPUContext', WEBGL_ENVS, function () {
    var gpgpu;
    beforeEach(function () {
        gpgpu = new GPGPUContext();
        gpgpu.enableAutomaticDebugValidation(true);
    });
    afterEach(function () {
        gpgpu.dispose();
    });
    it('throws an error if used after dispose', function () {
        var gpgpuContext = new GPGPUContext();
        gpgpuContext.dispose();
        expect(gpgpuContext.dispose).toThrowError();
    });
    it('throws an error if validation is on and framebuffer incomplete', function () {
        var src = "precision highp float; void main() {}";
        var program = gpgpu.createProgram(src);
        var result = gpgpu.createMatrixTexture(1, 1);
        gpgpu.setOutputMatrixTexture(result, 1, 1);
        gpgpu.setProgram(program);
        gpgpu.deleteMatrixTexture(result);
        expect(gpgpu.executeProgram).toThrowError();
        gpgpu.deleteProgram(program);
    });
});
//# sourceMappingURL=gpgpu_context_test.js.map