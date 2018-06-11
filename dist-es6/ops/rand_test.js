import { MPRandGauss } from './rand';
import { expectArrayInMeanStdRange, jarqueBeraNormalityTest } from './rand_util';
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
describe('MPRandGauss', function () {
    var EPSILON = 0.05;
    var SEED = 2002;
    it('should default to float32 numbers', function () {
        var rand = new MPRandGauss(0, 1.5);
        expect(isFloat(rand.nextValue())).toBe(true);
    });
    it('should handle create a mean/stdv of float32 numbers', function () {
        var rand = new MPRandGauss(0, 1.5, 'float32', false, SEED);
        var values = [];
        var size = 10000;
        for (var i = 0; i < size; i++) {
            values.push(rand.nextValue());
        }
        expectArrayInMeanStdRange(values, 0, 1.5, EPSILON);
        jarqueBeraNormalityTest(values);
    });
    it('should handle int32 numbers', function () {
        var rand = new MPRandGauss(0, 1, 'int32');
        expect(isFloat(rand.nextValue())).toBe(false);
    });
    it('should handle create a mean/stdv of int32 numbers', function () {
        var rand = new MPRandGauss(0, 2, 'int32', false, SEED);
        var values = [];
        var size = 10000;
        for (var i = 0; i < size; i++) {
            values.push(rand.nextValue());
        }
        expectArrayInMeanStdRange(values, 0, 2, EPSILON);
        jarqueBeraNormalityTest(values);
    });
    it('Should not have a more than 2x std-d from mean for truncated values', function () {
        var stdv = 1.5;
        var rand = new MPRandGauss(0, stdv, 'float32', true);
        for (var i = 0; i < 1000; i++) {
            expect(Math.abs(rand.nextValue())).toBeLessThan(stdv * 2);
        }
    });
});
//# sourceMappingURL=rand_test.js.map