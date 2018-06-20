var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import { upcastType } from '../types';
import * as util from '../util';
import * as broadcast_util from './broadcast_util';
import { operation } from './operation';
import { neg, scalar } from './ops';
var BinaryOps = (function () {
    function BinaryOps() {
    }
    BinaryOps.add = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'add');
        var $b = util.assertArgIsTensor(b, 'b', 'add');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.add($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.addStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
        return a.add(b);
    };
    BinaryOps.sub = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'sub');
        var $b = util.assertArgIsTensor(b, 'b', 'sub');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.subtract($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.subStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
        return a.sub(b);
    };
    BinaryOps.pow = function (base, exp) {
        var $base = util.assertArgIsTensor(base, 'base', 'pow');
        var $exp = util.assertArgIsTensor(exp, 'exp', 'pow');
        var outShape = broadcast_util.assertAndGetBroadcastShape($base.shape, $exp.shape);
        base = $base.cast(upcastType($base.dtype, $exp.dtype));
        exp = $exp.cast(upcastType($base.dtype, $exp.dtype));
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
        return ENV.engine.runKernel(function (backend, save) { return save(backend.pow($base, $exp)); }, { $base: $base, $exp: $exp }, grad);
    };
    BinaryOps.powStrict = function (base, exp) {
        util.assertShapesMatch(base.shape, exp.shape, 'Error in powStrict: ');
        return base.pow(exp);
    };
    BinaryOps.mul = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'mul');
        var $b = util.assertArgIsTensor(b, 'b', 'mul');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.multiply($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.mulStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
        return a.mul(b);
    };
    BinaryOps.div = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'div');
        var $b = util.assertArgIsTensor(b, 'b', 'div');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.divide($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.divStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
        return a.div(b);
    };
    BinaryOps.mod = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'mod');
        var $b = util.assertArgIsTensor(b, 'b', 'mod');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.mod($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.modStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in modStrict: ');
        return a.mod(b);
    };
    BinaryOps.minimum = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'minimum');
        var $b = util.assertArgIsTensor(b, 'b', 'minimum');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.minimum($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.minimumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.minimum(b);
    };
    BinaryOps.maximum = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'maximum');
        var $b = util.assertArgIsTensor(b, 'b', 'maximum');
        util.assertTypesMatch($a, $b);
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
        return ENV.engine.runKernel(function (backend) { return backend.maximum($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.maximumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.maximum(b);
    };
    BinaryOps.squaredDifference = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'squaredDifference');
        var $b = util.assertArgIsTensor(b, 'b', 'squaredDifference');
        util.assertTypesMatch($a, $b);
        broadcast_util.assertAndGetBroadcastShape($a.shape, $b.shape);
        var der = function (dy) {
            var two = scalar(2);
            var derA = function () { return dy.mul($a.sub($b).mul(two)); };
            var derB = function () { return dy.mul($b.sub($a).mul(two)); };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.squaredDifference($a, $b); }, { $a: $a, $b: $b }, der);
    };
    BinaryOps.squaredDifferenceStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in squaredDifferenceStrict: ');
        return a.squaredDifference(b);
    };
    BinaryOps.atan2 = function (a, b) {
        var $a = util.assertArgIsTensor(a, 'a', 'atan2');
        var $b = util.assertArgIsTensor(b, 'b', 'atan2');
        util.assertTypesMatch($a, $b);
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
                var res = neg(dy.mul($a.div(d)));
                var reduceAxes = broadcast_util.getReductionAxes($b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape($b.shape);
            };
            return { $a: derA, $b: derB };
        };
        return ENV.engine.runKernel(function (backend) { return backend.atan2($a, $b); }, { $a: $a, $b: $b }, der);
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "add", null);
    __decorate([
        operation
    ], BinaryOps, "addStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "sub", null);
    __decorate([
        operation
    ], BinaryOps, "subStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "pow", null);
    __decorate([
        operation
    ], BinaryOps, "powStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "mul", null);
    __decorate([
        operation
    ], BinaryOps, "mulStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "div", null);
    __decorate([
        operation
    ], BinaryOps, "divStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "mod", null);
    __decorate([
        operation
    ], BinaryOps, "modStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "minimum", null);
    __decorate([
        operation
    ], BinaryOps, "minimumStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "maximum", null);
    __decorate([
        operation
    ], BinaryOps, "maximumStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation
    ], BinaryOps, "squaredDifference", null);
    __decorate([
        operation
    ], BinaryOps, "squaredDifferenceStrict", null);
    __decorate([
        operation
    ], BinaryOps, "atan2", null);
    return BinaryOps;
}());
export { BinaryOps };
//# sourceMappingURL=binary_ops.js.map