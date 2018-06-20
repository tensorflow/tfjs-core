import { Tensor } from './tensor';
import * as util from './util';
export var WEBGL_ENVS = {
    'BACKEND': 'test-webgl'
};
export var CPU_ENVS = {
    'BACKEND': 'test-cpu'
};
export var ALL_ENVS = {};
export var TEST_EPSILON = 1e-3;
export function expectArraysClose(actual, expected, epsilon) {
    if (epsilon === void 0) { epsilon = TEST_EPSILON; }
    if (!(actual instanceof Tensor) && !(expected instanceof Tensor)) {
        var aType = actual.constructor.name;
        var bType = expected.constructor.name;
        if (aType !== bType) {
            throw new Error("Arrays are of different type actual: " + aType + " " +
                ("vs expected: " + bType));
        }
    }
    else if (actual instanceof Tensor && expected instanceof Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error("Arrays are of different type actual: " + actual.dtype + " " +
                ("vs expected: " + expected.dtype + "."));
        }
        if (!util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error("Arrays are of different shape actual: " + actual.shape + " " +
                ("vs expected: " + expected.shape + "."));
        }
    }
    var actualValues;
    var expectedValues;
    if (actual instanceof Tensor) {
        actualValues = actual.dataSync();
    }
    else {
        actualValues = actual;
    }
    if (expected instanceof Tensor) {
        expectedValues = expected.dataSync();
    }
    else {
        expectedValues = expected;
    }
    if (actualValues.length !== expectedValues.length) {
        throw new Error("Arrays have different lengths actual: " + actualValues.length + " vs " +
            ("expected: " + expectedValues.length + ".\n") +
            ("Actual:   " + actualValues + ".\n") +
            ("Expected: " + expectedValues + "."));
    }
    for (var i = 0; i < expectedValues.length; ++i) {
        var a = actualValues[i];
        var e = expectedValues[i];
        if (!areClose(a, Number(e), epsilon)) {
            throw new Error("Arrays differ: actual[" + i + "] = " + a + ", expected[" + i + "] = " + e + ".\n" +
                ("Actual:   " + actualValues + ".\n") +
                ("Expected: " + expectedValues + "."));
        }
    }
}
export function expectPromiseToFail(fn, done) {
    fn().then(function () { return done.fail(); }, function () { return done(); });
}
export function expectArraysEqual(actual, expected) {
    return expectArraysClose(actual, expected, 0);
}
export function expectNumbersClose(a, e, epsilon) {
    if (epsilon === void 0) { epsilon = TEST_EPSILON; }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
function areClose(a, e, epsilon) {
    if (isNaN(a) && isNaN(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
export function expectValuesInRange(actual, low, high) {
    var actualVals;
    if (actual instanceof Tensor) {
        actualVals = actual.dataSync();
    }
    else {
        actualVals = actual;
    }
    for (var i = 0; i < actualVals.length; i++) {
        if (actualVals[i] < low || actualVals[i] > high) {
            throw new Error("Value out of range:" + actualVals[i] + " low: " + low + ", high: " + high);
        }
    }
}
//# sourceMappingURL=test_util.js.map