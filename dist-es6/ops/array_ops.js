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
import { ENV } from '../environment';
import { Tensor, TensorBuffer } from '../tensor';
import * as tensor_util from '../tensor_util';
import * as util from '../util';
import { getAxesPermutation, getInnerMostAxes, parseAxisParam } from './axis_util';
import { ConcatOps } from './concat';
import { operation } from './operation';
import { MPRandGauss } from './rand';
import { ReductionOps } from './reduction_ops';
var ArrayOps = (function () {
    function ArrayOps() {
    }
    ArrayOps.tensor = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (!util.isTypedArray(values) && !Array.isArray(values) &&
            typeof values !== 'number' && typeof values !== 'boolean') {
            throw new Error('values passed to tensor(values) must be an ' +
                'array of numbers or booleans, or a TypedArray');
        }
        var inferredShape = util.inferShape(values);
        if (shape != null && inferredShape.length !== 1) {
            util.assertShapesMatch(shape, inferredShape, "Error creating a new Tensor. " +
                ("Inferred shape (" + inferredShape + ") does not match the ") +
                ("provided shape (" + shape + "). "));
        }
        if (!util.isTypedArray(values) && !Array.isArray(values)) {
            values = [values];
        }
        shape = shape || inferredShape;
        return Tensor.make(shape, { values: toTypedArray(values, dtype) }, dtype);
    };
    ArrayOps.scalar = function (value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (util.isTypedArray(value) || Array.isArray(value)) {
            throw new Error('Error creating a new Scalar: value must be a primitive ' +
                '(number|boolean)');
        }
        return ArrayOps.tensor(value, [], dtype);
    };
    ArrayOps.tensor1d = function (values, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 1) {
            throw new Error('tensor1d() requires values to be a flat/TypedArray');
        }
        return ArrayOps.tensor(values, inferredShape, dtype);
    };
    ArrayOps.tensor2d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (shape != null && shape.length !== 2) {
            throw new Error('tensor2d() requires shape to have two numbers');
        }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 2 && inferredShape.length !== 1) {
            throw new Error('tensor2d() requires values to be number[][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor2d() requires shape to be provided when `values` ' +
                'are a flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.tensor3d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (shape != null && shape.length !== 3) {
            throw new Error('tensor3d() requires shape to have three numbers');
        }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 3 && inferredShape.length !== 1) {
            throw new Error('tensor3d() requires values to be number[][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor3d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.tensor4d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (shape != null && shape.length !== 4) {
            throw new Error('tensor4d() requires shape to have four numbers');
        }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 4 && inferredShape.length !== 1) {
            throw new Error('tensor4d() requires values to be number[][][][] or flat/TypedArray');
        }
        if (inferredShape.length === 1 && shape == null) {
            throw new Error('tensor4d() requires shape to be provided when `values` ' +
                'are a flat array');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.ones = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeOnesTypedArray(util.sizeFromShape(shape), dtype);
        return Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.zeros = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeZerosTypedArray(util.sizeFromShape(shape), dtype);
        return Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.fill = function (shape, value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util.getTypedArrayFromDType(dtype, util.sizeFromShape(shape));
        values.fill(value);
        return Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.onesLike = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'onesLike');
        return ArrayOps.ones($x.shape, $x.dtype);
    };
    ArrayOps.zerosLike = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'zerosLike');
        return ArrayOps.zeros($x.shape, $x.dtype);
    };
    ArrayOps.clone = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'clone');
        var der = function (dy) {
            return { $x: function () { return dy.toFloat(); } };
        };
        return ENV.engine.runKernel(function (backend) {
            return Tensor.make($x.shape, { dataId: $x.dataId }, $x.dtype);
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
        var randGauss = new MPRandGauss(mean, stdDev, dtype, false, seed);
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
        var randGauss = new MPRandGauss(mean, stdDev, dtype, true, seed);
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
        return Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.multinomial = function (logits, numSamples, seed, normalized) {
        if (normalized === void 0) { normalized = false; }
        var $logits = util.assertArgIsTensor(logits, 'logits', 'multinomial');
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
    };
    ArrayOps.oneHot = function (indices, depth, onValue, offValue) {
        if (onValue === void 0) { onValue = 1; }
        if (offValue === void 0) { offValue = 0; }
        util.assert(indices.dtype === 'int32', 'Indices must be of dtype `int32`');
        if (depth < 2) {
            throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
        }
        return ENV.engine.runKernel(function (backend) { return backend.oneHot(indices, depth, onValue, offValue); }, { indices: indices });
    };
    ArrayOps.fromPixels = function (pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        if (numChannels > 4) {
            throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
        }
        return ENV.engine.fromPixels(pixels, numChannels);
    };
    ArrayOps.toPixels = function (img, canvas) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, height, width, depth, minTensor, maxTensor, min, max, data, multiplier, bytes, i, r, g, b, a, j, ctx, imageData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(img instanceof Tensor)) {
                            throw new Error('Argument `img` in toPixels() must be a Tensor');
                        }
                        if (img.rank !== 2 && img.rank !== 3) {
                            throw new Error("toPixels only supports rank 2 or 3 tensors, got rank " + img.rank + ".");
                        }
                        _a = img.shape.slice(0, 2), height = _a[0], width = _a[1];
                        depth = img.rank === 2 ? 1 : img.shape[2];
                        if (depth > 4 || depth === 2) {
                            throw new Error("toPixels only supports depth of size " +
                                ("1, 3 or 4 but got " + depth));
                        }
                        minTensor = img.min();
                        maxTensor = img.max();
                        return [4, minTensor.data()];
                    case 1:
                        min = (_b.sent())[0];
                        return [4, maxTensor.data()];
                    case 2:
                        max = (_b.sent())[0];
                        minTensor.dispose();
                        maxTensor.dispose();
                        if (img.dtype === 'float32') {
                            if (min < 0 || max > 1) {
                                throw new Error("Tensor values for a float32 Tensor must be in the " +
                                    ("range [0 - 1] but got range [" + min + " - " + max + "]."));
                            }
                        }
                        else if (img.dtype === 'int32') {
                            if (min < 0 || max > 255) {
                                throw new Error("Tensor values for a int32 Tensor must be in the " +
                                    ("range [0 - 255] but got range [" + min + " - " + max + "]."));
                            }
                        }
                        else {
                            throw new Error("Unsupported type for toPixels: " + img.dtype + "." +
                                " Please use float32 or int32 tensors.");
                        }
                        return [4, img.data()];
                    case 3:
                        data = _b.sent();
                        multiplier = img.dtype === 'float32' ? 255 : 1;
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
                        return [2, bytes];
                }
            });
        });
    };
    ArrayOps.reshape = function (x, shape) {
        var $x = util.assertArgIsTensor(x, 'x', 'reshape');
        shape = util.inferFromImplicitShape(shape, $x.size);
        util.assert($x.size === util.sizeFromShape(shape), 'new shape and old shape must have the same number of elements.');
        var grad = function (dy) {
            return { $x: function () { return dy.reshape($x.shape); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.reshape($x, shape); }, { $x: $x }, grad);
    };
    ArrayOps.squeeze = function (x, axis) {
        var $x = util.assertArgIsTensor(x, 'x', 'squeeze');
        return ArrayOps.reshape($x, util.squeezeShape($x.shape, axis).newShape);
    };
    ArrayOps.cast = function (x, dtype) {
        var $x = util.assertArgIsTensor(x, 'x', 'cast');
        var grad = function (dy) {
            return { $x: function () { return dy.clone(); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.cast($x, dtype); }, { $x: $x }, grad);
    };
    ArrayOps.tile = function (x, reps) {
        var $x = util.assertArgIsTensor(x, 'x', 'tile');
        util.assert($x.rank === reps.length, "Error in transpose: rank of input " + $x.rank + " " +
            ("must match length of reps " + reps + "."));
        var grad = function (dy) {
            var derX = function () {
                var xGrad = ArrayOps.zerosLike($x);
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
    };
    ArrayOps.gather = function (x, indices, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = util.assertArgIsTensor(x, 'x', 'gather');
        var $indices = util.assertArgIsTensor(indices, 'indices', 'gather', 'int32');
        util.assert($indices.dtype === 'int32', 'Indices must be of dtype `int32`');
        axis = parseAxisParam(axis, $x.shape)[0];
        var grad = function (dy) {
            var derX = function () {
                return ReductionOps.unsortedSegmentSum(dy, $indices, $x.shape[axis], axis);
            };
            return { $x: derX };
        };
        return ENV.engine.runKernel(function (backend) { return backend.gather($x, $indices, axis); }, { $x: $x }, grad);
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
        var $x = util.assertArgIsTensor(x, 'x', 'pad');
        if ($x.rank === 0) {
            throw new Error('pad(scalar) is not defined. Pass non-scalar to pad');
        }
        var begin = paddings.map(function (p) { return p[0]; });
        var grad = function (dy) {
            return { $x: function () { return dy.slice(begin, $x.shape); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.pad($x, paddings, constantValue); }, { $x: $x }, grad);
    };
    ArrayOps.stack = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        var $tensors = util.assertArgIsTensorArr(tensors, 'tensors', 'stack');
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
        return ConcatOps.concat(expandedTensors, axis);
    };
    ArrayOps.unstack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = util.assertArgIsTensor(x, 'x', 'unstack');
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
        var $x = util.assertArgIsTensor(x, 'x', 'split');
        axis = parseAxisParam(axis, $x.shape)[0];
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
        var $x = util.assertArgIsTensor(x, 'x', 'cumsum');
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
    };
    ArrayOps.expandDims = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        var $x = util.assertArgIsTensor(x, 'x', 'expandDims');
        util.assert(axis <= $x.rank, 'Axis must be <= rank of the tensor');
        var newShape = $x.shape.slice();
        newShape.splice(axis, 0, 1);
        return ArrayOps.reshape($x, newShape);
    };
    ArrayOps.linspace = function (start, stop, num) {
        if (num === 0) {
            throw new Error('Cannot request zero samples');
        }
        var step = (stop - start) / (num - 1);
        var values = makeZerosTypedArray(num, 'float32');
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return ArrayOps.tensor1d(values, 'float32');
    };
    ArrayOps.range = function (start, stop, step, dtype) {
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
            return ArrayOps.zeros([0], dtype);
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
        return ArrayOps.tensor1d(values, dtype);
    };
    ArrayOps.buffer = function (shape, dtype, values) {
        if (dtype === void 0) { dtype = 'float32'; }
        return new TensorBuffer(shape, dtype, values);
    };
    ArrayOps.print = function (x, verbose) {
        if (verbose === void 0) { verbose = false; }
        console.log(tensor_util.tensorToString(x, verbose));
    };
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "scalar", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor1d", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor2d", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor3d", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor4d", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "ones", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "zeros", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "fill", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "onesLike", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "zerosLike", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "clone", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "eye", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "randomNormal", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "truncatedNormal", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "randomUniform", null);
    __decorate([
        operation
    ], ArrayOps, "rand", null);
    __decorate([
        operation
    ], ArrayOps, "multinomial", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "oneHot", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation
    ], ArrayOps, "fromPixels", null);
    __decorate([
        doc({ heading: 'Visualization' })
    ], ArrayOps, "toPixels", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation
    ], ArrayOps, "reshape", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "squeeze", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation
    ], ArrayOps, "cast", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], ArrayOps, "tile", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], ArrayOps, "gather", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation
    ], ArrayOps, "pad", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], ArrayOps, "stack", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], ArrayOps, "unstack", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], ArrayOps, "split", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Scan' })
    ], ArrayOps, "cumsum", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation
    ], ArrayOps, "expandDims", null);
    __decorate([
        operation,
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "linspace", null);
    __decorate([
        operation,
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "range", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "buffer", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "print", null);
    return ArrayOps;
}());
export { ArrayOps };
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
        throw new Error("Unknown data type $ {dtype}");
    }
}
function makeOnesTypedArray(size, dtype) {
    var array = makeZerosTypedArray(size, dtype);
    for (var i = 0; i < array.length; i++) {
        array[i] = 1;
    }
    return array;
}
function toTypedArray(a, dtype) {
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (Array.isArray(a)) {
        a = util.flatten(a);
    }
    return util.copyTypedArray(a, dtype);
}
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}
//# sourceMappingURL=array_ops.js.map