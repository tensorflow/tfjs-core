var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import { operation } from './operation';
import * as ops from './ops';
import { zerosLike } from './ops';
import * as selu_util from './selu_util';
var UnaryOps = (function () {
    function UnaryOps() {
    }
    UnaryOps.neg = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'neg');
        var grad = function (dy) {
            return { $x: function () { return dy.neg(); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.neg($x); }, { $x: $x }, grad);
    };
    UnaryOps.ceil = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'ceil');
        var grad = function (dy) {
            return { $x: function () { return ops.zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.ceil($x); }, { $x: $x }, grad);
    };
    UnaryOps.floor = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'floor');
        var grad = function (dy) {
            return { $x: function () { return ops.zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.floor($x); }, { $x: $x }, grad);
    };
    UnaryOps.sign = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'sign');
        var grad = function (dy) {
            return { $x: function () { return ops.zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sign($x); }, { $x: $x }, grad);
    };
    UnaryOps.round = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'round');
        var grad = function (dy) {
            return { $x: function () { return ops.zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.round($x); }, { $x: $x }, grad);
    };
    UnaryOps.exp = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'exp');
        var bck = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return dy.mulStrict(y); } };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.exp($x)); }, { $x: $x }, bck);
    };
    UnaryOps.expm1 = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'expm1');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.exp()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.expm1($x); }, { $x: $x }, grad);
    };
    UnaryOps.log = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'log');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.toFloat()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.log($x); }, { $x: $x }, grad);
    };
    UnaryOps.log1p = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'log1p');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.add(ops.scalar(1))); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.log1p($x); }, { $x: $x }, grad);
    };
    UnaryOps.sqrt = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'sqrt');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.toFloat().sqrt().mul(ops.scalar(2))); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sqrt($x); }, { $x: $x }, grad);
    };
    UnaryOps.rsqrt = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'rsqrt');
        var grad = function (dy) {
            return {
                $x: function () { return dy.divStrict($x.pow(ops.scalar(1.5)).mul(ops.scalar(2))).neg(); }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.rsqrt($x); }, { $x: $x }, grad);
    };
    UnaryOps.square = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'square');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.toFloat().mul(ops.scalar(2))); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.square($x); }, { $x: $x }, grad);
    };
    UnaryOps.reciprocal = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'reciprocal');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.square().neg()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.reciprocal($x); }, { $x: $x }, grad);
    };
    UnaryOps.abs = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'abs');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.toFloat().step(-1)); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.abs($x); }, { $x: $x }, grad);
    };
    UnaryOps.clipByValue = function (x, clipValueMin, clipValueMax) {
        var $x = util.assertArgIsTensor(x, 'x', 'clipByValue');
        util.assert((clipValueMin <= clipValueMax), "Error in clip: min (" + clipValueMin + ") must be " +
            ("less than or equal to max (" + clipValueMax + ")."));
        var grad = function (dy) {
            return {
                $x: function () { return dy.where($x.greater(ops.scalar(clipValueMin))
                    .logicalAnd($x.less(ops.scalar(clipValueMax))), zerosLike(dy)); },
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.clip($x, clipValueMin, clipValueMax); }, { $x: $x }, grad);
    };
    UnaryOps.relu = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'relu');
        if ($x.dtype === 'bool') {
            return $x.toInt();
        }
        var grad = function (dy) {
            var stepRes = $x.step();
            return { $x: function () { return dy.mulStrict(stepRes.toFloat()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.relu($x); }, { $x: $x }, grad);
    };
    UnaryOps.elu = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'elu');
        var grad = function (dy, saved) {
            var y = saved[0];
            return {
                $x: function () {
                    return ENV.engine.runKernel(function (backend) { return backend.eluDer(dy, y); }, { dy: dy, y: y });
                }
            };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.elu($x)); }, { $x: $x }, grad);
    };
    UnaryOps.selu = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'selu');
        var grad = function (dy) {
            return {
                $x: function () {
                    var mask = $x.greater(ops.scalar(0));
                    var scaleAlpha = ops.scalar(selu_util.SELU_SCALEALPHA);
                    var scale = ops.scalar(selu_util.SELU_SCALE);
                    var greaterThanZeroDer = dy.mul(scale);
                    var lessEqualZeroDer = dy.mul(scaleAlpha).mul($x.toFloat().exp());
                    return ops.where(mask, greaterThanZeroDer, lessEqualZeroDer);
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.selu($x); }, { $x: $x }, grad);
    };
    UnaryOps.leakyRelu = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        var $x = util.assertArgIsTensor(x, 'x', 'leakyRelu');
        return ops.maximum(ops.scalar(alpha).mul($x), $x);
    };
    UnaryOps.prelu = function (x, alpha) {
        var $x = util.assertArgIsTensor(x, 'x', 'prelu');
        var $alpha = util.assertArgIsTensor(alpha, 'alpha', 'prelu');
        var zero = ops.scalar(0);
        return ops.maximum(zero, $x).add($alpha.mul(ops.minimum(zero, $x)));
    };
    UnaryOps.sigmoid = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'sigmoid');
        var grad = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return dy.mulStrict(y.mul(ops.scalar(1).sub(y))); } };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.sigmoid($x)); }, { $x: $x }, grad);
    };
    UnaryOps.logSigmoid = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'logSigmoid');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.neg().sigmoid()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.softplus($x.neg()).neg(); }, { $x: $x }, grad);
    };
    UnaryOps.softplus = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'softplus');
        var grad = function (dy) {
            return { $x: function () { return dy.mulStrict($x.sigmoid()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.softplus($x); }, { $x: $x }, grad);
    };
    UnaryOps.sin = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'sin');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().cos().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sin($x); }, { $x: $x }, grad);
    };
    UnaryOps.cos = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'cos');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().sin().neg().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.cos($x); }, { $x: $x }, grad);
    };
    UnaryOps.tan = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'tan');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict($x.cos().square()); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.tan($x); }, { $x: $x }, grad);
    };
    UnaryOps.asin = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'asin');
        var grad = function (dy) {
            return {
                $x: function () {
                    return dy.divStrict(ops.scalar(1).sub($x.toFloat().square()).sqrt());
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.asin($x); }, { $x: $x }, grad);
    };
    UnaryOps.acos = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'acos');
        var grad = function (dy) {
            return {
                $x: function () {
                    return dy.divStrict(ops.scalar(1).sub($x.toFloat().square()).sqrt())
                        .neg();
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.acos($x); }, { $x: $x }, grad);
    };
    UnaryOps.atan = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'atan');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict(ops.scalar(1).add($x.toFloat().square())); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.atan($x); }, { $x: $x }, grad);
    };
    UnaryOps.sinh = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'sinh');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().cosh().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.sinh($x); }, { $x: $x }, grad);
    };
    UnaryOps.cosh = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'cosh');
        var grad = function (dy) {
            return { $x: function () { return $x.toFloat().sinh().mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.cosh($x); }, { $x: $x }, grad);
    };
    UnaryOps.tanh = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'tanh');
        var grad = function (dy, saved) {
            var y = saved[0];
            return { $x: function () { return ops.scalar(1).sub(y.square()).mulStrict(dy); } };
        };
        return ENV.engine.runKernel(function (backend, save) { return save(backend.tanh($x)); }, { $x: $x }, grad);
    };
    UnaryOps.asinh = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'asinh');
        var grad = function (dy) {
            return {
                $x: function () {
                    return dy.divStrict(ops.scalar(1).add($x.toFloat().square()).sqrt());
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.asinh($x); }, { $x: $x }, grad);
    };
    UnaryOps.acosh = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'acosh');
        var grad = function (dy) {
            return {
                $x: function () {
                    return dy.divStrict($x.toFloat().square().sub(ops.scalar(1)).sqrt());
                }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.acosh($x); }, { $x: $x }, grad);
    };
    UnaryOps.atanh = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'atanh');
        var grad = function (dy) {
            return { $x: function () { return dy.divStrict(ops.scalar(1).sub($x.toFloat().square())); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.atanh($x); }, { $x: $x }, grad);
    };
    UnaryOps.erf = function (x) {
        var $x = util.assertArgIsTensor(x, 'x', 'erf');
        util.assert($x.dtype === 'int32' || $x.dtype === 'float32', 'Input dtype must be `int32` or `float32`.');
        if ($x.dtype === 'int32') {
            $x = $x.toFloat();
        }
        var grad = function (dy) {
            return {
                $x: function () { return dy.mulStrict(ops.scalar(2 / Math.sqrt(Math.PI)).mul($x.square().neg().exp())); }
            };
        };
        return ENV.engine.runKernel(function (backend) { return backend.erf($x); }, { $x: $x }, grad);
    };
    UnaryOps.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        var $x = util.assertArgIsTensor(x, 'x', 'step');
        var grad = function (dy) {
            return { $x: function () { return ops.zerosLike(dy); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.step($x, alpha); }, { $x: $x }, grad);
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "neg", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "ceil", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "floor", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "sign", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "round", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "exp", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "expm1", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "log", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "log1p", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "sqrt", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "rsqrt", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "square", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "reciprocal", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "abs", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "clipByValue", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "relu", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "elu", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "selu", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "leakyRelu", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "prelu", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "sigmoid", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "logSigmoid", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "softplus", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "sin", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "cos", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "tan", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "asin", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "acos", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "atan", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "sinh", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "cosh", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "tanh", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "asinh", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "acosh", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "atanh", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "erf", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation
    ], UnaryOps, "step", null);
    return UnaryOps;
}());
export { UnaryOps };
//# sourceMappingURL=unary_ops.js.map