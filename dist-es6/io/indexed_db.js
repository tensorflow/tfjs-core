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
import { getModelArtifactsInfoForJSON } from './io_utils';
import { ModelStoreManagerRegistry } from './model_management';
import { IORouterRegistry } from './router_registry';
var DATABASE_NAME = 'tensorflowjs';
var DATABASE_VERSION = 1;
var MODEL_STORE_NAME = 'models_store';
var INFO_STORE_NAME = 'model_info_store';
export function deleteDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var idbFactory;
        return __generator(this, function (_a) {
            idbFactory = getIndexedDBFactory();
            return [2, new Promise(function (resolve, reject) {
                    var deleteRequest = idbFactory.deleteDatabase(DATABASE_NAME);
                    deleteRequest.onsuccess = function () { return resolve(); };
                    deleteRequest.onerror = function (error) { return reject(error); };
                })];
        });
    });
}
function getIndexedDBFactory() {
    if (!ENV.get('IS_BROWSER')) {
        throw new Error('Failed to obtain IndexedDB factory because the current environment' +
            'is not a web browser.');
    }
    var theWindow = window;
    var factory = theWindow.indexedDB || theWindow.mozIndexedDB ||
        theWindow.webkitIndexedDB || theWindow.msIndexedDB ||
        theWindow.shimIndexedDB;
    if (factory == null) {
        throw new Error('The current browser does not appear to support IndexedDB.');
    }
    return factory;
}
function setUpDatabase(openRequest) {
    var db = openRequest.result;
    db.createObjectStore(MODEL_STORE_NAME, { keyPath: 'modelPath' });
    db.createObjectStore(INFO_STORE_NAME, { keyPath: 'modelPath' });
}
var BrowserIndexedDB = (function () {
    function BrowserIndexedDB(modelPath) {
        this.indexedDB = getIndexedDBFactory();
        if (modelPath == null || !modelPath) {
            throw new Error('For IndexedDB, modelPath must not be null, undefined or empty.');
        }
        this.modelPath = modelPath;
    }
    BrowserIndexedDB.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                    throw new Error('BrowserLocalStorage.save() does not support saving model topology ' +
                        'in binary formats yet.');
                }
                return [2, this.databaseAction(this.modelPath, modelArtifacts)];
            });
        });
    };
    BrowserIndexedDB.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.databaseAction(this.modelPath)];
            });
        });
    };
    BrowserIndexedDB.prototype.databaseAction = function (modelPath, modelArtifacts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var openRequest = _this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
            openRequest.onupgradeneeded = function () { return setUpDatabase(openRequest); };
            openRequest.onsuccess = function () {
                var db = openRequest.result;
                if (modelArtifacts == null) {
                    var modelTx = db.transaction(MODEL_STORE_NAME, 'readonly');
                    var modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                    var getRequest_1 = modelStore.get(_this.modelPath);
                    getRequest_1.onsuccess = function () {
                        if (getRequest_1.result == null) {
                            db.close();
                            return reject(new Error("Cannot find model with path '" + _this.modelPath + "' " +
                                "in IndexedDB."));
                        }
                        else {
                            resolve(getRequest_1.result.modelArtifacts);
                        }
                    };
                    getRequest_1.onerror = function (error) {
                        db.close();
                        return reject(getRequest_1.error);
                    };
                    modelTx.oncomplete = function () { return db.close(); };
                }
                else {
                    var modelArtifactsInfo_1 = getModelArtifactsInfoForJSON(modelArtifacts);
                    var infoTx_1 = db.transaction(INFO_STORE_NAME, 'readwrite');
                    var infoStore_1 = infoTx_1.objectStore(INFO_STORE_NAME);
                    var putInfoRequest_1 = infoStore_1.put({ modelPath: _this.modelPath, modelArtifactsInfo: modelArtifactsInfo_1 });
                    var modelTx_1;
                    putInfoRequest_1.onsuccess = function () {
                        modelTx_1 = db.transaction(MODEL_STORE_NAME, 'readwrite');
                        var modelStore = modelTx_1.objectStore(MODEL_STORE_NAME);
                        var putModelRequest = modelStore.put({
                            modelPath: _this.modelPath,
                            modelArtifacts: modelArtifacts,
                            modelArtifactsInfo: modelArtifactsInfo_1
                        });
                        putModelRequest.onsuccess = function () { return resolve({ modelArtifactsInfo: modelArtifactsInfo_1 }); };
                        putModelRequest.onerror = function (error) {
                            infoStore_1 = infoTx_1.objectStore(INFO_STORE_NAME);
                            var deleteInfoRequest = infoStore_1.delete(_this.modelPath);
                            deleteInfoRequest.onsuccess = function () {
                                db.close();
                                return reject(putModelRequest.error);
                            };
                            deleteInfoRequest.onerror = function (error) {
                                db.close();
                                return reject(putModelRequest.error);
                            };
                        };
                    };
                    putInfoRequest_1.onerror = function (error) {
                        db.close();
                        return reject(putInfoRequest_1.error);
                    };
                    infoTx_1.oncomplete = function () {
                        if (modelTx_1 == null) {
                            db.close();
                        }
                        else {
                            modelTx_1.oncomplete = function () { return db.close(); };
                        }
                    };
                }
            };
            openRequest.onerror = function (error) { return reject(openRequest.error); };
        });
    };
    BrowserIndexedDB.URL_SCHEME = 'indexeddb://';
    return BrowserIndexedDB;
}());
export { BrowserIndexedDB };
export var indexedDBRouter = function (url) {
    if (!ENV.get('IS_BROWSER')) {
        return null;
    }
    else {
        if (url.startsWith(BrowserIndexedDB.URL_SCHEME)) {
            return browserIndexedDB(url.slice(BrowserIndexedDB.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(indexedDBRouter);
IORouterRegistry.registerLoadRouter(indexedDBRouter);
export function browserIndexedDB(modelPath) {
    return new BrowserIndexedDB(modelPath);
}
function maybeStripScheme(key) {
    return key.startsWith(BrowserIndexedDB.URL_SCHEME) ?
        key.slice(BrowserIndexedDB.URL_SCHEME.length) :
        key;
}
var BrowserIndexedDBManager = (function () {
    function BrowserIndexedDBManager() {
        this.indexedDB = getIndexedDBFactory();
    }
    BrowserIndexedDBManager.prototype.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var openRequest = _this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
                        openRequest.onupgradeneeded = function () { return setUpDatabase(openRequest); };
                        openRequest.onsuccess = function () {
                            var db = openRequest.result;
                            var tx = db.transaction(INFO_STORE_NAME, 'readonly');
                            var store = tx.objectStore(INFO_STORE_NAME);
                            var getAllInfoRequest = store.getAll();
                            getAllInfoRequest.onsuccess = function () {
                                var out = {};
                                for (var _i = 0, _a = getAllInfoRequest.result; _i < _a.length; _i++) {
                                    var item = _a[_i];
                                    out[item.modelPath] = item.modelArtifactsInfo;
                                }
                                resolve(out);
                            };
                            getAllInfoRequest.onerror = function (error) {
                                db.close();
                                return reject(getAllInfoRequest.error);
                            };
                            tx.oncomplete = function () { return db.close(); };
                        };
                        openRequest.onerror = function (error) { return reject(openRequest.error); };
                    })];
            });
        });
    };
    BrowserIndexedDBManager.prototype.removeModel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                path = maybeStripScheme(path);
                return [2, new Promise(function (resolve, reject) {
                        var openRequest = _this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
                        openRequest.onupgradeneeded = function () { return setUpDatabase(openRequest); };
                        openRequest.onsuccess = function () {
                            var db = openRequest.result;
                            var infoTx = db.transaction(INFO_STORE_NAME, 'readwrite');
                            var infoStore = infoTx.objectStore(INFO_STORE_NAME);
                            var getInfoRequest = infoStore.get(path);
                            var modelTx;
                            getInfoRequest.onsuccess = function () {
                                if (getInfoRequest.result == null) {
                                    db.close();
                                    return reject(new Error("Cannot find model with path '" + path + "' " +
                                        "in IndexedDB."));
                                }
                                else {
                                    var deleteInfoRequest = infoStore.delete(path);
                                    var deleteModelData_1 = function () {
                                        modelTx = db.transaction(MODEL_STORE_NAME, 'readwrite');
                                        var modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                                        var deleteModelRequest = modelStore.delete(path);
                                        deleteModelRequest.onsuccess = function () {
                                            return resolve(getInfoRequest.result.modelArtifactsInfo);
                                        };
                                        deleteModelRequest.onerror = function (error) {
                                            return reject(getInfoRequest.error);
                                        };
                                    };
                                    deleteInfoRequest.onsuccess = deleteModelData_1;
                                    deleteInfoRequest.onerror = function (error) {
                                        deleteModelData_1();
                                        db.close();
                                        return reject(getInfoRequest.error);
                                    };
                                }
                            };
                            getInfoRequest.onerror = function (error) {
                                db.close();
                                return reject(getInfoRequest.error);
                            };
                            infoTx.oncomplete = function () {
                                if (modelTx == null) {
                                    db.close();
                                }
                                else {
                                    modelTx.oncomplete = function () { return db.close(); };
                                }
                            };
                        };
                        openRequest.onerror = function (error) { return reject(openRequest.error); };
                    })];
            });
        });
    };
    return BrowserIndexedDBManager;
}());
export { BrowserIndexedDBManager };
if (ENV.get('IS_BROWSER')) {
    try {
        ModelStoreManagerRegistry.registerManager(BrowserIndexedDB.URL_SCHEME, new BrowserIndexedDBManager());
    }
    catch (err) {
    }
}
//# sourceMappingURL=indexed_db.js.map