import { tensor } from './ops/ops';
import { Tensor } from './tensor';
export function assertArgIsTensor(x, argName, functionName, dtype) {
    if (dtype === void 0) { dtype = 'float32'; }
    dtype = dtype || 'float32';
    if (x instanceof Tensor) {
        return x;
    }
    try {
        return tensor(x, null, dtype);
    }
    catch (ex) {
        throw new Error("Argument '" + argName + "' passed to '" + functionName + "' must be a " +
            ("Tensor or TensorLike. " + ex.message));
    }
}
export function assertArgIsTensorArr(arg, argName, functionName) {
    if (!Array.isArray(arg)) {
        throw new Error("Argument " + argName + " passed to " + functionName + " must be a " +
            '`Tensor[]` or `TensorLike[]`');
    }
    var tensors = arg;
    return tensors.map(function (t, i) { return assertArgIsTensor(t, argName + "[" + i + "]", functionName); });
}
export function assertArgumentsAreTensors(args, functionName) {
    for (var argName in args) {
        assertArgIsTensor(args[argName], argName, functionName);
    }
}
export function shuffle(array) {
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
export function clamp(min, x, max) {
    return Math.max(min, Math.min(x, max));
}
export function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
export function distSquared(a, b) {
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        var diff = Number(a[i]) - Number(b[i]);
        result += diff * diff;
    }
    return result;
}
export function assert(expr, msg) {
    if (!expr) {
        throw new Error(msg);
    }
}
export function assertShapesMatch(shapeA, shapeB, errorMessagePrefix) {
    if (errorMessagePrefix === void 0) { errorMessagePrefix = ''; }
    assert(arraysEqual(shapeA, shapeB), errorMessagePrefix + (" Shapes " + shapeA + " and " + shapeB + " must match"));
}
export function assertTypesMatch(a, b) {
    assert(a.dtype === b.dtype, " The dtypes of the first(" + a.dtype + ") and" +
        (" second(" + b.dtype + ") input must match"));
}
export function flatten(arr, ret) {
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
export function inferShape(val) {
    if (isTypedArray(val)) {
        return [val.length];
    }
    if (!Array.isArray(val)) {
        return [];
    }
    var shape = [];
    while (val instanceof Array) {
        shape.push(val.length);
        val = val[0];
    }
    return shape;
}
export function sizeFromShape(shape) {
    if (shape.length === 0) {
        return 1;
    }
    var size = shape[0];
    for (var i = 1; i < shape.length; i++) {
        size *= shape[i];
    }
    return size;
}
export function isScalarShape(shape) {
    return shape.length === 0;
}
export function arraysEqual(n1, n2) {
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
export function isInt(a) {
    return a % 1 === 0;
}
export function tanh(x) {
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
export function sizeToSquarishShape(size) {
    for (var a = Math.floor(Math.sqrt(size)); a > 1; --a) {
        if (size % a === 0) {
            return [a, size / a];
        }
    }
    return [1, size];
}
export function createShuffledIndices(n) {
    var shuffledIndices = new Uint32Array(n);
    for (var i = 0; i < n; ++i) {
        shuffledIndices[i] = i;
    }
    shuffle(shuffledIndices);
    return shuffledIndices;
}
export function rightPad(a, size) {
    if (size <= a.length) {
        return a;
    }
    return a + ' '.repeat(size - a.length);
}
export function repeatedTry(checkFn, delayFn, maxCounter) {
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
        setTimeout(tryFn, 0);
    });
}
export function getQueryParams(queryString) {
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
export function inferFromImplicitShape(shape, size) {
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
export function squeezeShape(shape, axis) {
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
export function getTypedArrayFromDType(dtype, size) {
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
export function isTensorInList(tensor, tensorList) {
    for (var i = 0; i < tensorList.length; i++) {
        if (tensorList[i].id === tensor.id) {
            return true;
        }
    }
    return false;
}
export function checkForNaN(vals, dtype, name) {
    if (dtype !== 'float32') {
        return;
    }
    for (var i = 0; i < vals.length; i++) {
        if (isNaN(vals[i])) {
            throw Error("The result of the '" + name + "' has NaNs.");
        }
    }
}
export function flattenNameArrayMap(nameArrayMap, keys) {
    var xs = [];
    if (nameArrayMap instanceof Tensor) {
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
export function unflattenToNameArrayMap(keys, flatArrays) {
    if (keys.length !== flatArrays.length) {
        throw new Error("Cannot unflatten Tensor[], keys and arrays are not of same length.");
    }
    var result = {};
    for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = flatArrays[i];
    }
    return result;
}
export function hasEncodingLoss(oldType, newType) {
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
export function copyTypedArray(array, dtype) {
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
export function isTypedArray(a) {
    return a instanceof Float32Array || a instanceof Int32Array ||
        a instanceof Uint8Array;
}
export function bytesPerElement(dtype) {
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
export function isFunction(f) {
    return !!(f && f.constructor && f.call && f.apply);
}
export function extractTensorsFromContainer(result) {
    return extractTensorsFromAny(result);
}
export function extractTensorsFromAny(result) {
    if (result == null) {
        return [];
    }
    if (result instanceof Tensor) {
        return [result];
    }
    var list = [];
    var resultObj = result;
    if (!isIterable(resultObj)) {
        return [];
    }
    for (var k in resultObj) {
        var sublist = flatten(resultObj[k]).filter(function (x) { return x instanceof Tensor; });
        list.push.apply(list, sublist);
    }
    return list;
}
function isIterable(obj) {
    return Array.isArray(obj) || typeof obj === 'object';
}
//# sourceMappingURL=util.js.map