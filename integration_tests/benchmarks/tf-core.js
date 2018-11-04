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
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.tf = global.tf || {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
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
    }

    var contexts = {};
    var WEBGL_ATTRIBUTES = {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        depth: false,
        stencil: false,
        failIfMajorPerformanceCaveat: true
    };
    function getWebGLContext(webGLVersion) {
        if (!(webGLVersion in contexts)) {
            var canvas = document.createElement('canvas');
            canvas.addEventListener('webglcontextlost', function (ev) {
                ev.preventDefault();
                delete contexts[webGLVersion];
            }, false);
            contexts[webGLVersion] = getWebGLRenderingContext(webGLVersion);
        }
        var gl = contexts[webGLVersion];
        if (gl.isContextLost()) {
            delete contexts[webGLVersion];
            return getWebGLContext(webGLVersion);
        }
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.BLEND);
        gl.disable(gl.DITHER);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.disable(gl.SAMPLE_COVERAGE);
        gl.enable(gl.SCISSOR_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        return contexts[webGLVersion];
    }
    function getWebGLRenderingContext(webGLVersion) {
        if (webGLVersion !== 1 && webGLVersion !== 2) {
            throw new Error('Cannot get WebGL rendering context, WebGL is disabled.');
        }
        var canvas = document.createElement('canvas');
        if (webGLVersion === 1) {
            return (canvas.getContext('webgl', WEBGL_ATTRIBUTES) ||
                canvas.getContext('experimental-webgl', WEBGL_ATTRIBUTES));
        }
        return canvas.getContext('webgl2', WEBGL_ATTRIBUTES);
    }

    function isMobile() {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
            .test(a) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
                .test(a.substr(0, 4));
    }

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
    function clamp(min, x, max) {
        return Math.max(min, Math.min(x, max));
    }
    function nearestLargerEven(val) {
        return val % 2 === 0 ? val : val + 1;
    }
    function sum(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }
    function randUniform(a, b) {
        var r = Math.random();
        return (b * r) + (1 - r) * a;
    }
    function distSquared(a, b) {
        var result = 0;
        for (var i = 0; i < a.length; i++) {
            var diff = Number(a[i]) - Number(b[i]);
            result += diff * diff;
        }
        return result;
    }
    function assert(expr, msg) {
        if (!expr) {
            throw new Error(typeof msg === 'string' ? msg : msg());
        }
    }
    function assertShapesMatch(shapeA, shapeB, errorMessagePrefix) {
        if (errorMessagePrefix === void 0) { errorMessagePrefix = ''; }
        assert(arraysEqual(shapeA, shapeB), errorMessagePrefix + (" Shapes " + shapeA + " and " + shapeB + " must match"));
    }
    function assertNonNull(a) {
        assert(a != null, "The input to the tensor constructor must be a non-null value.");
    }
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
    function isScalarShape(shape) {
        return shape.length === 0;
    }
    function arraysEqual(n1, n2) {
        if (n1 === n2) {
            return true;
        }
        if (n1 == null || n2 == null) {
            return false;
        }
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
    function isInt(a) {
        return a % 1 === 0;
    }
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
    function sizeToSquarishShape(size) {
        for (var a = Math.floor(Math.sqrt(size)); a > 1; --a) {
            if (size % a === 0) {
                return [a, size / a];
            }
        }
        return [1, size];
    }
    function createShuffledIndices(n) {
        var shuffledIndices = new Uint32Array(n);
        for (var i = 0; i < n; ++i) {
            shuffledIndices[i] = i;
        }
        shuffle(shuffledIndices);
        return shuffledIndices;
    }
    function rightPad(a, size) {
        if (size <= a.length) {
            return a;
        }
        return a + ' '.repeat(size - a.length);
    }
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
    function inferFromImplicitShape(shape, size) {
        var shapeProd = 1;
        var implicitIdx = -1;
        for (var i = 0; i < shape.length; ++i) {
            if (shape[i] >= 0) {
                shapeProd *= shape[i];
            }
            else if (shape[i] === -1) {
                if (implicitIdx !== -1) {
                    throw Error("Shapes can only have 1 implicit size. " +
                        ("Found -1 at dim " + implicitIdx + " and dim " + i));
                }
                implicitIdx = i;
            }
            else if (shape[i] < 0) {
                throw Error("Shapes can not be < 0. Found " + shape[i] + " at dim " + i);
            }
        }
        if (implicitIdx === -1) {
            if (size > 0 && size !== shapeProd) {
                throw Error("Size(" + size + ") must match the product of shape " + shape);
            }
            return shape;
        }
        if (shapeProd === 0) {
            throw Error("Cannot infer the missing size in [" + shape + "] when " +
                "there are 0 elements");
        }
        if (size % shapeProd !== 0) {
            throw Error("The implicit shape can't be a fractional number. " +
                ("Got " + size + " / " + shapeProd));
        }
        var newShape = shape.slice();
        newShape[implicitIdx] = size / shapeProd;
        return newShape;
    }
    function squeezeShape(shape, axis) {
        var newShape = [];
        var keptDims = [];
        var j = 0;
        for (var i = 0; i < shape.length; ++i) {
            if (axis != null) {
                if (axis[j] === i && shape[i] !== 1) {
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
            if (shape[i] !== 1) {
                newShape.push(shape[i]);
                keptDims.push(i);
            }
        }
        return { newShape: newShape, keptDims: keptDims };
    }
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
    function checkComputationForNaN(vals, dtype, name) {
        if (dtype !== 'float32') {
            return;
        }
        for (var i = 0; i < vals.length; i++) {
            if (isNaN(vals[i])) {
                throw Error("The result of the '" + name + "' has NaNs.");
            }
        }
    }
    function checkConversionForNaN(vals, dtype) {
        if (dtype === 'float32') {
            return;
        }
        for (var i = 0; i < vals.length; i++) {
            if (isNaN(vals[i])) {
                throw Error("NaN is not a valid value for dtype: '" + dtype + "'.");
            }
        }
    }
    function hasEncodingLoss(oldType, newType) {
        if (newType === 'complex64') {
            return false;
        }
        if (newType === 'float32' && oldType !== 'complex64') {
            return false;
        }
        if (newType === 'int32' && oldType !== 'float32' && oldType !== 'complex64') {
            return false;
        }
        if (newType === 'bool' && oldType === 'bool') {
            return false;
        }
        return true;
    }
    function copyTypedArray(array, dtype, debugMode) {
        if (dtype == null || dtype === 'float32' || dtype === 'complex64') {
            return new Float32Array(array);
        }
        else if (dtype === 'int32') {
            if (debugMode) {
                checkConversionForNaN(array, dtype);
            }
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
    function isTypedArray(a) {
        return a instanceof Float32Array || a instanceof Int32Array ||
            a instanceof Uint8Array;
    }
    function bytesPerElement(dtype) {
        if (dtype === 'float32' || dtype === 'int32') {
            return 4;
        }
        else if (dtype === 'complex64') {
            return 8;
        }
        else if (dtype === 'bool') {
            return 1;
        }
        else {
            throw new Error("Unknown dtype " + dtype);
        }
    }
    function isFunction(f) {
        return !!(f && f.constructor && f.call && f.apply);
    }
    function nearestDivisor(size, start) {
        for (var i = start; i < size; ++i) {
            if (size % i === 0) {
                return i;
            }
        }
        return size;
    }
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
    function toTypedArray(a, dtype, debugMode) {
        if (noConversionNeeded(a, dtype)) {
            return a;
        }
        if (Array.isArray(a)) {
            a = flatten(a);
        }
        return copyTypedArray(a, dtype, debugMode);
    }
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
    function makeZerosTypedArray(size, dtype) {
        if (dtype == null || dtype === 'float32' || dtype === 'complex64') {
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
    function now() {
        if (typeof performance !== 'undefined') {
            return performance.now();
        }
        else if (typeof process !== 'undefined') {
            var time = process.hrtime();
            return time[0] * 1000 + time[1] / 1000000;
        }
        else {
            throw new Error('Cannot measure time in this environment. You should run tf.js ' +
                'in the browser or in Node.js');
        }
    }

    var util = /*#__PURE__*/Object.freeze({
        shuffle: shuffle,
        clamp: clamp,
        nearestLargerEven: nearestLargerEven,
        sum: sum,
        randUniform: randUniform,
        distSquared: distSquared,
        assert: assert,
        assertShapesMatch: assertShapesMatch,
        assertNonNull: assertNonNull,
        flatten: flatten,
        sizeFromShape: sizeFromShape,
        isScalarShape: isScalarShape,
        arraysEqual: arraysEqual,
        isInt: isInt,
        tanh: tanh,
        sizeToSquarishShape: sizeToSquarishShape,
        createShuffledIndices: createShuffledIndices,
        rightPad: rightPad,
        repeatedTry: repeatedTry,
        inferFromImplicitShape: inferFromImplicitShape,
        squeezeShape: squeezeShape,
        getTypedArrayFromDType: getTypedArrayFromDType,
        checkComputationForNaN: checkComputationForNaN,
        checkConversionForNaN: checkConversionForNaN,
        hasEncodingLoss: hasEncodingLoss,
        isTypedArray: isTypedArray,
        bytesPerElement: bytesPerElement,
        isFunction: isFunction,
        nearestDivisor: nearestDivisor,
        computeStrides: computeStrides,
        toTypedArray: toTypedArray,
        makeOnesTypedArray: makeOnesTypedArray,
        makeZerosTypedArray: makeZerosTypedArray,
        now: now
    });

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
            var results = Array.isArray(result) ? result : [result];
            results.forEach(function (r) {
                var vals = r.dataSync();
                checkComputationForNaN(vals, r.dtype, name);
                timer.then(function (timing) {
                    var extraInfo = '';
                    if (timing.getExtraProfileInfo != null) {
                        extraInfo = timing.getExtraProfileInfo();
                    }
                    _this.logger.logKernelProfile(name, r, vals, timing.kernelMs, extraInfo);
                });
            });
            return result;
        };
        return Profiler;
    }());
    var Logger = (function () {
        function Logger() {
        }
        Logger.prototype.logKernelProfile = function (name, result, vals, timeMs, extraInfo) {
            var time = rightPad(timeMs + "ms", 9);
            var paddedName = rightPad(name, 25);
            var rank = result.rank;
            var size = result.size;
            var shape = rightPad(result.shape.toString(), 14);
            console.log("%c" + paddedName + "\t%c" + time + "\t%c" + rank + "D " + shape + "\t%c" + size + "\t%c" + extraInfo, 'font-weight:bold', 'color:red', 'color:blue', 'color: orange', 'color: green');
        };
        return Logger;
    }());

    var FORMAT_LIMIT_NUM_VALS = 20;
    var FORMAT_NUM_FIRST_LAST_VALS = 3;
    var FORMAT_NUM_SIG_DIGITS = 7;
    function tensorToString(vals, shape, dtype, verbose) {
        var strides = computeStrides(shape);
        var padPerCol = computeMaxSizePerColumn(vals, shape, dtype, strides);
        var rank = shape.length;
        var valsLines = subTensorToString(vals, shape, dtype, strides, padPerCol);
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
    function computeMaxSizePerColumn(vals, shape, dtype, strides) {
        var n = sizeFromShape(shape);
        var numCols = strides[strides.length - 1];
        var padPerCol = new Array(numCols).fill(0);
        var rank = shape.length;
        var valuesOrTuples = dtype === 'complex64' ? createComplexTuples(vals) : vals;
        if (rank > 1) {
            for (var row = 0; row < n / numCols; row++) {
                var offset = row * numCols;
                for (var j = 0; j < numCols; j++) {
                    padPerCol[j] = Math.max(padPerCol[j], valToString(valuesOrTuples[offset + j], 0).length);
                }
            }
        }
        return padPerCol;
    }
    function valToString(val, pad) {
        var valStr;
        if (Array.isArray(val)) {
            valStr = parseFloat(val[0].toFixed(FORMAT_NUM_SIG_DIGITS)) + " + " +
                (parseFloat(val[1].toFixed(FORMAT_NUM_SIG_DIGITS)) + "j");
        }
        else {
            valStr = parseFloat(val.toFixed(FORMAT_NUM_SIG_DIGITS)).toString();
        }
        return rightPad(valStr, pad);
    }
    function subTensorToString(vals, shape, dtype, strides, padPerCol, isLast) {
        if (isLast === void 0) { isLast = true; }
        var storagePerElement = dtype === 'complex64' ? 2 : 1;
        var size = shape[0];
        var rank = shape.length;
        if (rank === 0) {
            if (dtype === 'complex64') {
                var complexTuple = createComplexTuples(vals);
                return [valToString(complexTuple[0], 0)];
            }
            return [vals[0].toString()];
        }
        if (rank === 1) {
            if (size > FORMAT_LIMIT_NUM_VALS) {
                var firstValsSize = FORMAT_NUM_FIRST_LAST_VALS * storagePerElement;
                var firstVals = Array.from(vals.subarray(0, firstValsSize));
                var lastVals = Array.from(vals.subarray(size - FORMAT_NUM_FIRST_LAST_VALS * storagePerElement, size));
                if (dtype === 'complex64') {
                    firstVals = createComplexTuples(firstVals);
                    lastVals = createComplexTuples(lastVals);
                }
                return [
                    '[' + firstVals.map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                        ', ..., ' +
                        lastVals
                            .map(function (x, i) { return valToString(x, padPerCol[size - FORMAT_NUM_FIRST_LAST_VALS + i]); })
                            .join(', ') +
                        ']'
                ];
            }
            var displayVals = dtype === 'complex64' ? createComplexTuples(vals) : Array.from(vals);
            return [
                '[' + displayVals.map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                    ']'
            ];
        }
        var subshape = shape.slice(1);
        var substrides = strides.slice(1);
        var stride = strides[0] * storagePerElement;
        var lines = [];
        if (size > FORMAT_LIMIT_NUM_VALS) {
            for (var i = 0; i < FORMAT_NUM_FIRST_LAST_VALS; i++) {
                var start = i * stride;
                var end = start + stride;
                lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, dtype, substrides, padPerCol, false));
            }
            lines.push('...');
            for (var i = size - FORMAT_NUM_FIRST_LAST_VALS; i < size; i++) {
                var start = i * stride;
                var end = start + stride;
                lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, dtype, substrides, padPerCol, i === size - 1));
            }
        }
        else {
            for (var i = 0; i < size; i++) {
                var start = i * stride;
                var end = start + stride;
                lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, dtype, substrides, padPerCol, i === size - 1));
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
    function createComplexTuples(vals) {
        var complexTuples = [];
        for (var i = 0; i < vals.length; i += 2) {
            complexTuples.push([vals[i], vals[i + 1]]);
        }
        return complexTuples;
    }

    var TensorBuffer = (function () {
        function TensorBuffer(shape, dtype, values) {
            this.dtype = dtype;
            this.shape = shape.slice();
            this.size = sizeFromShape(shape);
            if (values != null) {
                var n = values.length;
                assert(n === this.size, "Length of values '" + n + "' does not match the size " +
                    ("inferred by the shape '" + this.size + "'."));
            }
            if (dtype === 'complex64') {
                throw new Error("complex64 dtype TensorBuffers are not supported. Please create " +
                    "a TensorBuffer for the real and imaginary parts separately and " +
                    "call tf.complex(real, imag).");
            }
            this.values = values ||
                getTypedArrayFromDType(dtype, sizeFromShape(this.shape));
            this.strides = computeStrides(shape);
        }
        TensorBuffer.prototype.set = function (value) {
            var locs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                locs[_i - 1] = arguments[_i];
            }
            if (locs.length === 0) {
                locs = [0];
            }
            assert(locs.length === this.rank, "The number of provided coordinates (" + locs.length + ") must " +
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
        return TensorBuffer;
    }());
    var trackerFn = null;
    var opHandler = null;
    function setTensorTracker(fn) {
        trackerFn = fn;
    }
    function setOpHandler(handler) {
        opHandler = handler;
    }
    var Tensor = (function () {
        function Tensor(shape, dtype, values, dataId) {
            this.isDisposedInternal = false;
            this.shape = shape.slice();
            this.dtype = dtype || 'float32';
            this.size = sizeFromShape(shape);
            if (values != null) {
                assert(this.size === values.length, "Based on the provided shape, [" + shape + "], and dtype " +
                    (this.dtype + ", the tensor should have ") +
                    (this.size + " values but has " + values.length));
            }
            this.strides = computeStrides(shape);
            this.dataId = dataId != null ? dataId : {};
            this.id = trackerFn().nextTensorId();
            this.rankType = (this.rank < 5 ? this.rank.toString() : 'higher');
            trackerFn().registerTensor(this);
            if (values != null) {
                trackerFn().write(this.dataId, values);
            }
        }
        Tensor.make = function (shape, data, dtype) {
            return new Tensor(shape, dtype, data.values, data.dataId);
        };
        Tensor.prototype.flatten = function () {
            this.throwIfDisposed();
            return this.as1D();
        };
        Tensor.prototype.asScalar = function () {
            this.throwIfDisposed();
            assert(this.size === 1, 'The array must have only 1 element.');
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
            assert(locs.length === this.rank, 'Number of coordinates in get() must match the rank of the tensor');
            assert(this.dtype !== 'complex64', 'Tensor.get() is not supported for complex64 tensors yet.');
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
            return tensorToString(vals, this.shape, this.dtype, verbose);
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
        Tensor.prototype.split = function (numOrSizeSplits, axis) {
            if (axis === void 0) { axis = 0; }
            this.throwIfDisposed();
            return opHandler.split(this, numOrSizeSplits, axis);
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
        Tensor.prototype.prod = function (axis, keepDims) {
            if (axis === void 0) { axis = null; }
            if (keepDims === void 0) { keepDims = false; }
            this.throwIfDisposed();
            return opHandler.prod(this, axis, keepDims);
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
        Tensor.prototype.atan2 = function (x) {
            this.throwIfDisposed();
            return opHandler.atan2(this, x);
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
        Tensor.prototype.zerosLike = function () {
            this.throwIfDisposed();
            return opHandler.zerosLike(this);
        };
        Tensor.prototype.onesLike = function () {
            this.throwIfDisposed();
            return opHandler.onesLike(this);
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
        Tensor.prototype.separableConv2d = function (depthwiseFilter, pointwiseFilter, strides, pad, dilation, dataFormat) {
            if (dilation === void 0) { dilation = [1, 1]; }
            if (dataFormat === void 0) { dataFormat = 'NHWC'; }
            this.throwIfDisposed();
            return opHandler.separableConv2d(this, depthwiseFilter, pointwiseFilter, strides, pad, dilation, dataFormat);
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
        Tensor.prototype.pool = function (windowShape, poolingType, padding, dilationRate, strides) {
            this.throwIfDisposed();
            return opHandler.pool(this, windowShape, poolingType, padding, dilationRate, strides);
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
        Tensor.prototype.batchToSpaceND = function (blockShape, crops) {
            this.throwIfDisposed();
            return opHandler.batchToSpaceND(this, blockShape, crops);
        };
        Tensor.prototype.spaceToBatchND = function (blockShape, paddings) {
            this.throwIfDisposed();
            return opHandler.spaceToBatchND(this, blockShape, paddings);
        };
        Tensor.prototype.topk = function (k, sorted) {
            if (k === void 0) { k = 1; }
            if (sorted === void 0) { sorted = true; }
            this.throwIfDisposed();
            return opHandler.topk(this, k, sorted);
        };
        Tensor.prototype.stridedSlice = function (begin, end, strides, beginMask, endMask) {
            if (beginMask === void 0) { beginMask = 0; }
            if (endMask === void 0) { endMask = 0; }
            this.throwIfDisposed();
            return opHandler.stridedSlice(this, begin, end, strides, beginMask, endMask);
        };
        Tensor.prototype.depthToSpace = function (blockSize, dataFormat) {
            this.throwIfDisposed();
            return opHandler.depthToSpace(this, blockSize, dataFormat);
        };
        Tensor.prototype.fft = function () {
            this.throwIfDisposed();
            return opHandler.spectral.fft(this);
        };
        Tensor.prototype.ifft = function () {
            this.throwIfDisposed();
            return opHandler.spectral.ifft(this);
        };
        return Tensor;
    }());
    Object.defineProperty(Tensor, Symbol.hasInstance, {
        value: function (instance) {
            return !!instance && instance.shape != null && instance.dtype != null;
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
                _this.name = trackerFn().nextVariableId().toString();
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
        Variable.variable = function (initialValue, trainable, name, dtype) {
            if (trainable === void 0) { trainable = true; }
            if (dtype != null && dtype !== initialValue.dtype) {
                initialValue = initialValue.asType(dtype);
            }
            return new Variable(initialValue, trainable, name);
        };
        Variable.prototype.assign = function (newValue) {
            if (newValue.dtype !== this.dtype) {
                throw new Error("dtype of the new value (" + newValue.dtype + ") and " +
                    ("previous value (" + this.dtype + ") must match"));
            }
            if (!arraysEqual(newValue.shape, this.shape)) {
                throw new Error("shape of the new value (" + newValue.shape + ") and " +
                    ("previous value (" + this.shape + ") must match"));
            }
            trackerFn().disposeTensor(this);
            this.dataId = newValue.dataId;
            trackerFn().registerTensor(this);
        };
        return Variable;
    }(Tensor));
    Object.defineProperty(Variable, Symbol.hasInstance, {
        value: function (instance) {
            return instance instanceof Tensor && instance.assign != null &&
                instance.assign instanceof Function;
        }
    });
    var variable = Variable.variable;

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
                        node.outputs.forEach(function (output) { return tensorsFromX[output.id] = true; });
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
            for (var j = 0; j < node.outputs.length; j++) {
                if (tensorsLeadToY[node.outputs[j].id]) {
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
                prunedNode.outputs = node.outputs;
                filteredTape.push(prunedNode);
            }
        }
        return filteredTape;
    }
    function backpropagateGradients(tensorAccumulatedGradientMap, filteredTape) {
        var _loop_1 = function (i) {
            var node = filteredTape[i];
            var dys = [];
            node.outputs.forEach(function (o) {
                var gradTensor = tensorAccumulatedGradientMap[o.id];
                if (gradTensor != null) {
                    dys.push(gradTensor);
                }
                else {
                    var dy = Tensor.make(o.shape, { values: makeZerosTypedArray(o.size, o.dtype) }, o.dtype);
                    dys.push(dy);
                }
            });
            if (node.gradient == null) {
                throw new Error("Cannot compute gradient: gradient function not found " +
                    ("for " + node.name + "."));
            }
            var inputGradients = node.gradient(node.outputs.length === 1 ? dys[0] : dys);
            for (var inputName in node.inputs) {
                if (!(inputName in inputGradients)) {
                    throw new Error("Cannot backprop through input " + inputName + ". " +
                        ("Available gradients found: " + Object.keys(inputGradients) + "."));
                }
                var dx = inputGradients[inputName]();
                var x = node.inputs[inputName];
                if (!arraysEqual(dx.shape, x.shape)) {
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
        };
        for (var i = filteredTape.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
    }

    function assertTypesMatch(a, b) {
        assert(a.dtype === b.dtype, "The dtypes of the first(" + a.dtype + ") and" +
            (" second(" + b.dtype + ") input must match"));
    }
    function isTensorInList(tensor, tensorList) {
        for (var i = 0; i < tensorList.length; i++) {
            if (tensorList[i].id === tensor.id) {
                return true;
            }
        }
        return false;
    }
    function getTensorsInContainer(result) {
        var list = [];
        var seen = new Set();
        walkTensorContainer(result, list, seen);
        return list;
    }
    function walkTensorContainer(container, list, seen) {
        if (container == null) {
            return;
        }
        if (container instanceof Tensor) {
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

    var Engine = (function () {
        function Engine(backend, safeMode, debugMode) {
            this.backend = backend;
            this.safeMode = safeMode;
            this.debugMode = debugMode;
            this.registeredVariables = {};
            this.nextTapeNodeId = 0;
            this.numBytes = 0;
            this.numTensors = 0;
            this.numDataBuffers = 0;
            this.profiling = false;
            this.gradientScopeCount = 0;
            this.customGradientDepth = 0;
            this.keepTensors = new Set();
            this.tensorInfo = new WeakMap();
            this.activeScope = { track: [], name: 'default scope' };
            this.scopeStack = [this.activeScope];
            this.profiler = new Profiler(backend);
            this.activeProfile =
                { newBytes: 0, newTensors: 0, peakBytes: 0, kernels: [], result: null };
        }
        Engine.prototype.moveData = function (dataId) {
            this.write(dataId, this.readSync(dataId));
        };
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
        Engine.prototype.nextTensorId = function () {
            return Engine.nextTensorId++;
        };
        Engine.prototype.nextVariableId = function () {
            return Engine.nextVariableId++;
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
            var startingBytecount = this.numBytes;
            var startingNumTensors = this.numTensors;
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
                    outputs: Array.isArray(result) ? result : [result]
                };
                if (backwardsFunc != null) {
                    tapeNode.gradient =
                        (function (dy) { return backwardsFunc(dy, saved); });
                }
                this.activeTape.push(tapeNode);
            }
            if (this.profiling) {
                this.activeProfile.kernels.push({
                    name: scopeName,
                    bytesAdded: this.numBytes - startingBytecount,
                    totalBytesSnapshot: this.numBytes,
                    tensorsAdded: this.numTensors - startingNumTensors,
                    totalTensorsSnapshot: this.numTensors,
                    inputShapes: Object.keys(inputs).map(function (key) { return inputs[key].shape; }),
                    outputShape: Array.isArray(result) ?
                        result.map(function (item) { return item.shape; }) :
                        result.shape
                });
            }
            return result;
        };
        Engine.prototype.registerTensor = function (a) {
            var refCount = this.tensorInfo.has(a.dataId) ?
                this.tensorInfo.get(a.dataId).refCount :
                0;
            this.numTensors++;
            if (refCount === 0) {
                this.numDataBuffers++;
                if (a.dtype !== 'complex64') {
                    this.numBytes +=
                        sizeFromShape(a.shape) * bytesPerElement(a.dtype);
                }
                this.tensorInfo.set(a.dataId, { backend: this.backend, dtype: a.dtype, shape: a.shape, refCount: 0 });
                this.backend.register(a.dataId, a.shape, a.dtype);
            }
            this.tensorInfo.get(a.dataId).refCount++;
            if (!(a instanceof Variable)) {
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
            if (!this.tensorInfo.has(a.dataId)) {
                return;
            }
            if (this.keepTensors.has(a.id)) {
                this.keepTensors.delete(a.id);
            }
            this.numTensors--;
            var refCount = this.tensorInfo.get(a.dataId).refCount;
            if (refCount <= 1) {
                var info = this.tensorInfo.get(a.dataId);
                info.backend.disposeData(a.dataId);
                this.numDataBuffers--;
                if (a.dtype !== 'complex64') {
                    this.numBytes -=
                        sizeFromShape(a.shape) * bytesPerElement(a.dtype);
                }
                this.tensorInfo.delete(a.dataId);
            }
            else {
                this.tensorInfo.get(a.dataId).refCount--;
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
        Engine.prototype.profile = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var startBytes, startNumTensors;
                return __generator(this, function (_a) {
                    this.profiling = true;
                    startBytes = this.numBytes;
                    startNumTensors = this.numTensors;
                    this.activeProfile.kernels = [];
                    this.activeProfile.result = query();
                    this.profiling = false;
                    this.activeProfile.peakBytes = Math.max.apply(Math, this.activeProfile.kernels.map(function (d) { return d.totalBytesSnapshot; }));
                    this.activeProfile.newBytes = this.numBytes - startBytes;
                    this.activeProfile.newTensors = this.numTensors - startNumTensors;
                    return [2, this.activeProfile];
                });
            });
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
                outputs: [result],
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
            var tensorsToTrackInParent = getTensorsInContainer(result);
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
                    isTensorInList(tensor, oldScope.track)) {
                    _this.track(tensor);
                }
            });
        };
        Engine.prototype.gradients = function (f, xs, dy, allowNoGradients) {
            var _this = this;
            if (allowNoGradients === void 0) { allowNoGradients = false; }
            assert(xs.length > 0, 'gradients() received an empty list of xs.');
            return this.tidy('gradients', function () {
                var y = f();
                assert(y instanceof Tensor, 'The result y returned by f() must be a tensor.');
                var filteredTape = getFilteredNodesXToY(_this.activeTape, xs, y);
                if (!allowNoGradients && filteredTape.length === 0 && xs.length > 0) {
                    throw new Error('Cannot compute gradient of y=f(x) with respect to x. Make sure ' +
                        'that the f you passed encloses all operations that lead from x ' +
                        'to y.');
                }
                var accumulatedGradientMap = {};
                accumulatedGradientMap[y.id] = (dy == null) ? ones(y.shape) : dy;
                backpropagateGradients(accumulatedGradientMap, filteredTape);
                var grads = xs.map(function (x) { return accumulatedGradientMap[x.id]; });
                return { value: y, grads: grads };
            }, true);
        };
        Engine.prototype.customGrad = function (f) {
            var _this = this;
            assert(isFunction(f), 'The f passed in customGrad(f) must be a function.');
            return function () {
                var inputs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    inputs[_i] = arguments[_i];
                }
                assert(inputs.every(function (t) { return t instanceof Tensor; }), 'The args passed in customGrad(f)(x1, x2,...) must all be tensors');
                var gradientsFunc;
                var result;
                _this.scopedRun(function () { return _this.customGradientDepth++; }, function () { return _this.customGradientDepth--; }, function () {
                    var gradientsMode = true;
                    result = _this.tidy(f.name, function () {
                        var _a = f.apply(void 0, inputs), value = _a.value, gradFunc = _a.gradFunc;
                        assert(value instanceof Tensor, 'The function f passed in customGrad(f) must return an ' +
                            'object where `obj.value` is a tensor');
                        assert(isFunction(gradFunc), 'The function f passed in customGrad(f) must return an ' +
                            'object where `obj.gradFunc` is a function.');
                        gradientsFunc = gradFunc;
                        return value;
                    }, gradientsMode);
                });
                if (_this.shouldRecord()) {
                    var gradFunc = function (dy) {
                        var res = gradientsFunc(dy);
                        var grads = Array.isArray(res) ? res : [res];
                        assert(grads.length === inputs.length, 'The function f passed in customGrad(f) must return an object ' +
                            'where `obj.gradFunc` is a function that returns the same ' +
                            'number of tensors as inputs passed to f(...).');
                        assert(grads.every(function (t) { return t instanceof Tensor; }), 'The function f passed in customGrad(f) must return an object ' +
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
            var info = this.tensorInfo.get(dataId);
            if (this.backend !== info.backend) {
                info.backend.disposeData(dataId);
                info.backend = this.backend;
                this.backend.register(dataId, info.shape, info.dtype);
            }
            this.backend.write(dataId, values);
        };
        Engine.prototype.readSync = function (dataId) {
            var info = this.tensorInfo.get(dataId);
            return info.backend.readSync(dataId);
        };
        Engine.prototype.read = function (dataId) {
            var info = this.tensorInfo.get(dataId);
            return info.backend.read(dataId);
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
                            start = now();
                            return [4, this.backend.time(query)];
                        case 1:
                            timingInfo = _a.sent();
                            timingInfo.wallMs = now() - start;
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
        Engine.nextTensorId = 0;
        Engine.nextVariableId = 0;
        return Engine;
    }());
    function ones(shape) {
        var values = makeOnesTypedArray(sizeFromShape(shape), 'float32');
        return Tensor.make(shape, { values: values });
    }

    var Type;
    (function (Type) {
        Type[Type["NUMBER"] = 0] = "NUMBER";
        Type[Type["BOOLEAN"] = 1] = "BOOLEAN";
        Type[Type["STRING"] = 2] = "STRING";
    })(Type || (Type = {}));
    var URL_PROPERTIES = [
        { name: 'DEBUG', type: Type.BOOLEAN },
        { name: 'IS_BROWSER', type: Type.BOOLEAN },
        { name: 'WEBGL_PACK_BATCHNORMALIZATION', type: Type.BOOLEAN },
        { name: 'WEBGL_CONV_IM2COL', type: Type.BOOLEAN },
        { name: 'WEBGL_MAX_TEXTURE_SIZE', type: Type.NUMBER },
        { name: 'WEBGL_PAGING_ENABLED', type: Type.BOOLEAN },
        { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', type: Type.NUMBER },
        { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', type: Type.BOOLEAN },
        { name: 'WEBGL_VERSION', type: Type.NUMBER },
        { name: 'WEBGL_RENDER_FLOAT32_ENABLED', type: Type.BOOLEAN },
        { name: 'WEBGL_DOWNLOAD_FLOAT_ENABLED', type: Type.BOOLEAN },
        { name: 'WEBGL_FENCE_API_ENABLED', type: Type.BOOLEAN },
        { name: 'WEBGL_SIZE_UPLOAD_UNIFORM', type: Type.NUMBER },
        { name: 'BACKEND', type: Type.STRING },
        { name: 'EPSILON', type: Type.NUMBER },
        { name: 'PROD', type: Type.BOOLEAN },
        { name: 'TENSORLIKE_CHECK_SHAPE_CONSISTENCY', type: Type.BOOLEAN },
    ];
    function isWebGLVersionEnabled(webGLVersion) {
        try {
            var gl = getWebGLContext(webGLVersion);
            if (gl != null) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }
    var MAX_TEXTURE_SIZE;
    function getWebGLMaxTextureSize(webGLVersion) {
        if (MAX_TEXTURE_SIZE == null) {
            var gl = getWebGLContext(webGLVersion);
            MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }
        return MAX_TEXTURE_SIZE;
    }
    function getWebGLDisjointQueryTimerVersion(webGLVersion) {
        if (webGLVersion === 0) {
            return 0;
        }
        var queryTimerVersion;
        var gl = getWebGLContext(webGLVersion);
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
        return queryTimerVersion;
    }
    function isRenderToFloatTextureEnabled(webGLVersion) {
        if (webGLVersion === 0) {
            return false;
        }
        var gl = getWebGLContext(webGLVersion);
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
        var isFrameBufferComplete = createFloatTextureAndBindToFramebuffer(gl, webGLVersion);
        return isFrameBufferComplete;
    }
    function isDownloadFloatTextureEnabled(webGLVersion) {
        if (webGLVersion === 0) {
            return false;
        }
        var gl = getWebGLContext(webGLVersion);
        if (webGLVersion === 1) {
            if (!hasExtension(gl, 'OES_texture_float')) {
                return false;
            }
            if (!hasExtension(gl, 'WEBGL_color_buffer_float')) {
                return false;
            }
        }
        else {
            if (!hasExtension(gl, 'EXT_color_buffer_float')) {
                return false;
            }
        }
        var isFrameBufferComplete = createFloatTextureAndBindToFramebuffer(gl, webGLVersion);
        return isFrameBufferComplete;
    }
    function isWebGLFenceEnabled(webGLVersion) {
        if (webGLVersion !== 2) {
            return false;
        }
        var gl = getWebGLContext(webGLVersion);
        var isEnabled = gl.fenceSync != null;
        return isEnabled;
    }
    function isChrome() {
        return typeof navigator !== 'undefined' && navigator != null &&
            navigator.userAgent != null && /Chrome/.test(navigator.userAgent) &&
            /Google Inc/.test(navigator.vendor);
    }
    var TENSORFLOWJS_FLAGS_PREFIX = 'tfjsflags';
    function getFeaturesFromURL() {
        var features = {};
        if (typeof window === 'undefined' || typeof window.location === 'undefined') {
            return features;
        }
        var urlParams = getQueryParams(window.location.search);
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
    function hasExtension(gl, extensionName) {
        var ext = gl.getExtension(extensionName);
        return ext != null;
    }
    function createFloatTextureAndBindToFramebuffer(gl, webGLVersion) {
        var frameBuffer = gl.createFramebuffer();
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var internalFormat = webGLVersion === 2 ? gl.RGBA32F : gl.RGBA;
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        var isFrameBufferComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(frameBuffer);
        return isFrameBufferComplete;
    }
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
    function decodeParam(params, name, value) {
        params[decodeURIComponent(name)] = decodeURIComponent(value || '');
    }

    var EPSILON_FLOAT16 = 1e-3;
    var TEST_EPSILON_FLOAT16 = 1e-1;
    var EPSILON_FLOAT32 = 1e-7;
    var TEST_EPSILON_FLOAT32 = 1e-3;
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
        Environment.setBackend = function (backendName, safeMode) {
            if (safeMode === void 0) { safeMode = false; }
            if (!(backendName in ENV.registry)) {
                throw new Error("Backend name '" + backendName + "' not found in registry");
            }
            ENV.engine.backend = ENV.findBackend(backendName);
            ENV.backendName = backendName;
        };
        Environment.getBackend = function () {
            ENV.initEngine();
            return ENV.backendName;
        };
        Environment.disposeVariables = function () {
            ENV.engine.disposeVariables();
        };
        Environment.memory = function () {
            return ENV.engine.memory();
        };
        Environment.profile = function (f) {
            return ENV.engine.profile(f);
        };
        Environment.tidy = function (nameOrFn, fn, gradMode) {
            if (gradMode === void 0) { gradMode = false; }
            return ENV.engine.tidy(nameOrFn, fn, gradMode);
        };
        Environment.dispose = function (container) {
            var tensors = getTensorsInContainer(container);
            tensors.forEach(function (tensor) { return tensor.dispose(); });
        };
        Environment.keep = function (result) {
            return ENV.engine.keep(result);
        };
        Environment.time = function (f) {
            return ENV.engine.time(f);
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
        Environment.prototype.getBestBackendName = function () {
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
                return isChrome();
            }
            else if (feature === 'WEBGL_PACK_BATCHNORMALIZATION') {
                return false;
            }
            else if (feature === 'WEBGL_CONV_IM2COL') {
                return false;
            }
            else if (feature === 'WEBGL_PAGING_ENABLED') {
                return this.get('IS_BROWSER') && !this.get('PROD');
            }
            else if (feature === 'WEBGL_MAX_TEXTURE_SIZE') {
                return getWebGLMaxTextureSize(this.get('WEBGL_VERSION'));
            }
            else if (feature === 'IS_TEST') {
                return false;
            }
            else if (feature === 'BACKEND') {
                return this.getBestBackendName();
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
                    !isMobile();
            }
            else if (feature === 'HAS_WEBGL') {
                return this.get('WEBGL_VERSION') > 0;
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
            else if (feature === 'WEBGL_RENDER_FLOAT32_ENABLED') {
                return isRenderToFloatTextureEnabled(this.get('WEBGL_VERSION'));
            }
            else if (feature === 'WEBGL_DOWNLOAD_FLOAT_ENABLED') {
                return isDownloadFloatTextureEnabled(this.get('WEBGL_VERSION'));
            }
            else if (feature === 'WEBGL_FENCE_API_ENABLED') {
                return isWebGLFenceEnabled(this.get('WEBGL_VERSION'));
            }
            else if (feature === 'WEBGL_SIZE_UPLOAD_UNIFORM') {
                var useUniforms = this.get('WEBGL_RENDER_FLOAT32_ENABLED');
                return useUniforms ? 4 : 0;
            }
            else if (feature === 'TEST_EPSILON') {
                return this.backend.floatPrecision() === 32 ? TEST_EPSILON_FLOAT32 :
                    TEST_EPSILON_FLOAT16;
            }
            else if (feature === 'EPSILON') {
                return this.backend.floatPrecision() === 32 ? EPSILON_FLOAT32 :
                    EPSILON_FLOAT16;
            }
            else if (feature === 'PROD') {
                return false;
            }
            else if (feature === 'TENSORLIKE_CHECK_SHAPE_CONSISTENCY') {
                return !this.get('PROD');
            }
            throw new Error("Unknown feature " + feature + ".");
        };
        Environment.prototype.setFeatures = function (features) {
            this.features = Object.assign({}, features);
        };
        Environment.prototype.reset = function () {
            this.features = getFeaturesFromURL();
            if (this.globalEngine != null) {
                this.globalEngine = null;
            }
        };
        Object.defineProperty(Environment.prototype, "backend", {
            get: function () {
                return this.engine.backend;
            },
            enumerable: true,
            configurable: true
        });
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
                backend.setDataMover({ moveData: function (dataId) { return _this.engine.moveData(dataId); } });
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
                this.initEngine();
                return this.globalEngine;
            },
            enumerable: true,
            configurable: true
        });
        Environment.prototype.initEngine = function () {
            var _this = this;
            if (this.globalEngine == null) {
                this.backendName = this.get('BACKEND');
                var backend = this.findBackend(this.backendName);
                this.globalEngine =
                    new Engine(backend, false, function () { return _this.get('DEBUG'); });
            }
        };
        return Environment;
    }());
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
            ns.ENV = new Environment(getFeaturesFromURL());
            setTensorTracker(function () { return ns.ENV.engine; });
        }
        return ns.ENV;
    }
    var ENV = getOrMakeEnvironment();

    var environment = /*#__PURE__*/Object.freeze({
        Environment: Environment,
        ENV: ENV
    });

    function grad(f) {
        assert(isFunction(f), 'The f passed in grad(f) must be a function');
        return function (x, dy) {
            assert(x instanceof Tensor, 'The x passed in grad(f)(x) must be a tensor');
            assert(dy == null || dy instanceof Tensor, 'The dy passed in grad(f)(x, dy) must be a tensor');
            return ENV.engine.tidy(function () {
                var _a = ENV.engine.gradients(function () { return f(x); }, [x], dy), value = _a.value, grads = _a.grads;
                if (dy != null) {
                    assertShapesMatch(value.shape, dy.shape, 'The shape of dy passed in grad(f)(x, dy) must match the shape ' +
                        'returned by f(x)');
                }
                checkGrads(grads);
                return grads[0];
            });
        };
    }
    function grads(f) {
        assert(isFunction(f), 'The f passed in grads(f) must be a function');
        return function (args, dy) {
            assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof Tensor; }), 'The args passed in grads(f)(args) must be an array of tensors');
            assert(dy == null || dy instanceof Tensor, 'The dy passed in grads(f)(args, dy) must be a tensor');
            return ENV.engine.tidy(function () {
                var _a = ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy), value = _a.value, grads = _a.grads;
                if (dy != null) {
                    assertShapesMatch(value.shape, dy.shape, 'The shape of dy passed in grads(f)([x1,...], dy) must ' +
                        'match the shape returned by f([x1,...])');
                }
                checkGrads(grads);
                return grads;
            });
        };
    }
    function valueAndGrad(f) {
        assert(isFunction(f), 'The f passed in valueAndGrad(f) must be a function');
        return function (x, dy) {
            assert(x instanceof Tensor, 'The x passed in valueAndGrad(f)(x) must be a tensor');
            assert(dy == null || dy instanceof Tensor, 'The dy passed in valueAndGrad(f)(x, dy) must be a tensor');
            var _a = ENV.engine.gradients(function () { return f(x); }, [x], dy), grads = _a.grads, value = _a.value;
            checkGrads(grads);
            return { grad: grads[0], value: value };
        };
    }
    function valueAndGrads(f) {
        assert(isFunction(f), 'The f passed in valueAndGrads(f) must be a function');
        return function (args, dy) {
            assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof Tensor; }), 'The args passed in valueAndGrads(f)(args) must be array of tensors');
            assert(dy == null || dy instanceof Tensor, 'The dy passed in valueAndGrads(f)(args, dy) must be a tensor');
            var res = ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy);
            if (dy != null) {
                assertShapesMatch(res.value.shape, dy.shape, 'The shape of dy passed in valueAndGrads(f)([x1,...], dy) must ' +
                    'match the shape returned by f([x1,...])');
            }
            checkGrads(res.grads);
            return res;
        };
    }
    function variableGrads(f, varList) {
        assert(isFunction(f), 'The f passed in variableGrads(f) must be a function');
        assert(varList == null ||
            Array.isArray(varList) && varList.every(function (v) { return v instanceof Variable; }), 'The varList passed in variableGrads(f, varList) must be an array ' +
            'of variables');
        if (varList == null) {
            varList = [];
            for (var varName in ENV.engine.registeredVariables) {
                varList.push(ENV.engine.registeredVariables[varName]);
            }
        }
        var originalVarCount = varList.length;
        varList = varList.filter(function (variable$$1) { return variable$$1.trainable; });
        assert(varList.length > 0, "variableGrads() expects at least one of the input variables to be " +
            ("trainable, but none of the " + originalVarCount + " variables is ") +
            "trainable.");
        var allowNoGradients = true;
        var _a = ENV.engine.gradients(f, varList, null, allowNoGradients), value = _a.value, grads = _a.grads;
        assert(grads.some(function (g) { return g != null; }), 'Cannot find a connection between any variable and the result of the ' +
            'loss function y=f(x). Please make sure the operations that use ' +
            'variables are inside the function f passed to minimize().');
        assert(value.rank === 0, "The f passed in variableGrads(f) must return a scalar, but it " +
            ("returned a rank-" + value.rank + " tensor"));
        var namedGrads = {};
        varList.forEach(function (v, i) {
            if (grads[i] != null) {
                namedGrads[v.name] = grads[i];
            }
        });
        return { value: value, grads: namedGrads };
    }
    function customGrad(f) {
        return ENV.engine.customGrad(f);
    }
    function checkGrads(grads) {
        var numNullGradients = grads.filter(function (g) { return g == null; }).length;
        if (numNullGradients > 0) {
            throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
        }
    }

    var tidy = Environment.tidy;
    var keep = Environment.keep;
    var dispose = Environment.dispose;
    var time = Environment.time;
    var profile = Environment.profile;

    function warn() {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (!ENV.get('IS_TEST')) {
            console.warn.apply(console, msg);
        }
    }

    function getReshaped(inputShape, blockShape, prod, batchToSpace) {
        if (batchToSpace === void 0) { batchToSpace = true; }
        var reshaped = [];
        if (batchToSpace) {
            reshaped = reshaped.concat(blockShape.slice(0));
            reshaped.push(inputShape[0] / prod);
            reshaped = reshaped.concat(inputShape.slice(1));
        }
        else {
            reshaped = reshaped.concat(inputShape[0]);
            var spatialLength = blockShape.length;
            for (var i = 0; i < spatialLength; ++i) {
                reshaped =
                    reshaped.concat([inputShape[i + 1] / blockShape[i], blockShape[i]]);
            }
            reshaped = reshaped.concat(inputShape.slice(spatialLength + 1));
        }
        return reshaped;
    }
    function getPermuted(reshapedRank, blockShapeRank, batchToSpace) {
        if (batchToSpace === void 0) { batchToSpace = true; }
        var permuted = [];
        if (batchToSpace) {
            permuted.push(blockShapeRank);
            for (var i = blockShapeRank + 1; i < reshapedRank; ++i) {
                if (i <= 2 * blockShapeRank) {
                    permuted.push(i);
                    permuted.push(i - (blockShapeRank + 1));
                }
                else {
                    permuted.push(i);
                }
            }
        }
        else {
            var permutedBeforeBatch = [];
            var permutedAfterBatch = [];
            for (var i = 1; i < reshapedRank; ++i) {
                if (i >= blockShapeRank * 2 + 1 || i % 2 === 1) {
                    permutedAfterBatch.push(i);
                }
                else {
                    permutedBeforeBatch.push(i);
                }
            }
            permuted.push.apply(permuted, permutedBeforeBatch);
            permuted.push(0);
            permuted.push.apply(permuted, permutedAfterBatch);
        }
        return permuted;
    }
    function getReshapedPermuted(inputShape, blockShape, prod, batchToSpace) {
        if (batchToSpace === void 0) { batchToSpace = true; }
        var reshapedPermuted = [];
        if (batchToSpace) {
            reshapedPermuted.push(inputShape[0] / prod);
        }
        else {
            reshapedPermuted.push(inputShape[0] * prod);
        }
        for (var i = 1; i < inputShape.length; ++i) {
            if (i <= blockShape.length) {
                if (batchToSpace) {
                    reshapedPermuted.push(blockShape[i - 1] * inputShape[i]);
                }
                else {
                    reshapedPermuted.push(inputShape[i] / blockShape[i - 1]);
                }
            }
            else {
                reshapedPermuted.push(inputShape[i]);
            }
        }
        return reshapedPermuted;
    }
    function getSliceBeginCoords(crops, blockShape) {
        var sliceBeginCoords = [0];
        for (var i = 0; i < blockShape; ++i) {
            sliceBeginCoords.push(crops[i][0]);
        }
        return sliceBeginCoords;
    }
    function getSliceSize(uncroppedShape, crops, blockShape) {
        var sliceSize = uncroppedShape.slice(0, 1);
        for (var i = 0; i < blockShape; ++i) {
            sliceSize.push(uncroppedShape[i + 1] - crops[i][0] - crops[i][1]);
        }
        return sliceSize;
    }

    function axesAreInnerMostDims(axes, rank) {
        for (var i = 0; i < axes.length; ++i) {
            if (axes[axes.length - i - 1] !== rank - 1 - i) {
                return false;
            }
        }
        return true;
    }
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
    function expandShapeToKeepDim(shape, axes) {
        var reduceSubShape = axes.map(function (x) { return 1; });
        return combineLocations(shape, reduceSubShape, axes);
    }
    function parseAxisParam(axis, shape) {
        var rank = shape.length;
        axis = axis == null ? shape.map(function (s, i) { return i; }) : [].concat(axis);
        assert(axis.every(function (ax) { return ax >= -rank && ax < rank; }), "All values in axis param must be in range [-" + rank + ", " + rank + ") but " +
            ("got axis " + axis));
        assert(axis.every(function (ax) { return isInt(ax); }), "All values in axis param must be integers but " +
            ("got axis " + axis));
        return axis.map(function (a) { return a < 0 ? rank + a : a; });
    }
    function assertAxesAreInnerMostDims(msg, axes, rank) {
        assert(axesAreInnerMostDims(axes, rank), msg + " supports only inner-most axes for now. " +
            ("Got axes " + axes + " and rank-" + rank + " input."));
    }
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
    function getUndoAxesPermutation(axes) {
        return axes.map(function (axis, i) { return [i, axis]; })
            .sort(function (a, b) { return a[1] - b[1]; })
            .map(function (x) { return x[0]; });
    }
    function getInnerMostAxes(numAxes, rank) {
        var res = [];
        for (var i = rank - numAxes; i < rank; ++i) {
            res.push(i);
        }
        return res;
    }

    function assertParamsConsistent(shapes, axis) {
        var rank = shapes[0].length;
        shapes.forEach(function (shape, i) {
            assert(shape.length === rank, "Error in concat" + rank + "D: rank of tensors[" + i + "] must be the same " +
                ("as the rank of the rest (" + rank + ")"));
        });
        assert(axis >= 0 && axis < rank, "Error in concat" + rank + "D: axis must be between 0 and " + (rank - 1) + ".");
        var firstShape = shapes[0];
        shapes.forEach(function (shape, i) {
            for (var r = 0; r < rank; r++) {
                assert((r === axis) || (shape[r] === firstShape[r]), "Error in concat" + rank + "D: Shape of tensors[" + i + "] (" + shape + ") " +
                    ("does not match the shape of the rest (" + firstShape + ") ") +
                    ("along the non-concatenated axis " + i + "."));
            }
        });
    }
    function computeOutShape(shapes, axis) {
        var outputShape = shapes[0].slice();
        for (var i = 1; i < shapes.length; i++) {
            outputShape[axis] += shapes[i][axis];
        }
        return outputShape;
    }

    function prepareAndValidate(tensor, indices) {
        if (tensor.rank < 1) {
            throw new Error('tf.gatherND() expects the input to be rank 1 or higher,' +
                (" but the rank was " + tensor.rank + "."));
        }
        if (indices.rank < 1) {
            throw new Error('tf.gatherND() expects the indices to be rank 1 or higher,' +
                (" but the rank was " + indices.rank + "."));
        }
        if (indices.dtype !== 'int32') {
            throw new Error('tf.gatherND() expects the indices to be int32 type,' +
                (" but the dtype was " + indices.dtype + "."));
        }
        if (indices.shape[indices.rank - 1] > tensor.rank) {
            throw new Error('index innermost dimension length must be <= tensor rank; saw: ' +
                (indices.shape[indices.rank - 1] + " vs. " + tensor.rank));
        }
        if (tensor.size === 0) {
            throw new Error('Requested more than 0 entries, but input is empty.' +
                (" Input shape: " + tensor.shape + "."));
        }
        var indicesShape = indices.shape;
        var sliceRank = indicesShape[indicesShape.length - 1];
        var nResult = 1;
        for (var i = 0; i < indicesShape.length - 1; ++i) {
            nResult *= indicesShape[i];
        }
        var inputShape = tensor.shape;
        var resultShape = indicesShape.slice();
        resultShape.pop();
        var sliceSize = 1;
        for (var i = sliceRank; i < tensor.rank; ++i) {
            sliceSize *= inputShape[i];
            resultShape.push(inputShape[i]);
        }
        var strides = computeStrides(tensor.shape).map(function (stride) { return stride / sliceSize; }).concat([1]).slice(0, sliceRank);
        return [resultShape, nResult, sliceSize, strides];
    }

    var PARALLELIZE_THRESHOLD = 30;
    function computeOptimalWindowSize(inSize) {
        if (inSize <= PARALLELIZE_THRESHOLD) {
            return inSize;
        }
        return nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
    }

    function validateUpdateShape(shape, indices, updates) {
        var sliceDim = (indices.rank > 1) ? indices.shape[indices.rank - 1] : 1;
        var batchDim = (indices.rank > 1) ? indices.rank - 1 : 1;
        var shapeError = 'Must have updates.shape = indices.shape[:batchDim] + ' +
            ("shape[sliceDim:], got updates.shape: " + updates.shape) +
            (", indices.shape: " + indices.shape + ", shape: " + shape) +
            (", sliceDim: " + sliceDim + ", and batchDim: " + batchDim + ".");
        if (updates.rank < batchDim) {
            throw new Error(shapeError + (" update.rank < " + batchDim + ". "));
        }
        if (shape.length < sliceDim + (updates.rank - batchDim)) {
            throw new Error(shapeError +
                (" Output shape length < " + (sliceDim + (updates.rank - batchDim))));
        }
        if (updates.rank !== batchDim + shape.length - sliceDim) {
            throw new Error(shapeError + (" update.rank != " + (batchDim + shape.length - sliceDim)));
        }
        for (var d = 0; d < batchDim; ++d) {
            if (updates.shape[d] !== indices.shape[d]) {
                throw new Error(shapeError +
                    (" updates.shape[" + d + "] (" + updates.shape[d] + ") != indices.shape[" + d + "] (" + indices.shape[d] + ")."));
            }
        }
        for (var d = 0; d < updates.rank - batchDim; ++d) {
            if (updates.shape[d + batchDim] !== shape[d + sliceDim]) {
                throw new Error(shapeError +
                    (" updates.shape[" + (d + batchDim) + "] (" + updates.shape[d + batchDim] + ") != shape[" + (d + batchDim) + "] (" + shape[d + batchDim] + ")"));
            }
        }
    }
    function validateInput(updates, indices, shape) {
        if (indices.rank < 1) {
            throw new Error('tf.scatterND() expects the indices to be rank 1 or higher,' +
                (" but the rank was " + indices.rank + "."));
        }
        if (updates.rank < 1) {
            throw new Error('tf.scatterND() expects the updates to be rank 1 or higher,' +
                (" but the rank was " + updates.rank + "."));
        }
        if (indices.dtype !== 'int32') {
            throw new Error("The dtype of 'indices' should be int32, but got dtype: " + indices.dtype);
        }
        if (shape.length < 1) {
            throw new Error("Output rank must be greater or equal to 1, but got shape: " + shape);
        }
        if (shape.length === 0) {
            if (indices.size === 0) {
                throw new Error("Indices specified for empty output. indices shape: " + indices.shape);
            }
            if (updates.size === 0) {
                throw new Error("Updates specified for empty output. updates shape: " + updates.shape);
            }
        }
        validateUpdateShape(shape, indices, updates);
    }
    function calculateShapes(updates, indices, shape) {
        var sliceRank = (indices.rank > 1) ? indices.shape[indices.rank - 1] : 1;
        var totalNd = shape.length;
        var sliceSize = 1;
        for (var i = sliceRank; i < totalNd; ++i) {
            sliceSize *= shape[i];
        }
        var safeSliceDim = (sliceRank < 1) ? 1 : sliceRank;
        var numUpdates = indices.size / safeSliceDim;
        var outputStrides = computeStrides(shape).concat([1]);
        var strides = outputStrides.slice(outputStrides.length - sliceRank, outputStrides.length);
        var outputSize = sizeFromShape(shape);
        return { sliceRank: sliceRank, numUpdates: numUpdates, sliceSize: sliceSize, strides: strides, outputSize: outputSize };
    }

    function segOpComputeOptimalWindowSize(inSize, numSegments) {
        var done = false;
        var res;
        if (inSize <= PARALLELIZE_THRESHOLD) {
            res = inSize;
            done = true;
        }
        else {
            res = nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
        }
        while (!done) {
            if (res > numSegments || res === inSize) {
                done = true;
                break;
            }
            else {
                res = nearestDivisor(inSize, res + 1);
            }
        }
        return res;
    }
    function computeOutShape$1(aShape, axis, numSegments) {
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

    function assertParamsValid(input, begin, size) {
        assert(input.rank === begin.length, "Error in slice" + input.rank + "D: Length of begin " + begin + " must " +
            ("match the rank of the array (" + input.rank + ")."));
        assert(input.rank === size.length, "Error in slice" + input.rank + "D: Length of size " + size + " must " +
            ("match the rank of the array (" + input.rank + ")."));
        for (var i = 0; i < input.rank; ++i) {
            assert(begin[i] + size[i] <= input.shape[i], "Error in slice" + input.rank + "D: begin[" + i + "] + size[" + i + "] " +
                ("(" + (begin[i] + size[i]) + ") would overflow input.shape[" + i + "] (" + input.shape[i] + ")"));
        }
    }
    function getStridedSlicedInfo(shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
        if (beginMask === void 0) { beginMask = 0; }
        if (endMask === void 0) { endMask = 0; }
        if (ellipsisMask === void 0) { ellipsisMask = 0; }
        if (newAxisMask === void 0) { newAxisMask = 0; }
        if (shrinkAxisMask === void 0) { shrinkAxisMask = 0; }
        if (ellipsisMask !== 0) {
            throw new Error('ellipsis mask is not yet supported');
        }
        if (newAxisMask !== 0) {
            throw new Error('new axis mask is not yet supported');
        }
        var startIndex = [];
        var endIndex = [];
        var shrinkAxis = [];
        for (var i = 0; i < shape.length; i++) {
            startIndex[i] = startForAxis(beginMask, begin, strides, shape, i);
            endIndex[i] = stopForAxis(endMask, end, strides, shape, i);
            if (shrinkAxisMask & 1 << i) {
                endIndex[i] = startIndex[i] + 1;
                shrinkAxis.push(i);
            }
        }
        var size = new Array(shape.length).fill(0);
        size = size.map(function (d, i) {
            var count = 0;
            for (var start = startIndex[i]; !(strides[i] > 0 ? start >= endIndex[i] : start <= endIndex[i]); start += strides[i]) {
                count += 1;
            }
            return count;
        });
        return [startIndex, size, shrinkAxis];
    }
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
        start = clamp(0, start, axisSize - 1);
        return start;
    }
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
            stop = clamp(0, stop, axisSize);
        }
        else {
            stop = clamp(-1, stop, axisSize - 1);
        }
        return stop;
    }

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
        if (val instanceof Array && ENV.get('TENSORLIKE_CHECK_SHAPE_CONSISTENCY')) {
            deepAssertShapeConsistency(val, shape, []);
        }
        return shape;
    }
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
    function convertToTensor(x, argName, functionName, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        dtype = dtype || 'float32';
        if (x instanceof Tensor) {
            return x;
        }
        if (!isTypedArray(x) && !Array.isArray(x) && typeof x !== 'number' &&
            typeof x !== 'boolean') {
            throw new Error("Argument '" + argName + "' passed to '" + functionName + "' must be a " +
                ("Tensor or TensorLike, but got " + x.constructor.name));
        }
        var inferredShape = inferShape(x);
        if (!isTypedArray(x) && !Array.isArray(x)) {
            x = [x];
        }
        return Tensor.make(inferredShape, { values: toTypedArray(x, dtype, ENV.get('DEBUG')) }, dtype);
    }
    function convertToTensorArray(arg, argName, functionName) {
        if (!Array.isArray(arg)) {
            throw new Error("Argument " + argName + " passed to " + functionName + " must be a " +
                '`Tensor[]` or `TensorLike[]`');
        }
        var tensors = arg;
        return tensors.map(function (t, i) { return convertToTensor(t, argName + "[" + i + "]", functionName); });
    }

    function op(f) {
        var keys = Object.keys(f);
        if (keys.length !== 1) {
            throw new Error("Please provide an object with a single key " +
                "(operation name) mapping to a function. Got an object with " +
                (keys.length + " keys."));
        }
        var opName = keys[0];
        var fn = f[opName];
        if (opName.endsWith('_')) {
            opName = opName.substring(0, opName.length - 1);
        }
        var f2 = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            ENV.engine.startScope(opName);
            try {
                var result = fn.apply(void 0, args);
                if (result instanceof Promise) {
                    console.error('Cannot return a Promise inside of tidy.');
                }
                ENV.engine.endScope(result);
                return result;
            }
            catch (ex) {
                ENV.engine.endScope(null);
                throw ex;
            }
        };
        Object.defineProperty(f2, 'name', { value: opName, configurable: true });
        return f2;
    }

    function softmax_(logits, dim) {
        if (dim === void 0) { dim = -1; }
        var $logits = convertToTensor(logits, 'logits', 'softmax');
        if (dim === -1) {
            dim = $logits.rank - 1;
        }
        if (dim !== $logits.rank - 1) {
            throw Error('Softmax along a non-last dimension is not yet supported. ' +
                ("Logits was rank " + $logits.rank + " and dim was " + dim));
        }
        var customOp = customGrad(function (logits) {
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
    }
    var softmax = op({ softmax_: softmax_ });

    function complex_(real, imag) {
        var $real = convertToTensor(real, 'real', 'complex');
        var $imag = convertToTensor(imag, 'imag', 'complex');
        assertShapesMatch($real.shape, $imag.shape, "real and imag shapes, " + $real.shape + " and " + $imag.shape + ", " +
            "must match in call to tf.complex().");
        return ENV.engine.runKernel(function (backend) { return backend.complex($real, $imag); }, { $real: $real, $imag: $imag });
    }
    function real_(input) {
        var $input = convertToTensor(input, 'input', 'real');
        return ENV.engine.runKernel(function (backend) { return backend.real($input); }, { $input: $input });
    }
    function imag_(input) {
        var $input = convertToTensor(input, 'input', 'imag');
        return ENV.engine.runKernel(function (backend) { return backend.imag($input); }, { $input: $input });
    }
    var complex = op({ complex_: complex_ });
    var real = op({ real_: real_ });
    var imag = op({ imag_: imag_ });

    function tensor(values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (dtype === 'complex64') {
            throw new Error("Cannot construct a complex64 tensor directly. " +
                "Please use tf.complex(real, imag).");
        }
        if (!isTypedArray(values) && !Array.isArray(values) &&
            typeof values !== 'number' && typeof values !== 'boolean') {
            throw new Error('values passed to tensor(values) must be an ' +
                'array of numbers or booleans, or a TypedArray');
        }
        var inferredShape = inferShape(values);
        if (shape != null && inferredShape.length !== 1) {
            assertShapesMatch(shape, inferredShape, "Error creating a new Tensor. " +
                ("Inferred shape (" + inferredShape + ") does not match the ") +
                ("provided shape (" + shape + "). "));
        }
        if (!isTypedArray(values) && !Array.isArray(values)) {
            values = [values];
        }
        shape = shape || inferredShape;
        return Tensor.make(shape, {
            values: toTypedArray(values, dtype, ENV.get('DEBUG'))
        }, dtype);
    }
    function scalar(value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if ((isTypedArray(value) || Array.isArray(value)) && dtype !== 'complex64') {
            throw new Error('Error creating a new Scalar: value must be a primitive ' +
                '(number|boolean)');
        }
        return tensor(value, [], dtype);
    }
    function tensor1d(values, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        assertNonNull(values);
        var inferredShape = inferShape(values);
        if (inferredShape.length !== 1) {
            throw new Error('tensor1d() requires values to be a flat/TypedArray');
        }
        return tensor(values, inferredShape, dtype);
    }
    function tensor2d(values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        assertNonNull(values);
        if (shape != null && shape.length !== 2) {
            throw new Error('tensor2d() requires shape to have two numbers');
        }
        var inferredShape = inferShape(values);
        if (inferredShape.length !== 2 && inferredShape.length !== 1) {
            throw new Error('tensor2d() requires values to be number[][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor2d() requires shape to be provided when `values` ' +
                'are a flat/TypedArray');
        }
        shape = shape || inferredShape;
        return tensor(values, shape, dtype);
    }
    function tensor3d(values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        assertNonNull(values);
        if (shape != null && shape.length !== 3) {
            throw new Error('tensor3d() requires shape to have three numbers');
        }
        var inferredShape = inferShape(values);
        if (inferredShape.length !== 3 && inferredShape.length !== 1) {
            throw new Error('tensor3d() requires values to be number[][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor3d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return tensor(values, shape, dtype);
    }
    function tensor4d(values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        assertNonNull(values);
        if (shape != null && shape.length !== 4) {
            throw new Error('tensor4d() requires shape to have four numbers');
        }
        var inferredShape = inferShape(values);
        if (inferredShape.length !== 4 && inferredShape.length !== 1) {
            throw new Error('tensor4d() requires values to be number[][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor4d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return tensor(values, shape, dtype);
    }
    function tensor5d(values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        assertNonNull(values);
        if (shape != null && shape.length !== 5) {
            throw new Error('tensor5d() requires shape to have five numbers');
        }
        var inferredShape = inferShape(values);
        if (inferredShape.length !== 5 && inferredShape.length !== 1) {
            throw new Error('tensor5d() requires values to be ' +
                'number[][][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor5d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return tensor(values, shape, dtype);
    }
    function tensor6d(values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        assertNonNull(values);
        if (shape != null && shape.length !== 6) {
            throw new Error('tensor6d() requires shape to have six numbers');
        }
        var inferredShape = inferShape(values);
        if (inferredShape.length !== 6 && inferredShape.length !== 1) {
            throw new Error('tensor6d() requires values to be number[][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor6d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape ||
            inferredShape;
        return tensor(values, shape, dtype);
    }
    function ones$1(shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (dtype === 'complex64') {
            var real$$1 = ones$1(shape, 'float32');
            var imag$$1 = ones$1(shape, 'float32');
            return complex(real$$1, imag$$1);
        }
        var values = makeOnesTypedArray(sizeFromShape(shape), dtype);
        return Tensor.make(shape, { values: values }, dtype);
    }
    function zeros(shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (dtype === 'complex64') {
            var real$$1 = zeros(shape, 'float32');
            var imag$$1 = zeros(shape, 'float32');
            return complex(real$$1, imag$$1);
        }
        var values = makeZerosTypedArray(sizeFromShape(shape), dtype);
        return Tensor.make(shape, { values: values }, dtype);
    }
    function fill(shape, value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = getTypedArrayFromDType(dtype, sizeFromShape(shape));
        values.fill(value);
        return Tensor.make(shape, { values: values }, dtype);
    }
    function onesLike_(x) {
        var $x = convertToTensor(x, 'x', 'onesLike');
        return ones$1($x.shape, $x.dtype);
    }
    function zerosLike_(x) {
        var $x = convertToTensor(x, 'x', 'zerosLike');
        return zeros($x.shape, $x.dtype);
    }
    function linspace(start, stop, num) {
        if (num === 0) {
            throw new Error('Cannot request zero samples');
        }
        var step = (stop - start) / (num - 1);
        var values = makeZerosTypedArray(num, 'float32');
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return tensor1d(values, 'float32');
    }
    function range(start, stop, step, dtype) {
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
            return zeros([0], dtype);
        }
        var numElements = Math.abs(Math.ceil((stop - start) / step));
        var values = makeZerosTypedArray(numElements, dtype);
        if (stop < start && step === 1) {
            step = -1;
        }
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return tensor1d(values, dtype);
    }
    var onesLike = op({ onesLike_: onesLike_ });
    var zerosLike = op({ zerosLike_: zerosLike_ });

    var DType;
    (function (DType) {
        DType["float32"] = "float32";
        DType["int32"] = "int32";
        DType["bool"] = "bool";
    })(DType || (DType = {}));
    (function (Rank) {
        Rank["R0"] = "R0";
        Rank["R1"] = "R1";
        Rank["R2"] = "R2";
        Rank["R3"] = "R3";
        Rank["R4"] = "R4";
        Rank["R5"] = "R5";
        Rank["R6"] = "R6";
    })(exports.Rank || (exports.Rank = {}));
    var UpcastInt32AndMap;
    (function (UpcastInt32AndMap) {
        UpcastInt32AndMap["float32"] = "float32";
        UpcastInt32AndMap["int32"] = "int32";
        UpcastInt32AndMap["bool"] = "int32";
        UpcastInt32AndMap["complex64"] = "complex64";
    })(UpcastInt32AndMap || (UpcastInt32AndMap = {}));
    var UpcastBoolAndMap;
    (function (UpcastBoolAndMap) {
        UpcastBoolAndMap["float32"] = "float32";
        UpcastBoolAndMap["int32"] = "int32";
        UpcastBoolAndMap["bool"] = "bool";
        UpcastBoolAndMap["complex64"] = "complex64";
    })(UpcastBoolAndMap || (UpcastBoolAndMap = {}));
    var UpcastFloat32AndMap;
    (function (UpcastFloat32AndMap) {
        UpcastFloat32AndMap["float32"] = "float32";
        UpcastFloat32AndMap["int32"] = "float32";
        UpcastFloat32AndMap["bool"] = "float32";
        UpcastFloat32AndMap["complex64"] = "complex64";
    })(UpcastFloat32AndMap || (UpcastFloat32AndMap = {}));
    var UpcastComplex64AndMap;
    (function (UpcastComplex64AndMap) {
        UpcastComplex64AndMap["float32"] = "complex64";
        UpcastComplex64AndMap["int32"] = "complex64";
        UpcastComplex64AndMap["bool"] = "complex64";
        UpcastComplex64AndMap["complex64"] = "complex64";
    })(UpcastComplex64AndMap || (UpcastComplex64AndMap = {}));
    var upcastTypeMap = {
        'float32': UpcastFloat32AndMap,
        'int32': UpcastInt32AndMap,
        'bool': UpcastBoolAndMap,
        'complex64': UpcastComplex64AndMap
    };
    function upcastType(typeA, typeB) {
        return upcastTypeMap[typeA][typeB];
    }
    function sumOutType(type) {
        return upcastType(type, 'int32');
    }

    var DataStorage = (function () {
        function DataStorage(dataMover) {
            this.dataMover = dataMover;
            this.data = new WeakMap();
        }
        DataStorage.prototype.get = function (dataId) {
            if (!this.data.has(dataId)) {
                this.dataMover.moveData(dataId);
            }
            return this.data.get(dataId);
        };
        DataStorage.prototype.set = function (dataId, value) {
            this.data.set(dataId, value);
        };
        DataStorage.prototype.has = function (dataId) {
            return this.data.has(dataId);
        };
        DataStorage.prototype.delete = function (dataId) {
            return this.data.delete(dataId);
        };
        return DataStorage;
    }());
    var KernelBackend = (function () {
        function KernelBackend() {
        }
        KernelBackend.prototype.time = function (f) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.read = function (dataId) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.readSync = function (dataId) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.disposeData = function (dataId) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.write = function (dataId, values) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.fromPixels = function (pixels, numChannels) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.register = function (dataId, shape, dtype) {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.memory = function () {
            throw new Error('Not yet implemented.');
        };
        KernelBackend.prototype.floatPrecision = function () {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.batchMatMul = function (a, b, transposeA, transposeB) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.slice = function (x, begin, size) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.stridedSlice = function (x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.reverse = function (a, axis) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.concat = function (tensors, axis) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.neg = function (a) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.add = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.addN = function (tensors) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.subtract = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.multiply = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.realDivide = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.floorDiv = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sum = function (x, axes) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.prod = function (x, axes) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.unsortedSegmentSum = function (x, segmentIds, numSegments) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.argMin = function (x, axis) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.argMax = function (x, axis) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.equal = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.notEqual = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.less = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.lessEqual = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.greater = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.greaterEqual = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.logicalNot = function (a) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.logicalAnd = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.logicalOr = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.where = function (condition) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.select = function (condition, a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.topk = function (x, k, sorted) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.min = function (x, axes) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.minimum = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.mod = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.max = function (x, axes) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.maximum = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.all = function (x, axes) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.any = function (x, axes) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.squaredDifference = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.ceil = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.floor = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.round = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sign = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.pow = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.exp = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.expm1 = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.log = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.log1p = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sqrt = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.rsqrt = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.square = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.reciprocal = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.relu = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.elu = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.eluDer = function (dy, y) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.selu = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.int = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.clip = function (x, min, max) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.abs = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.complexAbs = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sigmoid = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.softplus = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sin = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.cos = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.tan = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.asin = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.acos = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.atan = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.atan2 = function (a, b) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sinh = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.cosh = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.tanh = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.asinh = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.acosh = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.atanh = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.erf = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.step = function (x, alpha) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.conv2d = function (x, filter, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.conv2dDerInput = function (dy, filter, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.conv2dDerFilter = function (x, dY, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.depthwiseConv2D = function (input, filter, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.depthwiseConv2DDerInput = function (dy, filter, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.depthwiseConv2DDerFilter = function (x, dY, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.maxPool = function (x, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.maxPoolBackprop = function (dy, x, y, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.avgPool = function (x, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.avgPoolBackprop = function (dy, x, convInfo) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.reshape = function (x, shape) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.cast = function (x, dtype) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.tile = function (x, reps) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.pad = function (x, paddings, constantValue) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.transpose = function (x, perm) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.gather = function (x, indices, axis) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.gatherND = function (x, indices) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.scatterND = function (indices, updates, shape) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.batchToSpaceND = function (x, blockShape, crops) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.spaceToBatchND = function (x, blockShape, paddings) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.resizeBilinearBackprop = function (dy, x, alignCorners) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.resizeNearestNeighbor = function (x, newHEight, newWidth, alignCorners) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.resizeNearestNeighborBackprop = function (dy, x, alignCorners) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.LRNGrad = function (dy, inputImage, outputImage, radius, bias, alpha, beta) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.multinomial = function (logits, normalized, numSamples, seed) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.oneHot = function (indices, depth, onValue, offValue) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.cumsum = function (x, axis, exclusive, reverse) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.nonMaxSuppression = function (boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.fft = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.ifft = function (x) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.complex = function (real, imag) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.real = function (input) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.imag = function (input) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.cropAndResize = function (image, boxes, boxIndex, cropSize, method, extrapolationValue) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.depthToSpace = function (x, blockSize, dataFormat) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.split = function (value, sizeSplits, axis) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.sparseToDense = function (sparseIndices, sparseValues, outputShape, defaultValue) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.setDataMover = function (dataMover) {
            throw new Error('Not yet implemented');
        };
        KernelBackend.prototype.dispose = function () {
            throw new Error('Not yet implemented');
        };
        return KernelBackend;
    }());

    function castTensor(x, dtype, backend) {
        if (dtype === 'complex64') {
            if (x.dtype === 'complex64') {
                return x.clone();
            }
            var zerosTensor = zeros(x.shape);
            var floatX = x.toFloat();
            var result = backend.complex(floatX, zerosTensor);
            zerosTensor.dispose();
            floatX.dispose();
            return result;
        }
        if (!hasEncodingLoss(x.dtype, dtype)) {
            return Tensor.make(x.shape, { dataId: x.dataId }, dtype);
        }
        if (x.dtype === 'complex64') {
            var real = backend.real(x);
            var result = real.cast(dtype);
            real.dispose();
            return result;
        }
        if (dtype === 'int32') {
            return backend.int(x);
        }
        else if (dtype === 'bool') {
            var zero = scalar(0, x.dtype);
            var result = backend.notEqual(x, zero);
            zero.dispose();
            return result;
        }
        else {
            throw new Error("Error in Cast: unknown dtype argument (" + dtype + ")");
        }
    }
    function reshapeTensor(x, shape) {
        return Tensor.make(shape, { dataId: x.dataId }, x.dtype);
    }

    function mergeRealAndImagArrays(real, imag) {
        if (real.length !== imag.length) {
            throw new Error("Cannot merge real and imag arrays of different lengths. real:" +
                (real.length + ", imag: " + imag.length + "."));
        }
        var result = new Float32Array(real.length * 2);
        for (var i = 0; i < result.length; i += 2) {
            result[i] = real[i / 2];
            result[i + 1] = imag[i / 2];
        }
        return result;
    }
    function splitRealAndImagArrays(complex) {
        var real = new Float32Array(complex.length / 2);
        var imag = new Float32Array(complex.length / 2);
        for (var i = 0; i < complex.length; i += 2) {
            real[i / 2] = complex[i];
            imag[i / 2] = complex[i + 1];
        }
        return { real: real, imag: imag };
    }
    function complexWithEvenIndex(complex) {
        var len = Math.ceil(complex.length / 4);
        var real = new Float32Array(len);
        var imag = new Float32Array(len);
        for (var i = 0; i < complex.length; i += 4) {
            real[Math.floor(i / 4)] = complex[i];
            imag[Math.floor(i / 4)] = complex[i + 1];
        }
        return { real: real, imag: imag };
    }
    function complexWithOddIndex(complex) {
        var len = Math.floor(complex.length / 4);
        var real = new Float32Array(len);
        var imag = new Float32Array(len);
        for (var i = 2; i < complex.length; i += 4) {
            real[Math.floor(i / 4)] = complex[i];
            imag[Math.floor(i / 4)] = complex[i + 1];
        }
        return { real: real, imag: imag };
    }
    function getComplexWithIndex(complex, index) {
        var real = complex[index * 2];
        var imag = complex[index * 2 + 1];
        return { real: real, imag: imag };
    }
    function assignToTypedArray(data, real, imag, index) {
        data[index * 2] = real;
        data[index * 2 + 1] = imag;
    }
    function exponents(n, inverse) {
        var real = new Float32Array(n / 2);
        var imag = new Float32Array(n / 2);
        for (var i = 0; i < Math.ceil(n / 2); i++) {
            var x = (inverse ? 2 : -2) * Math.PI * (i / n);
            real[i] = Math.cos(x);
            imag[i] = Math.sin(x);
        }
        return { real: real, imag: imag };
    }
    function exponent(k, n, inverse) {
        var x = (inverse ? 2 : -2) * Math.PI * (k / n);
        var real = Math.cos(x);
        var imag = Math.sin(x);
        return { real: real, imag: imag };
    }

    function nonMaxSuppressionImpl(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
        var candidates = Array.from(scores)
            .map(function (score, boxIndex) { return ({ score: score, boxIndex: boxIndex }); })
            .filter(function (c) { return c.score > scoreThreshold; })
            .sort(function (c1, c2) { return c2.score - c1.score; });
        var selected = [];
        for (var i = 0; i < candidates.length; i++) {
            var _a = candidates[i], score = _a.score, boxIndex = _a.boxIndex;
            if (score < scoreThreshold) {
                break;
            }
            var ignoreCandidate = false;
            for (var j = selected.length - 1; j >= 0; --j) {
                var iou = intersectionOverUnion(boxes, boxIndex, selected[j]);
                if (iou >= iouThreshold) {
                    ignoreCandidate = true;
                    break;
                }
            }
            if (!ignoreCandidate) {
                selected.push(boxIndex);
                if (selected.length >= maxOutputSize) {
                    break;
                }
            }
        }
        return tensor1d(selected, 'int32');
    }
    function intersectionOverUnion(boxes, i, j) {
        var iCoord = boxes.subarray(i * 4, i * 4 + 4);
        var jCoord = boxes.subarray(j * 4, j * 4 + 4);
        var yminI = Math.min(iCoord[0], iCoord[2]);
        var xminI = Math.min(iCoord[1], iCoord[3]);
        var ymaxI = Math.max(iCoord[0], iCoord[2]);
        var xmaxI = Math.max(iCoord[1], iCoord[3]);
        var yminJ = Math.min(jCoord[0], jCoord[2]);
        var xminJ = Math.min(jCoord[1], jCoord[3]);
        var ymaxJ = Math.max(jCoord[0], jCoord[2]);
        var xmaxJ = Math.max(jCoord[1], jCoord[3]);
        var areaI = (ymaxI - yminI) * (xmaxI - xminI);
        var areaJ = (ymaxJ - yminJ) * (xmaxJ - xminJ);
        if (areaI <= 0 || areaJ <= 0) {
            return 0.0;
        }
        var intersectionYmin = Math.max(yminI, yminJ);
        var intersectionXmin = Math.max(xminI, xminJ);
        var intersectionYmax = Math.min(ymaxI, ymaxJ);
        var intersectionXmax = Math.min(xmaxI, xmaxJ);
        var intersectionArea = Math.max(intersectionYmax - intersectionYmin, 0.0) *
            Math.max(intersectionXmax - intersectionXmin, 0.0);
        return intersectionArea / (areaI + areaJ - intersectionArea);
    }

    function split(x, sizeSplits, axis) {
        var begin = Array(x.rank).fill(0);
        var size = x.shape.slice();
        return sizeSplits.map(function (s) {
            size[axis] = s;
            var slice = x.slice(begin, size);
            begin[axis] += s;
            return slice;
        });
    }

    function topkImpl(x, xShape, xDtype, k, sorted) {
        var lastDim = xShape[xShape.length - 1];
        var _a = [x.length / lastDim, lastDim], batch = _a[0], size = _a[1];
        var allTopKVals = getTypedArrayFromDType(xDtype, batch * k);
        var allTopKIndices = getTypedArrayFromDType('int32', batch * k);
        for (var b = 0; b < batch; b++) {
            var offset = b * size;
            var vals = x.subarray(offset, offset + size);
            var valAndInd = [];
            for (var i = 0; i < vals.length; i++) {
                valAndInd.push({ value: vals[i], index: i });
            }
            valAndInd.sort(function (a, b) { return b.value - a.value; });
            var outOffset = b * k;
            var topKVals = allTopKVals.subarray(outOffset, outOffset + k);
            var topKIndices = allTopKIndices.subarray(outOffset, outOffset + k);
            for (var i = 0; i < k; i++) {
                topKVals[i] = valAndInd[i].value;
                topKIndices[i] = valAndInd[i].index;
            }
        }
        var outputShape = xShape.slice();
        outputShape[outputShape.length - 1] = k;
        return [
            tensor(allTopKVals, outputShape, xDtype),
            tensor(allTopKIndices, outputShape, 'int32')
        ];
    }

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
            this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + windowSize + ";\n\n        int bestIndex = inOffset;\n        float bestValue = getA(batch, bestIndex);\n\n        for (int i = 0; i < " + windowSize + "; i++) {\n          int inIdx = " + indexSnippet + ";\n          float candidate = getA(batch, inIdx);\n          if (candidate " + compOp + " bestValue) {\n            bestValue = candidate;\n            bestIndex = inIdx;\n          }\n        }\n        setOutput(float(bestIndex));\n      }\n    ";
        }
        return ArgMinMaxProgram;
    }());

    var AvgPool2DBackpropProgram = (function () {
        function AvgPool2DBackpropProgram(convInfo) {
            this.variableNames = ['dy'];
            this.outputShape = convInfo.inShape;
            var filterHeight = convInfo.filterHeight;
            var filterWidth = convInfo.filterWidth;
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
            var padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
            var padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
            var avgMultiplier = 1 / (filterHeight * filterWidth);
            this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n      const float avgMultiplier = float(" + avgMultiplier + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + effectiveFilterHeight + ";\n            wR += " + dilationHeight + ") {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + effectiveFilterWidth + ";\n            wC+= " + dilationWidth + ") {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n\n            dotProd += dyValue * avgMultiplier;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
        }
        return AvgPool2DBackpropProgram;
    }());

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
    function broadcastDimsAreOuter(dims) {
        for (var i = 0; i < dims.length; i++) {
            if (dims[i] !== i) {
                return false;
            }
        }
        return true;
    }
    function assertAndGetBroadcastShape(shapeA, shapeB) {
        var result = [];
        var l = Math.max(shapeA.length, shapeB.length);
        for (var i = 0; i < l; i++) {
            var a = shapeA[shapeA.length - i - 1];
            if (a == null) {
                a = 1;
            }
            var b = shapeB[shapeB.length - i - 1];
            if (b == null) {
                b = 1;
            }
            if (a === 1) {
                result.unshift(b);
            }
            else if (b === 1) {
                result.unshift(a);
            }
            else if (a !== b) {
                var errMsg = "Operands could not be broadcast together with shapes " +
                    (shapeA + " and " + shapeB + ".");
                throw Error(errMsg);
            }
            else {
                result.unshift(a);
            }
        }
        return result;
    }

    var BatchNormProgram = (function () {
        function BatchNormProgram(xShape, meanShape, varianceShape, offsetShape, scaleShape, varianceEpsilon) {
            this.outputShape = [];
            this.supportsBroadcasting = true;
            this.variableNames = ['x', 'mean', 'variance'];
            assertAndGetBroadcastShape(xShape, meanShape);
            assertAndGetBroadcastShape(xShape, varianceShape);
            var offsetSnippet = '0.0';
            if (offsetShape != null) {
                assertAndGetBroadcastShape(xShape, offsetShape);
                this.variableNames.push('offset');
                offsetSnippet = 'getOffsetAtOutCoords()';
            }
            var scaleSnippet = '1.0';
            if (scaleShape != null) {
                assertAndGetBroadcastShape(xShape, scaleShape);
                this.variableNames.push('scale');
                scaleSnippet = 'getScaleAtOutCoords()';
            }
            this.outputShape = xShape;
            this.userCode = "\n      void main() {\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + offsetSnippet + ";\n        float scale = " + scaleSnippet + ";\n        float inv = scale * inversesqrt(variance + float(" + varianceEpsilon + "));\n        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));\n      }\n    ";
        }
        return BatchNormProgram;
    }());

    var BatchNormPackedProgram = (function () {
        function BatchNormPackedProgram(xShape, meanShape, varianceShape, offsetShape, scaleShape, varianceEpsilon) {
            this.supportsBroadcasting = true;
            this.usesPackedTextures = true;
            this.variableNames = ['x', 'mean', 'variance'];
            assertAndGetBroadcastShape(xShape, meanShape);
            assertAndGetBroadcastShape(xShape, varianceShape);
            var meanSnippet = broadcastSample('mean', meanShape.length);
            var varianceSnippet = broadcastSample('variance', varianceShape.length);
            var offsetSnippet = 'vec4 offset = vec4(0.0)';
            if (offsetShape != null) {
                assertAndGetBroadcastShape(xShape, offsetShape);
                this.variableNames.push('offset');
                offsetSnippet = broadcastSample('offset', offsetShape.length);
            }
            var scaleSnippet = 'vec4 scale = vec4(1.0)';
            if (scaleShape != null) {
                assertAndGetBroadcastShape(xShape, scaleShape);
                this.variableNames.push('scale');
                scaleSnippet = broadcastSample('scale', scaleShape.length);
            }
            this.outputShape = xShape;
            this.userCode = "\n      void main() {\n        ivec4 rc = getOutputCoords();\n\n        " + offsetSnippet + ";\n        " + scaleSnippet + ";\n\n        vec4 x = getX(rc.x, rc.y, rc.z, rc.w);\n        " + meanSnippet + ";\n        " + varianceSnippet + ";\n\n        vec4 inv = scale * inversesqrt(variance + vec4(" + varianceEpsilon + "));\n\n        setOutput((x - mean) * inv + offset);\n      }\n    ";
        }
        return BatchNormPackedProgram;
    }());
    function broadcastSample(texName, rank) {
        var texSampler = "get" + texName.charAt(0).toUpperCase() + texName.slice(1);
        if (rank === 1) {
            return "\n      vec4 " + texName + "Sample = " + texSampler + "(rc.w);\n      vec4 " + texName + " = vec4(" + texName + "Sample.xy, " + texName + "Sample.xy);\n    ";
        }
        return "vec4 " + texName + " = " + texSampler + "(rc.x, rc.y, rc.z, rc.w)";
    }

    var COMPLEX_MULTIPLY = {
        REAL: 'return areal * breal - aimag * bimag;',
        IMAG: 'return areal * bimag + aimag * breal;'
    };
    var BinaryOpComplexProgram = (function () {
        function BinaryOpComplexProgram(op, aShape, bShape) {
            this.variableNames = ['AReal', 'AImag', 'BReal', 'BImag'];
            this.supportsBroadcasting = true;
            this.outputShape =
                assertAndGetBroadcastShape(aShape, bShape);
            this.userCode = "\n      float binaryOpComplex(\n          float areal, float aimag, float breal, float bimag) {\n        " + op + "\n      }\n\n      void main() {\n        float areal = getARealAtOutCoords();\n        float aimag = getAImagAtOutCoords();\n        float breal = getBRealAtOutCoords();\n        float bimag = getBImagAtOutCoords();\n        setOutput(binaryOpComplex(areal, aimag, breal, bimag));\n      }\n    ";
        }
        return BinaryOpComplexProgram;
    }());

    var CHECK_NAN_SNIPPET = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n";
    var ADD = 'return a + b;';
    var SUB = 'return a - b;';
    var MUL = 'return a * b;';
    var DIV = "if (a == b) return 1.0;\n  return a / b;";
    var INT_DIV = "\n  float resultSign = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  int result = ia / ib;\n  int amodb = ia - ib * result;\n\n  if (resultSign < 0.0 && amodb != 0) {\n    result -= 1;\n  }\n  return float(result);\n";
    var POW = "\nif(a < 0.0 && floor(b) < b){\n  return NAN;\n}\nreturn (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n    pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
    var SQUARED_DIFFERENCE = 'return (a - b) * (a - b);';
    var EQUAL = "return float(a == b);";
    var NOT_EQUAL = "return float(a != b);";
    var LESS = "return float(a < b);";
    var LESS_EQUAL = "return float(a <= b);";
    var GREATER = "return float(a > b);";
    var GREATER_EQUAL = "return float(a >= b);";
    var LOGICAL_AND = "return float(a >= 1.0 && b >= 1.0);";
    var LOGICAL_OR = "return float(a >= 1.0 || b >= 1.0);";
    var MAX = CHECK_NAN_SNIPPET + "\n  return max(a, b);\n";
    var MIN = CHECK_NAN_SNIPPET + "\n  return min(a, b);\n";
    var MOD = "if (b == 0.0) return NAN;\n  return mod(a, b);";
    var ATAN2 = CHECK_NAN_SNIPPET + "\n  return atan(a, b);\n";
    var ELU_DER = "return (b >= 1.0) ? a : a * (b + 1.0);";
    var BinaryOpProgram = (function () {
        function BinaryOpProgram(op, aShape, bShape) {
            this.variableNames = ['A', 'B'];
            this.supportsBroadcasting = true;
            this.outputShape =
                assertAndGetBroadcastShape(aShape, bShape);
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

    var ClipProgram = (function () {
        function ClipProgram(aShape, min, max) {
            this.variableNames = ['A'];
            this.outputShape = aShape;
            this.userCode = "\n      void main() {\n        float value = getAAtOutCoords();\n        if (isNaN(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, float(" + min + "), float(" + max + ")));\n      }\n    ";
        }
        return ClipProgram;
    }());

    var ComplexAbsProgram = (function () {
        function ComplexAbsProgram(shape) {
            this.variableNames = ['real', 'imag'];
            this.outputShape = shape;
            this.userCode = "\n      void main() {\n        float real = getRealAtOutCoords();\n        float imag = getImagAtOutCoords();\n        vec2 v = vec2(real, imag);\n\n        setOutput(sqrt(dot(v, v)));\n      }\n    ";
        }
        return ComplexAbsProgram;
    }());

    var ConcatProgram = (function () {
        function ConcatProgram(aShape, bShape) {
            this.variableNames = ['A', 'B'];
            this.outputShape = [];
            this.outputShape =
                computeOutShape([aShape, bShape], 1);
            this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        float value = 0.0;\n        if (yC < " + aShape[1] + ") {\n          value = getA(yR, yC);\n        } else {\n          yC -= " + aShape[1] + ";\n          value = getB(yR, yC);\n        }\n\n        setOutput(value);\n      }\n    ";
        }
        return ConcatProgram;
    }());

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

    var CropAndResizeProgram = (function () {
        function CropAndResizeProgram(imageShape, boxShape, cropSize, method, extrapolationValue) {
            this.variableNames = ['Image', 'Boxes', 'BoxInd'];
            this.outputShape = [];
            var batch = imageShape[0], imageHeight = imageShape[1], imageWidth = imageShape[2], depth = imageShape[3];
            var numBoxes = boxShape[0];
            var cropHeight = cropSize[0], cropWidth = cropSize[1];
            this.outputShape = [numBoxes, cropHeight, cropWidth, depth];
            var methodId = method === 'bilinear' ? 1 : 0;
            var _a = [imageHeight - 1 + ".0", imageWidth - 1 + ".0"], inputHeightFloat = _a[0], inputWidthFloat = _a[1];
            var _b = cropHeight > 1 ?
                [
                    "" + (imageHeight - 1) / (cropHeight - 1),
                    '(y2-y1) * height_ratio',
                    "y1*" + inputHeightFloat + " + float(y)*(height_scale)",
                ] :
                [
                    '0.0',
                    '0.0',
                    "0.5 * (y1+y2) * " + inputHeightFloat,
                ], heightRatio = _b[0], heightScale = _b[1], inY = _b[2];
            var _c = cropWidth > 1 ?
                [
                    "" + (imageWidth - 1) / (cropWidth - 1),
                    '(x2-x1) * width_ratio',
                    "x1*" + inputWidthFloat + " + float(x)*(width_scale)",
                ] :
                [
                    '0.0',
                    '0.0',
                    "0.5 * (x1+x2) * " + inputWidthFloat,
                ], widthRatio = _c[0], widthScale = _c[1], inX = _c[2];
            this.userCode = "\n      const float height_ratio = float(" + heightRatio + ");\n      const float width_ratio = float(" + widthRatio + ");\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int y = coords[1];\n        int x = coords[2];\n        int d = coords[3];\n\n        // get box vals\n        float y1 = getBoxes(b,0);\n        float x1 = getBoxes(b,1);\n        float y2 = getBoxes(b,2);\n        float x2 = getBoxes(b,3);\n\n        // get image in batch index\n        int bInd = round(getBoxInd(b));\n        if(bInd < 0 || bInd >= " + batch + ") {\n          return;\n        }\n\n        float height_scale = " + heightScale + ";\n        float width_scale = " + widthScale + ";\n\n        float in_y = " + inY + ";\n        if( in_y < 0.0 || in_y > " + inputHeightFloat + " ) {\n          setOutput(float(" + extrapolationValue + "));\n          return;\n        }\n        float in_x = " + inX + ";\n        if( in_x < 0.0 || in_x > " + inputWidthFloat + " ) {\n          setOutput(float(" + extrapolationValue + "));\n          return;\n        }\n\n        vec2 sourceFracIndexRC = vec2(in_y,in_x);\n        if(" + methodId + " == 1) {\n          // Compute the four integer indices.\n          ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n          ivec2 sourceCeilRC = ivec2(ceil(sourceFracIndexRC));\n\n          float topLeft = getImage(b, sourceFloorRC.x, sourceFloorRC.y, d);\n          float bottomLeft = getImage(b, sourceCeilRC.x, sourceFloorRC.y, d);\n          float topRight = getImage(b, sourceFloorRC.x, sourceCeilRC.y, d);\n          float bottomRight = getImage(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n          vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n          float top = topLeft + (topRight - topLeft) * fracRC.y;\n          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n          float newValue = top + (bottom - top) * fracRC.x;\n          setOutput(newValue);\n        } else {\n          // Compute the coordinators of nearest neighbor point.\n          ivec2 sourceNearestRC = ivec2(floor(\n            sourceFracIndexRC + vec2(0.5,0.5)));\n          float newValue = getImage(b, sourceNearestRC.x, sourceNearestRC.y, d);\n          setOutput(newValue);\n        }\n      }\n    ";
        }
        return CropAndResizeProgram;
    }());

    function makeShader(inputsInfo, outputShape, userCode, broadcast) {
        var inputPrefixSnippet = inputsInfo.map(function (x) {
            var size = sizeFromShape(x.shapeInfo.logicalShape);
            if (x.shapeInfo.isUniform) {
                return "uniform float " + x.name + (size > 1 ? "[" + size + "]" : '') + ";";
            }
            return "uniform sampler2D " + x.name + ";";
        });
        inputPrefixSnippet = inputPrefixSnippet.join('\n');
        var inputSamplingSnippet = inputsInfo.map(function (x) { return getInputSamplingSnippet(x, outputShape, broadcast); })
            .join('\n');
        var outTexShape = outputShape.texShape;
        var outputSamplingSnippet;
        var floatTextureSetOutputSnippet;
        if (outputShape.isPacked) {
            outputSamplingSnippet =
                getPackedOutputSamplingSnippet(outputShape.logicalShape, outTexShape);
            floatTextureSetOutputSnippet = FLOAT_TEXTURE_SET_RGBA_SNIPPET;
        }
        else {
            outputSamplingSnippet =
                getOutputSamplingSnippet(outputShape.logicalShape, outTexShape);
            floatTextureSetOutputSnippet = FLOAT_TEXTURE_SET_R_SNIPPET;
        }
        var source = [
            SHADER_PREFIX, FLOAT_TEXTURE_SAMPLE_SNIPPET, floatTextureSetOutputSnippet,
            inputPrefixSnippet, outputSamplingSnippet, inputSamplingSnippet, userCode
        ].join('\n');
        return source;
    }
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
    function getPackedSamplerFromInInfo(inInfo) {
        var shape = inInfo.shapeInfo.logicalShape;
        switch (shape.length) {
            case 1:
                return getPackedSampler1D(inInfo);
            case 2:
                return getPackedSampler2D(inInfo);
            case 4:
                return getPackedSampler4D(inInfo);
            default:
                throw new Error("Packed " + shape.length + "-D input sampling" +
                    " is not yet supported");
        }
    }
    function getInputSamplingSnippet(inInfo, outShapeInfo, broadcast) {
        var res = getSamplerFlat(inInfo);
        if (inInfo.shapeInfo.isPacked) {
            res += getPackedSamplerFromInInfo(inInfo);
        }
        else {
            res += getSamplerFromInInfo(inInfo);
        }
        if (broadcast ||
            arraysEqual(inInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape)) {
            res += getSamplerAtOutputCoords(inInfo, outShapeInfo, broadcast);
        }
        return res;
    }
    function getPackedOutputSamplingSnippet(outShape, outTexShape) {
        switch (outShape.length) {
            case 0:
                return getOutputScalarCoords();
            case 1:
                return getOutputPacked1DCoords(outShape, outTexShape);
            case 2:
                return getOutputPacked2DCoords(outShape, outTexShape);
            case 4:
                return getOutputPacked4DCoords(outShape, outTexShape);
            default:
                throw new Error(outShape.length + "-D output packed sampling is not yet supported");
        }
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
    var SAMPLE_1D_SNIPPET = "\nvec2 UVfrom1D(int texNumR, int texNumC, int index) {\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\nvec2 packedUVfrom1D(int texNumR, int texNumC, int index) {\n  int texelIndex = index / 2;\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
    var SAMPLE_2D_SNIPPET = "\nvec2 UVfrom2D(int texNumR, int texNumC, int numC, int row, int col) {\n  int index = row * numC + col;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\nvec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,\n  int texNumC, int row, int col) {\n  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
    var SAMPLE_3D_SNIPPET = "\nvec2 UVfrom3D(int texNumR, int texNumC, int stride0,\n    int stride1, int row, int col, int depth) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
    var SAMPLE_4D_SNIPPET = "\nvec2 UVfrom4D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int row, int col, int depth,\n    int depth2) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth * stride2 + depth2;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\nvec2 packedUVfrom4D(int texNumR, int texNumC, int texelsInBatch2,\n    int texelsInBatch, int texelsInLogicalRow, int b2, int b,\n    int row, int col) {\n  int index = b2 * texelsInBatch2 + b * texelsInBatch +\n    (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
    var SAMPLE_5D_SNIPPET = "\nvec2 UVfrom5D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int stride3, int row, int col, int depth,\n    int depth2, int depth3) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 +\n              depth * stride2 + depth2 * stride3 + depth3;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
    var SAMPLE_6D_SNIPPET = "\nvec2 UVfrom6D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int stride3, int stride4,\n    int row, int col, int depth, int depth2, int depth3, int depth4) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth * stride2 + depth2 *\n    stride3 + depth3 * stride4 + depth4;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
    var FLOAT_TEXTURE_SAMPLE_SNIPPET = "\n  float sampleTexture(sampler2D textureSampler, vec2 uv) {\n    return texture2D(textureSampler, uv).r;\n  }\n";
    var FLOAT_TEXTURE_SET_R_SNIPPET = "\n  void setOutput(float val) {\n    gl_FragColor = vec4(val, 0, 0, 0);\n  }\n";
    var FLOAT_TEXTURE_SET_RGBA_SNIPPET = "\n  void setOutput(vec4 val) {\n    gl_FragColor = val;\n  }\n";
    var SHADER_PREFIX = "\n  precision highp float;\n  precision highp int;\n  varying vec2 resultUV;\n  const vec2 halfCR = vec2(0.5, 0.5);\n\n  struct ivec5\n  {\n    int x;\n    int y;\n    int z;\n    int w;\n    int u;\n  };\n\n  struct ivec6\n  {\n    int x;\n    int y;\n    int z;\n    int w;\n    int u;\n    int v;\n  };\n\n  bool isNaN(float val) {\n    return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;\n  }\n\n  bool hasNaN(vec4 values) {\n    vec4 v1 = values * values;\n    vec4 v2 = values * values;\n    return any(notEqual(v1, v2));\n  }\n\n  float getNaN(vec4 values) {\n    return dot(vec4(1), values);\n  }\n\n  int round(float value) {\n    return int(floor(value + 0.5));\n  }\n\n  int imod(int x, int y) {\n    return x - y * (x / y);\n  }\n\n  //Based on the work of Dave Hoskins\n  //https://www.shadertoy.com/view/4djSRW\n  #define HASHSCALE1 443.8975\n  float random(float seed){\n    vec2 p = resultUV * seed;\n    vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);\n    p3 += dot(p3, p3.yzx + 19.19);\n    return fract((p3.x + p3.y) * p3.z);\n  }\n\n  " + SAMPLE_1D_SNIPPET + "\n  " + SAMPLE_2D_SNIPPET + "\n  " + SAMPLE_3D_SNIPPET + "\n  " + SAMPLE_4D_SNIPPET + "\n  " + SAMPLE_5D_SNIPPET + "\n  " + SAMPLE_6D_SNIPPET + "\n";
    function getOutputScalarCoords() {
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";
    }
    function getOutputPacked1DCoords(shape, texShape) {
        var packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
        if (texShape[0] === 1) {
            return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.x * " + packedTexShape[1] + ".0);\n      }\n    ";
        }
        if (texShape[1] === 1) {
            return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.y * " + packedTexShape[0] + ".0);\n      }\n    ";
        }
        return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + packedTexShape[0] + ", " + packedTexShape[1] + "));\n      return resTexRC.x * " + packedTexShape[1] + " + resTexRC.y;\n    }\n  ";
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
    function getOutputPacked4DCoords(shape, texShape) {
        var packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
        var texelsInLogicalRow = Math.ceil(shape[3] / 2);
        var texelsInBatch = texelsInLogicalRow * Math.ceil(shape[2] / 2);
        var texelsInBatch2 = texelsInBatch * shape[1];
        return "\n    ivec4 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + packedTexShape[0] + ", " + packedTexShape[1] + "));\n      int index = resTexRC.x * " + packedTexShape[1] + " + resTexRC.y;\n\n      int b2 = index / " + texelsInBatch2 + ";\n      index -= b2 * " + texelsInBatch2 + ";\n\n      int b = index / " + texelsInBatch + ";\n      index -= b * " + texelsInBatch + ";\n\n      int r = 2 * (index / " + texelsInLogicalRow + ");\n      int c = int(mod(float(index), " + texelsInLogicalRow + ".)) * 2;\n\n      return ivec4(b2, b, r, c);\n    }\n  ";
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
    function getOutputPacked2DCoords(shape, texShape) {
        var packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
        if (arraysEqual(shape, texShape)) {
            return "\n      ivec2 getOutputCoords() {\n        return 2 * ivec2(resultUV.yx * vec2(" + packedTexShape[0] + ", " + packedTexShape[1] + "));\n      }\n    ";
        }
        var texelsInLogicalRow = Math.ceil(shape[1] / 2);
        return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + packedTexShape[0] + ", " + packedTexShape[1] + "));\n\n      int index = resTexRC.x * " + packedTexShape[1] + " + resTexRC.y;\n      int r = 2 * (index / " + texelsInLogicalRow + ");\n      int c = imod(index, " + texelsInLogicalRow + ") * 2;\n\n      return ivec2(r, c);\n    }\n  ";
    }
    function getOutput2DCoords(shape, texShape) {
        if (arraysEqual(shape, texShape)) {
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
    function getPackedSampler1D(inputInfo) {
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        var texShape = inputInfo.shapeInfo.texShape;
        var packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
        return "\n    vec4 " + funcName + "(int index) {\n      vec2 uv = packedUVfrom1D(\n        " + packedTexShape[0] + ", " + packedTexShape[1] + ", index);\n      return texture2D(" + texName + ", uv);\n    }\n  ";
    }
    function getSampler1D(inputInfo) {
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        return "\n    float " + funcName + "(int index) {\n      return " + funcName + "Flat(index);\n    }\n  ";
    }
    function getPackedSampler2D(inputInfo) {
        var shape = inputInfo.shapeInfo.logicalShape;
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        var texShape = inputInfo.shapeInfo.texShape;
        var texNumR = texShape[0];
        var texNumC = texShape[1];
        if (texShape != null && arraysEqual(shape, texShape)) {
            return "\n      vec4 " + funcName + "(int row, int col) {\n        vec2 uv = (vec2(col, row) + halfCR) / vec2(" + texNumC + ".0, " + texNumR + ".0);\n\n        return texture2D(" + texName + ", uv);\n      }\n    ";
        }
        var packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
        var valuesPerRow = Math.ceil(shape[1] / 2);
        return "\n    vec4 " + funcName + "(int row, int col) {\n      vec2 uv = packedUVfrom2D(" + valuesPerRow + ", " + packedTexShape[0] + ", " + packedTexShape[1] + ", row, col);\n      return texture2D(" + texName + ", uv);\n    }\n  ";
    }
    function getSampler2D(inputInfo) {
        var shape = inputInfo.shapeInfo.logicalShape;
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        var texShape = inputInfo.shapeInfo.texShape;
        if (texShape != null && arraysEqual(shape, texShape)) {
            var texNumR_1 = texShape[0];
            var texNumC_1 = texShape[1];
            return "\n    float " + funcName + "(int row, int col) {\n      vec2 uv = (vec2(col, row) + halfCR) / vec2(" + texNumC_1 + ".0, " + texNumR_1 + ".0);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
        }
        var _a = squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
        var squeezedShape = newShape;
        if (squeezedShape.length < shape.length) {
            var newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
            var params = ['row', 'col'];
            return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
        }
        if (inputInfo.shapeInfo.isUniform) {
            return "\n      float " + funcName + "(int row, int col) {\n        float index = dot(vec2(row, col), vec2(" + shape[1] + ", 1));\n        return " + funcName + "Flat(round(index));\n      }\n    ";
        }
        var texNumR = texShape[0];
        var texNumC = texShape[1];
        if (texNumC === 1) {
            return "\n    float " + funcName + "(int row, int col) {\n      float index = dot(vec2(row, col), vec2(" + shape[1] + ", 1));\n      vec2 uv = vec2(0.5, (index + 0.5) / " + texNumR + ".0);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
        }
        if (texNumR === 1) {
            return "\n    float " + funcName + "(int row, int col) {\n      float index = dot(vec2(row, col), vec2(" + shape[1] + ", 1));\n      vec2 uv = vec2((index + 0.5) / " + texNumC + ".0, 0.5);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
        }
        return "\n  float " + funcName + "(int row, int col) {\n    vec2 uv = UVfrom2D(" + texNumR + ", " + texNumC + ", " + shape[1] + ", row, col);\n    return sampleTexture(" + texName + ", uv);\n  }\n";
    }
    function getSampler3D(inputInfo) {
        var shape = inputInfo.shapeInfo.logicalShape;
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        var stride0 = shape[1] * shape[2];
        var stride1 = shape[2];
        var _a = squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
        var squeezedShape = newShape;
        if (squeezedShape.length < shape.length) {
            var newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
            var params = ['row', 'col', 'depth'];
            return "\n        " + getSamplerFromInInfo(newInputInfo) + "\n        float " + funcName + "(int row, int col, int depth) {\n          return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n        }\n      ";
        }
        if (inputInfo.shapeInfo.isUniform) {
            return "\n      float " + funcName + "(int row, int col, int depth) {\n        float index = dot(vec3(row, col, depth),\n                          vec3(" + stride0 + ", " + stride1 + ", 1));\n        return " + funcName + "Flat(round(index));\n      }\n    ";
        }
        var texShape = inputInfo.shapeInfo.texShape;
        var texNumR = texShape[0];
        var texNumC = texShape[1];
        if (texNumC === stride0) {
            return "\n        float " + funcName + "(int row, int col, int depth) {\n          float texR = float(row);\n          float texC = dot(vec2(col, depth), vec2(" + stride1 + ", 1));\n          vec2 uv = (vec2(texC, texR) + halfCR) /\n                     vec2(" + texNumC + ".0, " + texNumR + ".0);\n          return sampleTexture(" + texName + ", uv);\n        }\n      ";
        }
        if (texNumC === stride1) {
            return "\n    float " + funcName + "(int row, int col, int depth) {\n      float texR = dot(vec2(row, col), vec2(" + shape[1] + ", 1));\n      float texC = float(depth);\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + texNumC + ".0, " + texNumR + ".0);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
        }
        return "\n      float " + funcName + "(int row, int col, int depth) {\n        vec2 uv = UVfrom3D(\n            " + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ", row, col, depth);\n        return sampleTexture(" + texName + ", uv);\n      }\n  ";
    }
    function getPackedSampler4D(inputInfo) {
        var shape = inputInfo.shapeInfo.logicalShape;
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        var texShape = inputInfo.shapeInfo.texShape;
        var packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
        var texNumR = packedTexShape[0];
        var texNumC = packedTexShape[1];
        var valuesPerRow = Math.ceil(shape[3] / 2);
        var texelsInBatch = valuesPerRow * Math.ceil(shape[2] / 2);
        var texelsInBatch2 = texelsInBatch * shape[1];
        return "\n    vec4 " + funcName + "(int b2, int b, int row, int col) {\n      vec2 uv = packedUVfrom4D(\n        " + texNumR + ", " + texNumC + ", " + texelsInBatch2 + ",\n        " + texelsInBatch + ", " + valuesPerRow + ", b2, b, row, col);\n      return texture2D(" + texName + ", uv);\n    }\n  ";
    }
    function getSampler4D(inputInfo) {
        var shape = inputInfo.shapeInfo.logicalShape;
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
        var stride2 = shape[3];
        var stride1 = shape[2] * stride2;
        var stride0 = shape[1] * stride1;
        var _a = squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
        if (newShape.length < shape.length) {
            var newInputInfo = squeezeInputInfo(inputInfo, newShape);
            var params = ['row', 'col', 'depth', 'depth2'];
            return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
        }
        if (inputInfo.shapeInfo.isUniform) {
            return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        float index = dot(vec4(row, col, depth, depth2),\n                          vec4(" + stride0 + ", " + stride1 + ", " + stride2 + ", 1));\n        return " + funcName + "Flat(round(index));\n      }\n    ";
        }
        var texShape = inputInfo.shapeInfo.texShape;
        var texNumR = texShape[0];
        var texNumC = texShape[1];
        if (texNumC === stride0) {
            return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        float texR = float(row);\n        float texC =\n            dot(vec3(col, depth, depth2), vec3(" + stride1 + ", " + stride2 + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
        }
        if (texNumC === stride2) {
            return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        float texR = dot(vec3(row, col, depth),\n                         vec3(" + shape[1] * shape[2] + ", " + shape[2] + ", 1));\n        float texC = float(depth2);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
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
        var _a = squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
        if (newShape.length < shape.length) {
            var newInputInfo = squeezeInputInfo(inputInfo, newShape);
            var params = ['row', 'col', 'depth', 'depth2', 'depth3'];
            return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
        }
        if (inputInfo.shapeInfo.isUniform) {
            return "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        float index = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + stride0 + ", " + stride1 + ", " + stride2 + ", " + stride3 + ")) +\n          depth3;\n        return " + funcName + "Flat(index);\n      }\n    ";
        }
        var texShape = inputInfo.shapeInfo.texShape;
        var texNumR = texShape[0];
        var texNumC = texShape[1];
        if (texNumC === stride0) {
            return "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        int texR = row;\n        float texC = dot(\n          vec4(col, depth, depth2, depth3),\n          vec4(" + stride1 + ", " + stride2 + ", " + stride3 + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
        }
        if (texNumC === stride3) {
            return "\n      float " + funcName + "(int row, int col, int depth, int depth2, int depth3) {\n        float texR = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + shape[1] * shape[2] * shape[3] + ", " + shape[2] * shape[3] + ",\n            " + shape[3] + ", 1));\n        int texC = depth3;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
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
        var _a = squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
        if (newShape.length < shape.length) {
            var newInputInfo = squeezeInputInfo(inputInfo, newShape);
            var params = ['row', 'col', 'depth', 'depth2', 'depth3', 'depth4'];
            return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
        }
        if (inputInfo.shapeInfo.isUniform) {
            return "\n      float " + funcName + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n        float index = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + stride0 + ", " + stride1 + ", " + stride2 + ", " + stride3 + ")) +\n          dot(\n            vec2(depth3, depth4),\n            vec2(" + stride4 + ", 1));\n        return " + funcName + "Flat(index);\n      }\n    ";
        }
        var texShape = inputInfo.shapeInfo.texShape;
        var texNumR = texShape[0];
        var texNumC = texShape[1];
        if (texNumC === stride0) {
            return "\n      float " + funcName + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        int texR = row;\n        float texC = dot(\n          vec4(col, depth, depth2, depth3),\n          vec4(" + stride1 + ", " + stride2 + ", " + stride3 + ", " + stride4 + ")) + depth4;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
        }
        if (texNumC === stride4) {
            return "\n      float " + funcName + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        float texR = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + shape[1] * shape[2] * shape[3] * shape[4] + ",\n               " + shape[2] * shape[3] * shape[4] + ",\n               " + shape[3] * shape[4] + ",\n               " + shape[4] + ")) + depth3;\n        int texC = depth4;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sampleTexture(" + texName + ", uv);\n      }\n    ";
        }
        return "\n    float " + funcName + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n      vec2 uv = UVfrom6D(" + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ",\n          " + stride2 + ", " + stride3 + ", " + stride4 + "\n          ,row, col, depth, depth2, depth3, depth4);\n      return sampleTexture(" + texName + ", uv);\n    }\n  ";
    }
    function getSamplerFlat(inputInfo) {
        var texName = inputInfo.name;
        var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1) + 'Flat';
        var inSize = sizeFromShape(inputInfo.shapeInfo.logicalShape);
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
        var broadcastDims = getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
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
        var broadcastDims = getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
        var inRank = inputInfo.shapeInfo.logicalShape.length;
        var outRank = outShapeInfo.logicalShape.length;
        var doBroadcast = supportsBroadcasting && ((outRank > inRank) || broadcastDims.length > 0);
        var broadcastOverOuter = broadcastDimsAreOuter(broadcastDims);
        var isUniform = inputInfo.shapeInfo.isUniform;
        if (doBroadcast && !broadcastOverOuter) {
            return getBroadcastOutputCoordsSampler(inputInfo, outShapeInfo, texFuncSnippet, funcName);
        }
        var inSize = sizeFromShape(inputInfo.shapeInfo.logicalShape);
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
        if (arraysEqual(inTexShape, outTexShape)) {
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
    function squeezeInputInfo(inInfo, squeezedShape) {
        var newInputInfo = JSON.parse(JSON.stringify(inInfo));
        newInputInfo.shapeInfo.logicalShape = squeezedShape;
        return newInputInfo;
    }
    function getSqueezedParams(params, keptDims) {
        return keptDims.map(function (d) { return params[d]; }).join(', ');
    }

    var CumSumProgram = (function () {
        function CumSumProgram(shape, exclusive, reverse) {
            this.variableNames = ['x'];
            this.outputShape = shape;
            var rank = shape.length;
            var finalDim = shape[shape.length - 1];
            var comparator = reverse ? '<' : '>';
            this.userCode = "\n      int getIndex(int i) {\n        " + (reverse ? "return " + finalDim + " -i - 1;" : 'return i;') + "\n      }\n\n      void main() {\n        " + getCoordsDataType(rank) + " coords = getOutputCoords();\n        int end = " + getFinalCoord(rank, 'coords') + ";\n        float val = 0.0;\n        for (int i = " + finalDim + " - 1; i >= 0; i -= 1) {\n          int idx = getIndex(i);\n          if (idx " + comparator + " end) {\n            continue;\n          }\n          if (idx == end && " + exclusive + ") {\n            continue;\n          }\n          " + getFinalCoord(rank, 'coords') + " = idx;\n          val += getX(" + getCoords(rank, 'coords') + ");\n        }\n        setOutput(val);\n      }\n    ";
        }
        return CumSumProgram;
    }());
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

    var DepthToSpaceProgram = (function () {
        function DepthToSpaceProgram(outputShape, blockSize, dataFormat) {
            this.variableNames = ['x'];
            this.outputShape = [];
            this.outputShape = outputShape;
            this.blockSize = blockSize;
            this.dataFormat = dataFormat;
            this.userCode = "\n    void main() {\n      ivec4 coords = getOutputCoords();\n      int b = coords[0];\n      int h = " + this.getHeightCoordString() + ";\n      int w = " + this.getWidthCoordString() + ";\n      int d = " + this.getDepthCoordString() + ";\n\n      int in_h = h / " + blockSize + ";\n      int offset_h = imod(h, " + blockSize + ");\n      int in_w = w / " + blockSize + ";\n      int offset_w = imod(w, " + blockSize + ");\n      int offset_d = (offset_h * " + blockSize + " + offset_w) *\n        " + this.getOutputDepthSize() + ";\n      int in_d = d + offset_d;\n\n      float result = " + this.getInputSamplingString() + ";\n      setOutput(result);\n    }\n  ";
        }
        DepthToSpaceProgram.prototype.getHeightCoordString = function () {
            if (this.dataFormat === 'NHWC') {
                return "coords[1]";
            }
            else {
                return "coords[2]";
            }
        };
        DepthToSpaceProgram.prototype.getWidthCoordString = function () {
            if (this.dataFormat === 'NHWC') {
                return "coords[2]";
            }
            else {
                return "coords[3]";
            }
        };
        DepthToSpaceProgram.prototype.getDepthCoordString = function () {
            if (this.dataFormat === 'NHWC') {
                return "coords[3]";
            }
            else {
                return "coords[1]";
            }
        };
        DepthToSpaceProgram.prototype.getOutputDepthSize = function () {
            if (this.dataFormat === 'NHWC') {
                return this.outputShape[3];
            }
            else {
                return this.outputShape[1];
            }
        };
        DepthToSpaceProgram.prototype.getInputSamplingString = function () {
            if (this.dataFormat === 'NHWC') {
                return "getX(b, in_h, in_w, in_d)";
            }
            else {
                return "getX(b, in_d, in_h, in_w)";
            }
        };
        return DepthToSpaceProgram;
    }());

    var EncodeFloatProgram = (function () {
        function EncodeFloatProgram(outputShape) {
            this.variableNames = ['A'];
            this.outputShape = outputShape;
            this.userCode = "\n      const float FLOAT_MAX = 1.70141184e38;\n      const float FLOAT_MIN = 1.17549435e-38;\n\n      lowp vec4 encode_float(highp float v) {\n        if (isNaN(v)) {\n          return vec4(255, 255, 255, 255);\n        }\n\n        highp float av = abs(v);\n\n        if(av < FLOAT_MIN) {\n          return vec4(0.0, 0.0, 0.0, 0.0);\n        } else if(v > FLOAT_MAX) {\n          return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n        } else if(v < -FLOAT_MAX) {\n          return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n        }\n\n        highp vec4 c = vec4(0,0,0,0);\n\n        highp float e = floor(log2(av));\n        highp float m = exp2(fract(log2(av))) - 1.0;\n\n        c[2] = floor(128.0 * m);\n        m -= c[2] / 128.0;\n        c[1] = floor(32768.0 * m);\n        m -= c[1] / 32768.0;\n        c[0] = floor(8388608.0 * m);\n\n        highp float ebias = e + 127.0;\n        c[3] = floor(ebias / 2.0);\n        ebias -= c[3] * 2.0;\n        c[2] += floor(ebias) * 128.0;\n\n        c[3] += 128.0 * step(0.0, -v);\n\n        return c / 255.0;\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        gl_FragColor = encode_float(x);\n      }\n    ";
        }
        return EncodeFloatProgram;
    }());

    var COMPLEX_FFT = {
        REAL: 'return real * expR - imag * expI;',
        IMAG: 'return real * expI + imag * expR;'
    };
    var FFTProgram = (function () {
        function FFTProgram(op, inputShape, inverse) {
            this.variableNames = ['real', 'imag'];
            var innerDim = inputShape[1];
            this.outputShape = inputShape;
            var exponentMultiplierSnippet = inverse ? "2.0 * " + Math.PI : "-2.0 * " + Math.PI;
            var resultDenominator = inverse ? innerDim + ".0" : '1.0';
            this.userCode = "\n      const float exponentMultiplier = " + exponentMultiplierSnippet + ";\n\n      float unaryOpComplex(float real, float expR, float imag, float expI) {\n        " + op + "\n      }\n\n      float mulMatDFT(int batch, int index) {\n        float indexRatio = float(index) / float(" + innerDim + ");\n        float exponentMultiplierTimesIndexRatio =\n            exponentMultiplier * indexRatio;\n\n        float result = 0.0;\n\n        for (int i = 0; i < " + innerDim + "; i++) {\n          // x = (-2|2 * PI / N) * index * i;\n          float x = exponentMultiplierTimesIndexRatio * float(i);\n          float expR = cos(x);\n          float expI = sin(x);\n          float real = getReal(batch, i);\n          float imag = getImag(batch, i);\n\n          result +=\n              unaryOpComplex(real, expR, imag, expI) / " + resultDenominator + ";\n        }\n\n        return result;\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        setOutput(mulMatDFT(coords[0], coords[1]));\n      }\n    ";
        }
        return FFTProgram;
    }());

    var FromPixelsProgram = (function () {
        function FromPixelsProgram(outputShape) {
            this.variableNames = ['A'];
            var height = outputShape[0], width = outputShape[1];
            this.outputShape = outputShape;
            this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + width + ".0, " + height + ".0);\n\n        vec4 values = texture2D(A, uv);\n        float value;\n        if (depth == 0) {\n          value = values.r;\n        } else if (depth == 1) {\n          value = values.g;\n        } else if (depth == 2) {\n          value = values.b;\n        } else if (depth == 3) {\n          value = values.a;\n        }\n\n        setOutput(floor(value * 255.0 + 0.5));\n      }\n    ";
        }
        return FromPixelsProgram;
    }());

    var GatherProgram = (function () {
        function GatherProgram(aShape, indicesLength, axis) {
            this.variableNames = ['A', 'indices'];
            var outputShape = aShape.slice();
            outputShape[axis] = indicesLength;
            this.outputShape = outputShape;
            this.rank = outputShape.length;
            var dtype = getCoordsDataType(this.rank);
            var sourceCoords = getSourceCoords(aShape, axis);
            this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
        }
        return GatherProgram;
    }());
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

    var GatherNDProgram = (function () {
        function GatherNDProgram(sliceDim, strides, shape) {
            this.sliceDim = sliceDim;
            this.strides = strides;
            this.variableNames = ['x', 'indices'];
            this.outputShape = shape;
            var stridesType = getCoordsDataType(strides.length);
            var dtype = getCoordsDataType(shape.length);
            var strideString = this.sliceDim > 1 ? 'strides[j]' : 'strides';
            this.userCode = "\n        " + stridesType + " strides = " + stridesType + "(" + this.strides + ");\n         void main() {\n          " + dtype + " coords = getOutputCoords();\n          int flattenIndex = 0;\n          for (int j = 0; j < " + this.sliceDim + "; j++) {\n            int index = round(getIndices(coords[0], j));\n            flattenIndex += index * " + strideString + ";\n          }\n          setOutput(getX(flattenIndex, coords[1]));\n        }\n      ";
        }
        return GatherNDProgram;
    }());

    var TextureUsage;
    (function (TextureUsage) {
        TextureUsage[TextureUsage["RENDER"] = 0] = "RENDER";
        TextureUsage[TextureUsage["UPLOAD"] = 1] = "UPLOAD";
        TextureUsage[TextureUsage["PIXELS"] = 2] = "PIXELS";
        TextureUsage[TextureUsage["DOWNLOAD"] = 3] = "DOWNLOAD";
    })(TextureUsage || (TextureUsage = {}));
    var PhysicalTextureType;
    (function (PhysicalTextureType) {
        PhysicalTextureType[PhysicalTextureType["UNPACKED_FLOAT16"] = 0] = "UNPACKED_FLOAT16";
        PhysicalTextureType[PhysicalTextureType["UNPACKED_FLOAT32"] = 1] = "UNPACKED_FLOAT32";
        PhysicalTextureType[PhysicalTextureType["PACKED_4X1_UNSIGNED_BYTE"] = 2] = "PACKED_4X1_UNSIGNED_BYTE";
        PhysicalTextureType[PhysicalTextureType["PACKED_2X2_FLOAT32"] = 3] = "PACKED_2X2_FLOAT32";
        PhysicalTextureType[PhysicalTextureType["PACKED_2X2_FLOAT16"] = 4] = "PACKED_2X2_FLOAT16";
    })(PhysicalTextureType || (PhysicalTextureType = {}));
    function getUnpackedMatrixTextureShapeWidthHeight(rows, columns) {
        return [columns, rows];
    }
    function getUnpackedArraySizeFromMatrixSize(matrixSize, channelsPerTexture) {
        return matrixSize * channelsPerTexture;
    }
    function getMatrixSizeFromUnpackedArraySize(unpackedSize, channelsPerTexture) {
        if (unpackedSize % channelsPerTexture !== 0) {
            throw new Error("unpackedSize (" + unpackedSize + ") must be a multiple of " +
                ("" + channelsPerTexture));
        }
        return unpackedSize / channelsPerTexture;
    }
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
    function getPackedMatrixTextureShapeWidthHeight(rows, columns) {
        return [Math.ceil(columns / 2), Math.ceil(rows / 2)];
    }
    function getPackedRGBAArraySizeFromMatrixShape(rows, columns) {
        var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
        return w * h * 4;
    }
    function encodeMatrixToPackedRGBA(matrix, batches, rows, columns, packedRGBA) {
        var requiredSize = getPackedRGBAArraySizeFromMatrixShape(rows, columns);
        if (packedRGBA.length < requiredSize) {
            throw new Error("packedRGBA length (" + packedRGBA.length + ") must be >=\n        " + requiredSize);
        }
        var oddWidth = (columns % 2) === 1;
        var oddHeight = (rows % 2) === 1;
        var widthInFullBlocks = Math.floor(columns / 2);
        var heightInFullBlocks = Math.floor(rows / 2);
        var texelsPerRow = Math.ceil(columns / 2);
        var texelsPerBatch = texelsPerRow * Math.ceil(rows / 2);
        var flattenedMatrixSize = nearestLargerEven(rows) * nearestLargerEven(columns);
        for (var batch = 0; batch < batches; batch++) {
            var sourceOffset = batch * rows * columns;
            var batchOffset = batch * flattenedMatrixSize;
            {
                var dstStride = (oddWidth ? 4 : 0);
                var oneRow = columns;
                var dst = batchOffset;
                for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
                    var matrixSrcRow = (blockY * 2 * columns);
                    for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                        var matrixSrcCol = blockX * 2;
                        var src = sourceOffset + matrixSrcRow + matrixSrcCol;
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
                var src = sourceOffset + columns - 1;
                var dst = batchOffset + (texelsPerRow - 1) * 4;
                var srcStride = 2 * columns;
                var dstStride = texelsPerRow * 4;
                for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
                    packedRGBA[dst] = matrix[src];
                    packedRGBA[dst + 2] = matrix[src + columns];
                    src += srcStride;
                    dst += dstStride;
                }
            }
            if (oddHeight) {
                var src = sourceOffset + (rows - 1) * columns;
                var dst = batchOffset + (texelsPerBatch - texelsPerRow) * 4;
                for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                    packedRGBA[dst++] = matrix[src++];
                    packedRGBA[dst++] = matrix[src++];
                    dst += 2;
                }
                if (oddWidth && oddHeight) {
                    packedRGBA[batchOffset + flattenedMatrixSize - 4] = matrix[src];
                }
            }
        }
        return packedRGBA;
    }
    function decodeMatrixFromPackedRGBA(packedRGBA, batches, rows, columns, matrix) {
        var requiredSize = rows * columns;
        if (matrix.length < requiredSize) {
            throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
        }
        var oddWidth = (columns % 2) === 1;
        var oddHeight = (rows % 2) === 1;
        var widthInFullBlocks = Math.floor(columns / 2);
        var heightInFullBlocks = Math.floor(rows / 2);
        var texelsPerRow = Math.ceil(columns / 2);
        var texelsPerBatch = texelsPerRow * Math.ceil(rows / 2);
        var flattenedMatrixSize = nearestLargerEven(rows) * nearestLargerEven(columns);
        for (var batch = 0; batch < batches; batch++) {
            var batchOffset = batch * rows * columns;
            var sourceOffset = batch * flattenedMatrixSize;
            {
                var srcStride = oddWidth ? 4 : 0;
                var dstStride = columns + (oddWidth ? 1 : 0);
                var src = sourceOffset;
                var dstRow1 = batchOffset;
                var dstRow2 = batchOffset + columns;
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
                var src = sourceOffset + (texelsPerRow - 1) * 4;
                var dst = batchOffset + columns - 1;
                var srcStride = texelsPerRow * 4;
                var dstStride = 2 * columns;
                for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
                    matrix[dst] = packedRGBA[src];
                    matrix[dst + columns] = packedRGBA[src + 2];
                    src += srcStride;
                    dst += dstStride;
                }
            }
            if (oddHeight) {
                var src = sourceOffset + (texelsPerBatch - texelsPerRow) * 4;
                var dst = batchOffset + (rows - 1) * columns;
                for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                    matrix[dst++] = packedRGBA[src++];
                    matrix[dst++] = packedRGBA[src++];
                    src += 2;
                }
                if (oddWidth) {
                    matrix[batchOffset + (rows * columns) - 1] = packedRGBA[src];
                }
            }
        }
        return matrix;
    }

    function callAndCheck(gl, func) {
        var returnValue = func();
        checkWebGLError(gl);
        return returnValue;
    }
    var webGLDebugErrorCheckingEnabled = false;
    function enableDebugWebGLErrorChecking(enabled) {
        webGLDebugErrorCheckingEnabled = enabled;
    }
    function checkWebGLError(gl) {
        if (webGLDebugErrorCheckingEnabled) {
            var error = gl.getError();
            if (error !== gl.NO_ERROR) {
                throw new Error('WebGL Error: ' + getWebGLErrorMessage(gl, error));
            }
        }
    }
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
    function getExtensionOrThrow(gl, extensionName) {
        return throwIfNull(gl, function () { return gl.getExtension(extensionName); }, 'Extension "' + extensionName + '" not supported on this browser.');
    }
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
            return rightPad((lineNumber + 1).toString(), pad) + line;
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
        console.log("%c " + rightPad(errorLine[0], maxLineLength), 'border:1px solid red; background-color:#e3d2d2; color:#a61717');
        console.log(afterErrorLines.join('\n'));
    }
    function createProgram(gl) {
        return throwIfNull(gl, function () { return gl.createProgram(); }, 'Unable to create WebGLProgram.');
    }
    function linkProgram(gl, program) {
        callAndCheck(gl, function () { return gl.linkProgram(program); });
        if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
            console.log(gl.getProgramInfoLog(program));
            throw new Error('Failed to link vertex and fragment shaders.');
        }
    }
    function validateProgram(gl, program) {
        callAndCheck(gl, function () { return gl.validateProgram(program); });
        if (gl.getProgramParameter(program, gl.VALIDATE_STATUS) === false) {
            console.log(gl.getProgramInfoLog(program));
            throw new Error('Shader program validation failed.');
        }
    }
    function createStaticVertexBuffer(gl, data) {
        var buffer = throwIfNull(gl, function () { return gl.createBuffer(); }, 'Unable to create WebGLBuffer');
        callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, buffer); });
        callAndCheck(gl, function () { return gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); });
        return buffer;
    }
    function createStaticIndexBuffer(gl, data) {
        var buffer = throwIfNull(gl, function () { return gl.createBuffer(); }, 'Unable to create WebGLBuffer');
        callAndCheck(gl, function () { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer); });
        callAndCheck(gl, function () { return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW); });
        return buffer;
    }
    function getNumChannels() {
        if (ENV.get('WEBGL_VERSION') === 2) {
            return 1;
        }
        return 4;
    }
    function createTexture(gl) {
        return throwIfNull(gl, function () { return gl.createTexture(); }, 'Unable to create WebGLTexture.');
    }
    function validateTextureSize(width, height) {
        var maxTextureSize = ENV.get('WEBGL_MAX_TEXTURE_SIZE');
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
    function createFramebuffer(gl) {
        return throwIfNull(gl, function () { return gl.createFramebuffer(); }, 'Unable to create WebGLFramebuffer.');
    }
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
    function bindTextureUnit(gl, texture, textureUnit) {
        validateTextureUnit(gl, textureUnit);
        callAndCheck(gl, function () { return gl.activeTexture(gl.TEXTURE0 + textureUnit); });
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    }
    function unbindTextureUnit(gl, textureUnit) {
        validateTextureUnit(gl, textureUnit);
        callAndCheck(gl, function () { return gl.activeTexture(gl.TEXTURE0 + textureUnit); });
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
    }
    function getProgramUniformLocationOrThrow(gl, program, uniformName) {
        return throwIfNull(gl, function () { return gl.getUniformLocation(program, uniformName); }, 'uniform "' + uniformName + '" not present in program.');
    }
    function getProgramUniformLocation(gl, program, uniformName) {
        return gl.getUniformLocation(program, uniformName);
    }
    function bindTextureToProgramUniformSampler(gl, program, texture, uniformSamplerLocation, textureUnit) {
        callAndCheck(gl, function () { return bindTextureUnit(gl, texture, textureUnit); });
        callAndCheck(gl, function () { return gl.uniform1i(uniformSamplerLocation, textureUnit); });
    }
    function bindCanvasToFramebuffer(gl) {
        callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, null); });
        callAndCheck(gl, function () { return gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); });
        callAndCheck(gl, function () { return gl.scissor(0, 0, gl.canvas.width, gl.canvas.height); });
    }
    function bindColorTextureToFramebuffer(gl, texture, framebuffer) {
        callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); });
        callAndCheck(gl, function () { return gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0); });
    }
    function unbindColorTextureFromFramebuffer(gl, framebuffer) {
        callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); });
        callAndCheck(gl, function () { return gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0); });
    }
    function validateFramebuffer(gl) {
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            throw new Error('Error binding framebuffer: ' + getFramebufferErrorMessage(gl, status));
        }
    }
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
    function getTextureShapeFromLogicalShape(logShape, isPacked) {
        if (isPacked === void 0) { isPacked = false; }
        var maxTexSize = ENV.get('WEBGL_MAX_TEXTURE_SIZE');
        if (isPacked) {
            maxTexSize = maxTexSize * 2;
            logShape = logShape.map(function (d, i) { return i >= logShape.length - 2 ?
                nearestLargerEven(logShape[i]) :
                logShape[i]; });
        }
        if (logShape.length !== 2) {
            var squeezeResult = squeezeShape(logShape);
            logShape = squeezeResult.newShape;
        }
        var size = sizeFromShape(logShape);
        if (logShape.length <= 1 && size <= maxTexSize) {
            if (isPacked) {
                return [1, size];
            }
            return [size, 1];
        }
        else if (logShape.length === 2 && logShape[0] <= maxTexSize &&
            logShape[1] <= maxTexSize) {
            return logShape;
        }
        else if (logShape.length === 3 && logShape[0] * logShape[1] <= maxTexSize &&
            logShape[2] <= maxTexSize) {
            return [logShape[0] * logShape[1], logShape[2]];
        }
        else if (logShape.length === 3 && logShape[0] <= maxTexSize &&
            logShape[1] * logShape[2] <= maxTexSize) {
            return [logShape[0], logShape[1] * logShape[2]];
        }
        else if (logShape.length === 4 &&
            logShape[0] * logShape[1] * logShape[2] <= maxTexSize &&
            logShape[3] <= maxTexSize) {
            return [logShape[0] * logShape[1] * logShape[2], logShape[3]];
        }
        else if (logShape.length === 4 && logShape[0] <= maxTexSize &&
            logShape[1] * logShape[2] * logShape[3] <= maxTexSize) {
            return [logShape[0], logShape[1] * logShape[2] * logShape[3]];
        }
        else {
            return sizeToSquarishShape(size);
        }
    }

    var webgl_util = /*#__PURE__*/Object.freeze({
        callAndCheck: callAndCheck,
        enableDebugWebGLErrorChecking: enableDebugWebGLErrorChecking,
        checkWebGLError: checkWebGLError,
        getWebGLErrorMessage: getWebGLErrorMessage,
        getExtensionOrThrow: getExtensionOrThrow,
        createVertexShader: createVertexShader,
        createFragmentShader: createFragmentShader,
        createProgram: createProgram,
        linkProgram: linkProgram,
        validateProgram: validateProgram,
        createStaticVertexBuffer: createStaticVertexBuffer,
        createStaticIndexBuffer: createStaticIndexBuffer,
        getNumChannels: getNumChannels,
        createTexture: createTexture,
        validateTextureSize: validateTextureSize,
        createFramebuffer: createFramebuffer,
        bindVertexBufferToProgramAttribute: bindVertexBufferToProgramAttribute,
        bindTextureUnit: bindTextureUnit,
        unbindTextureUnit: unbindTextureUnit,
        getProgramUniformLocationOrThrow: getProgramUniformLocationOrThrow,
        getProgramUniformLocation: getProgramUniformLocation,
        bindTextureToProgramUniformSampler: bindTextureToProgramUniformSampler,
        bindCanvasToFramebuffer: bindCanvasToFramebuffer,
        bindColorTextureToFramebuffer: bindColorTextureToFramebuffer,
        unbindColorTextureFromFramebuffer: unbindColorTextureFromFramebuffer,
        validateFramebuffer: validateFramebuffer,
        getFramebufferErrorMessage: getFramebufferErrorMessage,
        getTextureShapeFromLogicalShape: getTextureShapeFromLogicalShape
    });

    function createVertexShader$1(gl) {
        var vertexShaderSource = "\n    precision highp float;\n    attribute vec3 clipSpacePos;\n    attribute vec2 uv;\n    varying vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }";
        return createVertexShader(gl, vertexShaderSource);
    }
    function createVertexBuffer(gl) {
        var vertexArray = new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]);
        return createStaticVertexBuffer(gl, vertexArray);
    }
    function createIndexBuffer(gl) {
        var triangleVertexIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
        return createStaticIndexBuffer(gl, triangleVertexIndices);
    }
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
        if (ENV.get('WEBGL_VERSION') === 2) {
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
    function createAndConfigureTexture(gl, width, height, internalFormat, textureFormat, textureType) {
        validateTextureSize(width, height);
        var texture = createTexture(gl);
        var tex2d = gl.TEXTURE_2D;
        callAndCheck(gl, function () { return gl.bindTexture(tex2d, texture); });
        callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); });
        callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); });
        callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MIN_FILTER, gl.NEAREST); });
        callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MAG_FILTER, gl.NEAREST); });
        callAndCheck(gl, function () { return gl.texImage2D(tex2d, 0, internalFormat, width, height, 0, textureFormat, textureType, null); });
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
        return texture;
    }
    function createFloat32MatrixTexture(gl, rows, columns, textureConfig) {
        var _a = getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatFloat, textureConfig.textureFormatFloat, gl.FLOAT);
    }
    function createFloat16MatrixTexture(gl, rows, columns, textureConfig) {
        var _a = getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatFloat, textureConfig.textureFormatFloat, textureConfig.textureTypeHalfFloat);
    }
    function createUnsignedBytesMatrixTexture(gl, rows, columns, textureConfig) {
        var _a = getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        return createAndConfigureTexture(gl, width, height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
    }
    function createPackedMatrixTexture(gl, rows, columns, textureConfig) {
        var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatPackedFloat, gl.RGBA, gl.FLOAT);
    }
    function createFloat16PackedMatrixTexture(gl, rows, columns, textureConfig) {
        var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatHalfFloat, gl.RGBA, textureConfig.textureTypeHalfFloat);
    }
    function bindVertexProgramAttributeStreams(gl, program, vertexBuffer) {
        var posOffset = 0;
        var uvOffset = 3 * 4;
        var stride = (3 * 4) + (2 * 4);
        callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); });
        var success = bindVertexBufferToProgramAttribute(gl, program, 'clipSpacePos', vertexBuffer, 3, stride, posOffset);
        return success &&
            bindVertexBufferToProgramAttribute(gl, program, 'uv', vertexBuffer, 2, stride, uvOffset);
    }
    function uploadPixelDataToTexture(gl, texture, pixels) {
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
        callAndCheck(gl, function () { return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels); });
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
    }
    function uploadDataToTexture(gl, texture, width, height, data, textureFormat) {
        validateTextureSize(width, height);
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
        callAndCheck(gl, function () { return gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, textureFormat, gl.FLOAT, data); });
        callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
    }
    function uploadMatrixToTexture(gl, texture, rows, columns, matrix, numChannels, textureConfig) {
        var _a = getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
        var unpackedArray;
        if (textureConfig.defaultNumChannels === 1) {
            unpackedArray = matrix;
        }
        else {
            unpackedArray =
                new Float32Array(getUnpackedArraySizeFromMatrixSize(matrix.length, numChannels));
            encodeMatrixToUnpackedArray(matrix, unpackedArray, numChannels);
        }
        uploadDataToTexture(gl, texture, w, h, unpackedArray, textureConfig.textureFormatFloat);
    }
    function uploadMatrixToPackedTexture(gl, texture, batch, rows, columns, matrix, textureConfig) {
        var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
        var packedRGBA = new Float32Array(batch * getPackedRGBAArraySizeFromMatrixShape(rows, columns));
        encodeMatrixToPackedRGBA(matrix, batch, rows, columns, packedRGBA);
        uploadDataToTexture(gl, texture, w, batch * h, packedRGBA, gl.RGBA);
    }
    function maybeCreateBufferFromOutputTexture(gl, texture, rows, columns, textureConfig) {
        var bufferOrTexture = texture;
        if (ENV.get('WEBGL_VERSION') === 2) {
            var gl2_1 = gl;
            var buffer_1 = gl2_1.createBuffer();
            callAndCheck(gl, function () { return gl.bindBuffer(gl2_1.PIXEL_PACK_BUFFER, buffer_1); });
            var bytesPerFloat = 4;
            var bufferSizeBytes_1 = bytesPerFloat *
                getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels);
            callAndCheck(gl, function () { return gl.bufferData(gl2_1.PIXEL_PACK_BUFFER, bufferSizeBytes_1, gl.STATIC_DRAW); });
            callAndCheck(gl, function () { return gl2_1.readPixels(0, 0, columns, rows, gl.RGBA, gl.FLOAT, 0); });
            callAndCheck(gl, function () { return gl.bindBuffer(gl2_1.PIXEL_PACK_BUFFER, null); });
            bufferOrTexture = buffer_1;
        }
        return bufferOrTexture;
    }
    function downloadFloat32MatrixFromBuffer(gl, buffer, rows, columns, textureConfig) {
        var gl2 = gl;
        var downloadTarget = new Float32Array(getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels));
        gl2.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl2.getBufferSubData(gl.ARRAY_BUFFER, 0, downloadTarget);
        gl2.bindBuffer(gl.ARRAY_BUFFER, null);
        var matrix = new Float32Array(rows * columns);
        decodeMatrixFromUnpackedArray(downloadTarget, matrix, textureConfig.downloadUnpackNumChannels);
        return matrix;
    }
    function downloadFloat32MatrixFromOutputTexture(gl, rows, columns, textureConfig) {
        var _a = getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
        var downloadTarget = new Float32Array(getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels));
        callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, textureConfig.downloadTextureFormat, gl.FLOAT, downloadTarget); });
        var matrix = new Float32Array(rows * columns);
        decodeMatrixFromUnpackedArray(downloadTarget, matrix, textureConfig.downloadUnpackNumChannels);
        return matrix;
    }
    function downloadByteEncodedFloatMatrixFromOutputTexture(gl, rows, columns, textureConfig) {
        var _a = getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
        var numChannels = 4;
        var downloadTarget = new Uint8Array(getUnpackedArraySizeFromMatrixSize(rows * columns, numChannels));
        callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, textureConfig.downloadTextureFormat, gl.UNSIGNED_BYTE, downloadTarget); });
        return new Float32Array(downloadTarget.buffer);
    }
    function downloadMatrixFromPackedOutputTexture(gl, batch, rows, cols, physicalRows, physicalCols, textureConfig) {
        var _a = getPackedMatrixTextureShapeWidthHeight(physicalRows, physicalCols), w = _a[0], h = _a[1];
        var packedRGBA = new Float32Array(getPackedRGBAArraySizeFromMatrixShape(physicalRows, physicalCols));
        callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, packedRGBA); });
        var matrix = new Float32Array(sizeFromShape([batch, rows, cols]));
        return decodeMatrixFromPackedRGBA(packedRGBA, batch, rows, cols, matrix);
    }

    var gpgpu_util = /*#__PURE__*/Object.freeze({
        createVertexShader: createVertexShader$1,
        createVertexBuffer: createVertexBuffer,
        createIndexBuffer: createIndexBuffer,
        getTextureConfig: getTextureConfig,
        createFloat32MatrixTexture: createFloat32MatrixTexture,
        createFloat16MatrixTexture: createFloat16MatrixTexture,
        createUnsignedBytesMatrixTexture: createUnsignedBytesMatrixTexture,
        createPackedMatrixTexture: createPackedMatrixTexture,
        createFloat16PackedMatrixTexture: createFloat16PackedMatrixTexture,
        bindVertexProgramAttributeStreams: bindVertexProgramAttributeStreams,
        uploadPixelDataToTexture: uploadPixelDataToTexture,
        uploadMatrixToTexture: uploadMatrixToTexture,
        uploadMatrixToPackedTexture: uploadMatrixToPackedTexture,
        maybeCreateBufferFromOutputTexture: maybeCreateBufferFromOutputTexture,
        downloadFloat32MatrixFromBuffer: downloadFloat32MatrixFromBuffer,
        downloadFloat32MatrixFromOutputTexture: downloadFloat32MatrixFromOutputTexture,
        downloadByteEncodedFloatMatrixFromOutputTexture: downloadByteEncodedFloatMatrixFromOutputTexture,
        downloadMatrixFromPackedOutputTexture: downloadMatrixFromPackedOutputTexture
    });

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
                this.gl = getWebGLContext(ENV.get('WEBGL_VERSION'));
            }
            if (ENV.get('WEBGL_VERSION') === 1) {
                this.textureFloatExtension =
                    getExtensionOrThrow(this.gl, 'OES_texture_float');
                this.colorBufferFloatExtension =
                    this.gl.getExtension('WEBGL_color_buffer_float');
                if (!ENV.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
                    this.textureHalfFloatExtension =
                        getExtensionOrThrow(this.gl, 'OES_texture_half_float');
                    this.colorBufferHalfFloatExtension =
                        this.gl.getExtension('EXT_color_buffer_half_float');
                }
            }
            else {
                this.colorBufferFloatExtension =
                    getExtensionOrThrow(this.gl, 'EXT_color_buffer_float');
            }
            this.vertexBuffer = createVertexBuffer(this.gl);
            this.indexBuffer = createIndexBuffer(this.gl);
            this.framebuffer = createFramebuffer(this.gl);
            this.textureConfig =
                getTextureConfig(this.gl, this.textureHalfFloatExtension);
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
            callAndCheck(gl, function () { return gl.finish(); });
            callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, null); });
            callAndCheck(gl, function () { return gl.deleteFramebuffer(_this.framebuffer); });
            callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, null); });
            callAndCheck(gl, function () { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); });
            callAndCheck(gl, function () { return gl.deleteBuffer(_this.indexBuffer); });
            this.disposed = true;
        };
        GPGPUContext.prototype.enableAutomaticDebugValidation = function (enabled) {
            this.autoDebugValidate = enabled;
            enableDebugWebGLErrorChecking(enabled);
        };
        GPGPUContext.prototype.createFloat32MatrixTexture = function (rows, columns) {
            this.throwIfDisposed();
            return createFloat32MatrixTexture(this.gl, rows, columns, this.textureConfig);
        };
        GPGPUContext.prototype.createFloat16MatrixTexture = function (rows, columns) {
            this.throwIfDisposed();
            return createFloat16MatrixTexture(this.gl, rows, columns, this.textureConfig);
        };
        GPGPUContext.prototype.createUnsignedBytesMatrixTexture = function (rows, columns) {
            this.throwIfDisposed();
            return createUnsignedBytesMatrixTexture(this.gl, rows, columns, this.textureConfig);
        };
        GPGPUContext.prototype.uploadPixelDataToTexture = function (texture, pixels) {
            this.throwIfDisposed();
            uploadPixelDataToTexture(this.gl, texture, pixels);
        };
        GPGPUContext.prototype.createFloat16PackedMatrixTexture = function (rows, columns) {
            this.throwIfDisposed();
            return createFloat16PackedMatrixTexture(this.gl, rows, columns, this.textureConfig);
        };
        GPGPUContext.prototype.createPackedMatrixTexture = function (rows, columns) {
            this.throwIfDisposed();
            return createPackedMatrixTexture(this.gl, rows, columns, this.textureConfig);
        };
        GPGPUContext.prototype.deleteMatrixTexture = function (texture) {
            var _this = this;
            this.throwIfDisposed();
            if (this.outputTexture === texture) {
                unbindColorTextureFromFramebuffer(this.gl, this.framebuffer);
                this.outputTexture = null;
            }
            callAndCheck(this.gl, function () { return _this.gl.deleteTexture(texture); });
        };
        GPGPUContext.prototype.uploadMatrixToTexture = function (texture, rows, columns, matrix) {
            this.throwIfDisposed();
            var numChannels = getNumChannels();
            return uploadMatrixToTexture(this.gl, texture, rows, columns, matrix, numChannels, this.textureConfig);
        };
        GPGPUContext.prototype.uploadMatrixToPackedTexture = function (texture, batch, rows, columns, matrix) {
            this.throwIfDisposed();
            return uploadMatrixToPackedTexture(this.gl, texture, batch, rows, columns, matrix, this.textureConfig);
        };
        GPGPUContext.prototype.downloadFloat32MatrixFromOutputTexture = function (texture, rows, columns) {
            var _this = this;
            return this.downloadMatrixDriver(texture, function () { return downloadFloat32MatrixFromOutputTexture(_this.gl, rows, columns, _this.textureConfig); });
        };
        GPGPUContext.prototype.downloadByteEncodedFloatMatrixFromOutputTexture = function (texture, rows, columns) {
            var _this = this;
            return this.downloadMatrixDriver(texture, function () { return downloadByteEncodedFloatMatrixFromOutputTexture(_this.gl, rows, columns, _this.textureConfig); });
        };
        GPGPUContext.prototype.downloadFloat32MatrixFromBuffer = function (buffer, rows, columns) {
            return downloadFloat32MatrixFromBuffer(this.gl, buffer, rows, columns, this.textureConfig);
        };
        GPGPUContext.prototype.maybeCreateBufferFromTexture = function (texture, rows, columns) {
            this.bindTextureToFrameBuffer(texture);
            var result = maybeCreateBufferFromOutputTexture(this.gl, texture, rows, columns, this.textureConfig);
            this.unbindTextureToFrameBuffer();
            return result;
        };
        GPGPUContext.prototype.createAndWaitForFence = function () {
            var fenceContext = this.createFence(this.gl);
            return this.pollFence(fenceContext);
        };
        GPGPUContext.prototype.createFence = function (gl) {
            var _this = this;
            var query;
            var isFencePassed;
            if (ENV.get('WEBGL_FENCE_API_ENABLED')) {
                var gl2_1 = gl;
                var sync_1 = gl2_1.fenceSync(gl2_1.SYNC_GPU_COMMANDS_COMPLETE, 0);
                gl.flush();
                isFencePassed = function () {
                    var status = gl2_1.clientWaitSync(sync_1, 0, 0);
                    return status === gl2_1.ALREADY_SIGNALED ||
                        status === gl2_1.CONDITION_SATISFIED;
                };
                query = sync_1;
            }
            else if (ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
                query = this.beginQuery();
                this.endQuery();
                isFencePassed = function () { return _this.isQueryAvailable(query, ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')); };
            }
            else {
                isFencePassed = function () { return true; };
            }
            return { query: query, isFencePassed: isFencePassed };
        };
        GPGPUContext.prototype.downloadMatrixFromPackedTexture = function (texture, batch, rows, columns, physicalRows, physicalCols) {
            var _this = this;
            return this.downloadMatrixDriver(texture, function () { return downloadMatrixFromPackedOutputTexture(_this.gl, batch, rows, columns, physicalRows, physicalCols, _this.textureConfig); });
        };
        GPGPUContext.prototype.createProgram = function (fragmentShaderSource) {
            this.throwIfDisposed();
            var gl = this.gl;
            var fragmentShader = createFragmentShader(gl, fragmentShaderSource);
            var vertexShader = createVertexShader$1(gl);
            var program = createProgram(gl);
            callAndCheck(gl, function () { return gl.attachShader(program, vertexShader); });
            callAndCheck(gl, function () { return gl.attachShader(program, fragmentShader); });
            linkProgram(gl, program);
            if (this.autoDebugValidate) {
                validateProgram(gl, program);
            }
            if (!this.vertexAttrsAreBound) {
                this.setProgram(program);
                this.vertexAttrsAreBound = bindVertexProgramAttributeStreams(gl, this.program, this.vertexBuffer);
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
                callAndCheck(this.gl, function () { return _this.gl.deleteProgram(program); });
            }
        };
        GPGPUContext.prototype.setProgram = function (program) {
            var _this = this;
            this.throwIfDisposed();
            this.program = program;
            if ((this.program != null) && this.autoDebugValidate) {
                validateProgram(this.gl, this.program);
            }
            callAndCheck(this.gl, function () { return _this.gl.useProgram(program); });
        };
        GPGPUContext.prototype.getUniformLocation = function (program, uniformName, shouldThrow) {
            if (shouldThrow === void 0) { shouldThrow = true; }
            this.throwIfDisposed();
            if (shouldThrow) {
                return getProgramUniformLocationOrThrow(this.gl, program, uniformName);
            }
            else {
                return getProgramUniformLocation(this.gl, program, uniformName);
            }
        };
        GPGPUContext.prototype.getAttributeLocation = function (program, attribute) {
            var _this = this;
            this.throwIfDisposed();
            return callAndCheck(this.gl, function () { return _this.gl.getAttribLocation(program, attribute); });
        };
        GPGPUContext.prototype.getUniformLocationNoThrow = function (program, uniformName) {
            this.throwIfDisposed();
            return this.gl.getUniformLocation(program, uniformName);
        };
        GPGPUContext.prototype.setInputMatrixTexture = function (inputMatrixTexture, uniformLocation, textureUnit) {
            this.throwIfDisposed();
            this.throwIfNoProgram();
            bindTextureToProgramUniformSampler(this.gl, this.program, inputMatrixTexture, uniformLocation, textureUnit);
        };
        GPGPUContext.prototype.setOutputMatrixTexture = function (outputMatrixTexture, rows, columns) {
            this.setOutputMatrixTextureDriver(outputMatrixTexture, columns, rows);
        };
        GPGPUContext.prototype.setOutputPackedMatrixTexture = function (outputPackedMatrixTexture, rows, columns) {
            this.throwIfDisposed();
            var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
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
                validateProgram(this.gl, this.program);
            }
            validateFramebuffer(this.gl);
        };
        GPGPUContext.prototype.executeProgram = function () {
            this.throwIfDisposed();
            this.throwIfNoProgram();
            var gl = this.gl;
            if (this.autoDebugValidate) {
                this.debugValidate();
            }
            callAndCheck(gl, function () { return gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); });
        };
        GPGPUContext.prototype.blockUntilAllProgramsCompleted = function () {
            var _this = this;
            this.throwIfDisposed();
            callAndCheck(this.gl, function () { return _this.gl.finish(); });
        };
        GPGPUContext.prototype.getQueryTimerExtension = function () {
            if (this.disjointQueryTimerExtension == null) {
                this.disjointQueryTimerExtension =
                    getExtensionOrThrow(this.gl, ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2 ?
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
        GPGPUContext.prototype.beginQuery = function () {
            if (ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2) {
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
            if (ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2) {
                var gl2 = this.gl;
                var ext_2 = this.getQueryTimerExtensionWebGL2();
                gl2.endQuery(ext_2.TIME_ELAPSED_EXT);
                return;
            }
            var ext = this.getQueryTimerExtensionWebGL1();
            ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
        };
        GPGPUContext.prototype.waitForQueryAndGetTime = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, repeatedTry(function () { return _this.disposed ||
                                _this.isQueryAvailable(query, ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION')); })];
                        case 1:
                            _a.sent();
                            return [2, this.getQueryTime(query, ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION'))];
                    }
                });
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
        GPGPUContext.prototype.pollFence = function (fenceContext) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.addItemToPoll(function () { return fenceContext.isFencePassed(); }, function () { return resolve(); });
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
            repeatedTry(function () {
                _this.pollItems();
                return _this.itemsToPoll.length === 0;
            });
        };
        GPGPUContext.prototype.bindTextureToFrameBuffer = function (texture) {
            this.throwIfDisposed();
            bindColorTextureToFramebuffer(this.gl, texture, this.framebuffer);
            if (this.autoDebugValidate) {
                validateFramebuffer(this.gl);
            }
        };
        GPGPUContext.prototype.unbindTextureToFrameBuffer = function () {
            if (this.outputTexture != null) {
                bindColorTextureToFramebuffer(this.gl, this.outputTexture, this.framebuffer);
                if (this.autoDebugValidate) {
                    validateFramebuffer(this.gl);
                }
            }
            else {
                unbindColorTextureFromFramebuffer(this.gl, this.framebuffer);
            }
        };
        GPGPUContext.prototype.downloadMatrixDriver = function (texture, downloadAndDecode) {
            this.bindTextureToFrameBuffer(texture);
            var result = downloadAndDecode();
            this.unbindTextureToFrameBuffer();
            return result;
        };
        GPGPUContext.prototype.setOutputMatrixTextureDriver = function (outputMatrixTextureMaybePacked, width, height) {
            this.throwIfDisposed();
            var gl = this.gl;
            bindColorTextureToFramebuffer(gl, outputMatrixTextureMaybePacked, this.framebuffer);
            if (this.autoDebugValidate) {
                validateFramebuffer(gl);
            }
            this.outputTexture = outputMatrixTextureMaybePacked;
            callAndCheck(gl, function () { return gl.viewport(0, 0, width, height); });
            callAndCheck(gl, function () { return gl.scissor(0, 0, width, height); });
        };
        GPGPUContext.prototype.setOutputMatrixWriteRegionDriver = function (x, y, width, height) {
            var _this = this;
            this.throwIfDisposed();
            callAndCheck(this.gl, function () { return _this.gl.scissor(x, y, width, height); });
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

    function compileProgram(gpgpu, program, inputs, output) {
        var userCode = program.userCode;
        var inputInfos = inputs.map(function (input, i) {
            var shapeInfo = {
                logicalShape: input.shape,
                texShape: input.isUniform ? null : input.texData.texShape,
                isUniform: input.isUniform,
                isPacked: input.isUniform ? false : input.texData.isPacked
            };
            return { name: program.variableNames[i], shapeInfo: shapeInfo };
        });
        var inShapeInfos = inputInfos.map(function (x) { return x.shapeInfo; });
        var outShapeInfo = {
            logicalShape: output.shape,
            texShape: output.texData.texShape,
            isUniform: false,
            isPacked: output.texData.isPacked
        };
        var source = makeShader(inputInfos, outShapeInfo, userCode, program.supportsBroadcasting === true);
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
    function validateBinaryAndProgram(shapeInfos, inputs) {
        if (shapeInfos.length !== inputs.length) {
            throw Error("Binary was compiled with " + shapeInfos.length + " inputs, but " +
                ("was executed with " + inputs.length + " inputs"));
        }
        shapeInfos.forEach(function (s, i) {
            var shapeA = s.logicalShape;
            var input = inputs[i];
            var shapeB = input.shape;
            if (!arraysEqual(shapeA, shapeB)) {
                throw Error("Binary was compiled with different shapes than " +
                    ("the current args. Shapes " + shapeA + " and " + shapeB + " must match"));
            }
            if (s.isUniform && input.isUniform) {
                return;
            }
            var texShapeA = s.texShape;
            var texShapeB = input.isUniform ? null : input.texData.texShape;
            if (!arraysEqual(texShapeA, texShapeB)) {
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
        if (output.texData.isPacked) {
            gpgpu.setOutputPackedMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
        }
        else {
            gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
        }
        gpgpu.setProgram(binary.webGLProgram);
        inputs.forEach(function (input, i) {
            var variableName = binary.program.variableNames[i];
            var variableUniformLocation = binary.uniformLocations[variableName];
            if (variableUniformLocation != null) {
                if (input.isUniform) {
                    if (sizeFromShape(input.shape) === 1) {
                        gpgpu.gl.uniform1f(variableUniformLocation, input.uniformValues[0]);
                    }
                    else {
                        var vals = input.uniformValues;
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
    function makeShaderKey(program, inputs, output) {
        var keyInputs = '';
        inputs.concat(output).forEach(function (x) {
            keyInputs += x.shape + "_" + (x.isUniform ? 'uniform' : x.texData.texShape);
        });
        var keyUserCode = program.userCode;
        var keyBroadcast = (program.supportsBroadcasting === true).toString();
        var key = program.constructor.name;
        key += '_' + keyBroadcast + '_' + keyInputs + '_' + keyUserCode;
        return key;
    }

    var Im2ColProgram = (function () {
        function Im2ColProgram(outputShape, inputShape, convInfo) {
            this.variableNames = ['A'];
            this.outputShape = outputShape;
            var filterWidth = convInfo.filterWidth, inChannels = convInfo.inChannels, strideWidth = convInfo.strideWidth, strideHeight = convInfo.strideHeight, padInfo = convInfo.padInfo, outWidth = convInfo.outWidth, dilationWidth = convInfo.dilationWidth, dilationHeight = convInfo.dilationHeight;
            var left = padInfo.left, top = padInfo.top;
            var itemsPerBlockRow = inChannels * filterWidth;
            this.userCode = "\n      void main() {\n        ivec2 rc = getOutputCoords();\n\n        vec4 result = vec4(0);\n\n        for(int row=0; row<=1; row++) {\n          for(int col=0; col<=1; col++) {\n            int blockIndex = rc.y + col;\n            int pos = rc.x + row;\n\n            if(blockIndex >= " + outputShape[1] + " || pos >= " + outputShape[0] + ") continue;\n\n            int offsetY = int(blockIndex / (" + outWidth + ")) * " + strideHeight + " - " + top + ";\n            int d0 = offsetY + " + dilationHeight + " * (pos / " + itemsPerBlockRow + ");\n\n            if(d0 >= " + inputShape[0] + " || d0 < 0) continue;\n\n            int offsetX = int(mod(float(blockIndex), " + outWidth + ".) * " + strideWidth + ". - " + left + ".);\n            int d1 = offsetX + " + dilationWidth + " * (int(mod(float(pos), " + itemsPerBlockRow + ".) / " + inChannels + ".));\n\n            if(d1 >= " + inputShape[1] + " || d1 < 0) continue;\n\n            result[row * 2 + col] = getA(d0, d1, int(mod(float(pos), " + inChannels + ".)));\n          }\n        }\n\n        gl_FragColor = result;\n      }\n    ";
        }
        return Im2ColProgram;
    }());

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

    var LRNGradProgram = (function () {
        function LRNGradProgram(inputShape, depthRadius, bias, alpha, beta) {
            this.variableNames = ['inputImage', 'outputImage', 'dy'];
            this.outputShape = [];
            this.outputShape = inputShape;
            this.depth = inputShape[3];
            this.depthRadius = depthRadius;
            this.bias = bias;
            this.alpha = alpha;
            this.beta = beta;
            this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n\n        float result = 0.0;\n        for (int d = 0; d < " + this.depth + "; ++d) {\n          int depthBegin = int(max(0.0, float(d - " + depthRadius + ")));\n          int depthEnd = int(min(float(" + this.depth + "),\n              float(d + " + depthRadius + " + 1)));\n\n          const int MIN_DEPTH_BEGIN = 0;\n          const int MAX_DEPTH_END = " + this.depth + ";\n\n          float norm = 0.0;\n          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd) {\n              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);\n            }\n            else {\n              break;\n            }\n          }\n\n          norm = float(" + alpha + ") * norm + float(" + bias + ");\n\n          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd){\n              float dyi = -2.0 * float(" + alpha + ")\n                * float(" + beta + ")\n                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)\n                / norm;\n              if (k == d) {\n                dyi += pow(norm, -1.0 * " + beta + ");\n              }\n              if (k == coords[3]) {\n                dyi *= getDy(b, r, c, d);\n                result += dyi;\n              }\n            }\n            else {\n              break;\n            }\n          }\n      }\n      setOutput(result);\n      }\n    ";
        }
        return LRNGradProgram;
    }());

    var MaxPool2DBackpropProgram = (function () {
        function MaxPool2DBackpropProgram(convInfo) {
            this.variableNames = ['dy', 'maxPos'];
            this.outputShape = convInfo.inShape;
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var dilationHeight = convInfo.dilationHeight;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
            var padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
            var padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
            var lastIndex = effectiveFilterHeight * effectiveFilterWidth - 1;
            this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + effectiveFilterHeight + ";\n          wR += " + dilationHeight + ") {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + effectiveFilterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n            int maxPosValue = " + lastIndex + " - int(getMaxPos(b, idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + effectiveFilterWidth + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
        }
        return MaxPool2DBackpropProgram;
    }());

    var MatMulProgram = (function () {
        function MatMulProgram(aShape, bShape, transposeA, transposeB) {
            if (transposeA === void 0) { transposeA = false; }
            if (transposeB === void 0) { transposeB = false; }
            this.variableNames = ['matrixA', 'matrixB'];
            var batchSize = aShape[0];
            var outerShapeA = transposeA ? aShape[2] : aShape[1];
            var outerShapeB = transposeB ? bShape[1] : bShape[2];
            var sharedDim = transposeA ? aShape[1] : aShape[2];
            this.outputShape = [batchSize, outerShapeA, outerShapeB];
            var aSnippetFromOffset = function (vec4Offset, indexVar) {
                return transposeA ? "batch, " + indexVar + " + " + vec4Offset + ", aRow" :
                    "batch, aRow, " + indexVar + " + " + vec4Offset;
            };
            var bSnippetFromOffset = function (vec4Offset, indexVar) {
                return transposeB ? "batch, bCol, " + indexVar + " + " + vec4Offset :
                    "batch, " + indexVar + " + " + vec4Offset + ", bCol";
            };
            var sharedDimNearestVec4 = Math.floor(sharedDim / 4) * 4;
            var sharedDimVec4Remainder = sharedDim % 4;
            this.userCode = " float dotARowBCol(int batch, int aRow, int bCol) {\n      float result = 0.0;\n      for (int i = 0; i < " + sharedDimNearestVec4 + "; i += 4) {\n        vec4 a = vec4(\n          getMatrixA(" + aSnippetFromOffset(0, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(1, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(2, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(3, 'i') + ")\n        );\n        vec4 b = vec4(\n          getMatrixB(" + bSnippetFromOffset(0, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(1, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(2, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(3, 'i') + ")\n        );\n\n        result += dot(a, b);\n      }\n\n      if (" + (sharedDimVec4Remainder === 1) + ") {\n        result += getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + ") *\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + ");\n      } else if (" + (sharedDimVec4Remainder === 2) + ") {\n        vec2 a = vec2(\n          getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(1, sharedDimNearestVec4) + ")\n        );\n        vec2 b = vec2(\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(1, sharedDimNearestVec4) + ")\n        );\n        result += dot(a, b);\n      } else if (" + (sharedDimVec4Remainder === 3) + ") {\n        vec3 a = vec3(\n          getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(1, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(2, sharedDimNearestVec4) + ")\n        );\n        vec3 b = vec3(\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(1, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(2, sharedDimNearestVec4) + ")\n        );\n        result += dot(a, b);\n      }\n\n      return result;\n    }\n\n    void main() {\n      ivec3 resBRC = getOutputCoords();\n      setOutput(dotARowBCol(resBRC.x, resBRC.y, resBRC.z));\n    }\n    ";
        }
        return MatMulProgram;
    }());

    var MatMulPackedProgram = (function () {
        function MatMulPackedProgram(aShape, bShape, outputShape, transposeA, transposeB) {
            if (transposeA === void 0) { transposeA = false; }
            if (transposeB === void 0) { transposeB = false; }
            this.variableNames = ['matrixA', 'matrixB'];
            this.usesPackedTextures = true;
            this.outputShape = outputShape;
            var sharedDim = transposeA ? aShape[0] : aShape[1];
            var sharedDimensionPacked = Math.ceil(sharedDim / 2);
            var aSample = transposeA ? 'i * 2, rc.x' : 'rc.x, i * 2';
            var bSample = transposeB ? 'rc.y, i * 2' : 'i * 2, rc.y';
            var aSwizzle = transposeA ? ['a.xxyy', 'a.zzww'] : ['a.xxzz', 'a.yyww'];
            var bSwizzle = transposeB ? ['b.xzxz', 'b.ywyw'] : ['b.xyxy', 'b.zwzw'];
            this.userCode = "\n      const float sharedDimension = " + sharedDimensionPacked + ".0;\n\n      vec4 dot2x2ARowBCol(ivec2 rc) {\n        vec4 result = vec4(0);\n        for (int i = 0; i < " + sharedDimensionPacked + "; i++) {\n          vec4 a = getMatrixA(" + aSample + ");\n          vec4 b = getMatrixB(" + bSample + ");\n\n          result += (" + aSwizzle[0] + " * " + bSwizzle[0] + ") + (" + aSwizzle[1] + " * " + bSwizzle[1] + ");\n        }\n        return result;\n      }\n\n      void main() {\n        ivec2 rc = getOutputCoords();\n        setOutput(dot2x2ARowBCol(rc));\n      }\n    ";
        }
        return MatMulPackedProgram;
    }());

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

    var OneHotProgram = (function () {
        function OneHotProgram(numIndices, depth, onValue, offValue) {
            this.variableNames = ['indices'];
            this.outputShape = [numIndices, depth];
            this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int index = round(getIndices(coords.x));\n        setOutput(mix(float(" + offValue + "), float(" + onValue + "),\n                      float(index == coords.y)));\n      }\n    ";
        }
        return OneHotProgram;
    }());

    function getChannels(name) {
        return ['x', 'y', 'z', 'w'].map(function (d) { return name + "." + d; });
    }
    function getInnerDims(rank, dims) {
        return dims.slice(0, rank).slice(-2);
    }
    function getSourceCoords$1(rank, dims) {
        if (rank === 1) {
            return 'rc';
        }
        var coords = '';
        for (var i = 0; i < rank; i++) {
            coords += dims[i];
            if (i < rank - 1) {
                coords += ',';
            }
        }
        return coords;
    }

    var PackProgram = (function () {
        function PackProgram(outputShape) {
            this.variableNames = ['A'];
            this.outputShape = outputShape;
            var rank = outputShape.length;
            var channels = getChannels('rc');
            var dtype = getCoordsDataType(rank);
            var outOfBoundsCondition = getOutOfBoundsCondition(rank, outputShape, channels);
            var setup = getSetup(rank, outputShape[outputShape.length - 1], outputShape[outputShape.length - 2], channels);
            var output = getOutput(outputShape, channels);
            this.userCode = "\n      void main() {\n        " + dtype + " rc = getOutputCoords();\n\n        if(" + outOfBoundsCondition + ") {\n          gl_FragColor = vec4(0);\n        } else {\n          " + setup + "\n\n          setOutput(vec4(" + output + "));\n        }\n      }\n    ";
        }
        return PackProgram;
    }());
    function getSourceCoordsArr(rank, dims) {
        var coords = [];
        for (var row = 0; row <= 1; row++) {
            for (var col = 0; col <= 1; col++) {
                var coord = (row === 0 ? 'r' : 'rp1') + ", " + (col === 0 ? 'c' : 'cp1');
                for (var d = 2; d < rank; d++) {
                    coord = dims[dims.length - 1 - d] + "," + coord;
                }
                coords.push(coord);
            }
        }
        return coords;
    }
    function getOutOfBoundsCondition(rank, shape, dims) {
        if (rank === 1) {
            return "rc > " + shape[0];
        }
        var cond = '';
        for (var i = 0; i < rank; i++) {
            cond += dims[i] + " >= " + shape[i];
            if (i < rank - 1) {
                cond += '||';
            }
        }
        return cond;
    }
    function getSetup(rank, cols, rows, dims) {
        if (rank === 1) {
            return '';
        }
        var innerDims = getInnerDims(rank, dims);
        return "\n    int r = " + innerDims[0] + ";\n    int c = " + innerDims[1] + ";\n    int rp1 = r + 1;\n    int cp1 = c + 1;\n\n    bool cEdge = cp1 >= " + cols + ";\n    bool rEdge = rp1 >= " + rows + ";\n  ";
    }
    function getOutput(shape, dims) {
        var rank = shape.length;
        var sourceCoords = getSourceCoordsArr(rank, dims);
        if (rank === 1) {
            return "getA(rc),\n            rc + 1 >= " + shape[0] + " ? 0. : getA(rc + 1),\n            0, 0";
        }
        return "getA(" + sourceCoords[0] + "),\n          cEdge ? 0. : getA(" + sourceCoords[1] + "),\n          rEdge ? 0. : getA(" + sourceCoords[2] + "),\n          rEdge || cEdge ? 0. : getA(" + sourceCoords[3] + ")";
    }

    var PadProgram = (function () {
        function PadProgram(xShape, paddings, constantValue) {
            this.variableNames = ['x'];
            this.outputShape = paddings.map(function (p, i) { return p[0] + xShape[i] + p[1]; });
            var rank = xShape.length;
            var type = getCoordsDataType(rank);
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

    var Pool2DProgram = (function () {
        function Pool2DProgram(convInfo, poolType, computePositions) {
            this.variableNames = ['x'];
            if (poolType === 'avg' && computePositions) {
                throw new Error('Cannot compute positions for average pool.');
            }
            var filterWidth = convInfo.filterWidth;
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
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
                this.userCode = "\n        const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n        const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int batch = coords[0];\n          int d = coords[3];\n\n          ivec2 xRCCorner = coords.yz * strides - pads;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          // max/min x(?, ?, d) to get y(yR, yC, d).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n          float avgValue = 0.0;\n\n          for (int wR = 0; wR < " + effectiveFilterHeight + ";\n              wR += " + dilationHeight + ") {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + effectiveFilterWidth + ";\n                wC += " + dilationWidth + ") {\n              int xC = xCCorner + wC;\n\n              if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, d);\n\n              // If a min / max value has already been found, use it. If not,\n              // use the current value.\n              float currMinMaxValue = mix(\n                  value, minMaxValue, minMaxValueFound);\n              if (value " + compareOp_1 + " currMinMaxValue) {\n                minMaxValue = value;\n                minMaxValueFound = 1.0;\n                minMaxPosition = wR * " + effectiveFilterWidth + " + wC;\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";
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
            this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n      const float initializationValue = " + initializationValue + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xR, int xC, int d) {\n        if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xR, xC, d);\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // max/min x(?, ?, d) to get y(yR, yC, d).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + initializationValue + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wR = 0; wR < " + effectiveFilterHeight + ";\n            wR += " + dilationHeight + ") {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidthNearestVec4 + "; wC += 4) {\n            int xC = xCCorner + wC * " + dilationWidth + ";\n\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + dilationWidth + ", d),\n              getValue(batch, xR, xC + 2 * " + dilationWidth + ", d),\n              getValue(batch, xR, xC + 3 * " + dilationWidth + ", d)\n            );\n\n            " + updateSnippet + "\n          }\n\n          int xC = xCCorner + " + filterWidthNearestVec4 + ";\n          if (" + (filterWidthVec4Remainder === 1) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              initializationValue,\n              initializationValue,\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          } else if (" + (filterWidthVec4Remainder === 2) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + dilationWidth + ", d),\n              initializationValue,\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          } else if (" + (filterWidthVec4Remainder === 3) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + dilationWidth + ", d),\n              getValue(batch, xR, xC + 2 * " + dilationWidth + ", d),\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          }\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
        }
        return Pool2DProgram;
    }());

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
            if (reduceType === 'prod') {
                initializationValue = '1.0';
            }
            else if (reduceType === 'min') {
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
            else if (reduceType === 'prod') {
                returnValue = "prodValue";
            }
            else if (reduceType === 'all') {
                returnValue = "allValue";
            }
            else if (reduceType === 'any') {
                returnValue = "anyValue";
            }
            var windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
            var windowSizeVec4Remainder = windowSize % 4;
            var updateSnippet = "\n      if (" + (reduceType === 'sum') + ") {\n        sumValue += dot(values, ones);\n      } else if (" + (reduceType === 'prod') + ") {\n        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);\n        prodValue *= tmp[0] * tmp[1];\n      } else {\n        minMaxValue = " + compareOp + "(values, minMaxValue);\n      }\n    ";
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
            this.userCode = "\n      const float initializationValue = " + initializationValue + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int inIdx) {\n        " + checkOutOfBounds + "\n        return getX(batch, inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + windowSize + ";\n\n        vec4 minMaxValue = vec4(" + initializationValue + ");\n        float prodValue = 1.0;\n        float sumValue = 0.0;\n        float allValue = 1.0;\n        float anyValue = 0.0;\n\n        for (int i = 0; i < " + windowSizeNearestVec4 + "; i += 4) {\n          int inIdx = inOffset + i;\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          " + updateSnippet + "\n        }\n\n        int inIdx = inOffset + " + windowSizeNearestVec4 + ";\n        if (" + (windowSizeVec4Remainder === 1) + ") {\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 2) + ") {\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 3) + ") {\n          " + vecType + " values = " + vecType + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          " + updateSnippet + "\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
        }
        return ReduceProgram;
    }());

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
            var type = getCoordsDataType(rank);
            this.userCode = "\n      void main() {\n        " + type + " coords = getOutputCoords();\n        setOutput(getX(" + inCoords + "));\n      }\n    ";
        }
        return ReverseProgram;
    }());

    var ScatterProgram = (function () {
        function ScatterProgram(updateSize, sliceDim, indicesRank, updatesRank, strides, shape, summingDupeIndex) {
            if (summingDupeIndex === void 0) { summingDupeIndex = true; }
            this.variableNames = ['updates', 'indices', 'defaultValue'];
            this.outputShape = shape;
            var stridesType = getCoordsDataType(strides.length);
            var dtype = getCoordsDataType(shape.length);
            var indicesString = '';
            if (indicesRank === 1) {
                indicesString = 'i';
            }
            else if (indicesRank === 2) {
                indicesString = 'i, j';
            }
            var indicesSnippet = "getIndices(" + indicesString + ")";
            var updatesString = '';
            if (updatesRank === 1) {
                updatesString = 'i';
            }
            else if (updatesRank === 2) {
                updatesString = 'i, coords[1]';
            }
            var updatesSnippet = "getUpdates(" + updatesString + ")";
            var strideString = sliceDim > 1 ? 'strides[j]' : 'strides';
            this.userCode = "\n        " + stridesType + " strides = " + stridesType + "(" + strides + ");\n\n        void main() {\n          " + dtype + " coords = getOutputCoords();\n          float sum = 0.0;\n          bool found = false;\n          for (int i = 0; i < " + updateSize + "; i++) {\n            int flattenedIndex = 0;\n            for (int j = 0; j < " + sliceDim + "; j++) {\n              int index = round(" + indicesSnippet + ");\n              flattenedIndex += index * " + strideString + ";\n            }\n            if (flattenedIndex == coords[0]) {\n              sum += " + updatesSnippet + ";\n              found = true;\n            }\n          }\n          setOutput(mix(getDefaultValue(), sum, float(found)));\n        }\n      ";
        }
        return ScatterProgram;
    }());

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

    var SelectProgram = (function () {
        function SelectProgram(cRank, shape, rank) {
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
            var dtype = getCoordsDataType(rank);
            this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        float cVal = getC(" + cCoords + ");\n        if (cVal >= 1.0) {\n          setOutput(getA(" + abCoords + "));\n        } else {\n          setOutput(getB(" + abCoords + "));\n        }\n      }\n    ";
        }
        return SelectProgram;
    }());

    var SliceProgram = (function () {
        function SliceProgram(destSize) {
            this.variableNames = ['source'];
            this.outputShape = destSize;
            this.rank = destSize.length;
            var dtype = getCoordsDataType(this.rank);
            var sourceCoords = getCoords$1(this.rank);
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
    function getCoords$1(rank) {
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

    var StridedSliceProgram = (function () {
        function StridedSliceProgram(begin, strides, size, shrinkAxis) {
            this.variableNames = ['x'];
            var shape = size.filter(function (v, index) { return shrinkAxis.indexOf(index) === -1; });
            this.outputShape = shape;
            var rank = size.length;
            var inputDtype = getCoordsDataType(size.length);
            var dtype = getCoordsDataType(shape.length);
            var newCoords = '';
            if (rank === 1) {
                newCoords = 'coords * strides + begin';
            }
            else {
                var outputAxis_1 = 0;
                newCoords =
                    size.map(function (_, i) {
                        if (shrinkAxis.indexOf(i) === -1) {
                            outputAxis_1++;
                            return shape.length === 1 ?
                                "coords * strides[" + i + "] + begin[" + i + "]" :
                                "coords[" + (outputAxis_1 - 1) + "] * strides[" + i + "] + begin[" + i + "]";
                        }
                        else {
                            return "begin[" + i + "]";
                        }
                    })
                        .join(',');
            }
            this.userCode = "\n      " + inputDtype + " begin = " + inputDtype + "(" + begin + ");\n      " + inputDtype + " strides = " + inputDtype + "(" + strides + ");\n\n      void main() {\n        " + dtype + " coords = getOutputCoords();\n        setOutput(getX(" + newCoords + "));\n      }\n    ";
        }
        return StridedSliceProgram;
    }());

    var TextureManager = (function () {
        function TextureManager(gpgpu) {
            this.gpgpu = gpgpu;
            this.numUsedTextures = 0;
            this.numFreeTextures = 0;
            this.freeTextures = {};
            this.logEnabled = false;
            this.usedTextures = {};
        }
        TextureManager.prototype.acquireTexture = function (shapeRC, usage, isPacked) {
            var physicalTexType = getPhysicalFromLogicalTextureType(usage, isPacked);
            var shapeKey = getKeyFromTextureShape(shapeRC, physicalTexType, isPacked);
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
            if (physicalTexType === PhysicalTextureType.PACKED_2X2_FLOAT32) {
                newTexture = this.gpgpu.createPackedMatrixTexture(shapeRC[0], shapeRC[1]);
            }
            else if (physicalTexType === PhysicalTextureType.PACKED_2X2_FLOAT16) {
                newTexture =
                    this.gpgpu.createFloat16PackedMatrixTexture(shapeRC[0], shapeRC[1]);
            }
            else if (physicalTexType === PhysicalTextureType.UNPACKED_FLOAT32) {
                newTexture =
                    this.gpgpu.createFloat32MatrixTexture(shapeRC[0], shapeRC[1]);
            }
            else if (physicalTexType === PhysicalTextureType.UNPACKED_FLOAT16) {
                newTexture =
                    this.gpgpu.createFloat16MatrixTexture(shapeRC[0], shapeRC[1]);
            }
            else if (physicalTexType === PhysicalTextureType.PACKED_4X1_UNSIGNED_BYTE) {
                newTexture =
                    this.gpgpu.createUnsignedBytesMatrixTexture(shapeRC[0], shapeRC[1]);
            }
            this.usedTextures[shapeKey].push(newTexture);
            return newTexture;
        };
        TextureManager.prototype.releaseTexture = function (texture, shape, logicalTexType, isPacked) {
            if (this.freeTextures == null) {
                return;
            }
            var physicalTexType = getPhysicalFromLogicalTextureType(logicalTexType, isPacked);
            var shapeKey = getKeyFromTextureShape(shape, physicalTexType, isPacked);
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
    function getPhysicalFromLogicalTextureType(logicalTexType, isPacked) {
        if (isPacked) {
            return ENV.get('WEBGL_RENDER_FLOAT32_ENABLED') ?
                PhysicalTextureType.PACKED_2X2_FLOAT32 :
                PhysicalTextureType.PACKED_2X2_FLOAT16;
        }
        else if (logicalTexType === TextureUsage.DOWNLOAD ||
            logicalTexType === TextureUsage.PIXELS) {
            return PhysicalTextureType.PACKED_4X1_UNSIGNED_BYTE;
        }
        else if (logicalTexType === TextureUsage.UPLOAD) {
            return PhysicalTextureType.UNPACKED_FLOAT32;
        }
        else if (logicalTexType === TextureUsage.RENDER) {
            return ENV.get('WEBGL_RENDER_FLOAT32_ENABLED') ?
                PhysicalTextureType.UNPACKED_FLOAT32 :
                PhysicalTextureType.UNPACKED_FLOAT16;
        }
        throw new Error("Unknown logical texture type " + logicalTexType);
    }
    function getKeyFromTextureShape(shapeRowsCol, physicalTexType, isPacked) {
        return shapeRowsCol[0] + "_" + shapeRowsCol[1] + "_" + physicalTexType + "_" + isPacked;
    }

    var TileProgram = (function () {
        function TileProgram(aShape, reps) {
            this.variableNames = ['A'];
            var outputShape = new Array(aShape.length);
            for (var i = 0; i < outputShape.length; i++) {
                outputShape[i] = aShape[i] * reps[i];
            }
            this.outputShape = outputShape;
            this.rank = outputShape.length;
            var dtype = getCoordsDataType(this.rank);
            var sourceCoords = getSourceCoords$2(aShape);
            this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
        }
        return TileProgram;
    }());
    function getSourceCoords$2(aShape) {
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

    var TransposeProgram = (function () {
        function TransposeProgram(aShape, newDim) {
            this.variableNames = ['A'];
            var outputShape = new Array(aShape.length);
            for (var i = 0; i < outputShape.length; i++) {
                outputShape[i] = aShape[newDim[i]];
            }
            this.outputShape = outputShape;
            this.rank = outputShape.length;
            var dtype = getCoordsDataType(this.rank);
            var switched = getSwitchedCoords(newDim);
            this.userCode = "\n    void main() {\n      " + dtype + " resRC = getOutputCoords();\n      setOutput(getA(" + switched + "));\n    }\n    ";
        }
        return TransposeProgram;
    }());
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

    var ERF_P = 0.3275911;
    var ERF_A1 = 0.254829592;
    var ERF_A2 = -0.284496736;
    var ERF_A3 = 1.421413741;
    var ERF_A4 = -1.453152027;
    var ERF_A5 = 1.061405429;

    var SELU_SCALEALPHA = 1.7580993408473768599402175208123;
    var SELU_SCALE = 1.0507009873554804934193349852946;

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
    var CHECK_NAN_SNIPPET$1 = "if (isNaN(x)) return x;";
    var ABS = "return abs(x);";
    var RELU = CHECK_NAN_SNIPPET$1 + "\n  return (x < 0.0) ? 0.0 : x;\n";
    var ELU = "return (x >= 0.0) ? x : (exp(x) - 1.0);";
    var SELU = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + SELU_SCALEALPHA + ";\n  float scale = " + SELU_SCALE + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";
    function STEP(alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        return CHECK_NAN_SNIPPET$1 + ("\n    return x > 0.0 ? 1.0 : float(" + alpha + ");\n  ");
    }
    var NEG = "return -x;";
    var CEIL = "return ceil(x);";
    var FLOOR = "return floor(x);";
    var SIGN = "\n  if (isNaN(x)) { return 0.0; }\n  return sign(x);\n";
    var ROUND = "\n  // OpenGL ES does not support round function.\n  // The algorithm is based on banker's rounding.\n  float base = floor(x);\n  if ((x - base) < 0.5) {\n    return floor(x);\n  } else if ((x - base) > 0.5) {\n    return ceil(x);\n  } else {\n    if (mod(base, 2.0) == 0.0) {\n      return base;\n    } else {\n      return base + 1.0;\n    }\n  }\n";
    var EXP = "return exp(x);";
    var EXPM1 = "return exp(x) - 1.0;";
    var LOG = "if (x < 0.0) return NAN;\n  return log(x);";
    var LOG1P = "return log(1.0 + x);";
    var SQRT = "return sqrt(x);";
    var RSQRT = "return inversesqrt(x);";
    var SIGMOID = "return 1.0 / (1.0 + exp(-1.0 * x));";
    var SOFTPLUS = "\n  float epsilon = 1.1920928955078125e-7;\n  float threshold = log(epsilon) + 2.0;\n\n  bool too_large = x > -threshold;\n  bool too_small = x < threshold;\n\n  float result;\n  float exp_x = exp(x);\n\n  if (too_large){\n    result = x;\n  }\n  else if (too_small){\n    result = exp_x;\n  }\n  else{\n    result = log(exp_x + 1.0);\n  }\n  return result;\n";
    var SIN = CHECK_NAN_SNIPPET$1 + "\n  return sin(x);\n";
    var COS = CHECK_NAN_SNIPPET$1 + "\n  return cos(x);\n";
    var TAN = "return tan(x);";
    var ASIN = "return asin(x);";
    var ACOS = "return acos(x);";
    var ATAN = CHECK_NAN_SNIPPET$1 + "\n  return atan(x);\n";
    var SINH = "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n";
    var COSH = "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n";
    var TANH = "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n";
    var ASINH = "return log(x + sqrt(x * x + 1.0));";
    var ACOSH = CHECK_NAN_SNIPPET$1 + "\n  if (x < 1.0) return NAN;\n  return log(x + sqrt(x * x - 1.0));";
    var ATANH = CHECK_NAN_SNIPPET$1 + "\n  if ((x < -1.0) || (x > 1.0)) return NAN;\n  return (log(1.0 + x) - log(1.0 - x)) / 2.0;";
    var ERF = "\n  // Error function is calculated approximately with elementary function.\n  // See \"Handbook of Mathematical Functions with Formulas,\n  // Graphs, and Mathematical Tables\", Abramowitz and Stegun.\n  float p = " + ERF_P + ";\n  float a1 = " + ERF_A1 + ";\n  float a2 = " + ERF_A2 + ";\n  float a3 = " + ERF_A3 + ";\n  float a4 = " + ERF_A4 + ";\n  float a5 = " + ERF_A5 + ";\n\n  float t = 1.0 / (1.0 + p * x);\n  return 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x);\n";
    var SQUARE = "return x * x;";
    var RECIPROCAL = "return 1.0 / x;";
    var LOGICAL_NOT = "return float(!(x >= 1.0));";
    var TO_INT = "return float(int(x));";

    var UnpackProgram = (function () {
        function UnpackProgram(outputShape) {
            this.variableNames = ['A'];
            this.usesPackedTextures = true;
            this.outputShape = outputShape;
            var rank = outputShape.length;
            var channels = getChannels('rc');
            var dtype = getCoordsDataType(rank);
            var sourceCoords = getSourceCoords$1(rank, channels);
            var innerDims = getInnerDims(rank, channels);
            var coords = rank === 1 ? 'rc' : innerDims.join(',');
            this.userCode = "\n      void main() {\n        " + dtype + " rc = getOutputCoords();\n        vec2 modCoord = mod(vec2(" + coords + "), 2.);\n        vec4 packedInput = getA(" + sourceCoords + ");\n\n        setOutput(\n          modCoord.x == 0. ?\n            (modCoord.y == 0. ? packedInput.r : packedInput.g) :\n            (modCoord.y == 0. ? packedInput.b : packedInput.a)\n        );\n      }\n    ";
        }
        return UnpackProgram;
    }());

    function concat1d_(tensors) {
        return concat(tensors, 0);
    }
    function concat2d_(tensors, axis) {
        return concat(tensors, axis);
    }
    function concat3d_(tensors, axis) {
        return concat(tensors, axis);
    }
    function concat4d_(tensors, axis) {
        return concat(tensors, axis);
    }
    function concat_(tensors, axis) {
        if (axis === void 0) { axis = 0; }
        assert(tensors.length >= 1, 'Pass at least one tensor to concat');
        var $tensors = convertToTensorArray(tensors, 'tensors', 'concat');
        axis = parseAxisParam(axis, $tensors[0].shape)[0];
        var outShape = computeOutShape($tensors.map(function (t) { return t.shape; }), axis);
        if (sizeFromShape(outShape) === 0) {
            return tensor([], outShape);
        }
        $tensors = $tensors.filter(function (t) { return t.size > 0; });
        if ($tensors.length === 1) {
            return $tensors[0];
        }
        var shapes = $tensors.map(function (t) { return t.shape; });
        assertParamsConsistent(shapes, axis);
        var der = function (dy) {
            var sizeSplits = shapes.map(function (s) { return s[axis]; });
            var derTensors = split$1(dy, sizeSplits, axis);
            return derTensors.map(function (t) { return function () { return t; }; });
        };
        var inputs = $tensors;
        return ENV.engine.runKernel(function (backend) { return backend.concat($tensors, axis); }, inputs, der);
    }
    function split_(x, numOrSizeSplits, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = convertToTensor(x, 'x', 'split');
        axis = parseAxisParam(axis, $x.shape)[0];
        var splitSizes;
        if (typeof (numOrSizeSplits) === 'number') {
            assert($x.shape[axis] % numOrSizeSplits === 0, 'Number of splits must evenly divide the axis.');
            splitSizes = Array(numOrSizeSplits).fill($x.shape[axis] / numOrSizeSplits);
        }
        else {
            assert($x.shape[axis] === numOrSizeSplits.reduce(function (a, b) { return a + b; }), 'The sum of sizes must match the size of the axis dimension.');
            splitSizes = numOrSizeSplits;
        }
        var der = function (dy) { return ({ $x: function () { return concat(dy, axis); } }); };
        return ENV.engine.runKernel(function (backend) { return backend.split($x, splitSizes, axis); }, { $x: $x }, der);
    }
    var concat = op({ concat_: concat_ });
    var concat1d = op({ concat1d_: concat1d_ });
    var concat2d = op({ concat2d_: concat2d_ });
    var concat3d = op({ concat3d_: concat3d_ });
    var concat4d = op({ concat4d_: concat4d_ });
    var split$1 = op({ split_: split_ });

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var alea = createCommonjsModule(function (module) {
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
      prng.int32 = function() { return (xg.next() * 0x100000000) | 0; };
      prng.double = function() {
        return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      prng.quick = prng;
      if (state) {
        if (typeof(state) == 'object') copy(state, xg);
        prng.state = function() { return copy(xg, {}); };
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
      commonjsGlobal,
      module,    // present in node.js
      (typeof undefined) == 'function' && undefined   // present with an AMD loader
    );
    });

    var xor128 = createCommonjsModule(function (module) {
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
        prng.state = function() { return copy(xg, {}); };
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
      commonjsGlobal,
      module,    // present in node.js
      (typeof undefined) == 'function' && undefined   // present with an AMD loader
    );
    });

    var xorwow = createCommonjsModule(function (module) {
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
        prng.state = function() { return copy(xg, {}); };
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
      commonjsGlobal,
      module,    // present in node.js
      (typeof undefined) == 'function' && undefined   // present with an AMD loader
    );
    });

    var xorshift7 = createCommonjsModule(function (module) {
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
        var X = me.x, i = me.i, t, v;
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
        prng.state = function() { return copy(xg, {}); };
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
      commonjsGlobal,
      module,    // present in node.js
      (typeof undefined) == 'function' && undefined   // present with an AMD loader
    );
    });

    var xor4096 = createCommonjsModule(function (module) {
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
        if (state.X) copy(state, xg);
        prng.state = function() { return copy(xg, {}); };
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
      commonjsGlobal,                                     // window object or global
      module,    // present in node.js
      (typeof undefined) == 'function' && undefined   // present with an AMD loader
    );
    });

    var tychei = createCommonjsModule(function (module) {
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
        prng.state = function() { return copy(xg, {}); };
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
      commonjsGlobal,
      module,    // present in node.js
      (typeof undefined) == 'function' && undefined   // present with an AMD loader
    );
    });

    var seedrandom = createCommonjsModule(function (module) {
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

      prng.int32 = function() { return arc4.g(4) | 0; };
      prng.quick = function() { return arc4.g(4) / 0x100000000; };
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
              prng.state = function() { return copy(arc4, {}); };
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
    }
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
    if (module.exports) {
      module.exports = seedrandom;
      // When in node.js, try using crypto package for autoseeding.
      try {
        nodecrypto = require('crypto');
      } catch (ex) {}
    } else if ((typeof undefined) == 'function' && undefined.amd) {
      undefined(function() { return seedrandom; });
    }

    // End anonymous scope, and pass initial values.
    })(
      [],     // pool: entropy pool starts empty
      Math    // math: package containing random, pow, and seedrandom
    );
    });

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


    // xor128, a pure xor-shift generator by George Marsaglia.
    // Period: 2^128-1.
    // Reported to fail: MatrixRank and LinearComp.


    // xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
    // Period: 2^192-2^32
    // Reported to fail: CollisionOver, SimpPoker, and LinearComp.


    // xorshift7, by François Panneton and Pierre L'ecuyer, takes
    // a different approach: it adds robustness by allowing more shifts
    // than Marsaglia's original three.  It is a 7-shift generator
    // with 256 bits, that passes BigCrush with no systmatic failures.
    // Period 2^256-1.
    // No systematic BigCrush failures reported.


    // xor4096, by Richard Brent, is a 4096-bit xor-shift with a
    // very long period that also adds a Weyl generator. It also passes
    // BigCrush with no systematic failures.  Its long period may
    // be useful if you have many generators and need to avoid
    // collisions.
    // Period: 2^4128-2^32.
    // No systematic BigCrush failures reported.


    // Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
    // number generator derived from ChaCha, a modern stream cipher.
    // https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
    // Period: ~2^127
    // No systematic BigCrush failures reported.


    // The original ARC4-based prng included in this library.
    // Period: ~2^1600


    seedrandom.alea = alea;
    seedrandom.xor128 = xor128;
    seedrandom.xorwow = xorwow;
    seedrandom.xorshift7 = xorshift7;
    seedrandom.xor4096 = xor4096;
    seedrandom.tychei = tychei;

    var seedrandom$1 = seedrandom;
    var seedrandom_1 = seedrandom$1.alea;

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
            this.random = seedrandom_1(seedValue.toString());
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

    function clone_(x) {
        var $x = convertToTensor(x, 'x', 'clone');
        var der = function (dy) {
            return { $x: function () { return dy.toFloat(); } };
        };
        return ENV.engine.runKernel(function (backend) {
            return Tensor.make($x.shape, { dataId: $x.dataId }, $x.dtype);
        }, { $x: $x }, der);
    }
    function eye_(numRows, numColumns, batchShape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (numColumns == null) {
            numColumns = numRows;
        }
        var buff = buffer([numRows, numColumns], dtype);
        var n = numRows <= numColumns ? numRows : numColumns;
        for (var i = 0; i < n; ++i) {
            buff.set(1, i, i);
        }
        var out = buff.toTensor().as2D(numRows, numColumns);
        if (batchShape == null) {
            return out;
        }
        else {
            if (batchShape.length === 1) {
                return tile(expandDims(out, 0), [batchShape[0], 1, 1]);
            }
            else if (batchShape.length === 2) {
                return tile(expandDims(expandDims(out, 0), 0), [batchShape[0], batchShape[1], 1, 1]);
            }
            else if (batchShape.length === 3) {
                return tile(expandDims(expandDims(expandDims(out, 0), 0), 0), [batchShape[0], batchShape[1], batchShape[2], 1, 1]);
            }
            else {
                throw new Error("eye() currently supports only 1D and 2D " +
                    ("batchShapes, but received " + batchShape.length + "D."));
            }
        }
    }
    function randomNormal_(shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new MPRandGauss(mean, stdDev, dtype, false, seed);
        var res = buffer(shape, dtype);
        for (var i = 0; i < res.values.length; i++) {
            res.values[i] = randGauss.nextValue();
        }
        return res.toTensor();
    }
    function truncatedNormal_(shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new MPRandGauss(mean, stdDev, dtype, true, seed);
        var res = buffer(shape, dtype);
        for (var i = 0; i < res.values.length; i++) {
            res.values[i] = randGauss.nextValue();
        }
        return res.toTensor();
    }
    function randomUniform_(shape, minval, maxval, dtype) {
        if (minval === void 0) { minval = 0; }
        if (maxval === void 0) { maxval = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        var res = buffer(shape, dtype);
        for (var i = 0; i < res.values.length; i++) {
            res.values[i] = randUniform(minval, maxval);
        }
        return res.toTensor();
    }
    function rand_(shape, randFunction, dtype) {
        var size = sizeFromShape(shape);
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
        return Tensor.make(shape, { values: values }, dtype);
    }
    function multinomial_(logits, numSamples, seed, normalized) {
        if (normalized === void 0) { normalized = false; }
        var $logits = convertToTensor(logits, 'logits', 'multinomial');
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
        var res = ENV.engine.runKernel(function (backend) { return backend.multinomial(logits2D, normalized, numSamples, seed); }, { logits2D: logits2D });
        return origRank === 1 ? res.as1D() : res;
    }
    function oneHot_(indices, depth, onValue, offValue) {
        if (onValue === void 0) { onValue = 1; }
        if (offValue === void 0) { offValue = 0; }
        var $indices = convertToTensor(indices, 'indices', 'oneHot', 'int32');
        assert($indices.dtype === 'int32', 'Indices must be of dtype `int32`');
        if (depth < 2) {
            throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
        }
        var grad = function (dy) {
            return { $indices: function () { return zerosLike($indices); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.oneHot($indices, depth, onValue, offValue); }, { $indices: $indices }, grad);
    }
    function fromPixels_(pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        if (numChannels > 4) {
            throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
        }
        return ENV.engine.fromPixels(pixels, numChannels);
    }
    function toPixels(img, canvas) {
        return __awaiter(this, void 0, void 0, function () {
            var $img, _a, height, width, depth, minTensor, maxTensor, min, max, data, multiplier, bytes, i, r, g, b, a, j, ctx, imageData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        $img = convertToTensor(img, 'img', 'toPixels', 'int32');
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
    }
    function reshape_(x, shape) {
        var $x = convertToTensor(x, 'x', 'reshape');
        shape = inferFromImplicitShape(shape, $x.size);
        assert($x.size === sizeFromShape(shape), 'new shape and old shape must have the same number of elements.');
        var grad = function (dy) {
            return { $x: function () { return dy.reshape($x.shape); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.reshape($x, shape); }, { $x: $x }, grad);
    }
    function squeeze_(x, axis) {
        var $x = convertToTensor(x, 'x', 'squeeze');
        return reshape($x, squeezeShape($x.shape, axis).newShape);
    }
    function cast_(x, dtype) {
        var $x = convertToTensor(x, 'x', 'cast');
        var grad = function (dy) {
            return { $x: function () { return dy.clone(); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.cast($x, dtype); }, { $x: $x }, grad);
    }
    function tile_(x, reps) {
        var $x = convertToTensor(x, 'x', 'tile');
        assert($x.rank === reps.length, "Error in transpose: rank of input " + $x.rank + " " +
            ("must match length of reps " + reps + "."));
        var grad = function (dy) {
            var derX = function () {
                var xGrad = zerosLike($x);
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
        return ENV.engine.runKernel(function (backend) { return backend.tile($x, reps); }, { $x: $x }, grad);
    }
    function pad1d_(x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        assert(paddings.length === 2, 'Invalid number of paddings. Must be length of 2.');
        return pad(x, [paddings], constantValue);
    }
    function pad2d_(x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        assert(paddings.length === 2 && paddings[0].length === 2 &&
            paddings[1].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return pad(x, paddings, constantValue);
    }
    function pad3d_(x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        assert(paddings.length === 3 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return pad(x, paddings, constantValue);
    }
    function pad4d_(x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        assert(paddings.length === 4 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2 &&
            paddings[3].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return pad(x, paddings, constantValue);
    }
    function pad_(x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        var $x = convertToTensor(x, 'x', 'pad');
        if ($x.rank === 0) {
            throw new Error('pad(scalar) is not defined. Pass non-scalar to pad');
        }
        var begin = paddings.map(function (p) { return p[0]; });
        var grad = function (dy) {
            return { $x: function () { return dy.slice(begin, $x.shape); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.pad($x, paddings, constantValue); }, { $x: $x }, grad);
    }
    function stack_(tensors, axis) {
        if (axis === void 0) { axis = 0; }
        var $tensors = convertToTensorArray(tensors, 'tensors', 'stack');
        assert($tensors.length >= 1, 'Pass at least one tensor to tf.stack');
        if ($tensors.length === 1) {
            return $tensors[0].expandDims(axis);
        }
        var rank = $tensors[0].rank;
        var shape = $tensors[0].shape;
        var dtype = $tensors[0].dtype;
        assert(axis <= rank, 'Axis must be <= rank of the tensor');
        $tensors.forEach(function (t) {
            assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
        });
        $tensors.forEach(function (t) {
            assert(dtype === t.dtype, 'All tensors passed to stack must have matching dtypes');
        });
        var expandedTensors = $tensors.map(function (t) { return t.expandDims(axis); });
        return concat(expandedTensors, axis);
    }
    function batchToSpaceND_(x, blockShape, crops) {
        var $x = convertToTensor(x, 'x', 'batchToSpaceND');
        var prod = blockShape.reduce(function (a, b) { return a * b; });
        assert($x.rank >= 1 + blockShape.length, "input rank is " + $x.rank + " but should be > than blockShape.length " + blockShape.length);
        assert(crops.length === blockShape.length, "crops.length is " + crops.length + " but should be equal to blockShape.length  " + blockShape.length);
        assert($x.shape[0] % prod === 0, "input tensor batch is " + $x.shape[0] + " but is not divisible by the product of " +
            ("the elements of blockShape " + blockShape.join(' * ') + " === " + prod));
        var grad = function (dy) {
            return { $x: function () { return dy.spaceToBatchND(blockShape, crops); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.batchToSpaceND($x, blockShape, crops); }, { $x: $x }, grad);
    }
    function spaceToBatchND_(x, blockShape, paddings) {
        var $x = convertToTensor(x, 'x', 'spaceToBatchND');
        assert($x.rank >= 1 + blockShape.length, "input rank " + $x.rank + " should be > than [blockShape] " + blockShape.length);
        assert(paddings.length === blockShape.length, "paddings.shape[0] " + paddings.length + " must be equal to [blockShape] " + blockShape.length);
        assert($x.shape.reduce(function (a, b, i) {
            if (i > 0 && i <= blockShape.length) {
                return a &&
                    ((b + paddings[i - 1][0] + paddings[i - 1][1]) %
                        blockShape[i - 1] ===
                        0);
            }
            return a;
        }, true), "input spatial dimensions " + $x.shape.slice(1) + " with paddings " + paddings.toString() + " must be divisible by blockShapes " + blockShape.toString());
        var grad = function (dy) {
            return { $x: function () { return dy.batchToSpaceND(blockShape, paddings); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.spaceToBatchND($x, blockShape, paddings); }, { $x: $x }, grad);
    }
    function unstack_(x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = convertToTensor(x, 'x', 'unstack');
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
    }
    function cumsum_(x, axis, exclusive, reverse) {
        if (axis === void 0) { axis = 0; }
        if (exclusive === void 0) { exclusive = false; }
        if (reverse === void 0) { reverse = false; }
        var $x = convertToTensor(x, 'x', 'cumsum');
        axis = axis | 0;
        var permutation = getAxesPermutation([axis], $x.rank);
        var permutedX = $x;
        if (permutation != null) {
            permutedX = $x.transpose(permutation);
        }
        var permutedAxis = getInnerMostAxes(1, $x.rank)[0];
        var grad = function (dy) {
            return { permutedX: function () { return dy.cumsum(axis, exclusive, !reverse); } };
        };
        var value = ENV.engine.runKernel(function (backend) { return backend.cumsum(permutedX, permutedAxis, exclusive, reverse); }, { permutedX: permutedX }, grad);
        if (permutation != null) {
            value = value.transpose(permutation);
        }
        return value;
    }
    function expandDims_(x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = convertToTensor(x, 'x', 'expandDims');
        assert(axis <= $x.rank, 'Axis must be <= rank of the tensor');
        var newShape = $x.shape.slice();
        if (axis < 0) {
            assert(-($x.rank + 1) <= axis, "Axis must be in the interval [" + -($x.rank + 1) + ", " + $x.rank + "]");
            axis = $x.rank + axis + 1;
        }
        newShape.splice(axis, 0, 1);
        return reshape($x, newShape);
    }
    function depthToSpace_(x, blockSize, dataFormat) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        var $x = convertToTensor(x, 'x', 'depthToSpace');
        var inputHeight = (dataFormat === 'NHWC') ? $x.shape[1] : $x.shape[2];
        var inputWidth = (dataFormat === 'NHWC') ? $x.shape[2] : $x.shape[3];
        var inputDepth = (dataFormat === 'NHWC') ? $x.shape[3] : $x.shape[1];
        assert(inputHeight * blockSize >= 0, "Negative dimension size caused by overflow when multiplying\n      " + inputHeight + " and " + blockSize + "  for depthToSpace with input shape\n      " + $x.shape);
        assert(inputWidth * blockSize >= 0, "Negative dimension size caused by overflow when multiplying\n      " + inputWidth + " and " + blockSize + " for depthToSpace with input shape\n          " + $x.shape);
        assert((inputDepth % (blockSize * blockSize) === 0), "Dimension size must be evenly divisible by " + blockSize * blockSize + " but is " + inputDepth + " for depthToSpace with input shape " + $x.shape);
        return ENV.engine.runKernel(function (backend) { return backend.depthToSpace($x, blockSize, dataFormat); }, { $x: $x });
    }
    function buffer(shape, dtype, values) {
        if (dtype === void 0) { dtype = 'float32'; }
        return new TensorBuffer(shape, dtype, values);
    }
    function print(x, verbose) {
        if (verbose === void 0) { verbose = false; }
        console.log(x.toString(verbose));
    }
    var batchToSpaceND = op({ batchToSpaceND_: batchToSpaceND_ });
    var cast = op({ cast_: cast_ });
    var clone = op({ clone_: clone_ });
    var cumsum = op({ cumsum_: cumsum_ });
    var depthToSpace = op({ depthToSpace_: depthToSpace_ });
    var expandDims = op({ expandDims_: expandDims_ });
    var eye = op({ eye_: eye_ });
    var fromPixels = op({ fromPixels_: fromPixels_ });
    var multinomial = op({ multinomial_: multinomial_ });
    var oneHot = op({ oneHot_: oneHot_ });
    var pad = op({ pad_: pad_ });
    var pad1d = op({ pad1d_: pad1d_ });
    var pad2d = op({ pad2d_: pad2d_ });
    var pad3d = op({ pad3d_: pad3d_ });
    var pad4d = op({ pad4d_: pad4d_ });
    var rand = op({ rand_: rand_ });
    var randomNormal = op({ randomNormal_: randomNormal_ });
    var randomUniform = op({ randomUniform_: randomUniform_ });
    var reshape = op({ reshape_: reshape_ });
    var spaceToBatchND = op({ spaceToBatchND_: spaceToBatchND_ });
    var squeeze = op({ squeeze_: squeeze_ });
    var stack = op({ stack_: stack_ });
    var tile = op({ tile_: tile_ });
    var truncatedNormal = op({ truncatedNormal_: truncatedNormal_ });
    var unstack = op({ unstack_: unstack_ });

    function whereImpl(condShape, condVals) {
        var indices = [];
        for (var i = 0; i < condVals.length; i++) {
            if (condVals[i]) {
                indices.push(i);
            }
        }
        var inBuffer = buffer(condShape, 'int32');
        var out = buffer([indices.length, condShape.length], 'int32');
        for (var i = 0; i < indices.length; i++) {
            var loc = inBuffer.indexToLoc(indices[i]);
            var offset = i * condShape.length;
            out.values.set(loc, offset);
        }
        return out.toTensor();
    }

    var BEFORE_PAGING_CONSTANT = 300;
    var MathBackendWebGL = (function () {
        function MathBackendWebGL(gpgpu, delayedStorage) {
            if (delayedStorage === void 0) { delayedStorage = true; }
            this.gpgpu = gpgpu;
            this.delayedStorage = delayedStorage;
            this.pendingRead = new WeakMap();
            this.pendingDisposal = new WeakSet();
            this.lruDataGPU = [];
            this.numBytesInGPU = 0;
            this.uploadWaitMs = 0;
            this.downloadWaitMs = 0;
            this.binaryCache = {};
            this.disposed = false;
            if (ENV.get('WEBGL_VERSION') < 1) {
                throw new Error('WebGL is not supported on this device');
            }
            if (gpgpu == null) {
                var gl = getWebGLContext(ENV.get('WEBGL_VERSION'));
                this.gpgpu = new GPGPUContext(gl);
                this.canvas = gl.canvas;
                this.gpgpuCreatedLocally = true;
            }
            else {
                this.gpgpuCreatedLocally = false;
                this.canvas = gpgpu.gl.canvas;
            }
            if (ENV.get('WEBGL_PAGING_ENABLED')) {
                this.NUM_BYTES_BEFORE_PAGING =
                    (window.screen.height * window.screen.width *
                        window.devicePixelRatio) *
                        BEFORE_PAGING_CONSTANT;
            }
            this.textureManager = new TextureManager(this.gpgpu);
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
                complexTensors: null,
                texShape: null,
                usage: TextureUsage.RENDER,
                isPacked: false
            });
        };
        MathBackendWebGL.prototype.setDataMover = function (dataMover) {
            this.texData = new DataStorage(dataMover);
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
                if (this.fromPixels2DContext == null) {
                    if (!ENV.get('IS_BROWSER')) {
                        throw new Error('Can\'t read pixels from HTMLImageElement outside the browser.');
                    }
                    if (document.readyState !== 'complete') {
                        throw new Error('The DOM is not ready yet. Please call tf.fromPixels() ' +
                            'once the DOM is ready. One way to do that is to add an event ' +
                            'listener for `DOMContentLoaded` on the document object');
                    }
                    this.fromPixels2DContext =
                        document.createElement('canvas').getContext('2d');
                }
                this.fromPixels2DContext.canvas.width = pixels.width;
                this.fromPixels2DContext.canvas.height = pixels.height;
                this.fromPixels2DContext.drawImage(pixels, 0, 0, pixels.width, pixels.height);
                pixels = this.fromPixels2DContext.canvas;
            }
            var tempPixelHandle = this.makeTensorHandle(texShape, 'int32');
            this.texData.get(tempPixelHandle.dataId).usage = TextureUsage.PIXELS;
            this.gpgpu.uploadPixelDataToTexture(this.getTexture(tempPixelHandle.dataId), pixels);
            var program = new FromPixelsProgram(outShape);
            var res = this.compileAndRun(program, [tempPixelHandle]);
            this.disposeData(tempPixelHandle.dataId);
            return res;
        };
        MathBackendWebGL.prototype.makeTensorHandle = function (shape, dtype) {
            var dataId = {};
            this.register(dataId, shape, dtype);
            return { dataId: dataId, shape: shape, dtype: dtype };
        };
        MathBackendWebGL.prototype.write = function (dataId, values) {
            if (values == null) {
                throw new Error('MathBackendWebGL.write(): values can not be null');
            }
            var texData = this.texData.get(dataId);
            var texture = texData.texture, texShape = texData.texShape, usage = texData.usage, dtype = texData.dtype, isPacked = texData.isPacked;
            if (dtype === 'complex64') {
                throw new Error("Cannot write to a complex64 dtype. " +
                    "Please use tf.complex(real, imag).");
            }
            if (texture != null) {
                this.releaseTexture(dataId, texture, texShape, usage, isPacked);
                texData.texture = null;
                texData.texShape = null;
            }
            texData.usage = TextureUsage.UPLOAD;
            texData.values = values;
            if (!this.delayedStorage) {
                this.uploadToGPU(dataId);
            }
        };
        MathBackendWebGL.prototype.readSync = function (dataId) {
            var texData = this.texData.get(dataId);
            var values = texData.values, dtype = texData.dtype, complexTensors = texData.complexTensors;
            if (values != null) {
                this.cacheOnCPU(dataId);
                return values;
            }
            var shouldTimeProgram = this.activeTimers != null;
            var start;
            if (shouldTimeProgram) {
                start = performance.now();
            }
            var result;
            if (dtype === 'complex64') {
                var realValues = complexTensors.real.dataSync();
                var imagValues = complexTensors.imag.dataSync();
                result = mergeRealAndImagArrays(realValues, imagValues);
            }
            else {
                result = this.getValuesFromTexture(dataId);
            }
            if (shouldTimeProgram) {
                this.downloadWaitMs += performance.now() - start;
            }
            this.cacheOnCPU(dataId, result);
            return texData.values;
        };
        MathBackendWebGL.prototype.read = function (dataId) {
            return __awaiter(this, void 0, void 0, function () {
                var subscribers_1, texData, texture, values, texShape, bufferOrTexture, vals, subscribers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.pendingRead.has(dataId)) {
                                subscribers_1 = this.pendingRead.get(dataId);
                                return [2, new Promise(function (resolve) { return subscribers_1.push(resolve); })];
                            }
                            texData = this.texData.get(dataId);
                            texture = texData.texture, values = texData.values, texShape = texData.texShape;
                            if (values != null) {
                                this.cacheOnCPU(dataId);
                                return [2, values];
                            }
                            this.pendingRead.set(dataId, []);
                            if (!ENV.get('WEBGL_DOWNLOAD_FLOAT_ENABLED') &&
                                ENV.get('WEBGL_VERSION') === 2) {
                                throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and " +
                                    "WEBGL_VERSION=2 not yet supported.");
                            }
                            bufferOrTexture = this.gpgpu.maybeCreateBufferFromTexture(texture, texShape[0], texShape[1]);
                            return [4, this.gpgpu.createAndWaitForFence()];
                        case 1:
                            _a.sent();
                            if (bufferOrTexture instanceof WebGLTexture) {
                                vals = this.getValuesFromTexture(dataId);
                            }
                            else {
                                vals = this.gpgpu.downloadFloat32MatrixFromBuffer(bufferOrTexture, texShape[0], texShape[1]);
                            }
                            this.cacheOnCPU(dataId, vals);
                            subscribers = this.pendingRead.get(dataId);
                            this.pendingRead.delete(dataId);
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
        MathBackendWebGL.prototype.getValuesFromTexture = function (dataId) {
            var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype, texture = _a.texture, texShape = _a.texShape;
            if (ENV.get('WEBGL_DOWNLOAD_FLOAT_ENABLED')) {
                if (this.texData.get(dataId).isPacked) {
                    var batch = sizeFromShape(shape.slice(0, shape.length - 2));
                    var rows = shape.length > 1 ? shape[shape.length - 2] : 1;
                    var cols = shape[shape.length - 1];
                    return this.gpgpu.downloadMatrixFromPackedTexture(texture, batch, rows, cols, texShape[0], texShape[1]);
                }
                else {
                    return this.gpgpu.downloadFloat32MatrixFromOutputTexture(texture, texShape[0], texShape[1]);
                }
            }
            var tmpTarget = this.makeTensorHandle(shape, 'float32');
            tmpTarget.size = sizeFromShape(shape);
            this.texData.get(tmpTarget.dataId).usage = TextureUsage.DOWNLOAD;
            var program = new EncodeFloatProgram(shape);
            var pageToCpu = false;
            this.compileAndRun(program, [{ shape: shape, dtype: dtype, dataId: dataId }], tmpTarget, null, pageToCpu);
            var tmpData = this.texData.get(tmpTarget.dataId);
            var vals = this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(tmpData.texture, tmpData.texShape[0], tmpData.texShape[1]);
            this.disposeData(tmpTarget.dataId);
            return vals;
        };
        MathBackendWebGL.prototype.time = function (f) {
            return __awaiter(this, void 0, void 0, function () {
                var oldActiveTimers, newActiveTimers, outerMostTime, flattenedActiveTimerQueries, flattenedActiveTimerNames, kernelMs, res;
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
                            flattenedActiveTimerQueries = flatten(this.activeTimers.map(function (d) { return d.query; }))
                                .filter(function (d) { return d != null; });
                            flattenedActiveTimerNames = flatten(this.activeTimers.map(function (d) { return d.name; }))
                                .filter(function (d) { return d != null; });
                            this.activeTimers = oldActiveTimers;
                            if (outerMostTime) {
                                this.programTimersStack = null;
                            }
                            return [4, Promise.all(flattenedActiveTimerQueries)];
                        case 1:
                            kernelMs = _a.sent();
                            res = {
                                uploadWaitMs: this.uploadWaitMs,
                                downloadWaitMs: this.downloadWaitMs,
                                kernelMs: sum(kernelMs),
                                getExtraProfileInfo: function () {
                                    return kernelMs.map(function (d, i) { return ({ name: flattenedActiveTimerNames[i], ms: d }); })
                                        .map(function (d) { return d.name + ": " + d.ms; })
                                        .join(', ');
                                },
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
            if (ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
                return this.gpgpu.beginQuery();
            }
            return { startMs: performance.now(), endMs: null };
        };
        MathBackendWebGL.prototype.endTimer = function (query) {
            if (ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
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
                    if (ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
                        return [2, this.gpgpu.waitForQueryAndGetTime(query)];
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
                var _a = this.texData.get(dataId), texture = _a.texture, texShape = _a.texShape, usage = _a.usage, complexTensors = _a.complexTensors, isPacked = _a.isPacked;
                if (texture != null) {
                    this.releaseTexture(dataId, texture, texShape, usage, isPacked);
                }
                if (complexTensors != null) {
                    complexTensors.real.dispose();
                    complexTensors.imag.dispose();
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
        MathBackendWebGL.prototype.complex = function (real, imag) {
            var result = this.makeOutputArray(real.shape, 'complex64');
            var resultData = this.texData.get(result.dataId);
            resultData.complexTensors = {
                real: ENV.engine.keep(real.clone()),
                imag: ENV.engine.keep(imag.clone())
            };
            return result;
        };
        MathBackendWebGL.prototype.real = function (input) {
            var resultData = this.texData.get(input.dataId);
            return resultData.complexTensors.real.clone();
        };
        MathBackendWebGL.prototype.imag = function (input) {
            var resultData = this.texData.get(input.dataId);
            return resultData.complexTensors.imag.clone();
        };
        MathBackendWebGL.prototype.slice = function (x, begin, size) {
            var program = new SliceProgram(size);
            var customSetup = program.getCustomSetupFunc(begin);
            return this.compileAndRun(program, [x], null, customSetup);
        };
        MathBackendWebGL.prototype.stridedSlice = function (x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
            var _a = getStridedSlicedInfo(x.shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask), beginIndex = _a[0], size = _a[1], shrinkAxis = _a[2];
            var shape = size.filter(function (v, index) { return shrinkAxis.indexOf(index) === -1; });
            if (shape.some(function (axis) { return axis === 0; })) {
                return tensor([], shape);
            }
            var program = new StridedSliceProgram(beginIndex, strides, size, shrinkAxis);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.reverse = function (x, axis) {
            var program = new ReverseProgram(x.shape, axis);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.concat2Tensors = function (a, b, axis) {
            var outShape = computeOutShape([a.shape, b.shape], axis);
            var a2D = a.as2D(-1, sizeFromShape(a.shape.slice(axis)));
            var b2D = b.as2D(-1, sizeFromShape(b.shape.slice(axis)));
            var program = new ConcatProgram(a2D.shape, b2D.shape);
            var res = this.compileAndRun(program, [a2D, b2D]);
            return res.reshape(outShape);
        };
        MathBackendWebGL.prototype.concat = function (tensors, axis) {
            if (tensors.length === 1) {
                return tensors[0];
            }
            var result = tensors[0];
            for (var i = 1; i < tensors.length; ++i) {
                result = this.concat2Tensors(result, tensors[i], axis);
            }
            return result;
        };
        MathBackendWebGL.prototype.neg = function (x) {
            var program = new UnaryOpProgram(x.shape, NEG);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.batchMatMul = function (a, b, transposeA, transposeB) {
            var outerShapeA = transposeA ? a.shape[2] : a.shape[1];
            var outerShapeB = transposeB ? b.shape[1] : b.shape[2];
            if (a.shape[0] === 1 && b.shape[0] === 1) {
                var aSqueezed = a.as2D(a.shape[1], a.shape[2]);
                var bSqueezed = b.as2D(b.shape[1], b.shape[2]);
                var program = new MatMulPackedProgram(aSqueezed.shape, bSqueezed.shape, [outerShapeA, outerShapeB], transposeA, transposeB);
                var result = this.unpackTensor(this.compileAndRun(program, [aSqueezed, bSqueezed], this.makePackedTensor(program.outputShape)));
                return result.reshape([1, result.shape[0], result.shape[1]]);
            }
            else {
                return this.compileAndRun(new MatMulProgram(a.shape, b.shape, transposeA, transposeB), [a, b]);
            }
        };
        MathBackendWebGL.prototype.multiply = function (a, b) {
            if (a.dtype === 'complex64') {
                var aData = this.texData.get(a.dataId);
                var bData = this.texData.get(b.dataId);
                var realProgram = new BinaryOpComplexProgram(COMPLEX_MULTIPLY.REAL, a.shape, b.shape);
                var imagProgram = new BinaryOpComplexProgram(COMPLEX_MULTIPLY.IMAG, a.shape, b.shape);
                var inputs = [
                    this.makeComplexComponentTensorHandle(a, aData.complexTensors.real),
                    this.makeComplexComponentTensorHandle(a, aData.complexTensors.imag),
                    this.makeComplexComponentTensorHandle(b, bData.complexTensors.real),
                    this.makeComplexComponentTensorHandle(b, bData.complexTensors.imag)
                ];
                var real = this.compileAndRun(realProgram, inputs);
                var imag = this.compileAndRun(imagProgram, inputs);
                var complex = this.complex(real, imag);
                real.dispose();
                imag.dispose();
                return complex;
            }
            var program = new BinaryOpProgram(MUL, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, a.dtype);
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
            if (ENV.get('WEBGL_PACK_BATCHNORMALIZATION')) {
                var batchNormPackedProgram = new BatchNormPackedProgram(x.shape, mean.shape, variance.shape, offsetShape, scaleShape, varianceEpsilon);
                return this.unpackTensor(this.compileAndRun(batchNormPackedProgram, inputs, this.makePackedTensor(x.shape)));
            }
            var batchNormProgram = new BatchNormProgram(x.shape, mean.shape, variance.shape, offsetShape, scaleShape, varianceEpsilon);
            return this.compileAndRun(batchNormProgram, inputs);
        };
        MathBackendWebGL.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta) {
            var program = new LRNProgram(x.shape, radius, bias, alpha, beta);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.LRNGrad = function (dy, inputImage, outputImage, depthRadius, bias, alpha, beta) {
            var program = new LRNGradProgram(inputImage.shape, depthRadius, bias, alpha, beta);
            return this.compileAndRun(program, [inputImage, outputImage, dy]);
        };
        MathBackendWebGL.prototype.tile = function (x, reps) {
            var program = new TileProgram(x.shape, reps);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.pad = function (x, paddings, constantValue) {
            var program = new PadProgram(x.shape, paddings, constantValue);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.transpose = function (x, perm) {
            var program = new TransposeProgram(x.shape, perm);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.gather = function (x, indices, axis) {
            var program = new GatherProgram(x.shape, indices.size, axis);
            return this.compileAndRun(program, [x, indices]);
        };
        MathBackendWebGL.prototype.batchToSpaceND = function (x, blockShape, crops) {
            assert(x.rank <= 4, 'batchToSpaceND for rank > 4 with a WebGL backend not implemented yet');
            var prod = blockShape.reduce(function (a, b) { return a * b; });
            var reshaped = getReshaped(x.shape, blockShape, prod);
            var permuted = getPermuted(reshaped.length, blockShape.length);
            var reshapedPermuted = getReshapedPermuted(x.shape, blockShape, prod);
            var sliceBeginCoords = getSliceBeginCoords(crops, blockShape.length);
            var sliceSize = getSliceSize(reshapedPermuted, crops, blockShape.length);
            return x.reshape(reshaped)
                .transpose(permuted)
                .reshape(reshapedPermuted)
                .slice(sliceBeginCoords, sliceSize);
        };
        MathBackendWebGL.prototype.spaceToBatchND = function (x, blockShape, paddings) {
            assert(x.rank <= 4, 'spaceToBatchND for rank > 4 with a WebGL backend not implemented yet');
            var prod = blockShape.reduce(function (a, b) { return a * b; });
            var completePaddings = [[0, 0]];
            completePaddings.push.apply(completePaddings, paddings);
            for (var i = 1 + blockShape.length; i < x.shape.length; ++i) {
                completePaddings.push([0, 0]);
            }
            var paddedX = x.pad(completePaddings);
            var reshapedPaddedShape = getReshaped(paddedX.shape, blockShape, prod, false);
            var permutedReshapedPaddedPermutation = getPermuted(reshapedPaddedShape.length, blockShape.length, false);
            var flattenShape = getReshapedPermuted(paddedX.shape, blockShape, prod, false);
            return paddedX.reshape(reshapedPaddedShape)
                .transpose(permutedReshapedPaddedPermutation)
                .reshape(flattenShape);
        };
        MathBackendWebGL.prototype.reduce = function (x, reduceType, dtype) {
            var batchSize = x.shape[0];
            var inSize = x.shape[1];
            var windowSize = computeOptimalWindowSize(inSize);
            var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
            var program = new ReduceProgram(reduceInfo, reduceType);
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
            var windowSize = computeOptimalWindowSize(inSize);
            var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
            var program = new ArgMinMaxProgram(reduceInfo, reduceType, bestIndicesA == null);
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
            assertAxesAreInnerMostDims('sum', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            var outputDType = sumOutType(x.dtype);
            return this.reduce(a2D, 'sum', outputDType).reshape(outShape);
        };
        MathBackendWebGL.prototype.prod = function (x, axes) {
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            var outputDType = sumOutType(x.dtype);
            return this.reduce(a2D, 'prod', outputDType).reshape(outShape);
        };
        MathBackendWebGL.prototype.unsortedSegmentSum = function (x, segmentIds, numSegments) {
            var axis = 0;
            var permutation = getAxesPermutation([axis], x.rank);
            var permutedX = x;
            if (permutation != null) {
                permutedX = x.transpose(permutation);
                axis = getInnerMostAxes(1, x.rank)[0];
            }
            var outShape = computeOutShape$1(permutedX.shape, axis, numSegments);
            var inSize = sizeFromShape([permutedX.shape[axis]]);
            var a2D = permutedX.as2D(-1, inSize);
            var outputDType = sumOutType(x.dtype);
            var result = this.segOpCompute(a2D, 'unsortedSegmentSum', segmentIds, outputDType, numSegments)
                .reshape(outShape);
            if (permutation != null) {
                result = result.transpose(getUndoAxesPermutation(permutation));
            }
            return result;
        };
        MathBackendWebGL.prototype.segOpCompute = function (x, segOpType, segmentIds, dtype, numSegments) {
            var batchSize = x.shape[0];
            var inSize = x.shape[1];
            var windowSize = segOpComputeOptimalWindowSize(inSize, numSegments);
            var segOpInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize, numSegments: numSegments };
            var program = new SegmentOpProgram(segOpInfo, segOpType);
            var _a = program.outputShape, rows = _a[0], cols = _a[1];
            var output = this.makeOutputArray([rows, cols], dtype);
            this.compileAndRun(program, [x, segmentIds], output);
            if (output.shape[1] === numSegments) {
                return output;
            }
            segmentIds = range(0, numSegments).tile([inSize / windowSize]);
            return this.segOpCompute(output, segOpType, segmentIds, dtype, numSegments);
        };
        MathBackendWebGL.prototype.argMin = function (x, axis) {
            var axes = [axis];
            assertAxesAreInnerMostDims('argMin', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            return this.argReduce(a2D, 'min').reshape(outShape);
        };
        MathBackendWebGL.prototype.argMax = function (x, axis) {
            var axes = [axis];
            assertAxesAreInnerMostDims('argMax', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            return this.argReduce(a2D, 'max').reshape(outShape);
        };
        MathBackendWebGL.prototype.cumsum = function (x, axis, exclusive, reverse) {
            if (axis !== x.rank - 1) {
                throw new Error("WebGL cumsum shader expects an inner-most axis=" + (x.rank - 1) + " " +
                    ("but got axis=" + axis));
            }
            var program = new CumSumProgram(x.shape, exclusive, reverse);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.equal = function (a, b) {
            var program = new BinaryOpProgram(EQUAL, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.notEqual = function (a, b) {
            var program = new BinaryOpProgram(NOT_EQUAL, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.less = function (a, b) {
            var program = new BinaryOpProgram(LESS, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.lessEqual = function (a, b) {
            var program = new BinaryOpProgram(LESS_EQUAL, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.greater = function (a, b) {
            var program = new BinaryOpProgram(GREATER, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.greaterEqual = function (a, b) {
            var program = new BinaryOpProgram(GREATER_EQUAL, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.logicalNot = function (x) {
            var program = new UnaryOpProgram(x.shape, LOGICAL_NOT);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.logicalAnd = function (a, b) {
            var program = new BinaryOpProgram(LOGICAL_AND, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.logicalOr = function (a, b) {
            var program = new BinaryOpProgram(LOGICAL_OR, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, 'bool');
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.select = function (condition, a, b) {
            var program = new SelectProgram(condition.rank, a.shape, a.rank);
            var output = this.makeOutputArray(program.outputShape, upcastType(a.dtype, b.dtype));
            return this.compileAndRun(program, [condition, a, b], output);
        };
        MathBackendWebGL.prototype.where = function (condition) {
            warn('tf.where() in webgl locks the UI thread. ' +
                'Call tf.whereAsync() instead');
            var condVals = condition.dataSync();
            return whereImpl(condition.shape, condVals);
        };
        MathBackendWebGL.prototype.topk = function (x, k, sorted) {
            var xVals = x.dataSync();
            return topkImpl(xVals, x.shape, x.dtype, k, sorted);
        };
        MathBackendWebGL.prototype.min = function (x, axes) {
            assertAxesAreInnerMostDims('min', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            return this.reduce(a2D, 'min', a2D.dtype).reshape(outShape);
        };
        MathBackendWebGL.prototype.minimum = function (a, b) {
            var program = new BinaryOpProgram(MIN, a.shape, b.shape);
            return this.compileAndRun(program, [a, b]);
        };
        MathBackendWebGL.prototype.mod = function (a, b) {
            var program = new BinaryOpProgram(MOD, a.shape, b.shape);
            var customSetup = program.getCustomSetupFunc();
            return this.compileAndRun(program, [a, b], null, customSetup);
        };
        MathBackendWebGL.prototype.max = function (x, axes) {
            assertAxesAreInnerMostDims('max', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            return this.reduce(a2D, 'max', a2D.dtype).reshape(outShape);
        };
        MathBackendWebGL.prototype.maximum = function (a, b) {
            var program = new BinaryOpProgram(MAX, a.shape, b.shape);
            return this.compileAndRun(program, [a, b]);
        };
        MathBackendWebGL.prototype.all = function (x, axes) {
            assertAxesAreInnerMostDims('all', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            return this.reduce(a2D, 'all', a2D.dtype).reshape(outShape);
        };
        MathBackendWebGL.prototype.any = function (x, axes) {
            assertAxesAreInnerMostDims('any', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var inSize = sizeFromShape(reduceShape);
            var a2D = x.as2D(-1, inSize);
            return this.reduce(a2D, 'any', a2D.dtype).reshape(outShape);
        };
        MathBackendWebGL.prototype.squaredDifference = function (a, b) {
            var program = new BinaryOpProgram(SQUARED_DIFFERENCE, a.shape, b.shape);
            return this.compileAndRun(program, [a, b]);
        };
        MathBackendWebGL.prototype.realDivide = function (a, b) {
            var op = DIV;
            var outputDtype = 'float32';
            var program = new BinaryOpProgram(op, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, outputDtype);
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.floorDiv = function (a, b) {
            var op = INT_DIV;
            var outputDtype = 'int32';
            var program = new BinaryOpProgram(op, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, outputDtype);
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.add = function (a, b) {
            if (a.dtype === 'complex64' && b.dtype === 'complex64') {
                return this.complexSeparableBinaryOp(a, b, ADD);
            }
            var program = new BinaryOpProgram(ADD, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, upcastType(a.dtype, b.dtype));
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.complexSeparableBinaryOp = function (a, b, op) {
            var _this = this;
            var aData = this.texData.get(a.dataId);
            var bData = this.texData.get(b.dataId);
            var _a = [
                [aData.complexTensors.real, bData.complexTensors.real],
                [aData.complexTensors.imag, bData.complexTensors.imag]
            ].map(function (complexParts) {
                var aPart = complexParts[0], bPart = complexParts[1];
                var program = new BinaryOpProgram(op, a.shape, b.shape);
                var output = _this.makeOutputArray(program.outputShape, upcastType(aPart.dtype, bPart.dtype));
                var aHandle = _this.makeComplexComponentTensorHandle(a, aPart);
                var bHandle = _this.makeComplexComponentTensorHandle(b, bPart);
                return _this.compileAndRun(program, [aHandle, bHandle], output);
            }), real = _a[0], imag = _a[1];
            var complex = this.complex(real, imag);
            real.dispose();
            imag.dispose();
            return complex;
        };
        MathBackendWebGL.prototype.makeComplexComponentTensorHandle = function (complexTensor, complexPart) {
            return {
                dataId: complexPart.dataId,
                dtype: complexPart.dtype,
                shape: complexTensor.shape
            };
        };
        MathBackendWebGL.prototype.addN = function (tensors) {
            var res = tensors[0];
            for (var i = 1; i < tensors.length; i++) {
                res = this.add(res, tensors[i]);
            }
            return res;
        };
        MathBackendWebGL.prototype.subtract = function (a, b) {
            if (a.dtype === 'complex64' && b.dtype === 'complex64') {
                return this.complexSeparableBinaryOp(a, b, SUB);
            }
            var program = new BinaryOpProgram(SUB, a.shape, b.shape);
            var output = this.makeOutputArray(program.outputShape, upcastType(a.dtype, b.dtype));
            return this.compileAndRun(program, [a, b], output);
        };
        MathBackendWebGL.prototype.pow = function (a, b) {
            var program = new BinaryOpProgram(POW, a.shape, b.shape);
            var customSetup = program.getCustomSetupFunc();
            var output = this.makeOutputArray(program.outputShape, upcastType(a.dtype, b.dtype));
            return this.compileAndRun(program, [a, b], output, customSetup);
        };
        MathBackendWebGL.prototype.ceil = function (x) {
            var program = new UnaryOpProgram(x.shape, CEIL);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.floor = function (x) {
            var program = new UnaryOpProgram(x.shape, FLOOR);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.sign = function (x) {
            var program = new UnaryOpProgram(x.shape, SIGN);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.round = function (x) {
            var program = new UnaryOpProgram(x.shape, ROUND);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.exp = function (x) {
            var program = new UnaryOpProgram(x.shape, EXP);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.expm1 = function (x) {
            var program = new UnaryOpProgram(x.shape, EXPM1);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.log = function (x) {
            var program = new UnaryOpProgram(x.shape, LOG);
            var customSetup = program.getCustomSetupFunc();
            return this.compileAndRun(program, [x], null, customSetup);
        };
        MathBackendWebGL.prototype.log1p = function (x) {
            var program = new UnaryOpProgram(x.shape, LOG1P);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.sqrt = function (x) {
            var program = new UnaryOpProgram(x.shape, SQRT);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.rsqrt = function (x) {
            var program = new UnaryOpProgram(x.shape, RSQRT);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.square = function (x) {
            var program = new UnaryOpProgram(x.shape, SQUARE);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.reciprocal = function (x) {
            var program = new UnaryOpProgram(x.shape, RECIPROCAL);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.relu = function (x) {
            var program = new UnaryOpProgram(x.shape, RELU);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.elu = function (x) {
            var program = new UnaryOpProgram(x.shape, ELU);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.eluDer = function (dy, y) {
            var program = new BinaryOpProgram(ELU_DER, dy.shape, y.shape);
            return this.compileAndRun(program, [dy, y]);
        };
        MathBackendWebGL.prototype.selu = function (x) {
            var program = new UnaryOpProgram(x.shape, SELU);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.int = function (x) {
            var program = new UnaryOpProgram(x.shape, TO_INT);
            var output = this.makeOutputArray(program.outputShape, 'int32');
            return this.compileAndRun(program, [x], output);
        };
        MathBackendWebGL.prototype.clip = function (x, min, max) {
            var program = new ClipProgram(x.shape, min, max);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.abs = function (x) {
            var program = new UnaryOpProgram(x.shape, ABS);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.complexAbs = function (x) {
            var xData = this.texData.get(x.dataId);
            var program = new ComplexAbsProgram(x.shape);
            var inputs = [
                this.makeComplexComponentTensorHandle(x, xData.complexTensors.real),
                this.makeComplexComponentTensorHandle(x, xData.complexTensors.imag),
            ];
            return this.compileAndRun(program, inputs);
        };
        MathBackendWebGL.prototype.sigmoid = function (x) {
            var program = new UnaryOpProgram(x.shape, SIGMOID);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.softplus = function (x) {
            var program = new UnaryOpProgram(x.shape, SOFTPLUS);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.sin = function (x) {
            var program = new UnaryOpProgram(x.shape, SIN);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.cos = function (x) {
            var program = new UnaryOpProgram(x.shape, COS);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.tan = function (x) {
            var program = new UnaryOpProgram(x.shape, TAN);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.asin = function (x) {
            var program = new UnaryOpProgram(x.shape, ASIN);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.acos = function (x) {
            var program = new UnaryOpProgram(x.shape, ACOS);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.atan = function (x) {
            var program = new UnaryOpProgram(x.shape, ATAN);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.atan2 = function (a, b) {
            var program = new BinaryOpProgram(ATAN2, a.shape, b.shape);
            return this.compileAndRun(program, [a, b]);
        };
        MathBackendWebGL.prototype.sinh = function (x) {
            var program = new UnaryOpProgram(x.shape, SINH);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.cosh = function (x) {
            var program = new UnaryOpProgram(x.shape, COSH);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.tanh = function (x) {
            var program = new UnaryOpProgram(x.shape, TANH);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.asinh = function (x) {
            var program = new UnaryOpProgram(x.shape, ASINH);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.acosh = function (x) {
            var program = new UnaryOpProgram(x.shape, ACOSH);
            var customSetup = program.getCustomSetupFunc();
            return this.compileAndRun(program, [x], null, customSetup);
        };
        MathBackendWebGL.prototype.atanh = function (x) {
            var program = new UnaryOpProgram(x.shape, ATANH);
            var customSetup = program.getCustomSetupFunc();
            return this.compileAndRun(program, [x], null, customSetup);
        };
        MathBackendWebGL.prototype.erf = function (x) {
            var program = new UnaryOpProgram(x.shape, ERF);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.step = function (x, alpha) {
            var program = new UnaryOpProgram(x.shape, STEP(alpha));
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.conv2dWithIm2Row = function (x, filter, convInfo) {
            var filterWidth = convInfo.filterWidth, filterHeight = convInfo.filterHeight, inChannels = convInfo.inChannels, outWidth = convInfo.outWidth, outHeight = convInfo.outHeight;
            var sharedDim = filterWidth * filterHeight * inChannels;
            var numCols = outHeight * outWidth;
            var x2ColShape = [sharedDim, numCols];
            var xSqueezed = x.squeeze([0]);
            var w2Row = filter.reshape([sharedDim, -1]);
            var im2ColProgram = new Im2ColProgram(x2ColShape, xSqueezed.shape, convInfo);
            var im2Col = this.compileAndRun(im2ColProgram, [xSqueezed], this.makePackedTensor(x2ColShape));
            var matmulProgram = new MatMulPackedProgram(im2Col.shape, w2Row.shape, [numCols, convInfo.outChannels], true, false);
            var product = this.unpackTensor(this.compileAndRun(matmulProgram, [im2Col, w2Row], this.makePackedTensor(matmulProgram.outputShape)));
            return product.reshape([1, outHeight, outWidth, convInfo.outChannels]);
        };
        MathBackendWebGL.prototype.conv2d = function (x, filter, convInfo) {
            if (ENV.get('WEBGL_CONV_IM2COL') && x.shape[0] === 1) {
                return this.conv2dWithIm2Row(x, filter, convInfo);
            }
            var program = new Conv2DProgram(convInfo);
            return this.compileAndRun(program, [x, filter]);
        };
        MathBackendWebGL.prototype.conv2dDerInput = function (dy, filter, convInfo) {
            var program = new Conv2DDerInputProgram(convInfo);
            return this.compileAndRun(program, [dy, filter]);
        };
        MathBackendWebGL.prototype.conv2dDerFilter = function (x, dy, convInfo) {
            var program = new Conv2DDerFilterProgram(convInfo);
            return this.compileAndRun(program, [x, dy]);
        };
        MathBackendWebGL.prototype.depthwiseConv2D = function (x, filter, convInfo) {
            var program = new DepthwiseConv2DProgram(convInfo);
            return this.compileAndRun(program, [x, filter]);
        };
        MathBackendWebGL.prototype.depthwiseConv2DDerInput = function (dy, filter, convInfo) {
            var program = new DepthwiseConv2DDerInputProgram(convInfo);
            return this.compileAndRun(program, [dy, filter]);
        };
        MathBackendWebGL.prototype.depthwiseConv2DDerFilter = function (x, dy, convInfo) {
            var program = new DepthwiseConv2DDerFilterProgram(convInfo);
            return this.compileAndRun(program, [x, dy]);
        };
        MathBackendWebGL.prototype.maxPool = function (x, convInfo) {
            var program = new Pool2DProgram(convInfo, 'max', false);
            var output = this.makeOutputArray(program.outputShape, x.dtype);
            return this.compileAndRun(program, [x], output);
        };
        MathBackendWebGL.prototype.avgPool = function (x, convInfo) {
            var program = new Pool2DProgram(convInfo, 'avg', false);
            var output = this.makeOutputArray(program.outputShape, 'float32');
            return this.compileAndRun(program, [x], output);
        };
        MathBackendWebGL.prototype.maxPoolBackprop = function (dy, x, y, convInfo) {
            var getPositions = true;
            var maxPoolPositionsProgram = new Pool2DProgram(convInfo, 'max', getPositions);
            var maxPoolPositions = this.compileAndRun(maxPoolPositionsProgram, [x]);
            var maxPoolBackPropProgram = new MaxPool2DBackpropProgram(convInfo);
            var output = this.makeOutputArray(maxPoolBackPropProgram.outputShape, x.dtype);
            var result = this.compileAndRun(maxPoolBackPropProgram, [dy, maxPoolPositions], output);
            maxPoolPositions.dispose();
            return result;
        };
        MathBackendWebGL.prototype.avgPoolBackprop = function (dy, x, convInfo) {
            var avgPoolBackpropProgram = new AvgPool2DBackpropProgram(convInfo);
            var output = this.makeOutputArray(avgPoolBackpropProgram.outputShape, x.dtype);
            return this.compileAndRun(avgPoolBackpropProgram, [dy], output);
        };
        MathBackendWebGL.prototype.cast = function (x, dtype) {
            return castTensor(x, dtype, this);
        };
        MathBackendWebGL.prototype.reshape = function (x, shape) {
            return reshapeTensor(x, shape);
        };
        MathBackendWebGL.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
            var program = new ResizeBilinearProgram(x.shape, newHeight, newWidth, alignCorners);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.resizeBilinearBackprop = function (dy, x, alignCorners) {
            var program = new ResizeBilinearBackpropProgram(dy, x, alignCorners);
            return this.compileAndRun(program, [dy]);
        };
        MathBackendWebGL.prototype.resizeNearestNeighbor = function (x, newHeight, newWidth, alignCorners) {
            var program = new ResizeNearestNeighborProgram(x.shape, newHeight, newWidth, alignCorners);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.resizeNearestNeighborBackprop = function (dy, x, alignCorners) {
            var program = new ResizeNearestNeigborBackpropProgram(dy, x, alignCorners);
            return this.compileAndRun(program, [dy]);
        };
        MathBackendWebGL.prototype.multinomial = function (logits, normalized, numSamples, seed) {
            var probs = normalized ? logits : softmax(logits);
            var batchSize = probs.shape[0];
            var numOutcomes = probs.shape[1];
            var program = new MultinomialProgram(batchSize, numOutcomes, numSamples);
            var output = this.makeOutputArray(program.outputShape, 'int32');
            var customSetup = program.getCustomSetupFunc(seed);
            return this.compileAndRun(program, [probs], output, customSetup);
        };
        MathBackendWebGL.prototype.oneHot = function (indices, depth, onValue, offValue) {
            var program = new OneHotProgram(indices.size, depth, onValue, offValue);
            return this.compileAndRun(program, [indices]);
        };
        MathBackendWebGL.prototype.nonMaxSuppression = function (boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
            warn('tf.nonMaxSuppression() in webgl locks the UI thread. ' +
                'Call tf.nonMaxSuppressionAsync() instead');
            var boxesVals = boxes.dataSync();
            var scoresVals = scores.dataSync();
            return nonMaxSuppressionImpl(boxesVals, scoresVals, maxOutputSize, iouThreshold, scoreThreshold);
        };
        MathBackendWebGL.prototype.cropAndResize = function (image, boxes, boxIndex, cropSize, method, extrapolationValue) {
            var program = new CropAndResizeProgram(image.shape, boxes.shape, cropSize, method, extrapolationValue);
            return this.compileAndRun(program, [image, boxes, boxIndex]);
        };
        MathBackendWebGL.prototype.depthToSpace = function (x, blockSize, dataFormat) {
            assert(blockSize > 1, "blockSize should be > 1 for depthToSpace, but was: " + blockSize);
            var batchSize = x.shape[0];
            var inputHeight = (dataFormat === 'NHWC') ? x.shape[1] : x.shape[2];
            var inputWidth = (dataFormat === 'NHWC') ? x.shape[2] : x.shape[3];
            var inputDepth = (dataFormat === 'NHWC') ? x.shape[3] : x.shape[1];
            var outputHeight = inputHeight * blockSize;
            var outputWidth = inputWidth * blockSize;
            var outputDepth = inputDepth / (blockSize * blockSize);
            var outputShape = (dataFormat === 'NHWC') ?
                [batchSize, outputHeight, outputWidth, outputDepth] :
                [batchSize, outputDepth, outputHeight, outputWidth];
            var program = new DepthToSpaceProgram(outputShape, blockSize, dataFormat);
            return this.compileAndRun(program, [x]);
        };
        MathBackendWebGL.prototype.split = function (x, sizeSplits, axis) {
            return split(x, sizeSplits, axis);
        };
        MathBackendWebGL.prototype.scatterND = function (indices, updates, shape) {
            var _a = calculateShapes(updates, indices, shape), sliceRank = _a.sliceRank, numUpdates = _a.numUpdates, sliceSize = _a.sliceSize, strides = _a.strides, outputSize = _a.outputSize;
            var flattenShape = [outputSize / sliceSize, sliceSize];
            var flattenIndices = indices.reshape([numUpdates, sliceRank]);
            var flattenX = updates.reshape([numUpdates, sliceSize]);
            if (outputSize === 0) {
                return reshapeTensor(tensor([]), shape);
            }
            var defaultValue = scalar(0);
            var program = new ScatterProgram(numUpdates, sliceRank, flattenIndices.rank, flattenX.rank, strides, flattenShape);
            return this.compileAndRun(program, [flattenX, flattenIndices, defaultValue])
                .reshape(shape);
        };
        MathBackendWebGL.prototype.sparseToDense = function (sparseIndices, sparseValues, outputShape, defaultValue) {
            var _a = calculateShapes(sparseValues, sparseIndices, outputShape), sliceRank = _a.sliceRank, numUpdates = _a.numUpdates, strides = _a.strides, outputSize = _a.outputSize;
            var sumDupeIndices = false;
            var program = new ScatterProgram(numUpdates, sliceRank, sparseIndices.rank, sparseValues.rank, strides, [outputSize, 1], sumDupeIndices);
            return this.compileAndRun(program, [sparseValues, sparseIndices, defaultValue])
                .reshape(outputShape);
        };
        MathBackendWebGL.prototype.fft = function (x) {
            var inverse = false;
            return this.fftImpl(x, inverse);
        };
        MathBackendWebGL.prototype.ifft = function (x) {
            var inverse = true;
            return this.fftImpl(x, inverse);
        };
        MathBackendWebGL.prototype.fftImpl = function (x, inverse) {
            var xData = this.texData.get(x.dataId);
            var realProgram = new FFTProgram(COMPLEX_FFT.REAL, x.shape, inverse);
            var imagProgram = new FFTProgram(COMPLEX_FFT.IMAG, x.shape, inverse);
            var inputs = [
                this.makeComplexComponentTensorHandle(x, xData.complexTensors.real),
                this.makeComplexComponentTensorHandle(x, xData.complexTensors.imag),
            ];
            var real = this.compileAndRun(realProgram, inputs);
            var imag = this.compileAndRun(imagProgram, inputs);
            var complex = this.complex(real, imag).as2D(x.shape[0], x.shape[1]);
            real.dispose();
            imag.dispose();
            return complex;
        };
        MathBackendWebGL.prototype.gatherND = function (x, indices) {
            var indicesShape = indices.shape;
            var sliceRank = indicesShape[indicesShape.length - 1];
            var _a = prepareAndValidate(x, indices), resultShape = _a[0], numSlices = _a[1], sliceSize = _a[2], strides = _a[3];
            var flattenIndices = indices.reshape([numSlices, sliceRank]);
            var flattenX = x.reshape([x.size / sliceSize, sliceSize]);
            var program = new GatherNDProgram(sliceRank, strides, [numSlices, sliceSize]);
            return this.compileAndRun(program, [flattenX, flattenIndices])
                .reshape(resultShape);
        };
        MathBackendWebGL.prototype.makeOutputArray = function (shape, dtype) {
            return Tensor.make(shape, {}, dtype);
        };
        MathBackendWebGL.prototype.makePackedTensor = function (shape) {
            var packedTensor = Tensor.make(shape, {});
            this.texData.get(packedTensor.dataId).isPacked = true;
            return packedTensor;
        };
        MathBackendWebGL.prototype.unpackTensor = function (input) {
            var program = new UnpackProgram(input.shape);
            return this.compileAndRun(program, [input]);
        };
        MathBackendWebGL.prototype.compileAndRun = function (program, inputs, output, customSetup, pageToCpu) {
            var _this = this;
            if (pageToCpu === void 0) { pageToCpu = true; }
            if (output == null) {
                output =
                    this.makeOutputArray(program.outputShape, inputs[0].dtype);
            }
            if (output.size === 0) {
                this.texData.get(output.dataId).values =
                    getTypedArrayFromDType(output.dtype, 0);
                return output;
            }
            var inputsData = inputs.map(function (input) {
                if (input.dtype === 'complex64') {
                    throw new Error("GPGPUProgram does not support complex64 input. For complex64 " +
                        "dtypes, please separate the program into real and imaginary " +
                        "parts.");
                }
                var texData = _this.texData.get(input.dataId);
                if (texData.texture == null) {
                    if (!(!texData.isPacked && program.usesPackedTextures) &&
                        sizeFromShape(input.shape) <=
                            ENV.get('WEBGL_SIZE_UPLOAD_UNIFORM')) {
                        return {
                            shape: input.shape,
                            texData: null,
                            isUniform: true,
                            uniformValues: _this.readSync(input.dataId)
                        };
                    }
                    if (program.usesPackedTextures) {
                        texData.isPacked = true;
                    }
                }
                else if (texData.isPacked !== !!program.usesPackedTextures) {
                    var preProcessProgram = void 0;
                    var processedInput = void 0;
                    if (texData.isPacked) {
                        preProcessProgram = new UnpackProgram(input.shape);
                        processedInput = _this.compileAndRun(preProcessProgram, [input]);
                    }
                    else {
                        preProcessProgram = new PackProgram(input.shape);
                        processedInput = _this.compileAndRun(preProcessProgram, [input], _this.makePackedTensor(input.shape));
                    }
                    texData = _this.texData.get(processedInput.dataId);
                    input = processedInput;
                }
                _this.uploadToGPU(input.dataId);
                return { shape: input.shape, texData: texData, isUniform: false };
            });
            this.uploadToGPU(output.dataId);
            var outputData = {
                shape: output.shape,
                texData: this.texData.get(output.dataId),
                isUniform: false
            };
            var key = makeShaderKey(program, inputsData, outputData);
            var binary = this.getAndSaveBinary(key, function () {
                return compileProgram(_this.gpgpu, program, inputsData, outputData);
            });
            var shouldTimeProgram = this.activeTimers != null;
            var query;
            if (shouldTimeProgram) {
                query = this.startTimer();
            }
            runProgram(binary, inputsData, outputData, customSetup);
            if (ENV.get('WEBGL_PAGING_ENABLED') && pageToCpu &&
                this.numBytesInGPU > this.NUM_BYTES_BEFORE_PAGING) {
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
                this.activeTimers.push({ name: program.constructor.name, query: this.getQueryTime(query) });
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
            if (this.fromPixels2DContext != null) {
                this.fromPixels2DContext.canvas.remove();
            }
            if (this.gpgpuCreatedLocally) {
                this.gpgpu.dispose();
            }
            this.disposed = true;
        };
        MathBackendWebGL.prototype.floatPrecision = function () {
            var _this = this;
            return tidy(function () {
                if (_this.abs(scalar(1e-8)).get() > 0) {
                    return 32;
                }
                return 16;
            });
        };
        MathBackendWebGL.prototype.uploadToGPU = function (dataId) {
            var texData = this.texData.get(dataId);
            var shape = texData.shape, values = texData.values, texture = texData.texture, dtype = texData.dtype, usage = texData.usage, isPacked = texData.isPacked;
            if (texture != null) {
                if (ENV.get('WEBGL_PAGING_ENABLED')) {
                    var index = this.lruDataGPU.indexOf(dataId);
                    if (index >= 0) {
                        this.lruDataGPU.splice(this.lruDataGPU.indexOf(dataId), 1);
                        this.lruDataGPU.push(dataId);
                    }
                }
                return;
            }
            var shouldTimeProgram = this.activeTimers != null;
            var start;
            if (shouldTimeProgram) {
                start = performance.now();
            }
            var texShape = getTextureShapeFromLogicalShape(shape, isPacked);
            texData.texShape = texShape;
            var newTexture = this.acquireTexture(dataId, texShape, usage, isPacked);
            texData.texture = newTexture;
            if (values != null) {
                if (isPacked) {
                    var batch = sizeFromShape(shape.slice(0, shape.length - 2));
                    var rows = shape.length > 1 ? shape[shape.length - 2] : 1;
                    var cols = shape[shape.length - 1];
                    this.gpgpu.uploadMatrixToPackedTexture(newTexture, batch, rows, cols, typedArrayToFloat32(values, dtype));
                }
                else {
                    this.gpgpu.uploadMatrixToTexture(newTexture, texShape[0], texShape[1], typedArrayToFloat32(values, dtype));
                }
                texData.values = null;
                if (shouldTimeProgram) {
                    this.uploadWaitMs += performance.now() - start;
                }
            }
        };
        MathBackendWebGL.prototype.cacheOnCPU = function (dataId, float32Values) {
            var dontKeepCopyOnGPU = this.delayedStorage;
            var texData = this.texData.get(dataId);
            var texture = texData.texture, texShape = texData.texShape, dtype = texData.dtype, usage = texData.usage, isPacked = texData.isPacked;
            if (dontKeepCopyOnGPU && texture != null) {
                this.releaseTexture(dataId, texture, texShape, usage, isPacked);
                texData.texture = null;
                texData.texShape = null;
            }
            texData.usage = TextureUsage.UPLOAD;
            if (float32Values != null) {
                texData.values = float32ToTypedArray(float32Values, dtype);
            }
        };
        MathBackendWebGL.prototype.releaseTexture = function (dataId, texture, texShape, texType, isPacked) {
            var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
            if (ENV.get('WEBGL_PAGING_ENABLED')) {
                var idx = this.lruDataGPU.indexOf(dataId);
                if (idx >= 0) {
                    this.lruDataGPU.splice(idx, 1);
                }
            }
            this.numBytesInGPU -= this.computeBytes(shape, dtype);
            this.textureManager.releaseTexture(texture, texShape, texType, isPacked);
        };
        MathBackendWebGL.prototype.acquireTexture = function (dataId, texShape, texType, isPacked) {
            var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
            if (ENV.get('WEBGL_PAGING_ENABLED')) {
                this.lruDataGPU.push(dataId);
            }
            this.numBytesInGPU += this.computeBytes(shape, dtype);
            return this.textureManager.acquireTexture(texShape, texType, isPacked);
        };
        MathBackendWebGL.prototype.computeBytes = function (shape, dtype) {
            return sizeFromShape(shape) * bytesPerElement(dtype);
        };
        return MathBackendWebGL;
    }());
    if (ENV.get('IS_BROWSER')) {
        ENV.registerBackend('webgl', function () { return new MathBackendWebGL(); }, 2, setTensorTracker);
    }
    function float32ToTypedArray(a, dtype) {
        if (dtype === 'float32' || dtype === 'complex64') {
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

    function neg_(x) {
        var $x = convertToTensor(x, 'x', 'neg');
        var grad = function (dy) {
            return { $x: function () { return dy.neg(); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.neg($x); }, { $x: $x }, grad);
    }
    function ceil_(x) {
        var $x = convertToTensor(x, 'x', 'ceil');
        var grad = function (dy) {
            return { $x: function () { return zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.ceil($x); }, { $x: $x }, grad);
    }
    function floor_(x) {
        var $x = convertToTensor(x, 'x', 'floor');
        var grad = function (dy) {
            return { $x: function () { return zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.floor($x); }, { $x: $x }, grad);
    }
    function sign_(x) {
        var $x = convertToTensor(x, 'x', 'sign');
        var grad = function (dy) {
            return { $x: function () { return zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sign($x); }, { $x: $x }, grad);
    }
    function round_(x) {
        var $x = convertToTensor(x, 'x', 'round');
        var grad = function (dy) {
            return { $x: function () { return zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.round($x); }, { $x: $x }, grad);
    }
    function exp_(x) {
        var $x = convertToTensor(x, 'x', 'exp');
        var bck = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return dy.mulStrict(y); } };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.exp($x)); }, { $x: $x }, bck);
    }
    function expm1_(x) {
        var $x = convertToTensor(x, 'x', 'expm1');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.exp()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.expm1($x); }, { $x: $x }, grad);
    }
    function log_(x) {
        var $x = convertToTensor(x, 'x', 'log');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.toFloat()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.log($x); }, { $x: $x }, grad);
    }
    function log1p_(x) {
        var $x = convertToTensor(x, 'x', 'log1p');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.add(scalar(1))); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.log1p($x); }, { $x: $x }, grad);
    }
    function sqrt_(x) {
        var $x = convertToTensor(x, 'x', 'sqrt');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.toFloat().sqrt().mul(scalar(2))); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sqrt($x); }, { $x: $x }, grad);
    }
    function rsqrt_(x) {
        var $x = convertToTensor(x, 'x', 'rsqrt');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.pow(scalar(1.5)).mul(scalar(2))).neg(); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.rsqrt($x); }, { $x: $x }, grad);
    }
    function square_(x) {
        var $x = convertToTensor(x, 'x', 'square');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.toFloat().mul(scalar(2))); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.square($x); }, { $x: $x }, grad);
    }
    function reciprocal_(x) {
        var $x = convertToTensor(x, 'x', 'reciprocal');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.square().neg()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.reciprocal($x); }, { $x: $x }, grad);
    }
    function abs_(x) {
        var $x = convertToTensor(x, 'x', 'abs');
        if ($x.dtype === 'complex64') {
            return ENV.engine.runKernel(function (backend) { return backend.complexAbs($x); }, { $x: $x });
        }
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.toFloat().step(-1)); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.abs($x); }, { $x: $x }, grad);
    }
    function clipByValue_(x, clipValueMin, clipValueMax) {
        var $x = convertToTensor(x, 'x', 'clipByValue');
        assert((clipValueMin <= clipValueMax), "Error in clip: min (" + clipValueMin + ") must be " +
            ("less than or equal to max (" + clipValueMax + ")."));
        var grad = function (dy) {
            return {
                $x: function () { return dy.where($x.greaterEqual(scalar(clipValueMin))
                    .logicalAnd($x.lessEqual(scalar(clipValueMax))), zerosLike(dy)); },
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.clip($x, clipValueMin, clipValueMax); }, { $x: $x }, grad);
    }
    function sigmoid_(x) {
        var $x = convertToTensor(x, 'x', 'sigmoid');
        var grad = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return dy.mulStrict(y.mul(scalar(1).sub(y))); } };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.sigmoid($x)); }, { $x: $x }, grad);
    }
    function logSigmoid_(x) {
        var $x = convertToTensor(x, 'x', 'logSigmoid');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.neg().sigmoid()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.softplus($x.neg()).neg(); }, { $x: $x }, grad);
    }
    function softplus_(x) {
        var $x = convertToTensor(x, 'x', 'softplus');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.sigmoid()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.softplus($x); }, { $x: $x }, grad);
    }
    function sin_(x) {
        var $x = convertToTensor(x, 'x', 'sin');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().cos().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sin($x); }, { $x: $x }, grad);
    }
    function cos_(x) {
        var $x = convertToTensor(x, 'x', 'cos');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().sin().neg().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.cos($x); }, { $x: $x }, grad);
    }
    function tan_(x) {
        var $x = convertToTensor(x, 'x', 'tan');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.cos().square()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.tan($x); }, { $x: $x }, grad);
    }
    function asin_(x) {
        var $x = convertToTensor(x, 'x', 'asin');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict(scalar(1).sub($x.toFloat().square()).sqrt()); }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.asin($x); }, { $x: $x }, grad);
    }
    function acos_(x) {
        var $x = convertToTensor(x, 'x', 'acos');
        var grad = function (dy) {
            return {
                $x: function () {
                    return dy.divStrict(scalar(1).sub($x.toFloat().square()).sqrt()).neg();
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.acos($x); }, { $x: $x }, grad);
    }
    function atan_(x) {
        var $x = convertToTensor(x, 'x', 'atan');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict(scalar(1).add($x.toFloat().square())); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.atan($x); }, { $x: $x }, grad);
    }
    function sinh_(x) {
        var $x = convertToTensor(x, 'x', 'sinh');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().cosh().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sinh($x); }, { $x: $x }, grad);
    }
    function cosh_(x) {
        var $x = convertToTensor(x, 'x', 'cosh');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().sinh().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.cosh($x); }, { $x: $x }, grad);
    }
    function tanh_(x) {
        var $x = convertToTensor(x, 'x', 'tanh');
        var grad = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return scalar(1).sub(y.square()).mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.tanh($x)); }, { $x: $x }, grad);
    }
    function asinh_(x) {
        var $x = convertToTensor(x, 'x', 'asinh');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict(scalar(1).add($x.toFloat().square()).sqrt()); }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.asinh($x); }, { $x: $x }, grad);
    }
    function acosh_(x) {
        var $x = convertToTensor(x, 'x', 'acosh');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict($x.toFloat().square().sub(scalar(1)).sqrt()); }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.acosh($x); }, { $x: $x }, grad);
    }
    function atanh_(x) {
        var $x = convertToTensor(x, 'x', 'atanh');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict(scalar(1).sub($x.toFloat().square())); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.atanh($x); }, { $x: $x }, grad);
    }
    function erf_(x) {
        var $x = convertToTensor(x, 'x', 'erf');
        assert($x.dtype === 'int32' || $x.dtype === 'float32', 'Input dtype must be `int32` or `float32`.');
        if ($x.dtype === 'int32') {
            $x = $x.toFloat();
        }
        var grad = function (dy) {
            return {
                $x: function () { return dy.mulStrict(scalar(2 / Math.sqrt(Math.PI)).mul($x.square().neg().exp())); }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.erf($x); }, { $x: $x }, grad);
    }
    function step_(x, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        var $x = convertToTensor(x, 'x', 'step');
        var grad = function (dy) {
            return { $x: function () { return zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.step($x, alpha); }, { $x: $x }, grad);
    }
    var abs = op({ abs_: abs_ });
    var acos = op({ acos_: acos_ });
    var acosh = op({ acosh_: acosh_ });
    var asin = op({ asin_: asin_ });
    var asinh = op({ asinh_: asinh_ });
    var atan = op({ atan_: atan_ });
    var atanh = op({ atanh_: atanh_ });
    var ceil = op({ ceil_: ceil_ });
    var clipByValue = op({ clipByValue_: clipByValue_ });
    var cos = op({ cos_: cos_ });
    var cosh = op({ cosh_: cosh_ });
    var erf = op({ erf_: erf_ });
    var exp = op({ exp_: exp_ });
    var expm1 = op({ expm1_: expm1_ });
    var floor = op({ floor_: floor_ });
    var log$1 = op({ log_: log_ });
    var log1p = op({ log1p_: log1p_ });
    var logSigmoid = op({ logSigmoid_: logSigmoid_ });
    var neg = op({ neg_: neg_ });
    var reciprocal = op({ reciprocal_: reciprocal_ });
    var round = op({ round_: round_ });
    var rsqrt = op({ rsqrt_: rsqrt_ });
    var sigmoid = op({ sigmoid_: sigmoid_ });
    var sign = op({ sign_: sign_ });
    var sin = op({ sin_: sin_ });
    var sinh = op({ sinh_: sinh_ });
    var softplus = op({ softplus_: softplus_ });
    var sqrt = op({ sqrt_: sqrt_ });
    var square = op({ square_: square_ });
    var step = op({ step_: step_ });
    var tan = op({ tan_: tan_ });
    var tanh$1 = op({ tanh_: tanh_ });

    function batchNormalization2d_(x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = convertToTensor(x, 'x', 'batchNormalization');
        var $mean = convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = convertToTensor(offset, 'offset', 'batchNormalization');
        }
        assert($x.rank === 2, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            ($x.rank + "."));
        assert($mean.rank === 2 || $mean.rank === 1, "Error in batchNormalization2D: mean must be rank 2 or rank 1 but " +
            ("got rank " + $mean.rank + "."));
        assert($variance.rank === 2 || $variance.rank === 1, "Error in batchNormalization2D: variance must be rank 2 or rank 1 " +
            ("but got rank " + $variance.rank + "."));
        if ($scale != null) {
            assert($scale.rank === 2 || $scale.rank === 1, "Error in batchNormalization2D: scale must be rank 2 or rank 1 " +
                ("but got rank " + $scale.rank + "."));
        }
        if ($offset != null) {
            assert($offset.rank === 2 || $offset.rank === 1, "Error in batchNormalization2D: offset must be rank 2 or rank 1 " +
                ("but got rank " + $offset.rank + "."));
        }
        return batchNormalization($x, $mean, $variance, varianceEpsilon, $scale, $offset);
    }
    function batchNormalization3d_(x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = convertToTensor(x, 'x', 'batchNormalization');
        var $mean = convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = convertToTensor(offset, 'offset', 'batchNormalization');
        }
        assert($x.rank === 3, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            ($x.rank + "."));
        assert($mean.rank === 3 || $mean.rank === 1, "Error in batchNormalization3D: mean must be rank 3 or rank 1 but " +
            ("got rank " + $mean.rank + "."));
        assert($variance.rank === 3 || $variance.rank === 1, "Error in batchNormalization3D: variance must be rank 3 or rank 1 " +
            ("but got rank " + $variance.rank + "."));
        if ($scale != null) {
            assert($scale.rank === 3 || $scale.rank === 1, "Error in batchNormalization3D: scale must be rank 3 or rank 1 " +
                ("but got rank " + $scale.rank + "."));
        }
        if ($offset != null) {
            assert($offset.rank === 3 || $offset.rank === 1, "Error in batchNormalization3D: offset must be rank 3 or rank 1 " +
                ("but got rank " + $offset.rank + "."));
        }
        return batchNormalization($x, $mean, $variance, varianceEpsilon, $scale, $offset);
    }
    function batchNormalization4d_(x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = convertToTensor(x, 'x', 'batchNormalization');
        var $mean = convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = convertToTensor(offset, 'offset', 'batchNormalization');
        }
        assert($x.rank === 4, "Error in batchNormalization4D: x must be rank 4 but got rank " +
            ($x.rank + "."));
        assert($mean.rank === 4 || $mean.rank === 1, "Error in batchNormalization4D: mean must be rank 4 or rank 1 but " +
            ("got rank " + $mean.rank + "."));
        assert($variance.rank === 4 || $variance.rank === 1, "Error in batchNormalization4D: variance must be rank 4 or rank 1 " +
            ("but got rank " + $variance.rank + "."));
        if ($scale != null) {
            assert($scale.rank === 4 || $scale.rank === 1, "Error in batchNormalization4D: scale must be rank 4 or rank 1 " +
                ("but got rank " + $scale.rank + "."));
        }
        if ($offset != null) {
            assert($offset.rank === 4 || $offset.rank === 1, "Error in batchNormalization4D: offset must be rank 4 or rank 1 " +
                ("but got rank " + $offset.rank + "."));
        }
        return batchNormalization($x, $mean, $variance, varianceEpsilon, $scale, $offset);
    }
    function batchNormalization_(x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var $x = convertToTensor(x, 'x', 'batchNormalization');
        var $mean = convertToTensor(mean, 'mean', 'batchNormalization');
        var $variance = convertToTensor(variance, 'variance', 'batchNormalization');
        var $scale;
        if (scale != null) {
            $scale = convertToTensor(scale, 'scale', 'batchNormalization');
        }
        var $offset;
        if (offset != null) {
            $offset = convertToTensor(offset, 'offset', 'batchNormalization');
        }
        assert($mean.rank === $variance.rank, 'Batch normalization gradient requires mean and variance to have ' +
            'equal ranks.');
        assert($offset == null || $mean.rank === $offset.rank, 'Batch normalization gradient requires mean and offset to have ' +
            'equal ranks.');
        assert($scale == null || $mean.rank === $scale.rank, 'Batch normalization gradient requires mean and scale to have ' +
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
            var scaleValue = $scale == null ? scalar(1) : $scale;
            var reductionAxes = getReductionAxes($mean.shape, x4D.shape);
            var tileShape = [];
            if ($mean.rank === 1) {
                for (var i = 0; i < x4D.shape.length - 1; ++i) {
                    tileShape.push(x4D.shape[i]);
                }
                tileShape.push(1);
            }
            var xMinusMean = $x.sub($mean);
            var dyTimesScaleValue = dy.mul(scaleValue);
            var oneOverSqrtVariance = rsqrt($variance.add(scalar(varianceEpsilon)));
            var minusHalfRCube = oneOverSqrtVariance.mul(oneOverSqrtVariance)
                .mul(oneOverSqrtVariance)
                .mul(scalar(-0.5));
            var derX = function () {
                if ($mean.rank === 1) {
                    return dy
                        .mul(tile(oneOverSqrtVariance.as4D(1, 1, 1, $mean.shape[0]), tileShape))
                        .mul(scaleValue)
                        .reshape($x.shape);
                }
                else {
                    return dy.mul(oneOverSqrtVariance).mul(scaleValue).reshape($x.shape);
                }
            };
            var derMean = function () {
                var meanDer = oneOverSqrtVariance.mul(scalar(-1)).mul(dyTimesScaleValue);
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
        var res = ENV.engine.runKernel(function (backend) { return backend.batchNormalization(x4D, batchnormReshape4D($mean), batchnormReshape4D($variance), varianceEpsilon, batchnormReshape4D($scale), batchnormReshape4D($offset)); }, { $x: $x, $mean: $mean, $variance: $variance, $scale: $scale, $offset: $offset }, der);
        return res.reshape($x.shape);
    }
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
    var batchNormalization2d = op({ batchNormalization2d_: batchNormalization2d_ });
    var batchNormalization3d = op({ batchNormalization3d_: batchNormalization3d_ });
    var batchNormalization4d = op({ batchNormalization4d_: batchNormalization4d_ });
    var batchNormalization = op({ batchNormalization_: batchNormalization_ });

    function computePool2DInfo(inShape, filterSize, strides, dilations, pad, roundingMode, dataFormat) {
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
        return computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, false, dataFormat);
    }
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
            effectiveFilterHeight: effectiveFilterHeight,
            effectiveFilterWidth: effectiveFilterWidth,
            dilationHeight: dilationHeight,
            dilationWidth: dilationWidth,
            inShape: inShape,
            outShape: outShape,
            filterShape: filterShape
        };
    }
    function computeOutputShape3D(inShape, fieldSize, outDepth, stride, zeroPad, roundingMode) {
        if (zeroPad == null) {
            zeroPad = computeDefaultPad(inShape, fieldSize, stride);
        }
        var inputRows = inShape[0];
        var inputCols = inShape[1];
        var outputRows = conditionalRound((inputRows - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
        assert(isInt(outputRows), "The output # of rows (" + outputRows + ") must be an integer. Change the " +
            "stride and/or zero pad parameters");
        var outputCols = conditionalRound((inputCols - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
        assert(isInt(outputCols), "The output # of columns (" + outputCols + ") must be an integer. Change " +
            "the stride and/or zero pad parameters");
        return [outputRows, outputCols, outDepth];
    }
    function computeDefaultPad(inputShape, fieldSize, stride, dilation) {
        if (dilation === void 0) { dilation = 1; }
        var effectiveFieldSize = getEffectiveFilterSize(fieldSize, dilation);
        return Math.floor((inputShape[0] * (stride - 1) - stride + effectiveFieldSize) / 2);
    }
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
    function tupleValuesAreOne(param) {
        var _a = parseTupleParam(param), dimA = _a[0], dimB = _a[1];
        return dimA === 1 && dimB === 1;
    }
    function eitherStridesOrDilationsAreOne(strides, dilations) {
        return tupleValuesAreOne(strides) || tupleValuesAreOne(dilations);
    }

    function matMul_(a, b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        var $a = convertToTensor(a, 'a', 'matMul');
        var $b = convertToTensor(b, 'b', 'matMul');
        var innerShapeA = transposeA ? $a.shape[$a.rank - 2] : $a.shape[$a.rank - 1];
        var innerShapeB = transposeB ? $b.shape[$b.rank - 1] : $b.shape[$b.rank - 2];
        var outerShapeA = transposeA ? $a.shape[$a.rank - 1] : $a.shape[$a.rank - 2];
        var outerShapeB = transposeB ? $b.shape[$b.rank - 2] : $b.shape[$b.rank - 1];
        var outerDimsA = $a.shape.slice(0, -2);
        var outerDimsB = $b.shape.slice(0, -2);
        var batchDimA = sizeFromShape(outerDimsA);
        var batchDimB = sizeFromShape(outerDimsB);
        assert($a.rank >= 2 && $b.rank >= 2 && $a.rank === $b.rank, "Error in matMul: inputs must have the same rank of at least 2, " +
            ("got ranks " + $a.rank + " and " + $b.rank + "."));
        assert(arraysEqual(outerDimsA, outerDimsB), "Error in matMul: outer dimensions (" + outerDimsA + ") and (" +
            (outerDimsB + ") of Tensors with shapes " + $a.shape + " and ") +
            ($b.shape + " must match."));
        assert(innerShapeA === innerShapeB, "Error in matMul: inner shapes (" + innerShapeA + ") and (" +
            (innerShapeB + ") of Tensors with shapes " + $a.shape + " and ") +
            ($b.shape + " and transposeA=" + transposeA) +
            (" and transposeB=" + transposeB + " must match."));
        var outShape = $a.shape.slice(0, -2).concat([outerShapeA, outerShapeB]);
        var a3D = transposeA ? $a.as3D(batchDimA, innerShapeA, outerShapeA) :
            $a.as3D(batchDimA, outerShapeA, innerShapeA);
        var b3D = transposeB ? $b.as3D(batchDimB, outerShapeB, innerShapeB) :
            $b.as3D(batchDimB, innerShapeB, outerShapeB);
        var grad = function (dy) {
            if (!transposeA && !transposeB) {
                return {
                    $a: function () { return dy.matMul(b3D.toFloat(), false, true); },
                    $b: function () { return a3D.toFloat().matMul(dy, true, false); }
                };
            }
            else if (!transposeA && transposeB) {
                return {
                    $a: function () { return dy.matMul(b3D.toFloat(), false, false); },
                    $b: function () { return dy.matMul(a3D.toFloat(), true, false); }
                };
            }
            else if (transposeA && !transposeB) {
                return {
                    $a: function () { return b3D.toFloat().matMul(dy, false, true); },
                    $b: function () { return a3D.toFloat().matMul(dy, false, false); }
                };
            }
            else {
                return {
                    $a: function () { return b3D.toFloat().matMul(dy, true, true); },
                    $b: function () { return dy.matMul(a3D.toFloat(), true, true); }
                };
            }
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.batchMatMul(a3D, b3D, transposeA, transposeB); }, { $a: a3D, $b: b3D }, grad);
        return res.reshape(outShape);
    }
    function outerProduct_(v1, v2) {
        var $v1 = convertToTensor(v1, 'v1', 'outerProduct');
        var $v2 = convertToTensor(v2, 'v2', 'outerProduct');
        assert($v1.rank === 1 && $v2.rank === 1, "Error in outerProduct: inputs must be rank 1, but got ranks " +
            ($v1.rank + " and " + $v2.rank + "."));
        return $v1.as2D(-1, 1).matMul($v2.as2D(1, -1));
    }
    function dot_(t1, t2) {
        var $t1 = convertToTensor(t1, 't1', 'dot');
        var $t2 = convertToTensor(t2, 't2', 'dot');
        assert(($t1.rank === 1 || $t1.rank === 2) && ($t2.rank === 1 || $t2.rank === 2), "Error in dot: inputs must all be rank 1 or 2, but got ranks " +
            ($t1.rank + " and " + $t2.rank + "."));
        var t1Inner = ($t1.rank === 1 ? $t1.size : $t1.shape[1]);
        var t2Inner = ($t2.rank === 1 ? $t2.size : $t2.shape[0]);
        assert(t1Inner === t2Inner, "Error in dot: inner dimensions of inputs must match, but got " +
            (t1Inner + " and " + t2Inner + "."));
        if ($t1.rank === 1 && $t2.rank === 1) {
            return $t1.as2D(1, -1).matMul($t2.as2D(-1, 1)).asScalar();
        }
        else if ($t1.rank === 1 && $t2.rank === 2) {
            return $t1.as2D(1, -1).matMul($t2.as2D($t2.shape[0], $t2.shape[1])).as1D();
        }
        else if ($t1.rank === 2 && $t2.rank === 1) {
            return $t1.matMul($t2.as2D(-1, 1)).as1D();
        }
        else {
            return $t1.matMul($t2.as2D($t2.shape[0], $t2.shape[1]));
        }
    }
    var matMul = op({ matMul_: matMul_ });
    var dot = op({ dot_: dot_ });
    var outerProduct = op({ outerProduct_: outerProduct_ });

    function conv1d_(x, filter, stride, pad, dataFormat, dilation, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NWC'; }
        if (dilation === void 0) { dilation = 1; }
        var $x = convertToTensor(x, 'x', 'conv1d');
        var $filter = convertToTensor(filter, 'filter', 'conv1d');
        var x3D = $x;
        var reshapedTo3D = false;
        if ($x.rank === 2) {
            reshapedTo3D = true;
            x3D = $x.as3D(1, $x.shape[0], $x.shape[1]);
        }
        assert(x3D.rank === 3, "Error in conv1d: input must be rank 3, but got rank " + x3D.rank + ".");
        assert($filter.rank === 3, "Error in conv1d: filter must be rank 3, but got rank " +
            ($filter.rank + "."));
        if (dimRoundingMode != null) {
            assert(isInt(pad), "Error in conv1d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        assert(x3D.shape[2] === $filter.shape[1], "Error in conv1d: depth of input (" + x3D.shape[2] + ") must match " +
            ("input depth for filter " + $filter.shape[1] + "."));
        assert(eitherStridesOrDilationsAreOne(stride, dilation), 'Error in conv1D: Either stride or dilation must be 1. ' +
            ("Got stride " + stride + " and dilation '" + dilation + "'"));
        assert(dataFormat === 'NWC', "Error in conv1d: got dataFormat of " + dataFormat + " but only NWC is currently supported.");
        var filter4D = $filter.as4D(1, $filter.shape[0], $filter.shape[1], $filter.shape[2]);
        var input4D = x3D.as4D(x3D.shape[0], 1, x3D.shape[1], x3D.shape[2]);
        var strides = [1, stride];
        var dilations = [1, dilation];
        var conv2dDataFormat = 'NHWC';
        var res = conv2d(input4D, filter4D, strides, pad, conv2dDataFormat, dilations, dimRoundingMode);
        if (reshapedTo3D) {
            return res.as2D(res.shape[2], res.shape[3]);
        }
        return res.as3D(res.shape[0], res.shape[2], res.shape[3]);
    }
    function conv2d_(x, filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        var $x = convertToTensor(x, 'x', 'conv2d');
        var $filter = convertToTensor(filter, 'filter', 'conv2d');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        assert(x4D.rank === 4, "Error in conv2d: input must be rank 4, but got rank " + x4D.rank + ".");
        assert($filter.rank === 4, "Error in conv2d: filter must be rank 4, but got rank " +
            ($filter.rank + "."));
        if (dimRoundingMode != null) {
            assert(isInt(pad), "Error in conv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        assert(x4D.shape[3] === $filter.shape[2], "Error in conv2d: depth of input (" + x4D.shape[3] + ") must match " +
            ("input depth for filter " + $filter.shape[2] + "."));
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in conv2D: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        assert(dataFormat === 'NHWC', "Error in conv2d: got dataFormat of " + dataFormat + " but only NHWC is currently supported.");
        var convInfo = computeConv2DInfo(x4D.shape, $filter.shape, strides, dilations, pad, dimRoundingMode);
        var res;
        if (convInfo.filterHeight === 1 && convInfo.filterWidth === 1 &&
            convInfo.dilationHeight === 1 && convInfo.dilationWidth === 1 &&
            convInfo.strideHeight === 1 && convInfo.strideWidth === 1 &&
            (convInfo.padInfo.type === 'SAME' || convInfo.padInfo.type === 'VALID')) {
            var x2d = x4D.reshape([-1, convInfo.inChannels]);
            var w2d = $filter.reshape([convInfo.inChannels, convInfo.outChannels]);
            res = matMul(x2d, w2d).reshape(convInfo.outShape);
        }
        else {
            var grad = function (dy) {
                assert(tupleValuesAreOne(dilations), 'Error in gradient of conv2D: dilation rates greater than 1 are not' +
                    ("yet supported in gradients. Got dilations '" + dilations + "'"));
                return {
                    x: function () { return conv2dDerInput_(x4D.shape, dy, $filter, strides, pad); },
                    $filter: function () { return conv2dDerFilter_(x4D, dy, $filter.shape, strides, pad); }
                };
            };
            res = ENV.engine.runKernel(function (backend) { return backend.conv2d(x4D, $filter, convInfo); }, { x: x4D, $filter: $filter }, grad);
        }
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function conv2dDerInput_(xShape, dy, filter, strides, pad, dimRoundingMode) {
        assert(xShape.length === dy.rank, "Length of inShape " +
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
        assert(xShape4D.length === 4, "Error in conv2dDerInput: inShape must be length 4, but got length " +
            (xShape4D.length + "."));
        assert(dy4D.rank === 4, "Error in conv2dDerInput: dy must be rank 4, but got " +
            ("rank " + dy4D.rank));
        assert(filter.rank === 4, "Error in conv2dDerInput: filter must be rank 4, but got " +
            ("rank " + filter.rank));
        assert(inDepth === filter.shape[2], "Error in conv2dDerInput: depth of input (" + inDepth + ") must " +
            ("match input depth for filter " + filter.shape[2] + "."));
        assert(outDepth === filter.shape[3], "Error in conv2dDerInput: depth of output (" + outDepth + ") must " +
            ("match output depth for filter " + filter.shape[3] + "."));
        if (dimRoundingMode != null) {
            assert(isInt(pad), "Error in conv2dDerInput: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var grad = function (ddx) {
            var dataFormat = 'NHWC';
            return {
                dy4D: function () { return conv2d(ddx, filter, strides, pad, dataFormat, dilations, dimRoundingMode); },
                filter: function () { return conv2dDerFilter(ddx, dy4D, filter.shape, strides, pad, dimRoundingMode); }
            };
        };
        var convInfo = computeConv2DInfo(xShape4D, filter.shape, strides, dilations, pad, dimRoundingMode);
        var res = ENV.engine.runKernel(function (backend) { return backend.conv2dDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D, filter: filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function conv2dDerFilter_(x, dy, filterShape, strides, pad, dimRoundingMode) {
        var x4D = x;
        if (x.rank === 3) {
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        var dy4D = dy;
        if (dy4D.rank === 3) {
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        assert(x4D.rank === 4, "Error in conv2dDerFilter: input must be rank 4, but got shape " +
            (x4D.shape + "."));
        assert(dy4D.rank === 4, "Error in conv2dDerFilter: dy must be rank 4, but got shape " +
            (dy4D.shape + "."));
        assert(filterShape.length === 4, "Error in conv2dDerFilter: filterShape must be length 4, but got " +
            (filterShape + "."));
        assert(x4D.shape[3] === filterShape[2], "Error in conv2dDerFilter: depth of input " + x4D.shape[3] + ") must " +
            ("match input depth in filter (" + filterShape[2] + "."));
        assert(dy4D.shape[3] === filterShape[3], "Error in conv2dDerFilter: depth of dy (" + dy4D.shape[3] + ") must " +
            ("match output depth for filter (" + filterShape[3] + ")."));
        if (dimRoundingMode != null) {
            assert(isInt(pad), "Error in conv2dDerFilter: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = computeConv2DInfo(x4D.shape, filterShape, strides, dilations, pad, dimRoundingMode);
        return ENV.engine.runKernel(function (backend) { return backend.conv2dDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
    }
    function conv2dTranspose_(x, filter, outputShape, strides, pad, dimRoundingMode) {
        var $x = convertToTensor(x, 'x', 'conv2dTranspose');
        var $filter = convertToTensor(filter, 'filter', 'conv2dTranspose');
        return conv2dDerInput_(outputShape, $x, $filter, strides, pad, dimRoundingMode);
    }
    function depthwiseConv2d_(x, filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        var $x = convertToTensor(x, 'x', 'depthwiseConv2d');
        var $filter = convertToTensor(filter, 'filter', 'depthwiseConv2d');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        assert(x4D.rank === 4, "Error in depthwiseConv2d: input must be rank 4, but got " +
            ("rank " + x4D.rank + "."));
        assert($filter.rank === 4, "Error in depthwiseConv2d: filter must be rank 4, but got rank " +
            ($filter.rank + "."));
        assert(x4D.shape[3] === $filter.shape[2], "Error in depthwiseConv2d: number of input channels " +
            ("(" + x4D.shape[3] + ") must match the inChannels dimension in ") +
            ("filter " + $filter.shape[2] + "."));
        if (dilations == null) {
            dilations = [1, 1];
        }
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in depthwiseConv2d: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        if (dimRoundingMode != null) {
            assert(isInt(pad), "Error in depthwiseConv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = computeConv2DInfo(x4D.shape, $filter.shape, strides, dilations, pad, dimRoundingMode, true);
        var grad = function (dy) {
            assert(tupleValuesAreOne(dilations), 'Error in gradient of depthwiseConv2d: dilation rates greater than ' +
                ("1 are not yet supported. Got dilations '" + dilations + "'"));
            return {
                x: function () { return depthwiseConv2dDerInput(x4D.shape, dy, $filter, convInfo); },
                $filter: function () { return depthwiseConv2dDerFilter(x4D, dy, $filter.shape, convInfo); },
            };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2D(x4D, $filter, convInfo); }, { x: x4D, $filter: $filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function separableConv2d_(x, depthwiseFilter, pointwiseFilter, strides, pad, dilation, dataFormat) {
        if (dilation === void 0) { dilation = [1, 1]; }
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        var $x = convertToTensor(x, 'x', 'separableConv2d');
        var $depthwiseFilter = convertToTensor(depthwiseFilter, 'depthwiseFilter', 'separableConv2d');
        var $pointwiseFilter = convertToTensor(pointwiseFilter, 'pointwiseFilter', 'separableConv2d');
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
        assert(x4D.rank === 4, "Error in separableConv2d: input must be rank 4, but got " +
            ("rank " + x4D.rank + "."));
        assert($depthwiseFilter.rank === 4, "Error in separableConv2d: depthwise filter must be rank 4, but got " +
            ("rank " + $depthwiseFilter.rank + "."));
        assert($pointwiseFilter.rank === 4, "Error in separableConv2d: pointwise filter must be rank 4, but got " +
            ("rank " + $depthwiseFilter.rank + "."));
        assert($pointwiseFilter.shape[0] === 1, "Error in separableConv2d: the first dimension of pointwise filter " +
            (" must be 1, but got " + $pointwiseFilter.shape[0] + "."));
        assert($pointwiseFilter.shape[1] === 1, "Error in separableConv2d: the second dimension of pointwise filter " +
            (" must be 1, but got " + $pointwiseFilter.shape[1] + "."));
        var inChannels = $depthwiseFilter.shape[2];
        var channelMultiplier = $depthwiseFilter.shape[3];
        assert($pointwiseFilter.shape[2] === inChannels * channelMultiplier, "Error in separableConv2d: the third dimension of pointwise filter " +
            ("must be " + inChannels * channelMultiplier + ", ") +
            ("but got " + $pointwiseFilter.shape[2] + "."));
        var depthwise = depthwiseConv2d(x4D, $depthwiseFilter, strides, pad, dataFormat, dilation);
        var pointwiseStride = 1;
        var res = conv2d(depthwise, $pointwiseFilter, pointwiseStride, 'valid', dataFormat);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function depthwiseConv2dDerInput(xShape, dy, filter, convInfo) {
        var dy4D = dy;
        var reshapedTo4D = false;
        if (dy.rank === 3) {
            reshapedTo4D = true;
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        var res = ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2DDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D });
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
        return ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2DDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
    }
    var conv1d = op({ conv1d_: conv1d_ });
    var conv2d = op({ conv2d_: conv2d_ });
    var conv2dDerFilter = op({ conv2dDerFilter_: conv2dDerFilter_ });
    var depthwiseConv2d = op({ depthwiseConv2d_: depthwiseConv2d_ });
    var separableConv2d = op({ separableConv2d_: separableConv2d_ });
    var conv2dTranspose = op({ conv2dTranspose_: conv2dTranspose_ });

    function reverse1d_(x) {
        var $x = convertToTensor(x, 'x', 'reverse');
        assert($x.rank === 1, "Error in reverse1D: x must be rank 1 but got\n             rank " + $x.rank + ".");
        return reverse($x, 0);
    }
    function reverse2d_(x, axis) {
        var $x = convertToTensor(x, 'x', 'reverse');
        assert($x.rank === 2, "Error in reverse2D: x must be rank 2 but got\n             rank " + $x.rank + ".");
        return reverse($x, axis);
    }
    function reverse3d_(x, axis) {
        var $x = convertToTensor(x, 'x', 'reverse');
        assert($x.rank === 3, "Error in reverse3D: x must be rank 3 but got\n             rank " + $x.rank + ".");
        return reverse($x, axis);
    }
    function reverse4d_(x, axis) {
        var $x = convertToTensor(x, 'x', 'reverse');
        assert($x.rank === 4, "Error in reverse4D: x must be rank 4 but got\n             rank " + $x.rank + ".");
        return reverse($x, axis);
    }
    function reverse_(x, axis) {
        var $x = convertToTensor(x, 'x', 'reverse');
        if ($x.rank === 0) {
            return $x.clone();
        }
        var axes = parseAxisParam(axis, $x.shape);
        var grad = function (dy) {
            return { $x: function () { return dy.reverse(axes); } };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.reverse($x, axes); }, { $x: $x }, grad);
        return res.reshapeAs($x);
    }
    var reverse = op({ reverse_: reverse_ });
    var reverse1d = op({ reverse1d_: reverse1d_ });
    var reverse2d = op({ reverse2d_: reverse2d_ });
    var reverse3d = op({ reverse3d_: reverse3d_ });
    var reverse4d = op({ reverse4d_: reverse4d_ });

    function maxPoolImpl_(x, filterSize, strides, dilations, pad$$1, dimRoundingMode) {
        var $x = convertToTensor(x, 'x', 'maxPool');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        if (dilations == null) {
            dilations = [1, 1];
        }
        assert(x4D.rank === 4, "Error in maxPool: input must be rank 4 but got rank " + x4D.rank + ".");
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in maxPool: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        if (dimRoundingMode != null) {
            assert(isInt(pad$$1), "Error in maxPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad$$1 + "."));
        }
        var convInfo = computePool2DInfo(x4D.shape, filterSize, strides, dilations, pad$$1, dimRoundingMode);
        var grad = function (dy, saved) {
            var y4D = saved[0];
            return {
                x: function () { return maxPoolBackprop(dy, x4D, y4D, filterSize, strides, dilations, pad$$1); }
            };
        };
        var res = ENV.engine.runKernel(function (backend, save) { return save(backend.maxPool(x4D, convInfo)); }, { x: x4D }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function maxPool_(x, filterSize, strides, pad$$1, dimRoundingMode) {
        return maxPoolImpl_(x, filterSize, strides, 1, pad$$1, dimRoundingMode);
    }
    function avgPoolImpl_(x, filterSize, strides, dilations, pad$$1, dimRoundingMode) {
        var $x = convertToTensor(x, 'x', 'avgPool');
        assert($x.dtype === 'float32', 'The input dtype to avgPool must be float32');
        if (dilations == null) {
            dilations = [1, 1];
        }
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in avgPool: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        assert(x4D.rank === 4, "Error in avgPool: x must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            assert(isInt(pad$$1), "Error in avgPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad$$1 + "."));
        }
        var convInfo = computePool2DInfo(x4D.shape, filterSize, strides, dilations, pad$$1);
        var grad = function (dy) {
            return {
                x: function () { return avgPoolBackprop(dy, x4D, filterSize, strides, dilations, pad$$1); }
            };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.avgPool(x4D, convInfo); }, { x: x4D }, grad);
        res = res.cast($x.dtype);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function avgPool_(x, filterSize, strides, pad$$1, dimRoundingMode) {
        return avgPoolImpl_(x, filterSize, strides, 1, pad$$1, dimRoundingMode);
    }
    function pool_(input, windowShape, poolingType, pad$$1, dilations, strides) {
        if (dilations == null) {
            dilations = [1, 1];
        }
        if (strides == null) {
            strides = 1;
        }
        if (pad$$1 === 0) {
            pad$$1 = 'valid';
        }
        var $x = convertToTensor(input, 'x', 'maxPool');
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in pool: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        var convInfo = computePool2DInfo(x4D.shape, windowShape, strides, dilations, pad$$1);
        var dilation = [convInfo.dilationHeight, convInfo.dilationWidth];
        var basePadding;
        if (pad$$1 === 'same') {
            basePadding = withSpaceToBatchBasePaddings([convInfo.filterHeight, convInfo.filterWidth], dilation);
        }
        else {
            basePadding = [[0, 0], [0, 0]];
        }
        var isDilationOne = dilation[0] === 1 && dilation[1] === 1;
        var _a = requiredSpaceToBatchPaddings([convInfo.inHeight, convInfo.inWidth], dilation, basePadding), adjustedPadding = _a[0], adjustedCrops = _a[1];
        var convertedPad = isDilationOne ? pad$$1 : 'valid';
        var convertedX = isDilationOne ? x4D : spaceToBatchND(x4D, dilation, adjustedPadding);
        var forwardOp = poolingType === 'avg' ?
            function () { return avgPoolImpl_(convertedX, windowShape, strides, 1, convertedPad); } :
            function () { return maxPoolImpl_(convertedX, windowShape, strides, 1, convertedPad); };
        var y = forwardOp();
        var res = isDilationOne ? y : batchToSpaceND(y, dilation, adjustedCrops);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function maxPoolBackprop(dy, input, output, filterSize, strides, dilations, pad$$1, dimRoundingMode) {
        var $dy = convertToTensor(dy, 'dy', 'maxPoolBackprop');
        var $input = convertToTensor(input, 'input', 'maxPoolBackprop');
        var $output = convertToTensor(output, 'output', 'maxPoolBackprop');
        assert($input.rank === $dy.rank, "Rank of input (" + $input.rank + ") does not match rank of dy (" + $dy.rank + ")");
        if (dilations == null) {
            dilations = [1, 1];
        }
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in maxPoolBackProp: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        assert($dy.rank === 4, "Error in maxPoolBackprop: dy must be rank 4 but got rank " +
            ($dy.rank + "."));
        assert($input.rank === 4, "Error in maxPoolBackprop: input must be rank 4 but got rank " +
            ($input.rank + "."));
        if (dimRoundingMode != null) {
            assert(isInt(pad$$1), "Error in maxPoolBackprop: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad$$1 + "."));
        }
        var convInfo = computePool2DInfo($input.shape, filterSize, strides, dilations, pad$$1, dimRoundingMode);
        var res = ENV.engine.runKernel(function (backend) { return backend.maxPoolBackprop($dy, $input, $output, convInfo); }, { $dy: $dy, $input: $input });
        return res;
    }
    function avgPoolBackprop(dy, input, filterSize, strides, dilations, pad$$1) {
        var $dy = convertToTensor(dy, 'dy', 'avgPoolBackprop');
        var $input = convertToTensor(input, 'input', 'avgPoolBackprop');
        assert($input.rank === $dy.rank, "Rank of input (" + $input.rank + ") does not match rank of dy (" + $dy.rank + ")");
        if (dilations == null) {
            dilations = [1, 1];
        }
        assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in avgPoolBackprop: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        var input4D = $input;
        var dy4D = $dy;
        var reshapedTo4D = false;
        if ($input.rank === 3) {
            reshapedTo4D = true;
            input4D = $input.as4D(1, $input.shape[0], $input.shape[1], $input.shape[2]);
            dy4D = $dy.as4D(1, $dy.shape[0], $dy.shape[1], $dy.shape[2]);
        }
        assert(dy4D.rank === 4, "Error in avgPoolBackprop: dy must be rank 4 but got rank " +
            (dy4D.rank + "."));
        assert(input4D.rank === 4, "Error in avgPoolBackprop: input must be rank 4 but got rank " +
            (input4D.rank + "."));
        var convInfo = computePool2DInfo(input4D.shape, filterSize, strides, dilations, pad$$1);
        var res = ENV.engine.runKernel(function (backend) { return backend.avgPoolBackprop(dy4D, input4D, convInfo); }, { dy4D: dy4D, input4D: input4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function requiredSpaceToBatchPaddings(inputShape, blockShape, basePadding) {
        var padStart = basePadding.map(function (b) { return b[0]; });
        var origPadEnd = basePadding.map(function (b) { return b[1]; });
        var fullInputShape = inputShape.concat(padStart, origPadEnd);
        var padEndExtra = blockShape.map(function (b, i) { return (b - fullInputShape[i] % b) % b; });
        var padEnd = origPadEnd.map(function (s, i) { return s + padEndExtra[i]; });
        var paddings = blockShape.map(function (_, i) { return [padStart[i], padEnd[i]]; });
        var crops = blockShape.map(function (_, i) { return [0, padEndExtra[i]]; });
        return [paddings, crops];
    }
    function withSpaceToBatchBasePaddings(filterShape, dilation) {
        var dilatedFilterShape = filterShape.map(function (s, i) {
            return s + (s - 1) * (dilation[i] - 1);
        });
        var padExtraShape = dilatedFilterShape.map(function (s) { return s - 1; });
        var padExtraStart = padExtraShape.map(function (s) { return Math.floor(s / 2); });
        var padExtraEnd = padExtraShape.map(function (s, i) { return s - padExtraStart[i]; });
        return padExtraShape.map(function (_, i) {
            return [padExtraStart[i], padExtraEnd[i]];
        });
    }
    var maxPool = op({ maxPool_: maxPool_ });
    var avgPool = op({ avgPool_: avgPool_ });
    var pool = op({ pool_: pool_ });

    function slice1d_(x, begin, size) {
        var $x = convertToTensor(x, 'x', 'slice1d');
        assert($x.rank === 1, "slice1d expects a rank-1 tensor, but got a rank-" + $x.rank + " tensor");
        return slice($x, [begin], [size]);
    }
    function slice2d_(x, begin, size) {
        var $x = convertToTensor(x, 'x', 'slice2d');
        assert($x.rank === 2, "slice2d expects a rank-2 tensor, but got a rank-" + $x.rank + " tensor");
        return slice($x, begin, size);
    }
    function slice3d_(x, begin, size) {
        var $x = convertToTensor(x, 'x', 'slice3d');
        assert($x.rank === 3, "slice3d expects a rank-3 tensor, but got a rank-" + $x.rank + " tensor");
        return slice($x, begin, size);
    }
    function slice4d_(x, begin, size) {
        var $x = convertToTensor(x, 'x', 'slice4d');
        assert($x.rank === 4, "slice4d expects a rank-4 tensor, but got a rank-" + $x.rank + " tensor");
        return slice($x, begin, size);
    }
    function slice_(x, begin, size) {
        var $x = convertToTensor(x, 'x', 'slice');
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
            begin_ = begin.slice();
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
                assert(d === -1, 'Bad value in size');
                return $x.shape[i] - begin_[i];
            }
        });
        assertParamsValid($x, begin_, size_);
        var inputShape = $x.shape;
        var grad = function (dy) {
            var paddings = [];
            for (var i = 0; i < dy.rank; i++) {
                paddings.push([begin_[i], inputShape[i] - begin_[i] - size_[i]]);
            }
            return { $x: function () { return dy.pad(paddings); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.slice($x, begin_, size_); }, { $x: $x }, grad);
    }
    var slice = op({ slice_: slice_ });
    var slice1d = op({ slice1d_: slice1d_ });
    var slice2d = op({ slice2d_: slice2d_ });
    var slice3d = op({ slice3d_: slice3d_ });
    var slice4d = op({ slice4d_: slice4d_ });

    function logSumExp_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'logSumExp');
        var axes = parseAxisParam(axis, $x.shape);
        var xMax = $x.max(axes, true);
        var a = $x.sub(xMax);
        var b = a.exp();
        var c = b.sum(axes);
        var d = c.log();
        var res = xMax.reshape(d.shape).add(d);
        if (keepDims) {
            var newShape = expandShapeToKeepDim(res.shape, axes);
            return res.reshape(newShape);
        }
        return res;
    }
    function sum_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'sum');
        if ($x.dtype === 'bool') {
            $x = $x.toInt();
        }
        var axes = parseAxisParam(axis, $x.shape);
        var customOp = customGrad(function (x) {
            var permutation = getAxesPermutation(axes, x.rank);
            var reductionAxes = axes;
            var permutedX = x;
            if (permutation != null) {
                permutedX = x.transpose(permutation);
                reductionAxes = getInnerMostAxes(reductionAxes.length, x.rank);
            }
            var value = ENV.engine.runKernel(function (backend) { return backend.sum(permutedX, reductionAxes); }, { permutedX: permutedX });
            if (keepDims) {
                var newShape = expandShapeToKeepDim(value.shape, axes);
                value = value.reshape(newShape);
            }
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(ones$1(x.shape, 'float32'));
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($x);
    }
    function prod_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'prod');
        if ($x.dtype === 'bool') {
            $x = $x.toInt();
        }
        var axes = parseAxisParam(axis, $x.shape);
        var permutation = getAxesPermutation(axes, $x.rank);
        var reductionAxes = axes;
        var permutedX = $x;
        if (permutation != null) {
            permutedX = $x.transpose(permutation);
            reductionAxes = getInnerMostAxes(reductionAxes.length, $x.rank);
        }
        var value = ENV.engine.runKernel(function (backend) { return backend.prod(permutedX, reductionAxes); }, { permutedX: permutedX });
        if (keepDims) {
            var newShape = expandShapeToKeepDim(value.shape, axes);
            value = value.reshape(newShape);
        }
        return value;
    }
    function mean_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'mean');
        var axes = parseAxisParam(axis, $x.shape);
        var shapes = computeOutAndReduceShapes($x.shape, axes);
        var reduceShape = shapes[1];
        var reduceSize = sizeFromShape(reduceShape);
        var customOp = customGrad(function (x) {
            var reduceSizeScalar = scalar(reduceSize);
            var xReduce = reduceSizeScalar.dtype === x.dtype ? x : x.cast(reduceSizeScalar.dtype);
            var res = xReduce.div(reduceSizeScalar);
            var value = res.sum(axis, keepDims);
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(ones$1(x.shape, 'float32')).div(reduceSizeScalar);
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp($x);
    }
    function gradForMinAndMax(dy, saved, xOrig, origAxes, permutedAxes) {
        var y = saved[0];
        if (y.rank < xOrig.rank) {
            y = y.reshape(expandShapeToKeepDim(y.shape, origAxes));
        }
        if (dy.rank < xOrig.rank) {
            dy = dy.reshape(expandShapeToKeepDim(dy.shape, origAxes));
        }
        return {
            $x: function () {
                var dx = dy.mul(xOrig.equal(y).cast(dy.dtype));
                return permutedAxes == null ? dx : dx.transpose(permutedAxes);
            }
        };
    }
    function min_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'min');
        var xOrig = $x;
        var origAxes = parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = getInnerMostAxes(axes.length, $x.rank);
        }
        var grad$$1 = function (dy, saved) {
            return gradForMinAndMax(dy, saved, xOrig, origAxes, permutedAxes);
        };
        var res = ENV.engine.runKernel(function (backend, save) { return save(backend.min($x, axes)); }, { $x: $x }, grad$$1);
        if (keepDims) {
            var newShape = expandShapeToKeepDim(res.shape, origAxes);
            res = res.reshape(newShape);
        }
        return res;
    }
    function max_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'max');
        var xOrig = $x;
        var origAxes = parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = getInnerMostAxes(axes.length, $x.rank);
        }
        var grad$$1 = function (dy, saved) {
            return gradForMinAndMax(dy, saved, xOrig, origAxes, permutedAxes);
        };
        var res = ENV.engine.runKernel(function (backend, save) { return save(backend.max($x, axes)); }, { $x: $x }, grad$$1);
        if (keepDims) {
            var newShape = expandShapeToKeepDim(res.shape, origAxes);
            res = res.reshape(newShape);
        }
        return res;
    }
    function argMin_(x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = convertToTensor(x, 'x', 'argMin');
        if (axis == null) {
            axis = 0;
        }
        var axes = parseAxisParam(axis, $x.shape);
        var permutedAxes = getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = getInnerMostAxes(axes.length, $x.rank);
        }
        var grad$$1 = function (dy) {
            return { $x: function () { return zerosLike($x); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.argMin($x, axes[0]); }, { $x: $x }, grad$$1);
    }
    function argMax_(x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = convertToTensor(x, 'x', 'argMax');
        if (axis == null) {
            axis = 0;
        }
        var axes = parseAxisParam(axis, $x.shape);
        var permutedAxes = getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = getInnerMostAxes(axes.length, $x.rank);
        }
        var grad$$1 = function (dy) {
            return { $x: function () { return zerosLike($x); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.argMax($x, axes[0]); }, { $x: $x }, grad$$1);
    }
    function all_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'all', 'bool');
        assert($x.dtype === 'bool', "Error Tensor must be of type bool. Got: " + $x.dtype);
        var origAxes = parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = getInnerMostAxes(axes.length, $x.rank);
        }
        var res = ENV.engine.runKernel(function (backend) { return backend.all($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    }
    function any_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var $x = convertToTensor(x, 'x', 'any', 'bool');
        assert($x.dtype === 'bool', "Error Tensor must be of type bool. Got: " + $x.dtype);
        var origAxes = parseAxisParam(axis, $x.shape);
        var axes = origAxes;
        var permutedAxes = getAxesPermutation(axes, $x.rank);
        if (permutedAxes != null) {
            $x = $x.transpose(permutedAxes);
            axes = getInnerMostAxes(axes.length, $x.rank);
        }
        var res = ENV.engine.runKernel(function (backend) { return backend.any($x, axes); }, { $x: $x });
        if (keepDims) {
            var newShape = expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    }
    function moments_(x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        x = convertToTensor(x, 'x', 'moments');
        var axes = parseAxisParam(axis, x.shape);
        var mean = x.mean(axes, keepDims);
        var keepDimsShape = mean.shape;
        if (!keepDims) {
            keepDimsShape = expandShapeToKeepDim(mean.shape, axes);
        }
        var devSquared = x.toFloat().sub(mean.reshape(keepDimsShape)).square();
        var variance = devSquared.mean(axes, keepDims);
        return { mean: mean, variance: variance };
    }
    var all = op({ all_: all_ });
    var any = op({ any_: any_ });
    var argMax = op({ argMax_: argMax_ });
    var argMin = op({ argMin_: argMin_ });
    var logSumExp = op({ logSumExp_: logSumExp_ });
    var max = op({ max_: max_ });
    var mean = op({ mean_: mean_ });
    var min = op({ min_: min_ });
    var moments = op({ moments_: moments_ });
    var sum$1 = op({ sum_: sum_ });
    var prod = op({ prod_: prod_ });

    function notEqual_(a, b) {
        var $a = convertToTensor(a, 'a', 'notEqual');
        var $b = convertToTensor(b, 'b', 'notEqual');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.notEqual($a, $b); }, { $a: $a, $b: $b });
    }
    function notEqualStrict_(a, b) {
        var $a = convertToTensor(a, 'a', 'notEqualStrict');
        var $b = convertToTensor(b, 'b', 'notEqualStrict');
        assertShapesMatch($a.shape, $b.shape, 'Error in notEqualStrict: ');
        return $a.notEqual($b);
    }
    function less_(a, b) {
        var $a = convertToTensor(a, 'a', 'less');
        var $b = convertToTensor(b, 'b', 'less');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.less($a, $b); }, { $a: $a, $b: $b });
    }
    function lessStrict_(a, b) {
        var $a = convertToTensor(a, 'a', 'lessStrict');
        var $b = convertToTensor(b, 'b', 'lessStrict');
        assertShapesMatch($a.shape, $b.shape, 'Error in lessStrict: ');
        return $a.less($b);
    }
    function equal_(a, b) {
        var $a = convertToTensor(a, 'a', 'equal');
        var $b = convertToTensor(b, 'b', 'equal');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.equal($a, $b); }, { $a: $a, $b: $b });
    }
    function equalStrict_(a, b) {
        var $a = convertToTensor(a, 'a', 'equalStrict');
        var $b = convertToTensor(b, 'b', 'equalStrict');
        assertShapesMatch($a.shape, $b.shape, 'Error in equalStrict: ');
        return $a.equal($b);
    }
    function lessEqual_(a, b) {
        var $a = convertToTensor(a, 'a', 'lessEqual');
        var $b = convertToTensor(b, 'b', 'lessEqual');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.lessEqual($a, $b); }, { $a: $a, $b: $b });
    }
    function lessEqualStrict_(a, b) {
        var $a = convertToTensor(a, 'a', 'lessEqualStrict');
        var $b = convertToTensor(b, 'b', 'lessEqualStrict');
        assertShapesMatch($a.shape, $b.shape, 'Error in lessEqualStrict: ');
        return $a.lessEqual($b);
    }
    function greater_(a, b) {
        var $a = convertToTensor(a, 'a', 'greater');
        var $b = convertToTensor(b, 'b', 'greater');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.greater($a, $b); }, { $a: $a, $b: $b });
    }
    function greaterStrict_(a, b) {
        var $a = convertToTensor(a, 'a', 'greaterStrict');
        var $b = convertToTensor(b, 'b', 'greaterStrict');
        assertShapesMatch($a.shape, $b.shape, 'Error in greaterStrict: ');
        return $a.greater($b);
    }
    function greaterEqual_(a, b) {
        var $a = convertToTensor(a, 'a', 'greaterEqual');
        var $b = convertToTensor(b, 'b', 'greaterEqual');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        var grad = function (dy) {
            return { $a: function () { return zerosLike($a); }, $b: function () { return zerosLike($b); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.greaterEqual($a, $b); }, { $a: $a, $b: $b }, grad);
    }
    function greaterEqualStrict_(a, b) {
        var $a = convertToTensor(a, 'a', 'greaterEqualStrict');
        var $b = convertToTensor(b, 'b', 'greaterEqualStrict');
        assertShapesMatch($a.shape, $b.shape, 'Error in greaterEqualStrict: ');
        return $a.greaterEqual($b);
    }
    var equal = op({ equal_: equal_ });
    var equalStrict = op({ equalStrict_: equalStrict_ });
    var greater = op({ greater_: greater_ });
    var greaterEqual = op({ greaterEqual_: greaterEqual_ });
    var greaterEqualStrict = op({ greaterEqualStrict_: greaterEqualStrict_ });
    var greaterStrict = op({ greaterStrict_: greaterStrict_ });
    var less = op({ less_: less_ });
    var lessEqual = op({ lessEqual_: lessEqual_ });
    var lessEqualStrict = op({ lessEqualStrict_: lessEqualStrict_ });
    var lessStrict = op({ lessStrict_: lessStrict_ });
    var notEqual = op({ notEqual_: notEqual_ });
    var notEqualStrict = op({ notEqualStrict_: notEqualStrict_ });

    function add_(a, b) {
        var $a = convertToTensor(a, 'a', 'add');
        var $b = convertToTensor(b, 'b', 'add');
        assertTypesMatch($a, $b);
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.add($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function addN_(tensors) {
        assert(Array.isArray(tensors), function () { return 'The argument passed to tf.addN() must be a list of tensors'; });
        assert(tensors.length >= 1, function () { return "Must pass at least one tensor to tf.addN(), but got " +
            ("" + tensors.length); });
        var $tensors = tensors.map(function (t, i) { return convertToTensor(t, "tensors" + i, 'addN'); });
        var firstTensor = $tensors[0];
        $tensors.forEach(function (t) {
            if (t.dtype !== firstTensor.dtype) {
                throw new Error('All tensors passed to tf.addN() must have the same dtype');
            }
        });
        $tensors.forEach(function (t) {
            if (!arraysEqual(t.shape, firstTensor.shape)) {
                throw new Error('All tensors passed to tf.addN() must have the same shape');
            }
        });
        var der = function (dy) {
            var ders = {};
            $tensors.forEach(function (t, i) {
                ders[i] = function () { return dy.clone(); };
            });
            return ders;
        };
        var inputs = $tensors;
        return ENV.engine.runKernel(function (backend) { return backend.addN($tensors); }, inputs, der);
    }
    function addStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
        return a.add(b);
    }
    function sub_(a, b) {
        var $a = convertToTensor(a, 'a', 'sub');
        var $b = convertToTensor(b, 'b', 'sub');
        assertTypesMatch($a, $b);
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.neg().reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.subtract($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function subStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
        return a.sub(b);
    }
    function pow_(base, exp$$1) {
        var $base = convertToTensor(base, 'base', 'pow');
        var $exp = convertToTensor(exp$$1, 'exp', 'pow');
        var outShape = assertAndGetBroadcastShape($base.shape, $exp.shape);
        base = $base.cast(upcastType($base.dtype, $exp.dtype));
        exp$$1 = $exp.cast(upcastType($base.dtype, $exp.dtype));
        var grad = function (dy, saved) {
            var y = saved[0];
            var derBase = function () {
                var res = dy.mul($exp.toFloat().mul(y.div($base)));
                var reduceAxes = getReductionAxes($base.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($base.shape);
            };
            var derExp = function () {
                var res = dy.mul(y.mul($base.log()).toFloat());
                var reduceAxes = getReductionAxes($exp.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($exp.shape);
            };
            return { $base: derBase, $exp: derExp };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.pow($base, $exp)); }, { $base: $base, $exp: $exp }, grad);
    }
    function powStrict_(base, exp$$1) {
        assertShapesMatch(base.shape, exp$$1.shape, 'Error in powStrict: ');
        return base.pow(exp$$1);
    }
    function mul_(a, b) {
        var $a = convertToTensor(a, 'a', 'mul');
        var $b = convertToTensor(b, 'b', 'mul');
        assertTypesMatch($a, $b);
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.mul($b.toFloat());
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul($a.toFloat());
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($b.shape);
                }
                return res;
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.multiply($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function mulStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
        return a.mul(b);
    }
    function div_(a, b) {
        var $a = convertToTensor(a, 'a', 'div');
        var $b = convertToTensor(b, 'b', 'div');
        assertTypesMatch($a, $b);
        var forwardFunc;
        if ($a.dtype === 'int32' && $b.dtype === 'int32') {
            return floorDiv($a, $b);
        }
        else {
            forwardFunc = function (backend) { return backend.realDivide($a, $b); };
        }
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.div($b.toFloat());
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul($a.toFloat());
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape($b.shape);
                }
                var tmp = $b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(forwardFunc, { $a: $a, $b: $b }, der);
    }
    function floorDiv_(a, b) {
        var $a = convertToTensor(a, 'a', 'floorDiv');
        var $b = convertToTensor(b, 'b', 'floorDiv');
        assertTypesMatch($a, $b);
        var forwardFunc = function (backend) { return backend.floorDiv($a, $b); };
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.div($b.toFloat());
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul($a.toFloat());
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape($b.shape);
                }
                var tmp = $b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(forwardFunc, { $a: $a, $b: $b }, der);
    }
    function divStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
        return a.div(b);
    }
    function mod_(a, b) {
        var $a = convertToTensor(a, 'a', 'mod');
        var $b = convertToTensor(b, 'b', 'mod');
        assertTypesMatch($a, $b);
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return dy.sum(reduceAxes).reshape($a.shape);
                }
                return dy;
            };
            var derB = function () {
                var res = dy.mul($a.div($b).floor().neg());
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape($b.shape);
                }
                return res;
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.mod($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function modStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in modStrict: ');
        return a.mod(b);
    }
    function minimum_(a, b) {
        var $a = convertToTensor(a, 'a', 'minimum');
        var $b = convertToTensor(b, 'b', 'minimum');
        assertTypesMatch($a, $b);
        if ($a.dtype === 'bool') {
            $a = $a.toInt();
        }
        if ($b.dtype === 'bool') {
            $b = $b.toInt();
        }
        assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul($a.lessEqual($b).toFloat()); };
            var derB = function () { return dy.mul($a.greater($b).toFloat()); };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.minimum($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function minimumStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.minimum(b);
    }
    function maximum_(a, b) {
        var $a = convertToTensor(a, 'a', 'maximum');
        var $b = convertToTensor(b, 'b', 'maximum');
        assertTypesMatch($a, $b);
        if ($a.dtype === 'bool') {
            $a = $a.toInt();
        }
        if ($b.dtype === 'bool') {
            $b = $b.toInt();
        }
        assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul($a.greaterEqual($b).toFloat()); };
            var derB = function () { return dy.mul($a.less($b).toFloat()); };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.maximum($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function maximumStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in maximumStrict: ');
        return a.maximum(b);
    }
    function squaredDifference_(a, b) {
        var $a = convertToTensor(a, 'a', 'squaredDifference');
        var $b = convertToTensor(b, 'b', 'squaredDifference');
        assertTypesMatch($a, $b);
        assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var two = scalar(2);
            var derA = function () { return dy.mul($a.sub($b).mul(two)); };
            var derB = function () { return dy.mul($b.sub($a).mul(two)); };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.squaredDifference($a, $b); }, { $a: $a, $b: $b }, der);
    }
    function squaredDifferenceStrict_(a, b) {
        assertShapesMatch(a.shape, b.shape, 'Error in squaredDifferenceStrict: ');
        return a.squaredDifference(b);
    }
    function atan2_(a, b) {
        var $a = convertToTensor(a, 'a', 'atan2');
        var $b = convertToTensor(b, 'b', 'atan2');
        assertTypesMatch($a, $b);
        var outShape = assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var derA = function () {
                var d = add($a.square(), $b.square());
                var res = dy.mul($b.div(d));
                var reduceAxes = getReductionAxes($a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($a.shape);
            };
            var derB = function () {
                var d = add($a.square(), $b.square());
                var res = neg(dy.mul($a.div(d)));
                var reduceAxes = getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.atan2($a, $b); }, { $a: $a, $b: $b }, der);
    }
    var add = op({ add_: add_ });
    var addN = op({ addN_: addN_ });
    var addStrict = op({ addStrict_: addStrict_ });
    var atan2 = op({ atan2_: atan2_ });
    var div = op({ div_: div_ });
    var divStrict = op({ divStrict_: divStrict_ });
    var floorDiv = op({ floorDiv_: floorDiv_ });
    var maximum = op({ maximum_: maximum_ });
    var maximumStrict = op({ maximumStrict_: maximumStrict_ });
    var minimum = op({ minimum_: minimum_ });
    var minimumStrict = op({ minimumStrict_: minimumStrict_ });
    var mod = op({ mod_: mod_ });
    var modStrict = op({ modStrict_: modStrict_ });
    var mul = op({ mul_: mul_ });
    var mulStrict = op({ mulStrict_: mulStrict_ });
    var pow = op({ pow_: pow_ });
    var powStrict = op({ powStrict_: powStrict_ });
    var squaredDifference = op({ squaredDifference_: squaredDifference_ });
    var squaredDifferenceStrict = op({ squaredDifferenceStrict_: squaredDifferenceStrict_ });
    var sub = op({ sub_: sub_ });
    var subStrict = op({ subStrict_: subStrict_ });

    function logicalNot_(x) {
        var $x = convertToTensor(x, 'x', 'logicalNot', 'bool');
        assert($x.dtype === 'bool', 'Error Array must be of type bool.');
        return ENV.engine.runKernel(function (backend) { return backend.logicalNot($x); }, { $x: $x });
    }
    function logicalAnd_(a, b) {
        var $a = convertToTensor(a, 'a', 'logicalAnd', 'bool');
        var $b = convertToTensor(b, 'b', 'logicalAnd', 'bool');
        assert($a.dtype === 'bool' && $b.dtype === 'bool', 'Error Array must be of type bool.');
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.logicalAnd($a, $b); }, { $a: $a, $b: $b });
    }
    function logicalOr_(a, b) {
        var $a = convertToTensor(a, 'a', 'logicalOr', 'bool');
        var $b = convertToTensor(b, 'b', 'logicalOr', 'bool');
        assert($a.dtype === 'bool' && $b.dtype === 'bool', 'Error Array must be of type bool.');
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.logicalOr($a, $b); }, { $a: $a, $b: $b });
    }
    function logicalXor_(a, b) {
        var $a = convertToTensor(a, 'a', 'logicalXor', 'bool');
        var $b = convertToTensor(b, 'b', 'logicalXor', 'bool');
        assert($a.dtype === 'bool' && $b.dtype === 'bool', 'Error Array must be of type bool.');
        assertAndGetBroadcastShape($a.shape, $b.shape);
        return logicalOr(a, b).logicalAnd(logicalAnd(a, b).logicalNot());
    }
    function where_(condition, a, b) {
        var $a = convertToTensor(a, 'a', 'where');
        var $b = convertToTensor(b, 'b', 'where');
        var $condition = convertToTensor(condition, 'condition', 'where', 'bool');
        assert($condition.dtype === 'bool', 'Error Condition must be of type bool.');
        assertShapesMatch($a.shape, $b.shape, 'Error in where: ');
        if ($condition.rank === 1) {
            assert($condition.shape[0] === $a.shape[0], 'The first dimension of `a` must match the size of `condition`.');
        }
        else {
            assertShapesMatch($condition.shape, $b.shape, 'Error in where: ');
        }
        var grad = function (dy) { return ({
            $condition: function () { return zerosLike($condition); },
            $a: function () { return dy.mul($condition.cast($a.dtype)); },
            $b: function () { return dy.mul($condition.logicalNot().cast($b.dtype)); }
        }); };
        return ENV.engine.runKernel(function (backend) { return backend.select($condition, $a, $b); }, { $condition: $condition, $a: $a, $b: $b }, grad);
    }
    function whereAsync_(condition) {
        return __awaiter(this, void 0, void 0, function () {
            var $condition, vals, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $condition = convertToTensor(condition, 'condition', 'where', 'bool');
                        assert($condition.dtype === 'bool', 'Condition must be of type bool.');
                        return [4, $condition.data()];
                    case 1:
                        vals = _a.sent();
                        res = whereImpl($condition.shape, vals);
                        if (condition !== $condition) {
                            $condition.dispose();
                        }
                        return [2, res];
                }
            });
        });
    }
    var logicalAnd = op({ logicalAnd_: logicalAnd_ });
    var logicalNot = op({ logicalNot_: logicalNot_ });
    var logicalOr = op({ logicalOr_: logicalOr_ });
    var logicalXor = op({ logicalXor_: logicalXor_ });
    var where = op({ where_: where_ });
    var whereAsync = whereAsync_;

    function relu_(x) {
        var $x = convertToTensor(x, 'x', 'relu');
        if ($x.dtype === 'bool') {
            return $x.toInt();
        }
        var grad = function (dy) {
            var stepRes = $x.step();
            return { $x: function () { return dy.mulStrict(stepRes.toFloat()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.relu($x); }, { $x: $x }, grad);
    }
    function elu_(x) {
        var $x = convertToTensor(x, 'x', 'elu');
        var grad = function (dy, saved) {
            var y = saved[0];
            return {
                $x: function () {
                    return ENV.engine.runKernel(function (backend) { return backend.eluDer(dy, y); }, { dy: dy, y: y });
                }
            };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.elu($x)); }, { $x: $x }, grad);
    }
    function selu_(x) {
        var $x = convertToTensor(x, 'x', 'selu');
        var grad = function (dy) {
            return {
                $x: function () {
                    var mask = $x.greater(scalar(0));
                    var scaleAlpha = scalar(SELU_SCALEALPHA);
                    var scale = scalar(SELU_SCALE);
                    var greaterThanZeroDer = dy.mul(scale);
                    var lessEqualZeroDer = dy.mul(scaleAlpha).mul($x.toFloat().exp());
                    return where(mask, greaterThanZeroDer, lessEqualZeroDer);
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.selu($x); }, { $x: $x }, grad);
    }
    function leakyRelu_(x, alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        var $x = convertToTensor(x, 'x', 'leakyRelu');
        return maximum(scalar(alpha).mul($x), $x);
    }
    function prelu_(x, alpha) {
        var $x = convertToTensor(x, 'x', 'prelu');
        var $alpha = convertToTensor(alpha, 'alpha', 'prelu');
        var zero = scalar(0);
        return maximum(zero, $x).add($alpha.mul(minimum(zero, $x)));
    }
    var elu = op({ elu_: elu_ });
    var leakyRelu = op({ leakyRelu_: leakyRelu_ });
    var prelu = op({ prelu_: prelu_ });
    var relu = op({ relu_: relu_ });
    var selu = op({ selu_: selu_ });

    function transpose_(x, perm) {
        var $x = convertToTensor(x, 'x', 'transpose');
        if (perm == null) {
            perm = $x.shape.map(function (s, i) { return i; }).reverse();
        }
        assert($x.rank === perm.length, "Error in transpose: rank of input " + $x.rank + " " +
            ("must match length of perm " + perm + "."));
        perm.forEach(function (axis) {
            assert(axis >= 0 && axis < $x.rank, "All entries in 'perm' must be between 0 and " + ($x.rank - 1) +
                (" but got " + perm));
        });
        if ($x.rank <= 1) {
            return $x.clone();
        }
        var der = function (dy) {
            var undoPerm = getUndoAxesPermutation(perm);
            return { $x: function () { return dy.transpose(undoPerm); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.transpose($x, perm); }, { $x: $x }, der);
    }
    var transpose = op({ transpose_: transpose_ });

    function localResponseNormalization_(x, depthRadius, bias, alpha, beta) {
        if (depthRadius === void 0) { depthRadius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        var $x = convertToTensor(x, 'x', 'localResponseNormalization');
        assert($x.rank === 4 || $x.rank === 3, "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + $x.rank + ".");
        assert(isInt(depthRadius), "Error in localResponseNormalization: depthRadius must be an integer\n                     but got depthRadius " + depthRadius + ".");
        var x4D = $x;
        var reshapedTo4D = false;
        if ($x.rank === 3) {
            reshapedTo4D = true;
            x4D = $x.as4D(1, $x.shape[0], $x.shape[1], $x.shape[2]);
        }
        var backward = function (dy, saved) {
            var outputImage = saved[0];
            return {
                x4D: function () { return ENV.engine.runKernel(function (backend) { return backend.LRNGrad(dy, x4D, outputImage, depthRadius, bias, alpha, beta); }, {}); }
            };
        };
        var res = ENV.engine.runKernel(function (backend, save) { return save(backend.localResponseNormalization4D(x4D, depthRadius, bias, alpha, beta)); }, { x4D: x4D }, backward);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        else {
            return res;
        }
    }
    var localResponseNormalization = op({ localResponseNormalization_: localResponseNormalization_ });

    function norm_(x, ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        x = convertToTensor(x, 'x', 'norm');
        var norm = normImpl(x, ord, axis);
        var keepDimsShape = norm.shape;
        if (keepDims) {
            var axes = parseAxisParam(axis, x.shape);
            keepDimsShape = expandShapeToKeepDim(norm.shape, axes);
        }
        return norm.reshape(keepDimsShape);
    }
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
                return x.abs().pow(scalar(2, 'int32')).sum(axis).sqrt();
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
    var norm = op({ norm_: norm_ });

    function unsortedSegmentSum_(x, segmentIds, numSegments) {
        var $x = convertToTensor(x, 'x', 'unsortedSegmentSum');
        var $segmentIds = convertToTensor(segmentIds, 'segmentIds', 'unsortedSegmentSum', 'int32');
        assert($segmentIds.dtype === 'int32', 'segmentIds must be of dtype `int32`');
        assert(isInt(numSegments), 'numSegments must be of dtype int');
        var gradFunc = function (dy) {
            var derX = function () {
                return gatherDropNegatives(dy, $segmentIds);
            };
            return { $x: derX };
        };
        return ENV.engine.runKernel(function (backend) {
            return backend.unsortedSegmentSum($x, $segmentIds, numSegments);
        }, { $x: $x }, gradFunc);
    }
    function gather_(x, indices, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = convertToTensor(x, 'x', 'gather');
        var $indices = convertToTensor(indices, 'indices', 'gather', 'int32');
        assert($indices.dtype === 'int32', 'Indices must be of dtype `int32`');
        axis = parseAxisParam(axis, $x.shape)[0];
        var grad = function (dy) {
            var derX = function () {
                if (axis === 0) {
                    return unsortedSegmentSum(dy, $indices, $x.shape[axis]);
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
                var paramsGrad = unsortedSegmentSum(valuesTranspose, reshapedIndices, $x.shape[axis]);
                var invertTransposeDims = getUndoAxesPermutation(transposeDims);
                paramsGrad = paramsGrad.transpose(invertTransposeDims);
                return paramsGrad;
            };
            return { $x: derX };
        };
        return ENV.engine.runKernel(function (backend) { return backend.gather($x, $indices, axis); }, { $x: $x }, grad);
    }
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
        var zeroClippedIndices = maximum(indices, zerosLike(indices));
        var gathered = gather(x, zeroClippedIndices);
        var isPositive = greaterEqual(indices, scalar(0, 'int32'));
        var numIters = gathered.rank - isPositive.rank;
        for (var i = 0; i < numIters; ++i) {
            isPositive = expandDims(isPositive, i + 1);
        }
        isPositive = logicalAnd(isPositive, ones$1(gathered.shape, 'bool'));
        var zeroSlice = zerosLike(gathered);
        return where(isPositive, gathered, zeroSlice);
    }
    var gather = op({ gather_: gather_ });
    var unsortedSegmentSum = op({ unsortedSegmentSum_: unsortedSegmentSum_ });

    function multiRNNCell_(lstmCells, data, c, h) {
        var $data = convertToTensor(data, 'data', 'multiRNNCell');
        var $c = convertToTensorArray(c, 'c', 'multiRNNCell');
        var $h = convertToTensorArray(h, 'h', 'multiRNNCell');
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
    }
    function basicLSTMCell_(forgetBias, lstmKernel, lstmBias, data, c, h) {
        var $forgetBias = convertToTensor(forgetBias, 'forgetBias', 'basicLSTMCell');
        var $lstmKernel = convertToTensor(lstmKernel, 'lstmKernel', 'basicLSTMCell');
        var $lstmBias = convertToTensor(lstmBias, 'lstmBias', 'basicLSTMCell');
        var $data = convertToTensor(data, 'data', 'basicLSTMCell');
        var $c = convertToTensor(c, 'c', 'basicLSTMCell');
        var $h = convertToTensor(h, 'h', 'basicLSTMCell');
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
    }
    var basicLSTMCell = op({ basicLSTMCell_: basicLSTMCell_ });
    var multiRNNCell = op({ multiRNNCell_: multiRNNCell_ });

    function movingAverage_(v, x, decay, step, zeroDebias) {
        if (zeroDebias === void 0) { zeroDebias = true; }
        var $v = convertToTensor(v, 'v', 'movingAverage');
        var $x = convertToTensor(x, 'x', 'movingAverage');
        var $decay = convertToTensor(decay, 'decay', 'movingAverage');
        assertTypesMatch($v, $x);
        assert(arraysEqual($v.shape, $x.shape), 'Shape mismatch in v and x');
        var one = scalar(1);
        var oneMinusDecay = one.sub($decay);
        var update = $x.sub($v).mul(oneMinusDecay);
        if (zeroDebias) {
            assert(step != null, 'When using zeroDebias: true, step is required.');
            var $step = convertToTensor(step, 'step', 'movingAverage');
            update = update.div(one.sub(pow($decay, $step)));
        }
        return $v.add(update);
    }
    var movingAverage = op({ movingAverage_: movingAverage_ });

    function stridedSlice_(x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
        if (beginMask === void 0) { beginMask = 0; }
        if (endMask === void 0) { endMask = 0; }
        if (ellipsisMask === void 0) { ellipsisMask = 0; }
        if (newAxisMask === void 0) { newAxisMask = 0; }
        if (shrinkAxisMask === void 0) { shrinkAxisMask = 0; }
        if (ellipsisMask !== 0) {
            throw new Error('ellipsis mask is not yet supported');
        }
        if (newAxisMask !== 0) {
            throw new Error('new axis mask is not yet supported');
        }
        var $x = convertToTensor(x, 'x', 'stridedSlice');
        return ENV.engine.runKernel(function (backend) { return backend.stridedSlice($x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask); }, { $x: $x });
    }
    var stridedSlice = op({ stridedSlice_: stridedSlice_ });

    function topk_(x, k, sorted) {
        if (k === void 0) { k = 1; }
        if (sorted === void 0) { sorted = true; }
        var $x = convertToTensor(x, 'x', 'topk');
        if ($x.rank === 0) {
            throw new Error('topk() expects the input to be of rank 1 or higher');
        }
        var lastDim = $x.shape[$x.shape.length - 1];
        if (k > lastDim) {
            throw new Error("'k' passed to topk() must be <= the last dimension (" + lastDim + ") " +
                ("but got " + k));
        }
        var _a = ENV.engine.runKernel(function (b) { return b.topk($x, k, sorted); }, { $x: $x }), values = _a[0], indices = _a[1];
        return { values: values, indices: indices };
    }
    var topk = op({ topk_: topk_ });

    function scatterND_(indices, updates, shape) {
        var $indices = convertToTensor(indices, 'indices', 'scatterND', 'int32');
        var $updates = convertToTensor(updates, 'updates', 'scatterND');
        validateInput($updates, $indices, shape);
        return ENV.engine.runKernel(function (backend) { return backend.scatterND($indices, $updates, shape); }, { $indices: $indices, $updates: $updates });
    }
    var scatterND = op({ scatterND_: scatterND_ });

    function fft_(input) {
        assert(input.dtype === 'complex64', "The dtype for tf.spectral.fft() must be complex64 " +
            ("but got " + input.dtype + "."));
        var innerDimensionSize = input.shape[input.shape.length - 1];
        var batch = input.size / innerDimensionSize;
        var input2D = input.as2D(batch, innerDimensionSize);
        var ret = ENV.engine.runKernel(function (backend) { return backend.fft(input2D); }, { input: input });
        return ret.reshape(input.shape);
    }
    function ifft_(input) {
        assert(input.dtype === 'complex64', "The dtype for tf.spectral.ifft() must be complex64 " +
            ("but got " + input.dtype + "."));
        var innerDimensionSize = input.shape[input.shape.length - 1];
        var batch = input.size / innerDimensionSize;
        var input2D = input.as2D(batch, innerDimensionSize);
        var ret = ENV.engine.runKernel(function (backend) { return backend.ifft(input2D); }, { input: input });
        return ret.reshape(input.shape);
    }
    function rfft_(input) {
        assert(input.dtype === 'float32', "The dtype for rfft() must be real value but\n    got " + input.dtype);
        var innerDimensionSize = input.shape[input.shape.length - 1];
        var batch = input.size / innerDimensionSize;
        var zeros = input.zerosLike();
        var complexInput = complex(input, zeros).as2D(batch, innerDimensionSize);
        var ret = ENV.engine.runKernel(function (backend) { return backend.fft(complexInput); }, { complexInput: complexInput });
        var half = Math.floor(innerDimensionSize / 2) + 1;
        var realValues = real(ret);
        var imagValues = imag(ret);
        var realComplexConjugate = realValues.split([half, innerDimensionSize - half], realValues.shape.length - 1);
        var imagComplexConjugate = imagValues.split([half, innerDimensionSize - half], imagValues.shape.length - 1);
        var outputShape = input.shape.slice();
        outputShape[input.shape.length - 1] = half;
        return complex(realComplexConjugate[0], imagComplexConjugate[0])
            .reshape(outputShape);
    }
    var fft = op({ fft_: fft_ });
    var ifft = op({ ifft_: ifft_ });
    var rfft = op({ rfft_: rfft_ });

    var spectral_ops = /*#__PURE__*/Object.freeze({
        fft: fft,
        ifft: ifft,
        rfft: rfft
    });

    function validateInput$1(sparseIndices, sparseValues, outputShape, defaultValues) {
        if (sparseIndices.dtype !== 'int32') {
            throw new Error('tf.sparseToDense() expects the indices to be int32 type,' +
                (" but the dtype was " + sparseIndices.dtype + "."));
        }
        if (sparseIndices.rank > 2) {
            throw new Error('sparseIndices should be a scalar, vector, or matrix,' +
                (" but got shape " + sparseIndices.shape + "."));
        }
        var numElems = sparseIndices.rank > 0 ? sparseIndices.shape[0] : 1;
        var numDims = sparseIndices.rank > 1 ? sparseIndices.shape[1] : 1;
        if (outputShape.length !== numDims) {
            throw new Error('outputShape has incorrect number of elements:,' +
                (" " + outputShape.length + ", should be: " + numDims + "."));
        }
        var numValues = sparseValues.size;
        if (!(sparseValues.rank === 0 ||
            sparseValues.rank === 1 && numValues === numElems)) {
            throw new Error('sparseValues has incorrect shape ' +
                (sparseValues.shape + ", should be [] or [" + numElems + "]"));
        }
        if (sparseValues.dtype !== defaultValues.dtype) {
            throw new Error('sparseValues.dtype must match defaultValues.dtype');
        }
    }

    function sparseToDense_(sparseIndices, sparseValues, outputShape, defaultValue) {
        var $sparseIndices = convertToTensor(sparseIndices, 'sparseIndices', 'sparseToDense', 'int32');
        var $sparseValues = convertToTensor(sparseValues, 'sparseValues', 'sparseToDense');
        var $defaultValue = convertToTensor(defaultValue, 'defaultValue', 'sparseToDense', $sparseValues.dtype);
        validateInput$1($sparseIndices, $sparseValues, outputShape, $defaultValue);
        return ENV.engine.runKernel(function (backend) { return backend.sparseToDense($sparseIndices, $sparseValues, outputShape, $defaultValue); }, { $sparseIndices: $sparseIndices, $sparseValues: $sparseValues, $defaultValue: $defaultValue });
    }
    var sparseToDense = op({ sparseToDense_: sparseToDense_ });

    function gatherND_(x, indices) {
        var $indices = convertToTensor(indices, 'indices', 'gatherND', 'int32');
        var $x = convertToTensor(x, 'x', 'gatherND');
        return ENV.engine.runKernel(function (backend) { return backend.gatherND($x, $indices); }, { $x: $x, $indices: $indices });
    }
    var gatherND = op({ gatherND_: gatherND_ });

    (function (Reduction) {
        Reduction[Reduction["NONE"] = 0] = "NONE";
        Reduction[Reduction["MEAN"] = 1] = "MEAN";
        Reduction[Reduction["SUM"] = 2] = "SUM";
        Reduction[Reduction["SUM_BY_NONZERO_WEIGHTS"] = 3] = "SUM_BY_NONZERO_WEIGHTS";
    })(exports.Reduction || (exports.Reduction = {}));
    function computeWeightedLoss_(losses, weights, reduction) {
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $losses = convertToTensor(losses, 'losses', 'computeWeightedLoss');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'computeWeightedLoss');
        }
        var weightedLoss = ($weights == null) ? $losses : $losses.mul($weights);
        if (reduction === exports.Reduction.NONE) {
            return weightedLoss;
        }
        if (reduction === exports.Reduction.SUM) {
            return weightedLoss.sum();
        }
        if (reduction === exports.Reduction.MEAN) {
            if ($weights == null) {
                return weightedLoss.mean();
            }
            else {
                var broadcastFactor = sizeFromShape($losses.shape) / sizeFromShape($weights.shape);
                var result = weightedLoss.sum().div($weights.sum());
                return broadcastFactor > 1 ? result.div(scalar(broadcastFactor)) :
                    result;
            }
        }
        if (reduction === exports.Reduction.SUM_BY_NONZERO_WEIGHTS) {
            if ($weights == null) {
                return weightedLoss.sum().div(scalar($losses.size));
            }
            else {
                var broadcastedWeights = $weights.mul(ones$1($losses.shape));
                var numNonZeros = broadcastedWeights.notEqual(scalar(0)).sum().toFloat();
                return weightedLoss.sum().div(numNonZeros);
            }
        }
        throw Error("Unknown reduction: " + reduction);
    }
    function absoluteDifference_(labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = convertToTensor(labels, 'labels', 'absoluteDifference');
        var $predictions = convertToTensor(predictions, 'predictions', 'absoluteDifference');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'absoluteDifference');
        }
        assertShapesMatch($labels.shape, $predictions.shape, 'Error in absoluteDifference: ');
        var losses = $labels.sub($predictions).abs();
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function meanSquaredError_(labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = convertToTensor(labels, 'labels', 'meanSquaredError');
        var $predictions = convertToTensor(predictions, 'predictions', 'meanSquaredError');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'meanSquaredError');
        }
        assertShapesMatch($labels.shape, $predictions.shape, 'Error in meanSquaredError: ');
        var losses = $labels.squaredDifference($predictions);
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function cosineDistance_(labels, predictions, axis, weights, reduction) {
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = convertToTensor(labels, 'labels', 'cosineDistance');
        var $predictions = convertToTensor(predictions, 'predictions', 'cosineDistance');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'cosineDistance');
        }
        assertShapesMatch($labels.shape, $predictions.shape, 'Error in cosineDistance: ');
        var one = scalar(1);
        var losses = one.sub($labels.mul($predictions).sum(axis, true));
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function hingeLoss_(labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = convertToTensor(labels, 'labels', 'hingeLoss');
        var $predictions = convertToTensor(predictions, 'predictions', 'hingeLoss');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'hingeLoss');
        }
        assertShapesMatch($labels.shape, $predictions.shape, 'Error in hingeLoss: ');
        var one = scalar(1);
        $labels = scalar(2).mul($labels).sub(one);
        var losses = one.sub($labels.mul($predictions)).relu();
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function logLoss_(labels, predictions, weights, epsilon, reduction) {
        if (epsilon === void 0) { epsilon = 1e-7; }
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = convertToTensor(labels, 'labels', 'logLoss');
        var $predictions = convertToTensor(predictions, 'predictions', 'logLoss');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'logLoss');
        }
        assertShapesMatch($labels.shape, $predictions.shape, 'Error in logLoss: ');
        var one = scalar(1);
        var epsilonScalar = scalar(epsilon);
        var losses = $labels.mul($predictions.add(epsilonScalar).log())
            .neg()
            .sub(one.sub($labels).mul(one.sub($predictions).add(epsilonScalar).log()));
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function sigmoidCrossEntropyWithLogits_(labels, logits) {
        var $labels = convertToTensor(labels, 'labels', 'sigmoidCrossEntropyWithLogits');
        var $logits = convertToTensor(logits, 'logits', 'sigmoidCrossEntropyWithLogits');
        assertShapesMatch($labels.shape, $logits.shape, 'Error in sigmoidCrossEntropyWithLogits: ');
        var maxOutput = $logits.relu();
        var outputXTarget = $logits.mul($labels);
        var sigmoidOutput = $logits.abs().neg().exp().log1p();
        return maxOutput.sub(outputXTarget).add(sigmoidOutput);
    }
    function sigmoidCrossEntropy_(multiClassLabels, logits, weights, labelSmoothing, reduction) {
        if (labelSmoothing === void 0) { labelSmoothing = 0; }
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $multiClassLabels = convertToTensor(multiClassLabels, 'multiClassLabels', 'sigmoidCrossEntropy');
        var $logits = convertToTensor(logits, 'logits', 'sigmoidCrossEntropy');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'sigmoidCrossEntropy');
        }
        assertShapesMatch($multiClassLabels.shape, $logits.shape, 'Error in sigmoidCrossEntropy: ');
        if (labelSmoothing > 0) {
            var labelSmoothingScalar = scalar(labelSmoothing);
            var one = scalar(1);
            var half = scalar(0.5);
            $multiClassLabels = $multiClassLabels.mul(one.sub(labelSmoothingScalar))
                .add(half.mul(labelSmoothingScalar));
        }
        var losses = sigmoidCrossEntropyWithLogits_($multiClassLabels, $logits);
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function huberLoss_(labels, predictions, weights, delta, reduction) {
        if (delta === void 0) { delta = 1.0; }
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $labels = convertToTensor(labels, 'labels', 'huberLoss');
        var $predictions = convertToTensor(predictions, 'predictions', 'huberLoss');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'huberLoss');
        }
        assertShapesMatch($labels.shape, $predictions.shape, 'Error in huberLoss: ');
        var deltaScalar = scalar(delta);
        var error = $predictions.sub($labels).abs();
        var quadratic = minimum(error, deltaScalar);
        var linear = error.sub(quadratic);
        var losses = scalar(0.5).mul(quadratic.square()).add(deltaScalar.mul(linear));
        return computeWeightedLoss(losses, $weights, reduction);
    }
    function softmaxCrossEntropyWithLogits_(labels, logits, dim) {
        if (dim === void 0) { dim = -1; }
        if (dim === -1) {
            dim = logits.rank - 1;
        }
        if (dim !== logits.rank - 1) {
            throw Error("Softmax cross entropy along a non-last dimension is not yet " +
                ("supported. Labels / logits was rank " + logits.rank + " ") +
                ("and dim was " + dim));
        }
        var customOp = customGrad(function (labels, logits) {
            var keepDims = true;
            var lse = logits.logSumExp([dim], keepDims);
            var logResult = logits.toFloat().sub(lse);
            var costVector = logResult.mul(labels).neg();
            var value = costVector.sum([dim]);
            var gradFunc = function (dy) {
                var dyShape = expandShapeToKeepDim(dy.shape, [dim]);
                return [
                    dy.reshape(dyShape).mul(labels.toFloat().sub(logResult.exp())),
                    dy.reshape(dyShape).mul(logResult.exp().sub(labels.toFloat())),
                ];
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(labels, logits);
    }
    function softmaxCrossEntropy_(onehotLabels, logits, weights, labelSmoothing, reduction) {
        if (labelSmoothing === void 0) { labelSmoothing = 0; }
        if (reduction === void 0) { reduction = exports.Reduction.SUM_BY_NONZERO_WEIGHTS; }
        var $onehotLabels = convertToTensor(onehotLabels, 'onehotLabels', 'softmaxCrossEntropy');
        var $logits = convertToTensor(logits, 'logits', 'softmaxCrossEntropy');
        var $weights = null;
        if (weights != null) {
            $weights = convertToTensor(weights, 'weights', 'softmaxCrossEntropy');
        }
        assertShapesMatch($onehotLabels.shape, $logits.shape, 'Error in softmaxCrossEntropy: ');
        if (labelSmoothing > 0) {
            var labelSmoothingScalar = scalar(labelSmoothing);
            var one = scalar(1);
            var numClasses = scalar($onehotLabels.shape[1]);
            $onehotLabels = $onehotLabels.mul(one.sub(labelSmoothingScalar))
                .add(labelSmoothingScalar.div(numClasses));
        }
        var losses = softmaxCrossEntropyWithLogits_($onehotLabels, $logits);
        return computeWeightedLoss(losses, $weights, reduction);
    }
    var absoluteDifference = op({ absoluteDifference_: absoluteDifference_ });
    var computeWeightedLoss = op({ computeWeightedLoss_: computeWeightedLoss_ });
    var cosineDistance = op({ cosineDistance_: cosineDistance_ });
    var hingeLoss = op({ hingeLoss_: hingeLoss_ });
    var huberLoss = op({ huberLoss_: huberLoss_ });
    var logLoss = op({ logLoss_: logLoss_ });
    var meanSquaredError = op({ meanSquaredError_: meanSquaredError_ });
    var sigmoidCrossEntropy = op({ sigmoidCrossEntropy_: sigmoidCrossEntropy_ });
    var softmaxCrossEntropy = op({ softmaxCrossEntropy_: softmaxCrossEntropy_ });

    var loss_ops = /*#__PURE__*/Object.freeze({
        get Reduction () { return exports.Reduction; },
        absoluteDifference: absoluteDifference,
        computeWeightedLoss: computeWeightedLoss,
        cosineDistance: cosineDistance,
        hingeLoss: hingeLoss,
        huberLoss: huberLoss,
        logLoss: logLoss,
        meanSquaredError: meanSquaredError,
        sigmoidCrossEntropy: sigmoidCrossEntropy,
        softmaxCrossEntropy: softmaxCrossEntropy
    });

    function gramSchmidt_(xs) {
        var inputIsTensor2D;
        if (Array.isArray(xs)) {
            inputIsTensor2D = false;
            assert(xs != null && xs.length > 0, 'Gram-Schmidt process: input must not be null, undefined, or empty');
            var dim = xs[0].shape[0];
            for (var i = 1; i < xs.length; ++i) {
                assert(xs[i].shape[0] === dim, 'Gram-Schmidt: Non-unique lengths found in the input vectors: ' +
                    ("(" + xs[i].shape[0] + " vs. " + dim + ")"));
            }
        }
        else {
            inputIsTensor2D = true;
            xs = split$1(xs, xs.shape[0], 0).map(function (x) { return squeeze(x, [0]); });
        }
        assert(xs.length <= xs[0].shape[0], "Gram-Schmidt: Number of vectors (" + xs.length + ") exceeds " +
            ("number of dimensions (" + xs[0].shape[0] + ")."));
        var ys = [];
        var xs1d = xs;
        var _loop_1 = function (i) {
            ys.push(ENV.engine.tidy(function () {
                var x = xs1d[i];
                if (i > 0) {
                    for (var j = 0; j < i; ++j) {
                        var proj = sum$1(ys[j].mulStrict(x)).mul(ys[j]);
                        x = x.sub(proj);
                    }
                }
                return x.div(norm(x, 'euclidean'));
            }));
        };
        for (var i = 0; i < xs.length; ++i) {
            _loop_1(i);
        }
        if (inputIsTensor2D) {
            return stack(ys, 0);
        }
        else {
            return ys;
        }
    }
    function qr_(x, fullMatrices) {
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
            var x2ds = unstack(x.reshape([
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
            var q = stack(q2ds_1, 0).reshape(x.shape);
            var r = stack(r2ds_1, 0).reshape(x.shape);
            return [q, r];
        }
    }
    function qr2d(x, fullMatrices) {
        if (fullMatrices === void 0) { fullMatrices = false; }
        return ENV.engine.tidy(function () {
            if (x.shape.length !== 2) {
                throw new Error("qr2d() requires a 2D Tensor, but got a " + x.shape.length + "D Tensor.");
            }
            var m = x.shape[0];
            var n = x.shape[1];
            var q = eye(m);
            var r = x.clone();
            var one2D = tensor2d([[1]], [1, 1]);
            var w = one2D.clone();
            var iters = m >= n ? n : m;
            var _loop_2 = function (j) {
                var _a;
                var rTemp = r;
                var wTemp = w;
                var qTemp = q;
                _a = ENV.engine.tidy(function () {
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
                dispose([rTemp, wTemp, qTemp]);
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
    var gramSchmidt = op({ gramSchmidt_: gramSchmidt_ });
    var qr = op({ qr_: qr_ });

    var linalg_ops = /*#__PURE__*/Object.freeze({
        gramSchmidt: gramSchmidt,
        qr: qr
    });

    function resizeBilinear_(images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        var $images = convertToTensor(images, 'images', 'resizeBilinear');
        assert($images.rank === 3 || $images.rank === 4, "Error in resizeBilinear: x must be rank 3 or 4, but got " +
            ("rank " + $images.rank + "."));
        assert(size.length === 2, "Error in resizeBilinear: new shape must 2D, but got shape " +
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
                batchImages: function () { return ENV.engine.runKernel(function (backend) {
                    return backend.resizeBilinearBackprop(dy, batchImages, alignCorners);
                }, {}); }
            };
        };
        var res = ENV.engine.runKernel(forward, { batchImages: batchImages }, backward);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function resizeNearestNeighbor_(images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        var $images = convertToTensor(images, 'images', 'resizeNearestNeighbor');
        assert($images.rank === 3 || $images.rank === 4, "Error in resizeNearestNeighbor: x must be rank 3 or 4, but got " +
            ("rank " + $images.rank + "."));
        assert(size.length === 2, "Error in resizeNearestNeighbor: new shape must 2D, but got shape " +
            (size + "."));
        assert($images.dtype === 'float32' || $images.dtype === 'int32', '`images` must have `int32` or `float32` as dtype');
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
                batchImages: function () { return ENV.engine.runKernel(function (backend) { return backend.resizeNearestNeighborBackprop(dy, batchImages, alignCorners); }, {}); }
            };
        };
        var res = ENV.engine.runKernel(forward, { batchImages: batchImages }, backward);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    }
    function nonMaxSuppression_(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
        if (iouThreshold === void 0) { iouThreshold = 0.5; }
        if (scoreThreshold === void 0) { scoreThreshold = Number.NEGATIVE_INFINITY; }
        var $boxes = convertToTensor(boxes, 'boxes', 'nonMaxSuppression');
        var $scores = convertToTensor(scores, 'scores', 'nonMaxSuppression');
        var inputs = nonMaxSuppSanityCheck($boxes, $scores, maxOutputSize, iouThreshold, scoreThreshold);
        maxOutputSize = inputs.maxOutputSize;
        iouThreshold = inputs.iouThreshold;
        scoreThreshold = inputs.scoreThreshold;
        return ENV.engine.runKernel(function (b) { return b.nonMaxSuppression($boxes, $scores, maxOutputSize, iouThreshold, scoreThreshold); }, { $boxes: $boxes });
    }
    function nonMaxSuppressionAsync_(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
        if (iouThreshold === void 0) { iouThreshold = 0.5; }
        if (scoreThreshold === void 0) { scoreThreshold = Number.NEGATIVE_INFINITY; }
        return __awaiter(this, void 0, void 0, function () {
            var $boxes, $scores, inputs, boxesVals, scoresVals, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $boxes = convertToTensor(boxes, 'boxes', 'nonMaxSuppressionAsync');
                        $scores = convertToTensor(scores, 'scores', 'nonMaxSuppressionAsync');
                        inputs = nonMaxSuppSanityCheck($boxes, $scores, maxOutputSize, iouThreshold, scoreThreshold);
                        maxOutputSize = inputs.maxOutputSize;
                        iouThreshold = inputs.iouThreshold;
                        scoreThreshold = inputs.scoreThreshold;
                        return [4, $boxes.data()];
                    case 1:
                        boxesVals = _a.sent();
                        return [4, $scores.data()];
                    case 2:
                        scoresVals = _a.sent();
                        res = nonMaxSuppressionImpl(boxesVals, scoresVals, maxOutputSize, iouThreshold, scoreThreshold);
                        if ($boxes !== boxes) {
                            $boxes.dispose();
                        }
                        if ($scores !== scores) {
                            $scores.dispose();
                        }
                        return [2, res];
                }
            });
        });
    }
    function nonMaxSuppSanityCheck(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
        if (iouThreshold == null) {
            iouThreshold = 0.5;
        }
        if (scoreThreshold == null) {
            scoreThreshold = Number.NEGATIVE_INFINITY;
        }
        var numBoxes = boxes.shape[0];
        maxOutputSize = Math.min(maxOutputSize, numBoxes);
        assert(0 <= iouThreshold && iouThreshold <= 1, "iouThreshold must be in [0, 1], but was '" + iouThreshold + "'");
        assert(boxes.rank === 2, "boxes must be a 2D tensor, but was of rank '" + boxes.rank + "'");
        assert(boxes.shape[1] === 4, "boxes must have 4 columns, but 2nd dimension was " + boxes.shape[1]);
        assert(scores.rank === 1, 'scores must be a 1D tensor');
        assert(scores.shape[0] === numBoxes, "scores has incompatible shape with boxes. Expected " + numBoxes + ", " +
            ("but was " + scores.shape[0]));
        return { maxOutputSize: maxOutputSize, iouThreshold: iouThreshold, scoreThreshold: scoreThreshold };
    }
    function cropAndResize_(image, boxes, boxInd, cropSize, method, extrapolationValue) {
        var $image = convertToTensor(image, 'image', 'cropAndResize', 'float32');
        var $boxes = convertToTensor(boxes, 'boxes', 'cropAndResize', 'float32');
        var $boxInd = convertToTensor(boxInd, 'boxInd', 'cropAndResize', 'int32');
        method = method || 'bilinear';
        extrapolationValue = extrapolationValue || 0;
        var numBoxes = $boxes.shape[0];
        assert($image.rank === 4, 'Error in cropAndResize: image must be rank 4,' +
            ("but got rank " + $image.rank + "."));
        assert($boxes.rank === 2 && $boxes.shape[1] === 4, "Error in cropAndResize: boxes must be have size [" + numBoxes + ",4] " +
            ("but had shape " + $boxes.shape + "."));
        assert($boxInd.rank === 1 && $boxInd.shape[0] === numBoxes, "Error in cropAndResize: boxInd must be have size [" + numBoxes + "] " +
            ("but had shape " + $boxes.shape + "."));
        assert($boxInd.dtype === 'int32', "Error in cropAndResize: boxInd must be of dtype int32, but got dtype " +
            ($boxInd.dtype + "."));
        assert(cropSize.length === 2, "Error in cropAndResize: cropSize must be of length 2, but got length " +
            (cropSize.length + "."));
        assert(cropSize[0] >= 1 && cropSize[1] >= 1, "cropSize must be atleast [1,1], but was " + cropSize);
        assert(method === 'bilinear' || method === 'nearest', "method must be bilinear or nearest, but was " + method);
        var forward = function (backend, save) {
            return backend.cropAndResize($image, $boxes, $boxInd, cropSize, method, extrapolationValue);
        };
        var res = ENV.engine.runKernel(forward, { $image: $image, $boxes: $boxes });
        return res;
    }
    var resizeBilinear = op({ resizeBilinear_: resizeBilinear_ });
    var resizeNearestNeighbor = op({ resizeNearestNeighbor_: resizeNearestNeighbor_ });
    var nonMaxSuppression = op({ nonMaxSuppression_: nonMaxSuppression_ });
    var nonMaxSuppressionAsync = nonMaxSuppressionAsync_;
    var cropAndResize = cropAndResize_;

    var image_ops = /*#__PURE__*/Object.freeze({
        resizeBilinear: resizeBilinear,
        resizeNearestNeighbor: resizeNearestNeighbor,
        nonMaxSuppression: nonMaxSuppression,
        nonMaxSuppressionAsync: nonMaxSuppressionAsync,
        cropAndResize: cropAndResize
    });



    var ops = /*#__PURE__*/Object.freeze({
        image: image_ops,
        linalg: linalg_ops,
        losses: loss_ops,
        spectral: spectral_ops,
        op: op,
        batchNormalization2d: batchNormalization2d,
        batchNormalization3d: batchNormalization3d,
        batchNormalization4d: batchNormalization4d,
        batchNormalization: batchNormalization,
        complex: complex,
        real: real,
        imag: imag,
        concat: concat,
        concat1d: concat1d,
        concat2d: concat2d,
        concat3d: concat3d,
        concat4d: concat4d,
        split: split$1,
        conv1d: conv1d,
        conv2d: conv2d,
        conv2dDerFilter: conv2dDerFilter,
        depthwiseConv2d: depthwiseConv2d,
        separableConv2d: separableConv2d,
        conv2dTranspose: conv2dTranspose,
        matMul: matMul,
        dot: dot,
        outerProduct: outerProduct,
        reverse: reverse,
        reverse1d: reverse1d,
        reverse2d: reverse2d,
        reverse3d: reverse3d,
        reverse4d: reverse4d,
        maxPool: maxPool,
        avgPool: avgPool,
        pool: pool,
        slice: slice,
        slice1d: slice1d,
        slice2d: slice2d,
        slice3d: slice3d,
        slice4d: slice4d,
        abs: abs,
        acos: acos,
        acosh: acosh,
        asin: asin,
        asinh: asinh,
        atan: atan,
        atanh: atanh,
        ceil: ceil,
        clipByValue: clipByValue,
        cos: cos,
        cosh: cosh,
        erf: erf,
        exp: exp,
        expm1: expm1,
        floor: floor,
        log: log$1,
        log1p: log1p,
        logSigmoid: logSigmoid,
        neg: neg,
        reciprocal: reciprocal,
        round: round,
        rsqrt: rsqrt,
        sigmoid: sigmoid,
        sign: sign,
        sin: sin,
        sinh: sinh,
        softplus: softplus,
        sqrt: sqrt,
        square: square,
        step: step,
        tan: tan,
        tanh: tanh$1,
        all: all,
        any: any,
        argMax: argMax,
        argMin: argMin,
        logSumExp: logSumExp,
        max: max,
        mean: mean,
        min: min,
        moments: moments,
        sum: sum$1,
        prod: prod,
        equal: equal,
        equalStrict: equalStrict,
        greater: greater,
        greaterEqual: greaterEqual,
        greaterEqualStrict: greaterEqualStrict,
        greaterStrict: greaterStrict,
        less: less,
        lessEqual: lessEqual,
        lessEqualStrict: lessEqualStrict,
        lessStrict: lessStrict,
        notEqual: notEqual,
        notEqualStrict: notEqualStrict,
        add: add,
        addN: addN,
        addStrict: addStrict,
        atan2: atan2,
        div: div,
        divStrict: divStrict,
        floorDiv: floorDiv,
        maximum: maximum,
        maximumStrict: maximumStrict,
        minimum: minimum,
        minimumStrict: minimumStrict,
        mod: mod,
        modStrict: modStrict,
        mul: mul,
        mulStrict: mulStrict,
        pow: pow,
        powStrict: powStrict,
        squaredDifference: squaredDifference,
        squaredDifferenceStrict: squaredDifferenceStrict,
        sub: sub,
        subStrict: subStrict,
        elu: elu,
        leakyRelu: leakyRelu,
        prelu: prelu,
        relu: relu,
        selu: selu,
        logicalAnd: logicalAnd,
        logicalNot: logicalNot,
        logicalOr: logicalOr,
        logicalXor: logicalXor,
        where: where,
        whereAsync: whereAsync,
        buffer: buffer,
        toPixels: toPixels,
        print: print,
        batchToSpaceND: batchToSpaceND,
        cast: cast,
        clone: clone,
        cumsum: cumsum,
        depthToSpace: depthToSpace,
        expandDims: expandDims,
        eye: eye,
        fromPixels: fromPixels,
        multinomial: multinomial,
        oneHot: oneHot,
        pad: pad,
        pad1d: pad1d,
        pad2d: pad2d,
        pad3d: pad3d,
        pad4d: pad4d,
        rand: rand,
        randomNormal: randomNormal,
        randomUniform: randomUniform,
        reshape: reshape,
        spaceToBatchND: spaceToBatchND,
        squeeze: squeeze,
        stack: stack,
        tile: tile,
        truncatedNormal: truncatedNormal,
        unstack: unstack,
        fill: fill,
        linspace: linspace,
        ones: ones$1,
        range: range,
        scalar: scalar,
        tensor: tensor,
        tensor1d: tensor1d,
        tensor2d: tensor2d,
        tensor3d: tensor3d,
        tensor4d: tensor4d,
        tensor5d: tensor5d,
        tensor6d: tensor6d,
        zeros: zeros,
        onesLike: onesLike,
        zerosLike: zerosLike,
        transpose: transpose,
        softmax: softmax,
        localResponseNormalization: localResponseNormalization,
        norm: norm,
        gather: gather,
        unsortedSegmentSum: unsortedSegmentSum,
        basicLSTMCell: basicLSTMCell,
        multiRNNCell: multiRNNCell,
        movingAverage: movingAverage,
        stridedSlice: stridedSlice,
        topk: topk,
        scatterND: scatterND,
        fft: fft,
        ifft: ifft,
        rfft: rfft,
        sparseToDense: sparseToDense,
        gatherND: gatherND
    });

    var MathBackendCPU = (function () {
        function MathBackendCPU() {
            this.blockSize = 48;
            this.firstUse = true;
            if (ENV.get('IS_BROWSER')) {
                this.fromPixels2DContext =
                    document.createElement('canvas').getContext('2d');
            }
        }
        MathBackendCPU.prototype.setDataMover = function (dataMover) {
            this.data = new DataStorage(dataMover);
        };
        MathBackendCPU.prototype.register = function (dataId, shape, dtype) {
            if (this.firstUse) {
                this.firstUse = false;
                if (ENV.get('IS_NODE')) {
                    warn('\n============================\n' +
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
            this.data.set(dataId, { dtype: dtype });
        };
        MathBackendCPU.prototype.write = function (dataId, values) {
            if (values == null) {
                throw new Error('MathBackendCPU.write(): values can not be null');
            }
            this.data.get(dataId).values = values;
        };
        MathBackendCPU.prototype.fromPixels = function (pixels, numChannels) {
            if (pixels == null) {
                throw new Error('pixels passed to tf.fromPixels() can not be null');
            }
            var vals;
            if (ENV.get('IS_NODE') && pixels.getContext == null) {
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
                if (this.fromPixels2DContext == null) {
                    throw new Error('Can\'t read pixels from HTMLImageElement outside ' +
                        'the browser.');
                }
                this.fromPixels2DContext.canvas.width = pixels.width;
                this.fromPixels2DContext.canvas.height = pixels.height;
                this.fromPixels2DContext.drawImage(pixels, 0, 0, pixels.width, pixels.height);
                vals = this.fromPixels2DContext
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
            return tensor3d(values, outShape, 'int32');
        };
        MathBackendCPU.prototype.read = function (dataId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.readSync(dataId)];
                });
            });
        };
        MathBackendCPU.prototype.readSync = function (dataId) {
            var _a = this.data.get(dataId), dtype = _a.dtype, complexTensors = _a.complexTensors;
            if (dtype === 'complex64') {
                var realValues = complexTensors.real.dataSync();
                var imagValues = complexTensors.imag.dataSync();
                return mergeRealAndImagArrays(realValues, imagValues);
            }
            return this.data.get(dataId).values;
        };
        MathBackendCPU.prototype.disposeData = function (dataId) {
            if (this.data.has(dataId)) {
                var complexTensors = this.data.get(dataId).complexTensors;
                if (complexTensors != null) {
                    complexTensors.real.dispose();
                    complexTensors.imag.dispose();
                }
                this.data.delete(dataId);
            }
        };
        MathBackendCPU.prototype.time = function (f) {
            return __awaiter(this, void 0, void 0, function () {
                var start, kernelMs;
                return __generator(this, function (_a) {
                    start = now();
                    f();
                    kernelMs = now() - start;
                    return [2, { kernelMs: kernelMs }];
                });
            });
        };
        MathBackendCPU.prototype.memory = function () {
            return {
                unreliable: true
            };
        };
        MathBackendCPU.prototype.complex = function (real$$1, imag$$1) {
            var result = Tensor.make(real$$1.shape, {}, 'complex64');
            var resultData = this.data.get(result.dataId);
            resultData.complexTensors = {
                real: ENV.engine.keep(real$$1.clone()),
                imag: ENV.engine.keep(imag$$1.clone())
            };
            return result;
        };
        MathBackendCPU.prototype.real = function (input) {
            var resultData = this.data.get(input.dataId);
            return resultData.complexTensors.real.clone();
        };
        MathBackendCPU.prototype.imag = function (input) {
            var resultData = this.data.get(input.dataId);
            return resultData.complexTensors.imag.clone();
        };
        MathBackendCPU.prototype.assertNotComplex = function (tensor$$1, opName) {
            if (!Array.isArray(tensor$$1)) {
                tensor$$1 = [tensor$$1];
            }
            tensor$$1.forEach(function (t) {
                if (t != null) {
                    assert(t.dtype !== 'complex64', opName + " does not support complex64 tensors.");
                }
            });
        };
        MathBackendCPU.prototype.slice = function (x, begin, size) {
            this.assertNotComplex(x, 'slice');
            var buffer$$1 = buffer(size, x.dtype);
            for (var i = 0; i < buffer$$1.size; ++i) {
                var loc = buffer$$1.indexToLoc(i);
                var xLoc = loc.map(function (idx, j) { return idx + begin[j]; });
                buffer$$1.set.apply(buffer$$1, [x.get.apply(x, xLoc)].concat(loc));
            }
            return buffer$$1.toTensor();
        };
        MathBackendCPU.prototype.stridedSlice = function (x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
            this.assertNotComplex(x, 'stridedSlice');
            var _a = getStridedSlicedInfo(x.shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask), beginIndex = _a[0], size = _a[1], shrinkAxis = _a[2];
            var shape = size.filter(function (v, index) { return shrinkAxis.indexOf(index) === -1; });
            if (shape.some(function (axis) { return axis === 0; })) {
                return tensor([], shape);
            }
            var buffer$$1 = buffer(size, x.dtype);
            for (var i = 0; i < buffer$$1.size; i++) {
                var loc = buffer$$1.indexToLoc(i);
                var newLoc = new Array(loc.length);
                for (var j = 0; j < newLoc.length; j++) {
                    newLoc[j] = loc[j] * strides[j] + beginIndex[j];
                }
                buffer$$1.set.apply(buffer$$1, [x.get.apply(x, newLoc)].concat(loc));
            }
            return buffer$$1.toTensor().reshape(shape);
        };
        MathBackendCPU.prototype.reverse = function (x, axis) {
            this.assertNotComplex(x, 'reverse');
            var buffer$$1 = buffer(x.shape, x.dtype);
            var xBuffer = x.buffer();
            var _loop_1 = function (i) {
                var outLoc = buffer$$1.indexToLoc(i);
                var inLoc = outLoc.slice();
                axis.forEach(function (ax) { return inLoc[ax] = x.shape[ax] - 1 - inLoc[ax]; });
                buffer$$1.set.apply(buffer$$1, [xBuffer.get.apply(xBuffer, inLoc)].concat(outLoc));
            };
            for (var i = 0; i < buffer$$1.size; i++) {
                _loop_1(i);
            }
            return buffer$$1.toTensor();
        };
        MathBackendCPU.prototype.concat = function (tensors, axis) {
            this.assertNotComplex(tensors, 'concat');
            var tensors2D = tensors.map(function (t) {
                var innerSize = sizeFromShape(t.shape.slice(axis));
                return t.as2D(-1, innerSize);
            });
            var outShape = computeOutShape(tensors2D.map(function (t) { return t.shape; }), 1);
            var values = buffer(outShape, tensors[0].dtype)
                .values;
            if (tensors2D[0].shape[0] === 1) {
                var offset_1 = 0;
                tensors2D.forEach(function (t) {
                    values.set(t.dataSync(), offset_1);
                    offset_1 += t.size;
                });
            }
            else {
                var colOffset_1 = 0;
                tensors2D.forEach(function (t) {
                    var tVals = t.dataSync();
                    var tIdx = 0;
                    for (var row = 0; row < t.shape[0]; ++row) {
                        var resIdx = row * outShape[1] + colOffset_1;
                        for (var col = 0; col < t.shape[1]; ++col) {
                            values[resIdx + col] = tVals[tIdx++];
                        }
                    }
                    colOffset_1 += t.shape[1];
                });
            }
            var finalOutShape = computeOutShape(tensors.map(function (t) { return t.shape; }), axis);
            return tensor(values, finalOutShape, tensors[0].dtype);
        };
        MathBackendCPU.prototype.neg = function (x) {
            this.assertNotComplex(x, 'neg');
            return this.multiply(scalar(-1), x);
        };
        MathBackendCPU.prototype.add = function (a, b) {
            if (a.dtype === 'complex64' || b.dtype === 'complex64') {
                return this.broadcastedBinaryComplexOp(a.cast('complex64'), b.cast('complex64'), function (aReal, aImag, bReal, bImag) {
                    return { real: aReal + bReal, imag: aImag + bImag };
                });
            }
            return this.broadcastedBinaryOp(a, b, upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue + bValue; });
        };
        MathBackendCPU.prototype.addN = function (tensors) {
            this.assertNotComplex(tensors, 'addN');
            var vals = tensors.map(function (t) { return t.dataSync(); });
            var result = buffer(tensors[0].shape, tensors[0].dtype);
            var resultVals = result.values;
            for (var i = 0; i < tensors.length; i++) {
                var currVals = vals[i];
                for (var j = 0; j < resultVals.length; j++) {
                    resultVals[j] += currVals[j];
                }
            }
            return result.toTensor();
        };
        MathBackendCPU.prototype.subtract = function (a, b) {
            if (a.dtype === 'complex64' || b.dtype === 'complex64') {
                return this.broadcastedBinaryComplexOp(a.cast('complex64'), b.cast('complex64'), function (aReal, aImag, bReal, bImag) {
                    return { real: aReal - bReal, imag: aImag - bImag };
                });
            }
            return this.broadcastedBinaryOp(a, b, upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue - bValue; });
        };
        MathBackendCPU.prototype.pow = function (a, b) {
            this.assertNotComplex([a, b], 'pow');
            return this.broadcastedBinaryOp(a, b, a.dtype, function (aValue, bValue) { return Math.pow(aValue, bValue); });
        };
        MathBackendCPU.prototype.batchMatMul = function (a, b, transposeA, transposeB) {
            this.assertNotComplex([a, b], 'matMul');
            var sharedDim = transposeA ? a.shape[1] : a.shape[2];
            var leftDim = transposeA ? a.shape[2] : a.shape[1];
            var rightDim = transposeB ? b.shape[1] : b.shape[2];
            var batchDim = a.shape[0];
            var aValues = a.dataSync();
            var bValues = b.dataSync();
            var _a = transposeA ?
                [a.strides[0], 1, a.strides[1]] :
                [a.strides[0], a.strides[1], 1], aBatch = _a[0], aOuterStep = _a[1], aInnerStep = _a[2];
            var _b = transposeB ?
                [1, b.strides[1], b.strides[0]] :
                [b.strides[1], 1, b.strides[0]], bInnerStep = _b[0], bOuterStep = _b[1], bBatch = _b[2];
            var size = leftDim * rightDim;
            var result = new Float32Array(batchDim * size);
            var blockSize = this.blockSize;
            for (var b_1 = 0; b_1 < batchDim; b_1++) {
                for (var i0 = 0; i0 < leftDim; i0 += blockSize) {
                    for (var j0 = 0; j0 < rightDim; j0 += blockSize) {
                        for (var k0 = 0; k0 < sharedDim; k0 += blockSize) {
                            var iBlock = Math.min(i0 + blockSize, leftDim);
                            var jBlock = Math.min(j0 + blockSize, rightDim);
                            var kBlock = Math.min(k0 + blockSize, sharedDim);
                            for (var i = i0; i < iBlock; i++) {
                                for (var j = j0; j < jBlock; j++) {
                                    var sum$$1 = 0.0;
                                    for (var k = k0; k < kBlock; k++) {
                                        sum$$1 += aValues[b_1 * aBatch + i * aOuterStep + k * aInnerStep] *
                                            bValues[k * bInnerStep + j * bOuterStep + b_1 * bBatch];
                                    }
                                    result[b_1 * size + (i * rightDim + j)] += sum$$1;
                                }
                            }
                        }
                    }
                }
            }
            return tensor3d(result, [batchDim, leftDim, rightDim]);
        };
        MathBackendCPU.prototype.multiply = function (a, b) {
            if (a.dtype === 'complex64' || b.dtype === 'complex64') {
                return this.broadcastedBinaryComplexOp(a.cast('complex64'), b.cast('complex64'), function (aReal, aImag, bReal, bImag) {
                    return {
                        real: aReal * bReal - aImag * bImag,
                        imag: aReal * bImag + aImag * bReal
                    };
                });
            }
            return this.broadcastedBinaryOp(a, b, upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue * bValue; });
        };
        MathBackendCPU.prototype.realDivide = function (a, b) {
            this.assertNotComplex([a, b], 'realDivide');
            var op$$1 = function (a, b) { return a / b; };
            var outputDtype = 'float32';
            return this.broadcastedBinaryOp(a, b, outputDtype, op$$1);
        };
        MathBackendCPU.prototype.floorDiv = function (a, b) {
            this.assertNotComplex([a, b], 'floorDiv');
            var op$$1 = function (a, b) { return Math.floor(a / b); };
            var outputDtype = 'int32';
            return this.broadcastedBinaryOp(a, b, outputDtype, op$$1);
        };
        MathBackendCPU.prototype.sum = function (x, axes) {
            this.assertNotComplex(x, 'sum');
            assertAxesAreInnerMostDims('sum', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var resultDtype = upcastType(x.dtype, 'int32');
            var result = zeros(outShape, resultDtype);
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var sum$$1 = 0;
                for (var j = 0; j < reduceSize; ++j) {
                    sum$$1 += aVals[offset + j];
                }
                vals[i] = sum$$1;
            }
            return result;
        };
        MathBackendCPU.prototype.prod = function (x, axes) {
            this.assertNotComplex(x, 'sum');
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var resultDtype = upcastType(x.dtype, 'int32');
            var result = zeros(outShape, resultDtype);
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var prod$$1 = 1;
                for (var j = 0; j < reduceSize; ++j) {
                    prod$$1 *= aVals[offset + j];
                }
                vals[i] = prod$$1;
            }
            return result;
        };
        MathBackendCPU.prototype.unsortedSegmentSum = function (x, segmentIds, numSegments) {
            this.assertNotComplex(x, 'unsortedSegmentSum');
            var res = [];
            var numIters = x.rank - segmentIds.rank;
            for (var i = 0; i < numIters; ++i) {
                segmentIds = segmentIds.expandDims(i + 1);
            }
            for (var i = 0; i < numSegments; ++i) {
                var segmentId = scalar(i, 'int32');
                var mask = equal(segmentId, segmentIds).asType('float32');
                var sum$$1 = mask.mul(x).sum(0);
                res.push(sum$$1);
            }
            return stack(res);
        };
        MathBackendCPU.prototype.argMin = function (x, axis) {
            this.assertNotComplex(x, 'argMin');
            var axes = [axis];
            assertAxesAreInnerMostDims('argMin', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var result = zeros(outShape, 'int32');
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var min$$1 = aVals[offset];
                var minIndex = 0;
                for (var j = 0; j < reduceSize; ++j) {
                    var value = aVals[offset + j];
                    if (value < min$$1) {
                        min$$1 = value;
                        minIndex = j;
                    }
                }
                vals[i] = minIndex;
            }
            return result;
        };
        MathBackendCPU.prototype.argMax = function (x, axis) {
            this.assertNotComplex(x, 'argMax');
            var axes = [axis];
            assertAxesAreInnerMostDims('argMax', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var result = zeros(outShape, 'int32');
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var max$$1 = aVals[offset];
                var maxIndex = 0;
                for (var j = 0; j < reduceSize; ++j) {
                    var value = aVals[offset + j];
                    if (value > max$$1) {
                        max$$1 = value;
                        maxIndex = j;
                    }
                }
                vals[i] = maxIndex;
            }
            return result;
        };
        MathBackendCPU.prototype.cumsum = function (x, axis, exclusive, reverse$$1) {
            this.assertNotComplex(x, 'cumsum');
            if (axis !== x.rank - 1) {
                throw new Error("backend.cumsum in CPU expects an inner-most axis=" + (x.rank - 1) + " " +
                    ("but got axis=" + axis));
            }
            var resultDtype = upcastType(x.dtype, 'int32');
            var result = zeros(x.shape, resultDtype);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            var finalDim = x.shape[x.rank - 1];
            var indexAdjuster = reverse$$1 ?
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
            this.assertNotComplex([a, b], 'equal');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return (aVal === bVal) ? 1 : 0;
            });
        };
        MathBackendCPU.prototype.notEqual = function (a, b) {
            this.assertNotComplex([a, b], 'notEqual');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return (aVal !== bVal) ? 1 : 0;
            });
        };
        MathBackendCPU.prototype.less = function (a, b) {
            this.assertNotComplex([a, b], 'less');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return (aVal < bVal) ? 1 : 0;
            });
        };
        MathBackendCPU.prototype.lessEqual = function (a, b) {
            this.assertNotComplex([a, b], 'lessEqual');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return (aVal <= bVal) ? 1 : 0;
            });
        };
        MathBackendCPU.prototype.greater = function (a, b) {
            this.assertNotComplex([a, b], 'greater');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return (aVal > bVal) ? 1 : 0;
            });
        };
        MathBackendCPU.prototype.greaterEqual = function (a, b) {
            this.assertNotComplex([a, b], 'greaterEqual');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return (aVal >= bVal) ? 1 : 0;
            });
        };
        MathBackendCPU.prototype.logicalNot = function (x) {
            this.assertNotComplex(x, 'logicalNot');
            var values = x.dataSync();
            var newValues = new Int32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                newValues[i] = values[i] ? 0 : 1;
            }
            return Tensor.make(x.shape, { values: newValues }, 'bool');
        };
        MathBackendCPU.prototype.logicalAnd = function (a, b) {
            this.assertNotComplex([a, b], 'logicalAnd');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return aVal && bVal;
            });
        };
        MathBackendCPU.prototype.logicalOr = function (a, b) {
            this.assertNotComplex([a, b], 'logicalOr');
            return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
                return aVal || bVal;
            });
        };
        MathBackendCPU.prototype.select = function (condition, a, b) {
            this.assertNotComplex([condition, a, b], 'select');
            var values = condition.dataSync();
            var aValues = a.dataSync();
            var bValues = b.dataSync();
            var result = zeros(a.shape, upcastType(a.dtype, b.dtype));
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
        MathBackendCPU.prototype.where = function (condition) {
            this.assertNotComplex([condition], 'where');
            var condVals = condition.dataSync();
            return whereImpl(condition.shape, condVals);
        };
        MathBackendCPU.prototype.topk = function (x, k, sorted) {
            this.assertNotComplex(x, 'topk');
            var xVals = x.dataSync();
            return topkImpl(xVals, x.shape, x.dtype, k, sorted);
        };
        MathBackendCPU.prototype.min = function (x, axes) {
            this.assertNotComplex(x, 'min');
            assertAxesAreInnerMostDims('min', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var result = zeros(outShape, x.dtype);
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var min$$1 = aVals[offset];
                for (var j = 0; j < reduceSize; ++j) {
                    var value = aVals[offset + j];
                    if (value < min$$1) {
                        min$$1 = value;
                    }
                }
                vals[i] = min$$1;
            }
            return result;
        };
        MathBackendCPU.prototype.minimum = function (a, b) {
            this.assertNotComplex([a, b], 'minimum');
            return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.min(aVal, bVal); });
        };
        MathBackendCPU.prototype.mod = function (a, b) {
            this.assertNotComplex([a, b], 'mod');
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
            this.assertNotComplex(x, 'max');
            assertAxesAreInnerMostDims('max', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var result = zeros(outShape, x.dtype);
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var max$$1 = aVals[offset];
                for (var j = 0; j < reduceSize; ++j) {
                    var value = aVals[offset + j];
                    if (value > max$$1) {
                        max$$1 = value;
                    }
                }
                vals[i] = max$$1;
            }
            return result;
        };
        MathBackendCPU.prototype.maximum = function (a, b) {
            this.assertNotComplex([a, b], 'maximum');
            return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.max(aVal, bVal); });
        };
        MathBackendCPU.prototype.all = function (x, axes) {
            this.assertNotComplex(x, 'all');
            assertAxesAreInnerMostDims('all', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var result = zeros(outShape, x.dtype);
            var reduceSize = sizeFromShape(reduceShape);
            var vals = result.dataSync();
            var aVals = x.dataSync();
            for (var i = 0; i < vals.length; ++i) {
                var offset = i * reduceSize;
                var all$$1 = aVals[offset];
                for (var j = 0; j < reduceSize; ++j) {
                    var value = aVals[offset + j];
                    all$$1 = all$$1 && value;
                }
                vals[i] = all$$1;
            }
            return result;
        };
        MathBackendCPU.prototype.any = function (x, axes) {
            this.assertNotComplex(x, 'any');
            assertAxesAreInnerMostDims('any', axes, x.rank);
            var _a = computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
            var result = zeros(outShape, x.dtype);
            var reduceSize = sizeFromShape(reduceShape);
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
            this.assertNotComplex([a, b], 'squaredDifference');
            return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) {
                var diff = aVal - bVal;
                return diff * diff;
            });
        };
        MathBackendCPU.prototype.ceil = function (x) {
            this.assertNotComplex(x, 'ceil');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                newValues[i] = Math.ceil(values[i]);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.floor = function (x) {
            this.assertNotComplex(x, 'floor');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                newValues[i] = Math.floor(values[i]);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.sign = function (x) {
            this.assertNotComplex(x, 'x');
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
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.round = function (x) {
            this.assertNotComplex(x, 'round');
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
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.exp = function (x) {
            this.assertNotComplex(x, 'exp');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                newValues[i] = Math.exp(values[i]);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.expm1 = function (x) {
            this.assertNotComplex(x, 'expm1');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                newValues[i] = Math.expm1(values[i]);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.log = function (x) {
            this.assertNotComplex(x, 'log');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                var value = values[i];
                newValues[i] = Math.log(value);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.log1p = function (x) {
            this.assertNotComplex(x, 'log1p');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                var value = values[i];
                newValues[i] = Math.log1p(value);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.sqrt = function (x) {
            this.assertNotComplex(x, 'sqrt');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                var value = values[i];
                newValues[i] = Math.sqrt(value);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.rsqrt = function (x) {
            this.assertNotComplex(x, 'rsqrt');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                var value = values[i];
                newValues[i] = 1 / Math.sqrt(value);
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.square = function (x) {
            this.assertNotComplex(x, 'square');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                var value = values[i];
                newValues[i] = value * value;
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.reciprocal = function (x) {
            this.assertNotComplex(x, 'reciprocal');
            var values = x.dataSync();
            var newValues = new Float32Array(values.length);
            for (var i = 0; i < values.length; ++i) {
                newValues[i] = 1 / values[i];
            }
            return Tensor.make(x.shape, { values: newValues });
        };
        MathBackendCPU.prototype.relu = function (x) {
            this.assertNotComplex(x, 'relu');
            var res = zeros(x.shape, x.dtype);
            var resVals = res.dataSync();
            var inVals = x.dataSync();
            for (var i = 0; i < inVals.length; ++i) {
                resVals[i] = Math.max(0, inVals[i]);
            }
            return res;
        };
        MathBackendCPU.prototype.elu = function (x) {
            this.assertNotComplex(x, 'elu');
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
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.eluDer = function (dy, y) {
            this.assertNotComplex([dy, y], 'eluDer');
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
            return Tensor.make(y.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.selu = function (x) {
            this.assertNotComplex(x, 'selu');
            var scaleAlpha = SELU_SCALEALPHA;
            var scale = SELU_SCALE;
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
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.clip = function (x, min$$1, max$$1) {
            this.assertNotComplex(x, 'clip');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                var v = values[i];
                resultValues[i] = v > max$$1 ? max$$1 : (v < min$$1 ? min$$1 : v);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.abs = function (x) {
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.abs(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.complexAbs = function (x) {
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < x.size; ++i) {
                var real$$1 = values[i * 2];
                var imag$$1 = values[i * 2 + 1];
                resultValues[i] = Math.sqrt(real$$1 * real$$1 + imag$$1 * imag$$1);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.int = function (x) {
            this.assertNotComplex(x, 'int');
            var resultValues = new Int32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = values[i];
            }
            return Tensor.make(x.shape, { values: resultValues }, 'int32');
        };
        MathBackendCPU.prototype.sigmoid = function (x) {
            this.assertNotComplex(x, 'sigmoid');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = 1 / (1 + Math.exp(-values[i]));
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.softplus = function (x) {
            this.assertNotComplex(x, 'softplus');
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
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.sin = function (x) {
            this.assertNotComplex(x, 'sin');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.sin(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.cos = function (x) {
            this.assertNotComplex(x, 'cos');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.cos(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.tan = function (x) {
            this.assertNotComplex(x, 'tan');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.tan(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.asin = function (x) {
            this.assertNotComplex(x, 'asin');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.asin(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.acos = function (x) {
            this.assertNotComplex(x, 'acos');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.acos(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.atan = function (x) {
            this.assertNotComplex(x, 'atan');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.atan(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.atan2 = function (a, b) {
            this.assertNotComplex([a, b], 'atan2');
            return this.broadcastedBinaryOp(a, b, a.dtype, function (aValue, bValue) { return Math.atan2(aValue, bValue); });
        };
        MathBackendCPU.prototype.sinh = function (x) {
            this.assertNotComplex(x, 'sinh');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.sinh(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.cosh = function (x) {
            this.assertNotComplex(x, 'cosh');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.cosh(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.tanh = function (x) {
            this.assertNotComplex(x, 'tanh');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = tanh(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.asinh = function (x) {
            this.assertNotComplex(x, 'asinh');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.asinh(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.acosh = function (x) {
            this.assertNotComplex(x, 'acosh');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.acosh(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.atanh = function (x) {
            this.assertNotComplex(x, 'atanh');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            for (var i = 0; i < values.length; ++i) {
                resultValues[i] = Math.atanh(values[i]);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.erf = function (x) {
            this.assertNotComplex(x, 'erf');
            var resultValues = new Float32Array(x.size);
            var values = x.dataSync();
            var p = ERF_P;
            var a1 = ERF_A1;
            var a2 = ERF_A2;
            var a3 = ERF_A3;
            var a4 = ERF_A4;
            var a5 = ERF_A5;
            for (var i = 0; i < values.length; ++i) {
                var v = values[i];
                var t = 1.0 / (1.0 + p * v);
                resultValues[i] = 1.0 -
                    (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t *
                        Math.exp(-v * v);
            }
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.step = function (x, alpha) {
            if (alpha === void 0) { alpha = 0; }
            this.assertNotComplex(x, 'step');
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
            return Tensor.make(x.shape, { values: resultValues });
        };
        MathBackendCPU.prototype.conv2d = function (x, filter, convInfo) {
            this.assertNotComplex([x, filter], 'conv2d');
            var filterHeight = convInfo.filterHeight;
            var filterWidth = convInfo.filterWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var padLeft = convInfo.padInfo.left;
            var padTop = convInfo.padInfo.top;
            var y = buffer(convInfo.outShape, x.dtype);
            var xVals = x.dataSync();
            var wVals = filter.dataSync();
            var yVals = y.values;
            for (var b = 0; b < convInfo.batchSize; ++b) {
                var xOffset1 = b * x.strides[0];
                var yOffset1 = b * y.strides[0];
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var yOffset2 = yOffset1 + yR * y.strides[1];
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    for (var wR = 0; wR < filterHeight; wR++) {
                        var xR = xRCorner + wR * dilationHeight;
                        if (xR < 0 || xR >= convInfo.inHeight) {
                            continue;
                        }
                        var wOffset1 = wR * filter.strides[0];
                        var xOffset2 = xOffset1 + xR * x.strides[1];
                        for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                            var yOffset3 = yOffset2 + yC * convInfo.outChannels;
                            var xCCorner = yC * convInfo.strideWidth - padTop;
                            for (var wC = 0; wC < filterWidth; wC++) {
                                var xC = xCCorner + wC * dilationWidth;
                                if (xC < 0 || xC >= convInfo.inWidth) {
                                    continue;
                                }
                                var wOffset2 = wOffset1 + wC * filter.strides[1];
                                var xOffset3 = xOffset2 + xC * convInfo.inChannels;
                                var wOffset3 = wOffset2;
                                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                                    var xVal = xVals[xOffset3 + d1];
                                    for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                                        yVals[yOffset3 + d2] += xVal * wVals[wOffset3 + d2];
                                    }
                                    wOffset3 += convInfo.outChannels;
                                }
                            }
                        }
                    }
                }
            }
            return y.toTensor();
        };
        MathBackendCPU.prototype.conv2dDerInput = function (dy, filter, convInfo) {
            this.assertNotComplex([dy, filter], 'conv2dDerInput');
            var dx = buffer(convInfo.inShape, 'float32');
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
            this.assertNotComplex([x, dy], 'conv2dDerFilter');
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var filterHeight = convInfo.filterHeight;
            var filterWidth = convInfo.filterWidth;
            var dW = buffer(convInfo.filterShape, 'float32');
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
            this.assertNotComplex([x, filter], 'depthwiseConv2D');
            var filterHeight = convInfo.filterHeight;
            var filterWidth = convInfo.filterWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var padLeft = convInfo.padInfo.left;
            var padTop = convInfo.padInfo.top;
            var chMul = convInfo.outChannels / convInfo.inChannels;
            var y = buffer(convInfo.outShape, x.dtype);
            var xVals = x.dataSync();
            var wVals = filter.dataSync();
            var yVals = y.values;
            for (var b = 0; b < convInfo.batchSize; ++b) {
                var xOffset1 = b * x.strides[0];
                var yOffset1 = b * y.strides[0];
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var yOffset2 = yOffset1 + yR * y.strides[1];
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    for (var wR = 0; wR < filterHeight; ++wR) {
                        var xR = xRCorner + wR * dilationHeight;
                        if (xR < 0 || xR >= convInfo.inHeight) {
                            continue;
                        }
                        var wOffset1 = wR * filter.strides[0];
                        var xOffset2 = xOffset1 + xR * x.strides[1];
                        for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                            var yOffset3 = yOffset2 + yC * y.strides[2];
                            var xCCorner = yC * convInfo.strideWidth - padTop;
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var xC = xCCorner + wC * dilationWidth;
                                if (xC < 0 || xC >= convInfo.inWidth) {
                                    continue;
                                }
                                var wOffset2 = wOffset1 + wC * filter.strides[1];
                                var xOffset3 = xOffset2 + xC * convInfo.inChannels;
                                var yOffset4 = yOffset3;
                                var wOffset3 = wOffset2;
                                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                                    var xVal = xVals[xOffset3 + d1];
                                    for (var q = 0; q < chMul; ++q) {
                                        yVals[yOffset4 + q] += xVal * wVals[wOffset3 + q];
                                    }
                                    yOffset4 += chMul;
                                    wOffset3 += chMul;
                                }
                            }
                        }
                    }
                }
            }
            return y.toTensor();
        };
        MathBackendCPU.prototype.depthwiseConv2DDerInput = function (dy, filter, convInfo) {
            this.assertNotComplex([dy, filter], 'depthwiseConv2DDerInput');
            var dx = buffer(convInfo.inShape, 'float32');
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
            this.assertNotComplex([x, dy], 'depthwiseConv2DDerFilter');
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var filterHeight = convInfo.filterHeight;
            var filterWidth = convInfo.filterWidth;
            var dW = buffer(convInfo.filterShape, 'float32');
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
            this.assertNotComplex(x, 'tile');
            var newShape = new Array(x.rank);
            for (var i = 0; i < newShape.length; i++) {
                newShape[i] = x.shape[i] * reps[i];
            }
            var result = buffer(newShape, x.dtype);
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
            this.assertNotComplex(x, 'pad');
            var outShape = paddings.map(function (p, i) { return p[0] + x.shape[i] + p[1]; });
            var start = paddings.map(function (p) { return p[0]; });
            var xBuffer = x.buffer();
            var buffer$$1 = buffer(outShape, x.dtype);
            if (constantValue !== 0) {
                buffer$$1.values.fill(constantValue);
            }
            for (var i = 0; i < x.size; i++) {
                var coords = xBuffer.indexToLoc(i);
                var outCoords = coords.map(function (c, i) { return c + start[i]; });
                buffer$$1.set.apply(buffer$$1, [x.get.apply(x, coords)].concat(outCoords));
            }
            return buffer$$1.toTensor();
        };
        MathBackendCPU.prototype.transpose = function (x, perm) {
            this.assertNotComplex(x, 'transpose');
            var newShape = new Array(x.rank);
            for (var i = 0; i < newShape.length; i++) {
                newShape[i] = x.shape[perm[i]];
            }
            var values = x.dataSync();
            var result = buffer(newShape, x.dtype);
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
            this.assertNotComplex([x, indices], 'gather');
            var newShape = x.shape.slice();
            var indicesValues = indices.dataSync();
            newShape[axis] = indicesValues.length;
            var result = buffer(newShape, x.dtype);
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
        MathBackendCPU.prototype.batchToSpaceND = function (x, blockShape, crops) {
            this.assertNotComplex([x], 'batchToSpaceND');
            var prod$$1 = blockShape.reduce(function (a, b) { return a * b; });
            var reshaped = getReshaped(x.shape, blockShape, prod$$1);
            var permuted = getPermuted(reshaped.length, blockShape.length);
            var reshapedPermuted = getReshapedPermuted(x.shape, blockShape, prod$$1);
            var sliceBeginCoords = getSliceBeginCoords(crops, blockShape.length);
            var sliceSize = getSliceSize(reshapedPermuted, crops, blockShape.length);
            return x.reshape(reshaped)
                .transpose(permuted)
                .reshape(reshapedPermuted)
                .slice(sliceBeginCoords, sliceSize);
        };
        MathBackendCPU.prototype.spaceToBatchND = function (x, blockShape, paddings) {
            this.assertNotComplex([x], 'spaceToBatchND');
            var prod$$1 = blockShape.reduce(function (a, b) { return a * b; });
            var completePaddings = [[0, 0]];
            completePaddings.push.apply(completePaddings, paddings);
            for (var i = 1 + blockShape.length; i < x.shape.length; ++i) {
                completePaddings.push([0, 0]);
            }
            var paddedX = x.pad(completePaddings);
            var reshapedPaddedShape = getReshaped(paddedX.shape, blockShape, prod$$1, false);
            var permutedReshapedPaddedPermutation = getPermuted(reshapedPaddedShape.length, blockShape.length, false);
            var flattenShape = getReshapedPermuted(paddedX.shape, blockShape, prod$$1, false);
            return paddedX.reshape(reshapedPaddedShape)
                .transpose(permutedReshapedPaddedPermutation)
                .reshape(flattenShape);
        };
        MathBackendCPU.prototype.pool = function (x, convInfo, poolType) {
            this.assertNotComplex(x, 'pool');
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
            var y = buffer(convInfo.outShape, 'float32');
            var padTop = convInfo.padInfo.top;
            var padLeft = convInfo.padInfo.left;
            var initialValue = (poolType === 'max' ? Number.NEGATIVE_INFINITY :
                Number.POSITIVE_INFINITY);
            for (var b = 0; b < convInfo.batchSize; ++b) {
                for (var d = 0; d < convInfo.inChannels; ++d) {
                    for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                        var xRCorner = yR * strideHeight - padTop;
                        var xRMin = Math.max(0, xRCorner);
                        var xRMax = Math.min(convInfo.inHeight, effectiveFilterHeight + xRCorner);
                        for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                            var xCCorner = yC * strideWidth - padLeft;
                            var xCMin = Math.max(0, xCCorner);
                            var xCMax = Math.min(convInfo.inWidth, effectiveFilterWidth + xCCorner);
                            var minMaxValue = initialValue;
                            var avgValue = 0;
                            var count = 0;
                            for (var xR = xRMin; xR < xRMax; xR += dilationHeight) {
                                for (var xC = xCMin; xC < xCMax; xC += dilationWidth) {
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
            var maxPositions = buffer(convInfo.outShape, 'int32');
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
            var padTop = convInfo.padInfo.top;
            var padLeft = convInfo.padInfo.left;
            for (var b = 0; b < convInfo.batchSize; ++b) {
                for (var d = 0; d < convInfo.inChannels; ++d) {
                    for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                        var xRCorner = yR * strideHeight - padTop;
                        var xRMin = xRCorner;
                        while (xRMin < 0) {
                            xRMin += dilationHeight;
                        }
                        var xRMax = Math.min(convInfo.inHeight, effectiveFilterHeight + xRCorner);
                        for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                            var xCCorner = yC * strideWidth - padLeft;
                            var xCMin = xCCorner;
                            while (xCMin < 0) {
                                xCMin += dilationWidth;
                            }
                            var xCMax = Math.min(convInfo.inWidth, effectiveFilterWidth + xCCorner);
                            var maxValue = Number.NEGATIVE_INFINITY;
                            var maxPosition = -1;
                            for (var xR = xRMin; xR < xRMax; xR += dilationHeight) {
                                var wR = xR - xRCorner;
                                for (var xC = xCMin; xC < xCMax; xC += dilationWidth) {
                                    var wC = xC - xCCorner;
                                    var pixel = x.get(b, xR, xC, d);
                                    if (pixel > maxValue) {
                                        maxValue = pixel;
                                        maxPosition = wR * effectiveFilterWidth + wC;
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
            this.assertNotComplex([x, y], 'maxPoolBackprop');
            var maxPositions = this.maxPoolPositions(x, convInfo);
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
            var padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
            var padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
            var dx = buffer(x.shape, 'float32');
            for (var b = 0; b < convInfo.batchSize; ++b) {
                for (var d = 0; d < convInfo.inChannels; ++d) {
                    for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                        for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                            var dyRCorner = dxR - padTop;
                            var dyCCorner = dxC - padLeft;
                            var dotProd = 0;
                            for (var wR = 0; wR < effectiveFilterHeight; wR += dilationHeight) {
                                var dyR = (dyRCorner + wR) / strideHeight;
                                if (dyR < 0 || dyR >= convInfo.outHeight ||
                                    Math.floor(dyR) !== dyR) {
                                    continue;
                                }
                                for (var wC = 0; wC < effectiveFilterWidth; wC += dilationWidth) {
                                    var dyC = (dyCCorner + wC) / strideWidth;
                                    if (dyC < 0 || dyC >= convInfo.outWidth ||
                                        Math.floor(dyC) !== dyC) {
                                        continue;
                                    }
                                    var maxPos = effectiveFilterHeight * effectiveFilterWidth -
                                        1 - maxPositions.get(b, dyR, dyC, d);
                                    var curPos = wR * effectiveFilterWidth + wC;
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
            this.assertNotComplex([dy, x], 'avgPoolBackprop');
            var strideHeight = convInfo.strideHeight;
            var strideWidth = convInfo.strideWidth;
            var filterHeight = convInfo.filterHeight;
            var filterWidth = convInfo.filterWidth;
            var dilationHeight = convInfo.dilationHeight;
            var dilationWidth = convInfo.dilationWidth;
            var effectiveFilterHeight = convInfo.effectiveFilterHeight;
            var effectiveFilterWidth = convInfo.effectiveFilterWidth;
            var padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
            var padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
            var dx = buffer(x.shape, 'float32');
            var avgMultiplier = 1 / (filterHeight * filterWidth);
            for (var b = 0; b < convInfo.batchSize; ++b) {
                for (var d = 0; d < convInfo.inChannels; ++d) {
                    for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                        for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                            var dyRCorner = dxR - padTop;
                            var dyCCorner = dxC - padLeft;
                            var dotProd = 0;
                            for (var wR = 0; wR < effectiveFilterHeight; wR += dilationHeight) {
                                var dyR = (dyRCorner + wR) / strideHeight;
                                if (dyR < 0 || dyR >= convInfo.outHeight ||
                                    Math.floor(dyR) !== dyR) {
                                    continue;
                                }
                                for (var wC = 0; wC < effectiveFilterWidth; wC += dilationWidth) {
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
            return castTensor(x, dtype, this);
        };
        MathBackendCPU.prototype.reshape = function (x, shape) {
            return reshapeTensor(x, shape);
        };
        MathBackendCPU.prototype.avgPool = function (x, convInfo) {
            this.assertNotComplex(x, 'avgPool');
            return this.pool(x, convInfo, 'avg').toFloat();
        };
        MathBackendCPU.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
            this.assertNotComplex(x, 'resizeBilinear');
            var _a = x.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
            var xValues = x.dataSync();
            var result = new Float32Array(sizeFromShape([batch, newHeight, newWidth, numChannels]));
            var effectiveInputSize = [
                (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
                (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
            ];
            var effectiveOutputSize = [
                (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
                (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
            ];
            var outputIdx = 0;
            var effectiveRowSizeRatio = effectiveInputSize[0] / effectiveOutputSize[0];
            var effectiveColSizeRatio = effectiveInputSize[1] / effectiveOutputSize[1];
            for (var b = 0; b < batch; b++) {
                for (var r = 0; r < newHeight; r++) {
                    var sourceFracRow = effectiveRowSizeRatio * r;
                    var sourceRowFloor = Math.floor(sourceFracRow);
                    var rowFrac = sourceFracRow - sourceRowFloor;
                    var sourceRowCeil = Math.min(oldHeight - 1, Math.ceil(sourceFracRow));
                    var topRowOffset = b * x.strides[0] + sourceRowFloor * x.strides[1];
                    var botRowOffset = b * x.strides[0] + sourceRowCeil * x.strides[1];
                    for (var c = 0; c < newWidth; c++) {
                        var sourceFracCol = effectiveColSizeRatio * c;
                        var sourceColFloor = Math.floor(sourceFracCol);
                        var colFrac = sourceFracCol - sourceColFloor;
                        var sourceColCeil = Math.min(oldWidth - 1, Math.ceil(sourceFracCol));
                        var topLeftOffest = topRowOffset + sourceColFloor * x.strides[2];
                        var botLeftOffset = botRowOffset + sourceColFloor * x.strides[2];
                        var topRightOffset = topRowOffset + +sourceColCeil * x.strides[2];
                        var botRightOffest = botRowOffset + sourceColCeil * x.strides[2];
                        for (var d = 0; d < numChannels; d++) {
                            var topLeft = xValues[topLeftOffest + d];
                            var bottomLeft = xValues[botLeftOffset + d];
                            var topRight = xValues[topRightOffset + d];
                            var bottomRight = xValues[botRightOffest + d];
                            var top_1 = topLeft + (topRight - topLeft) * colFrac;
                            var bottom = bottomLeft + (bottomRight - bottomLeft) * colFrac;
                            var newValue = top_1 + (bottom - top_1) * rowFrac;
                            result[outputIdx++] = newValue;
                        }
                    }
                }
            }
            return tensor(result, [batch, newHeight, newWidth, numChannels]);
        };
        MathBackendCPU.prototype.resizeBilinearBackprop = function (dy, x, alignCorners) {
            this.assertNotComplex([dy, x], 'resizeBilinearBackprop');
            var _a = x.shape, batch = _a[0], xHeight = _a[1], xWidth = _a[2], depth = _a[3];
            var _b = dy.shape, yHeight = _b[1], yWidth = _b[2];
            var output = new Float32Array(batch * xHeight * xWidth * depth);
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
            var dyValues = dy.dataSync();
            var offset = 0;
            for (var b = 0; b < batch; b++) {
                var bOffset = b * x.strides[0];
                for (var r = 0; r < yHeight; r++) {
                    var dxR = r * heightScale;
                    var topDxRIndex = Math.floor(dxR);
                    var bottomDxRIndex = Math.min(Math.ceil(dxR), xHeight - 1);
                    var topDxROffset = bOffset + topDxRIndex * x.strides[1];
                    var bottomDxROffset = bOffset + bottomDxRIndex * x.strides[1];
                    var dxRLerp = dxR - topDxRIndex;
                    var inverseDxRLerp = 1.0 - dxRLerp;
                    for (var c = 0; c < yWidth; c++) {
                        var dxC = c * widthScale;
                        var leftDxCIndex = Math.floor(dxC);
                        var rightDxCIndex = Math.min(Math.ceil(dxC), xWidth - 1);
                        var dxCLerp = dxC - leftDxCIndex;
                        var inverseDxCLerp = 1.0 - dxCLerp;
                        var topLeftRCOffset = topDxROffset + leftDxCIndex * x.strides[2];
                        var topRightRCOffset = topDxROffset + rightDxCIndex * x.strides[2];
                        var bottomLeftRCOffset = bottomDxROffset + leftDxCIndex * x.strides[2];
                        var bottomRightRCOffset = bottomDxROffset + rightDxCIndex * x.strides[2];
                        var inverseDxRLerpTimesInverseDxCLerp = inverseDxRLerp * inverseDxCLerp;
                        var inverseDxRLerpTimesDxCLerp = inverseDxRLerp * dxCLerp;
                        var dxRLerpTimesInverseDxCLerp = dxRLerp * inverseDxCLerp;
                        var dxRLerpTimesDxCLerp = dxRLerp * dxCLerp;
                        for (var d = 0; d < depth; d++) {
                            var dyVal = dyValues[offset++];
                            output[topLeftRCOffset + d] +=
                                dyVal * inverseDxRLerpTimesInverseDxCLerp;
                            output[topRightRCOffset + d] += dyVal * inverseDxRLerpTimesDxCLerp;
                            output[bottomLeftRCOffset + d] +=
                                dyVal * dxRLerpTimesInverseDxCLerp;
                            output[bottomRightRCOffset + d] += dyVal * dxRLerpTimesDxCLerp;
                        }
                    }
                }
            }
            return tensor4d(output, [batch, xWidth, xHeight, depth], x.dtype);
        };
        MathBackendCPU.prototype.resizeNearestNeighbor = function (x, newHeight, newWidth, alignCorners) {
            this.assertNotComplex(x, 'resizeNearestNeighbor');
            var _a = x.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
            var xValues = x.dataSync();
            var output = new Float32Array(batch * newHeight * newWidth * numChannels);
            var effectiveInputSize = [
                (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
                (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
            ];
            var effectiveOutputSize = [
                (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
                (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
            ];
            var effectiveRowSizeRatio = effectiveInputSize[0] / effectiveOutputSize[0];
            var effectiveColSizeRatio = effectiveInputSize[1] / effectiveOutputSize[1];
            var outputOffset = 0;
            for (var b = 0; b < batch; b++) {
                var batchOffset = b * x.strides[0];
                for (var r = 0; r < newHeight; r++) {
                    var sourceFracRow = effectiveRowSizeRatio * r;
                    var sourceNearestRow = Math.min(oldHeight - 1, alignCorners ? Math.round(sourceFracRow) :
                        Math.floor(sourceFracRow));
                    var rowOffset = batchOffset + sourceNearestRow * x.strides[1];
                    for (var c = 0; c < newWidth; c++) {
                        var sourceFracCol = effectiveColSizeRatio * c;
                        var sourceNearestCol = Math.min(oldWidth - 1, alignCorners ? Math.round(sourceFracCol) :
                            Math.floor(sourceFracCol));
                        var colOffset = rowOffset + sourceNearestCol * x.strides[2];
                        for (var d = 0; d < numChannels; d++) {
                            var newVal = xValues[colOffset + d];
                            output[outputOffset++] = newVal;
                        }
                    }
                }
            }
            return tensor(output, [batch, newHeight, newWidth, numChannels], x.dtype);
        };
        MathBackendCPU.prototype.resizeNearestNeighborBackprop = function (dy, x, alignCorners) {
            this.assertNotComplex([dy, x], 'resizeNearestNeighborBackprop');
            var _a = x.shape, batch = _a[0], xHeight = _a[1], xWidth = _a[2], depth = _a[3];
            var _b = dy.shape, yHeight = _b[1], yWidth = _b[2];
            var output = new Float32Array(batch * xHeight * xWidth * depth);
            var dyValues = dy.dataSync();
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
                var batchOffset = b * x.strides[0];
                for (var r = 0; r < xHeight; r++) {
                    var rowOffset = batchOffset + r * x.strides[1];
                    var startRLerp = Math.floor(r * invHeightScale);
                    var startDyR = Math.floor(startRLerp - (winHeight / 2));
                    for (var c = 0; c < xWidth; c++) {
                        var colOffset = rowOffset + c * x.strides[2];
                        var startCLerp = Math.floor(c * invWidthScale);
                        var startDyC = Math.floor(startCLerp - (winWidth / 2));
                        for (var d = 0; d < depth; d++) {
                            var accum = 0;
                            for (var dyRIndex = 0; dyRIndex < winHeight; dyRIndex++) {
                                var dyR = dyRIndex + startDyR;
                                if (dyR < 0 || dyR >= yHeight) {
                                    continue;
                                }
                                var dyROffset = batchOffset + dyR * dy.strides[1];
                                var sourceFracRow = dyR * heightScale;
                                var sourceNearestRow = Math.min(xHeight - 1, alignCorners ? Math.round(sourceFracRow) :
                                    Math.floor(sourceFracRow));
                                if (r !== sourceNearestRow) {
                                    continue;
                                }
                                for (var dyCIndex = 0; dyCIndex < winWidth; dyCIndex++) {
                                    var dyC = dyCIndex + startDyC;
                                    if (dyC < 0 || dyC >= yWidth) {
                                        continue;
                                    }
                                    var dyCOffset = dyROffset + dyC * dy.strides[2];
                                    var sourceFracCol = dyC * widthScale;
                                    var sourceNearestCol = Math.min(xWidth - 1, alignCorners ? Math.round(sourceFracCol) :
                                        Math.floor(sourceFracCol));
                                    if (c === sourceNearestCol) {
                                        accum += dyValues[dyCOffset + d];
                                    }
                                }
                            }
                            output[colOffset + d] = accum;
                        }
                    }
                }
            }
            return tensor4d(output, x.shape, x.dtype);
        };
        MathBackendCPU.prototype.batchNormalization = function (x, mean$$1, variance, varianceEpsilon, scale, offset) {
            this.assertNotComplex([x, mean$$1, variance, scale, offset], 'batchNormalization');
            var xVals = x.dataSync();
            var mVals = mean$$1.dataSync();
            var varVals = variance.dataSync();
            var sVals = scale ? scale.dataSync() : new Float32Array([1]);
            var offVals = offset ? offset.dataSync() : new Float32Array([0]);
            var outVals = new Float32Array(xVals.length);
            var offValsLength = offVals.length;
            var sValsLength = sVals.length;
            var varValsLength = varVals.length;
            var mValsLength = mVals.length;
            var offi = 0;
            var mi = 0;
            var si = 0;
            var vi = 0;
            for (var i = 0; i < xVals.length; ++i) {
                outVals[i] = offVals[offi++] +
                    (xVals[i] - mVals[mi++]) * sVals[si++] /
                        Math.sqrt(varVals[vi++] + varianceEpsilon);
                if (offi >= offValsLength) {
                    offi = 0;
                }
                if (mi >= mValsLength) {
                    mi = 0;
                }
                if (si >= sValsLength) {
                    si = 0;
                }
                if (vi >= varValsLength) {
                    vi = 0;
                }
            }
            return tensor4d(outVals, x.shape);
        };
        MathBackendCPU.prototype.localResponseNormalization4D = function (x, depthRadius, bias, alpha, beta) {
            this.assertNotComplex(x, 'localResponseNormalization4D');
            var channels = x.shape[3];
            var maxD = channels - 1;
            var xValues = x.dataSync();
            var size = sizeFromShape(x.shape);
            var result = new Float32Array(size);
            function sumAcrossChannels(offset) {
                var currentChannel = offset % channels;
                var beginSumOffset = offset - currentChannel + Math.max(0, currentChannel - depthRadius);
                var endSumOffset = offset - currentChannel +
                    Math.min(currentChannel + depthRadius, maxD);
                var sum$$1 = 0.0;
                for (; beginSumOffset <= endSumOffset; beginSumOffset++) {
                    var z = xValues[beginSumOffset];
                    sum$$1 += z * z;
                }
                return sum$$1;
            }
            for (var offset = 0; offset < size; offset++) {
                var sum$$1 = sumAcrossChannels(offset);
                var val = xValues[offset] * Math.pow(bias + alpha * sum$$1, -beta);
                result[offset] = val;
            }
            return tensor4d(result, x.shape);
        };
        MathBackendCPU.prototype.LRNGrad = function (dy, inputImage, outputImage, depthRadius, bias, alpha, beta) {
            this.assertNotComplex(dy, 'LRNGrad');
            var channels = dy.shape[3];
            var dyValues = dy.dataSync();
            var inputImageValues = inputImage.dataSync();
            var outputImageValues = outputImage.dataSync();
            var result = new Float32Array(sizeFromShape(dy.shape));
            var size = sizeFromShape(dy.shape);
            for (var offset = 0; offset < size; offset++) {
                var currentChannel = offset % channels;
                var depthBegin = (offset - currentChannel) + Math.max(0, currentChannel - depthRadius);
                var depthEnd = (offset - currentChannel) +
                    Math.min(channels, currentChannel + depthRadius + 1);
                var norm$$1 = 0;
                for (var k = depthBegin; k < depthEnd; k++) {
                    norm$$1 += Math.pow(inputImageValues[k], 2);
                }
                norm$$1 = alpha * norm$$1 + bias;
                for (var k = depthBegin; k < depthEnd; k++) {
                    var dyi = -2 * alpha * beta * inputImageValues[k] *
                        outputImageValues[offset] / norm$$1;
                    if (offset === k) {
                        dyi += Math.pow(norm$$1, -beta);
                    }
                    dyi *= dyValues[offset];
                    result[k] += dyi;
                }
            }
            return tensor4d(result, dy.shape);
        };
        MathBackendCPU.prototype.multinomial = function (logits, normalized, numSamples, seed) {
            this.assertNotComplex(logits, 'multinomial');
            var probabilities = normalized ? logits : softmax(logits);
            var batchSize = probabilities.shape[0];
            var numEvents = probabilities.shape[1];
            var res = zeros([batchSize, numSamples], 'int32');
            var resVals = res.dataSync();
            var probVals = probabilities.dataSync();
            for (var b = 0; b < batchSize; ++b) {
                var offset = b * numEvents;
                var cdf = new Float32Array(numEvents - 1);
                cdf[0] = probVals[offset];
                for (var event_1 = 1; event_1 < cdf.length; ++event_1) {
                    cdf[event_1] = cdf[event_1 - 1] + probVals[offset + event_1];
                }
                var random = seedrandom_1(seed.toString());
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
            this.assertNotComplex(indices, 'oneHot');
            var res = new Float32Array(indices.size * depth);
            res.fill(offValue);
            for (var event_3 = 0; event_3 < indices.size; ++event_3) {
                if (indices.get(event_3) >= 0 && indices.get(event_3) < depth) {
                    res[event_3 * depth + indices.get(event_3)] = onValue;
                }
            }
            return tensor2d(res, [indices.size, depth], 'int32');
        };
        MathBackendCPU.prototype.nonMaxSuppression = function (boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
            this.assertNotComplex(boxes, 'nonMaxSuppression');
            var boxesVals = boxes.dataSync();
            var scoresVals = scores.dataSync();
            return nonMaxSuppressionImpl(boxesVals, scoresVals, maxOutputSize, iouThreshold, scoreThreshold);
        };
        MathBackendCPU.prototype.fft = function (x) {
            if (x.shape[0] !== 1) {
                throw new Error("tf.fft() on CPU only supports vectors.");
            }
            var inverse = false;
            return this.fftImpl(x, inverse);
        };
        MathBackendCPU.prototype.ifft = function (x) {
            if (x.shape[0] !== 1) {
                throw new Error("tf.ifft() on CPU only supports vectors.");
            }
            var inverse = true;
            return this.fftImpl(x, inverse);
        };
        MathBackendCPU.prototype.fftImpl = function (x, inverse) {
            var x1D = x.as1D();
            var n = x1D.size;
            if (this.isExponentOf2(n)) {
                var result = this.fftRadix2(x1D, n, inverse).as2D(x.shape[0], x.shape[1]);
                if (inverse) {
                    result = complex(real(result).div(scalar(n)), imag(result).div(scalar(n)));
                }
                return result;
            }
            else {
                var data = x.dataSync();
                var rawOutput = this.fourierTransformByMatmul(data, n, inverse);
                var output = splitRealAndImagArrays(rawOutput);
                return complex(output.real, output.imag).as2D(x.shape[0], x.shape[1]);
            }
        };
        MathBackendCPU.prototype.isExponentOf2 = function (size) {
            return (size & size - 1) === 0;
        };
        MathBackendCPU.prototype.fftRadix2 = function (input, size, inverse) {
            if (size === 1) {
                return input;
            }
            var data = input.dataSync();
            var half = size / 2;
            var evenComplex = complexWithEvenIndex(data);
            var evenTensor = complex(evenComplex.real, evenComplex.imag).as1D();
            var oddComplex = complexWithOddIndex(data);
            var oddTensor = complex(oddComplex.real, oddComplex.imag).as1D();
            evenTensor = this.fftRadix2(evenTensor, half, inverse);
            oddTensor = this.fftRadix2(oddTensor, half, inverse);
            var e = exponents(size, inverse);
            var exponent$$1 = complex(e.real, e.imag).mul(oddTensor);
            var addPart = evenTensor.add(exponent$$1);
            var subPart = evenTensor.sub(exponent$$1);
            var realTensor = real(addPart).concat(real(subPart));
            var imagTensor = imag(addPart).concat(imag(subPart));
            return complex(realTensor, imagTensor).as1D();
        };
        MathBackendCPU.prototype.fourierTransformByMatmul = function (data, size, inverse) {
            var ret = new Float32Array(size * 2);
            for (var r = 0; r < size; r++) {
                var real$$1 = 0.0;
                var imag$$1 = 0.0;
                for (var c = 0; c < size; c++) {
                    var e = exponent(r * c, size, inverse);
                    var term = getComplexWithIndex(data, c);
                    real$$1 += term.real * e.real - term.imag * e.imag;
                    imag$$1 += term.real * e.imag + term.imag * e.real;
                }
                if (inverse) {
                    real$$1 /= size;
                    imag$$1 /= size;
                }
                assignToTypedArray(ret, real$$1, imag$$1, r);
            }
            return ret;
        };
        MathBackendCPU.prototype.depthToSpace = function (x, blockSize, dataFormat) {
            assert(dataFormat === 'NHWC', "Only NHWC dataFormat supported on CPU for depthToSpace. Got " + dataFormat);
            assert(blockSize > 1, "blockSize should be > 1 for depthToSpace, but was: " + blockSize);
            var batchSize = x.shape[0];
            var inputHeight = x.shape[1];
            var inputWidth = x.shape[2];
            var inputDepth = x.shape[3];
            var outputHeight = inputHeight * blockSize;
            var outputWidth = inputWidth * blockSize;
            var outputDepth = inputDepth / (blockSize * blockSize);
            var xValues = x.dataSync();
            var result = new Float32Array(batchSize * outputHeight * outputWidth * outputDepth);
            var outputIdx = 0;
            for (var b = 0; b < batchSize; ++b) {
                for (var h = 0; h < outputHeight; ++h) {
                    var inH = Math.floor(h / blockSize);
                    var offsetH = (h % blockSize);
                    for (var w = 0; w < outputWidth; ++w) {
                        var inW = Math.floor(w / blockSize);
                        var offsetW = (w % blockSize);
                        var offsetD = (offsetH * blockSize + offsetW) * outputDepth;
                        for (var d = 0; d < outputDepth; ++d) {
                            var inD = d + offsetD;
                            var inputIdx = inD + inputDepth * (inW + inputWidth * (inH + inputHeight * b));
                            result[outputIdx++] = xValues[inputIdx];
                        }
                    }
                }
            }
            return tensor4d(result, [batchSize, outputHeight, outputWidth, outputDepth]);
        };
        MathBackendCPU.prototype.broadcastedBinaryOp = function (a, b, dtype, op$$1) {
            var newShape = assertAndGetBroadcastShape(a.shape, b.shape);
            var result = buffer(newShape, dtype);
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var aBroadcastDims = getBroadcastDims(a.shape, newShape);
            var bBroadcastDims = getBroadcastDims(b.shape, newShape);
            var resVals = result.values;
            if (aBroadcastDims.length + bBroadcastDims.length === 0) {
                for (var i = 0; i < resVals.length; ++i) {
                    resVals[i] = op$$1(aVals[i % aVals.length], bVals[i % bVals.length]);
                }
            }
            else {
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
                    resVals[i] = op$$1(aVals[aIndex], bVals[bIndex]);
                };
                for (var i = 0; i < resVals.length; ++i) {
                    _loop_2(i);
                }
            }
            return result.toTensor();
        };
        MathBackendCPU.prototype.broadcastedBinaryComplexOp = function (a, b, op$$1) {
            var newShape = assertAndGetBroadcastShape(a.shape, b.shape);
            var realResult = buffer(newShape, 'float32');
            var imagResult = buffer(newShape, 'float32');
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var aBroadcastDims = getBroadcastDims(a.shape, newShape);
            var bBroadcastDims = getBroadcastDims(b.shape, newShape);
            var realVals = realResult.values;
            var imagVals = imagResult.values;
            if (aBroadcastDims.length + bBroadcastDims.length === 0) {
                for (var i = 0; i < realVals.length; i++) {
                    var aIdx = i % aVals.length;
                    var bIdx = i % bVals.length;
                    var result = op$$1(aVals[aIdx * 2], aVals[aIdx * 2 + 1], bVals[bIdx * 2], bVals[bIdx * 2 + 1]);
                    realVals[i] = result.real;
                    imagVals[i] = result.imag;
                }
            }
            else {
                var aRealBuf = this.data.get(a.dataId).complexTensors.real.buffer();
                var bRealBuf = this.data.get(b.dataId).complexTensors.real.buffer();
                var _loop_3 = function (i) {
                    var loc = realResult.indexToLoc(i);
                    var aLoc = loc.slice(-a.rank);
                    aBroadcastDims.forEach(function (d) { return aLoc[d] = 0; });
                    var aIndex = aRealBuf.locToIndex(aLoc);
                    var bLoc = loc.slice(-b.rank);
                    bBroadcastDims.forEach(function (d) { return bLoc[d] = 0; });
                    var bIndex = bRealBuf.locToIndex(bLoc);
                    var opResult = op$$1(aVals[aIndex * 2], aVals[aIndex * 2 + 1], bVals[bIndex * 2], bVals[bIndex * 2 + 1]);
                    realVals[i] = opResult.real;
                    imagVals[i] = opResult.imag;
                };
                for (var i = 0; i < realVals.length; i++) {
                    _loop_3(i);
                }
            }
            return this.complex(realResult.toTensor(), imagResult.toTensor());
        };
        MathBackendCPU.prototype.split = function (x, sizeSplits, axis) {
            return split(x, sizeSplits, axis);
        };
        MathBackendCPU.prototype.dispose = function () { };
        MathBackendCPU.prototype.floatPrecision = function () {
            return 32;
        };
        MathBackendCPU.prototype.cropAndResize = function (images, boxes, boxIndex, cropSize, method, extrapolationValue) {
            var _a = images.shape, batch = _a[0], imageHeight = _a[1], imageWidth = _a[2], numChannels = _a[3];
            var numBoxes = boxes.shape[0];
            var cropHeight = cropSize[0], cropWidth = cropSize[1];
            var output = buffer([numBoxes, cropHeight, cropWidth, numChannels]);
            var boxVals = boxes.dataSync();
            var boxIndVals = boxIndex.dataSync();
            var imageVals = images.dataSync();
            var inStride = images.strides;
            var outStride = output.strides;
            for (var b = 0; b < numBoxes; b++) {
                var startInd = b * 4;
                var y1 = boxVals[startInd];
                var x1 = boxVals[startInd + 1];
                var y2 = boxVals[startInd + 2];
                var x2 = boxVals[startInd + 3];
                var bInd = boxIndVals[b];
                if (bInd >= batch) {
                    continue;
                }
                var heightScale = (cropHeight > 1) ?
                    (y2 - y1) * (imageHeight - 1) / (cropHeight - 1) :
                    0;
                var widthScale = (cropWidth > 1) ? (x2 - x1) * (imageWidth - 1) / (cropWidth - 1) : 0;
                for (var y = 0; y < cropHeight; y++) {
                    var yInd = (cropHeight > 1) ?
                        y1 * (imageHeight - 1) + y * (heightScale) :
                        0.5 * (y1 + y2) * (imageHeight - 1);
                    if (yInd < 0 || yInd > imageHeight - 1) {
                        for (var x = 0; x < cropWidth; x++) {
                            for (var c = 0; c < numChannels; c++) {
                                var ind = c + x * outStride[2] + y * outStride[1] + b * outStride[0];
                                output.values[ind] = extrapolationValue;
                            }
                        }
                        continue;
                    }
                    if (method === 'bilinear') {
                        var topInd = Math.floor(yInd);
                        var bottomInd = Math.ceil(yInd);
                        var yLerp = yInd - topInd;
                        for (var x = 0; x < cropWidth; x++) {
                            var xInd = (cropWidth > 1) ?
                                x1 * (imageWidth - 1) + x * widthScale :
                                0.5 * (x1 + x2) * (imageWidth - 1);
                            if (xInd < 0 || xInd > imageWidth - 1) {
                                for (var c = 0; c < numChannels; c++) {
                                    var ind = c + x * outStride[2] + y * outStride[1] + b * outStride[0];
                                    output.values[ind] = extrapolationValue;
                                }
                                continue;
                            }
                            var leftInd = Math.floor(xInd);
                            var rightInd = Math.ceil(xInd);
                            var xLerp = xInd - leftInd;
                            for (var c = 0; c < numChannels; c++) {
                                var ind = c + leftInd * inStride[2] + topInd * inStride[1] +
                                    bInd * inStride[0];
                                var topLeft = imageVals[ind];
                                ind = c + rightInd * inStride[2] + topInd * inStride[1] +
                                    bInd * inStride[0];
                                var topRight = imageVals[ind];
                                ind = c + leftInd * inStride[2] + bottomInd * inStride[1] +
                                    bInd * inStride[0];
                                var bottomLeft = imageVals[ind];
                                ind = c + rightInd * inStride[2] + bottomInd * inStride[1] +
                                    bInd * inStride[0];
                                var bottomRight = imageVals[ind];
                                var top_2 = topLeft + (topRight - topLeft) * xLerp;
                                var bottom = bottomLeft + (bottomRight - bottomLeft) * xLerp;
                                ind = c + x * outStride[2] + y * outStride[1] + b * outStride[0];
                                output.values[ind] = top_2 + ((bottom - top_2) * yLerp);
                            }
                        }
                    }
                    else {
                        for (var x = 0; x < cropWidth; ++x) {
                            var xInd = (cropWidth > 1) ?
                                x1 * (imageWidth - 1) + x * widthScale :
                                0.5 * (x1 + x2) * (imageWidth - 1);
                            if (xInd < 0 || xInd > imageWidth - 1) {
                                for (var c = 0; c < numChannels; c++) {
                                    var ind = c + x * outStride[2] + y * outStride[1] + b * outStride[0];
                                    output.values[ind] = extrapolationValue;
                                }
                                continue;
                            }
                            var closestX = Math.round(xInd);
                            var closestY = Math.round(yInd);
                            for (var c = 0; c < numChannels; c++) {
                                var inInd = c + closestX * inStride[2] +
                                    closestY * inStride[1] + bInd * inStride[0];
                                var outInd = c + x * outStride[2] + y * outStride[1] + b * outStride[0];
                                output.values[outInd] = imageVals[inInd];
                            }
                        }
                    }
                }
            }
            return output.toTensor();
        };
        MathBackendCPU.prototype.sparseToDense = function (sparseIndices, sparseValues, outputShape, defaultValue) {
            var _a = calculateShapes(sparseValues, sparseIndices, outputShape), sliceRank = _a.sliceRank, numUpdates = _a.numUpdates, sliceSize = _a.sliceSize, strides = _a.strides, outputSize = _a.outputSize;
            var sumDupeIndices = false;
            return this.scatter(sparseIndices, sparseValues, outputShape, outputSize, sliceSize, numUpdates, sliceRank, strides, defaultValue, sumDupeIndices);
        };
        MathBackendCPU.prototype.gatherND = function (x, indices) {
            var indicesShape = indices.shape;
            var sliceRank = indicesShape[indicesShape.length - 1];
            var _a = prepareAndValidate(x, indices), resultShape = _a[0], numSlices = _a[1], sliceSize = _a[2], strides = _a[3];
            if (numSlices === 0) {
                return tensor([], resultShape, x.dtype);
            }
            var buffer$$1 = new TensorBuffer([numSlices, sliceSize], x.dtype);
            var indicesData = indices.dataSync();
            var xData = x.dataSync();
            for (var i = 0; i < numSlices; i++) {
                var index = [];
                var flattenIndex = 0;
                for (var j = 0; j < sliceRank; j++) {
                    var dim = indicesData[i * sliceRank + j];
                    flattenIndex += dim * strides[j];
                    index.push(dim);
                }
                if (flattenIndex < 0 || flattenIndex >= x.size / sliceSize) {
                    throw new Error("Invalid indices: " + index + " does not index into " + x.shape);
                }
                for (var k = 0; k < sliceSize; k++) {
                    buffer$$1.values[i * sliceSize + k] = xData[flattenIndex * sliceSize + k];
                }
            }
            return buffer$$1.toTensor().reshape(resultShape);
        };
        MathBackendCPU.prototype.scatterND = function (indices, updates, shape) {
            var _a = calculateShapes(updates, indices, shape), sliceRank = _a.sliceRank, numUpdates = _a.numUpdates, sliceSize = _a.sliceSize, strides = _a.strides, outputSize = _a.outputSize;
            var defaultValue = scalar(0);
            var sumDupeIndices = true;
            return this.scatter(indices, updates, shape, outputSize, sliceSize, numUpdates, sliceRank, strides, defaultValue, sumDupeIndices);
        };
        MathBackendCPU.prototype.scatter = function (indices, updates, shape, outputSize, sliceSize, numUpdates, sliceRank, strides, defaultValue, sumDupeIndices) {
            var flattenShape = [outputSize / sliceSize, sliceSize];
            var indicesData = indices.dataSync();
            var updatesData = updates.dataSync();
            if (outputSize === 0) {
                return tensor([], shape, updates.dtype);
            }
            var buffer$$1 = new TensorBuffer(flattenShape, updates.dtype);
            buffer$$1.values.fill(defaultValue.dataSync()[0]);
            for (var i = 0; i < numUpdates; i++) {
                var index = [];
                var flattenIndex = 0;
                for (var j = 0; j < sliceRank; j++) {
                    var dim = indicesData[i * sliceRank + j];
                    index.push(dim);
                    flattenIndex += dim * strides[j];
                }
                if (flattenIndex < 0 || flattenIndex >= outputSize / sliceSize) {
                    throw new Error("Invalid indices: " + index + " does not index into " + shape);
                }
                for (var k = 0; k < sliceSize; k++) {
                    if (sumDupeIndices) {
                        buffer$$1.values[flattenIndex * sliceSize + k] +=
                            updatesData[i * sliceSize + k];
                    }
                    else {
                        buffer$$1.values[flattenIndex * sliceSize + k] = updates.rank === 0 ?
                            updatesData[0] :
                            updatesData[i * sliceSize + k];
                    }
                }
            }
            return buffer$$1.toTensor().reshape(shape);
        };
        return MathBackendCPU;
    }());
    ENV.registerBackend('cpu', function () { return new MathBackendCPU(); }, 1, setTensorTracker);

    var delayCallback = typeof requestAnimationFrame !== 'undefined' ?
        requestAnimationFrame :
        setImmediate;
    function nextFrame() {
        return new Promise(function (resolve) { return delayCallback(function () { return resolve(); }); });
    }

    var DTYPE_VALUE_SIZE_MAP = {
        'float32': 4,
        'int32': 4,
        'uint16': 2,
        'uint8': 1,
        'bool': 1,
    };

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
    function decodeWeights(buffer, specs) {
        var out = {};
        var offset = 0;
        var _loop_1 = function (spec) {
            var name_2 = spec.name;
            var dtype = spec.dtype;
            var shape = spec.shape;
            var size = sizeFromShape(shape);
            var typedArray = void 0;
            if ('quantization' in spec) {
                var quantization_1 = spec.quantization;
                if (quantization_1.dtype !== 'uint8' && quantization_1.dtype !== 'uint16') {
                    throw new Error("Weight " + spec.name + " has unknown " +
                        ("quantization dtype " + quantization_1.dtype + ". ") +
                        "Supported quantization dtypes are: 'uint8' and 'uint16'.");
                }
                var quantizationSizeFactor = DTYPE_VALUE_SIZE_MAP[quantization_1.dtype];
                var byteBuffer = buffer.slice(offset, offset + size * quantizationSizeFactor);
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
                    throw new Error("Unsupported dtype in weight '" + name_2 + "': " + dtype);
                }
                offset += size * quantizationSizeFactor;
            }
            else {
                var dtypeFactor = DTYPE_VALUE_SIZE_MAP[dtype];
                var byteBuffer = buffer.slice(offset, offset + size * dtypeFactor);
                if (dtype === 'float32') {
                    typedArray = new Float32Array(byteBuffer);
                }
                else if (dtype === 'int32') {
                    typedArray = new Int32Array(byteBuffer);
                }
                else if (dtype === 'bool') {
                    typedArray = new Uint8Array(byteBuffer);
                }
                else {
                    throw new Error("Unsupported dtype in weight '" + name_2 + "': " + dtype);
                }
                offset += size * dtypeFactor;
            }
            var value = void 0;
            if (dtype === 'float32') {
                value = tensor(typedArray, shape, 'float32');
            }
            else if (dtype === 'int32') {
                value = tensor(typedArray, shape, 'int32');
            }
            else if (dtype === 'bool') {
                value = tensor(typedArray, shape, 'bool');
            }
            else {
                throw new Error("Unsupported dtype in weight '" + name_2 + "': " + dtype);
            }
            out[name_2] = value;
        };
        for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
            var spec = specs_1[_i];
            _loop_1(spec);
        }
        return out;
    }
    function concatenateTypedArrays(xs) {
        if (xs === null) {
            throw new Error("Invalid input value: " + JSON.stringify(xs));
        }
        var totalByteLength = 0;
        var normalizedXs = [];
        xs.forEach(function (x) {
            totalByteLength += x.byteLength;
            normalizedXs.push(x.byteLength === x.buffer.byteLength ? x :
                new x.constructor(x));
            if (!(x instanceof Float32Array || x instanceof Int32Array ||
                x instanceof Uint8Array)) {
                throw new Error("Unsupported TypedArray subtype: " + x.constructor.name);
            }
        });
        var y = new Uint8Array(totalByteLength);
        var offset = 0;
        normalizedXs.forEach(function (x) {
            y.set(new Uint8Array(x.buffer), offset);
            offset += x.byteLength;
        });
        return y.buffer;
    }
    var useNodeBuffer = typeof Buffer !== 'undefined' &&
        (typeof Blob === 'undefined' || typeof atob === 'undefined' ||
            typeof btoa === 'undefined');
    function stringByteLength(str) {
        if (useNodeBuffer) {
            return Buffer.byteLength(str);
        }
        return new Blob([str]).size;
    }
    function arrayBufferToBase64String(buffer) {
        if (useNodeBuffer) {
            return Buffer.from(buffer).toString('base64');
        }
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    }
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
    function basename(path) {
        var SEPARATOR = '/';
        path = path.trim();
        while (path.endsWith(SEPARATOR)) {
            path = path.slice(0, path.length - 1);
        }
        var items = path.split(SEPARATOR);
        return items[items.length - 1];
    }
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
    function listModels() {
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
    }
    function removeModel(url) {
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
    }
    function copyModel(sourceURL, destURL) {
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
    }
    function moveModel(sourceURL, destURL) {
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
    }

    var DATABASE_NAME = 'tensorflowjs';
    var DATABASE_VERSION = 1;
    var MODEL_STORE_NAME = 'models_store';
    var INFO_STORE_NAME = 'model_info_store';
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
    var indexedDBRouter = function (url) {
        if (!ENV.get('IS_BROWSER')) {
            return null;
        }
        else {
            if (!Array.isArray(url) && url.startsWith(BrowserIndexedDB.URL_SCHEME)) {
                return browserIndexedDB(url.slice(BrowserIndexedDB.URL_SCHEME.length));
            }
            else {
                return null;
            }
        }
    };
    IORouterRegistry.registerSaveRouter(indexedDBRouter);
    IORouterRegistry.registerLoadRouter(indexedDBRouter);
    function browserIndexedDB(modelPath) {
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
    if (ENV.get('IS_BROWSER')) {
        try {
            ModelStoreManagerRegistry.registerManager(BrowserIndexedDB.URL_SCHEME, new BrowserIndexedDBManager());
        }
        catch (err) {
        }
    }

    var PATH_SEPARATOR = '/';
    var PATH_PREFIX = 'tensorflowjs_models';
    var INFO_SUFFIX = 'info';
    var MODEL_TOPOLOGY_SUFFIX = 'model_topology';
    var WEIGHT_SPECS_SUFFIX = 'weight_specs';
    var WEIGHT_DATA_SUFFIX = 'weight_data';
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
    function maybeStripScheme$1(key) {
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
    var localStorageRouter = function (url) {
        if (!ENV.get('IS_BROWSER')) {
            return null;
        }
        else {
            if (!Array.isArray(url) &&
                url.startsWith(BrowserLocalStorage.URL_SCHEME)) {
                return browserLocalStorage(url.slice(BrowserLocalStorage.URL_SCHEME.length));
            }
            else {
                return null;
            }
        }
    };
    IORouterRegistry.registerSaveRouter(localStorageRouter);
    IORouterRegistry.registerLoadRouter(localStorageRouter);
    function browserLocalStorage(modelPath) {
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
                    path = maybeStripScheme$1(path);
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
    if (ENV.get('IS_BROWSER')) {
        try {
            ModelStoreManagerRegistry.registerManager(BrowserLocalStorage.URL_SCHEME, new BrowserLocalStorageManager());
        }
        catch (err) {
        }
    }

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
    var browserDownloadsRouter = function (url) {
        if (!ENV.get('IS_BROWSER')) {
            return null;
        }
        else {
            if (!Array.isArray(url) && url.startsWith(BrowserDownloads.URL_SCHEME)) {
                return browserDownloads(url.slice(BrowserDownloads.URL_SCHEME.length));
            }
            else {
                return null;
            }
        }
    };
    IORouterRegistry.registerSaveRouter(browserDownloadsRouter);
    function browserDownloads(fileNamePrefix) {
        if (fileNamePrefix === void 0) { fileNamePrefix = 'model'; }
        return new BrowserDownloads(fileNamePrefix);
    }
    function browserFiles(files) {
        return new BrowserFiles(files);
    }

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
                                var weightsBytes = DTYPE_VALUE_SIZE_MAP[rawDtype] *
                                    sizeFromShape(weightsEntry.shape);
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
                                var nameToTensorMap = decodeWeights(byteBuffer, [weightsEntry.manifestEntry]);
                                for (var name_1 in nameToTensorMap) {
                                    weightsTensorMap[name_1] = nameToTensorMap[name_1];
                                }
                            });
                            bufferIndexOffset += numBuffers;
                        });
                        return [2, weightsTensorMap];
                }
            });
        });
    }

    var BrowserHTTPRequest = (function () {
        function BrowserHTTPRequest(path, requestInit, weightPathPrefix) {
            this.weightPathPrefix = weightPathPrefix;
            this.DEFAULT_METHOD = 'POST';
            if (typeof fetch === 'undefined') {
                throw new Error('browserHTTPRequest is not supported outside the web browser without a fetch polyfill.');
            }
            assert(path != null && path.length > 0, 'URL path for browserHTTPRequest must not be null, undefined or ' +
                'empty.');
            if (Array.isArray(path)) {
                assert(path.length === 2, 'URL paths for browserHTTPRequest must have a length of 2, ' +
                    ("(actual length is " + path.length + ")."));
            }
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
                return __generator(this, function (_a) {
                    return [2, Array.isArray(this.path) ? this.loadBinaryModel() :
                            this.loadJSONModel()];
                });
            });
        };
        BrowserHTTPRequest.prototype.loadBinaryTopology = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4, fetch(this.path[0], this.requestInit)];
                        case 1:
                            response = _a.sent();
                            return [4, response.arrayBuffer()];
                        case 2: return [2, _a.sent()];
                        case 3:
                            error_1 = _a.sent();
                            throw new Error(this.path[0] + " not found. " + error_1);
                        case 4: return [2];
                    }
                });
            });
        };
        BrowserHTTPRequest.prototype.loadBinaryModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var graphPromise, manifestPromise, results, modelTopology, weightsManifestResponse, weightsManifest, weightSpecs, weightData, results_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            graphPromise = this.loadBinaryTopology();
                            return [4, fetch(this.path[1], this.requestInit)];
                        case 1:
                            manifestPromise = _a.sent();
                            return [4, Promise.all([graphPromise, manifestPromise])];
                        case 2:
                            results = _a.sent();
                            modelTopology = results[0], weightsManifestResponse = results[1];
                            return [4, weightsManifestResponse.json()];
                        case 3:
                            weightsManifest = _a.sent();
                            if (!(weightsManifest != null)) return [3, 5];
                            return [4, this.loadWeights(weightsManifest)];
                        case 4:
                            results_1 = _a.sent();
                            weightSpecs = results_1[0], weightData = results_1[1];
                            _a.label = 5;
                        case 5: return [2, { modelTopology: modelTopology, weightSpecs: weightSpecs, weightData: weightData }];
                    }
                });
            });
        };
        BrowserHTTPRequest.prototype.loadJSONModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var modelConfigRequest, modelConfig, modelTopology, weightsManifest, weightSpecs, weightData, weightsManifest_1, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fetch(this.path, this.requestInit)];
                        case 1:
                            modelConfigRequest = _a.sent();
                            return [4, modelConfigRequest.json()];
                        case 2:
                            modelConfig = _a.sent();
                            modelTopology = modelConfig['modelTopology'];
                            weightsManifest = modelConfig['weightsManifest'];
                            if (modelTopology == null && weightsManifest == null) {
                                throw new Error("The JSON from HTTP path " + this.path + " contains neither model " +
                                    "topology or manifest for weights.");
                            }
                            if (!(weightsManifest != null)) return [3, 4];
                            weightsManifest_1 = modelConfig['weightsManifest'];
                            return [4, this.loadWeights(weightsManifest_1)];
                        case 3:
                            results = _a.sent();
                            weightSpecs = results[0], weightData = results[1];
                            _a.label = 4;
                        case 4: return [2, { modelTopology: modelTopology, weightSpecs: weightSpecs, weightData: weightData }];
                    }
                });
            });
        };
        BrowserHTTPRequest.prototype.loadWeights = function (weightsManifest) {
            return __awaiter(this, void 0, void 0, function () {
                var pathPrefix, weightPath, weightSpecs, _i, weightsManifest_2, entry, fetchURLs, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            pathPrefix = this.weightPathPrefix;
                            if (pathPrefix == null) {
                                weightPath = Array.isArray(this.path) ? this.path[1] : this.path;
                                pathPrefix = weightPath.substring(0, weightPath.lastIndexOf('/'));
                                if (!pathPrefix.endsWith('/')) {
                                    pathPrefix = pathPrefix + '/';
                                }
                            }
                            weightSpecs = [];
                            for (_i = 0, weightsManifest_2 = weightsManifest; _i < weightsManifest_2.length; _i++) {
                                entry = weightsManifest_2[_i];
                                weightSpecs.push.apply(weightSpecs, entry.weights);
                            }
                            fetchURLs = [];
                            weightsManifest.forEach(function (weightsGroup) {
                                weightsGroup.paths.forEach(function (path) {
                                    fetchURLs.push(pathPrefix + path);
                                });
                            });
                            _a = [weightSpecs];
                            _b = concatenateArrayBuffers;
                            return [4, loadWeightsAsArrayBuffer(fetchURLs, this.requestInit)];
                        case 1: return [2, _a.concat([
                                _b.apply(void 0, [_c.sent()])
                            ])];
                    }
                });
            });
        };
        BrowserHTTPRequest.URL_SCHEME_REGEX = /^https?:\/\//;
        return BrowserHTTPRequest;
    }());
    function isHTTPScheme(url) {
        return url.match(BrowserHTTPRequest.URL_SCHEME_REGEX) != null;
    }
    var httpRequestRouter = function (url) {
        if (typeof fetch === 'undefined') {
            return null;
        }
        else {
            var isHTTP = true;
            if (Array.isArray(url)) {
                isHTTP = url.every(function (urlItem) { return isHTTPScheme(urlItem); });
            }
            else {
                isHTTP = isHTTPScheme(url);
            }
            if (isHTTP) {
                return browserHTTPRequest(url);
            }
        }
        return null;
    };
    IORouterRegistry.registerSaveRouter(httpRequestRouter);
    IORouterRegistry.registerLoadRouter(httpRequestRouter);
    function browserHTTPRequest(path, requestInit, weightPathPrefix) {
        return new BrowserHTTPRequest(path, requestInit, weightPathPrefix);
    }

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
    function withSaveHandler(saveHandler) {
        return new PassthroughSaver(saveHandler);
    }

    var registerSaveRouter = IORouterRegistry.registerSaveRouter;
    var registerLoadRouter = IORouterRegistry.registerLoadRouter;
    var getSaveHandlers = IORouterRegistry.getSaveHandlers;
    var getLoadHandlers = IORouterRegistry.getLoadHandlers;

    var io = /*#__PURE__*/Object.freeze({
        browserFiles: browserFiles,
        browserHTTPRequest: browserHTTPRequest,
        concatenateArrayBuffers: concatenateArrayBuffers,
        decodeWeights: decodeWeights,
        encodeWeights: encodeWeights,
        fromMemory: fromMemory,
        getLoadHandlers: getLoadHandlers,
        getModelArtifactsInfoForJSON: getModelArtifactsInfoForJSON,
        getSaveHandlers: getSaveHandlers,
        loadWeights: loadWeights,
        registerLoadRouter: registerLoadRouter,
        registerSaveRouter: registerSaveRouter,
        withSaveHandler: withSaveHandler,
        copyModel: copyModel,
        listModels: listModels,
        moveModel: moveModel,
        removeModel: removeModel
    });

    function confusionMatrix_(labels, predictions, numClasses) {
        var $labels = convertToTensor(labels, 'label', 'confusionMatrix', 'int32');
        var $predictions = convertToTensor(predictions, 'label', 'confusionMatrix', 'int32');
        assert(numClasses == null || numClasses > 0 && Number.isInteger(numClasses), "If provided, numClasses must be a positive integer, " +
            ("but got " + numClasses));
        assert($labels.rank === 1, "Expected the rank of labels to be 1, but got " + $labels.rank);
        assert($predictions.rank === 1, "Expected the rank of predictions to be 1, " +
            ("but got " + $predictions.rank));
        assert($labels.shape[0] === $predictions.shape[0], "Mismatch in the number of examples: " +
            ($labels.shape[0] + " vs. " + $predictions.shape[0] + ". ") +
            "Labels and predictions should have the same number of elements.");
        assert(numClasses > 0 && Number.isInteger(numClasses), "numClasses is required to be a positive integer, but got " + numClasses);
        var oneHotLabels = oneHot($labels.asType('int32'), numClasses);
        var oneHotPredictions = oneHot($predictions.asType('int32'), numClasses);
        return oneHotLabels.transpose().matMul(oneHotPredictions).asType('int32');
    }
    var confusionMatrix = op({ confusionMatrix_: confusionMatrix_ });



    var math = /*#__PURE__*/Object.freeze({
        confusionMatrix: confusionMatrix
    });

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
    function registerClass(cls) {
        assert(cls.className != null, "Class being registered does not have the static className property " +
            "defined.");
        assert(typeof cls.className === 'string', "className is required to be a string, but got type " +
            typeof cls.className);
        assert(cls.className.length > 0, "Class being registered has an empty-string as its className, which " +
            "is disallowed.");
        SerializationMap.register(cls);
    }

    var serialization = /*#__PURE__*/Object.freeze({
        Serializable: Serializable,
        SerializationMap: SerializationMap,
        registerClass: registerClass
    });

    var WEBGL_ENVS = {
        'HAS_WEBGL': true
    };
    var NODE_ENVS = {
        'IS_NODE': true
    };
    var CHROME_ENVS = {
        'IS_CHROME': true
    };
    var BROWSER_ENVS = {
        'IS_BROWSER': true
    };
    var CPU_ENVS = {
        'HAS_WEBGL': false
    };
    var BROWSER_CPU_ENVS = {
        'BACKEND': 'test-cpu'
    };
    var ALL_ENVS = {};
    function expectArraysClose(actual, expected, epsilon) {
        if (epsilon == null) {
            epsilon = ENV.get('TEST_EPSILON');
        }
        if (!(actual instanceof Tensor) && !(expected instanceof Tensor)) {
            var aType = actual.constructor.name;
            var bType = expected.constructor.name;
            if (aType !== bType) {
                throw new Error("Arrays are of different type actual: " + aType + " " +
                    ("vs expected: " + bType));
            }
        }
        else if (actual instanceof Tensor && expected instanceof Tensor) {
            if (actual.dtype !== expected.dtype) {
                throw new Error("Arrays are of different type actual: " + actual.dtype + " " +
                    ("vs expected: " + expected.dtype + "."));
            }
            if (!arraysEqual(actual.shape, expected.shape)) {
                throw new Error("Arrays are of different shape actual: " + actual.shape + " " +
                    ("vs expected: " + expected.shape + "."));
            }
        }
        var actualValues;
        var expectedValues;
        if (actual instanceof Tensor) {
            actualValues = actual.dataSync();
        }
        else {
            actualValues = actual;
        }
        if (expected instanceof Tensor) {
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
    function expectPromiseToFail(fn, done) {
        fn().then(function () { return done.fail(); }, function () { return done(); });
    }
    function expectArraysEqual(actual, expected) {
        return expectArraysClose(actual, expected, 0);
    }
    function expectNumbersClose(a, e, epsilon) {
        if (epsilon == null) {
            epsilon = ENV.get('TEST_EPSILON');
        }
        if (!areClose(a, e, epsilon)) {
            throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
        }
    }
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
        if (actual instanceof Tensor) {
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
    function expectArrayBuffersEqual(actual, expected) {
        expect(new Float32Array(actual)).toEqual(new Float32Array(expected));
    }

    var test_util = /*#__PURE__*/Object.freeze({
        WEBGL_ENVS: WEBGL_ENVS,
        NODE_ENVS: NODE_ENVS,
        CHROME_ENVS: CHROME_ENVS,
        BROWSER_ENVS: BROWSER_ENVS,
        CPU_ENVS: CPU_ENVS,
        BROWSER_CPU_ENVS: BROWSER_CPU_ENVS,
        ALL_ENVS: ALL_ENVS,
        expectArraysClose: expectArraysClose,
        expectPromiseToFail: expectPromiseToFail,
        expectArraysEqual: expectArraysEqual,
        expectNumbersClose: expectNumbersClose,
        expectValuesInRange: expectValuesInRange,
        expectArrayBuffersEqual: expectArrayBuffersEqual
    });

    var version = '0.13.8';



    var webgl = /*#__PURE__*/Object.freeze({
        gpgpu_util: gpgpu_util,
        webgl_util: webgl_util,
        MathBackendWebGL: MathBackendWebGL,
        GPGPUContext: GPGPUContext
    });

    var Optimizer = (function (_super) {
        __extends(Optimizer, _super);
        function Optimizer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Optimizer.prototype.minimize = function (f, returnCost, varList) {
            if (returnCost === void 0) { returnCost = false; }
            var _a = this.computeGradients(f, varList), value = _a.value, grads$$1 = _a.grads;
            this.applyGradients(grads$$1);
            var varNames = Object.keys(grads$$1);
            varNames.forEach(function (varName) { return grads$$1[varName].dispose(); });
            if (returnCost) {
                return value;
            }
            else {
                value.dispose();
                return null;
            }
        };
        Optimizer.prototype.computeGradients = function (f, varList) {
            return variableGrads(f, varList);
        };
        return Optimizer;
    }(Serializable));

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
            _this.c = keep(scalar(-learningRate));
            _this.rhoScalar = keep(scalar(rho));
            _this.oneMinusRho = keep(scalar(1 - rho));
            if (epsilon === null) {
                epsilon = ENV.get('EPSILON');
            }
            _this.epsilonScalar = keep(scalar(epsilon));
            return _this;
        }
        AdadeltaOptimizer.prototype.applyGradients = function (variableGradients) {
            var _this = this;
            var _loop_1 = function (variableName) {
                var value = ENV.engine.registeredVariables[variableName];
                if (this_1.accumulatedGrads[variableName] == null) {
                    var trainable_1 = false;
                    tidy(function () {
                        _this.accumulatedGrads[variableName] =
                            zerosLike(value).variable(trainable_1);
                    });
                }
                if (this_1.accumulatedUpdates[variableName] == null) {
                    var trainable_2 = false;
                    tidy(function () {
                        _this.accumulatedUpdates[variableName] =
                            zerosLike(value).variable(trainable_2);
                    });
                }
                var gradient = variableGradients[variableName];
                var accumulatedGrad = this_1.accumulatedGrads[variableName];
                var accumulatedUpdate = this_1.accumulatedUpdates[variableName];
                tidy(function () {
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
    }(Optimizer));
    registerClass(AdadeltaOptimizer);

    var AdagradOptimizer = (function (_super) {
        __extends(AdagradOptimizer, _super);
        function AdagradOptimizer(learningRate, initialAccumulatorValue) {
            if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
            var _this = _super.call(this) || this;
            _this.learningRate = learningRate;
            _this.initialAccumulatorValue = initialAccumulatorValue;
            _this.accumulatedGrads = {};
            _this.c = keep(scalar(-learningRate));
            _this.epsilon = keep(scalar(ENV.get('EPSILON')));
            return _this;
        }
        AdagradOptimizer.prototype.applyGradients = function (variableGradients) {
            var _this = this;
            var _loop_1 = function (variableName) {
                var value = ENV.engine.registeredVariables[variableName];
                if (this_1.accumulatedGrads[variableName] == null) {
                    var trainable_1 = false;
                    tidy(function () {
                        _this.accumulatedGrads[variableName] =
                            fill(value.shape, _this.initialAccumulatorValue)
                                .variable(trainable_1);
                    });
                }
                var gradient = variableGradients[variableName];
                var accumulatedGrad = this_1.accumulatedGrads[variableName];
                tidy(function () {
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
    }(Optimizer));
    registerClass(AdagradOptimizer);

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
            _this.c = keep(scalar(-learningRate));
            _this.beta1Scalar = keep(scalar(beta1));
            _this.beta2Scalar = keep(scalar(beta2));
            tidy(function () {
                _this.accBeta1 = scalar(beta1).variable();
                _this.accBeta2 = scalar(beta2).variable();
            });
            _this.oneMinusBeta1 = keep(scalar(1 - beta1));
            _this.oneMinusBeta2 = keep(scalar(1 - beta2));
            _this.one = keep(scalar(1));
            if (epsilon === null) {
                epsilon = ENV.get('EPSILON');
            }
            _this.epsScalar = keep(scalar(epsilon));
            return _this;
        }
        AdamOptimizer.prototype.applyGradients = function (variableGradients) {
            var _this = this;
            tidy(function () {
                var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
                var oneMinusAccBeta2 = _this.one.sub(_this.accBeta2);
                for (var variableName in variableGradients) {
                    var value = ENV.engine.registeredVariables[variableName];
                    if (_this.accumulatedFirstMoment[variableName] == null) {
                        var trainable = false;
                        _this.accumulatedFirstMoment[variableName] =
                            zerosLike(value).variable(trainable);
                    }
                    if (_this.accumulatedSecondMoment[variableName] == null) {
                        var trainable = false;
                        _this.accumulatedSecondMoment[variableName] =
                            zerosLike(value).variable(trainable);
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
    }(Optimizer));
    registerClass(AdamOptimizer);

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
            _this.c = keep(scalar(-learningRate));
            _this.beta1Scalar = keep(scalar(beta1));
            _this.beta2Scalar = keep(scalar(beta2));
            _this.decayScalar = keep(scalar(decay));
            tidy(function () {
                _this.iteration = scalar(0).variable();
                _this.accBeta1 = scalar(beta1).variable();
            });
            _this.oneMinusBeta1 = keep(scalar(1 - beta1));
            _this.one = keep(scalar(1));
            if (epsilon === null) {
                epsilon = ENV.get('EPSILON');
            }
            _this.epsScalar = keep(scalar(epsilon));
            return _this;
        }
        AdamaxOptimizer.prototype.applyGradients = function (variableGradients) {
            var _this = this;
            tidy(function () {
                var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
                var lr = _this.c.div(_this.one.add(_this.decayScalar.mul(_this.iteration)));
                for (var variableName in variableGradients) {
                    var value = ENV.engine.registeredVariables[variableName];
                    if (_this.accumulatedFirstMoment[variableName] == null) {
                        var trainable = false;
                        _this.accumulatedFirstMoment[variableName] =
                            zerosLike(value).variable(trainable);
                    }
                    if (_this.accumulatedWeightedInfNorm[variableName] == null) {
                        var trainable = false;
                        _this.accumulatedWeightedInfNorm[variableName] =
                            zerosLike(value).variable(trainable);
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
    }(Optimizer));
    registerClass(AdamaxOptimizer);

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
                var value = ENV.engine.registeredVariables[varName];
                tidy(function () {
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
            this.c = keep(scalar(-learningRate));
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
    }(Optimizer));
    registerClass(SGDOptimizer);

    var MomentumOptimizer = (function (_super) {
        __extends(MomentumOptimizer, _super);
        function MomentumOptimizer(learningRate, momentum, useNesterov) {
            if (useNesterov === void 0) { useNesterov = false; }
            var _this = _super.call(this, learningRate) || this;
            _this.learningRate = learningRate;
            _this.momentum = momentum;
            _this.useNesterov = useNesterov;
            _this.m = scalar(_this.momentum);
            _this.accumulations = {};
            return _this;
        }
        MomentumOptimizer.prototype.applyGradients = function (variableGradients) {
            var _this = this;
            var _loop_1 = function (variableName) {
                var value = ENV.engine.registeredVariables[variableName];
                if (this_1.accumulations[variableName] == null) {
                    var trainable_1 = false;
                    tidy(function () {
                        _this.accumulations[variableName] =
                            zerosLike(value).variable(trainable_1);
                    });
                }
                var accumulation = this_1.accumulations[variableName];
                var gradient = variableGradients[variableName];
                tidy(function () {
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
    }(SGDOptimizer));
    registerClass(MomentumOptimizer);

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
            _this.c = keep(scalar(learningRate));
            _this.decayScalar = keep(scalar(decay));
            _this.momentumScalar = keep(scalar(momentum));
            _this.oneMinusDecay = keep(scalar(1 - decay));
            _this.centered = centered;
            if (epsilon === null) {
                epsilon = ENV.get('EPSILON');
            }
            _this.epsilonScalar = keep(scalar(epsilon));
            return _this;
        }
        RMSPropOptimizer.prototype.applyGradients = function (variableGradients) {
            var _this = this;
            var _loop_1 = function (variableName) {
                var value = ENV.engine.registeredVariables[variableName];
                if (this_1.accumulatedMeanSquares[variableName] == null) {
                    var trainable_1 = false;
                    tidy(function () {
                        _this.accumulatedMeanSquares[variableName] =
                            zerosLike(value).variable(trainable_1);
                    });
                }
                if (this_1.accumulatedMeanGrads[variableName] == null && this_1.centered) {
                    var trainable_2 = false;
                    tidy(function () {
                        _this.accumulatedMeanGrads[variableName] =
                            zerosLike(value).variable(trainable_2);
                    });
                }
                if (this_1.accumulatedMoments[variableName] == null) {
                    var trainable_3 = false;
                    tidy(function () {
                        _this.accumulatedMoments[variableName] =
                            zerosLike(value).variable(trainable_3);
                    });
                }
                var accumulatedMeanSquare = this_1.accumulatedMeanSquares[variableName];
                var accumulatedMeanGrad = this_1.accumulatedMeanGrads[variableName];
                var accumulatedMoments = this_1.accumulatedMoments[variableName];
                var gradient = variableGradients[variableName];
                tidy(function () {
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
    }(Optimizer));
    registerClass(RMSPropOptimizer);

    var OptimizerConstructors = (function () {
        function OptimizerConstructors() {
        }
        OptimizerConstructors.sgd = function (learningRate) {
            return new SGDOptimizer(learningRate);
        };
        OptimizerConstructors.momentum = function (learningRate, momentum, useNesterov) {
            if (useNesterov === void 0) { useNesterov = false; }
            return new MomentumOptimizer(learningRate, momentum, useNesterov);
        };
        OptimizerConstructors.rmsprop = function (learningRate, decay, momentum, epsilon, centered) {
            if (decay === void 0) { decay = .9; }
            if (momentum === void 0) { momentum = 0.0; }
            if (epsilon === void 0) { epsilon = null; }
            if (centered === void 0) { centered = false; }
            return new RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered);
        };
        OptimizerConstructors.adam = function (learningRate, beta1, beta2, epsilon) {
            if (learningRate === void 0) { learningRate = 0.001; }
            if (beta1 === void 0) { beta1 = 0.9; }
            if (beta2 === void 0) { beta2 = 0.999; }
            if (epsilon === void 0) { epsilon = null; }
            return new AdamOptimizer(learningRate, beta1, beta2, epsilon);
        };
        OptimizerConstructors.adadelta = function (learningRate, rho, epsilon) {
            if (learningRate === void 0) { learningRate = .001; }
            if (rho === void 0) { rho = .95; }
            if (epsilon === void 0) { epsilon = null; }
            return new AdadeltaOptimizer(learningRate, rho, epsilon);
        };
        OptimizerConstructors.adamax = function (learningRate, beta1, beta2, epsilon, decay) {
            if (learningRate === void 0) { learningRate = 0.002; }
            if (beta1 === void 0) { beta1 = 0.9; }
            if (beta2 === void 0) { beta2 = 0.999; }
            if (epsilon === void 0) { epsilon = null; }
            if (decay === void 0) { decay = 0.0; }
            return new AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay);
        };
        OptimizerConstructors.adagrad = function (learningRate, initialAccumulatorValue) {
            if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
            return new AdagradOptimizer(learningRate, initialAccumulatorValue);
        };
        return OptimizerConstructors;
    }());

    var train = {
        sgd: OptimizerConstructors.sgd,
        momentum: OptimizerConstructors.momentum,
        adadelta: OptimizerConstructors.adadelta,
        adagrad: OptimizerConstructors.adagrad,
        rmsprop: OptimizerConstructors.rmsprop,
        adamax: OptimizerConstructors.adamax,
        adam: OptimizerConstructors.adam
    };

    var setBackend = Environment.setBackend;
    var getBackend = Environment.getBackend;
    var disposeVariables = Environment.disposeVariables;
    var memory = Environment.memory;
    setOpHandler(ops);

    exports.setBackend = setBackend;
    exports.getBackend = getBackend;
    exports.disposeVariables = disposeVariables;
    exports.memory = memory;
    exports.version_core = version;
    exports.nextFrame = nextFrame;
    exports.environment = environment;
    exports.io = io;
    exports.math = math;
    exports.serialization = serialization;
    exports.test_util = test_util;
    exports.util = util;
    exports.webgl = webgl;
    exports.AdadeltaOptimizer = AdadeltaOptimizer;
    exports.AdagradOptimizer = AdagradOptimizer;
    exports.AdamOptimizer = AdamOptimizer;
    exports.AdamaxOptimizer = AdamaxOptimizer;
    exports.MomentumOptimizer = MomentumOptimizer;
    exports.Optimizer = Optimizer;
    exports.RMSPropOptimizer = RMSPropOptimizer;
    exports.SGDOptimizer = SGDOptimizer;
    exports.Tensor = Tensor;
    exports.TensorBuffer = TensorBuffer;
    exports.variable = variable;
    exports.Variable = Variable;
    exports.ENV = ENV;
    exports.Environment = Environment;
    exports.KernelBackend = KernelBackend;
    exports.DataStorage = DataStorage;
    exports.image = image_ops;
    exports.linalg = linalg_ops;
    exports.losses = loss_ops;
    exports.spectral = spectral_ops;
    exports.op = op;
    exports.batchNormalization2d = batchNormalization2d;
    exports.batchNormalization3d = batchNormalization3d;
    exports.batchNormalization4d = batchNormalization4d;
    exports.batchNormalization = batchNormalization;
    exports.complex = complex;
    exports.real = real;
    exports.imag = imag;
    exports.concat = concat;
    exports.concat1d = concat1d;
    exports.concat2d = concat2d;
    exports.concat3d = concat3d;
    exports.concat4d = concat4d;
    exports.split = split$1;
    exports.conv1d = conv1d;
    exports.conv2d = conv2d;
    exports.conv2dDerFilter = conv2dDerFilter;
    exports.depthwiseConv2d = depthwiseConv2d;
    exports.separableConv2d = separableConv2d;
    exports.conv2dTranspose = conv2dTranspose;
    exports.matMul = matMul;
    exports.dot = dot;
    exports.outerProduct = outerProduct;
    exports.reverse = reverse;
    exports.reverse1d = reverse1d;
    exports.reverse2d = reverse2d;
    exports.reverse3d = reverse3d;
    exports.reverse4d = reverse4d;
    exports.maxPool = maxPool;
    exports.avgPool = avgPool;
    exports.pool = pool;
    exports.slice = slice;
    exports.slice1d = slice1d;
    exports.slice2d = slice2d;
    exports.slice3d = slice3d;
    exports.slice4d = slice4d;
    exports.abs = abs;
    exports.acos = acos;
    exports.acosh = acosh;
    exports.asin = asin;
    exports.asinh = asinh;
    exports.atan = atan;
    exports.atanh = atanh;
    exports.ceil = ceil;
    exports.clipByValue = clipByValue;
    exports.cos = cos;
    exports.cosh = cosh;
    exports.erf = erf;
    exports.exp = exp;
    exports.expm1 = expm1;
    exports.floor = floor;
    exports.log = log$1;
    exports.log1p = log1p;
    exports.logSigmoid = logSigmoid;
    exports.neg = neg;
    exports.reciprocal = reciprocal;
    exports.round = round;
    exports.rsqrt = rsqrt;
    exports.sigmoid = sigmoid;
    exports.sign = sign;
    exports.sin = sin;
    exports.sinh = sinh;
    exports.softplus = softplus;
    exports.sqrt = sqrt;
    exports.square = square;
    exports.step = step;
    exports.tan = tan;
    exports.tanh = tanh$1;
    exports.all = all;
    exports.any = any;
    exports.argMax = argMax;
    exports.argMin = argMin;
    exports.logSumExp = logSumExp;
    exports.max = max;
    exports.mean = mean;
    exports.min = min;
    exports.moments = moments;
    exports.sum = sum$1;
    exports.prod = prod;
    exports.equal = equal;
    exports.equalStrict = equalStrict;
    exports.greater = greater;
    exports.greaterEqual = greaterEqual;
    exports.greaterEqualStrict = greaterEqualStrict;
    exports.greaterStrict = greaterStrict;
    exports.less = less;
    exports.lessEqual = lessEqual;
    exports.lessEqualStrict = lessEqualStrict;
    exports.lessStrict = lessStrict;
    exports.notEqual = notEqual;
    exports.notEqualStrict = notEqualStrict;
    exports.add = add;
    exports.addN = addN;
    exports.addStrict = addStrict;
    exports.atan2 = atan2;
    exports.div = div;
    exports.divStrict = divStrict;
    exports.floorDiv = floorDiv;
    exports.maximum = maximum;
    exports.maximumStrict = maximumStrict;
    exports.minimum = minimum;
    exports.minimumStrict = minimumStrict;
    exports.mod = mod;
    exports.modStrict = modStrict;
    exports.mul = mul;
    exports.mulStrict = mulStrict;
    exports.pow = pow;
    exports.powStrict = powStrict;
    exports.squaredDifference = squaredDifference;
    exports.squaredDifferenceStrict = squaredDifferenceStrict;
    exports.sub = sub;
    exports.subStrict = subStrict;
    exports.elu = elu;
    exports.leakyRelu = leakyRelu;
    exports.prelu = prelu;
    exports.relu = relu;
    exports.selu = selu;
    exports.logicalAnd = logicalAnd;
    exports.logicalNot = logicalNot;
    exports.logicalOr = logicalOr;
    exports.logicalXor = logicalXor;
    exports.where = where;
    exports.whereAsync = whereAsync;
    exports.buffer = buffer;
    exports.toPixels = toPixels;
    exports.print = print;
    exports.batchToSpaceND = batchToSpaceND;
    exports.cast = cast;
    exports.clone = clone;
    exports.cumsum = cumsum;
    exports.depthToSpace = depthToSpace;
    exports.expandDims = expandDims;
    exports.eye = eye;
    exports.fromPixels = fromPixels;
    exports.multinomial = multinomial;
    exports.oneHot = oneHot;
    exports.pad = pad;
    exports.pad1d = pad1d;
    exports.pad2d = pad2d;
    exports.pad3d = pad3d;
    exports.pad4d = pad4d;
    exports.rand = rand;
    exports.randomNormal = randomNormal;
    exports.randomUniform = randomUniform;
    exports.reshape = reshape;
    exports.spaceToBatchND = spaceToBatchND;
    exports.squeeze = squeeze;
    exports.stack = stack;
    exports.tile = tile;
    exports.truncatedNormal = truncatedNormal;
    exports.unstack = unstack;
    exports.fill = fill;
    exports.linspace = linspace;
    exports.ones = ones$1;
    exports.range = range;
    exports.scalar = scalar;
    exports.tensor = tensor;
    exports.tensor1d = tensor1d;
    exports.tensor2d = tensor2d;
    exports.tensor3d = tensor3d;
    exports.tensor4d = tensor4d;
    exports.tensor5d = tensor5d;
    exports.tensor6d = tensor6d;
    exports.zeros = zeros;
    exports.onesLike = onesLike;
    exports.zerosLike = zerosLike;
    exports.transpose = transpose;
    exports.softmax = softmax;
    exports.localResponseNormalization = localResponseNormalization;
    exports.norm = norm;
    exports.gather = gather;
    exports.unsortedSegmentSum = unsortedSegmentSum;
    exports.basicLSTMCell = basicLSTMCell;
    exports.multiRNNCell = multiRNNCell;
    exports.movingAverage = movingAverage;
    exports.stridedSlice = stridedSlice;
    exports.topk = topk;
    exports.scatterND = scatterND;
    exports.fft = fft;
    exports.ifft = ifft;
    exports.rfft = rfft;
    exports.sparseToDense = sparseToDense;
    exports.gatherND = gatherND;
    exports.train = train;
    exports.tidy = tidy;
    exports.keep = keep;
    exports.dispose = dispose;
    exports.time = time;
    exports.profile = profile;
    exports.customGrad = customGrad;
    exports.grad = grad;
    exports.grads = grads;
    exports.valueAndGrad = valueAndGrad;
    exports.valueAndGrads = valueAndGrads;
    exports.variableGrads = variableGrads;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tf-core.js.map
