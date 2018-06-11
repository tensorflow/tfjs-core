import { ENV, Environment } from './environment';
import { MathBackendCPU } from './kernels/backend_cpu';
import { MathBackendWebGL } from './kernels/backend_webgl';
import { DEFAULT_FEATURES } from './test_util';
function canEmulateFeature(feature, emulatedFeatures, testBackendFactories) {
    testBackendFactories = testBackendFactories || TEST_BACKENDS;
    var emulatedFeature = emulatedFeatures[feature];
    if (feature === 'BACKEND') {
        for (var i = 0; i < testBackendFactories.length; i++) {
            if (testBackendFactories[i].name === emulatedFeature) {
                return true;
            }
        }
        return false;
    }
    else if (feature === 'WEBGL_VERSION') {
        return ENV.get(feature) >= emulatedFeature;
    }
    else if (feature === 'WEBGL_FLOAT_TEXTURE_ENABLED') {
        if (ENV.get(feature) === false && emulatedFeature === true) {
            return false;
        }
        return true;
    }
    return true;
}
export function canEmulateEnvironment(emulatedFeatures, testBackendFactories) {
    var featureNames = Object.keys(emulatedFeatures);
    for (var i = 0; i < featureNames.length; i++) {
        var featureName = featureNames[i];
        if (!canEmulateFeature(featureName, emulatedFeatures, testBackendFactories)) {
            return false;
        }
    }
    return true;
}
export function anyFeaturesEquivalentToDefault(emulatedFeatures, environent) {
    var _loop_1 = function (j) {
        var candidateDuplicateFeature = emulatedFeatures[j];
        if (candidateDuplicateFeature === DEFAULT_FEATURES) {
            return "continue";
        }
        var featureNames = Object.keys(candidateDuplicateFeature);
        var featuresMatch = featureNames.every(function (featureName) {
            var featureValue = featureName === 'BACKEND' ?
                getBestTestBackend() :
                environent.get(featureName);
            return candidateDuplicateFeature[featureName] === featureValue;
        });
        if (featuresMatch) {
            return { value: true };
        }
    };
    for (var j = 0; j < emulatedFeatures.length; j++) {
        var state_1 = _loop_1(j);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
export function describeWithFlags(name, featuresToRun, tests) {
    for (var i = 0; i < featuresToRun.length; i++) {
        var features = featuresToRun[i];
        if (features === DEFAULT_FEATURES &&
            anyFeaturesEquivalentToDefault(featuresToRun, ENV)) {
            continue;
        }
        if (canEmulateEnvironment(features)) {
            var testName = name + ' ' + JSON.stringify(features);
            executeTests(testName, tests, features);
        }
    }
}
export var TEST_BACKENDS = [
    { name: 'test-webgl', factory: function () { return new MathBackendWebGL(); }, priority: 101 },
    { name: 'test-cpu', factory: function () { return new MathBackendCPU(); }, priority: 100 }
];
var BEFORE_ALL = function (features) { };
var AFTER_ALL = function (features) { };
var BEFORE_EACH = function (features) { };
var AFTER_EACH = function (features) { };
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
function getBestTestBackend() {
    return TEST_BACKENDS.slice()
        .sort(function (a, b) {
        return a.priority < b.priority ? 1 : -1;
    })[0]
        .name;
}
export function setTestBackends(testBackends) {
    TEST_BACKENDS = testBackends;
}
function executeTests(testName, tests, features) {
    describe(testName, function () {
        beforeAll(function () {
            ENV.setFeatures(features);
            TEST_BACKENDS.forEach(function (backendFactory) {
                ENV.registerBackend(backendFactory.name, backendFactory.factory, backendFactory.priority);
            });
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
            TEST_BACKENDS.forEach(function (backendFactory) {
                ENV.removeBackend(backendFactory.name);
            });
            ENV.reset();
        });
        tests();
    });
}
//# sourceMappingURL=jasmine_util.js.map