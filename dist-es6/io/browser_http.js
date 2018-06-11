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
import { concatenateArrayBuffers, getModelArtifactsInfoForJSON } from './io_utils';
import { IORouterRegistry } from './router_registry';
import { loadWeightsAsArrayBuffer } from './weights_loader';
var BrowserHTTPRequest = (function () {
    function BrowserHTTPRequest(path, requestInit) {
        this.DEFAULT_METHOD = 'POST';
        if (!ENV.get('IS_BROWSER')) {
            throw new Error('browserHTTPRequest is not supported outside the web browser.');
        }
        assert(path != null && path.length > 0, 'URL path for browserHTTPRequest must not be null, undefined or ' +
            'empty.');
        this.path = path;
        if (requestInit != null && requestInit.body != null) {
            throw new Error('requestInit is expected to have no pre-existing body, but has one.');
        }
        this.requestInit = requestInit || {};
    }
    BrowserHTTPRequest.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var init, weightsManifest, modelTopologyAndWeightManifest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                            throw new Error('BrowserHTTPRequest.save() does not support saving model topology ' +
                                'in binary formats yet.');
                        }
                        init = Object.assign({ method: this.DEFAULT_METHOD }, this.requestInit);
                        init.body = new FormData();
                        weightsManifest = [{
                                paths: ['./model.weights.bin'],
                                weights: modelArtifacts.weightSpecs,
                            }];
                        modelTopologyAndWeightManifest = {
                            modelTopology: modelArtifacts.modelTopology,
                            weightsManifest: weightsManifest
                        };
                        init.body.append('model.json', new Blob([JSON.stringify(modelTopologyAndWeightManifest)], { type: 'application/json' }), 'model.json');
                        if (modelArtifacts.weightData != null) {
                            init.body.append('model.weights.bin', new Blob([modelArtifacts.weightData], { type: 'application/octet-stream' }), 'model.weights.bin');
                        }
                        return [4, fetch(this.path, init)];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200) {
                            return [2, {
                                    modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts),
                                    responses: [response],
                                }];
                        }
                        else {
                            throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status " +
                                (response.status + "."));
                        }
                        return [2];
                }
            });
        });
    };
    BrowserHTTPRequest.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modelConfigRequest, modelConfig, modelTopology, weightsManifest, weightSpecs, weightData, weightsManifest_1, _i, weightsManifest_2, entry, pathPrefix_1, fetchURLs_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, fetch(this.path, this.requestInit)];
                    case 1:
                        modelConfigRequest = _b.sent();
                        return [4, modelConfigRequest.json()];
                    case 2:
                        modelConfig = _b.sent();
                        modelTopology = modelConfig['modelTopology'];
                        weightsManifest = modelConfig['weightsManifest'];
                        if (modelTopology == null && weightsManifest == null) {
                            throw new Error("The JSON from HTTP path " + this.path + " contains neither model " +
                                "topology or manifest for weights.");
                        }
                        if (!(weightsManifest != null)) return [3, 4];
                        weightsManifest_1 = modelConfig['weightsManifest'];
                        weightSpecs = [];
                        for (_i = 0, weightsManifest_2 = weightsManifest_1; _i < weightsManifest_2.length; _i++) {
                            entry = weightsManifest_2[_i];
                            weightSpecs.push.apply(weightSpecs, entry.weights);
                        }
                        pathPrefix_1 = this.path.substring(0, this.path.lastIndexOf('/'));
                        if (!pathPrefix_1.endsWith('/')) {
                            pathPrefix_1 = pathPrefix_1 + '/';
                        }
                        fetchURLs_1 = [];
                        weightsManifest_1.forEach(function (weightsGroup) {
                            weightsGroup.paths.forEach(function (path) {
                                fetchURLs_1.push(pathPrefix_1 + path);
                            });
                        });
                        _a = concatenateArrayBuffers;
                        return [4, loadWeightsAsArrayBuffer(fetchURLs_1, this.requestInit)];
                    case 3:
                        weightData = _a.apply(void 0, [_b.sent()]);
                        _b.label = 4;
                    case 4: return [2, { modelTopology: modelTopology, weightSpecs: weightSpecs, weightData: weightData }];
                }
            });
        });
    };
    BrowserHTTPRequest.URL_SCHEMES = ['http://', 'https://'];
    return BrowserHTTPRequest;
}());
export { BrowserHTTPRequest };
export var httpRequestRouter = function (url) {
    if (!ENV.get('IS_BROWSER')) {
        return null;
    }
    else {
        for (var _i = 0, _a = BrowserHTTPRequest.URL_SCHEMES; _i < _a.length; _i++) {
            var scheme = _a[_i];
            if (url.startsWith(scheme)) {
                return browserHTTPRequest(url);
            }
        }
        return null;
    }
};
IORouterRegistry.registerSaveRouter(httpRequestRouter);
IORouterRegistry.registerLoadRouter(httpRequestRouter);
export function browserHTTPRequest(path, requestInit) {
    return new BrowserHTTPRequest(path, requestInit);
}
//# sourceMappingURL=browser_http.js.map