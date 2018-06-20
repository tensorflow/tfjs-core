var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as device_util from './device_util';
import { doc } from './doc';
import { Engine } from './engine';
import * as util from './util';
export var Type;
(function (Type) {
    Type[Type["NUMBER"] = 0] = "NUMBER";
    Type[Type["BOOLEAN"] = 1] = "BOOLEAN";
    Type[Type["STRING"] = 2] = "STRING";
})(Type || (Type = {}));
export var URL_PROPERTIES = [
    { name: 'DEBUG', type: Type.BOOLEAN }, { name: 'IS_BROWSER', type: Type.BOOLEAN },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', type: Type.BOOLEAN },
    { name: 'WEBGL_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_FLOAT_TEXTURE_ENABLED', type: Type.BOOLEAN }, {
        name: 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED',
        type: Type.BOOLEAN
    },
    { name: 'BACKEND', type: Type.STRING }
];
function hasExtension(gl, extensionName) {
    var ext = gl.getExtension(extensionName);
    return ext != null;
}
function getWebGLRenderingContext(webGLVersion) {
    if (webGLVersion === 0) {
        throw new Error('Cannot get WebGL rendering context, WebGL is disabled.');
    }
    var tempCanvas = document.createElement('canvas');
    if (webGLVersion === 1) {
        return (tempCanvas.getContext('webgl') ||
            tempCanvas.getContext('experimental-webgl'));
    }
    return tempCanvas.getContext('webgl2');
}
function loseContext(gl) {
    if (gl != null) {
        var loseContextExtension = gl.getExtension('WEBGL_lose_context');
        if (loseContextExtension == null) {
            throw new Error('Extension WEBGL_lose_context not supported on this browser.');
        }
        loseContextExtension.loseContext();
    }
}
function isWebGLVersionEnabled(webGLVersion) {
    var gl = getWebGLRenderingContext(webGLVersion);
    if (gl != null) {
        loseContext(gl);
        return true;
    }
    return false;
}
function getWebGLDisjointQueryTimerVersion(webGLVersion) {
    if (webGLVersion === 0) {
        return 0;
    }
    var queryTimerVersion;
    var gl = getWebGLRenderingContext(webGLVersion);
    if (hasExtension(gl, 'EXT_disjoint_timer_query_webgl2') &&
        webGLVersion === 2) {
        queryTimerVersion = 2;
    }
    else if (hasExtension(gl, 'EXT_disjoint_timer_query')) {
        queryTimerVersion = 1;
    }
    else {
        queryTimerVersion = 0;
    }
    if (gl != null) {
        loseContext(gl);
    }
    return queryTimerVersion;
}
function isFloatTextureReadPixelsEnabled(webGLVersion) {
    if (webGLVersion === 0) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion);
    if (webGLVersion === 1) {
        if (!hasExtension(gl, 'OES_texture_float')) {
            return false;
        }
    }
    else {
        if (!hasExtension(gl, 'EXT_color_buffer_float')) {
            return false;
        }
    }
    var frameBuffer = gl.createFramebuffer();
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var internalFormat = webGLVersion === 2 ? gl.RGBA32F : gl.RGBA;
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    var frameBufferComplete = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));
    var readPixelsNoError = gl.getError() === gl.NO_ERROR;
    loseContext(gl);
    return frameBufferComplete && readPixelsNoError;
}
function isWebGLGetBufferSubDataAsyncExtensionEnabled(webGLVersion) {
    if (webGLVersion > 0) {
        return false;
    }
    if (webGLVersion !== 2) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion);
    var isEnabled = hasExtension(gl, 'WEBGL_get_buffer_sub_data_async');
    loseContext(gl);
    return isEnabled;
}
var Environment = (function () {
    function Environment(features) {
        this.features = {};
        this.registry = {};
        if (features != null) {
            this.features = features;
        }
        if (this.get('DEBUG')) {
            console.warn('Debugging mode is ON. The output of every math call will ' +
                'be downloaded to CPU and checked for NaNs. ' +
                'This significantly impacts performance.');
        }
    }
    Environment.setBackend = function (backendType, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        if (!(backendType in ENV.registry)) {
            throw new Error("Backend type '" + backendType + "' not found in registry");
        }
        ENV.initBackend(backendType, safeMode);
    };
    Environment.getBackend = function () {
        ENV.initDefaultBackend();
        return ENV.currentBackend;
    };
    Environment.disposeVariables = function () {
        ENV.engine.disposeVariables();
    };
    Environment.memory = function () {
        return ENV.engine.memory();
    };
    Environment.prototype.get = function (feature) {
        if (feature in this.features) {
            return this.features[feature];
        }
        this.features[feature] = this.evaluateFeature(feature);
        return this.features[feature];
    };
    Environment.prototype.set = function (feature, value) {
        this.features[feature] = value;
    };
    Environment.prototype.getBestBackendType = function () {
        var _this = this;
        if (Object.keys(this.registry).length === 0) {
            throw new Error('No backend found in registry.');
        }
        var sortedBackends = Object.keys(this.registry)
            .map(function (name) {
            return { name: name, entry: _this.registry[name] };
        })
            .sort(function (a, b) {
            return b.entry.priority - a.entry.priority;
        });
        return sortedBackends[0].name;
    };
    Environment.prototype.evaluateFeature = function (feature) {
        if (feature === 'DEBUG') {
            return false;
        }
        else if (feature === 'IS_BROWSER') {
            return typeof window !== 'undefined';
        }
        else if (feature === 'BACKEND') {
            return this.getBestBackendType();
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') {
            var webGLVersion = this.get('WEBGL_VERSION');
            if (webGLVersion === 0) {
                return 0;
            }
            return getWebGLDisjointQueryTimerVersion(webGLVersion);
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE') {
            return this.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
                !device_util.isMobile();
        }
        else if (feature === 'WEBGL_VERSION') {
            if (isWebGLVersionEnabled(2)) {
                return 2;
            }
            else if (isWebGLVersionEnabled(1)) {
                return 1;
            }
            return 0;
        }
        else if (feature === 'WEBGL_FLOAT_TEXTURE_ENABLED') {
            return isFloatTextureReadPixelsEnabled(this.get('WEBGL_VERSION'));
        }
        else if (feature === 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED') {
            return isWebGLGetBufferSubDataAsyncExtensionEnabled(this.get('WEBGL_VERSION'));
        }
        throw new Error("Unknown feature " + feature + ".");
    };
    Environment.prototype.setFeatures = function (features) {
        this.features = features;
    };
    Environment.prototype.reset = function () {
        this.features = getFeaturesFromURL();
        if (this.globalEngine != null) {
            this.globalEngine.dispose();
            this.globalEngine = null;
        }
    };
    Environment.prototype.initBackend = function (backendType, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        this.currentBackend = backendType;
        if (this.globalEngine != null) {
            this.globalEngine.dispose();
        }
        var backend = ENV.findBackend(backendType);
        this.globalEngine = new Engine(backend, safeMode);
    };
    Environment.prototype.findBackend = function (name) {
        if (!(name in this.registry)) {
            return null;
        }
        return this.registry[name].backend;
    };
    Environment.prototype.registerBackend = function (name, factory, priority) {
        if (priority === void 0) { priority = 1; }
        if (name in this.registry) {
            console.warn(name + " backend was already registered");
        }
        try {
            var backend = factory();
            this.registry[name] = { backend: backend, priority: priority };
            return true;
        }
        catch (err) {
            console.warn(err.message);
            return false;
        }
    };
    Environment.prototype.removeBackend = function (name) {
        if (!(name in this.registry)) {
            throw new Error(name + " backend not found in registry");
        }
        this.registry[name].backend.dispose();
        delete this.registry[name];
    };
    Object.defineProperty(Environment.prototype, "engine", {
        get: function () {
            this.initDefaultBackend();
            return this.globalEngine;
        },
        enumerable: true,
        configurable: true
    });
    Environment.prototype.initDefaultBackend = function () {
        if (this.globalEngine == null) {
            this.initBackend(ENV.get('BACKEND'), false);
        }
    };
    __decorate([
        doc({ heading: 'Environment' })
    ], Environment, "setBackend", null);
    __decorate([
        doc({ heading: 'Environment' })
    ], Environment, "getBackend", null);
    __decorate([
        doc({ heading: 'Environment' })
    ], Environment, "disposeVariables", null);
    __decorate([
        doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "memory", null);
    return Environment;
}());
export { Environment };
var TENSORFLOWJS_FLAGS_PREFIX = 'tfjsflags';
function getFeaturesFromURL() {
    var features = {};
    if (typeof window === 'undefined' || typeof window.location === 'undefined') {
        return features;
    }
    var urlParams = util.getQueryParams(window.location.search);
    if (TENSORFLOWJS_FLAGS_PREFIX in urlParams) {
        var urlFlags_1 = {};
        var keyValues = urlParams[TENSORFLOWJS_FLAGS_PREFIX].split(',');
        keyValues.forEach(function (keyValue) {
            var _a = keyValue.split(':'), key = _a[0], value = _a[1];
            urlFlags_1[key] = value;
        });
        URL_PROPERTIES.forEach(function (urlProperty) {
            if (urlProperty.name in urlFlags_1) {
                console.log("Setting feature override from URL " + urlProperty.name + ": " +
                    ("" + urlFlags_1[urlProperty.name]));
                if (urlProperty.type === Type.NUMBER) {
                    features[urlProperty.name] = +urlFlags_1[urlProperty.name];
                }
                else if (urlProperty.type === Type.BOOLEAN) {
                    features[urlProperty.name] = urlFlags_1[urlProperty.name] === 'true';
                }
                else if (urlProperty.type === Type.STRING) {
                    features[urlProperty.name] = urlFlags_1[urlProperty.name];
                }
                else {
                    console.warn("Unknown URL param: " + urlProperty.name + ".");
                }
            }
        });
    }
    return features;
}
function getGlobalNamespace() {
    var ns;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (global) !== 'undefined') {
        ns = global;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}
function getOrMakeEnvironment() {
    var ns = getGlobalNamespace();
    ns.ENV = ns.ENV || new Environment(getFeaturesFromURL());
    return ns.ENV;
}
export var ENV = getOrMakeEnvironment();
//# sourceMappingURL=environment.js.map