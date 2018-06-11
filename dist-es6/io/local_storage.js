var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ENV } from '../environment';
import { assert } from '../util';
import { arrayBufferToBase64String, base64StringToArrayBuffer, getModelArtifactsInfoForJSON } from './io_utils';
import { ModelStoreManagerRegistry } from './model_management';
import { IORouterRegistry } from './router_registry';
var PATH_SEPARATOR = '/';
var PATH_PREFIX = 'tensorflowjs_models';
var INFO_SUFFIX = 'info';
var MODEL_TOPOLOGY_SUFFIX = 'model_topology';
var WEIGHT_SPECS_SUFFIX = 'weight_specs';
var WEIGHT_DATA_SUFFIX = 'weight_data';
export function purgeLocalStorageArtifacts() {
    if (!ENV.get('IS_BROWSER') || typeof window.localStorage === 'undefined') {
        throw new Error('purgeLocalStorageModels() cannot proceed because local storage is ' +
            'unavailable in the current environment.');
    }
    var LS = window.localStorage;
    var purgedModelPaths = [];
    for (var i = 0; i < LS.length; ++i) {
        var key = LS.key(i);
        var prefix = PATH_PREFIX + PATH_SEPARATOR;
        if (key.startsWith(prefix) && key.length > prefix.length) {
            LS.removeItem(key);
            var modelName = getModelPathFromKey(key);
            if (purgedModelPaths.indexOf(modelName) === -1) {
                purgedModelPaths.push(modelName);
            }
        }
    }
    return purgedModelPaths;
}
function getModelKeys(path) {
    return {
        info: [PATH_PREFIX, path, INFO_SUFFIX].join(PATH_SEPARATOR),
        topology: [PATH_PREFIX, path, MODEL_TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
        weightSpecs: [PATH_PREFIX, path, WEIGHT_SPECS_SUFFIX].join(PATH_SEPARATOR),
        weightData: [PATH_PREFIX, path, WEIGHT_DATA_SUFFIX].join(PATH_SEPARATOR)
    };
}
function getModelPathFromKey(key) {
    var items = key.split(PATH_SEPARATOR);
    if (items.length < 3) {
        throw new Error("Invalid key format: " + key);
    }
    return items.slice(1, items.length - 1).join(PATH_SEPARATOR);
}
function maybeStripScheme(key) {
    return key.startsWith(BrowserLocalStorage.URL_SCHEME) ?
        key.slice(BrowserLocalStorage.URL_SCHEME.length) :
        key;
}
var BrowserLocalStorage = (function () {
    function BrowserLocalStorage(modelPath) {
        if (!ENV.get('IS_BROWSER') || typeof window.localStorage === 'undefined') {
            throw new Error('The current environment does not support local storage.');
        }
        this.LS = window.localStorage;
        if (modelPath == null || !modelPath) {
            throw new Error('For local storage, modelPath must not be null, undefined or empty.');
        }
        this.modelPath = modelPath;
        this.keys = getModelKeys(this.modelPath);
    }
    BrowserLocalStorage.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var topology, weightSpecs, modelArtifactsInfo, key;
            return __generator(this, function (_a) {
                if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                    throw new Error('BrowserLocalStorage.save() does not support saving model topology ' +
                        'in binary formats yet.');
                }
                else {
                    topology = JSON.stringify(modelArtifacts.modelTopology);
                    weightSpecs = JSON.stringify(modelArtifacts.weightSpecs);
                    modelArtifactsInfo = getModelArtifactsInfoForJSON(modelArtifacts);
                    try {
                        this.LS.setItem(this.keys.info, JSON.stringify(modelArtifactsInfo));
                        this.LS.setItem(this.keys.topology, topology);
                        this.LS.setItem(this.keys.weightSpecs, weightSpecs);
                        this.LS.setItem(this.keys.weightData, arrayBufferToBase64String(modelArtifacts.weightData));
                        return [2, { modelArtifactsInfo: modelArtifactsInfo }];
                    }
                    catch (err) {
                        for (key in this.keys) {
                            this.LS.removeItem(this.keys[key]);
                        }
                        throw new Error("Failed to save model '" + this.modelPath + "' to local storage: " +
                            "size quota being exceeded is a possible cause of this failure: " +
                            ("modelTopologyBytes=" + modelArtifactsInfo.modelTopologyBytes + ", ") +
                            ("weightSpecsBytes=" + modelArtifactsInfo.weightSpecsBytes + ", ") +
                            ("weightDataBytes=" + modelArtifactsInfo.weightDataBytes + "."));
                    }
                }
                return [2];
            });
        });
    };
    BrowserLocalStorage.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, out, topology, weightSpecs, weightDataBase64;
            return __generator(this, function (_a) {
                info = JSON.parse(this.LS.getItem(this.keys.info));
                if (info == null) {
                    throw new Error("In local storage, there is no model with name '" + this.modelPath + "'");
                }
                if (info.modelTopologyType !== 'JSON') {
                    throw new Error('BrowserLocalStorage does not support loading non-JSON model ' +
                        'topology yet.');
                }
                out = {};
                topology = JSON.parse(this.LS.getItem(this.keys.topology));
                if (topology == null) {
                    throw new Error("In local storage, the topology of model '" + this.modelPath + "' " +
                        "is missing.");
                }
                out.modelTopology = topology;
                weightSpecs = JSON.parse(this.LS.getItem(this.keys.weightSpecs));
                if (weightSpecs == null) {
                    throw new Error("In local storage, the weight specs of model '" + this.modelPath + "' " +
                        "are missing.");
                }
                out.weightSpecs = weightSpecs;
                weightDataBase64 = this.LS.getItem(this.keys.weightData);
                if (weightDataBase64 == null) {
                    throw new Error("In local storage, the binary weight values of model " +
                        ("'" + this.modelPath + "' are missing."));
                }
                out.weightData = base64StringToArrayBuffer(weightDataBase64);
                return [2, out];
            });
        });
    };
    BrowserLocalStorage.URL_SCHEME = 'localstorage://';
    return BrowserLocalStorage;
}());
export { BrowserLocalStorage };
export var localStorageRouter = function (url) {
    if (!ENV.get('IS_BROWSER')) {
        return null;
    }
    else {
        if (url.startsWith(BrowserLocalStorage.URL_SCHEME)) {
            return browserLocalStorage(url.slice(BrowserLocalStorage.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(localStorageRouter);
IORouterRegistry.registerLoadRouter(localStorageRouter);
export function browserLocalStorage(modelPath) {
    return new BrowserLocalStorage(modelPath);
}
var BrowserLocalStorageManager = (function () {
    function BrowserLocalStorageManager() {
        assert(ENV.get('IS_BROWSER'), 'Current environment is not a web browser');
        assert(typeof window.localStorage !== 'undefined', 'Current browser does not appear to support localStorage');
        this.LS = window.localStorage;
    }
    BrowserLocalStorageManager.prototype.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var out, prefix, suffix, i, key, modelPath;
            return __generator(this, function (_a) {
                out = {};
                prefix = PATH_PREFIX + PATH_SEPARATOR;
                suffix = PATH_SEPARATOR + INFO_SUFFIX;
                for (i = 0; i < this.LS.length; ++i) {
                    key = this.LS.key(i);
                    if (key.startsWith(prefix) && key.endsWith(suffix)) {
                        modelPath = getModelPathFromKey(key);
                        out[modelPath] = JSON.parse(this.LS.getItem(key));
                    }
                }
                return [2, out];
            });
        });
    };
    BrowserLocalStorageManager.prototype.removeModel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, info;
            return __generator(this, function (_a) {
                path = maybeStripScheme(path);
                keys = getModelKeys(path);
                if (this.LS.getItem(keys.info) == null) {
                    throw new Error("Cannot find model at path '" + path + "'");
                }
                info = JSON.parse(this.LS.getItem(keys.info));
                this.LS.removeItem(keys.info);
                this.LS.removeItem(keys.topology);
                this.LS.removeItem(keys.weightSpecs);
                this.LS.removeItem(keys.weightData);
                return [2, info];
            });
        });
    };
    return BrowserLocalStorageManager;
}());
export { BrowserLocalStorageManager };
if (ENV.get('IS_BROWSER')) {
    try {
        ModelStoreManagerRegistry.registerManager(BrowserLocalStorage.URL_SCHEME, new BrowserLocalStorageManager());
    }
    catch (err) {
    }
}
//# sourceMappingURL=local_storage.js.map