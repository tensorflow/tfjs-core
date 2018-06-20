import { expectArraysClose } from '../../test_util';
import * as tex_util from './tex_util';
describe('tex_util getUnpackedMatrixTextureShapeWidthHeight', function () {
    it('[1x1] => [1x1]', function () {
        expect(tex_util.getUnpackedMatrixTextureShapeWidthHeight(1, 1)).toEqual([
            1, 1
        ]);
    });
    it('[MxN] => [NxM]', function () {
        expect(tex_util.getUnpackedMatrixTextureShapeWidthHeight(123, 456))
            .toEqual([456, 123]);
    });
});
describe('tex_util getPackedMatrixTextureShapeWidthHeight', function () {
    it('[1x1] => [1x1]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(1, 1);
        expect(shape).toEqual([1, 1]);
    });
    it('[1x2] => [1x1]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(1, 2);
        expect(shape).toEqual([1, 1]);
    });
    it('[2x1] => [1x1]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(2, 1);
        expect(shape).toEqual([1, 1]);
    });
    it('[2x2] => [1x1]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(2, 2);
        expect(shape).toEqual([1, 1]);
    });
    it('[3x3] => [2x2]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(3, 3);
        expect(shape).toEqual([2, 2]);
    });
    it('[4x3] => [2x2]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(4, 3);
        expect(shape).toEqual([2, 2]);
    });
    it('[3x4] => [2x2]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(3, 4);
        expect(shape).toEqual([2, 2]);
    });
    it('[4x4] => [2x2]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(4, 4);
        expect(shape).toEqual([2, 2]);
    });
    it('[1024x1024] => [512x512]', function () {
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(1024, 1024);
        expect(shape).toEqual([512, 512]);
    });
    it('[MxN] => [ceil(N/2)xceil(M/2)]', function () {
        var M = 123;
        var N = 5013;
        var shape = tex_util.getPackedMatrixTextureShapeWidthHeight(M, N);
        expect(shape).toEqual([Math.ceil(N / 2), Math.ceil(M / 2)]);
    });
});
describe('tex_util encodeMatrixToUnpackedArray, channels = 4', function () {
    it('1x1 writes the only matrix array value to the only texel', function () {
        var matrix = new Float32Array([1]);
        var unpackedRGBA = new Float32Array([0, 0, 0, 0]);
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedRGBA, 4);
        expectArraysClose(unpackedRGBA, new Float32Array([1, 0, 0, 0]));
    });
    it('1x1 can upload texels with values greater than 1', function () {
        var matrix = new Float32Array([100]);
        var unpackedRGBA = new Float32Array([0, 0, 0, 0]);
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedRGBA, 4);
        expectArraysClose(unpackedRGBA, new Float32Array([100, 0, 0, 0]));
    });
    it('1x4 each texel has 4 elements with matrix value in R channel', function () {
        var matrix = new Float32Array([1, 2, 3, 4]);
        var unpackedRGBA = new Float32Array(16);
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedRGBA, 4);
        expectArraysClose(unpackedRGBA, new Float32Array([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0]));
    });
});
describe('tex_util encodeMatrixToUnpackedArray, channels = 1', function () {
    it('1x1 writes the only matrix array value to the only texel', function () {
        var matrix = new Float32Array([1]);
        var unpackedRGBA = new Float32Array([0]);
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedRGBA, 1);
        expectArraysClose(unpackedRGBA, new Float32Array([1]));
    });
    it('1x1 can upload texels with values greater than 1', function () {
        var matrix = new Float32Array([100]);
        var unpackedRGBA = new Float32Array([0]);
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedRGBA, 1);
        expectArraysClose(unpackedRGBA, new Float32Array([100]));
    });
    it('1x4 each texel has 4 elements with matrix value in R channel', function () {
        var matrix = new Float32Array([1, 2, 3, 4]);
        var unpackedRGBA = new Float32Array(4);
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedRGBA, 1);
        expectArraysClose(unpackedRGBA, new Float32Array([1, 2, 3, 4]));
    });
});
describe('tex_util decodeMatrixFromUnpackedArray', function () {
    it('1x1 writes the only matrix array value to the first element', function () {
        var unpackedRGBA = new Float32Array([1, 0, 0, 0]);
        var matrix = new Float32Array(1);
        tex_util.decodeMatrixFromUnpackedArray(unpackedRGBA, matrix, 4);
        expect(matrix.length).toEqual(1);
        expect(matrix[0]).toEqual(1);
    });
    it('1x2 writes the second texel R component to the second element', function () {
        var unpackedRGBA = new Float32Array([1, 0, 0, 0, 2, 0, 0, 0]);
        var matrix = new Float32Array(2);
        tex_util.decodeMatrixFromUnpackedArray(unpackedRGBA, matrix, 4);
        expect(matrix.length).toEqual(2);
        expectArraysClose(matrix, new Float32Array([1, 2]));
    });
});
describe('tex_util encodeMatrixToPackedRGBA', function () {
    it('1x1 loads the element into R and 0\'s into GBA', function () {
        var matrix = new Float32Array([1]);
        var packedRGBA = new Float32Array(4);
        tex_util.encodeMatrixToPackedRGBA(matrix, 1, 1, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 0, 0, 0]));
    });
    it('1x2 loads the second element into G and 0\'s into BA', function () {
        var matrix = new Float32Array([1, 2]);
        var packedRGBA = new Float32Array(4);
        tex_util.encodeMatrixToPackedRGBA(matrix, 1, 2, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 2, 0, 0]));
    });
    it('2x1 loads the second element into G and 0\'s into BA', function () {
        var matrix = new Float32Array([1, 2]);
        var packedRGBA = new Float32Array(4);
        tex_util.encodeMatrixToPackedRGBA(matrix, 2, 1, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 0, 2, 0]));
    });
    it('2x2 exactly fills one texel', function () {
        var matrix = new Float32Array([1, 2, 3, 4]);
        var packedRGBA = new Float32Array(4);
        tex_util.encodeMatrixToPackedRGBA(matrix, 2, 2, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 2, 3, 4]));
    });
    it('4x3 pads the final column G and A channels with 0', function () {
        var matrix = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        var packedRGBA = new Float32Array(16);
        tex_util.encodeMatrixToPackedRGBA(matrix, 4, 3, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 2, 4, 5, 3, 0, 6, 0, 7, 8, 10, 11, 9, 0, 12, 0]));
    });
    it('3x4 pads the final row B and A channels with 0', function () {
        var matrix = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        var packedRGBA = new Float32Array(16);
        tex_util.encodeMatrixToPackedRGBA(matrix, 3, 4, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 2, 5, 6, 3, 4, 7, 8, 9, 10, 0, 0, 11, 12, 0, 0]));
    });
    it('3x3 bottom-right texel is R000', function () {
        var matrix = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        var packedRGBA = new Float32Array(16);
        tex_util.encodeMatrixToPackedRGBA(matrix, 3, 3, packedRGBA);
        expectArraysClose(packedRGBA, new Float32Array([1, 2, 4, 5, 3, 0, 6, 0, 7, 8, 0, 0, 9, 0, 0, 0]));
    });
});
describe('tex_util decodeMatrixFromPackedRGBA', function () {
    it('1x1 matrix only loads R component from only texel', function () {
        var packedRGBA = new Float32Array([1, 0, 0, 0]);
        var matrix = new Float32Array(1);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 1, 1, matrix);
        expect(matrix[0]).toEqual(1);
    });
    it('1x2 matrix loads RG from only texel', function () {
        var packedRGBA = new Float32Array([1, 2, 0, 0]);
        var matrix = new Float32Array(2);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 1, 2, matrix);
        expectArraysClose(matrix, new Float32Array([1, 2]));
    });
    it('2x1 matrix loads RB from only texel', function () {
        var packedRGBA = new Float32Array([1, 0, 2, 0]);
        var matrix = new Float32Array(2);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 2, 1, matrix);
        expectArraysClose(matrix, new Float32Array([1, 2]));
    });
    it('2x2 matrix loads RGBA from only texel', function () {
        var packedRGBA = new Float32Array([1, 2, 3, 4]);
        var matrix = new Float32Array(4);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 2, 2, matrix);
        expectArraysClose(matrix, new Float32Array([1, 2, 3, 4]));
    });
    it('4x3 final column only reads RB from edge texels', function () {
        var packedRGBA = new Float32Array([1, 2, 4, 5, 3, 0, 6, 0, 7, 8, 10, 11, 9, 0, 12, 0]);
        var matrix = new Float32Array(12);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 4, 3, matrix);
        expectArraysClose(matrix, new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    });
    it('3x4 final row only reads RG from edge texels', function () {
        var packedRGBA = new Float32Array([1, 2, 5, 6, 3, 4, 7, 8, 9, 10, 0, 0, 11, 12, 0, 0]);
        var matrix = new Float32Array(12);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 3, 4, matrix);
        expectArraysClose(matrix, new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    });
    it('3x3 bottom-right only reads R from corner texel', function () {
        var packedRGBA = new Float32Array([1, 2, 4, 5, 3, 0, 6, 0, 7, 8, 0, 0, 9, 0, 0, 0]);
        var matrix = new Float32Array(9);
        tex_util.decodeMatrixFromPackedRGBA(packedRGBA, 3, 3, matrix);
        expectArraysClose(matrix, new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    });
});
describe('tex_util_float_packing', function () {
    it('packs a float32array as a uint8 array', function () {
        var elements = randomArrayInRange(1000, tex_util.FLOAT_MIN, tex_util.FLOAT_MAX);
        var matrix = new Float32Array(elements);
        var uintArray = tex_util.encodeFloatArray(matrix);
        var floatArray = tex_util.decodeToFloatArray(uintArray);
        expectArraysClose(matrix, floatArray);
    });
});
function randomArrayInRange(n, minValue, maxValue) {
    var v = new Float32Array(n);
    var range = maxValue - minValue;
    for (var i = 0; i < n; ++i) {
        v[i] = (Math.random() * range) + minValue;
    }
    return v;
}
//# sourceMappingURL=tex_util_test.js.map