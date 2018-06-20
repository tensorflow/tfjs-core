import { ENV, Environment } from './environment';
import { MathBackendCPU } from './kernels/backend_cpu';
import { MathBackendWebGL } from './kernels/backend_webgl';
export function describeWithFlags(name, constraints, tests) {
    var envFeatures = TEST_ENV_FEATURES.filter(function (f) {
        return Object.keys(constraints).every(function (key) {
            return constraints[key] === f[key];
        });
    });
    envFeatures.forEach(function (features) {
        var testName = name + ' ' + JSON.stringify(features);
        executeTests(testName, tests, features);
    });
}
var BEFORE_ALL = function (features) {
    ENV.registerBackend('test-webgl', function () { return new MathBackendWebGL(); });
    ENV.registerBackend('test-cpu', function () { return new MathBackendCPU(); });
};
var AFTER_ALL = function (features) {
    ENV.removeBackend('test-webgl');
    ENV.removeBackend('test-cpu');
};
var BEFORE_EACH = function (features) { };
var AFTER_EACH = function (features) { };
var TEST_ENV_FEATURES = [
    {
        'BACKEND': 'test-webgl',
        'WEBGL_FLOAT_TEXTURE_ENABLED': true,
        'WEBGL_VERSION': 1
    },
    {
        'BACKEND': 'test-webgl',
        'WEBGL_FLOAT_TEXTURE_ENABLED': true,
        'WEBGL_VERSION': 2
    },
    { 'BACKEND': 'test-cpu' }
];
export function setBeforeAll(f) {
    BEFORE_ALL = f;
}
export function setAfterAll(f) {
    AFTER_ALL = f;
}
export function setBeforeEach(f) {
    BEFORE_EACH = f;
}
export function setAfterEach(f) {
    AFTER_EACH = f;
}
export function setTestEnvFeatures(features) {
    TEST_ENV_FEATURES = features;
}
function executeTests(testName, tests, features) {
    describe(testName, function () {
        beforeAll(function () {
            ENV.setFeatures(features);
            BEFORE_ALL(features);
        });
        beforeEach(function () {
            BEFORE_EACH(features);
            if (features && features.BACKEND != null) {
                Environment.setBackend(features.BACKEND);
            }
            ENV.engine.startScope();
        });
        afterEach(function () {
            ENV.engine.endScope(null);
            AFTER_EACH(features);
        });
        afterAll(function () {
            AFTER_ALL(features);
            ENV.reset();
        });
        tests();
    });
}
//# sourceMappingURL=jasmine_util.js.map