import { ENV, Environment } from './environment';
import * as jasmine_util from './jasmine_util';
import { DEFAULT_FEATURES } from './test_util';
import { MathBackendWebGL } from './webgl';
describe('canEmulateEnvironment', function () {
    beforeEach(function () {
        ENV.reset();
    });
    afterEach(function () {
        ENV.reset();
    });
    it('no registered backends', function () {
        var testBackends = [];
        var fakeFeatures = { 'BACKEND': 'webgl' };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(false);
    });
    it('webgl backend, webgl emulation', function () {
        var testBackends = [{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }];
        var fakeFeatures = { 'BACKEND': 'webgl' };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(true);
    });
    it('webgl backend, tensorflow emulation', function () {
        var testBackends = [{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }];
        var fakeFeatures = { 'BACKEND': 'tensorflow' };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(false);
    });
    it('webgl backend, webgl 2.0 emulation on webgl 2.0', function () {
        var testBackends = [{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }];
        ENV.set('WEBGL_VERSION', 2);
        var fakeFeatures = { 'BACKEND': 'webgl', 'WEBGL_VERSION': 2 };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(true);
    });
    it('webgl backend, webgl 1.0 emulation on webgl 2.0', function () {
        var testBackends = [{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }];
        ENV.set('WEBGL_VERSION', 2);
        var fakeFeatures = { 'BACKEND': 'webgl', 'WEBGL_VERSION': 1 };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(true);
    });
    it('webgl backend, webgl 2.0 emulation on webgl 1.0 fails', function () {
        var testBackends = [{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }];
        ENV.set('WEBGL_VERSION', 1);
        var fakeFeatures = { 'BACKEND': 'webgl', 'WEBGL_VERSION': 2 };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(false);
    });
    it('webgl backend, webgl 1.0 no float emulation on webgl 2.0', function () {
        var testBackends = [{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }];
        ENV.set('WEBGL_VERSION', 2);
        ENV.set('WEBGL_FLOAT_TEXTURE_ENABLED', true);
        var fakeFeatures = {
            'BACKEND': 'webgl',
            'WEBGL_VERSION': 1,
            'WEBGL_FLOAT_TEXTURE_ENABLED': false
        };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(true);
    });
    it('webgl backend, webgl 1.0 no float emulation on webgl 1.0 no float', function () {
        var testBackends = [
            { name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }
        ];
        ENV.set('WEBGL_VERSION', 1);
        ENV.set('WEBGL_FLOAT_TEXTURE_ENABLED', false);
        var fakeFeatures = {
            'BACKEND': 'webgl',
            'WEBGL_VERSION': 1,
            'WEBGL_FLOAT_TEXTURE_ENABLED': false
        };
        expect(jasmine_util.canEmulateEnvironment(fakeFeatures, testBackends))
            .toBe(true);
    });
});
describe('anyFeaturesEquivalentToDefault', function () {
    var oldTestBackends;
    beforeEach(function () {
        oldTestBackends = jasmine_util.TEST_BACKENDS;
    });
    afterEach(function () {
        jasmine_util.setTestBackends(oldTestBackends);
    });
    it('ignores default', function () {
        var env = new Environment();
        var features = [DEFAULT_FEATURES];
        expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
            .toBe(false);
    });
    it('equivalent features', function () {
        jasmine_util.setTestBackends([
            { name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1000 }
        ]);
        var env = new Environment();
        env.set('WEBGL_VERSION', 1);
        env.set('BACKEND', 'webgl');
        var features = [DEFAULT_FEATURES, { 'WEBGL_VERSION': 1, 'BACKEND': 'webgl' }];
        expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
            .toBe(true);
    });
    it('different features', function () {
        jasmine_util.setTestBackends([{ name: 'webgl', factory: function () { return new MathBackendWebGL(); }, priority: 1 }]);
        var env = new Environment();
        env.set('WEBGL_VERSION', 0);
        env.set('BACKEND', 'cpu');
        var features = [DEFAULT_FEATURES].concat([{ 'WEBGL_VERSION': 1, 'BACKEND': 'webgl' }]);
        expect(jasmine_util.anyFeaturesEquivalentToDefault(features, env))
            .toBe(false);
    });
});
//# sourceMappingURL=jasmine_util_test.js.map