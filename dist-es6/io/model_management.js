var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { doc } from '../doc';
import { assert } from '../util';
import { IORouterRegistry } from './router_registry';
var URL_SCHEME_SUFFIX = '://';
var ModelStoreManagerRegistry = (function () {
    function ModelStoreManagerRegistry() {
        this.managers = {};
    }
    ModelStoreManagerRegistry.getInstance = function () {
        if (ModelStoreManagerRegistry.instance == null) {
            ModelStoreManagerRegistry.instance = new ModelStoreManagerRegistry();
        }
        return ModelStoreManagerRegistry.instance;
    };
    ModelStoreManagerRegistry.registerManager = function (scheme, manager) {
        assert(scheme != null, 'scheme must not be undefined or null.');
        if (scheme.endsWith(URL_SCHEME_SUFFIX)) {
            scheme = scheme.slice(0, scheme.indexOf(URL_SCHEME_SUFFIX));
        }
        assert(scheme.length > 0, 'scheme must not be an empty string.');
        var registry = ModelStoreManagerRegistry.getInstance();
        assert(registry.managers[scheme] == null, "A model store manager is already registered for scheme '" + scheme + "'.");
        registry.managers[scheme] = manager;
    };
    ModelStoreManagerRegistry.getManager = function (scheme) {
        var manager = this.getInstance().managers[scheme];
        if (manager == null) {
            throw new Error("Cannot find model manager for scheme '" + scheme + "'");
        }
        return manager;
    };
    ModelStoreManagerRegistry.getSchemes = function () {
        return Object.keys(this.getInstance().managers);
    };
    return ModelStoreManagerRegistry;
}());
export { ModelStoreManagerRegistry };
function parseURL(url) {
    if (url.indexOf(URL_SCHEME_SUFFIX) === -1) {
        throw new Error("The url string provided does not contain a scheme. " +
            "Supported schemes are: " +
            ("" + ModelStoreManagerRegistry.getSchemes().join(',')));
    }
    return {
        scheme: url.split(URL_SCHEME_SUFFIX)[0],
        path: url.split(URL_SCHEME_SUFFIX)[1],
    };
}
function cloneModelInternal(sourceURL, destURL, deleteSource) {
    if (deleteSource === void 0) { deleteSource = false; }
    return __awaiter(this, void 0, void 0, function () {
        var loadHandlers, loadHandler, saveHandlers, saveHandler, sourceScheme, sourcePath, sameMedium, modelArtifacts, saveResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assert(sourceURL !== destURL, "Old path and new path are the same: '" + sourceURL + "'");
                    loadHandlers = IORouterRegistry.getLoadHandlers(sourceURL);
                    assert(loadHandlers.length > 0, "Copying failed because no load handler is found for source URL " + sourceURL + ".");
                    assert(loadHandlers.length < 2, "Copying failed because more than one (" + loadHandlers.length + ") " +
                        ("load handlers for source URL " + sourceURL + "."));
                    loadHandler = loadHandlers[0];
                    saveHandlers = IORouterRegistry.getSaveHandlers(destURL);
                    assert(saveHandlers.length > 0, "Copying failed because no save handler is found for destination URL " +
                        (destURL + "."));
                    assert(saveHandlers.length < 2, "Copying failed because more than one (" + loadHandlers.length + ") " +
                        ("save handlers for destination URL " + destURL + "."));
                    saveHandler = saveHandlers[0];
                    sourceScheme = parseURL(sourceURL).scheme;
                    sourcePath = parseURL(sourceURL).path;
                    sameMedium = sourceScheme === parseURL(sourceURL).scheme;
                    return [4, loadHandler.load()];
                case 1:
                    modelArtifacts = _a.sent();
                    if (!(deleteSource && sameMedium)) return [3, 3];
                    return [4, ModelStoreManagerRegistry.getManager(sourceScheme)
                            .removeModel(sourcePath)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4, saveHandler.save(modelArtifacts)];
                case 4:
                    saveResult = _a.sent();
                    if (!(deleteSource && !sameMedium)) return [3, 6];
                    return [4, ModelStoreManagerRegistry.getManager(sourceScheme)
                            .removeModel(sourcePath)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2, saveResult.modelArtifactsInfo];
            }
        });
    });
}
var ModelManagement = (function () {
    function ModelManagement() {
    }
    ModelManagement.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var schemes, out, _i, schemes_1, scheme, schemeOut, path, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemes = ModelStoreManagerRegistry.getSchemes();
                        out = {};
                        _i = 0, schemes_1 = schemes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < schemes_1.length)) return [3, 4];
                        scheme = schemes_1[_i];
                        return [4, ModelStoreManagerRegistry.getManager(scheme).listModels()];
                    case 2:
                        schemeOut = _a.sent();
                        for (path in schemeOut) {
                            url = scheme + URL_SCHEME_SUFFIX + path;
                            out[url] = schemeOut[path];
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, out];
                }
            });
        });
    };
    ModelManagement.removeModel = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var schemeAndPath, manager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemeAndPath = parseURL(url);
                        manager = ModelStoreManagerRegistry.getManager(schemeAndPath.scheme);
                        return [4, manager.removeModel(schemeAndPath.path)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ModelManagement.copyModel = function (sourceURL, destURL) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteSource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteSource = false;
                        return [4, cloneModelInternal(sourceURL, destURL, deleteSource)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    ModelManagement.moveModel = function (sourceURL, destURL) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteSource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteSource = true;
                        return [4, cloneModelInternal(sourceURL, destURL, deleteSource)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    __decorate([
        doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "listModels", null);
    __decorate([
        doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "removeModel", null);
    __decorate([
        doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "copyModel", null);
    __decorate([
        doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "moveModel", null);
    return ModelManagement;
}());
export { ModelManagement };
//# sourceMappingURL=model_management.js.map