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
import { basename, concatenateArrayBuffers, getModelArtifactsInfoForJSON } from './io_utils';
import { IORouterRegistry } from './router_registry';
var DEFAULT_FILE_NAME_PREFIX = 'model';
var DEFAULT_JSON_EXTENSION_NAME = '.json';
var DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';
var BrowserDownloads = (function () {
    function BrowserDownloads(fileNamePrefix) {
        if (!ENV.get('IS_BROWSER')) {
            throw new Error('triggerDownloads() cannot proceed because the current environment ' +
                'is not a browser.');
        }
        if (fileNamePrefix.startsWith(BrowserDownloads.URL_SCHEME)) {
            fileNamePrefix = fileNamePrefix.slice(BrowserDownloads.URL_SCHEME.length);
        }
        if (fileNamePrefix == null || fileNamePrefix.length === 0) {
            fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
        }
        this.modelTopologyFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
        this.weightDataFileName =
            fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
    }
    BrowserDownloads.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var weightsURL, weightsManifest, modelTopologyAndWeightManifest, modelTopologyAndWeightManifestURL, jsonAnchor, weightDataAnchor;
            return __generator(this, function (_a) {
                weightsURL = window.URL.createObjectURL(new Blob([modelArtifacts.weightData], { type: 'application/octet-stream' }));
                if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                    throw new Error('DownloadTrigger.save() does not support saving model topology ' +
                        'in binary formats yet.');
                }
                else {
                    weightsManifest = [{
                            paths: ['./' + this.weightDataFileName],
                            weights: modelArtifacts.weightSpecs
                        }];
                    modelTopologyAndWeightManifest = {
                        modelTopology: modelArtifacts.modelTopology,
                        weightsManifest: weightsManifest
                    };
                    modelTopologyAndWeightManifestURL = window.URL.createObjectURL(new Blob([JSON.stringify(modelTopologyAndWeightManifest)], { type: 'application/json' }));
                    jsonAnchor = this.jsonAnchor == null ? document.createElement('a') :
                        this.jsonAnchor;
                    jsonAnchor.download = this.modelTopologyFileName;
                    jsonAnchor.href = modelTopologyAndWeightManifestURL;
                    jsonAnchor.click();
                    if (modelArtifacts.weightData != null) {
                        weightDataAnchor = this.weightDataAnchor == null ?
                            document.createElement('a') :
                            this.weightDataAnchor;
                        weightDataAnchor.download = this.weightDataFileName;
                        weightDataAnchor.href = weightsURL;
                        weightDataAnchor.click();
                    }
                    return [2, { modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts) }];
                }
                return [2];
            });
        });
    };
    BrowserDownloads.URL_SCHEME = 'downloads://';
    return BrowserDownloads;
}());
export { BrowserDownloads };
var BrowserFiles = (function () {
    function BrowserFiles(files) {
        if (files == null || files.length < 1) {
            throw new Error("When calling browserFiles, at least 1 file is required, " +
                ("but received " + files));
        }
        this.files = files;
    }
    BrowserFiles.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var jsonFile, weightFiles;
            return __generator(this, function (_a) {
                jsonFile = this.files[0];
                weightFiles = this.files.slice(1);
                return [2, new Promise(function (resolve, reject) {
                        var jsonReader = new FileReader();
                        jsonReader.onload = function (event) {
                            var modelJSON = JSON.parse(event.target.result);
                            var modelTopology = modelJSON.modelTopology;
                            if (modelTopology == null) {
                                reject(new Error("modelTopology field is missing from file " + jsonFile.name));
                                return;
                            }
                            if (weightFiles.length === 0) {
                                resolve({ modelTopology: modelTopology });
                            }
                            var weightsManifest = modelJSON.weightsManifest;
                            if (weightsManifest == null) {
                                reject(new Error("weightManifest field is missing from file " + jsonFile.name));
                                return;
                            }
                            var pathToFile;
                            try {
                                pathToFile =
                                    _this.checkManifestAndWeightFiles(weightsManifest, weightFiles);
                            }
                            catch (err) {
                                reject(err);
                                return;
                            }
                            var weightSpecs = [];
                            var paths = [];
                            var perFileBuffers = [];
                            weightsManifest.forEach(function (weightsGroup) {
                                weightsGroup.paths.forEach(function (path) {
                                    paths.push(path);
                                    perFileBuffers.push(null);
                                });
                                weightSpecs.push.apply(weightSpecs, weightsGroup.weights);
                            });
                            weightsManifest.forEach(function (weightsGroup) {
                                weightsGroup.paths.forEach(function (path) {
                                    var weightFileReader = new FileReader();
                                    weightFileReader.onload = function (event) {
                                        var weightData = event.target.result;
                                        var index = paths.indexOf(path);
                                        perFileBuffers[index] = weightData;
                                        if (perFileBuffers.indexOf(null) === -1) {
                                            resolve({
                                                modelTopology: modelTopology,
                                                weightSpecs: weightSpecs,
                                                weightData: concatenateArrayBuffers(perFileBuffers),
                                            });
                                        }
                                    };
                                    weightFileReader.onerror = function (error) {
                                        reject("Failed to weights data from file of path '" + path + "'.");
                                        return;
                                    };
                                    weightFileReader.readAsArrayBuffer(pathToFile[path]);
                                });
                            });
                        };
                        jsonReader.onerror = function (error) {
                            reject("Failed to read model topology and weights manifest JSON " +
                                ("from file '" + jsonFile.name + "'. BrowserFiles supports loading ") +
                                "Keras-style tf.Model artifacts only.");
                            return;
                        };
                        jsonReader.readAsText(jsonFile);
                    })];
            });
        });
    };
    BrowserFiles.prototype.checkManifestAndWeightFiles = function (manifest, files) {
        var basenames = [];
        var fileNames = files.map(function (file) { return basename(file.name); });
        var pathToFile = {};
        for (var _i = 0, manifest_1 = manifest; _i < manifest_1.length; _i++) {
            var group = manifest_1[_i];
            group.paths.forEach(function (path) {
                var pathBasename = basename(path);
                if (basenames.indexOf(pathBasename) !== -1) {
                    throw new Error("Duplicate file basename found in weights manifest: " +
                        ("'" + pathBasename + "'"));
                }
                basenames.push(pathBasename);
                if (fileNames.indexOf(pathBasename) === -1) {
                    throw new Error("Weight file with basename '" + pathBasename + "' is not provided.");
                }
                else {
                    pathToFile[path] = files[fileNames.indexOf(pathBasename)];
                }
            });
        }
        if (basenames.length !== files.length) {
            throw new Error("Mismatch in the number of files in weights manifest " +
                ("(" + basenames.length + ") and the number of weight files provided ") +
                ("(" + files.length + ")."));
        }
        return pathToFile;
    };
    return BrowserFiles;
}());
export var browserDownloadsRouter = function (url) {
    if (!ENV.get('IS_BROWSER')) {
        return null;
    }
    else {
        if (url.startsWith(BrowserDownloads.URL_SCHEME)) {
            return browserDownloads(url.slice(BrowserDownloads.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(browserDownloadsRouter);
export function browserDownloads(fileNamePrefix) {
    if (fileNamePrefix === void 0) { fileNamePrefix = 'model'; }
    return new BrowserDownloads(fileNamePrefix);
}
export function browserFiles(files) {
    return new BrowserFiles(files);
}
//# sourceMappingURL=browser_files.js.map