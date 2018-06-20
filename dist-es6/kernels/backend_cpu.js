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
import * as seedrandom from 'seedrandom';
import { ENV } from '../environment';
import * as axis_util from '../ops/axis_util';
import * as broadcast_util from '../ops/broadcast_util';
import * as concat_util from '../ops/concat_util';
import * as erf_util from '../ops/erf_util';
import * as ops from '../ops/ops';
import { buffer, tensor3d, tensor4d } from '../ops/ops';
import * as selu_util from '../ops/selu_util';
import { getStridedSlicedInfo } from '../ops/slice_util';
import { Tensor } from '../tensor';
import * as types from '../types';
import * as util from '../util';
import * as backend_util from './backend_util';
var MathBackendCPU = (function () {
    function MathBackendCPU() {
        this.data = new WeakMap();
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
        }
    }
    MathBackendCPU.prototype.register = function (dataId, shape, dtype) {
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
            throw new Error('MathBackendCPU.writePixels(): pixels can not be null');
        }
        var vals;
        if (pixels instanceof ImageData) {
            vals = pixels.data;
        }
        else if (pixels instanceof HTMLCanvasElement) {
            vals = pixels.getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
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
            throw new Error("pixels is of unknown type: " + pixels.constructor.name);
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
                start = performance.now();
                f();
                kernelMs = performance.now() - start;
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
        var _a = getStridedSlicedInfo(x.shape, begin, end, strides, beginMask, endMask), beginIndex = _a[0], size = _a[1];
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
    MathBackendCPU.prototype.divide = function (a, b) {
        var op;
        var outputDtype;
        if (a.dtype === 'int32' && b.dtype === 'int32') {
            outputDtype = 'int32';
            op = function (a, b) { return Math.floor(a / b); };
        }
        else {
            outputDtype = 'float32';
            op = function (a, b) { return a / b; };
        }
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
        return Tensor.make(x.shape, { values: newValues }, 'bool');
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
            var min = aVals[0];
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
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.floor = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.floor(values[i]);
        }
        return Tensor.make(x.shape, { values: newValues });
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
        return Tensor.make(x.shape, { values: newValues });
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
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.exp = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.exp(values[i]);
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.expm1 = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.expm1(values[i]);
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.log = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log(value);
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.log1p = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log1p(value);
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.sqrt = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.sqrt(value);
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.rsqrt = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = 1 / Math.sqrt(value);
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.square = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = value * value;
        }
        return Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.reciprocal = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = 1 / values[i];
        }
        return Tensor.make(x.shape, { values: newValues });
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
        return Tensor.make(x.shape, { values: resultValues });
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
        return Tensor.make(y.shape, { values: resultValues });
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
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.clip = function (x, min, max) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.min(max, Math.max(min, values[i]));
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
    MathBackendCPU.prototype.int = function (x) {
        var resultValues = new Int32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = values[i];
        }
        return Tensor.make(x.shape, { values: resultValues }, 'int32');
    };
    MathBackendCPU.prototype.sigmoid = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = 1 / (1 + Math.exp(-values[i]));
        }
        return Tensor.make(x.shape, { values: resultValues });
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
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.sin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sin(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cos(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.tan(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.asin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asin(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.acos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acos(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atan(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
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
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cosh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cosh(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tanh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = util.tanh(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.asinh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asinh(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.acosh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acosh(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atanh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atanh(values[i]);
        }
        return Tensor.make(x.shape, { values: resultValues });
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
        return Tensor.make(x.shape, { values: resultValues });
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
        return Tensor.make(x.shape, { values: resultValues });
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
        var effectiveInputSize = alignCorners ? [oldHeight - 1, oldWidth - 1] : [oldHeight, oldWidth];
        var effectiveOutputSize = alignCorners ? [newHeight - 1, newWidth - 1] : [newHeight, newWidth];
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
        return tensor4d(outValues, x.shape);
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
            res[event_3 * depth + indices.get(event_3)] = onValue;
        }
        return ops.tensor2d(res, [indices.size, depth]);
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
export { MathBackendCPU };
ENV.registerBackend('cpu', function () { return new MathBackendCPU(); }, 1);
//# sourceMappingURL=backend_cpu.js.map