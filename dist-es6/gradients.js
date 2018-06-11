var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from './doc';
import { ENV } from './environment';
import { tidy } from './globals';
import { Tensor, Variable } from './tensor';
import * as util from './util';
var Gradients = (function () {
    function Gradients() {
    }
    Gradients.gradScope = function (nameOrScopeFn, scopeFn) {
        return tidy(nameOrScopeFn, scopeFn, true);
    };
    Gradients.grad = function (f) {
        util.assert(util.isFunction(f), 'The f passed in grad(f) must be a function');
        return function (x, dy) {
            util.assert(x instanceof Tensor, 'The x passed in grad(f)(x) must be a tensor');
            util.assert(dy == null || dy instanceof Tensor, 'The dy passed in grad(f)(x, dy) must be a tensor');
            return tidy(function () {
                var _a = ENV.engine.gradients(function () { return f(x); }, [x], dy), value = _a.value, grads = _a.grads;
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
            util.assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof Tensor; }), 'The args passed in grads(f)(args) must be an array of tensors');
            util.assert(dy == null || dy instanceof Tensor, 'The dy passed in grads(f)(args, dy) must be a tensor');
            return tidy(function () {
                var _a = ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy), value = _a.value, grads = _a.grads;
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
            util.assert(x instanceof Tensor, 'The x passed in valueAndGrad(f)(x) must be a tensor');
            util.assert(dy == null || dy instanceof Tensor, 'The dy passed in valueAndGrad(f)(x, dy) must be a tensor');
            var _a = ENV.engine.gradients(function () { return f(x); }, [x], dy), grads = _a.grads, value = _a.value;
            checkGrads(grads);
            return { grad: grads[0], value: value };
        };
    };
    Gradients.valueAndGrads = function (f) {
        util.assert(util.isFunction(f), 'The f passed in valueAndGrads(f) must be a function');
        return function (args, dy) {
            util.assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof Tensor; }), 'The args passed in valueAndGrads(f)(args) must be array of tensors');
            util.assert(dy == null || dy instanceof Tensor, 'The dy passed in valueAndGrads(f)(args, dy) must be a tensor');
            var res = ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy);
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
            Array.isArray(varList) && varList.every(function (v) { return v instanceof Variable; }), 'The varList passed in variableGrads(f, varList) must be an array ' +
            'of variables');
        if (varList == null) {
            varList = [];
            for (var varName in ENV.engine.registeredVariables) {
                varList.push(ENV.engine.registeredVariables[varName]);
            }
        }
        var originalVarCount = varList.length;
        varList = varList.filter(function (variable) { return variable.trainable; });
        util.assert(varList.length > 0, "variableGrads() expects at least one of the input variables to be " +
            ("trainable, but none of the " + originalVarCount + " variables is ") +
            "trainable.");
        var allowNoGradients = true;
        var _a = ENV.engine.gradients(f, varList, null, allowNoGradients), value = _a.value, grads = _a.grads;
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
        return ENV.engine.customGrad(f);
    };
    __decorate([
        doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "grad", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "grads", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "valueAndGrad", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "valueAndGrads", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "variableGrads", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "customGrad", null);
    return Gradients;
}());
export { Gradients };
function checkGrads(grads) {
    var numNullGradients = grads.filter(function (g) { return g == null; }).length;
    if (numNullGradients > 0) {
        throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
    }
}
//# sourceMappingURL=gradients.js.map