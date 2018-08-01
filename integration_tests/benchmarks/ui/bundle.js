(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var tf = require("@tensorflow/tfjs-core");
var benchmark_1 = require("./benchmark");
var benchmark_util = require("./benchmark_util");
var BatchNormalization3DCPUBenchmark = /** @class */ (function () {
    function BatchNormalization3DCPUBenchmark() {
    }
    BatchNormalization3DCPUBenchmark.prototype.run = function (size) {
        return __awaiter(this, void 0, void 0, function () {
            var x, mean, variance, varianceEpsilon, start, end;
            return __generator(this, function (_a) {
                if (this.lastRunTimeMs > benchmark_1.LAST_RUN_CPU_CUTOFF_MS) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            resolve(-1);
                        })];
                }
                tf.setBackend('cpu');
                x = tf.randomUniform([size, size, 8], -1, 1);
                mean = tf.tensor1d([0]);
                variance = tf.tensor1d([1]);
                varianceEpsilon = .001;
                start = performance.now();
                x.batchNormalization(mean, variance, varianceEpsilon);
                end = performance.now();
                this.lastRunTimeMs = end - start;
                return [2 /*return*/, this.lastRunTimeMs];
            });
        });
    };
    return BatchNormalization3DCPUBenchmark;
}());
exports.BatchNormalization3DCPUBenchmark = BatchNormalization3DCPUBenchmark;
var BatchNormalization3DGPUBenchmark = /** @class */ (function () {
    function BatchNormalization3DGPUBenchmark() {
    }
    BatchNormalization3DGPUBenchmark.prototype.run = function (size) {
        return __awaiter(this, void 0, void 0, function () {
            var x, mean, variance, varianceEpsilon, benchmark, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tf.setBackend('webgl');
                        x = tf.randomUniform([size, size, 8], -1, 1);
                        mean = tf.tensor1d([0]);
                        variance = tf.tensor1d([1]);
                        varianceEpsilon = .001;
                        benchmark = function () {
                            return x.batchNormalization(mean, variance, varianceEpsilon);
                        };
                        return [4 /*yield*/, benchmark_util.warmupAndBenchmarkGPU(benchmark)];
                    case 1:
                        time = _a.sent();
                        x.dispose();
                        mean.dispose();
                        variance.dispose();
                        return [2 /*return*/, time];
                }
            });
        });
    };
    return BatchNormalization3DGPUBenchmark;
}());
exports.BatchNormalization3DGPUBenchmark = BatchNormalization3DGPUBenchmark;

},{"./benchmark":2,"./benchmark_util":3,"@tensorflow/tfjs-core":17}],2:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
exports.__esModule = true;
// Maximum number of time before CPU tests don't execute during the next round.
exports.LAST_RUN_CPU_CUTOFF_MS = 5000;
var BenchmarkRun = /** @class */ (function () {
    function BenchmarkRun(name, benchmarkTest) {
        this.name = name;
        this.benchmarkTest = benchmarkTest;
        this.chartData = [];
    }
    BenchmarkRun.prototype.clearChartData = function () {
        this.chartData = [];
    };
    return BenchmarkRun;
}());
exports.BenchmarkRun = BenchmarkRun;

},{}],3:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
function warmupAndBenchmarkGPU(benchmark) {
    return __awaiter(this, void 0, void 0, function () {
        var out, start, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    out = benchmark();
                    return [4 /*yield*/, out.data()];
                case 1:
                    _a.sent();
                    out.dispose();
                    start = performance.now();
                    result = benchmark();
                    return [4 /*yield*/, result.data()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, performance.now() - start];
            }
        });
    });
}
exports.warmupAndBenchmarkGPU = warmupAndBenchmarkGPU;

},{}],4:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
var tf = require("@tensorflow/tfjs-core");
var benchmark_util = require("./benchmark_util");
var ConvGPUBenchmark = /** @class */ (function () {
    function ConvGPUBenchmark() {
    }
    ConvGPUBenchmark.prototype.run = function (size, opType, params) {
        return __awaiter(this, void 0, void 0, function () {
            var inDepth, inShape, filterSize, stride, pad, x, W, benchmark, regParams, wShape, regParams, wShape, depthwiseParams, wShape, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tf.setBackend('webgl');
                        inDepth = params.inDepth;
                        inShape = [size, size, inDepth];
                        filterSize = params.filterSize;
                        stride = params.stride;
                        pad = params.pad;
                        x = tf.randomUniform(inShape, -1, 1);
                        if (opType === 'regular') {
                            regParams = params;
                            wShape = [filterSize, filterSize, inDepth, regParams.outDepth];
                            W = tf.randomUniform(wShape, -1, 1);
                            benchmark = function () { return x.conv2d(W, stride, pad); };
                        }
                        else if (opType === 'transposed') {
                            regParams = params;
                            wShape = [filterSize, filterSize, inDepth, regParams.outDepth];
                            W = tf.randomUniform(wShape, -1, 1);
                            x = tf.randomUniform([size, size, regParams.outDepth], -1, 1);
                            benchmark = function () {
                                return x.conv2dTranspose(W, [size, size, inDepth], stride, pad);
                            };
                        }
                        else if (opType === 'depthwise') {
                            depthwiseParams = params;
                            wShape = [filterSize, filterSize, inDepth, depthwiseParams.channelMul];
                            W = tf.randomUniform(wShape, -1, 1);
                            benchmark = function () { return x.depthwiseConv2D(W, stride, pad); };
                        }
                        else {
                            throw new Error("Unknown option " + opType);
                        }
                        return [4 /*yield*/, benchmark_util.warmupAndBenchmarkGPU(benchmark)];
                    case 1:
                        time = _a.sent();
                        x.dispose();
                        W.dispose();
                        return [2 /*return*/, time];
                }
            });
        });
    };
    return ConvGPUBenchmark;
}());
exports.ConvGPUBenchmark = ConvGPUBenchmark;

},{"./benchmark_util":3,"@tensorflow/tfjs-core":17}],5:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var tf = require("@tensorflow/tfjs-core");
var benchmark_1 = require("./benchmark");
var benchmark_util = require("./benchmark_util");
var MatmulCPUBenchmark = /** @class */ (function () {
    function MatmulCPUBenchmark() {
    }
    MatmulCPUBenchmark.prototype.run = function (size) {
        return __awaiter(this, void 0, void 0, function () {
            var a, b, start, end;
            return __generator(this, function (_a) {
                if (this.lastRunTimeMs > benchmark_1.LAST_RUN_CPU_CUTOFF_MS) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            resolve(-1);
                        })];
                }
                tf.setBackend('cpu');
                a = tf.randomUniform([size, size], -1, 1);
                b = tf.randomUniform([size, size], -1, 1);
                start = performance.now();
                tf.matMul(a, b);
                end = performance.now();
                this.lastRunTimeMs = end - start;
                return [2 /*return*/, this.lastRunTimeMs];
            });
        });
    };
    return MatmulCPUBenchmark;
}());
exports.MatmulCPUBenchmark = MatmulCPUBenchmark;
var MatmulGPUBenchmark = /** @class */ (function () {
    function MatmulGPUBenchmark() {
    }
    MatmulGPUBenchmark.prototype.run = function (size) {
        return __awaiter(this, void 0, void 0, function () {
            var a, b, benchmark, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tf.setBackend('webgl');
                        a = tf.randomNormal([size, size]);
                        b = tf.randomNormal([size, size]);
                        benchmark = function () { return tf.matMul(a, b); };
                        return [4 /*yield*/, benchmark_util.warmupAndBenchmarkGPU(benchmark)];
                    case 1:
                        time = _a.sent();
                        a.dispose();
                        b.dispose();
                        return [2 /*return*/, time];
                }
            });
        });
    };
    return MatmulGPUBenchmark;
}());
exports.MatmulGPUBenchmark = MatmulGPUBenchmark;

},{"./benchmark":2,"./benchmark_util":3,"@tensorflow/tfjs-core":17}],6:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
var tf = require("@tensorflow/tfjs-core");
var benchmark_util = require("./benchmark_util");
var CPU_OP_RUNS = 1;
function getPoolingOp(option) {
    switch (option) {
        case 'max':
            return function (x, filterSize, strides) {
                return x.maxPool(filterSize, strides, 'same');
            };
        case 'avg':
            return function (x, filterSize, strides) {
                return x.avgPool(filterSize, strides, 'same');
            };
        default:
            throw new Error("Not found such ops: " + option);
    }
}
var PoolCPUBenchmark = /** @class */ (function () {
    function PoolCPUBenchmark() {
    }
    PoolCPUBenchmark.prototype.run = function (size, option, params) {
        tf.setBackend('cpu');
        var outputDepth = params.depth;
        var xShape = [size, size, outputDepth];
        var fieldSize = params.fieldSize;
        var stride = params.stride;
        var op = getPoolingOp(option);
        var x = tf.randomUniform(xShape, -1, 1);
        var start = performance.now();
        for (var i = 0; i < CPU_OP_RUNS; i++) {
            op(x, fieldSize, stride);
        }
        var avgTime = (performance.now() - start) / CPU_OP_RUNS;
        return new Promise(function (resolve, reject) {
            resolve(avgTime);
        });
    };
    return PoolCPUBenchmark;
}());
exports.PoolCPUBenchmark = PoolCPUBenchmark;
var PoolGPUBenchmark = /** @class */ (function () {
    function PoolGPUBenchmark() {
    }
    PoolGPUBenchmark.prototype.run = function (size, option, params) {
        return __awaiter(this, void 0, void 0, function () {
            var outputDepth, xShape, fieldSize, stride, x, op, benchmark, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tf.setBackend('webgl');
                        outputDepth = params.depth;
                        xShape = [size, size, outputDepth];
                        fieldSize = params.fieldSize;
                        stride = params.stride;
                        x = tf.randomUniform(xShape, -1, 1);
                        op = getPoolingOp(option);
                        benchmark = function () { return op(x, fieldSize, stride); };
                        return [4 /*yield*/, benchmark_util.warmupAndBenchmarkGPU(benchmark)];
                    case 1:
                        time = _a.sent();
                        x.dispose();
                        return [2 /*return*/, time];
                }
            });
        });
    };
    return PoolGPUBenchmark;
}());
exports.PoolGPUBenchmark = PoolGPUBenchmark;

},{"./benchmark_util":3,"@tensorflow/tfjs-core":17}],7:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var tf = require("@tensorflow/tfjs-core");
var benchmark_util = require("./benchmark_util");
function getReductionOp(option) {
    switch (option) {
        case 'max':
            return function (x) { return x.max(); };
        case 'min':
            return function (x) { return x.min(); };
        case 'argMax':
            return function (x) { return x.argMax(); };
        case 'argMin':
            return function (x) { return x.argMin(); };
        case 'sum':
            return function (x) { return x.sum(); };
        case 'logSumExp':
            return function (x) { return x.logSumExp(); };
        default:
            throw new Error("Not found such ops: " + option);
    }
}
var ReductionOpsCPUBenchmark = /** @class */ (function () {
    function ReductionOpsCPUBenchmark() {
    }
    ReductionOpsCPUBenchmark.prototype.run = function (size, option) {
        return __awaiter(this, void 0, void 0, function () {
            var input, op, start, end;
            return __generator(this, function (_a) {
                tf.setBackend('cpu');
                input = tf.randomUniform([size, size], -1, 1);
                op = getReductionOp(option);
                start = performance.now();
                tf.tidy(function () {
                    op(input).get();
                });
                end = performance.now();
                return [2 /*return*/, end - start];
            });
        });
    };
    return ReductionOpsCPUBenchmark;
}());
exports.ReductionOpsCPUBenchmark = ReductionOpsCPUBenchmark;
var ReductionOpsGPUBenchmark = /** @class */ (function () {
    function ReductionOpsGPUBenchmark() {
    }
    ReductionOpsGPUBenchmark.prototype.run = function (size, option) {
        return __awaiter(this, void 0, void 0, function () {
            var input, op, benchmark, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tf.setBackend('webgl');
                        input = tf.randomUniform([size, size], -1, 1);
                        op = getReductionOp(option);
                        benchmark = function () { return op(input); };
                        return [4 /*yield*/, benchmark_util.warmupAndBenchmarkGPU(benchmark)];
                    case 1:
                        time = _a.sent();
                        input.dispose();
                        return [2 /*return*/, time];
                }
            });
        });
    };
    return ReductionOpsGPUBenchmark;
}());
exports.ReductionOpsGPUBenchmark = ReductionOpsGPUBenchmark;

},{"./benchmark_util":3,"@tensorflow/tfjs-core":17}],8:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
var tf = require("@tensorflow/tfjs-core");
var benchmark_util = require("./benchmark_util");
function getUnaryOp(option) {
    switch (option) {
        case 'log':
            return function (x) { return x.log(); };
        case 'exp':
            return function (x) { return x.exp(); };
        case 'neg':
            return function (x) { return x.neg(); };
        case 'ceil':
            return function (x) { return x.ceil(); };
        case 'floor':
            return function (x) { return x.floor(); };
        case 'log1p':
            return function (x) { return x.log1p(); };
        case 'sqrt':
            return function (x) { return x.sqrt(); };
        case 'square':
            return function (x) { return x.square(); };
        case 'abs':
            return function (x) { return x.abs(); };
        case 'relu':
            return function (x) { return x.relu(); };
        case 'elu':
            return function (x) { return x.elu(); };
        case 'selu':
            return function (x) { return x.selu(); };
        case 'leakyRelu':
            return function (x) { return x.leakyRelu(); };
        case 'prelu':
            // TODO: Configurable from UI
            var alpha_1 = tf.scalar(0.1);
            return function (x) { return x.prelu(alpha_1); };
        case 'sigmoid':
            return function (x) { return x.sigmoid(); };
        case 'sin':
            return function (x) { return x.sin(); };
        case 'cos':
            return function (x) { return x.cos(); };
        case 'tan':
            return function (x) { return x.tan(); };
        case 'asin':
            return function (x) { return x.asin(); };
        case 'acos':
            return function (x) { return x.acos(); };
        case 'atan':
            return function (x) { return x.atan(); };
        case 'sinh':
            return function (x) { return x.sinh(); };
        case 'cosh':
            return function (x) { return x.cosh(); };
        case 'tanh':
            return function (x) { return x.tanh(); };
        case 'step':
            return function (x) { return x.step(); };
        default:
            throw new Error("Not found such ops: " + option);
    }
}
var UnaryOpsCPUBenchmark = /** @class */ (function () {
    function UnaryOpsCPUBenchmark() {
    }
    UnaryOpsCPUBenchmark.prototype.run = function (size, option) {
        return __awaiter(this, void 0, void 0, function () {
            var input, op, start, end;
            return __generator(this, function (_a) {
                tf.setBackend('cpu');
                input = tf.randomUniform([size, size], -1, 1);
                op = getUnaryOp(option);
                start = performance.now();
                tf.tidy(function () {
                    op(input).dataSync();
                });
                end = performance.now();
                return [2 /*return*/, end - start];
            });
        });
    };
    return UnaryOpsCPUBenchmark;
}());
exports.UnaryOpsCPUBenchmark = UnaryOpsCPUBenchmark;
var UnaryOpsGPUBenchmark = /** @class */ (function () {
    function UnaryOpsGPUBenchmark() {
    }
    UnaryOpsGPUBenchmark.prototype.run = function (size, option) {
        return __awaiter(this, void 0, void 0, function () {
            var input, op, benchmark, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tf.setBackend('webgl');
                        input = tf.randomUniform([size, size], -1, 1);
                        op = getUnaryOp(option);
                        benchmark = function () { return op(input); };
                        return [4 /*yield*/, benchmark_util.warmupAndBenchmarkGPU(benchmark)];
                    case 1:
                        time = _a.sent();
                        input.dispose();
                        return [2 /*return*/, time];
                }
            });
        });
    };
    return UnaryOpsGPUBenchmark;
}());
exports.UnaryOpsGPUBenchmark = UnaryOpsGPUBenchmark;

},{"./benchmark_util":3,"@tensorflow/tfjs-core":17}],9:[function(require,module,exports){
(function (setImmediate){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var delayCallback = typeof requestAnimationFrame !== 'undefined'
    ? requestAnimationFrame
    : setImmediate;
var BrowserUtil = (function () {
    function BrowserUtil() {
    }
    BrowserUtil.nextFrame = function () {
        return new Promise(function (resolve) { return delayCallback(function () { return resolve(); }); });
    };
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Timing' })
    ], BrowserUtil, "nextFrame", null);
    return BrowserUtil;
}());
exports.BrowserUtil = BrowserUtil;

}).call(this,require("timers").setImmediate)
},{"./doc":11,"timers":150}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMobile() {
    var a = navigator.userAgent || navigator.vendor || window.opera;
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
        .test(a) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            .test(a.substr(0, 4));
}
exports.isMobile = isMobile;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function doc(info) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
}
exports.doc = doc;

},{}],12:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var profiler_1 = require("./profiler");
var tape_1 = require("./tape");
var tensor_1 = require("./tensor");
var tensor_util_1 = require("./tensor_util");
var util = require("./util");
var util_1 = require("./util");
var Engine = (function () {
    function Engine(backend, safeMode, debugMode) {
        this.backend = backend;
        this.safeMode = safeMode;
        this.debugMode = debugMode;
        this.registeredVariables = {};
        this.refCounter = new WeakMap();
        this.nextTapeNodeId = 0;
        this.numBytes = 0;
        this.numTensors = 0;
        this.numDataBuffers = 0;
        this.gradientScopeCount = 0;
        this.customGradientDepth = 0;
        this.keepTensors = new Set();
        this.activeScope = { track: [], name: 'default scope' };
        this.scopeStack = [this.activeScope];
        this.profiler = new profiler_1.Profiler(backend);
    }
    Engine.prototype.tidy = function (nameOrFn, fn, gradMode) {
        var _this = this;
        if (gradMode === void 0) { gradMode = false; }
        var name = null;
        if (fn == null) {
            if (typeof nameOrFn !== 'function') {
                throw new Error('Please provide a function to tidy()');
            }
            fn = nameOrFn;
        }
        else {
            if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
                throw new Error('When calling with two arguments, the first argument ' +
                    'to tidy() must be a string');
            }
            if (typeof fn !== 'function') {
                throw new Error('When calling with two arguments, the 2nd argument ' +
                    'to tidy() must be a function');
            }
            name = nameOrFn;
        }
        var result;
        return this.scopedRun(function () { return _this.startScope(name, gradMode); }, function () { return _this.endScope(result, gradMode); }, function () {
            result = fn();
            if (result instanceof Promise) {
                console.error('Cannot return a Promise inside of tidy.');
            }
            return result;
        });
    };
    Engine.prototype.scopedRun = function (start, end, f) {
        start();
        try {
            var res = f();
            end();
            return res;
        }
        catch (ex) {
            end();
            throw ex;
        }
    };
    Engine.prototype.runKernel = function (forwardFunc, inputs, backwardsFunc) {
        var _this = this;
        var result;
        var saved = [];
        var saveFunc = function (x) {
            saved.push(x);
            return x;
        };
        var scopeName = this.activeScope.name;
        this.scopedRun(function () { return _this.customGradientDepth++; }, function () { return _this.customGradientDepth--; }, function () {
            if (!_this.debugMode()) {
                result = forwardFunc(_this.backend, saveFunc);
            }
            else {
                result = _this.profiler.profileKernel(scopeName, function () { return forwardFunc(_this.backend, saveFunc); });
            }
        });
        if (this.shouldRecord()) {
            var tapeNode = {
                id: this.nextTapeNodeId++,
                name: scopeName,
                inputs: inputs,
                output: result,
            };
            if (backwardsFunc != null) {
                tapeNode.gradient = function (dy) { return backwardsFunc(dy, saved); };
            }
            this.activeTape.push(tapeNode);
        }
        return result;
    };
    Engine.prototype.registerTensor = function (a) {
        var refCount = this.refCounter.has(a.dataId) ? this.refCounter.get(a.dataId) : 0;
        this.numTensors++;
        if (refCount === 0) {
            this.numDataBuffers++;
            this.numBytes +=
                util.sizeFromShape(a.shape) * util.bytesPerElement(a.dtype);
            this.backend.register(a.dataId, a.shape, a.dtype);
        }
        this.refCounter.set(a.dataId, refCount + 1);
        if (!(a instanceof tensor_1.Variable)) {
            this.track(a);
        }
    };
    Engine.prototype.registerVariable = function (v) {
        if (this.registeredVariables[v.name] != null) {
            throw new Error("Variable with name " + v.name + " was already registered");
        }
        this.registeredVariables[v.name] = v;
    };
    Engine.prototype.disposeTensor = function (a) {
        if (!this.refCounter.has(a.dataId)) {
            return;
        }
        if (this.keepTensors.has(a.id)) {
            this.keepTensors.delete(a.id);
        }
        this.numTensors--;
        var refCount = this.refCounter.get(a.dataId);
        if (refCount <= 1) {
            this.refCounter.delete(a.dataId);
            this.backend.disposeData(a.dataId);
            this.numDataBuffers--;
            this.numBytes -=
                util.sizeFromShape(a.shape) * util.bytesPerElement(a.dtype);
        }
        else {
            this.refCounter.set(a.dataId, refCount - 1);
        }
    };
    Engine.prototype.disposeVariables = function () {
        for (var varName in this.registeredVariables) {
            var v = this.registeredVariables[varName];
            this.disposeTensor(v);
            delete this.registeredVariables[varName];
        }
    };
    Engine.prototype.memory = function () {
        var info = this.backend.memory();
        info.numTensors = this.numTensors;
        info.numDataBuffers = this.numDataBuffers;
        info.numBytes = this.numBytes;
        return info;
    };
    Engine.prototype.shouldRecord = function () {
        return this.activeTape != null && this.customGradientDepth === 0;
    };
    Engine.prototype.addTapeNode = function (inputs, result, gradientsFunc) {
        var inputsMap = {};
        inputs.forEach(function (input, idx) {
            inputsMap[idx] = input;
        });
        var gradient = function (dy) {
            var res = gradientsFunc(dy);
            var resMap = {};
            res.forEach(function (r, idx) {
                resMap[idx] = function () { return r; };
            });
            return resMap;
        };
        var tapeNode = {
            id: this.nextTapeNodeId++,
            name: this.activeScope.name,
            inputs: inputsMap,
            output: result,
            gradient: gradient
        };
        this.activeTape.push(tapeNode);
    };
    Engine.prototype.keep = function (result) {
        if (this.scopeStack.length === 1 && this.safeMode) {
            throw new Error('Safe mode is ON. Enclose all tensor operations inside tf.tidy(): ' +
                'tf.tidy(() => {...}) to avoid memory leaks.');
        }
        this.keepTensors.add(result.id);
        return result;
    };
    Engine.prototype.startScope = function (name, gradientsMode) {
        if (gradientsMode === void 0) { gradientsMode = false; }
        if (gradientsMode && this.gradientScopeCount === 0) {
            this.activeTape = [];
        }
        if (gradientsMode) {
            this.gradientScopeCount++;
        }
        var scopeInfo = { track: [], name: 'unnamed scope' };
        if (name) {
            scopeInfo.name = name;
        }
        this.scopeStack.push(scopeInfo);
        this.activeScope = scopeInfo;
    };
    Engine.prototype.endScope = function (result, gradientsMode) {
        var _this = this;
        if (gradientsMode === void 0) { gradientsMode = false; }
        if (gradientsMode) {
            this.gradientScopeCount--;
            if (this.gradientScopeCount === 0) {
                this.activeTape = null;
            }
        }
        var tensorsToKeep = new Set(this.keepTensors);
        var tensorsToTrackInParent = tensor_util_1.getTensorsInContainer(result);
        tensorsToTrackInParent.forEach(function (tensor) { return tensorsToKeep.add(tensor.id); });
        for (var i = 0; i < this.activeScope.track.length; i++) {
            var tensor = this.activeScope.track[i];
            if (tensorsToKeep.has(tensor.id)) {
                continue;
            }
            if (this.activeTape != null) {
                tensorsToTrackInParent.push(tensor);
            }
            else {
                tensor.dispose();
            }
        }
        var oldScope = this.scopeStack.pop();
        this.activeScope = this.scopeStack.length === 0 ?
            { track: [], name: 'default scope' } :
            this.scopeStack[this.scopeStack.length - 1];
        tensorsToTrackInParent.forEach(function (tensor) {
            if (!_this.keepTensors.has(tensor.id) &&
                tensor_util_1.isTensorInList(tensor, oldScope.track)) {
                _this.track(tensor);
            }
        });
    };
    Engine.prototype.gradients = function (f, xs, dy, allowNoGradients) {
        var _this = this;
        if (allowNoGradients === void 0) { allowNoGradients = false; }
        util.assert(xs.length > 0, 'gradients() received an empty list of xs.');
        return this.tidy('gradients', function () {
            var y = f();
            util.assert(y instanceof tensor_1.Tensor, 'The result y returned by f() must be a tensor.');
            var filteredTape = tape_1.getFilteredNodesXToY(_this.activeTape, xs, y);
            if (!allowNoGradients && filteredTape.length === 0 && xs.length > 0) {
                throw new Error('Cannot compute gradient of y=f(x) with respect to x. Make sure ' +
                    'that the f you passed encloses all operations that lead from x ' +
                    'to y.');
            }
            var accumulatedGradientMap = {};
            accumulatedGradientMap[y.id] = (dy == null) ? ones(y.shape) : dy;
            tape_1.backpropagateGradients(accumulatedGradientMap, filteredTape);
            var grads = xs.map(function (x) { return accumulatedGradientMap[x.id]; });
            return { value: y, grads: grads };
        }, true);
    };
    Engine.prototype.customGrad = function (f) {
        var _this = this;
        util.assert(util.isFunction(f), 'The f passed in customGrad(f) must be a function.');
        return function () {
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            util.assert(inputs.every(function (t) { return t instanceof tensor_1.Tensor; }), 'The args passed in customGrad(f)(x1, x2,...) must all be tensors');
            var gradientsFunc;
            var result;
            _this.scopedRun(function () { return _this.customGradientDepth++; }, function () { return _this.customGradientDepth--; }, function () {
                var gradientsMode = true;
                result = _this.tidy(f.name, function () {
                    var _a = f.apply(void 0, inputs), value = _a.value, gradFunc = _a.gradFunc;
                    util.assert(value instanceof tensor_1.Tensor, 'The function f passed in customGrad(f) must return an ' +
                        'object where `obj.value` is a tensor');
                    util.assert(util.isFunction(gradFunc), 'The function f passed in customGrad(f) must return an ' +
                        'object where `obj.gradFunc` is a function.');
                    gradientsFunc = gradFunc;
                    return value;
                }, gradientsMode);
            });
            if (_this.shouldRecord()) {
                var gradFunc = function (dy) {
                    var res = gradientsFunc(dy);
                    var grads = Array.isArray(res) ? res : [res];
                    util.assert(grads.length === inputs.length, 'The function f passed in customGrad(f) must return an object ' +
                        'where `obj.gradFunc` is a function that returns the same ' +
                        'number of tensors as inputs passed to f(...).');
                    util.assert(grads.every(function (t) { return t instanceof tensor_1.Tensor; }), 'The function f passed in customGrad(f) must return an object ' +
                        'where `obj.gradFunc` is a function that returns a list of ' +
                        'only tensors.');
                    return grads;
                };
                _this.addTapeNode(inputs, result, gradFunc);
            }
            return result;
        };
    };
    Engine.prototype.write = function (dataId, values) {
        this.backend.write(dataId, values);
    };
    Engine.prototype.readSync = function (dataId) {
        return this.backend.readSync(dataId);
    };
    Engine.prototype.read = function (dataId) {
        return this.backend.read(dataId);
    };
    Engine.prototype.fromPixels = function (pixels, numChannels) {
        return this.backend.fromPixels(pixels, numChannels);
    };
    Engine.prototype.time = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var start, timingInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = util_1.now();
                        return [4, this.backend.time(query)];
                    case 1:
                        timingInfo = _a.sent();
                        timingInfo.wallMs = util_1.now() - start;
                        return [2, timingInfo];
                }
            });
        });
    };
    Engine.prototype.track = function (result) {
        if (this.scopeStack.length === 1 && this.safeMode) {
            throw new Error('Safe mode is ON. Enclose all tensor operations inside tf.tidy(): ' +
                'tf.tidy(() => {op();...}); to avoid memory leaks.');
        }
        this.activeScope.track.push(result);
        return result;
    };
    return Engine;
}());
exports.Engine = Engine;
function ones(shape) {
    var values = util_1.makeOnesTypedArray(util_1.sizeFromShape(shape), 'float32');
    return tensor_1.Tensor.make(shape, { values: values });
}

},{"./profiler":122,"./tape":124,"./tensor":125,"./tensor_util":127,"./util":131}],13:[function(require,module,exports){
(function (process){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var device_util = require("./device_util");
var doc_1 = require("./doc");
var engine_1 = require("./engine");
var environment_util_1 = require("./environment_util");
var tensor_1 = require("./tensor");
var tensor_util_1 = require("./tensor_util");
var TEST_EPSILON_FLOAT32_ENABLED = 1e-3;
var TEST_EPSILON_FLOAT32_DISABLED = 1e-1;
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
        if (!(backendType in exports.ENV.registry)) {
            throw new Error("Backend type '" + backendType + "' not found in registry");
        }
        exports.ENV.initBackend(backendType, safeMode);
    };
    Environment.getBackend = function () {
        exports.ENV.initDefaultBackend();
        return exports.ENV.currentBackend;
    };
    Environment.disposeVariables = function () {
        exports.ENV.engine.disposeVariables();
    };
    Environment.memory = function () {
        return exports.ENV.engine.memory();
    };
    Environment.tidy = function (nameOrFn, fn, gradMode) {
        if (gradMode === void 0) { gradMode = false; }
        return exports.ENV.engine.tidy(nameOrFn, fn, gradMode);
    };
    Environment.dispose = function (container) {
        var tensors = tensor_util_1.getTensorsInContainer(container);
        tensors.forEach(function (tensor) { return tensor.dispose(); });
    };
    Environment.keep = function (result) {
        return exports.ENV.engine.keep(result);
    };
    Environment.time = function (f) {
        return exports.ENV.engine.time(f);
    };
    Environment.prototype.get = function (feature) {
        if (feature in this.features) {
            return this.features[feature];
        }
        this.features[feature] = this.evaluateFeature(feature);
        return this.features[feature];
    };
    Environment.prototype.getFeatures = function () {
        return this.features;
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
        else if (feature === 'IS_NODE') {
            return (typeof process !== 'undefined') &&
                (typeof process.versions.node !== 'undefined');
        }
        else if (feature === 'IS_CHROME') {
            return environment_util_1.isChrome();
        }
        else if (feature === 'IS_TEST') {
            return false;
        }
        else if (feature === 'BACKEND') {
            return this.getBestBackendType();
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') {
            var webGLVersion = this.get('WEBGL_VERSION');
            if (webGLVersion === 0) {
                return 0;
            }
            return environment_util_1.getWebGLDisjointQueryTimerVersion(webGLVersion, this.get('IS_BROWSER'));
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE') {
            return this.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
                !device_util.isMobile();
        }
        else if (feature === 'HAS_WEBGL') {
            return this.get('WEBGL_VERSION') > 0;
        }
        else if (feature === 'WEBGL_VERSION') {
            if (environment_util_1.isWebGLVersionEnabled(2, this.get('IS_BROWSER'))) {
                return 2;
            }
            else if (environment_util_1.isWebGLVersionEnabled(1, this.get('IS_BROWSER'))) {
                return 1;
            }
            return 0;
        }
        else if (feature === 'WEBGL_RENDER_FLOAT32_ENABLED') {
            return environment_util_1.isRenderToFloatTextureEnabled(this.get('WEBGL_VERSION'), this.get('IS_BROWSER'));
        }
        else if (feature === 'WEBGL_DOWNLOAD_FLOAT_ENABLED') {
            return environment_util_1.isDownloadFloatTextureEnabled(this.get('WEBGL_VERSION'), this.get('IS_BROWSER'));
        }
        else if (feature === 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED') {
            return environment_util_1.isWebGLGetBufferSubDataAsyncExtensionEnabled(this.get('WEBGL_VERSION'), this.get('IS_BROWSER'));
        }
        else if (feature === 'TEST_EPSILON') {
            if (this.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
                return TEST_EPSILON_FLOAT32_ENABLED;
            }
            return TEST_EPSILON_FLOAT32_DISABLED;
        }
        throw new Error("Unknown feature " + feature + ".");
    };
    Environment.prototype.setFeatures = function (features) {
        this.features = Object.assign({}, features);
    };
    Environment.prototype.reset = function () {
        this.features = environment_util_1.getFeaturesFromURL();
        if (this.globalEngine != null) {
            this.globalEngine = null;
        }
    };
    Environment.prototype.initBackend = function (backendType, safeMode) {
        var _this = this;
        if (safeMode === void 0) { safeMode = false; }
        this.currentBackend = backendType;
        var backend = this.findBackend(backendType);
        this.globalEngine = new engine_1.Engine(backend, safeMode, function () { return _this.get('DEBUG'); });
    };
    Environment.prototype.findBackend = function (name) {
        if (!(name in this.registry)) {
            return null;
        }
        return this.registry[name].backend;
    };
    Environment.prototype.registerBackend = function (name, factory, priority, setTensorTrackerFn) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        if (name in this.registry) {
            console.warn(name + " backend was already registered. Reusing existing backend");
            if (setTensorTrackerFn != null) {
                setTensorTrackerFn(function () { return _this.engine; });
            }
            return false;
        }
        try {
            var backend = factory();
            this.registry[name] = { backend: backend, priority: priority };
            return true;
        }
        catch (err) {
            console.warn("Registration of backend " + name + " failed");
            console.warn(err.stack || err.message);
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
            this.initBackend(this.get('BACKEND'), false);
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "setBackend", null);
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "getBackend", null);
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "disposeVariables", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "memory", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "tidy", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "dispose", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "keep", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Timing' })
    ], Environment, "time", null);
    return Environment;
}());
exports.Environment = Environment;
function getGlobalNamespace() {
    var ns;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (process) !== 'undefined') {
        ns = process;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}
function getOrMakeEnvironment() {
    var ns = getGlobalNamespace();
    if (ns.ENV == null) {
        ns.ENV = new Environment(environment_util_1.getFeaturesFromURL());
        tensor_1.setTensorTracker(function () { return ns.ENV.engine; });
    }
    return ns.ENV;
}
exports.ENV = getOrMakeEnvironment();

}).call(this,require('_process'))
},{"./device_util":10,"./doc":11,"./engine":12,"./environment_util":14,"./tensor":125,"./tensor_util":127,"_process":149}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Type;
(function (Type) {
    Type[Type["NUMBER"] = 0] = "NUMBER";
    Type[Type["BOOLEAN"] = 1] = "BOOLEAN";
    Type[Type["STRING"] = 2] = "STRING";
})(Type = exports.Type || (exports.Type = {}));
exports.URL_PROPERTIES = [
    { name: 'DEBUG', type: Type.BOOLEAN }, { name: 'IS_BROWSER', type: Type.BOOLEAN },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', type: Type.BOOLEAN },
    { name: 'WEBGL_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_RENDER_FLOAT32_ENABLED', type: Type.BOOLEAN },
    { name: 'WEBGL_DOWNLOAD_FLOAT_ENABLED', type: Type.BOOLEAN }, {
        name: 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED',
        type: Type.BOOLEAN
    },
    { name: 'BACKEND', type: Type.STRING }
];
function isWebGLVersionEnabled(webGLVersion, isBrowser) {
    var gl;
    try {
        gl = getWebGLRenderingContext(webGLVersion, isBrowser);
    }
    catch (e) {
        return false;
    }
    if (gl != null) {
        loseContext(gl);
        return true;
    }
    return false;
}
exports.isWebGLVersionEnabled = isWebGLVersionEnabled;
function getWebGLDisjointQueryTimerVersion(webGLVersion, isBrowser) {
    if (webGLVersion === 0) {
        return 0;
    }
    var queryTimerVersion;
    var gl = getWebGLRenderingContext(webGLVersion, isBrowser);
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
exports.getWebGLDisjointQueryTimerVersion = getWebGLDisjointQueryTimerVersion;
function isRenderToFloatTextureEnabled(webGLVersion, isBrowser) {
    if (webGLVersion === 0) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion, isBrowser);
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
    createFloatTextureAndBindToFramebuffer(gl, webGLVersion);
    var isFrameBufferComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    loseContext(gl);
    return isFrameBufferComplete;
}
exports.isRenderToFloatTextureEnabled = isRenderToFloatTextureEnabled;
function isDownloadFloatTextureEnabled(webGLVersion, isBrowser) {
    if (webGLVersion === 0) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion, isBrowser);
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
    createFloatTextureAndBindToFramebuffer(gl, webGLVersion);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));
    var readPixelsNoError = gl.getError() === gl.NO_ERROR;
    loseContext(gl);
    return readPixelsNoError;
}
exports.isDownloadFloatTextureEnabled = isDownloadFloatTextureEnabled;
function isWebGLGetBufferSubDataAsyncExtensionEnabled(webGLVersion, isBrowser) {
    if (webGLVersion > 0) {
        return false;
    }
    if (webGLVersion !== 2) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion, isBrowser);
    var isEnabled = hasExtension(gl, 'WEBGL_get_buffer_sub_data_async');
    loseContext(gl);
    return isEnabled;
}
exports.isWebGLGetBufferSubDataAsyncExtensionEnabled = isWebGLGetBufferSubDataAsyncExtensionEnabled;
function isChrome() {
    return typeof navigator !== 'undefined' && navigator != null &&
        navigator.userAgent != null && /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
}
exports.isChrome = isChrome;
var TENSORFLOWJS_FLAGS_PREFIX = 'tfjsflags';
function getFeaturesFromURL() {
    var features = {};
    if (typeof window === 'undefined' || typeof window.location === 'undefined') {
        return features;
    }
    var urlParams = util_1.getQueryParams(window.location.search);
    if (TENSORFLOWJS_FLAGS_PREFIX in urlParams) {
        var urlFlags_1 = {};
        var keyValues = urlParams[TENSORFLOWJS_FLAGS_PREFIX].split(',');
        keyValues.forEach(function (keyValue) {
            var _a = keyValue.split(':'), key = _a[0], value = _a[1];
            urlFlags_1[key] = value;
        });
        exports.URL_PROPERTIES.forEach(function (urlProperty) {
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
exports.getFeaturesFromURL = getFeaturesFromURL;
function hasExtension(gl, extensionName) {
    var ext = gl.getExtension(extensionName);
    return ext != null;
}
function getWebGLRenderingContext(webGLVersion, isBrowser) {
    if (webGLVersion === 0 || !isBrowser) {
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
function createFloatTextureAndBindToFramebuffer(gl, webGLVersion) {
    var frameBuffer = gl.createFramebuffer();
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var internalFormat = webGLVersion === 2 ? gl.RGBA32F : gl.RGBA;
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
}

},{"./util":131}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var gradients_1 = require("./gradients");
exports.tidy = environment_1.Environment.tidy;
exports.keep = environment_1.Environment.keep;
exports.dispose = environment_1.Environment.dispose;
exports.time = environment_1.Environment.time;
exports.grad = gradients_1.Gradients.grad;
exports.valueAndGrad = gradients_1.Gradients.valueAndGrad;
exports.grads = gradients_1.Gradients.grads;
exports.valueAndGrads = gradients_1.Gradients.valueAndGrads;
exports.variableGrads = gradients_1.Gradients.variableGrads;
exports.customGrad = gradients_1.Gradients.customGrad;

},{"./environment":13,"./gradients":16}],16:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var environment_1 = require("./environment");
var tensor_1 = require("./tensor");
var util = require("./util");
var Gradients = (function () {
    function Gradients() {
    }
    Gradients.gradScope = function (nameOrScopeFn, scopeFn) {
        return environment_1.ENV.engine.tidy(nameOrScopeFn, scopeFn, true);
    };
    Gradients.grad = function (f) {
        util.assert(util.isFunction(f), 'The f passed in grad(f) must be a function');
        return function (x, dy) {
            util.assert(x instanceof tensor_1.Tensor, 'The x passed in grad(f)(x) must be a tensor');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in grad(f)(x, dy) must be a tensor');
            return environment_1.ENV.engine.tidy(function () {
                var _a = environment_1.ENV.engine.gradients(function () { return f(x); }, [x], dy), value = _a.value, grads = _a.grads;
                if (dy != null) {
                    util.assertShapesMatch(value.shape, dy.shape, 'The shape of dy passed in grad(f)(x, dy) must match the shape ' +
                        'returned by f(x)');
                }
                checkGrads(grads);
                return grads[0];
            });
        };
    };
    Gradients.grads = function (f) {
        util.assert(util.isFunction(f), 'The f passed in grads(f) must be a function');
        return function (args, dy) {
            util.assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof tensor_1.Tensor; }), 'The args passed in grads(f)(args) must be an array of tensors');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in grads(f)(args, dy) must be a tensor');
            return environment_1.ENV.engine.tidy(function () {
                var _a = environment_1.ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy), value = _a.value, grads = _a.grads;
                if (dy != null) {
                    util.assertShapesMatch(value.shape, dy.shape, 'The shape of dy passed in grads(f)([x1,...], dy) must ' +
                        'match the shape returned by f([x1,...])');
                }
                checkGrads(grads);
                return grads;
            });
        };
    };
    Gradients.valueAndGrad = function (f) {
        util.assert(util.isFunction(f), 'The f passed in valueAndGrad(f) must be a function');
        return function (x, dy) {
            util.assert(x instanceof tensor_1.Tensor, 'The x passed in valueAndGrad(f)(x) must be a tensor');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in valueAndGrad(f)(x, dy) must be a tensor');
            var _a = environment_1.ENV.engine.gradients(function () { return f(x); }, [x], dy), grads = _a.grads, value = _a.value;
            checkGrads(grads);
            return { grad: grads[0], value: value };
        };
    };
    Gradients.valueAndGrads = function (f) {
        util.assert(util.isFunction(f), 'The f passed in valueAndGrads(f) must be a function');
        return function (args, dy) {
            util.assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof tensor_1.Tensor; }), 'The args passed in valueAndGrads(f)(args) must be array of tensors');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in valueAndGrads(f)(args, dy) must be a tensor');
            var res = environment_1.ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy);
            if (dy != null) {
                util.assertShapesMatch(res.value.shape, dy.shape, 'The shape of dy passed in valueAndGrads(f)([x1,...], dy) must ' +
                    'match the shape returned by f([x1,...])');
            }
            checkGrads(res.grads);
            return res;
        };
    };
    Gradients.variableGrads = function (f, varList) {
        util.assert(util.isFunction(f), 'The f passed in variableGrads(f) must be a function');
        util.assert(varList == null ||
            Array.isArray(varList) && varList.every(function (v) { return v instanceof tensor_1.Variable; }), 'The varList passed in variableGrads(f, varList) must be an array ' +
            'of variables');
        if (varList == null) {
            varList = [];
            for (var varName in environment_1.ENV.engine.registeredVariables) {
                varList.push(environment_1.ENV.engine.registeredVariables[varName]);
            }
        }
        var originalVarCount = varList.length;
        varList = varList.filter(function (variable) { return variable.trainable; });
        util.assert(varList.length > 0, "variableGrads() expects at least one of the input variables to be " +
            ("trainable, but none of the " + originalVarCount + " variables is ") +
            "trainable.");
        var allowNoGradients = true;
        var _a = environment_1.ENV.engine.gradients(f, varList, null, allowNoGradients), value = _a.value, grads = _a.grads;
        util.assert(grads.some(function (g) { return g != null; }), 'Cannot find a connection between any variable and the result of the ' +
            'loss function y=f(x). Please make sure the operations that use ' +
            'variables are inside the function f passed to minimize().');
        util.assert(value.rank === 0, "The f passed in variableGrads(f) must return a scalar, but it " +
            ("returned a rank-" + value.rank + " tensor"));
        var namedGrads = {};
        varList.forEach(function (v, i) {
            if (grads[i] != null) {
                namedGrads[v.name] = grads[i];
            }
        });
        return { value: value, grads: namedGrads };
    };
    Gradients.customGrad = function (f) {
        return environment_1.ENV.engine.customGrad(f);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "grad", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "grads", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "valueAndGrad", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "valueAndGrads", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "variableGrads", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "customGrad", null);
    return Gradients;
}());
exports.Gradients = Gradients;
function checkGrads(grads) {
    var numNullGradients = grads.filter(function (g) { return g == null; }).length;
    if (numNullGradients > 0) {
        throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
    }
}

},{"./doc":11,"./environment":13,"./tensor":125,"./util":131}],17:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./kernels/backend_webgl");
require("./kernels/backend_cpu");
var browser_util_1 = require("./browser_util");
var environment = require("./environment");
exports.environment = environment;
var environment_1 = require("./environment");
var io = require("./io/io");
exports.io = io;
var serialization = require("./serialization");
exports.serialization = serialization;
var tensor_1 = require("./tensor");
var test_util = require("./test_util");
exports.test_util = test_util;
var util = require("./util");
exports.util = util;
var version_1 = require("./version");
exports.version_core = version_1.version;
var webgl = require("./webgl");
exports.webgl = webgl;
var adadelta_optimizer_1 = require("./optimizers/adadelta_optimizer");
exports.AdadeltaOptimizer = adadelta_optimizer_1.AdadeltaOptimizer;
var adagrad_optimizer_1 = require("./optimizers/adagrad_optimizer");
exports.AdagradOptimizer = adagrad_optimizer_1.AdagradOptimizer;
var adam_optimizer_1 = require("./optimizers/adam_optimizer");
exports.AdamOptimizer = adam_optimizer_1.AdamOptimizer;
var adamax_optimizer_1 = require("./optimizers/adamax_optimizer");
exports.AdamaxOptimizer = adamax_optimizer_1.AdamaxOptimizer;
var momentum_optimizer_1 = require("./optimizers/momentum_optimizer");
exports.MomentumOptimizer = momentum_optimizer_1.MomentumOptimizer;
var optimizer_1 = require("./optimizers/optimizer");
exports.Optimizer = optimizer_1.Optimizer;
var rmsprop_optimizer_1 = require("./optimizers/rmsprop_optimizer");
exports.RMSPropOptimizer = rmsprop_optimizer_1.RMSPropOptimizer;
var sgd_optimizer_1 = require("./optimizers/sgd_optimizer");
exports.SGDOptimizer = sgd_optimizer_1.SGDOptimizer;
var tensor_2 = require("./tensor");
exports.Tensor = tensor_2.Tensor;
exports.TensorBuffer = tensor_2.TensorBuffer;
exports.variable = tensor_2.variable;
exports.Variable = tensor_2.Variable;
var types_1 = require("./types");
exports.Rank = types_1.Rank;
__export(require("./ops/ops"));
var loss_ops_1 = require("./ops/loss_ops");
exports.Reduction = loss_ops_1.Reduction;
__export(require("./train"));
__export(require("./globals"));
var environment_2 = require("./environment");
exports.ENV = environment_2.ENV;
exports.Environment = environment_2.Environment;
exports.setBackend = environment_1.Environment.setBackend;
exports.getBackend = environment_1.Environment.getBackend;
exports.disposeVariables = environment_1.Environment.disposeVariables;
exports.memory = environment_1.Environment.memory;
var doc_1 = require("./doc");
exports.doc = doc_1.doc;
exports.nextFrame = browser_util_1.BrowserUtil.nextFrame;
var ops = require("./ops/ops");
tensor_1.setOpHandler(ops);

},{"./browser_util":9,"./doc":11,"./environment":13,"./globals":15,"./io/io":21,"./kernels/backend_cpu":29,"./kernels/backend_webgl":31,"./ops/loss_ops":87,"./ops/ops":94,"./optimizers/adadelta_optimizer":112,"./optimizers/adagrad_optimizer":113,"./optimizers/adam_optimizer":114,"./optimizers/adamax_optimizer":115,"./optimizers/momentum_optimizer":116,"./optimizers/optimizer":117,"./optimizers/rmsprop_optimizer":120,"./optimizers/sgd_optimizer":121,"./serialization":123,"./tensor":125,"./test_util":128,"./train":129,"./types":130,"./util":131,"./version":132,"./webgl":133}],18:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var io_utils_1 = require("./io_utils");
var router_registry_1 = require("./router_registry");
var DEFAULT_FILE_NAME_PREFIX = 'model';
var DEFAULT_JSON_EXTENSION_NAME = '.json';
var DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';
var BrowserDownloads = (function () {
    function BrowserDownloads(fileNamePrefix) {
        if (!environment_1.ENV.get('IS_BROWSER')) {
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
                    return [2, { modelArtifactsInfo: io_utils_1.getModelArtifactsInfoForJSON(modelArtifacts) }];
                }
                return [2];
            });
        });
    };
    BrowserDownloads.URL_SCHEME = 'downloads://';
    return BrowserDownloads;
}());
exports.BrowserDownloads = BrowserDownloads;
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
            var jsonFile, weightFiles;
            var _this = this;
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
                                                weightData: io_utils_1.concatenateArrayBuffers(perFileBuffers),
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
        var fileNames = files.map(function (file) { return io_utils_1.basename(file.name); });
        var pathToFile = {};
        for (var _i = 0, manifest_1 = manifest; _i < manifest_1.length; _i++) {
            var group = manifest_1[_i];
            group.paths.forEach(function (path) {
                var pathBasename = io_utils_1.basename(path);
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
exports.browserDownloadsRouter = function (url) {
    if (!environment_1.ENV.get('IS_BROWSER')) {
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
router_registry_1.IORouterRegistry.registerSaveRouter(exports.browserDownloadsRouter);
function browserDownloads(fileNamePrefix) {
    if (fileNamePrefix === void 0) { fileNamePrefix = 'model'; }
    return new BrowserDownloads(fileNamePrefix);
}
exports.browserDownloads = browserDownloads;
function browserFiles(files) {
    return new BrowserFiles(files);
}
exports.browserFiles = browserFiles;

},{"../environment":13,"./io_utils":22,"./router_registry":26}],19:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var util_1 = require("../util");
var io_utils_1 = require("./io_utils");
var router_registry_1 = require("./router_registry");
var weights_loader_1 = require("./weights_loader");
var BrowserHTTPRequest = (function () {
    function BrowserHTTPRequest(path, requestInit) {
        this.DEFAULT_METHOD = 'POST';
        if (!environment_1.ENV.get('IS_BROWSER')) {
            throw new Error('browserHTTPRequest is not supported outside the web browser.');
        }
        util_1.assert(path != null && path.length > 0, 'URL path for browserHTTPRequest must not be null, undefined or ' +
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
                                    modelArtifactsInfo: io_utils_1.getModelArtifactsInfoForJSON(modelArtifacts),
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
            var modelConfigRequest, modelConfig, modelTopology, weightsManifest, weightSpecs, weightData, weightsManifest_2, _i, weightsManifest_1, entry, pathPrefix_1, fetchURLs_1, _a;
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
                        weightsManifest_2 = modelConfig['weightsManifest'];
                        weightSpecs = [];
                        for (_i = 0, weightsManifest_1 = weightsManifest_2; _i < weightsManifest_1.length; _i++) {
                            entry = weightsManifest_1[_i];
                            weightSpecs.push.apply(weightSpecs, entry.weights);
                        }
                        pathPrefix_1 = this.path.substring(0, this.path.lastIndexOf('/'));
                        if (!pathPrefix_1.endsWith('/')) {
                            pathPrefix_1 = pathPrefix_1 + '/';
                        }
                        fetchURLs_1 = [];
                        weightsManifest_2.forEach(function (weightsGroup) {
                            weightsGroup.paths.forEach(function (path) {
                                fetchURLs_1.push(pathPrefix_1 + path);
                            });
                        });
                        _a = io_utils_1.concatenateArrayBuffers;
                        return [4, weights_loader_1.loadWeightsAsArrayBuffer(fetchURLs_1, this.requestInit)];
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
exports.BrowserHTTPRequest = BrowserHTTPRequest;
exports.httpRequestRouter = function (url) {
    if (!environment_1.ENV.get('IS_BROWSER')) {
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
router_registry_1.IORouterRegistry.registerSaveRouter(exports.httpRequestRouter);
router_registry_1.IORouterRegistry.registerLoadRouter(exports.httpRequestRouter);
function browserHTTPRequest(path, requestInit) {
    return new BrowserHTTPRequest(path, requestInit);
}
exports.browserHTTPRequest = browserHTTPRequest;

},{"../environment":13,"../util":131,"./io_utils":22,"./router_registry":26,"./weights_loader":28}],20:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var io_utils_1 = require("./io_utils");
var model_management_1 = require("./model_management");
var router_registry_1 = require("./router_registry");
var DATABASE_NAME = 'tensorflowjs';
var DATABASE_VERSION = 1;
var MODEL_STORE_NAME = 'models_store';
var INFO_STORE_NAME = 'model_info_store';
function deleteDatabase() {
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
exports.deleteDatabase = deleteDatabase;
function getIndexedDBFactory() {
    if (!environment_1.ENV.get('IS_BROWSER')) {
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
                    var modelArtifactsInfo_1 = io_utils_1.getModelArtifactsInfoForJSON(modelArtifacts);
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
exports.BrowserIndexedDB = BrowserIndexedDB;
exports.indexedDBRouter = function (url) {
    if (!environment_1.ENV.get('IS_BROWSER')) {
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
router_registry_1.IORouterRegistry.registerSaveRouter(exports.indexedDBRouter);
router_registry_1.IORouterRegistry.registerLoadRouter(exports.indexedDBRouter);
function browserIndexedDB(modelPath) {
    return new BrowserIndexedDB(modelPath);
}
exports.browserIndexedDB = browserIndexedDB;
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
exports.BrowserIndexedDBManager = BrowserIndexedDBManager;
if (environment_1.ENV.get('IS_BROWSER')) {
    try {
        model_management_1.ModelStoreManagerRegistry.registerManager(BrowserIndexedDB.URL_SCHEME, new BrowserIndexedDBManager());
    }
    catch (err) {
    }
}

},{"../environment":13,"./io_utils":22,"./model_management":24,"./router_registry":26}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./indexed_db");
require("./local_storage");
var browser_files_1 = require("./browser_files");
exports.browserFiles = browser_files_1.browserFiles;
var browser_http_1 = require("./browser_http");
exports.browserHTTPRequest = browser_http_1.browserHTTPRequest;
var io_utils_1 = require("./io_utils");
exports.concatenateArrayBuffers = io_utils_1.concatenateArrayBuffers;
exports.decodeWeights = io_utils_1.decodeWeights;
exports.encodeWeights = io_utils_1.encodeWeights;
exports.getModelArtifactsInfoForJSON = io_utils_1.getModelArtifactsInfoForJSON;
var model_management_1 = require("./model_management");
var passthrough_1 = require("./passthrough");
exports.fromMemory = passthrough_1.fromMemory;
exports.withSaveHandler = passthrough_1.withSaveHandler;
var router_registry_1 = require("./router_registry");
var weights_loader_1 = require("./weights_loader");
exports.loadWeights = weights_loader_1.loadWeights;
var registerSaveRouter = router_registry_1.IORouterRegistry.registerSaveRouter;
exports.registerSaveRouter = registerSaveRouter;
var registerLoadRouter = router_registry_1.IORouterRegistry.registerLoadRouter;
exports.registerLoadRouter = registerLoadRouter;
var getSaveHandlers = router_registry_1.IORouterRegistry.getSaveHandlers;
exports.getSaveHandlers = getSaveHandlers;
var getLoadHandlers = router_registry_1.IORouterRegistry.getLoadHandlers;
exports.getLoadHandlers = getLoadHandlers;
var copyModel = model_management_1.ModelManagement.copyModel;
exports.copyModel = copyModel;
var listModels = model_management_1.ModelManagement.listModels;
exports.listModels = listModels;
var moveModel = model_management_1.ModelManagement.moveModel;
exports.moveModel = moveModel;
var removeModel = model_management_1.ModelManagement.removeModel;
exports.removeModel = removeModel;

},{"./browser_files":18,"./browser_http":19,"./indexed_db":20,"./io_utils":22,"./local_storage":23,"./model_management":24,"./passthrough":25,"./router_registry":26,"./weights_loader":28}],22:[function(require,module,exports){
(function (Buffer){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_ops_1 = require("../ops/tensor_ops");
var util_1 = require("../util");
var types_1 = require("./types");
function encodeWeights(tensors) {
    return __awaiter(this, void 0, void 0, function () {
        var specs, dataPromises, name_1, t, tensorValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    specs = [];
                    dataPromises = [];
                    for (name_1 in tensors) {
                        t = tensors[name_1];
                        if (t.dtype !== 'float32' && t.dtype !== 'int32' && t.dtype !== 'bool') {
                            throw new Error("Unsupported dtype in weight '" + name_1 + "': " + t.dtype);
                        }
                        specs.push({ name: name_1, shape: t.shape, dtype: t.dtype });
                        dataPromises.push(t.data());
                    }
                    return [4, Promise.all(dataPromises)];
                case 1:
                    tensorValues = _a.sent();
                    return [2, { data: concatenateTypedArrays(tensorValues), specs: specs }];
            }
        });
    });
}
exports.encodeWeights = encodeWeights;
function decodeWeights(buffer, specs) {
    var out = {};
    var offset = 0;
    for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
        var spec = specs_1[_i];
        var name_2 = spec.name;
        var dtype = spec.dtype;
        var shape = spec.shape;
        if (spec.quantization != null) {
            throw new Error("decodeWeights does not support quantization yet, but encountered " +
                ("weight '" + name_2 + " with quantization.'"));
        }
        var size = util_1.sizeFromShape(shape);
        var value = void 0;
        if (dtype === 'float32') {
            value = tensor_ops_1.tensor(new Float32Array(buffer, offset, size), shape, 'float32');
        }
        else if (dtype === 'int32') {
            value = tensor_ops_1.tensor(new Int32Array(buffer, offset, size), shape, 'int32');
        }
        else if (dtype === 'bool') {
            value = tensor_ops_1.tensor(new Uint8Array(buffer, offset, size), shape, 'bool');
        }
        else {
            throw new Error("Unsupported dtype in weight '" + name_2 + "': " + dtype);
        }
        out[name_2] = value;
        offset += size * types_1.DTYPE_VALUE_SIZE_MAP[dtype];
    }
    return out;
}
exports.decodeWeights = decodeWeights;
function concatenateTypedArrays(xs) {
    if (xs === null) {
        throw new Error("Invalid input value: " + JSON.stringify(xs));
    }
    var totalByteLength = 0;
    xs.forEach(function (x) {
        if (x instanceof Float32Array || x instanceof Int32Array) {
            totalByteLength += x.buffer.byteLength;
        }
        else if (x instanceof Uint8Array) {
            totalByteLength += x.buffer.byteLength;
        }
        else {
            throw new Error("Unsupported TypedArray subtype: " + x.constructor.name);
        }
    });
    var y = new Uint8Array(totalByteLength);
    var offset = 0;
    xs.forEach(function (x) {
        y.set(new Uint8Array(x.buffer), offset);
        offset += x.buffer.byteLength;
    });
    return y.buffer;
}
exports.concatenateTypedArrays = concatenateTypedArrays;
var useNodeBuffer = typeof Buffer !== 'undefined' &&
    (typeof Blob === 'undefined' || typeof atob === 'undefined' ||
        typeof btoa === 'undefined');
function stringByteLength(str) {
    if (useNodeBuffer) {
        return Buffer.byteLength(str);
    }
    return new Blob([str]).size;
}
exports.stringByteLength = stringByteLength;
function arrayBufferToBase64String(buffer) {
    if (useNodeBuffer) {
        return Buffer.from(buffer).toString('base64');
    }
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}
exports.arrayBufferToBase64String = arrayBufferToBase64String;
function base64StringToArrayBuffer(str) {
    if (useNodeBuffer) {
        var buf = Buffer.from(str, 'base64');
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    var s = atob(str);
    var buffer = new Uint8Array(s.length);
    for (var i = 0; i < s.length; ++i) {
        buffer.set([s.charCodeAt(i)], i);
    }
    return buffer.buffer;
}
exports.base64StringToArrayBuffer = base64StringToArrayBuffer;
function concatenateArrayBuffers(buffers) {
    var totalByteLength = 0;
    buffers.forEach(function (buffer) {
        totalByteLength += buffer.byteLength;
    });
    var temp = new Uint8Array(totalByteLength);
    var offset = 0;
    buffers.forEach(function (buffer) {
        temp.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    });
    return temp.buffer;
}
exports.concatenateArrayBuffers = concatenateArrayBuffers;
function basename(path) {
    var SEPARATOR = '/';
    path = path.trim();
    while (path.endsWith(SEPARATOR)) {
        path = path.slice(0, path.length - 1);
    }
    var items = path.split(SEPARATOR);
    return items[items.length - 1];
}
exports.basename = basename;
function getModelArtifactsInfoForJSON(modelArtifacts) {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
        throw new Error('Expected JSON model topology, received ArrayBuffer.');
    }
    return {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
        modelTopologyBytes: modelArtifacts.modelTopology == null ?
            0 :
            stringByteLength(JSON.stringify(modelArtifacts.modelTopology)),
        weightSpecsBytes: modelArtifacts.weightSpecs == null ?
            0 :
            stringByteLength(JSON.stringify(modelArtifacts.weightSpecs)),
        weightDataBytes: modelArtifacts.weightData == null ?
            0 :
            modelArtifacts.weightData.byteLength,
    };
}
exports.getModelArtifactsInfoForJSON = getModelArtifactsInfoForJSON;

}).call(this,require("buffer").Buffer)
},{"../ops/tensor_ops":109,"../util":131,"./types":27,"buffer":147}],23:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var util_1 = require("../util");
var io_utils_1 = require("./io_utils");
var model_management_1 = require("./model_management");
var router_registry_1 = require("./router_registry");
var PATH_SEPARATOR = '/';
var PATH_PREFIX = 'tensorflowjs_models';
var INFO_SUFFIX = 'info';
var MODEL_TOPOLOGY_SUFFIX = 'model_topology';
var WEIGHT_SPECS_SUFFIX = 'weight_specs';
var WEIGHT_DATA_SUFFIX = 'weight_data';
function purgeLocalStorageArtifacts() {
    if (!environment_1.ENV.get('IS_BROWSER') || typeof window.localStorage === 'undefined') {
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
exports.purgeLocalStorageArtifacts = purgeLocalStorageArtifacts;
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
        if (!environment_1.ENV.get('IS_BROWSER') || typeof window.localStorage === 'undefined') {
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
                    modelArtifactsInfo = io_utils_1.getModelArtifactsInfoForJSON(modelArtifacts);
                    try {
                        this.LS.setItem(this.keys.info, JSON.stringify(modelArtifactsInfo));
                        this.LS.setItem(this.keys.topology, topology);
                        this.LS.setItem(this.keys.weightSpecs, weightSpecs);
                        this.LS.setItem(this.keys.weightData, io_utils_1.arrayBufferToBase64String(modelArtifacts.weightData));
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
                out.weightData = io_utils_1.base64StringToArrayBuffer(weightDataBase64);
                return [2, out];
            });
        });
    };
    BrowserLocalStorage.URL_SCHEME = 'localstorage://';
    return BrowserLocalStorage;
}());
exports.BrowserLocalStorage = BrowserLocalStorage;
exports.localStorageRouter = function (url) {
    if (!environment_1.ENV.get('IS_BROWSER')) {
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
router_registry_1.IORouterRegistry.registerSaveRouter(exports.localStorageRouter);
router_registry_1.IORouterRegistry.registerLoadRouter(exports.localStorageRouter);
function browserLocalStorage(modelPath) {
    return new BrowserLocalStorage(modelPath);
}
exports.browserLocalStorage = browserLocalStorage;
var BrowserLocalStorageManager = (function () {
    function BrowserLocalStorageManager() {
        util_1.assert(environment_1.ENV.get('IS_BROWSER'), 'Current environment is not a web browser');
        util_1.assert(typeof window.localStorage !== 'undefined', 'Current browser does not appear to support localStorage');
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
exports.BrowserLocalStorageManager = BrowserLocalStorageManager;
if (environment_1.ENV.get('IS_BROWSER')) {
    try {
        model_management_1.ModelStoreManagerRegistry.registerManager(BrowserLocalStorage.URL_SCHEME, new BrowserLocalStorageManager());
    }
    catch (err) {
    }
}

},{"../environment":13,"../util":131,"./io_utils":22,"./model_management":24,"./router_registry":26}],24:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var util_1 = require("../util");
var router_registry_1 = require("./router_registry");
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
        util_1.assert(scheme != null, 'scheme must not be undefined or null.');
        if (scheme.endsWith(URL_SCHEME_SUFFIX)) {
            scheme = scheme.slice(0, scheme.indexOf(URL_SCHEME_SUFFIX));
        }
        util_1.assert(scheme.length > 0, 'scheme must not be an empty string.');
        var registry = ModelStoreManagerRegistry.getInstance();
        util_1.assert(registry.managers[scheme] == null, "A model store manager is already registered for scheme '" + scheme + "'.");
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
exports.ModelStoreManagerRegistry = ModelStoreManagerRegistry;
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
                    util_1.assert(sourceURL !== destURL, "Old path and new path are the same: '" + sourceURL + "'");
                    loadHandlers = router_registry_1.IORouterRegistry.getLoadHandlers(sourceURL);
                    util_1.assert(loadHandlers.length > 0, "Copying failed because no load handler is found for source URL " + sourceURL + ".");
                    util_1.assert(loadHandlers.length < 2, "Copying failed because more than one (" + loadHandlers.length + ") " +
                        ("load handlers for source URL " + sourceURL + "."));
                    loadHandler = loadHandlers[0];
                    saveHandlers = router_registry_1.IORouterRegistry.getSaveHandlers(destURL);
                    util_1.assert(saveHandlers.length > 0, "Copying failed because no save handler is found for destination URL " +
                        (destURL + "."));
                    util_1.assert(saveHandlers.length < 2, "Copying failed because more than one (" + loadHandlers.length + ") " +
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
        doc_1.doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "listModels", null);
    __decorate([
        doc_1.doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "removeModel", null);
    __decorate([
        doc_1.doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "copyModel", null);
    __decorate([
        doc_1.doc({ heading: 'Models', subheading: 'Management', namespace: 'io' })
    ], ModelManagement, "moveModel", null);
    return ModelManagement;
}());
exports.ModelManagement = ModelManagement;

},{"../doc":11,"../util":131,"./router_registry":26}],25:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var PassthroughLoader = (function () {
    function PassthroughLoader(modelTopology, weightSpecs, weightData) {
        this.modelTopology = modelTopology;
        this.weightSpecs = weightSpecs;
        this.weightData = weightData;
    }
    PassthroughLoader.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = {};
                if (this.modelTopology != null) {
                    result = __assign({ modelTopology: this.modelTopology }, result);
                }
                if (this.weightSpecs != null && this.weightSpecs.length > 0) {
                    result = __assign({ weightSpecs: this.weightSpecs }, result);
                }
                if (this.weightData != null && this.weightData.byteLength > 0) {
                    result = __assign({ weightData: this.weightData }, result);
                }
                return [2, result];
            });
        });
    };
    return PassthroughLoader;
}());
var PassthroughSaver = (function () {
    function PassthroughSaver(saveHandler) {
        this.saveHandler = saveHandler;
    }
    PassthroughSaver.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.saveHandler(modelArtifacts)];
            });
        });
    };
    return PassthroughSaver;
}());
function fromMemory(modelTopology, weightSpecs, weightData) {
    return new PassthroughLoader(modelTopology, weightSpecs, weightData);
}
exports.fromMemory = fromMemory;
function withSaveHandler(saveHandler) {
    return new PassthroughSaver(saveHandler);
}
exports.withSaveHandler = withSaveHandler;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IORouterRegistry = (function () {
    function IORouterRegistry() {
        this.saveRouters = [];
        this.loadRouters = [];
    }
    IORouterRegistry.getInstance = function () {
        if (IORouterRegistry.instance == null) {
            IORouterRegistry.instance = new IORouterRegistry();
        }
        return IORouterRegistry.instance;
    };
    IORouterRegistry.registerSaveRouter = function (saveRouter) {
        IORouterRegistry.getInstance().saveRouters.push(saveRouter);
    };
    IORouterRegistry.registerLoadRouter = function (loadRouter) {
        IORouterRegistry.getInstance().loadRouters.push(loadRouter);
    };
    IORouterRegistry.getSaveHandlers = function (url) {
        return IORouterRegistry.getHandlers(url, 'save');
    };
    IORouterRegistry.getLoadHandlers = function (url) {
        return IORouterRegistry.getHandlers(url, 'load');
    };
    IORouterRegistry.getHandlers = function (url, handlerType) {
        var validHandlers = [];
        var routers = handlerType === 'load' ? this.getInstance().loadRouters :
            this.getInstance().saveRouters;
        routers.forEach(function (router) {
            var handler = router(url);
            if (handler !== null) {
                validHandlers.push(handler);
            }
        });
        return validHandlers;
    };
    return IORouterRegistry;
}());
exports.IORouterRegistry = IORouterRegistry;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DTYPE_VALUE_SIZE_MAP = {
    'float32': 4,
    'int32': 4,
    'uint16': 2,
    'uint8': 1,
    'bool': 1,
};

},{}],28:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var ops_1 = require("../ops/ops");
var util = require("../util");
var types_1 = require("./types");
function loadWeightsAsArrayBuffer(fetchURLs, requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var requests, responses, buffers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requests = fetchURLs.map(function (fetchURL) { return fetch(fetchURL, requestOptions); });
                    return [4, Promise.all(requests)];
                case 1:
                    responses = _a.sent();
                    return [4, Promise.all(responses.map(function (response) { return response.arrayBuffer(); }))];
                case 2:
                    buffers = _a.sent();
                    return [2, buffers];
            }
        });
    });
}
exports.loadWeightsAsArrayBuffer = loadWeightsAsArrayBuffer;
function loadWeights(manifest, filePathPrefix, weightNames, requestOptions) {
    if (filePathPrefix === void 0) { filePathPrefix = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var groupIndicesToFetchMap, groupWeightsToFetch, weightsFound, allManifestWeightNames, weightsNotFound, groupIndicesToFetch, fetchUrls, buffers, weightsTensorMap, bufferIndexOffset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    groupIndicesToFetchMap = manifest.map(function () { return false; });
                    groupWeightsToFetch = {};
                    weightsFound = weightNames != null ? weightNames.map(function () { return false; }) : [];
                    allManifestWeightNames = [];
                    manifest.forEach(function (manifestGroupConfig, groupIndex) {
                        var groupOffset = 0;
                        manifestGroupConfig.weights.forEach(function (weightsEntry) {
                            var rawDtype = ('quantization' in weightsEntry) ?
                                weightsEntry.quantization.dtype :
                                weightsEntry.dtype;
                            var weightsBytes = types_1.DTYPE_VALUE_SIZE_MAP[rawDtype] *
                                util.sizeFromShape(weightsEntry.shape);
                            var enqueueWeightsForFetchingFn = function () {
                                groupIndicesToFetchMap[groupIndex] = true;
                                if (groupWeightsToFetch[groupIndex] == null) {
                                    groupWeightsToFetch[groupIndex] = [];
                                }
                                groupWeightsToFetch[groupIndex].push({
                                    manifestEntry: weightsEntry,
                                    groupOffset: groupOffset,
                                    sizeBytes: weightsBytes
                                });
                            };
                            if (weightNames != null) {
                                weightNames.forEach(function (weightName, weightIndex) {
                                    if (weightName === weightsEntry.name) {
                                        enqueueWeightsForFetchingFn();
                                        weightsFound[weightIndex] = true;
                                    }
                                });
                            }
                            else {
                                enqueueWeightsForFetchingFn();
                            }
                            allManifestWeightNames.push(weightsEntry.name);
                            groupOffset += weightsBytes;
                        });
                    });
                    if (!weightsFound.every(function (found) { return found; })) {
                        weightsNotFound = weightNames.filter(function (weight, i) { return !weightsFound[i]; });
                        throw new Error("Could not find weights in manifest with names: " +
                            (weightsNotFound.join(', ') + ". \n") +
                            "Manifest JSON has weights with names: " +
                            (allManifestWeightNames.join(', ') + "."));
                    }
                    groupIndicesToFetch = groupIndicesToFetchMap.reduce(function (accumulator, shouldFetch, i) {
                        if (shouldFetch) {
                            accumulator.push(i);
                        }
                        return accumulator;
                    }, []);
                    fetchUrls = [];
                    groupIndicesToFetch.forEach(function (i) {
                        manifest[i].paths.forEach(function (filepath) {
                            var fetchUrl = filePathPrefix +
                                (!filePathPrefix.endsWith('/') ? '/' : '') + filepath;
                            fetchUrls.push(fetchUrl);
                        });
                    });
                    return [4, loadWeightsAsArrayBuffer(fetchUrls, requestOptions)];
                case 1:
                    buffers = _a.sent();
                    weightsTensorMap = {};
                    bufferIndexOffset = 0;
                    groupIndicesToFetch.forEach(function (i) {
                        var numBuffers = manifest[i].paths.length;
                        var groupBytes = 0;
                        for (var i_1 = 0; i_1 < numBuffers; i_1++) {
                            groupBytes += buffers[bufferIndexOffset + i_1].byteLength;
                        }
                        var groupBuffer = new ArrayBuffer(groupBytes);
                        var groupByteBuffer = new Uint8Array(groupBuffer);
                        var groupBufferOffset = 0;
                        for (var i_2 = 0; i_2 < numBuffers; i_2++) {
                            var buffer = new Uint8Array(buffers[bufferIndexOffset + i_2]);
                            groupByteBuffer.set(buffer, groupBufferOffset);
                            groupBufferOffset += buffer.byteLength;
                        }
                        var weightsEntries = groupWeightsToFetch[i];
                        weightsEntries.forEach(function (weightsEntry) {
                            var byteBuffer = groupBuffer.slice(weightsEntry.groupOffset, weightsEntry.groupOffset + weightsEntry.sizeBytes);
                            var typedArray;
                            var dtype = weightsEntry.manifestEntry.dtype;
                            if ('quantization' in weightsEntry.manifestEntry) {
                                var quantization_1 = weightsEntry.manifestEntry.quantization;
                                if (quantization_1.dtype !== 'uint8' && quantization_1.dtype !== 'uint16') {
                                    throw new Error("Weight " + weightsEntry.manifestEntry.name + " has unknown " +
                                        ("quantization dtype " + quantization_1.dtype + "."));
                                }
                                var quantizedArray = (quantization_1.dtype === 'uint8') ?
                                    new Uint8Array(byteBuffer) :
                                    new Uint16Array(byteBuffer);
                                if (dtype === 'float32') {
                                    typedArray = Float32Array.from(quantizedArray, function (v) { return v * quantization_1.scale + quantization_1.min; });
                                }
                                else if (dtype === 'int32') {
                                    typedArray = Int32Array.from(quantizedArray, function (v) { return Math.round(v * quantization_1.scale + quantization_1.min); });
                                }
                                else {
                                    throw new Error("Weight " + weightsEntry.manifestEntry.name + " has a dtype not " +
                                        ("supported by quantization: " + dtype));
                                }
                            }
                            else {
                                if (dtype === 'float32') {
                                    typedArray = new Float32Array(byteBuffer);
                                }
                                else if (dtype === 'int32') {
                                    typedArray = new Int32Array(byteBuffer);
                                }
                                else {
                                    throw new Error("Weight " + weightsEntry.manifestEntry.name + " has unknown dtype " +
                                        (dtype + "."));
                                }
                            }
                            var weightName = weightsEntry.manifestEntry.name;
                            if (weightsTensorMap[weightName] != null) {
                                throw new Error("Duplicate weight with name " + weightName + ". " +
                                    "Please make sure weights names are unique in the manifest JSON.");
                            }
                            weightsTensorMap[weightName] = ops_1.tensor(typedArray, weightsEntry.manifestEntry.shape, weightsEntry.manifestEntry.dtype);
                        });
                        bufferIndexOffset += numBuffers;
                    });
                    return [2, weightsTensorMap];
            }
        });
    });
}
exports.loadWeights = loadWeights;

},{"../ops/ops":94,"../util":131,"./types":27}],29:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var environment_1 = require("../environment");
var axis_util = require("../ops/axis_util");
var broadcast_util = require("../ops/broadcast_util");
var concat_util = require("../ops/concat_util");
var erf_util = require("../ops/erf_util");
var ops = require("../ops/ops");
var ops_1 = require("../ops/ops");
var selu_util = require("../ops/selu_util");
var slice_util_1 = require("../ops/slice_util");
var tensor_1 = require("../tensor");
var types = require("../types");
var util = require("../util");
var util_1 = require("../util");
var backend_util = require("./backend_util");
var MathBackendCPU = (function () {
    function MathBackendCPU() {
        this.data = new WeakMap();
        this.firstUse = true;
        if (environment_1.ENV.get('IS_BROWSER')) {
            this.canvas = document.createElement('canvas');
        }
    }
    MathBackendCPU.prototype.register = function (dataId, shape, dtype) {
        if (this.firstUse) {
            this.firstUse = false;
            if (environment_1.ENV.get('IS_NODE') && !environment_1.ENV.get('IS_TEST')) {
                console.warn('\n============================\n' +
                    'Hi there 👋. Looks like you are running TensorFlow.js in ' +
                    'Node.js. To speed things up dramatically, install our node ' +
                    'backend, which binds to TensorFlow C++, by running ' +
                    'npm i @tensorflow/tfjs-node, ' +
                    'or npm i @tensorflow/tfjs-node-gpu if you have CUDA. ' +
                    'Then call require(\'@tensorflow/tfjs-node\'); (-gpu ' +
                    'suffix for CUDA) at the start of your program. ' +
                    'Visit https://github.com/tensorflow/tfjs-node for more details.' +
                    '\n============================\n');
            }
        }
        if (this.data.has(dataId)) {
            throw new Error("Data buffer is already registered");
        }
        this.data.set(dataId, null);
    };
    MathBackendCPU.prototype.write = function (dataId, values) {
        if (values == null) {
            throw new Error('MathBackendCPU.write(): values can not be null');
        }
        this.throwIfNoData(dataId);
        this.data.set(dataId, values);
    };
    MathBackendCPU.prototype.fromPixels = function (pixels, numChannels) {
        if (pixels == null) {
            throw new Error('pixels passed to tf.fromPixels() can not be null');
        }
        var vals;
        if (environment_1.ENV.get('IS_NODE') && pixels.getContext == null) {
            throw new Error('When running in node, pixels must be an HTMLCanvasElement ' +
                'like the one returned by the `canvas` npm package');
        }
        if (pixels.getContext != null) {
            vals = pixels
                .getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
        }
        else if (pixels instanceof ImageData) {
            vals = pixels.data;
        }
        else if (pixels instanceof HTMLImageElement ||
            pixels instanceof HTMLVideoElement) {
            if (this.canvas == null) {
                throw new Error('Can\'t read pixels from HTMLImageElement outside ' +
                    'the browser.');
            }
            this.canvas.width = pixels.width;
            this.canvas.height = pixels.height;
            this.canvas.getContext('2d').drawImage(pixels, 0, 0, pixels.width, pixels.height);
            vals = this.canvas.getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
        }
        else {
            throw new Error('pixels passed to tf.fromPixels() must be either an ' +
                "HTMLVideoElement, HTMLImageElement, HTMLCanvasElement or " +
                ("ImageData, but was " + pixels.constructor.name));
        }
        var values;
        if (numChannels === 4) {
            values = new Int32Array(vals);
        }
        else {
            var numPixels = pixels.width * pixels.height;
            values = new Int32Array(numPixels * numChannels);
            for (var i = 0; i < numPixels; i++) {
                for (var channel = 0; channel < numChannels; ++channel) {
                    values[i * numChannels + channel] = vals[i * 4 + channel];
                }
            }
        }
        var outShape = [pixels.height, pixels.width, numChannels];
        return ops_1.tensor3d(values, outShape, 'int32');
    };
    MathBackendCPU.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.readSync(dataId)];
            });
        });
    };
    MathBackendCPU.prototype.readSync = function (dataId) {
        this.throwIfNoData(dataId);
        return this.data.get(dataId);
    };
    MathBackendCPU.prototype.disposeData = function (dataId) {
        if (this.data.has(dataId)) {
            this.data.delete(dataId);
        }
    };
    MathBackendCPU.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var start, kernelMs;
            return __generator(this, function (_a) {
                start = util_1.now();
                f();
                kernelMs = util_1.now() - start;
                return [2, { kernelMs: kernelMs }];
            });
        });
    };
    MathBackendCPU.prototype.memory = function () {
        return {
            unreliable: true
        };
    };
    MathBackendCPU.prototype.throwIfNoData = function (dataId) {
        if (!this.data.has(dataId)) {
            throw new Error("CPU backend: No data found for this tensor. " +
                "Did you change your backend in the middle of the program? " +
                "New backends can't use Tensors created with previous backends");
        }
    };
    MathBackendCPU.prototype.slice = function (x, begin, size) {
        var buffer = ops.buffer(size, x.dtype);
        for (var i = 0; i < buffer.size; ++i) {
            var loc = buffer.indexToLoc(i);
            var xLoc = loc.map(function (idx, j) { return idx + begin[j]; });
            buffer.set.apply(buffer, [x.get.apply(x, xLoc)].concat(loc));
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.stridedSlice = function (x, begin, end, strides, beginMask, endMask) {
        var _a = slice_util_1.getStridedSlicedInfo(x.shape, begin, end, strides, beginMask, endMask), beginIndex = _a[0], size = _a[1];
        if (size.some(function (axis) { return axis === 0; })) {
            return ops.tensor([], size);
        }
        var buffer = ops.buffer(size, x.dtype);
        for (var i = 0; i < buffer.size; i++) {
            var loc = buffer.indexToLoc(i);
            var newLoc = new Array(loc.length);
            for (var j = 0; j < newLoc.length; j++) {
                newLoc[j] = loc[j] * strides[j] + beginIndex[j];
            }
            buffer.set.apply(buffer, [x.get.apply(x, newLoc)].concat(loc));
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.reverse = function (x, axis) {
        var buffer = ops.buffer(x.shape, x.dtype);
        var xBuffer = x.buffer();
        var _loop_1 = function (i) {
            var outLoc = buffer.indexToLoc(i);
            var inLoc = outLoc.slice();
            axis.forEach(function (ax) { return inLoc[ax] = x.shape[ax] - 1 - inLoc[ax]; });
            buffer.set.apply(buffer, [xBuffer.get.apply(xBuffer, inLoc)].concat(outLoc));
        };
        for (var i = 0; i < buffer.size; i++) {
            _loop_1(i);
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.concat = function (a, b) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, 1);
        var buffer = ops.buffer(outShape, a.dtype);
        if (a.shape[0] === 1 && b.shape[0] === 1) {
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var vals = buffer.values;
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return buffer.toTensor();
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < a.shape[1]; ++j) {
                buffer.set(a.get(i, j), i, j);
            }
            for (var j = 0; j < b.shape[1]; ++j) {
                buffer.set(b.get(i, j), i, j + a.shape[1]);
            }
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.neg = function (x) {
        return this.multiply(ops.scalar(-1), x);
    };
    MathBackendCPU.prototype.add = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue + bValue; });
    };
    MathBackendCPU.prototype.subtract = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue - bValue; });
    };
    MathBackendCPU.prototype.pow = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aValue, bValue) { return Math.pow(aValue, bValue); });
    };
    MathBackendCPU.prototype.matMul = function (a, b, transposeA, transposeB) {
        var sharedDim = transposeA ? a.shape[0] : a.shape[1];
        var leftDim = transposeA ? a.shape[1] : a.shape[0];
        var rightDim = transposeB ? b.shape[0] : b.shape[1];
        var aValues = a.dataSync();
        var bValues = b.dataSync();
        var _a = transposeA ? [1, a.strides[0]] : [a.strides[0], 1], aOuterStep = _a[0], aInnerStep = _a[1];
        var _b = transposeB ? [b.strides[0], 1] : [1, b.strides[0]], bOuterStep = _b[0], bInnerStep = _b[1];
        var aOuterEnd = leftDim * aOuterStep;
        var bOuterEnd = rightDim * bOuterStep;
        var result = new Float32Array(leftDim * rightDim);
        var resultIndex = 0;
        for (var aOuter = 0; aOuter < aOuterEnd; aOuter += aOuterStep) {
            for (var bOuter = 0; bOuter < bOuterEnd; bOuter += bOuterStep) {
                var aInner = aOuter;
                var bInner = bOuter;
                var sum = 0;
                for (var k = 0; k < sharedDim; ++k) {
                    sum += aValues[aInner] * bValues[bInner];
                    aInner += aInnerStep;
                    bInner += bInnerStep;
                }
                result[resultIndex++] = sum;
            }
        }
        return ops.tensor2d(result, [leftDim, rightDim]);
    };
    MathBackendCPU.prototype.multiply = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue * bValue; });
    };
    MathBackendCPU.prototype.realDivide = function (a, b) {
        var op = function (a, b) { return a / b; };
        var outputDtype = 'float32';
        return this.broadcastedBinaryOp(a, b, outputDtype, op);
    };
    MathBackendCPU.prototype.floorDiv = function (a, b) {
        var op = function (a, b) { return Math.floor(a / b); };
        var outputDtype = 'int32';
        return this.broadcastedBinaryOp(a, b, outputDtype, op);
    };
    MathBackendCPU.prototype.sum = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var resultDtype = types.upcastType(x.dtype, 'int32');
        var result = ops.zeros(outShape, resultDtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var sum = 0;
            for (var j = 0; j < reduceSize; ++j) {
                sum += aVals[offset + j];
            }
            vals[i] = sum;
        }
        return result;
    };
    MathBackendCPU.prototype.unsortedSegmentSum = function (x, segmentIds, numSegments) {
        var res = [];
        var numIters = x.rank - segmentIds.rank;
        for (var i = 0; i < numIters; ++i) {
            segmentIds = segmentIds.expandDims(i + 1);
        }
        for (var i = 0; i < numSegments; ++i) {
            var segmentId = ops.scalar(i, 'int32');
            var mask = ops.equal(segmentId, segmentIds).asType('float32');
            var sum = mask.mul(x).sum(0);
            res.push(sum);
        }
        return ops.stack(res);
    };
    MathBackendCPU.prototype.argMin = function (x, axis) {
        var axes = [axis];
        axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[offset];
            var minIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (value < min) {
                    min = value;
                    minIndex = j;
                }
            }
            vals[i] = minIndex;
        }
        return result;
    };
    MathBackendCPU.prototype.argMax = function (x, axis) {
        var axes = [axis];
        axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            var maxIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (value > max) {
                    max = value;
                    maxIndex = j;
                }
            }
            vals[i] = maxIndex;
        }
        return result;
    };
    MathBackendCPU.prototype.cumsum = function (x, axis, exclusive, reverse) {
        if (axis !== x.rank - 1) {
            throw new Error("backend.cumsum in CPU expects an inner-most axis=" + (x.rank - 1) + " " +
                ("but got axis=" + axis));
        }
        var resultDtype = types.upcastType(x.dtype, 'int32');
        var result = ops.zeros(x.shape, resultDtype);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        var finalDim = x.shape[x.rank - 1];
        var indexAdjuster = reverse ?
            function (i, j) { return i + finalDim - j - 1; } :
            function (i, j) { return i + j; };
        for (var i = 0; i < aVals.length; i += finalDim) {
            for (var j = 0; j < finalDim; j++) {
                var idx = indexAdjuster(i, j);
                if (j === 0) {
                    vals[idx] = exclusive ? 0 : aVals[idx];
                }
                else {
                    var prevIdx = indexAdjuster(i, j - 1);
                    vals[idx] = exclusive ? aVals[prevIdx] + vals[prevIdx] :
                        aVals[idx] + vals[prevIdx];
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.equal = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return (aVal === bVal) ? 1 : 0;
        });
    };
    MathBackendCPU.prototype.notEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return (aVal !== bVal) ? 1 : 0;
        });
    };
    MathBackendCPU.prototype.less = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return (aVal < bVal) ? 1 : 0;
        });
    };
    MathBackendCPU.prototype.lessEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return (aVal <= bVal) ? 1 : 0;
        });
    };
    MathBackendCPU.prototype.greater = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return (aVal > bVal) ? 1 : 0;
        });
    };
    MathBackendCPU.prototype.greaterEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return (aVal >= bVal) ? 1 : 0;
        });
    };
    MathBackendCPU.prototype.logicalNot = function (x) {
        var values = x.dataSync();
        var newValues = new Int32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = values[i] ? 0 : 1;
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues }, 'bool');
    };
    MathBackendCPU.prototype.logicalAnd = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return aVal && bVal;
        });
    };
    MathBackendCPU.prototype.logicalOr = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            return aVal || bVal;
        });
    };
    MathBackendCPU.prototype.where = function (condition, a, b, dtype) {
        var values = condition.dataSync();
        var aValues = a.dataSync();
        var bValues = b.dataSync();
        var result = ops.zeros(a.shape, dtype);
        var newValues = result.dataSync();
        var index = 0;
        var offset = condition.rank === 0 || condition.rank > 1 || a.rank === 1 ?
            1 :
            a.shape[1];
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < offset; j++) {
                if (values[i] === 1) {
                    newValues[index++] = aValues[i];
                }
                else {
                    newValues[index++] = bValues[i];
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.topKValues = function (x, k) {
        return this.topK(x, k).values;
    };
    MathBackendCPU.prototype.topKIndices = function (x, k) {
        return this.topK(x, k).indices;
    };
    MathBackendCPU.prototype.topK = function (x, k) {
        var values = x.dataSync();
        var valuesAndIndices = [];
        for (var i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort(function (a, b) {
            return b.value - a.value;
        });
        var topkValues = util.getTypedArrayFromDType(x.dtype, k);
        var topkIndices = new Int32Array(k);
        for (var i = 0; i < k; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }
        return {
            values: ops.tensor1d(topkValues, x.dtype),
            indices: ops.tensor1d(topkIndices, 'int32')
        };
    };
    MathBackendCPU.prototype.min = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[offset];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (value < min) {
                    min = value;
                }
            }
            vals[i] = min;
        }
        return result;
    };
    MathBackendCPU.prototype.minimum = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.min(aVal, bVal); });
    };
    MathBackendCPU.prototype.mod = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) {
            var rem = aVal % bVal;
            if ((aVal < 0 && bVal < 0) || (aVal >= 0 && bVal >= 0)) {
                return rem;
            }
            else {
                return (rem + bVal) % bVal;
            }
        });
    };
    MathBackendCPU.prototype.max = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (value > max) {
                    max = value;
                }
            }
            vals[i] = max;
        }
        return result;
    };
    MathBackendCPU.prototype.maximum = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.max(aVal, bVal); });
    };
    MathBackendCPU.prototype.all = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('all', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var all = aVals[offset];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                all = all && value;
            }
            vals[i] = all;
        }
        return result;
    };
    MathBackendCPU.prototype.any = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('any', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var anyVal = aVals[offset];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                anyVal = anyVal || value;
            }
            vals[i] = anyVal;
        }
        return result;
    };
    MathBackendCPU.prototype.squaredDifference = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) {
            var diff = aVal - bVal;
            return diff * diff;
        });
    };
    MathBackendCPU.prototype.ceil = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.ceil(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.floor = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.floor(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.sign = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            if (values[i] < 0) {
                newValues[i] = -1;
            }
            else if (values[i] > 0) {
                newValues[i] = 1;
            }
            else {
                newValues[i] = 0;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.round = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var base = Math.floor(values[i]);
            if (values[i] - base < 0.5) {
                newValues[i] = Math.floor(values[i]);
            }
            else if (values[i] - base > 0.5) {
                newValues[i] = Math.ceil(values[i]);
            }
            else {
                if (base % 2.0 === 0.0) {
                    newValues[i] = base;
                }
                else {
                    newValues[i] = base + 1.0;
                }
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.exp = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.exp(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.expm1 = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.expm1(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.log = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log(value);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.log1p = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log1p(value);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.sqrt = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.sqrt(value);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.rsqrt = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = 1 / Math.sqrt(value);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.square = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = value * value;
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.reciprocal = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = 1 / values[i];
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.relu = function (x) {
        var res = ops.zeros(x.shape, x.dtype);
        var resVals = res.dataSync();
        var inVals = x.dataSync();
        for (var i = 0; i < inVals.length; ++i) {
            resVals[i] = Math.max(0, inVals[i]);
        }
        return res;
    };
    MathBackendCPU.prototype.elu = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = (Math.exp(v) - 1);
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.eluDer = function (dy, y) {
        var resultValues = new Float32Array(y.size);
        var values = y.dataSync();
        var dyValues = dy.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 1) {
                resultValues[i] = dyValues[i];
            }
            else {
                resultValues[i] = dyValues[i] * (v + 1);
            }
        }
        return tensor_1.Tensor.make(y.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.selu = function (x) {
        var scaleAlpha = selu_util.SELU_SCALEALPHA;
        var scale = selu_util.SELU_SCALE;
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = scale * v;
            }
            else {
                resultValues[i] = scaleAlpha * (Math.exp(v) - 1);
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.clip = function (x, min, max) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.min(max, Math.max(min, values[i]));
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.abs = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.abs(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.int = function (x) {
        var resultValues = new Int32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = values[i];
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues }, 'int32');
    };
    MathBackendCPU.prototype.sigmoid = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = 1 / (1 + Math.exp(-values[i]));
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.softplus = function (x) {
        var epsilon = 1.1920928955078125e-7;
        var threshold = Math.log(epsilon) + 2.0;
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var tooLarge = values[i] > -threshold;
            var tooSmall = values[i] < threshold;
            var expX = Math.exp(values[i]);
            var result = void 0;
            if (tooSmall) {
                result = expX;
            }
            else if (tooLarge) {
                result = values[i];
            }
            else {
                result = Math.log(1.0 + expX);
            }
            resultValues[i] = result;
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.sin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sin(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cos(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.tan(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.asin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asin(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.acos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acos(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atan(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atan2 = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aValue, bValue) { return Math.atan2(aValue, bValue); });
    };
    MathBackendCPU.prototype.sinh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sinh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cosh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cosh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tanh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = util.tanh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.asinh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asinh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.acosh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acosh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atanh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atanh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.erf = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var p = erf_util.ERF_P;
        var a1 = erf_util.ERF_A1;
        var a2 = erf_util.ERF_A2;
        var a3 = erf_util.ERF_A3;
        var a4 = erf_util.ERF_A4;
        var a5 = erf_util.ERF_A5;
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            var t = 1.0 / (1.0 + p * v);
            resultValues[i] = 1.0 -
                (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t *
                    Math.exp(-v * v);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0; }
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            if (isNaN(value)) {
                resultValues[i] = NaN;
            }
            else {
                resultValues[i] = value > 0 ? 1 : alpha;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.conv2d = function (x, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var dilationHeight = convInfo.dilationHeight;
        var dilationWidth = convInfo.dilationWidth;
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var y = ops.buffer(convInfo.outShape, x.dtype);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * convInfo.strideWidth - padTop;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; wR++) {
                            var xR = xRCorner + wR * dilationHeight;
                            if (xR < 0 || xR >= convInfo.inHeight) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; wC++) {
                                var xC = xCCorner + wC * dilationWidth;
                                if (xC < 0 || xC >= convInfo.inWidth) {
                                    continue;
                                }
                                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                                    var pixel = x.get(b, xR, xC, d1);
                                    var weight = filter.get(wR, wC, d1, d2);
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        y.set(dotProd, b, yR, yC, d2);
                    }
                }
            }
        }
        return y.toTensor();
    };
    MathBackendCPU.prototype.conv2dDerInput = function (dy, filter, convInfo) {
        var dx = ops.buffer(convInfo.inShape, 'float32');
        var dxValues = dx.values;
        var _a = dx.strides, dxS0 = _a[0], dxS1 = _a[1], dxS2 = _a[2];
        var dyValues = dy.dataSync();
        var _b = dy.strides, dyS0 = _b[0], dyS1 = _b[1], dyS2 = _b[2];
        var fltValues = filter.dataSync();
        var _c = filter.strides, fltS0 = _c[0], fltS1 = _c[1], fltS2 = _c[2];
        var batchSize = convInfo.batchSize, filterHeight = convInfo.filterHeight, filterWidth = convInfo.filterWidth, inChannels = convInfo.inChannels, inHeight = convInfo.inHeight, inWidth = convInfo.inWidth, outChannels = convInfo.outChannels, outHeight = convInfo.outHeight, outWidth = convInfo.outWidth, strideHeight = convInfo.strideHeight, strideWidth = convInfo.strideWidth;
        var topPad = filterHeight - 1 - convInfo.padInfo.top;
        var leftPad = filterWidth - 1 - convInfo.padInfo.left;
        for (var b = 0; b < batchSize; ++b) {
            for (var d1 = 0; d1 < inChannels; ++d1) {
                for (var xR = 0; xR < inHeight; ++xR) {
                    var xRCorner = xR - topPad;
                    var xRMin = Math.max(0, Math.ceil(xRCorner / strideHeight));
                    var yRMax = Math.min(outHeight, (filterHeight + xRCorner) / strideHeight);
                    for (var xC = 0; xC < inWidth; ++xC) {
                        var xCCorner = xC - leftPad;
                        var xCMin = Math.max(0, Math.ceil(xCCorner / strideWidth));
                        var yCMax = Math.min(outWidth, (filterWidth + xCCorner) / strideWidth);
                        var dotProd = 0;
                        for (var yR = xRMin; yR < yRMax; ++yR) {
                            var wR = yR * strideHeight - xRCorner;
                            for (var yC = xCMin; yC < yCMax; ++yC) {
                                var wC = yC * strideWidth - xCCorner;
                                var dyOffset = dyS0 * b + dyS1 * yR + dyS2 * yC;
                                var fltOffset = fltS0 * (filterHeight - 1 - wR) +
                                    fltS1 * (filterWidth - 1 - wC) + fltS2 * d1;
                                for (var d2 = 0; d2 < outChannels; ++d2) {
                                    var pixel = dyValues[dyOffset + d2];
                                    var weight = fltValues[fltOffset + d2];
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        dxValues[dxS0 * b + dxS1 * xR + dxS2 * xC + d1] = dotProd;
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.conv2dDerFilter = function (x, dy, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var dW = ops.buffer(convInfo.filterShape, 'float32');
        var leftPad = convInfo.padInfo.left;
        var topPad = convInfo.padInfo.top;
        for (var wR = 0; wR < filterHeight; ++wR) {
            var yRMin = Math.max(0, Math.ceil((topPad - wR) / strideHeight));
            var yRMax = Math.min(convInfo.outHeight, (convInfo.inHeight + topPad - wR) / strideHeight);
            for (var wC = 0; wC < filterWidth; ++wC) {
                var yCMin = Math.max(0, Math.ceil((leftPad - wC) / strideWidth));
                var yCMax = Math.min(convInfo.outWidth, (convInfo.inWidth + leftPad - wC) / strideWidth);
                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                    for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                        var dotProd = 0;
                        for (var b = 0; b < convInfo.batchSize; ++b) {
                            for (var yR = yRMin; yR < yRMax; ++yR) {
                                var xR = wR + yR * strideHeight - topPad;
                                for (var yC = yCMin; yC < yCMax; ++yC) {
                                    var xC = wC + yC * strideWidth - leftPad;
                                    dotProd += x.get(b, xR, xC, d1) * dy.get(b, yR, yC, d2);
                                }
                            }
                        }
                        dW.set(dotProd, wR, wC, d1, d2);
                    }
                }
            }
        }
        return dW.toTensor();
    };
    MathBackendCPU.prototype.depthwiseConv2D = function (x, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var dilationHeight = convInfo.dilationHeight;
        var dilationWidth = convInfo.dilationWidth;
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var chMul = convInfo.outChannels / convInfo.inChannels;
        var y = ops.buffer(convInfo.outShape, x.dtype);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * convInfo.strideWidth - padTop;
                        for (var q = 0; q < chMul; ++q) {
                            var dotProd = 0;
                            for (var wR = 0; wR < filterHeight; ++wR) {
                                var xR = xRCorner + wR * dilationHeight;
                                if (xR < 0 || xR >= convInfo.inHeight) {
                                    continue;
                                }
                                for (var wC = 0; wC < filterWidth; ++wC) {
                                    var xC = xCCorner + wC * dilationWidth;
                                    if (xC < 0 || xC >= convInfo.inWidth) {
                                        continue;
                                    }
                                    var pixel = x.get(b, xR, xC, d1);
                                    var weight = filter.get(wR, wC, d1, q);
                                    dotProd += pixel * weight;
                                }
                            }
                            y.set(dotProd, b, yR, yC, d1 * chMul + q);
                        }
                    }
                }
            }
        }
        return y.toTensor();
    };
    MathBackendCPU.prototype.depthwiseConv2DDerInput = function (dy, filter, convInfo) {
        var dx = ops.buffer(convInfo.inShape, 'float32');
        var dxValues = dx.values;
        var _a = dx.strides, dxS0 = _a[0], dxS1 = _a[1], dxS2 = _a[2];
        var dyValues = dy.dataSync();
        var _b = dy.strides, dyS0 = _b[0], dyS1 = _b[1], dyS2 = _b[2];
        var fltValues = filter.dataSync();
        var _c = filter.strides, fltS0 = _c[0], fltS1 = _c[1], fltS2 = _c[2];
        var batchSize = convInfo.batchSize, filterHeight = convInfo.filterHeight, filterWidth = convInfo.filterWidth, inChannels = convInfo.inChannels, inHeight = convInfo.inHeight, inWidth = convInfo.inWidth, outChannels = convInfo.outChannels, outHeight = convInfo.outHeight, outWidth = convInfo.outWidth, strideHeight = convInfo.strideHeight, strideWidth = convInfo.strideWidth;
        var topPad = filterHeight - 1 - convInfo.padInfo.top;
        var leftPad = filterWidth - 1 - convInfo.padInfo.left;
        var chMul = outChannels / inChannels;
        for (var b = 0; b < batchSize; ++b) {
            for (var d1 = 0; d1 < inChannels; ++d1) {
                for (var xR = 0; xR < inHeight; ++xR) {
                    var xRCorner = xR - topPad;
                    var xRMin = Math.max(0, Math.ceil(xRCorner / strideHeight));
                    var yRMax = Math.min(outHeight, (filterHeight + xRCorner) / strideHeight);
                    for (var xC = 0; xC < inWidth; ++xC) {
                        var xCCorner = xC - leftPad;
                        var xCMin = Math.max(0, Math.ceil(xCCorner / strideWidth));
                        var yCMax = Math.min(outWidth, (filterWidth + xCCorner) / strideWidth);
                        var dotProd = 0;
                        for (var yR = xRMin; yR < yRMax; ++yR) {
                            var wR = yR * strideHeight - xRCorner;
                            for (var yC = xCMin; yC < yCMax; ++yC) {
                                var wC = yC * strideWidth - xCCorner;
                                var dyOffset = dyS0 * b + dyS1 * yR + dyS2 * yC;
                                var fltOffset = fltS0 * (filterHeight - 1 - wR) +
                                    fltS1 * (filterWidth - 1 - wC) + fltS2 * d1;
                                for (var dm = 0; dm < chMul; ++dm) {
                                    var d2 = d1 * chMul + dm;
                                    var pixel = dyValues[dyOffset + d2];
                                    var weight = fltValues[fltOffset + dm];
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        dxValues[dxS0 * b + dxS1 * xR + dxS2 * xC + d1] = dotProd;
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.depthwiseConv2DDerFilter = function (x, dy, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var dW = ops.buffer(convInfo.filterShape, 'float32');
        var leftPad = convInfo.padInfo.left;
        var topPad = convInfo.padInfo.top;
        var chMul = convInfo.outChannels / convInfo.inChannels;
        for (var wR = 0; wR < filterHeight; ++wR) {
            var yRMin = Math.max(0, Math.ceil((topPad - wR) / strideHeight));
            var yRMax = Math.min(convInfo.outHeight, (convInfo.inHeight + topPad - wR) / strideHeight);
            for (var wC = 0; wC < filterWidth; ++wC) {
                var yCMin = Math.max(0, Math.ceil((leftPad - wC) / strideWidth));
                var yCMax = Math.min(convInfo.outWidth, (convInfo.inWidth + leftPad - wC) / strideWidth);
                for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                    var d1 = Math.trunc(d2 / chMul);
                    var dm = d2 % chMul;
                    var dotProd = 0;
                    for (var b = 0; b < convInfo.batchSize; ++b) {
                        for (var yR = yRMin; yR < yRMax; ++yR) {
                            var xR = wR + yR * strideHeight - topPad;
                            for (var yC = yCMin; yC < yCMax; ++yC) {
                                var xC = wC + yC * strideWidth - leftPad;
                                dotProd += x.get(b, xR, xC, d1) * dy.get(b, yR, yC, d2);
                            }
                        }
                    }
                    dW.set(dotProd, wR, wC, d1, dm);
                }
            }
        }
        return dW.toTensor();
    };
    MathBackendCPU.prototype.tile = function (x, reps) {
        var newShape = new Array(x.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = x.shape[i] * reps[i];
        }
        var result = ops.buffer(newShape, x.dtype);
        var xBuf = x.buffer();
        for (var i = 0; i < result.values.length; ++i) {
            var newLoc = result.indexToLoc(i);
            var originalLoc = new Array(x.rank);
            for (var i_1 = 0; i_1 < originalLoc.length; i_1++) {
                originalLoc[i_1] = newLoc[i_1] % x.shape[i_1];
            }
            var originalIndex = xBuf.locToIndex(originalLoc);
            result.values[i] = xBuf.values[originalIndex];
        }
        return result.toTensor();
    };
    MathBackendCPU.prototype.pad = function (x, paddings, constantValue) {
        var outShape = paddings.map(function (p, i) { return p[0] + x.shape[i] + p[1]; });
        var start = paddings.map(function (p) { return p[0]; });
        var xBuffer = x.buffer();
        var buffer = ops.buffer(outShape, x.dtype);
        if (constantValue !== 0) {
            buffer.values.fill(constantValue);
        }
        for (var i = 0; i < x.size; i++) {
            var coords = xBuffer.indexToLoc(i);
            var outCoords = coords.map(function (c, i) { return c + start[i]; });
            buffer.set.apply(buffer, [x.get.apply(x, coords)].concat(outCoords));
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.transpose = function (x, perm) {
        var newShape = new Array(x.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = x.shape[perm[i]];
        }
        var values = x.dataSync();
        var result = ops_1.buffer(newShape, x.dtype);
        var xBuf = x.buffer();
        for (var i = 0; i < x.size; ++i) {
            var loc = xBuf.indexToLoc(i);
            var newLoc = new Array(loc.length);
            for (var i_2 = 0; i_2 < newLoc.length; i_2++) {
                newLoc[i_2] = loc[perm[i_2]];
            }
            var newIndex = result.locToIndex(newLoc);
            result.values[newIndex] = values[i];
        }
        return result.toTensor();
    };
    MathBackendCPU.prototype.gather = function (x, indices, axis) {
        var newShape = x.shape.slice();
        var indicesValues = indices.dataSync();
        newShape[axis] = indicesValues.length;
        var result = ops_1.buffer(newShape, x.dtype);
        var xBuf = x.buffer();
        for (var i = 0; i < result.size; ++i) {
            var newLoc = result.indexToLoc(i);
            var originalLoc = newLoc.slice();
            originalLoc[axis] = indicesValues[newLoc[axis]];
            var originalIndex = xBuf.locToIndex(originalLoc);
            result.values[i] = xBuf.values[originalIndex];
        }
        return result.toTensor();
    };
    MathBackendCPU.prototype.pool = function (x, convInfo, poolType) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var y = ops.buffer(convInfo.outShape, 'float32');
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * strideHeight - padTop;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * strideWidth - padLeft;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var minMaxValue = (poolType === 'max' ? Number.NEGATIVE_INFINITY :
                            Number.POSITIVE_INFINITY);
                        var avgValue = 0;
                        var count = 0;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var pixel = x.get(b, xR, xC, d);
                                if ((poolType === 'max' && pixel > minMaxValue)) {
                                    minMaxValue = pixel;
                                }
                                else if (poolType === 'avg') {
                                    avgValue += pixel;
                                    count++;
                                }
                            }
                            if (isNaN(minMaxValue)) {
                                break;
                            }
                        }
                        y.set(poolType === 'avg' ? avgValue / count : minMaxValue, b, yR, yC, d);
                    }
                }
            }
        }
        return y.toTensor();
    };
    MathBackendCPU.prototype.maxPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'max');
    };
    MathBackendCPU.prototype.maxPoolPositions = function (x, convInfo) {
        var maxPositions = ops.buffer(convInfo.outShape, 'int32');
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * strideHeight - padTop;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * strideWidth - padLeft;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var maxValue = Number.NEGATIVE_INFINITY;
                        var maxPosition = -1;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            var wR = xR - xRCorner;
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var wC = xC - xCCorner;
                                var pixel = x.get(b, xR, xC, d);
                                if (pixel > maxValue) {
                                    maxValue = pixel;
                                    maxPosition = wR * filterWidth + wC;
                                }
                            }
                        }
                        maxPositions.set(maxPosition, b, yR, yC, d);
                    }
                }
            }
        }
        return maxPositions.toTensor();
    };
    MathBackendCPU.prototype.maxPoolBackprop = function (dy, x, y, convInfo) {
        var maxPositions = this.maxPoolPositions(x, convInfo);
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var dx = ops.buffer(x.shape, 'float32');
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                    for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                        var dyRCorner = dxR - padTop;
                        var dyCCorner = dxC - padLeft;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; ++wR) {
                            var dyR = (dyRCorner + wR) / strideHeight;
                            if (dyR < 0 || dyR >= convInfo.outHeight ||
                                Math.floor(dyR) !== dyR) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var dyC = (dyCCorner + wC) / strideWidth;
                                if (dyC < 0 || dyC >= convInfo.outWidth ||
                                    Math.floor(dyC) !== dyC) {
                                    continue;
                                }
                                var maxPos = filterHeight * filterWidth - 1 -
                                    maxPositions.get(b, dyR, dyC, d);
                                var curPos = wR * filterWidth + wC;
                                var mask = maxPos === curPos ? 1 : 0;
                                if (mask === 0) {
                                    continue;
                                }
                                var pixel = dy.get(b, dyR, dyC, d);
                                dotProd += pixel * mask;
                            }
                        }
                        dx.set(dotProd, b, dxR, dxC, d);
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.avgPoolBackprop = function (dy, x, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var dx = ops.buffer(x.shape, 'float32');
        var avgMultiplier = 1 / (filterHeight * filterWidth);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                    for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                        var dyRCorner = dxR - padTop;
                        var dyCCorner = dxC - padLeft;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; ++wR) {
                            var dyR = (dyRCorner + wR) / strideHeight;
                            if (dyR < 0 || dyR >= convInfo.outHeight ||
                                Math.floor(dyR) !== dyR) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var dyC = (dyCCorner + wC) / strideWidth;
                                if (dyC < 0 || dyC >= convInfo.outWidth ||
                                    Math.floor(dyC) !== dyC) {
                                    continue;
                                }
                                var pixel = dy.get(b, dyR, dyC, d);
                                dotProd += pixel;
                            }
                        }
                        dx.set(dotProd * avgMultiplier, b, dxR, dxC, d);
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.cast = function (x, dtype) {
        return backend_util.castTensor(x, dtype, this);
    };
    MathBackendCPU.prototype.reshape = function (x, shape) {
        return backend_util.reshapeTensor(x, shape);
    };
    MathBackendCPU.prototype.avgPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'avg').toFloat();
    };
    MathBackendCPU.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
        var _a = x.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
        var output = ops.buffer([batch, newHeight, newWidth, numChannels], x.dtype);
        var effectiveInputSize = [
            (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
            (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
        ];
        var effectiveOutputSize = [
            (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
            (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
        ];
        for (var b = 0; b < batch; b++) {
            for (var r = 0; r < newHeight; r++) {
                for (var c = 0; c < newWidth; c++) {
                    for (var d = 0; d < numChannels; d++) {
                        var sourceFracRow = (effectiveInputSize[0]) * r / (effectiveOutputSize[0]);
                        var sourceFracCol = (effectiveInputSize[1]) * c / (effectiveOutputSize[1]);
                        var sourceRowFloor = Math.floor(sourceFracRow);
                        var sourceRowCeil = Math.min(oldHeight - 1, Math.ceil(sourceFracRow));
                        var sourceColFloor = Math.floor(sourceFracCol);
                        var sourceColCeil = Math.min(oldWidth - 1, Math.ceil(sourceFracCol));
                        var topLeft = x.get(b, sourceRowFloor, sourceColFloor, d);
                        var bottomLeft = x.get(b, sourceRowCeil, sourceColFloor, d);
                        var topRight = x.get(b, sourceRowFloor, sourceColCeil, d);
                        var bottomRight = x.get(b, sourceRowCeil, sourceColCeil, d);
                        var rowFrac = sourceFracRow - sourceRowFloor;
                        var colFrac = sourceFracCol - sourceColFloor;
                        var top_1 = topLeft + (topRight - topLeft) * colFrac;
                        var bottom = bottomLeft + (bottomRight - bottomLeft) * colFrac;
                        var newValue = top_1 + (bottom - top_1) * rowFrac;
                        output.set(newValue, b, r, c, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.resizeBilinearBackprop = function (dy, x, alignCorners) {
        var _a = x.shape, batch = _a[0], xHeight = _a[1], xWidth = _a[2], depth = _a[3];
        var _b = dy.shape, yHeight = _b[1], yWidth = _b[2];
        var output = ops.buffer([batch, xHeight, xWidth, depth], x.dtype);
        var effectiveXSize = [
            (alignCorners && yHeight > 1) ? xHeight - 1 : xHeight,
            (alignCorners && yWidth > 1) ? xWidth - 1 : xWidth
        ];
        var effectiveYSize = [
            (alignCorners && yHeight > 1) ? yHeight - 1 : yHeight,
            (alignCorners && yWidth > 1) ? yWidth - 1 : yWidth
        ];
        var heightScale = effectiveXSize[0] / effectiveYSize[0];
        var widthScale = effectiveXSize[1] / effectiveYSize[1];
        for (var b = 0; b < batch; b++) {
            for (var r = 0; r < yHeight; r++) {
                var dxR = r * heightScale;
                var topDxRIndex = Math.floor(dxR);
                var bottomDxRIndex = Math.min(Math.ceil(dxR), xHeight - 1);
                var dxRLerp = dxR - topDxRIndex;
                var inverseDxRLerp = 1.0 - dxRLerp;
                for (var c = 0; c < yWidth; c++) {
                    var dxC = c * widthScale;
                    var leftDxCIndex = Math.floor(dxC);
                    var rightDxCIndex = Math.min(Math.ceil(dxC), xWidth - 1);
                    var dxCLerp = dxC - leftDxCIndex;
                    var inverseDxCLerp = 1.0 - dxCLerp;
                    for (var d = 0; d < depth; d++) {
                        var dyVal = dy.get(b, r, c, d);
                        var topLeft = output.get(b, topDxRIndex, leftDxCIndex, d);
                        topLeft += dyVal * inverseDxRLerp * inverseDxCLerp;
                        output.set(topLeft, b, topDxRIndex, leftDxCIndex, d);
                        var topRight = output.get(b, topDxRIndex, rightDxCIndex, d);
                        topRight += dyVal * inverseDxRLerp * dxCLerp;
                        output.set(topRight, b, topDxRIndex, rightDxCIndex, d);
                        var bottomLeft = output.get(b, bottomDxRIndex, leftDxCIndex, d);
                        bottomLeft += dyVal * dxRLerp * inverseDxCLerp;
                        output.set(bottomLeft, b, bottomDxRIndex, leftDxCIndex, d);
                        var bottomRight = output.get(b, bottomDxRIndex, rightDxCIndex, d);
                        bottomRight += dyVal * dxRLerp * dxCLerp;
                        output.set(bottomRight, b, bottomDxRIndex, rightDxCIndex, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.resizeNearestNeighbor = function (x, newHeight, newWidth, alignCorners) {
        var _a = x.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
        var output = ops.buffer([batch, newHeight, newWidth, numChannels], x.dtype);
        var effectiveInputSize = [
            (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
            (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
        ];
        var effectiveOutputSize = [
            (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
            (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
        ];
        for (var b = 0; b < batch; b++) {
            for (var r = 0; r < newHeight; r++) {
                for (var c = 0; c < newWidth; c++) {
                    for (var d = 0; d < numChannels; d++) {
                        var sourceFracRow = (effectiveInputSize[0]) * r / (effectiveOutputSize[0]);
                        var sourceFracCol = (effectiveInputSize[1]) * c / (effectiveOutputSize[1]);
                        var sourceNearestRow = Math.min(oldHeight - 1, alignCorners ? Math.round(sourceFracRow) :
                            Math.floor(sourceFracRow));
                        var sourceNearestCol = Math.min(oldWidth - 1, alignCorners ? Math.round(sourceFracCol) :
                            Math.floor(sourceFracCol));
                        var newValue = x.get(b, sourceNearestRow, sourceNearestCol, d);
                        output.set(newValue, b, r, c, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.resizeNearestNeighborBackprop = function (dy, x, alignCorners) {
        var _a = x.shape, batch = _a[0], xHeight = _a[1], xWidth = _a[2], depth = _a[3];
        var _b = dy.shape, yHeight = _b[1], yWidth = _b[2];
        var output = ops.buffer([batch, xHeight, xWidth, depth], x.dtype);
        var effectiveXSize = [
            (alignCorners && yHeight > 1) ? xHeight - 1 : xHeight,
            (alignCorners && yWidth > 1) ? xWidth - 1 : xWidth
        ];
        var effectiveYSize = [
            (alignCorners && yHeight > 1) ? yHeight - 1 : yHeight,
            (alignCorners && yWidth > 1) ? yWidth - 1 : yWidth
        ];
        var heightScale = effectiveXSize[0] / effectiveYSize[0];
        var widthScale = effectiveXSize[1] / effectiveYSize[1];
        var invHeightScale = 1 / heightScale;
        var invWidthScale = 1 / widthScale;
        var winHeight = (Math.ceil(invHeightScale) * 2) + 2;
        var winWidth = (Math.ceil(invWidthScale) * 2) + 2;
        for (var b = 0; b < batch; b++) {
            for (var r = 0; r < xHeight; r++) {
                for (var c = 0; c < xWidth; c++) {
                    var startRLerp = Math.floor(r * invHeightScale);
                    var startDyR = Math.floor(startRLerp - (winHeight / 2));
                    var startCLerp = Math.floor(c * invWidthScale);
                    var startDyC = Math.floor(startCLerp - (winWidth / 2));
                    for (var d = 0; d < depth; d++) {
                        var accum = 0;
                        for (var dyROffset = 0; dyROffset < winHeight; dyROffset++) {
                            var dyR = dyROffset + startDyR;
                            if (dyR < 0 || dyR >= yHeight) {
                                continue;
                            }
                            for (var dyCOffSet = 0; dyCOffSet < winWidth; dyCOffSet++) {
                                var dyC = dyCOffSet + startDyC;
                                if (dyC < 0 || dyC >= yWidth) {
                                    continue;
                                }
                                var sourceFracRow = effectiveXSize[0] * (dyR / effectiveYSize[0]);
                                var sourceFracCol = effectiveXSize[1] * (dyC / effectiveYSize[1]);
                                var sourceNearestRow = Math.min(xHeight - 1, alignCorners ? Math.round(sourceFracRow) :
                                    Math.floor(sourceFracRow));
                                var sourceNearestCol = Math.min(xWidth - 1, alignCorners ? Math.round(sourceFracCol) :
                                    Math.floor(sourceFracCol));
                                if (r === sourceNearestRow && c === sourceNearestCol) {
                                    accum += dy.get(b, dyR, dyC, d);
                                }
                            }
                        }
                        output.set(accum, b, r, c, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var xValues = x.dataSync();
        var meanValues = mean.dataSync();
        var varianceValues = variance.dataSync();
        var scaleValues = scale ? scale.dataSync() : new Float32Array([1]);
        var offsetValues = offset ? offset.dataSync() : new Float32Array([0]);
        var outValues = new Float32Array(xValues.length);
        for (var i = 0; i < xValues.length; i++) {
            outValues[i] = offsetValues[i % offsetValues.length] +
                (xValues[i] - meanValues[i % meanValues.length]) *
                    scaleValues[i % scaleValues.length] /
                    Math.sqrt(varianceValues[i % varianceValues.length] + varianceEpsilon);
        }
        return ops_1.tensor4d(outValues, x.shape);
    };
    MathBackendCPU.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta) {
        var output = ops.buffer(x.shape, 'float32');
        var rad = radius;
        var maxD = output.shape[3] - 1;
        function sumAcrossChannels(b, r, c, d) {
            var sum = 0.0;
            for (var j = Math.max(0, d - rad); j <= Math.min(d + rad, maxD); j++) {
                var z = x.get(b, r, c, j);
                sum += z * z;
            }
            return sum;
        }
        for (var b = 0; b < output.shape[0]; b++) {
            for (var r = 0; r <= output.shape[1]; r++) {
                for (var c = 0; c < output.shape[2]; c++) {
                    for (var d = 0; d < output.shape[3]; d++) {
                        var sum = sumAcrossChannels(b, r, c, d);
                        var val = x.get(b, r, c, d) * Math.pow(bias + alpha * sum, -beta);
                        output.set(val, b, r, c, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.multinomial = function (logits, normalized, numSamples, seed) {
        var probabilities = normalized ? logits : ops.softmax(logits);
        var batchSize = probabilities.shape[0];
        var numEvents = probabilities.shape[1];
        var res = ops.zeros([batchSize, numSamples], 'int32');
        var resVals = res.dataSync();
        var probVals = probabilities.dataSync();
        for (var b = 0; b < batchSize; ++b) {
            var offset = b * numEvents;
            var cdf = new Float32Array(numEvents - 1);
            cdf[0] = probVals[offset];
            for (var event_1 = 1; event_1 < cdf.length; ++event_1) {
                cdf[event_1] = cdf[event_1 - 1] + probVals[offset + event_1];
            }
            var random = seedrandom.alea(seed.toString());
            var outOffset = b * numSamples;
            for (var sampleId = 0; sampleId < numSamples; ++sampleId) {
                var r = random();
                resVals[outOffset + sampleId] = cdf.length;
                for (var event_2 = 0; event_2 < cdf.length; event_2++) {
                    if (r < cdf[event_2]) {
                        resVals[outOffset + sampleId] = event_2;
                        break;
                    }
                }
            }
        }
        return res;
    };
    MathBackendCPU.prototype.oneHot = function (indices, depth, onValue, offValue) {
        var res = new Float32Array(indices.size * depth);
        res.fill(offValue);
        for (var event_3 = 0; event_3 < indices.size; ++event_3) {
            if (indices.get(event_3) >= 0 && indices.get(event_3) < depth) {
                res[event_3 * depth + indices.get(event_3)] = onValue;
            }
        }
        return ops.tensor2d(res, [indices.size, depth], 'int32');
    };
    MathBackendCPU.prototype.broadcastedBinaryOp = function (a, b, dtype, op) {
        var newShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var result = ops.buffer(newShape, dtype);
        var aValues = a.dataSync();
        var bValues = b.dataSync();
        var aBroadcastDims = broadcast_util.getBroadcastDims(a.shape, newShape);
        var bBroadcastDims = broadcast_util.getBroadcastDims(b.shape, newShape);
        var aBuf = a.buffer();
        var bBuf = b.buffer();
        var _loop_2 = function (i) {
            var loc = result.indexToLoc(i);
            var aLoc = loc.slice(-a.rank);
            aBroadcastDims.forEach(function (d) { return aLoc[d] = 0; });
            var aIndex = aBuf.locToIndex(aLoc);
            var bLoc = loc.slice(-b.rank);
            bBroadcastDims.forEach(function (d) { return bLoc[d] = 0; });
            var bIndex = bBuf.locToIndex(bLoc);
            result.values[i] = op(aValues[aIndex], bValues[bIndex]);
        };
        for (var i = 0; i < result.values.length; ++i) {
            _loop_2(i);
        }
        return result.toTensor();
    };
    MathBackendCPU.prototype.dispose = function () { };
    return MathBackendCPU;
}());
exports.MathBackendCPU = MathBackendCPU;
environment_1.ENV.registerBackend('cpu', function () { return new MathBackendCPU(); }, 1, tensor_1.setTensorTracker);

},{"../environment":13,"../ops/axis_util":74,"../ops/broadcast_util":77,"../ops/concat_util":80,"../ops/erf_util":83,"../ops/ops":94,"../ops/selu_util":103,"../ops/slice_util":106,"../tensor":125,"../types":130,"../util":131,"./backend_util":30,"seedrandom":134}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_ops_1 = require("../ops/tensor_ops");
var tensor_1 = require("../tensor");
var util_1 = require("../util");
function castTensor(x, dtype, backend) {
    if (!util_1.hasEncodingLoss(x.dtype, dtype)) {
        return tensor_1.Tensor.make(x.shape, { dataId: x.dataId }, dtype);
    }
    if (dtype === 'int32') {
        return backend.int(x);
    }
    else if (dtype === 'bool') {
        return backend.notEqual(x, tensor_ops_1.scalar(0, x.dtype));
    }
    else {
        throw new Error("Error in Cast: unknown dtype argument (" + dtype + ")");
    }
}
exports.castTensor = castTensor;
function reshapeTensor(x, shape) {
    return tensor_1.Tensor.make(shape, { dataId: x.dataId }, x.dtype);
}
exports.reshapeTensor = reshapeTensor;

},{"../ops/tensor_ops":109,"../tensor":125,"../util":131}],31:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var axis_util = require("../ops/axis_util");
var ops = require("../ops/ops");
var reduce_util = require("../ops/reduce_util");
var segment_util = require("../ops/segment_util");
var slice_util_1 = require("../ops/slice_util");
var tensor_1 = require("../tensor");
var types = require("../types");
var util = require("../util");
var backend_util = require("./backend_util");
var argminmax_gpu_1 = require("./webgl/argminmax_gpu");
var avg_pool_backprop_gpu_1 = require("./webgl/avg_pool_backprop_gpu");
var batchnorm_gpu_1 = require("./webgl/batchnorm_gpu");
var binaryop_gpu = require("./webgl/binaryop_gpu");
var binaryop_gpu_1 = require("./webgl/binaryop_gpu");
var clip_gpu_1 = require("./webgl/clip_gpu");
var concat_gpu_1 = require("./webgl/concat_gpu");
var conv_backprop_gpu_1 = require("./webgl/conv_backprop_gpu");
var conv_backprop_gpu_depthwise_1 = require("./webgl/conv_backprop_gpu_depthwise");
var conv_gpu_1 = require("./webgl/conv_gpu");
var conv_gpu_depthwise_1 = require("./webgl/conv_gpu_depthwise");
var cumsum_gpu_1 = require("./webgl/cumsum_gpu");
var encode_float_gpu_1 = require("./webgl/encode_float_gpu");
var from_pixels_gpu_1 = require("./webgl/from_pixels_gpu");
var gather_gpu_1 = require("./webgl/gather_gpu");
var gpgpu_context_1 = require("./webgl/gpgpu_context");
var gpgpu_math = require("./webgl/gpgpu_math");
var gpgpu_util = require("./webgl/gpgpu_util");
var logical_gpu_1 = require("./webgl/logical_gpu");
var lrn_gpu_1 = require("./webgl/lrn_gpu");
var max_pool_backprop_gpu_1 = require("./webgl/max_pool_backprop_gpu");
var mulmat_gpu_1 = require("./webgl/mulmat_gpu");
var multinomial_gpu_1 = require("./webgl/multinomial_gpu");
var onehot_gpu_1 = require("./webgl/onehot_gpu");
var pad_gpu_1 = require("./webgl/pad_gpu");
var pool_gpu_1 = require("./webgl/pool_gpu");
var reduce_gpu_1 = require("./webgl/reduce_gpu");
var resize_bilinear_backprop_gpu_1 = require("./webgl/resize_bilinear_backprop_gpu");
var resize_bilinear_gpu_1 = require("./webgl/resize_bilinear_gpu");
var resize_nearest_neighbor_backprop_gpu_1 = require("./webgl/resize_nearest_neighbor_backprop_gpu");
var resize_nearest_neighbor_gpu_1 = require("./webgl/resize_nearest_neighbor_gpu");
var reverse_gpu_1 = require("./webgl/reverse_gpu");
var segment_gpu_1 = require("./webgl/segment_gpu");
var slice_gpu_1 = require("./webgl/slice_gpu");
var strided_slice_gpu_1 = require("./webgl/strided_slice_gpu");
var tex_util_1 = require("./webgl/tex_util");
var texture_manager_1 = require("./webgl/texture_manager");
var tile_gpu_1 = require("./webgl/tile_gpu");
var transpose_gpu_1 = require("./webgl/transpose_gpu");
var unary_op = require("./webgl/unaryop_gpu");
var unaryop_gpu_1 = require("./webgl/unaryop_gpu");
var webgl_util = require("./webgl/webgl_util");
var BEFORE_PAGING_CONSTANT = 300;
exports.SIZE_UPLOAD_UNIFORM = 32;
var MathBackendWebGL = (function () {
    function MathBackendWebGL(gpgpu, delayedStorage) {
        if (delayedStorage === void 0) { delayedStorage = true; }
        this.gpgpu = gpgpu;
        this.delayedStorage = delayedStorage;
        this.texData = new WeakMap();
        this.pendingRead = new WeakMap();
        this.pendingDisposal = new WeakSet();
        this.lruDataGPU = [];
        this.numBytesInGPU = 0;
        this.uploadWaitMs = 0;
        this.downloadWaitMs = 0;
        this.binaryCache = {};
        this.disposed = false;
        if (environment_1.ENV.get('WEBGL_VERSION') < 1) {
            throw new Error('WebGL is not supported on this device');
        }
        if (environment_1.ENV.get('IS_BROWSER')) {
            this.canvas = document.createElement('canvas');
        }
        if (gpgpu == null) {
            this.gpgpu = new gpgpu_context_1.GPGPUContext(gpgpu_util.createWebGLContext(this.canvas));
            this.gpgpuCreatedLocally = true;
        }
        else {
            this.gpgpuCreatedLocally = false;
        }
        this.NUM_BYTES_BEFORE_PAGING =
            (window.screen.height * window.screen.width * window.devicePixelRatio) *
                BEFORE_PAGING_CONSTANT;
        this.textureManager = new texture_manager_1.TextureManager(this.gpgpu);
    }
    MathBackendWebGL.prototype.register = function (dataId, shape, dtype) {
        if (this.texData.has(dataId)) {
            throw new Error('Data buffer is already registered');
        }
        this.texData.set(dataId, {
            shape: shape,
            dtype: dtype,
            values: null,
            texture: null,
            texShape: null,
            usage: tex_util_1.TextureUsage.RENDER
        });
    };
    MathBackendWebGL.prototype.fromPixels = function (pixels, numChannels) {
        if (pixels == null) {
            throw new Error('pixels passed to tf.fromPixels() can not be null');
        }
        var texShape = [pixels.height, pixels.width];
        var outShape = [pixels.height, pixels.width, numChannels];
        if (!(pixels instanceof HTMLVideoElement) &&
            !(pixels instanceof HTMLImageElement) &&
            !(pixels instanceof HTMLCanvasElement) &&
            !(pixels instanceof ImageData)) {
            throw new Error('pixels passed to tf.fromPixels() must be either an ' +
                "HTMLVideoElement, HTMLImageElement, HTMLCanvasElement or " +
                ("ImageData, but was " + pixels.constructor.name));
        }
        if (pixels instanceof HTMLVideoElement) {
            if (this.fromPixelsCanvas == null) {
                if (!environment_1.ENV.get('IS_BROWSER')) {
                    throw new Error('Can\'t read pixels from HTMLImageElement outside the browser.');
                }
                if (document.readyState !== 'complete') {
                    throw new Error('The DOM is not ready yet. Please call tf.fromPixels() ' +
                        'once the DOM is ready. One way to do that is to add an event ' +
                        'listener for `DOMContentLoaded` on the document object');
                }
                this.fromPixelsCanvas = document.createElement('canvas');
            }
            this.fromPixelsCanvas.width = pixels.width;
            this.fromPixelsCanvas.height = pixels.height;
            this.fromPixelsCanvas.getContext('2d').drawImage(pixels, 0, 0, pixels.width, pixels.height);
            pixels = this.fromPixelsCanvas;
        }
        var tempPixelArray = tensor_1.Tensor.make(texShape, {}, 'int32');
        this.texData.get(tempPixelArray.dataId).usage = tex_util_1.TextureUsage.PIXELS;
        this.gpgpu.uploadPixelDataToTexture(this.getTexture(tempPixelArray.dataId), pixels);
        var program = new from_pixels_gpu_1.FromPixelsProgram(outShape);
        var res = this.compileAndRun(program, [tempPixelArray]);
        tempPixelArray.dispose();
        return res;
    };
    MathBackendWebGL.prototype.write = function (dataId, values) {
        if (values == null) {
            throw new Error('MathBackendWebGL.write(): values can not be null');
        }
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var texture = texData.texture, texShape = texData.texShape, usage = texData.usage;
        if (texture != null) {
            this.releaseTexture(dataId, texture, texShape, usage);
            texData.texture = null;
            texData.texShape = null;
        }
        texData.usage = tex_util_1.TextureUsage.UPLOAD;
        texData.values = values;
        if (!this.delayedStorage) {
            this.uploadToGPU(dataId);
        }
    };
    MathBackendWebGL.prototype.readSync = function (dataId) {
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var shape = texData.shape, texture = texData.texture, values = texData.values, texShape = texData.texShape, dtype = texData.dtype;
        if (values != null) {
            this.cacheOnCPU(dataId);
            return values;
        }
        var shouldTimeProgram = this.activeTimers != null;
        var start;
        if (shouldTimeProgram) {
            start = performance.now();
        }
        var float32Values;
        if (environment_1.ENV.get('WEBGL_DOWNLOAD_FLOAT_ENABLED')) {
            float32Values = this.gpgpu.downloadFloat32MatrixFromOutputTexture(texture, texShape[0], texShape[1]);
        }
        else {
            var tmpTarget = tensor_1.Tensor.make(shape, {});
            this.texData.get(tmpTarget.dataId).usage = tex_util_1.TextureUsage.DOWNLOAD;
            var tmpInput = tensor_1.Tensor.make(shape, { dataId: dataId }, dtype);
            var program = new encode_float_gpu_1.EncodeFloatProgram(shape);
            var pageToCpu = false;
            this.compileAndRun(program, [tmpInput], tmpTarget, null, pageToCpu);
            var tmpData = this.texData.get(tmpTarget.dataId);
            float32Values =
                this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(tmpData.texture, tmpData.texShape[0], tmpData.texShape[1]);
            tmpInput.dispose();
            tmpTarget.dispose();
        }
        if (shouldTimeProgram) {
            this.downloadWaitMs += performance.now() - start;
        }
        this.cacheOnCPU(dataId, float32Values);
        return texData.values;
    };
    MathBackendWebGL.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var subscribers_1, texData, texture, values, texShape, float32Values, subscribers, vals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pendingRead.has(dataId)) {
                            subscribers_1 = this.pendingRead.get(dataId);
                            return [2, new Promise(function (resolve) { return subscribers_1.push(resolve); })];
                        }
                        this.throwIfNoData(dataId);
                        texData = this.texData.get(dataId);
                        texture = texData.texture, values = texData.values, texShape = texData.texShape;
                        if (values != null) {
                            this.cacheOnCPU(dataId);
                            return [2, values];
                        }
                        if (!environment_1.ENV.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED')) return [3, 2];
                        return [4, this.gpgpu.downloadMatrixFromTextureAsync(texture, texShape[0], texShape[1])];
                    case 1:
                        float32Values = _a.sent();
                        this.cacheOnCPU(dataId, float32Values);
                        return [2, texData.values];
                    case 2:
                        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 0) {
                            return [2, this.readSync(dataId)];
                        }
                        this.pendingRead.set(dataId, []);
                        return [4, this.gpgpu.runQuery(function () { })];
                    case 3:
                        _a.sent();
                        subscribers = this.pendingRead.get(dataId);
                        this.pendingRead.delete(dataId);
                        vals = this.readSync(dataId);
                        subscribers.forEach(function (resolve) { return resolve(vals); });
                        if (this.pendingDisposal.has(dataId)) {
                            this.pendingDisposal.delete(dataId);
                            this.disposeData(dataId);
                        }
                        return [2, vals];
                }
            });
        });
    };
    MathBackendWebGL.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var oldActiveTimers, newActiveTimers, outerMostTime, flattenedActiveTimers, kernelMs, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldActiveTimers = this.activeTimers;
                        newActiveTimers = [];
                        outerMostTime = false;
                        if (this.programTimersStack == null) {
                            this.programTimersStack = newActiveTimers;
                            outerMostTime = true;
                        }
                        else {
                            this.activeTimers.push(newActiveTimers);
                        }
                        this.activeTimers = newActiveTimers;
                        f();
                        flattenedActiveTimers = util.flatten(this.activeTimers);
                        this.activeTimers = oldActiveTimers;
                        if (outerMostTime) {
                            this.programTimersStack = null;
                        }
                        return [4, Promise.all(flattenedActiveTimers).then(function (results) {
                                var sum = 0;
                                results.forEach(function (result) { return sum += result; });
                                return sum;
                            })];
                    case 1:
                        kernelMs = _a.sent();
                        res = {
                            uploadWaitMs: this.uploadWaitMs,
                            downloadWaitMs: this.downloadWaitMs,
                            kernelMs: kernelMs,
                            wallMs: null
                        };
                        this.uploadWaitMs = 0;
                        this.downloadWaitMs = 0;
                        return [2, res];
                }
            });
        });
    };
    MathBackendWebGL.prototype.memory = function () {
        return { unreliable: false, numBytesInGPU: this.numBytesInGPU };
    };
    MathBackendWebGL.prototype.startTimer = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
            return this.gpgpu.beginQuery();
        }
        return { startMs: performance.now(), endMs: null };
    };
    MathBackendWebGL.prototype.endTimer = function (query) {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
            this.gpgpu.endQuery();
            return query;
        }
        query.endMs = performance.now();
        return query;
    };
    MathBackendWebGL.prototype.getQueryTime = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var timerQuery;
            return __generator(this, function (_a) {
                if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
                    return [2, this.gpgpu.pollQueryTime(query)];
                }
                timerQuery = query;
                return [2, timerQuery.endMs - timerQuery.startMs];
            });
        });
    };
    MathBackendWebGL.prototype.disposeData = function (dataId) {
        if (this.pendingDisposal.has(dataId)) {
            return;
        }
        if (this.pendingRead.has(dataId)) {
            this.pendingDisposal.add(dataId);
            return;
        }
        if (this.texData.has(dataId)) {
            var _a = this.texData.get(dataId), texture = _a.texture, texShape = _a.texShape, usage = _a.usage;
            if (texture != null) {
                this.releaseTexture(dataId, texture, texShape, usage);
            }
            this.texData.delete(dataId);
        }
    };
    MathBackendWebGL.prototype.getTexture = function (dataId) {
        this.uploadToGPU(dataId);
        return this.texData.get(dataId).texture;
    };
    MathBackendWebGL.prototype.getGPGPUContext = function () {
        return this.gpgpu;
    };
    MathBackendWebGL.prototype.getCanvas = function () {
        return this.canvas;
    };
    MathBackendWebGL.prototype.slice = function (x, begin, size) {
        var program = new slice_gpu_1.SliceProgram(size);
        var customSetup = program.getCustomSetupFunc(begin);
        return this.compileAndRun(program, [x], null, customSetup);
    };
    MathBackendWebGL.prototype.stridedSlice = function (x, begin, end, strides, beginMask, endMask) {
        var _a = slice_util_1.getStridedSlicedInfo(x.shape, begin, end, strides, beginMask, endMask), beginIndex = _a[0], size = _a[1];
        if (size.some(function (axis) { return axis === 0; })) {
            return ops.tensor([], size);
        }
        var program = new strided_slice_gpu_1.StridedSliceProgram(beginIndex, strides, size);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.reverse = function (x, axis) {
        var program = new reverse_gpu_1.ReverseProgram(x.shape, axis);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.concat = function (a, b) {
        var program = new concat_gpu_1.ConcatProgram(a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.neg = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.NEG);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.matMul = function (a, b, transposeA, transposeB) {
        var program = new mulmat_gpu_1.MatMulProgram(a.shape, b.shape, transposeA, transposeB);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.multiply = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MUL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var inputs = [x, mean, variance];
        var offsetShape = null;
        if (offset != null) {
            offsetShape = offset.shape;
            inputs.push(offset);
        }
        var scaleShape = null;
        if (scale != null) {
            scaleShape = scale.shape;
            inputs.push(scale);
        }
        var program = new batchnorm_gpu_1.BatchNormProgram(x.shape, mean.shape, variance.shape, offsetShape, scaleShape, varianceEpsilon);
        return this.compileAndRun(program, inputs);
    };
    MathBackendWebGL.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta) {
        var program = new lrn_gpu_1.LRNProgram(x.shape, radius, bias, alpha, beta);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tile = function (x, reps) {
        var program = new tile_gpu_1.TileProgram(x.shape, reps);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.pad = function (x, paddings, constantValue) {
        var program = new pad_gpu_1.PadProgram(x.shape, paddings, constantValue);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.transpose = function (x, perm) {
        var program = new transpose_gpu_1.TransposeProgram(x.shape, perm);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.gather = function (x, indices, axis) {
        var program = new gather_gpu_1.GatherProgram(x.shape, indices.size, axis);
        return this.compileAndRun(program, [x, indices]);
    };
    MathBackendWebGL.prototype.reduce = function (x, reduceType, dtype) {
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        var windowSize = reduce_util.computeOptimalWindowSize(inSize);
        var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
        var program = new reduce_gpu_1.ReduceProgram(reduceInfo, reduceType);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], dtype);
        this.compileAndRun(program, [x], output);
        if (output.shape[1] === 1) {
            return output;
        }
        return this.reduce(output, reduceType, dtype);
    };
    MathBackendWebGL.prototype.argReduce = function (x, reduceType, bestIndicesA) {
        if (bestIndicesA === void 0) { bestIndicesA = null; }
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        if (bestIndicesA != null) {
            batchSize = bestIndicesA.shape[0];
            inSize = bestIndicesA.shape[1];
        }
        var windowSize = reduce_util.computeOptimalWindowSize(inSize);
        var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
        var program = new argminmax_gpu_1.ArgMinMaxProgram(reduceInfo, reduceType, bestIndicesA == null);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], 'int32');
        var inputs = [x];
        if (bestIndicesA != null) {
            inputs.push(bestIndicesA);
        }
        this.compileAndRun(program, inputs, output);
        if (output.shape[1] === 1) {
            return output;
        }
        return this.argReduce(x, reduceType, output);
    };
    MathBackendWebGL.prototype.sum = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        var outputDType = types.sumOutType(x.dtype);
        return this.reduce(a2D, 'sum', outputDType).reshape(outShape);
    };
    MathBackendWebGL.prototype.unsortedSegmentSum = function (x, segmentIds, numSegments) {
        var axis = 0;
        var permutation = axis_util.getAxesPermutation([axis], x.rank);
        var permutedX = x;
        if (permutation != null) {
            permutedX = x.transpose(permutation);
            axis = axis_util.getInnerMostAxes(1, x.rank)[0];
        }
        var outShape = segment_util.computeOutShape(permutedX.shape, axis, numSegments);
        var inSize = util.sizeFromShape([permutedX.shape[axis]]);
        var a2D = permutedX.as2D(-1, inSize);
        var outputDType = types.sumOutType(x.dtype);
        var result = this.segOpCompute(a2D, 'unsortedSegmentSum', segmentIds, outputDType, numSegments)
            .reshape(outShape);
        if (permutation != null) {
            result = result.transpose(axis_util.getUndoAxesPermutation(permutation));
        }
        return result;
    };
    MathBackendWebGL.prototype.segOpCompute = function (x, segOpType, segmentIds, dtype, numSegments) {
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        var windowSize = segment_util.segOpComputeOptimalWindowSize(inSize, numSegments);
        var segOpInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize, numSegments: numSegments };
        var program = new segment_gpu_1.SegmentOpProgram(segOpInfo, segOpType);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], dtype);
        this.compileAndRun(program, [x, segmentIds], output);
        if (output.shape[1] === numSegments) {
            return output;
        }
        segmentIds = ops.range(0, numSegments).tile([inSize / windowSize]);
        return this.segOpCompute(output, segOpType, segmentIds, dtype, numSegments);
    };
    MathBackendWebGL.prototype.argMin = function (x, axis) {
        var axes = [axis];
        axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.argReduce(a2D, 'min').reshape(outShape);
    };
    MathBackendWebGL.prototype.argMax = function (x, axis) {
        var axes = [axis];
        axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.argReduce(a2D, 'max').reshape(outShape);
    };
    MathBackendWebGL.prototype.cumsum = function (x, axis, exclusive, reverse) {
        if (axis !== x.rank - 1) {
            throw new Error("WebGL cumsum shader expects an inner-most axis=" + (x.rank - 1) + " " +
                ("but got axis=" + axis));
        }
        var program = new cumsum_gpu_1.CumSumProgram(x.shape, exclusive, reverse);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.equal = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.notEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.NOT_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.less = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LESS, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.lessEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LESS_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.greater = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.GREATER, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.greaterEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.GREATER_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalNot = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOGICAL_NOT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.logicalAnd = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_AND, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalOr = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_OR, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.where = function (condition, a, b, dtype) {
        var program = new logical_gpu_1.WhereProgram(condition.rank, a.shape, a.rank);
        var output = this.makeOutputArray(program.outputShape, dtype);
        return this.compileAndRun(program, [condition, a, b], output);
    };
    MathBackendWebGL.prototype.topKValues = function (x, k) {
        throw new Error('topKValues GPU not yet implemented!');
    };
    MathBackendWebGL.prototype.topKIndices = function (x, k) {
        throw new Error('topKIndices GPU not yet implemented!');
    };
    MathBackendWebGL.prototype.min = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'min', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.minimum = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MIN, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.mod = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MOD, a.shape, b.shape);
        var customSetup = program.getCustomSetupFunc();
        return this.compileAndRun(program, [a, b], null, customSetup);
    };
    MathBackendWebGL.prototype.max = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'max', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.maximum = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MAX, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.all = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('all', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'all', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.any = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('any', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'any', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.squaredDifference = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.SQUARED_DIFFERENCE, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.realDivide = function (a, b) {
        var op = binaryop_gpu.DIV;
        var outputDtype = 'float32';
        var program = new binaryop_gpu_1.BinaryOpProgram(op, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, outputDtype);
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.floorDiv = function (a, b) {
        var op = binaryop_gpu.INT_DIV;
        var outputDtype = 'int32';
        var program = new binaryop_gpu_1.BinaryOpProgram(op, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, outputDtype);
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.add = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ADD, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.subtract = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.SUB, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.pow = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.POW, a.shape, b.shape);
        var customSetup = program.getCustomSetupFunc();
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output, customSetup);
    };
    MathBackendWebGL.prototype.ceil = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.CEIL);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.floor = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.FLOOR);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sign = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIGN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.round = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ROUND);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.exp = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.EXP);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.expm1 = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.EXPM1);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.log = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOG);
        var customSetup = program.getCustomSetupFunc();
        return this.compileAndRun(program, [x], null, customSetup);
    };
    MathBackendWebGL.prototype.log1p = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOG1P);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sqrt = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SQRT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.rsqrt = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RSQRT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.square = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SQUARE);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.reciprocal = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RECIPROCAL);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.relu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.elu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.eluDer = function (dy, y) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ELU_DER, dy.shape, y.shape);
        return this.compileAndRun(program, [dy, y]);
    };
    MathBackendWebGL.prototype.selu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.int = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TO_INT);
        var output = this.makeOutputArray(program.outputShape, 'int32');
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.clip = function (x, min, max) {
        var program = new clip_gpu_1.ClipProgram(x.shape, min, max);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.abs = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ABS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sigmoid = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIGMOID);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.softplus = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SOFTPLUS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sin = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.cos = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.COS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tan = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TAN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.asin = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ASIN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.acos = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ACOS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.atan = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ATAN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.atan2 = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ATAN2, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.sinh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SINH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.cosh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.COSH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tanh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TANH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.asinh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ASINH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.acosh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ACOSH);
        var customSetup = program.getCustomSetupFunc();
        return this.compileAndRun(program, [x], null, customSetup);
    };
    MathBackendWebGL.prototype.atanh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ATANH);
        var customSetup = program.getCustomSetupFunc();
        return this.compileAndRun(program, [x], null, customSetup);
    };
    MathBackendWebGL.prototype.erf = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ERF);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.step = function (x, alpha) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.STEP(alpha));
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.conv2d = function (x, filter, convInfo) {
        var program = new conv_gpu_1.Conv2DProgram(convInfo);
        return this.compileAndRun(program, [x, filter]);
    };
    MathBackendWebGL.prototype.conv2dDerInput = function (dy, filter, convInfo) {
        var program = new conv_backprop_gpu_1.Conv2DDerInputProgram(convInfo);
        return this.compileAndRun(program, [dy, filter]);
    };
    MathBackendWebGL.prototype.conv2dDerFilter = function (x, dy, convInfo) {
        var program = new conv_backprop_gpu_1.Conv2DDerFilterProgram(convInfo);
        return this.compileAndRun(program, [x, dy]);
    };
    MathBackendWebGL.prototype.depthwiseConv2D = function (x, filter, convInfo) {
        var program = new conv_gpu_depthwise_1.DepthwiseConv2DProgram(convInfo);
        return this.compileAndRun(program, [x, filter]);
    };
    MathBackendWebGL.prototype.depthwiseConv2DDerInput = function (dy, filter, convInfo) {
        var program = new conv_backprop_gpu_depthwise_1.DepthwiseConv2DDerInputProgram(convInfo);
        return this.compileAndRun(program, [dy, filter]);
    };
    MathBackendWebGL.prototype.depthwiseConv2DDerFilter = function (x, dy, convInfo) {
        var program = new conv_backprop_gpu_depthwise_1.DepthwiseConv2DDerFilterProgram(convInfo);
        return this.compileAndRun(program, [x, dy]);
    };
    MathBackendWebGL.prototype.maxPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'max', false);
        var output = this.makeOutputArray(program.outputShape, x.dtype);
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.avgPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'avg', false);
        var output = this.makeOutputArray(program.outputShape, 'float32');
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.maxPoolBackprop = function (dy, x, y, convInfo) {
        var getPositions = true;
        var maxPoolPositionsProgram = new pool_gpu_1.Pool2DProgram(convInfo, 'max', getPositions);
        var maxPoolPositions = this.compileAndRun(maxPoolPositionsProgram, [x]);
        var maxPoolBackPropProgram = new max_pool_backprop_gpu_1.MaxPool2DBackpropProgram(convInfo);
        var output = this.makeOutputArray(maxPoolBackPropProgram.outputShape, x.dtype);
        var result = this.compileAndRun(maxPoolBackPropProgram, [dy, maxPoolPositions], output);
        maxPoolPositions.dispose();
        return result;
    };
    MathBackendWebGL.prototype.avgPoolBackprop = function (dy, x, convInfo) {
        var avgPoolBackpropProgram = new avg_pool_backprop_gpu_1.AvgPool2DBackpropProgram(convInfo);
        var output = this.makeOutputArray(avgPoolBackpropProgram.outputShape, x.dtype);
        return this.compileAndRun(avgPoolBackpropProgram, [dy], output);
    };
    MathBackendWebGL.prototype.cast = function (x, dtype) {
        return backend_util.castTensor(x, dtype, this);
    };
    MathBackendWebGL.prototype.reshape = function (x, shape) {
        return backend_util.reshapeTensor(x, shape);
    };
    MathBackendWebGL.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
        var program = new resize_bilinear_gpu_1.ResizeBilinearProgram(x.shape, newHeight, newWidth, alignCorners);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.resizeBilinearBackprop = function (dy, x, alignCorners) {
        var program = new resize_bilinear_backprop_gpu_1.ResizeBilinearBackpropProgram(dy, x, alignCorners);
        return this.compileAndRun(program, [dy]);
    };
    MathBackendWebGL.prototype.resizeNearestNeighbor = function (x, newHeight, newWidth, alignCorners) {
        var program = new resize_nearest_neighbor_gpu_1.ResizeNearestNeighborProgram(x.shape, newHeight, newWidth, alignCorners);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.resizeNearestNeighborBackprop = function (dy, x, alignCorners) {
        var program = new resize_nearest_neighbor_backprop_gpu_1.ResizeNearestNeigborBackpropProgram(dy, x, alignCorners);
        return this.compileAndRun(program, [dy]);
    };
    MathBackendWebGL.prototype.multinomial = function (logits, normalized, numSamples, seed) {
        var probs = normalized ? logits : ops.softmax(logits);
        var batchSize = probs.shape[0];
        var numOutcomes = probs.shape[1];
        var program = new multinomial_gpu_1.MultinomialProgram(batchSize, numOutcomes, numSamples);
        var output = this.makeOutputArray(program.outputShape, 'int32');
        var customSetup = program.getCustomSetupFunc(seed);
        return this.compileAndRun(program, [probs], output, customSetup);
    };
    MathBackendWebGL.prototype.oneHot = function (indices, depth, onValue, offValue) {
        var program = new onehot_gpu_1.OneHotProgram(indices.size, depth, onValue, offValue);
        return this.compileAndRun(program, [indices]);
    };
    MathBackendWebGL.prototype.makeOutputArray = function (shape, dtype) {
        return tensor_1.Tensor.make(shape, {}, dtype);
    };
    MathBackendWebGL.prototype.compileAndRun = function (program, inputs, output, customSetup, pageToCpu) {
        var _this = this;
        if (pageToCpu === void 0) { pageToCpu = true; }
        if (output == null) {
            output = this.makeOutputArray(program.outputShape, inputs[0].dtype);
        }
        var inputsData = inputs.map(function (tensor) {
            var texData = _this.texData.get(tensor.dataId);
            if (texData.texture == null && tensor.size <= exports.SIZE_UPLOAD_UNIFORM) {
                return { tensor: tensor, texData: null, isUniform: true };
            }
            _this.uploadToGPU(tensor.dataId);
            return { tensor: tensor, texData: texData, isUniform: false };
        });
        this.uploadToGPU(output.dataId);
        var outputData = {
            tensor: output,
            texData: this.texData.get(output.dataId),
            isUniform: false
        };
        var key = gpgpu_math.makeShaderKey(program, inputsData, outputData);
        var binary = this.getAndSaveBinary(key, function () {
            return gpgpu_math.compileProgram(_this.gpgpu, program, inputsData, outputData);
        });
        var shouldTimeProgram = this.activeTimers != null;
        var query;
        if (shouldTimeProgram) {
            query = this.startTimer();
        }
        gpgpu_math.runProgram(binary, inputsData, outputData, customSetup);
        if (pageToCpu && this.numBytesInGPU > this.NUM_BYTES_BEFORE_PAGING) {
            var numBytesToPage = this.numBytesInGPU - this.NUM_BYTES_BEFORE_PAGING;
            while (numBytesToPage > 0 && this.lruDataGPU.length > 0) {
                var dataId = this.lruDataGPU.shift();
                var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
                numBytesToPage -= this.computeBytes(shape, dtype);
                this.read(dataId);
            }
        }
        if (shouldTimeProgram) {
            query = this.endTimer(query);
            this.activeTimers.push(this.getQueryTime(query));
        }
        return output;
    };
    MathBackendWebGL.prototype.getAndSaveBinary = function (key, getBinary) {
        if (!(key in this.binaryCache)) {
            this.binaryCache[key] = getBinary();
        }
        return this.binaryCache[key];
    };
    MathBackendWebGL.prototype.getTextureManager = function () {
        return this.textureManager;
    };
    MathBackendWebGL.prototype.dispose = function () {
        if (this.disposed) {
            return;
        }
        for (var key in this.binaryCache) {
            this.gpgpu.deleteProgram(this.binaryCache[key].webGLProgram);
        }
        this.textureManager.dispose();
        this.canvas.remove();
        if (this.fromPixelsCanvas != null) {
            this.fromPixelsCanvas.remove();
        }
        if (this.gpgpuCreatedLocally) {
            this.gpgpu.dispose();
        }
        this.disposed = true;
    };
    MathBackendWebGL.prototype.throwIfNoData = function (dataId) {
        if (!this.texData.has(dataId)) {
            throw new Error("WebGL backend: No data found for this tensor. " +
                "Did you change your backend in the middle of the program? " +
                "New backends can't use Tensors created with previous backends");
        }
    };
    MathBackendWebGL.prototype.uploadToGPU = function (dataId) {
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var shape = texData.shape, values = texData.values, texture = texData.texture, dtype = texData.dtype, usage = texData.usage;
        if (texture != null) {
            var index = this.lruDataGPU.indexOf(dataId);
            if (index >= 0) {
                this.lruDataGPU.splice(this.lruDataGPU.indexOf(dataId), 1);
                this.lruDataGPU.push(dataId);
            }
            return;
        }
        var shouldTimeProgram = this.activeTimers != null;
        var start;
        if (shouldTimeProgram) {
            start = performance.now();
        }
        var texShape = webgl_util.getTextureShapeFromLogicalShape(this.gpgpu.gl, shape);
        texData.texShape = texShape;
        var newTexture = this.acquireTexture(dataId, texShape, usage);
        texData.texture = newTexture;
        if (values != null) {
            this.gpgpu.uploadMatrixToTexture(newTexture, texShape[0], texShape[1], typedArrayToFloat32(values, dtype));
            texData.values = null;
            if (shouldTimeProgram) {
                this.uploadWaitMs += performance.now() - start;
            }
        }
    };
    MathBackendWebGL.prototype.cacheOnCPU = function (dataId, float32Values) {
        var dontKeepCopyOnGPU = this.delayedStorage;
        var texData = this.texData.get(dataId);
        var texture = texData.texture, texShape = texData.texShape, dtype = texData.dtype, usage = texData.usage;
        if (dontKeepCopyOnGPU && texture != null) {
            this.releaseTexture(dataId, texture, texShape, usage);
            texData.texture = null;
            texData.texShape = null;
        }
        if (float32Values != null) {
            texData.values = float32ToTypedArray(float32Values, dtype);
        }
    };
    MathBackendWebGL.prototype.releaseTexture = function (dataId, texture, texShape, texType) {
        var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
        var idx = this.lruDataGPU.indexOf(dataId);
        if (idx >= 0) {
            this.lruDataGPU.splice(idx, 1);
        }
        this.numBytesInGPU -= this.computeBytes(shape, dtype);
        this.textureManager.releaseTexture(texture, texShape, texType);
    };
    MathBackendWebGL.prototype.acquireTexture = function (dataId, texShape, texType) {
        var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
        this.lruDataGPU.push(dataId);
        this.numBytesInGPU += this.computeBytes(shape, dtype);
        return this.textureManager.acquireTexture(texShape, texType);
    };
    MathBackendWebGL.prototype.computeBytes = function (shape, dtype) {
        return util.sizeFromShape(shape) * util.bytesPerElement(dtype);
    };
    return MathBackendWebGL;
}());
exports.MathBackendWebGL = MathBackendWebGL;
if (environment_1.ENV.get('IS_BROWSER')) {
    environment_1.ENV.registerBackend('webgl', function () { return new MathBackendWebGL(); }, 2, tensor_1.setTensorTracker);
}
function float32ToTypedArray(a, dtype) {
    if (dtype === 'float32') {
        return a;
    }
    else if (dtype === 'int32' || dtype === 'bool') {
        var result = (dtype === 'int32') ? new Int32Array(a.length) :
            new Uint8Array(a.length);
        for (var i = 0; i < result.length; ++i) {
            result[i] = Math.round(a[i]);
        }
        return result;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
function typedArrayToFloat32(a, dtype) {
    return (a instanceof Float32Array) ? a : new Float32Array(a);
}

},{"../environment":13,"../ops/axis_util":74,"../ops/ops":94,"../ops/reduce_util":97,"../ops/segment_util":102,"../ops/slice_util":106,"../tensor":125,"../types":130,"../util":131,"./backend_util":30,"./webgl/argminmax_gpu":32,"./webgl/avg_pool_backprop_gpu":33,"./webgl/batchnorm_gpu":34,"./webgl/binaryop_gpu":35,"./webgl/clip_gpu":36,"./webgl/concat_gpu":37,"./webgl/conv_backprop_gpu":38,"./webgl/conv_backprop_gpu_depthwise":39,"./webgl/conv_gpu":40,"./webgl/conv_gpu_depthwise":41,"./webgl/cumsum_gpu":42,"./webgl/encode_float_gpu":43,"./webgl/from_pixels_gpu":44,"./webgl/gather_gpu":45,"./webgl/gpgpu_context":46,"./webgl/gpgpu_math":47,"./webgl/gpgpu_util":48,"./webgl/logical_gpu":49,"./webgl/lrn_gpu":50,"./webgl/max_pool_backprop_gpu":51,"./webgl/mulmat_gpu":52,"./webgl/multinomial_gpu":53,"./webgl/onehot_gpu":54,"./webgl/pad_gpu":55,"./webgl/pool_gpu":56,"./webgl/reduce_gpu":57,"./webgl/resize_bilinear_backprop_gpu":58,"./webgl/resize_bilinear_gpu":59,"./webgl/resize_nearest_neighbor_backprop_gpu":60,"./webgl/resize_nearest_neighbor_gpu":61,"./webgl/reverse_gpu":62,"./webgl/segment_gpu":63,"./webgl/slice_gpu":65,"./webgl/strided_slice_gpu":66,"./webgl/tex_util":67,"./webgl/texture_manager":68,"./webgl/tile_gpu":69,"./webgl/transpose_gpu":70,"./webgl/unaryop_gpu":71,"./webgl/webgl_util":72}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgMinMaxProgram = (function () {
    function ArgMinMaxProgram(reduceInfo, op, firstPass) {
        this.variableNames = ['A'];
        var windowSize = reduceInfo.windowSize;
        var batchSize = reduceInfo.batchSize;
        var inSize = reduceInfo.inSize;
        var outSize = Math.ceil(inSize / windowSize);
        if (!firstPass) {
            this.variableNames.push('bestIndicesA');
        }
        this.outputShape = [batchSize, outSize];
        var compOp = (op === 'max') ? '>' : '<';
        var indexSnippet = firstPass ?
            'inOffset + i;' :
            'round(getBestIndicesA(batch, inOffset + i));';
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + windowSize + ";\n\n        int bestIndex = 0;\n        float bestValue = getA(batch, inOffset);\n\n        for (int i = 0; i < " + windowSize + "; i++) {\n          int inIdx = " + indexSnippet + ";\n          float candidate = getA(batch, inIdx);\n          if (candidate " + compOp + " bestValue) {\n            bestValue = candidate;\n            bestIndex = inIdx;\n          }\n        }\n        setOutput(float(bestIndex));\n      }\n    ";
    }
    return ArgMinMaxProgram;
}());
exports.ArgMinMaxProgram = ArgMinMaxProgram;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AvgPool2DBackpropProgram = (function () {
    function AvgPool2DBackpropProgram(convInfo) {
        this.variableNames = ['dy'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var avgMultiplier = 1 / (filterHeight * filterWidth);
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n      const float avgMultiplier = float(" + avgMultiplier + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n\n            dotProd += dyValue * avgMultiplier;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return AvgPool2DBackpropProgram;
}());
exports.AvgPool2DBackpropProgram = AvgPool2DBackpropProgram;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var BatchNormProgram = (function () {
    function BatchNormProgram(xShape, meanShape, varianceShape, offsetShape, scaleShape, varianceEpsilon) {
        this.outputShape = [];
        this.supportsBroadcasting = true;
        this.variableNames = ['x', 'mean', 'variance'];
        broadcast_util.assertAndGetBroadcastShape(xShape, meanShape);
        broadcast_util.assertAndGetBroadcastShape(xShape, varianceShape);
        var offsetSnippet = '0.0';
        if (offsetShape != null) {
            broadcast_util.assertAndGetBroadcastShape(xShape, offsetShape);
            this.variableNames.push('offset');
            offsetSnippet = 'getOffsetAtOutCoords()';
        }
        var scaleSnippet = '1.0';
        if (scaleShape != null) {
            broadcast_util.assertAndGetBroadcastShape(xShape, scaleShape);
            this.variableNames.push('scale');
            scaleSnippet = 'getScaleAtOutCoords()';
        }
        this.outputShape = xShape;
        this.userCode = "\n      void main() {\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + offsetSnippet + ";\n        float scale = " + scaleSnippet + ";\n        float inv = scale * inversesqrt(variance + float(" + varianceEpsilon + "));\n        setOutput((x - mean) * inv + offset);\n      }\n    ";
    }
    return BatchNormProgram;
}());
exports.BatchNormProgram = BatchNormProgram;

},{"../../ops/broadcast_util":77}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var CHECK_NAN_SNIPPET = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n";
exports.ADD = 'return a + b;';
exports.SUB = 'return a - b;';
exports.MUL = 'return a * b;';
exports.DIV = "if (a == b) return 1.0;\n  return a / b;";
exports.INT_DIV = "\n  float resultSign = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  int result = ia / ib;\n  int amodb = ia - ib * result;\n\n  if (resultSign < 0.0 && amodb != 0) {\n    result -= 1;\n  }\n  return float(result);\n";
exports.POW = "\nif(a < 0.0 && floor(b) < b){\n  return NAN;\n}\nreturn (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n    pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
exports.SQUARED_DIFFERENCE = 'return (a - b) * (a - b);';
exports.EQUAL = "return float(a == b);";
exports.NOT_EQUAL = "return float(a != b);";
exports.LESS = "return float(a < b);";
exports.LESS_EQUAL = "return float(a <= b);";
exports.GREATER = "return float(a > b);";
exports.GREATER_EQUAL = "return float(a >= b);";
exports.LOGICAL_AND = "return float(a >= 1.0 && b >= 1.0);";
exports.LOGICAL_OR = "return float(a >= 1.0 || b >= 1.0);";
exports.MAX = CHECK_NAN_SNIPPET + "\n  return max(a, b);\n";
exports.MIN = CHECK_NAN_SNIPPET + "\n  return min(a, b);\n";
exports.MOD = "if (b == 0.0) return NAN;\n  return mod(a, b);";
exports.ATAN2 = CHECK_NAN_SNIPPET + "\n  return atan(a, b);\n";
exports.ELU_DER = "return (b >= 1.0) ? a : a * (b + 1.0);";
var BinaryOpProgram = (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      uniform float NAN;\n      float binaryOperation(float a, float b) {\n        " + op + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    BinaryOpProgram.prototype.getCustomSetupFunc = function () {
        var _this = this;
        return function (gpgpu, webGLProgram) {
            if (_this.startLoc == null) {
                _this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'NAN');
                if (_this.startLoc == null) {
                    return;
                }
            }
            gpgpu.gl.uniform1f(_this.startLoc, NaN);
        };
    };
    return BinaryOpProgram;
}());
exports.BinaryOpProgram = BinaryOpProgram;

},{"../../ops/broadcast_util":77}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClipProgram = (function () {
    function ClipProgram(aShape, min, max) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        var minFixed = min.toFixed(20);
        var maxFixed = max.toFixed(20);
        this.userCode = "\n      void main() {\n        float value = getAAtOutCoords();\n        if (isNaN(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, " + minFixed + ", " + maxFixed + "));\n      }\n    ";
    }
    return ClipProgram;
}());
exports.ClipProgram = ClipProgram;

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var concat_util = require("../../ops/concat_util");
var ConcatProgram = (function () {
    function ConcatProgram(aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.outputShape = [];
        this.outputShape =
            concat_util.computeOutShape(aShape, bShape, 1);
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        float value = 0.0;\n        if (yC < " + aShape[1] + ") {\n          value = getA(yR, yC);\n        } else {\n          yC -= " + aShape[1] + ";\n          value = getB(yR, yC);\n        }\n\n        setOutput(value);\n      }\n    ";
    }
    return ConcatProgram;
}());
exports.ConcatProgram = ConcatProgram;

},{"../../ops/concat_util":80}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Conv2DDerFilterProgram = (function () {
    function Conv2DDerFilterProgram(convInfo) {
        this.variableNames = ['x', 'dy'];
        this.outputShape = convInfo.filterShape;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int d2 = coords.w;\n\n        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + convInfo.batchSize + "; b++) {\n          for (int yR = 0; yR < " + convInfo.outHeight + "; yR++) {\n            int xR = wR + yR * " + strideHeight + " - " + padTop + ";\n\n            if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + convInfo.outWidth + "; yC++) {\n              int xC = wC + yC * " + strideWidth + " - " + padLeft + ";\n\n              if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return Conv2DDerFilterProgram;
}());
exports.Conv2DDerFilterProgram = Conv2DDerFilterProgram;
var Conv2DDerInputProgram = (function () {
    function Conv2DDerInputProgram(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + filterHeight + " - 1 - wR;\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + filterWidth + " - 1 - wC;\n\n            for (int d2 = 0; d2 < " + convInfo.outChannels + "; d2++) {\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, d2);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return Conv2DDerInputProgram;
}());
exports.Conv2DDerInputProgram = Conv2DDerInputProgram;

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DepthwiseConv2DDerFilterProgram = (function () {
    function DepthwiseConv2DDerFilterProgram(convInfo) {
        this.variableNames = ['x', 'dy'];
        this.outputShape = convInfo.filterShape;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        var channelMul = convInfo.outChannels / convInfo.inChannels;
        this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int dm = coords.w;\n        int d2 = d1 * " + channelMul + " + dm;\n\n        float dotProd = 0.0;\n\n        // TODO: Vec4 over the batch size\n        for (int b = 0; b < " + convInfo.batchSize + "; b++) {\n          for (int yR = 0; yR < " + convInfo.outHeight + "; yR++) {\n            int xR = wR + yR * " + strideHeight + " - " + padTop + ";\n\n            if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + convInfo.outWidth + "; yC++) {\n              int xC = wC + yC * " + strideWidth + " - " + padLeft + ";\n\n              if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return DepthwiseConv2DDerFilterProgram;
}());
exports.DepthwiseConv2DDerFilterProgram = DepthwiseConv2DDerFilterProgram;
var DepthwiseConv2DDerInputProgram = (function () {
    function DepthwiseConv2DDerInputProgram(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var channelMul = convInfo.outChannels / convInfo.inChannels;
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        float dotProd = 0.0;\n\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + filterHeight + " - 1 - wR;\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + filterWidth + " - 1 - wC;\n\n            // TODO: Vec4 over the channelMul\n            for (int dm = 0; dm < " + channelMul + "; dm++) {\n              int d2 = d1 * " + channelMul + " + dm;\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, dm);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return DepthwiseConv2DDerInputProgram;
}());
exports.DepthwiseConv2DDerInputProgram = DepthwiseConv2DDerInputProgram;

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Conv2DProgram = (function () {
    function Conv2DProgram(convInfo) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var dilationHeight = convInfo.dilationHeight;
        var dilationWidth = convInfo.dilationWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var inputDepthNearestVec4 = Math.floor(convInfo.inChannels / 4) * 4;
        var inputDepthVec4Remainder = convInfo.inChannels % 4;
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d2 = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          int xR = xRCorner + wR * " + dilationHeight + ";\n\n          if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            int xC = xCCorner + wC * " + dilationWidth + ";\n\n            if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n              continue;\n            }\n\n            for (int d1 = 0; d1 < " + inputDepthNearestVec4 + "; d1 += 4) {\n              vec4 xValues = vec4(\n                getX(batch, xR, xC, d1),\n                getX(batch, xR, xC, d1 + 1),\n                getX(batch, xR, xC, d1 + 2),\n                getX(batch, xR, xC, d1 + 3)\n              );\n              vec4 wValues = vec4(\n                getW(wR, wC, d1, d2),\n                getW(wR, wC, d1 + 1, d2),\n                getW(wR, wC, d1 + 2, d2),\n                getW(wR, wC, d1 + 3, d2)\n              );\n\n              dotProd += dot(xValues, wValues);\n            }\n\n            if (" + (inputDepthVec4Remainder === 1) + ") {\n              dotProd +=\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + ") *\n                getW(wR, wC, " + inputDepthNearestVec4 + ", d2);\n            } else if (" + (inputDepthVec4Remainder === 2) + ") {\n              vec2 xValues = vec2(\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + "),\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + " + 1)\n              );\n              vec2 wValues = vec2(\n                getW(wR, wC, " + inputDepthNearestVec4 + ", d2),\n                getW(wR, wC, " + inputDepthNearestVec4 + " + 1, d2)\n              );\n              dotProd += dot(xValues, wValues);\n            } else if (" + (inputDepthVec4Remainder === 3) + ") {\n              vec3 xValues = vec3(\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + "),\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + " + 1),\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + " + 2)\n              );\n              vec3 wValues = vec3(\n                getW(wR, wC, " + inputDepthNearestVec4 + ", d2),\n                getW(wR, wC, " + inputDepthNearestVec4 + " + 1, d2),\n                getW(wR, wC, " + inputDepthNearestVec4 + " + 2, d2)\n              );\n              dotProd += dot(xValues, wValues);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return Conv2DProgram;
}());
exports.Conv2DProgram = Conv2DProgram;

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DepthwiseConv2DProgram = (function () {
    function DepthwiseConv2DProgram(convInfo) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        var xNumRows = convInfo.inHeight;
        var xNumCols = convInfo.inWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var dilationHeight = convInfo.dilationHeight;
        var dilationWidth = convInfo.dilationWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var channelMul = convInfo.outChannels / convInfo.inChannels;
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2 / " + channelMul + ";\n        int q = d2 - d1 * " + channelMul + ";\n\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        // TODO(dsmilkov): Flatten the two for loops and vec4 the operations.\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          int xR = xRCorner + wR * " + dilationHeight + ";\n\n          if (xR < 0 || xR >= " + xNumRows + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            int xC = xCCorner + wC * " + dilationWidth + ";\n\n            if (xC < 0 || xC >= " + xNumCols + ") {\n              continue;\n            }\n\n            float xVal = getX(batch, xR, xC, d1);\n            float wVal = getW(wR, wC, d1, q);\n            dotProd += xVal * wVal;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return DepthwiseConv2DProgram;
}());
exports.DepthwiseConv2DProgram = DepthwiseConv2DProgram;

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var CumSumProgram = (function () {
    function CumSumProgram(shape, exclusive, reverse) {
        this.variableNames = ['x'];
        this.outputShape = shape;
        var rank = shape.length;
        var finalDim = shape[shape.length - 1];
        var comparator = reverse ? '<' : '>';
        this.userCode = "\n      int getIndex(int i) {\n        " + (reverse ? "return " + finalDim + " -i - 1;" : 'return i;') + "\n      }\n\n      void main() {\n        " + shader_compiler_1.getCoordsDataType(rank) + " coords = getOutputCoords();\n        int end = " + getFinalCoord(rank, 'coords') + ";\n        float val = 0.0;\n        for (int i = " + finalDim + " - 1; i >= 0; i -= 1) {\n          int idx = getIndex(i);\n          if (idx " + comparator + " end) {\n            continue;\n          }\n          if (idx == end && " + exclusive + ") {\n            continue;\n          }\n          " + getFinalCoord(rank, 'coords') + " = idx;\n          val += getX(" + getCoords(rank, 'coords') + ");\n        }\n        setOutput(val);\n      }\n    ";
    }
    return CumSumProgram;
}());
exports.CumSumProgram = CumSumProgram;
function getCoords(rank, name) {
    if (rank === 1) {
        return "" + name;
    }
    else if (rank === 2) {
        return name + ".x, " + name + ".y";
    }
    else if (rank === 3) {
        return name + ".x, " + name + ".y, " + name + ".z";
    }
    else if (rank === 4) {
        return name + ".x, " + name + ".y, " + name + ".z, " + name + ".w";
    }
    else {
        throw Error("Cumulative sum for rank " + rank + " is not yet supported");
    }
}
function getFinalCoord(rank, name) {
    if (rank === 1) {
        return "" + name;
    }
    else if (rank === 2) {
        return name + ".y";
    }
    else if (rank === 3) {
        return name + ".z";
    }
    else if (rank === 4) {
        return name + ".w";
    }
    else {
        throw Error("Cumulative sum for rank " + rank + " is not yet supported");
    }
}

},{"./shader_compiler":64}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EncodeFloatProgram = (function () {
    function EncodeFloatProgram(outputShape) {
        this.variableNames = ['A'];
        this.outputShape = outputShape;
        this.userCode = "\n      const float FLOAT_MAX = 1.70141184e38;\n      const float FLOAT_MIN = 1.17549435e-38;\n\n      lowp vec4 encode_float(highp float v) {\n        if (isNaN(v)) {\n          return vec4(255, 255, 255, 255);\n        }\n\n        highp float av = abs(v);\n\n        if(av < FLOAT_MIN) {\n          return vec4(0.0, 0.0, 0.0, 0.0);\n        } else if(v > FLOAT_MAX) {\n          return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n        } else if(v < -FLOAT_MAX) {\n          return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n        }\n\n        highp vec4 c = vec4(0,0,0,0);\n\n        highp float e = floor(log2(av));\n        highp float m = exp2(fract(log2(av))) - 1.0;\n\n        c[2] = floor(128.0 * m);\n        m -= c[2] / 128.0;\n        c[1] = floor(32768.0 * m);\n        m -= c[1] / 32768.0;\n        c[0] = floor(8388608.0 * m);\n\n        highp float ebias = e + 127.0;\n        c[3] = floor(ebias / 2.0);\n        ebias -= c[3] * 2.0;\n        c[2] += floor(ebias) * 128.0;\n\n        c[3] += 128.0 * step(0.0, -v);\n\n        return c / 255.0;\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        gl_FragColor = encode_float(x);\n      }\n    ";
    }
    return EncodeFloatProgram;
}());
exports.EncodeFloatProgram = EncodeFloatProgram;

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FromPixelsProgram = (function () {
    function FromPixelsProgram(outputShape) {
        this.variableNames = ['A'];
        var height = outputShape[0], width = outputShape[1];
        this.outputShape = outputShape;
        this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + width + ".0, " + height + ".0);\n\n        vec4 values = texture2D(A, uv);\n        float value;\n        if (depth == 0) {\n          value = values.r;\n        } else if (depth == 1) {\n          value = values.g;\n        } else if (depth == 2) {\n          value = values.b;\n        } else if (depth == 3) {\n          value = values.a;\n        }\n\n        setOutput(floor(value * 255.0 + 0.5));\n      }\n    ";
    }
    return FromPixelsProgram;
}());
exports.FromPixelsProgram = FromPixelsProgram;

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var GatherProgram = (function () {
    function GatherProgram(aShape, indicesLength, axis) {
        this.variableNames = ['A', 'indices'];
        var outputShape = aShape.slice();
        outputShape[axis] = indicesLength;
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var sourceCoords = getSourceCoords(aShape, axis);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
    }
    return GatherProgram;
}());
exports.GatherProgram = GatherProgram;
function getSourceCoords(aShape, axis) {
    var rank = aShape.length;
    if (rank > 4) {
        throw Error("Gather for rank " + rank + " is not yet supported");
    }
    if (rank === 1) {
        return "int(getIndices(resRC))";
    }
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var sourceCoords = [];
    for (var i = 0; i < aShape.length; i++) {
        if (i === axis) {
            sourceCoords.push("int(getIndices(" + currentCoords[i] + "))");
        }
        else {
            sourceCoords.push("" + currentCoords[i]);
        }
    }
    return sourceCoords.join();
}

},{"./shader_compiler":64}],46:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var util = require("../../util");
var gpgpu_util = require("./gpgpu_util");
var tex_util = require("./tex_util");
var webgl_util = require("./webgl_util");
var GPGPUContext = (function () {
    function GPGPUContext(gl) {
        this.outputTexture = null;
        this.program = null;
        this.disposed = false;
        this.autoDebugValidate = false;
        this.vertexAttrsAreBound = false;
        this.itemsToPoll = [];
        if (gl != null) {
            this.gl = gl;
        }
        else {
            this.gl = gpgpu_util.createWebGLContext();
        }
        if (environment_1.ENV.get('WEBGL_VERSION') === 1) {
            this.textureFloatExtension =
                webgl_util.getExtensionOrThrow(this.gl, 'OES_texture_float');
            this.colorBufferFloatExtension =
                this.gl.getExtension('WEBGL_color_buffer_float');
            if (!environment_1.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
                this.textureHalfFloatExtension =
                    webgl_util.getExtensionOrThrow(this.gl, 'OES_texture_half_float');
                this.colorBufferHalfFloatExtension =
                    this.gl.getExtension('EXT_color_buffer_half_float');
            }
        }
        else {
            this.colorBufferFloatExtension =
                webgl_util.getExtensionOrThrow(this.gl, 'EXT_color_buffer_float');
        }
        this.loseContextExtension =
            webgl_util.getExtensionOrThrow(this.gl, 'WEBGL_lose_context');
        if (environment_1.ENV.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED')) {
            this.getBufferSubDataAsyncExtension =
                this.gl.getExtension('WEBGL_get_buffer_sub_data_async');
        }
        this.vertexBuffer = gpgpu_util.createVertexBuffer(this.gl);
        this.indexBuffer = gpgpu_util.createIndexBuffer(this.gl);
        this.framebuffer = webgl_util.createFramebuffer(this.gl);
        this.textureConfig =
            gpgpu_util.getTextureConfig(this.gl, this.textureHalfFloatExtension);
    }
    GPGPUContext.prototype.dispose = function () {
        var _this = this;
        if (this.disposed) {
            return;
        }
        if (this.program != null) {
            console.warn('Disposing a GPGPUContext that still has a bound WebGLProgram.' +
                ' This is probably a resource leak, delete the program with ' +
                'GPGPUContext.deleteProgram before disposing.');
        }
        if (this.outputTexture != null) {
            console.warn('Disposing a GPGPUContext that still has a bound output matrix ' +
                'texture.  This is probably a resource leak, delete the output ' +
                'matrix texture with GPGPUContext.deleteMatrixTexture before ' +
                'disposing.');
        }
        var gl = this.gl;
        webgl_util.callAndCheck(gl, function () { return gl.finish(); });
        webgl_util.callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, null); });
        webgl_util.callAndCheck(gl, function () { return gl.deleteFramebuffer(_this.framebuffer); });
        webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, null); });
        webgl_util.callAndCheck(gl, function () { return gl.deleteBuffer(_this.vertexBuffer); });
        webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); });
        webgl_util.callAndCheck(gl, function () { return gl.deleteBuffer(_this.indexBuffer); });
        this.loseContextExtension.loseContext();
        this.disposed = true;
    };
    GPGPUContext.prototype.enableAutomaticDebugValidation = function (enabled) {
        this.autoDebugValidate = enabled;
        webgl_util.enableDebugWebGLErrorChecking(enabled);
    };
    GPGPUContext.prototype.createFloat32MatrixTexture = function (rows, columns) {
        this.throwIfDisposed();
        return gpgpu_util.createFloat32MatrixTexture(this.gl, rows, columns, this.textureConfig);
    };
    GPGPUContext.prototype.createFloat16MatrixTexture = function (rows, columns) {
        this.throwIfDisposed();
        return gpgpu_util.createFloat16MatrixTexture(this.gl, rows, columns, this.textureConfig);
    };
    GPGPUContext.prototype.createUnsignedBytesMatrixTexture = function (rows, columns) {
        this.throwIfDisposed();
        return gpgpu_util.createUnsignedBytesMatrixTexture(this.gl, rows, columns, this.textureConfig);
    };
    GPGPUContext.prototype.uploadPixelDataToTexture = function (texture, pixels) {
        this.throwIfDisposed();
        gpgpu_util.uploadPixelDataToTexture(this.gl, texture, pixels);
    };
    GPGPUContext.prototype.createPackedMatrixTexture = function (rows, columns) {
        this.throwIfDisposed();
        return gpgpu_util.createPackedMatrixTexture(this.gl, rows, columns, this.textureConfig);
    };
    GPGPUContext.prototype.deleteMatrixTexture = function (texture) {
        var _this = this;
        this.throwIfDisposed();
        if (this.outputTexture === texture) {
            webgl_util.unbindColorTextureFromFramebuffer(this.gl, this.framebuffer);
            this.outputTexture = null;
        }
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.deleteTexture(texture); });
    };
    GPGPUContext.prototype.uploadMatrixToTexture = function (texture, rows, columns, matrix) {
        this.throwIfDisposed();
        var numChannels = webgl_util.getNumChannels();
        return gpgpu_util.uploadMatrixToTexture(this.gl, texture, rows, columns, matrix, numChannels, this.textureConfig);
    };
    GPGPUContext.prototype.uploadMatrixToPackedTexture = function (texture, rows, columns, matrix) {
        this.throwIfDisposed();
        return gpgpu_util.uploadMatrixToPackedTexture(this.gl, texture, rows, columns, matrix, this.textureConfig);
    };
    GPGPUContext.prototype.downloadFloat32MatrixFromOutputTexture = function (texture, rows, columns) {
        var _this = this;
        return this.downloadMatrixDriver(texture, function () { return gpgpu_util.downloadFloat32MatrixFromOutputTexture(_this.gl, rows, columns, _this.textureConfig); });
    };
    GPGPUContext.prototype.downloadByteEncodedFloatMatrixFromOutputTexture = function (texture, rows, columns) {
        var _this = this;
        return this.downloadMatrixDriver(texture, function () { return gpgpu_util.downloadByteEncodedFloatMatrixFromOutputTexture(_this.gl, rows, columns, _this.textureConfig); });
    };
    GPGPUContext.prototype.downloadMatrixFromTextureAsync = function (texture, rows, columns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.getBufferSubDataAsyncExtension == null) {
                    throw new Error("Cannot download matrix from output texture asynchronously, " +
                        "WEBGL_get_buffer_sub_data_async is not enabled.");
                }
                return [2, this.downloadMatrixDriverAsync(texture, function () { return gpgpu_util.downloadMatrixFromOutputTextureAsync(_this.gl, _this.getBufferSubDataAsyncExtension, rows, columns, _this.textureConfig); })];
            });
        });
    };
    GPGPUContext.prototype.downloadMatrixFromPackedTexture = function (texture, rows, columns) {
        var _this = this;
        return this.downloadMatrixDriver(texture, function () { return gpgpu_util.downloadMatrixFromPackedOutputTexture(_this.gl, rows, columns, _this.textureConfig); });
    };
    GPGPUContext.prototype.createProgram = function (fragmentShaderSource) {
        this.throwIfDisposed();
        var gl = this.gl;
        var fragmentShader = webgl_util.createFragmentShader(gl, fragmentShaderSource);
        var vertexShader = gpgpu_util.createVertexShader(gl);
        var program = webgl_util.createProgram(gl);
        webgl_util.callAndCheck(gl, function () { return gl.attachShader(program, vertexShader); });
        webgl_util.callAndCheck(gl, function () { return gl.attachShader(program, fragmentShader); });
        webgl_util.linkProgram(gl, program);
        if (this.autoDebugValidate) {
            webgl_util.validateProgram(gl, program);
        }
        if (!this.vertexAttrsAreBound) {
            this.setProgram(program);
            this.vertexAttrsAreBound = gpgpu_util.bindVertexProgramAttributeStreams(gl, this.program, this.vertexBuffer);
        }
        return program;
    };
    GPGPUContext.prototype.deleteProgram = function (program) {
        var _this = this;
        this.throwIfDisposed();
        if (program === this.program) {
            this.program = null;
        }
        if (program != null) {
            webgl_util.callAndCheck(this.gl, function () { return _this.gl.deleteProgram(program); });
        }
    };
    GPGPUContext.prototype.setProgram = function (program) {
        var _this = this;
        this.throwIfDisposed();
        this.program = program;
        if ((this.program != null) && this.autoDebugValidate) {
            webgl_util.validateProgram(this.gl, this.program);
        }
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.useProgram(program); });
    };
    GPGPUContext.prototype.getUniformLocation = function (program, uniformName, shouldThrow) {
        if (shouldThrow === void 0) { shouldThrow = true; }
        this.throwIfDisposed();
        if (shouldThrow) {
            return webgl_util.getProgramUniformLocationOrThrow(this.gl, program, uniformName);
        }
        else {
            return webgl_util.getProgramUniformLocation(this.gl, program, uniformName);
        }
    };
    GPGPUContext.prototype.getAttributeLocation = function (program, attribute) {
        var _this = this;
        this.throwIfDisposed();
        return webgl_util.callAndCheck(this.gl, function () { return _this.gl.getAttribLocation(program, attribute); });
    };
    GPGPUContext.prototype.getUniformLocationNoThrow = function (program, uniformName) {
        this.throwIfDisposed();
        return this.gl.getUniformLocation(program, uniformName);
    };
    GPGPUContext.prototype.setInputMatrixTexture = function (inputMatrixTexture, uniformLocation, textureUnit) {
        this.throwIfDisposed();
        this.throwIfNoProgram();
        webgl_util.bindTextureToProgramUniformSampler(this.gl, this.program, inputMatrixTexture, uniformLocation, textureUnit);
    };
    GPGPUContext.prototype.setOutputMatrixTexture = function (outputMatrixTexture, rows, columns) {
        this.setOutputMatrixTextureDriver(outputMatrixTexture, columns, rows);
    };
    GPGPUContext.prototype.setOutputPackedMatrixTexture = function (outputPackedMatrixTexture, rows, columns) {
        this.throwIfDisposed();
        var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        this.setOutputMatrixTextureDriver(outputPackedMatrixTexture, width, height);
    };
    GPGPUContext.prototype.setOutputMatrixWriteRegion = function (startRow, numRows, startColumn, numColumns) {
        this.setOutputMatrixWriteRegionDriver(startColumn, startRow, numColumns, numRows);
    };
    GPGPUContext.prototype.setOutputPackedMatrixWriteRegion = function (startRow, numRows, startColumn, numColumns) {
        throw new Error('setOutputPackedMatrixWriteRegion not implemented.');
    };
    GPGPUContext.prototype.debugValidate = function () {
        if (this.program != null) {
            webgl_util.validateProgram(this.gl, this.program);
        }
        webgl_util.validateFramebuffer(this.gl);
    };
    GPGPUContext.prototype.executeProgram = function () {
        this.throwIfDisposed();
        this.throwIfNoProgram();
        var gl = this.gl;
        if (this.autoDebugValidate) {
            this.debugValidate();
        }
        webgl_util.callAndCheck(gl, function () { return gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); });
    };
    GPGPUContext.prototype.blockUntilAllProgramsCompleted = function () {
        var _this = this;
        this.throwIfDisposed();
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.finish(); });
    };
    GPGPUContext.prototype.getQueryTimerExtension = function () {
        if (this.disjointQueryTimerExtension == null) {
            this.disjointQueryTimerExtension =
                webgl_util.getExtensionOrThrow(this.gl, environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2 ?
                    'EXT_disjoint_timer_query_webgl2' :
                    'EXT_disjoint_timer_query');
        }
        return this.disjointQueryTimerExtension;
    };
    GPGPUContext.prototype.getQueryTimerExtensionWebGL2 = function () {
        return this.getQueryTimerExtension();
    };
    GPGPUContext.prototype.getQueryTimerExtensionWebGL1 = function () {
        return this.getQueryTimerExtension();
    };
    GPGPUContext.prototype.runQuery = function (queryFn) {
        var query = this.beginQuery();
        queryFn();
        this.endQuery();
        return this.pollQueryTime(query);
    };
    GPGPUContext.prototype.beginQuery = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2) {
            var gl2 = this.gl;
            var ext_1 = this.getQueryTimerExtensionWebGL2();
            var query_1 = gl2.createQuery();
            gl2.beginQuery(ext_1.TIME_ELAPSED_EXT, query_1);
            return query_1;
        }
        var ext = this.getQueryTimerExtensionWebGL1();
        var query = ext.createQueryEXT();
        ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
        return query;
    };
    GPGPUContext.prototype.endQuery = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2) {
            var gl2 = this.gl;
            var ext_2 = this.getQueryTimerExtensionWebGL2();
            gl2.endQuery(ext_2.TIME_ELAPSED_EXT);
            return;
        }
        var ext = this.getQueryTimerExtensionWebGL1();
        ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
    };
    GPGPUContext.prototype.isQueryAvailable = function (query, queryTimerVersion) {
        if (queryTimerVersion === 0) {
            return true;
        }
        if (queryTimerVersion === 2) {
            var gl2 = this.gl;
            var ext = this.getQueryTimerExtensionWebGL2();
            var available = gl2.getQueryParameter(query, gl2.QUERY_RESULT_AVAILABLE);
            if (this.disjoint == null) {
                this.disjoint = this.gl.getParameter(ext.GPU_DISJOINT_EXT);
            }
            return available && !this.disjoint;
        }
        else {
            var ext = this.getQueryTimerExtensionWebGL1();
            var available = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_AVAILABLE_EXT);
            if (this.disjoint == null) {
                this.disjoint = this.gl.getParameter(ext.GPU_DISJOINT_EXT);
            }
            return available && !this.disjoint;
        }
    };
    GPGPUContext.prototype.pollQueryTime = function (query) {
        var _this = this;
        return new Promise(function (resolve) {
            var queryTimerVersion = environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION');
            _this.addItemToPoll(function () { return _this.isQueryAvailable(query, queryTimerVersion); }, function () { return resolve(_this.getQueryTime(query, queryTimerVersion)); });
        });
    };
    GPGPUContext.prototype.pollItems = function () {
        var index = binSearchLastTrue(this.itemsToPoll.map(function (x) { return x.isDoneFn; }));
        for (var i = 0; i <= index; ++i) {
            var resolveFn = this.itemsToPoll[i].resolveFn;
            resolveFn();
        }
        this.itemsToPoll = this.itemsToPoll.slice(index + 1);
    };
    GPGPUContext.prototype.addItemToPoll = function (isDoneFn, resolveFn) {
        var _this = this;
        this.itemsToPoll.push({ isDoneFn: isDoneFn, resolveFn: resolveFn });
        if (this.itemsToPoll.length > 1) {
            return;
        }
        util.repeatedTry(function () {
            _this.pollItems();
            return _this.itemsToPoll.length === 0;
        });
    };
    GPGPUContext.prototype.getQueryTime = function (query, queryTimerVersion) {
        if (queryTimerVersion === 0) {
            return null;
        }
        if (queryTimerVersion === 2) {
            var gl2 = this.gl;
            var timeElapsedNanos = gl2.getQueryParameter(query, gl2.QUERY_RESULT);
            return timeElapsedNanos / 1000000;
        }
        else {
            var ext = this.getQueryTimerExtensionWebGL1();
            var timeElapsedNanos = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT);
            return timeElapsedNanos / 1000000;
        }
    };
    GPGPUContext.prototype.downloadMatrixDriverSetup = function (texture) {
        this.throwIfDisposed();
        webgl_util.bindColorTextureToFramebuffer(this.gl, texture, this.framebuffer);
        if (this.autoDebugValidate) {
            webgl_util.validateFramebuffer(this.gl);
        }
    };
    GPGPUContext.prototype.downloadMatrixDriverTeardown = function () {
        if (this.outputTexture != null) {
            webgl_util.bindColorTextureToFramebuffer(this.gl, this.outputTexture, this.framebuffer);
            if (this.autoDebugValidate) {
                webgl_util.validateFramebuffer(this.gl);
            }
        }
        else {
            webgl_util.unbindColorTextureFromFramebuffer(this.gl, this.framebuffer);
        }
    };
    GPGPUContext.prototype.downloadMatrixDriver = function (texture, downloadAndDecode) {
        this.downloadMatrixDriverSetup(texture);
        var result = downloadAndDecode();
        this.downloadMatrixDriverTeardown();
        return result;
    };
    GPGPUContext.prototype.downloadMatrixDriverAsync = function (texture, downloadAndDecode) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.downloadMatrixDriverSetup(texture);
                        return [4, downloadAndDecode()];
                    case 1:
                        result = _a.sent();
                        this.downloadMatrixDriverTeardown();
                        return [2, result];
                }
            });
        });
    };
    GPGPUContext.prototype.setOutputMatrixTextureDriver = function (outputMatrixTextureMaybePacked, width, height) {
        this.throwIfDisposed();
        var gl = this.gl;
        webgl_util.bindColorTextureToFramebuffer(gl, outputMatrixTextureMaybePacked, this.framebuffer);
        if (this.autoDebugValidate) {
            webgl_util.validateFramebuffer(gl);
        }
        this.outputTexture = outputMatrixTextureMaybePacked;
        webgl_util.callAndCheck(gl, function () { return gl.viewport(0, 0, width, height); });
        webgl_util.callAndCheck(gl, function () { return gl.scissor(0, 0, width, height); });
    };
    GPGPUContext.prototype.setOutputMatrixWriteRegionDriver = function (x, y, width, height) {
        var _this = this;
        this.throwIfDisposed();
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.scissor(x, y, width, height); });
    };
    GPGPUContext.prototype.throwIfDisposed = function () {
        if (this.disposed) {
            throw new Error('Attempted to use disposed GPGPUContext.');
        }
    };
    GPGPUContext.prototype.throwIfNoProgram = function () {
        if (this.program == null) {
            throw new Error('No GPU program is currently set.');
        }
    };
    return GPGPUContext;
}());
exports.GPGPUContext = GPGPUContext;
function binSearchLastTrue(arr) {
    var start = 0;
    var end = arr.length - 1;
    var best = -1;
    while (start <= end) {
        var mid = (start + end) >> 1;
        var isDone = arr[mid]();
        if (isDone) {
            best = mid;
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
    return best;
}
exports.binSearchLastTrue = binSearchLastTrue;

},{"../../environment":13,"../../util":131,"./gpgpu_util":48,"./tex_util":67,"./webgl_util":72}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../../util");
var shader_compiler = require("./shader_compiler");
function compileProgram(gpgpu, program, inputs, output) {
    var userCode = program.userCode;
    var inputInfos = inputs.map(function (input, i) {
        var shapeInfo = {
            logicalShape: input.tensor.shape,
            texShape: input.isUniform ? null : input.texData.texShape,
            isUniform: input.isUniform
        };
        return { name: program.variableNames[i], shapeInfo: shapeInfo };
    });
    var inShapeInfos = inputInfos.map(function (x) { return x.shapeInfo; });
    var outShapeInfo = {
        logicalShape: output.tensor.shape,
        texShape: output.texData.texShape,
        isUniform: false
    };
    var source = shader_compiler.makeShader(inputInfos, outShapeInfo, userCode, program.supportsBroadcasting === true);
    var webGLProgram = gpgpu.createProgram(source);
    var uniformLocations = {};
    for (var i = 0; i < program.variableNames.length; i++) {
        var uniformName = program.variableNames[i];
        var shouldThrow = false;
        uniformLocations[uniformName] =
            gpgpu.getUniformLocation(webGLProgram, uniformName, shouldThrow);
    }
    return {
        program: program,
        source: source,
        webGLProgram: webGLProgram,
        uniformLocations: uniformLocations,
        gpgpu: gpgpu,
        inShapeInfos: inShapeInfos,
        outShapeInfo: outShapeInfo
    };
}
exports.compileProgram = compileProgram;
function validateBinaryAndProgram(shapeInfos, inputs) {
    if (shapeInfos.length !== inputs.length) {
        throw Error("Binary was compiled with " + shapeInfos.length + " inputs, but " +
            ("was executed with " + inputs.length + " inputs"));
    }
    shapeInfos.forEach(function (s, i) {
        var shapeA = s.logicalShape;
        var input = inputs[i];
        var shapeB = input.tensor.shape;
        if (!util.arraysEqual(shapeA, shapeB)) {
            throw Error("Binary was compiled with different shapes than " +
                ("the current args. Shapes " + shapeA + " and " + shapeB + " must match"));
        }
        if (s.isUniform && input.isUniform) {
            return;
        }
        var texShapeA = s.texShape;
        var texShapeB = input.isUniform ? null : input.texData.texShape;
        if (!util.arraysEqual(texShapeA, texShapeB)) {
            throw Error("Binary was compiled with different texture shapes than the" +
                (" current args. Shape " + texShapeA + " and " + texShapeB + " must match"));
        }
    });
}
function runProgram(binary, inputs, output, customSetup) {
    validateBinaryAndProgram(binary.inShapeInfos, inputs);
    validateBinaryAndProgram([binary.outShapeInfo], [output]);
    var outTex = output.texData.texture;
    var outTexShape = output.texData.texShape;
    var gpgpu = binary.gpgpu;
    gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
    gpgpu.setProgram(binary.webGLProgram);
    inputs.forEach(function (input, i) {
        var variableName = binary.program.variableNames[i];
        var variableUniformLocation = binary.uniformLocations[variableName];
        if (variableUniformLocation != null) {
            if (input.isUniform) {
                if (input.tensor.size === 1) {
                    gpgpu.gl.uniform1f(variableUniformLocation, input.tensor.dataSync()[0]);
                }
                else {
                    var vals = input.tensor.dataSync();
                    if (!(vals instanceof Float32Array)) {
                        vals = new Float32Array(vals);
                    }
                    gpgpu.gl.uniform1fv(variableUniformLocation, vals);
                }
                return;
            }
            var tex = input.texData.texture;
            gpgpu.setInputMatrixTexture(tex, variableUniformLocation, i);
        }
    });
    if (customSetup != null) {
        customSetup(gpgpu, binary.webGLProgram);
    }
    gpgpu.executeProgram();
}
exports.runProgram = runProgram;
function makeShaderKey(program, inputs, output) {
    var keyInputs = '';
    inputs.concat(output).forEach(function (x) {
        keyInputs +=
            x.tensor.shape + "_" + (x.isUniform ? 'uniform' : x.texData.texShape);
    });
    var keyUserCode = program.userCode;
    var keyBroadcast = (program.supportsBroadcasting === true).toString();
    var key = program.constructor.name;
    key += '_' + keyBroadcast + '_' + keyInputs + '_' + keyUserCode;
    return key;
}
exports.makeShaderKey = makeShaderKey;

},{"../../util":131,"./shader_compiler":64}],48:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var tex_util = require("./tex_util");
var webgl_util = require("./webgl_util");
function getWebGLContextAttributes() {
    return {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        depth: false,
        stencil: false,
        failIfMajorPerformanceCaveat: true
    };
}
exports.getWebGLContextAttributes = getWebGLContextAttributes;
function createWebGLContext(canvas) {
    var attributes = getWebGLContextAttributes();
    var gl;
    if (canvas != null) {
        gl = webgl_util.createWebGLRenderingContextFromCanvas(canvas, attributes);
    }
    else {
        gl = webgl_util.createWebGLRenderingContext(attributes);
    }
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.DEPTH_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.STENCIL_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.BLEND); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.DITHER); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.POLYGON_OFFSET_FILL); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.SAMPLE_COVERAGE); });
    webgl_util.callAndCheck(gl, function () { return gl.enable(gl.SCISSOR_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.enable(gl.CULL_FACE); });
    webgl_util.callAndCheck(gl, function () { return gl.cullFace(gl.BACK); });
    return gl;
}
exports.createWebGLContext = createWebGLContext;
function createVertexShader(gl) {
    var vertexShaderSource = "\n    precision highp float;\n    attribute vec3 clipSpacePos;\n    attribute vec2 uv;\n    varying vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }";
    return webgl_util.createVertexShader(gl, vertexShaderSource);
}
exports.createVertexShader = createVertexShader;
function createVertexBuffer(gl) {
    var vertexArray = new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]);
    return webgl_util.createStaticVertexBuffer(gl, vertexArray);
}
exports.createVertexBuffer = createVertexBuffer;
function createIndexBuffer(gl) {
    var triangleVertexIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
    return webgl_util.createStaticIndexBuffer(gl, triangleVertexIndices);
}
exports.createIndexBuffer = createIndexBuffer;
function getTextureConfig(gl, textureHalfFloatExtension) {
    var glany = gl;
    var internalFormatFloat;
    var internalFormatHalfFloat;
    var internalFormatPackedFloat;
    var textureFormatFloat;
    var downloadTextureFormat;
    var downloadUnpackNumChannels;
    var defaultNumChannels;
    var textureTypeHalfFloat;
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        internalFormatFloat = glany.R32F;
        internalFormatHalfFloat = glany.R16F;
        internalFormatPackedFloat = glany.RGBA32F;
        textureFormatFloat = glany.RED;
        downloadUnpackNumChannels = 4;
        defaultNumChannels = 1;
        textureTypeHalfFloat = glany.HALF_FLOAT;
    }
    else {
        internalFormatFloat = gl.RGBA;
        internalFormatHalfFloat = gl.RGBA;
        internalFormatPackedFloat = glany.RGBA;
        textureFormatFloat = gl.RGBA;
        downloadUnpackNumChannels = 4;
        defaultNumChannels = 4;
        textureTypeHalfFloat = textureHalfFloatExtension != null ?
            textureHalfFloatExtension.HALF_FLOAT_OES :
            null;
    }
    downloadTextureFormat = gl.RGBA;
    return {
        internalFormatFloat: internalFormatFloat,
        internalFormatHalfFloat: internalFormatHalfFloat,
        internalFormatPackedFloat: internalFormatPackedFloat,
        textureFormatFloat: textureFormatFloat,
        downloadTextureFormat: downloadTextureFormat,
        downloadUnpackNumChannels: downloadUnpackNumChannels,
        defaultNumChannels: defaultNumChannels,
        textureTypeHalfFloat: textureTypeHalfFloat
    };
}
exports.getTextureConfig = getTextureConfig;
function createAndConfigureTexture(gl, width, height, internalFormat, textureFormat, textureType) {
    webgl_util.validateTextureSize(gl, width, height);
    var texture = webgl_util.createTexture(gl);
    var tex2d = gl.TEXTURE_2D;
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(tex2d, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MIN_FILTER, gl.NEAREST); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MAG_FILTER, gl.NEAREST); });
    webgl_util.callAndCheck(gl, function () { return gl.texImage2D(tex2d, 0, internalFormat, width, height, 0, textureFormat, textureType, null); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
    return texture;
}
function createFloat32MatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatFloat, textureConfig.textureFormatFloat, gl.FLOAT);
}
exports.createFloat32MatrixTexture = createFloat32MatrixTexture;
function createFloat16MatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatFloat, textureConfig.textureFormatFloat, textureConfig.textureTypeHalfFloat);
}
exports.createFloat16MatrixTexture = createFloat16MatrixTexture;
function createUnsignedBytesMatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
}
exports.createUnsignedBytesMatrixTexture = createUnsignedBytesMatrixTexture;
function createPackedMatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatPackedFloat, gl.RGBA, gl.FLOAT);
}
exports.createPackedMatrixTexture = createPackedMatrixTexture;
function bindVertexProgramAttributeStreams(gl, program, vertexBuffer) {
    var posOffset = 0;
    var uvOffset = 3 * 4;
    var stride = (3 * 4) + (2 * 4);
    webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); });
    var success = webgl_util.bindVertexBufferToProgramAttribute(gl, program, 'clipSpacePos', vertexBuffer, 3, stride, posOffset);
    return success &&
        webgl_util.bindVertexBufferToProgramAttribute(gl, program, 'uv', vertexBuffer, 2, stride, uvOffset);
}
exports.bindVertexProgramAttributeStreams = bindVertexProgramAttributeStreams;
function uploadPixelDataToTexture(gl, texture, pixels) {
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
exports.uploadPixelDataToTexture = uploadPixelDataToTexture;
function uploadDataToTexture(gl, texture, width, height, data, textureFormat) {
    webgl_util.validateTextureSize(gl, width, height);
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, textureFormat, gl.FLOAT, data); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
function uploadMatrixToTexture(gl, texture, rows, columns, matrix, numChannels, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var unpackedArray;
    if (textureConfig.defaultNumChannels === 1) {
        unpackedArray = matrix;
    }
    else {
        unpackedArray =
            new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(matrix.length, numChannels));
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedArray, numChannels);
    }
    uploadDataToTexture(gl, texture, w, h, unpackedArray, textureConfig.textureFormatFloat);
}
exports.uploadMatrixToTexture = uploadMatrixToTexture;
function uploadMatrixToPackedTexture(gl, texture, rows, columns, matrix, textureConfig) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var packedRGBA = new Float32Array(tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
    tex_util.encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA);
    uploadDataToTexture(gl, texture, w, h, packedRGBA, gl.RGBA);
}
exports.uploadMatrixToPackedTexture = uploadMatrixToPackedTexture;
function downloadMatrixFromOutputTextureAsync(gl, getBufferSubDataAsyncExtension, rows, columns, textureConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var gl2, downloadTarget, bufferSizeBytes, buffer, matrix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gl2 = gl;
                    downloadTarget = new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels));
                    bufferSizeBytes = downloadTarget instanceof Float32Array ?
                        downloadTarget.length * 4 :
                        downloadTarget;
                    buffer = gl.createBuffer();
                    webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl2.PIXEL_PACK_BUFFER, buffer); });
                    webgl_util.callAndCheck(gl, function () { return gl.bufferData(gl2.PIXEL_PACK_BUFFER, bufferSizeBytes, gl.STATIC_DRAW); });
                    webgl_util.callAndCheck(gl, function () { return gl2.readPixels(0, 0, columns, rows, gl.RGBA, gl.FLOAT, 0); });
                    return [4, getBufferSubDataAsyncExtension.getBufferSubDataAsync(gl2.PIXEL_PACK_BUFFER, 0, downloadTarget)];
                case 1:
                    _a.sent();
                    matrix = new Float32Array(rows * columns);
                    tex_util.decodeMatrixFromUnpackedArray(downloadTarget, matrix, textureConfig.downloadUnpackNumChannels);
                    return [2, matrix];
            }
        });
    });
}
exports.downloadMatrixFromOutputTextureAsync = downloadMatrixFromOutputTextureAsync;
function downloadFloat32MatrixFromOutputTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var downloadTarget = new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, textureConfig.downloadTextureFormat, gl.FLOAT, downloadTarget); });
    var matrix = new Float32Array(rows * columns);
    tex_util.decodeMatrixFromUnpackedArray(downloadTarget, matrix, textureConfig.downloadUnpackNumChannels);
    return matrix;
}
exports.downloadFloat32MatrixFromOutputTexture = downloadFloat32MatrixFromOutputTexture;
function downloadByteEncodedFloatMatrixFromOutputTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var numChannels = 4;
    var downloadTarget = new Uint8Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, numChannels));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, textureConfig.downloadTextureFormat, gl.UNSIGNED_BYTE, downloadTarget); });
    return new Float32Array(downloadTarget.buffer);
}
exports.downloadByteEncodedFloatMatrixFromOutputTexture = downloadByteEncodedFloatMatrixFromOutputTexture;
function downloadMatrixFromPackedOutputTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var packedRGBA = new Float32Array(tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, packedRGBA); });
    var matrix = new Float32Array(rows * columns);
    return tex_util.decodeMatrixFromPackedRGBA(packedRGBA, rows, columns, matrix);
}
exports.downloadMatrixFromPackedOutputTexture = downloadMatrixFromPackedOutputTexture;

},{"../../environment":13,"./tex_util":67,"./webgl_util":72}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var WhereProgram = (function () {
    function WhereProgram(cRank, shape, rank) {
        this.variableNames = ['c', 'a', 'b'];
        this.outputShape = shape;
        var cCoords;
        var abCoords;
        if (rank > 4) {
            throw Error("Where for rank " + rank + " is not yet supported");
        }
        if (rank === 1) {
            abCoords = "resRC";
            cCoords = "resRC";
        }
        else {
            var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
            var cCoordVars = [];
            var abCoordVars = [];
            for (var i = 0; i < shape.length; i++) {
                abCoordVars.push("" + currentCoords[i]);
                if (i < cRank) {
                    cCoordVars.push("" + currentCoords[i]);
                }
            }
            cCoords = cCoordVars.join();
            abCoords = abCoordVars.join();
        }
        var dtype = shader_compiler_1.getCoordsDataType(rank);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        float cVal = getC(" + cCoords + ");\n        if (cVal >= 1.0) {\n          setOutput(getA(" + abCoords + "));\n        } else {\n          setOutput(getB(" + abCoords + "));\n        }\n      }\n    ";
    }
    return WhereProgram;
}());
exports.WhereProgram = WhereProgram;

},{"./shader_compiler":64}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LRNProgram = (function () {
    function LRNProgram(xShape, radius, bias, alpha, beta) {
        this.variableNames = ['x'];
        this.outputShape = [];
        var rad = radius;
        var maxD = xShape[3] - 1;
        this.outputShape = xShape;
        var powOperator;
        var basis = "float(" + bias + ") + float(" + alpha + ") * sum";
        if (beta === 0.5) {
            powOperator = "inversesqrt(" + basis + ")";
        }
        else if (beta === 1.0) {
            powOperator = "1.0/(" + basis + ")";
        }
        else {
            powOperator = "exp(log(" + basis + ") * float(-" + beta + "));";
        }
        this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n        int d = coords[3];\n        float x = getX(b, r, c, d);\n        float sum = 0.0;\n        for (int j = -" + rad + "; j <= " + rad + "; j++) {\n          int idx = d + j;\n          if (idx >= 0 && idx <=  " + maxD + ") {\n            float z = getX(b, r, c, idx);\n            sum += z * z;\n          }\n        }\n        float val = x * " + powOperator + ";\n        setOutput(val);\n      }\n    ";
    }
    return LRNProgram;
}());
exports.LRNProgram = LRNProgram;

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MaxPool2DBackpropProgram = (function () {
    function MaxPool2DBackpropProgram(convInfo) {
        this.variableNames = ['dy', 'maxPos'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var lastIndex = filterHeight * filterWidth - 1;
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n            int maxPosValue = " + lastIndex + " - int(getMaxPos(b, idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + filterWidth + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return MaxPool2DBackpropProgram;
}());
exports.MaxPool2DBackpropProgram = MaxPool2DBackpropProgram;

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MatMulProgram = (function () {
    function MatMulProgram(aShape, bShape, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        this.variableNames = ['matrixA', 'matrixB'];
        var outerShapeA = transposeA ? aShape[1] : aShape[0];
        var outerShapeB = transposeB ? bShape[0] : bShape[1];
        var sharedDim = transposeA ? aShape[0] : aShape[1];
        this.outputShape = [outerShapeA, outerShapeB];
        var aSnippetFromOffset = function (vec4Offset, indexVar) {
            return transposeA ? indexVar + " + " + vec4Offset + ", aRow" :
                "aRow, " + indexVar + " + " + vec4Offset;
        };
        var bSnippetFromOffset = function (vec4Offset, indexVar) {
            return transposeB ? "bCol, " + indexVar + " + " + vec4Offset :
                indexVar + " + " + vec4Offset + ", bCol";
        };
        var sharedDimNearestVec4 = Math.floor(sharedDim / 4) * 4;
        var sharedDimVec4Remainder = sharedDim % 4;
        this.userCode = " float dotARowBCol(int aRow, int bCol) {\n      float result = 0.0;\n      for (int i = 0; i < " + sharedDimNearestVec4 + "; i += 4) {\n        vec4 a = vec4(\n          getMatrixA(" + aSnippetFromOffset(0, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(1, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(2, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(3, 'i') + ")\n        );\n        vec4 b = vec4(\n          getMatrixB(" + bSnippetFromOffset(0, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(1, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(2, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(3, 'i') + ")\n        );\n\n        result += dot(a, b);\n      }\n\n      if (" + (sharedDimVec4Remainder === 1) + ") {\n        result += getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + ") *\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + ");\n      } else if (" + (sharedDimVec4Remainder === 2) + ") {\n        vec2 a = vec2(\n          getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(1, sharedDimNearestVec4) + ")\n        );\n        vec2 b = vec2(\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(1, sharedDimNearestVec4) + ")\n        );\n        result += dot(a, b);\n      } else if (" + (sharedDimVec4Remainder === 3) + ") {\n        vec3 a = vec3(\n          getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(1, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(2, sharedDimNearestVec4) + ")\n        );\n        vec3 b = vec3(\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(1, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(2, sharedDimNearestVec4) + ")\n        );\n        result += dot(a, b);\n      }\n\n      return result;\n    }\n\n    void main() {\n      ivec2 resRC = getOutputCoords();\n      setOutput(dotARowBCol(resRC.x, resRC.y));\n    }\n    ";
    }
    return MatMulProgram;
}());
exports.MatMulProgram = MatMulProgram;

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultinomialProgram = (function () {
    function MultinomialProgram(batchSize, numOutcomes, numSamples) {
        this.variableNames = ['probs'];
        this.outputShape = [batchSize, numSamples];
        this.userCode = "\n      uniform float seed;\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n\n        float r = random(seed);\n        float cdf = 0.0;\n\n        for (int i = 0; i < " + (numOutcomes - 1) + "; i++) {\n          cdf += getProbs(batch, i);\n\n          if (r < cdf) {\n            setOutput(float(i));\n            return;\n          }\n        }\n\n        // If no other event happened, last event happened.\n        setOutput(float(" + (numOutcomes - 1) + "));\n      }\n    ";
    }
    MultinomialProgram.prototype.getCustomSetupFunc = function (seed) {
        var _this = this;
        return function (gpgpu, webGLProgram) {
            if (_this.seedLoc == null) {
                _this.seedLoc = gpgpu.getUniformLocation(webGLProgram, 'seed');
            }
            gpgpu.gl.uniform1f(_this.seedLoc, seed);
        };
    };
    return MultinomialProgram;
}());
exports.MultinomialProgram = MultinomialProgram;

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OneHotProgram = (function () {
    function OneHotProgram(numIndices, depth, onValue, offValue) {
        this.variableNames = ['indices'];
        this.outputShape = [numIndices, depth];
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int index = round(getIndices(coords.x));\n        setOutput(mix(float(" + offValue + "), float(" + onValue + "),\n                      float(index == coords.y)));\n      }\n    ";
    }
    return OneHotProgram;
}());
exports.OneHotProgram = OneHotProgram;

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var PadProgram = (function () {
    function PadProgram(xShape, paddings, constantValue) {
        this.variableNames = ['x'];
        this.outputShape = paddings.map(function (p, i) { return p[0] + xShape[i] + p[1]; });
        var rank = xShape.length;
        var type = shader_compiler_1.getCoordsDataType(rank);
        var start = paddings.map(function (p) { return p[0]; }).join(',');
        var end = paddings.map(function (p, i) { return p[0] + xShape[i]; }).join(',');
        var unpackedCoords = ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank);
        if (rank === 1) {
            this.userCode = "\n        int start = " + start + ";\n        int end = " + end + ";\n\n        void main() {\n          int outC = getOutputCoords();\n          if (outC < start || outC >= end) {\n            setOutput(float(" + constantValue + "));\n          } else {\n            setOutput(getX(outC - start));\n          }\n        }\n      ";
            return;
        }
        this.userCode = "\n      " + type + " start = " + type + "(" + start + ");\n      " + type + " end = " + type + "(" + end + ");\n\n      void main() {\n        " + type + " outC = getOutputCoords();\n        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {\n          setOutput(float(" + constantValue + "));\n        } else {\n          " + type + " coords = outC - start;\n          setOutput(getX(" + unpackedCoords + "));\n        }\n      }\n    ";
    }
    return PadProgram;
}());
exports.PadProgram = PadProgram;

},{"./shader_compiler":64}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pool2DProgram = (function () {
    function Pool2DProgram(convInfo, poolType, computePositions) {
        this.variableNames = ['x'];
        if (poolType === 'avg' && computePositions) {
            throw new Error('Cannot compute positions for average pool.');
        }
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        this.outputShape = convInfo.outShape;
        var isAvgPool = poolType === 'avg';
        var initializationValue = '0.0';
        if (!isAvgPool) {
            initializationValue = '-1.0 / 0.0';
        }
        if (computePositions) {
            var compareOp_1 = '>=';
            this.userCode = "\n        const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n        const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int batch = coords[0];\n          int d = coords[3];\n\n          ivec2 xRCCorner = coords.yz * strides - pads;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          // max/min x(?, ?, d) to get y(yR, yC, d).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n          float avgValue = 0.0;\n\n          for (int wR = 0; wR < " + filterHeight + "; wR++) {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + filterWidth + "; wC++) {\n              int xC = xCCorner + wC;\n\n              if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, d);\n\n              // If a min / max value has already been found, use it. If not,\n              // use the current value.\n              float currMinMaxValue = mix(\n                  value, minMaxValue, minMaxValueFound);\n              if (value " + compareOp_1 + " currMinMaxValue) {\n                minMaxValue = value;\n                minMaxValueFound = 1.0;\n                minMaxPosition = wR * " + filterWidth + " + wC;\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";
            return;
        }
        var compareOp = 'max';
        var returnValue = poolType + "(" + poolType + "(" + poolType + "(" +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (poolType === 'avg') {
            returnValue = "avgValue / count";
        }
        var filterWidthNearestVec4 = Math.floor(filterWidth / 4) * 4;
        var filterWidthVec4Remainder = filterWidth % 4;
        var updateSnippet = "\n      if (" + isAvgPool + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = " + compareOp + "(values, minMaxValue);\n      }\n    ";
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n      const float initializationValue = " + initializationValue + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xR, int xC, int d) {\n        if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xR, xC, d);\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // max/min x(?, ?, d) to get y(yR, yC, d).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + initializationValue + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidthNearestVec4 + "; wC += 4) {\n            int xC = xCCorner + wC;\n\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + 1, d),\n              getValue(batch, xR, xC + 2, d),\n              getValue(batch, xR, xC + 3, d)\n            );\n\n            " + updateSnippet + "\n          }\n\n          int xC = xCCorner + " + filterWidthNearestVec4 + ";\n          if (" + (filterWidthVec4Remainder === 1) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              initializationValue,\n              initializationValue,\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          } else if (" + (filterWidthVec4Remainder === 2) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + 1, d),\n              initializationValue,\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          } else if (" + (filterWidthVec4Remainder === 3) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + 1, d),\n              getValue(batch, xR, xC + 2, d),\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          }\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
    }
    return Pool2DProgram;
}());
exports.Pool2DProgram = Pool2DProgram;

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReduceProgram = (function () {
    function ReduceProgram(reduceInfo, reduceType) {
        this.variableNames = ['x'];
        var windowSize = reduceInfo.windowSize;
        var batchSize = reduceInfo.batchSize;
        var inSize = reduceInfo.inSize;
        var outSize = Math.ceil(inSize / windowSize);
        this.outputShape = [batchSize, outSize];
        var initializationValue = '0.0';
        var compareOp = "";
        if (reduceType === 'min') {
            initializationValue = '1.0 / 0.0';
            compareOp = "min";
        }
        else if (reduceType === 'max') {
            initializationValue = '-1.0 / 0.0';
            compareOp = "max";
        }
        var returnValue = reduceType + "(" + reduceType + "(" + reduceType + "(" +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (reduceType === 'sum') {
            returnValue = "sumValue";
        }
        else if (reduceType === 'all') {
            returnValue = "allValue";
        }
        else if (reduceType === 'any') {
            returnValue = "anyValue";
        }
        var windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
        var windowSizeVec4Remainder = windowSize % 4;
        var updateSnippet = "\n      if (" + (reduceType === 'sum') + ") {\n        sumValue += dot(values, ones);\n      } else {\n        minMaxValue = " + compareOp + "(values, minMaxValue);\n      }\n    ";
        var vecType = "vec4";
        if (reduceType === 'all') {
            initializationValue = '1.0';
            updateSnippet = "\n        bool reducedAllValue = all(values);\n        float floatedReducedAllValue = float(reducedAllValue);\n        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);\n      ";
            vecType = "bvec4";
        }
        else if (reduceType === 'any') {
            initializationValue = '0.0';
            updateSnippet = "\n        bool reducedAnyValue = any(values);\n        float floatedReducedAnyValue = float(reducedAnyValue);\n        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);\n      ";
            vecType = "bvec4";
        }
        var checkOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkOutOfBounds = "\n        if (inIdx < 0 || inIdx >= " + inSize + ") {\n          return initializationValue;\n        }\n      ";
        }
        this.userCode = "\n      const float initializationValue = " + initializationValue + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int inIdx) {\n        " + checkOutOfBounds + "\n        return getX(batch, inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + windowSize + ";\n\n        vec4 minMaxValue = vec4(" + initializationValue + ");\n        float sumValue = 0.0;\n        float allValue = 1.0;\n        float anyValue = 0.0;\n\n        for (int i = 0; i < " + windowSizeNearestVec4 + "; i += 4) {\n          int inIdx = inOffset + i;\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          " + updateSnippet + "\n        }\n\n        int inIdx = inOffset + " + windowSizeNearestVec4 + ";\n        if (" + (windowSizeVec4Remainder === 1) + ") {\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 2) + ") {\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 3) + ") {\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          " + updateSnippet + "\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
    }
    return ReduceProgram;
}());
exports.ReduceProgram = ReduceProgram;

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeBilinearBackpropProgram = (function () {
    function ResizeBilinearBackpropProgram(dy, x, alignCorners) {
        this.variableNames = ['dy'];
        this.outputShape = [];
        this.outputShape = x.shape;
        var _a = x.shape, xHeight = _a[1], xWidth = _a[2];
        var _b = dy.shape, yHeight = _b[1], yWidth = _b[2];
        var effectiveXSize = [
            (alignCorners && yHeight > 1) ? xHeight - 1 : xHeight,
            (alignCorners && yWidth > 1) ? xWidth - 1 : xWidth
        ];
        var effectiveYSize = [
            (alignCorners && yHeight > 1) ? yHeight - 1 : yHeight,
            (alignCorners && yWidth > 1) ? yWidth - 1 : yWidth
        ];
        var heightScale = effectiveXSize[0] / effectiveYSize[0];
        var widthScale = effectiveXSize[1] / effectiveYSize[1];
        var invHeightScale = 1 / heightScale;
        var invWidthScale = 1 / widthScale;
        var winHeight = (Math.ceil(invHeightScale) * 2) + 2;
        var winWidth = (Math.ceil(invWidthScale) * 2) + 2;
        this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + heightScale + ");\n        const float widthScale = float(" + widthScale + ");\n\n        const float invHeightScale = float(" + invHeightScale + ");\n        const float invWidthScale = float(" + invWidthScale + ");\n\n        const int winHeight = int(" + winHeight + ");\n        const int winWidth = int(" + winWidth + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(startRLerp - float(winHeight / 2));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(startCLerp - float(winWidth / 2));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + yHeight + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + yWidth + ") {\n              continue;\n            }\n\n            float dxR = float(dyR) * heightScale;\n            int topDxRIndex = int(floor(dxR));\n            int bottomDxRIndex = int(min(ceil(dxR), " + (xHeight - 1) + ".0));\n            float dxRLerp = dxR - float(topDxRIndex);\n            float inverseDxRLerp = 1.0 - dxRLerp;\n\n            float dxC = float(dyC) * widthScale;\n            int leftDxCIndex = int(floor(dxC));\n            int rightDxCIndex = int(min(ceil(dxC), " + (xWidth - 1) + ".0));\n            float dxCLerp = dxC - float(leftDxCIndex);\n            float inverseDxCLerp = 1.0 - dxCLerp;\n\n            if (r == topDxRIndex && c == leftDxCIndex) {\n              // topLeft\n              accumulator +=\n                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;\n            }\n\n            if (r == topDxRIndex && c == rightDxCIndex) {\n              // topRight\n              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == leftDxCIndex) {\n              // bottomLeft\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == rightDxCIndex) {\n              // bottomRight\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
    }
    return ResizeBilinearBackpropProgram;
}());
exports.ResizeBilinearBackpropProgram = ResizeBilinearBackpropProgram;

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeBilinearProgram = (function () {
    function ResizeBilinearProgram(inputShape, newHeight, newWidth, alignCorners) {
        this.variableNames = ['A'];
        this.outputShape = [];
        var batch = inputShape[0], oldHeight = inputShape[1], oldWidth = inputShape[2], depth = inputShape[3];
        this.outputShape = [batch, newHeight, newWidth, depth];
        var effectiveInSize = [
            (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
            (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
        ];
        var effectiveOutSize = [
            (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
            (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
        ];
        this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + effectiveInSize[0] / effectiveOutSize[0] + ",\n          " + effectiveInSize[1] / effectiveOutSize[1] + ");\n      const vec2 inputShapeRC = vec2(" + oldHeight + ".0, " + oldWidth + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n        ivec2 sourceCeilRC = ivec2(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n\n        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);\n        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);\n        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);\n        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n        float top = topLeft + (topRight - topLeft) * fracRC.y;\n        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n        float newValue = top + (bottom - top) * fracRC.x;\n\n        setOutput(newValue);\n      }\n    ";
    }
    return ResizeBilinearProgram;
}());
exports.ResizeBilinearProgram = ResizeBilinearProgram;

},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeNearestNeigborBackpropProgram = (function () {
    function ResizeNearestNeigborBackpropProgram(dy, x, alignCorners) {
        this.variableNames = ['dy'];
        this.outputShape = [];
        this.outputShape = x.shape;
        var _a = x.shape, xHeight = _a[1], xWidth = _a[2];
        var _b = dy.shape, yHeight = _b[1], yWidth = _b[2];
        var effectiveXSize = [
            (alignCorners && yHeight > 1) ? xHeight - 1 : xHeight,
            (alignCorners && yWidth > 1) ? xWidth - 1 : xWidth
        ];
        var effectiveYSize = [
            (alignCorners && yHeight > 1) ? yHeight - 1 : yHeight,
            (alignCorners && yWidth > 1) ? yWidth - 1 : yWidth
        ];
        var heightScale = effectiveXSize[0] / effectiveYSize[0];
        var widthScale = effectiveXSize[1] / effectiveYSize[1];
        var invHeightScale = 1 / heightScale;
        var invWidthScale = 1 / widthScale;
        var winHeight = (Math.ceil(invHeightScale) * 2) + 2;
        var winWidth = (Math.ceil(invWidthScale) * 2) + 2;
        this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + heightScale + ");\n        const float widthScale = float(" + widthScale + ");\n\n        const float invHeightScale = float(" + invHeightScale + ");\n        const float invWidthScale = float(" + invWidthScale + ");\n\n        const int winHeight = int(" + winHeight + ");\n        const int winWidth = int(" + winWidth + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(floor(startRLerp - float(winHeight / 2)));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(floor(startCLerp - float(winWidth / 2)));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + yHeight + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + yWidth + ") {\n              continue;\n            }\n\n            float sourceFracRow =\n              float(" + effectiveXSize[0] + ") *\n                (float(dyR) / float(" + effectiveYSize[0] + "));\n\n            float sourceFracCol =\n                float(" + effectiveXSize[1] + ") *\n                  (float(dyC) / float(" + effectiveYSize[1] + "));\n\n            int sourceNearestRow = int(min(\n                float(int(" + xHeight + ") - 1),\n                " + alignCorners + " ? float(round(sourceFracRow)) :\n                                  float(floor(sourceFracRow))));\n\n            int sourceNearestCol = int(min(\n                float(int(" + xWidth + ") - 1),\n                " + alignCorners + " ? float(round(sourceFracCol)) :\n                                  float(floor(sourceFracCol))));\n\n            if (r == sourceNearestRow && c == sourceNearestCol) {\n              accumulator += getDy(b, dyR, dyC, d);\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
    }
    return ResizeNearestNeigborBackpropProgram;
}());
exports.ResizeNearestNeigborBackpropProgram = ResizeNearestNeigborBackpropProgram;

},{}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeNearestNeighborProgram = (function () {
    function ResizeNearestNeighborProgram(inputShape, newHeight, newWidth, alignCorners) {
        this.variableNames = ['A'];
        this.outputShape = [];
        var batch = inputShape[0], oldHeight = inputShape[1], oldWidth = inputShape[2], depth = inputShape[3];
        this.outputShape = [batch, newHeight, newWidth, depth];
        var effectiveInSize = [
            (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
            (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
        ];
        var effectiveOutSize = [
            (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
            (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
        ];
        var roundBase = alignCorners ? '0.5' : '0.0';
        this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + effectiveInSize[0] / effectiveOutSize[0] + ",\n          " + effectiveInSize[1] / effectiveOutSize[1] + ");\n      const vec2 inputShapeRC = vec2(" + oldHeight + ".0, " + oldWidth + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the coordinators of nearest neighbor point.\n        ivec2 sourceNearestRC = ivec2(\n          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + " + roundBase + ")));\n\n        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);\n\n        setOutput(newValue);\n      }\n    ";
    }
    return ResizeNearestNeighborProgram;
}());
exports.ResizeNearestNeighborProgram = ResizeNearestNeighborProgram;

},{}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var ReverseProgram = (function () {
    function ReverseProgram(xShape, axis) {
        this.variableNames = ['x'];
        var rank = xShape.length;
        if (rank > 4) {
            throw new Error("WebGL backend: Reverse of rank-" + rank + " tensor is not yet supported");
        }
        this.outputShape = xShape;
        if (rank === 1) {
            this.userCode = "\n        void main() {\n          int coord = getOutputCoords();\n          setOutput(getX(" + xShape[0] + " - coord - 1));\n        }\n      ";
            return;
        }
        var getInCoord = function (i) {
            if (axis.indexOf(i) !== -1 && xShape[i] !== 1) {
                return xShape[i] + " - coords[" + i + "] - 1";
            }
            return "coords[" + i + "]";
        };
        var inCoords = xShape.map(function (_, i) { return getInCoord(i); }).join(',');
        var type = shader_compiler_1.getCoordsDataType(rank);
        this.userCode = "\n      void main() {\n        " + type + " coords = getOutputCoords();\n        setOutput(getX(" + inCoords + "));\n      }\n    ";
    }
    return ReverseProgram;
}());
exports.ReverseProgram = ReverseProgram;

},{"./shader_compiler":64}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SegmentOpProgram = (function () {
    function SegmentOpProgram(segOpInfo, segOpType) {
        this.variableNames = ['x', 'segmentIds'];
        var windowSize = segOpInfo.windowSize;
        var batchSize = segOpInfo.batchSize;
        var inSize = segOpInfo.inSize;
        var numSegments = segOpInfo.numSegments;
        var outSize = numSegments * Math.ceil(inSize / windowSize);
        this.outputShape = [batchSize, outSize];
        var initializationValue = '0.0';
        var returnValue = "sumValue";
        var windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
        var windowSizeVec4Remainder = windowSize % 4;
        var updateSnippet = "\n        sumValue += dot(values, filter);\n    ";
        var checkValueOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkValueOutOfBounds = "\n        if (inIdx < 0 || inIdx >= " + inSize + ") {\n          return initializationValue;\n        }\n      ";
        }
        var checkSegmentIdOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkSegmentIdOutOfBounds = "\n        if (inIdx < 0 || inIdx >= " + inSize + ") {\n          return -1.0;\n        }\n      ";
        }
        this.userCode = "\n      const float initializationValue = " + initializationValue + ";\n\n      float getValue(int batch, int inIdx) {\n        " + checkValueOutOfBounds + "\n        return getX(batch, inIdx);\n      }\n\n      float getSegmentIdAtIndex(int inIdx) {\n        " + checkSegmentIdOutOfBounds + "\n        return getSegmentIds(inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = int(floor(float(outIdx) / float(\n          " + numSegments + ")) * float(" + windowSize + "));\n        int currentSeg = int(mod(float(outIdx), float(" + numSegments + ")));\n\n        float sumValue = 0.0;\n\n        for (int i = 0; i < " + windowSizeNearestVec4 + "; i += 4) {\n          int inIdx = inOffset + i;\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          vec4 filter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0\n          );\n\n          " + updateSnippet + "\n        }\n\n        int inIdx = inOffset + " + windowSizeNearestVec4 + ";\n        if (" + (windowSizeVec4Remainder === 1) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));\n\n          vec4 filter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            0,\n            0,\n            0\n          );\n\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 2) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          vec4 filter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n              0,\n              0\n          );\n\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 3) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          vec4 filter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            0\n          );\n\n          " + updateSnippet + "\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
    }
    return SegmentOpProgram;
}());
exports.SegmentOpProgram = SegmentOpProgram;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var util = require("../../util");
function makeShader(inputsInfo, outputShape, userCode, broadcast) {
    var inputPrefixSnippet = inputsInfo.map(function (x) {
        var size = util.sizeFromShape(x.shapeInfo.logicalShape);
        if (x.shapeInfo.isUniform) {
            return "uniform float " + x.name + (size > 1 ? "[" + size + "]" : '') + ";";
        }
        return "uniform sampler2D " + x.name + ";";
    });
    inputPrefixSnippet = inputPrefixSnippet.join('\n');
    var inputSamplingSnippet = inputsInfo.map(function (x) { return getInputSamplingSnippet(x, outputShape, broadcast); })
        .join('\n');
    var outTexShape = outputShape.texShape;
    var outputSamplingSnippet = getOutputSamplingSnippet(outputShape.logicalShape, outTexShape);
    var source = [
        SHADER_PREFIX, FLOAT_TEXTURE_SAMPLE_SNIPPET,
        FLOAT_TEXTURE_SETOUTPUT_SNIPPET, inputPrefixSnippet, outputSamplingSnippet,
        inputSamplingSnippet, userCode
    ].join('\n');
    return source;
}
exports.makeShader = makeShader;
function getSamplerFromInInfo(inInfo) {
    var shape = inInfo.shapeInfo.logicalShape;
    switch (shape.length) {
        case 0:
            return getSamplerScalar(inInfo);
        case 1:
            return getSampler1D(inInfo);
        case 2:
            return getSampler2D(inInfo);
        case 3:
            return getSampler3D(inInfo);
        case 4:
            return getSampler4D(inInfo);
        case 5:
            return getSampler5D(inInfo);
        case 6:
            return getSampler6D(inInfo);
        default:
            throw new Error(shape.length + "-D input sampling" +
                " is not yet supported");
    }
}
function getInputSamplingSnippet(inInfo, outShapeInfo, broadcast) {
    var res = getSamplerFlat(inInfo);
    res += getSamplerFromInInfo(inInfo);
    if (broadcast ||
        util.arraysEqual(inInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape)) {
        res += getSamplerAtOutputCoords(inInfo, outShapeInfo, broadcast);
    }
    return res;
}
function getOutputSamplingSnippet(outShape, outTexShape) {
    switch (outShape.length) {
        case 0:
            return getOutputScalarCoords();
        case 1:
            return getOutput1DCoords(outShape, outTexShape);
        case 2:
            return getOutput2DCoords(outShape, outTexShape);
        case 3:
            return getOutput3DCoords(outShape, outTexShape);
        case 4:
            return getOutput4DCoords(outShape, outTexShape);
        case 5:
            return getOutput5DCoords(outShape, outTexShape);
        case 6:
            return getOutput6DCoords(outShape, outTexShape);
        default:
            throw new Error(outShape.length + "-D output sampling is not yet supported");
    }
}
var SAMPLE_1D_SNIPPET = "\nvec2 UVfrom1D(int texNumR, int texNumC, int index) {\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_2D_SNIPPET = "\nvec2 UVfrom2D(int texNumR, int texNumC, int numC, int row, int col) {\n  int index = row * numC + col;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_3D_SNIPPET = "\nvec2 UVfrom3D(int texNumR, int texNumC, int stride0,\n    int stride1, int row, int col, int depth) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_4D_SNIPPET = "\nvec2 UVfrom4D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int row, int col, int depth,\n    int depth2) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth * stride2 + depth2;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_5D_SNIPPET = "\nvec2 UVfrom5D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int stride3, int row, int col, int depth,\n    int depth2, int depth3) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 +\n              depth * stride2 + depth2 * stride3 + depth3;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_6D_SNIPPET = "\nvec2 UVfrom6D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int stride3, int stride4,\n    int row, int col, int depth, int depth2, int depth3, int depth4) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth * stride2 + depth2 *\n    stride3 + depth3 * stride4 + depth4;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var FLOAT_TEXTURE_SAMPLE_SNIPPET = "\n  float sampleTexture(sampler2D textureSampler, vec2 uv) {\n    return texture2D(textureSampler, uv).r;\n  }\n";
var FLOAT_TEXTURE_SETOUTPUT_SNIPPET = "\n  void setOutput(float val) {\n    gl_FragColor = vec4(val, 0, 0, 0);\n  }\n";
var SHADER_PREFIX = "\n  precision highp float;\n  precision highp int;\n  varying vec2 resultUV;\n  const vec2 halfCR = vec2(0.5, 0.5);\n\n  struct ivec5\n  {\n    int x;\n    int y;\n    int z;\n    int w;\n    int u;\n  };\n\n  struct ivec6\n  {\n    int x;\n    int y;\n    int z;\n    int w;\n    int u;\n    int v;\n  };\n\n  bool isNaN(float val) {\n    return (val < 0.0 || 0.0 < val || val == 0.0) ? false : true;\n  }\n\n  bool hasNaN(vec4 values) {\n    vec4 v1 = values * values;\n    vec4 v2 = values * values;\n    return any(notEqual(v1, v2));\n  }\n\n  float getNaN(vec4 values) {\n    return dot(vec4(1), values);\n  }\n\n  int round(float value) {\n    return int(floor(value + 0.5));\n  }\n\n  int imod(int x, int y) {\n    return x - y * (x / y);\n  }\n\n  //Based on the work of Dave Hoskins\n  //https://www.shadertoy.com/view/4djSRW\n  #define HASHSCALE1 443.8975\n  float random(float seed){\n    vec2 p = resultUV * seed;\n    vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);\n    p3 += dot(p3, p3.yzx + 19.19);\n    return fract((p3.x + p3.y) * p3.z);\n  }\n\n  " + SAMPLE_1D_SNIPPET + "\n  " + SAMPLE_2D_SNIPPET + "\n  " + SAMPLE_3D_SNIPPET + "\n  " + SAMPLE_4D_SNIPPET + "\n  " + SAMPLE_5D_SNIPPET + "\n  " + SAMPLE_6D_SNIPPET + "\n";
function getOutputScalarCoords() {
    return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";
}
function getOutput1DCoords(shape, texShape) {
    if (texShape[0] === 1) {
        return "\n      int getOutputCoords() {\n        return int(resultUV.x * " + texShape[1] + ".0);\n      }\n    ";
    }
    if (texShape[1] === 1) {
        return "\n      int getOutputCoords() {\n        return int(resultUV.y * " + texShape[0] + ".0);\n      }\n    ";
    }
    return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + texShape[0] + ", " + texShape[1] + "));\n      return resTexRC.x * " + texShape[1] + " + resTexRC.y;\n    }\n  ";
}
function getOutput3DCoords(shape, texShape) {
    var stride0 = shape[1] * shape[2];
    var stride1 = shape[2];
    return "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n      int r = index / " + stride0 + ";\n      index -= r * " + stride0 + ";\n      int c = index / " + stride1 + ";\n      int d = index - c * " + stride1 + ";\n      return ivec3(r, c, d);\n    }\n  ";
}
function getOutput4DCoords(shape, texShape) {
    var stride2 = shape[3];
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    return "\n    ivec4 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n\n      int r = index / " + stride0 + ";\n      index -= r * " + stride0 + ";\n\n      int c = index / " + stride1 + ";\n      index -= c * " + stride1 + ";\n\n      int d = index / " + stride2 + ";\n      int d2 = index - d * " + stride2 + ";\n\n      return ivec4(r, c, d, d2);\n    }\n  ";
}
function getOutput5DCoords(shape, texShape) {
    var stride3 = shape[4];
    var stride2 = shape[3] * stride3;
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    return "\n    ivec5 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx * vec2(" + texShape[0] + ",\n                             " + texShape[1] + "));\n\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n\n      int r = index / " + stride0 + ";\n      index -= r * " + stride0 + ";\n\n      int c = index / " + stride1 + ";\n      index -= c * " + stride1 + ";\n\n      int d = index / " + stride2 + ";\n      index -= d * " + stride2 + ";\n\n      int d2 = index  / " + stride3 + ";\n      int d3 = index - d2 * " + stride3 + ";\n\n      ivec5 outShape = ivec5(r, c, d, d2, d3);\n      return outShape;\n    }\n  ";
}
function getOutput6DCoords(shape, texShape) {
    var stride4 = shape[5];
    var stride3 = shape[4] * stride4;
    var stride2 = shape[3] * stride3;
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    return "\n    ivec6 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n\n      int r = index / " + stride0 + ";\n      index -= r * " + stride0 + ";\n\n      int c = index / " + stride1 + ";\n      index -= c * " + stride1 + ";\n\n      int d = index / " + stride2 + ";\n      index -= d * " + stride2 + ";\n\n      int d2 = index / " + stride3 + ";\n      index -= d2 * " + stride3 + ";\n\n      int d3 = index / " + stride4 + ";\n      int d4 = index - d3 * " + stride4 + ";\n\n      ivec6 result = ivec6(r, c, d, d2, d3, d4);\n      return result;\n    }\n  ";
}
function getOutput2DCoords(shape, texShape) {
    if (util.arraysEqual(shape, texShape)) {
        return "\n      ivec2 getOutputCoords() {\n        return ivec2(resultUV.yx * vec2(" + texShape[0] + ", " + texShape[1] + "));\n      }\n    ";
    }
    if (shape[1] === 1) {
        return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + texShape[0] + ", " + texShape[1] + "));\n        int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n        return ivec2(index, 0);\n      }\n    ";
    }
    if (shape[0] === 1) {
        return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + texShape[0] + ", " + texShape[1] + "));\n        int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n        return ivec2(0, index);\n      }\n    ";
    }
    return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n      int r = index / " + shape[1] + ";\n      int c = index - r * " + shape[1] + ";\n      return ivec2(r, c);\n    }\n  ";
}
function getSamplerScalar(inputInfo) {
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    if (inputInfo.shapeInfo.isUniform) {
        return "float " + funcName + "() {return " + texName + ";}";
    }
    return "\n    float " + funcName + "() {\n      return sampleTexture(" + texName + ", halfCR);\n    }\n  ";
}
function getSampler1D(inputInfo) {
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    return "\n    float " + funcName + "(int index) {\n      return " + funcName + "Flat(index);\n    }\n  ";
}
function getSampler2D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var texShape = inputInfo.shapeInfo.texShape;
    if (texShape != null && util.arraysEqual(shape, texShape)) {
        var texNumR_1 = texShape[0];
        var texNumC_1 = texShape[1];
        return "\n    float " + funcName + "(int row, int col) {\n      vec2 uv = (vec2(col, row) + halfCR) / vec2(" + texNumC_1 + ".0, " + texNumR_1 + ".0);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
    }
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    var squeezedShape = newShape;
    if (squeezedShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        var params = ['row', 'col'];
        return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
    }
    if (inputInfo.shapeInfo.isUniform) {
        return "\n      float " + funcName + "(int row, int col) {\n        int index = row * " + shape[1] + " + col;\n        return " + funcName + "Flat(index);\n      }\n    ";
    }
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    if (texNumC === 1) {
        return "\n    float " + funcName + "(int row, int col) {\n      int index = row * " + shape[1] + " + col;\n      vec2 uv = vec2(0.5, (float(index) + 0.5) / " + texNumR + ".0);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
    }
    if (texNumR === 1) {
        return "\n    float " + funcName + "(int row, int col) {\n      int index = row * " + shape[1] + " + col;\n      vec2 uv = vec2((float(index) + 0.5) / " + texNumC + ".0, 0.5);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
    }
    return "\n  float " + funcName + "(int row, int col) {\n    vec2 uv = UVfrom2D(" + texNumR + ", " + texNumC + ", " + shape[1] + ", row, col);\n    return sampleTexture(" + texName + ", uv);\n  }\n";
}
function getSampler3D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var stride0 = shape[1] * shape[2];
    var stride1 = shape[2];
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    var squeezedShape = newShape;
    if (squeezedShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        var params = ['row', 'col', 'depth'];
        return "\n        " + getSamplerFromInInfo(newInputInfo) + "\n        float " + funcName + "(int row, int col, int depth) {\n          return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n        }\n      ";
    }
    if (inputInfo.shapeInfo.isUniform) {
        return "\n      float " + funcName + "(int row, int col, int depth) {\n        int index = row * " + stride0 + " + col * " + stride1 + " + depth;\n        return " + funcName + "Flat(index);\n      }\n    ";
    }
    var texShape = inputInfo.shapeInfo.texShape;
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    if (texNumC === stride0) {
        return "\n        float " + funcName + "(int row, int col, int depth) {\n          int texR = row;\n          int texC = col * " + stride1 + " + depth;\n          vec2 uv = (vec2(texC, texR) + halfCR) /\n                     vec2(" + texNumC + ".0, " + texNumR + ".0);\n          return sampleTexture(" + texName + ", uv);\n        }\n      ";
    }
    if (texNumC === stride1) {
        return "\n    float " + funcName + "(int row, int col, int depth) {\n      int texR = row * " + shape[1] + " + col;\n      int texC = depth;\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + texNumC + ".0, " + texNumR + ".0);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
    }
    return "\n      float " + funcName + "(int row, int col, int depth) {\n        vec2 uv = UVfrom3D(\n            " + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ", row, col, depth);\n        return sampleTexture(" + texName + ", uv);\n      }\n  ";
}
function getSampler4D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var stride2 = shape[3];
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    if (newShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, newShape);
        var params = ['row', 'col', 'depth', 'depth2'];
        return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
    }
    if (inputInfo.shapeInfo.isUniform) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        int index = row * " + stride0 + " + col * " + stride1 + " +\n            depth * " + stride2 + " + depth2;\n        return " + funcName + "Flat(index);\n      }\n    ";
    }
    var texShape = inputInfo.shapeInfo.texShape;
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    if (texNumC === stride0) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        int texR = row;\n        int texC = col * " + stride1 + " + depth * " + stride2 + " + depth2;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    if (texNumC === stride2) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        int texR = row * " + shape[1] * shape[2] + " + col * " + shape[2] + " + depth;\n        int texC = depth2;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    return "\n    float " + funcName + "(int row, int col, int depth, int depth2) {\n      vec2 uv = UVfrom4D(" + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ",\n          " + stride2 + ", row, col, depth, depth2);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
}
function getSampler5D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var stride3 = shape[4];
    var stride2 = shape[3] * stride3;
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    if (newShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, newShape);
        var params = ['row', 'col', 'depth', 'depth2', 'depth3'];
        return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
    }
    if (inputInfo.shapeInfo.isUniform) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        int index = row * " + stride0 + " + col * " + stride1 + " +\n            depth * " + stride2 + " + depth2 * " + stride3 + " + depth3;\n        return " + funcName + "Flat(index);\n      }\n    ";
    }
    var texShape = inputInfo.shapeInfo.texShape;
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    if (texNumC === stride0) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        int texR = row;\n        int texC = col * " + stride1 + " + depth * " + stride2 + " +\n                   depth2 * " + stride3 + " + depth3;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    if (texNumC === stride3) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        int texR = row * " + shape[1] * shape[2] + " + col * " + shape[2] + " +\n                   depth * " + shape[3] + " + depth2;\n        int texC = depth3;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    return "\n    float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n      vec2 uv = UVfrom5D(" + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ",\n          " + stride2 + ", " + stride3 + ", row, col, depth, depth2, depth3);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
}
function getSampler6D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var stride4 = shape[5];
    var stride3 = shape[4] * stride4;
    var stride2 = shape[3] * stride3;
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    if (newShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, newShape);
        var params = ['row', 'col', 'depth', 'depth2', 'depth3', 'depth4'];
        return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
    }
    if (inputInfo.shapeInfo.isUniform) {
        return "\n      float " + funcName + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n        int index = row * " + stride0 + " + col * " + stride1 + " +\n            depth * " + stride2 + " + depth2 * " + stride3 + " + depth3 * " + stride3 + "\n            + depth4\n        return " + funcName + "Flat(index);\n      }\n    ";
    }
    var texShape = inputInfo.shapeInfo.texShape;
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    if (texNumC === stride0) {
        return "\n      float " + funcName + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        int texR = row;\n        int texC = col * " + stride1 + " + depth * " + stride2 + " + depth2;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    if (texNumC === stride4) {
        return "\n      float " + funcName + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        int texR = row * " + shape[1] * shape[2] + " + col * " + shape[2] + " + depth;\n        int texC = depth4;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    return "\n    float " + funcName + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n      vec2 uv = UVfrom6D(" + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ",\n          " + stride2 + ", " + stride3 + ", " + stride4 + "\n          ,row, col, depth, depth2, depth3, depth4);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
}
function getSamplerFlat(inputInfo) {
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1) + 'Flat';
    var inSize = util.sizeFromShape(inputInfo.shapeInfo.logicalShape);
    if (inputInfo.shapeInfo.isUniform) {
        if (inSize === 1) {
            return "float " + funcName + "(int index) {return " + texName + ";}";
        }
        return "\n      float " + funcName + "(int index) {\n        for (int i = 0; i < " + inSize + "; i++) {\n          if (i == index) {\n            return " + texName + "[i];\n          }\n        }\n      }\n    ";
    }
    var texShape = inputInfo.shapeInfo.texShape;
    var tNumR = texShape[0];
    var tNumC = texShape[1];
    if (tNumC === 1 && tNumR === 1) {
        return "\n      float " + funcName + "(int index) {\n        return sampleTexture(" + texName + ", halfCR);\n      }\n    ";
    }
    if (tNumC === 1) {
        return "\n      float " + funcName + "(int index) {\n        vec2 uv = vec2(0.5, (float(index) + 0.5) / " + tNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    if (tNumR === 1) {
        return "\n      float " + funcName + "(int index) {\n        vec2 uv = vec2((float(index) + 0.5) / " + tNumC + ".0, 0.5);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
    }
    return "\n    float " + funcName + "(int index) {\n      vec2 uv = UVfrom1D(" + tNumR + ", " + tNumC + ", index);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
}
function getBroadcastOutputCoordsSampler(inputInfo, outShapeInfo, texFuncSnippet, funcName) {
    var inRank = inputInfo.shapeInfo.logicalShape.length;
    var outRank = outShapeInfo.logicalShape.length;
    var type = 'int';
    if (outRank === 2) {
        type = 'ivec2';
    }
    else if (outRank === 3) {
        type = 'ivec3';
    }
    else if (outRank === 4) {
        type = 'ivec4';
    }
    var broadcastDims = broadcast_util.getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
    var rankDiff = outRank - inRank;
    var coordsSnippet;
    if (inRank === 0) {
        coordsSnippet = '';
    }
    else if (outRank < 2 && broadcastDims.length >= 1) {
        coordsSnippet = 'coords = 0;';
    }
    else {
        coordsSnippet =
            broadcastDims.map(function (d) { return "coords[" + (d + rankDiff) + "] = 0;"; }).join('\n');
    }
    var unpackedCoordsSnippet = '';
    if (outRank < 2 && inRank > 0) {
        unpackedCoordsSnippet = 'coords';
    }
    else {
        unpackedCoordsSnippet = inputInfo.shapeInfo.logicalShape
            .map(function (s, i) { return "coords[" + (i + rankDiff) + "]"; })
            .join(', ');
    }
    return "\n    float " + funcName + "() {\n      " + type + " coords = getOutputCoords();\n      " + coordsSnippet + "\n      return get" + texFuncSnippet + "(" + unpackedCoordsSnippet + ");\n    }\n  ";
}
function getSamplerAtOutputCoords(inputInfo, outShapeInfo, supportsBroadcasting) {
    var texName = inputInfo.name;
    var texFuncSnippet = texName.charAt(0).toUpperCase() + texName.slice(1);
    var funcName = 'get' + texFuncSnippet + 'AtOutCoords';
    var broadcastDims = broadcast_util.getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
    var inRank = inputInfo.shapeInfo.logicalShape.length;
    var outRank = outShapeInfo.logicalShape.length;
    var doBroadcast = supportsBroadcasting && ((outRank > inRank) || broadcastDims.length > 0);
    var broadcastOverOuter = broadcast_util.broadcastDimsAreOuter(broadcastDims);
    var isUniform = inputInfo.shapeInfo.isUniform;
    if (doBroadcast && !broadcastOverOuter) {
        return getBroadcastOutputCoordsSampler(inputInfo, outShapeInfo, texFuncSnippet, funcName);
    }
    var inSize = util.sizeFromShape(inputInfo.shapeInfo.logicalShape);
    var broadcastSnippet = '';
    if (doBroadcast && broadcastOverOuter) {
        broadcastSnippet = "\n        int mainPart = index / " + inSize + ";\n        index -= mainPart * " + inSize + ";\n      ";
    }
    var outTexShape = outShapeInfo.texShape;
    if (isUniform) {
        if (inSize === 1) {
            return "float " + funcName + "() {return " + texName + ";}";
        }
        return "\n      float " + funcName + "() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                              vec2(" + outTexShape[0] + ", " + outTexShape[1] + "));\n        int index = resTexRC.x * " + outTexShape[1] + " + resTexRC.y;\n        " + broadcastSnippet + "\n        return get" + texFuncSnippet + "Flat(index);\n      }\n    ";
    }
    var inTexShape = inputInfo.shapeInfo.texShape;
    if (util.arraysEqual(inTexShape, outTexShape)) {
        return "\n      float " + funcName + "() {\n        return sampleTexture(" + texName + ", resultUV);\n      }\n    ";
    }
    return "\n    float " + funcName + "() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + outTexShape[0] + ", " + outTexShape[1] + "));\n      int index = resTexRC.x * " + outTexShape[1] + " + resTexRC.y;\n      " + broadcastSnippet + "\n      int texR = index / " + inTexShape[1] + ";\n      int texC = index - texR * " + inTexShape[1] + ";\n      vec2 uv = (vec2(texC, texR) + halfCR) /\n                 vec2(" + inTexShape[1] + ".0, " + inTexShape[0] + ".0);\n\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
}
function getCoordsDataType(rank) {
    if (rank <= 1) {
        return 'int';
    }
    else if (rank === 2) {
        return 'ivec2';
    }
    else if (rank === 3) {
        return 'ivec3';
    }
    else if (rank === 4) {
        return 'ivec4';
    }
    else if (rank === 5) {
        return 'ivec5';
    }
    else if (rank === 6) {
        return 'ivec6';
    }
    else {
        throw Error("GPU for rank " + rank + " is not yet supported");
    }
}
exports.getCoordsDataType = getCoordsDataType;
function squeezeInputInfo(inInfo, squeezedShape) {
    var newInputInfo = JSON.parse(JSON.stringify(inInfo));
    newInputInfo.shapeInfo.logicalShape = squeezedShape;
    return newInputInfo;
}
function getSqueezedParams(params, keptDims) {
    return keptDims.map(function (d) { return params[d]; }).join(', ');
}

},{"../../ops/broadcast_util":77,"../../util":131}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var SliceProgram = (function () {
    function SliceProgram(destSize) {
        this.variableNames = ['source'];
        this.outputShape = destSize;
        this.rank = destSize.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var sourceCoords = getCoords(this.rank);
        this.userCode = "\n      uniform " + dtype + " start;\n\n      void main() {\n        " + dtype + " sourceLoc = start + getOutputCoords();\n        setOutput(getSource(" + sourceCoords + "));\n      }\n    ";
    }
    SliceProgram.prototype.getCustomSetupFunc = function (start) {
        var _this = this;
        if (start.length !== this.rank) {
            throw Error("The rank (" + this.rank + ") of the program must match the " +
                ("length of start (" + start.length + ")"));
        }
        return function (gpgpu, webGLProgram) {
            if (_this.startLoc == null) {
                _this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'start');
                if (_this.startLoc == null) {
                    return;
                }
            }
            if (_this.rank === 1) {
                gpgpu.gl.uniform1i(_this.startLoc, start[0]);
            }
            else if (_this.rank === 2) {
                gpgpu.gl.uniform2i(_this.startLoc, start[0], start[1]);
            }
            else if (_this.rank === 3) {
                gpgpu.gl.uniform3i(_this.startLoc, start[0], start[1], start[2]);
            }
            else if (_this.rank === 4) {
                gpgpu.gl.uniform4i(_this.startLoc, start[0], start[1], start[2], start[3]);
            }
            else {
                throw Error("Slicing for rank " + _this.rank + " is not yet supported");
            }
        };
    };
    return SliceProgram;
}());
exports.SliceProgram = SliceProgram;
function getCoords(rank) {
    if (rank === 1) {
        return 'sourceLoc';
    }
    else if (rank === 2) {
        return 'sourceLoc.x, sourceLoc.y';
    }
    else if (rank === 3) {
        return 'sourceLoc.x, sourceLoc.y, sourceLoc.z';
    }
    else if (rank === 4) {
        return 'sourceLoc.x, sourceLoc.y, sourceLoc.z, sourceLoc.w';
    }
    else {
        throw Error("Slicing for rank " + rank + " is not yet supported");
    }
}

},{"./shader_compiler":64}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var StridedSliceProgram = (function () {
    function StridedSliceProgram(begin, strides, shape) {
        this.variableNames = ['x'];
        this.outputShape = shape;
        this.rank = shape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var newCoords = '';
        if (this.rank === 1) {
            newCoords = 'coords * strides + begin';
        }
        else {
            newCoords =
                shape.map(function (_, i) { return "coords[" + i + "] * strides[" + i + "] + begin[" + i + "]"; })
                    .join(',');
        }
        this.userCode = "\n      " + dtype + " begin = " + dtype + "(" + begin + ");\n      " + dtype + " strides = " + dtype + "(" + strides + ");\n\n      void main() {\n        " + dtype + " coords = getOutputCoords();\n        setOutput(getX(" + newCoords + "));\n      }\n    ";
    }
    return StridedSliceProgram;
}());
exports.StridedSliceProgram = StridedSliceProgram;

},{"./shader_compiler":64}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextureUsage;
(function (TextureUsage) {
    TextureUsage[TextureUsage["RENDER"] = 0] = "RENDER";
    TextureUsage[TextureUsage["UPLOAD"] = 1] = "UPLOAD";
    TextureUsage[TextureUsage["PIXELS"] = 2] = "PIXELS";
    TextureUsage[TextureUsage["DOWNLOAD"] = 3] = "DOWNLOAD";
})(TextureUsage = exports.TextureUsage || (exports.TextureUsage = {}));
var PhysicalTextureType;
(function (PhysicalTextureType) {
    PhysicalTextureType[PhysicalTextureType["FLOAT16"] = 0] = "FLOAT16";
    PhysicalTextureType[PhysicalTextureType["FLOAT32"] = 1] = "FLOAT32";
    PhysicalTextureType[PhysicalTextureType["UNSIGNED_BYTE"] = 2] = "UNSIGNED_BYTE";
})(PhysicalTextureType = exports.PhysicalTextureType || (exports.PhysicalTextureType = {}));
function getUnpackedMatrixTextureShapeWidthHeight(rows, columns) {
    return [columns, rows];
}
exports.getUnpackedMatrixTextureShapeWidthHeight = getUnpackedMatrixTextureShapeWidthHeight;
function getUnpackedArraySizeFromMatrixSize(matrixSize, channelsPerTexture) {
    return matrixSize * channelsPerTexture;
}
exports.getUnpackedArraySizeFromMatrixSize = getUnpackedArraySizeFromMatrixSize;
function getColorMatrixTextureShapeWidthHeight(rows, columns) {
    return [columns * 4, rows];
}
exports.getColorMatrixTextureShapeWidthHeight = getColorMatrixTextureShapeWidthHeight;
function getMatrixSizeFromUnpackedArraySize(unpackedSize, channelsPerTexture) {
    if (unpackedSize % channelsPerTexture !== 0) {
        throw new Error("unpackedSize (" + unpackedSize + ") must be a multiple of " +
            ("" + channelsPerTexture));
    }
    return unpackedSize / channelsPerTexture;
}
exports.getMatrixSizeFromUnpackedArraySize = getMatrixSizeFromUnpackedArraySize;
function encodeMatrixToUnpackedArray(matrix, unpackedArray, channelsPerTexture) {
    var requiredSize = getUnpackedArraySizeFromMatrixSize(matrix.length, channelsPerTexture);
    if (unpackedArray.length < requiredSize) {
        throw new Error("unpackedArray length (" + unpackedArray.length + ") must be >= " +
            ("" + requiredSize));
    }
    var dst = 0;
    for (var src = 0; src < matrix.length; ++src) {
        unpackedArray[dst] = matrix[src];
        dst += channelsPerTexture;
    }
}
exports.encodeMatrixToUnpackedArray = encodeMatrixToUnpackedArray;
function decodeMatrixFromUnpackedArray(unpackedArray, matrix, channelsPerTexture) {
    var requiredSize = getMatrixSizeFromUnpackedArraySize(unpackedArray.length, channelsPerTexture);
    if (matrix.length < requiredSize) {
        throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
    }
    var dst = 0;
    for (var src = 0; src < unpackedArray.length; src += channelsPerTexture) {
        matrix[dst++] = unpackedArray[src];
    }
}
exports.decodeMatrixFromUnpackedArray = decodeMatrixFromUnpackedArray;
function decodeMatrixFromUnpackedColorRGBAArray(unpackedArray, matrix, channels) {
    var requiredSize = unpackedArray.length * channels / 4;
    if (matrix.length < requiredSize) {
        throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
    }
    var dst = 0;
    for (var src = 0; src < unpackedArray.length; src += 4) {
        for (var c = 0; c < channels; c++) {
            matrix[dst++] = unpackedArray[src + c];
        }
    }
}
exports.decodeMatrixFromUnpackedColorRGBAArray = decodeMatrixFromUnpackedColorRGBAArray;
function getPackedMatrixTextureShapeWidthHeight(rows, columns) {
    return [Math.ceil(columns / 2), Math.ceil(rows / 2)];
}
exports.getPackedMatrixTextureShapeWidthHeight = getPackedMatrixTextureShapeWidthHeight;
function getPackedRGBAArraySizeFromMatrixShape(rows, columns) {
    var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    return w * h * 4;
}
exports.getPackedRGBAArraySizeFromMatrixShape = getPackedRGBAArraySizeFromMatrixShape;
function encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA) {
    var requiredSize = getPackedRGBAArraySizeFromMatrixShape(rows, columns);
    if (packedRGBA.length < requiredSize) {
        throw new Error("packedRGBA length (" + packedRGBA.length + ") must be >= " + requiredSize);
    }
    var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), textureWidth = _a[0], textureHeight = _a[1];
    var oddWidth = (columns % 2) === 1;
    var oddHeight = (rows % 2) === 1;
    var widthInFullBlocks = Math.floor(columns / 2);
    var heightInFullBlocks = Math.floor(rows / 2);
    {
        var dstStride = (oddWidth ? 4 : 0);
        var oneRow = columns;
        var dst = 0;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            var matrixSrcRow = (blockY * 2 * columns);
            for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                var matrixSrcCol = blockX * 2;
                var src = matrixSrcRow + matrixSrcCol;
                packedRGBA[dst] = matrix[src];
                packedRGBA[dst + 1] = matrix[src + 1];
                packedRGBA[dst + 2] = matrix[src + oneRow];
                packedRGBA[dst + 3] = matrix[src + oneRow + 1];
                dst += 4;
            }
            dst += dstStride;
        }
    }
    if (oddWidth) {
        var src = columns - 1;
        var dst = (textureWidth - 1) * 4;
        var srcStride = 2 * columns;
        var dstStride = textureWidth * 4;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            packedRGBA[dst] = matrix[src];
            packedRGBA[dst + 2] = matrix[src + columns];
            src += srcStride;
            dst += dstStride;
        }
    }
    if (oddHeight) {
        var src = (rows - 1) * columns;
        var dst = (textureHeight - 1) * textureWidth * 4;
        for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
            packedRGBA[dst++] = matrix[src++];
            packedRGBA[dst++] = matrix[src++];
            dst += 2;
        }
    }
    if (oddWidth && oddHeight) {
        packedRGBA[packedRGBA.length - 4] = matrix[matrix.length - 1];
    }
    return packedRGBA;
}
exports.encodeMatrixToPackedRGBA = encodeMatrixToPackedRGBA;
function decodeMatrixFromPackedRGBA(packedRGBA, rows, columns, matrix) {
    var requiredSize = rows * columns;
    if (requiredSize < matrix.length) {
        throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
    }
    var oddWidth = (columns % 2) === 1;
    var oddHeight = (rows % 2) === 1;
    var widthInFullBlocks = Math.floor(columns / 2);
    var heightInFullBlocks = Math.floor(rows / 2);
    var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), textureWidth = _a[0], textureHeight = _a[1];
    {
        var srcStride = oddWidth ? 4 : 0;
        var dstStride = columns + (oddWidth ? 1 : 0);
        var src = 0;
        var dstRow1 = 0;
        var dstRow2 = columns;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                matrix[dstRow1++] = packedRGBA[src++];
                matrix[dstRow1++] = packedRGBA[src++];
                matrix[dstRow2++] = packedRGBA[src++];
                matrix[dstRow2++] = packedRGBA[src++];
            }
            src += srcStride;
            dstRow1 += dstStride;
            dstRow2 += dstStride;
        }
    }
    if (oddWidth) {
        var src = (textureWidth - 1) * 4;
        var dst = columns - 1;
        var srcStride = textureWidth * 4;
        var dstStride = 2 * columns;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            matrix[dst] = packedRGBA[src];
            matrix[dst + columns] = packedRGBA[src + 2];
            src += srcStride;
            dst += dstStride;
        }
    }
    if (oddHeight) {
        var src = (textureHeight - 1) * textureWidth * 4;
        var dst = (rows - 1) * columns;
        for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
            matrix[dst++] = packedRGBA[src++];
            matrix[dst++] = packedRGBA[src++];
            src += 2;
        }
    }
    if (oddWidth && oddHeight) {
        matrix[matrix.length - 1] = packedRGBA[packedRGBA.length - 4];
    }
    return matrix;
}
exports.decodeMatrixFromPackedRGBA = decodeMatrixFromPackedRGBA;

},{}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var tex_util_1 = require("./tex_util");
var TextureManager = (function () {
    function TextureManager(gpgpu) {
        this.gpgpu = gpgpu;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
        this.freeTextures = {};
        this.logEnabled = false;
        this.usedTextures = {};
    }
    TextureManager.prototype.acquireTexture = function (shapeRC, usage) {
        var physicalTexType = getPhysicalFromLogicalTextureType(usage);
        var shapeKey = getKeyFromTextureShape(shapeRC, physicalTexType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        if (!(shapeKey in this.usedTextures)) {
            this.usedTextures[shapeKey] = [];
        }
        if (this.freeTextures[shapeKey].length > 0) {
            this.numFreeTextures--;
            this.numUsedTextures++;
            this.log();
            var newTexture_1 = this.freeTextures[shapeKey].shift();
            this.usedTextures[shapeKey].push(newTexture_1);
            return newTexture_1;
        }
        this.numUsedTextures++;
        this.log();
        var newTexture;
        if (physicalTexType === tex_util_1.PhysicalTextureType.FLOAT32) {
            newTexture =
                this.gpgpu.createFloat32MatrixTexture(shapeRC[0], shapeRC[1]);
        }
        else if (physicalTexType === tex_util_1.PhysicalTextureType.FLOAT16) {
            newTexture =
                this.gpgpu.createFloat16MatrixTexture(shapeRC[0], shapeRC[1]);
        }
        else if (physicalTexType === tex_util_1.PhysicalTextureType.UNSIGNED_BYTE) {
            newTexture =
                this.gpgpu.createUnsignedBytesMatrixTexture(shapeRC[0], shapeRC[1]);
        }
        this.usedTextures[shapeKey].push(newTexture);
        return newTexture;
    };
    TextureManager.prototype.releaseTexture = function (texture, shape, logicalTexType) {
        var physicalTexType = getPhysicalFromLogicalTextureType(logicalTexType);
        var shapeKey = getKeyFromTextureShape(shape, physicalTexType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        this.freeTextures[shapeKey].push(texture);
        this.numFreeTextures++;
        this.numUsedTextures--;
        var texList = this.usedTextures[shapeKey];
        var texIndex = texList.indexOf(texture);
        if (texIndex < 0) {
            throw new Error('Cannot release a texture that was never provided by this ' +
                'texture manager');
        }
        texList.splice(texIndex, 1);
        this.log();
    };
    TextureManager.prototype.log = function () {
        if (!this.logEnabled) {
            return;
        }
        var total = this.numFreeTextures + this.numUsedTextures;
        console.log('Free/Used', this.numFreeTextures + " / " + this.numUsedTextures, "(" + total + ")");
    };
    TextureManager.prototype.getNumUsedTextures = function () {
        return this.numUsedTextures;
    };
    TextureManager.prototype.getNumFreeTextures = function () {
        return this.numFreeTextures;
    };
    TextureManager.prototype.dispose = function () {
        var _this = this;
        if (this.freeTextures == null) {
            return;
        }
        for (var texShape in this.freeTextures) {
            this.freeTextures[texShape].forEach(function (tex) {
                _this.gpgpu.deleteMatrixTexture(tex);
            });
        }
        for (var texShape in this.usedTextures) {
            this.usedTextures[texShape].forEach(function (tex) {
                _this.gpgpu.deleteMatrixTexture(tex);
            });
        }
        this.freeTextures = null;
        this.usedTextures = null;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
    };
    return TextureManager;
}());
exports.TextureManager = TextureManager;
function getPhysicalFromLogicalTextureType(logicalTexType) {
    if (logicalTexType === tex_util_1.TextureUsage.DOWNLOAD ||
        logicalTexType === tex_util_1.TextureUsage.PIXELS) {
        return tex_util_1.PhysicalTextureType.UNSIGNED_BYTE;
    }
    else if (logicalTexType === tex_util_1.TextureUsage.UPLOAD) {
        return tex_util_1.PhysicalTextureType.FLOAT32;
    }
    else if (logicalTexType === tex_util_1.TextureUsage.RENDER) {
        return environment_1.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED') ?
            tex_util_1.PhysicalTextureType.FLOAT32 :
            tex_util_1.PhysicalTextureType.FLOAT16;
    }
    throw new Error("Unknown logical texture type " + logicalTexType);
}
function getKeyFromTextureShape(shapeRowsCol, physicalTexType) {
    return shapeRowsCol[0] + "_" + shapeRowsCol[1] + "_" + physicalTexType;
}

},{"../../environment":13,"./tex_util":67}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var TileProgram = (function () {
    function TileProgram(aShape, reps) {
        this.variableNames = ['A'];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[i] * reps[i];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var sourceCoords = getSourceCoords(aShape);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
    }
    return TileProgram;
}());
exports.TileProgram = TileProgram;
function getSourceCoords(aShape) {
    var rank = aShape.length;
    if (rank > 5) {
        throw Error("Tile for rank " + rank + " is not yet supported");
    }
    if (rank === 1) {
        return "imod(resRC, " + aShape[0] + ")";
    }
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u'];
    var sourceCoords = [];
    for (var i = 0; i < aShape.length; i++) {
        sourceCoords.push("imod(" + currentCoords[i] + ", " + aShape[i] + ")");
    }
    return sourceCoords.join();
}

},{"./shader_compiler":64}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var TransposeProgram = (function () {
    function TransposeProgram(aShape, newDim) {
        this.variableNames = ['A'];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var switched = getSwitchedCoords(newDim);
        this.userCode = "\n    void main() {\n      " + dtype + " resRC = getOutputCoords();\n      setOutput(getA(" + switched + "));\n    }\n    ";
    }
    return TransposeProgram;
}());
exports.TransposeProgram = TransposeProgram;
function getSwitchedCoords(newDim) {
    var rank = newDim.length;
    if (rank > 6) {
        throw Error("Transpose for rank " + rank + " is not yet supported");
    }
    var originalOrder = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u', 'resRC.v'];
    var switchedCoords = new Array(rank);
    for (var i = 0; i < newDim.length; i++) {
        switchedCoords[newDim[i]] = originalOrder[i];
    }
    return switchedCoords.join();
}

},{"./shader_compiler":64}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var erf_util = require("../../ops/erf_util");
var selu_util = require("../../ops/selu_util");
var UnaryOpProgram = (function () {
    function UnaryOpProgram(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        this.userCode = "\n      uniform float NAN;\n      float unaryOperation(float x) {\n        " + opSnippet + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
    }
    UnaryOpProgram.prototype.getCustomSetupFunc = function () {
        var _this = this;
        return function (gpgpu, webGLProgram) {
            if (_this.startLoc == null) {
                _this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'NAN');
                if (_this.startLoc == null) {
                    return;
                }
            }
            gpgpu.gl.uniform1f(_this.startLoc, NaN);
        };
    };
    return UnaryOpProgram;
}());
exports.UnaryOpProgram = UnaryOpProgram;
var CHECK_NAN_SNIPPET = "if (isNaN(x)) return x;";
exports.ABS = "return abs(x);";
exports.RELU = CHECK_NAN_SNIPPET + "\n  return (x < 0.0) ? 0.0 : x;\n";
exports.ELU = "return (x >= 0.0) ? x : (exp(x) - 1.0);";
exports.SELU = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + selu_util.SELU_SCALEALPHA + ";\n  float scale = " + selu_util.SELU_SCALE + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";
function STEP(alpha) {
    if (alpha === void 0) { alpha = 0.0; }
    return CHECK_NAN_SNIPPET + ("\n    return x > 0.0 ? 1.0 : float(" + alpha + ");\n  ");
}
exports.STEP = STEP;
exports.NEG = "return -x;";
exports.CEIL = "return ceil(x);";
exports.FLOOR = "return floor(x);";
exports.SIGN = "\n  if (isNaN(x)) { return 0.0; }\n  return sign(x);\n";
exports.ROUND = "\n  // OpenGL ES does not support round function.\n  // The algorithm is based on banker's rounding.\n  float base = floor(x);\n  if ((x - base) < 0.5) {\n    return floor(x);\n  } else if ((x - base) > 0.5) {\n    return ceil(x);\n  } else {\n    if (mod(base, 2.0) == 0.0) {\n      return base;\n    } else {\n      return base + 1.0;\n    }\n  }\n";
exports.EXP = "return exp(x);";
exports.EXPM1 = "return exp(x) - 1.0;";
exports.LOG = "if (x < 0.0) return NAN;\n  return log(x);";
exports.LOG1P = "return log(1.0 + x);";
exports.SQRT = "return sqrt(x);";
exports.RSQRT = "return inversesqrt(x);";
exports.SIGMOID = "return 1.0 / (1.0 + exp(-1.0 * x));";
exports.SOFTPLUS = "\n  float epsilon = 1.1920928955078125e-7;\n  float threshold = log(epsilon) + 2.0;\n\n  bool too_large = x > -threshold;\n  bool too_small = x < threshold;\n\n  float result;\n  float exp_x = exp(x);\n\n  if (too_large){\n    result = x;\n  }\n  else if (too_small){\n    result = exp_x;\n  }\n  else{\n    result = log(exp_x + 1.0);\n  }\n  return result;\n";
exports.SIN = CHECK_NAN_SNIPPET + "\n  return sin(x);\n";
exports.COS = CHECK_NAN_SNIPPET + "\n  return cos(x);\n";
exports.TAN = "return tan(x);";
exports.ASIN = "return asin(x);";
exports.ACOS = "return acos(x);";
exports.ATAN = CHECK_NAN_SNIPPET + "\n  return atan(x);\n";
exports.SINH = "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n";
exports.COSH = "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n";
exports.TANH = "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n";
exports.ASINH = "return log(x + sqrt(x * x + 1.0));";
exports.ACOSH = CHECK_NAN_SNIPPET + "\n  if (x < 1.0) return NAN;\n  return log(x + sqrt(x * x - 1.0));";
exports.ATANH = CHECK_NAN_SNIPPET + "\n  if ((x < -1.0) || (x > 1.0)) return NAN;\n  return (log(1.0 + x) - log(1.0 - x)) / 2.0;";
exports.ERF = "\n  // Error function is calculated approximately with elementary function.\n  // See \"Handbook of Mathematical Functions with Formulas,\n  // Graphs, and Mathematical Tables\", Abramowitz and Stegun.\n  float p = " + erf_util.ERF_P + ";\n  float a1 = " + erf_util.ERF_A1 + ";\n  float a2 = " + erf_util.ERF_A2 + ";\n  float a3 = " + erf_util.ERF_A3 + ";\n  float a4 = " + erf_util.ERF_A4 + ";\n  float a5 = " + erf_util.ERF_A5 + ";\n\n  float t = 1.0 / (1.0 + p * x);\n  return 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x);\n";
exports.SQUARE = "return x * x;";
exports.RECIPROCAL = "return 1.0 / x;";
exports.LOGICAL_NOT = "return float(!(x >= 1.0));";
exports.TO_INT = "return float(int(x));";

},{"../../ops/erf_util":83,"../../ops/selu_util":103}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MAX_TEXTURE_SIZE = null;
var util = require("../../util");
var environment_1 = require("../../environment");
function createWebGLRenderingContext(attributes) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return createWebGLRenderingContextFromCanvas(canvas, attributes);
}
exports.createWebGLRenderingContext = createWebGLRenderingContext;
function createWebGLRenderingContextFromCanvas(canvas, attributes) {
    var gl;
    var webglVersion = environment_1.ENV.get('WEBGL_VERSION');
    if (webglVersion === 2) {
        gl = canvas.getContext('webgl2', attributes);
    }
    else if (webglVersion === 1) {
        gl = (canvas.getContext('webgl', attributes) ||
            canvas.getContext('experimental-webgl', attributes));
    }
    if (webglVersion === 0 || gl == null) {
        throw new Error('This browser does not support WebGL.');
    }
    return gl;
}
exports.createWebGLRenderingContextFromCanvas = createWebGLRenderingContextFromCanvas;
function callAndCheck(gl, func) {
    var returnValue = func();
    checkWebGLError(gl);
    return returnValue;
}
exports.callAndCheck = callAndCheck;
var webGLDebugErrorCheckingEnabled = false;
function enableDebugWebGLErrorChecking(enabled) {
    webGLDebugErrorCheckingEnabled = enabled;
}
exports.enableDebugWebGLErrorChecking = enableDebugWebGLErrorChecking;
function checkWebGLError(gl) {
    if (webGLDebugErrorCheckingEnabled) {
        var error = gl.getError();
        if (error !== gl.NO_ERROR) {
            throw new Error('WebGL Error: ' + getWebGLErrorMessage(gl, error));
        }
    }
}
exports.checkWebGLError = checkWebGLError;
function getWebGLErrorMessage(gl, status) {
    switch (status) {
        case gl.NO_ERROR:
            return 'NO_ERROR';
        case gl.INVALID_ENUM:
            return 'INVALID_ENUM';
        case gl.INVALID_VALUE:
            return 'INVALID_VALUE';
        case gl.INVALID_OPERATION:
            return 'INVALID_OPERATION';
        case gl.INVALID_FRAMEBUFFER_OPERATION:
            return 'INVALID_FRAMEBUFFER_OPERATION';
        case gl.OUT_OF_MEMORY:
            return 'OUT_OF_MEMORY';
        case gl.CONTEXT_LOST_WEBGL:
            return 'CONTEXT_LOST_WEBGL';
        default:
            return "Unknown error code " + status;
    }
}
exports.getWebGLErrorMessage = getWebGLErrorMessage;
function getExtensionOrThrow(gl, extensionName) {
    return throwIfNull(gl, function () { return gl.getExtension(extensionName); }, 'Extension "' + extensionName + '" not supported on this browser.');
}
exports.getExtensionOrThrow = getExtensionOrThrow;
function createVertexShader(gl, vertexShaderSource) {
    var vertexShader = throwIfNull(gl, function () { return gl.createShader(gl.VERTEX_SHADER); }, 'Unable to create vertex WebGLShader.');
    callAndCheck(gl, function () { return gl.shaderSource(vertexShader, vertexShaderSource); });
    callAndCheck(gl, function () { return gl.compileShader(vertexShader); });
    if (gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) === false) {
        console.log(gl.getShaderInfoLog(vertexShader));
        throw new Error('Failed to compile vertex shader.');
    }
    return vertexShader;
}
exports.createVertexShader = createVertexShader;
function createFragmentShader(gl, fragmentShaderSource) {
    var fragmentShader = throwIfNull(gl, function () { return gl.createShader(gl.FRAGMENT_SHADER); }, 'Unable to create fragment WebGLShader.');
    callAndCheck(gl, function () { return gl.shaderSource(fragmentShader, fragmentShaderSource); });
    callAndCheck(gl, function () { return gl.compileShader(fragmentShader); });
    if (gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) === false) {
        logShaderSourceAndInfoLog(fragmentShaderSource, gl.getShaderInfoLog(fragmentShader));
        throw new Error('Failed to compile fragment shader.');
    }
    return fragmentShader;
}
exports.createFragmentShader = createFragmentShader;
var lineNumberRegex = /ERROR: [0-9]+:([0-9]+):/g;
function logShaderSourceAndInfoLog(shaderSource, shaderInfoLog) {
    var lineNumberRegexResult = lineNumberRegex.exec(shaderInfoLog);
    if (lineNumberRegexResult == null) {
        console.log("Couldn't parse line number in error: " + shaderInfoLog);
        console.log(shaderSource);
        return;
    }
    var lineNumber = +lineNumberRegexResult[1];
    var shaderLines = shaderSource.split('\n');
    var pad = shaderLines.length.toString().length + 2;
    var linesWithLineNumbers = shaderLines.map(function (line, lineNumber) {
        return util.rightPad((lineNumber + 1).toString(), pad) + line;
    });
    var maxLineLength = 0;
    for (var i = 0; i < linesWithLineNumbers.length; i++) {
        maxLineLength = Math.max(linesWithLineNumbers[i].length, maxLineLength);
    }
    var beforeErrorLines = linesWithLineNumbers.slice(0, lineNumber - 1);
    var errorLine = linesWithLineNumbers.slice(lineNumber - 1, lineNumber);
    var afterErrorLines = linesWithLineNumbers.slice(lineNumber);
    console.log(beforeErrorLines.join('\n'));
    console.log(shaderInfoLog.split('\n')[0]);
    console.log("%c " + util.rightPad(errorLine[0], maxLineLength), 'border:1px solid red; background-color:#e3d2d2; color:#a61717');
    console.log(afterErrorLines.join('\n'));
}
function createProgram(gl) {
    return throwIfNull(gl, function () { return gl.createProgram(); }, 'Unable to create WebGLProgram.');
}
exports.createProgram = createProgram;
function linkProgram(gl, program) {
    callAndCheck(gl, function () { return gl.linkProgram(program); });
    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Failed to link vertex and fragment shaders.');
    }
}
exports.linkProgram = linkProgram;
function validateProgram(gl, program) {
    callAndCheck(gl, function () { return gl.validateProgram(program); });
    if (gl.getProgramParameter(program, gl.VALIDATE_STATUS) === false) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Shader program validation failed.');
    }
}
exports.validateProgram = validateProgram;
function createStaticVertexBuffer(gl, data) {
    var buffer = throwIfNull(gl, function () { return gl.createBuffer(); }, 'Unable to create WebGLBuffer');
    callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, buffer); });
    callAndCheck(gl, function () { return gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); });
    return buffer;
}
exports.createStaticVertexBuffer = createStaticVertexBuffer;
function createStaticIndexBuffer(gl, data) {
    var buffer = throwIfNull(gl, function () { return gl.createBuffer(); }, 'Unable to create WebGLBuffer');
    callAndCheck(gl, function () { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer); });
    callAndCheck(gl, function () { return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW); });
    return buffer;
}
exports.createStaticIndexBuffer = createStaticIndexBuffer;
function queryMaxTextureSize(gl) {
    if (MAX_TEXTURE_SIZE != null) {
        return MAX_TEXTURE_SIZE;
    }
    MAX_TEXTURE_SIZE =
        callAndCheck(gl, function () { return gl.getParameter(gl.MAX_TEXTURE_SIZE); });
    return MAX_TEXTURE_SIZE;
}
exports.queryMaxTextureSize = queryMaxTextureSize;
function getNumChannels() {
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        return 1;
    }
    return 4;
}
exports.getNumChannels = getNumChannels;
function createTexture(gl) {
    return throwIfNull(gl, function () { return gl.createTexture(); }, 'Unable to create WebGLTexture.');
}
exports.createTexture = createTexture;
function validateTextureSize(gl, width, height) {
    var maxTextureSize = queryMaxTextureSize(gl);
    if ((width <= 0) || (height <= 0)) {
        var requested = "[" + width + "x" + height + "]";
        throw new Error('Requested texture size ' + requested + ' is invalid.');
    }
    if ((width > maxTextureSize) || (height > maxTextureSize)) {
        var requested = "[" + width + "x" + height + "]";
        var max = "[" + maxTextureSize + "x" + maxTextureSize + "]";
        throw new Error('Requested texture size ' + requested +
            ' greater than WebGL maximum on this browser / GPU ' + max + '.');
    }
}
exports.validateTextureSize = validateTextureSize;
function createFramebuffer(gl) {
    return throwIfNull(gl, function () { return gl.createFramebuffer(); }, 'Unable to create WebGLFramebuffer.');
}
exports.createFramebuffer = createFramebuffer;
function bindVertexBufferToProgramAttribute(gl, program, attribute, buffer, arrayEntriesPerItem, itemStrideInBytes, itemOffsetInBytes) {
    var loc = gl.getAttribLocation(program, attribute);
    if (loc === -1) {
        return false;
    }
    callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, buffer); });
    callAndCheck(gl, function () { return gl.vertexAttribPointer(loc, arrayEntriesPerItem, gl.FLOAT, false, itemStrideInBytes, itemOffsetInBytes); });
    callAndCheck(gl, function () { return gl.enableVertexAttribArray(loc); });
    return true;
}
exports.bindVertexBufferToProgramAttribute = bindVertexBufferToProgramAttribute;
function bindTextureUnit(gl, texture, textureUnit) {
    validateTextureUnit(gl, textureUnit);
    callAndCheck(gl, function () { return gl.activeTexture(gl.TEXTURE0 + textureUnit); });
    callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
}
exports.bindTextureUnit = bindTextureUnit;
function unbindTextureUnit(gl, textureUnit) {
    validateTextureUnit(gl, textureUnit);
    callAndCheck(gl, function () { return gl.activeTexture(gl.TEXTURE0 + textureUnit); });
    callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
exports.unbindTextureUnit = unbindTextureUnit;
function getProgramUniformLocationOrThrow(gl, program, uniformName) {
    return throwIfNull(gl, function () { return gl.getUniformLocation(program, uniformName); }, 'uniform "' + uniformName + '" not present in program.');
}
exports.getProgramUniformLocationOrThrow = getProgramUniformLocationOrThrow;
function getProgramUniformLocation(gl, program, uniformName) {
    return gl.getUniformLocation(program, uniformName);
}
exports.getProgramUniformLocation = getProgramUniformLocation;
function bindTextureToProgramUniformSampler(gl, program, texture, uniformSamplerLocation, textureUnit) {
    callAndCheck(gl, function () { return bindTextureUnit(gl, texture, textureUnit); });
    callAndCheck(gl, function () { return gl.uniform1i(uniformSamplerLocation, textureUnit); });
}
exports.bindTextureToProgramUniformSampler = bindTextureToProgramUniformSampler;
function bindCanvasToFramebuffer(gl) {
    callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, null); });
    callAndCheck(gl, function () { return gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); });
    callAndCheck(gl, function () { return gl.scissor(0, 0, gl.canvas.width, gl.canvas.height); });
}
exports.bindCanvasToFramebuffer = bindCanvasToFramebuffer;
function bindColorTextureToFramebuffer(gl, texture, framebuffer) {
    callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); });
    callAndCheck(gl, function () { return gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0); });
}
exports.bindColorTextureToFramebuffer = bindColorTextureToFramebuffer;
function unbindColorTextureFromFramebuffer(gl, framebuffer) {
    callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); });
    callAndCheck(gl, function () { return gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0); });
}
exports.unbindColorTextureFromFramebuffer = unbindColorTextureFromFramebuffer;
function validateFramebuffer(gl) {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Error binding framebuffer: ' + getFramebufferErrorMessage(gl, status));
    }
}
exports.validateFramebuffer = validateFramebuffer;
function getFramebufferErrorMessage(gl, status) {
    switch (status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            return 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT';
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            return 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT';
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            return 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS';
        case gl.FRAMEBUFFER_UNSUPPORTED:
            return 'FRAMEBUFFER_UNSUPPORTED';
        default:
            return "unknown error " + status;
    }
}
exports.getFramebufferErrorMessage = getFramebufferErrorMessage;
function throwIfNull(gl, returnTOrNull, failureMessage) {
    var tOrNull = callAndCheck(gl, function () { return returnTOrNull(); });
    if (tOrNull == null) {
        throw new Error(failureMessage);
    }
    return tOrNull;
}
function validateTextureUnit(gl, textureUnit) {
    var maxTextureUnit = gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1;
    var glTextureUnit = textureUnit + gl.TEXTURE0;
    if (glTextureUnit < gl.TEXTURE0 || glTextureUnit > maxTextureUnit) {
        var textureUnitRange = "[gl.TEXTURE0, gl.TEXTURE" + maxTextureUnit + "]";
        throw new Error("textureUnit must be in " + textureUnitRange + ".");
    }
}
function getTextureShapeFromLogicalShape(gl, logShape) {
    if (logShape.length !== 2) {
        var squeezeResult = util.squeezeShape(logShape);
        logShape = squeezeResult.newShape;
    }
    var maxTexSize = queryMaxTextureSize(gl);
    var size = util.sizeFromShape(logShape);
    if (logShape.length <= 1 && size <= maxTexSize) {
        return [size, 1];
    }
    else if (logShape.length === 2 && logShape[0] <= maxTexSize &&
        logShape[1] <= maxTexSize) {
        return logShape;
    }
    else if (logShape.length === 3 && logShape[0] <= maxTexSize &&
        logShape[1] * logShape[2] <= maxTexSize) {
        return [logShape[0], logShape[1] * logShape[2]];
    }
    else if (logShape.length === 4 && logShape[0] <= maxTexSize &&
        logShape[1] * logShape[2] * logShape[3] <= maxTexSize) {
        return [logShape[0], logShape[1] * logShape[2] * logShape[3]];
    }
    else {
        return util.sizeToSquarishShape(size);
    }
}
exports.getTextureShapeFromLogicalShape = getTextureShapeFromLogicalShape;

},{"../../environment":13,"../../util":131}],73:[function(require,module,exports){
"use strict";
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_1 = require("../tensor");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var axis_util_1 = require("./axis_util");
var concat_1 = require("./concat");
var operation_1 = require("./operation");
var rand_1 = require("./rand");
var tensor_ops_1 = require("./tensor_ops");
var ArrayOps = (function () {
    function ArrayOps() {
    }
    ArrayOps.clone = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'clone');
        var der = function (dy) {
            return { $x: function () { return dy.toFloat(); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) {
            return tensor_1.Tensor.make($x.shape, { dataId: $x.dataId }, $x.dtype);
        }, { $x: $x }, der);
    };
    ArrayOps.eye = function (numRows, numColumns, batchShape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (numColumns == null) {
            numColumns = numRows;
        }
        var buffer = ArrayOps.buffer([numRows, numColumns], dtype);
        var n = numRows <= numColumns ? numRows : numColumns;
        for (var i = 0; i < n; ++i) {
            buffer.set(1, i, i);
        }
        var out = buffer.toTensor().as2D(numRows, numColumns);
        if (batchShape == null) {
            return out;
        }
        else {
            if (batchShape.length === 1) {
                return ArrayOps.tile(ArrayOps.expandDims(out, 0), [batchShape[0], 1, 1]);
            }
            else if (batchShape.length === 2) {
                return ArrayOps.tile(ArrayOps.expandDims(ArrayOps.expandDims(out, 0), 0), [batchShape[0], batchShape[1], 1, 1]);
            }
            else if (batchShape.length === 3) {
                return ArrayOps.tile(ArrayOps.expandDims(ArrayOps.expandDims(ArrayOps.expandDims(out, 0), 0), 0), [batchShape[0], batchShape[1], batchShape[2], 1, 1]);
            }
            else {
                throw new Error("eye() currently supports only 1D and 2D " +
                    ("batchShapes, but received " + batchShape.length + "D."));
            }
        }
    };
    ArrayOps.randomNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, false, seed);
        var res = ArrayOps.buffer(shape, dtype);
        for (var i = 0; i < res.values.length; i++) {
            res.values[i] = randGauss.nextValue();
        }
        return res.toTensor();
    };
    ArrayOps.truncatedNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, true, seed);
        var res = ArrayOps.buffer(shape, dtype);
        for (var i = 0; i < res.values.length; i++) {
            res.values[i] = randGauss.nextValue();
        }
        return res.toTensor();
    };
    ArrayOps.randomUniform = function (shape, minval, maxval, dtype) {
        if (minval === void 0) { minval = 0; }
        if (maxval === void 0) { maxval = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        var res = ArrayOps.buffer(shape, dtype);
        for (var i = 0; i < res.values.length; i++) {
            res.values[i] = util.randUniform(minval, maxval);
        }
        return res.toTensor();
    };
    ArrayOps.rand = function (shape, randFunction, dtype) {
        var size = util.sizeFromShape(shape);
        var values = null;
        if (dtype == null || dtype === 'float32') {
            values = new Float32Array(size);
        }
        else if (dtype === 'int32') {
            values = new Int32Array(size);
        }
        else if (dtype === 'bool') {
            values = new Uint8Array(size);
        }
        else {
            throw new Error("Unknown data type " + dtype);
        }
        for (var i = 0; i < size; i++) {
            values[i] = randFunction();
        }
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.multinomial = function (logits, numSamples, seed, normalized) {
        if (normalized === void 0) { normalized = false; }
        var $logits = tensor_util_1.convertToTensor(logits, 'logits', 'multinomial');
        var numOutcomes = $logits.size;
        var origRank = $logits.rank;
        if (numOutcomes < 2) {
            throw new Error("Error in multinomial: you need at least 2 outcomes, but got " +
                (numOutcomes + "."));
        }
        if (origRank > 2) {
            throw new Error("Rank of probabilities must be 1 or 2, but is " + origRank);
        }
        seed = seed || Math.random();
        var logits2D = origRank === 1 ? $logits.as2D(1, -1) : $logits;
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.multinomial(logits2D, normalized, numSamples, seed); }, { logits2D: logits2D });
        return origRank === 1 ? res.as1D() : res;
    };
    ArrayOps.oneHot = function (indices, depth, onValue, offValue) {
        if (onValue === void 0) { onValue = 1; }
        if (offValue === void 0) { offValue = 0; }
        var $indices = tensor_util_1.convertToTensor(indices, 'indices', 'oneHot', 'int32');
        util.assert($indices.dtype === 'int32', 'Indices must be of dtype `int32`');
        if (depth < 2) {
            throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.oneHot($indices, depth, onValue, offValue); }, { $indices: $indices });
    };
    ArrayOps.fromPixels = function (pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        if (numChannels > 4) {
            throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
        }
        return environment_1.ENV.engine.fromPixels(pixels, numChannels);
    };
    ArrayOps.toPixels = function (img, canvas) {
        return __awaiter(this, void 0, void 0, function () {
            var $img, _a, height, width, depth, minTensor, maxTensor, min, max, data, multiplier, bytes, i, r, g, b, a, j, ctx, imageData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        $img = tensor_util_1.convertToTensor(img, 'img', 'toPixels', 'int32');
                        if ($img.rank !== 2 && $img.rank !== 3) {
                            throw new Error("toPixels only supports rank 2 or 3 tensors, got rank " + $img.rank + ".");
                        }
                        _a = $img.shape.slice(0, 2), height = _a[0], width = _a[1];
                        depth = $img.rank === 2 ? 1 : $img.shape[2];
                        if (depth > 4 || depth === 2) {
                            throw new Error("toPixels only supports depth of size " +
                                ("1, 3 or 4 but got " + depth));
                        }
                        minTensor = $img.min();
                        maxTensor = $img.max();
                        return [4, minTensor.data()];
                    case 1:
                        min = (_b.sent())[0];
                        return [4, maxTensor.data()];
                    case 2:
                        max = (_b.sent())[0];
                        minTensor.dispose();
                        maxTensor.dispose();
                        if ($img.dtype === 'float32') {
                            if (min < 0 || max > 1) {
                                throw new Error("Tensor values for a float32 Tensor must be in the " +
                                    ("range [0 - 1] but got range [" + min + " - " + max + "]."));
                            }
                        }
                        else if ($img.dtype === 'int32') {
                            if (min < 0 || max > 255) {
                                throw new Error("Tensor values for a int32 Tensor must be in the " +
                                    ("range [0 - 255] but got range [" + min + " - " + max + "]."));
                            }
                        }
                        else {
                            throw new Error("Unsupported type for toPixels: " + $img.dtype + "." +
                                " Please use float32 or int32 tensors.");
                        }
                        return [4, $img.data()];
                    case 3:
                        data = _b.sent();
                        multiplier = $img.dtype === 'float32' ? 255 : 1;
                        bytes = new Uint8ClampedArray(width * height * 4);
                        for (i = 0; i < height * width; ++i) {
                            r = void 0, g = void 0, b = void 0, a = void 0;
                            if (depth === 1) {
                                r = data[i] * multiplier;
                                g = data[i] * multiplier;
                                b = data[i] * multiplier;
                                a = 255;
                            }
                            else if (depth === 3) {
                                r = data[i * 3] * multiplier;
                                g = data[i * 3 + 1] * multiplier;
                                b = data[i * 3 + 2] * multiplier;
                                a = 255;
                            }
                            else if (depth === 4) {
                                r = data[i * 4] * multiplier;
                                g = data[i * 4 + 1] * multiplier;
                                b = data[i * 4 + 2] * multiplier;
                                a = data[i * 4 + 3] * multiplier;
                            }
                            j = i * 4;
                            bytes[j + 0] = Math.round(r);
                            bytes[j + 1] = Math.round(g);
                            bytes[j + 2] = Math.round(b);
                            bytes[j + 3] = Math.round(a);
                        }
                        if (canvas != null) {
                            canvas.width = width;
                            canvas.height = height;
                            ctx = canvas.getContext('2d');
                            imageData = new ImageData(bytes, width, height);
                            ctx.putImageData(imageData, 0, 0);
                        }
                        if ($img !== img) {
                            $img.dispose();
                        }
                        return [2, bytes];
                }
            });
        });
    };
    ArrayOps.reshape = function (x, shape) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reshape');
        shape = util.inferFromImplicitShape(shape, $x.size);
        util.assert($x.size === util.sizeFromShape(shape), 'new shape and old shape must have the same number of elements.');
        var grad = function (dy) {
            return { $x: function () { return dy.reshape($x.shape); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.reshape($x, shape); }, { $x: $x }, grad);
    };
    ArrayOps.squeeze = function (x, axis) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'squeeze');
        return ArrayOps.reshape($x, util.squeezeShape($x.shape, axis).newShape);
    };
    ArrayOps.cast = function (x, dtype) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'cast');
        var grad = function (dy) {
            return { $x: function () { return dy.clone(); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cast($x, dtype); }, { $x: $x }, grad);
    };
    ArrayOps.tile = function (x, reps) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'tile');
        util.assert($x.rank === reps.length, "Error in transpose: rank of input " + $x.rank + " " +
            ("must match length of reps " + reps + "."));
        var grad = function (dy) {
            var derX = function () {
                var xGrad = tensor_ops_1.zerosLike($x);
                if ($x.rank === 1) {
                    for (var i = 0; i < reps[0]; ++i) {
                        xGrad = xGrad.add(dy.slice([i * $x.shape[0]], [$x.shape[0]]));
                    }
                }
                else if ($x.rank === 2) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            xGrad = xGrad.add(dy.slice([i * $x.shape[0], j * $x.shape[1]], [$x.shape[0], $x.shape[1]]));
                        }
                    }
                }
                else if ($x.rank === 3) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            for (var k = 0; k < reps[2]; ++k) {
                                xGrad = xGrad.add(dy.slice([i * $x.shape[0], j * $x.shape[1], k * $x.shape[2]], [$x.shape[0], $x.shape[1], $x.shape[2]]));
                            }
                        }
                    }
                }
                else if ($x.rank === 4) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            for (var k = 0; k < reps[2]; ++k) {
                                for (var l = 0; l < reps[3]; ++l) {
                                    xGrad = xGrad.add(dy.slice([
                                        i * $x.shape[0], j * $x.shape[1], k * $x.shape[2],
                                        l * $x.shape[3]
                                    ], [$x.shape[0], $x.shape[1], $x.shape[2], $x.shape[3]]));
                                }
                            }
                        }
                    }
                }
                else {
                    throw new Error("Gradient for tile operation is not implemented for rank-" +
                        ($x.rank + " tensors yet."));
                }
                return xGrad;
            };
            return { $x: derX };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.tile($x, reps); }, { $x: $x }, grad);
    };
    ArrayOps.pad1d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2, 'Invalid number of paddings. Must be length of 2.');
        return ArrayOps.pad(x, [paddings], constantValue);
    };
    ArrayOps.pad2d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2 && paddings[0].length === 2 &&
            paddings[1].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad3d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 3 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad4d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 4 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2 &&
            paddings[3].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'pad');
        if ($x.rank === 0) {
            throw new Error('pad(scalar) is not defined. Pass non-scalar to pad');
        }
        var begin = paddings.map(function (p) { return p[0]; });
        var grad = function (dy) {
            return { $x: function () { return dy.slice(begin, $x.shape); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.pad($x, paddings, constantValue); }, { $x: $x }, grad);
    };
    ArrayOps.stack = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        var $tensors = tensor_util_1.convertToTensorArray(tensors, 'tensors', 'stack');
        util.assert($tensors.length >= 1, 'Pass at least one tensor to tf.stack');
        if ($tensors.length === 1) {
            return $tensors[0].expandDims(axis);
        }
        var rank = $tensors[0].rank;
        var shape = $tensors[0].shape;
        var dtype = $tensors[0].dtype;
        util.assert(axis <= rank, 'Axis must be <= rank of the tensor');
        $tensors.forEach(function (t) {
            util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
        });
        $tensors.forEach(function (t) {
            util.assert(dtype === t.dtype, 'All tensors passed to stack must have matching dtypes');
        });
        var expandedTensors = $tensors.map(function (t) { return t.expandDims(axis); });
        return concat_1.concat(expandedTensors, axis);
    };
    ArrayOps.unstack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'unstack');
        var num = $x.shape[axis];
        var outputShape = Array($x.rank - 1).fill(0);
        var outIndex = 0;
        for (var i = 0; i < $x.rank; i++) {
            if (i !== axis) {
                outputShape[outIndex] = $x.shape[i];
                outIndex++;
            }
        }
        var splitSizes;
        splitSizes = Array(num).fill(1);
        var begin = Array($x.rank).fill(0);
        var size = $x.shape.slice();
        return splitSizes.map(function (s) {
            size[axis] = s;
            var slice = $x.slice(begin, size);
            begin[axis] += s;
            return slice.reshape(outputShape);
        });
    };
    ArrayOps.split = function (x, numOrSizeSplits, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'split');
        axis = axis_util_1.parseAxisParam(axis, $x.shape)[0];
        var splitSizes;
        if (typeof (numOrSizeSplits) === 'number') {
            util.assert($x.shape[axis] % numOrSizeSplits === 0, 'Number of splits must evenly divide the axis.');
            splitSizes =
                Array(numOrSizeSplits).fill($x.shape[axis] / numOrSizeSplits);
        }
        else {
            util.assert($x.shape[axis] === numOrSizeSplits.reduce(function (a, b) { return a + b; }), 'The sum of sizes must match the size of the axis dimension.');
            splitSizes = numOrSizeSplits;
        }
        var begin = Array($x.rank).fill(0);
        var size = $x.shape.slice();
        return splitSizes.map(function (s) {
            size[axis] = s;
            var slice = $x.slice(begin, size);
            begin[axis] += s;
            return slice;
        });
    };
    ArrayOps.cumsum = function (x, axis, exclusive, reverse) {
        if (axis === void 0) { axis = 0; }
        if (exclusive === void 0) { exclusive = false; }
        if (reverse === void 0) { reverse = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'cumsum');
        axis = axis | 0;
        var permutation = axis_util_1.getAxesPermutation([axis], $x.rank);
        var permutedX = $x;
        if (permutation != null) {
            permutedX = $x.transpose(permutation);
        }
        var permutedAxis = axis_util_1.getInnerMostAxes(1, $x.rank)[0];
        var grad = function (dy) {
            return { permutedX: function () { return dy.cumsum(axis, exclusive, !reverse); } };
        };
        var value = environment_1.ENV.engine.runKernel(function (backend) { return backend.cumsum(permutedX, permutedAxis, exclusive, reverse); }, { permutedX: permutedX }, grad);
        if (permutation != null) {
            value = value.transpose(permutation);
        }
        return value;
    };
    ArrayOps.expandDims = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'expandDims');
        util.assert(axis <= $x.rank, 'Axis must be <= rank of the tensor');
        var newShape = $x.shape.slice();
        if (axis < 0) {
            util.assert(-($x.rank + 1) <= axis, "Axis must be in the interval [" + -($x.rank + 1) + ", " + $x.rank + "]");
            axis = $x.rank + axis + 1;
        }
        newShape.splice(axis, 0, 1);
        return ArrayOps.reshape($x, newShape);
    };
    ArrayOps.buffer = function (shape, dtype, values) {
        if (dtype === void 0) { dtype = 'float32'; }
        return new tensor_1.TensorBuffer(shape, dtype, values);
    };
    ArrayOps.print = function (x, verbose) {
        if (verbose === void 0) { verbose = false; }
        console.log(x.toString(verbose));
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "clone", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "eye", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Random' })
    ], ArrayOps, "randomNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "truncatedNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Random' })
    ], ArrayOps, "randomUniform", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Random' })
    ], ArrayOps, "multinomial", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "oneHot", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "fromPixels", null);
    __decorate([
        doc_1.doc({ heading: 'Visualization' })
    ], ArrayOps, "toPixels", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "reshape", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "squeeze", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "cast", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], ArrayOps, "tile", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "pad", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], ArrayOps, "stack", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], ArrayOps, "unstack", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], ArrayOps, "split", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Scan' })
    ], ArrayOps, "cumsum", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "expandDims", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "buffer", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "print", null);
    return ArrayOps;
}());
exports.buffer = ArrayOps.buffer;
exports.toPixels = ArrayOps.toPixels;
exports.cast = operation_1.op(ArrayOps.cast);
exports.clone = operation_1.op(ArrayOps.clone);
exports.cumsum = operation_1.op(ArrayOps.cumsum);
exports.expandDims = operation_1.op(ArrayOps.expandDims);
exports.eye = operation_1.op(ArrayOps.eye);
exports.fromPixels = operation_1.op(ArrayOps.fromPixels);
exports.multinomial = operation_1.op(ArrayOps.multinomial);
exports.oneHot = operation_1.op(ArrayOps.oneHot);
exports.pad = operation_1.op(ArrayOps.pad);
exports.pad1d = operation_1.op(ArrayOps.pad1d);
exports.pad2d = operation_1.op(ArrayOps.pad2d);
exports.pad3d = operation_1.op(ArrayOps.pad3d);
exports.pad4d = operation_1.op(ArrayOps.pad4d);
exports.print = operation_1.op(ArrayOps.print);
exports.rand = operation_1.op(ArrayOps.rand);
exports.randomNormal = operation_1.op(ArrayOps.randomNormal);
exports.randomUniform = operation_1.op(ArrayOps.randomUniform);
exports.reshape = operation_1.op(ArrayOps.reshape);
exports.split = operation_1.op(ArrayOps.split);
exports.squeeze = operation_1.op(ArrayOps.squeeze);
exports.stack = operation_1.op(ArrayOps.stack);
exports.tile = operation_1.op(ArrayOps.tile);
exports.truncatedNormal = operation_1.op(ArrayOps.truncatedNormal);
exports.unstack = operation_1.op(ArrayOps.unstack);

},{"../doc":11,"../environment":13,"../tensor":125,"../tensor_util":127,"../util":131,"./axis_util":74,"./concat":79,"./operation":93,"./rand":96,"./tensor_ops":109}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function axesAreInnerMostDims(axes, rank) {
    for (var i = 0; i < axes.length; ++i) {
        if (axes[axes.length - i - 1] !== rank - 1 - i) {
            return false;
        }
    }
    return true;
}
exports.axesAreInnerMostDims = axesAreInnerMostDims;
function combineLocations(outputLoc, reduceLoc, axes) {
    var rank = outputLoc.length + reduceLoc.length;
    var loc = [];
    var outIdx = 0;
    var reduceIdx = 0;
    for (var dim = 0; dim < rank; dim++) {
        if (axes.indexOf(dim) === -1) {
            loc.push(outputLoc[outIdx++]);
        }
        else {
            loc.push(reduceLoc[reduceIdx++]);
        }
    }
    return loc;
}
exports.combineLocations = combineLocations;
function computeOutAndReduceShapes(aShape, axes) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (axes.indexOf(dim) === -1) {
            outShape.push(aShape[dim]);
        }
    }
    var reduceShape = axes.map(function (dim) { return aShape[dim]; });
    return [outShape, reduceShape];
}
exports.computeOutAndReduceShapes = computeOutAndReduceShapes;
function expandShapeToKeepDim(shape, axes) {
    var reduceSubShape = axes.map(function (x) { return 1; });
    return combineLocations(shape, reduceSubShape, axes);
}
exports.expandShapeToKeepDim = expandShapeToKeepDim;
function parseAxisParam(axis, shape) {
    var rank = shape.length;
    axis = axis == null ? shape.map(function (s, i) { return i; }) : [].concat(axis);
    util.assert(axis.every(function (ax) { return ax >= -rank && ax < rank; }), "All values in axis param must be in range [-" + rank + ", " + rank + ") but " +
        ("got axis " + axis));
    util.assert(axis.every(function (ax) { return util.isInt(ax); }), "All values in axis param must be integers but " +
        ("got axis " + axis));
    return axis.map(function (a) { return a < 0 ? rank + a : a; });
}
exports.parseAxisParam = parseAxisParam;
function assertAxesAreInnerMostDims(msg, axes, rank) {
    util.assert(axesAreInnerMostDims(axes, rank), msg + " supports only inner-most axes for now. " +
        ("Got axes " + axes + " and rank-" + rank + " input."));
}
exports.assertAxesAreInnerMostDims = assertAxesAreInnerMostDims;
function getAxesPermutation(axes, rank) {
    if (axesAreInnerMostDims(axes, rank)) {
        return null;
    }
    var result = [];
    for (var i = 0; i < rank; ++i) {
        if (axes.indexOf(i) === -1) {
            result.push(i);
        }
    }
    axes.forEach(function (axis) { return result.push(axis); });
    return result;
}
exports.getAxesPermutation = getAxesPermutation;
function getUndoAxesPermutation(axes) {
    return axes.map(function (axis, i) { return [i, axis]; })
        .sort(function (a, b) { return a[1] - b[1]; })
        .map(function (x) { return x[0]; });
}
exports.getUndoAxesPermutation = getUndoAxesPermutation;
function getInnerMostAxes(numAxes, rank) {
    var res = [];
    for (var i = rank - numAxes; i < rank; ++i) {
        res.push(i);
    }
    return res;
}
exports.getInnerMostAxes = getInnerMostAxes;

},{"../util":131}],75:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var array_ops_1 = require("./array_ops");
var broadcast_util_1 = require("./broadcast_util");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var unary_ops_1 = require("./unary_ops");
var BatchNormOps = (function () {
    function BatchNormOps() {
    }
    BatchNormOps.batchNormalization2d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'batchNormalization');
        var $mean = tensor_util_1.convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = tensor_util_1.convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = tensor_util_1.convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = tensor_util_1.convertToTensor(offset, 'offset', 'batchNormalization');
        }
        util.assert($x.rank === 2, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            ($x.rank + "."));
        util.assert($mean.rank === 2 || $mean.rank === 1, "Error in batchNormalization2D: mean must be rank 2 or rank 1 but " +
            ("got rank " + $mean.rank + "."));
        util.assert($variance.rank === 2 || $variance.rank === 1, "Error in batchNormalization2D: variance must be rank 2 or rank 1 " +
            ("but got rank " + $variance.rank + "."));
        if ($scale != null) {
            util.assert($scale.rank === 2 || $scale.rank === 1, "Error in batchNormalization2D: scale must be rank 2 or rank 1 " +
                ("but got rank " + $scale.rank + "."));
        }
        if ($offset != null) {
            util.assert($offset.rank === 2 || $offset.rank === 1, "Error in batchNormalization2D: offset must be rank 2 or rank 1 " +
                ("but got rank " + $offset.rank + "."));
        }
        return BatchNormOps.batchNormalization($x, $mean, $variance, varianceEpsilon, $scale, $offset);
    };
    BatchNormOps.batchNormalization3d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'batchNormalization');
        var $mean = tensor_util_1.convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = tensor_util_1.convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = tensor_util_1.convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = tensor_util_1.convertToTensor(offset, 'offset', 'batchNormalization');
        }
        util.assert($x.rank === 3, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            ($x.rank + "."));
        util.assert($mean.rank === 3 || $mean.rank === 1, "Error in batchNormalization3D: mean must be rank 3 or rank 1 but " +
            ("got rank " + $mean.rank + "."));
        util.assert($variance.rank === 3 || $variance.rank === 1, "Error in batchNormalization3D: variance must be rank 3 or rank 1 " +
            ("but got rank " + $variance.rank + "."));
        if ($scale != null) {
            util.assert($scale.rank === 3 || $scale.rank === 1, "Error in batchNormalization3D: scale must be rank 3 or rank 1 " +
                ("but got rank " + $scale.rank + "."));
        }
        if ($offset != null) {
            util.assert($offset.rank === 3 || $offset.rank === 1, "Error in batchNormalization3D: offset must be rank 3 or rank 1 " +
                ("but got rank " + $offset.rank + "."));
        }
        return BatchNormOps.batchNormalization($x, $mean, $variance, varianceEpsilon, $scale, $offset);
    };
    BatchNormOps.batchNormalization4d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'batchNormalization');
        var $mean = tensor_util_1.convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = tensor_util_1.convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = tensor_util_1.convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = tensor_util_1.convertToTensor(offset, 'offset', 'batchNormalization');
        }
        util.assert($x.rank === 4, "Error in batchNormalization4D: x must be rank 4 but got rank " +
            ($x.rank + "."));
        util.assert($mean.rank === 4 || $mean.rank === 1, "Error in batchNormalization4D: mean must be rank 4 or rank 1 but " +
            ("got rank " + $mean.rank + "."));
        util.assert($variance.rank === 4 || $variance.rank === 1, "Error in batchNormalization4D: variance must be rank 4 or rank 1 " +
            ("but got rank " + $variance.rank + "."));
        if ($scale != null) {
            util.assert($scale.rank === 4 || $scale.rank === 1, "Error in batchNormalization4D: scale must be rank 4 or rank 1 " +
                ("but got rank " + $scale.rank + "."));
        }
        if ($offset != null) {
            util.assert($offset.rank === 4 || $offset.rank === 1, "Error in batchNormalization4D: offset must be rank 4 or rank 1 " +
                ("but got rank " + $offset.rank + "."));
        }
        return BatchNormOps.batchNormalization($x, $mean, $variance, varianceEpsilon, $scale, $offset);
    };
    BatchNormOps.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'batchNormalization');
        var $mean = tensor_util_1.convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = tensor_util_1.convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = tensor_util_1.convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = tensor_util_1.convertToTensor(offset, 'offset', 'batchNormalization');
        }
        util.assert($mean.rank === $variance.rank, 'Batch normalization gradient requires mean and variance to have ' +
            'equal ranks.');
        util.assert($offset == null || $mean.rank === $offset.rank, 'Batch normalization gradient requires mean and offset to have ' +
            'equal ranks.');
        util.assert($scale == null || $mean.rank === $scale.rank, 'Batch normalization gradient requires mean and scale to have ' +
            'equal ranks.');
        var x4D;
        if ($x.rank === 0 || $x.rank === 1) {
            x4D = $x.as4D(1, 1, 1, $x.size);
        }
        else if ($x.rank === 2) {
            x4D = $x.as4D(1, 1, $x.shape[0], $x.shape[1]);
        }
        else if ($x.rank === 3) {
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        else {
            x4D = $x;
        }
        var der = function (dy) {
            var scaleValue = $scale == null ? tensor_ops_1.scalar(1) : $scale;
            var reductionAxes = broadcast_util_1.getReductionAxes($mean.shape, x4D.shape);
            var tileShape = [];
            if ($mean.rank === 1) {
                for (var i = 0; i < x4D.shape.length - 1; ++i) {
                    tileShape.push(x4D.shape[i]);
                }
                tileShape.push(1);
            }
            var xMinusMean = $x.sub($mean);
            var dyTimesScaleValue = dy.mul(scaleValue);
            var oneOverSqrtVariance = unary_ops_1.rsqrt($variance.add(tensor_ops_1.scalar(varianceEpsilon)));
            var minusHalfRCube = oneOverSqrtVariance.mul(oneOverSqrtVariance)
                .mul(oneOverSqrtVariance)
                .mul(tensor_ops_1.scalar(-0.5));
            var derX = function () {
                if ($mean.rank === 1) {
                    return dy
                        .mul(array_ops_1.tile(oneOverSqrtVariance.as4D(1, 1, 1, $mean.shape[0]), tileShape))
                        .mul(scaleValue)
                        .reshape($x.shape);
                }
                else {
                    return dy.mul(oneOverSqrtVariance).mul(scaleValue).reshape($x.shape);
                }
            };
            var derMean = function () {
                var meanDer = oneOverSqrtVariance.mul(tensor_ops_1.scalar(-1)).mul(dyTimesScaleValue);
                if ($mean.rank === 1) {
                    meanDer = meanDer.sum(reductionAxes);
                }
                return meanDer.reshape($mean.shape);
            };
            var derVariance = function () {
                var varianceDer = minusHalfRCube.mul(xMinusMean).mul(dyTimesScaleValue);
                if ($mean.rank === 1) {
                    varianceDer = varianceDer.sum(reductionAxes);
                }
                return varianceDer.reshape($mean.shape);
            };
            var derScale = function () {
                var xMinusMean2TimesRsqrt = xMinusMean.mul(oneOverSqrtVariance);
                var scaleDer = dy.mul(xMinusMean2TimesRsqrt);
                if ($mean.rank === 1) {
                    scaleDer = scaleDer.sum(reductionAxes);
                }
                return scaleDer.reshape($mean.shape);
            };
            var derOffset = function () {
                var offsetDer = dy;
                if ($mean.rank === 1) {
                    offsetDer = offsetDer.sum(reductionAxes);
                }
                return offsetDer.reshape($mean.shape);
            };
            return {
                $x: derX,
                $mean: derMean,
                $variance: derVariance,
                $scale: derScale,
                $offset: derOffset
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.batchNormalization(x4D, batchnormReshape4D($mean), batchnormReshape4D($variance), varianceEpsilon, batchnormReshape4D($scale), batchnormReshape4D($offset)); }, { $x: $x, $mean: $mean, $variance: $variance, $scale: $scale, $offset: $offset }, der);
        return res.reshape($x.shape);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' })
    ], BatchNormOps, "batchNormalization", null);
    return BatchNormOps;
}());
function batchnormReshape4D(x) {
    if (x == null) {
        return null;
    }
    if (x.rank === 0) {
        return x.as1D();
    }
    else if (x.rank === 1) {
        return x;
    }
    else if (x.rank === 2) {
        return x.as4D(1, 1, x.shape[0], x.shape[1]);
    }
    else if (x.rank === 3) {
        return x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
    }
    return x;
}
exports.batchNormalization2d = operation_1.op(BatchNormOps.batchNormalization2d);
exports.batchNormalization3d = operation_1.op(BatchNormOps.batchNormalization3d);
exports.batchNormalization4d = operation_1.op(BatchNormOps.batchNormalization4d);
exports.batchNormalization = operation_1.op(BatchNormOps.batchNormalization);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./array_ops":73,"./broadcast_util":77,"./operation":93,"./tensor_ops":109,"./unary_ops":111}],76:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var types_1 = require("../types");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var unary_ops_1 = require("./unary_ops");
var BinaryOps = (function () {
    function BinaryOps() {
    }
    BinaryOps.add = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'add');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'add');
        tensor_util_1.assertTypesMatch($a, $b);
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.add($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.addStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
        return a.add(b);
    };
    BinaryOps.sub = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'sub');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'sub');
        tensor_util_1.assertTypesMatch($a, $b);
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.neg().reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.subtract($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.subStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
        return a.sub(b);
    };
    BinaryOps.pow = function (base, exp) {
        var $base = tensor_util_1.convertToTensor(base, 'base', 'pow');
        var $exp = tensor_util_1.convertToTensor(exp, 'exp', 'pow');
        var outShape = broadcast_util.assertAndGetBroadcastShape($base.shape, $exp.shape);
        base = $base.cast(types_1.upcastType($base.dtype, $exp.dtype));
        exp = $exp.cast(types_1.upcastType($base.dtype, $exp.dtype));
        var grad = function (dy, saved) {
            var y = saved[0];
            var derBase = function () {
                var res = dy.mul($exp.toFloat().mul(y.div($base)));
                var reduceAxes = broadcast_util.getReductionAxes($base.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($base.shape);
            };
            var derExp = function () {
                var res = dy.mul(y.mul($base.log()).toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($exp.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($exp.shape);
            };
            return { $base: derBase, $exp: derExp };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.pow($base, $exp)); }, { $base: $base, $exp: $exp }, grad);
    };
    BinaryOps.powStrict = function (base, exp) {
        util.assertShapesMatch(base.shape, exp.shape, 'Error in powStrict: ');
        return base.pow(exp);
    };
    BinaryOps.mul = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'mul');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'mul');
        tensor_util_1.assertTypesMatch($a, $b);
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.mul($b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul($a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($b.shape);
                }
                return res;
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.multiply($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.mulStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
        return a.mul(b);
    };
    BinaryOps.div = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'div');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'div');
        tensor_util_1.assertTypesMatch($a, $b);
        var forwardFunc;
        if ($a.dtype === 'int32' && $b.dtype === 'int32') {
            return BinaryOps.floorDiv($a, $b);
        }
        else {
            forwardFunc = function (backend) { return backend.realDivide($a, $b); };
        }
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.div($b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul($a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape($b.shape);
                }
                var tmp = $b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(forwardFunc, { $a: $a, $b: $b }, der);
    };
    BinaryOps.floorDiv = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'floorDiv');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'floorDiv');
        tensor_util_1.assertTypesMatch($a, $b);
        var forwardFunc = function (backend) { return backend.floorDiv($a, $b); };
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.div($b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul($a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape($b.shape);
                }
                var tmp = $b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(forwardFunc, { $a: $a, $b: $b }, der);
    };
    BinaryOps.divStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
        return a.div(b);
    };
    BinaryOps.mod = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'mod');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'mod');
        tensor_util_1.assertTypesMatch($a, $b);
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return dy.sum(reduceAxes).reshape($a.shape);
                }
                return dy;
            };
            var derB = function () {
                var res = dy.mul($a.div($b).floor().neg());
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($b.shape);
                }
                return res;
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.mod($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.modStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in modStrict: ');
        return a.mod(b);
    };
    BinaryOps.minimum = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'minimum');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'minimum');
        tensor_util_1.assertTypesMatch($a, $b);
        if ($a.dtype === 'bool') {
            $a = $a.toInt();
        }
        if ($b.dtype === 'bool') {
            $b = $b.toInt();
        }
        broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul($a.lessEqual($b).toFloat()); };
            var derB = function () { return dy.mul($a.greater($b).toFloat()); };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.minimum($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.minimumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.minimum(b);
    };
    BinaryOps.maximum = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'maximum');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'maximum');
        tensor_util_1.assertTypesMatch($a, $b);
        if ($a.dtype === 'bool') {
            $a = $a.toInt();
        }
        if ($b.dtype === 'bool') {
            $b = $b.toInt();
        }
        broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul($a.greaterEqual($b).toFloat()); };
            var derB = function () { return dy.mul($a.less($b).toFloat()); };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.maximum($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.maximumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.maximum(b);
    };
    BinaryOps.squaredDifference = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'squaredDifference');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'squaredDifference');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var two = tensor_ops_1.scalar(2);
            var derA = function () { return dy.mul($a.sub($b).mul(two)); };
            var derB = function () { return dy.mul($b.sub($a).mul(two)); };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.squaredDifference($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.squaredDifferenceStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in squaredDifferenceStrict: ');
        return a.squaredDifference(b);
    };
    BinaryOps.atan2 = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'atan2');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'atan2');
        tensor_util_1.assertTypesMatch($a, $b);
        var outShape = broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var d = BinaryOps.add($a.square(), $b.square());
                var res = dy.mul($b.div(d));
                var reduceAxes = broadcast_util.getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($a.shape);
            };
            var derB = function () {
                var d = BinaryOps.add($a.square(), $b.square());
                var res = unary_ops_1.neg(dy.mul($a.div(d)));
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.atan2($a, $b); }, { $a: $a, $b: $b }, der);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "add", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "sub", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "pow", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "mul", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "div", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "floorDiv", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "mod", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "minimum", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "maximum", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' })
    ], BinaryOps, "squaredDifference", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], BinaryOps, "atan2", null);
    return BinaryOps;
}());
exports.add = operation_1.op(BinaryOps.add);
exports.addStrict = operation_1.op(BinaryOps.addStrict);
exports.atan2 = operation_1.op(BinaryOps.atan2);
exports.div = operation_1.op(BinaryOps.div);
exports.divStrict = operation_1.op(BinaryOps.divStrict);
exports.floorDiv = operation_1.op(BinaryOps.floorDiv);
exports.maximum = operation_1.op(BinaryOps.maximum);
exports.maximumStrict = operation_1.op(BinaryOps.maximumStrict);
exports.minimum = operation_1.op(BinaryOps.minimum);
exports.minimumStrict = operation_1.op(BinaryOps.minimumStrict);
exports.mod = operation_1.op(BinaryOps.mod);
exports.modStrict = operation_1.op(BinaryOps.modStrict);
exports.mul = operation_1.op(BinaryOps.mul);
exports.mulStrict = operation_1.op(BinaryOps.mulStrict);
exports.pow = operation_1.op(BinaryOps.pow);
exports.powStrict = operation_1.op(BinaryOps.powStrict);
exports.squaredDifference = operation_1.op(BinaryOps.squaredDifference);
exports.squaredDifferenceStrict = operation_1.op(BinaryOps.squaredDifferenceStrict);
exports.sub = operation_1.op(BinaryOps.sub);
exports.subStrict = operation_1.op(BinaryOps.subStrict);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../types":130,"../util":131,"./broadcast_util":77,"./operation":93,"./tensor_ops":109,"./unary_ops":111}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBroadcastDims(inShape, outShape) {
    var inRank = inShape.length;
    var dims = [];
    for (var i = 0; i < inRank; i++) {
        var dim = inRank - 1 - i;
        var a = inShape[dim] || 1;
        var b = outShape[outShape.length - 1 - i] || 1;
        if (b > 1 && a === 1) {
            dims.unshift(dim);
        }
    }
    return dims;
}
exports.getBroadcastDims = getBroadcastDims;
function getReductionAxes(inShape, outShape) {
    var result = [];
    for (var i = 0; i < outShape.length; i++) {
        var inDim = inShape[inShape.length - i - 1];
        var outAxis = outShape.length - i - 1;
        var outDim = outShape[outAxis];
        if (inDim == null || (inDim === 1 && outDim > 1)) {
            result.unshift(outAxis);
        }
    }
    return result;
}
exports.getReductionAxes = getReductionAxes;
function broadcastDimsAreOuter(dims) {
    for (var i = 0; i < dims.length; i++) {
        if (dims[i] !== i) {
            return false;
        }
    }
    return true;
}
exports.broadcastDimsAreOuter = broadcastDimsAreOuter;
function assertAndGetBroadcastShape(shapeA, shapeB) {
    var result = [];
    var errMsg = "Operands could not be broadcast together with shapes " +
        (shapeA + " and " + shapeB + ".");
    var l = Math.max(shapeA.length, shapeB.length);
    for (var i = 0; i < l; i++) {
        var a = shapeA[shapeA.length - i - 1] || 1;
        var b = shapeB[shapeB.length - i - 1] || 1;
        if (a > 1 && b > 1 && a !== b) {
            throw Error(errMsg);
        }
        result.unshift(Math.max(a, b));
    }
    return result;
}
exports.assertAndGetBroadcastShape = assertAndGetBroadcastShape;

},{}],78:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util_1 = require("../util");
var broadcast_util_1 = require("./broadcast_util");
var operation_1 = require("./operation");
var CompareOps = (function () {
    function CompareOps() {
    }
    CompareOps.notEqual = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'notEqual');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'notEqual');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.notEqual($a, $b); }, { $a: $a, $b: $b });
    };
    CompareOps.notEqualStrict = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'notEqualStrict');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'notEqualStrict');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in notEqualStrict: ');
        return $a.notEqual($b);
    };
    CompareOps.less = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'less');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'less');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.less($a, $b); }, { $a: $a, $b: $b });
    };
    CompareOps.lessStrict = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'lessStrict');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'lessStrict');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in lessStrict: ');
        return $a.less($b);
    };
    CompareOps.equal = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'equal');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'equal');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.equal($a, $b); }, { $a: $a, $b: $b });
    };
    CompareOps.equalStrict = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'equalStrict');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'equalStrict');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in equalStrict: ');
        return $a.equal($b);
    };
    CompareOps.lessEqual = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'lessEqual');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'lessEqual');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.lessEqual($a, $b); }, { $a: $a, $b: $b });
    };
    CompareOps.lessEqualStrict = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'lessEqualStrict');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'lessEqualStrict');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in lessEqualStrict: ');
        return $a.lessEqual($b);
    };
    CompareOps.greater = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'greater');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'greater');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.greater($a, $b); }, { $a: $a, $b: $b });
    };
    CompareOps.greaterStrict = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'greaterStrict');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'greaterStrict');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in greaterStrict: ');
        return $a.greater($b);
    };
    CompareOps.greaterEqual = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'greaterEqual');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'greaterEqual');
        tensor_util_1.assertTypesMatch($a, $b);
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.greaterEqual($a, $b); }, { $a: $a, $b: $b });
    };
    CompareOps.greaterEqualStrict = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'greaterEqualStrict');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'greaterEqualStrict');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in greaterEqualStrict: ');
        return $a.greaterEqual($b);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], CompareOps, "notEqual", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], CompareOps, "less", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], CompareOps, "equal", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], CompareOps, "lessEqual", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], CompareOps, "greater", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], CompareOps, "greaterEqual", null);
    return CompareOps;
}());
exports.equal = operation_1.op(CompareOps.equal);
exports.equalStrict = operation_1.op(CompareOps.equalStrict);
exports.greater = operation_1.op(CompareOps.greater);
exports.greaterEqual = operation_1.op(CompareOps.greaterEqual);
exports.greaterEqualStrict = operation_1.op(CompareOps.greaterEqualStrict);
exports.greaterStrict = operation_1.op(CompareOps.greaterStrict);
exports.less = operation_1.op(CompareOps.less);
exports.lessEqual = operation_1.op(CompareOps.lessEqual);
exports.lessEqualStrict = operation_1.op(CompareOps.lessEqualStrict);
exports.lessStrict = operation_1.op(CompareOps.lessStrict);
exports.notEqual = operation_1.op(CompareOps.notEqual);
exports.notEqualStrict = operation_1.op(CompareOps.notEqualStrict);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./broadcast_util":77,"./operation":93}],79:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util_1 = require("../util");
var axis_util_1 = require("./axis_util");
var concat_util = require("./concat_util");
var operation_1 = require("./operation");
var ConcatOps = (function () {
    function ConcatOps() {
    }
    ConcatOps.concat1d = function (tensors) {
        return ConcatOps.concat(tensors, 0);
    };
    ConcatOps.concat2d = function (tensors, axis) {
        return ConcatOps.concat(tensors, axis);
    };
    ConcatOps.concat3d = function (tensors, axis) {
        return ConcatOps.concat(tensors, axis);
    };
    ConcatOps.concat4d = function (tensors, axis) {
        return ConcatOps.concat(tensors, axis);
    };
    ConcatOps.concat = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        util_1.assert(tensors.length >= 1, 'Pass at least one tensor to concat');
        var $tensors = tensor_util_1.convertToTensorArray(tensors, 'tensors', 'concat');
        var result = $tensors[0];
        if ($tensors.length === 1) {
            return result;
        }
        var axes = axis_util_1.parseAxisParam(axis, result.shape);
        for (var i = 1; i < $tensors.length; ++i) {
            result = concat2Tensors(result, $tensors[i], axes[0]);
        }
        return result;
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], ConcatOps, "concat", null);
    return ConcatOps;
}());
function concat2Tensors(a, b, axis) {
    concat_util.assertParams(a.shape, b.shape, axis);
    var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
    var a2D = a.as2D(-1, util_1.sizeFromShape(a.shape.slice(axis)));
    var b2D = b.as2D(-1, util_1.sizeFromShape(b.shape.slice(axis)));
    var _a = concat_util.computeGradientSliceShapes(a2D.shape, b2D.shape), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
    var der = function (dy) {
        return { a: function () { return dy.slice(aBegin, aSize); }, b: function () { return dy.slice(bBegin, bSize); } };
    };
    var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.concat(a2D, b2D); }, { a: a2D, b: b2D }, der);
    return res.reshape(outShape);
}
exports.concat = operation_1.op(ConcatOps.concat);
exports.concat1d = operation_1.op(ConcatOps.concat1d);
exports.concat2d = operation_1.op(ConcatOps.concat2d);
exports.concat3d = operation_1.op(ConcatOps.concat3d);
exports.concat4d = operation_1.op(ConcatOps.concat4d);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./axis_util":74,"./concat_util":80,"./operation":93}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function assertParams(aShape, bShape, axis) {
    var aRank = aShape.length;
    var bRank = bShape.length;
    util.assert(aShape.length === bShape.length, "Error in concat" + aRank + "D: rank of x1 (" + aRank + ") and x2 (" + bRank + ") " +
        "must be the same.");
    util.assert(axis >= 0 && axis < aRank, "Error in concat" + aRank + "D: axis must be " +
        ("between 0 and " + (aRank - 1) + "."));
    for (var i = 0; i < aRank; i++) {
        util.assert((i === axis) || (aShape[i] === bShape[i]), "Error in concat" + aRank + "D: Shape (" + aShape + ") does not match " +
            ("(" + bShape + ") along the non-concatenated axis " + i + "."));
    }
}
exports.assertParams = assertParams;
function computeOutShape(x1Shape, x2Shape, axis) {
    util.assert(x1Shape.length === x2Shape.length, 'x1 and x2 should have the same rank.');
    var outputShape = x1Shape.slice();
    outputShape[axis] += x2Shape[axis];
    return outputShape;
}
exports.computeOutShape = computeOutShape;
function computeGradientSliceShapes(aShape, bShape) {
    return {
        aBegin: [0, 0],
        aSize: aShape,
        bBegin: [0, aShape[1]],
        bSize: bShape
    };
}
exports.computeGradientSliceShapes = computeGradientSliceShapes;

},{"../util":131}],81:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var conv_util = require("./conv_util");
var operation_1 = require("./operation");
var ConvOps = (function () {
    function ConvOps() {
    }
    ConvOps.conv1d = function (x, filter, stride, pad, dataFormat, dilation, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NWC'; }
        if (dilation === void 0) { dilation = 1; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'conv1d');
        var $filter = tensor_util_1.convertToTensor(filter, 'filter', 'conv1d');
        var x3D = $x;
        var reshapedTo3D = false;
        if ($x.rank === 2) {
            reshapedTo3D = true;
            x3D = $x.as3D(1, $x.shape[0], $x.shape[1]);
        }
        util.assert(x3D.rank === 3, "Error in conv1d: input must be rank 3, but got rank " + x3D.rank + ".");
        util.assert($filter.rank === 3, "Error in conv1d: filter must be rank 3, but got rank " +
            ($filter.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv1d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        util.assert(x3D.shape[2] === $filter.shape[1], "Error in conv1d: depth of input (" + x3D.shape[2] + ") must match " +
            ("input depth for filter " + $filter.shape[1] + "."));
        util.assert(eitherStridesOrDilationsAreOne(stride, dilation), 'Error in conv1D: Either stride or dilation must be 1. ' +
            ("Got stride " + stride + " and dilation '" + dilation + "'"));
        util.assert(dataFormat === 'NWC', "Error in conv1d: got dataFormat of " + dataFormat + " but only NWC is currently supported.");
        var filter4D = $filter.as4D(1, $filter.shape[0], $filter.shape[1], $filter.shape[2]);
        var input4D = x3D.as4D(x3D.shape[0], 1, x3D.shape[1], x3D.shape[2]);
        var strides = [1, stride];
        var dilations = [1, dilation];
        var conv2dDataFormat = 'NHWC';
        var res = ConvOps.conv2d(input4D, filter4D, strides, pad, conv2dDataFormat, dilations, dimRoundingMode);
        if (reshapedTo3D) {
            return res.as2D(res.shape[2], res.shape[3]);
        }
        return res.as3D(res.shape[0], res.shape[2], res.shape[3]);
    };
    ConvOps.conv2d = function (x, filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'conv2d');
        var $filter = tensor_util_1.convertToTensor(filter, 'filter', 'conv2d');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in conv2d: input must be rank 4, but got rank " + x4D.rank + ".");
        util.assert($filter.rank === 4, "Error in conv2d: filter must be rank 4, but got rank " +
            ($filter.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        util.assert(x4D.shape[3] === $filter.shape[2], "Error in conv2d: depth of input (" + x4D.shape[3] + ") must match " +
            ("input depth for filter " + $filter.shape[2] + "."));
        util.assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in conv2D: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        util.assert(dataFormat === 'NHWC', "Error in conv2d: got dataFormat of " + dataFormat + " but only NHWC is currently supported.");
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, $filter.shape, strides, dilations, pad, dimRoundingMode);
        var grad = function (dy) {
            util.assert(tupleValuesAreOne(dilations), 'Error in gradient of conv2D: dilation rates greater than 1 are not' +
                ("yet supported in gradients. Got dilations '" + dilations + "'"));
            return {
                x: function () { return ConvOps.conv2dDerInput(x4D.shape, dy, $filter, strides, pad); },
                $filter: function () {
                    return ConvOps.conv2dDerFilter(x4D, dy, $filter.shape, strides, pad);
                }
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.conv2d(x4D, $filter, convInfo); }, { x: x4D, $filter: $filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.conv2dDerInput = function (xShape, dy, filter, strides, pad, dimRoundingMode) {
        util.assert(xShape.length === dy.rank, "Length of inShape " +
            ("(" + xShape.length + ") and rank of dy (" + dy.rank + ") must match"));
        var xShape4D = xShape;
        var dy4D = dy;
        var reshapedTo4D = false;
        if (dy.rank === 3) {
            reshapedTo4D = true;
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
            xShape4D = [1, xShape[0], xShape[1], xShape[2]];
        }
        var inDepth = xShape4D[3];
        var outDepth = dy4D.shape[3];
        util.assert(xShape4D.length === 4, "Error in conv2dDerInput: inShape must be length 4, but got length " +
            (xShape4D.length + "."));
        util.assert(dy4D.rank === 4, "Error in conv2dDerInput: dy must be rank 4, but got " +
            ("rank " + dy4D.rank));
        util.assert(filter.rank === 4, "Error in conv2dDerInput: filter must be rank 4, but got " +
            ("rank " + filter.rank));
        util.assert(inDepth === filter.shape[2], "Error in conv2dDerInput: depth of input (" + inDepth + ") must " +
            ("match input depth for filter " + filter.shape[2] + "."));
        util.assert(outDepth === filter.shape[3], "Error in conv2dDerInput: depth of output (" + outDepth + ") must " +
            ("match output depth for filter " + filter.shape[3] + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2dDerInput: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(xShape4D, filter.shape, strides, dilations, pad, dimRoundingMode);
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.conv2dDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.conv2dDerFilter = function (x, dy, filterShape, strides, pad, dimRoundingMode) {
        var x4D = x;
        if (x.rank === 3) {
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        var dy4D = dy;
        if (dy4D.rank === 3) {
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in conv2dDerFilter: input must be rank 4, but got shape " +
            (x4D.shape + "."));
        util.assert(dy4D.rank === 4, "Error in conv2dDerFilter: dy must be rank 4, but got shape " +
            (dy4D.shape + "."));
        util.assert(filterShape.length === 4, "Error in conv2dDerFilter: filterShape must be length 4, but got " +
            (filterShape + "."));
        util.assert(x4D.shape[3] === filterShape[2], "Error in conv2dDerFilter: depth of input " + x4D.shape[3] + ") must " +
            ("match input depth in filter (" + filterShape[2] + "."));
        util.assert(dy4D.shape[3] === filterShape[3], "Error in conv2dDerFilter: depth of dy (" + dy4D.shape[3] + ") must " +
            ("match output depth for filter (" + filterShape[3] + ")."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2dDerFilter: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, filterShape, strides, dilations, pad, dimRoundingMode);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.conv2dDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
    };
    ConvOps.conv2dTranspose = function (x, filter, outputShape, strides, pad, dimRoundingMode) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'conv2dTranspose');
        var $filter = tensor_util_1.convertToTensor(filter, 'filter', 'conv2dTranspose');
        return ConvOps.conv2dDerInput(outputShape, $x, $filter, strides, pad, dimRoundingMode);
    };
    ConvOps.depthwiseConv2d = function (x, filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'depthwiseConv2d');
        var $filter = tensor_util_1.convertToTensor(filter, 'filter', 'depthwiseConv2d');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in depthwiseConv2d: input must be rank 4, but got " +
            ("rank " + x4D.rank + "."));
        util.assert($filter.rank === 4, "Error in depthwiseConv2d: filter must be rank 4, but got rank " +
            ($filter.rank + "."));
        util.assert(x4D.shape[3] === $filter.shape[2], "Error in depthwiseConv2d: number of input channels " +
            ("(" + x4D.shape[3] + ") must match the inChannels dimension in ") +
            ("filter " + $filter.shape[2] + "."));
        if (dilations == null) {
            dilations = [1, 1];
        }
        util.assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in depthwiseConv2d: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in depthwiseConv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, $filter.shape, strides, dilations, pad, dimRoundingMode, true);
        var grad = function (dy) {
            util.assert(tupleValuesAreOne(dilations), 'Error in gradient of depthwiseConv2d: dilation rates greater than ' +
                ("1 are not yet supported. Got dilations '" + dilations + "'"));
            return {
                x: function () { return depthwiseConv2dDerInput(x4D.shape, dy, $filter, convInfo); },
                $filter: function () {
                    return depthwiseConv2dDerFilter(x4D, dy, $filter.shape, convInfo);
                },
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2D(x4D, $filter, convInfo); }, { x: x4D, $filter: $filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.separableConv2d = function (x, depthwiseFilter, pointwiseFilter, strides, pad, dilation, dataFormat) {
        if (dilation === void 0) { dilation = [1, 1]; }
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'separableConv2d');
        var $depthwiseFilter = tensor_util_1.convertToTensor(depthwiseFilter, 'depthwiseFilter', 'separableConv2d');
        var $pointwiseFilter = tensor_util_1.convertToTensor(pointwiseFilter, 'pointwiseFilter', 'separableConv2d');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        if (dataFormat === 'NCHW') {
            throw new Error('separableConv2d currently does not support dataFormat NCHW; only ' +
                'NHWC is supported');
        }
        util.assert(x4D.rank === 4, "Error in separableConv2d: input must be rank 4, but got " +
            ("rank " + x4D.rank + "."));
        util.assert($depthwiseFilter.rank === 4, "Error in separableConv2d: depthwise filter must be rank 4, but got " +
            ("rank " + $depthwiseFilter.rank + "."));
        util.assert($pointwiseFilter.rank === 4, "Error in separableConv2d: pointwise filter must be rank 4, but got " +
            ("rank " + $depthwiseFilter.rank + "."));
        util.assert($pointwiseFilter.shape[0] === 1, "Error in separableConv2d: the first dimension of pointwise filter " +
            (" must be 1, but got " + $pointwiseFilter.shape[0] + "."));
        util.assert($pointwiseFilter.shape[1] === 1, "Error in separableConv2d: the second dimension of pointwise filter " +
            (" must be 1, but got " + $pointwiseFilter.shape[1] + "."));
        var inChannels = $depthwiseFilter.shape[2];
        var channelMultiplier = $depthwiseFilter.shape[3];
        util.assert($pointwiseFilter.shape[2] === inChannels * channelMultiplier, "Error in separableConv2d: the third dimension of pointwise filter " +
            ("must be " + inChannels * channelMultiplier + ", ") +
            ("but got " + $pointwiseFilter.shape[2] + "."));
        var depthwise = ConvOps.depthwiseConv2d(x4D, $depthwiseFilter, strides, pad, dataFormat, dilation);
        var pointwiseStride = 1;
        var res = ConvOps.conv2d(depthwise, $pointwiseFilter, pointwiseStride, 'valid', dataFormat);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], ConvOps, "conv1d", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], ConvOps, "conv2d", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], ConvOps, "conv2dTranspose", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], ConvOps, "depthwiseConv2d", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], ConvOps, "separableConv2d", null);
    return ConvOps;
}());
function parseTupleParam(param) {
    return typeof param === 'number' ? [param, param] : param;
}
function tupleValuesAreOne(param) {
    var _a = parseTupleParam(param), dimA = _a[0], dimB = _a[1];
    return dimA === 1 && dimB === 1;
}
function eitherStridesOrDilationsAreOne(strides, dilations) {
    return tupleValuesAreOne(strides) || tupleValuesAreOne(dilations);
}
function depthwiseConv2dDerInput(xShape, dy, filter, convInfo) {
    var dy4D = dy;
    var reshapedTo4D = false;
    if (dy.rank === 3) {
        reshapedTo4D = true;
        dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
    }
    var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2DDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D });
    if (reshapedTo4D) {
        return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
    }
    return res;
}
function depthwiseConv2dDerFilter(x, dy, filterShape, convInfo) {
    var x4D = x;
    if (x.rank === 3) {
        x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
    }
    var dy4D = dy;
    if (dy4D.rank === 3) {
        dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
    }
    return environment_1.ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2DDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
}
exports.conv1d = operation_1.op(ConvOps.conv1d);
exports.conv2d = operation_1.op(ConvOps.conv2d);
exports.depthwiseConv2d = operation_1.op(ConvOps.depthwiseConv2d);
exports.separableConv2d = operation_1.op(ConvOps.separableConv2d);
exports.conv2dTranspose = operation_1.op(ConvOps.conv2dTranspose);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./conv_util":82,"./operation":93}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function computePool2DInfo(inShape, filterSize, strides, pad, roundingMode, dataFormat) {
    if (dataFormat === void 0) { dataFormat = 'channelsLast'; }
    var _a = parseTupleParam(filterSize), filterHeight = _a[0], filterWidth = _a[1];
    var filterShape;
    if (dataFormat === 'channelsLast') {
        filterShape = [filterHeight, filterWidth, inShape[3], inShape[3]];
    }
    else if (dataFormat === 'channelsFirst') {
        filterShape = [filterHeight, filterWidth, inShape[1], inShape[1]];
    }
    else {
        throw new Error("Unknown dataFormat " + dataFormat);
    }
    var dilations = 1;
    return computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, false, dataFormat);
}
exports.computePool2DInfo = computePool2DInfo;
function computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, depthwise, dataFormat) {
    if (depthwise === void 0) { depthwise = false; }
    if (dataFormat === void 0) { dataFormat = 'channelsLast'; }
    var _a = [-1, -1, -1, -1], batchSize = _a[0], inHeight = _a[1], inWidth = _a[2], inChannels = _a[3];
    if (dataFormat === 'channelsLast') {
        batchSize = inShape[0], inHeight = inShape[1], inWidth = inShape[2], inChannels = inShape[3];
    }
    else if (dataFormat === 'channelsFirst') {
        batchSize = inShape[0], inChannels = inShape[1], inHeight = inShape[2], inWidth = inShape[3];
    }
    else {
        throw new Error("Unknown dataFormat " + dataFormat);
    }
    var filterHeight = filterShape[0], filterWidth = filterShape[1], filterChannels = filterShape[3];
    var _b = parseTupleParam(strides), strideHeight = _b[0], strideWidth = _b[1];
    var _c = parseTupleParam(dilations), dilationHeight = _c[0], dilationWidth = _c[1];
    var effectiveFilterHeight = getEffectiveFilterSize(filterHeight, dilationHeight);
    var effectiveFilterWidth = getEffectiveFilterSize(filterWidth, dilationWidth);
    var _d = getPadAndOutInfo(pad, inHeight, inWidth, strideHeight, strideWidth, effectiveFilterHeight, effectiveFilterWidth, roundingMode), padInfo = _d.padInfo, outHeight = _d.outHeight, outWidth = _d.outWidth;
    var outChannels = depthwise ? filterChannels * inChannels : filterChannels;
    var outShape;
    if (dataFormat === 'channelsFirst') {
        outShape = [batchSize, outChannels, outHeight, outWidth];
    }
    else if (dataFormat === 'channelsLast') {
        outShape = [batchSize, outHeight, outWidth, outChannels];
    }
    return {
        batchSize: batchSize,
        dataFormat: dataFormat,
        inHeight: inHeight,
        inWidth: inWidth,
        inChannels: inChannels,
        outHeight: outHeight,
        outWidth: outWidth,
        outChannels: outChannels,
        padInfo: padInfo,
        strideHeight: strideHeight,
        strideWidth: strideWidth,
        filterHeight: filterHeight,
        filterWidth: filterWidth,
        dilationHeight: dilationHeight,
        dilationWidth: dilationWidth,
        inShape: inShape,
        outShape: outShape,
        filterShape: filterShape
    };
}
exports.computeConv2DInfo = computeConv2DInfo;
function computeOutputShape3D(inShape, fieldSize, outDepth, stride, zeroPad, roundingMode) {
    if (zeroPad == null) {
        zeroPad = computeDefaultPad(inShape, fieldSize, stride);
    }
    var inputRows = inShape[0];
    var inputCols = inShape[1];
    var outputRows = conditionalRound((inputRows - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    util.assert(util.isInt(outputRows), "The output # of rows (" + outputRows + ") must be an integer. Change the " +
        "stride and/or zero pad parameters");
    var outputCols = conditionalRound((inputCols - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    util.assert(util.isInt(outputCols), "The output # of columns (" + outputCols + ") must be an integer. Change " +
        "the stride and/or zero pad parameters");
    return [outputRows, outputCols, outDepth];
}
function computeDefaultPad(inputShape, fieldSize, stride, dilation) {
    if (dilation === void 0) { dilation = 1; }
    var effectiveFieldSize = getEffectiveFilterSize(fieldSize, dilation);
    return Math.floor((inputShape[0] * (stride - 1) - stride + effectiveFieldSize) / 2);
}
exports.computeDefaultPad = computeDefaultPad;
function parseTupleParam(param) {
    return typeof param === 'number' ? [param, param] : param;
}
function getEffectiveFilterSize(filterSize, dilation) {
    if (dilation <= 1) {
        return filterSize;
    }
    return filterSize + (filterSize - 1) * (dilation - 1);
}
function getPadAndOutInfo(pad, inHeight, inWidth, strideHeight, strideWidth, filterHeight, filterWidth, roundingMode) {
    var padInfo;
    var outHeight;
    var outWidth;
    if (typeof pad === 'number') {
        var padType = (pad === 0) ? 'VALID' : 'NUMBER';
        padInfo = { top: pad, bottom: pad, left: pad, right: pad, type: padType };
        var outShape = computeOutputShape3D([inHeight, inWidth, 1], filterHeight, 1, strideHeight, pad, roundingMode);
        outHeight = outShape[0];
        outWidth = outShape[1];
    }
    else if (pad === 'same') {
        outHeight = Math.ceil(inHeight / strideHeight);
        outWidth = Math.ceil(inWidth / strideWidth);
        var padAlongHeight = (outHeight - 1) * strideHeight + filterHeight - inHeight;
        var padAlongWidth = (outWidth - 1) * strideWidth + filterWidth - inWidth;
        var top_1 = Math.floor(padAlongHeight / 2);
        var bottom = padAlongHeight - top_1;
        var left = Math.floor(padAlongWidth / 2);
        var right = padAlongWidth - left;
        padInfo = { top: top_1, bottom: bottom, left: left, right: right, type: 'SAME' };
    }
    else if (pad === 'valid') {
        padInfo = { top: 0, bottom: 0, left: 0, right: 0, type: 'VALID' };
        outHeight = Math.ceil((inHeight - filterHeight + 1) / strideHeight);
        outWidth = Math.ceil((inWidth - filterWidth + 1) / strideWidth);
    }
    else {
        throw Error("Unknown padding parameter: " + pad);
    }
    return { padInfo: padInfo, outHeight: outHeight, outWidth: outWidth };
}
function conditionalRound(value, roundingMode) {
    if (!roundingMode) {
        return value;
    }
    switch (roundingMode) {
        case 'round':
            return Math.round(value);
        case 'ceil':
            return Math.ceil(value);
        case 'floor':
            return Math.floor(value);
        default:
            throw new Error("Unknown roundingMode " + roundingMode);
    }
}

},{"../util":131}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERF_P = 0.3275911;
exports.ERF_A1 = 0.254829592;
exports.ERF_A2 = -0.284496736;
exports.ERF_A3 = 1.421413741;
exports.ERF_A4 = -1.453152027;
exports.ERF_A5 = 1.061405429;

},{}],84:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var operation_1 = require("./operation");
var ImageOps = (function () {
    function ImageOps() {
    }
    ImageOps.resizeBilinear = function (images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        var $images = tensor_util_1.convertToTensor(images, 'images', 'resizeBilinear');
        util.assert($images.rank === 3 || $images.rank === 4, "Error in resizeBilinear: x must be rank 3 or 4, but got " +
            ("rank " + $images.rank + "."));
        util.assert(size.length === 2, "Error in resizeBilinear: new shape must 2D, but got shape " +
            (size + "."));
        var batchImages = $images;
        var reshapedTo4D = false;
        if ($images.rank === 3) {
            reshapedTo4D = true;
            batchImages =
                $images.as4D(1, $images.shape[0], $images.shape[1], $images.shape[2]);
        }
        var newHeight = size[0], newWidth = size[1];
        var forward = function (backend, save) {
            return backend.resizeBilinear(batchImages, newHeight, newWidth, alignCorners);
        };
        var backward = function (dy, saved) {
            return {
                batchImages: function () { return environment_1.ENV.engine.runKernel(function (backend) {
                    return backend.resizeBilinearBackprop(dy, batchImages, alignCorners);
                }, {}); }
            };
        };
        var res = environment_1.ENV.engine.runKernel(forward, { batchImages: batchImages }, backward);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ImageOps.resizeNearestNeighbor = function (images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        var $images = tensor_util_1.convertToTensor(images, 'images', 'resizeNearestNeighbor');
        util.assert($images.rank === 3 || $images.rank === 4, "Error in resizeNearestNeighbor: x must be rank 3 or 4, but got " +
            ("rank " + $images.rank + "."));
        util.assert(size.length === 2, "Error in resizeNearestNeighbor: new shape must 2D, but got shape " +
            (size + "."));
        util.assert($images.dtype === 'float32' || $images.dtype === 'int32', '`images` must have `int32` or `float32` as dtype');
        var batchImages = $images;
        var reshapedTo4D = false;
        if ($images.rank === 3) {
            reshapedTo4D = true;
            batchImages =
                $images.as4D(1, $images.shape[0], $images.shape[1], $images.shape[2]);
        }
        var newHeight = size[0], newWidth = size[1];
        var forward = function (backend, save) {
            return backend.resizeNearestNeighbor(batchImages, newHeight, newWidth, alignCorners);
        };
        var backward = function (dy, saved) {
            return {
                batchImages: function () { return environment_1.ENV.engine.runKernel(function (backend) { return backend.resizeNearestNeighborBackprop(dy, batchImages, alignCorners); }, {}); }
            };
        };
        var res = environment_1.ENV.engine.runKernel(forward, { batchImages: batchImages }, backward);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Images', namespace: 'image' })
    ], ImageOps, "resizeBilinear", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Images', namespace: 'image' })
    ], ImageOps, "resizeNearestNeighbor", null);
    return ImageOps;
}());
exports.resizeBilinear = operation_1.op(ImageOps.resizeBilinear);
exports.resizeNearestNeighbor = operation_1.op(ImageOps.resizeNearestNeighbor);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./operation":93}],85:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var util_1 = require("../util");
var array_ops_1 = require("./array_ops");
var norm_1 = require("./norm");
var operation_1 = require("./operation");
var reduction_ops_1 = require("./reduction_ops");
var tensor_ops_1 = require("./tensor_ops");
var LinalgOps = (function () {
    function LinalgOps() {
    }
    LinalgOps.gramSchmidt = function (xs) {
        var inputIsTensor2D;
        if (Array.isArray(xs)) {
            inputIsTensor2D = false;
            util_1.assert(xs != null && xs.length > 0, 'Gram-Schmidt process: input must not be null, undefined, or empty');
            var dim = xs[0].shape[0];
            for (var i = 1; i < xs.length; ++i) {
                util_1.assert(xs[i].shape[0] === dim, 'Gram-Schmidt: Non-unique lengths found in the input vectors: ' +
                    ("(" + xs[i].shape[0] + " vs. " + dim + ")"));
            }
        }
        else {
            inputIsTensor2D = true;
            xs = array_ops_1.split(xs, xs.shape[0], 0).map(function (x) { return array_ops_1.squeeze(x, [0]); });
        }
        util_1.assert(xs.length <= xs[0].shape[0], "Gram-Schmidt: Number of vectors (" + xs.length + ") exceeds " +
            ("number of dimensions (" + xs[0].shape[0] + ")."));
        var ys = [];
        var xs1d = xs;
        var _loop_1 = function (i) {
            ys.push(environment_1.ENV.engine.tidy(function () {
                var x = xs1d[i];
                if (i > 0) {
                    for (var j = 0; j < i; ++j) {
                        var proj = reduction_ops_1.sum(ys[j].mulStrict(x)).mul(ys[j]);
                        x = x.sub(proj);
                    }
                }
                return x.div(norm_1.norm(x, 'euclidean'));
            }));
        };
        for (var i = 0; i < xs.length; ++i) {
            _loop_1(i);
        }
        if (inputIsTensor2D) {
            return array_ops_1.stack(ys, 0);
        }
        else {
            return ys;
        }
    };
    LinalgOps.qr = function (x, fullMatrices) {
        if (fullMatrices === void 0) { fullMatrices = false; }
        if (x.rank < 2) {
            throw new Error("qr() requires input tensor to have a rank >= 2, but got rank " + x.rank);
        }
        else if (x.rank === 2) {
            return qr2d(x, fullMatrices);
        }
        else {
            var outerDimsProd = x.shape.slice(0, x.shape.length - 2)
                .reduce(function (value, prev) { return value * prev; });
            var x2ds = array_ops_1.unstack(x.reshape([
                outerDimsProd, x.shape[x.shape.length - 2],
                x.shape[x.shape.length - 1]
            ]), 0);
            var q2ds_1 = [];
            var r2ds_1 = [];
            x2ds.forEach(function (x2d) {
                var _a = qr2d(x2d, fullMatrices), q2d = _a[0], r2d = _a[1];
                q2ds_1.push(q2d);
                r2ds_1.push(r2d);
            });
            var q = array_ops_1.stack(q2ds_1, 0).reshape(x.shape);
            var r = array_ops_1.stack(r2ds_1, 0).reshape(x.shape);
            return [q, r];
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Linear Algebra' })
    ], LinalgOps, "gramSchmidt", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Linear Algebra' })
    ], LinalgOps, "qr", null);
    return LinalgOps;
}());
function qr2d(x, fullMatrices) {
    if (fullMatrices === void 0) { fullMatrices = false; }
    return environment_1.ENV.engine.tidy(function () {
        if (x.shape.length !== 2) {
            throw new Error("qr2d() requires a 2D Tensor, but got a " + x.shape.length + "D Tensor.");
        }
        var m = x.shape[0];
        var n = x.shape[1];
        var q = array_ops_1.eye(m);
        var r = x.clone();
        var one2D = tensor_ops_1.tensor2d([[1]], [1, 1]);
        var w = one2D.clone();
        var iters = m >= n ? n : m;
        var _loop_2 = function (j) {
            var _a;
            var rTemp = r;
            var wTemp = w;
            var qTemp = q;
            _a = environment_1.ENV.engine.tidy(function () {
                var rjEnd1 = r.slice([j, j], [m - j, 1]);
                var normX = rjEnd1.norm();
                var rjj = r.slice([j, j], [1, 1]);
                var s = rjj.sign().neg();
                var u1 = rjj.sub(s.mul(normX));
                var wPre = rjEnd1.div(u1);
                if (wPre.shape[0] === 1) {
                    w = one2D.clone();
                }
                else {
                    w = one2D.concat(wPre.slice([1, 0], [wPre.shape[0] - 1, wPre.shape[1]]), 0);
                }
                var tau = s.matMul(u1).div(normX).neg();
                var rjEndAll = r.slice([j, 0], [m - j, n]);
                var tauTimesW = tau.mul(w);
                if (j === 0) {
                    r = rjEndAll.sub(tauTimesW.matMul(w.transpose().matMul(rjEndAll)));
                }
                else {
                    r = r.slice([0, 0], [j, n])
                        .concat(rjEndAll.sub(tauTimesW.matMul(w.transpose().matMul(rjEndAll))), 0);
                }
                var qAllJEnd = q.slice([0, j], [m, q.shape[1] - j]);
                if (j === 0) {
                    q = qAllJEnd.sub(qAllJEnd.matMul(w).matMul(tauTimesW.transpose()));
                }
                else {
                    q = q.slice([0, 0], [m, j])
                        .concat(qAllJEnd.sub(qAllJEnd.matMul(w).matMul(tauTimesW.transpose())), 1);
                }
                return [w, r, q];
            }), w = _a[0], r = _a[1], q = _a[2];
            globals_1.dispose([rTemp, wTemp, qTemp]);
        };
        for (var j = 0; j < iters; ++j) {
            _loop_2(j);
        }
        if (!fullMatrices && m > n) {
            q = q.slice([0, 0], [m, n]);
            r = r.slice([0, 0], [n, n]);
        }
        return [q, r];
    });
}
exports.gramSchmidt = operation_1.op(LinalgOps.gramSchmidt);
exports.qr = operation_1.op(LinalgOps.qr);

},{"../doc":11,"../environment":13,"../globals":15,"../util":131,"./array_ops":73,"./norm":92,"./operation":93,"./reduction_ops":98,"./tensor_ops":109}],86:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var types = require("../types");
var util_1 = require("../util");
var broadcast_util_1 = require("./broadcast_util");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var LogicalOps = (function () {
    function LogicalOps() {
    }
    LogicalOps.logicalNot = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'logicalNot', 'bool');
        util_1.assert($x.dtype === 'bool', 'Error Array must be of type bool.');
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalNot($x); }, { $x: $x });
    };
    LogicalOps.logicalAnd = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'logicalAnd', 'bool');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'logicalAnd', 'bool');
        util_1.assert($a.dtype === 'bool' && $b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalAnd($a, $b); }, { $a: $a, $b: $b });
    };
    LogicalOps.logicalOr = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'logicalOr', 'bool');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'logicalOr', 'bool');
        util_1.assert($a.dtype === 'bool' && $b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalOr($a, $b); }, { $a: $a, $b: $b });
    };
    LogicalOps.logicalXor = function (a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'logicalXor', 'bool');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'logicalXor', 'bool');
        util_1.assert($a.dtype === 'bool' && $b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util_1.assertAndGetBroadcastShape($a.shape, $b.shape);
        return LogicalOps.logicalOr(a, b).logicalAnd(LogicalOps.logicalAnd(a, b).logicalNot());
    };
    LogicalOps.where = function (condition, a, b) {
        var $a = tensor_util_1.convertToTensor(a, 'a', 'where');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'where');
        var $condition = tensor_util_1.convertToTensor(condition, 'condition', 'where', 'bool');
        util_1.assert($condition.dtype === 'bool', 'Error Condition must be of type bool.');
        util_1.assertShapesMatch($a.shape, $b.shape, 'Error in where: ');
        if ($condition.rank === 1) {
            util_1.assert($condition.shape[0] === $a.shape[0], 'The first dimension of `a` must match the size of `condition`.');
        }
        else {
            util_1.assertShapesMatch($condition.shape, $b.shape, 'Error in where: ');
        }
        var dtype = types.upcastType($a.dtype, $b.dtype);
        var grad = function (dy) { return ({
            $condition: function () { return tensor_ops_1.zerosLike($condition); },
            $a: function () { return dy.mul($condition.cast($a.dtype)); },
            $b: function () { return dy.mul($condition.logicalNot().cast($b.dtype)); }
        }); };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.where($condition, $a, $b, dtype); }, { $condition: $condition, $a: $a, $b: $b }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], LogicalOps, "logicalNot", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], LogicalOps, "logicalAnd", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], LogicalOps, "logicalOr", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], LogicalOps, "logicalXor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' })
    ], LogicalOps, "where", null);
    return LogicalOps;
}());
exports.logicalAnd = operation_1.op(LogicalOps.logicalAnd);
exports.logicalNot = operation_1.op(LogicalOps.logicalNot);
exports.logicalOr = operation_1.op(LogicalOps.logicalOr);
exports.logicalXor = operation_1.op(LogicalOps.logicalXor);
exports.where = operation_1.op(LogicalOps.where);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../types":130,"../util":131,"./broadcast_util":77,"./operation":93,"./tensor_ops":109}],87:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var globals_1 = require("../globals");
var tensor_util_1 = require("../tensor_util");
var util_1 = require("../util");
var axis_util_1 = require("./axis_util");
var binary_ops_1 = require("./binary_ops");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var Reduction;
(function (Reduction) {
    Reduction[Reduction["NONE"] = 0] = "NONE";
    Reduction[Reduction["MEAN"] = 1] = "MEAN";
    Reduction[Reduction["SUM"] = 2] = "SUM";
    Reduction[Reduction["SUM_BY_NONZERO_WEIGHTS"] = 3] = "SUM_BY_NONZERO_WEIGHTS";
})(Reduction = exports.Reduction || (exports.Reduction = {}));
var LossOps = (function () {
    function LossOps() {
    }
    LossOps.computeWeightedLoss = function (losses, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $losses = tensor_util_1.convertToTensor(losses, 'losses', 'computeWeightedLoss');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'computeWeightedLoss');
        }
        var weightedLoss = ($weights == null) ? $losses : $losses.mul($weights);
        if (reduction === Reduction.NONE) {
            return weightedLoss;
        }
        if (reduction === Reduction.SUM) {
            return weightedLoss.sum();
        }
        if (reduction === Reduction.MEAN) {
            return ($weights == null) ? weightedLoss.mean() :
                weightedLoss.sum().div($weights.sum());
        }
        if (reduction === Reduction.SUM_BY_NONZERO_WEIGHTS) {
            if ($weights == null) {
                return weightedLoss.sum().div(tensor_ops_1.scalar($losses.size));
            }
            else {
                var broadcastedWeights = $weights.mul(tensor_ops_1.ones($losses.shape));
                var numNonZeros = broadcastedWeights.notEqual(tensor_ops_1.scalar(0)).sum().toFloat();
                return weightedLoss.sum().div(numNonZeros);
            }
        }
        throw Error("Unknown reduction: " + reduction);
    };
    LossOps.absoluteDifference = function (labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'absoluteDifference');
        var $predictions = tensor_util_1.convertToTensor(predictions, 'predictions', 'absoluteDifference');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'absoluteDifference');
        }
        util_1.assertShapesMatch($labels.shape, $predictions.shape, 'Error in absoluteDifference: ');
        var losses = $labels.sub($predictions).abs();
        return LossOps.computeWeightedLoss(losses, $weights, reduction);
    };
    LossOps.meanSquaredError = function (labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'meanSquaredError');
        var $predictions = tensor_util_1.convertToTensor(predictions, 'predictions', 'meanSquaredError');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'meanSquaredError');
        }
        util_1.assertShapesMatch($labels.shape, $predictions.shape, 'Error in meanSquaredError: ');
        var losses = $labels.squaredDifference($predictions);
        return LossOps.computeWeightedLoss(losses, $weights, reduction);
    };
    LossOps.cosineDistance = function (labels, predictions, axis, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'cosineDistance');
        var $predictions = tensor_util_1.convertToTensor(predictions, 'predictions', 'cosineDistance');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'cosineDistance');
        }
        util_1.assertShapesMatch($labels.shape, $predictions.shape, 'Error in cosineDistance: ');
        var one = tensor_ops_1.scalar(1);
        var losses = one.sub($labels.mul($predictions).sum(axis, true));
        return LossOps.computeWeightedLoss(losses, $weights, reduction);
    };
    LossOps.hingeLoss = function (labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'hingeLoss');
        var $predictions = tensor_util_1.convertToTensor(predictions, 'predictions', 'hingeLoss');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'hingeLoss');
        }
        util_1.assertShapesMatch($labels.shape, $predictions.shape, 'Error in hingeLoss: ');
        var one = tensor_ops_1.scalar(1);
        $labels = tensor_ops_1.scalar(2).mul($labels).sub(one);
        var losses = one.sub($labels.mul($predictions)).relu();
        return LossOps.computeWeightedLoss(losses, $weights, reduction);
    };
    LossOps.logLoss = function (labels, predictions, weights, epsilon, reduction) {
        if (epsilon === void 0) { epsilon = 1e-7; }
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'logLoss');
        var $predictions = tensor_util_1.convertToTensor(predictions, 'predictions', 'logLoss');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'logLoss');
        }
        util_1.assertShapesMatch($labels.shape, $predictions.shape, 'Error in logLoss: ');
        var one = tensor_ops_1.scalar(1);
        var epsilonScalar = tensor_ops_1.scalar(epsilon);
        var losses = $labels.mul($predictions.add(epsilonScalar).log())
            .neg()
            .sub(one.sub($labels).mul(one.sub($predictions).add(epsilonScalar).log()));
        return LossOps.computeWeightedLoss(losses, $weights, reduction);
    };
    LossOps.huberLoss = function (labels, predictions, weights, delta, reduction) {
        if (delta === void 0) { delta = 1.0; }
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'huberLoss');
        var $predictions = tensor_util_1.convertToTensor(predictions, 'predictions', 'huberLoss');
        var $weights = null;
        if (weights != null) {
            $weights = tensor_util_1.convertToTensor(weights, 'weights', 'huberLoss');
        }
        util_1.assertShapesMatch($labels.shape, $predictions.shape, 'Error in huberLoss: ');
        var deltaScalar = tensor_ops_1.scalar(delta);
        var error = $predictions.sub($labels).abs();
        var quadratic = binary_ops_1.minimum(error, deltaScalar);
        var linear = error.sub(quadratic);
        var losses = tensor_ops_1.scalar(0.5).mul(quadratic.square()).add(deltaScalar.mul(linear));
        return LossOps.computeWeightedLoss(losses, $weights, reduction);
    };
    LossOps.softmaxCrossEntropy = function (labels, logits, dim) {
        if (dim === void 0) { dim = -1; }
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'softmaxCrossEntropy');
        var $logits = tensor_util_1.convertToTensor(logits, 'logits', 'softmaxCrossEntropy');
        util_1.assertShapesMatch($labels.shape, $logits.shape, 'Error in softmaxCrossEntropy: ');
        if (dim === -1) {
            dim = $logits.rank - 1;
        }
        if (dim !== $logits.rank - 1) {
            throw Error("Softmax cross entropy along a non-last dimension is not yet " +
                ("supported. Labels / logits was rank " + $logits.rank + " ") +
                ("and dim was " + dim));
        }
        var customOp = globals_1.customGrad(function (labels, logits) {
            var predictedProbs = logits.softmax(dim);
            var costVector = tensor_ops_1.scalar(1e-5).add(predictedProbs).log().mul(labels).neg();
            var value = costVector.sum([dim]);
            var gradFunc = function (dy) {
                var dyShape = axis_util_1.expandShapeToKeepDim(dy.shape, [dim]);
                return [
                    dy.reshape(dyShape).mul(labels.toFloat().sub(predictedProbs)),
                    dy.reshape(dyShape).mul(predictedProbs.sub(labels.toFloat())),
                ];
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($labels, $logits);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "computeWeightedLoss", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "absoluteDifference", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "meanSquaredError", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "cosineDistance", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "hingeLoss", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "logLoss", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "huberLoss", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' })
    ], LossOps, "softmaxCrossEntropy", null);
    return LossOps;
}());
exports.absoluteDifference = operation_1.op(LossOps.absoluteDifference);
exports.computeWeightedLoss = operation_1.op(LossOps.computeWeightedLoss);
exports.cosineDistance = operation_1.op(LossOps.cosineDistance);
exports.hingeLoss = operation_1.op(LossOps.hingeLoss);
exports.huberLoss = operation_1.op(LossOps.huberLoss);
exports.logLoss = operation_1.op(LossOps.logLoss);
exports.meanSquaredError = operation_1.op(LossOps.meanSquaredError);
exports.softmaxCrossEntropy = operation_1.op(LossOps.softmaxCrossEntropy);

},{"../doc":11,"../globals":15,"../tensor_util":127,"../util":131,"./axis_util":74,"./binary_ops":76,"./operation":93,"./tensor_ops":109}],88:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var operation_1 = require("./operation");
var LRNOps = (function () {
    function LRNOps() {
    }
    LRNOps.localResponseNormalization = function (x, depthRadius, bias, alpha, beta) {
        if (depthRadius === void 0) { depthRadius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'localResponseNormalization');
        util.assert($x.rank === 4 || $x.rank === 3, "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + $x.rank + ".");
        util.assert(util.isInt(depthRadius), "Error in localResponseNormalization: depthRadius must be an integer\n                     but got depthRadius " + depthRadius + ".");
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.localResponseNormalization4D(x4D, depthRadius, bias, alpha, beta); }, { x4D: x4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        else {
            return res;
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' })
    ], LRNOps, "localResponseNormalization", null);
    return LRNOps;
}());
exports.localResponseNormalization = operation_1.op(LRNOps.localResponseNormalization);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./operation":93}],89:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var tensor_util_1 = require("../tensor_util");
var operation_1 = require("./operation");
var LSTMOps = (function () {
    function LSTMOps() {
    }
    LSTMOps.multiRNNCell = function (lstmCells, data, c, h) {
        var $data = tensor_util_1.convertToTensor(data, 'data', 'multiRNNCell');
        var $c = tensor_util_1.convertToTensorArray(c, 'c', 'multiRNNCell');
        var $h = tensor_util_1.convertToTensorArray(h, 'h', 'multiRNNCell');
        var input = $data;
        var newStates = [];
        for (var i = 0; i < lstmCells.length; i++) {
            var output = lstmCells[i](input, $c[i], $h[i]);
            newStates.push(output[0]);
            newStates.push(output[1]);
            input = output[1];
        }
        var newC = [];
        var newH = [];
        for (var i = 0; i < newStates.length; i += 2) {
            newC.push(newStates[i]);
            newH.push(newStates[i + 1]);
        }
        return [newC, newH];
    };
    LSTMOps.basicLSTMCell = function (forgetBias, lstmKernel, lstmBias, data, c, h) {
        var $forgetBias = tensor_util_1.convertToTensor(forgetBias, 'forgetBias', 'basicLSTMCell');
        var $lstmKernel = tensor_util_1.convertToTensor(lstmKernel, 'lstmKernel', 'basicLSTMCell');
        var $lstmBias = tensor_util_1.convertToTensor(lstmBias, 'lstmBias', 'basicLSTMCell');
        var $data = tensor_util_1.convertToTensor(data, 'data', 'basicLSTMCell');
        var $c = tensor_util_1.convertToTensor(c, 'c', 'basicLSTMCell');
        var $h = tensor_util_1.convertToTensor(h, 'h', 'basicLSTMCell');
        var combined = $data.concat($h, 1);
        var weighted = combined.matMul($lstmKernel);
        var res = weighted.add($lstmBias);
        var batchSize = res.shape[0];
        var sliceCols = res.shape[1] / 4;
        var sliceSize = [batchSize, sliceCols];
        var i = res.slice([0, 0], sliceSize);
        var j = res.slice([0, sliceCols], sliceSize);
        var f = res.slice([0, sliceCols * 2], sliceSize);
        var o = res.slice([0, sliceCols * 3], sliceSize);
        var newC = i.sigmoid().mulStrict(j.tanh()).addStrict($c.mulStrict($forgetBias.add(f).sigmoid()));
        var newH = newC.tanh().mulStrict(o.sigmoid());
        return [newC, newH];
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'RNN' })
    ], LSTMOps, "multiRNNCell", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'RNN' })
    ], LSTMOps, "basicLSTMCell", null);
    return LSTMOps;
}());
exports.basicLSTMCell = operation_1.op(LSTMOps.basicLSTMCell);
exports.multiRNNCell = operation_1.op(LSTMOps.multiRNNCell);

},{"../doc":11,"../tensor_util":127,"./operation":93}],90:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var operation_1 = require("./operation");
var MatmulOps = (function () {
    function MatmulOps() {
    }
    MatmulOps.matMul = function (a, b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        var $a = tensor_util_1.convertToTensor(a, 'a', 'matMul');
        var $b = tensor_util_1.convertToTensor(b, 'b', 'matMul');
        var innerShapeA = transposeA ? $a.shape[0] : $a.shape[1];
        var innerShapeB = transposeB ? $b.shape[1] : $b.shape[0];
        util.assert($a.rank === 2 && $b.rank === 2, "Error in matMul: inputs must be rank 2, got ranks " + $a.rank +
            (" and " + $b.rank + "."));
        util.assert(innerShapeA === innerShapeB, "Error in matMul: inner shapes (" + innerShapeA + ") and (" +
            (innerShapeB + ") of Tensors with shapes " + $a.shape + " and ") +
            ($b.shape + " and transposeA=" + transposeA) +
            (" and transposeB=" + transposeB + " must match."));
        var grad = function (dy) {
            if (!transposeA && !transposeB) {
                return {
                    $a: function () { return dy.matMul($b.toFloat(), false, true); },
                    $b: function () { return $a.toFloat().matMul(dy, true, false); }
                };
            }
            else if (!transposeA && transposeB) {
                return {
                    $a: function () { return dy.matMul($b.toFloat(), false, false); },
                    $b: function () { return dy.matMul($a.toFloat(), true, false); }
                };
            }
            else if (transposeA && !transposeB) {
                return {
                    $a: function () { return $b.toFloat().matMul(dy, false, true); },
                    $b: function () { return $a.toFloat().matMul(dy, false, false); }
                };
            }
            else {
                return {
                    $a: function () { return $b.toFloat().matMul(dy, true, true); },
                    $b: function () { return dy.matMul($a.toFloat(), true, true); }
                };
            }
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.matMul($a, $b, transposeA, transposeB); }, { $a: $a, $b: $b }, grad);
    };
    MatmulOps.outerProduct = function (v1, v2) {
        var $v1 = tensor_util_1.convertToTensor(v1, 'v1', 'outerProduct');
        var $v2 = tensor_util_1.convertToTensor(v2, 'v2', 'outerProduct');
        util.assert($v1.rank === 1 && $v2.rank === 1, "Error in outerProduct: inputs must be rank 1, but got ranks " +
            ($v1.rank + " and " + $v2.rank + "."));
        return $v1.as2D(-1, 1).matMul($v2.as2D(1, -1));
    };
    MatmulOps.dot = function (t1, t2) {
        var $t1 = tensor_util_1.convertToTensor(t1, 't1', 'dot');
        var $t2 = tensor_util_1.convertToTensor(t2, 't2', 'dot');
        util.assert(($t1.rank === 1 || $t1.rank === 2) &&
            ($t2.rank === 1 || $t2.rank === 2), "Error in dot: inputs must all be rank 1 or 2, but got ranks " +
            ($t1.rank + " and " + $t2.rank + "."));
        var t1Inner = ($t1.rank === 1 ? $t1.size : $t1.shape[1]);
        var t2Inner = ($t2.rank === 1 ? $t2.size : $t2.shape[0]);
        util.assert(t1Inner === t2Inner, "Error in dot: inner dimensions of inputs must match, but got " +
            (t1Inner + " and " + t2Inner + "."));
        if ($t1.rank === 1 && $t2.rank === 1) {
            return $t1.as2D(1, -1).matMul($t2.as2D(-1, 1)).asScalar();
        }
        else if ($t1.rank === 1 && $t2.rank === 2) {
            return $t1.as2D(1, -1)
                .matMul($t2.as2D($t2.shape[0], $t2.shape[1]))
                .as1D();
        }
        else if ($t1.rank === 2 && $t2.rank === 1) {
            return $t1.matMul($t2.as2D(-1, 1)).as1D();
        }
        else {
            return $t1.matMul($t2.as2D($t2.shape[0], $t2.shape[1]));
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' })
    ], MatmulOps, "matMul", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' })
    ], MatmulOps, "outerProduct", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' })
    ], MatmulOps, "dot", null);
    return MatmulOps;
}());
exports.matMul = operation_1.op(MatmulOps.matMul);
exports.dot = operation_1.op(MatmulOps.dot);
exports.outerProduct = operation_1.op(MatmulOps.outerProduct);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./operation":93}],91:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var binary_ops_1 = require("./binary_ops");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var MovingAverageOps = (function () {
    function MovingAverageOps() {
    }
    MovingAverageOps.movingAverage = function (v, x, decay, step, zeroDebias) {
        if (zeroDebias === void 0) { zeroDebias = true; }
        var $v = tensor_util_1.convertToTensor(v, 'v', 'movingAverage');
        var $x = tensor_util_1.convertToTensor(x, 'x', 'movingAverage');
        var $decay = tensor_util_1.convertToTensor(decay, 'decay', 'movingAverage');
        tensor_util_1.assertTypesMatch($v, $x);
        util.assert(util.arraysEqual($v.shape, $x.shape), 'Shape mismatch in v and x');
        var one = tensor_ops_1.scalar(1);
        var oneMinusDecay = one.sub($decay);
        var update = $x.sub($v).mul(oneMinusDecay);
        if (zeroDebias) {
            util.assert(step != null, 'When using zeroDebias: true, step is required.');
            var $step = tensor_util_1.convertToTensor(step, 'step', 'movingAverage');
            update = update.div(one.sub(binary_ops_1.pow($decay, $step)));
        }
        return $v.add(update);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Moving Average' })
    ], MovingAverageOps, "movingAverage", null);
    return MovingAverageOps;
}());
exports.movingAverage = operation_1.op(MovingAverageOps.movingAverage);

},{"../doc":11,"../tensor_util":127,"../util":131,"./binary_ops":76,"./operation":93,"./tensor_ops":109}],92:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var tensor_util_1 = require("../tensor_util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var NormOps = (function () {
    function NormOps() {
    }
    NormOps.norm = function (x, ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        x = tensor_util_1.convertToTensor(x, 'x', 'norm');
        var norm = normImpl(x, ord, axis);
        var keepDimsShape = norm.shape;
        if (keepDims) {
            var axes = axis_util.parseAxisParam(axis, x.shape);
            keepDimsShape = axis_util.expandShapeToKeepDim(norm.shape, axes);
        }
        return norm.reshape(keepDimsShape);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' })
    ], NormOps, "norm", null);
    return NormOps;
}());
function normImpl(x, p, axis) {
    if (axis === void 0) { axis = null; }
    if (x.rank === 0) {
        return x.abs();
    }
    if (x.rank !== 1 && axis === null) {
        return normImpl(x.reshape([-1]), p, axis);
    }
    if (x.rank === 1 || typeof axis === 'number' ||
        axis instanceof Array && axis.length === 1) {
        if (p === 1) {
            return x.abs().sum(axis);
        }
        if (p === Infinity) {
            return x.abs().max(axis);
        }
        if (p === -Infinity) {
            return x.abs().min(axis);
        }
        if (p === 'euclidean' || p === 2) {
            return x.abs().pow(tensor_ops_1.scalar(2, 'int32')).sum(axis).sqrt();
        }
        throw new Error("Error in norm: invalid ord value: " + p);
    }
    if (axis instanceof Array && axis.length === 2) {
        if (p === 1) {
            return x.abs().sum(axis[0]).max(axis[1] - 1);
        }
        if (p === Infinity) {
            return x.abs().sum(axis[1]).max(axis[0]);
        }
        if (p === -Infinity) {
            return x.abs().sum(axis[1]).min(axis[0]);
        }
        if (p === 'fro' || p === 'euclidean') {
            return x.square().sum(axis).sqrt();
        }
        throw new Error("Error in norm: invalid ord value: " + p);
    }
    throw new Error("Error in norm: invalid axis: " + axis);
}
exports.norm = operation_1.op(NormOps.norm);

},{"../doc":11,"../tensor_util":127,"./axis_util":74,"./operation":93,"./tensor_ops":109}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
function op(f) {
    var f2 = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        environment_1.ENV.engine.startScope(f.name);
        try {
            var result = f.apply(void 0, args);
            if (result instanceof Promise) {
                console.error('Cannot return a Promise inside of tidy.');
            }
            environment_1.ENV.engine.endScope(result);
            return result;
        }
        catch (ex) {
            environment_1.ENV.engine.endScope(null);
            throw ex;
        }
    };
    return f2;
}
exports.op = op;

},{"../environment":13}],94:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./batchnorm"));
__export(require("./concat"));
__export(require("./conv"));
__export(require("./matmul"));
__export(require("./reverse"));
__export(require("./pool"));
__export(require("./slice"));
__export(require("./unary_ops"));
__export(require("./reduction_ops"));
__export(require("./compare"));
__export(require("./binary_ops"));
__export(require("./sigmoid_cross_entropy"));
__export(require("./relu_ops"));
__export(require("./logical_ops"));
__export(require("./array_ops"));
__export(require("./tensor_ops"));
__export(require("./transpose"));
__export(require("./softmax"));
__export(require("./lrn"));
__export(require("./norm"));
__export(require("./segment_ops"));
__export(require("./lstm"));
__export(require("./moving_average"));
__export(require("./strided_slice"));
var operation_1 = require("./operation");
exports.op = operation_1.op;
var losses = require("./loss_ops");
exports.losses = losses;
var linalg = require("./linalg_ops");
exports.linalg = linalg;
var image = require("./image_ops");
exports.image = image;

},{"./array_ops":73,"./batchnorm":75,"./binary_ops":76,"./compare":78,"./concat":79,"./conv":81,"./image_ops":84,"./linalg_ops":85,"./logical_ops":86,"./loss_ops":87,"./lrn":88,"./lstm":89,"./matmul":90,"./moving_average":91,"./norm":92,"./operation":93,"./pool":95,"./reduction_ops":98,"./relu_ops":99,"./reverse":100,"./segment_ops":101,"./sigmoid_cross_entropy":104,"./slice":105,"./softmax":107,"./strided_slice":108,"./tensor_ops":109,"./transpose":110,"./unary_ops":111}],95:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var conv_util = require("./conv_util");
var operation_1 = require("./operation");
var PoolOps = (function () {
    function PoolOps() {
    }
    PoolOps.maxPool = function (x, filterSize, strides, pad, dimRoundingMode) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'maxPool');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in maxPool: input must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in maxPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(x4D.shape, filterSize, strides, pad, dimRoundingMode);
        var grad = function (dy, saved) {
            var y4D = saved[0];
            return {
                x: function () {
                    return maxPoolBackprop(dy, x4D, y4D, filterSize, strides, pad);
                }
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.maxPool(x4D, convInfo)); }, { x: x4D }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.avgPool = function (x, filterSize, strides, pad, dimRoundingMode) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'avgPool');
        util.assert($x.dtype === 'float32', 'The input dtype to avgPool must be float32');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in avgPool: x must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in avgPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(x4D.shape, filterSize, strides, pad);
        var grad = function (dy) {
            return { x: function () { return avgPoolBackprop(dy, x4D, filterSize, strides, pad); } };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.avgPool(x4D, convInfo); }, { x: x4D }, grad);
        res = res.cast($x.dtype);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], PoolOps, "maxPool", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' })
    ], PoolOps, "avgPool", null);
    return PoolOps;
}());
function maxPoolBackprop(dy, input, output, filterSize, strides, pad, dimRoundingMode) {
    var $dy = tensor_util_1.convertToTensor(dy, 'dy', 'maxPoolBackprop');
    var $input = tensor_util_1.convertToTensor(input, 'input', 'maxPoolBackprop');
    var $output = tensor_util_1.convertToTensor(output, 'output', 'maxPoolBackprop');
    util.assert($input.rank === $dy.rank, "Rank of input (" + $input.rank + ") does not match rank of dy (" + $dy.rank + ")");
    util.assert($dy.rank === 4, "Error in maxPoolBackprop: dy must be rank 4 but got rank " +
        ($dy.rank + "."));
    util.assert($input.rank === 4, "Error in maxPoolBackprop: input must be rank 4 but got rank " +
        ($input.rank + "."));
    if (dimRoundingMode != null) {
        util.assert(util.isInt(pad), "Error in maxPoolBackprop: pad must be an integer when using, " +
            ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
    }
    var convInfo = conv_util.computePool2DInfo($input.shape, filterSize, strides, pad, dimRoundingMode);
    var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.maxPoolBackprop($dy, $input, $output, convInfo); }, { $dy: $dy, $input: $input });
    return res;
}
function avgPoolBackprop(dy, input, filterSize, strides, pad) {
    var $dy = tensor_util_1.convertToTensor(dy, 'dy', 'avgPoolBackprop');
    var $input = tensor_util_1.convertToTensor(input, 'input', 'avgPoolBackprop');
    util.assert($input.rank === $dy.rank, "Rank of input (" + $input.rank + ") does not match rank of dy (" + $dy.rank + ")");
    var input4D = $input;
    var dy4D = $dy;
    var reshapedTo4D = false;
    if ($input.rank === 3) {
        reshapedTo4D = true;
        input4D = $input.as4D(1, $input.shape[0], $input.shape[1], $input.shape[2]);
        dy4D = $dy.as4D(1, $dy.shape[0], $dy.shape[1], $dy.shape[2]);
    }
    util.assert(dy4D.rank === 4, "Error in avgPoolBackprop: dy must be rank 4 but got rank " +
        (dy4D.rank + "."));
    util.assert(input4D.rank === 4, "Error in avgPoolBackprop: input must be rank 4 but got rank " +
        (input4D.rank + "."));
    var convInfo = conv_util.computePool2DInfo(input4D.shape, filterSize, strides, pad);
    var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.avgPoolBackprop(dy4D, input4D, convInfo); }, { dy4D: dy4D, input4D: input4D });
    if (reshapedTo4D) {
        return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
    }
    return res;
}
exports.maxPool = operation_1.op(PoolOps.maxPool);
exports.avgPool = operation_1.op(PoolOps.avgPool);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./conv_util":82,"./operation":93}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var MPRandGauss = (function () {
    function MPRandGauss(mean, stdDeviation, dtype, truncated, seed) {
        this.mean = mean;
        this.stdDev = stdDeviation;
        this.dtype = dtype;
        this.nextVal = NaN;
        this.truncated = truncated;
        if (this.truncated) {
            this.upper = this.mean + this.stdDev * 2;
            this.lower = this.mean - this.stdDev * 2;
        }
        var seedValue = seed ? seed : Math.random();
        this.random = seedrandom.alea(seedValue.toString());
    }
    MPRandGauss.prototype.nextValue = function () {
        if (!isNaN(this.nextVal)) {
            var value = this.nextVal;
            this.nextVal = NaN;
            return value;
        }
        var resultX, resultY;
        var isValid = false;
        while (!isValid) {
            var v1 = void 0, v2 = void 0, s = void 0;
            do {
                v1 = 2 * this.random() - 1;
                v2 = 2 * this.random() - 1;
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s === 0);
            var mul = Math.sqrt(-2.0 * Math.log(s) / s);
            resultX = this.mean + this.stdDev * v1 * mul;
            resultY = this.mean + this.stdDev * v2 * mul;
            if (!this.truncated || this.isValidTruncated(resultX)) {
                isValid = true;
            }
        }
        if (!this.truncated || this.isValidTruncated(resultY)) {
            this.nextVal = this.convertValue(resultY);
        }
        return this.convertValue(resultX);
    };
    MPRandGauss.prototype.convertValue = function (value) {
        if (this.dtype == null || this.dtype === 'float32') {
            return value;
        }
        return Math.round(value);
    };
    MPRandGauss.prototype.isValidTruncated = function (value) {
        return value <= this.upper && value >= this.lower;
    };
    return MPRandGauss;
}());
exports.MPRandGauss = MPRandGauss;

},{"seedrandom":134}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
exports.PARALLELIZE_THRESHOLD = 30;
function computeOptimalWindowSize(inSize) {
    if (inSize <= exports.PARALLELIZE_THRESHOLD) {
        return inSize;
    }
    return util_1.nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
}
exports.computeOptimalWindowSize = computeOptimalWindowSize;

},{"../util":131}],98:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var ReductionOps = (function () {
    function ReductionOps() {
    }
    ReductionOps.logSumExp = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'logSumExp');
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var xMax = $x.max(axes, true);
        var a = $x.sub(xMax);
        var b = a.exp();
        var c = b.sum(axes);
        var d = c.log();
        var res = xMax.reshape(d.shape).add(d);
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, axes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.sum = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'sum');
        if ($x.dtype === 'bool') {
            $x = $x.toInt();
        }
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var customOp = globals_1.customGrad(function (x) {
            var permutation = axis_util.getAxesPermutation(axes, x.rank);
            var reductionAxes = axes;
            var permutedX = x;
            if (permutation != null) {
                permutedX = x.transpose(permutation);
                reductionAxes =
                    axis_util.getInnerMostAxes(reductionAxes.length, x.rank);
            }
            var value = environment_1.ENV.engine.runKernel(function (backend) { return backend.sum(permutedX, reductionAxes); }, { permutedX: permutedX });
            if (keepDims) {
                var newShape = axis_util.expandShapeToKeepDim(value.shape, axes);
                value = value.reshape(newShape);
            }
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(tensor_ops_1.ones(x.shape, 'float32'));
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($x);
    };
    ReductionOps.mean = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'mean');
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var shapes = axis_util.computeOutAndReduceShapes($x.shape, axes);
        var reduceShape = shapes[1];
        var reduceSize = util.sizeFromShape(reduceShape);
        var customOp = globals_1.customGrad(function (x) {
            var reduceSizeScalar = tensor_ops_1.scalar(reduceSize);
            var xReduce = reduceSizeScalar.dtype === x.dtype ?
                x :
                x.cast(reduceSizeScalar.dtype);
            var res = xReduce.div(reduceSizeScalar);
            var value = res.sum(axis, keepDims);
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(tensor_ops_1.ones(x.shape, 'float32')).div(reduceSizeScalar);
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($x);
    };
    ReductionOps.min = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'min');
        var origAxes = axis_util.parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.min($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.max = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'max');
        var origAxes = axis_util.parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.max($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.argMin = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'argMin');
        if (axis == null) {
            axis = 0;
        }
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.argMin($x, axes[0]); }, { $x: $x });
    };
    ReductionOps.argMax = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'argMax');
        if (axis == null) {
            axis = 0;
        }
        var axes = axis_util.parseAxisParam(axis, $x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.argMax($x, axes[0]); }, { $x: $x });
    };
    ReductionOps.all = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'all', 'bool');
        util.assert($x.dtype === 'bool', "Error Tensor must be of type bool. Got: " + $x.dtype);
        var origAxes = axis_util.parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.all($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.any = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'any', 'bool');
        util.assert($x.dtype === 'bool', "Error Tensor must be of type bool. Got: " + $x.dtype);
        var origAxes = axis_util.parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, $x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.any($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.moments = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        x = tensor_util_1.convertToTensor(x, 'x', 'moments');
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var mean = x.mean(axes, keepDims);
        var keepDimsShape = mean.shape;
        if (!keepDims) {
            keepDimsShape = axis_util.expandShapeToKeepDim(mean.shape, axes);
        }
        var devSquared = x.toFloat().sub(mean.reshape(keepDimsShape)).square();
        var variance = devSquared.mean(axes, keepDims);
        return { mean: mean, variance: variance };
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "logSumExp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "sum", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "mean", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "min", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "max", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "argMin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "argMax", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "all", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' })
    ], ReductionOps, "any", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' })
    ], ReductionOps, "moments", null);
    return ReductionOps;
}());
exports.all = operation_1.op(ReductionOps.all);
exports.any = operation_1.op(ReductionOps.any);
exports.argMax = operation_1.op(ReductionOps.argMax);
exports.argMin = operation_1.op(ReductionOps.argMin);
exports.logSumExp = operation_1.op(ReductionOps.logSumExp);
exports.max = operation_1.op(ReductionOps.max);
exports.mean = operation_1.op(ReductionOps.mean);
exports.min = operation_1.op(ReductionOps.min);
exports.moments = operation_1.op(ReductionOps.moments);
exports.sum = operation_1.op(ReductionOps.sum);

},{"../doc":11,"../environment":13,"../globals":15,"../tensor_util":127,"../util":131,"./axis_util":74,"./operation":93,"./tensor_ops":109}],99:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var binary_ops_1 = require("./binary_ops");
var logical_ops_1 = require("./logical_ops");
var operation_1 = require("./operation");
var selu_util_1 = require("./selu_util");
var tensor_ops_1 = require("./tensor_ops");
var ReluOps = (function () {
    function ReluOps() {
    }
    ReluOps.relu = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'relu');
        if ($x.dtype === 'bool') {
            return $x.toInt();
        }
        var grad = function (dy) {
            var stepRes = $x.step();
            return { $x: function () { return dy.mulStrict(stepRes.toFloat()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.relu($x); }, { $x: $x }, grad);
    };
    ReluOps.elu = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'elu');
        var grad = function (dy, saved) {
            var y = saved[0];
            return {
                $x: function () {
                    return environment_1.ENV.engine.runKernel(function (backend) { return backend.eluDer(dy, y); }, { dy: dy, y: y });
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.elu($x)); }, { $x: $x }, grad);
    };
    ReluOps.selu = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'selu');
        var grad = function (dy) {
            return {
                $x: function () {
                    var mask = $x.greater(tensor_ops_1.scalar(0));
                    var scaleAlpha = tensor_ops_1.scalar(selu_util_1.SELU_SCALEALPHA);
                    var scale = tensor_ops_1.scalar(selu_util_1.SELU_SCALE);
                    var greaterThanZeroDer = dy.mul(scale);
                    var lessEqualZeroDer = dy.mul(scaleAlpha).mul($x.toFloat().exp());
                    return logical_ops_1.where(mask, greaterThanZeroDer, lessEqualZeroDer);
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.selu($x); }, { $x: $x }, grad);
    };
    ReluOps.leakyRelu = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'leakyRelu');
        return binary_ops_1.maximum(tensor_ops_1.scalar(alpha).mul($x), $x);
    };
    ReluOps.prelu = function (x, alpha) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'prelu');
        var $alpha = tensor_util_1.convertToTensor(alpha, 'alpha', 'prelu');
        var zero = tensor_ops_1.scalar(0);
        return binary_ops_1.maximum(zero, $x).add($alpha.mul(binary_ops_1.minimum(zero, $x)));
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], ReluOps, "relu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], ReluOps, "elu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], ReluOps, "selu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], ReluOps, "leakyRelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], ReluOps, "prelu", null);
    return ReluOps;
}());
exports.elu = operation_1.op(ReluOps.elu);
exports.leakyRelu = operation_1.op(ReluOps.leakyRelu);
exports.prelu = operation_1.op(ReluOps.prelu);
exports.relu = operation_1.op(ReluOps.relu);
exports.selu = operation_1.op(ReluOps.selu);

},{"../doc":11,"../environment":13,"../tensor_util":127,"./binary_ops":76,"./logical_ops":86,"./operation":93,"./selu_util":103,"./tensor_ops":109}],100:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var axis_util_1 = require("./axis_util");
var operation_1 = require("./operation");
var ReverseOps = (function () {
    function ReverseOps() {
    }
    ReverseOps.reverse1d = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reverse');
        util.assert($x.rank === 1, "Error in reverse1D: x must be rank 1 but got\n             rank " + $x.rank + ".");
        return ReverseOps.reverse($x, 0);
    };
    ReverseOps.reverse2d = function (x, axis) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reverse');
        util.assert($x.rank === 2, "Error in reverse2D: x must be rank 2 but got\n             rank " + $x.rank + ".");
        return ReverseOps.reverse($x, axis);
    };
    ReverseOps.reverse3d = function (x, axis) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reverse');
        util.assert($x.rank === 3, "Error in reverse3D: x must be rank 3 but got\n             rank " + $x.rank + ".");
        return ReverseOps.reverse($x, axis);
    };
    ReverseOps.reverse4d = function (x, axis) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reverse');
        util.assert($x.rank === 4, "Error in reverse4D: x must be rank 4 but got\n             rank " + $x.rank + ".");
        return ReverseOps.reverse($x, axis);
    };
    ReverseOps.reverse = function (x, axis) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reverse');
        if ($x.rank === 0) {
            return $x.clone();
        }
        var axes = axis_util_1.parseAxisParam(axis, $x.shape);
        var grad = function (dy) {
            return { $x: function () { return dy.reverse(axes); } };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.reverse($x, axes); }, { $x: $x }, grad);
        return res.reshapeAs($x);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], ReverseOps, "reverse", null);
    return ReverseOps;
}());
exports.reverse = operation_1.op(ReverseOps.reverse);
exports.reverse1d = operation_1.op(ReverseOps.reverse1d);
exports.reverse2d = operation_1.op(ReverseOps.reverse2d);
exports.reverse3d = operation_1.op(ReverseOps.reverse3d);
exports.reverse4d = operation_1.op(ReverseOps.reverse4d);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./axis_util":74,"./operation":93}],101:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util_1 = require("../util");
var array_ops_1 = require("./array_ops");
var axis_util_1 = require("./axis_util");
var binary_ops_1 = require("./binary_ops");
var compare_1 = require("./compare");
var logical_ops_1 = require("./logical_ops");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var SegmentOps = (function () {
    function SegmentOps() {
    }
    SegmentOps.unsortedSegmentSum = function (x, segmentIds, numSegments) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'unsortedSegmentSum');
        var $segmentIds = tensor_util_1.convertToTensor(segmentIds, 'segmentIds', 'unsortedSegmentSum', 'int32');
        util_1.assert($segmentIds.dtype === 'int32', 'segmentIds must be of dtype `int32`');
        util_1.assert(util_1.isInt(numSegments), 'numSegments must be of dtype int');
        var gradFunc = function (dy) {
            var derX = function () {
                return gatherDropNegatives(dy, $segmentIds);
            };
            return { $x: derX };
        };
        return environment_1.ENV.engine.runKernel(function (backend) {
            return backend.unsortedSegmentSum($x, $segmentIds, numSegments);
        }, { $x: $x }, gradFunc);
    };
    SegmentOps.gather = function (x, indices, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'gather');
        var $indices = tensor_util_1.convertToTensor(indices, 'indices', 'gather', 'int32');
        util_1.assert($indices.dtype === 'int32', 'Indices must be of dtype `int32`');
        axis = axis_util_1.parseAxisParam(axis, $x.shape)[0];
        var grad = function (dy) {
            var derX = function () {
                if (axis === 0) {
                    return SegmentOps.unsortedSegmentSum(dy, $indices, $x.shape[axis]);
                }
                var paramsShape = $x.shape;
                var indicesSize = $indices.size;
                var outerShape = paramsShape.slice(0, axis);
                var outerDims = outerShape.length;
                var innerShape = paramsShape.slice(axis, paramsShape.length).slice(1);
                var innerDims = innerShape.length;
                var outerAxesIndices = arrayRange(0, outerDims);
                var innerAxesIndices = arrayRange(outerDims + 1, outerDims + 1 + innerDims);
                var valuesShape = arrayConcat([outerShape, [indicesSize], innerShape]);
                var values = dy.reshape(valuesShape);
                var reshapedIndices = $indices.reshape([indicesSize]);
                var transposeDims = arrayConcat([[outerDims], outerAxesIndices, innerAxesIndices]);
                var valuesTranspose = values.transpose(transposeDims);
                var paramsGrad = SegmentOps.unsortedSegmentSum(valuesTranspose, reshapedIndices, $x.shape[axis]);
                var invertTransposeDims = axis_util_1.getUndoAxesPermutation(transposeDims);
                paramsGrad = paramsGrad.transpose(invertTransposeDims);
                return paramsGrad;
            };
            return { $x: derX };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.gather($x, $indices, axis); }, { $x: $x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Segment' })
    ], SegmentOps, "unsortedSegmentSum", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], SegmentOps, "gather", null);
    return SegmentOps;
}());
function arrayRange(start, stop) {
    var result = [];
    for (var i = start; i < stop; ++i) {
        result.push(i);
    }
    return result;
}
function arrayConcat(arrays) {
    var result = [];
    for (var i = 0; i < arrays.length; ++i) {
        for (var j = 0; j < arrays[i].length; ++j) {
            result.push(arrays[i][j]);
        }
    }
    return result;
}
function gatherDropNegatives(x, indices) {
    var zeroClippedIndices = binary_ops_1.maximum(indices, tensor_ops_1.zerosLike(indices));
    var gathered = SegmentOps.gather(x, zeroClippedIndices);
    var isPositive = compare_1.greaterEqual(indices, tensor_ops_1.scalar(0, 'int32'));
    var numIters = gathered.rank - isPositive.rank;
    for (var i = 0; i < numIters; ++i) {
        isPositive = array_ops_1.expandDims(isPositive, i + 1);
    }
    isPositive = logical_ops_1.logicalAnd(isPositive, tensor_ops_1.ones(gathered.shape, 'bool'));
    var zeroSlice = tensor_ops_1.zerosLike(gathered);
    return logical_ops_1.where(isPositive, gathered, zeroSlice);
}
exports.gather = operation_1.op(SegmentOps.gather);
exports.unsortedSegmentSum = operation_1.op(SegmentOps.unsortedSegmentSum);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./array_ops":73,"./axis_util":74,"./binary_ops":76,"./compare":78,"./logical_ops":86,"./operation":93,"./tensor_ops":109}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var reduce_util_1 = require("./reduce_util");
function segOpComputeOptimalWindowSize(inSize, numSegments) {
    var done = false;
    var res;
    if (inSize <= reduce_util_1.PARALLELIZE_THRESHOLD) {
        res = inSize;
        done = true;
    }
    else {
        res = util_1.nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
    }
    while (!done) {
        if (res > numSegments || res === inSize) {
            done = true;
            break;
        }
        else {
            res = util_1.nearestDivisor(inSize, res + 1);
        }
    }
    return res;
}
exports.segOpComputeOptimalWindowSize = segOpComputeOptimalWindowSize;
function computeOutShape(aShape, axis, numSegments) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (dim !== axis) {
            outShape.push(aShape[dim]);
        }
        else {
            outShape.push(numSegments);
        }
    }
    return outShape;
}
exports.computeOutShape = computeOutShape;

},{"../util":131,"./reduce_util":97}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELU_SCALEALPHA = 1.7580993408473768599402175208123;
exports.SELU_SCALE = 1.0507009873554804934193349852946;

},{}],104:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var operation_1 = require("./operation");
var SigmoidCrossEntropyOps = (function () {
    function SigmoidCrossEntropyOps() {
    }
    SigmoidCrossEntropyOps.sigmoidCrossEntropyWithLogits = function (labels, logits) {
        var $labels = tensor_util_1.convertToTensor(labels, 'labels', 'sigmoidCrossEntropyWithLogits');
        var $logits = tensor_util_1.convertToTensor(logits, 'logits', 'sigmoidCrossEntropyWithLogits');
        util.assertShapesMatch($labels.shape, $logits.shape, 'Error in sigmoidCrossEntropyWithLogits: ');
        var maxOutput = $logits.relu();
        var outputXTarget = $logits.mul($labels);
        var sigmoidOutput = $logits.abs().neg().exp().log1p();
        return maxOutput.sub(outputXTarget).add(sigmoidOutput);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Cross Entropy' })
    ], SigmoidCrossEntropyOps, "sigmoidCrossEntropyWithLogits", null);
    return SigmoidCrossEntropyOps;
}());
exports.sigmoidCrossEntropyWithLogits = operation_1.op(SigmoidCrossEntropyOps.sigmoidCrossEntropyWithLogits);

},{"../doc":11,"../tensor_util":127,"../util":131,"./operation":93}],105:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var operation_1 = require("./operation");
var slice_util = require("./slice_util");
var SliceOps = (function () {
    function SliceOps() {
    }
    SliceOps.slice1d = function (x, begin, size) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'slice1d');
        util.assert($x.rank === 1, "slice1d expects a rank-1 tensor, but got a rank-" + $x.rank + " tensor");
        return SliceOps.slice($x, [begin], [size]);
    };
    SliceOps.slice2d = function (x, begin, size) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'slice2d');
        util.assert($x.rank === 2, "slice1d expects a rank-2 tensor, but got a rank-" + $x.rank + " tensor");
        return SliceOps.slice($x, begin, size);
    };
    SliceOps.slice3d = function (x, begin, size) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'slice3d');
        util.assert($x.rank === 3, "slice1d expects a rank-3 tensor, but got a rank-" + $x.rank + " tensor");
        return SliceOps.slice($x, begin, size);
    };
    SliceOps.slice4d = function (x, begin, size) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'slice4d');
        util.assert($x.rank === 4, "slice1d expects a rank-4 tensor, but got a rank-" + $x.rank + " tensor");
        return SliceOps.slice($x, begin, size);
    };
    SliceOps.slice = function (x, begin, size) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'slice');
        if ($x.rank === 0) {
            throw new Error('Slicing scalar is not possible');
        }
        var begin_;
        if (typeof begin === 'number') {
            begin_ = [begin].concat(new Array($x.rank - 1).fill(0));
        }
        else if (begin.length < $x.rank) {
            begin_ = begin.concat(new Array($x.rank - begin.length).fill(0));
        }
        else {
            begin_ = begin;
        }
        var size_;
        if (size == null) {
            size_ = new Array($x.rank).fill(-1);
        }
        else if (typeof size === 'number') {
            size_ = [size].concat(new Array($x.rank - 1).fill(-1));
        }
        else if (size.length < $x.rank) {
            size_ = size.concat(new Array($x.rank - size.length).fill(-1));
        }
        else {
            size_ = size;
        }
        size_ = size_.map(function (d, i) {
            if (d >= 0) {
                return d;
            }
            else {
                util.assert(d === -1, 'Bad value in size');
                return $x.shape[i] - begin_[i];
            }
        });
        slice_util.assertParamsValid($x, begin_, size_);
        var inputShape = $x.shape;
        var grad = function (dy) {
            var paddings = [];
            for (var i = 0; i < dy.rank; i++) {
                paddings.push([begin_[i], inputShape[i] - begin_[i] - size_[i]]);
            }
            return { $x: function () { return dy.pad(paddings); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.slice($x, begin_, size_); }, { $x: $x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' })
    ], SliceOps, "slice", null);
    return SliceOps;
}());
exports.slice = operation_1.op(SliceOps.slice);
exports.slice1d = operation_1.op(SliceOps.slice1d);
exports.slice2d = operation_1.op(SliceOps.slice2d);
exports.slice3d = operation_1.op(SliceOps.slice3d);
exports.slice4d = operation_1.op(SliceOps.slice4d);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./operation":93,"./slice_util":106}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function assertParamsValid(input, begin, size) {
    util.assert(input.rank === begin.length, "Error in slice" + input.rank + "D: Length of begin " + begin + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    util.assert(input.rank === size.length, "Error in slice" + input.rank + "D: Length of size " + size + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    for (var i = 0; i < input.rank; ++i) {
        util.assert(begin[i] + size[i] <= input.shape[i], "Error in slice" + input.rank + "D: begin[" + i + "] + size[" + i + "] " +
            ("(" + (begin[i] + size[i]) + ") would overflow input.shape[" + i + "] (" + input.shape[i] + ")"));
    }
}
exports.assertParamsValid = assertParamsValid;
function getStridedSlicedInfo(shape, begin, end, strides, beginMask, endMask) {
    if (beginMask === void 0) { beginMask = 0; }
    if (endMask === void 0) { endMask = 0; }
    var startIndex = [];
    var endIndex = [];
    for (var i = 0; i < shape.length; i++) {
        startIndex[i] = startForAxis(beginMask, begin, strides, shape, i);
        endIndex[i] = stopForAxis(endMask, end, strides, shape, i);
    }
    var size = new Array(shape.length).fill(0);
    size = size.map(function (d, i) {
        var count = 0;
        for (var start = startIndex[i]; !(strides[i] > 0 ? start >= endIndex[i] : start <= endIndex[i]); start += strides[i]) {
            count += 1;
        }
        return count;
    });
    return [startIndex, size];
}
exports.getStridedSlicedInfo = getStridedSlicedInfo;
function startForAxis(beginMask, startIndices, strides, inputShape, axis) {
    var start = startIndices[axis];
    if (beginMask & 1 << axis) {
        if (strides[axis] > 0) {
            start = Number.MIN_SAFE_INTEGER;
        }
        else {
            start = Number.MAX_SAFE_INTEGER;
        }
    }
    var axisSize = inputShape[axis];
    if (start < 0) {
        start += axisSize;
    }
    start = util.clamp(0, start, axisSize - 1);
    return start;
}
exports.startForAxis = startForAxis;
function stopForAxis(endMask, stopIndices, strides, inputShape, axis) {
    var stop = stopIndices[axis];
    if (endMask & (1 << axis)) {
        if (strides[axis] > 0) {
            stop = Number.MAX_SAFE_INTEGER;
        }
        else {
            stop = Number.MIN_SAFE_INTEGER;
        }
    }
    var axisSize = inputShape[axis];
    if (stop < 0) {
        stop += axisSize;
    }
    if (strides[axis] > 0) {
        stop = util.clamp(0, stop, axisSize);
    }
    else {
        stop = util.clamp(-1, stop, axisSize - 1);
    }
    return stop;
}
exports.stopForAxis = stopForAxis;

},{"../util":131}],107:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var gradients_1 = require("../gradients");
var tensor_util_1 = require("../tensor_util");
var operation_1 = require("./operation");
var SoftmaxOps = (function () {
    function SoftmaxOps() {
    }
    SoftmaxOps.softmax = function (logits, dim) {
        if (dim === void 0) { dim = -1; }
        var $logits = tensor_util_1.convertToTensor(logits, 'logits', 'softmax');
        if (dim === -1) {
            dim = $logits.rank - 1;
        }
        if (dim !== $logits.rank - 1) {
            throw Error('Softmax along a non-last dimension is not yet supported. ' +
                ("Logits was rank " + $logits.rank + " and dim was " + dim));
        }
        var customOp = gradients_1.Gradients.customGrad(function (logits) {
            var keepDims = true;
            var lse = logits.logSumExp([dim], keepDims);
            var logResult = logits.toFloat().sub(lse);
            var y = logResult.exp();
            var gradFunc = function (dy) {
                var dyTimesY = dy.mul(y);
                var keepDims = true;
                return dyTimesY.sub(dyTimesY.sum([dim], keepDims).mul(y));
            };
            return { value: y, gradFunc: gradFunc };
        });
        return customOp($logits);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' })
    ], SoftmaxOps, "softmax", null);
    return SoftmaxOps;
}());
exports.softmax = operation_1.op(SoftmaxOps.softmax);

},{"../doc":11,"../gradients":16,"../tensor_util":127,"./operation":93}],108:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var operation_1 = require("./operation");
var StridedSliceOps = (function () {
    function StridedSliceOps() {
    }
    StridedSliceOps.stridedSlice = function (x, begin, end, strides, beginMask, endMask) {
        if (beginMask === void 0) { beginMask = 0; }
        if (endMask === void 0) { endMask = 0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'stridedSlice');
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.stridedSlice($x, begin, end, strides, beginMask, endMask); }, { $x: $x });
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Slicing and Joining' })
    ], StridedSliceOps, "stridedSlice", null);
    return StridedSliceOps;
}());
exports.stridedSlice = operation_1.op(StridedSliceOps.stridedSlice);

},{"../doc":11,"../environment":13,"../tensor_util":127,"./operation":93}],109:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var tensor_1 = require("../tensor");
var tensor_util_1 = require("../tensor_util");
var util_1 = require("../util");
var operation_1 = require("./operation");
var TensorOps = (function () {
    function TensorOps() {
    }
    TensorOps.tensor = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (!util_1.isTypedArray(values) && !Array.isArray(values) &&
            typeof values !== 'number' && typeof values !== 'boolean') {
            throw new Error('values passed to tensor(values) must be an ' +
                'array of numbers or booleans, or a TypedArray');
        }
        var inferredShape = util_1.inferShape(values);
        if (shape != null && inferredShape.length !== 1) {
            util_1.assertShapesMatch(shape, inferredShape, "Error creating a new Tensor. " +
                ("Inferred shape (" + inferredShape + ") does not match the ") +
                ("provided shape (" + shape + "). "));
        }
        if (!util_1.isTypedArray(values) && !Array.isArray(values)) {
            values = [values];
        }
        shape = shape || inferredShape;
        return tensor_1.Tensor.make(shape, { values: util_1.toTypedArray(values, dtype) }, dtype);
    };
    TensorOps.scalar = function (value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (util_1.isTypedArray(value) || Array.isArray(value)) {
            throw new Error('Error creating a new Scalar: value must be a primitive ' +
                '(number|boolean)');
        }
        return TensorOps.tensor(value, [], dtype);
    };
    TensorOps.tensor1d = function (values, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        util_1.assertNonNull(values);
        var inferredShape = util_1.inferShape(values);
        if (inferredShape.length !== 1) {
            throw new Error('tensor1d() requires values to be a flat/TypedArray');
        }
        return TensorOps.tensor(values, inferredShape, dtype);
    };
    TensorOps.tensor2d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        util_1.assertNonNull(values);
        if (shape != null && shape.length !== 2) {
            throw new Error('tensor2d() requires shape to have two numbers');
        }
        var inferredShape = util_1.inferShape(values);
        if (inferredShape.length !== 2 && inferredShape.length !== 1) {
            throw new Error('tensor2d() requires values to be number[][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor2d() requires shape to be provided when `values` ' +
                'are a flat/TypedArray');
        }
        shape = shape || inferredShape;
        return TensorOps.tensor(values, shape, dtype);
    };
    TensorOps.tensor3d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        util_1.assertNonNull(values);
        if (shape != null && shape.length !== 3) {
            throw new Error('tensor3d() requires shape to have three numbers');
        }
        var inferredShape = util_1.inferShape(values);
        if (inferredShape.length !== 3 && inferredShape.length !== 1) {
            throw new Error('tensor3d() requires values to be number[][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor3d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return TensorOps.tensor(values, shape, dtype);
    };
    TensorOps.tensor4d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        util_1.assertNonNull(values);
        if (shape != null && shape.length !== 4) {
            throw new Error('tensor4d() requires shape to have four numbers');
        }
        var inferredShape = util_1.inferShape(values);
        if (inferredShape.length !== 4 && inferredShape.length !== 1) {
            throw new Error('tensor4d() requires values to be number[][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor4d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return TensorOps.tensor(values, shape, dtype);
    };
    TensorOps.tensor5d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        util_1.assertNonNull(values);
        if (shape != null && shape.length !== 5) {
            throw new Error('tensor5d() requires shape to have five numbers');
        }
        var inferredShape = util_1.inferShape(values);
        if (inferredShape.length !== 5 && inferredShape.length !== 1) {
            throw new Error('tensor5d() requires values to be ' +
                'number[][][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor5d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return TensorOps.tensor(values, shape, dtype);
    };
    TensorOps.tensor6d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        util_1.assertNonNull(values);
        if (shape != null && shape.length !== 6) {
            throw new Error('tensor6d() requires shape to have six numbers');
        }
        var inferredShape = util_1.inferShape(values);
        if (inferredShape.length !== 6 && inferredShape.length !== 1) {
            throw new Error('tensor6d() requires values to be number[][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor6d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape ||
            inferredShape;
        return TensorOps.tensor(values, shape, dtype);
    };
    TensorOps.ones = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util_1.makeOnesTypedArray(util_1.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    TensorOps.zeros = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util_1.makeZerosTypedArray(util_1.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    TensorOps.fill = function (shape, value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util_1.getTypedArrayFromDType(dtype, util_1.sizeFromShape(shape));
        values.fill(value);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    TensorOps.onesLike = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'onesLike');
        return TensorOps.ones($x.shape, $x.dtype);
    };
    TensorOps.zerosLike = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'zerosLike');
        return TensorOps.zeros($x.shape, $x.dtype);
    };
    TensorOps.linspace = function (start, stop, num) {
        if (num === 0) {
            throw new Error('Cannot request zero samples');
        }
        var step = (stop - start) / (num - 1);
        var values = util_1.makeZerosTypedArray(num, 'float32');
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return TensorOps.tensor1d(values, 'float32');
    };
    TensorOps.range = function (start, stop, step, dtype) {
        if (step === void 0) { step = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        if (step === 0) {
            throw new Error('Cannot have a step of zero');
        }
        var sameStartStop = start === stop;
        var increasingRangeNegativeStep = start < stop && step < 0;
        var decreasingRangePositiveStep = stop < start && step > 1;
        if (sameStartStop || increasingRangeNegativeStep ||
            decreasingRangePositiveStep) {
            return TensorOps.zeros([0], dtype);
        }
        var numElements = Math.abs(Math.ceil((stop - start) / step));
        var values = util_1.makeZerosTypedArray(numElements, dtype);
        if (stop < start && step === 1) {
            step = -1;
        }
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return TensorOps.tensor1d(values, dtype);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "scalar", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor1d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor2d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor3d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor4d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor5d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "tensor6d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "ones", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "zeros", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "fill", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "onesLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "zerosLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "linspace", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorOps, "range", null);
    return TensorOps;
}());
exports.fill = TensorOps.fill;
exports.linspace = TensorOps.linspace;
exports.ones = TensorOps.ones;
exports.range = TensorOps.range;
exports.scalar = TensorOps.scalar;
exports.tensor = TensorOps.tensor;
exports.tensor1d = TensorOps.tensor1d;
exports.tensor2d = TensorOps.tensor2d;
exports.tensor3d = TensorOps.tensor3d;
exports.tensor4d = TensorOps.tensor4d;
exports.tensor5d = TensorOps.tensor5d;
exports.tensor6d = TensorOps.tensor6d;
exports.zeros = TensorOps.zeros;
exports.onesLike = operation_1.op(TensorOps.onesLike);
exports.zerosLike = operation_1.op(TensorOps.zerosLike);

},{"../doc":11,"../tensor":125,"../tensor_util":127,"../util":131,"./operation":93}],110:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var TransposeOps = (function () {
    function TransposeOps() {
    }
    TransposeOps.transpose = function (x, perm) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'transpose');
        if (perm == null) {
            perm = $x.shape.map(function (s, i) { return i; }).reverse();
        }
        util.assert($x.rank === perm.length, "Error in transpose: rank of input " + $x.rank + " " +
            ("must match length of perm " + perm + "."));
        perm.forEach(function (axis) {
            util.assert(axis >= 0 && axis < $x.rank, "All entries in 'perm' must be between 0 and " + ($x.rank - 1) +
                (" but got " + perm));
        });
        if ($x.rank <= 1) {
            return $x.clone();
        }
        var der = function (dy) {
            var undoPerm = axis_util.getUndoAxesPermutation(perm);
            return { $x: function () { return dy.transpose(undoPerm); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.transpose($x, perm); }, { $x: $x }, der);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' })
    ], TransposeOps, "transpose", null);
    return TransposeOps;
}());
exports.transpose = operation_1.op(TransposeOps.transpose);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./axis_util":74,"./operation":93}],111:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_util_1 = require("../tensor_util");
var util = require("../util");
var operation_1 = require("./operation");
var tensor_ops_1 = require("./tensor_ops");
var UnaryOps = (function () {
    function UnaryOps() {
    }
    UnaryOps.neg = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'neg');
        var grad = function (dy) {
            return { $x: function () { return dy.neg(); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.neg($x); }, { $x: $x }, grad);
    };
    UnaryOps.ceil = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'ceil');
        var grad = function (dy) {
            return { $x: function () { return tensor_ops_1.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.ceil($x); }, { $x: $x }, grad);
    };
    UnaryOps.floor = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'floor');
        var grad = function (dy) {
            return { $x: function () { return tensor_ops_1.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.floor($x); }, { $x: $x }, grad);
    };
    UnaryOps.sign = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'sign');
        var grad = function (dy) {
            return { $x: function () { return tensor_ops_1.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sign($x); }, { $x: $x }, grad);
    };
    UnaryOps.round = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'round');
        var grad = function (dy) {
            return { $x: function () { return tensor_ops_1.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.round($x); }, { $x: $x }, grad);
    };
    UnaryOps.exp = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'exp');
        var bck = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return dy.mulStrict(y); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.exp($x)); }, { $x: $x }, bck);
    };
    UnaryOps.expm1 = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'expm1');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.exp()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.expm1($x); }, { $x: $x }, grad);
    };
    UnaryOps.log = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'log');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.toFloat()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.log($x); }, { $x: $x }, grad);
    };
    UnaryOps.log1p = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'log1p');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.add(tensor_ops_1.scalar(1))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.log1p($x); }, { $x: $x }, grad);
    };
    UnaryOps.sqrt = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'sqrt');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.toFloat().sqrt().mul(tensor_ops_1.scalar(2))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sqrt($x); }, { $x: $x }, grad);
    };
    UnaryOps.rsqrt = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'rsqrt');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.pow(tensor_ops_1.scalar(1.5)).mul(tensor_ops_1.scalar(2))).neg(); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.rsqrt($x); }, { $x: $x }, grad);
    };
    UnaryOps.square = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'square');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.toFloat().mul(tensor_ops_1.scalar(2))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.square($x); }, { $x: $x }, grad);
    };
    UnaryOps.reciprocal = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'reciprocal');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.square().neg()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.reciprocal($x); }, { $x: $x }, grad);
    };
    UnaryOps.abs = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'abs');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.toFloat().step(-1)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.abs($x); }, { $x: $x }, grad);
    };
    UnaryOps.clipByValue = function (x, clipValueMin, clipValueMax) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'clipByValue');
        util.assert((clipValueMin <= clipValueMax), "Error in clip: min (" + clipValueMin + ") must be " +
            ("less than or equal to max (" + clipValueMax + ")."));
        var grad = function (dy) {
            return {
                $x: function () { return dy.where($x.greaterEqual(tensor_ops_1.scalar(clipValueMin))
                    .logicalAnd($x.lessEqual(tensor_ops_1.scalar(clipValueMax))), tensor_ops_1.zerosLike(dy)); },
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.clip($x, clipValueMin, clipValueMax); }, { $x: $x }, grad);
    };
    UnaryOps.sigmoid = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'sigmoid');
        var grad = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return dy.mulStrict(y.mul(tensor_ops_1.scalar(1).sub(y))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.sigmoid($x)); }, { $x: $x }, grad);
    };
    UnaryOps.logSigmoid = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'logSigmoid');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.neg().sigmoid()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.softplus($x.neg()).neg(); }, { $x: $x }, grad);
    };
    UnaryOps.softplus = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'softplus');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.sigmoid()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.softplus($x); }, { $x: $x }, grad);
    };
    UnaryOps.sin = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'sin');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().cos().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sin($x); }, { $x: $x }, grad);
    };
    UnaryOps.cos = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'cos');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().sin().neg().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cos($x); }, { $x: $x }, grad);
    };
    UnaryOps.tan = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'tan');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.cos().square()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.tan($x); }, { $x: $x }, grad);
    };
    UnaryOps.asin = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'asin');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict(tensor_ops_1.scalar(1).sub($x.toFloat().square()).sqrt()); }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.asin($x); }, { $x: $x }, grad);
    };
    UnaryOps.acos = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'acos');
        var grad = function (dy) {
            return {
                $x: function () {
                    return dy.divStrict(tensor_ops_1.scalar(1).sub($x.toFloat().square()).sqrt()).neg();
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.acos($x); }, { $x: $x }, grad);
    };
    UnaryOps.atan = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'atan');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict(tensor_ops_1.scalar(1).add($x.toFloat().square())); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.atan($x); }, { $x: $x }, grad);
    };
    UnaryOps.sinh = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'sinh');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().cosh().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sinh($x); }, { $x: $x }, grad);
    };
    UnaryOps.cosh = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'cosh');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().sinh().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cosh($x); }, { $x: $x }, grad);
    };
    UnaryOps.tanh = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'tanh');
        var grad = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return tensor_ops_1.scalar(1).sub(y.square()).mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.tanh($x)); }, { $x: $x }, grad);
    };
    UnaryOps.asinh = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'asinh');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict(tensor_ops_1.scalar(1).add($x.toFloat().square()).sqrt()); }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.asinh($x); }, { $x: $x }, grad);
    };
    UnaryOps.acosh = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'acosh');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict($x.toFloat().square().sub(tensor_ops_1.scalar(1)).sqrt()); }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.acosh($x); }, { $x: $x }, grad);
    };
    UnaryOps.atanh = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'atanh');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict(tensor_ops_1.scalar(1).sub($x.toFloat().square())); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.atanh($x); }, { $x: $x }, grad);
    };
    UnaryOps.erf = function (x) {
        var $x = tensor_util_1.convertToTensor(x, 'x', 'erf');
        util.assert($x.dtype === 'int32' || $x.dtype === 'float32', 'Input dtype must be `int32` or `float32`.');
        if ($x.dtype === 'int32') {
            $x = $x.toFloat();
        }
        var grad = function (dy) {
            return {
                $x: function () { return dy.mulStrict(tensor_ops_1.scalar(2 / Math.sqrt(Math.PI)).mul($x.square().neg().exp())); }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.erf($x); }, { $x: $x }, grad);
    };
    UnaryOps.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        var $x = tensor_util_1.convertToTensor(x, 'x', 'step');
        var grad = function (dy) {
            return { $x: function () { return tensor_ops_1.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.step($x, alpha); }, { $x: $x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "neg", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "ceil", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "floor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "sign", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "round", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "exp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "expm1", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "log", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "log1p", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "sqrt", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "rsqrt", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "square", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "reciprocal", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "abs", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "clipByValue", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "sigmoid", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "logSigmoid", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "softplus", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "sin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "cos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "tan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "asin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "acos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "atan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "sinh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "cosh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "tanh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "asinh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "acosh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "atanh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "erf", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' })
    ], UnaryOps, "step", null);
    return UnaryOps;
}());
exports.abs = operation_1.op(UnaryOps.abs);
exports.acos = operation_1.op(UnaryOps.acos);
exports.acosh = operation_1.op(UnaryOps.acosh);
exports.asin = operation_1.op(UnaryOps.asin);
exports.asinh = operation_1.op(UnaryOps.asinh);
exports.atan = operation_1.op(UnaryOps.atan);
exports.atanh = operation_1.op(UnaryOps.atanh);
exports.ceil = operation_1.op(UnaryOps.ceil);
exports.clipByValue = operation_1.op(UnaryOps.clipByValue);
exports.cos = operation_1.op(UnaryOps.cos);
exports.cosh = operation_1.op(UnaryOps.cosh);
exports.erf = operation_1.op(UnaryOps.erf);
exports.exp = operation_1.op(UnaryOps.exp);
exports.expm1 = operation_1.op(UnaryOps.expm1);
exports.floor = operation_1.op(UnaryOps.floor);
exports.log = operation_1.op(UnaryOps.log);
exports.log1p = operation_1.op(UnaryOps.log1p);
exports.logSigmoid = operation_1.op(UnaryOps.logSigmoid);
exports.neg = operation_1.op(UnaryOps.neg);
exports.reciprocal = operation_1.op(UnaryOps.reciprocal);
exports.round = operation_1.op(UnaryOps.round);
exports.rsqrt = operation_1.op(UnaryOps.rsqrt);
exports.sigmoid = operation_1.op(UnaryOps.sigmoid);
exports.sign = operation_1.op(UnaryOps.sign);
exports.sin = operation_1.op(UnaryOps.sin);
exports.sinh = operation_1.op(UnaryOps.sinh);
exports.softplus = operation_1.op(UnaryOps.softplus);
exports.sqrt = operation_1.op(UnaryOps.sqrt);
exports.square = operation_1.op(UnaryOps.square);
exports.step = operation_1.op(UnaryOps.step);
exports.tan = operation_1.op(UnaryOps.tan);
exports.tanh = operation_1.op(UnaryOps.tanh);

},{"../doc":11,"../environment":13,"../tensor_util":127,"../util":131,"./operation":93,"./tensor_ops":109}],112:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var optimizer_utils = require("./optimizer_utils");
var AdadeltaOptimizer = (function (_super) {
    __extends(AdadeltaOptimizer, _super);
    function AdadeltaOptimizer(learningRate, rho, epsilon) {
        if (epsilon === void 0) { epsilon = null; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.rho = rho;
        _this.epsilon = epsilon;
        _this.accumulatedGrads = {};
        _this.accumulatedUpdates = {};
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.rhoScalar = globals_1.keep(ops_1.scalar(rho));
        _this.oneMinusRho = globals_1.keep(ops_1.scalar(1 - rho));
        if (epsilon === null) {
            epsilon = optimizer_utils.getOptimizerDefaultEpsilonValue();
        }
        _this.epsilonScalar = globals_1.keep(ops_1.scalar(epsilon));
        return _this;
    }
    AdadeltaOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedGrads[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedGrads[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedUpdates[variableName] == null) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedUpdates[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            var gradient = variableGradients[variableName];
            var accumulatedGrad = this_1.accumulatedGrads[variableName];
            var accumulatedUpdate = this_1.accumulatedUpdates[variableName];
            globals_1.tidy(function () {
                var newAccumulatedGrad = _this.rhoScalar.mul(accumulatedGrad)
                    .add(_this.oneMinusRho.mul(gradient.square()));
                var updates = accumulatedUpdate.add(_this.epsilonScalar)
                    .sqrt()
                    .div(accumulatedGrad.add(_this.epsilonScalar).sqrt())
                    .mul(gradient);
                var newAccumulatedUpdate = _this.rhoScalar.mul(accumulatedUpdate)
                    .add(_this.oneMinusRho.mul(updates.square()));
                _this.accumulatedGrads[variableName].assign(newAccumulatedGrad);
                _this.accumulatedUpdates[variableName].assign(newAccumulatedUpdate);
                var newValue = _this.c.mul(updates).add(value);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    AdadeltaOptimizer.prototype.dispose = function () {
        var _this = this;
        this.c.dispose();
        this.epsilonScalar.dispose();
        this.rhoScalar.dispose();
        this.oneMinusRho.dispose();
        if (this.accumulatedUpdates != null) {
            Object.keys(this.accumulatedUpdates)
                .forEach(function (name) { return _this.accumulatedUpdates[name].dispose(); });
            Object.keys(this.accumulatedGrads)
                .forEach(function (name) { return _this.accumulatedGrads[name].dispose(); });
        }
    };
    AdadeltaOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            rho: this.rho,
            epsilon: this.epsilon
        };
    };
    AdadeltaOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.rho, config.epsilon);
    };
    AdadeltaOptimizer.className = 'AdadeltaOptimizer';
    return AdadeltaOptimizer;
}(optimizer_1.Optimizer));
exports.AdadeltaOptimizer = AdadeltaOptimizer;
serialization_1.SerializationMap.register(AdadeltaOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./optimizer":117,"./optimizer_utils":119}],113:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var optimizer_utils = require("./optimizer_utils");
var AdagradOptimizer = (function (_super) {
    __extends(AdagradOptimizer, _super);
    function AdagradOptimizer(learningRate, initialAccumulatorValue) {
        if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.initialAccumulatorValue = initialAccumulatorValue;
        _this.accumulatedGrads = {};
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        var epsilon = optimizer_utils.getOptimizerDefaultEpsilonValue();
        _this.epsilon = globals_1.keep(ops_1.scalar(epsilon));
        return _this;
    }
    AdagradOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedGrads[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedGrads[variableName] =
                        ops_1.fill(value.shape, _this.initialAccumulatorValue)
                            .variable(trainable_1);
                });
            }
            var gradient = variableGradients[variableName];
            var accumulatedGrad = this_1.accumulatedGrads[variableName];
            globals_1.tidy(function () {
                var newAccumulatedGrad = accumulatedGrad.add(gradient.square());
                _this.accumulatedGrads[variableName].assign(newAccumulatedGrad);
                var newValue = _this.c
                    .mul(gradient.div(newAccumulatedGrad.add(_this.epsilon).sqrt()))
                    .add(value);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    AdagradOptimizer.prototype.dispose = function () {
        var _this = this;
        this.epsilon.dispose();
        this.c.dispose();
        if (this.accumulatedGrads != null) {
            Object.keys(this.accumulatedGrads)
                .forEach(function (name) { return _this.accumulatedGrads[name].dispose(); });
        }
    };
    AdagradOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            initialAccumulatorValue: this.initialAccumulatorValue,
        };
    };
    AdagradOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.initialAccumulatorValue);
    };
    AdagradOptimizer.className = 'AdagradOptimizer';
    return AdagradOptimizer;
}(optimizer_1.Optimizer));
exports.AdagradOptimizer = AdagradOptimizer;
serialization_1.SerializationMap.register(AdagradOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./optimizer":117,"./optimizer_utils":119}],114:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var optimizer_utils = require("./optimizer_utils");
var AdamOptimizer = (function (_super) {
    __extends(AdamOptimizer, _super);
    function AdamOptimizer(learningRate, beta1, beta2, epsilon) {
        if (epsilon === void 0) { epsilon = null; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.beta1 = beta1;
        _this.beta2 = beta2;
        _this.epsilon = epsilon;
        _this.accumulatedFirstMoment = {};
        _this.accumulatedSecondMoment = {};
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.beta1Scalar = globals_1.keep(ops_1.scalar(beta1));
        _this.beta2Scalar = globals_1.keep(ops_1.scalar(beta2));
        globals_1.tidy(function () {
            _this.accBeta1 = ops_1.scalar(beta1).variable();
            _this.accBeta2 = ops_1.scalar(beta2).variable();
        });
        _this.oneMinusBeta1 = globals_1.keep(ops_1.scalar(1 - beta1));
        _this.oneMinusBeta2 = globals_1.keep(ops_1.scalar(1 - beta2));
        _this.one = globals_1.keep(ops_1.scalar(1));
        if (epsilon === null) {
            epsilon = optimizer_utils.getOptimizerDefaultEpsilonValue();
        }
        _this.epsScalar = globals_1.keep(ops_1.scalar(epsilon));
        return _this;
    }
    AdamOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        globals_1.tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var oneMinusAccBeta2 = _this.one.sub(_this.accBeta2);
            for (var variableName in variableGradients) {
                var value = environment_1.ENV.engine.registeredVariables[variableName];
                if (_this.accumulatedFirstMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedFirstMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                if (_this.accumulatedSecondMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedSecondMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                var gradient = variableGradients[variableName];
                var firstMoment = _this.accumulatedFirstMoment[variableName];
                var secondMoment = _this.accumulatedSecondMoment[variableName];
                var newFirstMoment = _this.beta1Scalar.mul(firstMoment)
                    .add(_this.oneMinusBeta1.mul(gradient));
                var newSecondMoment = _this.beta2Scalar.mul(secondMoment)
                    .add(_this.oneMinusBeta2.mul(gradient.square()));
                var biasCorrectedFirstMoment = newFirstMoment.div(oneMinusAccBeta1);
                var biasCorrectedSecondMoment = newSecondMoment.div(oneMinusAccBeta2);
                _this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
                _this.accumulatedSecondMoment[variableName].assign(newSecondMoment);
                var newValue = _this.c
                    .mul(biasCorrectedFirstMoment.div(_this.epsScalar.add(biasCorrectedSecondMoment.sqrt())))
                    .add(value);
                value.assign(newValue);
            }
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1Scalar));
            _this.accBeta2.assign(_this.accBeta2.mul(_this.beta2Scalar));
        });
    };
    AdamOptimizer.prototype.dispose = function () {
        var _this = this;
        this.c.dispose();
        this.epsScalar.dispose();
        this.beta1Scalar.dispose();
        this.beta2Scalar.dispose();
        this.accBeta1.dispose();
        this.accBeta2.dispose();
        this.oneMinusBeta1.dispose();
        this.oneMinusBeta2.dispose();
        this.one.dispose();
        if (this.accumulatedFirstMoment != null) {
            Object.keys(this.accumulatedFirstMoment)
                .forEach(function (name) { return _this.accumulatedFirstMoment[name].dispose(); });
        }
        if (this.accumulatedSecondMoment != null) {
            Object.keys(this.accumulatedSecondMoment)
                .forEach(function (name) { return _this.accumulatedSecondMoment[name].dispose(); });
        }
    };
    AdamOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            beta1: this.beta1,
            beta2: this.beta2,
            epsilon: this.epsilon,
        };
    };
    AdamOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.beta1, config.beta2, config.epsilon);
    };
    AdamOptimizer.className = 'AdamOptimizer';
    return AdamOptimizer;
}(optimizer_1.Optimizer));
exports.AdamOptimizer = AdamOptimizer;
serialization_1.SerializationMap.register(AdamOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./optimizer":117,"./optimizer_utils":119}],115:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var optimizer_utils = require("./optimizer_utils");
var AdamaxOptimizer = (function (_super) {
    __extends(AdamaxOptimizer, _super);
    function AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay) {
        if (epsilon === void 0) { epsilon = null; }
        if (decay === void 0) { decay = 0.0; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.beta1 = beta1;
        _this.beta2 = beta2;
        _this.epsilon = epsilon;
        _this.decay = decay;
        _this.accumulatedFirstMoment = {};
        _this.accumulatedWeightedInfNorm = {};
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.beta1Scalar = globals_1.keep(ops_1.scalar(beta1));
        _this.beta2Scalar = globals_1.keep(ops_1.scalar(beta2));
        _this.decayScalar = globals_1.keep(ops_1.scalar(decay));
        globals_1.tidy(function () {
            _this.iteration = ops_1.scalar(0).variable();
            _this.accBeta1 = ops_1.scalar(beta1).variable();
        });
        _this.oneMinusBeta1 = globals_1.keep(ops_1.scalar(1 - beta1));
        _this.one = globals_1.keep(ops_1.scalar(1));
        if (epsilon === null) {
            epsilon = optimizer_utils.getOptimizerDefaultEpsilonValue();
        }
        _this.epsScalar = globals_1.keep(ops_1.scalar(epsilon));
        return _this;
    }
    AdamaxOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        globals_1.tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var lr = _this.c.div(_this.one.add(_this.decayScalar.mul(_this.iteration)));
            for (var variableName in variableGradients) {
                var value = environment_1.ENV.engine.registeredVariables[variableName];
                if (_this.accumulatedFirstMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedFirstMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                if (_this.accumulatedWeightedInfNorm[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedWeightedInfNorm[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                var gradient = variableGradients[variableName];
                var firstMoment = _this.accumulatedFirstMoment[variableName];
                var weightedInfNorm = _this.accumulatedWeightedInfNorm[variableName];
                var newFirstMoment = _this.beta1Scalar.mul(firstMoment)
                    .add(_this.oneMinusBeta1.mul(gradient));
                var ut0 = _this.beta2Scalar.mul(weightedInfNorm);
                var ut1 = gradient.abs();
                var newWeightedInfNorm = ut0.maximum(ut1);
                _this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
                _this.accumulatedWeightedInfNorm[variableName].assign(newWeightedInfNorm);
                var newValue = lr.div(oneMinusAccBeta1)
                    .mul(newFirstMoment.div(_this.epsScalar.add(newWeightedInfNorm)))
                    .add(value);
                value.assign(newValue);
            }
            _this.iteration.assign(_this.iteration.add(_this.one));
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1Scalar));
        });
    };
    AdamaxOptimizer.prototype.dispose = function () {
        var _this = this;
        this.c.dispose();
        this.epsScalar.dispose();
        this.accBeta1.dispose();
        this.beta1Scalar.dispose();
        this.beta2Scalar.dispose();
        this.oneMinusBeta1.dispose();
        this.decayScalar.dispose();
        this.iteration.dispose();
        this.one.dispose();
        if (this.accumulatedFirstMoment != null) {
            Object.keys(this.accumulatedFirstMoment)
                .forEach(function (name) { return _this.accumulatedFirstMoment[name].dispose(); });
        }
        if (this.accumulatedWeightedInfNorm != null) {
            Object.keys(this.accumulatedWeightedInfNorm)
                .forEach(function (name) { return _this.accumulatedWeightedInfNorm[name].dispose(); });
        }
    };
    AdamaxOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            beta1: this.beta1,
            beta2: this.beta2,
            epsilon: this.epsilon,
            decay: this.decay
        };
    };
    AdamaxOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.beta1, config.beta2, config.epsilon, config.decay);
    };
    AdamaxOptimizer.className = 'AdamaxOptimizer';
    return AdamaxOptimizer;
}(optimizer_1.Optimizer));
exports.AdamaxOptimizer = AdamaxOptimizer;
serialization_1.SerializationMap.register(AdamaxOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./optimizer":117,"./optimizer_utils":119}],116:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var sgd_optimizer_1 = require("./sgd_optimizer");
var MomentumOptimizer = (function (_super) {
    __extends(MomentumOptimizer, _super);
    function MomentumOptimizer(learningRate, momentum, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        var _this = _super.call(this, learningRate) || this;
        _this.learningRate = learningRate;
        _this.momentum = momentum;
        _this.useNesterov = useNesterov;
        _this.m = ops_1.scalar(_this.momentum);
        _this.accumulations = {};
        return _this;
    }
    MomentumOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulations[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulations[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            var accumulation = this_1.accumulations[variableName];
            var gradient = variableGradients[variableName];
            globals_1.tidy(function () {
                var newValue;
                var newAccumulation = _this.m.mul(accumulation).add(gradient);
                if (_this.useNesterov) {
                    newValue =
                        _this.c.mul(gradient.add(newAccumulation.mul(_this.m))).add(value);
                }
                else {
                    newValue = _this.c.mul(newAccumulation).add(value);
                }
                _this.accumulations[variableName].assign(newAccumulation);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    MomentumOptimizer.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.m.dispose();
        if (this.accumulations != null) {
            for (var variableName in this.accumulations) {
                this.accumulations[variableName].dispose();
            }
        }
    };
    MomentumOptimizer.prototype.setMomentum = function (momentum) {
        this.momentum = momentum;
    };
    MomentumOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            momentum: this.momentum,
            useNesterov: this.useNesterov
        };
    };
    MomentumOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.momentum, config.useNesterov);
    };
    MomentumOptimizer.className = 'MomentumOptimizer';
    return MomentumOptimizer;
}(sgd_optimizer_1.SGDOptimizer));
exports.MomentumOptimizer = MomentumOptimizer;
serialization_1.SerializationMap.register(MomentumOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./sgd_optimizer":121}],117:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var globals_1 = require("../globals");
var serialization_1 = require("../serialization");
var Optimizer = (function (_super) {
    __extends(Optimizer, _super);
    function Optimizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Optimizer.prototype.minimize = function (f, returnCost, varList) {
        if (returnCost === void 0) { returnCost = false; }
        var _a = this.computeGradients(f, varList), value = _a.value, grads = _a.grads;
        this.applyGradients(grads);
        var varNames = Object.keys(grads);
        varNames.forEach(function (varName) { return grads[varName].dispose(); });
        if (returnCost) {
            return value;
        }
        else {
            value.dispose();
            return null;
        }
    };
    Optimizer.prototype.computeGradients = function (f, varList) {
        return globals_1.variableGrads(f, varList);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers' })
    ], Optimizer.prototype, "minimize", null);
    Optimizer = __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Classes', namespace: 'train' })
    ], Optimizer);
    return Optimizer;
}(serialization_1.Serializable));
exports.Optimizer = Optimizer;

},{"../doc":11,"../globals":15,"../serialization":123}],118:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var adadelta_optimizer_1 = require("./adadelta_optimizer");
var adagrad_optimizer_1 = require("./adagrad_optimizer");
var adam_optimizer_1 = require("./adam_optimizer");
var adamax_optimizer_1 = require("./adamax_optimizer");
var momentum_optimizer_1 = require("./momentum_optimizer");
var rmsprop_optimizer_1 = require("./rmsprop_optimizer");
var sgd_optimizer_1 = require("./sgd_optimizer");
var OptimizerConstructors = (function () {
    function OptimizerConstructors() {
    }
    OptimizerConstructors.sgd = function (learningRate) {
        return new sgd_optimizer_1.SGDOptimizer(learningRate);
    };
    OptimizerConstructors.momentum = function (learningRate, momentum, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        return new momentum_optimizer_1.MomentumOptimizer(learningRate, momentum, useNesterov);
    };
    OptimizerConstructors.rmsprop = function (learningRate, decay, momentum, epsilon, centered) {
        if (decay === void 0) { decay = .9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = null; }
        if (centered === void 0) { centered = false; }
        return new rmsprop_optimizer_1.RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered);
    };
    OptimizerConstructors.adam = function (learningRate, beta1, beta2, epsilon) {
        if (learningRate === void 0) { learningRate = 0.001; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = null; }
        return new adam_optimizer_1.AdamOptimizer(learningRate, beta1, beta2, epsilon);
    };
    OptimizerConstructors.adadelta = function (learningRate, rho, epsilon) {
        if (learningRate === void 0) { learningRate = .001; }
        if (rho === void 0) { rho = .95; }
        if (epsilon === void 0) { epsilon = null; }
        return new adadelta_optimizer_1.AdadeltaOptimizer(learningRate, rho, epsilon);
    };
    OptimizerConstructors.adamax = function (learningRate, beta1, beta2, epsilon, decay) {
        if (learningRate === void 0) { learningRate = 0.002; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = null; }
        if (decay === void 0) { decay = 0.0; }
        return new adamax_optimizer_1.AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay);
    };
    OptimizerConstructors.adagrad = function (learningRate, initialAccumulatorValue) {
        if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
        return new adagrad_optimizer_1.AdagradOptimizer(learningRate, initialAccumulatorValue);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "sgd", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "momentum", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "rmsprop", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adam", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adadelta", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adamax", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adagrad", null);
    return OptimizerConstructors;
}());
exports.OptimizerConstructors = OptimizerConstructors;

},{"../doc":11,"./adadelta_optimizer":112,"./adagrad_optimizer":113,"./adam_optimizer":114,"./adamax_optimizer":115,"./momentum_optimizer":116,"./rmsprop_optimizer":120,"./sgd_optimizer":121}],119:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var DEFAULT_FLOAT32_EPSILON = 1e-8;
var DEFAULT_FLOAT16_EPSILON = 1e-4;
function getOptimizerDefaultEpsilonValue() {
    if (environment_1.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
        return DEFAULT_FLOAT32_EPSILON;
    }
    return DEFAULT_FLOAT16_EPSILON;
}
exports.getOptimizerDefaultEpsilonValue = getOptimizerDefaultEpsilonValue;

},{"../environment":13}],120:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var optimizer_utils = require("./optimizer_utils");
var RMSPropOptimizer = (function (_super) {
    __extends(RMSPropOptimizer, _super);
    function RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered) {
        if (decay === void 0) { decay = 0.9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = null; }
        if (centered === void 0) { centered = false; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.decay = decay;
        _this.momentum = momentum;
        _this.epsilon = epsilon;
        _this.accumulatedMeanSquares = {};
        _this.accumulatedMeanGrads = {};
        _this.accumulatedMoments = {};
        _this.c = globals_1.keep(ops_1.scalar(learningRate));
        _this.decayScalar = globals_1.keep(ops_1.scalar(decay));
        _this.momentumScalar = globals_1.keep(ops_1.scalar(momentum));
        _this.oneMinusDecay = globals_1.keep(ops_1.scalar(1 - decay));
        _this.centered = centered;
        if (epsilon === null) {
            epsilon = optimizer_utils.getOptimizerDefaultEpsilonValue();
        }
        _this.epsilonScalar = globals_1.keep(ops_1.scalar(epsilon));
        return _this;
    }
    RMSPropOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedMeanSquares[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMeanSquares[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedMeanGrads[variableName] == null && this_1.centered) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMeanGrads[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            if (this_1.accumulatedMoments[variableName] == null) {
                var trainable_3 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMoments[variableName] =
                        ops_1.zerosLike(value).variable(trainable_3);
                });
            }
            var accumulatedMeanSquare = this_1.accumulatedMeanSquares[variableName];
            var accumulatedMeanGrad = this_1.accumulatedMeanGrads[variableName];
            var accumulatedMoments = this_1.accumulatedMoments[variableName];
            var gradient = variableGradients[variableName];
            globals_1.tidy(function () {
                var newAccumulatedMeanSquare = _this.decayScalar.mul(accumulatedMeanSquare)
                    .add(_this.oneMinusDecay.mul(gradient.square()));
                if (_this.centered) {
                    var newAccumulatedMeanGrad = _this.decayScalar.mul(accumulatedMeanGrad)
                        .add(_this.oneMinusDecay.mul(gradient));
                    var newAccumulatedMoments = _this.momentumScalar.mul(accumulatedMoments)
                        .add(_this.c.mul(gradient).div(newAccumulatedMeanSquare
                        .sub(newAccumulatedMeanGrad.square().add(_this.epsilonScalar))
                        .sqrt()));
                    _this.accumulatedMeanSquares[variableName].assign(newAccumulatedMeanSquare);
                    _this.accumulatedMeanGrads[variableName].assign(newAccumulatedMeanGrad);
                    _this.accumulatedMoments[variableName].assign(newAccumulatedMoments);
                    var newValue = value.sub(newAccumulatedMoments);
                    value.assign(newValue);
                }
                else {
                    var newAccumulatedMeanSquare_1 = _this.decayScalar.mul(accumulatedMeanSquare)
                        .add(_this.oneMinusDecay.mul(gradient.square()));
                    var newAccumulatedMoments = _this.momentumScalar.mul(accumulatedMoments)
                        .add(_this.c.mul(gradient).div(newAccumulatedMeanSquare_1.add(_this.epsilonScalar).sqrt()));
                    _this.accumulatedMeanSquares[variableName].assign(newAccumulatedMeanSquare_1);
                    _this.accumulatedMoments[variableName].assign(newAccumulatedMoments);
                    var newValue = value.sub(newAccumulatedMoments);
                    value.assign(newValue);
                }
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    RMSPropOptimizer.prototype.dispose = function () {
        var _this = this;
        this.c.dispose();
        this.epsilonScalar.dispose();
        this.decayScalar.dispose();
        this.momentumScalar.dispose();
        this.oneMinusDecay.dispose();
        if (this.accumulatedMeanSquares != null) {
            Object.keys(this.accumulatedMeanSquares)
                .forEach(function (name) { return _this.accumulatedMeanSquares[name].dispose(); });
        }
        if (this.accumulatedMeanGrads != null && this.centered) {
            Object.keys(this.accumulatedMeanGrads)
                .forEach(function (name) { return _this.accumulatedMeanGrads[name].dispose(); });
        }
        if (this.accumulatedMoments != null) {
            Object.keys(this.accumulatedMoments)
                .forEach(function (name) { return _this.accumulatedMoments[name].dispose(); });
        }
    };
    RMSPropOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            decay: this.decay,
            momentum: this.momentum,
            epsilon: this.epsilon,
            centered: this.centered
        };
    };
    RMSPropOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.decay, config.momentum, config.epsilon, config.centered);
    };
    RMSPropOptimizer.className = 'RMSPropOptimizer';
    return RMSPropOptimizer;
}(optimizer_1.Optimizer));
exports.RMSPropOptimizer = RMSPropOptimizer;
serialization_1.SerializationMap.register(RMSPropOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./optimizer":117,"./optimizer_utils":119}],121:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var SGDOptimizer = (function (_super) {
    __extends(SGDOptimizer, _super);
    function SGDOptimizer(learningRate) {
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.setLearningRate(learningRate);
        return _this;
    }
    SGDOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var varNames = Object.keys(variableGradients);
        varNames.forEach(function (varName) {
            var gradient = variableGradients[varName];
            var value = environment_1.ENV.engine.registeredVariables[varName];
            globals_1.tidy(function () {
                var newValue = _this.c.mul(gradient).add(value);
                value.assign(newValue);
            });
        });
    };
    SGDOptimizer.prototype.setLearningRate = function (learningRate) {
        this.learningRate = learningRate;
        if (this.c != null) {
            this.c.dispose();
        }
        this.c = globals_1.keep(ops_1.scalar(-learningRate));
    };
    SGDOptimizer.prototype.dispose = function () {
        this.c.dispose();
    };
    SGDOptimizer.prototype.getConfig = function () {
        return { learningRate: this.learningRate };
    };
    SGDOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate);
    };
    SGDOptimizer.className = 'SGDOptimizer';
    return SGDOptimizer;
}(optimizer_1.Optimizer));
exports.SGDOptimizer = SGDOptimizer;
serialization_1.SerializationMap.register(SGDOptimizer);

},{"../environment":13,"../globals":15,"../ops/ops":94,"../serialization":123,"./optimizer":117}],122:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Profiler = (function () {
    function Profiler(backendTimer, logger) {
        this.backendTimer = backendTimer;
        this.logger = logger;
        if (logger == null) {
            this.logger = new Logger();
        }
    }
    Profiler.prototype.profileKernel = function (name, f) {
        var _this = this;
        var result;
        var holdResultWrapperFn = function () {
            result = f();
        };
        var timer = this.backendTimer.time(holdResultWrapperFn);
        var vals = result.dataSync();
        util.checkForNaN(vals, result.dtype, name);
        timer.then(function (timing) {
            _this.logger.logKernelProfile(name, result, vals, timing.kernelMs);
        });
        return result;
    };
    return Profiler;
}());
exports.Profiler = Profiler;
var Logger = (function () {
    function Logger() {
    }
    Logger.prototype.logKernelProfile = function (name, result, vals, timeMs) {
        var time = util.rightPad(timeMs + "ms", 9);
        var paddedName = util.rightPad(name, 25);
        var rank = result.rank;
        var size = result.size;
        var shape = util.rightPad(result.shape.toString(), 14);
        console.log("%c" + paddedName + "\t%c" + time + "\t%c" + rank + "D " + shape + "\t%c" + size, 'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
    };
    return Logger;
}());
exports.Logger = Logger;

},{"./util":131}],123:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.getClassName = function () {
        return this.constructor
            .className;
    };
    Serializable.fromConfig = function (cls, config) {
        return new cls(config);
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var SerializationMap = (function () {
    function SerializationMap() {
        this.classNameMap = {};
    }
    SerializationMap.getMap = function () {
        if (SerializationMap.instance == null) {
            SerializationMap.instance = new SerializationMap();
        }
        return SerializationMap.instance;
    };
    SerializationMap.register = function (cls) {
        SerializationMap.getMap().classNameMap[cls.className] =
            [cls, cls.fromConfig];
    };
    return SerializationMap;
}());
exports.SerializationMap = SerializationMap;

},{}],124:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
function getFilteredNodesXToY(tape, xs, y) {
    var tensorsFromX = {};
    var nodesFromX = {};
    for (var i = 0; i < xs.length; i++) {
        tensorsFromX[xs[i].id] = true;
    }
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        var nodeInputs = node.inputs;
        for (var inputName in nodeInputs) {
            var input = nodeInputs[inputName];
            var anyInputFromX = false;
            for (var j = 0; j < xs.length; j++) {
                if (tensorsFromX[input.id]) {
                    tensorsFromX[node.output.id] = true;
                    anyInputFromX = true;
                    nodesFromX[node.id] = true;
                    break;
                }
            }
            if (anyInputFromX) {
                break;
            }
        }
    }
    var tensorsLeadToY = {};
    tensorsLeadToY[y.id] = true;
    var nodesToY = {};
    for (var i = tape.length - 1; i >= 0; i--) {
        var node = tape[i];
        var nodeInputs = node.inputs;
        var outputs = [];
        outputs.push(node.output);
        for (var j = 0; j < outputs.length; j++) {
            if (tensorsLeadToY[outputs[j].id]) {
                for (var inputName in nodeInputs) {
                    tensorsLeadToY[nodeInputs[inputName].id] = true;
                    nodesToY[node.id] = true;
                }
                break;
            }
        }
    }
    var filteredTape = [];
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        if (nodesFromX[node.id] && nodesToY[node.id]) {
            var prunedInputs = {};
            for (var inputName in node.inputs) {
                var nodeInput = node.inputs[inputName];
                if (tensorsFromX[nodeInput.id]) {
                    prunedInputs[inputName] = nodeInput;
                }
            }
            var prunedNode = Object.assign({}, node);
            prunedNode.inputs = prunedInputs;
            prunedNode.output = node.output;
            filteredTape.push(prunedNode);
        }
    }
    return filteredTape;
}
exports.getFilteredNodesXToY = getFilteredNodesXToY;
function backpropagateGradients(tensorAccumulatedGradientMap, filteredTape) {
    for (var i = filteredTape.length - 1; i >= 0; i--) {
        var node = filteredTape[i];
        var dy = tensorAccumulatedGradientMap[node.output.id];
        if (node.gradient == null) {
            throw new Error("Cannot compute gradient: gradient function not found " +
                ("for " + node.name + "."));
        }
        var inputGradients = node.gradient(dy);
        for (var inputName in node.inputs) {
            if (!(inputName in inputGradients)) {
                throw new Error("Cannot backprop through input " + inputName + ". " +
                    ("Available gradients found: " + Object.keys(inputGradients) + "."));
            }
            var dx = inputGradients[inputName]();
            var x = node.inputs[inputName];
            if (!util.arraysEqual(dx.shape, x.shape)) {
                throw new Error("Error in gradient for op " + node.name + ". The gradient of input " +
                    ("'" + inputName + "' has shape '" + dx.shape + "', which does not match ") +
                    ("the shape of the input '" + x.shape + "'"));
            }
            if (tensorAccumulatedGradientMap[x.id] == null) {
                tensorAccumulatedGradientMap[x.id] = dx;
            }
            else {
                var curGradient = tensorAccumulatedGradientMap[x.id];
                tensorAccumulatedGradientMap[x.id] = curGradient.add(dx);
                curGradient.dispose();
            }
        }
    }
}
exports.backpropagateGradients = backpropagateGradients;

},{"./util":131}],125:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var tensor_format_1 = require("./tensor_format");
var util = require("./util");
var util_1 = require("./util");
var TensorBuffer = (function () {
    function TensorBuffer(shape, dtype, values) {
        this.dtype = dtype;
        if (values != null) {
            var n = values.length;
            var size = util.sizeFromShape(shape);
            util.assert(n === size, "Length of values '" + n + "' does not match the size " +
                ("inferred by the shape '" + size + "'"));
        }
        this.shape = shape.slice();
        this.values =
            values || util.getTypedArrayFromDType(dtype, util.sizeFromShape(shape));
        this.strides = util_1.computeStrides(shape);
        this.size = util.sizeFromShape(shape);
    }
    TensorBuffer.prototype.set = function (value) {
        var locs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            locs[_i - 1] = arguments[_i];
        }
        if (locs.length === 0) {
            locs = [0];
        }
        util.assert(locs.length === this.rank, "The number of provided coordinates (" + locs.length + ") must " +
            ("match the rank (" + this.rank + ")"));
        var index = this.locToIndex(locs);
        this.values[index] = value;
    };
    TensorBuffer.prototype.get = function () {
        var locs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            locs[_i] = arguments[_i];
        }
        if (locs.length === 0) {
            locs = [0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return this.values[index];
    };
    TensorBuffer.prototype.locToIndex = function (locs) {
        if (this.rank === 0) {
            return 0;
        }
        else if (this.rank === 1) {
            return locs[0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return index;
    };
    TensorBuffer.prototype.indexToLoc = function (index) {
        if (this.rank === 0) {
            return [];
        }
        else if (this.rank === 1) {
            return [index];
        }
        var locs = new Array(this.shape.length);
        for (var i = 0; i < locs.length - 1; ++i) {
            locs[i] = Math.floor(index / this.strides[i]);
            index -= locs[i] * this.strides[i];
        }
        locs[locs.length - 1] = index;
        return locs;
    };
    Object.defineProperty(TensorBuffer.prototype, "rank", {
        get: function () {
            return this.shape.length;
        },
        enumerable: true,
        configurable: true
    });
    TensorBuffer.prototype.toTensor = function () {
        return Tensor.make(this.shape, { values: this.values }, this.dtype);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "set", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "get", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "toTensor", null);
    TensorBuffer = __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], TensorBuffer);
    return TensorBuffer;
}());
exports.TensorBuffer = TensorBuffer;
var trackerFn = null;
var opHandler = null;
function setTensorTracker(fn) {
    trackerFn = fn;
}
exports.setTensorTracker = setTensorTracker;
function setOpHandler(handler) {
    opHandler = handler;
}
exports.setOpHandler = setOpHandler;
var Tensor = (function () {
    function Tensor(shape, dtype, values, dataId) {
        this.isDisposedInternal = false;
        this.size = util.sizeFromShape(shape);
        if (values != null) {
            util.assert(this.size === values.length, "Constructing tensor of shape (" + this.size + ") should match the " +
                ("length of values (" + values.length + ")"));
        }
        this.shape = shape.slice();
        this.dtype = dtype || 'float32';
        this.strides = util_1.computeStrides(shape);
        this.dataId = dataId != null ? dataId : {};
        this.id = Tensor_1.nextId++;
        this.rankType = (this.rank < 5 ? this.rank.toString() : 'higher');
        trackerFn().registerTensor(this);
        if (values != null) {
            trackerFn().write(this.dataId, values);
        }
    }
    Tensor_1 = Tensor;
    Tensor.make = function (shape, data, dtype) {
        return new Tensor_1(shape, dtype, data.values, data.dataId);
    };
    Tensor.prototype.flatten = function () {
        this.throwIfDisposed();
        return this.as1D();
    };
    Tensor.prototype.asScalar = function () {
        this.throwIfDisposed();
        util.assert(this.size === 1, 'The array must have only 1 element.');
        return this.reshape([]);
    };
    Tensor.prototype.as1D = function () {
        this.throwIfDisposed();
        return this.reshape([this.size]);
    };
    Tensor.prototype.as2D = function (rows, columns) {
        this.throwIfDisposed();
        return this.reshape([rows, columns]);
    };
    Tensor.prototype.as3D = function (rows, columns, depth) {
        this.throwIfDisposed();
        return this.reshape([rows, columns, depth]);
    };
    Tensor.prototype.as4D = function (rows, columns, depth, depth2) {
        this.throwIfDisposed();
        return this.reshape([rows, columns, depth, depth2]);
    };
    Tensor.prototype.asType = function (dtype) {
        this.throwIfDisposed();
        return opHandler.cast(this, dtype);
    };
    Object.defineProperty(Tensor.prototype, "rank", {
        get: function () {
            return this.shape.length;
        },
        enumerable: true,
        configurable: true
    });
    Tensor.prototype.get = function () {
        var locs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            locs[_i] = arguments[_i];
        }
        util.assert(locs.length === this.rank, 'Number of coordinates in get() must match the rank of the tensor');
        this.throwIfDisposed();
        if (locs.length === 0) {
            locs = [0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return this.dataSync()[index];
    };
    Tensor.prototype.buffer = function () {
        return opHandler.buffer(this.shape, this.dtype, this.dataSync());
    };
    Tensor.prototype.data = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.throwIfDisposed();
                return [2, trackerFn().read(this.dataId)];
            });
        });
    };
    Tensor.prototype.dataSync = function () {
        this.throwIfDisposed();
        return trackerFn().readSync(this.dataId);
    };
    Tensor.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        trackerFn().disposeTensor(this);
        this.isDisposedInternal = true;
    };
    Object.defineProperty(Tensor.prototype, "isDisposed", {
        get: function () {
            return this.isDisposedInternal;
        },
        enumerable: true,
        configurable: true
    });
    Tensor.prototype.throwIfDisposed = function () {
        if (this.isDisposed) {
            throw new Error("Tensor is disposed.");
        }
    };
    Tensor.prototype.toFloat = function () {
        return this.asType('float32');
    };
    Tensor.prototype.toInt = function () {
        return this.asType('int32');
    };
    Tensor.prototype.toBool = function () {
        return this.asType('bool');
    };
    Tensor.prototype.print = function (verbose) {
        if (verbose === void 0) { verbose = false; }
        return opHandler.print(this, verbose);
    };
    Tensor.prototype.reshape = function (newShape) {
        this.throwIfDisposed();
        return opHandler.reshape(this, newShape);
    };
    Tensor.prototype.reshapeAs = function (x) {
        this.throwIfDisposed();
        return this.reshape(x.shape);
    };
    Tensor.prototype.expandDims = function (axis) {
        if (axis === void 0) { axis = 0; }
        return opHandler.expandDims(this, axis);
    };
    Tensor.prototype.cumsum = function (axis, exclusive, reverse) {
        if (axis === void 0) { axis = 0; }
        if (exclusive === void 0) { exclusive = false; }
        if (reverse === void 0) { reverse = false; }
        return opHandler.cumsum(this, axis, exclusive, reverse);
    };
    Tensor.prototype.squeeze = function (axis) {
        this.throwIfDisposed();
        return opHandler.squeeze(this, axis);
    };
    Tensor.prototype.clone = function () {
        this.throwIfDisposed();
        return opHandler.clone(this);
    };
    Tensor.prototype.toString = function (verbose) {
        if (verbose === void 0) { verbose = false; }
        var vals = this.dataSync();
        return tensor_format_1.tensorToString(vals, this.shape, this.dtype, verbose);
    };
    Tensor.prototype.tile = function (reps) {
        this.throwIfDisposed();
        return opHandler.tile(this, reps);
    };
    Tensor.prototype.gather = function (indices, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return opHandler.gather(this, indices, axis);
    };
    Tensor.prototype.matMul = function (b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        this.throwIfDisposed();
        return opHandler.matMul(this, b, transposeA, transposeB);
    };
    Tensor.prototype.dot = function (b) {
        this.throwIfDisposed();
        return opHandler.dot(this, b);
    };
    Tensor.prototype.norm = function (ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.norm(this, ord, axis, keepDims);
    };
    Tensor.prototype.slice = function (begin, size) {
        this.throwIfDisposed();
        return opHandler.slice(this, begin, size);
    };
    Tensor.prototype.reverse = function (axis) {
        this.throwIfDisposed();
        return opHandler.reverse(this, axis);
    };
    Tensor.prototype.concat = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return opHandler.concat([this, x], axis);
    };
    Tensor.prototype.stack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        return opHandler.stack([this, x], axis);
    };
    Tensor.prototype.unstack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        return opHandler.unstack(this, axis);
    };
    Tensor.prototype.pad = function (paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        return opHandler.pad(this, paddings, constantValue);
    };
    Tensor.prototype.batchNormalization = function (mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        this.throwIfDisposed();
        return opHandler.batchNormalization(this, mean, variance, varianceEpsilon, scale, offset);
    };
    Tensor.prototype.all = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.all(this, axis, keepDims);
    };
    Tensor.prototype.any = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.any(this, axis, keepDims);
    };
    Tensor.prototype.logSumExp = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.logSumExp(this, axis, keepDims);
    };
    Tensor.prototype.sum = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.sum(this, axis, keepDims);
    };
    Tensor.prototype.mean = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.mean(this, axis, keepDims);
    };
    Tensor.prototype.min = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.min(this, axis, keepDims);
    };
    Tensor.prototype.max = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return opHandler.max(this, axis, keepDims);
    };
    Tensor.prototype.argMin = function (axis) {
        if (axis === void 0) { axis = null; }
        this.throwIfDisposed();
        return opHandler.argMin(this, axis);
    };
    Tensor.prototype.argMax = function (axis) {
        if (axis === void 0) { axis = null; }
        this.throwIfDisposed();
        return opHandler.argMax(this, axis);
    };
    Tensor.prototype.cast = function (dtype) {
        this.throwIfDisposed();
        return opHandler.cast(this, dtype);
    };
    Tensor.prototype.add = function (x) {
        this.throwIfDisposed();
        return opHandler.add(this, x);
    };
    Tensor.prototype.addStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.addStrict(this, x);
    };
    Tensor.prototype.sub = function (x) {
        this.throwIfDisposed();
        return opHandler.sub(this, x);
    };
    Tensor.prototype.subStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.subStrict(this, x);
    };
    Tensor.prototype.pow = function (exp) {
        this.throwIfDisposed();
        return opHandler.pow(this, exp);
    };
    Tensor.prototype.powStrict = function (exp) {
        this.throwIfDisposed();
        return opHandler.powStrict(this, exp);
    };
    Tensor.prototype.mul = function (x) {
        this.throwIfDisposed();
        return opHandler.mul(this, x);
    };
    Tensor.prototype.mulStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.mulStrict(this, x);
    };
    Tensor.prototype.div = function (x) {
        this.throwIfDisposed();
        return opHandler.div(this, x);
    };
    Tensor.prototype.floorDiv = function (x) {
        this.throwIfDisposed();
        return opHandler.floorDiv(this, x);
    };
    Tensor.prototype.divStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.divStrict(this, x);
    };
    Tensor.prototype.minimum = function (x) {
        this.throwIfDisposed();
        return opHandler.minimum(this, x);
    };
    Tensor.prototype.minimumStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.minimumStrict(this, x);
    };
    Tensor.prototype.maximum = function (x) {
        this.throwIfDisposed();
        return opHandler.maximum(this, x);
    };
    Tensor.prototype.maximumStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.maximumStrict(this, x);
    };
    Tensor.prototype.mod = function (x) {
        this.throwIfDisposed();
        return opHandler.mod(this, x);
    };
    Tensor.prototype.modStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.modStrict(this, x);
    };
    Tensor.prototype.squaredDifference = function (x) {
        this.throwIfDisposed();
        return opHandler.squaredDifference(this, x);
    };
    Tensor.prototype.squaredDifferenceStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.squaredDifferenceStrict(this, x);
    };
    Tensor.prototype.transpose = function (perm) {
        this.throwIfDisposed();
        return opHandler.transpose(this, perm);
    };
    Tensor.prototype.notEqual = function (x) {
        this.throwIfDisposed();
        return opHandler.notEqual(this, x);
    };
    Tensor.prototype.notEqualStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.notEqualStrict(this, x);
    };
    Tensor.prototype.less = function (x) {
        this.throwIfDisposed();
        return opHandler.less(this, x);
    };
    Tensor.prototype.lessStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.lessStrict(this, x);
    };
    Tensor.prototype.equal = function (x) {
        this.throwIfDisposed();
        return opHandler.equal(this, x);
    };
    Tensor.prototype.equalStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.equalStrict(this, x);
    };
    Tensor.prototype.lessEqual = function (x) {
        this.throwIfDisposed();
        return opHandler.lessEqual(this, x);
    };
    Tensor.prototype.lessEqualStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.lessEqualStrict(this, x);
    };
    Tensor.prototype.greater = function (x) {
        this.throwIfDisposed();
        return opHandler.greater(this, x);
    };
    Tensor.prototype.greaterStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.greaterStrict(this, x);
    };
    Tensor.prototype.greaterEqual = function (x) {
        this.throwIfDisposed();
        return opHandler.greaterEqual(this, x);
    };
    Tensor.prototype.greaterEqualStrict = function (x) {
        this.throwIfDisposed();
        return opHandler.greaterEqualStrict(this, x);
    };
    Tensor.prototype.logicalAnd = function (x) {
        this.throwIfDisposed();
        return opHandler.logicalAnd(this, x);
    };
    Tensor.prototype.logicalOr = function (x) {
        this.throwIfDisposed();
        return opHandler.logicalOr(this, x);
    };
    Tensor.prototype.logicalNot = function () {
        this.throwIfDisposed();
        return opHandler.logicalNot(this);
    };
    Tensor.prototype.logicalXor = function (x) {
        this.throwIfDisposed();
        return opHandler.logicalXor(this, x);
    };
    Tensor.prototype.where = function (condition, x) {
        this.throwIfDisposed();
        return opHandler.where(condition, this, x);
    };
    Tensor.prototype.neg = function () {
        this.throwIfDisposed();
        return opHandler.neg(this);
    };
    Tensor.prototype.ceil = function () {
        this.throwIfDisposed();
        return opHandler.ceil(this);
    };
    Tensor.prototype.floor = function () {
        this.throwIfDisposed();
        return opHandler.floor(this);
    };
    Tensor.prototype.sign = function () {
        this.throwIfDisposed();
        return opHandler.sign(this);
    };
    Tensor.prototype.exp = function () {
        this.throwIfDisposed();
        return opHandler.exp(this);
    };
    Tensor.prototype.expm1 = function () {
        this.throwIfDisposed();
        return opHandler.expm1(this);
    };
    Tensor.prototype.log = function () {
        this.throwIfDisposed();
        return opHandler.log(this);
    };
    Tensor.prototype.log1p = function () {
        this.throwIfDisposed();
        return opHandler.log1p(this);
    };
    Tensor.prototype.sqrt = function () {
        this.throwIfDisposed();
        return opHandler.sqrt(this);
    };
    Tensor.prototype.rsqrt = function () {
        this.throwIfDisposed();
        return opHandler.rsqrt(this);
    };
    Tensor.prototype.square = function () {
        this.throwIfDisposed();
        return opHandler.square(this);
    };
    Tensor.prototype.reciprocal = function () {
        this.throwIfDisposed();
        return opHandler.reciprocal(this);
    };
    Tensor.prototype.abs = function () {
        this.throwIfDisposed();
        return opHandler.abs(this);
    };
    Tensor.prototype.clipByValue = function (min, max) {
        this.throwIfDisposed();
        return opHandler.clipByValue(this, min, max);
    };
    Tensor.prototype.relu = function () {
        this.throwIfDisposed();
        return opHandler.relu(this);
    };
    Tensor.prototype.elu = function () {
        this.throwIfDisposed();
        return opHandler.elu(this);
    };
    Tensor.prototype.selu = function () {
        this.throwIfDisposed();
        return opHandler.selu(this);
    };
    Tensor.prototype.leakyRelu = function (alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        this.throwIfDisposed();
        return opHandler.leakyRelu(this, alpha);
    };
    Tensor.prototype.prelu = function (alpha) {
        this.throwIfDisposed();
        return opHandler.prelu(this, alpha);
    };
    Tensor.prototype.sigmoid = function () {
        this.throwIfDisposed();
        return opHandler.sigmoid(this);
    };
    Tensor.prototype.logSigmoid = function () {
        this.throwIfDisposed();
        return opHandler.logSigmoid(this);
    };
    Tensor.prototype.softplus = function () {
        this.throwIfDisposed();
        return opHandler.softplus(this);
    };
    Tensor.prototype.sin = function () {
        this.throwIfDisposed();
        return opHandler.sin(this);
    };
    Tensor.prototype.cos = function () {
        this.throwIfDisposed();
        return opHandler.cos(this);
    };
    Tensor.prototype.tan = function () {
        this.throwIfDisposed();
        return opHandler.tan(this);
    };
    Tensor.prototype.asin = function () {
        this.throwIfDisposed();
        return opHandler.asin(this);
    };
    Tensor.prototype.acos = function () {
        this.throwIfDisposed();
        return opHandler.acos(this);
    };
    Tensor.prototype.atan = function () {
        this.throwIfDisposed();
        return opHandler.atan(this);
    };
    Tensor.prototype.sinh = function () {
        this.throwIfDisposed();
        return opHandler.sinh(this);
    };
    Tensor.prototype.cosh = function () {
        this.throwIfDisposed();
        return opHandler.cosh(this);
    };
    Tensor.prototype.tanh = function () {
        this.throwIfDisposed();
        return opHandler.tanh(this);
    };
    Tensor.prototype.asinh = function () {
        this.throwIfDisposed();
        return opHandler.asinh(this);
    };
    Tensor.prototype.acosh = function () {
        this.throwIfDisposed();
        return opHandler.acosh(this);
    };
    Tensor.prototype.atanh = function () {
        this.throwIfDisposed();
        return opHandler.atanh(this);
    };
    Tensor.prototype.erf = function () {
        this.throwIfDisposed();
        return opHandler.erf(this);
    };
    Tensor.prototype.round = function () {
        this.throwIfDisposed();
        return opHandler.round(this);
    };
    Tensor.prototype.step = function (alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        this.throwIfDisposed();
        return opHandler.step(this, alpha);
    };
    Tensor.prototype.softmax = function (dim) {
        if (dim === void 0) { dim = -1; }
        this.throwIfDisposed();
        return opHandler.softmax(this, dim);
    };
    Tensor.prototype.resizeBilinear = function (newShape2D, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        this.throwIfDisposed();
        return opHandler.image.resizeBilinear(this, newShape2D, alignCorners);
    };
    Tensor.prototype.resizeNearestNeighbor = function (newShape2D, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        this.throwIfDisposed();
        return opHandler.image.resizeNearestNeighbor(this, newShape2D, alignCorners);
    };
    Tensor.prototype.conv1d = function (filter, stride, pad, dataFormat, dilation, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NWC'; }
        if (dilation === void 0) { dilation = 1; }
        this.throwIfDisposed();
        return opHandler.conv1d(this, filter, stride, pad, dataFormat, dilation, dimRoundingMode);
    };
    Tensor.prototype.conv2d = function (filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        this.throwIfDisposed();
        return opHandler.conv2d(this, filter, strides, pad, dataFormat, dilations, dimRoundingMode);
    };
    Tensor.prototype.conv2dTranspose = function (filter, outputShape, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return opHandler.conv2dTranspose(this, filter, outputShape, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.depthwiseConv2D = function (filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        this.throwIfDisposed();
        return opHandler.depthwiseConv2d(this, filter, strides, pad, dataFormat, dilations, dimRoundingMode);
    };
    Tensor.prototype.avgPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return opHandler.avgPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.maxPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return opHandler.maxPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.localResponseNormalization = function (radius, bias, alpha, beta) {
        if (radius === void 0) { radius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        return opHandler.localResponseNormalization(this, radius, bias, alpha, beta);
    };
    Tensor.prototype.variable = function (trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        this.throwIfDisposed();
        return Variable.variable(this, trainable, name, dtype);
    };
    Tensor.prototype.unsortedSegmentSum = function (segmentIds, numSegments) {
        this.throwIfDisposed();
        return opHandler.unsortedSegmentSum(this, segmentIds, numSegments);
    };
    var Tensor_1;
    Tensor.nextId = 0;
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "flatten", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "asScalar", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as1D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as2D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as3D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as4D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "asType", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "buffer", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "data", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "dataSync", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "dispose", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toFloat", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toInt", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toBool", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "print", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "reshape", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "reshapeAs", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "expandDims", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "cumsum", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "squeeze", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "clone", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toString", null);
    Tensor = Tensor_1 = __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor);
    return Tensor;
}());
exports.Tensor = Tensor;
Object.defineProperty(Tensor, Symbol.hasInstance, {
    value: function (instance) {
        return instance.shape != null && instance.dtype != null;
    }
});
var Variable = (function (_super) {
    __extends(Variable, _super);
    function Variable(initialValue, trainable, name) {
        if (trainable === void 0) { trainable = true; }
        var _this = _super.call(this, initialValue.shape, initialValue.dtype, null, initialValue.dataId) || this;
        _this.trainable = trainable;
        _this.name = name;
        if (_this.name == null) {
            _this.name = Variable_1.nextVarId.toString();
            Variable_1.nextVarId++;
        }
        try {
            trackerFn().registerVariable(_this);
        }
        catch (ex) {
            trackerFn().disposeTensor(_this);
            throw ex;
        }
        return _this;
    }
    Variable_1 = Variable;
    Variable.variable = function (initialValue, trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        if (dtype != null && dtype !== initialValue.dtype) {
            initialValue = initialValue.asType(dtype);
        }
        return new Variable_1(initialValue, trainable, name);
    };
    Variable.prototype.assign = function (newValue) {
        if (newValue.dtype !== this.dtype) {
            throw new Error("dtype of the new value (" + newValue.dtype + ") and " +
                ("previous value (" + this.dtype + ") must match"));
        }
        if (!util.arraysEqual(newValue.shape, this.shape)) {
            throw new Error("shape of the new value (" + newValue.shape + ") and " +
                ("previous value (" + this.shape + ") must match"));
        }
        trackerFn().disposeTensor(this);
        this.dataId = newValue.dataId;
        trackerFn().registerTensor(this);
    };
    var Variable_1;
    Variable.nextVarId = 0;
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Variable.prototype, "assign", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Variable, "variable", null);
    Variable = Variable_1 = __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Variable);
    return Variable;
}(Tensor));
exports.Variable = Variable;
Object.defineProperty(Variable, Symbol.hasInstance, {
    value: function (instance) {
        return instance instanceof Tensor && instance.assign != null &&
            instance.assign instanceof Function;
    }
});
var variable = Variable.variable;
exports.variable = variable;

},{"./doc":11,"./tensor_format":126,"./util":131}],126:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var FORMAT_LIMIT_NUM_VALS = 20;
var FORMAT_NUM_FIRST_LAST_VALS = 3;
var FORMAT_NUM_SIG_DIGITS = 7;
function tensorToString(vals, shape, dtype, verbose) {
    var strides = util_1.computeStrides(shape);
    var padPerCol = computeMaxSizePerColumn(vals, shape, strides);
    var rank = shape.length;
    var valsLines = subTensorToString(vals, shape, strides, padPerCol);
    var lines = ['Tensor'];
    if (verbose) {
        lines.push("  dtype: " + dtype);
        lines.push("  rank: " + rank);
        lines.push("  shape: [" + shape + "]");
        lines.push("  values:");
    }
    lines.push(valsLines.map(function (l) { return '    ' + l; }).join('\n'));
    return lines.join('\n');
}
exports.tensorToString = tensorToString;
function computeMaxSizePerColumn(vals, shape, strides) {
    var n = util_1.sizeFromShape(shape);
    var numCols = strides[strides.length - 1];
    var padPerCol = new Array(numCols).fill(0);
    var rank = shape.length;
    if (rank > 1) {
        for (var row = 0; row < n / numCols; row++) {
            var offset = row * numCols;
            for (var j = 0; j < numCols; j++) {
                padPerCol[j] =
                    Math.max(padPerCol[j], valToString(vals[offset + j], 0).length);
            }
        }
    }
    return padPerCol;
}
function valToString(val, pad) {
    return util_1.rightPad(parseFloat(val.toFixed(FORMAT_NUM_SIG_DIGITS)).toString(), pad);
}
function subTensorToString(vals, shape, strides, padPerCol, isLast) {
    if (isLast === void 0) { isLast = true; }
    var size = shape[0];
    var rank = shape.length;
    if (rank === 0) {
        return [vals[0].toString()];
    }
    if (rank === 1) {
        if (size > FORMAT_LIMIT_NUM_VALS) {
            var firstVals = Array.from(vals.subarray(0, FORMAT_NUM_FIRST_LAST_VALS));
            var lastVals = Array.from(vals.subarray(size - FORMAT_NUM_FIRST_LAST_VALS, size));
            return [
                '[' + firstVals.map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                    ', ..., ' +
                    lastVals
                        .map(function (x, i) { return valToString(x, padPerCol[size - FORMAT_NUM_FIRST_LAST_VALS + i]); })
                        .join(', ') +
                    ']'
            ];
        }
        return [
            '[' +
                Array.from(vals).map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                ']'
        ];
    }
    var subshape = shape.slice(1);
    var substrides = strides.slice(1);
    var stride = strides[0];
    var lines = [];
    if (size > FORMAT_LIMIT_NUM_VALS) {
        for (var i = 0; i < FORMAT_NUM_FIRST_LAST_VALS; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, false));
        }
        lines.push('...');
        for (var i = size - FORMAT_NUM_FIRST_LAST_VALS; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, i === size - 1));
        }
    }
    else {
        for (var i = 0; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, i === size - 1));
        }
    }
    var sep = rank === 2 ? ',' : '';
    lines[0] = '[' + lines[0] + sep;
    for (var i = 1; i < lines.length - 1; i++) {
        lines[i] = ' ' + lines[i] + sep;
    }
    var newLineSep = ',\n';
    for (var i = 2; i < rank; i++) {
        newLineSep += '\n';
    }
    lines[lines.length - 1] =
        ' ' + lines[lines.length - 1] + ']' + (isLast ? '' : newLineSep);
    return lines;
}

},{"./util":131}],127:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("./tensor");
var util_1 = require("./util");
function assertTypesMatch(a, b) {
    util_1.assert(a.dtype === b.dtype, " The dtypes of the first(" + a.dtype + ") and" +
        (" second(" + b.dtype + ") input must match"));
}
exports.assertTypesMatch = assertTypesMatch;
function convertToTensor(x, argName, functionName, dtype) {
    if (dtype === void 0) { dtype = 'float32'; }
    dtype = dtype || 'float32';
    if (x instanceof tensor_1.Tensor) {
        return x;
    }
    if (!util_1.isTypedArray(x) && !Array.isArray(x) && typeof x !== 'number' &&
        typeof x !== 'boolean') {
        throw new Error("Argument '" + argName + "' passed to '" + functionName + "' must be a " +
            ("Tensor or TensorLike, but got " + x.constructor.name));
    }
    var inferredShape = util_1.inferShape(x);
    if (!util_1.isTypedArray(x) && !Array.isArray(x)) {
        x = [x];
    }
    return tensor_1.Tensor.make(inferredShape, { values: util_1.toTypedArray(x, dtype) }, dtype);
}
exports.convertToTensor = convertToTensor;
function convertToTensorArray(arg, argName, functionName) {
    if (!Array.isArray(arg)) {
        throw new Error("Argument " + argName + " passed to " + functionName + " must be a " +
            '`Tensor[]` or `TensorLike[]`');
    }
    var tensors = arg;
    return tensors.map(function (t, i) { return convertToTensor(t, argName + "[" + i + "]", functionName); });
}
exports.convertToTensorArray = convertToTensorArray;
function isTensorInList(tensor, tensorList) {
    for (var i = 0; i < tensorList.length; i++) {
        if (tensorList[i].id === tensor.id) {
            return true;
        }
    }
    return false;
}
exports.isTensorInList = isTensorInList;
function flattenNameArrayMap(nameArrayMap, keys) {
    var xs = [];
    if (nameArrayMap instanceof tensor_1.Tensor) {
        xs.push(nameArrayMap);
    }
    else {
        var xMap = nameArrayMap;
        for (var i = 0; i < keys.length; i++) {
            xs.push(xMap[keys[i]]);
        }
    }
    return xs;
}
exports.flattenNameArrayMap = flattenNameArrayMap;
function unflattenToNameArrayMap(keys, flatArrays) {
    if (keys.length !== flatArrays.length) {
        throw new Error("Cannot unflatten Tensor[], keys and arrays are not of same length.");
    }
    var result = {};
    for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = flatArrays[i];
    }
    return result;
}
exports.unflattenToNameArrayMap = unflattenToNameArrayMap;
function getTensorsInContainer(result) {
    var list = [];
    var seen = new Set();
    walkTensorContainer(result, list, seen);
    return list;
}
exports.getTensorsInContainer = getTensorsInContainer;
function walkTensorContainer(container, list, seen) {
    if (container == null) {
        return;
    }
    if (container instanceof tensor_1.Tensor) {
        list.push(container);
        return;
    }
    if (!isIterable(container)) {
        return;
    }
    var iterable = container;
    for (var k in iterable) {
        var val = iterable[k];
        if (!seen.has(val)) {
            seen.add(val);
            walkTensorContainer(val, list, seen);
        }
    }
}
function isIterable(obj) {
    return Array.isArray(obj) || typeof obj === 'object';
}

},{"./tensor":125,"./util":131}],128:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var tensor_1 = require("./tensor");
var util = require("./util");
exports.WEBGL_ENVS = {
    'HAS_WEBGL': true
};
exports.NODE_ENVS = {
    'IS_NODE': true
};
exports.CHROME_ENVS = {
    'IS_CHROME': true
};
exports.BROWSER_ENVS = {
    'IS_BROWSER': true
};
exports.CPU_ENVS = {
    'HAS_WEBGL': false
};
exports.ALL_ENVS = {};
function expectArraysClose(actual, expected, epsilon) {
    if (epsilon == null) {
        epsilon = environment_1.ENV.get('TEST_EPSILON');
    }
    if (!(actual instanceof tensor_1.Tensor) && !(expected instanceof tensor_1.Tensor)) {
        var aType = actual.constructor.name;
        var bType = expected.constructor.name;
        if (aType !== bType) {
            throw new Error("Arrays are of different type actual: " + aType + " " +
                ("vs expected: " + bType));
        }
    }
    else if (actual instanceof tensor_1.Tensor && expected instanceof tensor_1.Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error("Arrays are of different type actual: " + actual.dtype + " " +
                ("vs expected: " + expected.dtype + "."));
        }
        if (!util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error("Arrays are of different shape actual: " + actual.shape + " " +
                ("vs expected: " + expected.shape + "."));
        }
    }
    var actualValues;
    var expectedValues;
    if (actual instanceof tensor_1.Tensor) {
        actualValues = actual.dataSync();
    }
    else {
        actualValues = actual;
    }
    if (expected instanceof tensor_1.Tensor) {
        expectedValues = expected.dataSync();
    }
    else {
        expectedValues = expected;
    }
    if (actualValues.length !== expectedValues.length) {
        throw new Error("Arrays have different lengths actual: " + actualValues.length + " vs " +
            ("expected: " + expectedValues.length + ".\n") +
            ("Actual:   " + actualValues + ".\n") +
            ("Expected: " + expectedValues + "."));
    }
    for (var i = 0; i < expectedValues.length; ++i) {
        var a = actualValues[i];
        var e = expectedValues[i];
        if (!areClose(a, Number(e), epsilon)) {
            throw new Error("Arrays differ: actual[" + i + "] = " + a + ", expected[" + i + "] = " + e + ".\n" +
                ("Actual:   " + actualValues + ".\n") +
                ("Expected: " + expectedValues + "."));
        }
    }
}
exports.expectArraysClose = expectArraysClose;
function expectPromiseToFail(fn, done) {
    fn().then(function () { return done.fail(); }, function () { return done(); });
}
exports.expectPromiseToFail = expectPromiseToFail;
function expectArraysEqual(actual, expected) {
    return expectArraysClose(actual, expected, 0);
}
exports.expectArraysEqual = expectArraysEqual;
function expectNumbersClose(a, e, epsilon) {
    if (epsilon == null) {
        epsilon = environment_1.ENV.get('TEST_EPSILON');
    }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
exports.expectNumbersClose = expectNumbersClose;
function areClose(a, e, epsilon) {
    if (isNaN(a) && isNaN(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
function expectValuesInRange(actual, low, high) {
    var actualVals;
    if (actual instanceof tensor_1.Tensor) {
        actualVals = actual.dataSync();
    }
    else {
        actualVals = actual;
    }
    for (var i = 0; i < actualVals.length; i++) {
        if (actualVals[i] < low || actualVals[i] > high) {
            throw new Error("Value out of range:" + actualVals[i] + " low: " + low + ", high: " + high);
        }
    }
}
exports.expectValuesInRange = expectValuesInRange;
function expectArrayBuffersEqual(actual, expected) {
    expect(new Float32Array(actual)).toEqual(new Float32Array(expected));
}
exports.expectArrayBuffersEqual = expectArrayBuffersEqual;

},{"./environment":13,"./tensor":125,"./util":131}],129:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adadelta_optimizer_1 = require("./optimizers/adadelta_optimizer");
var adagrad_optimizer_1 = require("./optimizers/adagrad_optimizer");
var adam_optimizer_1 = require("./optimizers/adam_optimizer");
var adamax_optimizer_1 = require("./optimizers/adamax_optimizer");
var momentum_optimizer_1 = require("./optimizers/momentum_optimizer");
var optimizer_constructors_1 = require("./optimizers/optimizer_constructors");
var rmsprop_optimizer_1 = require("./optimizers/rmsprop_optimizer");
var sgd_optimizer_1 = require("./optimizers/sgd_optimizer");
[momentum_optimizer_1.MomentumOptimizer, sgd_optimizer_1.SGDOptimizer, adadelta_optimizer_1.AdadeltaOptimizer, adagrad_optimizer_1.AdagradOptimizer,
    rmsprop_optimizer_1.RMSPropOptimizer, adamax_optimizer_1.AdamaxOptimizer, adam_optimizer_1.AdamOptimizer];
exports.train = {
    sgd: optimizer_constructors_1.OptimizerConstructors.sgd,
    momentum: optimizer_constructors_1.OptimizerConstructors.momentum,
    adadelta: optimizer_constructors_1.OptimizerConstructors.adadelta,
    adagrad: optimizer_constructors_1.OptimizerConstructors.adagrad,
    rmsprop: optimizer_constructors_1.OptimizerConstructors.rmsprop,
    adamax: optimizer_constructors_1.OptimizerConstructors.adamax,
    adam: optimizer_constructors_1.OptimizerConstructors.adam
};

},{"./optimizers/adadelta_optimizer":112,"./optimizers/adagrad_optimizer":113,"./optimizers/adam_optimizer":114,"./optimizers/adamax_optimizer":115,"./optimizers/momentum_optimizer":116,"./optimizers/optimizer_constructors":118,"./optimizers/rmsprop_optimizer":120,"./optimizers/sgd_optimizer":121}],130:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DType;
(function (DType) {
    DType["float32"] = "float32";
    DType["int32"] = "int32";
    DType["bool"] = "bool";
})(DType = exports.DType || (exports.DType = {}));
var Rank;
(function (Rank) {
    Rank["R0"] = "R0";
    Rank["R1"] = "R1";
    Rank["R2"] = "R2";
    Rank["R3"] = "R3";
    Rank["R4"] = "R4";
    Rank["R5"] = "R5";
    Rank["R6"] = "R6";
})(Rank = exports.Rank || (exports.Rank = {}));
var UpcastInt32AndMap;
(function (UpcastInt32AndMap) {
    UpcastInt32AndMap["float32"] = "float32";
    UpcastInt32AndMap["int32"] = "int32";
    UpcastInt32AndMap["bool"] = "int32";
})(UpcastInt32AndMap || (UpcastInt32AndMap = {}));
var UpcastBoolAndMap;
(function (UpcastBoolAndMap) {
    UpcastBoolAndMap["float32"] = "float32";
    UpcastBoolAndMap["int32"] = "int32";
    UpcastBoolAndMap["bool"] = "bool";
})(UpcastBoolAndMap || (UpcastBoolAndMap = {}));
var UpcastFloat32AndMap;
(function (UpcastFloat32AndMap) {
    UpcastFloat32AndMap["float32"] = "float32";
    UpcastFloat32AndMap["int32"] = "float32";
    UpcastFloat32AndMap["bool"] = "float32";
})(UpcastFloat32AndMap || (UpcastFloat32AndMap = {}));
var upcastTypeMap = {
    'float32': UpcastFloat32AndMap,
    'int32': UpcastInt32AndMap,
    'bool': UpcastBoolAndMap
};
function upcastType(typeA, typeB) {
    return upcastTypeMap[typeA][typeB];
}
exports.upcastType = upcastType;
function sumOutType(type) {
    return upcastType(type, 'int32');
}
exports.sumOutType = sumOutType;

},{}],131:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shuffle(array) {
    var counter = array.length;
    var temp = 0;
    var index = 0;
    while (counter > 0) {
        index = (Math.random() * counter) | 0;
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
exports.shuffle = shuffle;
function clamp(min, x, max) {
    return Math.max(min, Math.min(x, max));
}
exports.clamp = clamp;
function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
exports.randUniform = randUniform;
function distSquared(a, b) {
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        var diff = Number(a[i]) - Number(b[i]);
        result += diff * diff;
    }
    return result;
}
exports.distSquared = distSquared;
function assert(expr, msg) {
    if (!expr) {
        throw new Error(typeof msg === 'string' ? msg : msg());
    }
}
exports.assert = assert;
function assertShapesMatch(shapeA, shapeB, errorMessagePrefix) {
    if (errorMessagePrefix === void 0) { errorMessagePrefix = ''; }
    assert(arraysEqual(shapeA, shapeB), errorMessagePrefix + (" Shapes " + shapeA + " and " + shapeB + " must match"));
}
exports.assertShapesMatch = assertShapesMatch;
function assertNonNull(a) {
    assert(a != null, "The input to the tensor constructor must be a non-null value.");
}
exports.assertNonNull = assertNonNull;
function flatten(arr, ret) {
    if (ret === void 0) { ret = []; }
    if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length; ++i) {
            flatten(arr[i], ret);
        }
    }
    else {
        ret.push(arr);
    }
    return ret;
}
exports.flatten = flatten;
function inferShape(val) {
    var firstElem = val;
    if (isTypedArray(val)) {
        return [val.length];
    }
    if (!Array.isArray(val)) {
        return [];
    }
    var shape = [];
    while (firstElem instanceof Array) {
        shape.push(firstElem.length);
        firstElem = firstElem[0];
    }
    if (val instanceof Array) {
        deepAssertShapeConsistency(val, shape, []);
    }
    return shape;
}
exports.inferShape = inferShape;
function deepAssertShapeConsistency(val, shape, indices) {
    indices = indices || [];
    if (!(val instanceof Array)) {
        assert(shape.length === 0, function () { return "Element arr[" + indices.join('][') + "] is a primitive, " +
            ("but should be an array of " + shape[0] + " elements"); });
        return;
    }
    assert(shape.length > 0, function () { return "Element arr[" + indices.join('][') + "] should be a primitive, " +
        ("but is an array of " + val.length + " elements"); });
    assert(val.length === shape[0], function () { return "Element arr[" + indices.join('][') + "] should have " + shape[0] + " " +
        ("elements, but has " + val.length + " elements"); });
    var subShape = shape.slice(1);
    for (var i = 0; i < val.length; ++i) {
        deepAssertShapeConsistency(val[i], subShape, indices.concat(i));
    }
}
function sizeFromShape(shape) {
    if (shape.length === 0) {
        return 1;
    }
    var size = shape[0];
    for (var i = 1; i < shape.length; i++) {
        size *= shape[i];
    }
    return size;
}
exports.sizeFromShape = sizeFromShape;
function isScalarShape(shape) {
    return shape.length === 0;
}
exports.isScalarShape = isScalarShape;
function arraysEqual(n1, n2) {
    if (n1.length !== n2.length) {
        return false;
    }
    for (var i = 0; i < n1.length; i++) {
        if (n1[i] !== n2[i]) {
            return false;
        }
    }
    return true;
}
exports.arraysEqual = arraysEqual;
function isInt(a) {
    return a % 1 === 0;
}
exports.isInt = isInt;
function tanh(x) {
    if (Math.tanh != null) {
        return Math.tanh(x);
    }
    if (x === Infinity) {
        return 1;
    }
    else if (x === -Infinity) {
        return -1;
    }
    else {
        var e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
}
exports.tanh = tanh;
function sizeToSquarishShape(size) {
    for (var a = Math.floor(Math.sqrt(size)); a > 1; --a) {
        if (size % a === 0) {
            return [a, size / a];
        }
    }
    return [1, size];
}
exports.sizeToSquarishShape = sizeToSquarishShape;
function createShuffledIndices(n) {
    var shuffledIndices = new Uint32Array(n);
    for (var i = 0; i < n; ++i) {
        shuffledIndices[i] = i;
    }
    shuffle(shuffledIndices);
    return shuffledIndices;
}
exports.createShuffledIndices = createShuffledIndices;
function rightPad(a, size) {
    if (size <= a.length) {
        return a;
    }
    return a + ' '.repeat(size - a.length);
}
exports.rightPad = rightPad;
function repeatedTry(checkFn, delayFn, maxCounter) {
    if (delayFn === void 0) { delayFn = function (counter) { return 0; }; }
    return new Promise(function (resolve, reject) {
        var tryCount = 0;
        var tryFn = function () {
            if (checkFn()) {
                resolve();
                return;
            }
            tryCount++;
            var nextBackoff = delayFn(tryCount);
            if (maxCounter != null && tryCount >= maxCounter) {
                reject();
                return;
            }
            setTimeout(tryFn, nextBackoff);
        };
        tryFn();
    });
}
exports.repeatedTry = repeatedTry;
function getQueryParams(queryString) {
    var params = {};
    queryString.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g, function (s) {
        var t = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            t[_i - 1] = arguments[_i];
        }
        decodeParam(params, t[0], t[1]);
        return t.join('=');
    });
    return params;
}
exports.getQueryParams = getQueryParams;
function decodeParam(params, name, value) {
    params[decodeURIComponent(name)] = decodeURIComponent(value || '');
}
function inferFromImplicitShape(shape, size) {
    var shapeProd = 1;
    var implicitIdx = -1;
    for (var i = 0; i < shape.length; ++i) {
        if (shape[i] > 0) {
            shapeProd *= shape[i];
        }
        else if (shape[i] === -1) {
            if (implicitIdx !== -1) {
                throw Error("Shapes can only have 1 implicit size. " +
                    ("Found - 1 at dim " + implicitIdx + " and dim " + i));
            }
            implicitIdx = i;
        }
        else if (shape[i] <= 0) {
            throw Error("Shapes can not be <= 0. Found " + shape[i] + " at dim " + i);
        }
    }
    if (implicitIdx === -1) {
        if (size > 0 && size !== shapeProd) {
            throw Error("Size(" + size + ") must match the product of shape " + shape);
        }
        return shape;
    }
    if (size % shapeProd !== 0) {
        throw Error("The implicit shape can't be a fractional number. " +
            ("Got " + size + " / " + shapeProd));
    }
    var newShape = shape.slice();
    newShape[implicitIdx] = size / shapeProd;
    return newShape;
}
exports.inferFromImplicitShape = inferFromImplicitShape;
function squeezeShape(shape, axis) {
    var newShape = [];
    var keptDims = [];
    var j = 0;
    for (var i = 0; i < shape.length; ++i) {
        if (axis != null) {
            if (axis[j] === i && shape[i] > 1) {
                throw new Error("Can't squeeze axis " + i + " since its dim '" + shape[i] + "' is not 1");
            }
            if ((axis[j] == null || axis[j] > i) && shape[i] === 1) {
                newShape.push(shape[i]);
                keptDims.push(i);
            }
            if (axis[j] <= i) {
                j++;
            }
        }
        if (shape[i] > 1) {
            newShape.push(shape[i]);
            keptDims.push(i);
        }
    }
    return { newShape: newShape, keptDims: keptDims };
}
exports.squeezeShape = squeezeShape;
function getTypedArrayFromDType(dtype, size) {
    var values = null;
    if (dtype == null || dtype === 'float32') {
        values = new Float32Array(size);
    }
    else if (dtype === 'int32') {
        values = new Int32Array(size);
    }
    else if (dtype === 'bool') {
        values = new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
    return values;
}
exports.getTypedArrayFromDType = getTypedArrayFromDType;
function checkForNaN(vals, dtype, name) {
    if (dtype !== 'float32') {
        return;
    }
    for (var i = 0; i < vals.length; i++) {
        if (isNaN(vals[i])) {
            throw Error("The result of the '" + name + "' has NaNs.");
        }
    }
}
exports.checkForNaN = checkForNaN;
function hasEncodingLoss(oldType, newType) {
    if (newType === 'float32') {
        return false;
    }
    if (newType === 'int32' && oldType !== 'float32') {
        return false;
    }
    if (newType === 'bool' && oldType === 'bool') {
        return false;
    }
    return true;
}
exports.hasEncodingLoss = hasEncodingLoss;
function copyTypedArray(array, dtype) {
    if (dtype == null || dtype === 'float32') {
        return new Float32Array(array);
    }
    else if (dtype === 'int32') {
        return new Int32Array(array);
    }
    else if (dtype === 'bool') {
        var bool = new Uint8Array(array.length);
        for (var i = 0; i < bool.length; ++i) {
            if (Math.round(array[i]) !== 0) {
                bool[i] = 1;
            }
        }
        return bool;
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
}
exports.copyTypedArray = copyTypedArray;
function isTypedArray(a) {
    return a instanceof Float32Array || a instanceof Int32Array ||
        a instanceof Uint8Array;
}
exports.isTypedArray = isTypedArray;
function bytesPerElement(dtype) {
    if (dtype === 'float32' || dtype === 'int32') {
        return 4;
    }
    else if (dtype === 'bool') {
        return 1;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
exports.bytesPerElement = bytesPerElement;
function isFunction(f) {
    return !!(f && f.constructor && f.call && f.apply);
}
exports.isFunction = isFunction;
function nearestDivisor(size, start) {
    for (var i = start; i < size; ++i) {
        if (size % i === 0) {
            return i;
        }
    }
    return size;
}
exports.nearestDivisor = nearestDivisor;
function computeStrides(shape) {
    var rank = shape.length;
    if (rank < 2) {
        return [];
    }
    var strides = new Array(rank - 1);
    strides[rank - 2] = shape[rank - 1];
    for (var i = rank - 3; i >= 0; --i) {
        strides[i] = strides[i + 1] * shape[i + 1];
    }
    return strides;
}
exports.computeStrides = computeStrides;
function toTypedArray(a, dtype) {
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (Array.isArray(a)) {
        a = flatten(a);
    }
    return copyTypedArray(a, dtype);
}
exports.toTypedArray = toTypedArray;
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}
function makeOnesTypedArray(size, dtype) {
    var array = makeZerosTypedArray(size, dtype);
    for (var i = 0; i < array.length; i++) {
        array[i] = 1;
    }
    return array;
}
exports.makeOnesTypedArray = makeOnesTypedArray;
function makeZerosTypedArray(size, dtype) {
    if (dtype == null || dtype === 'float32') {
        return new Float32Array(size);
    }
    else if (dtype === 'int32') {
        return new Int32Array(size);
    }
    else if (dtype === 'bool') {
        return new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
}
exports.makeZerosTypedArray = makeZerosTypedArray;
function now() {
    if (typeof performance !== 'undefined') {
        return performance.now();
    }
    else if (typeof process !== 'undefined') {
        var time = process.hrtime();
        return time[0] * 1000 + time[1] / 1000000;
    }
    else {
        throw new Error('Can not measure time in this environment. You should run tf.js ' +
            'in the browser or in Node.js');
    }
}
exports.now = now;

}).call(this,require('_process'))
},{"_process":149}],132:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var version = '0.12.4';
exports.version = version;

},{}],133:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gpgpu_util = require("./kernels/webgl/gpgpu_util");
exports.gpgpu_util = gpgpu_util;
var webgl_util = require("./kernels/webgl/webgl_util");
exports.webgl_util = webgl_util;
var backend_webgl_1 = require("./kernels/backend_webgl");
exports.MathBackendWebGL = backend_webgl_1.MathBackendWebGL;
var gpgpu_context_1 = require("./kernels/webgl/gpgpu_context");
exports.GPGPUContext = gpgpu_context_1.GPGPUContext;

},{"./kernels/backend_webgl":31,"./kernels/webgl/gpgpu_context":46,"./kernels/webgl/gpgpu_util":48,"./kernels/webgl/webgl_util":72}],134:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":135,"./lib/tychei":136,"./lib/xor128":137,"./lib/xor4096":138,"./lib/xorshift7":139,"./lib/xorwow":140,"./seedrandom":141}],135:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],136:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],137:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],138:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],139:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],140:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],141:[function(require,module,exports){
/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":146}],142:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
var math_benchmark_run_groups_1 = require("./math-benchmark-run-groups");
var polymer_spec_1 = require("./polymer-spec");
// tslint:disable-next-line:variable-name
exports.MathBenchmarkPolymer = polymer_spec_1.PolymerElement({ is: 'math-benchmark', properties: { benchmarks: Array } });
var MathBenchmark = /** @class */ (function (_super) {
    __extends(MathBenchmark, _super);
    function MathBenchmark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MathBenchmark.prototype.ready = function () {
        var _this = this;
        var groups = math_benchmark_run_groups_1.getRunGroups();
        // Set up the benchmarks UI.
        var benchmarks = [];
        this.stopMessages = [];
        groups.forEach(function (group) {
            if (group.selectedOption == null) {
                group.selectedOption = '';
            }
            benchmarks.push(group);
            _this.stopMessages.push(false);
        });
        this.benchmarks = benchmarks;
        // In a setTimeout to let the UI update before we add event listeners.
        setTimeout(function () {
            var runButtons = _this.querySelectorAll('.run-test');
            var stopButtons = _this.querySelectorAll('.run-stop');
            var _loop_1 = function (i) {
                runButtons[i].addEventListener('click', function () {
                    _this.runBenchmarkGroup(groups, i);
                });
                stopButtons[i].addEventListener('click', function () {
                    _this.stopMessages[i] = true;
                });
            };
            for (var i = 0; i < runButtons.length; i++) {
                _loop_1(i);
            }
        }, 0);
    };
    MathBenchmark.prototype.getDisplayParams = function (paramsMap, selectedOption) {
        var params = paramsMap[selectedOption];
        if (params == null) {
            return '';
        }
        var kvParams = params;
        var out = [];
        var keys = Object.keys(kvParams);
        if (keys.length === 0) {
            return '';
        }
        for (var i = 0; i < keys.length; i++) {
            out.push(keys[i] + ': ' + kvParams[keys[i]]);
        }
        return '{' + out.join(', ') + '}';
    };
    MathBenchmark.prototype.runBenchmarkGroup = function (groups, benchmarkRunGroupIndex) {
        var benchmarkRunGroup = groups[benchmarkRunGroupIndex];
        var canvas = this.querySelectorAll('.run-plot')[benchmarkRunGroupIndex];
        // Avoid to growing size of rendered chart.
        canvas.width = 360;
        canvas.height = 270;
        var context = canvas.getContext('2d');
        var datasets = [];
        for (var i = 0; i < benchmarkRunGroup.benchmarkRuns.length; i++) {
            benchmarkRunGroup.benchmarkRuns[i].clearChartData();
            var hue = Math.floor(360 * i / benchmarkRunGroup.benchmarkRuns.length);
            datasets.push({
                data: benchmarkRunGroup.benchmarkRuns[i].chartData,
                fill: false,
                label: benchmarkRunGroup.benchmarkRuns[i].name,
                borderColor: "hsl(" + hue + ", 100%, 40%)",
                backgroundColor: "hsl(" + hue + ", 100%, 70%)",
                pointRadius: 0,
                pointHitRadius: 5,
                borderWidth: 1,
                lineTension: 0
            });
        }
        var chart = new Chart(context, {
            type: 'line',
            data: { datasets: datasets },
            options: {
                animation: { duration: 0 },
                responsive: false,
                scales: {
                    xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                min: benchmarkRunGroup.min,
                                max: benchmarkRunGroup.max,
                                stepSize: benchmarkRunGroup.stepSize,
                                callback: function (label) {
                                    return benchmarkRunGroup.stepToSizeTransformation != null ?
                                        benchmarkRunGroup.stepToSizeTransformation(+label) :
                                        +label;
                                }
                                // tslint:disable-next-line:no-any
                            } // Note: the typings for this are incorrect, cast as any.
                        }],
                    yAxes: [{
                            ticks: {
                                callback: function (label, index, labels) {
                                    return label + "ms";
                                }
                            }
                        }]
                },
                tooltips: { mode: 'label' },
                title: { text: benchmarkRunGroup.name }
            }
        });
        canvas.style.display = 'none';
        var runMessage = this.querySelectorAll('.run-message')[benchmarkRunGroupIndex];
        runMessage.style.display = 'block';
        var runNumbersTable = this.querySelectorAll('.run-numbers-table')[benchmarkRunGroupIndex];
        runNumbersTable.innerHTML = '';
        runNumbersTable.style.display = 'none';
        // Set up the header for the table.
        var headers = ['size'];
        for (var i = 0; i < benchmarkRunGroup.benchmarkRuns.length; i++) {
            headers.push(benchmarkRunGroup.benchmarkRuns[i].name);
        }
        runNumbersTable.appendChild(this.buildRunNumbersRow(headers));
        this.runBenchmarkSteps(chart, benchmarkRunGroup, benchmarkRunGroupIndex, benchmarkRunGroup.min);
    };
    MathBenchmark.prototype.buildRunNumbersRow = function (values) {
        var runNumberRowElement = document.createElement('div');
        runNumberRowElement.className = 'run-numbers-row math-benchmark';
        for (var i = 0; i < values.length; i++) {
            var runNumberCellElement = document.createElement('div');
            runNumberCellElement.className = 'run-numbers-cell math-benchmark';
            runNumberCellElement.innerText = values[i];
            runNumberRowElement.appendChild(runNumberCellElement);
        }
        return runNumberRowElement;
    };
    MathBenchmark.prototype.runBenchmarkSteps = function (chart, runGroup, benchmarkRunGroupIndex, step) {
        return __awaiter(this, void 0, void 0, function () {
            var runNumbersTable, canvas, runMessage, runNumberRowElement, rowValues, i, run, test, size, opType, time, resultString;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runNumbersTable = this.querySelectorAll('.run-numbers-table')[benchmarkRunGroupIndex];
                        if (step > runGroup.max || this.stopMessages[benchmarkRunGroupIndex]) {
                            this.stopMessages[benchmarkRunGroupIndex] = false;
                            runNumbersTable.style.display = '';
                            canvas = this.querySelectorAll('.run-plot')[benchmarkRunGroupIndex];
                            canvas.style.display = 'block';
                            chart.update();
                            runMessage = this.querySelectorAll('.run-message')[benchmarkRunGroupIndex];
                            runMessage.style.display = 'none';
                            return [2 /*return*/];
                        }
                        runNumberRowElement = document.createElement('div');
                        runNumberRowElement.className = 'run-numbers-row math-benchmark';
                        rowValues = [step.toString()];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < runGroup.benchmarkRuns.length)) return [3 /*break*/, 4];
                        run = runGroup.benchmarkRuns[i];
                        test = run.benchmarkTest;
                        size = runGroup.stepToSizeTransformation != null ?
                            runGroup.stepToSizeTransformation(step) :
                            step;
                        opType = runGroup.selectedOption;
                        return [4 /*yield*/, test.run(size, opType, runGroup.params[opType])];
                    case 2:
                        time = _a.sent();
                        resultString = time.toFixed(3) + 'ms';
                        if (time >= 0) {
                            run.chartData.push({ x: step, y: time });
                            rowValues.push(resultString);
                        }
                        console.log(run.name + "[" + size + "]: " + resultString);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        runNumbersTable.appendChild(this.buildRunNumbersRow(rowValues));
                        step += runGroup.stepSize;
                        // Allow the UI to update.
                        setTimeout(function () { return _this.runBenchmarkSteps(chart, runGroup, benchmarkRunGroupIndex, step); }, 100);
                        return [2 /*return*/];
                }
            });
        });
    };
    return MathBenchmark;
}(exports.MathBenchmarkPolymer));
exports.MathBenchmark = MathBenchmark;
document.registerElement(MathBenchmark.prototype.is, MathBenchmark);

},{"./math-benchmark-run-groups":144,"./polymer-spec":151}],143:[function(require,module,exports){

},{}],144:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
exports.__esModule = true;
var batchnormalization3d_benchmark_1 = require("../common/batchnormalization3d_benchmark");
var benchmark_1 = require("../common/benchmark");
var conv_benchmarks_1 = require("../common/conv_benchmarks");
var matmul_benchmarks_1 = require("../common/matmul_benchmarks");
var pool_benchmarks_1 = require("../common/pool_benchmarks");
var reduction_ops_benchmark_1 = require("../common/reduction_ops_benchmark");
var unary_ops_benchmark_1 = require("../common/unary_ops_benchmark");
function getRunGroups() {
    var groups = [];
    groups.push({
        name: 'Batch Normalization 3D: input [size, size, 8]',
        min: 0,
        max: 512,
        stepSize: 64,
        stepToSizeTransformation: function (step) { return Math.max(1, step); },
        benchmarkRuns: [
            new benchmark_1.BenchmarkRun('batchnorm3d_gpu', new batchnormalization3d_benchmark_1.BatchNormalization3DGPUBenchmark()),
            new benchmark_1.BenchmarkRun('batchnorm3d_cpu', new batchnormalization3d_benchmark_1.BatchNormalization3DCPUBenchmark())
        ],
        params: {}
    });
    groups.push({
        name: 'Matrix Multiplication: ' +
            'matmul([size, size], [size, size])',
        min: 0,
        max: 1024,
        stepSize: 64,
        stepToSizeTransformation: function (step) { return Math.max(1, step); },
        benchmarkRuns: [
            new benchmark_1.BenchmarkRun('mulmat_gpu', new matmul_benchmarks_1.MatmulGPUBenchmark()),
            new benchmark_1.BenchmarkRun('mulmat_cpu', new matmul_benchmarks_1.MatmulCPUBenchmark())
        ],
        params: {}
    });
    var convParams = { inDepth: 8, filterSize: 7, stride: 1, pad: 'same' };
    var regParams = Object.assign({}, convParams, { outDepth: 3 });
    var depthwiseParams = Object.assign({}, convParams, { channelMul: 1 });
    groups.push({
        name: 'Convolution ops [size, size, depth]',
        min: 0,
        max: 1024,
        stepSize: 64,
        stepToSizeTransformation: function (step) { return Math.max(1, step); },
        benchmarkRuns: [new benchmark_1.BenchmarkRun('conv_gpu', new conv_benchmarks_1.ConvGPUBenchmark())],
        options: ['regular', 'transposed', 'depthwise'],
        selectedOption: 'regular',
        params: {
            'regular': regParams,
            'transposed': regParams,
            'depthwise': depthwiseParams
        }
    });
    var poolParams = { depth: 8, fieldSize: 4, stride: 4 };
    groups.push({
        name: 'Pool Ops: input [size, size]',
        min: 0,
        max: 1024,
        stepSize: 64,
        stepToSizeTransformation: function (step) { return Math.max(4, step); },
        options: ['max', 'avg'],
        selectedOption: 'max',
        benchmarkRuns: [
            new benchmark_1.BenchmarkRun('pool_gpu', new pool_benchmarks_1.PoolGPUBenchmark()),
            new benchmark_1.BenchmarkRun('pool_cpu', new pool_benchmarks_1.PoolCPUBenchmark())
        ],
        params: { 'max': poolParams, 'avg': poolParams }
    });
    groups.push({
        name: 'Unary Ops: input [size, size]',
        min: 0,
        max: 1024,
        stepToSizeTransformation: function (step) { return Math.max(1, step); },
        options: [
            'log', 'exp', 'neg', 'ceil', 'floor', 'log1p', 'sqrt',
            'square', 'abs', 'relu', 'elu', 'selu', 'leakyRelu', 'prelu',
            'sigmoid', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
            'sinh', 'cosh', 'tanh', 'step'
        ],
        selectedOption: 'log',
        stepSize: 64,
        benchmarkRuns: [
            new benchmark_1.BenchmarkRun('unary ops CPU', new unary_ops_benchmark_1.UnaryOpsCPUBenchmark()),
            new benchmark_1.BenchmarkRun('unary ops GPU', new unary_ops_benchmark_1.UnaryOpsGPUBenchmark())
        ],
        params: {}
    });
    groups.push({
        name: 'Reduction Ops: input [size, size]',
        min: 0,
        max: 1024,
        stepToSizeTransformation: function (step) { return Math.max(1, step); },
        options: ['max', 'min', 'argMax', 'argMin', 'sum', 'logSumExp'],
        selectedOption: 'max',
        stepSize: 64,
        benchmarkRuns: [
            new benchmark_1.BenchmarkRun('reduction ops CPU', new reduction_ops_benchmark_1.ReductionOpsCPUBenchmark()),
            new benchmark_1.BenchmarkRun('reduction ops GPU', new reduction_ops_benchmark_1.ReductionOpsGPUBenchmark())
        ],
        params: {}
    });
    return groups;
}
exports.getRunGroups = getRunGroups;

},{"../common/batchnormalization3d_benchmark":1,"../common/benchmark":2,"../common/conv_benchmarks":4,"../common/matmul_benchmarks":5,"../common/pool_benchmarks":6,"../common/reduction_ops_benchmark":7,"../common/unary_ops_benchmark":8}],145:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],146:[function(require,module,exports){
arguments[4][143][0].apply(exports,arguments)
},{"dup":143}],147:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":145,"ieee754":148}],148:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],149:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],150:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":149,"timers":150}],151:[function(require,module,exports){
"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
exports.__esModule = true;
function PolymerElement(spec) {
    // tslint:disable-next-line:no-any
    return Polymer.Class(spec);
}
exports.PolymerElement = PolymerElement;

},{}]},{},[142,143,144,151]);
