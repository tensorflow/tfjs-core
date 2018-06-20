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
import { doc } from './doc';
import { ENV } from './environment';
import * as ops from './ops/ops';
import * as tensor_util from './tensor_util';
import * as util from './util';
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
        this.strides = computeStrides(shape);
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
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "set", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "get", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "toTensor", null);
    TensorBuffer = __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], TensorBuffer);
    return TensorBuffer;
}());
export { TensorBuffer };
var Tensor = (function () {
    function Tensor(shape, dtype, values, dataId) {
        this.isDisposed = false;
        this.size = util.sizeFromShape(shape);
        if (values != null) {
            util.assert(this.size === values.length, "Constructing tensor of shape (" + this.size + ") should match the " +
                ("length of values (" + values.length + ")"));
        }
        this.shape = shape.slice();
        this.dtype = dtype || 'float32';
        this.strides = computeStrides(shape);
        this.dataId = dataId != null ? dataId : {};
        this.id = Tensor_1.nextId++;
        this.rankType = (this.rank < 5 ? this.rank.toString() : 'higher');
        ENV.engine.registerTensor(this);
        if (values != null) {
            ENV.engine.write(this.dataId, values);
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
        return ops.cast(this, dtype);
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
        return ops.buffer(this.shape, this.dtype, this.dataSync());
    };
    Tensor.prototype.data = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.throwIfDisposed();
                return [2, ENV.engine.read(this.dataId)];
            });
        });
    };
    Tensor.prototype.dataSync = function () {
        this.throwIfDisposed();
        return ENV.engine.readSync(this.dataId);
    };
    Tensor.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        ENV.engine.disposeTensor(this);
    };
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
        return ops.print(this, verbose);
    };
    Tensor.prototype.reshape = function (newShape) {
        this.throwIfDisposed();
        return ops.reshape(this, newShape);
    };
    Tensor.prototype.reshapeAs = function (x) {
        this.throwIfDisposed();
        return this.reshape(x.shape);
    };
    Tensor.prototype.expandDims = function (axis) {
        if (axis === void 0) { axis = 0; }
        return ops.expandDims(this, axis);
    };
    Tensor.prototype.cumsum = function (axis, exclusive, reverse) {
        if (axis === void 0) { axis = 0; }
        if (exclusive === void 0) { exclusive = false; }
        if (reverse === void 0) { reverse = false; }
        return ops.cumsum(this, axis, exclusive, reverse);
    };
    Tensor.prototype.squeeze = function (axis) {
        this.throwIfDisposed();
        return ops.squeeze(this, axis);
    };
    Tensor.prototype.clone = function () {
        this.throwIfDisposed();
        return ops.clone(this);
    };
    Tensor.prototype.toString = function (verbose) {
        if (verbose === void 0) { verbose = false; }
        return tensor_util.tensorToString(this, verbose);
    };
    Tensor.prototype.tile = function (reps) {
        this.throwIfDisposed();
        return ops.tile(this, reps);
    };
    Tensor.prototype.gather = function (indices, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return ops.gather(this, indices, axis);
    };
    Tensor.prototype.matMul = function (b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        this.throwIfDisposed();
        return ops.matMul(this, b, transposeA, transposeB);
    };
    Tensor.prototype.dot = function (b) {
        this.throwIfDisposed();
        return ops.dot(this, b);
    };
    Tensor.prototype.norm = function (ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.norm(this, ord, axis, keepDims);
    };
    Tensor.prototype.slice = function (begin, size) {
        this.throwIfDisposed();
        return ops.slice(this, begin, size);
    };
    Tensor.prototype.reverse = function (axis) {
        this.throwIfDisposed();
        return ops.reverse(this, axis);
    };
    Tensor.prototype.concat = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return ops.concat([this, x], axis);
    };
    Tensor.prototype.stack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        return ops.stack([this, x], axis);
    };
    Tensor.prototype.unstack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        return ops.unstack(this, axis);
    };
    Tensor.prototype.pad = function (paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        return ops.pad(this, paddings, constantValue);
    };
    Tensor.prototype.batchNormalization = function (mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        this.throwIfDisposed();
        return ops.batchNormalization(this, mean, variance, varianceEpsilon, scale, offset);
    };
    Tensor.prototype.logSumExp = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.logSumExp(this, axis, keepDims);
    };
    Tensor.prototype.sum = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.sum(this, axis, keepDims);
    };
    Tensor.prototype.mean = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.mean(this, axis, keepDims);
    };
    Tensor.prototype.min = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.min(this, axis, keepDims);
    };
    Tensor.prototype.max = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.max(this, axis, keepDims);
    };
    Tensor.prototype.argMin = function (axis) {
        if (axis === void 0) { axis = null; }
        this.throwIfDisposed();
        return ops.argMin(this, axis);
    };
    Tensor.prototype.argMax = function (axis) {
        if (axis === void 0) { axis = null; }
        this.throwIfDisposed();
        return ops.argMax(this, axis);
    };
    Tensor.prototype.cast = function (dtype) {
        this.throwIfDisposed();
        return ops.cast(this, dtype);
    };
    Tensor.prototype.add = function (x) {
        this.throwIfDisposed();
        return ops.add(this, x);
    };
    Tensor.prototype.addStrict = function (x) {
        this.throwIfDisposed();
        return ops.addStrict(this, x);
    };
    Tensor.prototype.sub = function (x) {
        this.throwIfDisposed();
        return ops.sub(this, x);
    };
    Tensor.prototype.subStrict = function (x) {
        this.throwIfDisposed();
        return ops.subStrict(this, x);
    };
    Tensor.prototype.pow = function (exp) {
        this.throwIfDisposed();
        return ops.pow(this, exp);
    };
    Tensor.prototype.powStrict = function (exp) {
        this.throwIfDisposed();
        return ops.powStrict(this, exp);
    };
    Tensor.prototype.mul = function (x) {
        this.throwIfDisposed();
        return ops.mul(this, x);
    };
    Tensor.prototype.mulStrict = function (x) {
        this.throwIfDisposed();
        return ops.mulStrict(this, x);
    };
    Tensor.prototype.div = function (x) {
        this.throwIfDisposed();
        return ops.div(this, x);
    };
    Tensor.prototype.divStrict = function (x) {
        this.throwIfDisposed();
        return ops.divStrict(this, x);
    };
    Tensor.prototype.minimum = function (x) {
        this.throwIfDisposed();
        return ops.minimum(this, x);
    };
    Tensor.prototype.minimumStrict = function (x) {
        this.throwIfDisposed();
        return ops.minimumStrict(this, x);
    };
    Tensor.prototype.maximum = function (x) {
        this.throwIfDisposed();
        return ops.maximum(this, x);
    };
    Tensor.prototype.maximumStrict = function (x) {
        this.throwIfDisposed();
        return ops.maximumStrict(this, x);
    };
    Tensor.prototype.mod = function (x) {
        this.throwIfDisposed();
        return ops.mod(this, x);
    };
    Tensor.prototype.modStrict = function (x) {
        this.throwIfDisposed();
        return ops.modStrict(this, x);
    };
    Tensor.prototype.squaredDifference = function (x) {
        this.throwIfDisposed();
        return ops.squaredDifference(this, x);
    };
    Tensor.prototype.squaredDifferenceStrict = function (x) {
        this.throwIfDisposed();
        return ops.squaredDifferenceStrict(this, x);
    };
    Tensor.prototype.transpose = function (perm) {
        this.throwIfDisposed();
        return ops.transpose(this, perm);
    };
    Tensor.prototype.notEqual = function (x) {
        this.throwIfDisposed();
        return ops.notEqual(this, x);
    };
    Tensor.prototype.notEqualStrict = function (x) {
        this.throwIfDisposed();
        return ops.notEqualStrict(this, x);
    };
    Tensor.prototype.less = function (x) {
        this.throwIfDisposed();
        return ops.less(this, x);
    };
    Tensor.prototype.lessStrict = function (x) {
        this.throwIfDisposed();
        return ops.lessStrict(this, x);
    };
    Tensor.prototype.equal = function (x) {
        this.throwIfDisposed();
        return ops.equal(this, x);
    };
    Tensor.prototype.equalStrict = function (x) {
        this.throwIfDisposed();
        return ops.equalStrict(this, x);
    };
    Tensor.prototype.lessEqual = function (x) {
        this.throwIfDisposed();
        return ops.lessEqual(this, x);
    };
    Tensor.prototype.lessEqualStrict = function (x) {
        this.throwIfDisposed();
        return ops.lessEqualStrict(this, x);
    };
    Tensor.prototype.greater = function (x) {
        this.throwIfDisposed();
        return ops.greater(this, x);
    };
    Tensor.prototype.greaterStrict = function (x) {
        this.throwIfDisposed();
        return ops.greaterStrict(this, x);
    };
    Tensor.prototype.greaterEqual = function (x) {
        this.throwIfDisposed();
        return ops.greaterEqual(this, x);
    };
    Tensor.prototype.greaterEqualStrict = function (x) {
        this.throwIfDisposed();
        return ops.greaterEqualStrict(this, x);
    };
    Tensor.prototype.logicalAnd = function (x) {
        this.throwIfDisposed();
        return ops.logicalAnd(this, x);
    };
    Tensor.prototype.logicalOr = function (x) {
        this.throwIfDisposed();
        return ops.logicalOr(this, x);
    };
    Tensor.prototype.logicalNot = function () {
        this.throwIfDisposed();
        return ops.logicalNot(this);
    };
    Tensor.prototype.logicalXor = function (x) {
        this.throwIfDisposed();
        return ops.logicalXor(this, x);
    };
    Tensor.prototype.where = function (condition, x) {
        this.throwIfDisposed();
        return ops.where(condition, this, x);
    };
    Tensor.prototype.neg = function () {
        this.throwIfDisposed();
        return ops.neg(this);
    };
    Tensor.prototype.ceil = function () {
        this.throwIfDisposed();
        return ops.ceil(this);
    };
    Tensor.prototype.floor = function () {
        this.throwIfDisposed();
        return ops.floor(this);
    };
    Tensor.prototype.sign = function () {
        this.throwIfDisposed();
        return ops.sign(this);
    };
    Tensor.prototype.exp = function () {
        this.throwIfDisposed();
        return ops.exp(this);
    };
    Tensor.prototype.expm1 = function () {
        this.throwIfDisposed();
        return ops.expm1(this);
    };
    Tensor.prototype.log = function () {
        this.throwIfDisposed();
        return ops.log(this);
    };
    Tensor.prototype.log1p = function () {
        this.throwIfDisposed();
        return ops.log1p(this);
    };
    Tensor.prototype.sqrt = function () {
        this.throwIfDisposed();
        return ops.sqrt(this);
    };
    Tensor.prototype.rsqrt = function () {
        this.throwIfDisposed();
        return ops.rsqrt(this);
    };
    Tensor.prototype.square = function () {
        this.throwIfDisposed();
        return ops.square(this);
    };
    Tensor.prototype.reciprocal = function () {
        this.throwIfDisposed();
        return ops.reciprocal(this);
    };
    Tensor.prototype.abs = function () {
        this.throwIfDisposed();
        return ops.abs(this);
    };
    Tensor.prototype.clipByValue = function (min, max) {
        this.throwIfDisposed();
        return ops.clipByValue(this, min, max);
    };
    Tensor.prototype.relu = function () {
        this.throwIfDisposed();
        return ops.relu(this);
    };
    Tensor.prototype.elu = function () {
        this.throwIfDisposed();
        return ops.elu(this);
    };
    Tensor.prototype.selu = function () {
        this.throwIfDisposed();
        return ops.selu(this);
    };
    Tensor.prototype.leakyRelu = function (alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        this.throwIfDisposed();
        return ops.leakyRelu(this, alpha);
    };
    Tensor.prototype.prelu = function (alpha) {
        this.throwIfDisposed();
        return ops.prelu(this, alpha);
    };
    Tensor.prototype.sigmoid = function () {
        this.throwIfDisposed();
        return ops.sigmoid(this);
    };
    Tensor.prototype.logSigmoid = function () {
        this.throwIfDisposed();
        return ops.logSigmoid(this);
    };
    Tensor.prototype.softplus = function () {
        this.throwIfDisposed();
        return ops.softplus(this);
    };
    Tensor.prototype.sin = function () {
        this.throwIfDisposed();
        return ops.sin(this);
    };
    Tensor.prototype.cos = function () {
        this.throwIfDisposed();
        return ops.cos(this);
    };
    Tensor.prototype.tan = function () {
        this.throwIfDisposed();
        return ops.tan(this);
    };
    Tensor.prototype.asin = function () {
        this.throwIfDisposed();
        return ops.asin(this);
    };
    Tensor.prototype.acos = function () {
        this.throwIfDisposed();
        return ops.acos(this);
    };
    Tensor.prototype.atan = function () {
        this.throwIfDisposed();
        return ops.atan(this);
    };
    Tensor.prototype.sinh = function () {
        this.throwIfDisposed();
        return ops.sinh(this);
    };
    Tensor.prototype.cosh = function () {
        this.throwIfDisposed();
        return ops.cosh(this);
    };
    Tensor.prototype.tanh = function () {
        this.throwIfDisposed();
        return ops.tanh(this);
    };
    Tensor.prototype.asinh = function () {
        this.throwIfDisposed();
        return ops.asinh(this);
    };
    Tensor.prototype.acosh = function () {
        this.throwIfDisposed();
        return ops.acosh(this);
    };
    Tensor.prototype.atanh = function () {
        this.throwIfDisposed();
        return ops.atanh(this);
    };
    Tensor.prototype.erf = function () {
        this.throwIfDisposed();
        return ops.erf(this);
    };
    Tensor.prototype.round = function () {
        this.throwIfDisposed();
        return ops.round(this);
    };
    Tensor.prototype.step = function (alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        this.throwIfDisposed();
        return ops.step(this, alpha);
    };
    Tensor.prototype.softmax = function (dim) {
        if (dim === void 0) { dim = -1; }
        this.throwIfDisposed();
        return ops.softmax(this, dim);
    };
    Tensor.prototype.resizeBilinear = function (newShape2D, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        this.throwIfDisposed();
        return ops.image.resizeBilinear(this, newShape2D, alignCorners);
    };
    Tensor.prototype.resizeNearestNeighbor = function (newShape2D, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        this.throwIfDisposed();
        return ops.image.resizeNearestNeighbor(this, newShape2D, alignCorners);
    };
    Tensor.prototype.conv1d = function (filter, stride, pad, dataFormat, dilation, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NWC'; }
        if (dilation === void 0) { dilation = 1; }
        this.throwIfDisposed();
        return ops.conv1d(this, filter, stride, pad, dataFormat, dilation, dimRoundingMode);
    };
    Tensor.prototype.conv2d = function (filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        this.throwIfDisposed();
        return ops.conv2d(this, filter, strides, pad, dataFormat, dilations, dimRoundingMode);
    };
    Tensor.prototype.conv2dTranspose = function (filter, outputShape, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.conv2dTranspose(this, filter, outputShape, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.depthwiseConv2D = function (filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        this.throwIfDisposed();
        return ops.depthwiseConv2d(this, filter, strides, pad, dataFormat, dilations, dimRoundingMode);
    };
    Tensor.prototype.avgPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.avgPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.maxPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.maxPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.localResponseNormalization = function (radius, bias, alpha, beta) {
        if (radius === void 0) { radius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        return ops.localResponseNormalization(this, radius, bias, alpha, beta);
    };
    Tensor.prototype.variable = function (trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        this.throwIfDisposed();
        return Variable.variable(this, trainable, name, dtype);
    };
    Tensor.prototype.unsortedSegmentSum = function (segmentIds, numSegments, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return ops.unsortedSegmentSum(this, segmentIds, numSegments, axis);
    };
    Tensor.nextId = 0;
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "flatten", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "asScalar", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as1D", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as2D", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as3D", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as4D", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "asType", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "buffer", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "data", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "dataSync", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "dispose", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toFloat", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toInt", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toBool", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "print", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "reshape", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "reshapeAs", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "expandDims", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "cumsum", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "squeeze", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "clone", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toString", null);
    Tensor = Tensor_1 = __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor);
    return Tensor;
    var Tensor_1;
}());
export { Tensor };
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
        ENV.engine.registerVariable(_this);
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
        ENV.engine.disposeTensor(this);
        this.dataId = newValue.dataId;
        ENV.engine.registerTensor(this);
    };
    Variable.nextVarId = 0;
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Variable.prototype, "assign", null);
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Variable, "variable", null);
    Variable = Variable_1 = __decorate([
        doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Variable);
    return Variable;
    var Variable_1;
}(Tensor));
export { Variable };
var variable = Variable.variable;
export { variable };
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
//# sourceMappingURL=tensor.js.map