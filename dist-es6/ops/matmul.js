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
var MatmulOps = (function () {
    function MatmulOps() {
    }
    MatmulOps.matMul = function (a, b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        util.assertArgumentsAreTensors({ a: a, b: b }, 'matMul');
        var innerShapeA = transposeA ? a.shape[0] : a.shape[1];
        var innerShapeB = transposeB ? b.shape[1] : b.shape[0];
        util.assert(a.rank === 2 && b.rank === 2, "Error in matMul: inputs must be rank 2, got ranks " + a.rank +
            (" and " + b.rank + "."));
        util.assert(innerShapeA === innerShapeB, "Error in matMul: inner shapes (" + innerShapeA + ") and (" +
            (innerShapeB + ") of Tensors with shapes " + a.shape + " and ") +
            (b.shape + " and transposeA=" + transposeA) +
            (" and transposeB=" + transposeB + " must match."));
        var grad = function (dy) {
            if (!transposeA && !transposeB) {
                return {
                    a: function () { return dy.matMul(b.toFloat(), false, true); },
                    b: function () { return a.toFloat().matMul(dy, true, false); }
                };
            }
            else if (!transposeA && transposeB) {
                return {
                    a: function () { return dy.matMul(b.toFloat(), false, false); },
                    b: function () { return dy.matMul(a.toFloat(), true, false); }
                };
            }
            else if (transposeA && !transposeB) {
                return {
                    a: function () { return b.toFloat().matMul(dy, false, true); },
                    b: function () { return a.toFloat().matMul(dy, false, false); }
                };
            }
            else {
                return {
                    a: function () { return b.toFloat().matMul(dy, true, true); },
                    b: function () { return dy.matMul(a.toFloat(), true, true); }
                };
            }
        };
        return ENV.engine.runKernel(function (backend) { return backend.matMul(a, b, transposeA, transposeB); }, { a: a, b: b }, grad);
    };
    MatmulOps.vectorTimesMatrix = function (v, matrix) {
        util.assert(v.rank === 1, "Error in vectorTimesMatrix: first input must be rank 1, but got " +
            ("rank " + v.rank + "."));
        util.assert(matrix.rank === 2, "Error in vectorTimesMatrix: second input must be rank 2, but got " +
            ("rank " + matrix.rank + "."));
        util.assert(v.size === matrix.shape[0], "Error in vectorTimesMatrix: size of vector (" + v.size + ") " +
            ("must match first dimension of matrix (" + matrix.shape[0] + ")"));
        return v.as2D(1, -1).matMul(matrix).as1D();
    };
    MatmulOps.matrixTimesVector = function (matrix, v) {
        util.assert(v.rank === 1, "Error in matrixTimesVector: second input must rank 1, but got " +
            ("rank " + v.rank + "."));
        util.assert(matrix.rank === 2, "Error in matrixTimesVector: first input must be a rank 2, but got " +
            ("rank " + matrix.rank + "."));
        util.assert(v.size === matrix.shape[1], "Error in matrixTimesVector: size of first rank 1 input " + v.size + " " +
            "must match inner dimension of second rank 2 input, but got " +
            ("shape " + matrix.shape + "."));
        return matrix.matMul(v.as2D(-1, 1)).as1D();
    };
    MatmulOps.dotProduct = function (v1, v2) {
        util.assert(v1.rank === 1 && v2.rank === 1, "Error in dotProduct: inputs must be rank 1, but got ranks " +
            (v1.rank + " and " + v2.rank + "."));
        util.assert(v1.size === v2.size, "Error in dotProduct: size of inputs (" + v1.size + ") and (" +
            (v2.size + ") must match."));
        return v1.as2D(1, -1).matMul(v2.as2D(-1, 1)).asScalar();
    };
    MatmulOps.outerProduct = function (v1, v2) {
        util.assert(v1.rank === 1 && v2.rank === 1, "Error in outerProduct: inputs must be rank 1, but got ranks " +
            (v1.rank + " and " + v2.rank + "."));
        return v1.as2D(-1, 1).matMul(v2.as2D(1, -1));
    };
    MatmulOps.dot = function (t1, t2) {
        util.assert((t1.rank === 1 || t1.rank === 2) && (t2.rank === 1 || t2.rank === 2), "Error in dot: inputs must all be rank 1 or 2, but got ranks " +
            (t1.rank + " and " + t2.rank + "."));
        var t1Inner = (t1.rank === 1 ? t1.size : t1.shape[1]);
        var t2Inner = (t2.rank === 1 ? t2.size : t2.shape[0]);
        util.assert(t1Inner === t2Inner, "Error in dot: inner dimensions of inputs must match, but got " +
            (t1Inner + " and " + t2Inner + "."));
        if (t1.rank === 1 && t2.rank === 1) {
            return t1.as2D(1, -1).matMul(t2.as2D(-1, 1)).asScalar();
        }
        else if (t1.rank === 1 && t2.rank === 2) {
            return t1.as2D(1, -1).matMul(t2.as2D(t2.shape[0], t2.shape[1])).as1D();
        }
        else if (t1.rank === 2 && t2.rank === 1) {
            return t1.matMul(t2.as2D(-1, 1)).as1D();
        }
        else {
            return t1.matMul(t2.as2D(t2.shape[0], t2.shape[1]));
        }
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation
    ], MatmulOps, "matMul", null);
    __decorate([
        operation
    ], MatmulOps, "vectorTimesMatrix", null);
    __decorate([
        operation
    ], MatmulOps, "matrixTimesVector", null);
    __decorate([
        operation
    ], MatmulOps, "dotProduct", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation
    ], MatmulOps, "outerProduct", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation
    ], MatmulOps, "dot", null);
    return MatmulOps;
}());
export { MatmulOps };
//# sourceMappingURL=matmul.js.map