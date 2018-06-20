import * as device_util from './device_util';
import { ENV, Environment } from './environment';
import { MathBackendCPU } from './kernels/backend_cpu';
import { MathBackendWebGL } from './kernels/backend_webgl';
import { WEBGL_ENVS } from './test_util';
import { describeWithFlags } from './jasmine_util';
describeWithFlags('disjoint query timer enabled', WEBGL_ENVS, function () {
    afterEach(function () {
        ENV.reset();
    });
    it('no webgl', function () {
        ENV.setFeatures({ 'WEBGL_VERSION': 0 });
        expect(ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')).toBe(0);
    });
    it('webgl 1', function () {
        var features = { 'WEBGL_VERSION': 1 };
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl' || context === 'experimental-webgl') {
                    return {
                        getExtension: function (extensionName) {
                            if (extensionName === 'EXT_disjoint_timer_query') {
                                return {};
                            }
                            else if (extensionName === 'WEBGL_lose_context') {
                                return { loseContext: function () { } };
                            }
                            return null;
                        }
                    };
                }
                return null;
            }
        });
        ENV.setFeatures(features);
        expect(ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')).toBe(1);
    });
    it('webgl 2', function () {
        var features = { 'WEBGL_VERSION': 2 };
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl2') {
                    return {
                        getExtension: function (extensionName) {
                            if (extensionName === 'EXT_disjoint_timer_query_webgl2') {
                                return {};
                            }
                            else if (extensionName === 'WEBGL_lose_context') {
                                return { loseContext: function () { } };
                            }
                            return null;
                        }
                    };
                }
                return null;
            }
        });
        ENV.setFeatures(features);
        expect(ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')).toBe(2);
    });
});
describeWithFlags('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', WEBGL_ENVS, function () {
    afterEach(function () {
        ENV.reset();
    });
    it('disjoint query timer disabled', function () {
        var features = { 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 0 };
        var env = new Environment(features);
        expect(env.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(false);
    });
    it('disjoint query timer enabled, mobile', function () {
        var features = { 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 1 };
        spyOn(device_util, 'isMobile').and.returnValue(true);
        var env = new Environment(features);
        expect(env.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(false);
    });
    it('disjoint query timer enabled, not mobile', function () {
        var features = { 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 1 };
        spyOn(device_util, 'isMobile').and.returnValue(false);
        var env = new Environment(features);
        expect(env.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(true);
    });
});
describeWithFlags('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED', WEBGL_ENVS, function () {
    afterEach(function () {
        ENV.reset();
    });
    beforeEach(function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl2') {
                    return {
                        getExtension: function (extensionName) {
                            if (extensionName === 'WEBGL_get_buffer_sub_data_async') {
                                return {};
                            }
                            else if (extensionName === 'WEBGL_lose_context') {
                                return { loseContext: function () { } };
                            }
                            return null;
                        }
                    };
                }
                return null;
            }
        });
    });
    it('WebGL 2 enabled', function () {
        var features = { 'WEBGL_VERSION': 2 };
        var env = new Environment(features);
        expect(env.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'))
            .toBe(false);
    });
    it('WebGL 1 disabled', function () {
        var features = { 'WEBGL_VERSION': 1 };
        var env = new Environment(features);
        expect(env.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'))
            .toBe(false);
    });
});
describeWithFlags('WebGL version', WEBGL_ENVS, function () {
    afterEach(function () {
        ENV.reset();
    });
    it('webgl 1', function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl') {
                    return {
                        getExtension: function (a) {
                            return { loseContext: function () { } };
                        }
                    };
                }
                return null;
            }
        });
        var env = new Environment();
        expect(env.get('WEBGL_VERSION')).toBe(1);
    });
    it('webgl 2', function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) {
                if (context === 'webgl2') {
                    return {
                        getExtension: function (a) {
                            return { loseContext: function () { } };
                        }
                    };
                }
                return null;
            }
        });
        var env = new Environment();
        expect(env.get('WEBGL_VERSION')).toBe(2);
    });
    it('no webgl', function () {
        spyOn(document, 'createElement').and.returnValue({
            getContext: function (context) { return null; }
        });
        var env = new Environment();
        expect(env.get('WEBGL_VERSION')).toBe(0);
    });
});
describe('Backend', function () {
    afterEach(function () {
        ENV.reset();
    });
    it('custom cpu registration', function () {
        var backend;
        ENV.registerBackend('custom-cpu', function () {
            backend = new MathBackendCPU();
            return backend;
        });
        expect(ENV.findBackend('custom-cpu')).toBe(backend);
        ENV.removeBackend('custom-cpu');
    });
    it('webgl not supported, falls back to cpu', function () {
        ENV.setFeatures({ 'WEBGL_VERSION': 0 });
        ENV.registerBackend('custom-cpu', function () { return new MathBackendCPU(); }, 3);
        var success = ENV.registerBackend('custom-webgl', function () { return new MathBackendWebGL(); }, 4);
        expect(success).toBe(false);
        expect(ENV.findBackend('custom-webgl') == null).toBe(true);
        expect(ENV.getBestBackendType()).toBe('custom-cpu');
        ENV.removeBackend('custom-cpu');
    });
    it('default custom background null', function () {
        expect(ENV.findBackend('custom')).toBeNull();
    });
    it('allow custom backend', function () {
        var backend = new MathBackendCPU();
        var success = ENV.registerBackend('custom', function () { return backend; });
        expect(success).toBeTruthy();
        expect(ENV.findBackend('custom')).toEqual(backend);
        ENV.removeBackend('custom');
    });
});
//# sourceMappingURL=environment_test.js.map